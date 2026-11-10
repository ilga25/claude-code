import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {ease} from '../theme';

export type CamKey = {frame: number; x?: number; y?: number; scale?: number};

/**
 * Virtual camera: eased push-ins / pans between keyframes, plus a constant
 * micro-drift and "breathing" so no shot is ever fully still.
 * x/y are the point of the 1920x1080 canvas that should sit at the centre.
 */
export const Camera: React.FC<{keys?: CamKey[]; children: React.ReactNode; drift?: number}> = ({keys = [], children, drift = 1}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const all: Required<CamKey>[] = [{frame: 0, x: cx, y: cy, scale: 1}];
  for (const k of keys) {
    const p = all[all.length - 1];
    all.push({frame: k.frame, x: k.x ?? p.x, y: k.y ?? p.y, scale: k.scale ?? p.scale});
  }
  let x = all[0].x;
  let y = all[0].y;
  let s = all[0].scale;
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1];
    const b = all[i];
    const dur = 45; // each move takes 0.75 s
    if (frame >= b.frame) {
      const p = interpolate(frame, [b.frame, b.frame + dur], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
      s = a.scale + (b.scale - a.scale) * p;
    }
  }
  const t = frame / 60;
  const breathe = 1 + 0.01 * (1 - Math.cos((t / 6) * Math.PI * 2)); // 1.00 → 1.02, 6 s period
  const jx = noise2D('camx', t * 0.15, 0) * 6 * drift;
  const jy = noise2D('camy', 0, t * 0.15) * 4 * drift;
  const scale = s * breathe;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        transform: `scale(${scale}) translate(${cx - x + jx}px, ${cy - y + jy}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
