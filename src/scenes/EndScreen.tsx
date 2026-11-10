import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Camera} from '../components/Camera';
import {LogoMark} from './Escena2';
import {C, F} from '../theme';

// YouTube end screen (20 s). Element zones are left empty on purpose:
// two 16:9 video slots (left column) and a round subscribe slot (right) — added in YouTube Studio.
export const EndScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slot = (i: number) => spring({frame: frame - 10 - i * 6, fps, config: {damping: 16}});
  const pulse = 0.5 + 0.5 * Math.sin(frame / 20);
  return (
    <AbsoluteFill>
      <Background />
      <Camera drift={0.5}>
        <div style={{position: 'absolute', left: 120, top: 90, display: 'flex', alignItems: 'center', gap: 24, opacity: slot(0)}}>
          <LogoMark at={0} size={90} />
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 52, color: C.text}}>Dinero Claro USA</div>
        </div>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 120,
              top: 230 + i * 400,
              width: 640,
              height: 360,
              borderRadius: 24,
              border: `4px dashed rgba(248,250,252,${0.25 + 0.15 * pulse})`,
              background: 'rgba(248,250,252,0.04)',
              opacity: slot(i + 1),
              transform: `translateX(${(1 - slot(i + 1)) * -80}px)`,
              display: 'grid',
              placeItems: 'center',
              fontFamily: F.body,
              fontWeight: 600,
              fontSize: 30,
              color: C.muted,
            }}
          >
            {i === 0 ? 'Vídeo recomendado' : 'Siguiente vídeo'}
          </div>
        ))}
        <div style={{position: 'absolute', left: 1040, top: 300, width: 760, textAlign: 'left', opacity: slot(3)}}>
          <div style={{fontFamily: F.title, fontWeight: 900, fontSize: 74, color: C.text, lineHeight: 1.08}}>
            La próxima semana:
            <br />
            <span style={{color: C.amber}}>¿62, 67 o 70?</span>
          </div>
          <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 34, color: C.muted, marginTop: 20}}>A qué edad conviene pedir el Seguro Social, con números</div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1340,
            top: 620,
            width: 280,
            height: 280,
            borderRadius: 140,
            border: `4px dashed rgba(245,183,0,${0.4 + 0.3 * pulse})`,
            opacity: slot(4),
            display: 'grid',
            placeItems: 'center',
            fontFamily: F.title,
            fontWeight: 800,
            fontSize: 30,
            color: C.amber,
            transform: `scale(${interpolate(slot(4), [0, 1], [0.6, 1])})`,
          }}
        >
          Suscríbete
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: F.body, fontSize: 22, color: C.muted}}>
          Información educativa, no asesoría financiera · Fuentes: ssa.gov · segurosocial.gov · medicare.gov
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
