/**
 * Central audio manager. Every sound in the app goes through here.
 * Voice: a recorded file is tried first; if it is missing we fall back to
 * the most natural-sounding Arabic speech voice the device offers.
 * Nothing here ever throws — missing audio must never break the game.
 */

let ctx: AudioContext | null = null;
let output: AudioNode | null = null;

function getOutput(): { ac: AudioContext; out: AudioNode } | null {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      // Soft master chain: gentle low-pass + a short echo for a warm, airy tail.
      const master = ctx.createGain();
      master.gain.value = 0.5;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 3200;
      const echo = ctx.createDelay();
      echo.delayTime.value = 0.12;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.22;
      master.connect(lowpass).connect(ctx.destination);
      lowpass.connect(echo).connect(feedback).connect(echo);
      feedback.connect(ctx.destination);
      output = master;
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return output ? { ac: ctx, out: output } : null;
  } catch {
    return null;
  }
}

/** A soft bell-like note: sine + quiet overtone, smooth attack, long decay. */
function chime(freq: number, delay = 0, volume = 0.18) {
  const audio = getOutput();
  if (!audio) return;
  const { ac, out } = audio;
  const start = ac.currentTime + delay;
  const duration = 0.6;

  for (const [ratio, level] of [[1, 1], [2, 0.18]] as const) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * ratio;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume * level, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(out);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }
}

export function playClick() {
  chime(784); // G5
  chime(1047, 0.07, 0.12); // C6
}

/** Happy rising arpeggio for a correct answer. */
export function playSuccess() {
  [1047, 1319, 1568, 2093].forEach((f, i) => chime(f, i * 0.09, 0.16));
}

/** Gentle, quiet "hmm" for a wrong tap — never harsh. */
export function playWrong() {
  chime(523, 0, 0.1);
  chime(440, 0.16, 0.1);
}

/** Longer sparkly fanfare for finishing a game. */
export function playCelebrate() {
  [784, 1047, 1319, 1568, 1319, 1568, 2093].forEach((f, i) => chime(f, i * 0.11, 0.15));
}

// ---------------------------------------------------------------- voice

let voices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  try {
    voices = window.speechSynthesis.getVoices();
  } catch {
    voices = [];
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

/** Neural/online voices sound far more human than the classic local ones. */
function voiceScore(v: SpeechSynthesisVoice): number {
  if (!v.lang.toLowerCase().startsWith('ar')) return -1;
  let score = 0;
  if (/natural|neural|online|premium|enhanced/i.test(v.name)) score += 10;
  if (/google/i.test(v.name)) score += 6;
  if (/salma|zariyah|hoda|laila|maryam|female/i.test(v.name)) score += 3; // warm female voices
  if (v.lang === 'ar-EG') score += 2;
  else if (v.lang === 'ar-SA') score += 1;
  return score;
}

function pickArabicVoice(): SpeechSynthesisVoice | undefined {
  return voices
    .filter((v) => voiceScore(v) >= 0)
    .sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}

/** Resolves when speech ends; a safety timeout covers browsers that never fire `end`. */
function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (!('speechSynthesis' in window)) return resolve();
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickArabicVoice();
      utterance.voice = voice ?? null;
      utterance.lang = voice?.lang ?? 'ar-EG';
      // Near-natural settings: extreme pitch/rate is what makes TTS sound robotic.
      utterance.rate = 0.92;
      utterance.pitch = 1.08;
      utterance.volume = 1;
      const timeout = window.setTimeout(resolve, 1500 + text.length * 120);
      const done = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      utterance.onend = done;
      utterance.onerror = done;
      synth.speak(utterance);
    } catch {
      // Speech is a nice-to-have; stay silent on failure.
      resolve();
    }
  });
}

const missingFiles = new Set<string>();
let current: HTMLAudioElement | null = null;

/**
 * Say something to Nour. Plays the recorded file at `src` when it exists
 * (real human voice), otherwise speaks `text` with speech synthesis.
 * Resolves when she has finished hearing it.
 */
export function playVoice(text: string, src?: string): Promise<void> {
  // Hard cap so a stuck audio element or speech engine can never freeze the game.
  const cap = new Promise<void>((resolve) => window.setTimeout(resolve, 8000));
  return Promise.race([cap, voice(text, src)]);
}

function voice(text: string, src?: string): Promise<void> {
  current?.pause();
  if (!src || missingFiles.has(src)) return speak(text);

  return new Promise((resolve) => {
    try {
      const audio = new Audio(src);
      current = audio;
      let handled = false;
      const fallback = () => {
        if (handled) return;
        handled = true;
        missingFiles.add(src);
        if (current === audio) void speak(text).then(resolve);
        else resolve();
      };
      audio.addEventListener('error', fallback, { once: true });
      audio.addEventListener('ended', () => resolve(), { once: true });
      audio.play().catch(fallback);
    } catch {
      void speak(text).then(resolve);
    }
  });
}
