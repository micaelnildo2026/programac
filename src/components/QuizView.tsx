import React, { useMemo, useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/memorizeAndQuiz';
import { CURRICULUM } from '../data/curriculum';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

interface QuizViewProps {
  onSelectTopic?: (topicId: string) => void;
}

export function QuizView({ onSelectTopic }: QuizViewProps) {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  const questions = useMemo(() => {
    if (selectedModule === 'all') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.moduleNumber === selectedModule);
  }, [selectedModule]);

  const safeIdx = questions.length > 0 ? currentIdx % questions.length : 0;
  const currentQ = questions[safeIdx];
  const chosenOption = currentQ ? answers[currentQ.id] : undefined;
  const isAnswered = chosenOption !== undefined;

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  return (
    <section
      aria-label="Desafios práticos e simulado em C"
      className="mx-auto max-w-4xl space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Desafios & Rastreio de Código C
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Preveja saídas, interprete ponteiros e consolide o conteúdo com explicação imediata.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 tabular-nums">
          <span>
            Acertos:{' '}
            <strong className="font-semibold text-slate-900">
              {correctCount} / {answeredCount} respondidas
            </strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setCurrentIdx(0);
            }}
            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Refazer
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            setSelectedModule('all');
            setCurrentIdx(0);
          }}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
            selectedModule === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todos ({QUIZ_QUESTIONS.length})
        </button>
        {CURRICULUM.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setSelectedModule(m.number);
              setCurrentIdx(0);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
              selectedModule === m.number
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Módulo {m.number}
          </button>
        ))}
      </div>

      {currentQ ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 tabular-nums">
            <span>
              Questão {safeIdx + 1} de {questions.length} · Tópico{' '}
              {currentQ.topicCode}
            </span>
            {onSelectTopic && (
              <button
                type="button"
                onClick={() => onSelectTopic(currentQ.topicCode)}
                className="font-medium text-blue-600 hover:underline"
              >
                Abrir laboratório {currentQ.topicCode}
              </button>
            )}
          </div>

          <h2 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">
            {currentQ.question}
          </h2>

          {currentQ.codeSnippet && (
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          )}

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = chosenOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let styleClass =
                'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
              if (isAnswered) {
                if (isCorrect) {
                  styleClass = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
                } else if (isSelected) {
                  styleClass = 'border-rose-500 bg-rose-50 text-rose-950';
                } else {
                  styleClass = 'border-slate-200 bg-slate-50 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }))
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${styleClass}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Correta
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 shrink-0">
                      <XCircle className="h-4 w-4" aria-hidden="true" />
                      Incorreta
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <strong className="font-semibold text-slate-900">
                Explicação:{' '}
              </strong>
              {currentQ.explanation}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() =>
                setCurrentIdx((i) => (i - 1 + questions.length) % questions.length)
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setCurrentIdx((i) => (i + 1) % questions.length)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Próxima questão
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Nenhuma questão encontrada para este módulo.
        </div>
      )}
    </section>
  );
}
