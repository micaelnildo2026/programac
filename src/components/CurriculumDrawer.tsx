import React, { useMemo, useState } from 'react';
import { CURRICULUM } from '../data/curriculum';
import { Check, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface CurriculumDrawerProps {
  activeTopicId: string;
  completedTopicIds: string[];
  onSelectTopic: (topicId: string) => void;
}

export function CurriculumDrawer({
  activeTopicId,
  completedTopicIds,
  onSelectTopic,
}: CurriculumDrawerProps) {
  const [query, setQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'mod-3': true,
    'mod-4': true,
    'mod-5': true,
    'mod-6': true,
    'mod-7': true,
  });

  const filteredCurriculum = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRICULUM;
    return CURRICULUM.map((mod) => ({
      ...mod,
      topics: mod.topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q)
      ),
    })).filter(
      (mod) => mod.topics.length > 0 || mod.title.toLowerCase().includes(q)
    );
  }, [query]);

  const completedSet = useMemo(
    () => new Set(completedTopicIds),
    [completedTopicIds]
  );

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <nav aria-label="Trilha completa de programação em C" className="space-y-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar tópico (ex: ponteiro, for, fopen)..."
          aria-label="Filtrar tópicos da trilha"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        {filteredCurriculum.map((mod) => {
          const isOpen = query.trim().length > 0 || expandedModules[mod.id];
          const doneCount = mod.topics.filter((t) =>
            completedSet.has(t.id)
          ).length;

          return (
            <div key={mod.id} className="border-b border-slate-200/80 pb-2 last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleModule(mod.id)}
                className="flex w-full items-start justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-100/80 transition-colors"
              >
                <div>
                  <div className="text-[11px] font-medium text-slate-500 tabular-nums">
                    Módulo {mod.number} · {doneCount}/{mod.topics.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 leading-snug">
                    {mod.title}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                ) : (
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                )}
              </button>

              {isOpen && (
                <ul className="mt-1 space-y-0.5 pl-1">
                  {mod.topics.map((topic) => {
                    const isActive = topic.id === activeTopicId;
                    const isDone = completedSet.has(topic.id);

                    return (
                      <li key={topic.id}>
                        <button
                          type="button"
                          onClick={() => onSelectTopic(topic.id)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex w-full items-start justify-between gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                            isActive
                              ? 'bg-blue-50 font-semibold text-blue-900'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="leading-snug">
                            <span className="font-mono text-[11px] opacity-75">
                              {topic.code}
                            </span>{' '}
                            {topic.title}
                          </span>
                          {isDone && (
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                              aria-label="Concluído"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
