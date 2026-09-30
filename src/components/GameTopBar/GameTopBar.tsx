import { AnimatePresence, motion } from 'framer-motion';
import { playClick } from '../../lib/audio';

interface GameTopBarProps {
  onHome: () => void;
  stars?: number;
  /** 0 hides the star tray (e.g. free-play screens). */
  totalStars?: number;
}

/** Home button + star progress shown at the top of every game. */
export function GameTopBar({ onHome, stars = 0, totalStars = 0 }: GameTopBarProps) {
  return (
    <div className="relative z-20 flex w-full items-start justify-between px-[3vw] pt-[3vh]">
      <motion.button
        type="button"
        aria-label="الرجوع للبيت"
        onClick={() => {
          playClick();
          onHome();
        }}
        className="grid h-[13vh] min-h-16 w-[13vh] min-w-16 cursor-pointer place-items-center rounded-full border-[0.6vh] border-white bg-[var(--color-sun)] text-[7vh] shadow-[0_0.9vh_0_#d9a400,0_1.6vh_2vh_rgba(60,40,120,0.2)]"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.88, y: 6 }}
      >
        🏠
      </motion.button>

      <div
        className="flex items-center gap-[0.8vh] rounded-full border-[0.5vh] border-white bg-white/85 px-[2vh] py-[1vh] shadow-md"
        aria-label={`${stars} نجوم`}
        style={{ visibility: totalStars > 0 ? 'visible' : 'hidden' }}
      >
        {Array.from({ length: totalStars }, (_, i) => (
          <span key={i} className="relative grid h-[6vh] w-[6vh] place-items-center text-[5vh]">
            <span className="opacity-25 grayscale">⭐</span>
            <AnimatePresence>
              {i < stars && (
                <motion.span
                  className="absolute"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: [0, 1.6, 1], rotate: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  ⭐
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        ))}
      </div>
    </div>
  );
}
