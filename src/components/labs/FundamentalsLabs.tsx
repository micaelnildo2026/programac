import React, { useState } from 'react';
import {
  bitsToRepresentation,
  decimalToBits,
  toggleBitAt,
} from '../../utils/numberSystems';
import { evaluateLogicGate, type LogicGate } from '../../utils/cSimulator';
import { Play, RotateCcw, StepForward } from 'lucide-react';

export function VonNeumannLab() {
  const [step, setStep] = useState(0);
  const stages = [
    {
      phase: '01. Busca (Fetch)',
      active: 'ram',
      bus: 'Barramento de Endereços -> RAM [0x0100]',
      detail:
        'A Unidade de Controle (UC) lê o endereço no Contador de Programa (PC) e busca a instrução ADD R1, R2 na Memória RAM.',
      ir: 'ADD R1, R2',
      r1: '5',
      r2: '3',
      acc: '—',
    },
    {
      phase: '02. Decodificação (Decode)',
      active: 'uc',
      bus: 'Barramento de Controle -> UC decodifica opcode',
      detail:
        'A Unidade de Controle interpreta o código binário da instrução no Registrador de Instrução (IR) e prepara a ULA para somar.',
      ir: 'ADD R1, R2',
      r1: '5',
      r2: '3',
      acc: '—',
    },
    {
      phase: '03. Execução (Execute)',
      active: 'ula',
      bus: 'Registradores R1(5) + R2(3) -> ULA',
      detail:
        'A Unidade Lógica e Aritmética (ULA) realiza a soma binária de R1 e R2 e grava o resultado 8 no Acumulador (ACC).',
      ir: 'ADD R1, R2',
      r1: '5',
      r2: '3',
      acc: '8',
    },
    {
      phase: '04. Gravação (Write-back)',
      active: 'io',
      bus: 'Barramento de Dados -> RAM [0x100C] = 8',
      detail:
        'O valor 8 é armazenado na variável soma na RAM e disponibilizado para a saída padrão (printf).',
      ir: 'STORE soma',
      r1: '5',
      r2: '3',
      acc: '8',
    },
  ];

  const current = stages[step];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">
          {current.phase}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) % stages.length)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <StepForward className="h-3.5 w-3.5" aria-hidden="true" />
            Avançar ciclo
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div
          className={`rounded-xl border p-4 transition-colors ${
            current.active === 'uc' || current.active === 'ula'
              ? 'border-blue-500 bg-blue-50/60'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">
            CPU — Processador
          </div>
          <div className="mt-3 space-y-2">
            <div
              className={`rounded-lg border px-3 py-2 text-xs ${
                current.active === 'uc'
                  ? 'border-blue-500 bg-white font-semibold text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              UC · IR: <span className="font-mono">{current.ir}</span>
            </div>
            <div
              className={`rounded-lg border px-3 py-2 text-xs ${
                current.active === 'ula'
                  ? 'border-blue-500 bg-white font-semibold text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              ULA · Acumulador:{' '}
              <span className="font-mono tabular-nums">{current.acc}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
              <div className="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                R1 = {current.r1}
              </div>
              <div className="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700">
                R2 = {current.r2}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-4 transition-colors ${
            current.active === 'ram'
              ? 'border-blue-500 bg-blue-50/60'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">
            Memória Principal (RAM)
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-xs tabular-nums">
            <div className="flex justify-between rounded border border-slate-200 bg-white px-2.5 py-1.5">
              <span className="text-slate-500">0x0100</span>
              <span className="text-slate-900">ADD R1, R2</span>
            </div>
            <div className="flex justify-between rounded border border-slate-200 bg-white px-2.5 py-1.5">
              <span className="text-slate-500">0x1004 (a)</span>
              <span className="text-slate-900">5</span>
            </div>
            <div className="flex justify-between rounded border border-slate-200 bg-white px-2.5 py-1.5">
              <span className="text-slate-500">0x1008 (b)</span>
              <span className="text-slate-900">3</span>
            </div>
            <div className="flex justify-between rounded border border-slate-200 bg-white px-2.5 py-1.5">
              <span className="text-slate-500">0x100C (soma)</span>
              <span className="font-semibold text-blue-700">
                {step === 3 ? '8' : 'lixo'}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-4 transition-colors ${
            current.active === 'io'
              ? 'border-emerald-600 bg-emerald-50/60'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="text-xs font-semibold text-slate-500">
            Barramentos & Saída (E/S)
          </div>
          <div className="mt-3 space-y-2 text-xs text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-[11px] text-slate-800">
              {current.bus}
            </div>
            <div className="rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100">
              stdout: {step === 3 ? '8' : '(aguardando resultado)'}
            </div>
          </div>
        </div>
      </div>

      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        {current.detail}
      </p>
    </div>
  );
}

export function BinaryConverterLab() {
  const [bits, setBits] = useState<number[]>(() => decimalToBits(65));
  const rep = bitsToRepresentation(bits);

  const presets = [
    { label: 'ASCII A (65)', val: 65 },
    { label: '42 (Hex 2A)', val: 42 },
    { label: '255 (-1 em C2)', val: 255 },
    { label: '0 (Nulo)', val: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">
          Clique em qualquer bit para alternar entre 0 e 1 (1 Byte = 8 Bits)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBits(decimalToBits(p.val))}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {rep.bits.map((bit, idx) => {
          const weight = 1 << (7 - idx);
          return (
            <button
              key={idx}
              type="button"
              aria-label={`Bit peso ${weight}, valor atual ${bit}`}
              onClick={() => setBits((prev) => toggleBitAt(prev, idx))}
              className={`flex flex-col items-center rounded-lg border py-3 transition-colors ${
                bit === 1
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="font-mono text-lg font-semibold tabular-nums">
                {bit}
              </span>
              <span
                className={`mt-1 font-mono text-[11px] tabular-nums ${
                  bit === 1 ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                2^{7 - idx} ({weight})
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Sem sinal (unsigned)</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900">
            {rep.unsignedDecimal}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Complemento de 2</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900">
            {rep.signedDecimal}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Hexadecimal</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-blue-700">
            0x{rep.hexadecimal}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs text-slate-500">Octal</div>
          <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900">
            0{rep.octal}
          </div>
        </div>
        <div className="col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:col-span-1">
          <div className="text-xs text-slate-500">ASCII (char)</div>
          <div className="mt-1 font-mono text-lg font-semibold text-emerald-700">
            {rep.isPrintableAscii ? `'${rep.asciiChar}'` : rep.asciiChar}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogicGatesLab() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [gate, setGate] = useState<LogicGate>('AND');

  const out = evaluateLogicGate(gate, a, b);
  const rows: Array<[boolean, boolean]> = [
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ];

  const cOperator: Record<LogicGate, string> = {
    AND: 'A && B',
    OR: 'A || B',
    XOR: '(A != B)',
    NAND: '!(A && B)',
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
          {(['AND', 'OR', 'XOR', 'NAND'] as LogicGate[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGate(g)}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                gate === g
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setA((v) => !v)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              a
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <div className="text-xs text-slate-500">Entrada A</div>
            <div className="mt-1 font-mono text-base font-semibold">
              {a ? '1 (Verdadeiro)' : '0 (Falso)'}
            </div>
          </button>
          <button
            type="button"
            onClick={() => setB((v) => !v)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              b
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <div className="text-xs text-slate-500">Entrada B</div>
            <div className="mt-1 font-mono text-base font-semibold">
              {b ? '1 (Verdadeiro)' : '0 (Falso)'}
            </div>
          </button>
        </div>

        <div
          className={`rounded-lg border p-4 ${
            out
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
              : 'border-slate-200 bg-slate-50 text-slate-800'
          }`}
        >
          <div className="text-xs font-medium text-slate-600">
            Expressão em C: <code className="font-mono">{cOperator[gate]}</code>
          </div>
          <div className="mt-1 font-mono text-lg font-semibold">
            Saída: {out ? '1 · Verdadeiro' : '0 · Falso'}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs font-mono tabular-nums">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2.5">A</th>
              <th className="px-4 py-2.5">B</th>
              <th className="px-4 py-2.5">{gate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map(([ra, rb], idx) => {
              const isCurrent = ra === a && rb === b;
              const res = evaluateLogicGate(gate, ra, rb);
              return (
                <tr
                  key={idx}
                  className={isCurrent ? 'bg-blue-50 font-semibold text-blue-900' : 'bg-white text-slate-700'}
                >
                  <td className="px-4 py-2.5">{ra ? 1 : 0}</td>
                  <td className="px-4 py-2.5">{rb ? 1 : 0}</td>
                  <td className="px-4 py-2.5">{res ? '1 (V)' : '0 (F)'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VariablesMemoryLab() {
  const [horas, setHoras] = useState(8);
  const [tentouAlterarConst, setTentouAlterarConst] = useState(false);
  const DIAS_SEMANA = 7;
  const totalHoras = horas * DIAS_SEMANA;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Variável mutável (int)</div>
          <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
            horas = {horas}
          </div>
          <label className="mt-3 block text-xs text-slate-600">
            Ajustar horas/dia: {horas}h
            <input
              type="range"
              min={1}
              max={16}
              value={horas}
              onChange={(e) => {
                setHoras(Number(e.target.value));
                setTentouAlterarConst(false);
              }}
              className="mt-1.5 w-full accent-blue-600"
            />
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs text-slate-500">Constante protegida (const)</div>
          <div className="mt-1 font-mono text-sm font-semibold text-slate-900">
            DIAS_SEMANA = {DIAS_SEMANA}
          </div>
          <button
            type="button"
            onClick={() => setTentouAlterarConst(true)}
            className="mt-3 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Tentar DIAS_SEMANA = 8;
          </button>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div className="text-xs text-blue-700">Resultado da expressão</div>
          <div className="mt-1 font-mono text-sm font-semibold text-blue-950 tabular-nums">
            horas * DIAS_SEMANA = {totalHoras}
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Avaliada dinamicamente sempre que a variável muda.
          </div>
        </div>
      </div>

      {tentouAlterarConst && (
        <div
          role="status"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-900"
        >
          Erro de compilação: <code>assignment of read-only variable &apos;DIAS_SEMANA&apos;</code>. Constantes não podem ser reatribuídas após a declaração.
        </div>
      )}
    </div>
  );
}

export function AlgorithmPropertiesLab() {
  const [variant, setVariant] = useState<'valid' | 'infinite' | 'uninitialized'>('valid');
  const [n, setN] = useState(4);

  const trace = (() => {
    if (variant === 'valid') {
      const steps: string[] = [];
      let curr = n;
      let res = 1;
      while (curr > 1) {
        res *= curr;
        steps.push(`n=${curr} -> res=${res}, n decremente para ${curr - 1}`);
        curr--;
      }
      steps.push(`n=1 -> Condição falsa. Saída determinística: ${res}`);
      return { ok: true, steps };
    }
    if (variant === 'infinite') {
      return {
        ok: false,
        steps: [
          `Iteração 1: n=${n} > 1 (esqueceu n--!)`,
          `Iteração 2: n=${n} > 1 (n continua igual)`,
          `Iteração 3: n=${n} > 1 ...`,
          `Violação de FINITUDE: laço infinito detectado e interrompido.`,
        ],
      };
    }
    return {
      ok: false,
      steps: [
        `int res; (sem '= 1', contém lixo de memória ex: 32766)`,
        `res *= ${n} -> resultado imprevisível`,
        `Violação de CLAREZA / DETERMINISMO: saída depende de lixo na RAM.`,
      ],
    };
  })();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setVariant('valid')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              variant === 'valid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Algoritmo Válido
          </button>
          <button
            type="button"
            onClick={() => setVariant('infinite')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              variant === 'infinite' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Sem Finitude (Bug)
          </button>
          <button
            type="button"
            onClick={() => setVariant('uninitialized')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              variant === 'uninitialized' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Sem Inicialização
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
          Entrada n = {n}
          <input
            type="range"
            min={2}
            max={6}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="accent-blue-600"
          />
        </label>
      </div>

      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs">
        <div className={`font-sans text-xs font-semibold ${trace.ok ? 'text-emerald-700' : 'text-rose-700'}`}>
          {trace.ok
            ? 'Todas as propriedades satisfeitas (Finitude, Clareza, Entrada, Saída, Efetividade)'
            : 'Falha nas propriedades fundamentais de um algoritmo'}
        </div>
        {trace.steps.map((s, i) => (
          <div key={i} className="rounded border border-slate-200 bg-white px-3 py-2 text-slate-700">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlowchartPseudocodeLab() {
  const [nota, setNota] = useState(7.5);
  const [step, setStep] = useState(0);

  const isApproved = nota >= 6.0;
  const nodes = [
    { id: 0, shape: 'Terminal', label: 'Início', pseudo: 'inicio' },
    { id: 1, shape: 'Entrada/Saída', label: `Leia nota (${nota.toFixed(1)})`, pseudo: `leia(nota) // ${nota.toFixed(1)}` },
    {
      id: 2,
      shape: 'Decisão',
      label: `nota >= 6.0? (${isApproved ? 'Sim' : 'Não'})`,
      pseudo: 'se (nota >= 6.0) entao',
    },
    {
      id: 3,
      shape: 'Saída',
      label: isApproved ? 'Escreva "Aprovado"' : 'Escreva "Reprovado"',
      pseudo: isApproved ? '  escreva("Aprovado")' : 'senao escreva("Reprovado")',
    },
    { id: 4, shape: 'Terminal', label: 'Fim', pseudo: 'fimalgoritmo' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-3 text-xs font-medium text-slate-700">
          Nota de entrada: <span className="font-mono font-semibold tabular-nums">{nota.toFixed(1)}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={nota}
            onChange={(e) => {
              setNota(Number(e.target.value));
              setStep(0);
            }}
            className="accent-blue-600"
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) % nodes.length)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Próximo passo
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Resetar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold text-slate-500">Fluxograma</div>
          <div className="flex flex-col items-center gap-2">
            {nodes.map((node, idx) => {
              const active = idx === step;
              const shapeClass =
                node.shape === 'Terminal'
                  ? 'rounded-full px-6'
                  : node.shape === 'Decisão'
                  ? 'rounded-md border-dashed px-5'
                  : 'rounded-md px-5';
              return (
                <React.Fragment key={node.id}>
                  <button
                    type="button"
                    onClick={() => setStep(idx)}
                    className={`w-full max-w-xs border py-2 text-center text-xs font-medium transition-colors ${shapeClass} ${
                      active
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className="opacity-75">{node.shape}: </span>
                    {node.label}
                  </button>
                  {idx < nodes.length - 1 && (
                    <span className="text-xs text-slate-400" aria-hidden="true">
                      ↓
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-200">
          <div className="mb-3 font-sans text-xs font-semibold text-slate-400">
            Pseudocódigo sincronizado
          </div>
          <div className="space-y-1.5">
            {nodes.map((node, idx) => (
              <div
                key={node.id}
                className={`rounded px-2.5 py-1.5 transition-colors ${
                  idx === step
                    ? 'bg-blue-600/30 text-blue-200 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {idx + 1}. {node.pseudo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
