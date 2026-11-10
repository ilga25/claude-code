import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, STAGGER, numeric} from '../theme';

/** Vertical bars with elastic growth; value labels land at the top of each bar. */
export const BarChart: React.FC<{
  data: {label: string; value: number; highlight?: boolean; color?: string}[];
  start: number;
  width: number;
  height: number;
  format: (v: number) => string;
  max?: number;
  stagger?: number;
}> = ({data, start, width, height, format, max, stagger = STAGGER * 2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = max ?? Math.max(...data.map((d) => d.value));
  const gap = 36;
  const bw = (width - gap * (data.length - 1)) / data.length;
  const chartH = height - 70;
  return (
    <div style={{position: 'relative', width, height}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: chartH, height: 3, background: C.line, borderRadius: 2}} />
      {data.map((d, i) => {
        const at = start + i * stagger;
        const p = spring({frame: frame - at, fps, config: {damping: 9, mass: 0.7, stiffness: 110}}); // elastic overshoot
        const h = (d.value / top) * (chartH - 70) * p;
        const labelP = interpolate(frame, [at + 18, at + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const color = d.color ?? (d.highlight ? C.green : 'rgba(148,163,184,0.55)');
        return (
          <div key={d.label} style={{position: 'absolute', left: i * (bw + gap), width: bw, top: 0, height}}>
            <div
              style={{
                position: 'absolute',
                bottom: height - chartH,
                width: '100%',
                height: Math.max(0, h),
                background: d.highlight ? `linear-gradient(180deg, #4ADE80, ${color})` : color,
                borderRadius: '16px 16px 4px 4px',
                boxShadow: d.highlight ? `0 0 ${40 * labelP}px rgba(34,197,94,0.45)` : undefined,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: height - chartH + h + 14,
                width: '100%',
                textAlign: 'center',
                fontFamily: F.title,
                fontWeight: 800,
                fontSize: d.highlight ? 46 : 36,
                color: d.highlight ? C.green : C.text,
                opacity: labelP,
                transform: `translateY(${(1 - labelP) * 12}px)`,
                ...numeric,
              }}
            >
              {format(d.value)}
            </div>
            <div style={{position: 'absolute', top: chartH + 18, width: '100%', textAlign: 'center', fontFamily: F.body, fontWeight: 600, fontSize: 30, color: d.highlight ? C.text : C.muted, ...numeric}}>
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
