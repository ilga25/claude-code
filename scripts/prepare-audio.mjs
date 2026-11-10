// Copies audio into public/: voz normalized to -14 LUFS integrated, music and sfx as-is.
import fs from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';

fs.mkdirSync('public/sfx', {recursive: true});
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], {stdio: 'inherit'});

if (fs.existsSync('voz.mp3')) {
  // Two-pass loudnorm for an accurate -14 LUFS.
  const probe = spawnSync('ffmpeg', ['-hide_banner', '-i', 'voz.mp3', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
  const m = JSON.parse(String(probe.stderr).match(/\{[\s\S]*\}/)?.[0] ?? 'null');
  const af = m
    ? `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`
    : 'loudnorm=I=-14:TP=-1.5:LRA=11';
  ff('-i', 'voz.mp3', '-af', af, '-ar', '48000', '-ac', '2', 'public/voz.wav');
  console.log('✓ public/voz.wav (-14 LUFS)');
} else console.log('· voz.mp3 no encontrado (el vídeo se renderiza sin voz)');

if (fs.existsSync('musica.mp3')) {
  fs.copyFileSync('musica.mp3', 'public/musica.mp3');
  console.log('✓ public/musica.mp3');
}
if (fs.existsSync('sfx')) {
  for (const f of fs.readdirSync('sfx')) fs.copyFileSync(`sfx/${f}`, `public/sfx/${f}`);
  console.log('✓ sfx/ → public/sfx/ (se usan whoosh.*, pop.*, click.*)');
}
