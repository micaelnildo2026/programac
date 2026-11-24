import React, { useMemo, useState } from 'react';
import { FLASHCARDS, type FlashcardItem } from '../data/memorizeAndQuiz';
import { CURRICULUM } from '../data/curriculum';
import {
  calculateNextReview,
  type ProgressMap,
  type RecallQuality,
} from '../utils/spacedRepetition';
import { CheckCircle2, RotateCw } from 'lucide-react';

interface MemorizeViewProps {
  cardProgress: ProgressMap;
  onRateCard: (cardId: string, updated: ProgressMap[string]) => void;
  onResetProgress: () => void;
}

export function MemorizeView({
  cardProgress,
  onRateCard,
  onResetProgress,
}: MemorizeViewProps) {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filteredCards = useMemo<FlashcardItem[]>(() => {
    if (selectedModule === 'all') return FLASHCARDS;
    return FLASHCARDS.filter((c) => c.moduleNumber === selectedModule);
  }, [selectedModule]);

  const safeIndex =
    filteredCards.length > 0 ? currentIndex % filteredCards.length : 0;
  const currentCard = filteredCards[safeIndex];

  const masteredInFilter = filteredCards.filter(
    (c) => cardProgress[c.id]?.mastered
  ).length;
  const reviewedInFilter = filteredCards.filter(
    (c) => Boolean(cardProgress[c.id])
  ).length;

  const handleRate = (quality: RecallQuality) => {
    if (!currentCard) return;
    const next = calculateNextReview(cardProgress[currentCard.id], quality);
    onRateCard(currentCard.id, next);
    setFlipped(false);
    setCurrentIndex((idx) => (idx + 1) % filteredCards.length);
  };

  return (
    <section
      aria-label="Modo de memorização com flashcards"
      className="mx-auto max-w-4xl space-y-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Repetição Espaçada em C
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Revise conceitos-chave, armadilhas de ponteiros e regras de memória com agendamento ativo.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 tabular-nums">
          <span>
            Revisados:{' '}
            <strong className="font-semibold text-slate-900">
              {reviewedInFilter}
            </strong>
          </span>
          <span>
            Dominados:{' '}
            <strong className="font-semibold text-slate-900">
              {masteredInFilter} / {filteredCards.length}
            </strong>
          </span>
          <button
            type="button"
            onClick={onResetProgress}
            className="font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Zerar revisões
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            setSelectedModule('all');
            setCurrentIndex(0);
            setFlipped(false);
          }}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedModule === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todos ({FLASHCARDS.length})
        </button>
        {CURRICULUM.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => {
              setSelectedModule(mod.number);
              setCurrentIndex(0);
              setFlipped(false);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedModule === mod.number
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Módulo {mod.number}
          </button>
        ))}
      </div>

      {currentCard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
            <span>
              Cartão {safeIndex + 1} de {filteredCards.length} · Tópico{' '}
              {currentCard.topicCode}
            </span>
            {cardProgress[currentCard.id]?.mastered && (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Memorizado
              </span>
            )}
          </div>

          <div className="perspective-1000">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              aria-label={
                flipped
                  ? 'Cartão mostrando resposta. Clique para voltar à pergunta.'
                  : 'Cartão mostrando pergunta. Clique para revelar resposta.'
              }
              className="relative block min-h-[260px] w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
            >
              <div
                className={`transform-style-3d relative min-h-[260px] w-full transition-transform duration-300 ${
                  flipped ? 'rotate-y-180' : ''
                }`}
              >
                <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="text-xs font-medium text-slate-500">
                    Módulo {currentCard.moduleNumber} · Tópico {currentCard.topicCode}
                  </div>
                  <div className="my-auto py-4 font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                    {currentCard.front}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Clique para revelar a resposta
                  </div>
                </div>

                <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-xl border border-blue-200 bg-slate-900 p-6 text-slate-100 sm:p-8">
                  <div className="text-xs font-medium text-blue-300">
                    Resposta · Tópico {currentCard.topicCode}
                  </div>
                  <div className="my-auto py-4 text-base leading-relaxed text-slate-100 sm:text-lg">
                    {currentCard.back}
                  </div>
                  <div className="text-xs text-slate-400">
                    Avalie seu nível de lembrança abaixo para agendar a próxima revisão.
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            {!flipped ? (
              <button
                type="button"
                onClick={() => setFlipped(true)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Mostrar resposta
              </button>
            ) : (
              <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => handleRate('again')}
                  className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-900 hover:bg-rose-100"
                >
                  Errei (Rever hoje)
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('hard')}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                >
                  Difícil (1 dia)
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('good')}
                  className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-900 hover:bg-blue-100"
                >
                  Bom (3 dias)
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('easy')}
                  className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                >
                  Fácil (6+ dias)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
