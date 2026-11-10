import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, F, SPRING, SPRING_POP, numeric} from '../theme';
import {tween, useIn} from '../lib/timing';

/** Rounded glassy card that springs in from below. */
export const Card: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: 'up' | 'left' | 'right' | 'scale';
  accent?: string;
}> = ({at, x, y, w, h, children, style, from = 'up', accent}) => {
  const p = useIn(at, SPRING);
  const off = (1 - p) * 60;
  const t =
    from === 'up' ? `translateY(${off}px)` : from === 'left' ? `translateX(${-off * 2}px)` : from === 'right' ? `translateX(${off * 2}px)` : `scale(${0.85 + 0.15 * p})`;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        background: `linear-gradient(160deg, ${C.cardHi} 0%, ${C.card} 100%)`,
        borderRadius: 28,
        border: `2px solid ${C.line}`,
        boxShadow: '0 30px 60px rgba(3,10,24,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: 40,
        boxSizing: 'border-box',
        opacity: interpolate(p, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'}),
        transform: t,
        borderTop: accent ? `6px solid ${accent}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Pill / chip label that pops in. */
export const Pill: React.FC<{at: number; color?: string; text: string; size?: number; textColor?: string; style?: React.CSSProperties}> = ({
  at,
  color = C.green,
  text,
  size = 34,
  textColor = C.ink,
  style,
}) => {
  const p = useIn(at, SPRING_POP);
  return (
    <span
      style={{
        display: 'inline-block',
        background: color,
        color: textColor,
        fontFamily: F.title,
        fontWeight: 800,
        fontSize: size,
        padding: `${size * 0.22}px ${size * 0.6}px`,
        borderRadius: 999,
        transform: `scale(${p})`,
        opacity: Math.min(1, p * 2),
        whiteSpace: 'nowrap',
        ...numeric,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

/** Small kicker at the top-left: scene number + title. */
export const SceneTag: React.FC<{n: number; title: string; at?: number}> = ({n, title, at = 6}) => {
  const p = useIn(at, SPRING);
  return (
    <div
      style={{
        position: 'absolute',
        left: 96,
        top: 72,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        fontFamily: F.body,
        fontWeight: 600,
        fontSize: 26,
        color: C.muted,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{width: 44, height: 44, borderRadius: 12, background: C.amber, color: C.ink, display: 'grid', placeItems: 'center', fontFamily: F.title, fontWeight: 900, fontSize: 24}}>
        {n}
      </span>
      {title}
    </div>
  );
};

/** Burst of small rays (used after checks, results). */
export const Sparkle: React.FC<{at: number; x: number; y: number; color?: string; r?: number}> = ({at, x, y, color = C.green, r = 60}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (p <= 0 || p >= 1) return null;
  return (
    <svg style={{position: 'absolute', left: x - r * 1.5, top: y - r * 1.5, width: r * 3, height: r * 3, overflow: 'visible'}}>
      {Array.from({length: 8}).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r1 = r * (0.5 + p * 0.8);
        const r2 = r * (0.7 + p * 0.9);
        return (
          <line
            key={i}
            x1={r * 1.5 + Math.cos(a) * r1}
            y1={r * 1.5 + Math.sin(a) * r1}
            x2={r * 1.5 + Math.cos(a) * r2}
            y2={r * 1.5 + Math.sin(a) * r2}
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={1 - p}
          />
        );
      })}
    </svg>
  );
};

/** Fade-out helper so elements can leave before the next beat. */
export const useOut = (at: number, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number; style?: React.CSSProperties}> = ({
  children,
  size = 30,
  color = C.muted,
  weight = 600,
  style,
}) => <div style={{fontFamily: F.body, fontSize: size, color, fontWeight: weight, ...numeric, ...style}}>{children}</div>;

export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 96, color = C.text, style}) => (
  <div style={{fontFamily: F.title, fontWeight: 800, fontSize: size, color, lineHeight: 1.02, letterSpacing: '-0.015em', ...numeric, ...style}}>{children}</div>
);

/** A "beat" of a scene: visible in [a, b) with a short cross-fade at both ends. */
export const Beat: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const frame = useCurrentFrame();
  if (frame < a - 2 || frame > b + 20) return null;
  const o = Math.min(tween(frame, a, 14), 1 - tween(frame, b, 16));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
