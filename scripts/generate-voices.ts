/**
 * Generates natural-sounding MP3 voice lines for every piece of spoken
 * content in the app.
 *
 *   npm run voices               # generate new/changed lines only
 *   npm run voices -- --force    # regenerate everything
 *   npm run voices -- --limit=3  # try a few lines first (saves quota)
 *
 * Uses free Microsoft Edge voices via edge-tts (pip install edge-tts).
 *
 * A manifest (public/audio/voices.json) remembers the voice + text of each
 * file, so editing a line regenerates just what changed. Files you record
 * yourself are never overwritten unless their line's text changes.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  alphabet,
  alphabetMenuLine,
  alphabetModes,
  letterIntro,
  letterPraise,
  letterPrompt,
  matchPraise,
  matchPrompt,
} from '../src/data/alphabet.ts';
import { animalPraise, animalPrompt, animals } from '../src/data/animals.ts';
import { categories } from '../src/data/categories.ts';
import { colorPraise, colorPrompt, colors } from '../src/data/colors.ts';
import { finishLine, helloLine, playAgainLine, tryAgainLines } from '../src/data/feedback.ts';

interface Provider {
  /** Stored in the manifest; changing it regenerates every file. */
  tag: string;
  synthesize: (text: string, out: string) => boolean;
}

function edgeProvider(): Provider {
  const voice = 'ar-EG-SalmaNeural';
  // A touch slower and brighter than default: friendlier for a 3-year-old.
  const args = (text: string, out: string) => [
    '--voice', voice, '--rate=-8%', '--pitch=+8Hz', '--text', text, '--write-media', out,
  ];
  return {
    tag: `edge:${voice}`,
    synthesize: (text, out) => {
      const direct = spawnSync('edge-tts', args(text, out), { stdio: 'inherit' });
      if (!direct.error) return direct.status === 0;
      const viaPython = spawnSync('python', ['-m', 'edge_tts', ...args(text, out)], { stdio: 'inherit' });
      return !viaPython.error && viaPython.status === 0;
    },
  };
}

const provider = edgeProvider();

const PUBLIC_DIR = join(import.meta.dirname, '..', 'public');
const MANIFEST = join(PUBLIC_DIR, 'audio', 'voices.json');

interface Line {
  text: string;
  audio: string;
}

function collectLines(): Line[] {
  return [
    helloLine,
    finishLine,
    playAgainLine,
    ...tryAgainLines,
    ...categories.map((c) => ({ text: c.voice, audio: c.voiceAudio })),
    ...colors.flatMap((c) => [{ text: c.name, audio: c.audio }, colorPrompt(c), colorPraise(c)]),
    ...animals.flatMap((a) => [{ text: a.name, audio: a.audio }, animalPrompt(a), animalPraise(a)]),
    alphabetMenuLine,
    ...alphabetModes.map((m) => m.voice),
    ...alphabet.flatMap((l) => [
      letterIntro(l),
      letterPrompt(l),
      letterPraise(l),
      matchPrompt(l),
      matchPraise(l),
    ]),
  ];
}

/** Emojis are for the screen, not the voice. */
const speakable = (text: string) =>
  text.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();

function main() {
  const force = process.argv.includes('--force');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity;
  const manifest: Record<string, string> = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
    : {};

  process.stdout.write(`Voice: ${provider.tag}\n\n`);
  let generated = 0;
  let failed = 0;
  for (const line of collectLines()) {
    if (generated >= limit) break;
    const text = speakable(line.text);
    const key = `${provider.tag}|${text}`;
    const out = join(PUBLIC_DIR, line.audio);
    if (!force && manifest[line.audio] === key && existsSync(out)) continue;

    mkdirSync(dirname(out), { recursive: true });
    process.stdout.write(`🎙️  ${line.audio}  ←  ${text}\n`);
    if (provider.synthesize(text, out)) {
      manifest[line.audio] = key;
      generated++;
    } else {
      failed++;
      if (generated === 0) {
        process.stderr.write('\nFirst line failed — stopping. See the error above.\n');
        break;
      }
    }
  }

  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  process.stdout.write(`\nDone: ${generated} generated, ${failed} failed.\n`);
  if (failed) process.exitCode = 1;
}

main();
