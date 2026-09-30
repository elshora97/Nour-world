import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useState } from 'react';
import type { GameCategory } from '../../data/categories';

export type CardItem = Pick<GameCategory, 'title' | 'emoji' | 'stickers' | 'gradient' | 'edge'>;

interface GameCardProps<T extends CardItem> {
  category: T;
  index: number;
  onSelect: (category: T) => void;
}

const BURST = ['⭐', '✨', '💖', '🌟', '✨', '⭐'];

/** Big chunky "3D" card for a game (home screen) or a game mode. */
export function GameCard<T extends CardItem>({ category, index, onSelect }: GameCardProps<T>) {
  const icon = useAnimationControls();
  const [burstKey, setBurstKey] = useState<number | null>(null);
  const [from, to] = category.gradient;
  const isLetter = /\p{Script=Arabic}/u.test(category.emoji);

  const handleTap = () => {
    setBurstKey(Date.now());
    void icon.start({
      scale: [1, 1.35, 0.9, 1.1, 1],
      rotate: [0, -12, 10, -4, 0],
      transition: { duration: 0.6 },
    });
    onSelect(category);
  };

  return (
    <motion.div
      className="relative"
      initial={{ y: 80, opacity: 0, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 + index * 0.12 }}
    >
      <motion.button
        type="button"
        aria-label={category.title}
        onClick={handleTap}
        className="relative flex cursor-pointer flex-col items-center justify-center gap-[1.5vh] rounded-full border-[0.6vh] border-white/70"
        style={{
          width: 'min(46vh, 27vw)',
          height: 'min(46vh, 27vw)',
          minWidth: 130,
          minHeight: 130,
          background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
          boxShadow: `0 1.4vh 0 ${category.edge}, 0 2.4vh 2.4vh rgba(60, 40, 120, 0.2)`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9, y: 8 }}
      >
        {/* Glossy highlight for the 2.5D feel */}
        <span className="pointer-events-none absolute left-[20%] top-[7%] h-[14%] w-[36%] -rotate-[20deg] rounded-full bg-white/35" />

        <span className="absolute right-[4%] top-[2%] rotate-12 text-[5vh]">{category.stickers[0]}</span>
        <span className="absolute bottom-[6%] left-[2%] -rotate-12 text-[4.5vh]">{category.stickers[1]}</span>

        <span className="grid aspect-square w-[50%] place-items-center rounded-full bg-white/90 shadow-[inset_0_-0.8vh_0_rgba(0,0,0,0.06)]">
          <motion.span
            animate={icon}
            className={
              isLetter
                ? 'font-display text-[11vh] font-extrabold leading-none text-[var(--color-coral)]'
                : 'text-[10vh] leading-none'
            }
          >
            {category.emoji}
          </motion.span>
        </span>

        <span
          className="font-display text-[5.4vh] font-extrabold leading-none text-white"
          style={{ textShadow: `0 0.5vh 0 ${category.edge}` }}
        >
          {category.title}
        </span>
      </motion.button>

      <AnimatePresence>
        {burstKey !== null &&
          BURST.map((particle, i) => {
            const angle = (i / BURST.length) * Math.PI * 2;
            return (
              <motion.span
                key={`${burstKey}-${i}`}
                className="pointer-events-none absolute left-1/2 top-1/2 text-[4vh]"
                initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 1 }}
                animate={{
                  x: `calc(-50% + ${Math.cos(angle) * 16}vh)`,
                  y: `calc(-50% + ${Math.sin(angle) * 16}vh)`,
                  scale: 1.3,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                onAnimationComplete={() => i === 0 && setBurstKey(null)}
              >
                {particle}
              </motion.span>
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}
