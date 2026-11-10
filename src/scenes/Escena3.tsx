import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {BarChart} from '../components/BarChart';
import {Counter, pctEs} from '../components/Counter';
import {Icon} from '../components/Icons';
import {Beat, Card, Label, SceneTag} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {FACTS} from '../data/facts';
import {C, F, numeric} from '../theme';

const w = sceneWords(3);

const LETTERS = [
  {l: 'C', en: 'Cost'},
  {l: 'O', en: 'Of'},
  {l: 'L', en: 'Living'},
  {l: 'A', en: 'Adjustment'},
];

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const Escena3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fCola = w('se llama COLA');
  const fEn = w('cost-of-living');
  const fEs = w('ajuste por costo de vida');
  const fCada = w('Cada año');
  const fJul = w('julio');
  const fAgo = w('agosto');
  const fSep = w('septiembre');
  const fSube = w('Si los precios subieron');
  const fPiensa = w('Piénsalo así');
  const fCien = w('cien dólares');
  const fCiento = w('ciento cuatro');
  const fIdea = w('Para que te hagas una idea');
  const f2027 = w('Para 2027');
  const fImp = w('Una cosa importante');
  const fOcho = w('ocho de cada diez');
  const fRazon = w('Hay una razón');
  const fSalud = w('salud');
  const fViv = w('vivienda');

  const split = spring({frame: frame - fEn, fps, config: {damping: 15}});

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={3} title="¿Qué es el COLA?" />
      <Camera keys={[{frame: fEn, scale: 1.04}, {frame: fCada, scale: 1}, {frame: fPiensa, scale: 1.05, x: 900}, {frame: fIdea, scale: 1, x: 960}, {frame: fOcho, scale: 1.05}, {frame: fRazon, scale: 1}]}>
        {/* a · C-O-L-A */}
        <Beat a={0} b={fCada - 10}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: interpolate(split, [0, 1], [0, 90]), transform: `translateY(${interpolate(split, [0, 1], [0, -60])}px)`}}>
              {LETTERS.map((x, i) => {
                const p = spring({frame: frame - fCola - i * 4, fps, config: {damping: 12, mass: 0.8}});
                const en = spring({frame: frame - fEn - 6 - i * 6, fps, config: {damping: 16}});
                return (
                  <div key={x.l} style={{textAlign: 'center', width: interpolate(split, [0, 1], [150, 300])}}>
                    <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 220, color: i % 2 ? C.amber : C.green, transform: `scale(${p}) translateY(${(1 - p) * 80}px)`, lineHeight: 1}}>{x.l}</div>
                    <div style={{fontFamily: F.title, fontWeight: 800, fontSize: 44, color: C.text, opacity: en, transform: `translateY(${(1 - en) * 30}px)`, marginTop: 20}}>
                      <span style={{color: i % 2 ? C.amber : C.green}}>{x.l}</span>
                      {x.en.slice(1)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{position: 'absolute', top: 640}}>
              <KineticText text="Ajuste por costo de vida" start={fEs} size={70} color={C.text} align="center" marks={{2: {color: C.amber, underline: true, at: fEs + 30}, 3: {color: C.amber}, 4: {color: C.amber}}} />
            </div>
          </AbsoluteFill>
        </Beat>

        {/* b · months timeline + thermometer */}
        <Beat a={fCada} b={fPiensa - 10}>
          <div style={{position: 'absolute', left: 120, top: 210}}>
            <KineticText text="Inflación: jul · ago · sep vs. el año anterior" start={fCada + 10} size={54} marks={{1: {color: C.amber}, 2: {color: C.amber}, 3: {color: C.amber}, 4: {color: C.amber}, 5: {color: C.amber}}} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 430, display: 'flex', gap: 14}}>
            {MONTHS.map((m, i) => {
              const hiAt = i === 6 ? fJul : i === 7 ? fAgo : i === 8 ? fSep : null;
              const inP = spring({frame: frame - fCada - 10 - i * 3, fps, config: {damping: 16}});
              const hi = hiAt === null ? 0 : spring({frame: frame - hiAt, fps, config: {damping: 11}});
              return (
                <div
                  key={m}
                  style={{
                    width: 92,
                    height: 120,
                    borderRadius: 18,
                    display: 'grid',
                    placeItems: 'center',
                    background: hi > 0.05 ? `rgba(245,183,0,${0.2 + hi * 0.75})` : 'rgba(248,250,252,0.06)',
                    border: `2px solid ${hi > 0.05 ? C.amber : C.line}`,
                    fontFamily: F.title,
                    fontWeight: 800,
                    fontSize: 32,
                    color: hi > 0.5 ? C.ink : C.muted,
                    opacity: inP,
                    transform: `translateY(${(1 - inP) * 40 - hi * 26}px) scale(${1 + hi * 0.1})`,
                  }}
                >
                  {m}
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 1500, top: 220}}>
            <Thermometer at={fSube} />
          </div>
          <div style={{position: 'absolute', left: 120, top: 640}}>
            <KineticText text="Si los precios suben, tu cheque también." start={fSube + 10} size={58} marks={{6: {color: C.green, underline: true, at: fSube + 50}}} />
          </div>
        </Beat>

        {/* c · grocery cart */}
        <Beat a={fPiensa} b={fIdea - 10}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 80, transform: 'translateY(-60px)'}}>
              <div style={{transform: `translateX(${interpolate(tween(frame, fPiensa, 40), [0, 1], [-500, 0])}px) rotate(${Math.sin(frame / 6) * (frame < fPiensa + 40 ? 3 : 0.6)}deg)`}}>
                <Icon name="cart" size={360} color={C.text} stroke={7} />
              </div>
              <div>
                <Label size={36}>Tu compra del súper</Label>
                <div style={{position: 'relative', marginTop: 16, padding: '24px 48px', background: C.amber, borderRadius: 24, transform: `rotate(-3deg) scale(${spring({frame: frame - fCien, fps, config: {damping: 12}})})`}}>
                  <Counter from={100} to={FACTS.grocery.to} start={fCiento} dur={50} decimals={2} prefix="$" style={{fontFamily: F.title, fontWeight: 900, fontSize: 130, color: C.ink}} />
                </div>
                <div style={{marginTop: 26, fontFamily: F.title, fontWeight: 800, fontSize: 50, color: C.green, opacity: tween(frame, fCiento + 50, 20)}}>COLA ≈ misma proporción</div>
              </div>
            </div>
          </AbsoluteFill>
        </Beat>

        {/* d · bar chart of recent COLAs */}
        <Beat a={fIdea} b={fImp - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="COLA de los últimos años" start={fIdea} size={64} />
          </div>
          <div style={{position: 'absolute', left: 260, top: 300}}>
            <BarChart
              start={fIdea + 20}
              width={1400}
              height={520}
              format={(v) => pctEs(v)}
              data={FACTS.colaHistory.map((d) => ({label: String(d.year), value: d.pct, highlight: d.year === 2027 && frame >= f2027}))}
            />
          </div>
          {frame > f2027 ? (
            <div style={{position: 'absolute', left: 1180, top: 210, fontFamily: F.title, fontWeight: 800, fontSize: 40, color: C.green, opacity: tween(frame, f2027 + 20, 16)}}>
              el más alto desde 2023
            </div>
          ) : null}
        </Beat>

        {/* e · not a gift + AARP 8 of 10 */}
        <Beat a={fImp} b={fRazon - 10}>
          <div style={{position: 'absolute', left: 120, top: 200}}>
            <KineticText text="El COLA no es un regalo:" start={fImp + 4} size={70} />
            <KineticText text="solo protege tu poder de compra" start={fImp + 30} size={70} color={C.amber} />
          </div>
          <Card at={fOcho - 30} x={120} y={470} w={1680} h={330}>
            <div style={{display: 'flex', alignItems: 'center', gap: 60}}>
              <div style={{display: 'flex', gap: 18}}>
                {Array.from({length: 10}).map((_, i) => {
                  const on = i < 8 && frame > fOcho + i * 4;
                  const p = spring({frame: frame - fOcho - i * 4, fps, config: {damping: 12}});
                  return (
                    <div key={i} style={{transform: `scale(${on ? 1 + 0.12 * (1 - p) : 1})`}}>
                      <Icon name="person" size={84} color={on ? C.amber : 'rgba(148,163,184,0.5)'} />
                    </div>
                  );
                })}
              </div>
              <div>
                <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 64, color: C.amber, ...numeric}}>8 de cada 10</div>
                <Label size={32} style={{maxWidth: 560}}>dicen que el aumento no les alcanza para seguir el ritmo de los precios (encuesta AARP, sept.)</Label>
              </div>
            </div>
          </Card>
        </Beat>

        {/* f · why: index measures young workers' spending */}
        <Beat a={fRazon} b={100000}>
          <div style={{position: 'absolute', left: 120, top: 200}}>
            <KineticText text="El índice mira sobre todo a trabajadores jóvenes" start={fRazon + 4} size={60} maxWidth={1600} marks={{6: {color: C.amber}, 7: {color: C.amber}}} />
          </div>
          <Card at={fRazon + 40} x={120} y={420} w={800} h={380}>
            <Label size={34} color={C.text}>Trabajadores jóvenes</Label>
            <SpendRows rows={[{icon: 'cart', label: 'Compras y transporte', v: 0.8}, {icon: 'doctor', label: 'Salud', v: 0.25}, {icon: 'house', label: 'Vivienda', v: 0.45}]} at={fRazon + 50} />
          </Card>
          <Card at={fSalud - 10} x={1000} y={420} w={800} h={380} accent={C.amber}>
            <Label size={34} color={C.amber}>Personas mayores</Label>
            <SpendRows rows={[{icon: 'cart', label: 'Compras y transporte', v: 0.5}, {icon: 'doctor', label: 'Salud', v: 0.9, at: fSalud}, {icon: 'house', label: 'Vivienda', v: 0.85, at: fViv}]} at={fSalud} amber />
          </Card>
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};

