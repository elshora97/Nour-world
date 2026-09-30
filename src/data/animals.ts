import type { VoiceLine } from './feedback';

/** How the animal celebrates when Nour finds it. */
export type AnimalMotion = 'jump' | 'wag' | 'roar' | 'sway' | 'hop' | 'peck' | 'gallop';

export interface Animal {
  id: string;
  /** "قطة" */
  name: string;
  /** "القطة" — used in "فين القطة؟" */
  nameWithArticle: string;
  /** Demonstrative for "دي قطة" / "ده كلب". */
  pointer: 'ده' | 'دي';
  /** Shown until a real picture exists at `image`. */
  emoji: string;
  /** Picture path without extension: public/images/animals/<id>.webp|png|jpg */
  image: string;
  /** Spoken animal sound, e.g. "مياو مياو". */
  sound: string;
  /** Soft background behind the animal. */
  tint: string;
  edge: string;
  motion: AnimalMotion;
  audio: string;
}

const animal = (a: Omit<Animal, 'image' | 'audio'>): Animal => ({
  ...a,
  image: `/images/animals/${a.id}`,
  audio: `/audio/animals/${a.id}.mp3`,
});

export const animals: Animal[] = [
  animal({ id: 'cat', name: 'قطة', nameWithArticle: 'القطة', pointer: 'دي', emoji: '🐱', sound: 'مياو مياو', tint: '#ffe3ef', edge: '#f5a8c8', motion: 'jump' }),
  animal({ id: 'dog', name: 'كلب', nameWithArticle: 'الكلب', pointer: 'ده', emoji: '🐶', sound: 'هو هو هو', tint: '#fff1d6', edge: '#f2c77a', motion: 'wag' }),
  animal({ id: 'lion', name: 'أسد', nameWithArticle: 'الأسد', pointer: 'ده', emoji: '🦁', sound: 'رووووار', tint: '#ffe9c2', edge: '#f0b54a', motion: 'roar' }),
  animal({ id: 'elephant', name: 'فيل', nameWithArticle: 'الفيل', pointer: 'ده', emoji: '🐘', sound: 'بووووو', tint: '#e3ecff', edge: '#9db5ee', motion: 'sway' }),
  animal({ id: 'rabbit', name: 'أرنب', nameWithArticle: 'الأرنب', pointer: 'ده', emoji: '🐰', sound: 'نط نط نط', tint: '#f3e8ff', edge: '#c9a8f0', motion: 'hop' }),
  animal({ id: 'duck', name: 'بطة', nameWithArticle: 'البطة', pointer: 'دي', emoji: '🦆', sound: 'كواك كواك', tint: '#dff7ec', edge: '#8fdcb8', motion: 'sway' }),
  animal({ id: 'horse', name: 'حصان', nameWithArticle: 'الحصان', pointer: 'ده', emoji: '🐴', sound: 'هييييه', tint: '#f7e6d8', edge: '#d9a57c', motion: 'gallop' }),
  animal({ id: 'cow', name: 'بقرة', nameWithArticle: 'البقرة', pointer: 'دي', emoji: '🐮', sound: 'مووووو', tint: '#e6f6ff', edge: '#94cdee', motion: 'sway' }),
  animal({ id: 'sheep', name: 'خروف', nameWithArticle: 'الخروف', pointer: 'ده', emoji: '🐑', sound: 'مااااء', tint: '#eef3ff', edge: '#b3c1e8', motion: 'hop' }),
  animal({ id: 'chicken', name: 'فرخة', nameWithArticle: 'الفرخة', pointer: 'دي', emoji: '🐔', sound: 'كاك كاك كاك', tint: '#fff4d1', edge: '#f0cd6a', motion: 'peck' }),
];

export const animalPrompt = (a: Animal): VoiceLine => ({
  text: `فين ${a.nameWithArticle} يا نور؟`,
  audio: `/audio/animals/where-${a.id}.mp3`,
});

export const animalPraise = (a: Animal): VoiceLine => ({
  text: `برافو عليكي يا نور! ${a.pointer} ${a.name}! ${a.sound}`,
  audio: `/audio/animals/bravo-${a.id}.mp3`,
});
