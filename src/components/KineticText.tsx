import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {C, F, SPRING, STAGGER, ease} from '../theme';

/**
 * Words rise into view through a clip-path mask, staggered.
 * `marks` colours words (by index) and can draw a hand-drawn underline under them.
 */
export const KineticText: React.FC<{
  text: string;
  start: number;
  size?: number;
  weight?: number;
  color?: string;
  font?: 'title' | 'body';
  stagger?: number;
  align?: 'left' | 'center';
  maxWidth?: number;
  lineHeight?: number;
  marks?: Record<number, {color?: string; underline?: boolean; at?: number}>;
  style?: React.CSSProperties;
}> = ({text, start, size = 72, weight = 800, color = C.text, font = 'title', stagger = STAGGER, align = 'left', maxWidth, lineHeight = 1.12, marks = {}, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div
      style={{
        fontFamily: font === 'title' ? F.title : F.body,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        textAlign: align,
        maxWidth,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
        letterSpacing: font === 'title' ? '-0.01em' : 0,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({frame: frame - start - i * stagger, fps, config: SPRING});
        const m = marks[i];
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', clipPath: 'inset(-20% -10% -30% -10%)', paddingBottom: size * 0.08}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - p) * 110}%)`,
                opacity: interpolate(p, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
                color: m?.color ?? color,
              }}
            >
              {w}
            </span>
            {m?.underline ? <Underline at={m.at ?? start + i * stagger + 14} color={m.color ?? C.amber} width={size * 0.1} /> : null}
          </span>
        );
      })}
    </div>
  );
};

/** Hand-drawn underline that draws itself (evolvePath). */
export const Underline: React.FC<{at: number; color?: string; width?: number; dur?: number}> = ({at, color = C.amber, width = 8, dur = 22}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const d = 'M 2 14 C 60 4, 140 4, 198 10 S 300 18, 398 8';
  const {strokeDasharray, strokeDashoffset} = evolvePath(p, d);
  return (
    <svg viewBox="0 0 400 22" preserveAspectRatio="none" style={{position: 'absolute', left: '-2%', bottom: -width * 0.6, width: '104%', height: width * 2.4, overflow: 'visible'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={width * 0.9} strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
    </svg>
  );
};

/** Text typed letter by letter with a caret. */
export const Typewriter: React.FC<{text: string; start: number; cps?: number; keepCaret?: boolean; style?: React.CSSProperties}> = ({
  text,
  start,
  cps = 28,
  keepCaret = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - start) / 60) * cps));
  const caretOn = n < text.length || (keepCaret && Math.floor(frame / 18) % 2 === 0);
  return (
    <span style={style}>
      {text.slice(0, n)}
      <span style={{opacity: n > 0 && caretOn ? 1 : 0, color: C.amber}}>▍</span>
    </span>
  );
};
