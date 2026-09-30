export type CategoryId = 'colors' | 'animals' | 'alphabet';

export interface GameCategory {
  id: CategoryId;
  title: string;
  /** Temporary illustration; swap for an image path later. */
  emoji: string;
  /** Small sticker decorations floating around the card. */
  stickers: [string, string];
  gradient: [string, string];
  /** Darker shade used for the 3D bottom edge. */
  edge: string;
  /** What the voice says when the card is tapped. */
  voice: string;
  /** Recorded human voice; falls back to speech synthesis if missing. */
  voiceAudio: string;
}

export const categories: GameCategory[] = [
  {
    id: 'colors',
    title: 'الألوان',
    emoji: '🎨',
    stickers: ['🖍️', '🌈'],
    gradient: ['#ff9aa8', '#ff6f86'],
    edge: '#e0506a',
    voice: 'يلا بينا على الألوان!',
    voiceAudio: '/audio/home/colors.mp3',
  },
  {
    id: 'animals',
    title: 'الحيوانات',
    emoji: '🐶',
    stickers: ['🐾', '🦋'],
    gradient: ['#ffe27a', '#ffc53d'],
    edge: '#e0a20f',
    voice: 'يلا بينا على الحيوانات!',
    voiceAudio: '/audio/home/animals.mp3',
  },
  {
    id: 'alphabet',
    title: 'الحروف',
    emoji: 'أ',
    stickers: ['ب', '⭐'],
    gradient: ['#8ee8c8', '#4fd1a8'],
    edge: '#2fae86',
    voice: 'يلا بينا على الحروف!',
    voiceAudio: '/audio/home/alphabet.mp3',
  },
];
