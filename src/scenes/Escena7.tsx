import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Counter} from '../components/Counter';
import {Cheque} from '../components/Props';
import {Beat, Label, SceneTag} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {FACTS} from '../data/facts';
import {C, F, ease, numeric} from '../theme';

const w = sceneWords(7);

export const Escena7: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fNew = w('192.300');
  const fOld = w('184.500');
  const fEncima = w('por encima');
  const fHist = w('cambio histórico');
  const f1983 = w('1983');
  const f1960 = w('1960');
  const f67 = w('67 años');
  const f62 = w('a los 62');
  const fMas = w('más allá de los 67');
  const fMiles = w('miles de dólares');
  const fVideo = w('vídeo entero');

  // salary cap bar: shown first at the old value, stretches to the new one
  const stretch = interpolate(frame, [fOld + 20, fOld + 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const barW = 1180 * (FACTS.taxMaxOld / FACTS.taxMaxNew) + 1180 * (1 - FACTS.taxMaxOld / FACTS.taxMaxNew) * stretch;
  const barIn = spring({frame: frame - fNew + 20, fps, config: {damping: 16}});

  // full retirement age marker 65 → 67 along 1983 → 2027
  const marker = interpolate(frame, [f1983 + 10, f67], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

  // claiming slider 62 → 67 → 70
  const s1 = interpolate(frame, [f62 - 10, f62 + 30], [0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const s2 = interpolate(frame, [fMas, fMas + 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const slider = frame < fMas ? s1 : s2; // 0 = 62, 0.5 = 67, 1 = 70
  const chequeScale = interpolate(slider, [0, 0.5, 1], [0.72, 1, 1.24]);

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={7} title="Si todavía trabajas" />
      <Camera keys={[{frame: fNew, scale: 1.03}, {frame: fHist, scale: 1}, {frame: f62, scale: 1.03}, {frame: fVideo, scale: 1.06}]}>
        {/* a · taxable maximum */}
        <Beat a={0} b={fHist - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Salario máximo con impuesto del Seguro Social" start={4} size={60} maxWidth={1600} />
          </div>
          <div style={{position: 'absolute', left: 160, top: 420, width: 1600, opacity: barIn, transform: `translateY(${(1 - barIn) * 40}px)`}}>
            <div style={{height: 120, width: 1180, borderRadius: 60, background: 'rgba(248,250,252,0.06)', border: `3px dashed ${C.line}`, position: 'absolute'}} />
            <div style={{height: 120, width: barW, borderRadius: 60, background: `linear-gradient(90deg, ${C.bg2}, ${C.green})`, position: 'absolute', boxShadow: `0 0 ${40 * stretch}px rgba(34,197,94,0.4)`}} />
            <div style={{position: 'absolute', left: barW + 30, top: 18}}>
              <Counter from={FACTS.taxMaxOld} to={FACTS.taxMaxNew} start={fOld + 20} dur={60} prefix="$" style={{fontFamily: F.title, fontWeight: 900, fontSize: 76, color: stretch > 0 ? C.green : C.text}} />
            </div>
            <div style={{position: 'absolute', left: 1180 * (FACTS.taxMaxOld / FACTS.taxMaxNew) - 160, top: 150, opacity: tween(frame, fOld, 14)}}>
              <Label size={32}>antes: $184,500</Label>
            </div>
          </div>
          <div style={{position: 'absolute', left: 160, top: 680, opacity: tween(frame, fEncima, 16)}}>
            <Label size={40} color={C.text}>
              Si ganas más, pagas el impuesto sobre <span style={{color: C.amber}}>una parte mayor</span> de tu sueldo
            </Label>
          </div>
        </Beat>

        {/* b · full retirement age timeline */}
        <Beat a={fHist} b={f62 - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Un cambio histórico: la edad de jubilación completa" start={fHist} size={58} maxWidth={1650} marks={{2: {color: C.amber}}} />
          </div>
          <div style={{position: 'absolute', left: 200, top: 470, width: 1520}}>
            <div style={{height: 10, borderRadius: 5, background: C.line}} />
            <div style={{position: 'absolute', top: 0, height: 10, borderRadius: 5, width: `${marker * 100}%`, background: C.amber}} />
            {[
              ['1983', 0],
              ['2027', 1],
            ].map(([y, p]) => (
              <div key={y as string} style={{position: 'absolute', left: `${(p as number) * 100}%`, top: 40, transform: 'translateX(-50%)', fontFamily: F.title, fontWeight: 800, fontSize: 44, color: C.muted, ...numeric}}>
                {y}
              </div>
            ))}
            <div style={{position: 'absolute', left: `${marker * 100}%`, top: -150, transform: 'translateX(-50%)', textAlign: 'center'}}>
              <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 96, color: marker > 0.98 ? C.green : C.amber, ...numeric}}>{Math.round(65 + 2 * marker)}</div>
              <div style={{width: 6, height: 50, margin: '0 auto', background: C.amber, borderRadius: 3}} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 200, top: 620, opacity: tween(frame, f1960, 16)}}>
            <Label size={42} color={C.text}>
              Nacidos en <span style={{color: C.amber}}>1960 o después</span>: <span style={{color: C.green, fontFamily: F.title, fontWeight: 900}}>67 años</span>
            </Label>
          </div>
        </Beat>

        {/* c · claiming age slider + next video card */}
        <Beat a={f62} b={100000}>
          <div style={{position: 'absolute', left: 160, top: 220, width: 900}}>
            <Label size={34} style={{textTransform: 'uppercase', letterSpacing: '0.1em'}}>¿A qué edad lo pides?</Label>
            <div style={{position: 'relative', marginTop: 90, height: 16, borderRadius: 8, background: C.line}}>
              <div style={{position: 'absolute', height: 16, borderRadius: 8, width: `${slider * 100}%`, background: slider < 0.5 ? C.red : C.green}} />
              {[
                ['62', 0],
                ['67', 0.5],
                ['70', 1],
              ].map(([a, p]) => (
                <div key={a as string} style={{position: 'absolute', left: `${(p as number) * 100}%`, top: 40, transform: 'translateX(-50%)', fontFamily: F.title, fontWeight: 800, fontSize: 48, color: C.muted, ...numeric}}>
                  {a}
                </div>
              ))}
              <div
                style={{
                  position: 'absolute',
                  left: `${slider * 100}%`,
                  top: -32,
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  transform: 'translateX(-50%)',
                  background: C.text,
                  boxShadow: `0 0 0 10px ${slider < 0.5 ? 'rgba(239,68,68,0.35)' : 'rgba(34,197,94,0.35)'}`,
                }}
              />
            </div>
            <div style={{marginTop: 140}}>
              <Label size={38} color={slider < 0.5 ? C.red : C.green}>
                {slider < 0.5 ? 'Antes: menos de por vida' : slider > 0.5 ? 'Después de los 67: tu cheque crece' : 'A los 67: el 100 %'}
              </Label>
            </div>
          </div>
          <div style={{position: 'absolute', left: 1120, top: 300, transform: `scale(${chequeScale})`, transformOrigin: 'left center'}}>
            <Cheque w={520} amount="$$$" memo="" />
          </div>
          {frame > fMiles - 20 ? <NextVideo at={fVideo - 20} /> : null}
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};

const NextVideo: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 14}});
  const ang = (frame * 3) % 360;
  return (
    <div style={{position: 'absolute', left: 1120, top: 620, width: 680, height: 170, borderRadius: 28, padding: 4, background: `conic-gradient(from ${ang}deg, ${C.amber}, ${C.green}, ${C.amber}, ${C.bg2}, ${C.amber})`, opacity: p, transform: `translateY(${(1 - p) * 60}px)`}}>
      <div style={{width: '100%', height: '100%', borderRadius: 24, background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px', boxSizing: 'border-box'}}>
        <Label size={26} color={C.amber} style={{textTransform: 'uppercase', letterSpacing: '0.1em'}}>Próximo vídeo</Label>
        <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 40, color: C.text}}>¿62, 67 o 70? Con números</div>
      </div>
    </div>
  );
};
