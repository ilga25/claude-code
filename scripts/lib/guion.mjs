// Parses guion.md into scenes → VOZ lines → words.
import fs from 'node:fs';

export const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/(\d)[.,](\d)/g, '$1$2')
    .replace(/[^a-z0-9%$]+/g, ' ')
    .trim();

export function parseGuion(path = 'guion.md') {
  const md = fs.readFileSync(path, 'utf8');
  const scenes = [];
  for (const block of md.split(/^## /m).slice(1)) {
    const [header, ...rest] = block.split('\n');
    const m = header.match(/ESCENA (\d+) · (.+?) \[/);
    if (!m) continue;
    const lines = rest
      .filter((l) => l.startsWith('**VOZ:**'))
      .map((l) => l.replace('**VOZ:**', '').trim().replace(/(\d) %/g, '$1\u00A0%'));
    const visual = (rest.find((l) => l.startsWith('*VISUAL:*')) || '').replace('*VISUAL:*', '').trim();
    scenes.push({escena: Number(m[1]), title: m[2].trim(), lines, visual});
  }
  return scenes;
}

// Rough Spanish syllable estimate, numbers expanded to their spoken length.
export function syllables(word) {
  const n = normalize(word);
  let s = 0;
  for (const tok of n.split(' ').filter(Boolean)) {
    if (/^\d+$/.test(tok)) s += Math.max(2, tok.replace(/0+$/, '').length * 2 + 1);
    else if (tok === '%') s += 3;
    else s += Math.max(1, (tok.match(/[aeiouy]+/g) || []).length);
  }
  if (word.includes('%')) s += 3;
  return Math.max(1, s);
}
