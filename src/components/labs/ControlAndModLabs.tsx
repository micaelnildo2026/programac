import React, { useState } from 'react';
import {
  simulateLoopTrace,
  type FlowControlMode,
  type LoopKind,
} from '../../utils/cSimulator';
import { RotateCcw, StepForward } from 'lucide-react';

export function SequentialTraceLab() {
  const [step, setStep] = useState(0);
  const frames = [
    { line: 'int a = 10, b = 20, temp;', a: '10', b: '20', temp: 'lixo', note: 'Estado inicial antes da troca.' },
    { line: 'temp = a;', a: '10', b: '20', temp: '10', note: 'temp salva uma cópia segura de a (10).' },
    { line: 'a = b;', a: '20', b: '20', temp: '10', note: 'a recebe o valor de b (20); o antigo valor de a está seguro em temp.' },
    { line: 'b = temp;', a: '20', b: '10', temp: '10', note: 'b recebe o valor guardado em temp (10). Troca concluída!' },
  ];
  const curr = frames[step];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-semibold text-blue-700">
          Passo {step + 1} de {frames.length}: {curr.line}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) % frames.length)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <StepForward className="h-3.5 w-3.5" aria-hidden="true" />
            Executar próxima linha
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
        <div className="rounded-lg border border-slate-200 bg-white p-3.5">
          <div className="font-sans text-xs text-slate-500">Variável a</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{curr.a}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3.5">
          <div className="font-sans text-xs text-slate-500">Variável b</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{curr.b}</div>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3.5">
          <div className="font-sans text-xs text-blue-700">Auxiliar temp</div>
          <div className="mt-1 text-xl font-semibold text-blue-900">{curr.temp}</div>
        </div>
      </div>
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
        {curr.note}
      </p>
    </div>
  );
}

