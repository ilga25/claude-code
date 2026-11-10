import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C} from '../theme';

type Shape = {x: number; y: number; r: number; kind: 'circle' | 'square' | 'ring'; color: string; layer: 0 | 1 | 2};

const SHAPES: Shape[] = [
  {x: 220, y: 180, r: 260, kind: 'circle', color: C.bg2, layer: 0},
  {x: 1700, y: 900, r: 340, kind: 'circle', color: '#16407A', layer: 0},
  {x: 1500, y: 160, r: 120, kind: 'square', color: 'rgba(34,197,94,0.20)', layer: 1},
  {x: 360, y: 880, r: 90, kind: 'ring', color: 'rgba(245,183,0,0.22)', layer: 1},
  {x: 1080, y: 520, r: 420, kind: 'circle', color: 'rgba(23,57,106,0.55)', layer: 0},
  {x: 1820, y: 520, r: 60, kind: 'circle', color: 'rgba(34,197,94,0.22)', layer: 2},
  {x: 120, y: 560, r: 54, kind: 'square', color: 'rgba(248,250,252,0.10)', layer: 2},
  {x: 900, y: 80, r: 44, kind: 'ring', color: 'rgba(248,250,252,0.14)', layer: 2},
];

const SPEED = [0.12, 0.3, 0.6]; // parallax: far → near

/**
 * Navy radial gradient + slow parallax shapes (soft, defocused) + vignette.
 * Film grain is added at encode time (ffmpeg `noise`, see remotion.config.ts): true per-pixel
 * grain at 4K without the cost of an SVG turbulence layer in every frame.
 * `drift` lets a scene push the parallax (e.g. while the virtual camera pans).
 */
export const Background: React.FC<{drift?: number; tint?: string}> = ({drift = 0, tint}) => {
  const frame = useCurrentFrame();
  const t = frame / 60;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 90% at 50% 35%, ${tint ?? C.bg2} 0%, ${C.bg} 62%, #071629 100%)`}}>
      {SHAPES.map((s, i) => {
        const sp = SPEED[s.layer];
        const dx = noise2D('x' + i, t * 0.05, 0) * 60 * sp * 3 - drift * sp * 40;
        const dy = noise2D('y' + i, 0, t * 0.05) * 50 * sp * 3;
        const rot = noise2D('r' + i, t * 0.03, 1) * 30;
        const size = s.r * 2;
        const common: React.CSSProperties = {
          position: 'absolute',
          left: s.x - s.r,
          top: s.y - s.r,
          width: size,
          height: size,
          transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
        };
        if (s.kind === 'circle')
          return <div key={i} style={{...common, borderRadius: '50%', background: `radial-gradient(circle, ${s.color} 0%, transparent 70%)`}} />;
        if (s.kind === 'square')
          return <div key={i} style={{...common, borderRadius: s.r * 0.35, background: s.color, filter: `blur(${s.layer === 2 ? 2 : 10}px)`}} />;
        return <div key={i} style={{...common, borderRadius: '50%', border: `${Math.max(6, s.r * 0.12)}px solid ${s.color}`, filter: 'blur(3px)'}} />;
      })}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(4,12,26,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
