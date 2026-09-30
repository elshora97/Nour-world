export type ColorShape = 'balloon' | 'star' | 'heart' | 'flower' | 'cloud';

export interface LearningColor {
  id: string;
  /** Plain name, e.g. "أحمر". */
  name: string;
  /** Name with the article, used in sentences: "اللون الأحمر". */
  nameWithArticle: string;
  hex: string;
  /** Darker shade for the outline / 3D edge. */
  edge: string;
  emoji: string;
  shape: ColorShape;
  audio: string;
}

export const colors: LearningColor[] = [
  { id: 'red', name: 'أحمر', nameWithArticle: 'الأحمر', hex: '#ff4d5e', edge: '#c9283a', emoji: '❤️', shape: 'balloon', audio: '/audio/colors/red.mp3' },
  { id: 'blue', name: 'أزرق', nameWithArticle: 'الأزرق', hex: '#3b8bff', edge: '#1f5fc4', emoji: '💙', shape: 'balloon', audio: '/audio/colors/blue.mp3' },
  { id: 'yellow', name: 'أصفر', nameWithArticle: 'الأصفر', hex: '#ffd23f', edge: '#d9a400', emoji: '💛', shape: 'balloon', audio: '/audio/colors/yellow.mp3' },
  { id: 'green', name: 'أخضر', nameWithArticle: 'الأخضر', hex: '#3fcf6e', edge: '#23994b', emoji: '💚', shape: 'balloon', audio: '/audio/colors/green.mp3' },
  { id: 'orange', name: 'برتقالي', nameWithArticle: 'البرتقالي', hex: '#ff9a2e', edge: '#d46f00', emoji: '🧡', shape: 'balloon', audio: '/audio/colors/orange.mp3' },
  { id: 'pink', name: 'وردي', nameWithArticle: 'الوردي', hex: '#ff7ec4', edge: '#dc4b98', emoji: '🩷', shape: 'balloon', audio: '/audio/colors/pink.mp3' },
  { id: 'purple', name: 'بنفسجي', nameWithArticle: 'البنفسجي', hex: '#9b6bff', edge: '#6c3fd6', emoji: '💜', shape: 'balloon', audio: '/audio/colors/purple.mp3' },
  { id: 'brown', name: 'بني', nameWithArticle: 'البني', hex: '#a86b3c', edge: '#7a4722', emoji: '🤎', shape: 'balloon', audio: '/audio/colors/brown.mp3' },
  { id: 'white', name: 'أبيض', nameWithArticle: 'الأبيض', hex: '#ffffff', edge: '#c9c3dc', emoji: '🤍', shape: 'balloon', audio: '/audio/colors/white.mp3' },
  { id: 'black', name: 'أسود', nameWithArticle: 'الأسود', hex: '#3a3446', edge: '#15121c', emoji: '🖤', shape: 'balloon', audio: '/audio/colors/black.mp3' },
];

export const colorPrompt = (c: LearningColor) => ({
  text: `فين اللون ${c.nameWithArticle} يا نور؟`,
  audio: `/audio/colors/where-${c.id}.mp3`,
});

export const colorPraise = (c: LearningColor) => ({
  text: `شاطرة يا نور! ده اللون ${c.nameWithArticle}!`,
  audio: `/audio/colors/bravo-${c.id}.mp3`,
});
