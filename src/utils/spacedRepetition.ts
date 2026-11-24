export type RecallQuality = 'again' | 'hard' | 'good' | 'easy';

export interface FlashcardProgress {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  mastered: boolean;
  lastReviewedAt: number;
  nextReviewAt: number;
}

export type ProgressMap = Record<string, FlashcardProgress>;

export function calculateNextReview(
  current: FlashcardProgress | undefined,
  quality: RecallQuality,
  nowMs: number = Date.now()
): FlashcardProgress {
  const prevEase = current?.easeFactor ?? 2.5;
  const prevReps = current?.repetitions ?? 0;
  const prevInterval = current?.intervalDays ?? 0;

  let repetitions = prevReps;
  let intervalDays = prevInterval;
  let easeFactor = prevEase;

  if (quality === 'again') {
    repetitions = 0;
    intervalDays = 0;
    easeFactor = Math.max(1.3, prevEase - 0.2);
  } else if (quality === 'hard') {
    repetitions = prevReps + 1;
    intervalDays = prevReps === 0 ? 1 : Math.max(1, Math.round(prevInterval * 1.2));
    easeFactor = Math.max(1.3, prevEase - 0.15);
  } else if (quality === 'good') {
    repetitions = prevReps + 1;
    if (prevReps === 0) intervalDays = 1;
    else if (prevReps === 1) intervalDays = 3;
    else intervalDays = Math.round(prevInterval * prevEase);
  } else {
    // easy
    repetitions = prevReps + 1;
    if (prevReps === 0) intervalDays = 3;
    else if (prevReps === 1) intervalDays = 6;
    else intervalDays = Math.round(prevInterval * prevEase * 1.3);
    easeFactor = prevEase + 0.15;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  return {
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    repetitions,
    mastered: repetitions >= 2 && quality !== 'again',
    lastReviewedAt: nowMs,
    nextReviewAt: nowMs + intervalDays * dayMs,
  };
}

export function computeCurriculumStats(
  totalTopics: number,
  completedTopicIds: string[],
  totalCards: number,
  cardProgress: ProgressMap
): {
  topicsPercent: number;
  masteredCardsCount: number;
  cardsPercent: number;
} {
  const uniqueCompleted = new Set(completedTopicIds);
  const topicsPercent =
    totalTopics > 0 ? Math.round((uniqueCompleted.size / totalTopics) * 100) : 0;

  const masteredCardsCount = Object.values(cardProgress).filter(
    (p) => p.mastered
  ).length;
  const cardsPercent =
    totalCards > 0 ? Math.round((masteredCardsCount / totalCards) * 100) : 0;

  return {
    topicsPercent,
    masteredCardsCount,
    cardsPercent,
  };
}
