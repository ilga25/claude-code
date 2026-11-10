import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Checklist} from '../components/Checklist';
import {Beat, Card, Label, Pill, SceneTag} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {FACTS} from '../data/facts';
import {C, F, ease, numeric} from '../theme';

const w = sceneWords(8);

export const Escena8: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fDatos = w('Vamos con los datos');
  const fFondo = w('fondo de reserva');
  const f2032 = w('2032');
  const f2034 = w('2034');
  const fAgotar = w('Pero agotar');
  const fTrab = w('Los trabajadores siguen pagando');
  const fMayor = w('la mayor parte');
  const fCongreso = w('Congreso');
  const fPanico = w('no entres en pánico');
  const fBase = w('una base');
  const fUnico = w('único ingreso');
  const fFaltan = w('Si te faltan años');
  const fMySS = w('my Social Security');
  const fReg = w('registrados');
  const fGratis = w('gratis');

  const drain = interpolate(frame, [fFondo, f2032 + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const year = Math.round(interpolate(drain, [0, 1], [2026, FACTS.oasiDepletion]));
  const glass = interpolate(frame, [fTrab, fMayor + 30], [0, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={8} title="¿Se va a acabar el Seguro Social?" />
      <Camera keys={[{frame: fFondo, scale: 1.04}, {frame: fAgotar, scale: 1}, {frame: fCongreso, scale: 1.05, x: 1200}, {frame: fPanico, scale: 1, x: 960}, {frame: fMySS, scale: 1.03}]}>
        {/* a · the rumour + piggy bank draining */}
        <Beat a={0} b={fAgotar - 10}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - tween(frame, fDatos + 40, 20)}}>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 84, color: C.text, textAlign: 'center', maxWidth: 1500, transform: `rotate(${-2 + Math.sin(frame / 20)}deg)`}}>
              <span style={{color: C.muted}}>«</span>el Seguro Social se va a quedar sin dinero<span style={{color: C.muted}}>»</span>
            </div>
            <div style={{marginTop: 40}}>
              <Pill at={fDatos} text="Vamos con los datos" color={C.amber} size={46} />
            </div>
          </AbsoluteFill>
          {frame > fDatos + 40 ? (
            <>
              <div style={{position: 'absolute', left: 260, top: 240, opacity: tween(frame, fDatos + 40, 20)}}>
                <PiggyBank level={1 - drain} />
                <div style={{textAlign: 'center', marginTop: 10}}>
                  <Label size={36} color={C.text}>Fondo de reserva de jubilación</Label>
                </div>
              </div>
              <div style={{position: 'absolute', left: 1080, top: 260, opacity: tween(frame, fFondo, 20)}}>
                <Label size={30} style={{textTransform: 'uppercase', letterSpacing: '0.1em'}}>Se agotaría en</Label>
                <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 200, color: drain > 0.98 ? C.amber : C.text, lineHeight: 1, ...numeric}}>{year}</div>
                <div style={{marginTop: 40, opacity: tween(frame, f2034, 16)}}>
                  <Label size={30}>Fondos combinados (jubilación + incapacidad)</Label>
                  <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 96, color: C.text, ...numeric}}>{FACTS.combinedDepletion}</div>
                </div>
              </div>
            </>
          ) : null}
        </Beat>

        {/* b · workers' taxes keep filling the glass + Capitol clock */}
        <Beat a={fAgotar} b={fPanico - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Agotar la reserva ≠ cero pagos" start={fAgotar} size={66} marks={{3: {color: C.amber}, 4: {color: C.amber}, 5: {color: C.amber}}} />
          </div>
          <Pipe at={fTrab} level={glass} />
          {frame > fCongreso - 30 ? (
            <div style={{position: 'absolute', left: 1240, top: 320, opacity: tween(frame, fCongreso - 20, 20)}}>
              <Capitol />
              <div style={{textAlign: 'center', marginTop: 10}}>
                <Label size={34} color={C.amber}>Riesgo real: un recorte si el Congreso no actúa</Label>
              </div>
            </div>
          ) : null}
        </Beat>

        {/* c · Social Security = a base */}
        <Beat a={fPanico} b={fFaltan - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Ni pánico, ni ignorarlo" start={fPanico} size={70} />
          </div>
          <div style={{position: 'absolute', left: 560, top: 300, width: 800, height: 520}}>
            {[
              {t: 'Ahorros propios', c: '#60A5FA', at: fUnico + 10},
              {t: 'Otros ingresos', c: C.amber, at: fUnico},
              {t: 'Seguro Social = la base', c: C.green, at: fBase},
            ].map((b, i) => {
              const p = spring({frame: frame - b.at, fps, config: {damping: 11, mass: 0.8}});
              return (
                <div
                  key={b.t}
                  style={{
                    position: 'absolute',
                    left: i === 2 ? 0 : 60,
                    right: i === 2 ? 0 : 60,
                    top: [40, 190, 340][i],
                    height: i === 2 ? 170 : 130,
                    borderRadius: 24,
                    background: b.c,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: F.title,
                    fontWeight: 900,
                    fontSize: i === 2 ? 52 : 40,
                    color: C.ink,
                    opacity: Math.min(1, p * 2),
                    transform: `translateY(${(1 - p) * -300}px)`,
                  }}
                >
                  {b.t}
                </div>
              );
            })}
          </div>
        </Beat>

        {/* d · check your earnings record */}
        <Beat a={fFaltan} b={100000}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Hoy mismo: revisa tu historial de ingresos" start={fFaltan} size={60} marks={{3: {color: C.amber}, 4: {color: C.amber}, 5: {color: C.amber}, 6: {color: C.amber}}} />
          </div>
          <Card at={fMySS - 10} x={160} y={320} w={900} h={480}>
            <Label size={30} color={C.text} style={{fontWeight: 600}}>
              Tu cuenta my Social Security
            </Label>
            <div style={{marginTop: 20}}>
              <Checklist
                width={800}
                rowH={92}
                size={40}
                items={[2019, 2020, 2021, 2022].map((y, i) => ({text: `${y} · ingresos registrados`, at: fMySS + i * 8, checkAt: fReg - 20 + i * 10}))}
              />
            </div>
          </Card>
          <div style={{position: 'absolute', left: 1160, top: 380, opacity: tween(frame, fGratis - 30, 16)}}>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 72, color: C.text, lineHeight: 1.1}}>
              ¿Un error?
              <br />
              <span style={{color: C.green}}>Corregirlo es gratis</span>
            </div>
          </div>
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};

