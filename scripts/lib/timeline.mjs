// Builds src/data/timeline.json from a word-level transcript.
import fs from 'node:fs';

export const FPS = 60;
export const END_SCREEN_SECONDS = 20;
const SCENE_LEAD_MS = 300; // scene (and its transition) starts slightly before its first word
const TAIL_MS = 1200; // hold after the last word before the end screen

export function writeOutputs({words, lines, source, audioDurationMs, scenes}) {
  const toF = (ms) => Math.round((ms / 1000) * FPS);
  const voiceEnd = audioDurationMs ?? words[words.length - 1].endMs;
  const sceneRows = scenes.map((s, i) => {
    const sw = words.filter((w) => w.escena === s.escena);
    const first = sw[0].startMs;
    const prevEnd = i === 0 ? 0 : words.filter((w) => w.escena === scenes[i - 1].escena).at(-1).endMs;
    const start = i === 0 ? 0 : Math.max(prevEnd + 50, first - SCENE_LEAD_MS);
    return {escena: s.escena, title: s.title, inicioMs: start, firstWordMs: first, lastWordMs: sw.at(-1).endMs};
  });
  const contentEndMs = Math.max(voiceEnd, words.at(-1).endMs + TAIL_MS);
  const timeline = {
    fps: FPS,
    source,
    scenes: sceneRows.map((r, i) => ({
      escena: r.escena,
      title: r.title,
      inicioFrame: toF(r.inicioMs),
      finFrame: toF(i < sceneRows.length - 1 ? sceneRows[i + 1].inicioMs : contentEndMs),
    })),
    endScreen: {inicioFrame: toF(contentEndMs), finFrame: toF(contentEndMs) + END_SCREEN_SECONDS * FPS},
    durationInFrames: toF(contentEndMs) + END_SCREEN_SECONDS * FPS,
  };
  fs.mkdirSync('src/data', {recursive: true});
  fs.writeFileSync('src/data/transcript.json', JSON.stringify({source, fps: FPS, words, lines}, null, 1));
  fs.writeFileSync('src/data/timeline.json', JSON.stringify(timeline, null, 2));
  return timeline;
}

export function report(t) {
  const fmt = (f) => {
    const s = f / FPS;
    return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
  };
  for (const s of t.scenes) console.log(`Escena ${String(s.escena).padStart(2)}  ${fmt(s.inicioFrame)} → ${fmt(s.finFrame)}  ${s.title}`);
  console.log(`Pantalla final ${fmt(t.endScreen.inicioFrame)} → ${fmt(t.endScreen.finFrame)}`);
  console.log(`Total: ${fmt(t.durationInFrames)} (${t.durationInFrames} frames @ ${FPS} fps) · fuente: ${t.source}`);
}
