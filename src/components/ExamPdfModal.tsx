import React, { useEffect, useMemo, useState } from 'react';
import { CURRICULUM } from '../data/curriculum';
import { FLASHCARDS, QUIZ_QUESTIONS } from '../data/memorizeAndQuiz';
import {
  DEFAULT_EXAM_GUIDE_OPTIONS,
  downloadExamGuidePdf,
  type BuiltExamPdf,
  type ExamGuideOptions,
} from '../utils/examPdfGenerator';
import { CheckCircle2, FileDown, X } from 'lucide-react';

interface ExamPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamPdfModal({ isOpen, onClose }: ExamPdfModalProps) {
  const [options, setOptions] = useState<ExamGuideOptions>(
    DEFAULT_EXAM_GUIDE_OPTIONS
  );
  const [generatedInfo, setGeneratedInfo] = useState<BuiltExamPdf | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const previewCounts = useMemo(() => {
    const modSet = new Set(options.selectedModuleNumbers);
    const activeMods = CURRICULUM.filter((m) => modSet.has(m.number));
    const topics = options.includeTheoryAndCode
      ? activeMods.reduce((acc, m) => acc + m.topics.length, 0)
      : 0;
    const questions = options.includeSolvedQuestions
      ? QUIZ_QUESTIONS.filter((q) => modSet.has(q.moduleNumber)).length
      : 0;
    const flashcards = options.includeFlashcards
      ? FLASHCARDS.filter((c) => modSet.has(c.moduleNumber)).length
      : 0;

    return {
      modules: activeMods.length,
      topics,
      questions,
      flashcards,
    };
  }, [options]);

  if (!isOpen) return null;

  const hasAnySection =
    options.includeStrategiesAndTraps ||
    options.includeTheoryAndCode ||
    options.includeSolvedQuestions ||
    options.includeFlashcards;

  const canGenerate =
    options.selectedModuleNumbers.length > 0 && hasAnySection;

  const toggleModule = (modNum: string) => {
    setGeneratedInfo(null);
    setOptions((prev) => {
      const exists = prev.selectedModuleNumbers.includes(modNum);
      const next = exists
        ? prev.selectedModuleNumbers.filter((n) => n !== modNum)
        : [...prev.selectedModuleNumbers, modNum].sort();
      return { ...prev, selectedModuleNumbers: next };
    });
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setErrorMsg(null);
    try {
      const built = downloadExamGuidePdf(options);
      setGeneratedInfo(built);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Não foi possível gerar o arquivo PDF.'
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exam-pdf-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="exam-pdf-modal-title"
              className="font-display text-lg font-bold text-slate-900 sm:text-xl"
            >
              Gerar Guia de Estudo para Prova (PDF)
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Exporte um PDF organizado com método de Teste de Mesa, pegadinhas clássicas, tabelas de consulta rápida, resumos e questões comentadas passo a passo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de geração de PDF"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-700">
              Seções do guia de prova
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={options.includeStrategiesAndTraps}
                  onChange={(e) => {
                    setGeneratedInfo(null);
                    setOptions((p) => ({
                      ...p,
                      includeStrategiesAndTraps: e.target.checked,
                    }));
                  }}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span>
                  <strong className="block font-semibold text-slate-900">
                    Estratégia, Teste de Mesa e Pegadinhas
                  </strong>
                  Como rastrear no papel, Top 10 erros de prova, tipos e precedência.
                </span>
              </label>

              <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={options.includeTheoryAndCode}
                  onChange={(e) => {
                    setGeneratedInfo(null);
                    setOptions((p) => ({
                      ...p,
                      includeTheoryAndCode: e.target.checked,
                    }));
                  }}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span>
                  <strong className="block font-semibold text-slate-900">
                    Teoria e Exemplos Comentados
                  </strong>
                  Resumo objetivo, pontos-chave, código C e alertas por tópico.
                </span>
              </label>

              <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={options.includeSolvedQuestions}
                  onChange={(e) => {
                    setGeneratedInfo(null);
                    setOptions((p) => ({
                      ...p,
                      includeSolvedQuestions: e.target.checked,
                    }));
                  }}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span>
                  <strong className="block font-semibold text-slate-900">
                    Questões Resolvidas Passo a Passo
                  </strong>
                  Fácil a Complexa com interpretação e código-solução completo.
                </span>
              </label>

              <label className="flex items-start gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={options.includeFlashcards}
                  onChange={(e) => {
                    setGeneratedInfo(null);
                    setOptions((p) => ({
                      ...p,
                      includeFlashcards: e.target.checked,
                    }));
                  }}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span>
                  <strong className="block font-semibold text-slate-900">
                    Cartões de Revisão Rápida
                  </strong>
                  Perguntas diretas e respostas para revisão de véspera.
                </span>
              </label>
            </div>
          </div>

          {/* Module filter */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">
                Módulos que vão cair na sua prova
              </h3>
              <div className="flex items-center gap-3 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedInfo(null);
                    setOptions((p) => ({
                      ...p,
                      selectedModuleNumbers: CURRICULUM.map((m) => m.number),
                    }));
                  }}
                  className="font-medium text-blue-600 hover:underline whitespace-nowrap shrink-0"
                >
                  Selecionar todos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedInfo(null);
                    setOptions((p) => ({
                      ...p,
                      selectedModuleNumbers: [],
                    }));
                  }}
                  className="font-medium text-slate-500 hover:text-slate-800 hover:underline whitespace-nowrap shrink-0"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CURRICULUM.map((mod) => {
                const selected = options.selectedModuleNumbers.includes(
                  mod.number
                );
                return (
                  <button
                    key={mod.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleModule(mod.number)}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      selected
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono mr-1.5">{mod.number}.</span>
                      {mod.title}
                    </span>
                    <span className="text-[11px] tabular-nums shrink-0 opacity-75">
                      {mod.topics.length} tóp.
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary line */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 tabular-nums">
            Resumo do documento:{' '}
            <strong className="font-semibold text-slate-900">
              {previewCounts.modules} módulo(s)
            </strong>{' '}
            · {previewCounts.topics} subtópicos · {previewCounts.questions}{' '}
            questões comentadas · {previewCounts.flashcards} cartões
          </div>

          {!canGenerate && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
              Selecione pelo menos 1 módulo e 1 seção acima para gerar o PDF.
            </div>
          )}

          {errorMsg && (
            <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs text-rose-900">
              {errorMsg}
            </div>
          )}

          {generatedInfo && (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-lg border border-emerald-500 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-950"
            >
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <span>
                PDF gerado com sucesso:{' '}
                <strong className="font-mono">{generatedInfo.fileName}</strong> (
                {generatedInfo.pageCount} páginas). Verifique seus downloads.
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            Baixar Guia de Prova (.pdf)
          </button>
        </div>
      </div>
    </div>
  );
}
