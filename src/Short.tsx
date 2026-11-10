import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './components/Background';
import {Camera} from './components/Camera';
import {Counter} from './components/Counter';
import {Cheque, Stamp, CoinRain} from './components/Props';
import {Character} from './components/Character';
import {KineticText} from './components/KineticText';
import {Pill, Sparkle, Label} from './components/Ui';
import {hasFile} from './components/Sfx';
import {buildCues} from './lib/cues.js';
import {WORDS, FPS, sceneOf, wordFrame, tween, usd, type Word} from './lib/timing';
import {FACTS} from './data/facts';
import {C, F, numeric} from './theme';

// Vertical Short (1080x1920, render with --scale=2 → 2160x3840):
// 1.5 s hook, then scene 4 (examples + "en papel") and scene 5 (Miguel's net maths), recomposed vertically.
const HOOK = 90;
const abs = (phrase: string, escena: number, nth = 0) => sceneOf(escena).inicioFrame + wordFrame(phrase, escena, nth);
const s4end = sceneOf(4).finFrame;
let A0 = abs('Pero tú no eres', 4) - 12;
const A1 = s4end - 10;
const B0 = abs('Hagamos la cuenta', 5) - 12;
const B1 = abs('Y ojo', 5) - 8;
if (HOOK + (A1 - A0) + (B1 - B0) > 59.5 * FPS) A0 = abs('Si cobras 1.200', 4) - 12; // keep it under 60 s
export const SHORT_FRAMES = HOOK + (A1 - A0) + (B1 - B0);
const SEGS = [
  {from: HOOK, src: A0, len: A1 - A0},
  {from: HOOK + (A1 - A0), src: B0, len: B1 - B0},
];

/** Maps short-local frames to absolute video frames (for audio + subtitles). */
const toSrc = (f: number) => {
  for (const s of SEGS) if (f >= s.from && f < s.from + s.len) return s.src + (f - s.from);
  return -1;
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 9, mass: 0.7}});
  const q = spring({frame: frame - 28, fps, config: {damping: 10}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <CoinRain at={0} count={14} floor={1500} width={1080} />
      <div style={{textAlign: 'center', fontFamily: F.title, fontWeight: 900, lineHeight: 1}}>
        <div style={{fontSize: 230, color: C.green, transform: `scale(${p})`, ...numeric}}>+3,6&nbsp;%</div>
        <div style={{fontSize: 130, color: C.amber, marginTop: 30, transform: `scale(${q})`}}>¿o menos?</div>
      </div>
    </AbsoluteFill>
  );
};

