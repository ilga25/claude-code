import React from 'react';
import {Composition, Still} from 'remotion';
import {Video} from './Video';
import {Thumbnail} from './Thumbnail';
import {Short, SHORT_FRAMES} from './Short';
import {TIMELINE} from './lib/timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={TIMELINE.durationInFrames} fps={TIMELINE.fps} width={1920} height={1080} />
    <Composition id="Short" component={Short} durationInFrames={SHORT_FRAMES} fps={TIMELINE.fps} width={1080} height={1920} />
    <Still id="Miniatura" component={Thumbnail} width={1280} height={720} />
  </>
);
