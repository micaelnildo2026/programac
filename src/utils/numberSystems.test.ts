import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bitsToRepresentation,
  decimalToBits,
  toggleBitAt,
} from './numberSystems';

test('bitsToRepresentation converts 01000001 to 65, 0x41, and ASCII A', () => {
  const rep = bitsToRepresentation([0, 1, 0, 0, 0, 0, 0, 1]);
  assert.equal(rep.unsignedDecimal, 65);
  assert.equal(rep.signedDecimal, 65);
  assert.equal(rep.hexadecimal, '41');
  assert.equal(rep.octal, '101');
  assert.equal(rep.asciiChar, 'A');
  assert.equal(rep.isPrintableAscii, true);
});

test('bitsToRepresentation handles two complement negative values', () => {
  const rep = bitsToRepresentation([1, 1, 1, 1, 1, 1, 1, 1]);
  assert.equal(rep.unsignedDecimal, 255);
  assert.equal(rep.signedDecimal, -1);
  assert.equal(rep.hexadecimal, 'FF');
});

test('decimalToBits and toggleBitAt round-trip cleanly', () => {
  const bits = decimalToBits(42);
  assert.deepEqual(bits, [0, 0, 1, 0, 1, 0, 1, 0]);
  const toggled = toggleBitAt(bits, 7);
  assert.equal(bitsToRepresentation(toggled).unsignedDecimal, 43);
});
