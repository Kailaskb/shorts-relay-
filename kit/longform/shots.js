// Long-form (16:9) shot list, built from the scenes in script.json: no per-video code. See kit/longform/README.md.
import { W, H } from './core/lib.js';
import { L, T, lineWords } from './core/timing.js';
import * as LF from './core/longform.js';

const nm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']+/g, '');

export function buildShots(script) {
  const S = [], CUES = [], lines = script.lines, n = lines.length;
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  for (let i = 0; i < n; i++) {
    if (i > 0 && !lines[i].scene) continue;                       // no scene: the previous one stays on screen
    let j = i + 1; while (j < n && !lines[j].scene) j++;            // this scene covers lines i .. j-1
    const sc = lines[i].scene || { type: 'title', title: lines[i].text };
    const st = i === 0 ? 0 : L(i) - 0.08, end = j < n ? L(j) - 0.08 : T.dur;
    const find = (word) => {
      const w = nm(word);
      for (let k = i; k < j; k++) {
        const ws = lineWords(k), hit = ws.find((x) => nm(x.w) === w) || ws.find((x) => nm(x.w).startsWith(w));
        if (hit) return hit.s - 0.05;
      }
      throw new Error(`line ${i} (${sc.type}): reveal word "${word}" is not spoken in lines ${i}-${j - 1}`);
    };
    const R = { st, end, cue, at: (word, fallback) => (word ? find(word) : fallback),
      even: (k, m) => st + 0.5 + (m <= 1 ? 0 : (k / (m - 1)) * Math.max(0.2, end - st - 1.6)) };
    const shot = LF.make(sc, R);
    S.push({ id: `L${i}-${sc.type}`, at: st, cam: shot.cam || [W / 2, H / 2], zoom: shot.zoom ?? 0.035, punch: 0.035, flash: 0.1,
      note: `${sc.type}: ${String(sc.title || sc.text || sc.label || '').replace(/\*/g, '').slice(0, 44)}`, draw: shot.draw });
    if (i > 0) cue(st, 'whoosh', { gain: 0.4 });
  }
  return { shots: S, cues: CUES };
}
