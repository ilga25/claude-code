// With voz.mp3: transcribe with whisper.cpp, align to guion.md and rebuild the timeline.
// Usage: npm run timeline:whisper  [-- --model medium|large-v3]
// Needs network access to github.com (whisper.cpp) and huggingface.co (models) the first time.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {installWhisperCpp, downloadWhisperModel, transcribe, toCaptions} from '@remotion/install-whisper-cpp';
import {parseGuion, normalize} from './lib/guion.mjs';
import {writeOutputs, report} from './lib/timeline.mjs';

const model = process.argv.includes('--model') ? process.argv[process.argv.indexOf('--model') + 1] : 'medium';
const src = ['public/voz.wav', 'voz.mp3', 'public/voz.mp3'].find((p) => fs.existsSync(p));
if (!src) throw new Error('No encuentro voz.mp3 (ni public/voz.wav). Ponlo en la raíz del proyecto.');

const WHISPER = path.resolve('.whisper');
const WHISPER_VERSION = '1.7.4';
await installWhisperCpp({to: WHISPER, version: WHISPER_VERSION});
await downloadWhisperModel({model, folder: WHISPER});

const wav16 = path.resolve('.whisper/voz-16k.wav');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-ar', '16000', '-ac', '1', wav16]);
const durMs = Math.round(
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString()) * 1000,
);

const out = await transcribe({
  inputPath: wav16,
  whisperPath: WHISPER,
  whisperCppVersion: WHISPER_VERSION,
  model,
  language: 'es',
  tokenLevelTimestamps: true,
  splitOnWord: true,
});
const {captions} = toCaptions({whisperCppOutput: out});
const heard = captions
  .map((c) => ({text: c.text.trim(), startMs: c.startMs, endMs: c.endMs, n: normalize(c.text)}))
  .filter((c) => c.n);
fs.writeFileSync('.whisper/raw-captions.json', JSON.stringify(heard, null, 1));

// Align script words to heard words (Needleman–Wunsch on normalized tokens).
const scenes = parseGuion();
const script = scenes.flatMap((s) =>
  s.lines.flatMap((l, li) => l.split(/[ \t\n]+/).filter(Boolean).map((text) => ({text, escena: s.escena, line: `${s.escena}-${li}`, n: normalize(text)}))),
);
const A = script.length;
const B = heard.length;
const sim = (a, b) => (a === b ? 2 : a && b && (a.startsWith(b) || b.startsWith(a)) ? 1 : -1);
const score = Array.from({length: A + 1}, () => new Float32Array(B + 1));
const move = Array.from({length: A + 1}, () => new Uint8Array(B + 1));
for (let i = 1; i <= A; i++) (score[i][0] = -i), (move[i][0] = 1);
for (let j = 1; j <= B; j++) (score[0][j] = -j), (move[0][j] = 2);
for (let i = 1; i <= A; i++)
  for (let j = 1; j <= B; j++) {
    const d = score[i - 1][j - 1] + sim(script[i - 1].n, heard[j - 1].n);
    const u = score[i - 1][j] - 1;
    const l = score[i][j - 1] - 1;
    if (d >= u && d >= l) (score[i][j] = d), (move[i][j] = 0);
    else if (u >= l) (score[i][j] = u), (move[i][j] = 1);
    else (score[i][j] = l), (move[i][j] = 2);
  }
const match = new Array(A).fill(-1);
for (let i = A, j = B; i > 0 || j > 0; ) {
  const m = move[i][j];
  if (m === 0) (match[i - 1] = j - 1), i--, j--;
  else if (m === 1) i--;
  else j--;
}
const matched = match.filter((m) => m >= 0).length;
console.log(`Alineadas ${matched}/${A} palabras del guion (${Math.round((matched / A) * 100)} %).`);

// Script words keep their spelling; timings come from whisper, gaps are interpolated.
const words = script.map((w, i) => ({text: w.text, escena: w.escena, line: w.line, startMs: NaN, endMs: NaN}));
match.forEach((j, i) => j >= 0 && ((words[i].startMs = heard[j].startMs), (words[i].endMs = heard[j].endMs)));
for (let i = 0; i < A; i++) {
  if (!Number.isNaN(words[i].startMs)) continue;
  let k = i;
  while (k < A && Number.isNaN(words[k].startMs)) k++;
  const from = i > 0 ? words[i - 1].endMs : 0;
  const to = k < A ? words[k].startMs : durMs;
  const step = (to - from) / (k - i + 1);
  for (let x = i; x < k; x++) (words[x].startMs = Math.round(from + step * (x - i + 0.5))), (words[x].endMs = Math.round(from + step * (x - i + 1)));
  i = k - 1;
}
const lines = [];
for (const w of words) {
  const last = lines.at(-1);
  if (last && last.key === w.line) (last.text += ' ' + w.text), (last.endMs = w.endMs);
  else lines.push({key: w.line, escena: w.escena, text: w.text, startMs: w.startMs, endMs: w.endMs});
}
report(
  writeOutputs({
    words: words.map(({line, ...w}) => w),
    lines: lines.map(({key, ...l}) => l),
    source: `whisper-${model}`,
    audioDurationMs: durMs,
    scenes,
  }),
);
