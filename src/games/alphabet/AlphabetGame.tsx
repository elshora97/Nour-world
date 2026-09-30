import { useState } from 'react';
import type { AlphabetModeId } from '../../data/alphabet';
import { AlphabetMenu } from './AlphabetMenu';
import { DiscoverLetters } from './DiscoverLetters';
import { FindLetter, MatchLetter } from './LetterQuizzes';

interface AlphabetGameProps {
  onHome: () => void;
}

/** Alphabet world: a menu of three activities; 🏠 inside one returns to this menu. */
export function AlphabetGame({ onHome }: AlphabetGameProps) {
  const [mode, setMode] = useState<AlphabetModeId | null>(null);
  const backToMenu = () => setMode(null);

  switch (mode) {
    case 'discover':
      return <DiscoverLetters onHome={backToMenu} />;
    case 'find':
      return <FindLetter onHome={backToMenu} />;
    case 'match':
      return <MatchLetter onHome={backToMenu} />;
    default:
      return <AlphabetMenu onHome={onHome} onPick={setMode} />;
  }
}
