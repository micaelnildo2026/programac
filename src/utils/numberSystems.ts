export interface ByteRepresentation {
  bits: number[]; // length 8, MSB at index 0
  unsignedDecimal: number;
  signedDecimal: number;
  binary: string;
  octal: string;
  hexadecimal: string;
  asciiChar: string;
  isPrintableAscii: boolean;
}

export function bitsToRepresentation(bits: number[]): ByteRepresentation {
  if (bits.length !== 8) {
    throw new Error('Expected exactly 8 bits');
  }
  const normalized: number[] = bits.map((b) => (b ? 1 : 0));
  const unsignedDecimal = normalized.reduce<number>((acc, bit, idx) => {
    const power = 7 - idx;
    return acc + bit * (1 << power);
  }, 0);

  const signedDecimal =
    normalized[0] === 1 ? unsignedDecimal - 256 : unsignedDecimal;

  const binary = normalized.join('');
  const octal = unsignedDecimal.toString(8).padStart(3, '0');
  const hexadecimal = unsignedDecimal.toString(16).toUpperCase().padStart(2, '0');

  const isPrintableAscii = unsignedDecimal >= 32 && unsignedDecimal <= 126;
  const asciiChar = isPrintableAscii
    ? String.fromCharCode(unsignedDecimal)
    : getControlAsciiLabel(unsignedDecimal);

  return {
    bits: normalized,
    unsignedDecimal,
    signedDecimal,
    binary,
    octal,
    hexadecimal,
    asciiChar,
    isPrintableAscii,
  };
}

export function decimalToBits(value: number): number[] {
  const clamped = ((Math.trunc(value) % 256) + 256) % 256;
  const bits: number[] = [];
  for (let i = 7; i >= 0; i--) {
    bits.push((clamped >> i) & 1);
  }
  return bits;
}

export function toggleBitAt(bits: number[], index: number): number[] {
  if (index < 0 || index >= bits.length) {
    return [...bits];
  }
  return bits.map((bit, i) => (i === index ? (bit ? 0 : 1) : bit));
}

function getControlAsciiLabel(code: number): string {
  const labels: Record<number, string> = {
    0: '\\0 (NUL)',
    9: '\\t (TAB)',
    10: '\\n (LF)',
    13: '\\r (CR)',
    27: 'ESC',
    32: 'Espaço',
    127: 'DEL',
  };
  return labels[code] ?? 'Não imprimível';
}
