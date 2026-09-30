import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { QUIZ_ROUNDS, type QuizGame } from '../../hooks/useQuizGame';
import { Mascot } from '../Character/Mascot';
import { Confetti } from '../Confetti/Confetti';
import { GameTopBar } from '../GameTopBar/GameTopBar';
import { RewardScreen } from '../Reward/RewardScreen';
import { SkyScene } from '../Scene/SkyScene';
import type { ChoiceState } from './QuizChoice';

interface QuizScreenProps<T extends { id: string }> {
  game: QuizGame<T>;
  label: string;
  onHome: () => void;
  /** The question shown in the bubble for the current target. */
  renderPrompt: (target: T) => ReactNode;
  renderChoice: (
    item: T,
    props: { index: number; state: ChoiceState; wrongKey: number | null; disabled: boolean; onPick: () => void },
  ) => ReactNode;
}

/** Shared layout for "find the X" games: top bar, question, choices, mascot, reward. */
export function QuizScreen<T extends { id: string }>({
  game,
  label,
  onHome,
  renderPrompt,
  renderChoice,
}: QuizScreenProps<T>) {
  const { round, phase } = game;
  const target = round.target;

  return (
    <main className="relative flex h-dvh w-full flex-col items-center overflow-hidden">
      <SkyScene />
      {game.confettiId > 0 && <Confetti burstId={game.confettiId} />}

      {phase === 'finished' ? (
        <RewardScreen stars={game.stars} onPlayAgain={game.restart} onHome={onHome} />
      ) : (
        <>
          <GameTopBar onHome={onHome} stars={game.stars} totalStars={QUIZ_ROUNDS} />

          <AnimatePresence mode="wait">
            <motion.button
              key={game.feedback ?? target.id}
              type="button"
              onClick={() => void game.repeatQuestion()}
              aria-label="اسمعي السؤال تاني"
              className="relative z-10 -mt-[9vh] flex cursor-pointer items-center gap-[1.5vh] rounded-full border-[0.6vh] border-white bg-white/85 px-[3.5vh] py-[1vh] font-display text-[7vh] font-extrabold leading-tight shadow-[0_0.8vh_0_#e9dcff,0_1.4vh_2vh_rgba(60,40,120,0.15)]"
              initial={{ scale: 0.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              whileTap={{ scale: 0.94 }}
            >
              {game.feedback ?? renderPrompt(target)}
              <span className="text-[5vh]" aria-hidden>
                🔊
              </span>
            </motion.button>
          </AnimatePresence>

          <section
            key={target.id}
            aria-label={label}
            className="relative z-10 flex flex-1 items-center justify-center gap-[5vw] pb-[6vh]"
          >
            {round.choices.map((item, index) => (
              <div key={item.id}>
                {renderChoice(item, {
                  index,
                  disabled: phase !== 'asking',
                  state:
                    phase === 'celebrating' ? (item.id === target.id ? 'winner' : 'faded') : 'idle',
                  wrongKey: game.wrongTap?.id === item.id ? game.wrongTap.n : null,
                  onPick: () => void game.answer(item),
                })}
              </div>
            ))}
          </section>
        </>
      )}

      <div className="absolute bottom-[1vh] left-[2vw] z-20">
        <Mascot reaction={game.reaction} />
      </div>
    </main>
  );
}
