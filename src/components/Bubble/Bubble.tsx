import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';

interface BubbleProps {
  tint: string;
  edge: string;
  /** Pops up under the bubble when set (e.g. the word after she finds it). */
  label?: string | null;
  children: ReactNode;
}

/** Round, glossy "3D" bubble used for animals, pictures and letters. */
export function Bubble({ tint, edge, label, children }: BubbleProps) {
  return (
    <span
      className="relative grid h-full w-full place-items-center rounded-full border-[0.8vh] border-white"
      style={{
        background: `radial-gradient(circle at 35% 30%, #fff 0%, ${tint} 55%, ${edge} 130%)`,
        boxShadow: `0 1.2vh 0 ${edge}, 0 2.2vh 3vh rgba(60,40,120,0.2)`,
      }}
    >
      <span className="pointer-events-none absolute left-[18%] top-[10%] h-[14%] w-[28%] -rotate-[25deg] rounded-full bg-white/70" />
      {children}
      {label && (
        <motion.span
          className="absolute -bottom-[3vh] whitespace-nowrap rounded-full border-[0.5vh] border-white bg-[var(--color-coral)] px-[2.5vh] font-display text-[5.5vh] font-extrabold text-white shadow-md"
          initial={{ scale: 0, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
        >
          {label}
        </motion.span>
      )}
    </span>
  );
}

const IMAGE_EXTENSIONS = ['webp', 'png', 'jpg'] as const;
/** Remembers which extension worked (or that none did) so we don't re-probe every round. */
const knownAttempt = new Map<string, number>();

/**
 * A real picture filling the Bubble. `src` has no extension: we try
 * .webp, .png then .jpg, and show the emoji if none exists yet — so
 * dropping `cat.jpg` into the folder is all it takes to add a picture.
 */
export function BubbleImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [attempt, setAttempt] = useState(() => knownAttempt.get(src) ?? 0);

  if (attempt >= IMAGE_EXTENSIONS.length) return <BubbleEmoji>{fallback}</BubbleEmoji>;

  return (
    <img
      src={`${src}.${IMAGE_EXTENSIONS[attempt]}`}
      alt={alt}
      draggable={false}
      decoding="async"
      onLoad={() => knownAttempt.set(src, attempt)}
      onError={() => {
        knownAttempt.set(src, attempt + 1);
        setAttempt(attempt + 1);
      }}
      className="absolute inset-[3%] h-[94%] w-[94%] rounded-full object-cover"
    />
  );
}

/** Big emoji sized for a Bubble. */
export function BubbleEmoji({ children }: { children: string }) {
  return (
    <span className="text-[20vh] leading-none">{children}</span>
  );
}

/** Big colored Arabic letter sized for a Bubble. */
export function BubbleLetter({ letter, color, edge }: { letter: string; color: string; edge: string }) {
  return (
    <span
      className="-mt-[3vh] font-display text-[24vh] font-extrabold leading-none"
      style={{ color, textShadow: `0 0.9vh 0 ${edge}` }}
    >
      {letter}
    </span>
  );
}
