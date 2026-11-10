// Full production render, resumable (finished chunks are skipped).
//   npm run render                 → YouTube 4K H.264 + thumbnail + Short + SRT
//   npm run render -- --master     → also the ProRes 4444 master (needs >100 GB free)
//   npm run render -- --hd         → 1080p preview instead of 4K (fast)
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const args = process.argv.slice(2);
const HD = args.includes('--hd');
const MASTER = args.includes('--master');
const CHUNK = 3000; // frames per chunk (50 s of video)
const timeline = JSON.parse(fs.readFileSync('src/data/timeline.json', 'utf8'));
const total = timeline.durationInFrames;
const chrome = process.env.REMOTION_CHROME ? [`--browser-executable=${process.env.REMOTION_CHROME}`] : [];
const scale = HD ? '1' : '2';
const remotion = (...a) => execFileSync('npx', ['remotion', ...a, ...chrome, '--log=error'], {stdio: 'inherit'});
const log = (m) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${m}`);

fs.mkdirSync('out/parts', {recursive: true});

// 1 · YouTube upload: H.264, crf 12, x264 slow, yuv420p, AAC 320 kbps 48 kHz
const name = HD ? 'video_final_1080p.mp4' : 'video_final_4k.mp4';
const parts = [];
for (let a = 0, i = 0; a < total; a += CHUNK, i++) {
  const b = Math.min(total, a + CHUNK) - 1;
  const file = `out/parts/${HD ? 'hd' : '4k'}-${String(i).padStart(3, '0')}.mp4`;
  parts.push(file);
  if (fs.existsSync(file)) continue;
  log(`chunk ${i} · frames ${a}-${b} of ${total}`);
  remotion('render', 'Video', file + '.tmp.mp4', `--frames=${a}-${b}`, `--scale=${scale}`, '--codec=h264', '--crf=12', '--x264-preset=slow',
    '--pixel-format=yuv420p', '--audio-codec=aac', '--audio-bitrate=320k', '--enforce-audio-track', '--image-format=png');
  fs.renameSync(file + '.tmp.mp4', file);
}
fs.writeFileSync('out/parts/list.txt', parts.map((p) => `file '${p.replace('out/parts/', '')}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'out/parts/list.txt', '-c', 'copy', '-movflags', '+faststart', `out/${name}`], {stdio: 'inherit'});
log(`✓ out/${name}`);

// 2 · ProRes 4444 master (optional — huge)
if (MASTER) {
  remotion('render', 'Video', 'out/master_prores.mov', '--scale=2', '--codec=prores', '--prores-profile=4444', '--audio-codec=pcm-16', '--image-format=png');
  log('✓ out/master_prores.mov');
}

// 3 · Extras
remotion('still', 'Miniatura', 'out/miniatura.png', '--scale=1');
remotion('still', 'Miniatura', 'out/miniatura_2560.png', '--scale=2');
remotion('render', 'Short', 'out/short_1.mp4', `--scale=${scale}`, '--codec=h264', '--crf=12', '--x264-preset=slow', '--pixel-format=yuv420p',
  '--audio-codec=aac', '--audio-bitrate=320k', '--enforce-audio-track', '--image-format=png');
execFileSync('node', ['scripts/export-srt.mjs'], {stdio: 'inherit'});

// 4 · Checks
const probe = (f) => execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate', '-of', 'compact', f]).toString().trim();
for (const f of [`out/${name}`, 'out/short_1.mp4']) log(`${f}\n${probe(f)}`);
log(`expected duration: ${(total / timeline.fps).toFixed(2)} s`);
