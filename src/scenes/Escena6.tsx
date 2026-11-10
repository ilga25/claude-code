import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Card3D} from '../components/Card3D';
import {Checklist} from '../components/Checklist';
import {Character} from '../components/Character';
import {Arrow} from '../components/Props';
import {Icon} from '../components/Icons';
import {Beat, Card, Label, Pill, SceneTag} from '../components/Ui';
import {sceneWords, tween} from '../lib/timing';
import {C, F, numeric} from '../theme';

const w = sceneWords(6);

const PlanFace: React.FC<{title: string; rows: [string, string][]; color: string; badge?: string}> = ({title, rows, color, badge}) => (
  <div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 48, color}}>{title}</div>
      {badge ? <span style={{fontFamily: F.title, fontWeight: 800, fontSize: 26, background: color, color: C.ink, borderRadius: 999, padding: '6px 18px'}}>{badge}</span> : null}
    </div>
    <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18}}>
      {rows.map(([k, v]) => (
        <div key={k} style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.body, fontSize: 32, color: C.text, ...numeric}}>
          <span style={{color: C.muted}}>{k}</span>
          <span style={{fontWeight: 600}}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

export const Escena6: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f15 = w('15 de octubre');
  const f7 = w('7 de diciembre');
  const fD = w('la Parte D');
  const f50 = w('50 dólares');
  const fMA = w('Medicare Advantage');
  const fBuena = w('La buena noticia');
  const fRenueva = w('se renueva solo');
  const fRosa = w('Rosa hizo la prueba');
  const fBarato = w('más barato');
  const fMedia = w('media hora');
  const fTres = w('fíjate en tres cosas');
  const fMed = w('tus medicinas estén cubiertas');
  const fRed = w('en la red');
  const fTotal = w('en total en el año');
  const fCero = w('prima de cero');
  const fShip = w('SHIP');
  const fTel = w('1-800-MEDICARE');

  const fill = interpolate(frame, [f15, f7 + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 2)});

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={6} title="Parte D y Medicare Advantage" />
      <Camera keys={[{frame: f7, scale: 1.04}, {frame: fD, scale: 1}, {frame: fBuena, scale: 1.02}, {frame: fRosa, scale: 1.05, x: 900}, {frame: fTres, scale: 1, x: 960}, {frame: fShip, scale: 1.04}]}>
        {/* a · open enrollment band 15 oct → 7 dic */}
        <Beat a={0} b={fD - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Inscripción abierta de Medicare" start={6} size={68} />
          </div>
          <div style={{position: 'absolute', left: 160, top: 400, width: 1300, height: 140}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 70, background: 'rgba(248,250,252,0.08)', border: `3px solid ${C.line}`}} />
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 70, background: `linear-gradient(90deg, ${C.green}, ${C.amber})`}} />
            <div style={{position: 'absolute', left: 40, top: 160, fontFamily: F.title, fontWeight: 900, fontSize: 60, color: C.green, opacity: tween(frame, f15, 14)}}>15 oct</div>
            <div style={{position: 'absolute', right: 40, top: 160, fontFamily: F.title, fontWeight: 900, fontSize: 60, color: C.amber, opacity: tween(frame, f7, 14), transform: `scale(${1 + 0.06 * Math.sin(Math.max(0, frame - f7) / 5) * (frame < f7 + 60 ? 1 : 0)})`}}>
              7 dic
            </div>
          </div>
          <div style={{position: 'absolute', left: 1560, top: 340, transform: `rotate(${Math.floor(frame / 120) % 2 ? 180 : 0}deg)`}}>
            <Icon name="hourglass" size={220} color={C.amber} />
          </div>
        </Beat>

        {/* b · prices going up */}
        <Beat a={fD} b={fBuena - 10}>
          <Card at={fD} x={120} y={210} w={820} h={520}>
            <Icon name="pills" size={110} color={C.amber} />
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 56, color: C.text, marginTop: 16}}>Parte D</div>
            <Label size={30}>planes de medicamentos</Label>
            <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{transform: `translateY(${-10 * spring({frame: frame - f50, fps, config: {damping: 8}})}px)`}}>
                <Icon name="arrowUp" size={90} color={C.red} />
              </div>
              <span style={{fontFamily: F.title, fontWeight: 900, fontSize: 84, color: C.red, opacity: tween(frame, f50, 12), ...numeric}}>+$50 o más</span>
            </div>
            <Label size={28}>al mes, en algunos planes</Label>
          </Card>
          <Card at={fMA} x={980} y={210} w={820} h={520} accent={C.red}>
            <Icon name="doctor" size={110} color={C.text} />
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 56, color: C.text, marginTop: 16}}>Medicare Advantage</div>
            <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <Icon name="arrowUp" size={60} color={C.red} />
                <span style={{fontFamily: F.title, fontWeight: 800, fontSize: 46, color: C.text}}>costos</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: tween(frame, fMA + 60, 16)}}>
                <Icon name="arrowUp" size={60} color={C.amber} style={{transform: 'rotate(180deg)'}} />
                <span style={{fontFamily: F.title, fontWeight: 800, fontSize: 46, color: C.text}}>beneficios extra</span>
              </div>
            </div>
          </Card>
        </Beat>

        {/* c · compare: 3D flip plan cards */}
        <Beat a={fBuena} b={fRosa - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Comparar sale a cuenta" start={fBuena} size={68} marks={{0: {color: C.green, underline: true, at: fBuena + 30}}} />
          </div>
          <div style={{position: 'absolute', left: 220, top: 330, display: 'flex', gap: 120}}>
            <Card3D
              w={640}
              h={420}
              enterAt={fBuena + 10}
              flipAt={fRenueva}
              accent={C.line}
              front={<PlanFace title="Plan actual" color={C.text} rows={[['Prima', '$ —'], ['Medicinas', '$ —'], ['Total del año', '$ —']]} />}
              back={<PlanFace title="Plan actual" color={C.red} badge="se renueva solo" rows={[['Prima', 'sube'], ['Medicinas', 'sube'], ['Total del año', 'sube']]} />}
            />
            <Card3D
              w={640}
              h={420}
              enterAt={fBuena + 20}
              flipAt={fRenueva + 30}
              accent={C.green}
              front={<PlanFace title="Plan nuevo" color={C.text} rows={[['Prima', '$ —'], ['Medicinas', '$ —'], ['Total del año', '$ —']]} />}
              back={<PlanFace title="Plan nuevo" color={C.green} badge="comparado" rows={[['Prima', 'revisada'], ['Medicinas', 'cubiertas'], ['Total del año', 'más bajo']]} />}
            />
          </div>
        </Beat>

        {/* d · Rosa with laptop */}
        <Beat a={fRosa} b={fTres - 10}>
          <Character who="rosa" x={180} y={260} scale={1} enterAt={fRosa} poses={[{at: fBarato, pose: 'point', until: fMedia + 40}]} />
          <div style={{position: 'absolute', left: 720, top: 250, transform: `scale(${spring({frame: frame - fRosa - 10, fps, config: {damping: 15}})})`}}>
            <Laptop at={fRosa + 20} savingAt={fBarato} />
          </div>
          <Arrow x1={1500} y1={720} x2={1700} y2={420} at={fBarato + 10} width={14} />
          <div style={{position: 'absolute', left: 1450, top: 300, opacity: tween(frame, fBarato + 20, 16)}}>
            <Pill at={fBarato + 20} text="ahorro" size={44} />
          </div>
          <div style={{position: 'absolute', left: 1440, top: 760, display: 'flex', alignItems: 'center', gap: 16, opacity: tween(frame, fMedia, 16)}}>
            <Icon name="clock" size={64} color={C.amber} />
            <span style={{fontFamily: F.title, fontWeight: 800, fontSize: 48, color: C.amber}}>30 min</span>
          </div>
        </Beat>

        {/* e · three things to check */}
        <Beat a={fTres} b={fShip - 10}>
          <div style={{position: 'absolute', left: 120, top: 190}}>
            <KineticText text="Al comparar, fíjate en 3 cosas" start={fTres} size={64} marks={{4: {color: C.amber}}} />
          </div>
          <div style={{position: 'absolute', left: 160, top: 330}}>
            <Checklist
              width={1200}
              rowH={140}
              items={[
                {text: 'Tus medicinas, cubiertas', at: fMed - 10, checkAt: fMed + 40},
                {text: 'Tus médicos y tu farmacia, en la red', at: fRed - 20, checkAt: fRed + 20},
                {text: 'Lo que pagas en total en el año', sub: 'no solo la prima mensual', at: fTotal - 20, checkAt: fTotal + 30},
              ]}
            />
          </div>
          <div style={{position: 'absolute', left: 1400, top: 360, opacity: tween(frame, fCero, 16), transform: `rotate(4deg) translateY(${(1 - tween(frame, fCero, 20)) * 40}px)`}}>
            <div style={{width: 400, padding: 30, borderRadius: 24, background: 'rgba(239,68,68,0.15)', border: `3px solid ${C.red}`}}>
              <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 52, color: C.red, ...numeric}}>Prima $0</div>
              <Label size={28} color={C.text}>puede salir más cara si tus medicinas no están bien cubiertas</Label>
            </div>
          </div>
        </Beat>

        {/* f · help card */}
        <Beat a={fShip} b={100000}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: 40, transform: 'translateY(-40px)'}}>
              {[
                {icon: 'laptop' as const, t: 'medicare.gov', s: 'buscador de planes', at: fShip - 20},
                {icon: 'person' as const, t: 'SHIP', s: 'consejería gratuita en cada estado', at: fShip},
                {icon: 'phone' as const, t: '1-800-MEDICARE', s: 'pide atención en español', at: fTel},
              ].map((x, i) => {
                const p = spring({frame: frame - x.at, fps, config: {damping: 14}});
                return (
                  <div
                    key={x.t}
                    style={{
                      width: 520,
                      height: 380,
                      padding: 40,
                      boxSizing: 'border-box',
                      borderRadius: 28,
                      background: `linear-gradient(160deg, ${C.cardHi}, ${C.card})`,
                      border: `3px solid ${i === 1 ? C.amber : C.line}`,
                      opacity: p,
                      transform: `translateY(${(1 - p) * 80}px)`,
                    }}
                  >
                    <Icon name={x.icon} size={110} color={i === 1 ? C.amber : C.green} />
                    <div style={{fontFamily: F.title, fontWeight: 900, fontSize: x.t.length > 12 ? 46 : 60, color: C.text, marginTop: 20, ...numeric}}>{x.t}</div>
                    <Label size={30}>{x.s}</Label>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};

/** Generic laptop with an abstract plan-finder (not the real website). */
const Laptop: React.FC<{at: number; savingAt: number}> = ({at, savingAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows = [0, 1, 2, 3];
  return (
    <div style={{position: 'relative', width: 760, height: 520}}>
      <div style={{position: 'absolute', left: 40, top: 0, width: 680, height: 440, borderRadius: 24, background: '#0F172A', border: '14px solid #CBD5E1', boxSizing: 'border-box', overflow: 'hidden'}}>
        <div style={{height: 50, background: '#1E293B', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px'}}>
          {[C.red, C.amber, C.green].map((c) => (
            <span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
          ))}
          <span style={{marginLeft: 16, height: 18, width: 300, borderRadius: 9, background: '#334155'}} />
        </div>
        <div style={{padding: 26, display: 'flex', flexDirection: 'column', gap: 16}}>
          {rows.map((r) => {
            const p = spring({frame: frame - at - r * 6, fps, config: {damping: 16}});
            const best = r === 2 && frame > savingAt;
            return (
              <div
                key={r}
                style={{
                  height: 64,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  background: best ? 'rgba(34,197,94,0.25)' : 'rgba(248,250,252,0.06)',
                  border: best ? `3px solid ${C.green}` : '3px solid transparent',
                  opacity: p,
                  transform: `translateX(${(1 - p) * 40}px)`,
                }}
              >
                <span style={{height: 14, width: 220, borderRadius: 7, background: '#475569'}} />
                <span style={{height: 14, width: 90, borderRadius: 7, background: best ? C.green : '#475569'}} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 440, width: 760, height: 36, borderRadius: '0 0 30px 30px', background: '#94A3B8'}} />
    </div>
  );
};
