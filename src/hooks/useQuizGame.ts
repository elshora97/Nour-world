import { useCallback, useEffect, useRef, useState } from 'react';
import type { MascotReaction } from '../components/Character/Mascot';
import { correctBadge, tryAgainLines, type VoiceLine } from '../data/feedback';
import { playSuccess, playVoice, playWrong } from '../lib/audio';
import { createRounds } from '../lib/quiz';

export const QUIZ_ROUNDS = 5;
const CHOICES = 3;
const PAUSE_AFTER_PRAISE_MS = 500;

export type QuizPhase = 'asking' | 'celebrating' | 'finished';

interface QuizOptions<T> {
  /** Must be a stable (module-level) array. */
  pool: readonly T[];
  prompt: (item: T) => VoiceLine;
  praise: (item: T) => VoiceLine;
}

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/**
 * "Find the X" game loop shared by every quiz game: ask, react gently to
 * misses, celebrate a hit, move on after the praise finishes, then reward.
 */
export function useQuizGame<T extends { id: string }>({ pool, prompt, praise }: QuizOptions<T>) {
  const [rounds, setRounds] = useState(() => createRounds(pool, QUIZ_ROUNDS, CHOICES));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>('asking');
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [wrongTap, setWrongTap] = useState<{ id: string; n: number } | null>(null);
  const [reaction, setReaction] = useState<MascotReaction | null>(null);
  const [confettiId, setConfettiId] = useState(0);
  /** Bumped on every answer/restart/unmount so stale async steps bail out. */
  const turn = useRef(0);

  const round = rounds[index];

  const askQuestion = useCallback(() => {
    const line = prompt(round.target);
    return playVoice(line.text, line.audio);
  }, [round, prompt]);

  useEffect(() => {
    setFeedback(null);
    void askQuestion();
  }, [askQuestion]);

  useEffect(() => () => void turn.current++, []);

  const answer = useCallback(
    async (item: T) => {
      if (phase !== 'asking') return;
      const t = ++turn.current;

      if (item.id !== round.target.id) {
        playWrong();
        setWrongTap({ id: item.id, n: Date.now() });
        setReaction({ kind: 'gentle', id: Date.now() });
        const line = tryAgainLines[Math.floor(Math.random() * tryAgainLines.length)];
        setFeedback(line.text);
        await playVoice(line.text, line.audio);
        if (t === turn.current) {
          setFeedback(null);
          void askQuestion();
        }
        return;
      }

      setPhase('celebrating');
      setFeedback(correctBadge);
      playSuccess();
      setStars((s) => s + 1);
      setConfettiId((c) => c + 1);
      setReaction({ kind: 'happy', id: Date.now() });

      const line = praise(item);
      await playVoice(line.text, line.audio);
      await wait(PAUSE_AFTER_PRAISE_MS);
      if (t !== turn.current) return;

      if (index + 1 >= rounds.length) {
        setPhase('finished');
      } else {
        setIndex(index + 1);
        setPhase('asking');
      }
    },
    [phase, round, index, rounds.length, askQuestion, praise],
  );

  const restart = useCallback(() => {
    turn.current++;
    setRounds(createRounds(pool, QUIZ_ROUNDS, CHOICES));
    setIndex(0);
    setStars(0);
    setPhase('asking');
  }, [pool]);

  return {
    round,
    phase,
    stars,
    feedback,
    wrongTap,
    reaction,
    confettiId,
    answer,
    restart,
    repeatQuestion: askQuestion,
  };
}

export type QuizGame<T extends { id: string }> = ReturnType<typeof useQuizGame<T>>;