/** Piggy bank with a sloshing liquid level (sine-wave surface). */
const PiggyBank: React.FC<{level: number}> = ({level}) => {
  const frame = useCurrentFrame();
  const top = 90 + (1 - level) * 230;
  const wave = Array.from({length: 41})
    .map((_, i) => {
      const x = 40 + i * 10;
      const y = top + Math.sin(i / 3 + frame / 8) * 7 * (0.3 + level);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 500 420" width={560} height={470}>
      <defs>
        <clipPath id="piggy">
          <ellipse cx={240} cy={210} rx={200} ry={150} />
        </clipPath>
      </defs>
      <rect x={110} y={330} width={50} height={70} rx={18} fill={C.amber} />
      <rect x={310} y={330} width={50} height={70} rx={18} fill={C.amber} />
      <ellipse cx={240} cy={210} rx={200} ry={150} fill="rgba(245,183,0,0.12)" stroke={C.amber} strokeWidth={10} />
      <g clipPath="url(#piggy)">
        <path d={`${wave} L 440 380 L 40 380 Z`} fill={C.green} opacity={0.85} />
      </g>
      <ellipse cx={240} cy={210} rx={200} ry={150} fill="none" stroke={C.amber} strokeWidth={10} />
      <ellipse cx={440} cy={200} rx={42} ry={50} fill={C.amber} />
      <circle cx={430} cy={192} r={8} fill={C.bg} />
      <circle cx={452} cy={192} r={8} fill={C.bg} />
      <path d="M150 74 l30 -46 l20 50" fill={C.amber} />
      <rect x={200} y={52} width={90} height={16} rx={8} fill={C.bg} />
      <circle cx={360} cy={150} r={10} fill={C.bg} />
    </svg>
  );
};

/** Pipe "Impuestos de los trabajadores" that keeps a glass mostly full (no exact %). */
const Pipe: React.FC<{at: number; level: number}> = ({at, level}) => {
  const frame = useCurrentFrame();
  const flowing = frame > at;
  const top = 720 - level * 360;
  return (
    <div style={{position: 'absolute', left: 140, top: 300, opacity: tween(frame, at - 20, 20)}}>
      <svg viewBox="0 0 1000 560" width={1000} height={560}>
        <path d="M0 80 H420 Q470 80 470 130 V170" fill="none" stroke="#475569" strokeWidth={60} strokeLinecap="round" />
        <path d="M0 80 H420 Q470 80 470 130 V170" fill="none" stroke="#64748B" strokeWidth={36} strokeLinecap="round" />
        {flowing ? <rect x={455} y={190} width={30} height={top - 300 + 140} fill="#60A5FA" opacity={0.85} /> : null}
        {flowing
          ? Array.from({length: 6}).map((_, i) => {
              const t = ((frame - at + i * 10) % 60) / 60;
              return <circle key={i} cx={470 + Math.sin(i) * 8} cy={190 + t * (top - 300 + 140)} r={8} fill="#BFDBFE" />;
            })
          : null}
        <path d="M330 200 L360 540 H580 L610 200" fill="rgba(248,250,252,0.06)" stroke={C.text} strokeWidth={8} strokeLinejoin="round" />
        <clipPath id="glass">
          <path d="M330 200 L360 540 H580 L610 200 Z" />
        </clipPath>
        <g clipPath="url(#glass)">
          <rect x={300} y={540 - level * 400} width={340} height={level * 400 + 10} fill="#60A5FA" opacity={0.75} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, top: 0, fontFamily: F.title, fontWeight: 800, fontSize: 34, color: C.text}}>Impuestos de los trabajadores</div>
      <div style={{position: 'absolute', left: 640, top: 380, width: 340}}>
        <Label size={32} color={C.text}>
          siguen pagando <span style={{color: '#60A5FA'}}>la mayor parte</span> de los beneficios
        </Label>
      </div>
    </div>
  );
};

/** Generic stylised capitol dome with a clock face. */
const Capitol: React.FC = () => {
  const frame = useCurrentFrame();
  const a = (frame / 60) * 90;
  return (
    <svg viewBox="0 0 520 380" width={520} height={380}>
      <rect x={40} y={300} width={440} height={30} rx={8} fill="#CBD5E1" />
      <rect x={80} y={210} width={360} height={90} fill="#E2E8F0" />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} x={100 + i * 50} y={220} width={18} height={80} fill="#94A3B8" />
      ))}
      <path d="M150 210 Q260 60 370 210 Z" fill="#E2E8F0" />
      <rect x={250} y={40} width={20} height={50} fill="#E2E8F0" />
      <circle cx={260} cy={160} r={40} fill={C.bg} stroke={C.amber} strokeWidth={6} />
      <line x1={260} y1={160} x2={260 + 28 * Math.sin((a * Math.PI) / 180)} y2={160 - 28 * Math.cos((a * Math.PI) / 180)} stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
      <line x1={260} y1={160} x2={260 + 18 * Math.sin((a * Math.PI) / 2160)} y2={160 - 18 * Math.cos((a * Math.PI) / 2160)} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};
