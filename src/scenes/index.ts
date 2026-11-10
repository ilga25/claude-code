import type React from 'react';
import {Escena1} from './Escena1';
import {Escena2} from './Escena2';
import {Escena3} from './Escena3';
import {Escena4} from './Escena4';
import {Escena5} from './Escena5';
import {Escena6} from './Escena6';
import {Escena7} from './Escena7';
import {Escena8} from './Escena8';
import {Escena9} from './Escena9';
import {Escena10} from './Escena10';

export const SCENES: Record<number, React.FC> = {
  1: Escena1,
  2: Escena2,
  3: Escena3,
  4: Escena4,
  5: Escena5,
  6: Escena6,
  7: Escena7,
  8: Escena8,
  9: Escena9,
  10: Escena10,
};
