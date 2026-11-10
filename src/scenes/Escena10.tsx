import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Character} from '../components/Character';
import {Icon} from '../components/Icons';
import {Beat, Card, Label, SceneTag} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {C, F, numeric} from '../theme';

const w = sceneWords(10);

export const SubscribeButton: React.FC<{at: number; clickAt: number; size?: number}> = ({at, clickAt, size = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 13}});
  const clicked = frame > clickAt;
  const press = spring({frame: frame - clickAt, fps, config: {damping: 8, mass: 0.5}});
  const cursorT = interpolate(frame, [clickAt - 40, clickAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  const bell = clicked ? Math.sin((frame - clickAt) / 2.5) * 22 * Math.max(0, 1 - (frame - clickAt) / 60) + Math.sin(frame / 30) * 3 : 0;
  return (
    <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 30 * size, opacity: p, transform: `scale(${(0.7 + 0.3 * p) * size})`, transformOrigin: 'left center'}}>
      <div
        style={{
          fontFamily: F.title,
          fontWeight: 900,
          fontSize: 56,
          padding: '26px 60px',
          borderRadius: 999,
          background: clicked ? '#334155' : C.red,
          color: C.text,
          transform: `scale(${clicked ? 1 - 0.08 * Math.sin(Math.min(1, press) * Math.PI) : 1})`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
        }}
      >
        {clicked ? 'Suscrito ✓' : 'Suscribirme'}
      </div>
      <div style={{transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%'}}>
        <Icon name="bell" size={110} color={clicked ? C.amber : C.text} />
      </div>
      {/* cursor */}
      <svg viewBox="0 0 60 80" width={60} height={80} style={{position: 'absolute', left: interpolate(cursorT, [0, 1], [700, 230]), top: interpolate(cursorT, [0, 1], [260, 60]), opacity: frame > clickAt + 50 ? 0 : cursorT > 0 ? 1 : 0}}>
        <path d="M4 4 L4 64 L20 50 L32 76 L42 72 L30 46 L52 46 Z" fill={C.text} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Escena10: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fRes = w('Resumiendo');
  const fMed = w('depende de Medicare');
  const fComp = w('comparar tu plan');
  const fPreg = w('Y una pregunta para ti');
  const fComent = w('déjala en los comentarios');
  const fShare = w('compártelo');
  const fSus = w('Suscríbete');
  const fCamp = w('campanita');
  const fRec = w('Y recuerda');
  const fNos = w('Nos vemos');

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={10} title="Resumen" />
      <Camera keys={[{frame: fPreg, scale: 1.03}, {frame: fShare, scale: 1}, {frame: fSus, scale: 1.02}]}>
        {/* a · three summary cards */}
        <Beat a={0} b={fPreg - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="En resumen" start={fRes} size={70} />
          </div>
          {[
            {n: '1', t: 'COLA 2027: +3,6 %', s: 'en enero', c: C.green, at: fRes + 20},
            {n: '2', t: 'Medicare se lleva su parte', s: 'Parte B: $209.50 proyectado', c: C.red, at: fMed},
            {n: '3', t: 'Compara tu plan antes del 7 dic', s: 'puede ahorrarte más que el aumento', c: C.amber, at: fComp},
          ].map((x, i) => (
            <Card key={x.n} at={x.at} x={120 + i * 570} y={340} w={530} h={420} accent={x.c}>
              <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 90, color: x.c, lineHeight: 1}}>{x.n}</div>
              <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 48, color: C.text, marginTop: 20, lineHeight: 1.1, ...numeric}}>{x.t}</div>
              <Label size={28} style={{marginTop: 16}}>
                {x.s}
              </Label>
            </Card>
          ))}
        </Beat>

        {/* b · question to the viewer */}
        <Beat a={fPreg} b={fShare - 10}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{transform: 'translateY(-60px)', textAlign: 'center'}}>
              <KineticText text="¿Cuánto vas a cobrar tú en 2027?" start={fPreg + 10} size={92} align="center" maxWidth={1500} marks={{4: {color: C.amber}, 6: {color: C.amber}}} />
              <div style={{marginTop: 50, display: 'inline-flex', alignItems: 'center', gap: 24, padding: '24px 40px', borderRadius: 24, background: 'rgba(248,250,252,0.08)', border: `3px solid ${C.line}`, opacity: tween(frame, fComent - 10, 16), transform: `translateY(${(1 - tween(frame, fComent - 10, 20)) * 30}px)`}}>
                <Icon name="doc" size={64} color={C.green} />
                <Label size={40} color={C.text}>
                  Déjalo en los comentarios
                </Label>
              </div>
            </div>
          </AbsoluteFill>
        </Beat>

        {/* c · share + Rosa & Miguel goodbye + subscribe */}
        <Beat a={fShare} b={100000}>
          <Character who="rosa" x={1040} y={290} scale={0.95} enterAt={fShare} poses={[{at: fShare + 20, pose: 'wave', until: fShare + 110}, {at: fNos - 10, pose: 'wave'}]} />
          <Character who="miguel" x={1400} y={280} scale={0.97} enterAt={fShare + 8} poses={[{at: fShare + 40, pose: 'nod', until: fShare + 100}, {at: fNos, pose: 'wave'}]} flip />
          <div style={{position: 'absolute', left: 120, top: 210}}>
            <KineticText text="Compártelo con tu familia" start={fShare} size={66} marks={{3: {color: C.amber}}} />
          </div>
          <div style={{position: 'absolute', left: 140, top: 400}}>
            <SubscribeButton at={fSus - 20} clickAt={fSus + 20} />
          </div>
          <div style={{position: 'absolute', left: 140, top: 600, opacity: tween(frame, fCamp + 30, 20)}}>
            <Label size={34} color={C.text} style={{maxWidth: 860}}>
              Próxima semana: <span style={{color: C.amber}}>¿a qué edad pedir el Seguro Social?</span>
            </Label>
          </div>
          <div style={{position: 'absolute', left: 140, top: 680, opacity: tween(frame, fRec, 20)}}>
            <Label size={28} style={{maxWidth: 860}}>Información educativa, no asesoría financiera. Consulta tu caso con el Seguro Social o un profesional.</Label>
          </div>
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};
