export type LogicGate = 'AND' | 'OR' | 'XOR' | 'NAND';

export function evaluateLogicGate(gate: LogicGate, a: boolean, b: boolean): boolean {
  switch (gate) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'XOR':
      return a !== b;
    case 'NAND':
      return !(a && b);
  }
}

export interface PrintfPreviewResult {
  formatted: string;
  specifierType: 'int' | 'float' | 'char' | 'string';
  explanation: string;
}

export function formatPrintfPreview(
  specifier: string,
  rawInput: string
): PrintfPreviewResult {
  const trimmed = specifier.trim();
  if (trimmed === '%d' || trimmed === '%i') {
    const num = Number.parseInt(rawInput, 10);
    const safe = Number.isNaN(num) ? 0 : num;
    return {
      specifierType: 'int',
      formatted: String(safe),
      explanation: 'Imprime número inteiro decimal com sinal.',
    };
  }
  if (trimmed === '%05d') {
    const num = Number.parseInt(rawInput, 10);
    const safe = Number.isNaN(num) ? 0 : num;
    const sign = safe < 0 ? '-' : '';
    const abs = Math.abs(safe).toString().padStart(sign ? 4 : 5, '0');
    return {
      specifierType: 'int',
      formatted: sign + abs,
      explanation: 'Preenche com zeros à esquerda até atingir 5 dígitos.',
    };
  }
  if (trimmed === '%x' || trimmed === '%X') {
    const num = Number.parseInt(rawInput, 10);
    const safe = Number.isNaN(num) ? 0 : Math.max(0, num);
    const hex = safe.toString(16);
    return {
      specifierType: 'int',
      formatted: trimmed === '%X' ? hex.toUpperCase() : hex,
      explanation: 'Converte o inteiro para base hexadecimal.',
    };
  }
  if (trimmed === '%.2f') {
    const num = Number.parseFloat(rawInput.replace(',', '.'));
    const safe = Number.isNaN(num) ? 0 : num;
    return {
      specifierType: 'float',
      formatted: safe.toFixed(2),
      explanation: 'Imprime ponto flutuante arredondado para 2 casas decimais.',
    };
  }
  if (trimmed === '%f') {
    const num = Number.parseFloat(rawInput.replace(',', '.'));
    const safe = Number.isNaN(num) ? 0 : num;
    return {
      specifierType: 'float',
      formatted: safe.toFixed(6),
      explanation: 'Padrão do %f em C exibe 6 casas decimais.',
    };
  }
  if (trimmed === '%c') {
    const ch = rawInput.length > 0 ? rawInput[0] : '?';
    return {
      specifierType: 'char',
      formatted: ch,
      explanation: 'Exibe exatamente um único caractere ASCII.',
    };
  }
  return {
    specifierType: 'string',
    formatted: rawInput,
    explanation: 'Imprime uma sequência de caracteres até encontrar \\0.',
  };
}

export interface LoopStep {
  iteration: number;
  iValue: number;
  conditionPassed: boolean;
  action: 'execute' | 'skip' | 'break' | 'exit';
  sumAfter: number;
  note: string;
}

export type LoopKind = 'for' | 'while' | 'do-while';
export type FlowControlMode = 'normal' | 'continue-on-3' | 'break-on-3';

export function simulateLoopTrace(
  kind: LoopKind,
  limit: number,
  flowMode: FlowControlMode
): LoopStep[] {
  const safeLimit = Math.max(0, Math.min(8, Math.trunc(limit)));
  const steps: LoopStep[] = [];
  let sum = 0;
  let i = 1;

  if (kind === 'do-while') {
    let iter = 0;
    do {
      iter++;
      if (flowMode === 'break-on-3' && i === 3) {
        steps.push({
          iteration: iter,
          iValue: i,
          conditionPassed: true,
          action: 'break',
          sumAfter: sum,
          note: `i == 3: break encerra o laço imediatamente.`,
        });
        return steps;
      }
      if (flowMode === 'continue-on-3' && i === 3) {
        steps.push({
          iteration: iter,
          iValue: i,
          conditionPassed: true,
          action: 'skip',
          sumAfter: sum,
          note: `i == 3: continue pula a soma e avança para o teste.`,
        });
        i++;
        continue;
      }
      sum += i;
      steps.push({
        iteration: iter,
        iValue: i,
        conditionPassed: i <= safeLimit,
        action: 'execute',
        sumAfter: sum,
        note: `Corpo executado antes do teste: soma += ${i} (total ${sum}).`,
      });
      i++;
    } while (i <= safeLimit && iter < 12);

    steps.push({
      iteration: iter + 1,
      iValue: i,
      conditionPassed: false,
      action: 'exit',
      sumAfter: sum,
      note: `Condição (${i} <= ${safeLimit}) falsa. Laço encerrado.`,
    });
    return steps;
  }

  let iter = 0;
  while (i <= safeLimit && iter < 12) {
    iter++;
    if (flowMode === 'break-on-3' && i === 3) {
      steps.push({
        iteration: iter,
        iValue: i,
        conditionPassed: true,
        action: 'break',
        sumAfter: sum,
        note: `i == 3: comando break interrompe o laço.`,
      });
      return steps;
    }
    if (flowMode === 'continue-on-3' && i === 3) {
      steps.push({
        iteration: iter,
        iValue: i,
        conditionPassed: true,
        action: 'skip',
        sumAfter: sum,
        note: `i == 3: continue ignora o restante do bloco nesta iteração.`,
      });
      i++;
      continue;
    }
    sum += i;
    steps.push({
      iteration: iter,
      iValue: i,
      conditionPassed: true,
      action: 'execute',
      sumAfter: sum,
      note: `${kind === 'for' ? 'for' : 'while'}: soma recebe ${i} -> ${sum}.`,
    });
    i++;
  }

  steps.push({
    iteration: iter + 1,
    iValue: i,
    conditionPassed: false,
    action: 'exit',
    sumAfter: sum,
    note: `Teste (${i} <= ${safeLimit}) retornou falso (0). Fim do laço.`,
  });
  return steps;
}

