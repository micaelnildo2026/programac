import React, { useState } from 'react';
import {
  applyPointerOperation,
  getMatrixLinearOffset,
  INITIAL_POINTER_STATE,
  inspectCString,
  type PointerMemoryState,
} from '../../utils/cSimulator';

export function Array1DLab() {
  const [values, setValues] = useState([12, 45, 8, 27, 91]);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const baseAddr = 0x1000;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span>Clique em uma célula para inspecionar endereço e modificar o valor:</span>
        <span className="font-mono font-semibold text-blue-700">
          v[{selectedIndex}] @ 0x{(baseAddr + selectedIndex * 4).toString(16).toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {values.map((val, idx) => {
          const addr = `0x${(baseAddr + idx * 4).toString(16).toUpperCase()}`;
          const active = idx === selectedIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`rounded-lg border p-3 text-center transition-colors ${
                active
                  ? 'border-blue-600 bg-blue-50 text-blue-950'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="font-mono text-[11px] text-slate-500">v[{idx}]</div>
              <div className="my-1 font-mono text-lg font-semibold tabular-nums">
                {val}
              </div>
              <div className="font-mono text-[10px] text-slate-400">{addr}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="font-mono text-xs text-slate-700">
          Fórmula: base (0x1000) + {selectedIndex} * 4 bytes = 0x
          {(baseAddr + selectedIndex * 4).toString(16).toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setValues((prev) =>
                prev.map((v, i) => (i === selectedIndex ? v + 5 : v))
              )
            }
            className="rounded-md bg-blue-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-blue-700"
          >
            v[{selectedIndex}] += 5
          </button>
          <button
            type="button"
            onClick={() => setValues([12, 45, 8, 27, 91])}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Restaurar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Matrix2DLab() {
  const rows = 3;
  const cols = 4;
  const matrix = [
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 15, 25, 35],
  ];
  const [selected, setSelected] = useState<{ r: number; c: number }>({ r: 1, c: 2 });
  const linearIdx = getMatrixLinearOffset(selected.r, selected.c, cols);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-semibold text-slate-600">
            Visão Lógica 2D (int m[3][4])
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {matrix.map((row, rIdx) =>
              row.map((val, cIdx) => {
                const isSel = rIdx === selected.r && cIdx === selected.c;
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    type="button"
                    onClick={() => setSelected({ r: rIdx, c: cIdx })}
                    className={`rounded-md border py-2.5 font-mono text-xs transition-colors ${
                      isSel
                        ? 'border-blue-600 bg-blue-600 font-semibold text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div>{val}</div>
                    <div className={`text-[10px] ${isSel ? 'text-blue-100' : 'text-slate-400'}`}>
                      [{rIdx}][{cIdx}]
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold text-slate-600">
            Memória RAM Física Linear (Row-Major)
          </div>
          <div className="grid grid-cols-6 gap-1">
            {matrix.flat().map((val, idx) => (
              <div
                key={idx}
                className={`rounded border p-2 text-center font-mono text-xs tabular-nums ${
                  idx === linearIdx
                    ? 'border-blue-600 bg-blue-100 font-semibold text-blue-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-[9px] text-slate-400">+{idx}</div>
                <div>{val}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
            m[{selected.r}][{selected.c}] → deslocamento = ({selected.r} × {cols}) +{' '}
            {selected.c} = <span className="font-semibold text-blue-700">{linearIdx}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CStringsLab() {
  const [text, setText] = useState('Linguagem');
  const inspection = inspectCString(text, 12);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex flex-1 items-center gap-3 text-xs font-medium text-slate-700">
          Texto em char s[12]:
          <input
            type="text"
            maxLength={11}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </label>
        <div className="font-mono text-xs text-slate-700 tabular-nums">
          strlen(s) = <span className="font-semibold text-blue-700">{inspection.strlen}</span> | sizeof(s) ={' '}
          <span className="font-semibold">{inspection.sizeofBytes}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-12">
        {inspection.cells.map((cell) => (
          <div
            key={cell.index}
            className={`rounded-md border p-2 text-center font-mono text-xs ${
              cell.isNull
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                : cell.isUnused
                ? 'border-slate-200 bg-slate-50 text-slate-400'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="text-[10px] text-slate-400">[{cell.index}]</div>
            <div className="my-0.5 text-sm font-semibold">{cell.char}</div>
            <div className="text-[10px]">
              {cell.isUnused ? 'lixo' : cell.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemoryAddressesLab() {
  const [selectedVar, setSelectedVar] = useState<'idade' | 'letra' | 'altura'>('idade');
  const vars = {
    idade: { decl: 'int idade = 25;', addr: '0x7FFF1000', bytes: 4, val: '25' },
    letra: { decl: "char letra = 'C';", addr: '0x7FFF1004', bytes: 1, val: "'C' (67)" },
    altura: { decl: 'double altura = 1.80;', addr: '0x7FFF1008', bytes: 8, val: '1.80' },
  };
  const active = vars[selectedVar];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(Object.keys(vars) as Array<'idade' | 'letra' | 'altura'>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedVar(key)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              selectedVar === key
                ? 'border-blue-600 bg-blue-50 text-blue-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="font-mono text-xs font-semibold">{vars[key].decl}</div>
            <div className="mt-1 font-mono text-[11px] text-slate-500">
              &amp;{key} = {vars[key].addr}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-100">
        <div>printf(&quot;%p&quot;, (void*)&amp;{selectedVar}); → <span className="text-blue-400">{active.addr}</span></div>
        <div className="mt-1.5 text-slate-300">
          Ocupa {active.bytes} {active.bytes === 1 ? 'byte' : 'bytes'} consecutivos na RAM · Valor armazenado: {active.val}
        </div>
      </div>
    </div>
  );
}

export function PointerSandboxLab() {
  const [state, setState] = useState<PointerMemoryState>(INITIAL_POINTER_STATE);

  const ptrValue =
    state.ptrTarget === 'a'
      ? state.aAddr
      : state.ptrTarget === 'b'
      ? state.bAddr
      : 'NULL (0x0)';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setState((s) => applyPointerOperation(s, { type: 'POINT_A' }))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          p = &amp;a;
        </button>
        <button
          type="button"
          onClick={() => setState((s) => applyPointerOperation(s, { type: 'POINT_B' }))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          p = &amp;b;
        </button>
        <button
          type="button"
          onClick={() =>
            setState((s) => applyPointerOperation(s, { type: 'DEREF_ASSIGN', value: 99 }))
          }
          className="rounded-lg bg-blue-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-blue-700"
        >
          *p = 99;
        </button>
        <button
          type="button"
          onClick={() =>
            setState((s) => applyPointerOperation(s, { type: 'DEREF_INCREMENT' }))
          }
          className="rounded-lg bg-blue-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-blue-700"
        >
          (*p)++;
        </button>
        <button
          type="button"
          onClick={() => setState((s) => applyPointerOperation(s, { type: 'SET_NULL' }))}
          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 font-mono text-xs font-semibold text-amber-900 hover:bg-amber-100"
        >
          p = NULL;
        </button>
        <button
          type="button"
          onClick={() => setState((s) => applyPointerOperation(s, { type: 'RESET' }))}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Resetar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          className={`rounded-lg border p-4 transition-colors ${
            state.ptrTarget === 'a'
              ? 'border-blue-600 bg-blue-50/70'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex justify-between font-mono text-xs text-slate-500">
            <span>int a</span>
            <span>{state.aAddr}</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900">
            {state.a}
          </div>
          <div
            className={`mt-1 text-[11px] font-medium ${
              state.ptrTarget === 'a' ? 'text-blue-700 font-semibold' : 'text-slate-400'
            }`}
          >
            {state.ptrTarget === 'a' ? 'Apontado por *p' : 'Sem ponteiro ativo'}
          </div>
        </div>

        <div
          className={`rounded-lg border p-4 transition-colors ${
            state.ptrTarget === 'b'
              ? 'border-blue-600 bg-blue-50/70'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex justify-between font-mono text-xs text-slate-500">
            <span>int b</span>
            <span>{state.bAddr}</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-slate-900">
            {state.b}
          </div>
          <div
            className={`mt-1 text-[11px] font-medium ${
              state.ptrTarget === 'b' ? 'text-blue-700 font-semibold' : 'text-slate-400'
            }`}
          >
            {state.ptrTarget === 'b' ? 'Apontado por *p' : 'Sem ponteiro ativo'}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 text-slate-100">
          <div className="flex justify-between font-mono text-xs text-slate-400">
            <span>int *p</span>
            <span>{state.ptrAddr}</span>
          </div>
          <div className="mt-2 font-mono text-lg font-semibold text-blue-300">
            {ptrValue}
          </div>
          <div className="mt-1 font-mono text-[11px] text-slate-400">
            Último: {state.lastCommand}
          </div>
        </div>
      </div>

      {/* SVG Pointer Connection Diagram */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
        <svg
          viewBox="0 0 600 64"
          className="h-14 w-full"
          role="img"
          aria-label={
            state.ptrTarget === 'a'
              ? 'Seta visual indicando que p aponta para o endereço 0x1004 da variável a'
              : state.ptrTarget === 'b'
              ? 'Seta visual indicando que p aponta para o endereço 0x1008 da variável b'
              : 'Ponteiro p aterrado em NULL sem apontar para nenhuma variável'
          }
        >
          <defs>
            <marker
              id="ptr-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,1 L7,4 L0,7 Z" fill="#2563EB" />
            </marker>
          </defs>
          {state.ptrTarget === 'a' && (
            <>
              <text x="300" y="16" textAnchor="middle" fontSize="11.5" fill="#1E40AF" fontFamily="monospace" fontWeight="600">
                p guarda 0x1004 → aponta para a
              </text>
              <path
                d="M 500 54 C 500 26, 100 26, 100 48"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                markerEnd="url(#ptr-arrow)"
              />
            </>
          )}
          {state.ptrTarget === 'b' && (
            <>
              <text x="400" y="16" textAnchor="middle" fontSize="11.5" fill="#1E40AF" fontFamily="monospace" fontWeight="600">
                p guarda 0x1008 → aponta para b
              </text>
              <path
                d="M 500 54 C 500 28, 300 28, 300 48"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                markerEnd="url(#ptr-arrow)"
              />
            </>
          )}
          {state.ptrTarget === null && (
            <>
              <line x1="460" y1="34" x2="540" y2="34" stroke="#D97706" strokeWidth="2.5" />
              <line x1="540" y1="22" x2="540" y2="46" stroke="#D97706" strokeWidth="2.5" />
              <text x="230" y="38" textAnchor="middle" fontSize="11.5" fill="#92400E" fontFamily="monospace" fontWeight="600">
                p = NULL (0x0) · Ponteiro aterrado, não aponta para endereço válido
              </text>
            </>
          )}
        </svg>
      </div>

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-900"
        >
          {state.error}
        </div>
      )}
    </div>
  );
}

export function PointerArraysHeapLab() {
  const [offset, setOffset] = useState(0);
  const [allocated, setAllocated] = useState(true);
  const [freed, setFreed] = useState(false);
  const arr = [10, 20, 30, 40];
  const base = 0x2000;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAllocated(true);
              setFreed(false);
              setOffset(0);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            malloc(4 * sizeof(int))
          </button>
          <button
            type="button"
            onClick={() => {
              setAllocated(false);
              setFreed(true);
            }}
            className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 font-mono text-xs font-semibold text-rose-900 hover:bg-rose-100"
          >
            free(v); v = NULL;
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-700">Deslocamento i = {offset}</span>
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              disabled={!allocated}
              onClick={() => setOffset(idx)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold ${
                offset === idx && allocated
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 disabled:opacity-40'
              }`}
            >
              +{idx}
            </button>
          ))}
        </div>
      </div>

      {allocated ? (
        <div className="grid grid-cols-4 gap-2">
          {arr.map((val, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-3 text-center font-mono text-xs ${
                idx === offset
                  ? 'border-blue-600 bg-blue-50 font-semibold text-blue-950'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400">
                0x{(base + idx * 4).toString(16).toUpperCase()}
              </div>
              <div className="my-1 text-lg">{val}</div>
              <div>*(v + {idx})</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 text-xs text-slate-700">
          {freed
            ? 'Bloco no Heap devolvido ao sistema operacional com free(v) e ponteiro zerado para NULL.'
            : 'Nenhuma memória alocada.'}
        </div>
      )}
    </div>
  );
}

export function FileTypesLab() {
  const [num, setNum] = useState(12345);
  const textBytes = String(num).split('').map((ch) => ch.charCodeAt(0).toString(16).toUpperCase());
  const binaryBytes = [
    num & 0xff,
    (num >> 8) & 0xff,
    (num >> 16) & 0xff,
    (num >> 24) & 0xff,
  ].map((b) => b.toString(16).toUpperCase().padStart(2, '0'));

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 text-xs font-medium text-slate-700">
        Inteiro int x:
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(Number.parseInt(e.target.value, 10) || 0)}
          className="w-36 rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-sm text-slate-900"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-700">
            Arquivo Texto (.txt via fprintf) · {textBytes.length} bytes
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-xs">
            {textBytes.map((hex, i) => (
              <span key={i} className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                {String(num)[i]} (0x{hex})
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4">
          <div className="text-xs font-semibold text-blue-900">
            Arquivo Binário (.bin via fwrite) · 4 bytes fixos
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-xs">
            {binaryBytes.map((hex, i) => (
              <span key={i} className="rounded border border-blue-200 bg-white px-2 py-1 text-blue-900">
                0x{hex}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilePointerCursorLab() {
  const content = 'Nota:9.5\n';
  const [cursor, setCursor] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCursor((c) => Math.min(content.length, c + 1))}
          disabled={cursor >= content.length}
          className="rounded-lg bg-blue-600 px-3.5 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          fgetc(fp) (Avança 1 byte)
        </button>
        <button
          type="button"
          onClick={() => setCursor(0)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          rewind(fp)
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {content.split('').map((ch, idx) => (
          <div
            key={idx}
            className={`w-10 rounded border py-2 text-center font-mono text-xs ${
              idx === cursor
                ? 'border-blue-600 bg-blue-600 font-semibold text-white'
                : idx < cursor
                ? 'border-slate-200 bg-slate-100 text-slate-400'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div>{ch === '\n' ? '\\n' : ch}</div>
            <div className="text-[9px] opacity-75">@{idx}</div>
          </div>
        ))}
        <div
          className={`w-12 rounded border py-2 text-center font-mono text-xs ${
            cursor === content.length
              ? 'border-amber-600 bg-amber-100 font-semibold text-amber-900'
              : 'border-slate-200 bg-slate-50 text-slate-400'
          }`}
        >
          EOF
        </div>
      </div>

      <div className="font-mono text-xs text-slate-700">
        ftell(fp) = {cursor} {cursor === content.length ? '(Fim do arquivo atingido)' : ''}
      </div>
    </div>
  );
}

export function FopenModesLab() {
  const [mode, setMode] = useState<'r' | 'w' | 'a' | 'r+'>('w');
  const [exists, setExists] = useState(true);

  const behavior = (() => {
    if (mode === 'r') {
      return exists
        ? 'Sucesso: abre o arquivo existente para leitura no início (byte 0).'
        : 'Retorna NULL! Modo "r" não cria arquivo inexistente.';
    }
    if (mode === 'w') {
      return exists
        ? 'Atenção: APAGA todo o conteúdo existente (trunca para 0 bytes) e abre para escrita!'
        : 'Sucesso: cria um novo arquivo vazio para escrita.';
    }
    if (mode === 'a') {
      return exists
        ? 'Sucesso: preserva o conteúdo antigo e posiciona escrita sempre ao final.'
        : 'Sucesso: cria um novo arquivo para acréscimo.';
    }
    return exists
      ? 'Sucesso: abre arquivo existente para leitura e atualização sem apagar.'
      : 'Retorna NULL! Modo "r+" exige que o arquivo já exista.';
  })();

  const isNull = (mode === 'r' || mode === 'r+') && !exists;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-lg bg-slate-100 p-1">
          {(['r', 'w', 'a', 'r+'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold ${
                mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              &quot;{m}&quot;
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExists((e) => !e)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
            exists
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-slate-300 bg-white text-slate-700'
          }`}
        >
          Arquivo já existe no disco: {exists ? 'Sim' : 'Não'}
        </button>
      </div>

      <div
        className={`rounded-lg border p-4 text-xs font-medium ${
          isNull
            ? 'border-rose-300 bg-rose-50 text-rose-900'
            : mode === 'w' && exists
            ? 'border-amber-300 bg-amber-50 text-amber-900'
            : 'border-emerald-300 bg-emerald-50 text-emerald-950'
        }`}
      >
        <div className="font-mono font-semibold">
          FILE *fp = fopen(&quot;dados.txt&quot;, &quot;{mode}&quot;);
        </div>
        <div className="mt-1.5">{behavior}</div>
      </div>
    </div>
  );
}

export function FileIOBenchLab() {
  const [lines, setLines] = useState<string[]>(['Ana 9.5', 'Bruno 8.0']);
  const [newEntry, setNewEntry] = useState('Carla 10.0');
  const [readOutput, setReadOutput] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          aria-label="Nova linha para gravar no arquivo"
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-900"
        />
        <button
          type="button"
          onClick={() => {
            if (newEntry.trim()) {
              setLines((prev) => [...prev, newEntry.trim()]);
            }
          }}
          className="rounded-lg bg-blue-600 px-3.5 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-700"
        >
          fprintf(fp, &quot;%s\\n&quot;)
        </button>
        <button
          type="button"
          onClick={() => setReadOutput([...lines])}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          Ler tudo com fgets()
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs">
          <div className="mb-2 font-sans font-semibold text-slate-600">
            Conteúdo em disco (log.txt)
          </div>
          {lines.map((l, i) => (
            <div key={i} className="py-0.5 text-slate-800">
              {l}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-900 p-3.5 font-mono text-xs text-emerald-400">
          <div className="mb-2 font-sans font-semibold text-slate-400">
            Saída do loop while (fgets != NULL)
          </div>
          {readOutput.length === 0 ? (
            <span className="text-slate-500">Clique em &quot;Ler tudo com fgets()&quot;</span>
          ) : (
            readOutput.map((l, i) => <div key={i}>{l}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
