import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { interpretC } from './cInterpreter.ts';
import { verifyChallengeRun } from './cChallengeEval.ts';
import { QUIZ_QUESTIONS } from '../data/memorizeAndQuiz.ts';

describe('cInterpreter - Quiz Challenges (all 16 solutions)', () => {
  for (const q of QUIZ_QUESTIONS) {
    it(`executes ${q.id} (${q.difficulty}) and matches expectedOutput "${q.expectedOutput}"`, () => {
      const res = interpretC(q.solutionCode, q.testStdin ?? '');
      assert.equal(res.compiled, true, `Expected compilation success for ${q.id}, got stderr: ${res.stderr}`);
      assert.equal(res.exitCode, 0, `Expected exitCode 0 for ${q.id}, got ${res.exitCode} (stderr: ${res.stderr})`);
      const verification = verifyChallengeRun(res, q.expectedOutput);
      assert.equal(
        verification.passed,
        true,
        `Expected "${q.expectedOutput}" for ${q.id}, got "${res.stdout}" (${verification.details})`
      );
    });
  }
});

describe('cInterpreter - Playground Templates', () => {
  it('runs Hello World template', () => {
    const code = `#include <stdio.h>

int main(void) {
    printf("Ola, Estudio C!\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Contagem: %d\\n", i);
    }
    return 0;
}`;
    const res = interpretC(code, '');
    assert.equal(res.compiled, true);
    assert.equal(res.exitCode, 0);
    assert.equal(
      res.stdout,
      'Ola, Estudio C!\nContagem: 1\nContagem: 2\nContagem: 3\nContagem: 4\nContagem: 5\n'
    );
  });

  it('runs Entrada (scanf) template with stdin "15 24"', () => {
    const code = `#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        printf("Soma = %d | Media = %.2f\\n", a + b, (a + b) / 2.0);
    } else {
        printf("Forneca dois inteiros no campo de entrada (stdin).\\n");
    }
    return 0;
}`;
    const res = interpretC(code, '15 24');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, 'Soma = 39 | Media = 19.50\n');
  });

  it('runs Ponteiros e Swap template', () => {
    const code = `#include <stdio.h>

void trocar(int *x, int *y) {
    int tmp = *x;
    *x = *y;
    *y = tmp;
}

int main(void) {
    int a = 10, b = 99;
    printf("Antes: a=%d, b=%d\\n", a, b);
    trocar(&a, &b);
    printf("Depois: a=%d, b=%d\\n", a, b);
    return 0;
}`;
    const res = interpretC(code, '');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, 'Antes: a=10, b=99\nDepois: a=99, b=10\n');
  });

  it('runs Recursao template', () => {
    const code = `#include <stdio.h>

long long fatorial(int n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}

int main(void) {
    for (int i = 0; i <= 6; i++) {
        printf("%d! = %lld\\n", i, fatorial(i));
    }
    return 0;
}`;
    const res = interpretC(code, '');
    assert.equal(res.compiled, true);
    assert.equal(
      res.stdout,
      '0! = 1\n1! = 1\n2! = 2\n3! = 6\n4! = 24\n5! = 120\n6! = 720\n'
    );
  });

  it('runs Heap (malloc/free) template', () => {
    const code = `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *v = (int*) malloc((size_t)n * sizeof(int));
    if (!v) return 1;

    for (int i = 0; i < n; i++) {
        *(v + i) = (i + 1) * 10;
        printf("v[%d] = %d (endereco %p)\\n", i, v[i], (void*)(v + i));
    }

    free(v);
    v = NULL;
    return 0;
}`;
    const res = interpretC(code, '');
    assert.equal(res.compiled, true);
    assert.equal(res.exitCode, 0);
    assert.match(res.stdout, /v\[0\] = 10 \(endereco 0x/);
    assert.match(res.stdout, /v\[4\] = 50 \(endereco 0x/);
  });
});

describe('cInterpreter - Edge Cases & Errors', () => {
  it('does not double-evaluate *p++ in non-assignment expressions', () => {
    const code = `#include <stdio.h>
int main(void) {
    int v[3] = {10, 20, 30};
    int *p = v;
    int a = *p++;
    int b = *p++;
    printf("%d %d %d\\n", a, b, *p);
    return 0;
}`;
    const res = interpretC(code, '');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, '10 20 30\n');
  });

  it('short-circuits ternary operator cleanly without dividing by zero', () => {
    const code = `#include <stdio.h>
int main(void) {
    int n = 0;
    printf("%d %d\\n", n > 0 ? 10 / n : -1, n == 0 ? 42 : 10 / n);
    return 0;
}`;
    const res = interpretC(code, '');
    assert.equal(res.compiled, true);
    assert.equal(res.stdout, '-1 42\n');
  });

  it('reports compile error on missing semicolon', () => {
    const res = interpretC('int main(void) { int x = 5 return 0; }', '');
    assert.equal(res.compiled, false);
    assert.match(res.stderr, /expected ';'/);
  });

  it('reports compile error on undeclared variable', () => {
    const res = interpretC('int main(void) { return y; }', '');
    assert.equal(res.compiled, false);
    assert.match(res.stderr, /undeclared/);
  });

  it('reports runtime error on division by zero', () => {
    const res = interpretC('#include <stdio.h>\nint main(void) { int a = 5, b = 0; printf("%d", a / b); return 0; }', '');
    assert.equal(res.compiled, true);
    assert.equal(res.exitCode, 1);
    assert.match(res.stderr, /zero/i);
  });

  it('catches infinite loops with timeout flag', () => {
    const res = interpretC('int main(void) { while (1) {} return 0; }', '');
    assert.equal(res.compiled, true);
    assert.equal(res.timedOut, true);
    assert.equal(res.exitCode, null);
  });
});
