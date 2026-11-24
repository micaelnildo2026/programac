import React, { useEffect, useMemo, useState } from 'react';
import { ALL_TOPICS, CURRICULUM } from './data/curriculum';
import { FLASHCARDS } from './data/memorizeAndQuiz';
import {
  computeCurriculumStats,
  type ProgressMap,
} from './utils/spacedRepetition';
import { CurriculumDrawer } from './components/CurriculumDrawer';
import { TopicWorkspace } from './components/TopicWorkspace';
import { OverviewRoadmap } from './components/OverviewRoadmap';
import { MemorizeView } from './components/MemorizeView';
import { QuizView } from './components/QuizView';
import { CodePlaygroundView } from './components/CodePlaygroundView';
import { Menu, X } from 'lucide-react';

type ActiveSection =
  | 'trilha'
  | 'laboratorios'
  | 'memorizar'
  | 'desafios'
  | 'compilador';

const STORAGE_COMPLETED_KEY = 'estudio_c_completed_topics_v1';
const STORAGE_CARDS_KEY = 'estudio_c_flashcards_v1';
const STORAGE_LAST_TOPIC_KEY = 'estudio_c_last_topic_v1';

export default function App() {
  const [section, setSection] = useState<ActiveSection>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'laboratorios';
      }
    }
    return 'trilha';
  });

  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_LAST_TOPIC_KEY) || '1.1';
    } catch {
      return '1.1';
    }
  });

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_COMPLETED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [cardProgress, setCardProgress] = useState<ProgressMap>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CARDS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_COMPLETED_KEY,
        JSON.stringify(completedTopicIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [completedTopicIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(cardProgress));
    } catch {
      // Ignore storage quota errors
    }
  }, [cardProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LAST_TOPIC_KEY, activeTopicId);
    } catch {
      // Ignore storage quota errors
    }
  }, [activeTopicId]);

  const activeTopicIndex = useMemo(() => {
    const idx = ALL_TOPICS.findIndex((t) => t.id === activeTopicId);
    return idx >= 0 ? idx : 0;
  }, [activeTopicId]);

  const activeTopic = ALL_TOPICS[activeTopicIndex] ?? ALL_TOPICS[0];

  const activeModule = useMemo(() => {
    return (
      CURRICULUM.find((m) =>
        m.topics.some((t) => t.id === activeTopic.id)
      ) ?? CURRICULUM[0]
    );
  }, [activeTopic]);

  const stats = useMemo(
    () =>
      computeCurriculumStats(
        ALL_TOPICS.length,
        completedTopicIds,
        FLASHCARDS.length,
        cardProgress
      ),
    [completedTopicIds, cardProgress]
  );

  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setSection('laboratorios');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = (topicId: string) => {
    setCompletedTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleRateCard = (cardId: string, updated: ProgressMap[string]) => {
    setCardProgress((prev) => ({ ...prev, [cardId]: updated }));
  };

  const handleResetCards = () => {
    setCardProgress({});
  };

  const navItems: Array<{ id: ActiveSection; label: string }> = [
    { id: 'trilha', label: 'Trilha' },
    { id: 'laboratorios', label: 'Laboratórios' },
    { id: 'memorizar', label: 'Memorizar' },
    { id: 'desafios', label: 'Desafios' },
    { id: 'compilador', label: 'Compilador' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSection('trilha')}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            Estúdio C
          </button>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => {
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                    active
                      ? 'border-blue-600 text-slate-900 font-semibold'
                      : 'border-transparent hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectTopic(activeTopic.id)}
              className="hidden sm:inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              Continuar ({activeTopic.code})
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    section === item.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {section === 'laboratorios' && (
              <div className="mt-4 max-h-72 overflow-y-auto border-t border-slate-100 pt-3">
                <CurriculumDrawer
                  activeTopicId={activeTopic.id}
                  completedTopicIds={completedTopicIds}
                  onSelectTopic={handleSelectTopic}
                />
              </div>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {section === 'trilha' && (
          <OverviewRoadmap
            completedTopicIds={completedTopicIds}
            topicsPercent={stats.topicsPercent}
            masteredCardsCount={stats.masteredCardsCount}
            totalCards={FLASHCARDS.length}
            onSelectTopic={handleSelectTopic}
            onOpenMemorize={() => setSection('memorizar')}
            onOpenQuiz={() => setSection('desafios')}
            onOpenCompiler={() => setSection('compilador')}
          />
        )}

        {section === 'laboratorios' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-4 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
                <CurriculumDrawer
                  activeTopicId={activeTopic.id}
                  completedTopicIds={completedTopicIds}
                  onSelectTopic={handleSelectTopic}
                />
              </div>
            </aside>

            <div className="lg:col-span-8 xl:col-span-9">
              <div className="mb-4 flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Trocar tópico ({activeTopic.code})
                </button>
                <span className="text-xs text-slate-500 tabular-nums">
                  {completedTopicIds.length}/28 concluídos
                </span>
              </div>

              <TopicWorkspace
                module={activeModule}
                topic={activeTopic}
                isCompleted={completedTopicIds.includes(activeTopic.id)}
                hasPrev={activeTopicIndex > 0}
                hasNext={activeTopicIndex < ALL_TOPICS.length - 1}
                onToggleComplete={handleToggleComplete}
                onPrev={() =>
                  handleSelectTopic(ALL_TOPICS[activeTopicIndex - 1].id)
                }
                onNext={() =>
                  handleSelectTopic(ALL_TOPICS[activeTopicIndex + 1].id)
                }
              />
            </div>
          </div>
        )}

        {section === 'memorizar' && (
          <MemorizeView
            cardProgress={cardProgress}
            onRateCard={handleRateCard}
            onResetProgress={handleResetCards}
          />
        )}

        {section === 'desafios' && (
          <QuizView onSelectTopic={handleSelectTopic} />
        )}

        {section === 'compilador' && <CodePlaygroundView />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6">
          <span>Estúdio C · Plataforma visual para aprendizado de programação em C</span>
          <span className="tabular-nums">
            Progresso: {completedTopicIds.length}/28 tópicos ·{' '}
            {stats.masteredCardsCount}/{FLASHCARDS.length} cartões memorizados
          </span>
        </div>
      </footer>
    </div>
  );
}
