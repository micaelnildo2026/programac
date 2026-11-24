import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildExamPdfDocument, sanitizePdfText } from './examPdfGenerator.ts';

describe('examPdfGenerator', () => {
  it('preserves Portuguese accents and normalizes unsupported Unicode symbols', () => {
    const out = sanitizePdfText('Ponteiros → memória: ≥ 10 e ≠ 0 — revisão rápida de programação C!');
    assert.equal(out, 'Ponteiros -> memória: >= 10 e != 0 - revisão rápida de programação C!');
  });

  it('builds a valid multi-page complete exam PDF with all modules, topics, questions, and flashcards', () => {
    const result = buildExamPdfDocument();
    assert.equal(result.fileName, 'guia-prova-c-completo.pdf');
    assert.equal(result.stats.modules, 7);
    assert.equal(result.stats.topics, 28);
    assert.equal(result.stats.questions, 16);
    assert.equal(result.stats.flashcards, 21);
    assert.ok(result.pageCount >= 10, `Expected multi-page PDF, got ${result.pageCount}`);

    const bytes = new Uint8Array(result.doc.output('arraybuffer'));
    const header = new TextDecoder().decode(bytes.slice(0, 5));
    assert.equal(header, '%PDF-');
    assert.ok(bytes.length > 10_000, `Expected non-empty PDF payload, got ${bytes.length} bytes`);
  });

  it('supports filtering specific modules and sections cleanly', () => {
    const result = buildExamPdfDocument({
      selectedModuleNumbers: ['06', '07'],
      includeStrategiesAndTraps: true,
      includeTheoryAndCode: true,
      includeSolvedQuestions: true,
      includeFlashcards: false,
    });
    assert.equal(result.fileName, 'guia-prova-c-modulos-06-07.pdf');
    assert.equal(result.stats.modules, 2);
    assert.equal(result.stats.topics, 7);
    assert.equal(result.stats.flashcards, 0);
    assert.ok(result.stats.questions >= 4);
    assert.ok(result.pageCount >= 4);
  });
});
