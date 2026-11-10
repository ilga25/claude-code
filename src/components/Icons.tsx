import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, ease} from '../theme';

// Original line icons: 120x120 grid, stroke 6, round caps. No logos, no official seals.
const PATHS: Record<string, string[]> = {
  calendar: ['M22 30 h76 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-76 a8 8 0 0 1 -8 -8 v-58 a8 8 0 0 1 8 -8 z', 'M14 50 h92', 'M38 18 v22', 'M82 18 v22'],
  check: ['M28 62 l22 22 l44 -48'],
  x: ['M30 30 l60 60', 'M90 30 l-60 60'],
  phone: ['M42 12 h36 a8 8 0 0 1 8 8 v80 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 v-80 a8 8 0 0 1 8 -8 z', 'M54 94 h12'],
  shield: ['M60 12 l40 14 v30 c0 28 -18 44 -40 52 c-22 -8 -40 -24 -40 -52 v-30 z', 'M42 60 l12 12 l24 -26'],
  envelope: ['M14 32 h92 v60 h-92 z', 'M14 32 l46 36 l46 -36'],
  hourglass: ['M30 12 h60', 'M30 108 h60', 'M36 12 c0 30 48 30 48 48 c0 18 -48 18 -48 48', 'M84 12 c0 30 -48 30 -48 48 c0 18 48 18 48 48'],
  thermometer: ['M50 20 a10 10 0 0 1 20 0 v52 a20 20 0 1 1 -20 0 z', 'M60 40 v46'],
  cart: ['M10 22 h16 l12 52 h52 l12 -38 h-70', 'M44 96 a6 6 0 1 0 0.1 0', 'M84 96 a6 6 0 1 0 0.1 0'],
  bell: ['M30 84 v-30 a30 30 0 0 1 60 0 v30 l8 10 h-76 z', 'M50 104 a10 10 0 0 0 20 0'],
  gift: ['M18 46 h84 v18 h-84 z', 'M26 64 v40 h68 v-40', 'M60 46 v58', 'M60 46 c-10 -22 -34 -18 -26 -4 c4 6 16 4 26 4 c10 0 22 2 26 -4 c8 -14 -16 -18 -26 4'],
  laptop: ['M24 26 h72 v52 h-72 z', 'M10 92 h100 l-8 -14 h-84 z'],
  info: ['M60 14 a46 46 0 1 1 -0.1 0', 'M60 54 v32', 'M60 36 v2'],
  clock: ['M60 14 a46 46 0 1 1 -0.1 0', 'M60 34 v28 l18 12'],
  crypto: ['M60 14 a46 46 0 1 1 -0.1 0', 'M48 36 v48', 'M48 38 h16 a10 10 0 0 1 0 20 h-16 h18 a11 11 0 0 1 0 22 h-18', 'M56 30 v8', 'M56 82 v8'],
  transfer: ['M18 44 h76', 'M78 28 l16 16 l-16 16', 'M102 78 h-76', 'M42 62 l-16 16 l16 16'],
  doctor: ['M38 16 v28 a22 22 0 0 0 44 0 v-28', 'M60 66 v14 a18 18 0 0 0 36 0 v-10', 'M96 62 a8 8 0 1 0 0.1 0'],
  pills: ['M24 76 l36 -36 a17 17 0 0 1 24 24 l-36 36 a17 17 0 0 1 -24 -24 z', 'M42 58 l24 24'],
  person: ['M60 18 a18 18 0 1 1 -0.1 0', 'M24 104 c0 -24 16 -38 36 -38 s36 14 36 38'],
  arrowUp: ['M60 100 v-78', 'M30 50 l30 -30 l30 30'],
  arrowRight: ['M14 60 h88', 'M72 30 l30 30 l-30 30'],
  house: ['M16 58 L60 20 L104 58', 'M28 48 v56 h64 v-56', 'M50 104 v-30 h20 v30'],
  doc: ['M30 12 h40 l22 22 v74 h-62 z', 'M70 12 v22 h22', 'M42 58 h36', 'M42 74 h36', 'M42 90 h22'],
};

export type IconName = keyof typeof PATHS;

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  draw?: {at: number; dur?: number};
  style?: React.CSSProperties;
  stroke?: number;
}> = ({name, size = 96, color = C.text, draw, style, stroke = 6}) => {
  const frame = useCurrentFrame();
  const p = draw ? interpolate(frame, [draw.at, draw.at + (draw.dur ?? 24)], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{overflow: 'visible', ...style}}>
      {PATHS[name].map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={draw ? 1 : undefined}
          strokeDashoffset={draw ? 1 - p : undefined}
        />
      ))}
    </svg>
  );
};
