import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SPRING} from '../theme';
import {rand} from '../lib/timing';

// Original flat characters built from separate parts (head, eyes, arms) so they can
// blink, wave, point and nod. Rosa (64): short grey hair, glasses, green blouse.
// Miguel (67): moustache, cap, blue shirt.

export type Pose = 'idle' | 'wave' | 'point' | 'nod';
export type PoseKey = {at: number; pose: Pose; until?: number};

const LOOK = {
  rosa: {skin: '#C98B60', skinShade: '#B4774F', shirt: '#22C55E', shirtShade: '#18A34A', hair: '#D3D8DF', seed: 3},
  miguel: {skin: '#B47650', skinShade: '#9C6342', shirt: '#3B82F6', shirtShade: '#2C6AD6', hair: '#D7DBE0', seed: 11},
};

function useArmAngle(poses: PoseKey[], frame: number, fps: number) {
  // Arm: 8° = resting down; -150° = raised (wave); -98° = pointing sideways.
  let angle = 8;
  let waving = false;
  let nod = false;
  for (const k of poses) {
    const until = k.until ?? Infinity;
    if (frame < k.at || frame > until + 20) continue;
    const pin = spring({frame: frame - k.at, fps, config: SPRING});
    const pout = until === Infinity ? 0 : spring({frame: frame - until, fps, config: SPRING});
    const w = pin * (1 - pout);
    if (k.pose === 'wave') {
      angle = 8 + (-150 - 8) * w;
      waving = w > 0.6;
    } else if (k.pose === 'point') angle = 8 + (-98 - 8) * w;
    else if (k.pose === 'nod') nod = w > 0.1;
  }
  if (waving) angle += Math.sin(frame / 5) * 16;
  return {angle, nod};
}

