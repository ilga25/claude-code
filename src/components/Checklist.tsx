import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SPRING, numeric} from '../theme';
import {Sparkle} from './Ui';
import {Sfx} from './Sfx';

/** Items slide in at `at`, then get a green check (drawn) + sparkle at `checkAt`. */
export const Checklist: React.FC<{
  items: {text: string; sub?: string; at: number; checkAt: number}[];
  width: number;
  rowH?: number;
  size?: number;
}> = ({items, width, rowH = 150, size = 46}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'relative', width, height: items.length * rowH}}>
      {items.map((it, i) => {
        const p = spring({frame: frame - it.at, fps, config: SPRING});
        const c = interpolate(frame, [it.checkAt, it.checkAt + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const boxPop = spring({frame: frame - it.checkAt, fps, config: {damping: 10, mass: 0.6}});
        const box = 84;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * rowH,
              left: 0,
              width,
              height: rowH - 24,
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              opacity: p,
              transform: `translateX(${(1 - p) * -80}px)`,
            }}
          >
            <div style={{position: 'relative', width: box, height: box, flex: 'none', transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, boxPop) * Math.PI)})`}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 22,
                  border: `5px solid ${c > 0 ? C.green : C.muted}`,
                  background: c > 0 ? 'rgba(34,197,94,0.16)' : 'transparent',
                }}
              />
              <svg viewBox="0 0 120 120" style={{position: 'absolute', inset: 6}}>
                <path d="M28 62 l22 22 l44 -48" pathLength={1} fill="none" stroke={C.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - c} />
              </svg>
              <Sparkle at={it.checkAt + 10} x={box / 2} y={box / 2} r={70} />
              <Sfx name="click" at={it.checkAt} volume={0.3} />
            </div>
            <div>
              <div style={{fontFamily: F.title, fontWeight: 800, fontSize: size, color: C.text, ...numeric}}>{it.text}</div>
              {it.sub ? <div style={{fontFamily: F.body, fontWeight: 400, fontSize: size * 0.62, color: C.muted, marginTop: 6}}>{it.sub}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