/** Scene 4 recomposed vertically. `local` = frames since the segment start; `src` = absolute frame. */
const PartA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (phrase: string, nth = 0) => abs(phrase, 4, nth) - A0;
  const rows = [at('1.200'), at('1.500'), at('Con 2.000'), at('Y con 2.500')];
  const fMig = at('Miguel cobra');
  const fNew = at('recibirá');
  const fPapel = at('en papel', 1);
  const papel = spring({frame: frame - fPapel, fps, config: {damping: 20}});
  return (
    <AbsoluteFill>
      {frame < fMig - 10 ? (
        <AbsoluteFill style={{opacity: 1 - tween(frame, fMig - 20, 12)}}>
          <div style={{position: 'absolute', left: 80, top: 220}}>
            <KineticText text="Pero tú no eres un promedio." start={4} size={84} maxWidth={920} marks={{5: {color: C.amber, underline: true, at: 30}}} />
          </div>
          <div style={{position: 'absolute', left: 80, top: 520, width: 920}}>
            {FACTS.examples.map((ex, i) => {
              const p = spring({frame: frame - rows[i] + 8, fps, config: {damping: 16}});
              return (
                <div key={ex.from} style={{height: 190, marginBottom: 24, borderRadius: 30, padding: '0 40px', background: i % 2 ? 'rgba(248,250,252,0.05)' : 'rgba(248,250,252,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
                  <div>
                    <Counter to={ex.from} start={rows[i] - 8} dur={30} prefix="$" sfx={false} style={{fontFamily: F.title, fontWeight: 800, fontSize: 52, color: C.muted, display: 'block'}} />
                    <Counter from={ex.from} to={ex.to} start={rows[i] + 30} dur={40} prefix="→ $" style={{fontFamily: F.title, fontWeight: 900, fontSize: 80, color: C.text}} />
                  </div>
                  <Pill at={rows[i] + 60} text={`+${usd(ex.to - ex.from)}`} size={56} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <Character who="miguel" x={300} y={800} scale={1.15} enterAt={fMig} poses={[{at: fNew, pose: 'point', until: fNew + 120}]} />
          <div style={{position: 'absolute', left: 60, top: 300, transform: `scale(${spring({frame: frame - fMig - 10, fps, config: {damping: 14}})})`}}>
            <div style={{opacity: interpolate(papel, [0, 1], [1, 0.4])}}>
              <Cheque w={960} amountSize={100} memo="Desde enero 2027" amount={<Counter from={2000} to={2072} start={fNew} dur={50} prefix="$" style={{color: '#15803D'}} />} />
            </div>
            <div style={{position: 'absolute', left: 330, top: 300}}>
              <Stamp at={fPapel} text="EN PAPEL" size={100} />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const PartB: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (phrase: string) => abs(phrase, 5) - B0;
  const terms = [
    {t: '+$72', c: C.green, f: at('72 dólares')},
    {t: '− $6.60', c: C.red, f: at('menos 6')},
    {t: '= +$65.40', c: C.green, f: at('65 dólares')},
  ];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, top: 260}}>
        <KineticText text="La cuenta de Miguel" start={4} size={90} maxWidth={920} marks={{3: {color: '#60A5FA'}}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        {terms.map((x, i) => {
          const p = spring({frame: frame - x.f, fps, config: {damping: 13, mass: 0.8}});
          return (
            <div key={x.t} style={{position: 'relative', fontFamily: F.title, fontWeight: 900, fontSize: i === 2 ? 150 : 140, color: x.c, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 160}px) scale(${0.6 + 0.4 * p})`, ...numeric}}>
              {x.t}
              {i === 2 ? <Sparkle at={x.f + 10} x={460} y={110} r={170} /> : null}
            </div>
          );
        })}
        <Label size={50} color={C.amber} style={{marginTop: 30, opacity: tween(frame, terms[2].f + 30, 16)}}>
          netos más al mes
        </Label>
      </div>
    </AbsoluteFill>
  );
};

const ShortSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cues = useMemo(() => buildCues(WORDS), []);
  const src = toSrc(frame);
  if (src < 0) return null;
  const ms = (src / FPS) * 1000;
  const seg = SEGS.find((s) => frame >= s.from && frame < s.from + s.len)!;
  const segEndMs = ((seg.src + seg.len) / FPS) * 1000;
  const segStartMs = (seg.src / FPS) * 1000;
  const found = cues.find((c) => ms >= c.startMs && ms <= c.endMs);
  if (!found) return null;
  // only words that are actually inside this audio segment
  const cue = {...found, words: found.words.filter((w: Word) => w.startMs < segEndMs && w.startMs >= segStartMs - 200)};
  if (!cue.words.length) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 300}}>
      <div style={{maxWidth: 940, background: 'rgba(11,31,58,0.7)', borderRadius: 20, padding: '18px 30px', textAlign: 'center', fontFamily: F.body, fontWeight: 600, fontSize: 60, lineHeight: 1.25, color: C.text}}>
        {cue.words.map((w: Word, i: number) => (
          <span key={i} style={{color: ms >= w.startMs && ms < (cue.words[i + 1]?.startMs ?? w.endMs + 200) ? C.amber : C.text}}>
            {w.text}{' '}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC = () => {
  const voice = hasFile('voz.wav') ? 'voz.wav' : hasFile('voz.mp3') ? 'voz.mp3' : null;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <div style={{position: 'absolute', left: -420, top: 0, width: 1920, height: 1080, transform: 'scale(1.78)', transformOrigin: '960px 0'}}>
        <Background />
      </div>
      <Camera>
        <Sequence durationInFrames={HOOK}>
          <Hook />
        </Sequence>
        <Sequence from={SEGS[0].from} durationInFrames={SEGS[0].len}>
          <PartA />
        </Sequence>
        <Sequence from={SEGS[1].from} durationInFrames={SEGS[1].len}>
          <PartB />
        </Sequence>
      </Camera>
      <ShortSubtitles />
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: F.title, fontWeight: 800, fontSize: 34, color: C.muted}}>Dinero Claro USA</div>
      {voice
        ? SEGS.map((s) => (
            <Sequence key={s.from} from={s.from} durationInFrames={s.len}>
              <Audio src={staticFile(voice)} startFrom={s.src} endAt={s.src + s.len} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
