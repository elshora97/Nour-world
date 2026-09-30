import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Bubble, BubbleEmoji, BubbleLetter } from '../../components/Bubble/Bubble';
import { Mascot, type MascotReaction } from '../../components/Character/Mascot';
import { GameTopBar } from '../../components/GameTopBar/GameTopBar';
import { SkyScene } from '../../components/Scene/SkyScene';
import { alphabet, letterIntro } from '../../data/alphabet';
import { playClick, playVoice } from '../../lib/audio';

interface DiscoverLettersProps {
  onHome: () => void;
}

function ArrowButton({ direction, onClick }: { direction: 'next' | 'prev'; onClick: () => void }) {
  // RTL: "next" moves leftwards, so its chevron points left.
  const pointsLeft = direction === 'next';
  return (
    <motion.button
      type="button"
      aria-label={direction === 'next' ? 'الحرف اللي بعده' : 'الحرف اللي قبله'}
      onClick={onClick}
      className="grid h-[16vh] min-h-16 w-[16vh] min-w-16 shrink-0 cursor-pointer place-items-center rounded-full border-[0.6vh] border-white"
      style={{
        background: direction === 'next' ? 'var(--color-mint)' : 'var(--color-ocean)',
        boxShadow: `0 1vh 0 ${direction === 'next' ? '#2fae86' : '#2a88d8'}`,
      }}
      whileTap={{ scale: 0.85, y: 6 }}
    >
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" aria-hidden>
        <path
          d={pointsLeft ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'}
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}

/** Free play: flip through the letters, hear each one and its word. */
export function DiscoverLetters({ onHome }: DiscoverLettersProps) {
  const [index, setIndex] = useState(0);
  const [reaction, setReaction] = useState<MascotReaction | null>(null);
  const letterControls = useAnimationControls();
  const pictureControls = useAnimationControls();
  const item = alphabet[index];

  const say = useCallback(() => {
    const line = letterIntro(item);
    return playVoice(line.text, line.audio);
  }, [item]);

  useEffect(() => {
    void say();
  }, [say]);

  const go = (step: 1 | -1) => {
    playClick();
    setIndex((i) => (i + step + alphabet.length) % alphabet.length);
  };

  const tapLetter = () => {
    void letterControls.start({ scale: [1, 1.25, 0.95, 1.05, 1], rotate: [0, -10, 8, 0], transition: { duration: 0.7 } });
    setReaction({ kind: 'happy', id: Date.now() });
    void say();
  };

  const tapPicture = () => {
    void pictureControls.start({ y: [0, -40, 0, -15, 0], transition: { duration: 0.8 } });
    void say();
  };

  return (
    <main className="relative flex h-dvh w-full flex-col items-center overflow-hidden">
      <SkyScene />
      <GameTopBar onHome={onHome} />

      <section
        aria-label="اكتشفي الحروف"
        className="relative z-10 -mt-[6vh] flex flex-1 items-center justify-center gap-[3vw] pb-[8vh]"
      >
        <ArrowButton direction="prev" onClick={() => go(-1)} />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={item.id}
            className="flex items-center gap-[4vw]"
            initial={{ x: -120, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <motion.button
              type="button"
              aria-label={`حرف ${item.name}`}
              onClick={tapLetter}
              animate={letterControls}
              className="block cursor-pointer border-0 bg-transparent p-0"
              style={{ width: 'min(52vh, 34vw)', height: 'min(52vh, 34vw)' }}
            >
              <Bubble tint={item.tint} edge={item.edge} label={item.name}>
                <span className="scale-[1.35]">
                  <BubbleLetter letter={item.letter} color={item.color} edge={item.edge} />
                </span>
              </Bubble>
            </motion.button>

            <motion.button
              type="button"
              aria-label={item.exampleWord}
              onClick={tapPicture}
              animate={pictureControls}
              className="block cursor-pointer border-0 bg-transparent p-0"
              style={{ width: 'min(36vh, 24vw)', height: 'min(36vh, 24vw)' }}
            >
              <Bubble tint="#ffffff" edge={item.edge} label={item.exampleWord}>
                <BubbleEmoji>{item.emoji}</BubbleEmoji>
              </Bubble>
            </motion.button>
          </motion.div>
        </AnimatePresence>

        <ArrowButton direction="next" onClick={() => go(1)} />
      </section>

      <div className="absolute bottom-[1vh] left-[2vw] z-20">
        <Mascot reaction={reaction} />
      </div>
    </main>
  );
}
