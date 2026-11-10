import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ease, numeric} from '../theme';
import {Sfx} from './Sfx';

/** Number that counts from `from` to `to` (en-US format by default). */
export const Counter: React.FC<{
  from?: number;
  to: number;
  start: number;
  dur?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  style?: React.CSSProperties;
  sfx?: boolean;
}> = ({from = 0, to, start, dur = 40, decimals = 0, prefix = '', suffix = '', format, style, sfx = true}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [from, to], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shown = format
    ? format(v)
    : prefix + v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals}) + suffix;
  return (
    <span style={{...numeric, ...style}}>
      {shown}
      {sfx ? <Sfx name="pop" at={start + dur - 4} volume={0.25} /> : null}
    </span>
  );
};

/** Spanish percent: 3.6 → "3,6 %" */
export const pctEs = (n: number, decimals = 1) => n.toFixed(decimals).replace('.', ',') + ' %';
