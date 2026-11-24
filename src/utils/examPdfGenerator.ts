import { jsPDF } from 'jspdf';
import { CURRICULUM, type Module } from '../data/curriculum';
import { FLASHCARDS, QUIZ_QUESTIONS } from '../data/memorizeAndQuiz';
import {
  DESK_CHECK_STEPS,
  FILE_MODE_ROWS,
  OPERATOR_PRECEDENCE,
  PRE_EXAM_CHECKLIST,
  TOP_EXAM_TRAPS,
  TYPE_REF_ROWS,
} from '../data/examGuideContent';
import { DIFFICULTY_LABELS } from './cChallengeEval';

export interface ExamGuideOptions {
  selectedModuleNumbers: string[];
  includeStrategiesAndTraps: boolean;
  includeTheoryAndCode: boolean;
  includeSolvedQuestions: boolean;
  includeFlashcards: boolean;
}

export const DEFAULT_EXAM_GUIDE_OPTIONS: ExamGuideOptions = {
  selectedModuleNumbers: CURRICULUM.map((m) => m.number),
  includeStrategiesAndTraps: true,
  includeTheoryAndCode: true,
  includeSolvedQuestions: true,
  includeFlashcards: true,
};

export interface BuiltExamPdf {
  doc: jsPDF;
  fileName: string;
  pageCount: number;
  stats: {
    modules: number;
    topics: number;
    questions: number;
    flashcards: number;
  };
}

/**
 * Built-in PDF fonts (Helvetica / Courier) use WinAnsi encoding.
 * Preserve Portuguese Latin-1 accents while normalizing unsupported Unicode symbols.
 */
