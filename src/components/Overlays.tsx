import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {hasFile} from './Sfx';
import {WORDS, FPS} from '../lib/timing';

/** Small fixed disclaimer, shown during [from, to] (absolute frames). */
export const Disclaimer: React.FC<{ranges: [number, number][]}> = ({ranges}) => {
  const frame = useCurrentFrame();
  const r = ranges.find(([a, b]) => frame >= a - 20 && frame <= b + 20);
  if (!r) return null;
  const o = Math.min(
    interpolate(frame, [r[0] - 20, r[0]], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [r[1], r[1] + 20], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  return (
    <AbsoluteFill style={{alignItems: 'flex-end', padding: '64px 96px', pointerEvents: 'none'}}>
      <div
        style={{
          opacity: o * 0.92,
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 22,
          color: C.text,
          background: 'rgba(11,31,58,0.7)',
          border: `1.5px solid ${C.line}`,
          borderRadius: 999,
          padding: '8px 20px',
        }}
      >
        Información educativa, no asesoría financiera
      </div>
    </AbsoluteFill>
  );
};

const dB = (d: number) => Math.pow(10, d / 20);

/** Voice (+ optional music with automatic ducking under the voice). */
export const AudioLayer: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const voice = hasFile('voz.wav') ? 'voz.wav' : hasFile('voz.mp3') ? 'voz.mp3' : null;
  const music = hasFile('musica.mp3') ? 'musica.mp3' : null;
  // speech mask per frame (with 0.25 s padding) for ducking
  const speaking = React.useMemo(() => {
    const m = new Uint8Array(durationInFrames + 1);
    for (const w of WORDS) {
      const a = Math.max(0, Math.floor(((w.startMs - 250) / 1000) * FPS));
      const b = Math.min(durationInFrames, Math.ceil(((w.endMs + 250) / 1000) * FPS));
      for (let f = a; f <= b; f++) m[f] = 1;
    }
    return m;
  }, [durationInFrames]);
  const duckAt = (f: number) => {
    // smooth over ±12 frames so the music glides between levels
    let s = 0;
    let n = 0;
    for (let k = -12; k <= 12; k++) {
      const i = f + k;
      if (i < 0 || i > durationInFrames) continue;
      s += speaking[i];
      n++;
    }
    return s / n;
  };
  return (
    <>
      {voice ? <Audio src={staticFile(voice)} /> : null}
      {music ? (
        <Audio
          src={staticFile(music)}
          loop
          volume={(f) => {
            const fade = Math.min(
              interpolate(f, [0, 2 * FPS], [0, 1], {extrapolateRight: 'clamp'}),
              interpolate(f, [durationInFrames - 2 * FPS, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
            );
            const d = duckAt(f);
            return fade * (dB(-24) * (1 - d) + dB(-30) * d);
          }}
        />
      ) : null}
    </>
  );
};
