import { useEffect, useRef, useState } from 'react';
import { Mascot, type MascotReaction } from '../../components/Character/Mascot';
import { GameCard } from '../../components/GameCard/GameCard';
import { GameTopBar } from '../../components/GameTopBar/GameTopBar';
import { SkyScene } from '../../components/Scene/SkyScene';
import { alphabetMenuLine, alphabetModes, type AlphabetModeId } from '../../data/alphabet';
import { playClick, playVoice } from '../../lib/audio';

const OPEN_DELAY_MS = 800;

interface AlphabetMenuProps {
  onHome: () => void;
  onPick: (mode: AlphabetModeId) => void;
}

/** Picks one of the three alphabet activities. */
export function AlphabetMenu({ onHome, onPick }: AlphabetMenuProps) {
  const [reaction, setReaction] = useState<MascotReaction | null>(null);
  const opening = useRef(false);

  useEffect(() => {
    void playVoice(alphabetMenuLine.text, alphabetMenuLine.audio);
  }, []);

  return (
    <main className="relative flex h-dvh w-full flex-col items-center overflow-hidden">
      <SkyScene />
      <GameTopBar onHome={onHome} />

      <section
        aria-label="ألعاب الحروف"
        className="relative z-10 -mt-[4vh] flex flex-1 items-start justify-center gap-[4vw]"
      >
        {alphabetModes.map((mode, index) => (
          <GameCard
            key={mode.id}
            category={mode}
            index={index}
            onSelect={(m) => {
              if (opening.current) return;
              opening.current = true;
              playClick();
              setReaction({ kind: 'happy', id: Date.now() });
              void playVoice(m.voice.text, m.voice.audio);
              window.setTimeout(() => onPick(m.id), OPEN_DELAY_MS);
            }}
          />
        ))}
      </section>

      <div className="absolute bottom-[1vh] left-[2vw] z-20">
        <Mascot message="يلا نتعلم الحروف! 🔤" reaction={reaction} />
      </div>
    </main>
  );
}
