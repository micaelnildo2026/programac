import type { CompileRunResponse } from './cChallengeEval';

export async function runCCode(
  code: string,
  stdin: string = ''
): Promise<CompileRunResponse> {
  const response = await fetch('/api/compile-run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, stdin }),
  });

  const data = (await response.json()) as CompileRunResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'Erro ao compilar o código C.');
  }
  return data;
}