const SpendRows: React.FC<{rows: {icon: 'cart' | 'doctor' | 'house'; label: string; v: number; at?: number}[]; at: number; amber?: boolean}> = ({rows, at, amber}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 26}}>
      {rows.map((r, i) => {
        const p = spring({frame: frame - (r.at ?? at + i * 6), fps, config: {damping: 10, mass: 0.7}});
        return (
          <div key={r.label}>
            <Label size={26}>{r.label}</Label>
            <div style={{height: 22, marginTop: 8, borderRadius: 11, background: 'rgba(248,250,252,0.08)'}}>
              <div style={{height: '100%', width: `${r.v * 100 * p}%`, borderRadius: 11, background: amber && r.at ? C.amber : 'rgba(148,163,184,0.7)'}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Thermometer: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 70], [0.2, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <svg viewBox="0 0 160 520" width={160} height={520}>
      <rect x={50} y={20} width={60} height={400} rx={30} fill="rgba(248,250,252,0.08)" stroke={C.text} strokeWidth={6} />
      <rect x={64} y={20 + 386 * (1 - p)} width={32} height={386 * p + 20} rx={16} fill={C.red} />
      <circle cx={80} cy={450} r={56} fill={C.red} stroke={C.text} strokeWidth={6} />
      {[0.25, 0.5, 0.75].map((t) => (
        <path key={t} d={`M 110 ${20 + 400 * t} h 22`} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
      ))}
    </svg>
  );
};
