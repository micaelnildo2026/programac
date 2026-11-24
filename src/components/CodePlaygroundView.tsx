import React, { useEffect, useState } from 'react';
import { runCCode } from '../utils/compileClient';
import type { CompileRunResponse } from '../utils/cChallengeEval';
import { Play, RotateCcw, Terminal } from 'lucide-react';

interface CTemplate {
  id: string;
  label: string;
  code: string;
  stdin: string;
}

const PLAYGROUND_TEMPLATES: CTemplate[] = [
  {
    id: 'hello',
    label: 'Olá Mundo',
    code: `#include <stdio.h>

int main(void) {
    printf("Ola, Estudio C!\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Contagem: %d\\n", i);
    }
    return 0;
}`,
    stdin: '',
  },
  {
    id: 'scanf',
    label: 'Entrada (scanf)',
    code: `#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) == 2) {
        printf("Soma = %d | Media = %.2f\\n", a + b, (a + b) / 2.0);
    } else {
        printf("Forneca dois inteiros no campo de entrada (stdin).\\n");
    }
    return 0;
}`,
    stdin: '15 24',
  },
  {
    id: 'pointers',
    label: 'Ponteiros e Swap',
    code: `#include <stdio.h>

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
}`,
    stdin: '',
  },
  {
    id: 'recursion',
    label: 'Recursão',
    code: `#include <stdio.h>

long long fatorial(int n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}

int main(void) {
    for (int i = 0; i <= 6; i++) {
        printf("%d! = %lld\\n", i, fatorial(i));
    }
    return 0;
}`,
    stdin: '',
  },
  {
    id: 'heap',
    label: 'Heap (malloc/free)',
    code: `#include <stdio.h>
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
}`,
    stdin: '',
  },
];

const STORAGE_PLAYGROUND_CODE = 'estudio_c_playground_code_v1';
const STORAGE_PLAYGROUND_STDIN = 'estudio_c_playground_stdin_v1';

export function CodePlaygroundView() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('hello');
  const [code, setCode] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_PLAYGROUND_CODE) || PLAYGROUND_TEMPLATES[0].code;
    } catch {
      return PLAYGROUND_TEMPLATES[0].code;
    }
  });
  const [stdinText, setStdinText] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_PLAYGROUND_STDIN) || PLAYGROUND_TEMPLATES[0].stdin;
    } catch {
      return PLAYGROUND_TEMPLATES[0].stdin;
    }
  });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CompileRunResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAYGROUND_CODE, code);
    } catch {
      // Ignore storage errors
    }
  }, [code]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAYGROUND_STDIN, stdinText);
    } catch {
      // Ignore storage errors
    }
  }, [stdinText]);

  const handleRun = async () => {
    setRunning(true);
    setApiError(null);
    try {
      const res = await runCCode(code, stdinText);
      setResult(res);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro ao executar código C.');
    } finally {
      setRunning(false);
    }
  };

  const handleTemplateSelect = (tpl: CTemplate) => {
    setSelectedTemplateId(tpl.id);
    setCode(tpl.code);
    setStdinText(tpl.stdin);
    setResult(null);
    setApiError(null);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.slice(0, start) + '    ' + code.slice(end);
      setCode(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <section
      aria-label="Editor e compilador C online"
      className="mx-auto max-w-6xl space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Laboratório Livre de Código C
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Escreva, compile com GCC (padrão C11 com avisos ativos) e teste entradas via stdin em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const tpl =
                PLAYGROUND_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
                PLAYGROUND_TEMPLATES[0];
              setCode(tpl.code);
              setStdinText(tpl.stdin);
              setResult(null);
              setApiError(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restaurar modelo
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            {running ? 'Compilando...' : 'Compilar e executar'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1">
        {PLAYGROUND_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => handleTemplateSelect(tpl)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTemplateId === tpl.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tpl.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
            <span className="font-mono font-semibold text-slate-800">main.c</span>
            <span className="tabular-nums">
              {lineCount} {lineCount === 1 ? 'linha' : 'linhas'} · Ctrl+Enter para executar
            </span>
          </div>
          <label htmlFor="c-playground-editor" className="sr-only">
            Editor de código em linguagem C
          </label>
          <textarea
            id="c-playground-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            rows={16}
            className="w-full flex-1 resize-y bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label
              htmlFor="c-playground-stdin"
              className="block text-xs font-semibold text-slate-700"
            >
              Entrada padrão (stdin) para scanf / fgets
            </label>
            <textarea
              id="c-playground-stdin"
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              rows={3}
              placeholder="Ex: 15 24"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 font-mono text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div
            aria-live="polite"
            className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Terminal className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                Terminal de saída
              </span>
              {result && (
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    result.compiled && result.exitCode === 0 && !result.timedOut
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {result.compiled
                    ? result.timedOut
                      ? 'Tempo excedido'
                      : `Exit ${result.exitCode} · ${result.durationMs}ms`
                    : `Erro de compilação · ${result.durationMs}ms`}
                </span>
              )}
            </div>

            <div className="mt-3 flex-1 space-y-3 font-mono text-xs">
              {apiError && (
                <div className="rounded bg-rose-950/70 p-3 text-rose-200">
                  {apiError}
                </div>
              )}

              {!result && !apiError && (
                <p className="font-sans text-xs text-slate-400">
                  Clique em &quot;Compilar e executar&quot; para rodar seu código no compilador GCC.
                </p>
              )}

              {result && result.stderr && (
                <div className="rounded border border-amber-800/60 bg-amber-950/40 p-3 text-amber-200 whitespace-pre-wrap">
                  {result.stderr}
                </div>
              )}

              {result && result.compiled && (
                <div>
                  <div className="mb-1 font-sans text-[11px] text-slate-400">
                    stdout:
                  </div>
                  <pre className="whitespace-pre-wrap text-emerald-300 leading-relaxed">
                    {result.stdout || '(nenhuma saída impressa)'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
