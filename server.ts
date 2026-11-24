import express from 'express';
import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const MAX_CODE_BYTES = 32 * 1024;
const MAX_STDIN_BYTES = 4 * 1024;
const MAX_OUTPUT_BYTES = 32 * 1024;
const COMPILE_TIMEOUT_MS = 5000;
const RUN_TIMEOUT_MS = 2500;

interface CompileRunPayload {
  code?: unknown;
  stdin?: unknown;
}

class CompilerUnavailableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

async function compileAndRunC(code: string, stdinInput: string) {
  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'estudio-c-'));
  const sourcePath = path.resolve(workDir, 'main.c');
  const binaryPath = path.resolve(workDir, 'main');

  // Ensure paths stay strictly inside the isolated temp directory
  if (
    !sourcePath.startsWith(workDir + path.sep) ||
    !binaryPath.startsWith(workDir + path.sep)
  ) {
    throw new Error('Invalid workspace path');
  }

  const startedAt = Date.now();

  try {
    await fs.writeFile(sourcePath, code, 'utf8');

    let compilerWarnings = '';
    try {
      const { stderr } = await execFileAsync(
        'gcc',
        ['-std=c11', '-O2', '-Wall', '-Wextra', sourcePath, '-o', binaryPath, '-lm'],
        {
          cwd: workDir,
          timeout: COMPILE_TIMEOUT_MS,
          maxBuffer: MAX_OUTPUT_BYTES,
        }
      );
      compilerWarnings = stderr ? String(stderr) : '';
    } catch (err: unknown) {
      const compileErr = err as {
        code?: string;
        stderr?: string;
        stdout?: string;
        message?: string;
      };
      if (compileErr.code === 'ENOENT') {
        throw new CompilerUnavailableError('GCC_UNAVAILABLE');
      }
      const rawStderr =
        compileErr.stderr || compileErr.stdout || compileErr.message || 'Erro de compilação';
      const cleanedStderr = String(rawStderr).replaceAll(sourcePath, 'main.c');
      return {
        compiled: false,
        stdout: '',
        stderr: cleanedStderr.slice(0, MAX_OUTPUT_BYTES),
        exitCode: 1,
        timedOut: false,
        durationMs: Date.now() - startedAt,
      };
    }

    const runResult = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number | null;
      timedOut: boolean;
    }>((resolve) => {
      const child = spawn(binaryPath, [], {
        cwd: workDir,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let settled = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, RUN_TIMEOUT_MS);

      child.stdout.on('data', (chunk: Buffer) => {
        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += chunk.toString('utf8');
          if (stdout.length > MAX_OUTPUT_BYTES) {
            stdout = stdout.slice(0, MAX_OUTPUT_BYTES) + '\n[saída truncada]';
          }
        }
      });

      child.stderr.on('data', (chunk: Buffer) => {
        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += chunk.toString('utf8');
        }
      });

      child.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          stdout,
          stderr: stderr || err.message,
          exitCode: 1,
          timedOut,
        });
      });

      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({
          stdout,
          stderr,
          exitCode: code,
          timedOut,
        });
      });

      if (stdinInput.length > 0) {
        child.stdin.write(stdinInput);
      }
      child.stdin.end();
    });

    const combinedStderr = [
      compilerWarnings.replaceAll(sourcePath, 'main.c').trim(),
      runResult.stderr.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    return {
      compiled: true,
      stdout: runResult.stdout,
      stderr: combinedStderr,
      exitCode: runResult.exitCode,
      timedOut: runResult.timedOut,
      durationMs: Date.now() - startedAt,
    };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/compile-run', async (req, res) => {
    const body = (req.body ?? {}) as CompileRunPayload;
    if (typeof body.code !== 'string' || body.code.trim().length === 0) {
      res.status(400).json({ error: 'Código C inválido ou vazio.' });
      return;
    }
    if (Buffer.byteLength(body.code, 'utf8') > MAX_CODE_BYTES) {
      res.status(400).json({ error: 'O código excede o limite de 32 KB.' });
      return;
    }

    const stdinInput = typeof body.stdin === 'string' ? body.stdin : '';
    if (Buffer.byteLength(stdinInput, 'utf8') > MAX_STDIN_BYTES) {
      res.status(400).json({ error: 'A entrada padrão excede o limite de 4 KB.' });
      return;
    }

    try {
      const result = await compileAndRunC(body.code, stdinInput);
      res.json(result);
    } catch (err) {
      if (err instanceof CompilerUnavailableError) {
        res.status(503).json({ error: 'GCC_UNAVAILABLE' });
        return;
      }
      res.status(500).json({
        error: 'Não foi possível executar o compilador C no momento.',
      });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Estudio C server running on http://0.0.0.0:${port}`);
  });
}

startServer();
