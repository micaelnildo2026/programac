import React, { useState } from 'react';
import type { Module, Topic } from '../data/curriculum';
import { LabRenderer } from './labs/LabRenderer';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
} from 'lucide-react';

interface TopicWorkspaceProps {
  module: Module;
  topic: Topic;
  isCompleted: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  onToggleComplete: (topicId: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function TopicWorkspace({
  module,
  topic,
  isCompleted,
  hasPrev,
  hasNext,
  onToggleComplete,
  onPrev,
  onNext,
}: TopicWorkspaceProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(topic.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="space-y-6">
      <header className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-slate-500">
            Módulo {module.number} · {module.title} · Tópico {topic.code}
          </div>

          <button
            type="button"
            onClick={() => onToggleComplete(topic.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isCompleted
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {isCompleted ? 'Tópico concluído' : 'Marcar como concluído'}
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {topic.code}. {topic.title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {topic.summary}
        </p>
      </header>

      {/* Primary Visual Interactive Lab Stage */}
      <section
        aria-label={`Laboratório interativo: ${topic.labTitle}`}
        className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
      >
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            {topic.labTitle}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">{topic.labSubtitle}</p>
        </div>
        <LabRenderer labId={topic.labId} />
      </section>

      {/* Two-column synthesis: Key Points + Pitfall on left, C Code Reference on right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Pontos essenciais para memorizar
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
              {topic.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1 font-mono text-xs font-semibold text-blue-600 tabular-nums">
                    0{idx + 1}.
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Erro clássico em provas e compilação
            </div>
            <p className="mt-2 text-sm leading-relaxed text-amber-950">
              {topic.pitfall}
            </p>
          </section>
        </div>

        <section className="flex flex-col rounded-xl border border-slate-200 bg-slate-900 text-slate-100 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <span className="text-xs font-medium text-slate-300">
              {topic.codeTitle}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copiar C
                </>
              )}
            </button>
          </div>
          <pre className="flex-1 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-100">
            <code>{topic.codeExample}</code>
          </pre>
        </section>
      </div>

      <footer className="flex items-center justify-between border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Tópico anterior
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          Próximo tópico
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </footer>
    </article>
  );
}
