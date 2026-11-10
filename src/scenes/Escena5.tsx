import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Counter} from '../components/Counter';
import {Cheque, Arrow} from '../components/Props';
import {Character, NameTag} from '../components/Character';
import {Icon} from '../components/Icons';
import {Beat, Card, Label, Pill, SceneTag, Sparkle} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {FACTS} from '../data/facts';
import {C, F, numeric} from '../theme';

const w = sceneWords(5);

/** Kinetic equation term: flies into place when spoken. */
const Term: React.FC<{at: number; children: React.ReactNode; color?: string; from?: number; size?: number}> = ({at, children, color = C.text, from = -1, size = 130}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 13, mass: 0.8}});
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: F.title,
        fontWeight: 900,
        fontSize: size,
        color,
        opacity: Math.min(1, p * 1.6),
        transform: `translate(${(1 - p) * 0}px, ${(1 - p) * 200 * from}px) scale(${0.6 + 0.4 * p})`,
        ...numeric,
      }}
    >
      {children}
    </span>
  );
};

export const Escena5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fB = w('la prima de la Parte B');
  const fDesc = w('se descuenta');
  const f2026 = w('En 2026');
  const f209 = w('209');
  const fConf = w('confírmala');
  const fCuenta = w('Hagamos la cuenta');
  const f72 = w('72 dólares');
  const fMenos = w('menos 6');
  const f65 = w('65 dólares');
  const fTitular = w('titular');
  const fAltos = w('ingresos altos');
  const fRosa = w('¿Y Rosa?');
  const f65b = w('cumpla 65');
  const fConsejo = w('Un consejo práctico');
  const fDed = w('deducciones');

  const gauge = interpolate(frame, [f209 - 10, f209 + 50], [FACTS.partB2026, FACTS.partB2027], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3)});
  const glow = frame > f65 ? 0.5 + 0.5 * Math.sin((frame - f65) / 8) : 0;

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={5} title="Lo que Medicare te quita" />
      <Camera keys={[{frame: fDesc, scale: 1.03}, {frame: f2026, scale: 1}, {frame: fCuenta, scale: 1.05}, {frame: fAltos, scale: 1}, {frame: fConsejo, scale: 1.04, x: 1000}]}>
        {/* a · flow: cheque → Part B funnel → bank */}
        <Beat a={0} b={f2026 - 10}>
          <div style={{position: 'absolute', left: 110, top: 300, transform: `scale(${spring({frame: frame - 6, fps, config: {damping: 14}})})`, transformOrigin: 'left center'}}>
            <Cheque w={520} amount="$$$" memo="" />
            <Label size={30} color={C.text} style={{marginTop: 20, textAlign: 'center'}}>
              Cheque del Seguro Social
            </Label>
          </div>
          <Arrow x1={660} y1={420} x2={800} y2={420} at={fB - 10} />
          <div style={{position: 'absolute', left: 820, top: 250, textAlign: 'center', opacity: tween(frame, fB, 16)}}>
            <svg viewBox="0 0 300 320" width={300} height={320}>
              <path d="M10 20 H290 L180 170 V290 L120 310 V170 Z" fill="rgba(239,68,68,0.18)" stroke={C.red} strokeWidth={8} strokeLinejoin="round" />
              {frame > fDesc
                ? Array.from({length: 5}).map((_, i) => {
                    const t = ((frame - fDesc + i * 14) % 70) / 70;
                    return <circle key={i} cx={150 + Math.sin(i * 2) * 60 * (1 - t)} cy={30 + t * 270} r={12} fill={C.amber} opacity={1 - t * 0.6} />;
                  })
                : null}
            </svg>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 52, color: C.red}}>Parte B</div>
            <Label size={26}>médico · atención ambulatoria</Label>
          </div>
          <Arrow x1={1140} y1={420} x2={1290} y2={420} at={fDesc + 10} />
          <div style={{position: 'absolute', left: 1320, top: 290, textAlign: 'center', opacity: tween(frame, fDesc + 20, 16)}}>
            <svg viewBox="0 0 120 120" width={240} height={240}>
              <path d="M14 46 L60 18 L106 46 Z M20 52 h80 M26 58 v34 M46 58 v34 M74 58 v34 M94 58 v34 M16 100 h88" fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 52, color: C.green}}>Tu cuenta</div>
          </div>
        </Beat>

        {/* b · premium gauge 202.90 → 209.50 PROYECTADO */}
        <Beat a={f2026} b={fCuenta - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Prima estándar de la Parte B" start={f2026} size={64} />
          </div>
          <div style={{position: 'absolute', left: 260, top: 330}}>
            <Gauge value={gauge} min={195} max={215} />
          </div>
          <div style={{position: 'absolute', left: 1060, top: 330}}>
            <Label size={30}>2026</Label>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 92, color: C.text, ...numeric}}>$202.90<span style={{fontSize: 40, color: C.muted}}>/mes</span></div>
            <div style={{marginTop: 30, opacity: tween(frame, f209 - 10, 16)}}>
              <Label size={30}>2027</Label>
              <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                <Counter from={FACTS.partB2026} to={FACTS.partB2027} start={f209 - 10} dur={60} decimals={2} prefix="$" style={{fontFamily: F.title, fontWeight: 900, fontSize: 92, color: C.amber}} />
                <Pill at={f209 + 20} text="PROYECTADO" color={C.amber} size={30} />
              </div>
              <div style={{marginTop: 10}}>
                <Pill at={f209 + 50} text="+$6.60" color={C.red} textColor={C.text} size={40} />
              </div>
            </div>
            <div style={{marginTop: 30, opacity: tween(frame, fConf, 16), display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon name="info" size={44} color={C.muted} />
              <Label size={30}>Confírmala en medicare.gov</Label>
            </div>
          </div>
        </Beat>

        {/* c · kinetic equation +$72 − $6.60 = +$65.40 */}
        <Beat a={fCuenta} b={fAltos - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="La cuenta de Miguel" start={fCuenta} size={64} marks={{3: {color: '#60A5FA'}}} />
          </div>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 40, transform: 'translateY(10px)'}}>
              <Term at={f72} color={C.green}>
                +$72
              </Term>
              <Term at={fMenos} color={C.red} from={1}>
                − $6.60
              </Term>
              <Term at={f65 - 6} color={C.muted}>
                =
              </Term>
              <span style={{position: 'relative', display: 'inline-block'}}>
                <span
                  style={{
                    position: 'absolute',
                    inset: -30,
                    borderRadius: 40,
                    background: `radial-gradient(closest-side, rgba(34,197,94,${0.35 * glow}), transparent)`,
                  }}
                />
                <Term at={f65} color={C.green} size={150}>
                  +$65.40
                </Term>
                <Sparkle at={f65 + 10} x={230} y={80} r={140} />
              </span>
            </div>
          </AbsoluteFill>
          <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: tween(frame, fTitular - 20, 16)}}>
            <Label size={38} color={C.text}>
              netos más al mes · <span style={{color: C.amber}}>no es lo que dice el titular</span>
            </Label>
          </div>
        </Beat>

        {/* d · IRMAA warning + Rosa */}
        <Beat a={fAltos} b={fConsejo - 10}>
          <Card at={fAltos} x={120} y={190} w={1680} h={200} accent={C.amber}>
            <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
              <svg viewBox="0 0 120 120" width={110} height={110}>
                <path d="M60 12 L112 104 H8 Z" fill="none" stroke={C.amber} strokeWidth={8} strokeLinejoin="round" />
                <path d="M60 48 v26 M60 88 v2" stroke={C.amber} strokeWidth={9} strokeLinecap="round" />
              </svg>
              <div>
                <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 60, color: C.amber}}>Ingresos altos = recargo (IRMAA)</div>
                <Label size={30}>en la Parte B y en la cobertura de medicamentos: tu aumento neto puede ser bastante menor</Label>
              </div>
            </div>
          </Card>
          {frame > fRosa - 20 ? (
            <>
              <Character who="rosa" x={220} y={300} scale={0.9} enterAt={fRosa - 10} poses={[{at: fRosa, pose: 'wave', until: fRosa + 60}]} />
              <NameTag text="Rosa, 64" at={fRosa} x={400} y={790} color={C.green} />
              <Card at={fRosa + 20} x={760} y={470} w={1040} h={300}>
                <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
                  <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 110, color: C.text, whiteSpace: 'nowrap', flex: 'none', ...numeric}}>
                    64 <span style={{color: C.muted}}>→</span> <span style={{color: C.amber}}>65</span>
                  </div>
                  <Label size={34} color={C.text} style={{opacity: tween(frame, f65b, 16)}}>
                    Al cumplir 65 empieza el descuento de Medicare
                  </Label>
                </div>
              </Card>
            </>
          ) : null}
        </Beat>

        {/* e · the December letter: look for deductions */}
        <Beat a={fConsejo} b={100000}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Consejo: busca la línea de deducciones" start={fConsejo} size={62} marks={{3: {color: C.amber}, 4: {color: C.amber}, 5: {color: C.amber, underline: true, at: fDed}}} />
          </div>
          <Letter at={fConsejo + 20} hi={fDed} />
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};

