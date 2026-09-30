import { registerSW } from 'virtual:pwa-register';

/** Must match the audio runtime cache name in vite.config.ts. */
const AUDIO_CACHE = 'nour-audio';
/** Written by `npm run voices`; lists every voice file the app uses. */
const VOICE_LIST = '/audio/voices.json';

/**
 * Downloads every voice line into the offline cache, a few at a time, so
 * the games can talk without internet after the first visit.
 */
async function warmAudioCache() {
  if (!('caches' in window) || !navigator.onLine) return;
  try {
    const list = (await (await fetch(VOICE_LIST)).json()) as Record<string, string>;
    const cache = await caches.open(AUDIO_CACHE);
    const missing: string[] = [];
    for (const path of Object.keys(list)) {
      if (!(await cache.match(path))) missing.push(path);
    }
    const CONCURRENCY = 4;
    for (let i = 0; i < missing.length; i += CONCURRENCY) {
      await Promise.all(missing.slice(i, i + CONCURRENCY).map((path) => cache.add(path).catch(() => undefined)));
    }
  } catch {
    // Offline or blocked storage: voices still stream when online.
  }
}

export function setupPwa() {
  if (!('serviceWorker' in navigator)) return;
  registerSW({
    immediate: true,
    onRegisteredSW: () => {
      void navigator.serviceWorker.ready.then(() => {
        // Let the first screen settle before downloading ~7 MB of voices.
        const start = () => void warmAudioCache();
        // Safari has no requestIdleCallback.
        if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(start, { timeout: 5000 });
        else setTimeout(start, 3000);
      });
    },
  });
}