export const Character: React.FC<{
  who: 'rosa' | 'miguel';
  x: number;
  y: number;
  scale?: number;
  enterAt?: number;
  poses?: PoseKey[];
  flip?: boolean;
  mood?: 'happy' | 'surprised';
  style?: React.CSSProperties;
}> = ({who, x, y, scale = 1, enterAt = 0, poses = [], flip = false, mood = 'happy', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = LOOK[who];
  const enter = spring({frame: frame - enterAt, fps, config: {damping: 15, mass: 1}});
  const t = frame / fps;
  const breath = Math.sin(t * Math.PI * 0.5) * 0.5 + 0.5; // 4 s cycle
  // Blink every ~3–5 s (deterministic)
  const off = L.seed * 37;
  const idx = Math.floor((frame + off) / 240);
  const local = (frame + off) % 240;
  const blinkAt = 30 + rand(idx + L.seed) * 150;
  const blink = local >= blinkAt && local < blinkAt + 9 ? 1 - Math.sin(((local - blinkAt) / 9) * Math.PI) : 1;
  const {angle, nod} = useArmAngle(poses, frame, fps);
  const headRot = nod ? Math.sin(frame / 7) * 5 : Math.sin(t * 0.7 + L.seed) * 1.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 400 * scale,
        height: 560 * scale,
        transform: `translateY(${(1 - enter) * 120}px) scaleX(${flip ? -1 : 1})`,
        opacity: interpolate(enter, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
        ...style,
      }}
    >
      <svg viewBox="0 0 400 560" width="100%" height="100%" style={{overflow: 'visible'}}>
        {/* shadow */}
        <ellipse cx={200} cy={548} rx={150} ry={12} fill="rgba(0,0,0,0.25)" />
        {/* torso (breathes) */}
        <g style={{transform: `scaleY(${1 + breath * 0.015})`, transformOrigin: '200px 550px'}}>
          <path d="M70 550 C70 400 110 330 200 330 C290 330 330 400 330 550 Z" fill={L.shirt} />
          <path d="M200 330 C250 330 300 360 318 430 L318 550 L250 550 C270 470 240 380 200 330 Z" fill={L.shirtShade} opacity={0.5} />
          {who === 'rosa' ? (
            <path d="M160 336 L200 392 L240 336" fill="none" stroke="#F8FAFC" strokeWidth={8} strokeLinejoin="round" opacity={0.85} />
          ) : (
            <>
              <path d="M160 334 L200 370 L240 334 L226 330 L200 352 L174 330 Z" fill="#F8FAFC" />
              <circle cx={200} cy={400} r={6} fill="#F8FAFC" opacity={0.85} />
              <circle cx={200} cy={440} r={6} fill="#F8FAFC" opacity={0.85} />
            </>
          )}
          {/* left arm (static) */}
          <g style={{transform: 'rotate(10deg)', transformOrigin: '96px 380px'}}>
            <rect x={70} y={370} width={52} height={170} rx={26} fill={L.shirtShade} />
            <circle cx={96} cy={540} r={26} fill={L.skin} />
          </g>
        </g>
        {/* right arm (animated) */}
        <g style={{transform: `rotate(${angle}deg)`, transformOrigin: '304px 380px'}}>
          <rect x={278} y={370} width={52} height={170} rx={26} fill={L.shirt} />
          <circle cx={304} cy={540} r={27} fill={L.skin} />
        </g>
        {/* neck */}
        <rect x={176} y={292} width={48} height={50} rx={18} fill={L.skinShade} />
        {/* head */}
        <g style={{transform: `translateY(${-breath * 3}px) rotate(${headRot}deg)`, transformOrigin: '200px 300px'}}>
          {who === 'rosa' ? (
            <path d="M104 190 C96 100 160 70 200 70 C250 70 306 100 296 196 C300 240 290 270 276 286 L260 200 L140 200 L124 286 C108 270 100 236 104 190 Z" fill={L.hair} />
          ) : null}
          <ellipse cx={200} cy={200} rx={86} ry={100} fill={L.skin} />
          <ellipse cx={114} cy={206} rx={14} ry={22} fill={L.skinShade} />
          <ellipse cx={286} cy={206} rx={14} ry={22} fill={L.skinShade} />
          {who === 'rosa' ? (
            <path d="M114 170 C116 112 160 92 204 96 C250 100 288 124 286 172 C262 140 214 128 176 136 C150 142 128 156 114 170 Z" fill={L.hair} />
          ) : (
            <>
              {/* cap */}
              <path d="M112 160 C112 96 160 78 200 78 C246 78 290 98 290 160 Z" fill="#E2E8F0" />
              <path d="M112 156 L292 156 C300 156 330 162 334 172 L112 172 Z" fill="#CBD5E1" />
              <circle cx={200} cy={82} r={8} fill="#CBD5E1" />
              <path d="M150 120 h40" stroke={C.amber} strokeWidth={10} strokeLinecap="round" />
              {/* sideburns */}
              <path d="M118 176 l0 34" stroke={L.hair} strokeWidth={14} strokeLinecap="round" />
              <path d="M282 176 l0 34" stroke={L.hair} strokeWidth={14} strokeLinecap="round" />
            </>
          )}
          {/* eyes */}
          <g style={{transform: `scaleY(${blink})`, transformOrigin: '200px 204px'}}>
            <ellipse cx={168} cy={204} rx={9} ry={11} fill="#1E293B" />
            <ellipse cx={232} cy={204} rx={9} ry={11} fill="#1E293B" />
          </g>
          {/* brows */}
          <path d={mood === 'surprised' ? 'M150 168 q18 -14 34 0' : 'M150 180 q18 -10 34 0'} fill="none" stroke={who === 'rosa' ? '#A8AFB8' : '#9CA3AF'} strokeWidth={6} strokeLinecap="round" />
          <path d={mood === 'surprised' ? 'M216 168 q18 -14 34 0' : 'M216 180 q18 -10 34 0'} fill="none" stroke={who === 'rosa' ? '#A8AFB8' : '#9CA3AF'} strokeWidth={6} strokeLinecap="round" />
          {who === 'rosa' ? (
            <g fill="none" stroke="#1E293B" strokeWidth={5}>
              <rect x={142} y={184} width={52} height={40} rx={14} />
              <rect x={206} y={184} width={52} height={40} rx={14} />
              <path d="M194 202 h12" />
            </g>
          ) : null}
          {/* nose */}
          <path d="M200 214 q-10 24 4 28" fill="none" stroke={L.skinShade} strokeWidth={6} strokeLinecap="round" />
          {who === 'miguel' ? <path d="M160 254 C176 238 192 242 200 248 C208 242 224 238 240 254 C226 262 212 258 200 254 C188 258 174 262 160 254 Z" fill={L.hair} /> : null}
          {/* smile */}
          {mood === 'surprised' ? (
            <ellipse cx={200} cy={who === 'rosa' ? 262 : 272} rx={14} ry={18} fill="#7C2D12" />
          ) : (
            <path d={who === 'rosa' ? 'M176 254 q24 20 48 0' : 'M182 266 q18 12 36 0'} fill="none" stroke="#7C2D12" strokeWidth={6} strokeLinecap="round" />
          )}
          <circle cx={150} cy={240} r={12} fill="#F87171" opacity={0.25} />
          <circle cx={250} cy={240} r={12} fill="#F87171" opacity={0.25} />
        </g>
      </svg>
    </div>
  );
};

/** Name tag that pops in under a character. */
export const NameTag: React.FC<{text: string; at: number; x: number; y: number; color?: string}> = ({text, at, x, y, color = C.amber}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 12, mass: 0.7}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(-50%) scale(${p})`,
        background: color,
        color: C.ink,
        fontFamily: F.title,
        fontWeight: 800,
        fontSize: 40,
        padding: '10px 28px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
      }}
    >
      {text}
    </div>
  );
};
