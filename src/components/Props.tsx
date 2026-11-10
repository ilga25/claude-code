import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, numeric} from '../theme';
import {rand} from '../lib/timing';

/** Generic (non-official) benefit cheque. */
export const Cheque: React.FC<{
  w?: number;
  amount: React.ReactNode;
  memo?: string;
  strip?: React.ReactNode; // right-hand stub (e.g. "−Medicare")
  amountSize?: number;
  style?: React.CSSProperties;
}> = ({w = 900, amount, memo = 'Beneficio mensual', strip, amountSize = 120, style}) => {
  const h = w * 0.44;
  const u = w / 900;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: 24 * u,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E7F6EC 100%)',
        boxShadow: '0 30px 70px rgba(3,10,24,0.5)',
        overflow: 'hidden',
        color: C.ink,
        ...style,
      }}
    >
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.08}}>
        {Array.from({length: 14}).map((_, i) => (
          <path key={i} d={`M0 ${i * 30 * u} q ${225 * u} ${-24 * u} ${450 * u} 0 t ${450 * u} 0`} fill="none" stroke={C.green} strokeWidth={3} />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 44 * u, top: 34 * u, fontFamily: F.title, fontWeight: 800, fontSize: 30 * u, letterSpacing: '0.06em', color: C.bg2}}>CHEQUE · BENEFICIO</div>
      <div style={{position: 'absolute', right: (strip ? 250 : 44) * u, top: 34 * u, fontFamily: F.body, fontWeight: 600, fontSize: 24 * u, color: '#475569'}}>{memo}</div>
      <div style={{position: 'absolute', left: 44 * u, top: 96 * u, fontFamily: F.body, fontSize: 24 * u, color: '#475569'}}>Páguese a: TÚ</div>
      <div
        style={{
          position: 'absolute',
          left: 44 * u,
          top: 150 * u,
          fontFamily: F.title,
          fontWeight: 900,
          fontSize: amountSize * u,
          whiteSpace: 'nowrap',
          color: C.ink,
          letterSpacing: '-0.02em',
          ...numeric,
        }}
      >
        {amount}
      </div>
      <div style={{position: 'absolute', left: 44 * u, right: (strip ? 250 : 44) * u, bottom: 46 * u, height: 3 * u, background: '#94A3B8'}} />
      {strip ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 220 * u,
            borderLeft: `${4 * u}px dashed #94A3B8`,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(239,68,68,0.10)',
          }}
        >
          {strip}
        </div>
      ) : null}
    </div>
  );
};

/** Gold coin with $ sign. */
export const Coin: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 70, style}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
    <circle cx={50} cy={50} r={46} fill="#E9A800" />
    <circle cx={50} cy={50} r={38} fill={C.amber} />
    <circle cx={50} cy={50} r={38} fill="none" stroke="#FFE08A" strokeWidth={4} strokeDasharray="6 8" />
    <text x={50} y={66} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={900} fontSize={46} fill="#8A5A00">
      $
    </text>
  </svg>
);

/** Coins that fall with simple gravity and bounce once on `floor`. */
export const CoinRain: React.FC<{at: number; count?: number; floor?: number; width?: number; seed?: number}> = ({at, count = 18, floor = 820, width = 1920, seed = 1}) => {
  const frame = useCurrentFrame();
  const t0 = frame - at;
  if (t0 < 0) return null;
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const delay = rand(seed * 100 + i) * 40;
        const t = (t0 - delay) / 60;
        if (t < 0) return null;
        const x0 = 160 + rand(seed * 200 + i) * (width - 320);
        const vx = (rand(seed * 300 + i) - 0.5) * 240;
        const g = 2600;
        const y0 = -100 - rand(seed * 400 + i) * 200;
        let y = y0 + 0.5 * g * t * t;
        // one bounce, then rest
        const tHit = Math.sqrt((2 * (floor - y0)) / g);
        if (t > tHit) {
          const tb = t - tHit;
          const v = g * tHit * 0.35;
          y = floor - Math.max(0, v * tb - 0.5 * g * tb * tb);
        }
        const x = x0 + vx * Math.min(t, tHit + 0.3);
        const rot = (rand(seed * 500 + i) - 0.5) * 720 * Math.min(t, tHit);
        const size = 56 + rand(seed * 600 + i) * 40;
        const fade = interpolate(t, [tHit + 1.2, tHit + 1.8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return <Coin key={i} size={size} style={{position: 'absolute', left: x, top: y - size, transform: `rotate(${rot}deg)`, opacity: fade}} />;
      })}
    </>
  );
};

