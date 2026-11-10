import {Easing, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

// Fonts are bundled in public/fonts (from @fontsource, OFL) so renders work offline.
const FONTS = [
  {family: 'Montserrat', weight: '800', file: 'montserrat-latin-800-normal.woff2'},
  {family: 'Montserrat', weight: '900', file: 'montserrat-latin-900-normal.woff2'},
  {family: 'Inter', weight: '400', file: 'inter-latin-400-normal.woff2'},
  {family: 'Inter', weight: '600', file: 'inter-latin-600-normal.woff2'},
];
for (const f of FONTS) loadFont({family: f.family, weight: f.weight, url: staticFile(`fonts/${f.file}`)});

export const C = {
  bg: '#0B1F3A',
  bg2: '#12305A',
  green: '#22C55E',
  amber: '#F5B700',
  red: '#EF4444',
  text: '#F8FAFC',
  muted: '#94A3B8',
  // derived tints
  line: 'rgba(248,250,252,0.14)',
  card: 'rgba(18,48,90,0.86)',
  cardHi: '#17396A',
  ink: '#0B1F3A',
} as const;

export const F = {
  title: 'Montserrat, sans-serif',
  body: 'Inter, sans-serif',
};

export const numeric: React.CSSProperties = {fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum" 1'};

// Layout: 1920x1080, 12-column grid, 96px safe margins.
export const W = 1920;
export const H = 1080;
export const SAFE = 96;
export const COL = (W - SAFE * 2) / 12; // 144px
export const col = (n: number) => SAFE + COL * n;
/** Bottom band reserved for subtitles — important graphics stay above this line. */
export const SUB_TOP = 850;

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const SPRING = {damping: 16, mass: 0.9, stiffness: 120};
export const SPRING_SOFT = {damping: 20, mass: 1, stiffness: 90};
export const SPRING_POP = {damping: 14, mass: 0.8, stiffness: 160};
export const STAGGER = 4;
export const TRANSITION_FRAMES = 20;
