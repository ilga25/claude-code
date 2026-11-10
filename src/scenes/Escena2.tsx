import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Character, NameTag} from '../components/Character';
import {Pill} from '../components/Ui';
import {sceneWords} from '../lib/timing';
import {C, F} from '../theme';

const w = sceneWords(2);

/** Channel logo assembled from three shapes. */
export const LogoMark: React.FC<{at: number; size?: number}> = ({at, size = 260}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const part = (i: number) => spring({frame: frame - at - i * 5, fps, config: {damping: 13, mass: 0.8}});
  const a = part(0);
  const b = part(1);
  const c = part(2);
  const spin = interpolate(a, [0, 1], [-120, 0]);
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible'}}>
      <rect x={30} y={30} width={140} height={140} rx={36} fill={C.amber} style={{transform: `translate(${(1 - b) * -260}px, ${(1 - b) * 80}px) rotate(${(1 - b) * 45}deg)`, transformOrigin: '100px 100px'}} />
      <circle cx={100} cy={100} r={56} fill={C.green} style={{transform: `translate(${(1 - a) * 300}px, ${(1 - a) * -200}px) rotate(${spin}deg)`, transformOrigin: '100px 100px'}} />
      <g style={{transform: `translateY(${(1 - c) * 240}px) scale(${c})`, transformOrigin: '100px 100px'}}>
        <path d="M86 70 h28 a14 14 0 0 1 0 28 h-28 a14 14 0 0 0 0 28 h30" fill="none" stroke={C.bg} strokeWidth={12} strokeLinecap="round" />
        <path d="M100 58 v84" stroke={C.bg} strokeWidth={12} strokeLinecap="round" />
      </g>
    </svg>
  );
};

const Porch: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, opacity: p}}>
      {/* roof + posts + railing + floor (generic, flat) */}
      <path d={`M 300 ${300 - (1 - p) * 60} L 960 ${200 - (1 - p) * 60} L 1620 ${300 - (1 - p) * 60}`} fill="none" stroke="#1D4A85" strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" />
      {[380, 1540].map((x) => (
        <rect key={x} x={x - 16} y={300} width={32} height={500 * p} fill="#1D4A85" rx={8} />
      ))}
      <rect x={300} y={800} width={1320} height={26} rx={12} fill="#1D4A85" />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} x={420 + i * 34} y={650 + (1 - p) * 150} width={14} height={150} rx={6} fill="#173E70" />
      ))}
      {Array.from({length: 7}).map((_, i) => (
        <rect key={'r' + i} x={1290 + i * 34} y={650 + (1 - p) * 150} width={14} height={150} rx={6} fill="#173E70" />
      ))}
      <rect x={400} y={640} width={260} height={14} rx={7} fill="#1D4A85" />
      <rect x={1270} y={640} width={260} height={14} rx={7} fill="#1D4A85" />
    </svg>
  );
};

export const Escena2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fLogo = 4;
  const fSub = w('Aquí explicamos');
  const fRM = w('Rosa y Miguel');
  const fTexas = w('Texas');
  const fPaso = w('paso a paso');
  const move = spring({frame: frame - (fRM - 30), fps, config: {damping: 18}});
  return (
    <AbsoluteFill>
      <Background />
      <Camera keys={[{frame: fRM - 30, y: 560, scale: 1.0}, {frame: fPaso, scale: 1.06, y: 520}]}>
        {/* logo + wordmark, moves up to a header when Rosa & Miguel arrive */}
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translateY(${interpolate(move, [0, 1], [-30, -390])}px) scale(${interpolate(move, [0, 1], [1, 0.42])})`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 48}}>
            <LogoMark at={fLogo} size={260} />
            <div>
              <KineticText text="Dinero Claro USA" start={fLogo + 18} size={120} weight={900} />
              <div style={{opacity: interpolate(frame, [fSub, fSub + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
                <KineticText text="Seguro Social · Medicare · tu dinero" start={fSub} size={46} font="body" weight={600} color={C.muted} stagger={3} />
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {frame > fRM - 40 ? (
          <>
            <Porch at={fRM - 30} />
            <Character who="rosa" x={520} y={250} scale={1.05} enterAt={fRM - 10} poses={[{at: fRM - 4, pose: 'wave', until: fRM + 80}, {at: fPaso, pose: 'nod', until: fPaso + 50}]} />
            <Character who="miguel" x={980} y={240} scale={1.08} enterAt={w('Miguel') - 10} poses={[{at: w('Miguel'), pose: 'wave', until: w('Miguel') + 90}]} flip />
            <NameTag text="Rosa, 64" at={fRM + 4} x={730} y={770} color={C.green} />
            <NameTag text="Miguel, 67" at={w('Miguel') + 4} x={1196} y={770} color={'#60A5FA'} />
            <div style={{position: 'absolute', left: 1500, top: 320}}>
              <Pill at={fTexas} text="Texas" color={C.amber} size={40} />
            </div>
          </>
        ) : null}
        <div style={{position: 'absolute', left: 1500, top: 420, fontFamily: F.title}} />
      </Camera>
    </AbsoluteFill>
  );
};
