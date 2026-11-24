import type { CompileRunResponse } from './cChallengeEval';

type TokenType =
  | 'number'
  | 'string'
  | 'char'
  | 'ident'
  | 'op'
  | 'punct'
  | 'eof';

interface Token {
  type: TokenType;
  value: string;
  line: number;
}

class CCompileError extends Error {
  line: number;
  constructor(line: number, message: string) {
    super(`main.c:${line}: error: ${message}`);
    this.line = line;
  }
}

class CRuntimeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const TYPE_KEYWORDS = new Set([
  'void',
  'int',
  'char',
  'short',
  'long',
  'float',
  'double',
  'size_t',
  'FILE',
]);

const QUALIFIERS = new Set(['const', 'unsigned', 'signed', 'static']);

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  const len = source.length;

  const twoCharOps = new Set([
    '++',
    '--',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '==',
    '!=',
    '<=',
    '>=',
    '&&',
    '||',
    '<<',
    '>>',
    '->',
  ]);

  while (i < len) {
    const ch = source[i];
    if (ch === '\n') {
      line++;
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    // Single-line comment
    if (ch === '/' && source[i + 1] === '/') {
      while (i < len && source[i] !== '\n') i++;
      continue;
    }
    // Block comment
    if (ch === '/' && source[i + 1] === '*') {
      i += 2;
      while (i < len && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line++;
        i++;
      }
      if (i >= len) throw new CCompileError(line, 'unterminated comment');
      i += 2;
      continue;
    }
    // Preprocessor directive (#include, #define, etc.)
    if (ch === '#') {
      const startLine = line;
      let directive = '';
      while (i < len && source[i] !== '\n') {
        directive += source[i];
        i++;
      }
      // Basic #define constant support: #define NAME VALUE
      const defMatch = directive.match(/^#\s*define\s+([A-Za-z_]\w*)\s+(.+)$/);
      if (defMatch) {
        // Handled at token preprocessing if needed; emit nothing for #include
        tokens.push({ type: 'punct', value: `__DEFINE__:${defMatch[1]}:${defMatch[2].trim()}`, line: startLine });
      }
      continue;
    }
    // String literal
    if (ch === '"') {
      const startLine = line;
      i++;
      let str = '';
      while (i < len && source[i] !== '"') {
        if (source[i] === '\n') {
          throw new CCompileError(startLine, 'missing terminating " character');
        }
        if (source[i] === '\\') {
          i++;
          const esc = source[i];
          if (esc === 'n') str += '\n';
          else if (esc === 't') str += '\t';
          else if (esc === 'r') str += '\r';
          else if (esc === '0') str += '\0';
          else if (esc === '\\') str += '\\';
          else if (esc === '"') str += '"';
          else str += esc ?? '';
          i++;
        } else {
          str += source[i];
          i++;
        }
      }
      if (i >= len) throw new CCompileError(startLine, 'missing terminating " character');
      i++;
      // Concatenate adjacent string literals
      if (tokens.length > 0 && tokens[tokens.length - 1].type === 'string') {
        tokens[tokens.length - 1].value += str;
      } else {
        tokens.push({ type: 'string', value: str, line: startLine });
      }
      continue;
    }
    // Char literal
    if (ch === "'") {
      const startLine = line;
      i++;
      let chVal = '';
      if (source[i] === '\\') {
        i++;
        const esc = source[i];
        if (esc === 'n') chVal = '\n';
        else if (esc === 't') chVal = '\t';
        else if (esc === '0') chVal = '\0';
        else chVal = esc ?? '\0';
        i++;
      } else {
        chVal = source[i] ?? '';
        i++;
      }
      if (source[i] !== "'") {
        throw new CCompileError(startLine, "missing terminating ' character");
      }
      i++;
      tokens.push({ type: 'char', value: String(chVal.charCodeAt(0)), line: startLine });
      continue;
    }
    // Number literal (hex, octal, decimal, float)
    if (/[0-9]/.test(ch)) {
      const start = i;
      if (ch === '0' && (source[i + 1] === 'x' || source[i + 1] === 'X')) {
        i += 2;
        while (i < len && /[0-9a-fA-F]/.test(source[i])) i++;
        while (i < len && /[uUlL]/.test(source[i])) i++;
        tokens.push({ type: 'number', value: source.slice(start, i), line });
      } else {
        while (i < len && /[0-9.]/.test(source[i])) i++;
        while (i < len && /[fFlLuU]/.test(source[i])) i++;
        tokens.push({ type: 'number', value: source.slice(start, i), line });
      }
      continue;
    }
    // Identifier / keyword
    if (/[A-Za-z_]/.test(ch)) {
      const start = i;
      while (i < len && /[A-Za-z0-9_]/.test(source[i])) i++;
      tokens.push({ type: 'ident', value: source.slice(start, i), line });
      continue;
    }
    // Two-char operator
    const two = source.slice(i, i + 2);
    if (twoCharOps.has(two)) {
      tokens.push({ type: 'op', value: two, line });
      i += 2;
      continue;
    }
    // Single-char operators & punctuators
    if ('+-*/%<>=!&|^~?:'.includes(ch)) {
      tokens.push({ type: 'op', value: ch, line });
      i++;
      continue;
    }
    if ('(){}[],;.'.includes(ch)) {
      tokens.push({ type: 'punct', value: ch, line });
      i++;
      continue;
    }
    throw new CCompileError(line, `stray '${ch}' in program`);
  }

  tokens.push({ type: 'eof', value: '', line });
  return tokens;
}

interface CType {
  base: string;
  pointerDepth: number;
  isFloat: boolean;
  isChar: boolean;
  elemSize: number;
}

interface RuntimeVal {
  num: number;
  type: CType;
}

interface VarLocation {
  addr: number;
  type: CType;
  arrayDims?: number[]; // e.g. [4] or [3, 3]
}

interface FuncDef {
  name: string;
  returnType: CType;
  params: Array<{ name: string; type: CType }>;
  bodyStartIdx: number;
  bodyEndIdx: number;
}

class ReturnSignal {
  value: RuntimeVal;
  constructor(value: RuntimeVal) {
    this.value = value;
  }
}
class BreakSignal {}
class ContinueSignal {}

function makeScalarType(base: string, pointerDepth = 0): CType {
  const clean = base.replace(/\b(const|unsigned|signed|static|long|short)\b/g, '').trim() || 'int';
  const isFloat = pointerDepth === 0 && (clean === 'float' || clean === 'double');
  const isChar = pointerDepth === 0 && clean === 'char';
  const elemSize = pointerDepth > 0 ? 8 : isChar ? 1 : clean === 'double' ? 8 : 4;
  return { base: clean, pointerDepth, isFloat, isChar, elemSize };
}

function derefType(t: CType): CType {
  if (t.pointerDepth <= 0) return t;
  return makeScalarType(t.base, t.pointerDepth - 1);
}

function pointerToType(t: CType): CType {
  return makeScalarType(t.base, t.pointerDepth + 1);
}

function parseNumberLiteral(raw: string): { num: number; isFloat: boolean } {
  const cleaned = raw.replace(/[fFlLuU]+$/g, '');
  if (/^0[xX]/.test(cleaned)) {
    return { num: Number.parseInt(cleaned, 16), isFloat: false };
  }
  if (cleaned.includes('.')) {
    return { num: Number.parseFloat(cleaned), isFloat: true };
  }
  if (/^0[0-7]+$/.test(cleaned) && cleaned.length > 1) {
    return { num: Number.parseInt(cleaned, 8), isFloat: false };
  }
  return { num: Number.parseInt(cleaned, 10), isFloat: false };
}

function formatPrintf(fmt: string, args: RuntimeVal[], readString: (addr: number) => string): string {
  let out = '';
  let argIdx = 0;
  let i = 0;

  while (i < fmt.length) {
    if (fmt[i] !== '%') {
      out += fmt[i];
      i++;
      continue;
    }
    i++; // skip '%'
    if (fmt[i] === '%') {
      out += '%';
      i++;
      continue;
    }

    let zeroPad = false;
    if (fmt[i] === '0') {
      zeroPad = true;
      i++;
    }
    let widthStr = '';
    while (i < fmt.length && /[0-9]/.test(fmt[i])) {
      widthStr += fmt[i];
      i++;
    }
    let prec: number | null = null;
    if (fmt[i] === '.') {
      i++;
      let precStr = '';
      while (i < fmt.length && /[0-9]/.test(fmt[i])) {
        precStr += fmt[i];
        i++;
      }
      prec = precStr ? Number.parseInt(precStr, 10) : 0;
    }
    // Skip length modifiers like l, ll, z, h
    while (i < fmt.length && 'lzh'.includes(fmt[i])) {
      i++;
    }
    const spec = fmt[i] ?? '';
    i++;

    const val = args[argIdx++] ?? { num: 0, type: makeScalarType('int') };
    const width = widthStr ? Number.parseInt(widthStr, 10) : 0;

    if (spec === 'd' || spec === 'i' || spec === 'u') {
      const n = Math.trunc(val.num);
      const sign = n < 0 ? '-' : '';
      let digits = String(Math.abs(n));
      if (width > digits.length + sign.length) {
        const padChar = zeroPad ? '0' : ' ';
        const needed = width - digits.length - sign.length;
        digits = (zeroPad ? sign : '') + padChar.repeat(needed) + (zeroPad ? digits : sign + digits);
        out += digits;
      } else {
        out += sign + digits;
      }
    } else if (spec === 'x' || spec === 'X') {
      const hex = (Math.trunc(val.num) >>> 0).toString(16);
      const formatted = spec === 'X' ? hex.toUpperCase() : hex;
      out += width > formatted.length ? formatted.padStart(width, zeroPad ? '0' : ' ') : formatted;
    } else if (spec === 'f' || spec === 'F') {
      const digits = prec !== null ? prec : 6;
      out += val.num.toFixed(digits);
    } else if (spec === 'c') {
      out += String.fromCharCode(Math.trunc(val.num) & 0xff);
    } else if (spec === 's') {
      out += readString(val.num);
    } else if (spec === 'p') {
      out += val.num === 0 ? '(nil)' : `0x${(0x7fff0000 + Math.trunc(val.num)).toString(16)}`;
    } else {
      out += String(val.num);
    }
  }
  return out;
}

export function interpretC(source: string, stdinText: string = ''): CompileRunResponse {
  const startedAt = Date.now();
  let tokens: Token[] = [];

  try {
    tokens = tokenize(source);
  } catch (err) {
    return {
      compiled: false,
      stdout: '',
      stderr: err instanceof Error ? err.message : 'Erro léxico',
      exitCode: 1,
      timedOut: false,
      durationMs: Date.now() - startedAt,
    };
  }

  // Extract #define constants and strip __DEFINE__ markers
  const defines = new Map<string, string>();
  const cleanTokens: Token[] = [];
  for (const tok of tokens) {
    if (tok.type === 'punct' && tok.value.startsWith('__DEFINE__:')) {
      const rest = tok.value.slice('__DEFINE__:'.length);
      const colonIdx = rest.indexOf(':');
      if (colonIdx > 0) {
        defines.set(rest.slice(0, colonIdx), rest.slice(colonIdx + 1));
      }
    } else if (tok.type === 'ident' && defines.has(tok.value)) {
      const rep = defines.get(tok.value)!;
      const subTokens = tokenize(rep).filter((t) => t.type !== 'eof');
      for (const st of subTokens) {
        cleanTokens.push({ ...st, line: tok.line });
      }
    } else {
      cleanTokens.push(tok);
    }
  }
  tokens = cleanTokens;

  // Linear RAM: index = address (slot 0 reserved for NULL)
  const mem: number[] = [0];
  const heapBlocks = new Map<number, { size: number; freed: boolean }>();
  const stringLiterals = new Map<string, number>();
  const virtualFiles = new Map<string, string>();
  const openFiles = new Map<number, { path: string; mode: string; cursor: number; closed: boolean }>();
  let nextFileHandle = 1;

  const allocSlots = (count: number): number => {
    const start = mem.length;
    for (let k = 0; k < count; k++) mem.push(0);
    return start;
  };

  const internString = (str: string): number => {
    if (stringLiterals.has(str)) return stringLiterals.get(str)!;
    const addr = allocSlots(str.length + 1);
    for (let k = 0; k < str.length; k++) {
      mem[addr + k] = str.charCodeAt(k);
    }
    mem[addr + str.length] = 0;
    stringLiterals.set(str, addr);
    return addr;
  };

  const readCString = (addr: number): string => {
    if (addr <= 0 || addr >= mem.length) return '';
    let s = '';
    for (let k = addr; k < mem.length && mem[k] !== 0 && s.length < 4096; k++) {
      s += String.fromCharCode(mem[k] & 0xff);
    }
    return s;
  };

  let stdout = '';
  let stdinCursor = 0;
  const functions = new Map<string, FuncDef>();
  const globalScope = new Map<string, VarLocation>();
  const staticVarScopes = new Map<string, VarLocation>();
  const scopeStack: Array<Map<string, VarLocation>> = [globalScope];

  let opSteps = 0;
  const MAX_STEPS = 120_000;
  const tick = () => {
    opSteps++;
    if (opSteps > MAX_STEPS) {
      throw new CRuntimeError('Tempo limite excedido (possível laço infinito)');
    }
  };

  const lookupVar = (name: string, line: number): VarLocation => {
    for (let s = scopeStack.length - 1; s >= 0; s--) {
      const found = scopeStack[s].get(name);
      if (found) return found;
    }
    throw new CCompileError(line, `'${name}' undeclared`);
  };

  // Parse top-level functions & globals
  let pos = 0;
  const tokAt = (curPosRef: { p: number }, offset = 0): Token =>
    tokens[curPosRef.p + offset] ?? tokens[tokens.length - 1];
  const peek = (offset = 0): Token => tokens[pos + offset] ?? tokens[tokens.length - 1];
  const advance = (): Token => tokens[pos++] ?? tokens[tokens.length - 1];
  const expect = (value: string): Token => {
    const t = peek();
    if (t.value !== value) {
      throw new CCompileError(t.line, `expected '${value}' before '${t.value || 'end of input'}'`);
    }
    return advance();
  };

  const isTypeStart = (idx: number): boolean => {
    const t = tokens[idx];
    if (!t || t.type !== 'ident') return false;
    return TYPE_KEYWORDS.has(t.value) || QUALIFIERS.has(t.value);
  };

  const parseBaseTypeOnly = (r: { p: number }): { type: CType; isStatic: boolean } => {
    let isStatic = false;
    let base = 'int';
    while (tokAt(r).type === 'ident' && (QUALIFIERS.has(tokAt(r).value) || TYPE_KEYWORDS.has(tokAt(r).value))) {
      const w = tokAt(r).value;
      r.p++;
      if (w === 'static') isStatic = true;
      else if (TYPE_KEYWORDS.has(w)) base = w;
    }
    return { type: makeScalarType(base, 0), isStatic };
  };

  const parseTypeSpec = (r: { p: number }): { type: CType; isStatic: boolean } => {
    const { type: baseType, isStatic } = parseBaseTypeOnly(r);
    let ptrDepth = 0;
    while (tokAt(r).value === '*') {
      r.p++;
      ptrDepth++;
    }
    return { type: makeScalarType(baseType.base, ptrDepth), isStatic };
  };

  const findMatchingBrace = (openIdx: number): number => {
    let depth = 0;
    for (let k = openIdx; k < tokens.length; k++) {
      if (tokens[k].value === '{') depth++;
      else if (tokens[k].value === '}') {
        depth--;
        if (depth === 0) return k;
      }
    }
    throw new CCompileError(tokens[openIdx].line, "expected '}' before end of input");
  };

  // First pass: register function definitions and prototypes
  const topLevelVarPositions: number[] = [];
  try {
    while (peek().type !== 'eof') {
      if (!isTypeStart(pos)) {
        throw new CCompileError(peek().line, `expected declaration or statement before '${peek().value}'`);
      }
      const declStart = pos;
      const topRef = { p: pos };
      const { type: baseReturnType } = parseTypeSpec(topRef);
      pos = topRef.p;
      if (peek().type !== 'ident') {
        throw new CCompileError(peek().line, 'expected identifier');
      }
      const nameTok = advance();

      if (peek().value === '(') {
        // Function declaration or definition
        advance(); // '('
        const params: Array<{ name: string; type: CType }> = [];
        if (peek().value !== ')') {
          if (peek().value === 'void' && peek(1).value === ')') {
            advance();
          } else {
            while (peek().value !== ')' && peek().type !== 'eof') {
              const pRef = { p: pos };
              const { type: pType } = parseTypeSpec(pRef);
              pos = pRef.p;
              let pName = `arg${params.length}`;
              if (peek().type === 'ident') {
                pName = advance().value;
              }
              let finalParamType = pType;
              if (peek().value === '[') {
                advance();
                while (peek().value !== ']' && peek().type !== 'eof') advance();
                expect(']');
                finalParamType = pointerToType(pType);
                if (peek().value === '[') {
                  advance();
                  while (peek().value !== ']' && peek().type !== 'eof') advance();
                  expect(']');
                }
              }
              params.push({ name: pName, type: finalParamType });
              if (peek().value === ',') advance();
              else break;
            }
          }
        }
        expect(')');
        if (peek().value === ';') {
          advance(); // prototype only
        } else if (peek().value === '{') {
          const openIdx = pos;
          const closeIdx = findMatchingBrace(openIdx);
          functions.set(nameTok.value, {
            name: nameTok.value,
            returnType: baseReturnType,
            params,
            bodyStartIdx: openIdx + 1,
            bodyEndIdx: closeIdx,
          });
          pos = closeIdx + 1;
        } else {
          throw new CCompileError(peek().line, "expected ';' or '{'");
        }
      } else {
        // Global variable declaration — record and skip to ';'
        topLevelVarPositions.push(declStart);
        while (peek().value !== ';' && peek().type !== 'eof') {
          if (peek().value === '{') {
            pos = findMatchingBrace(pos) + 1;
          } else {
            advance();
          }
        }
        expect(';');
      }
    }
  } catch (err) {
    return {
      compiled: false,
      stdout: '',
      stderr: err instanceof Error ? err.message : 'Erro de compilação',
      exitCode: 1,
      timedOut: false,
      durationMs: Date.now() - startedAt,
    };
  }

  if (!functions.has('main')) {
    return {
      compiled: false,
      stdout: '',
      stderr: "main.c: error: undefined reference to `main'",
      exitCode: 1,
      timedOut: false,
      durationMs: Date.now() - startedAt,
    };
  }

  // Recursive descent expression evaluator & statement executor
  const evalExpression = (curPosRef: { p: number }): RuntimeVal => {
    const res = evalComma(curPosRef);
    return res;
  };

  const evalComma = (r: { p: number }): RuntimeVal => {
    let val = evalAssign(r);
    while (tokAt(r).value === ',') {
      r.p++;
      val = evalAssign(r);
    }
    return val;
  };

  interface LValue {
    addr: number;
    type: CType;
  }

  const tryEvalLValue = (r: { p: number }): LValue | null => {
    const saved = r.p;
    const t = tokAt(r);
    if (t.value === '*') {
      r.p++;
      const inner = evalUnary(r);
      if (inner.num === 0) throw new CRuntimeError('Segmentation fault (NULL dereference)');
      return { addr: Math.trunc(inner.num), type: derefType(inner.type) };
    }
    if (t.value === '(') {
      r.p++;
      const lv = tryEvalLValue(r);
      if (lv && tokAt(r).value === ')') {
        r.p++;
        return lv;
      }
      r.p = saved;
      return null;
    }
    if (t.type === 'ident') {
      if (tokAt(r, 1).value === '(') {
        r.p = saved;
        return null;
      }
      const name = t.value;
      const line = t.line;
      r.p++;
      const v = lookupVar(name, line);
      if (tokAt(r).value === '[') {
        if (v.arrayDims && v.arrayDims.length === 2) {
          r.p++;
          const idx1 = Math.trunc(evalExpression(r).num);
          if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
          r.p++;
          if (tokAt(r).value === '[') {
            r.p++;
            const idx2 = Math.trunc(evalExpression(r).num);
            if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
            r.p++;
            return {
              addr: v.addr + idx1 * v.arrayDims[1] + idx2,
              type: v.type,
            };
          }
          // Single index on 2D array -> row pointer
          r.p = saved;
          return null;
        }
        // 1D array or pointer indexing: v[i]
        r.p++;
        const idx = Math.trunc(evalExpression(r).num);
        if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
        r.p++;
        const baseAddr = v.arrayDims ? v.addr : mem[v.addr];
        const elemType = v.arrayDims ? v.type : derefType(v.type);
        return { addr: baseAddr + idx, type: elemType };
      }
      if (v.arrayDims) {
        // Array name itself is not a modifiable lvalue
        r.p = saved;
        return null;
      }
      return { addr: v.addr, type: v.type };
    }
    return null;
  };

  const hasDirectAssignOp = (startIdx: number): boolean => {
    let paren = 0;
    let brack = 0;
    for (let i = startIdx; i < tokens.length; i++) {
      const tk = tokens[i];
      if (tk.type === 'eof') return false;
      if (tk.value === '(') {
        paren++;
        continue;
      }
      if (tk.value === ')') {
        if (paren === 0) return false;
        paren--;
        continue;
      }
      if (tk.value === '[') {
        brack++;
        continue;
      }
      if (tk.value === ']') {
        if (brack === 0) return false;
        brack--;
        continue;
      }
      if (paren === 0 && brack === 0) {
        if (['=', '+=', '-=', '*=', '/=', '%='].includes(tk.value)) {
          return true;
        }
        if (tk.type === 'ident' || tk.value === '*' || tk.value === '++' || tk.value === '--') {
          continue;
        }
        return false;
      }
    }
    return false;
  };

  const evalAssign = (r: { p: number }): RuntimeVal => {
    if (hasDirectAssignOp(r.p)) {
      const saved = r.p;
      const lv = tryEvalLValue(r);
      const op = tokAt(r).value;
      if (lv && ['=', '+=', '-=', '*=', '/=', '%='].includes(op)) {
        r.p++;
        const rhs = evalAssign(r);
        const current = mem[lv.addr] ?? 0;
        let nextVal = rhs.num;
        if (op === '+=') nextVal = current + rhs.num;
        else if (op === '-=') nextVal = current - rhs.num;
        else if (op === '*=') nextVal = current * rhs.num;
        else if (op === '/=') {
          if (rhs.num === 0) throw new CRuntimeError('Divisão por zero');
          nextVal = lv.type.isFloat ? current / rhs.num : Math.trunc(current / rhs.num);
        } else if (op === '%=') {
          if (rhs.num === 0) throw new CRuntimeError('Divisão por zero');
          nextVal = Math.trunc(current) % Math.trunc(rhs.num);
        }
        if (!lv.type.isFloat && lv.type.pointerDepth === 0) {
          nextVal = Math.trunc(nextVal);
        }
        mem[lv.addr] = nextVal;
        return { num: nextVal, type: lv.type };
      }
      r.p = saved;
    }
    return evalTernary(r);
  };

  const skipBalancedUntil = (r: { p: number }, stops: string[]) => {
    let paren = 0;
    let brack = 0;
    while (tokAt(r).type !== 'eof') {
      const v = tokAt(r).value;
      if (v === '(') paren++;
      else if (v === ')') {
        if (paren === 0) break;
        paren--;
      } else if (v === '[') brack++;
      else if (v === ']') {
        if (brack === 0) break;
        brack--;
      } else if (paren === 0 && brack === 0 && stops.includes(v)) {
        break;
      }
      r.p++;
    }
  };

  const evalTernary = (r: { p: number }): RuntimeVal => {
    const cond = evalLogicalOr(r);
    if (tokAt(r).value === '?') {
      r.p++;
      if (cond.num !== 0) {
        const tBranch = evalExpression(r);
        if (tokAt(r).value !== ':') throw new CCompileError(tokAt(r).line, "expected ':'");
        r.p++;
        skipBalancedUntil(r, [';', ',', ')', ']', '}']);
        return tBranch;
      } else {
        skipBalancedUntil(r, [':']);
        if (tokAt(r).value !== ':') throw new CCompileError(tokAt(r).line, "expected ':'");
        r.p++;
        return evalTernary(r);
      }
    }
    return cond;
  };

  const evalLogicalOr = (r: { p: number }): RuntimeVal => {
    let left = evalLogicalAnd(r);
    while (tokAt(r).value === '||') {
      r.p++;
      if (left.num !== 0) {
        // short-circuit: still parse rhs by skipping or evaluating safely without side effects?
        // Evaluate via dummy? Better: parse & skip balanced tokens or just eval if simple.
        // For full C semantics, let's skip balanced rhs tokens so side effects don't fire!
        skipExprAtPrecedence(r, '&&');
        left = { num: 1, type: makeScalarType('int') };
      } else {
        const right = evalLogicalAnd(r);
        left = { num: right.num !== 0 ? 1 : 0, type: makeScalarType('int') };
      }
    }
    return left;
  };

  const skipExprAtPrecedence = (r: { p: number }, stopAt: string) => {
    let paren = 0;
    let brack = 0;
    while (tokAt(r).type !== 'eof') {
      const v = tokAt(r).value;
      if (v === '(') paren++;
      else if (v === ')') {
        if (paren === 0) break;
        paren--;
      } else if (v === '[') brack++;
      else if (v === ']') {
        if (brack === 0) break;
        brack--;
      } else if (paren === 0 && brack === 0) {
        if ([';', ',', ':', '?', '||', '}'].includes(v) || (stopAt === 'none' && v === '&&')) {
          break;
        }
      }
      r.p++;
    }
  };

  const evalLogicalAnd = (r: { p: number }): RuntimeVal => {
    let left = evalBitOr(r);
    while (tokAt(r).value === '&&') {
      r.p++;
      if (left.num === 0) {
        skipExprAtPrecedence(r, 'none');
        left = { num: 0, type: makeScalarType('int') };
      } else {
        const right = evalBitOr(r);
        left = { num: right.num !== 0 ? 1 : 0, type: makeScalarType('int') };
      }
    }
    return left;
  };

  const evalBitOr = (r: { p: number }): RuntimeVal => {
    let left = evalBitXor(r);
    while (tokAt(r).value === '|') {
      r.p++;
      const right = evalBitXor(r);
      left = { num: Math.trunc(left.num) | Math.trunc(right.num), type: makeScalarType('int') };
    }
    return left;
  };

  const evalBitXor = (r: { p: number }): RuntimeVal => {
    let left = evalBitAnd(r);
    while (tokAt(r).value === '^') {
      r.p++;
      const right = evalBitAnd(r);
      left = { num: Math.trunc(left.num) ^ Math.trunc(right.num), type: makeScalarType('int') };
    }
    return left;
  };

  const evalBitAnd = (r: { p: number }): RuntimeVal => {
    let left = evalEquality(r);
    while (tokAt(r).value === '&') {
      r.p++;
      const right = evalEquality(r);
      left = { num: Math.trunc(left.num) & Math.trunc(right.num), type: makeScalarType('int') };
    }
    return left;
  };

  const evalEquality = (r: { p: number }): RuntimeVal => {
    let left = evalRelational(r);
    while (tokAt(r).value === '==' || tokAt(r).value === '!=') {
      const op = tokAt(r).value;
      r.p++;
      const right = evalRelational(r);
      left = {
        num: op === '==' ? (left.num === right.num ? 1 : 0) : left.num !== right.num ? 1 : 0,
        type: makeScalarType('int'),
      };
    }
    return left;
  };

  const evalRelational = (r: { p: number }): RuntimeVal => {
    let left = evalShift(r);
    while (['<', '>', '<=', '>='].includes(tokAt(r).value)) {
      const op = tokAt(r).value;
      r.p++;
      const right = evalShift(r);
      const res =
        op === '<'
          ? left.num < right.num
          : op === '>'
          ? left.num > right.num
          : op === '<='
          ? left.num <= right.num
          : left.num >= right.num;
      left = { num: res ? 1 : 0, type: makeScalarType('int') };
    }
    return left;
  };

  const evalShift = (r: { p: number }): RuntimeVal => {
    let left = evalAdd(r);
    while (tokAt(r).value === '<<' || tokAt(r).value === '>>') {
      const op = tokAt(r).value;
      r.p++;
      const right = evalAdd(r);
      left = {
        num: op === '<<' ? Math.trunc(left.num) << Math.trunc(right.num) : Math.trunc(left.num) >> Math.trunc(right.num),
        type: makeScalarType('int'),
      };
    }
    return left;
  };

  const evalAdd = (r: { p: number }): RuntimeVal => {
    let left = evalMul(r);
    while (tokAt(r).value === '+' || tokAt(r).value === '-') {
      const op = tokAt(r).value;
      r.p++;
      const right = evalMul(r);
      if (left.type.pointerDepth > 0 && right.type.pointerDepth === 0) {
        left = {
          num: op === '+' ? left.num + Math.trunc(right.num) : left.num - Math.trunc(right.num),
          type: left.type,
        };
      } else if (left.type.pointerDepth > 0 && right.type.pointerDepth > 0 && op === '-') {
        left = { num: Math.trunc(left.num - right.num), type: makeScalarType('int') };
      } else {
        const isFloat = left.type.isFloat || right.type.isFloat;
        left = {
          num: op === '+' ? left.num + right.num : left.num - right.num,
          type: makeScalarType(isFloat ? 'double' : 'int'),
        };
      }
    }
    return left;
  };

  const evalMul = (r: { p: number }): RuntimeVal => {
    let left = evalUnary(r);
    while (['*', '/', '%'].includes(tokAt(r).value)) {
      const op = tokAt(r).value;
      r.p++;
      const right = evalUnary(r);
      const isFloat = left.type.isFloat || right.type.isFloat;
      if (op === '*') {
        left = { num: left.num * right.num, type: makeScalarType(isFloat ? 'double' : 'int') };
      } else if (op === '/') {
        if (right.num === 0) throw new CRuntimeError('Divisão por zero');
        left = {
          num: isFloat ? left.num / right.num : Math.trunc(left.num / right.num),
          type: makeScalarType(isFloat ? 'double' : 'int'),
        };
      } else {
        if (right.num === 0) throw new CRuntimeError('Divisão por zero');
        left = { num: Math.trunc(left.num) % Math.trunc(right.num), type: makeScalarType('int') };
      }
    }
    return left;
  };

  const evalUnary = (r: { p: number }): RuntimeVal => {
    const t = tokAt(r);
    // Cast expression: (type) expr
    if (t.value === '(' && isTypeStart(r.p + 1)) {
      r.p++;
      let base = 'int';
      while (tokAt(r).type === 'ident' && (QUALIFIERS.has(tokAt(r).value) || TYPE_KEYWORDS.has(tokAt(r).value))) {
        const w = tokAt(r).value;
        if (TYPE_KEYWORDS.has(w)) base = w;
        r.p++;
      }
      let ptrDepth = 0;
      while (tokAt(r).value === '*') {
        ptrDepth++;
        r.p++;
      }
      if (tokAt(r).value !== ')') throw new CCompileError(tokAt(r).line, "expected ')'");
      r.p++;
      const castType = makeScalarType(base, ptrDepth);
      const val = evalUnary(r);
      return {
        num: castType.isFloat || castType.pointerDepth > 0 ? val.num : Math.trunc(val.num),
        type: castType,
      };
    }

    if (t.value === 'sizeof') {
      r.p++;
      if (tokAt(r).value === '(') {
        r.p++;
        if (isTypeStart(r.p)) {
          let base = 'int';
          while (tokAt(r).type === 'ident' && (QUALIFIERS.has(tokAt(r).value) || TYPE_KEYWORDS.has(tokAt(r).value))) {
            const w = tokAt(r).value;
            if (TYPE_KEYWORDS.has(w)) base = w;
            r.p++;
          }
          let ptr = 0;
          while (tokAt(r).value === '*') {
            ptr++;
            r.p++;
          }
          if (tokAt(r).value !== ')') throw new CCompileError(tokAt(r).line, "expected ')'");
          r.p++;
          return { num: makeScalarType(base, ptr).elemSize, type: makeScalarType('size_t') };
        }
        // sizeof(var)
        if (tokAt(r).type === 'ident') {
          const v = lookupVar(tokAt(r).value, tokAt(r).line);
          r.p++;
          if (tokAt(r).value === ')') {
            r.p++;
            const count = v.arrayDims ? v.arrayDims.reduce((a, b) => a * b, 1) : 1;
            return { num: count * v.type.elemSize, type: makeScalarType('size_t') };
          }
        }
        throw new CCompileError(t.line, 'invalid sizeof expression');
      }
      throw new CCompileError(t.line, "expected '(' after sizeof");
    }

    if (t.value === '++' || t.value === '--') {
      const op = t.value;
      r.p++;
      const lv = tryEvalLValue(r);
      if (!lv) throw new CCompileError(t.line, 'lvalue required as increment operand');
      const next = op === '++' ? mem[lv.addr] + 1 : mem[lv.addr] - 1;
      mem[lv.addr] = next;
      return { num: next, type: lv.type };
    }

    if (t.value === '&') {
      r.p++;
      // Special case: &arr[i][j] or &arr[i] or &var
      const lv = tryEvalLValue(r);
      if (lv) {
        return { num: lv.addr, type: pointerToType(lv.type) };
      }
      if (tokAt(r).type === 'ident') {
        const v = lookupVar(tokAt(r).value, tokAt(r).line);
        r.p++;
        return { num: v.addr, type: pointerToType(v.type) };
      }
      throw new CCompileError(t.line, 'lvalue required as unary & operand');
    }

    if (t.value === '*') {
      r.p++;
      const inner = evalUnary(r);
      if (inner.num === 0) throw new CRuntimeError('Segmentation fault (NULL dereference)');
      const addr = Math.trunc(inner.num);
      return { num: mem[addr] ?? 0, type: derefType(inner.type) };
    }

    if (t.value === '!') {
      r.p++;
      const val = evalUnary(r);
      return { num: val.num === 0 ? 1 : 0, type: makeScalarType('int') };
    }
    if (t.value === '-') {
      r.p++;
      const val = evalUnary(r);
      return { num: -val.num, type: val.type };
    }
    if (t.value === '+') {
      r.p++;
      return evalUnary(r);
    }
    if (t.value === '~') {
      r.p++;
      const val = evalUnary(r);
      return { num: ~Math.trunc(val.num), type: makeScalarType('int') };
    }

    return evalPostfix(r);
  };

  const evalPostfix = (r: { p: number }): RuntimeVal => {
    let val: RuntimeVal;
    const t = tokAt(r);

    if (t.value === '(') {
      r.p++;
      val = evalExpression(r);
      if (tokAt(r).value !== ')') throw new CCompileError(tokAt(r).line, "expected ')'");
      r.p++;
    } else if (t.type === 'number') {
      r.p++;
      const parsed = parseNumberLiteral(t.value);
      val = { num: parsed.num, type: makeScalarType(parsed.isFloat ? 'double' : 'int') };
    } else if (t.type === 'char') {
      r.p++;
      val = { num: Number(t.value), type: makeScalarType('char') };
    } else if (t.type === 'string') {
      r.p++;
      val = { num: internString(t.value), type: makeScalarType('char', 1) };
    } else if (t.type === 'ident') {
      if (t.value === 'NULL') {
        r.p++;
        val = { num: 0, type: makeScalarType('void', 1) };
      } else if (tokAt(r, 1).value === '(') {
        val = evalFunctionCall(r);
      } else {
        const v = lookupVar(t.value, t.line);
        r.p++;
        if (v.arrayDims) {
          val = { num: v.addr, type: pointerToType(v.type) };
        } else {
          val = { num: mem[v.addr] ?? 0, type: v.type };
        }

        // Check postfix ops immediately on identifier (including v[i]++ or p++)
        while (true) {
          if (tokAt(r).value === '[') {
            r.p++;
            const idx = Math.trunc(evalExpression(r).num);
            if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
            r.p++;
            if (v.arrayDims && v.arrayDims.length === 2) {
              if (tokAt(r).value === '[') {
                r.p++;
                const idx2 = Math.trunc(evalExpression(r).num);
                if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
                r.p++;
                const addr = v.addr + idx * v.arrayDims[1] + idx2;
                if (tokAt(r).value === '++' || tokAt(r).value === '--') {
                  const op = tokAt(r).value;
                  r.p++;
                  const old = mem[addr];
                  mem[addr] = op === '++' ? old + 1 : old - 1;
                  val = { num: old, type: v.type };
                } else {
                  val = { num: mem[addr] ?? 0, type: v.type };
                }
              } else {
                val = { num: v.addr + idx * v.arrayDims[1], type: pointerToType(v.type) };
              }
            } else {
              const base = val.num;
              const elemType = derefType(val.type);
              const addr = Math.trunc(base) + idx;
              if (tokAt(r).value === '++' || tokAt(r).value === '--') {
                const op = tokAt(r).value;
                r.p++;
                const old = mem[addr] ?? 0;
                mem[addr] = op === '++' ? old + 1 : old - 1;
                val = { num: old, type: elemType };
              } else {
                val = { num: mem[addr] ?? 0, type: elemType };
              }
            }
          } else if (tokAt(r).value === '++' || tokAt(r).value === '--') {
            if (v.arrayDims) throw new CCompileError(tokAt(r).line, 'lvalue required');
            const op = tokAt(r).value;
            r.p++;
            const old = mem[v.addr];
            mem[v.addr] = op === '++' ? old + 1 : old - 1;
            val = { num: old, type: v.type };
          } else {
            break;
          }
        }
        return val;
      }
    } else {
      throw new CCompileError(t.line, `expected expression before '${t.value || 'eof'}'`);
    }

    // Handle postfix on parenthesized expressions (e.g., (p)[1])
    while (tokAt(r).value === '[') {
      r.p++;
      const idx = Math.trunc(evalExpression(r).num);
      if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
      r.p++;
      const addr = Math.trunc(val.num) + idx;
      val = { num: mem[addr] ?? 0, type: derefType(val.type) };
    }

    return val;
  };

  const evalFunctionCall = (r: { p: number }): RuntimeVal => {
    const fnTok = tokAt(r);
    const name = fnTok.value;
    r.p++; // ident
    r.p++; // '('
    const args: RuntimeVal[] = [];
    if (tokAt(r).value !== ')') {
      while (true) {
        args.push(evalAssign(r));
        if (tokAt(r).value === ',') {
          r.p++;
        } else {
          break;
        }
      }
    }
    if (tokAt(r).value !== ')') throw new CCompileError(tokAt(r).line, "expected ')'");
    r.p++;

    tick();

    // Built-in standard C library functions
    if (name === 'printf') {
      const fmt = args.length > 0 ? readCString(args[0].num) : '';
      stdout += formatPrintf(fmt, args.slice(1), readCString);
      return { num: 0, type: makeScalarType('int') };
    }
    if (name === 'scanf') {
      const fmt = args.length > 0 ? readCString(args[0].num) : '';
      const specs = fmt.match(/%[0-9.]*[lzh]*[difcs]/g) ?? [];
      let assigned = 0;
      for (let k = 0; k < specs.length; k++) {
        const sp = specs[k];
        const targetAddr = args[k + 1]?.num ?? 0;
        if (targetAddr <= 0) break;
        const typeCh = sp[sp.length - 1];
        if (typeCh === 'c') {
          if (sp.startsWith('% ')) {
            while (stdinCursor < stdinText.length && /\s/.test(stdinText[stdinCursor])) stdinCursor++;
          }
          if (stdinCursor >= stdinText.length) break;
          mem[targetAddr] = stdinText.charCodeAt(stdinCursor++);
          assigned++;
        } else {
          while (stdinCursor < stdinText.length && /\s/.test(stdinText[stdinCursor])) stdinCursor++;
          if (stdinCursor >= stdinText.length) break;
          let tokStr = '';
          while (stdinCursor < stdinText.length && !/\s/.test(stdinText[stdinCursor])) {
            tokStr += stdinText[stdinCursor++];
          }
          if (typeCh === 's') {
            for (let c = 0; c < tokStr.length; c++) mem[targetAddr + c] = tokStr.charCodeAt(c);
            mem[targetAddr + tokStr.length] = 0;
            assigned++;
          } else if (typeCh === 'f') {
            const num = Number.parseFloat(tokStr);
            if (Number.isNaN(num)) break;
            mem[targetAddr] = num;
            assigned++;
          } else {
            const num = Number.parseInt(tokStr, 10);
            if (Number.isNaN(num)) break;
            mem[targetAddr] = num;
            assigned++;
          }
        }
      }
      return { num: assigned, type: makeScalarType('int') };
    }
    if (name === 'strlen') {
      const s = args.length > 0 ? readCString(args[0].num) : '';
      return { num: s.length, type: makeScalarType('size_t') };
    }
    if (name === 'strcmp') {
      const a = readCString(args[0]?.num ?? 0);
      const b = readCString(args[1]?.num ?? 0);
      const cmp = a === b ? 0 : a < b ? -1 : 1;
      return { num: cmp, type: makeScalarType('int') };
    }
    if (name === 'strcpy') {
      const dst = Math.trunc(args[0]?.num ?? 0);
      const src = readCString(args[1]?.num ?? 0);
      if (dst > 0) {
        for (let k = 0; k < src.length; k++) mem[dst + k] = src.charCodeAt(k);
        mem[dst + src.length] = 0;
      }
      return { num: dst, type: makeScalarType('char', 1) };
    }
    if (name === 'malloc') {
      const bytes = Math.max(1, Math.trunc(args[0]?.num ?? 4));
      if (bytes > 200_000) throw new CRuntimeError('Alocação excede o limite do sandbox');
      const addr = allocSlots(bytes);
      heapBlocks.set(addr, { size: bytes, freed: false });
      return { num: addr, type: makeScalarType('void', 1) };
    }
    if (name === 'calloc') {
      const count = Math.max(1, Math.trunc(args[0]?.num ?? 1));
      const size = Math.max(1, Math.trunc(args[1]?.num ?? 4));
      const total = count * size;
      if (total > 200_000) throw new CRuntimeError('Alocação excede o limite do sandbox');
      const addr = allocSlots(total);
      heapBlocks.set(addr, { size: total, freed: false });
      return { num: addr, type: makeScalarType('void', 1) };
    }
    if (name === 'free') {
      const addr = Math.trunc(args[0]?.num ?? 0);
      if (addr !== 0 && heapBlocks.has(addr)) {
        heapBlocks.get(addr)!.freed = true;
      }
      return { num: 0, type: makeScalarType('void') };
    }
    if (name === 'fopen') {
      const filePath = readCString(args[0]?.num ?? 0);
      const mode = readCString(args[1]?.num ?? 0);
      if ((mode.startsWith('r') && !virtualFiles.has(filePath))) {
        return { num: 0, type: makeScalarType('FILE', 1) };
      }
      if (mode.startsWith('w')) {
        virtualFiles.set(filePath, '');
      } else if (!virtualFiles.has(filePath)) {
        virtualFiles.set(filePath, '');
      }
      const handle = nextFileHandle++;
      const initialCursor = mode.startsWith('a') ? (virtualFiles.get(filePath)?.length ?? 0) : 0;
      openFiles.set(handle, { path: filePath, mode, cursor: initialCursor, closed: false });
      return { num: handle, type: makeScalarType('FILE', 1) };
    }
    if (name === 'fclose') {
      const handle = Math.trunc(args[0]?.num ?? 0);
      const f = openFiles.get(handle);
      if (f) f.closed = true;
      return { num: 0, type: makeScalarType('int') };
    }
    if (name === 'fprintf') {
      const handle = Math.trunc(args[0]?.num ?? 0);
      const f = openFiles.get(handle);
      const fmt = readCString(args[1]?.num ?? 0);
      const text = formatPrintf(fmt, args.slice(2), readCString);
      if (f && !f.closed) {
        const curContent = virtualFiles.get(f.path) ?? '';
        virtualFiles.set(f.path, curContent + text);
      }
      return { num: text.length, type: makeScalarType('int') };
    }
    if (name === 'fscanf') {
      const handle = Math.trunc(args[0]?.num ?? 0);
      const f = openFiles.get(handle);
      if (!f || f.closed) return { num: -1, type: makeScalarType('int') };
      const content = virtualFiles.get(f.path) ?? '';
      const fmt = readCString(args[1]?.num ?? 0);
      const specs = fmt.match(/%[0-9.]*[lzh]*[difcs]/g) ?? [];
      let assigned = 0;
      for (let k = 0; k < specs.length; k++) {
        const sp = specs[k];
        const targetAddr = args[k + 2]?.num ?? 0;
        if (targetAddr <= 0) break;
        while (f.cursor < content.length && /\s/.test(content[f.cursor])) f.cursor++;
        if (f.cursor >= content.length) break;
        let tokStr = '';
        while (f.cursor < content.length && !/\s/.test(content[f.cursor])) {
          tokStr += content[f.cursor++];
        }
        const typeCh = sp[sp.length - 1];
        if (typeCh === 'f') {
          const num = Number.parseFloat(tokStr);
          if (Number.isNaN(num)) break;
          mem[targetAddr] = num;
          assigned++;
        } else if (typeCh === 's') {
          for (let c = 0; c < tokStr.length; c++) mem[targetAddr + c] = tokStr.charCodeAt(c);
          mem[targetAddr + tokStr.length] = 0;
          assigned++;
        } else {
          const num = Number.parseInt(tokStr, 10);
          if (Number.isNaN(num)) break;
          mem[targetAddr] = num;
          assigned++;
        }
      }
      return { num: assigned === 0 && f.cursor >= content.length ? -1 : assigned, type: makeScalarType('int') };
    }
    if (name === 'fgets') {
      const bufAddr = Math.trunc(args[0]?.num ?? 0);
      const maxLen = Math.trunc(args[1]?.num ?? 0);
      const handle = Math.trunc(args[2]?.num ?? 0);
      const f = openFiles.get(handle);
      if (!f || f.closed) return { num: 0, type: makeScalarType('char', 1) };
      const content = virtualFiles.get(f.path) ?? '';
      if (f.cursor >= content.length) return { num: 0, type: makeScalarType('char', 1) };
      let written = 0;
      while (f.cursor < content.length && written < maxLen - 1) {
        const ch = content.charCodeAt(f.cursor++);
        mem[bufAddr + written++] = ch;
        if (ch === 10) break;
      }
      mem[bufAddr + written] = 0;
      return { num: bufAddr, type: makeScalarType('char', 1) };
    }

    const fn = functions.get(name);
    if (!fn) {
      throw new CCompileError(fnTok.line, `implicit declaration of function '${name}'`);
    }
    return invokeFunction(fn, args);
  };

  const invokeFunction = (fn: FuncDef, args: RuntimeVal[]): RuntimeVal => {
    const fnScope = new Map<string, VarLocation>();
    for (let i = 0; i < fn.params.length; i++) {
      const p = fn.params[i];
      const addr = allocSlots(1);
      mem[addr] = args[i]?.num ?? 0;
      fnScope.set(p.name, { addr, type: p.type });
    }
    scopeStack.push(fnScope);
    try {
      executeBlockRange(fn.bodyStartIdx, fn.bodyEndIdx, fn.name);
    } catch (sig) {
      if (sig instanceof ReturnSignal) {
        return sig.value;
      }
      throw sig;
    } finally {
      scopeStack.pop();
    }
    return { num: 0, type: fn.returnType };
  };

  const execDeclaration = (r: { p: number }, fnKey: string) => {
    const { type: baseType, isStatic } = parseBaseTypeOnly(r);
    while (true) {
      let ptrDepth = baseType.pointerDepth;
      while (tokAt(r).value === '*') {
        ptrDepth++;
        r.p++;
      }
      const varType = makeScalarType(baseType.base, ptrDepth);
      const nameTok = tokAt(r);
      if (nameTok.type !== 'ident') {
        throw new CCompileError(nameTok.line, 'expected identifier in declaration');
      }
      r.p++;

      // Array dimensions?
      const dims: number[] = [];
      let emptyFirstDim = false;
      while (tokAt(r).value === '[') {
        r.p++;
        if (tokAt(r).value === ']') {
          emptyFirstDim = true;
          dims.push(0);
          r.p++;
        } else {
          const sizeVal = Math.trunc(evalExpression(r).num);
          if (tokAt(r).value !== ']') throw new CCompileError(tokAt(r).line, "expected ']'");
          r.p++;
          dims.push(Math.max(1, sizeVal));
        }
      }

      if (isStatic) {
        const staticKey = `${fnKey}::${nameTok.value}::${nameTok.line}`;
        if (staticVarScopes.has(staticKey)) {
          scopeStack[scopeStack.length - 1].set(nameTok.value, staticVarScopes.get(staticKey)!);
          // Skip initializer on subsequent calls
          if (tokAt(r).value === '=') {
            r.p++;
            if (tokAt(r).value === '{') {
              r.p = findMatchingBrace(r.p) + 1;
            } else {
              evalAssign(r);
            }
          }
          if (tokAt(r).value === ',') {
            r.p++;
            continue;
          }
          break;
        }
      }

      if (dims.length > 0) {
        // Array declaration
        let initNumbers: number[] = [];
        let stringInit: string | null = null;
        if (tokAt(r).value === '=') {
          r.p++;
          if (tokAt(r).type === 'string') {
            stringInit = tokAt(r).value;
            r.p++;
          } else if (tokAt(r).value === '{') {
            r.p++;
            const parseBraced = () => {
              while (tokAt(r).value !== '}' && tokAt(r).type !== 'eof') {
                if (tokAt(r).value === '{') {
                  r.p++;
                  parseBraced();
                  if (tokAt(r).value === ',') r.p++;
                } else {
                  initNumbers.push(evalAssign(r).num);
                  if (tokAt(r).value === ',') r.p++;
                }
              }
              if (tokAt(r).value !== '}') throw new CCompileError(tokAt(r).line, "expected '}'");
              r.p++;
            };
            parseBraced();
          } else {
            throw new CCompileError(tokAt(r).line, 'invalid array initializer');
          }
        }
        if (emptyFirstDim) {
          dims[0] = stringInit !== null ? stringInit.length + 1 : Math.max(1, initNumbers.length);
        }
        const totalSlots = dims.reduce((a, b) => a * b, 1);
        const addr = allocSlots(totalSlots);
        if (stringInit !== null) {
          for (let k = 0; k < stringInit.length && k < totalSlots; k++) {
            mem[addr + k] = stringInit.charCodeAt(k);
          }
          if (stringInit.length < totalSlots) mem[addr + stringInit.length] = 0;
        } else {
          for (let k = 0; k < initNumbers.length && k < totalSlots; k++) {
            mem[addr + k] = initNumbers[k];
          }
        }
        const loc: VarLocation = { addr, type: varType, arrayDims: dims };
        scopeStack[scopeStack.length - 1].set(nameTok.value, loc);
      } else {
        const addr = allocSlots(1);
        if (tokAt(r).value === '=') {
          r.p++;
          const initVal = evalAssign(r);
          mem[addr] = varType.isFloat || varType.pointerDepth > 0 ? initVal.num : Math.trunc(initVal.num);
        }
        const loc: VarLocation = { addr, type: varType };
        scopeStack[scopeStack.length - 1].set(nameTok.value, loc);
        if (isStatic) {
          staticVarScopes.set(`${fnKey}::${nameTok.value}::${nameTok.line}`, loc);
        }
      }

      if (tokAt(r).value === ',') {
        r.p++;
      } else {
        break;
      }
    }
    if (tokAt(r).value !== ';') {
      throw new CCompileError(tokAt(r).line, `expected ';' before '${tokAt(r).value}'`);
    }
    r.p++;
  };

  const skipStatement = (r: { p: number }) => {
    const t = tokAt(r);
    if (t.value === '{') {
      r.p = findMatchingBrace(r.p) + 1;
      return;
    }
    if (t.value === 'if') {
      r.p += 2; // if (
      let d = 1;
      while (d > 0 && tokAt(r).type !== 'eof') {
        if (tokAt(r).value === '(') d++;
        else if (tokAt(r).value === ')') d--;
        r.p++;
      }
      skipStatement(r);
      if (tokAt(r).value === 'else') {
        r.p++;
        skipStatement(r);
      }
      return;
    }
    while (tokAt(r).value !== ';' && tokAt(r).type !== 'eof') {
      if (tokAt(r).value === '{') {
        r.p = findMatchingBrace(r.p) + 1;
        return;
      }
      r.p++;
    }
    if (tokAt(r).value === ';') r.p++;
  };

  const executeStatement = (r: { p: number }, fnKey: string) => {
    tick();
    const t = tokAt(r);

    if (t.value === ';') {
      r.p++;
      return;
    }
    if (t.value === '{') {
      const closeIdx = findMatchingBrace(r.p);
      scopeStack.push(new Map());
      try {
        executeBlockRange(r.p + 1, closeIdx, fnKey);
      } finally {
        scopeStack.pop();
      }
      r.p = closeIdx + 1;
      return;
    }
    if (isTypeStart(r.p)) {
      execDeclaration(r, fnKey);
      return;
    }
    if (t.value === 'return') {
      r.p++;
      if (tokAt(r).value === ';') {
        r.p++;
        throw new ReturnSignal({ num: 0, type: makeScalarType('void') });
      }
      const val = evalExpression(r);
      if (tokAt(r).value !== ';') throw new CCompileError(tokAt(r).line, "expected ';'");
      r.p++;
      throw new ReturnSignal(val);
    }
    if (t.value === 'break') {
      r.p++;
      if (tokAt(r).value !== ';') throw new CCompileError(tokAt(r).line, "expected ';'");
      r.p++;
      throw new BreakSignal();
    }
    if (t.value === 'continue') {
      r.p++;
      if (tokAt(r).value !== ';') throw new CCompileError(tokAt(r).line, "expected ';'");
      r.p++;
      throw new ContinueSignal();
    }
    if (t.value === 'if') {
      r.p++;
      if (tokAt(r).value !== '(') throw new CCompileError(tokAt(r).line, "expected '('");
      r.p++;
      const cond = evalExpression(r);
      if (tokAt(r).value !== ')') throw new CCompileError(tokAt(r).line, "expected ')'");
      r.p++;
      if (cond.num !== 0) {
        executeStatement(r, fnKey);
        if (tokAt(r).value === 'else') {
          r.p++;
          skipStatement(r);
        }
      } else {
        skipStatement(r);
        if (tokAt(r).value === 'else') {
          r.p++;
          executeStatement(r, fnKey);
        }
      }
      return;
    }
    if (t.value === 'while') {
      r.p++;
      if (tokAt(r).value !== '(') throw new CCompileError(tokAt(r).line, "expected '('");
      const condStart = r.p + 1;
      r.p = condStart;
      let d = 1;
      while (d > 0 && tokAt(r).type !== 'eof') {
        if (tokAt(r).value === '(') d++;
        else if (tokAt(r).value === ')') d--;
        r.p++;
      }
      const bodyStart = r.p;
      const bodyEndRef = { p: bodyStart };
      skipStatement(bodyEndRef);

      while (true) {
        tick();
        const cr = { p: condStart };
        const cond = evalExpression(cr);
        if (cond.num === 0) break;
        const br = { p: bodyStart };
        try {
          executeStatement(br, fnKey);
        } catch (sig) {
          if (sig instanceof BreakSignal) break;
          if (sig instanceof ContinueSignal) continue;
          throw sig;
        }
      }
      r.p = bodyEndRef.p;
      return;
    }
    if (t.value === 'do') {
      r.p++;
      const bodyStart = r.p;
      const afterBodyRef = { p: bodyStart };
      skipStatement(afterBodyRef);
      if (tokAt(afterBodyRef).value !== 'while') {
        throw new CCompileError(tokAt(afterBodyRef).line, "expected 'while'");
      }
      afterBodyRef.p++;
      if (tokAt(afterBodyRef).value !== '(') {
        throw new CCompileError(tokAt(afterBodyRef).line, "expected '('");
      }
      const condStart = afterBodyRef.p + 1;
      const endRef = { p: condStart };
      let d = 1;
      while (d > 0 && tokAt(endRef).type !== 'eof') {
        if (tokAt(endRef).value === '(') d++;
        else if (tokAt(endRef).value === ')') d--;
        endRef.p++;
      }
      if (tokAt(endRef).value !== ';') throw new CCompileError(tokAt(endRef).line, "expected ';'");
      endRef.p++;

      while (true) {
        tick();
        const br = { p: bodyStart };
        try {
          executeStatement(br, fnKey);
        } catch (sig) {
          if (sig instanceof BreakSignal) break;
          if (!(sig instanceof ContinueSignal)) throw sig;
        }
        const cr = { p: condStart };
        const cond = evalExpression(cr);
        if (cond.num === 0) break;
      }
      r.p = endRef.p;
      return;
    }
    if (t.value === 'for') {
      r.p++;
      if (tokAt(r).value !== '(') throw new CCompileError(tokAt(r).line, "expected '('");
      r.p++;
      scopeStack.push(new Map());
      try {
        // Init
        if (tokAt(r).value !== ';') {
          if (isTypeStart(r.p)) {
            execDeclaration(r, fnKey);
          } else {
            evalExpression(r);
            if (tokAt(r).value !== ';') throw new CCompileError(tokAt(r).line, "expected ';'");
            r.p++;
          }
        } else {
          r.p++;
        }

        const condStart = r.p;
        while (tokAt(r).value !== ';' && tokAt(r).type !== 'eof') r.p++;
        if (tokAt(r).value !== ';') throw new CCompileError(tokAt(r).line, "expected ';'");
        const hasCond = r.p > condStart;
        r.p++;

        const stepStart = r.p;
        let d = 1;
        while (d > 0 && tokAt(r).type !== 'eof') {
          if (tokAt(r).value === '(') d++;
          else if (tokAt(r).value === ')') {
            d--;
            if (d === 0) break;
          }
          r.p++;
        }
        const hasStep = r.p > stepStart;
        r.p++; // ')'

        const bodyStart = r.p;
        const bodyEndRef = { p: bodyStart };
        skipStatement(bodyEndRef);

        while (true) {
          tick();
          if (hasCond) {
            const cr = { p: condStart };
            if (evalExpression(cr).num === 0) break;
          }
          const br = { p: bodyStart };
          try {
            executeStatement(br, fnKey);
          } catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (!(sig instanceof ContinueSignal)) throw sig;
          }
          if (hasStep) {
            const sr = { p: stepStart };
            evalExpression(sr);
          }
        }
        r.p = bodyEndRef.p;
      } finally {
        scopeStack.pop();
      }
      return;
    }
    if (t.value === 'switch') {
      r.p++;
      if (tokAt(r).value !== '(') throw new CCompileError(tokAt(r).line, "expected '('");
      r.p++;
      const switchVal = Math.trunc(evalExpression(r).num);
      if (tokAt(r).value !== ')') throw new CCompileError(tokAt(r).line, "expected ')'");
      r.p++;
      if (tokAt(r).value !== '{') throw new CCompileError(tokAt(r).line, "expected '{'");
      const openIdx = r.p;
      const closeIdx = findMatchingBrace(openIdx);

      // Scan top-level case/default labels inside switch block
      const cases: Array<{ val: number | null; stmtIdx: number }> = [];
      let scan = openIdx + 1;
      let depth = 0;
      while (scan < closeIdx) {
        const tk = tokens[scan];
        if (tk.value === '{') depth++;
        else if (tk.value === '}') depth--;
        else if (depth === 0 && tk.value === 'case') {
          const cr = { p: scan + 1 };
          const cVal = Math.trunc(evalExpression(cr).num);
          if (tokens[cr.p]?.value === ':') {
            cases.push({ val: cVal, stmtIdx: cr.p + 1 });
            scan = cr.p + 1;
            continue;
          }
        } else if (depth === 0 && tk.value === 'default' && tokens[scan + 1]?.value === ':') {
          cases.push({ val: null, stmtIdx: scan + 2 });
          scan += 2;
          continue;
        }
        scan++;
      }

      const matched =
        cases.find((c) => c.val === switchVal) ?? cases.find((c) => c.val === null);

      if (matched) {
        const sr = { p: matched.stmtIdx };
        try {
          while (sr.p < closeIdx) {
            if (tokens[sr.p].value === 'case') {
              sr.p++;
              evalExpression(sr);
              if (tokens[sr.p]?.value === ':') sr.p++;
              continue;
            }
            if (tokens[sr.p].value === 'default' && tokens[sr.p + 1]?.value === ':') {
              sr.p += 2;
              continue;
            }
            executeStatement(sr, fnKey);
          }
        } catch (sig) {
          if (!(sig instanceof BreakSignal)) throw sig;
        }
      }
      r.p = closeIdx + 1;
      return;
    }

    // Expression statement
    evalExpression(r);
    if (tokAt(r).value !== ';') {
      throw new CCompileError(tokAt(r).line, `expected ';' before '${tokAt(r).value || 'eof'}'`);
    }
    r.p++;
  };

  const executeBlockRange = (startIdx: number, endIdx: number, fnKey: string) => {
    const r = { p: startIdx };
    while (r.p < endIdx) {
      executeStatement(r, fnKey);
    }
  };

  try {
    for (const gPos of topLevelVarPositions) {
      execDeclaration({ p: gPos }, 'global');
    }
    const mainFn = functions.get('main')!;
    const ret = invokeFunction(mainFn, []);
    return {
      compiled: true,
      stdout,
      stderr: '',
      exitCode: Math.trunc(ret.num),
      timedOut: false,
      durationMs: Date.now() - startedAt,
    };
  } catch (err) {
    if (err instanceof CCompileError) {
      return {
        compiled: false,
        stdout: '',
        stderr: err.message,
        exitCode: 1,
        timedOut: false,
        durationMs: Date.now() - startedAt,
      };
    }
    const msg = err instanceof Error ? err.message : 'Erro de execução';
    return {
      compiled: true,
      stdout,
      stderr: msg,
      exitCode: msg.includes('Tempo limite') ? null : 1,
      timedOut: msg.includes('Tempo limite'),
      durationMs: Date.now() - startedAt,
    };
  }
}
