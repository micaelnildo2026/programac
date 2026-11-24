import React, { useState } from 'react';
import { formatPrintfPreview } from '../../utils/cSimulator';

export function CAnatomyLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    {
      name: '1. Pré-processamento',
      cmd: 'gcc -E main.c -o main.i',
      desc: 'Expande diretivas #include <stdio.h> (copia protótipos) e substitui macros #define. Remove comentários.',
    },
    {
      name: '2. Compilação',
      cmd: 'gcc -S main.i -o main.s',
      desc: 'Verifica sintaxe/tipos e traduz o código C para linguagem Assembly específica do processador.',
    },
    {
      name: '3. Montagem (Assembler)',
      cmd: 'gcc -c main.s -o main.o',
      desc: 'Converte o Assembly em código de máquina binário (arquivo objeto .o ainda sem ligar printf).',
    },
    {
      name: '4. Linkedição (Linker)',
      cmd: 'gcc main.o -o programa',
      desc: 'Une main.o com a biblioteca padrão C (onde printf vive) para gerar o executável final.',
    },
  ];

  const [selectedPart, setSelectedPart] = useState<'include' | 'main' | 'body' | 'return'>('include');
  const partInfo = {
    include: '#include <stdio.h> traz as declarações de printf e scanf da biblioteca padrão.',
    main: 'int main(void) é a função obrigatória por onde o sistema operacional inicia o programa.',
    body: 'printf(...) envia texto formatado para stdout; cada instrução termina com ponto e vírgula (;).',
    return: 'return 0; sinaliza ao sistema operacional que a execução terminou sem erros.',
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-200">
          <div className="mb-2 font-sans text-xs font-medium text-slate-400">
            Clique em uma linha para inspecionar sua função:
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedPart('include')}
              className={`block w-full rounded px-2 py-1 text-left ${
                selectedPart === 'include' ? 'bg-blue-600/40 text-white' : 'hover:bg-slate-800'
              }`}
            >
              #include &lt;stdio.h&gt;
            </button>
            <button
              type="button"
              onClick={() => setSelectedPart('main')}
              className={`block w-full rounded px-2 py-1 text-left ${
                selectedPart === 'main' ? 'bg-blue-600/40 text-white' : 'hover:bg-slate-800'
              }`}
            >
              int main(void) &#123;
            </button>
            <button
              type="button"
              onClick={() => setSelectedPart('body')}
              className={`block w-full rounded px-2 py-1 pl-6 text-left ${
                selectedPart === 'body' ? 'bg-blue-600/40 text-white' : 'hover:bg-slate-800'
              }`}
            >
              printf(&quot;Ola, C!\\n&quot;);
            </button>
            <button
              type="button"
              onClick={() => setSelectedPart('return')}
              className={`block w-full rounded px-2 py-1 pl-6 text-left ${
                selectedPart === 'return' ? 'bg-blue-600/40 text-white' : 'hover:bg-slate-800'
              }`}
            >
              return 0;
            </button>
            <div className="px-2 py-1 text-slate-400">&#125;</div>
          </div>
          <div className="mt-3 rounded bg-slate-800 px-3 py-2 font-sans text-xs text-slate-200">
            {partInfo[selectedPart]}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-600">
            Pipeline de Compilação GCC
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {stages.map((st, idx) => (
              <button
                key={st.name}
                type="button"
                onClick={() => setStage(idx)}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  stage === idx
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="font-mono text-xs font-semibold text-blue-700">
              {stages[stage].cmd}
            </div>
            <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">
              {stages[stage].desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SizeofTypesLab() {
  const types = [
    {
      name: 'char',
      bytes: 1,
      range: '-128 a 127 (ou 0 a 255 unsigned)',
      spec: '%c / %d',
      sample: "'A' (65)",
    },
    {
      name: 'short',
      bytes: 2,
      range: '-32.768 a 32.767',
      spec: '%hd',
      sample: '1024',
    },
    {
      name: 'int',
      bytes: 4,
      range: '-2.147.483.648 a 2.147.483.647',
      spec: '%d',
      sample: '2026',
    },
    {
      name: 'float',
      bytes: 4,
      range: '~6-7 dígitos de precisão decimal',
      spec: '%f',
      sample: '3.14159f',
    },
    {
      name: 'double',
      bytes: 8,
      range: '~15 dígitos de precisão decimal',
      spec: '%lf',
      sample: '3.141592653589',
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState(2);
  const active = types[selectedIdx];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
        {types.map((t, idx) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-md px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
              selectedIdx === idx
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="font-mono text-sm font-semibold text-slate-900">
            sizeof({active.name}) = {active.bytes}{' '}
            {active.bytes === 1 ? 'byte' : 'bytes'} ({active.bytes * 8} bits)
          </div>
          <div className="font-mono text-xs text-blue-700">
            Especificador: {active.spec}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: active.bytes }).map((_, byteIdx) => (
            <div
              key={byteIdx}
              className="flex h-14 w-16 flex-col items-center justify-center rounded-md border border-blue-300 bg-white font-mono text-xs"
            >
              <span className="font-semibold text-blue-700">Byte {byteIdx}</span>
              <span className="text-[10px] text-slate-400">8 bits</span>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-700 sm:grid-cols-2">
          <div className="rounded border border-slate-200 bg-white px-3 py-2">
            Faixa / Precisão: <span className="font-medium">{active.range}</span>
          </div>
          <div className="rounded border border-slate-200 bg-white px-3 py-2">
            Exemplo: <code className="font-mono">{active.sample}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OperatorsPrecedenceLab() {
  const [xInitial, setXInitial] = useState(10);
  const [mode, setMode] = useState<'post' | 'pre'>('post');
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const yValue = step === 0 ? '?' : mode === 'post' ? xInitial : xInitial + 1;
  const xCurrent =
    step === 0
      ? xInitial
      : mode === 'post'
      ? step === 1
        ? xInitial
        : xInitial + 1
      : xInitial + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('post');
              setStep(0);
            }}
            className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
              mode === 'post' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            y = x++; (Pós-incremento)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pre');
              setStep(0);
            }}
            className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
              mode === 'pre' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            y = ++x; (Pré-incremento)
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
          x inicial: <span className="font-mono tabular-nums">{xInitial}</span>
          <input
            type="range"
            min={1}
            max={20}
            value={xInitial}
            onChange={(e) => {
              setXInitial(Number(e.target.value));
              setStep(0);
            }}
            className="accent-blue-600"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Variável x</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-slate-900">
            {xCurrent}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Variável y</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-blue-700">
            {yValue}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <button
            type="button"
            onClick={() => setStep((s) => (s === 2 ? 0 : ((s + 1) as 0 | 1 | 2)))}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            {step === 0
              ? 'Passo 1: Avaliar expressão'
              : step === 1
              ? 'Passo 2: Concluir comando'
              : 'Reiniciar'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
        {step === 0 && `Estado inicial: x vale ${xInitial} e y ainda não recebeu valor.`}
        {step === 1 &&
          (mode === 'post'
            ? `Pós-incremento (x++): primeiro y recebe o valor atual de x (${xInitial}).`
            : `Pré-incremento (++x): primeiro x é incrementado para ${xInitial + 1}, e esse novo valor é entregue.`)}
        {step === 2 &&
          (mode === 'post'
            ? `Comando concluído: depois de entregar ${xInitial} para y, x foi incrementado para ${xInitial + 1}.`
            : `Comando concluído: tanto x quanto y terminam valendo ${xInitial + 1}.`)}
      </div>
    </div>
  );
}

export function PrintfScanfLab() {
  const [specifier, setSpecifier] = useState('%.2f');
  const [rawInput, setRawInput] = useState('3.14159');

  const specs = ['%d', '%05d', '%X', '%.2f', '%f', '%c', '%s'];
  const preview = formatPrintfPreview(specifier, rawInput);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {specs.map((sp) => (
          <button
            key={sp}
            type="button"
            onClick={() => {
              setSpecifier(sp);
              if (sp === '%.2f' || sp === '%f') setRawInput('3.14159');
              else if (sp === '%d' || sp === '%05d' || sp === '%X') setRawInput('42');
              else if (sp === '%c') setRawInput('C');
              else setRawInput('Estudio C');
            }}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
              specifier === sp
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {sp}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
          <label className="block text-xs font-medium text-slate-700">
            Valor fornecido via scanf / variável:
            <input
              type="text"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </label>
          <div className="rounded bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
            printf(&quot;Saida: {specifier}\\n&quot;, valor);
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-900 p-4 text-slate-100">
          <div>
            <div className="text-xs font-medium text-slate-400">
              Console (stdout)
            </div>
            <div className="mt-2 font-mono text-lg font-semibold text-emerald-400">
              Saida: {preview.formatted}
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-300">{preview.explanation}</p>
        </div>
      </div>
    </div>
  );
}
