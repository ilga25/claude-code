// Shared by the burned-in subtitles (Remotion) and scripts/export-srt.mjs.
// Splits the transcript into cues of at most ~2 lines, breaking at punctuation when possible.

const MAX_CHARS = 62;
const MIN_HOLD_MS = 900;

/**
 * @param {{text: string, startMs: number, endMs: number, escena: number}[]} words
 * @returns {{startMs: number, endMs: number, words: typeof words}[]}
 */
export function buildCues(words) {
  const cues = [];
  let cur = [];
  const len = (arr) => arr.reduce((a, w) => a + w.text.length + 1, 0);
  const push = () => {
    if (cur.length) cues.push({startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs, words: cur});
    cur = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = cur[cur.length - 1];
    const gap = prev ? w.startMs - prev.endMs : 0;
    if (prev && (w.escena !== prev.escena || gap > 700 || len(cur) + w.text.length > MAX_CHARS)) {
      // prefer to break after punctuation inside the current cue
      if (len(cur) + w.text.length > MAX_CHARS) {
        let cut = -1;
        for (let k = cur.length - 1; k >= Math.floor(cur.length / 2); k--) if (/[.,;:?!]$/.test(cur[k].text)) { cut = k; break; }
        if (cut >= 0 && cut < cur.length - 1) {
          const rest = cur.slice(cut + 1);
          cur = cur.slice(0, cut + 1);
          push();
          cur = rest;
        } else push();
      } else push();
    }
    cur.push(w);
    if (/[.?!]$/.test(w.text) && len(cur) > MAX_CHARS * 0.55) push();
  }
  push();
  // hold each cue a little, without overlapping the next
  for (let i = 0; i < cues.length; i++) {
    const next = cues[i + 1]?.startMs ?? Infinity;
    cues[i].endMs = Math.min(next - 40, Math.max(cues[i].endMs + 250, cues[i].startMs + MIN_HOLD_MS));
  }
  return cues;
}
