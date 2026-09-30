import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#ff4d5e', '#ffd23f', '#3fcf6e', '#3b8bff', '#ff7ec4', '#9b6bff', '#ff9a2e'];
const EMOJI = ['⭐', '✨', '🌟', '💖'];

interface ConfettiProps {
  /** Change this to fire a new burst. */
  burstId: number;
  pieces?: number;
}

/** Full-screen confetti rain. Purely decorative. */
export function Confetti({ burstId, pieces = 20 }: ConfettiProps) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: `${burstId}-${i}`,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 30,
        delay: Math.random() * 0.3,
        duration: 1.4 + Math.random() * 0.9,
        rotate: (Math.random() - 0.5) * 720,
        color: COLORS[i % COLORS.length],
        emoji: i % 6 === 0 ? EMOJI[i % EMOJI.length] : null,
      })),
    [burstId, pieces],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{ left: `${p.left}%` }}
          initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', x: `${p.drift}vw`, rotate: p.rotate, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        >
          {p.emoji ? (
            <span className="text-[5vh]">{p.emoji}</span>
          ) : (
            <span className="block h-[2.4vh] w-[1.4vh] rounded-[0.4vh]" style={{ background: p.color }} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
