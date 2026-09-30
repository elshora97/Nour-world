import { motion, useAnimationControls, type TargetAndTransition } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

export type ChoiceState = 'idle' | 'winner' | 'faded';

const DEFAULT_WIN: TargetAndTransition = {
  y: [0, -40, 0, -16, 0],
  scale: [1, 1.2, 1.1, 1.15, 1.1],
  rotate: [0, -8, 8, 0],
  transition: { duration: 0.9 },
};

interface QuizChoiceProps {
  label: string;
  index: number;
  state: ChoiceState;
  /** Changes whenever this choice was tapped wrongly, to replay the wiggle. */
  wrongKey: number | null;
  disabled: boolean;
  onPick: () => void;
  /** Custom celebration (e.g. a rabbit hops, a lion roars). */
  winAnimation?: TargetAndTransition;
  children: ReactNode;
}

/** A big tappable quiz answer with idle float, wrong wiggle and win bounce. */
export function QuizChoice({
  label,
  index,
  state,
  wrongKey,
  disabled,
  onPick,
  winAnimation = DEFAULT_WIN,
  children,
}: QuizChoiceProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (wrongKey === null) return;
    void controls.start({ x: [0, -14, 14, -10, 10, 0], rotate: [0, -6, 6, 0], transition: { duration: 0.5 } });
  }, [wrongKey, controls]);

  useEffect(() => {
    if (state === 'winner') void controls.start(winAnimation);
  }, [state, controls, winAnimation]);

  return (
    <motion.div
      initial={{ scale: 0, y: 60 }}
      animate={{ scale: 1, y: 0, opacity: state === 'faded' ? 0.35 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 15, delay: index * 0.1 }}
    >
      <motion.button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onPick}
        className="relative block cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
        style={{ width: 'min(36vh, 26vw)', height: 'min(36vh, 26vw)', minWidth: 96, minHeight: 96 }}
        animate={controls}
        whileHover={disabled ? undefined : { scale: 1.06 }}
        whileTap={disabled ? undefined : { scale: 0.9 }}
      >
        <span className="block h-full w-full">{children}</span>
        {state === 'winner' && (
          <motion.span
            className="absolute -top-[2vh] left-1/2 -translate-x-1/2 text-[7vh]"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            ✨
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
}
