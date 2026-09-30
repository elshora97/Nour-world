import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useState } from 'react';
import type { CategoryId } from '../data/categories';
import { AlphabetGame } from '../games/alphabet/AlphabetGame';
import { AnimalsGame } from '../games/animals/AnimalsGame';
import { ColorsGame } from '../games/colors/ColorsGame';
import { HomeScreen } from '../screens/HomeScreen';

type Screen = 'home' | CategoryId;

/** Games that are playable so far; the others stay on the home screen. */
const AVAILABLE_GAMES: ReadonlySet<CategoryId> = new Set(['colors', 'animals', 'alphabet']);

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const goHome = () => setScreen('home');

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="h-dvh w-full"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3 }}
        >
          {screen === 'colors' ? (
            <ColorsGame onHome={goHome} />
          ) : screen === 'animals' ? (
            <AnimalsGame onHome={goHome} />
          ) : screen === 'alphabet' ? (
            <AlphabetGame onHome={goHome} />
          ) : (
            <HomeScreen isAvailable={(id) => AVAILABLE_GAMES.has(id)} onOpenGame={setScreen} />
          )}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
