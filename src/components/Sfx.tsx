import React from 'react';
import {Audio, Sequence, getStaticFiles, staticFile} from 'remotion';

const FILES = getStaticFiles().map((f) => f.name);
const find = (name: string) => FILES.find((f) => f.startsWith(`sfx/${name}.`));

/** Plays sfx/<name>.* at a (scene-relative) frame if the file exists; otherwise renders nothing. */
export const Sfx: React.FC<{name: 'whoosh' | 'pop' | 'click'; at: number; volume?: number}> = ({name, at, volume = 0.3}) => {
  const file = find(name);
  if (!file) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none">
      <Audio src={staticFile(file)} volume={volume} />
    </Sequence>
  );
};

export const hasFile = (name: string) => FILES.includes(name);
