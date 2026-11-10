import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import transcript from '../data/transcript.json';
import timeline from '../data/timeline.json';
import {ease, SPRING} from '../theme';

export type Word = {text: string; startMs: number; endMs: number; escena: number};
export const WORDS = transcript.words as Word[];
export const TIMELINE = timeline;
export const FPS = timeline.fps;

export const sceneOf = (escena: number) => timeline.scenes.find((s) => s.escena === escena)!;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(\d)[.,](\d)/g, '$1$2')
    .replace(/[^a-z0-9%$]+/g, ' ')
    .trim();

// Flat token list: each normalized token remembers the word it came from.
const TOKENS: {tok: string; word: number}[] = WORDS.flatMap((w, i) =>
  norm(w.text)
    .split(' ')
    .filter(Boolean)
    .map((tok) => ({tok, word: i})),
);

/**
 * Frame (relative to the start of the scene) at which `phrase` is spoken in `escena`.
 * Matching ignores case, accents and punctuation; `nth` picks a later occurrence.
 */
export function wordFrame(phrase: string, escena: number, nth = 0): number {
  const want = norm(phrase).split(' ');
  const scene = sceneOf(escena);
  let seen = 0;
  for (let i = 0; i < TOKENS.length; i++) {
    const w = WORDS[TOKENS[i].word];
    if (w.escena !== escena) continue;
    if (want.every((t, k) => TOKENS[i + k]?.tok === t)) {
      if (seen++ === nth) return Math.round((w.startMs / 1000) * FPS) - scene.inicioFrame;
    }
  }
  throw new Error(`useWordFrame: "${phrase}" (#${nth}) no aparece en la escena ${escena}`);
}

/** Hook form requested in the brief: useWordFrame("palabra", escena). */
export const useWordFrame = (phrase: string, escena: number, nth = 0) => wordFrame(phrase, escena, nth);

/** Bound helper for a scene: const w = sceneWords(4); w('1.200') */
export const sceneWords = (escena: number) => (phrase: string, nth = 0) => wordFrame(phrase, escena, nth);

/** Spring 0→1 starting at `start` (scene-relative frame). */
export function useIn(start: number, config = SPRING) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - start, fps, config});
}

/** Eased 0→1 over [start, start+dur]. */
export function useTween(start: number, dur: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
}

export const tween = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const usd = (n: number, decimals = 0) =>
  '$' + n.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
