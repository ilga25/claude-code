// Renders review stills: 3 moments per scene (or explicit frames).
// Usage: npm run stills            → all scenes
//        npm run stills -- 3 5     → scenes 3 and 5
//        npm run stills -- @1234   → a single absolute frame
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const timeline = JSON.parse(fs.readFileSync('src/data/timeline.json', 'utf8'));
const args = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_CHROME || undefined;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: 'Video', browserExecutable});
fs.mkdirSync('out/stills', {recursive: true});

const jobs = [];
for (const a of args.filter((x) => x.startsWith('@'))) jobs.push({frame: Number(a.slice(1)), name: `frame-${a.slice(1)}`});
const wanted = args.filter((x) => !x.startsWith('@'));
if (!jobs.length || wanted.length) {
  const list = [...timeline.scenes, {escena: 'fin', ...timeline.endScreen}];
  for (const s of list) {
    if (wanted.length && !wanted.includes(String(s.escena))) continue;
    const len = s.finFrame - s.inicioFrame;
    [0.25, 0.6, 0.92].forEach((p, k) => jobs.push({frame: s.inicioFrame + Math.round(len * p), name: `escena-${s.escena}-${k + 1}`}));
  }
}
for (const j of jobs) {
  await renderStill({composition: comp, serveUrl, frame: j.frame, output: `out/stills/${j.name}.png`, browserExecutable, scale: 1});
  console.log(`✓ out/stills/${j.name}.png (frame ${j.frame})`);
}
