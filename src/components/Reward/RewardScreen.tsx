import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { finishLine, playAgainLine } from '../../data/feedback';
import { playCelebrate, playClick, playVoice } from '../../lib/audio';
import { Confetti } from '../Confetti/Confetti';

interface RewardScreenProps {
  stars: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

/** End-of-game celebration: stars, confetti, and "play again?". */
export function RewardScreen({ stars, onPlayAgain, onHome }: RewardScreenProps) {
  const [burst, setBurst] = useState(1);

  useEffect(() => {
    let active = true;
    playCelebrate();
    void playVoice(finishLine.text, finishLine.audio).then(() => {
      if (active) void playVoice(playAgainLine.text, playAgainLine.audio);
    });
    const id = window.setTimeout(() => setBurst((b) => b + 1), 1800);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, []);

  return (
    <motion.div
      className="relative z-10 flex flex-1 flex-col items-center justify-center gap-[3vh]"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
    >
      <Confetti burstId={burst} pieces={28} />

      <h2
        className="font-display text-[11vh] font-extrabold leading-tight text-white"
        style={{ textShadow: '0 0.8vh 0 var(--color-berry)' }}
      >
        {finishLine.text}
      </h2>

      <div className="flex gap-[1.5vh]" aria-label={`${stars} نجوم`}>
        {Array.from({ length: stars }, (_, i) => (
          <motion.span
            key={i}
            className="text-[11vh]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.3 + i * 0.18 }}
          >
            ⭐
          </motion.span>
        ))}
      </div>

      <div className="flex items-center gap-[4vw]">
        <motion.button
          type="button"
          onClick={() => {
            playClick();
            onPlayAgain();
          }}
          className="anim-bob flex cursor-pointer items-center gap-[1.5vh] rounded-full border-[0.6vh] border-white bg-[var(--color-mint)] px-[5vh] py-[2vh] font-display text-[6vh] font-extrabold text-white shadow-[0_1vh_0_#2fae86]"
          style={{ textShadow: '0 0.4vh 0 #2fae86' }}
          whileTap={{ scale: 0.9, y: 6 }}
        >
          {playAgainLine.text} 🔄
        </motion.button>
        <motion.button
          type="button"
          aria-label="الرجوع للبيت"
          onClick={() => {
            playClick();
            onHome();
          }}
          className="grid h-[15vh] min-h-16 w-[15vh] min-w-16 cursor-pointer place-items-center rounded-full border-[0.6vh] border-white bg-[var(--color-sun)] text-[8vh] shadow-[0_1vh_0_#d9a400]"
          whileTap={{ scale: 0.88, y: 6 }}
        >
          🏠
        </motion.button>
      </div>
    </motion.div>
  );
}
