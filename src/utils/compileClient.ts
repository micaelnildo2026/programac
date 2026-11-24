import type { CompileRunResponse } from './cChallengeEval';
import { interpretC } from './cInterpreter';

const API_TIMEOUT_MS = 8000;

export async function runCCode(
  code: string,
  stdin: string = ''
): Promise<CompileRunResponse> {
  if (typeof code !== 'string' || code.trim().length === 0) {
    return {
      compiled: false,
      stdout: '',
      stderr: 'main.c:1: error: digite um código em C antes de compilar.',
      exitCode: 1,
      timedOut: false,
      durationMs: 0,
    };
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), API_TIMEOUT_MS)
    : null;

  try {
    const response = await fetch('/api/compile-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin }),
      signal: controller?.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      // Static preview or proxy returned HTML (404/502) -> use browser C11 runtime
      return interpretC(code, stdin);
    }

    let data: (Partial<CompileRunResponse> & { error?: string }) | null = null;
    try {
      data = (await response.json()) as Partial<CompileRunResponse> & { error?: string };
    } catch {
      return interpretC(code, stdin);
    }

    if (response.ok && data && typeof data.compiled === 'boolean') {
      return {
        compiled: data.compiled,
        stdout: data.stdout ?? '',
        stderr: data.stderr ?? '',
        exitCode: data.exitCode ?? null,
        timedOut: Boolean(data.timedOut),
        durationMs: typeof data.durationMs === 'number' ? data.durationMs : 0,
      };
    }

    if (response.status >= 400 && response.status < 500 && response.status !== 404 && response.status !== 405) {
      throw new Error(data?.error || 'Erro ao validar o código C.');
    }

    // 404/405/5xx (e.g. GCC unavailable on production container) -> fallback seamlessly
    return interpretC(code, stdin);
  } catch (err) {
    if (err instanceof Error && err.message && !isTransportFailure(err)) {
      throw err;
    }
    return interpretC(code, stdin);
  } finally {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  }
}

function isTransportFailure(err: Error): boolean {
  if (err.name === 'AbortError' || err.name === 'TypeError') return true;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('failed') ||
    msg.includes('abort') ||
    msg.includes('json')
  );
}
