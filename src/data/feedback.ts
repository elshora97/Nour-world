export interface VoiceLine {
  text: string;
  audio: string;
}

/**
 * All spoken lines are written in everyday Egyptian Arabic, the way a mum
 * talks to her little girl — the voice reads exactly what's written here.
 */

/** Encouraging lines for a wrong tap — never "wrong" or "game over". */
export const tryAgainLines: VoiceLine[] = [
  { text: 'حاولي تاني يا حبيبتي ❤️', audio: '/audio/feedback/try-again.mp3' },
  { text: 'قرّبتي خلاص! 🌸', audio: '/audio/feedback/close.mp3' },
  { text: 'يلا نجرّب تاني ⭐', audio: '/audio/feedback/once-more.mp3' },
];

export const helloLine: VoiceLine = {
  text: 'أهلاً يا نور! يلا نلعب سوا',
  audio: '/audio/home/hello-nour.mp3',
};

/** Shown in the question bubble right after a correct answer. */
export const correctBadge = 'شاطرة يا نور! ⭐';

export const finishLine: VoiceLine = {
  text: 'برافو عليكي يا نور! 🌟',
  audio: '/audio/feedback/bravo.mp3',
};

export const playAgainLine: VoiceLine = {
  text: 'نلعب تاني؟',
  audio: '/audio/feedback/play-again.mp3',
};
