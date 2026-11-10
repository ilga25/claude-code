import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type Props = Record<string, never>;

/** Custom "zoom-through": the old scene rushes towards the camera, the new one arrives from depth. */
const ZoomThroughPresentation: React.FC<TransitionPresentationComponentProps<Props>> = ({children, presentationDirection, presentationProgress: p}) => {
  const entering = presentationDirection === 'entering';
  const scale = entering ? interpolate(p, [0, 1], [0.72, 1]) : interpolate(p, [0, 1], [1, 1.9]);
  const opacity = entering ? interpolate(p, [0, 0.55], [0, 1], {extrapolateRight: 'clamp'}) : interpolate(p, [0.2, 0.8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{transform: `scale(${scale})`, opacity}}>{children}</AbsoluteFill>;
};

export const zoomThrough = (): TransitionPresentation<Props> => ({component: ZoomThroughPresentation, props: {}});
