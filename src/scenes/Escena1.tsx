import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {CoinRain, Cheque, Scissors, CalendarPage} from '../components/Props';
import {Typewriter} from '../components/KineticText';
import {useOut} from '../components/Ui';
import {Sfx} from '../components/Sfx';
import {sceneWords} from '../lib/timing';
import {C, F, numeric} from '../theme';

const w = sceneWords(1);

export const Escena1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fPct = w('3,6 %');
  const fBut = w('Pero hay un detalle');
  const fCut = w('Medicare se lleva');
  const fDate = w('7 de diciembre');
  const fTitle = w('En este vídeo');

  // 3,6 % — huge, overshooting spring; later shrinks up to make room for the cheque
  const pop = spring({frame: frame - fPct + 4, fps, config: {damping: 9, mass: 0.8, stiffness: 140}});
  const up = spring({frame: frame - fBut, fps, config: {damping: 18}});
  const pctScale = interpolate(pop, [0, 1], [0.2, 1]) * interpolate(up, [0, 1], [1, 0.42]);
  const pctY = interpolate(up, [0, 1], [0, -300]);
  const pctOut = useOut(fTitle - 10);

  // cheque + scissors
  const chequeIn = spring({frame: frame - (fBut + 20), fps, config: {damping: 16}});
  const scissorsT = interpolate(frame, [fCut - 30, fCut + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const snap = frame > fCut + 6 ? 0 : 0.5 + Math.sin(frame / 3) * 0.5;
  const cutT = Math.max(0, (frame - (fCut + 8)) / fps);
  const stripY = 0.5 * 2200 * cutT * cutT;
  const stripRot = cutT * 50;
  const chequeOut = useOut(fDate + 30);

  // calendar
  const cal = spring({frame: frame - fDate + 6, fps, config: {damping: 12}});
  const calOut = useOut(fTitle - 10);
  const shake = frame > fDate && frame < fDate + 50 ? 1 : 0.15;

  const titleIn = spring({frame: frame - fTitle, fps, config: {damping: 18}});

  return (
    <AbsoluteFill>
      <Background />
      <Camera keys={[{frame: fBut, scale: 1.04}, {frame: fCut - 20, x: 1010, scale: 1.08}, {frame: fDate, x: 960, scale: 1.02}, {frame: fTitle, scale: 1}]}>
        <CoinRain at={fPct} count={22} floor={860} />
        {/* 3,6 % */}
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: pctOut}}>
          <div style={{transform: `translateY(${pctY - 40}px) scale(${pctScale})`, textAlign: 'center'}}>
            <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 340, color: C.green, letterSpacing: '-0.03em', textShadow: '0 20px 60px rgba(34,197,94,0.35)', ...numeric}}>
              +3,6&nbsp;%
            </div>
            <div style={{fontFamily: F.title, fontWeight: 800, fontSize: 64, color: C.text, marginTop: -10, opacity: interpolate(frame, [fPct + 20, fPct + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
              en enero · Seguro Social
            </div>
          </div>
          <Sfx name="pop" at={fPct} volume={0.35} />
        </AbsoluteFill>

        {/* cheque that gets cut */}
        <div style={{position: 'absolute', left: 510, top: 400, opacity: chequeOut * chequeIn, transform: `translateY(${(1 - chequeIn) * 120}px) rotate(${(1 - chequeIn) * -6}deg)`}}>
          <div style={{position: 'relative', width: 900, height: 396}}>
            <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 220px 0 0)'}}>
              <Cheque amount="$ ? ? ?" strip={<span />} />
            </div>
            <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 0 680px)', transform: `translate(${cutT * 120}px, ${stripY}px) rotate(${stripRot}deg)`, transformOrigin: '790px 200px'}}>
              <Cheque
                amount="$ ? ? ?"
                strip={
                  <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 34, color: C.red, transform: 'rotate(-90deg)', whiteSpace: 'nowrap'}}>−Medicare</div>
                }
              />
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: interpolate(scissorsT, [0, 1], [1960, 1080]),
            top: interpolate(scissorsT, [0, 1], [130, 380]),
            transform: `rotate(90deg) translateX(${frame > fCut + 6 ? (frame - fCut - 6) * 18 : 0}px)`,
            opacity: chequeOut,
          }}
        >
          <Scissors size={240} open={snap} />
        </div>
        <Sfx name="click" at={fCut + 6} volume={0.4} />

        {/* 7 DIC calendar */}
        <div style={{position: 'absolute', left: 1360, top: 220, opacity: calOut * Math.min(1, cal * 1.5), transform: `scale(${cal})`}}>
          <CalendarPage month="DIC" day="7" shake={shake} size={300} />
          <div style={{fontFamily: F.title, fontWeight: 800, fontSize: 40, color: C.amber, textAlign: 'center', marginTop: 24}}>fecha límite</div>
        </div>

        {/* Title typed letter by letter */}
        <AbsoluteFill style={{justifyContent: 'center', padding: '0 160px', opacity: titleIn}}>
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 104, lineHeight: 1.05, color: C.text, maxWidth: 1500, transform: `translateY(${(1 - titleIn) * 30}px)`}}>
            <Typewriter text="Seguro Social 2027:" start={fTitle + 6} cps={22} />
            <br />
            <span style={{color: C.amber}}>
              <Typewriter text="cuánto vas a cobrar DE VERDAD" start={fTitle + 6 + 19 * (60 / 22)} cps={22} keepCaret />
            </span>
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
