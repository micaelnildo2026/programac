import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNextReview,
  computeCurriculumStats,
} from './spacedRepetition';

test('calculateNextReview schedules intervals and mastery accurately', () => {
  const t0 = 1_700_000_000_000;
  const first = calculateNextReview(undefined, 'good', t0);
  assert.equal(first.repetitions, 1);
  assert.equal(first.intervalDays, 1);
  assert.equal(first.mastered, false);

  const second = calculateNextReview(first, 'good', t0);
  assert.equal(second.repetitions, 2);
  assert.equal(second.intervalDays, 3);
  assert.equal(second.mastered, true);

  const reset = calculateNextReview(second, 'again', t0);
  assert.equal(reset.repetitions, 0);
  assert.equal(reset.mastered, false);
});

test('computeCurriculumStats aggregates topic and card progress', () => {
  const stats = computeCurriculumStats(
    28,
    ['1.1', '1.2', '1.1'],
    10,
    {
      c1: {
        intervalDays: 3,
        easeFactor: 2.5,
        repetitions: 2,
        mastered: true,
        lastReviewedAt: 1,
        nextReviewAt: 2,
      },
      c2: {
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 1,
        mastered: false,
        lastReviewedAt: 1,
        nextReviewAt: 2,
      },
    }
  );
  assert.equal(stats.topicsPercent, 7);
  assert.equal(stats.masteredCardsCount, 1);
  assert.equal(stats.cardsPercent, 10);
});