/** Red scissors (original drawing). `open` 0..1 */
export const Scissors: React.FC<{size?: number; open?: number; style?: React.CSSProperties}> = ({size = 220, open = 0.5, style}) => {
  const a = 6 + open * 22;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <g style={{transform: `rotate(${-a}deg)`, transformOrigin: '100px 100px'}}>
        <path d="M100 100 L196 94 Q200 100 196 104 Z" fill="#E2E8F0" />
        <circle cx={46} cy={100} r={26} fill="none" stroke={C.red} strokeWidth={14} />
        <path d="M70 100 L100 100" stroke={C.red} strokeWidth={14} strokeLinecap="round" />
      </g>
      <g style={{transform: `rotate(${a}deg)`, transformOrigin: '100px 100px'}}>
        <path d="M100 100 L196 106 Q200 100 196 96 Z" fill="#CBD5E1" />
        <circle cx={46} cy={100} r={26} fill="none" stroke={C.red} strokeWidth={14} />
        <path d="M70 100 L100 100" stroke={C.red} strokeWidth={14} strokeLinecap="round" />
      </g>
      <circle cx={100} cy={100} r={7} fill="#475569" />
    </svg>
  );
};

/** Rubber stamp that slams in. */
export const Stamp: React.FC<{at: number; text: string; color?: string; size?: number; rotate?: number; style?: React.CSSProperties}> = ({
  at,
  text,
  color = C.red,
  size = 64,
  rotate = -12,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 11, mass: 0.6, stiffness: 200}});
  if (frame < at) return null;
  return (
    <div
      style={{
        border: `${size * 0.1}px solid ${color}`,
        color,
        fontFamily: F.title,
        fontWeight: 900,
        fontSize: size,
        padding: `${size * 0.1}px ${size * 0.4}px`,
        borderRadius: size * 0.2,
        letterSpacing: '0.08em',
        transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
        opacity: interpolate(p, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}),
        whiteSpace: 'nowrap',
        background: 'rgba(248,250,252,0.06)',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Calendar page with month + day; `shake` makes it vibrate. */
export const CalendarPage: React.FC<{month: string; day: string; color?: string; size?: number; shake?: number; style?: React.CSSProperties}> = ({
  month,
  day,
  color = C.amber,
  size = 300,
  shake = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const r = shake ? Math.sin(frame * 1.9) * 4 * shake : 0;
  return (
    <div
      style={{
        width: size,
        height: size * 1.05,
        borderRadius: size * 0.1,
        background: '#F8FAFC',
        boxShadow: '0 30px 60px rgba(3,10,24,0.45)',
        overflow: 'hidden',
        transform: `rotate(${r}deg)`,
        ...style,
      }}
    >
      <div style={{background: color, height: size * 0.3, display: 'grid', placeItems: 'center', fontFamily: F.title, fontWeight: 900, fontSize: size * 0.16, color: C.ink, letterSpacing: '0.08em'}}>
        {month}
      </div>
      <div style={{display: 'grid', placeItems: 'center', height: size * 0.75, fontFamily: F.title, fontWeight: 900, fontSize: size * 0.48, color: C.ink, ...numeric}}>{day}</div>
    </div>
  );
};

/** Animated arrow that draws from (x1,y1) to (x2,y2). */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; color?: string; width?: number; dur?: number}> = ({
  x1,
  y1,
  x2,
  y2,
  at,
  color = C.green,
  width = 10,
  dur = 24,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hs = width * 2.6;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'visible', pointerEvents: 'none'}}>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {p > 0.05 ? (
        <path
          d={`M ${x + Math.cos(ang - 2.5) * hs} ${y + Math.sin(ang - 2.5) * hs} L ${x} ${y} L ${x + Math.cos(ang + 2.5) * hs} ${y + Math.sin(ang + 2.5) * hs}`}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </svg>
  );
};
