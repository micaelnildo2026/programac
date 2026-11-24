import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPointerOperation,
  evaluateLogicGate,
  formatPrintfPreview,
  getMatrixLinearOffset,
  INITIAL_POINTER_STATE,
  inspectCString,
  simulateLoopTrace,
} from './cSimulator';

test('evaluateLogicGate evaluates standard boolean gates', () => {
  assert.equal(evaluateLogicGate('AND', true, false), false);
  assert.equal(evaluateLogicGate('AND', true, true), true);
  assert.equal(evaluateLogicGate('OR', false, true), true);
  assert.equal(evaluateLogicGate('XOR', true, true), false);
  assert.equal(evaluateLogicGate('NAND', true, true), false);
});

test('formatPrintfPreview formats %.2f, %05d, %X and %c accurately', () => {
  assert.equal(formatPrintfPreview('%.2f', '3.14159').formatted, '3.14');
  assert.equal(formatPrintfPreview('%05d', '42').formatted, '00042');
  assert.equal(formatPrintfPreview('%X', '255').formatted, 'FF');
  assert.equal(formatPrintfPreview('%c', 'C').formatted, 'C');
});

test('simulateLoopTrace handles normal, continue, break, and do-while', () => {
  const normal = simulateLoopTrace('for', 4, 'normal');
  assert.equal(normal.filter((s) => s.action === 'execute').length, 4);
  assert.equal(normal[normal.length - 1].sumAfter, 10);

  const withContinue = simulateLoopTrace('for', 4, 'continue-on-3');
  assert.equal(withContinue.some((s) => s.action === 'skip'), true);
  assert.equal(withContinue[withContinue.length - 1].sumAfter, 7);

  const withBreak = simulateLoopTrace('while', 5, 'break-on-3');
  assert.equal(withBreak[withBreak.length - 1].action, 'break');
  assert.equal(withBreak[withBreak.length - 1].sumAfter, 3);

  const doWhileZero = simulateLoopTrace('do-while', 0, 'normal');
  assert.equal(doWhileZero.filter((s) => s.action === 'execute').length, 1);
});

test('applyPointerOperation updates target variable and catches NULL dereference', () => {
  let state = applyPointerOperation(INITIAL_POINTER_STATE, { type: 'POINT_B' });
  state = applyPointerOperation(state, { type: 'DEREF_ASSIGN', value: 77 });
  assert.equal(state.b, 77);
  assert.equal(state.a, 10);

  state = applyPointerOperation(state, { type: 'SET_NULL' });
  state = applyPointerOperation(state, { type: 'DEREF_INCREMENT' });
  assert.ok(state.error?.includes('Segmentation Fault'));
});

test('getMatrixLinearOffset and inspectCString compute row-major offset and null terminator', () => {
  assert.equal(getMatrixLinearOffset(2, 1, 4), 9);
  const str = inspectCString('Linguagem', 12);
  assert.equal(str.strlen, 9);
  assert.equal(str.cells[9].isNull, true);
  assert.equal(str.cells[9].char, '\\0');
});
