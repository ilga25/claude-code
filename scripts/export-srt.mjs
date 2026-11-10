// Writes out/subtitulos.srt from src/data/transcript.json (same cues as the burned-in subtitles).
import fs from 'node:fs';
import {buildCues} from '../src/lib/cues.js';

const {words} = JSON.parse(fs.readFileSync('src/data/transcript.json', 'utf8'));
const ts = (ms) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = Math.round(ms % 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(r).padStart(3, '0')}`;
};
const cues = buildCues(words);
const srt = cues.map((c, i) => `${i + 1}\n${ts(c.startMs)} --> ${ts(c.endMs)}\n${c.words.map((w) => w.text).join(' ')}\n`).join('\n');
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/subtitulos.srt', srt);
console.log(`✓ out/subtitulos.srt (${cues.length} subtítulos)`);
