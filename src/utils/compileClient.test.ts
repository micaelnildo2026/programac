import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { runCCode } from './compileClient.ts';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('compileClient runCCode', () => {
  it('returns clear compile error when code is empty', async () => {
    const res = await runCCode('   \n  ', '');
    assert.equal(res.compiled, false);
    assert.match(res.stderr, /digite um código/i);
  });

  it('uses backend JSON response when /api/compile-run succeeds', async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          compiled: true,
          stdout: '42 2A\n',
          stderr: '',
          exitCode: 0,
          timedOut: false,
          durationMs: 18,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )) as typeof fetch;

    const res = await runCCode('#include <stdio.h>\nint main(void){printf("42 2A\\n");return 0;}');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, '42 2A\n');
    assert.equal(res.durationMs, 18);
  });

  it('falls back to browser C runtime when backend returns HTML 404', async () => {
    globalThis.fetch = (async () =>
      new Response('<!doctype html><html><body>Not Found</body></html>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      })) as typeof fetch;

    const res = await runCCode('#include <stdio.h>\nint main(void){printf("42 2A\\n");return 0;}');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, '42 2A\n');
    assert.equal(res.exitCode, 0);
  });

  it('falls back to browser C runtime when backend returns 503 GCC_UNAVAILABLE', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: 'GCC_UNAVAILABLE' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch;

    const res = await runCCode('#include <stdio.h>\nint main(void){int a,b; scanf("%d %d", &a, &b); printf("%d\\n", a+b); return 0;}', '7 8');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, '15\n');
  });

  it('falls back to browser C runtime when fetch throws a network error', async () => {
    globalThis.fetch = (async () => {
      throw new TypeError('Failed to fetch');
    }) as typeof fetch;

    const res = await runCCode('#include <stdio.h>\nint main(void){printf("OK\\n");return 0;}');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, 'OK\n');
  });

  it('surfaces 400 validation error message from backend', async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: 'O código excede o limite de 32 KB.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch;

    await assert.rejects(
      () => runCCode('#include <stdio.h>\nint main(void){return 0;}'),
      /limite de 32 KB/
    );
  });
});
