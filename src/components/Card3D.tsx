import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

/** Card that flips in 3D (perspective 1200px, rotateY) from `front` to `back` at `flipAt`. */
export const Card3D: React.FC<{
  w: number;
  h: number;
  enterAt: number;
  flipAt: number;
  front: React.ReactNode;
  back: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({w, h, enterAt, flipAt, front, back, accent = C.line, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - enterAt, fps, config: {damping: 16, mass: 0.9}});
  const flip = spring({frame: frame - flipAt, fps, config: {damping: 15, mass: 1, stiffness: 90}});
  const rot = flip * 180;
  const face: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 28,
    padding: 40,
    boxSizing: 'border-box',
    background: `linear-gradient(160deg, ${C.cardHi}, ${C.card})`,
    border: `3px solid ${accent}`,
    boxShadow: '0 30px 60px rgba(3,10,24,0.5)',
  };
  return (
    <div style={{width: w, height: h, perspective: 1200, opacity: interpolate(enter, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}), ...style}}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `translateY(${(1 - enter) * 80}px) rotateY(${rot}deg) scale(${1 + Math.sin(flip * Math.PI) * 0.06})`,
        }}
      >
        <div style={face}>{front}</div>
        <div style={{...face, transform: 'rotateY(180deg)'}}>{back}</div>
      </div>
    </div>
  );
};
