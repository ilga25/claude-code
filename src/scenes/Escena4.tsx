import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {Counter} from '../components/Counter';
import {Cheque, Stamp, CalendarPage} from '../components/Props';
import {Character} from '../components/Character';
import {Icon} from '../components/Icons';
import {Beat, Card, Label, Pill, SceneTag} from '../components/Ui';
import {sceneWords, tween, usd} from '../lib/timing';
import {FACTS} from '../data/facts';
import {C, F, numeric} from '../theme';

const w = sceneWords(4);

export const Escena4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fOct = w('14 de octubre');
  const fPct = w('3,6 %');
  const f75 = w('75 dólares');
  const fTu = w('Pero tú no eres');
  const rows = [w('1.200'), w('1.500'), w('Con 2.000'), w('Y con 2.500')];
  const fMig = w('Miguel cobra');
  const fNew = w('recibirá');
  const fRound = w('redondea');
  const fPapel = w('en papel', 1);
  const fMed = w('tiene Medicare');

  const papel = spring({frame: frame - fPapel, fps, config: {damping: 20}});

  return (
    <AbsoluteFill>
      <Background />
      <SceneTag n={4} title="La cifra de 2027" />
      <Camera keys={[{frame: fPct, scale: 1.05, x: 1000}, {frame: fTu, scale: 1, x: 960}, {frame: fMig, scale: 1}, {frame: fNew, scale: 1.08, x: 1080, y: 500}, {frame: fPapel, scale: 1.04, x: 1040}]}>
        {/* a · stylised announcement (no official logos) */}
        <Beat a={0} b={fTu - 10}>
          <div style={{position: 'absolute', left: 300, top: 180}}>
            <CalendarPage month="OCT" day="14" size={260} color={C.green} style={{transform: `scale(${spring({frame: frame - fOct, fps, config: {damping: 12}})})`}} />
          </div>
          <Card at={fOct + 10} x={660} y={170} w={960} h={600}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <Icon name="doc" size={64} color={C.muted} />
              <Label size={30} style={{letterSpacing: '0.1em', textTransform: 'uppercase'}}>Comunicado · Seguro Social</Label>
            </div>
            <div style={{marginTop: 30, height: 14, width: 700, borderRadius: 7, background: 'rgba(248,250,252,0.1)'}} />
            <div style={{marginTop: 16, height: 14, width: 560, borderRadius: 7, background: 'rgba(248,250,252,0.1)'}} />
            <div style={{marginTop: 34, display: 'flex', alignItems: 'baseline', gap: 26}}>
              <span style={{fontFamily: F.title, fontWeight: 900, fontSize: 64, color: C.text}}>COLA 2027:</span>
              <span
                style={{
                  fontFamily: F.title,
                  fontWeight: 900,
                  fontSize: 150,
                  color: C.ink,
                  background: C.green,
                  padding: '0 26px',
                  borderRadius: 22,
                  transform: `scale(${spring({frame: frame - fPct, fps, config: {damping: 10}})})`,
                  display: 'inline-block',
                  ...numeric,
                }}
              >
                3,6&nbsp;%
              </span>
            </div>
            <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 22, opacity: tween(frame, f75 - 6, 16)}}>
              <Counter to={FACTS.avgIncrease} start={f75} prefix="≈ +$" style={{fontFamily: F.title, fontWeight: 900, fontSize: 72, color: C.green}} />
              <Label size={32}>al mes · beneficiario promedio</Label>
            </div>
          </Card>
        </Beat>

        {/* b · examples table, built row by row */}
        <Beat a={fTu} b={fMig - 10}>
          <div style={{position: 'absolute', left: 260, top: 180}}>
            <KineticText text="Pero tú no eres un promedio." start={fTu} size={66} marks={{5: {color: C.amber, underline: true, at: fTu + 30}}} />
          </div>
          <div style={{position: 'absolute', left: 260, top: 320, width: 1400}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 80px 1fr 1fr', padding: '0 40px 14px', opacity: tween(frame, rows[0] - 30, 16)}}>
              {['Cobras hoy', '', 'Desde enero', 'Aumento'].map((h) => (
                <Label key={h} size={28} style={{textTransform: 'uppercase', letterSpacing: '0.08em'}}>
                  {h}
                </Label>
              ))}
            </div>
            {FACTS.examples.map((ex, i) => {
              const at = rows[i];
              const p = spring({frame: frame - at + 8, fps, config: {damping: 16}});
              const isMig = ex.from === 2000;
              return (
                <div
                  key={ex.from}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 1fr 1fr',
                    alignItems: 'center',
                    height: 112,
                    padding: '0 40px',
                    marginBottom: 14,
                    borderRadius: 22,
                    background: isMig && frame > fMig - 40 ? 'rgba(59,130,246,0.25)' : i % 2 ? 'rgba(248,250,252,0.05)' : 'rgba(248,250,252,0.09)',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 40}px)`,
                  }}
                >
                  <Counter to={ex.from} start={at - 8} dur={30} prefix="$" sfx={false} style={{fontFamily: F.title, fontWeight: 800, fontSize: 56, color: C.muted}} />
                  <Icon name="arrowRight" size={50} color={C.muted} />
                  <Counter from={ex.from} to={ex.to} start={at + 30} dur={40} prefix="$" style={{fontFamily: F.title, fontWeight: 900, fontSize: 64, color: C.text}} />
                  <div>
                    <Pill at={at + 60} text={`+${usd(ex.to - ex.from)}`} size={44} />
                  </div>
                </div>
              );
            })}
          </div>
        </Beat>

        {/* c · Miguel + giant cheque, "EN PAPEL" */}
        <Beat a={fMig} b={100000}>
          <Character who="miguel" x={120} y={260} scale={1.0} enterAt={fMig} poses={[{at: fNew, pose: 'point', until: fRound}, {at: fMed, pose: 'nod', until: fMed + 60}]} />
          <div style={{position: 'absolute', left: 620, top: 220, transform: `scale(${spring({frame: frame - fMig - 10, fps, config: {damping: 14}})})`, transformOrigin: 'left center'}}>
            <div style={{opacity: interpolate(papel, [0, 1], [1, 0.4])}}>
              <Cheque
                w={1100}
                memo="Desde enero 2027"
                amountSize={92}
                amount={
                  <span>
                    <span style={{color: '#64748B'}}>$2,000 → </span>
                    <Counter from={2000} to={2072} start={fNew} dur={50} prefix="$" style={{color: '#15803D'}} />
                  </span>
                }
              />
            </div>
            <div style={{position: 'absolute', left: 560, top: 300}}>
              <Stamp at={fPapel} text="EN PAPEL" size={92} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 660, top: 740, opacity: tween(frame, fRound, 18) * (1 - papel)}}>
            <Label size={34} color={C.amber}>
              El Seguro Social redondea a la baja al dólar entero
            </Label>
          </div>
        </Beat>
      </Camera>
    </AbsoluteFill>
  );
};