const Gauge: React.FC<{value: number; min: number; max: number}> = ({value, min, max}) => {
  const t = (value - min) / (max - min);
  const a = Math.PI * (1 - t);
  const R = 300;
  const arc = (from: number, to: number) => {
    const p = (k: number) => [340 + R * Math.cos(Math.PI * (1 - k)), 340 - R * Math.sin(Math.PI * (1 - k))];
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
  };
  return (
    <svg viewBox="0 0 680 400" width={680} height={400}>
      <path d={arc(0, 1)} fill="none" stroke="rgba(248,250,252,0.12)" strokeWidth={40} strokeLinecap="round" />
      <path d={arc(0, Math.max(0.001, t))} fill="none" stroke={C.amber} strokeWidth={40} strokeLinecap="round" />
      <line x1={340} y1={340} x2={340 + (R - 70) * Math.cos(a)} y2={340 - (R - 70) * Math.sin(a)} stroke={C.text} strokeWidth={12} strokeLinecap="round" />
      <circle cx={340} cy={340} r={24} fill={C.text} />
    </svg>
  );
};

/** Generic benefit letter with a highlighted deductions row. */
const Letter: React.FC<{at: number; hi: number}> = ({at, hi}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 16}});
  const h = interpolate(frame, [hi, hi + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const row = (label: string, value: string, highlight = false) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '18px 26px',
        borderRadius: 14,
        background: highlight ? `rgba(245,183,0,${0.35 * h})` : 'transparent',
        outline: highlight ? `4px solid rgba(245,183,0,${h})` : 'none',
        fontFamily: F.body,
        fontWeight: highlight ? 600 : 400,
        fontSize: 34,
        color: C.ink,
        ...numeric,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 460,
        top: 320,
        width: 1000,
        padding: 40,
        borderRadius: 24,
        background: '#F8FAFC',
        boxShadow: '0 30px 60px rgba(3,10,24,0.45)',
        transform: `translateY(${(1 - p) * 300}px) rotate(${(1 - p) * 4}deg)`,
        opacity: p,
      }}
    >
      <div style={{fontFamily: F.title, fontWeight: 800, fontSize: 30, color: C.bg2, marginBottom: 10}}>Su beneficio para 2027 (ejemplo)</div>
      {row('Beneficio mensual', '$2,072.00')}
      {row('Deducción: prima de la Parte B', '−$209.50*', true)}
      {row('Usted recibirá', '$1,862.50*')}
      <div style={{fontFamily: F.body, fontSize: 22, color: '#64748B', marginTop: 8}}>*con la prima proyectada · ejemplo de Miguel, carta ilustrativa (no oficial)</div>
    </div>
  );
};