export interface PointerMemoryState {
  a: number;
  b: number;
  ptrTarget: 'a' | 'b' | null;
  aAddr: string;
  bAddr: string;
  ptrAddr: string;
  lastCommand: string;
  error?: string;
}

export const INITIAL_POINTER_STATE: PointerMemoryState = {
  a: 10,
  b: 25,
  ptrTarget: 'a',
  aAddr: '0x1004',
  bAddr: '0x1008',
  ptrAddr: '0x1010',
  lastCommand: 'int *p = &a;',
};

export function applyPointerOperation(
  state: PointerMemoryState,
  op:
    | { type: 'POINT_A' }
    | { type: 'POINT_B' }
    | { type: 'SET_NULL' }
    | { type: 'DEREF_ASSIGN'; value: number }
    | { type: 'DEREF_INCREMENT' }
    | { type: 'RESET' }
): PointerMemoryState {
  switch (op.type) {
    case 'POINT_A':
      return {
        ...state,
        ptrTarget: 'a',
        lastCommand: 'p = &a;',
        error: undefined,
      };
    case 'POINT_B':
      return {
        ...state,
        ptrTarget: 'b',
        lastCommand: 'p = &b;',
        error: undefined,
      };
    case 'SET_NULL':
      return {
        ...state,
        ptrTarget: null,
        lastCommand: 'p = NULL;',
        error: undefined,
      };
    case 'DEREF_ASSIGN': {
      if (state.ptrTarget === null) {
        return {
          ...state,
          lastCommand: `*p = ${op.value};`,
          error:
            'Falha de segmentação (Segmentation Fault): não é possível desreferenciar um ponteiro NULL!',
        };
      }
      return {
        ...state,
        [state.ptrTarget]: op.value,
        lastCommand: `*p = ${op.value};`,
        error: undefined,
      };
    }
    case 'DEREF_INCREMENT': {
      if (state.ptrTarget === null) {
        return {
          ...state,
          lastCommand: '(*p)++;',
          error:
            'Falha de segmentação (Segmentation Fault): p aponta para NULL.',
        };
      }
      const nextVal = state[state.ptrTarget] + 1;
      return {
        ...state,
        [state.ptrTarget]: nextVal,
        lastCommand: '(*p)++;',
        error: undefined,
      };
    }
    case 'RESET':
      return { ...INITIAL_POINTER_STATE };
  }
}

export function getMatrixLinearOffset(
  row: number,
  col: number,
  totalCols: number
): number {
  return row * totalCols + col;
}

export interface StringInspection {
  cells: Array<{ index: number; char: string; code: number; isNull: boolean; isUnused: boolean }>;
  strlen: number;
  sizeofBytes: number;
  truncated: boolean;
}

export function inspectCString(input: string, bufferSize = 12): StringInspection {
  const maxChars = Math.max(1, bufferSize - 1);
  const truncated = input.length > maxChars;
  const sliced = input.slice(0, maxChars);
  const cells: StringInspection['cells'] = [];

  for (let i = 0; i < bufferSize; i++) {
    if (i < sliced.length) {
      const ch = sliced[i];
      cells.push({
        index: i,
        char: ch,
        code: ch.charCodeAt(0),
        isNull: false,
        isUnused: false,
      });
    } else if (i === sliced.length) {
      cells.push({
        index: i,
        char: '\\0',
        code: 0,
        isNull: true,
        isUnused: false,
      });
    } else {
      cells.push({
        index: i,
        char: '?',
        code: -1,
        isNull: false,
        isUnused: true,
      });
    }
  }

  return {
    cells,
    strlen: sliced.length,
    sizeofBytes: bufferSize,
    truncated,
  };
}
