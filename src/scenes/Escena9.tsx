import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Checklist} from '../components/Checklist';
import {Icon} from '../components/Icons';
import {Beat, Label, SceneTag} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {C, F} from '../theme';

const w = sceneWords(9);

export const Escena9: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f1 = w('Uno');
  const fDos = w('Dos');
  const fCarta = w('la carta');
  const fTres = w('Tres');
  const fEstafas = w('aumentan las estafas');
  const fLlamar = w('te va a llamar');
  const fRegalo = w('tarjetas de regalo');
  const fCripto = w('criptomonedas');
  const fTransf = w('transferencias');
  const fCuelga = w('cuelga');

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={9} title="Fechas clave y estafas" />
      <Camera keys={[{frame: fDos, scale: 1.02}, {frame: fEstafas, scale: 1}, {frame: fRegalo, scale: 1.04, x: 1060}, {frame: fCuelga, scale: 1.02, x: 960}]}>
        {/* a · dates checklist + envelope */}
        <Beat a={0} b={fEstafas - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Apunta estas fechas" start={2} size={70} marks={{0: {color: C.amber, underline: true, at: 30}}} />
          </div>
          <div style={{position: 'absolute', left: 140, top: 340}}>
            <Checklist
              width={1000}
              rowH={150}
              size={50}
              items={[
                {text: 'Hasta el 7 de diciembre', sub: 'compara tu plan de Medicare', at: f1, checkAt: f1 + 60},
                {text: 'Principios de diciembre', sub: 'carta con tu nueva cantidad (correo y my Social Security)', at: fDos, checkAt: fDos + 80},
                {text: 'Enero', sub: 'primer pago con el aumento', at: fTres, checkAt: fTres + 50},
              ]}
            />
          </div>
          <div style={{position: 'absolute', left: 1260, top: 330}}>
            <Envelope at={fCarta} />
          </div>
        </Beat>

        {/* b · scams */}
        <Beat a={fEstafas} b={100000}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Cuidado con las estafas" start={fEstafas} size={70} marks={{3: {color: C.red, underline: true, at: fEstafas + 30}}} />
          </div>
          <div style={{position: 'absolute', left: 200, top: 320}}>
            <Phone at={fLlamar} blockAt={fCuelga} />
          </div>
          <div style={{position: 'absolute', left: 820, top: 360, display: 'flex', gap: 40}}>
            {[
              {icon: 'gift' as const, t: 'Tarjetas de regalo', at: fRegalo},
              {icon: 'crypto' as const, t: 'Criptomonedas', at: fCripto},
              {icon: 'transfer' as const, t: 'Transferencias', at: fTransf},
            ].map((x) => {
              const p = spring({frame: frame - x.at, fps, config: {damping: 14}});
              const xP = interpolate(frame, [x.at + 18, x.at + 32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              return (
                <div key={x.t} style={{position: 'relative', width: 280, height: 300, borderRadius: 28, background: 'rgba(248,250,252,0.06)', border: `3px solid ${C.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
                  <Icon name={x.icon} size={120} color={C.text} />
                  <Label size={28} color={C.text}>{x.t}</Label>
                  <svg viewBox="0 0 280 300" style={{position: 'absolute', left: 50, top: 20, width: 180, height: 190}}>
                    <path d="M40 40 L240 260" pathLength={1} stroke={C.red} strokeWidth={22} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - xP} />
                    <path d="M240 40 L40 260" pathLength={1} stroke={C.red} strokeWidth={22} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - interpolate(xP, [0.3, 1], [0, 1], {extrapolateLeft: 'clamp'})} />
                  </svg>
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 820, top: 700, opacity: tween(frame, fCuelga, 16)}}>
            <Label size={40} color={C.text}>
              <span style={{color: C.green, fontFamily: F.title, fontWeight: 900}}>Cuelga</span> y llama tú al número oficial
            </Label>
          </div>
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};

/** Generic envelope that opens and slides out a letter. */
const Envelope: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame: frame - at + 20, fps, config: {damping: 15}});
  const flap = interpolate(frame, [at, at + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const letter = spring({frame: frame - at - 18, fps, config: {damping: 14}});
  return (
    <div style={{position: 'relative', width: 480, height: 420, opacity: inP, transform: `translateY(${(1 - inP) * 60}px)`}}>
      <div style={{position: 'absolute', left: 40, top: 160 - letter * 150, width: 400, height: 260, borderRadius: 12, background: '#F8FAFC', padding: 30, boxSizing: 'border-box'}}>
        <div style={{fontFamily: F.title, fontWeight: 800, fontSize: 24, color: C.bg2}}>Tu beneficio para 2027</div>
        {[260, 300, 200].map((wd, i) => (
          <div key={i} style={{height: 12, width: wd, background: '#CBD5E1', borderRadius: 6, marginTop: 18}} />
        ))}
      </div>
      <svg viewBox="0 0 480 300" width={480} height={300} style={{position: 'absolute', left: 0, top: 120}}>
        <rect x={0} y={0} width={480} height={300} rx={18} fill="#E2E8F0" />
        <path d="M0 0 L240 170 L480 0" fill="none" stroke="#94A3B8" strokeWidth={6} />
      </svg>
      <svg viewBox="0 0 480 180" width={480} height={180} style={{position: 'absolute', left: 0, top: 120 - (flap > 0.5 ? 180 : 0), transform: `scaleY(${flap > 0.5 ? (flap - 0.5) * 2 : 1 - flap * 2})`, transformOrigin: flap > 0.5 ? 'bottom' : 'top'}}>
        <path d={flap > 0.5 ? 'M0 180 L240 10 L480 180 Z' : 'M0 0 L240 170 L480 0 Z'} fill="#CBD5E1" />
      </svg>
    </div>
  );
};

/** Ringing phone ("Número desconocido") blocked by a shield. */
const Phone: React.FC<{at: number; blockAt: number}> = ({at, blockAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ringing = frame > at && frame < blockAt;
  const shake = ringing ? Math.sin(frame * 2.2) * 5 : 0;
  const shield = spring({frame: frame - blockAt, fps, config: {damping: 10}});
  return (
    <div style={{position: 'relative', width: 420, height: 520, opacity: tween(frame, at - 20, 16)}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 50, background: '#1E293B', border: '10px solid #CBD5E1', transform: `rotate(${shake}deg)`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <Icon name="person" size={120} color={C.muted} />
        <div style={{fontFamily: F.title, fontWeight: 800, fontSize: 34, color: C.red}}>Número desconocido</div>
        <div style={{display: 'flex', gap: 40, marginTop: 30}}>
          <span style={{width: 80, height: 80, borderRadius: 40, background: C.red}} />
          <span style={{width: 80, height: 80, borderRadius: 40, background: C.green, opacity: 0.4}} />
        </div>
      </div>
      {ringing
        ? [0, 1].map((i) => {
            const t = ((frame - at + i * 15) % 30) / 30;
            return <div key={i} style={{position: 'absolute', inset: -20 - t * 50, borderRadius: 70 + t * 40, border: `4px solid rgba(239,68,68,${0.6 * (1 - t)})`}} />;
          })
        : null}
      <div style={{position: 'absolute', left: 230, top: 280, transform: `scale(${shield})`}}>
        <Icon name="shield" size={240} color={C.green} stroke={8} />
      </div>
    </div>
  );
};