export function sanitizePdfText(input: string): string {
  return input
    .replaceAll('\r\n', '\n')
    .replaceAll('\t', '    ')
    .replaceAll('→', '->')
    .replaceAll('←', '<-')
    .replaceAll('↔', '<->')
    .replaceAll('≥', '>=')
    .replaceAll('≤', '<=')
    .replaceAll('≠', '!=')
    .replaceAll('×', 'x')
    .replaceAll('÷', '/')
    .replaceAll('•', '-')
    .replaceAll('·', '|')
    .replaceAll('—', '-')
    .replaceAll('–', '-')
    .replaceAll('’', "'")
    .replaceAll('‘', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('…', '...')
    .replaceAll('✓', '[OK]')
    .replaceAll('✗', '[X]')
    .replace(/[^\x0A\x20-\x7E\xA0-\xFF]/g, '?');
}

export function buildExamPdfDocument(
  partialOptions?: Partial<ExamGuideOptions>
): BuiltExamPdf {
  const options: ExamGuideOptions = {
    ...DEFAULT_EXAM_GUIDE_OPTIONS,
    ...partialOptions,
  };

  const selectedSet = new Set(options.selectedModuleNumbers);
  const selectedModules: Module[] = CURRICULUM.filter((m) =>
    selectedSet.has(m.number)
  );
  const activeModules = selectedModules.length > 0 ? selectedModules : CURRICULUM;
  const activeModNumbers = new Set(activeModules.map((m) => m.number));

  const filteredQuestions = options.includeSolvedQuestions
    ? QUIZ_QUESTIONS.filter((q) => activeModNumbers.has(q.moduleNumber))
    : [];
  const filteredFlashcards = options.includeFlashcards
    ? FLASHCARDS.filter((c) => activeModNumbers.has(c.moduleNumber))
    : [];

  const totalTopics = options.includeTheoryAndCode
    ? activeModules.reduce((acc, m) => acc + m.topics.length, 0)
    : 0;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN_X = 16;
  const CONTENT_W = PAGE_W - MARGIN_X * 2;
  const TOP_Y = 20;
  const BOTTOM_LIMIT = PAGE_H - 18;

  let y = TOP_Y;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > BOTTOM_LIMIT) {
      doc.addPage();
      y = TOP_Y;
    }
  };

  const drawTextLines = (
    text: string,
    opts: {
      x?: number;
      width?: number;
      font?: 'helvetica' | 'courier';
      style?: 'normal' | 'bold' | 'italic';
      size?: number;
      lineHeight?: number;
      color?: [number, number, number];
      afterGap?: number;
    } = {}
  ) => {
    const x = opts.x ?? MARGIN_X;
    const width = opts.width ?? CONTENT_W;
    const font = opts.font ?? 'helvetica';
    const style = opts.style ?? 'normal';
    const size = opts.size ?? 10;
    const lineHeight = opts.lineHeight ?? size * 0.45;
    const color = opts.color ?? [30, 41, 59];

    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);

    const clean = sanitizePdfText(text);
    const lines = doc.splitTextToSize(clean, width) as string[];
    for (const line of lines) {
      ensureSpace(lineHeight + 1);
      doc.text(line, x, y);
      y += lineHeight;
    }
    if (opts.afterGap) {
      y += opts.afterGap;
    }
  };

  const drawSectionBanner = (kicker: string, title: string, subtitle?: string) => {
    ensureSpace(22);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(MARGIN_X, y - 4, CONTENT_W, subtitle ? 18 : 13, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(147, 197, 253);
    doc.text(sanitizePdfText(kicker.toUpperCase()), MARGIN_X + 4, y + 1);
    doc.setFontSize(12.5);
    doc.setTextColor(255, 255, 255);
    doc.text(sanitizePdfText(title), MARGIN_X + 4, y + 7);
    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text(sanitizePdfText(subtitle), MARGIN_X + 4, y + 12);
      y += 20;
    } else {
      y += 15;
    }
  };

  const drawCodeBlock = (code: string, label?: string) => {
    const cleanCode = sanitizePdfText(code);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8.2);
    const rawLines = cleanCode.split('\n');
    const wrapped: string[] = [];
    for (const raw of rawLines) {
      const split = doc.splitTextToSize(raw || ' ', CONTENT_W - 8) as string[];
      wrapped.push(...split);
    }

    const lineH = 3.8;
    const headerH = label ? 5.5 : 0;
    const padY = 4;

    // Split across pages cleanly if very long
    let idx = 0;
    let firstChunk = true;
    while (idx < wrapped.length) {
      const available = BOTTOM_LIMIT - y - padY - (firstChunk ? headerH : 0) - 4;
      let maxLines = Math.floor(available / lineH);
      if (maxLines < 3) {
        doc.addPage();
        y = TOP_Y;
        maxLines = Math.floor((BOTTOM_LIMIT - y - padY - headerH - 4) / lineH);
      }
      const chunk = wrapped.slice(idx, idx + maxLines);
      const boxH = chunk.length * lineH + padY * 2 + (firstChunk ? headerH : 0);

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(MARGIN_X, y - 2, CONTENT_W, boxH, 1.5, 1.5, 'FD');

      let cy = y + 2;
      if (firstChunk && label) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        doc.setTextColor(71, 85, 105);
        doc.text(sanitizePdfText(label), MARGIN_X + 4, cy);
        cy += headerH;
      }

      doc.setFont('courier', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(15, 23, 42);
      for (const ln of chunk) {
        doc.text(ln, MARGIN_X + 4, cy);
        cy += lineH;
      }

      y += boxH + 3;
      idx += chunk.length;
      firstChunk = false;
    }
  };

  const drawCalloutBox = (
    title: string,
    body: string,
    palette: 'amber' | 'blue'
  ) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(sanitizePdfText(body), CONTENT_W - 8) as string[];
    const boxH = 10 + lines.length * 4.1;
    ensureSpace(boxH + 3);

    if (palette === 'amber') {
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
    } else {
      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(59, 130, 246);
    }
    doc.roundedRect(MARGIN_X, y - 2, CONTENT_W, boxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(
      palette === 'amber' ? 146 : 30,
      palette === 'amber' ? 64 : 58,
      palette === 'amber' ? 14 : 138
    );
    doc.text(sanitizePdfText(title), MARGIN_X + 4, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    let cy = y + 8;
    for (const ln of lines) {
      doc.text(ln, MARGIN_X + 4, cy);
      cy += 4.1;
    }
    y += boxH + 3.5;
  };

  // ==================== COVER / PAGE 1 ====================
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, PAGE_W, 56, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(147, 197, 253);
  doc.text('ESTUDIO C  |  GUIA DE PREPARACAO PARA PROVAS', MARGIN_X, 18);

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('Guia Completo de Programacao em C', MARGIN_X, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    sanitizePdfText(
      'Resumo estrategico, teste de mesa, pegadinhas de prova, exemplos em C e questoes passo a passo.'
    ),
    MARGIN_X,
    39
  );

  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    sanitizePdfText(
      `Conteudo incluido: ${activeModules.length} modulo(s) | ${totalTopics} topicos | ${filteredQuestions.length} questoes | ${filteredFlashcards.length} flashcards`
    ),
    MARGIN_X,
    49
  );

  y = 66;

  // Roadmap summary table on cover
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Mapa dos Modulos Selecionados', MARGIN_X, y);
  y += 5;

  for (const mod of activeModules) {
    ensureSpace(11);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(MARGIN_X, y - 3, CONTENT_W, 9.5, 1.2, 1.2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(37, 99, 235);
    doc.text(`Modulo ${mod.number}`, MARGIN_X + 3, y + 2.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizePdfText(mod.title), MARGIN_X + 24, y + 2.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(100, 116, 139);
    doc.text(`${mod.topics.length} subtopicos`, PAGE_W - MARGIN_X - 24, y + 2.5);
    y += 11;
  }

  y += 3;
  drawCalloutBox(
    'Como usar este guia na vespera e no dia da prova',
    '1) Domine primeiro a secao de Teste de Mesa e as 10 Pegadinhas Classicas (elas respondem por mais da metade dos erros em prova). 2) Consulte a Tabela de Tipos/Operadores ao resolver exercicios. 3) Refaca as questoes comentadas tampando a resposta antes de conferir o passo a passo.',
    'blue'
  );

  // ==================== SECTION 1: EXAM STRATEGIES, TRAPS & CHEAT SHEETS ====================
  if (options.includeStrategiesAndTraps) {
    doc.addPage();
    y = TOP_Y;

    drawSectionBanner(
      'Estrategia de Prova',
      '1. Metodo do Teste de Mesa e Pegadinhas Classicas',
      'Como rastrear codigo C no papel sem compilador e evitar erros frequentes.'
    );

    drawTextLines('Como fazer Teste de Mesa (Passo a Passo)', {
      font: 'helvetica',
      style: 'bold',
      size: 11.5,
      color: [15, 23, 42],
      afterGap: 2,
    });

    for (const item of DESK_CHECK_STEPS) {
      ensureSpace(14);
      drawTextLines(item.step, {
        style: 'bold',
        size: 9.5,
        color: [37, 99, 235],
        afterGap: 0.5,
      });
      drawTextLines(item.detail, {
        x: MARGIN_X + 3,
        width: CONTENT_W - 3,
        size: 9,
        color: [51, 65, 85],
        afterGap: 2.5,
      });
    }

    y += 2;
    drawTextLines('As 10 Maiores Pegadinhas de Prova em C', {
      font: 'helvetica',
      style: 'bold',
      size: 11.5,
      color: [15, 23, 42],
      afterGap: 3,
    });

    for (const trap of TOP_EXAM_TRAPS) {
      ensureSpace(24);
      drawTextLines(`${String(trap.number).padStart(2, '0')}. ${trap.title}`, {
        style: 'bold',
        size: 9.5,
        color: [15, 23, 42],
        afterGap: 1,
      });
      drawTextLines(`Erro comum: ${trap.wrongExample}`, {
        x: MARGIN_X + 3,
        width: CONTENT_W - 3,
        font: 'courier',
        size: 8.3,
        color: [185, 28, 28],
        afterGap: 0.6,
      });
      drawTextLines(`Forma certa: ${trap.rightExample}`, {
        x: MARGIN_X + 3,
        width: CONTENT_W - 3,
        font: 'courier',
        size: 8.3,
        color: [4, 120, 87],
        afterGap: 1,
      });
      drawTextLines(trap.whyItMatters, {
        x: MARGIN_X + 3,
        width: CONTENT_W - 3,
        size: 8.8,
        color: [71, 85, 105],
        afterGap: 3,
      });
    }

    // Cheat sheets
    doc.addPage();
    y = TOP_Y;
    drawSectionBanner(
      'Consulta Rapida',
      '2. Tabelas Essenciais: Tipos, Precedencia e Arquivos',
      'Resumo condensado para memorizar especificadores de printf/scanf, prioridades e modos fopen.'
    );

    drawTextLines('Tipos de Dados e Especificadores (printf / scanf)', {
      style: 'bold',
      size: 10.5,
      color: [15, 23, 42],
      afterGap: 2.5,
    });

    for (const row of TYPE_REF_ROWS) {
      ensureSpace(13);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(MARGIN_X, y - 2.5, CONTENT_W, 11, 1, 1, 'FD');

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text(sanitizePdfText(row.typeName), MARGIN_X + 2.5, y + 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(sanitizePdfText(row.approxSize), MARGIN_X + 36, y + 2);
      doc.text(sanitizePdfText(`printf: ${row.printfSpec}`), MARGIN_X + 75, y + 2);
      doc.text(sanitizePdfText(`scanf: ${row.scanfSpec}`), MARGIN_X + 132, y + 2);

      doc.setFontSize(7.8);
      doc.setTextColor(100, 116, 139);
      doc.text(sanitizePdfText(row.notes), MARGIN_X + 2.5, y + 6.5);
      y += 12.5;
    }

    y += 3;
    drawTextLines('Ordem de Precedencia de Operadores (do mais forte ao mais fraco)', {
      style: 'bold',
      size: 10.5,
      color: [15, 23, 42],
      afterGap: 2.5,
    });

    for (const op of OPERATOR_PRECEDENCE) {
      ensureSpace(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizePdfText(op.level), MARGIN_X, y);
      doc.setFont('courier', 'normal');
      doc.setTextColor(30, 64, 175);
      doc.text(sanitizePdfText(op.operators), MARGIN_X + 34, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(100, 116, 139);
      doc.text(sanitizePdfText(op.associativity), PAGE_W - MARGIN_X - 31, y);
      y += 5.5;
    }

    y += 4;
    drawTextLines('Modos de Abertura de Arquivos (fopen)', {
      style: 'bold',
      size: 10.5,
      color: [15, 23, 42],
      afterGap: 2.5,
    });

    for (const fm of FILE_MODE_ROWS) {
      ensureSpace(7.5);
      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(37, 99, 235);
      doc.text(sanitizePdfText(fm.mode), MARGIN_X, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.setTextColor(30, 41, 59);
      doc.text(sanitizePdfText(fm.meaning), MARGIN_X + 24, y);
      doc.text(sanitizePdfText(`Se nao existe: ${fm.ifNotExists}`), MARGIN_X + 68, y);
      doc.text(sanitizePdfText(`Se existe: ${fm.ifExists}`), MARGIN_X + 122, y);
      y += 5.5;
    }

    y += 4;
    drawTextLines('Checklist Final Antes de Entregar a Prova', {
      style: 'bold',
      size: 10.5,
      color: [15, 23, 42],
      afterGap: 2,
    });
    for (let i = 0; i < PRE_EXAM_CHECKLIST.length; i++) {
      drawTextLines(`[ ] ${i + 1}. ${PRE_EXAM_CHECKLIST[i]}`, {
        size: 8.8,
        color: [51, 65, 85],
        afterGap: 1.5,
      });
    }
  }

  // ==================== SECTION 2: CURRICULUM THEORY & EXAMPLES ====================
  if (options.includeTheoryAndCode) {
    for (const mod of activeModules) {
      doc.addPage();
      y = TOP_Y;
      drawSectionBanner(
        `Modulo ${mod.number}`,
        `${mod.number}. ${mod.title}`,
        mod.description
      );

      for (const topic of mod.topics) {
        ensureSpace(32);
        drawTextLines(`${topic.code}. ${topic.title}`, {
          style: 'bold',
          size: 11.5,
          color: [15, 23, 42],
          afterGap: 1.5,
        });

        drawTextLines(topic.summary, {
          size: 9.4,
          color: [51, 65, 85],
          afterGap: 2,
        });

        drawTextLines('Pontos essenciais:', {
          style: 'bold',
          size: 9,
          color: [37, 99, 235],
          afterGap: 1,
        });
        for (let k = 0; k < topic.keyPoints.length; k++) {
          drawTextLines(`0${k + 1}. ${topic.keyPoints[k]}`, {
            x: MARGIN_X + 3,
            width: CONTENT_W - 3,
            size: 8.8,
            color: [51, 65, 85],
            afterGap: 1,
          });
        }
        y += 1.5;

        drawCodeBlock(topic.codeExample, topic.codeTitle);
        drawCalloutBox('Cuidado na prova', topic.pitfall, 'amber');
        y += 2;
      }
    }
  }

  // ==================== SECTION 3: STEP-BY-STEP SOLVED QUESTIONS ====================
  if (options.includeSolvedQuestions && filteredQuestions.length > 0) {
    doc.addPage();
    y = TOP_Y;
    drawSectionBanner(
      'Pratica Dirigida',
      'Questoes Comentadas Passo a Passo (Facil a Complexa)',
      'Leia o enunciado e a interpretacao, tente resolver no papel e confira o passo a passo.'
    );

    for (let qi = 0; qi < filteredQuestions.length; qi++) {
      const q = filteredQuestions[qi];
      ensureSpace(38);

      drawTextLines(
        `Q${qi + 1} [${DIFFICULTY_LABELS[q.difficulty]} | Topico ${q.topicCode}] - ${q.title}`,
        {
          style: 'bold',
          size: 10.5,
          color: [15, 23, 42],
          afterGap: 1.5,
        }
      );

      drawTextLines(q.question, {
        size: 9.2,
        color: [30, 41, 59],
        afterGap: 2,
      });

      drawCalloutBox('Como interpretar na prova', q.interpretation, 'blue');

      if (q.codeSnippet) {
        drawCodeBlock(q.codeSnippet, 'Trecho para analise');
      }

      drawTextLines(`Resposta correta: ${q.options[q.correctIndex]}`, {
        style: 'bold',
        size: 9.2,
        color: [4, 120, 87],
        afterGap: 1,
      });

      drawTextLines(`Resumo: ${q.explanation}`, {
        size: 8.8,
        color: [51, 65, 85],
        afterGap: 1.5,
      });

      drawTextLines('Resolucao passo a passo:', {
        style: 'bold',
        size: 8.8,
        color: [37, 99, 235],
        afterGap: 0.8,
      });
      for (let si = 0; si < q.stepByStep.length; si++) {
        drawTextLines(`0${si + 1}. ${q.stepByStep[si]}`, {
          x: MARGIN_X + 3,
          width: CONTENT_W - 3,
          size: 8.6,
          color: [51, 65, 85],
          afterGap: 0.8,
        });
      }

      y += 1;
      drawCodeBlock(
        q.solutionCode,
        `Solucao completa em C (Saida esperada: ${q.expectedOutput})`
      );
      y += 3;
    }
  }

  // ==================== SECTION 4: FLASHCARDS RAPID REVIEW ====================
  if (options.includeFlashcards && filteredFlashcards.length > 0) {
    doc.addPage();
    y = TOP_Y;
    drawSectionBanner(
      'Memorizacao Rapida',
      'Cartoes de Revisao de Vespera (Pergunta e Resposta)',
      'Cubra a resposta para testar sua memoria ativa antes da avaliacao.'
    );

    for (let fi = 0; fi < filteredFlashcards.length; fi++) {
      const card = filteredFlashcards[fi];
      ensureSpace(20);

      drawTextLines(`Cartao ${fi + 1} [Topico ${card.topicCode}]: ${card.front}`, {
        style: 'bold',
        size: 9.3,
        color: [15, 23, 42],
        afterGap: 1,
      });
      drawTextLines(`Resposta: ${card.back}`, {
        x: MARGIN_X + 3,
        width: CONTENT_W - 3,
        size: 8.8,
        color: [51, 65, 85],
        afterGap: 3,
      });
    }
  }

  // Stamp running header & footer across all pages
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    if (p > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(100, 116, 139);
      doc.text('Estudio C  |  Guia de Preparacao para Provas em C', MARGIN_X, 11);
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN_X, 13.5, PAGE_W - MARGIN_X, 13.5);
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(MARGIN_X, PAGE_H - 12, PAGE_W - MARGIN_X, PAGE_H - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Material de estudo gerado pelo Estudio C',
      MARGIN_X,
      PAGE_H - 7.5
    );
    doc.text(
      `Pagina ${p} de ${pageCount}`,
      PAGE_W - MARGIN_X - 20,
      PAGE_H - 7.5
    );
  }

  const suffix =
    activeModules.length === CURRICULUM.length
      ? 'completo'
      : `modulos-${activeModules.map((m) => m.number).join('-')}`;
  const fileName = `guia-prova-c-${suffix}.pdf`;

  return {
    doc,
    fileName,
    pageCount,
    stats: {
      modules: activeModules.length,
      topics: totalTopics,
      questions: filteredQuestions.length,
      flashcards: filteredFlashcards.length,
    },
  };
}

export function downloadExamGuidePdf(
  options?: Partial<ExamGuideOptions>
): BuiltExamPdf {
  const built = buildExamPdfDocument(options);
  built.doc.save(built.fileName);
  return built;
}