export function SelectionBranchLab() {
  const [nota, setNota] = useState(7.5);
  const branches = [
    {
      label: 'if (nota >= 9.0)',
      active: nota >= 9.0,
      result: 'Conceito A — Excelente',
    },
    {
      label: 'else if (nota >= 7.0)',
      active: nota < 9.0 && nota >= 7.0,
      result: 'Conceito B — Aprovado',
    },
    {
      label: 'else if (nota >= 5.0)',
      active: nota < 7.0 && nota >= 5.0,
      result: 'Conceito C — Recuperação',
    },
    {
      label: 'else',
      active: nota < 5.0,
      result: 'Reprovado',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex flex-1 items-center gap-3 text-xs font-medium text-slate-700">
          Ajuste a nota: <span className="font-mono text-sm font-semibold tabular-nums">{nota.toFixed(1)}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={nota}
            onChange={(e) => setNota(Number(e.target.value))}
            className="w-full max-w-xs accent-blue-600"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {branches.map((br) => (
          <div
            key={br.label}
            className={`rounded-lg border p-3.5 transition-colors ${
              br.active
                ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <code className="font-mono text-xs font-semibold">{br.label}</code>
              <span className="text-[11px] font-semibold">
                {br.active ? 'EXECUTADO' : 'Ignorado'}
              </span>
            </div>
            <div className="mt-1.5 text-xs font-medium">{br.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoopEngineLab() {
  const [kind, setKind] = useState<LoopKind>('for');
  const [limit, setLimit] = useState(4);
  const [visibleSteps, setVisibleSteps] = useState(1);

  const trace = simulateLoopTrace(kind, limit, 'normal');
  const shown = trace.slice(0, Math.min(visibleSteps, trace.length));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1">
          {(['for', 'while', 'do-while'] as LoopKind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setKind(k);
                setVisibleSteps(1);
              }}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
                kind === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
          Limite (i &lt;= {limit}):
          <input
            type="range"
            min={0}
            max={6}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setVisibleSteps(1);
            }}
            className="accent-blue-600"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setVisibleSteps((v) => (v < trace.length ? v + 1 : trace.length))
            }
            disabled={visibleSteps >= trace.length}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <StepForward className="h-3.5 w-3.5" aria-hidden="true" />
            Próxima iteração
          </button>
          <button
            type="button"
            onClick={() => setVisibleSteps(1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-label="Reiniciar" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs font-mono tabular-nums">
          <thead className="bg-slate-50 font-sans text-slate-600">
            <tr>
              <th className="px-3 py-2">Iteração</th>
              <th className="px-3 py-2">i</th>
              <th className="px-3 py-2">soma</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {shown.map((s, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2">{s.iteration}</td>
                <td className="px-3 py-2 font-semibold">{s.iValue}</td>
                <td className="px-3 py-2 text-blue-700 font-semibold">{s.sumAfter}</td>
                <td className="px-3 py-2 font-sans text-slate-700">{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FlowControlLab() {
  const [flowMode, setFlowMode] = useState<FlowControlMode>('continue-on-3');
  const trace = simulateLoopTrace('for', 5, flowMode);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setFlowMode('normal')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
            flowMode === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          Sem desvio
        </button>
        <button
          type="button"
          onClick={() => setFlowMode('continue-on-3')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
            flowMode === 'continue-on-3' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          continue quando i == 3
        </button>
        <button
          type="button"
          onClick={() => setFlowMode('break-on-3')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
            flowMode === 'break-on-3' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          break quando i == 3
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        {trace.map((step, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-3 font-mono text-xs tabular-nums ${
              step.action === 'break'
                ? 'border-rose-300 bg-rose-50 text-rose-900'
                : step.action === 'skip'
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : step.action === 'exit'
                ? 'border-slate-200 bg-slate-100 text-slate-600'
                : 'border-emerald-300 bg-emerald-50 text-emerald-950'
            }`}
          >
            <div className="font-semibold">i = {step.iValue}</div>
            <div className="mt-1 font-sans text-[11px]">
              {step.action === 'execute' && `Somou -> ${step.sumAfter}`}
              {step.action === 'skip' && 'continue (pulou)'}
              {step.action === 'break' && 'break (parou)'}
              {step.action === 'exit' && 'Fim do laço'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CallStackLab() {
  const [step, setStep] = useState(0);
  const stackSnapshots = [
    {
      desc: 'main() inicia e chama fatorial(3).',
      frames: [{ fn: 'main()', detail: 'aguardando fatorial(3)' }],
    },
    {
      desc: 'Empilha fatorial(3): como 3 > 1, precisa chamar fatorial(2).',
      frames: [
        { fn: 'main()', detail: 'aguardando fatorial(3)' },
        { fn: 'fatorial(n=3)', detail: '3 * fatorial(2)' },
      ],
    },
    {
      desc: 'Empilha fatorial(2): como 2 > 1, precisa chamar fatorial(1).',
      frames: [
        { fn: 'main()', detail: 'aguardando fatorial(3)' },
        { fn: 'fatorial(n=3)', detail: '3 * fatorial(2)' },
        { fn: 'fatorial(n=2)', detail: '2 * fatorial(1)' },
      ],
    },
    {
      desc: 'Caso base atingido em fatorial(1)! Retorna 1 e começa a desempilhar.',
      frames: [
        { fn: 'main()', detail: 'aguardando fatorial(3)' },
        { fn: 'fatorial(n=3)', detail: '3 * fatorial(2)' },
        { fn: 'fatorial(n=2)', detail: '2 * fatorial(1)' },
        { fn: 'fatorial(n=1)', detail: 'return 1 (caso base)' },
      ],
    },
    {
      desc: 'fatorial(2) recebe 1, calcula 2 * 1 = 2 e retorna.',
      frames: [
        { fn: 'main()', detail: 'aguardando fatorial(3)' },
        { fn: 'fatorial(n=3)', detail: '3 * 2 = 6' },
        { fn: 'fatorial(n=2)', detail: 'return 2' },
      ],
    },
    {
      desc: 'fatorial(3) retorna 6 para main(). Pilha limpa!',
      frames: [{ fn: 'main()', detail: 'recebeu resultado = 6' }],
    },
  ];

  const curr = stackSnapshots[step];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700">
          Passo {step + 1} de {stackSnapshots.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) % stackSnapshots.length)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <StepForward className="h-3.5 w-3.5" aria-hidden="true" />
            Avançar Call Stack
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
        {curr.frames.map((frame, idx) => {
          const isTop = idx === curr.frames.length - 1;
          return (
            <div
              key={frame.fn}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 font-mono text-xs ${
                isTop
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <span className="font-semibold">{frame.fn}</span>
              <span className={isTop ? 'text-blue-100' : 'text-slate-500'}>
                {frame.detail}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-700">{curr.desc}</p>
    </div>
  );
}

export function ValueVsRefLab() {
  const [mainVal, setMainVal] = useState(10);
  const [lastCall, setLastCall] = useState<'none' | 'val' | 'ref'>('none');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLastCall('val')}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          Chamar dobrarValor(n)
        </button>
        <button
          type="button"
          onClick={() => {
            setMainVal((v) => v * 2);
            setLastCall('ref');
          }}
          className="rounded-lg bg-blue-600 px-3.5 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-700"
        >
          Chamar dobrarRef(&amp;n)
        </button>
        <button
          type="button"
          onClick={() => {
            setMainVal(10);
            setLastCall('none');
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Resetar n = 10
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">
            Quadro de main() · Endereço 0x1004
          </div>
          <div className="mt-2 font-mono text-xl font-semibold tabular-nums text-slate-900">
            n = {mainVal}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-500">
            Quadro da função chamada
          </div>
          <div className="mt-2 font-mono text-sm text-slate-800">
            {lastCall === 'none' && 'Aguardando chamada...'}
            {lastCall === 'val' &&
              `Cópia local x virou ${mainVal * 2}, mas n em main() continuou ${mainVal}!`}
            {lastCall === 'ref' &&
              `Ponteiro *x acessou 0x1004 diretamente e dobrou n para ${mainVal}!`}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScopeLifetimeLab() {
  const [calls, setCalls] = useState(0);
  const autoValue = calls === 0 ? 0 : 1;
  const staticValue = calls;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCalls((c) => c + 1)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-700"
        >
          Chamar contar() (Total: {calls}x)
        </button>
        <button
          type="button"
          onClick={() => setCalls(0)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Reiniciar programa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Variável local (auto)</div>
          <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-slate-900">
            normal = {autoValue}
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Recriada em 0 a cada entrada na função e destruída no retorno.
          </p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="text-xs text-blue-700">Variável local static</div>
          <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-blue-950">
            fixa = {staticValue}
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Inicializada uma única vez; sobrevive na memória estática entre chamadas.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CustomLibsLab() {
  const [activeFile, setActiveFile] = useState<'header' | 'impl' | 'main'>('header');
  const files = {
    header: {
      title: 'matematica.h (Contrato / Interface)',
      code: `#ifndef MATEMATICA_H
#define MATEMATICA_H

// Apenas protótipos e constantes públicas
int quadrado(int x);
int cubo(int x);

#endif`,
      note: 'Inclui guardas #ifndef/#define para impedir inclusão duplicada. Não coloca corpo de funções aqui.',
    },
    impl: {
      title: 'matematica.c (Implementação)',
      code: `#include "matematica.h"

int quadrado(int x) {
    return x * x;
}

int cubo(int x) {
    return x * x * x;
}`,
      note: 'Compilado separadamente em matematica.o; esconde detalhes internos de quem só usa o .h.',
    },
    main: {
      title: 'main.c (Consumidor)',
      code: `#include <stdio.h>
#include "matematica.h"

int main(void) {
    printf("6^2 = %d\\n", quadrado(6));
    return 0;
}`,
      note: 'Ligado na compilação final via: gcc main.c matematica.c -o app',
    },
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveFile('header')}
          className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
            activeFile === 'header' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          matematica.h
        </button>
        <button
          type="button"
          onClick={() => setActiveFile('impl')}
          className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
            activeFile === 'impl' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          matematica.c
        </button>
        <button
          type="button"
          onClick={() => setActiveFile('main')}
          className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
            activeFile === 'main' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          main.c
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-100">
        <div className="mb-2 font-sans text-xs font-semibold text-blue-300">
          {files[activeFile].title}
        </div>
        <pre className="overflow-x-auto leading-relaxed">{files[activeFile].code}</pre>
      </div>
      <p className="text-xs text-slate-600">{files[activeFile].note}</p>
    </div>
  );
}
