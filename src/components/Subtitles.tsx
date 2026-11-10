import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {buildCues} from '../lib/cues.js';
import {WORDS, FPS, type Word} from '../lib/timing';
import {C, F} from '../theme';

/** Burned-in karaoke subtitles: max 2 lines, the spoken word lights up in amber. */
export const Subtitles: React.FC<{raiseRanges?: [number, number][]}> = ({raiseRanges = []}) => {
  const frame = useCurrentFrame();
  const cues = useMemo(() => buildCues(WORDS), []);
  const ms = (frame / FPS) * 1000;
  const cue = cues.find((c) => ms >= c.startMs && ms <= c.endMs);
  if (!cue) return null;
  const fadeIn = interpolate(ms, [cue.startMs, cue.startMs + 120], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(ms, [cue.endMs - 120, cue.endMs], [1, 0], {extrapolateLeft: 'clamp'});
  const raised = raiseRanges.some(([a, b]) => frame >= a && frame <= b);
  return (
    <AbsoluteFill style={{justifyContent: raised ? 'flex-start' : 'flex-end', alignItems: 'center', padding: raised ? '150px 0 0' : '0 0 64px', pointerEvents: 'none'}}>
      <div
        style={{
          maxWidth: 1500,
          background: 'rgba(11,31,58,0.70)',
          borderRadius: 16,
          padding: '14px 30px 16px',
          textAlign: 'center',
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.3,
          color: C.text,
          opacity: Math.min(fadeIn, fadeOut),
          fontVariantNumeric: 'tabular-nums',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        {cue.words.map((w: Word, i: number) => {
          const active = ms >= w.startMs && ms < (cue.words[i + 1]?.startMs ?? w.endMs + 200);
          return (
            <span key={i} style={{color: active ? C.amber : C.text}}>
              {w.text}
              {i < cue.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
