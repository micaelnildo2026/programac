import React from 'react';
import { CURRICULUM } from '../data/curriculum';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface OverviewRoadmapProps {
  completedTopicIds: string[];
  topicsPercent: number;
  masteredCardsCount: number;
  totalCards: number;
  onSelectTopic: (topicId: string) => void;
  onOpenMemorize: () => void;
  onOpenQuiz: () => void;
  onOpenCompiler: () => void;
}

export function OverviewRoadmap({
  completedTopicIds,
  topicsPercent,
  masteredCardsCount,
  totalCards,
  onSelectTopic,
  onOpenMemorize,
  onOpenQuiz,
  onOpenCompiler,
}: OverviewRoadmapProps) {
  const completedSet = new Set(completedTopicIds);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="grid grid-cols-1 gap-8 border-b border-slate-200 pb-8 lg:grid-cols-12 lg:items-end">
        <div className="space-y-3 lg:col-span-8">
          <p className="text-xs font-semibold text-blue-700">
            Currículo completo de programação em C · 7 módulos · 28 laboratórios
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Domine a linguagem C vendo o que acontece na memória
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">
            Cada subtópico combina teoria direta, simulador visual interativo de bits, laços, pilha de chamadas, ponteiros e arquivos, além de flashcards espaçados e compilador C real.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => onSelectTopic('1.1')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Explorar laboratórios
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenQuiz}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Resolver desafios
            </button>
            <button
              type="button"
              onClick={onOpenCompiler}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Compilador C
            </button>
            <button
              type="button"
              onClick={onOpenMemorize}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Revisar flashcards
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Tópicos concluídos</div>
            <div className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900">
              {completedTopicIds.length} / 28
            </div>
            <div className="mt-1 text-xs font-medium text-blue-700 tabular-nums">
              {topicsPercent}% da trilha
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Cartões dominados</div>
            <div className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900">
              {masteredCardsCount} / {totalCards}
            </div>
            <div className="mt-1 text-xs font-medium text-emerald-700">
              Memorização ativa
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Mapa curricular dos 7 módulos" className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {CURRICULUM.map((mod) => {
          const doneInMod = mod.topics.filter((t) =>
            completedSet.has(t.id)
          ).length;

          return (
            <div
              key={mod.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                  <span>Módulo {mod.number}</span>
                  <span>
                    {doneInMod} / {mod.topics.length} concluídos
                  </span>
                </div>
                <h2 className="mt-1.5 font-display text-xl font-semibold text-slate-900">
                  {mod.number}. {mod.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {mod.description}
                </p>

                <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                  {mod.topics.map((topic) => {
                    const done = completedSet.has(topic.id);
                    return (
                      <li key={topic.id}>
                        <button
                          type="button"
                          onClick={() => onSelectTopic(topic.id)}
                          className="flex w-full items-center justify-between gap-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:text-blue-700 transition-colors"
                        >
                          <span>
                            <span className="font-mono text-slate-400 mr-1.5">
                              {topic.code}
                            </span>{' '}
                            {topic.title}
                          </span>
                          {done ? (
                            <CheckCircle2
                              className="h-4 w-4 shrink-0 text-emerald-600"
                              aria-label="Concluído"
                            />
                          ) : (
                            <ArrowRight
                              className="h-3.5 w-3.5 shrink-0 text-slate-300"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
