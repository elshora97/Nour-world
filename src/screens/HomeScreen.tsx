import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mascot } from '../components/Character/Mascot';
import { GameCard } from '../components/GameCard/GameCard';
import { SkyScene } from '../components/Scene/SkyScene';
import { categories, type CategoryId, type GameCategory } from '../data/categories';
import { helloLine } from '../data/feedback';
import { playClick, playVoice } from '../lib/audio';

const TITLE = 'عالم نور';

/** The game opens once the card's voice line ends — at least MIN, at most MAX ms. */
const OPEN_DELAY_MIN_MS = 700;
const OPEN_DELAY_MAX_MS = 2500;

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

interface HomeScreenProps {
  isAvailable: (id: CategoryId) => boolean;
  onOpenGame: (id: CategoryId) => void;
}

export function HomeScreen({ isAvailable, onOpenGame }: HomeScreenProps) {
  const [mascotMessage, setMascotMessage] = useState('يلا نلعب! 🎉');
  const opening = useRef(false);

  const handleSelect = (category: GameCategory) => {
    if (opening.current) return;
    playClick();
    const spoken = playVoice(category.voice, category.voiceAudio);
    setMascotMessage(`${category.title}! ${category.stickers[1]}`);
    if (!isAvailable(category.id)) {
      setMascotMessage('قريباً يا نور! 🎁');
      return;
    }
    opening.current = true;
    void Promise.all([wait(OPEN_DELAY_MIN_MS), Promise.race([spoken, wait(OPEN_DELAY_MAX_MS)])]).then(
      () => onOpenGame(category.id),
    );
  };

  const handleMascotTap = () => {
    playClick();
    void playVoice(helloLine.text, helloLine.audio);
    setMascotMessage('أهلاً يا نور! 💖');
  };

  return (
    <main className="relative flex h-dvh w-full flex-col items-center overflow-hidden">
      <SkyScene />

      <motion.h1
        className="relative z-10 mt-[4vh] flex items-center gap-[1.5vh] font-display text-[9vh] font-extrabold leading-tight text-white"
        style={{
          textShadow: '0 0.7vh 0 var(--color-berry), 0 1.4vh 2vh rgba(155,123,255,0.4)',
        }}
        initial={{ scale: 0.3, opacity: 0, y: -40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12 }}
      >
        <span aria-hidden>🌈</span>
        {TITLE}
        <span aria-hidden>🌸</span>
      </motion.h1>

      <section
        aria-label="الألعاب"
        className="relative z-10 mt-[5vh] flex flex-1 items-start justify-center gap-[3vw]"
      >
        {categories.map((category, index) => (
          <GameCard key={category.id} category={category} index={index} onSelect={handleSelect} />
        ))}
      </section>

      <motion.div
        className="absolute bottom-[1vh] left-[2vw] z-20"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.8 }}
      >
        <Mascot message={mascotMessage} onTap={handleMascotTap} />
      </motion.div>
    </main>
  );
}
