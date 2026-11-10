import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from './components/Background';
import {Cheque, Scissors} from './components/Props';
import {Character} from './components/Character';
import {C, F, numeric} from './theme';

// 1280x720 (render with --scale=2 for 2560x1440). Very high contrast, readable on a phone.
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, transform: 'scale(0.6667)', transformOrigin: 'top left', width: 1920, height: 1080}}>
      <Background />
    </div>
    <div style={{position: 'absolute', left: 48, top: 36, fontFamily: F.title, fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: C.text, letterSpacing: '-0.03em', textShadow: '0 8px 30px rgba(0,0,0,0.5)', ...numeric}}>
      <span style={{color: C.green}}>+3,6%</span>…
      <br />
      <span style={{color: C.amber}}>¿o menos?</span>
    </div>
    <div style={{position: 'absolute', left: 40, top: 390, transform: 'rotate(-5deg)'}}>
      <Cheque
        w={640}
        amount={<span style={{color: '#15803D'}}>$2,072</span>}
        amountSize={150}
        memo=""
        strip={<div style={{fontFamily: F.title, fontWeight: 900, fontSize: 40, color: C.red, transform: 'rotate(-90deg)', whiteSpace: 'nowrap'}}>−Medicare</div>}
      />
    </div>
    <div style={{position: 'absolute', left: 580, top: 210, transform: 'rotate(80deg)'}}>
      <Scissors size={260} open={0.85} />
    </div>
    <Character who="miguel" x={830} y={150} scale={0.95} enterAt={-120} mood="surprised" flip />
    <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 10px #F5B700'}} />
  </AbsoluteFill>
);
