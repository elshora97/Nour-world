import type { VoiceLine } from './feedback';

export interface ArabicLetter {
  id: string;
  letter: string;
  /** Letter name, e.g. "باء". */
  name: string;
  exampleWord: string;
  /** Temporary illustration for the example word. */
  emoji: string;
  image: string;
  audio: string;
  /** Colors for the letter tile. */
  color: string;
  edge: string;
  tint: string;
}

const PALETTE = [
  { color: '#ff5d73', edge: '#d63a55', tint: '#ffe3e8' },
  { color: '#ff9a2e', edge: '#d46f00', tint: '#fff0dc' },
  { color: '#f5b800', edge: '#c99400', tint: '#fff6cc' },
  { color: '#2fc46b', edge: '#1f9a50', tint: '#dcf7e8' },
  { color: '#2f9bff', edge: '#1f6fd0', tint: '#dcefff' },
  { color: '#8b5cff', edge: '#6536dc', tint: '#ece3ff' },
  { color: '#ff5fb0', edge: '#d63d8c', tint: '#ffe3f2' },
];

const RAW: [id: string, letter: string, name: string, word: string, emoji: string][] = [
  ['alif', 'أ', 'ألف', 'أسد', '🦁'],
  ['baa', 'ب', 'با', 'بطة', '🦆'],
  ['taa', 'ت', 'تا', 'تفاحة', '🍎'],
  ['thaa', 'ث', 'ثا', 'ثعلب', '🦊'],
  ['jeem', 'ج', 'جيم', 'جمل', '🐫'],
  ['haa', 'ح', 'حا', 'حصان', '🐴'],
  ['khaa', 'خ', 'خا', 'خروف', '🐑'],
  ['dal', 'د', 'دال', 'دب', '🐻'],
  ['thal', 'ذ', 'ذال', 'ذرة', '🌽'],
  ['raa', 'ر', 'را', 'ريشة', '🪶'],
  ['zay', 'ز', 'زاي', 'زرافة', '🦒'],
  ['seen', 'س', 'سين', 'سمكة', '🐟'],
  ['sheen', 'ش', 'شين', 'شمس', '☀️'],
  ['sad', 'ص', 'صاد', 'صقر', '🦅'],
  ['dad', 'ض', 'ضاد', 'ضفدع', '🐸'],
  ['tah', 'ط', 'طا', 'طيارة', '✈️'],
  ['zah', 'ظ', 'ظا', 'ظرف', '✉️'],
  ['ain', 'ع', 'عين', 'عنب', '🍇'],
  ['ghain', 'غ', 'غين', 'غزال', '🦌'],
  ['faa', 'ف', 'فا', 'فيل', '🐘'],
  ['qaf', 'ق', 'قاف', 'قطة', '🐱'],
  ['kaf', 'ك', 'كاف', 'كلب', '🐶'],
  ['lam', 'ل', 'لام', 'ليمون', '🍋'],
  ['meem', 'م', 'ميم', 'موز', '🍌'],
  ['noon', 'ن', 'نون', 'نحلة', '🐝'],
  ['heh', 'ه', 'ها', 'هدية', '🎁'],
  ['waw', 'و', 'واو', 'وردة', '🌹'],
  ['yaa', 'ي', 'يا', 'يمامة', '🕊️'],
];

export const alphabet: ArabicLetter[] = RAW.map(([id, letter, name, exampleWord, emoji], i) => ({
  id,
  letter,
  name,
  exampleWord,
  emoji,
  image: `/images/alphabet/${id}.webp`,
  audio: `/audio/alphabet/${id}.mp3`,
  ...PALETTE[i % PALETTE.length],
}));

/** Discover mode: "باء، بطة". */
export const letterIntro = (l: ArabicLetter): VoiceLine => ({
  text: `${l.name}، زي ${l.exampleWord}`,
  audio: l.audio,
});

/** Find mode. */
export const letterPrompt = (l: ArabicLetter): VoiceLine => ({
  text: `فين حرف ال${l.name} يا نور؟`,
  audio: `/audio/alphabet/where-${l.id}.mp3`,
});

export const letterPraise = (l: ArabicLetter): VoiceLine => ({
  text: `شاطرة يا نور! ده حرف ال${l.name}!`,
  audio: `/audio/alphabet/bravo-${l.id}.mp3`,
});

/** Match mode: letter → picture. */
export const matchPrompt = (l: ArabicLetter): VoiceLine => ({
  text: `إيه اللي بيبدأ بحرف ال${l.name}؟`,
  audio: `/audio/alphabet/match-${l.id}.mp3`,
});

export const matchPraise = (l: ArabicLetter): VoiceLine => ({
  text: `برافو عليكي! ${l.name}، زي ${l.exampleWord}!`,
  audio: `/audio/alphabet/match-bravo-${l.id}.mp3`,
});

export type AlphabetModeId = 'discover' | 'find' | 'match';

export interface AlphabetMode {
  id: AlphabetModeId;
  title: string;
  emoji: string;
  stickers: [string, string];
  gradient: [string, string];
  edge: string;
  voice: VoiceLine;
}

export const alphabetModes: AlphabetMode[] = [
  {
    id: 'discover',
    title: 'اكتشفي',
    emoji: '🔍',
    stickers: ['أ', '✨'],
    gradient: ['#ffb38a', '#ff8a5c'],
    edge: '#e0663a',
    voice: { text: 'يلا نكتشف الحروف سوا', audio: '/audio/alphabet/mode-discover.mp3' },
  },
  {
    id: 'find',
    title: 'فين الحرف؟',
    emoji: 'ب',
    stickers: ['👀', '⭐'],
    gradient: ['#8fd0ff', '#4cb0ff'],
    edge: '#2a88d8',
    voice: { text: 'يلا ندوّر على الحروف', audio: '/audio/alphabet/mode-find.mp3' },
  },
  {
    id: 'match',
    title: 'صور وحروف',
    emoji: '🧩',
    stickers: ['🦆', 'ب'],
    gradient: ['#ffc2e6', '#ff8fcf'],
    edge: '#e060a8',
    voice: { text: 'يلا نوصّل الصور بالحروف', audio: '/audio/alphabet/mode-match.mp3' },
  },
];

export const alphabetMenuLine: VoiceLine = {
  text: 'يلا نتعلم الحروف سوا!',
  audio: '/audio/alphabet/menu.mp3',
};
