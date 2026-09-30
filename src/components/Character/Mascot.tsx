import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface MascotReaction {
  kind: 'happy' | 'gentle';
  /** Unique per reaction so repeated reactions of the same kind replay. */
  id: number;
}

interface MascotProps {
  message?: string;
  onTap?: () => void;
  reaction?: MascotReaction | null;
}

/** Lulu the bunny — Nour's friend who guides her through the game. */
export function Mascot({ message, onTap, reaction }: MascotProps) {
  const controls = useAnimationControls();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!reaction) return;
    void controls.start(
      reaction.kind === 'happy'
        ? { y: [0, -50, 0, -20, 0], rotate: [0, 10, -10, 0], transition: { duration: 0.8 } }
        : { rotate: [0, -10, 10, -8, 8, 0], transition: { duration: 0.7 } },
    );
  }, [reaction, controls]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 160);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const handleTap = () => {
    void controls.start({
      y: [0, -40, 0, -14, 0],
      rotate: [0, -8, 8, 0],
      transition: { duration: 0.7 },
    });
    onTap?.();
  };

  return (
    <div className="flex flex-row-reverse items-end gap-[1vh]">
      <motion.button
        type="button"
        aria-label="لولو الأرنبة"
        onClick={handleTap}
        className="anim-bob cursor-pointer rounded-full border-0 bg-transparent p-0"
        style={{ height: '24vh', minHeight: 96, aspectRatio: '1 / 1.15' }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.svg animate={controls} viewBox="0 0 120 140" className="h-full w-full">
          <g>
            <ellipse cx="40" cy="30" rx="12" ry="30" fill="#fff" stroke="#f3d7e6" strokeWidth="2" />
            <ellipse cx="40" cy="32" rx="6" ry="22" fill="#ffb3cf" />
            <ellipse cx="80" cy="30" rx="12" ry="30" fill="#fff" stroke="#f3d7e6" strokeWidth="2" />
            <ellipse cx="80" cy="32" rx="6" ry="22" fill="#ffb3cf" />
          </g>
          <ellipse cx="60" cy="118" rx="32" ry="22" fill="#fff" stroke="#f3d7e6" strokeWidth="2" />
          <ellipse cx="60" cy="122" rx="16" ry="12" fill="#ffe3ef" />
          <circle cx="60" cy="78" r="36" fill="#fff" stroke="#f3d7e6" strokeWidth="2" />
          <g transform="translate(84 50) rotate(20)">
            <path d="M0 0 L-14 -9 L-14 9 Z M0 0 L14 -9 L14 9 Z" fill="var(--color-berry)" />
            <circle r="4" fill="#ff9fcf" />
          </g>
          {blink ? (
            <g stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M40 76 q6 4 12 0" />
              <path d="M68 76 q6 4 12 0" />
            </g>
          ) : (
            <g>
              <ellipse cx="46" cy="75" rx="6" ry="7.5" fill="var(--color-ink)" />
              <ellipse cx="74" cy="75" rx="6" ry="7.5" fill="var(--color-ink)" />
              <circle cx="48" cy="72" r="2.2" fill="#fff" />
              <circle cx="76" cy="72" r="2.2" fill="#fff" />
            </g>
          )}
          <ellipse cx="36" cy="88" rx="7" ry="4.5" fill="#ffb3cf" opacity="0.8" />
          <ellipse cx="84" cy="88" rx="7" ry="4.5" fill="#ffb3cf" opacity="0.8" />
          <path d="M56 84 h8 l-4 4 z" fill="#ff7aa8" />
          <path
            d="M52 92 q8 8 16 0"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence mode="wait">
        {message && (
        <motion.div
          key={message}
          role="status"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="relative mb-[12vh] whitespace-nowrap rounded-[2rem] bg-white px-[2.6vh] py-[1vh] font-display text-[4.4vh] font-extrabold shadow-[0_6px_0_#e9dcff,0_10px_20px_rgba(90,60,160,0.15)]"
          style={{ transformOrigin: 'bottom left' }}
        >
          {message}
          <span className="absolute -bottom-[1vh] left-[2.5vh] h-[2.4vh] w-[2.4vh] rotate-45 bg-white" />
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
