/** Game-agnostic quiz helpers, shared by the colors/animals/alphabet games. */

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface QuizRound<T> {
  target: T;
  choices: T[];
}

/**
 * Builds `roundCount` rounds with distinct targets. Each round has
 * `choiceCount` distinct options, one of which is the target.
 */
export function createRounds<T>(
  pool: readonly T[],
  roundCount: number,
  choiceCount: number,
  rng: Rng = Math.random,
): QuizRound<T>[] {
  const targets = shuffle(pool, rng).slice(0, Math.min(roundCount, pool.length));
  return targets.map((target) => {
    const distractors = shuffle(
      pool.filter((item) => item !== target),
      rng,
    ).slice(0, choiceCount - 1);
    return { target, choices: shuffle([target, ...distractors], rng) };
  });
}
