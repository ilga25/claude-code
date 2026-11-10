// Without voz.mp3: estimate word timings from guion.md at ~145 words/min.
// Pauses mirror the voice advice in the brief (0.5 s between scenes).
import {parseGuion, syllables} from './lib/guion.mjs';
import {writeOutputs, report} from './lib/timeline.mjs';

const WPM = 145;
const LEAD_MS = 400;
const LINE_GAP_MS = 350;
const SCENE_GAP_MS = 500;
const PAUSE = {',': 160, ';': 220, ':': 260, '.': 340, '?': 380, '!': 380};

const scenes = parseGuion();
const all = scenes.flatMap((s) => s.lines.flatMap((l) => l.split(/[ \t\n]+/).filter(Boolean)));
const totalSyl = all.reduce((a, w) => a + syllables(w), 0);
// 145 wpm is the overall pace *including* pauses, so pauses come out of the budget.
const pauseMs = all.reduce((a, w) => a + (PAUSE[w.at(-1)] ?? 0), 0);
const nLines = scenes.reduce((a, s) => a + s.lines.length, 0);
const gapsMs = (nLines - scenes.length) * LINE_GAP_MS + (scenes.length - 1) * SCENE_GAP_MS;
const msPerSyl = ((all.length / WPM) * 60_000 - pauseMs - gapsMs) / totalSyl;

let t = LEAD_MS;
const words = [];
const lines = [];
scenes.forEach((s, si) => {
  if (si > 0) t += SCENE_GAP_MS;
  s.lines.forEach((line, li) => {
    if (li > 0) t += LINE_GAP_MS;
    const lineStart = t;
    for (const w of line.split(/[ \t\n]+/).filter(Boolean)) {
      const d = syllables(w) * msPerSyl;
      words.push({text: w, startMs: Math.round(t), endMs: Math.round(t + d), escena: s.escena});
      t += d + (PAUSE[w.at(-1)] ?? 0);
    }
    lines.push({escena: s.escena, text: line, startMs: Math.round(lineStart), endMs: Math.round(t)});
  });
});

report(writeOutputs({words, lines, source: 'estimate', audioDurationMs: null, scenes}));
