import React, { useMemo, useState } from 'react';
import { QUIZ_QUESTIONS, type QuizQuestion } from '../data/memorizeAndQuiz';
import { CURRICULUM } from '../data/curriculum';
import {
  DIFFICULTY_LABELS,
  verifyChallengeRun,
  type ChallengeVerification,
  type CompileRunResponse,
  type QuestionDifficulty,
} from '../utils/cChallengeEval';
import { runCCode } from '../utils/compileClient';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileDown,
  Play,
  RotateCcw,
  Terminal,
  XCircle,
} from 'lucide-react';

interface QuizViewProps {
  onSelectTopic?: (topicId: string) => void;
  onOpenExamPdf?: () => void;
}

type DifficultyFilter = 'all' | QuestionDifficulty;

export function QuizView({ onSelectTopic, onOpenExamPdf }: QuizViewProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);

  // Per-question editable C code state and compilation results
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [runStates, setRunStates] = useState<
    Record<
      string,
      {
        running: boolean;
        response?: CompileRunResponse;
        verification?: ChallengeVerification;
        error?: string;
      }
    >
  >({});
  const [openStepByStep, setOpenStepByStep] = useState<Record<string, boolean>>({});

  const questions = useMemo<QuizQuestion[]>(() => {
    return QUIZ_QUESTIONS.filter((q) => {
      const matchDiff =
        selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchMod =
        selectedModule === 'all' || q.moduleNumber === selectedModule;
      return matchDiff && matchMod;
    });
  }, [selectedDifficulty, selectedModule]);

  const safeIdx = questions.length > 0 ? currentIdx % questions.length : 0;
  const currentQ = questions[safeIdx];
  const chosenOption = currentQ ? answers[currentQ.id] : undefined;
  const isAnswered = chosenOption !== undefined;

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const verifiedCodeCount = questions.filter(
    (q) => runStates[q.id]?.verification?.passed
  ).length;

  const currentCode = currentQ
    ? codeDrafts[currentQ.id] ?? currentQ.starterCode
    : '';
  const currentRun = currentQ ? runStates[currentQ.id] : undefined;
  const showSteps = currentQ
    ? Boolean(openStepByStep[currentQ.id] || isAnswered || currentRun?.verification?.passed)
    : false;

  const handleRunQuestionCode = async () => {
    if (!currentQ) return;
    const qId = currentQ.id;
    const source = codeDrafts[qId] ?? currentQ.starterCode;

    setRunStates((prev) => ({
      ...prev,
      [qId]: { running: true },
    }));

    try {
      const response = await runCCode(source, currentQ.testStdin ?? '');
      const verification = verifyChallengeRun(response, currentQ.expectedOutput);
      setRunStates((prev) => ({
        ...prev,
        [qId]: { running: false, response, verification },
      }));
    } catch (err) {
      setRunStates((prev) => ({
        ...prev,
        [qId]: {
          running: false,
          error: err instanceof Error ? err.message : 'Falha ao compilar código.',
        },
      }));
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!currentQ) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuestionCode();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = currentCode.slice(0, start) + '    ' + currentCode.slice(end);
      setCodeDrafts((prev) => ({ ...prev, [currentQ.id]: updated }));
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const difficultyCounts = useMemo(() => {
    const counts: Record<QuestionDifficulty, number> = {
      facil: 0,
      media: 0,
      dificil: 0,
      complexa: 0,
    };
    for (const q of QUIZ_QUESTIONS) {
      counts[q.difficulty]++;
    }
    return counts;
  }, []);

  return (
    <section
      aria-label="Desafios práticos e simulado em C"
      className="mx-auto max-w-5xl space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Desafios com Interpretação e Compilação Real
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Resolva questões graduadas de Fácil a Complexa, leia a solução passo a passo e valide seu próprio código C no GCC.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 tabular-nums">
          <span>
            Objetivas:{' '}
            <strong className="font-semibold text-slate-900">
              {correctCount} / {answeredCount}
            </strong>
          </span>
          <span>
            Códigos validados:{' '}
            <strong className="font-semibold text-emerald-700">
              {verifiedCodeCount} / {questions.length}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setRunStates({});
              setOpenStepByStep({});
              setCurrentIdx(0);
            }}
            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Refazer
          </button>
          {onOpenExamPdf && (
            <button
              type="button"
              onClick={onOpenExamPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <FileDown className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              Gerar PDF para prova
            </button>
          )}
        </div>
      </div>

      {/* Difficulty & Module Filters */}
      <div className="space-y-3">
        <div
          role="group"
          aria-label="Filtrar por nível de dificuldade"
          className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1"
        >
          <button
            type="button"
            onClick={() => {
              setSelectedDifficulty('all');
              setCurrentIdx(0);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDifficulty === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({QUIZ_QUESTIONS.length})
          </button>
          {(['facil', 'media', 'dificil', 'complexa'] as QuestionDifficulty[]).map(
            (diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentIdx(0);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {DIFFICULTY_LABELS[diff]} ({difficultyCounts[diff]})
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedModule('all');
              setCurrentIdx(0);
            }}
            className={`rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
              selectedModule === 'all'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos os módulos
          </button>
          {CURRICULUM.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedModule(m.number);
                setCurrentIdx(0);
              }}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                selectedModule === m.number
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
              }`}
            >
              Mód. {m.number}
            </button>
          ))}
        </div>
      </div>

      {currentQ ? (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 tabular-nums">
              <span>
                Questão {safeIdx + 1} de {questions.length} · Nível{' '}
                <strong className="font-semibold text-slate-800">
                  {DIFFICULTY_LABELS[currentQ.difficulty]}
                </strong>{' '}
                · Tópico {currentQ.topicCode}
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

            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 sm:text-xl">
                {currentQ.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-800 sm:text-base">
                {currentQ.question}
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
              <div className="mb-1 inline-flex items-center gap-1.5 font-semibold text-blue-900">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Interpretação do problema
              </div>
              <p>{currentQ.interpretation}</p>
            </div>

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
                    styleClass =
                      'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
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

            {/* Step-by-step walkthrough & explanation */}
            <div className="border-t border-slate-100 pt-4">
              <button
                type="button"
                aria-expanded={showSteps}
                onClick={() =>
                  setOpenStepByStep((prev) => ({
                    ...prev,
                    [currentQ.id]: !showSteps,
                  }))
                }
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                {showSteps ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
                {showSteps
                  ? 'Ocultar resposta passo a passo'
                  : 'Ver resposta passo a passo com explicação'}
              </button>

              {showSteps && (
                <div className="mt-3 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-800">
                    <strong className="font-semibold text-slate-900">
                      Resumo:{' '}
                    </strong>
                    {currentQ.explanation}
                  </p>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">
                      Raciocínio passo a passo:
                    </div>
                    <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                      {currentQ.stepByStep.map((stepText, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
                            0{sIdx + 1}.
                          </span>
                          <span>{stepText}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Per-question Live C Coding & Verification Workspace */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Prática em C: digite e verifique seu código rodando
                </h3>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {currentQ.codingPrompt}
                </p>
              </div>
              <div className="font-mono text-xs text-slate-500">
                Saída esperada:{' '}
                <strong className="text-slate-900">{currentQ.expectedOutput}</strong>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-300">
                <span className="font-mono">desafio_{currentQ.id}.c</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCodeDrafts((prev) => ({
                        ...prev,
                        [currentQ.id]: currentQ.starterCode,
                      }));
                      setRunStates((prev) => {
                        const next = { ...prev };
                        delete next[currentQ.id];
                        return next;
                      });
                    }}
                    className="text-xs text-slate-300 hover:text-white"
                  >
                    Restaurar inicial
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCodeDrafts((prev) => ({
                        ...prev,
                        [currentQ.id]: currentQ.solutionCode,
                      }))
                    }
                    className="text-xs font-medium text-blue-300 hover:text-blue-200"
                  >
                    Carregar solução
                  </button>
                </div>
              </div>
              <label htmlFor={`code-editor-${currentQ.id}`} className="sr-only">
                Editor de código C para a questão {currentQ.title}
              </label>
              <textarea
                id={`code-editor-${currentQ.id}`}
                value={currentCode}
                onChange={(e) =>
                  setCodeDrafts((prev) => ({
                    ...prev,
                    [currentQ.id]: e.target.value,
                  }))
                }
                onKeyDown={handleCodeKeyDown}
                rows={11}
                spellCheck={false}
                className="w-full resize-y bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Dica: use Tab para indentar e Ctrl+Enter para compilar e executar.
              </span>
              <button
                type="button"
                onClick={handleRunQuestionCode}
                disabled={currentRun?.running}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                {currentRun?.running
                  ? 'Compilando e executando...'
                  : 'Compilar e verificar código'}
              </button>
            </div>

            {currentRun && !currentRun.running && (
              <div aria-live="polite" className="space-y-3">
                {currentRun.error && (
                  <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-900">
                    {currentRun.error}
                  </div>
                )}

                {currentRun.verification && (
                  <div
                    className={`rounded-lg border p-4 text-xs sm:text-sm ${
                      currentRun.verification.passed
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                        : 'border-rose-300 bg-rose-50 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {currentRun.verification.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-700" aria-hidden="true" />
                      )}
                      <span>{currentRun.verification.statusLabel}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed">
                      {currentRun.verification.details}
                    </p>
                  </div>
                )}

                {currentRun.response && (
                  <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-100">
                    <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-slate-300">
                        <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                        Saída da execução
                      </span>
                      <span className="tabular-nums">
                        {currentRun.response.durationMs}ms
                      </span>
                    </div>
                    {currentRun.response.stderr && (
                      <pre className="mb-2 whitespace-pre-wrap text-amber-300">
                        {currentRun.response.stderr}
                      </pre>
                    )}
                    {currentRun.response.compiled && (
                      <pre className="whitespace-pre-wrap text-emerald-300">
                        {currentRun.response.stdout || '(saída vazia)'}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCurrentIdx((i) => (i - 1 + questions.length) % questions.length)
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Questão anterior
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
          Nenhuma questão encontrada para a combinação selecionada de nível e módulo.
        </div>
      )}
    </section>
  );
}
