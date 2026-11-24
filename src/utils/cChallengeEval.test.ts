import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOutput, verifyChallengeRun } from './cChallengeEval';

test('normalizeOutput trims trailing spaces per line and normalizes CRLF', () => {
  assert.equal(normalizeOutput('3 7 8  \r\n  \r\n'), '3 7 8');
  assert.equal(normalizeOutput('10\n20 \n'), '10\n20');
});

test('verifyChallengeRun reports compilation failure, timeout, mismatch, and exact pass', () => {
  const compileFail = verifyChallengeRun(
    {
      compiled: false,
      stdout: '',
      stderr: 'error: expected ;',
      exitCode: 1,
      timedOut: false,
      durationMs: 40,
    },
    '42'
  );
  assert.equal(compileFail.passed, false);
  assert.equal(compileFail.statusLabel, 'Erro de compilação');

  const timeout = verifyChallengeRun(
    {
      compiled: true,
      stdout: '',
      stderr: '',
      exitCode: null,
      timedOut: true,
      durationMs: 2500,
    },
    '42'
  );
  assert.equal(timeout.passed, false);
  assert.equal(timeout.statusLabel, 'Tempo limite excedido');

  const mismatch = verifyChallengeRun(
    {
      compiled: true,
      stdout: '41\n',
      stderr: '',
      exitCode: 0,
      timedOut: false,
      durationMs: 12,
    },
    '42'
  );
  assert.equal(mismatch.passed, false);
  assert.equal(mismatch.statusLabel, 'Saída diferente do esperado');

  const exactPass = verifyChallengeRun(
    {
      compiled: true,
      stdout: '42  \n',
      stderr: '',
      exitCode: 0,
      timedOut: false,
      durationMs: 10,
    },
    '42'
  );
  assert.equal(exactPass.passed, true);
  assert.equal(exactPass.statusLabel, 'Correto e rodando');
});
