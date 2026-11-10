import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {zoomThrough} from './components/ZoomThrough';
import {Subtitles} from './components/Subtitles';
import {AudioLayer, Disclaimer} from './components/Overlays';
import {Sfx} from './components/Sfx';
import {TIMELINE, wordFrame, sceneOf} from './lib/timing';
import {TRANSITION_FRAMES as T, ease} from './theme';
import {SCENES} from './scenes';
import {EndScreen} from './scenes/EndScreen';

// slide → wipe → zoom-through, with varying directions: never two identical transitions in a row.
const PRESENTATIONS = [
  () => slide({direction: 'from-right'}),
  () => wipe({direction: 'from-top-left'}),
  () => zoomThrough(),
  () => slide({direction: 'from-bottom'}),
  () => wipe({direction: 'from-bottom-right'}),
  () => zoomThrough(),
  () => slide({direction: 'from-left'}),
  () => wipe({direction: 'from-top-right'}),
  () => zoomThrough(),
  () => slide({direction: 'from-right'}),
];

export const segments = () => {
  const s = TIMELINE.scenes.map((sc) => ({Comp: SCENES[sc.escena], len: sc.finFrame - sc.inicioFrame, start: sc.inicioFrame}));
  return [...s, {Comp: EndScreen, len: TIMELINE.endScreen.finFrame - TIMELINE.endScreen.inicioFrame, start: TIMELINE.endScreen.inicioFrame}];
};

export const Video: React.FC = () => {
  const segs = segments();
  const s10 = sceneOf(10);
  const closingDisclaimer = s10.inicioFrame + wordFrame('Y recuerda', 10);
  return (
    <AbsoluteFill style={{backgroundColor: '#0B1F3A'}}>
      <TransitionSeries>
        {segs.flatMap(({Comp, len}, i) => {
          const last = i === segs.length - 1;
          // Each scene is extended by T so the next one starts exactly on its own first frame (transitions overlap).
          const items = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={len + (last ? 0 : T)}>
              <Comp />
            </TransitionSeries.Sequence>,
          ];
          if (!last)
            items.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={PRESENTATIONS[i % PRESENTATIONS.length]() as never}
                timing={i % 2 ? springTiming({config: {damping: 200}, durationInFrames: T}) : linearTiming({durationInFrames: T, easing: ease})}
              />,
            );
          return items;
        })}
      </TransitionSeries>
      {segs.slice(1).map((s, i) => (
        <Sequence key={i} from={s.start - 6} durationInFrames={60} layout="none">
          <Sfx name="whoosh" at={0} volume={0.22} />
        </Sequence>
      ))}
      <Subtitles />
      <Disclaimer ranges={[[0, 600], [closingDisclaimer, TIMELINE.endScreen.inicioFrame - 1]]} />
      <AudioLayer durationInFrames={TIMELINE.durationInFrames} />
    </AbsoluteFill>
  );
};
