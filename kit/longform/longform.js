// Long-form (16:9, 1920x1080) scene library for The High-ROI Life.
// Scenes are data: a script.json line may carry "scene": { "type": ..., ... }. A line without "scene" keeps the
// previous scene on screen (no cut). Reveal words ("at") are looked up in the scene's own lines (exact word first,
// then prefix); a word that is not spoken there fails `capture.mjs check`, so timing cannot silently drift.
// Brand: graphite background, ivory text, champagne-gold accents, red only for danger. No gradients, no borders.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rr, line as poly, fillAll } from './lib.js';
import * as K from './kit.js';

export const GOLD = C.yellow, IVORY = '#F4EFE4', MUTED = '#9C968A', PANEL = '#232329', BG = '#17171B', RED = C.red;
const M = 140;                                                   // outer margin
const rev = (t, at, dur = 0.45) => eo(seg(t, at, at + dur));     // reveal progress 0..1
const num = (v, o = {}) => (o.prefix || '') + Number(v).toLocaleString(o.locale || 'en-US', { minimumFractionDigits: o.decimals || 0, maximumFractionDigits: o.decimals || 0 }) + (o.suffix || '');

export function bg(t) {
  fillAll(BG);
  ctx.save(); ctx.strokeStyle = GOLD; ctx.globalAlpha = 0.045; ctx.lineWidth = 2;
  const off = (t * 6) % 120;
  for (let x = -120; x <= W + 120; x += 120) { ctx.beginPath(); ctx.moveTo(x + off, -300); ctx.lineTo(x + off, H + 300); ctx.stroke(); }
  for (let y = 0; y <= H; y += 120) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  ctx.restore();
}

// ---------- text: *word* turns gold ----------
function layout(str, size, maxW) {
  ctx.font = `900 ${size}px Inter`; ctx.letterSpacing = '0px';
  const sp = size * 0.28, lines = [[]], widths = [0];
  for (const raw of String(str).split(/\s+/).filter(Boolean)) {
    const tk = { t: raw.replace(/\*/g, ''), gold: raw.startsWith('*') }, w = ctx.measureText(tk.t).width;
    if (lines[lines.length - 1].length && widths[widths.length - 1] + sp + w > maxW) { lines.push([]); widths.push(0); }
    const k = lines.length - 1; widths[k] += (lines[k].length ? sp : 0) + w; lines[k].push({ ...tk, w });
  }
  return { lines, widths, sp };
}
/** rich text. (x, y) = first baseline; align 'left' | 'center' | 'right'. Returns the block height. */
export function rich(str, x, y, size, { align = 'left', maxW = W - 2 * M, color = IVORY, lh = 1.12, alpha = 1 } = {}) {
  const Lo = layout(str, size, maxW);
  if (alpha > 0) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    Lo.lines.forEach((ln, k) => {
      let cx = align === 'center' ? x - Lo.widths[k] / 2 : align === 'right' ? x - Lo.widths[k] : x;
      for (const w of ln) { ctx.fillStyle = w.gold ? GOLD : color; ctx.fillText(w.t, cx, y + k * size * lh); cx += w.w + Lo.sp; }
    });
    ctx.restore();
  }
  return Lo.lines.length * size * lh;
}
export const richHeight = (str, size, maxW = W - 2 * M, lh = 1.12) => layout(str, size, maxW).lines.length * size * lh;

export function kicker(text, a = 1, x = M, y = 117) {
  if (!text || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; rr(x, y - 4, 46, 8, 4); ctx.fillStyle = GOLD; ctx.fill();
  ctx.font = '900 30px Inter'; ctx.letterSpacing = '6px'; ctx.fillStyle = GOLD; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText(String(text).toUpperCase(), x + 66, y + 1); ctx.letterSpacing = '0px'; ctx.restore();
}
/** draw fn faded in and lifted by p (0..1) */
function up(p, fn, dy = 34) { if (p <= 0) return; ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, (1 - p) * dy); fn(); ctx.restore(); }

// kit components usable in a "kit" scene: (x, y, s, t, scene) -> draws
const KIT = {
  brain: (x, y, s, t, o) => K.brain(x, y, s, o.sleepy || 0),
  liver: (x, y, s) => K.liver(x, y, s),
  cup: (x, y, s, t) => K.cup(x, y, s, t),
  latte: (x, y, s) => K.latte(x, y, s),
  moon: (x, y, s) => K.moon(x, y, s),
  bolt: (x, y, s) => K.bolt(x, y, s),
  dna: (x, y, s, t) => K.dna(x, y, 760 * s, t),
  heart: (x, y, s, t) => K.heart(x, y, s, Math.max(0, Math.sin(t * 6))),
  stopwatch: (x, y, s, t) => K.stopwatch(x, y, s, t * 2.2),
  calendar: (x, y, s, t, o) => K.calendar(x, y, s, o.big || '7', o.small || 'DAYS'),
  stomach: (x, y, s) => K.stomach(x, y, s),
  man: (x, y, s, t, o) => K.man({ x, y, s, ...(o.pose || {}) }),
};

const SCENES = {
  // big centred title (+ optional sub). { title, sub, subAt, kicker, size }
  title(o, R) {
    const subAt = R.at(o.subAt, R.st + 0.9), size = o.size || 112;
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker, rev(t, R.st, 0.5));
      const h = richHeight(o.title, size, 1500), y0 = H / 2 - h / 2 + size * 0.78 - (o.sub ? 60 : 0), last = y0 + h - size * 1.12;
      up(rev(t, R.st + 0.05, 0.6), () => rich(o.title, W / 2, y0, size, { align: 'center', maxW: 1500 }));
      const bw = 220 * eo(seg(t, R.st + 0.35, R.st + 0.9)); if (bw > 1) { rr(W / 2 - bw / 2, last + 62, bw, 10, 5); ctx.fillStyle = GOLD; ctx.fill(); }
      if (o.sub) up(rev(t, subAt), () => rich(o.sub, W / 2, last + 156, 46, { align: 'center', maxW: 1300, color: MUTED }));
    } };
  },
  // chapter card. { n, title } -> also becomes a YouTube chapter timestamp
  chapter(o, R) {
    return { draw(lt, d, t) {
      bg(t);
      up(rev(t, R.st, 0.55), () => { ctx.font = '900 300px Inter'; ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(String(o.n).padStart(2, '0'), M, 650); }, 60);
      up(rev(t, R.st + 0.25, 0.55), () => { kicker('Chapter', 1, 620, 430); rich(o.title, 620, 580, 92, { maxW: 1160 }); });
    } };
  },
  // big number that counts up. { value, from, prefix, suffix, decimals, label, note, at, danger, count, kicker }
  stat(o, R) {
    const at = R.at(o.at, R.st + 0.4), labelT = Math.min(at + 0.3, R.st + 0.05); R.cue(at, 'pop');
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      const p = seg(t, at, at + (o.count === false ? 0.01 : 1.1));
      const val = typeof o.value === 'number' ? num(lerp(o.from || 0, o.value, eo(p)), o) : String(o.value);
      up(rev(t, at, 0.4), () => { ctx.font = `900 ${o.size || 240}px Inter`; ctx.fillStyle = o.danger ? RED : GOLD; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(val, W / 2, 560); });
      if (o.label) up(rev(t, labelT), () => rich(o.label, W / 2, 700, 56, { align: 'center', maxW: 1400 }));
      if (o.note) up(rev(t, at + 0.6), () => rich(o.note, W / 2, H - 110, 30, { align: 'center', color: MUTED, maxW: 1500 }));
    } };
  },
  // numbered points revealed on words. { title, items: ["text" | {text, at}], kicker }  (keep items under ~8 words)
  list(o, R) {
    const items = (o.items || []).map((it) => (typeof it === 'string' ? { text: it } : { ...it })), n = items.length;
    items.forEach((it, k) => { it.t = R.at(it.at, R.even(k, n)); R.cue(it.t, 'pop', { gain: 0.5 }); });
    const top = o.title ? 420 : 320, gap = Math.min(150, (H - top - 100) / Math.max(1, n));
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      if (o.title) up(rev(t, R.st, 0.5), () => rich(o.title, M, 270, 72));
      items.forEach((it, k) => {
        const p = rev(t, it.t, 0.4), y = top + k * gap, g = rev(t, R.st, 0.4);
        ctx.save(); ctx.globalAlpha *= Math.max(0.22 * g, p); ctx.font = '900 54px Inter'; ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.fillText(String(k + 1).padStart(2, '0'), M, y); ctx.restore(); if (p <= 0) return;
        ctx.save(); ctx.globalAlpha *= p; ctx.translate((1 - p) * -40, 0); rich(it.text, M + 130, y, 54, { maxW: W - 2 * M - 130 }); ctx.restore();
      });
    } };
  },
  // horizontal bars. { title, items: [{label, value, at, danger}], max, prefix, suffix, decimals, kicker }
  bars(o, R) {
    const items = o.items.map((it) => ({ ...it })), n = items.length, max = o.max || Math.max(...items.map((i) => i.value));
    items.forEach((it, k) => { it.t = R.at(it.at, R.even(k, n)); R.cue(it.t, 'pop', { gain: 0.5 }); });
    const top = o.title ? 400 : 320, bh = 72, gap = Math.min(160, (H - top - 120) / n), x0 = M + 520, x1 = W - M - 260;
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      if (o.title) up(rev(t, R.st, 0.5), () => rich(o.title, M, 270, 68));
      items.forEach((it, k) => {
        const y = top + k * gap, a = rev(t, it.t, 0.35), g0 = rev(t, R.st, 0.4);
        ctx.save(); ctx.globalAlpha *= g0; rr(x0, y, x1 - x0, bh, 16); ctx.fillStyle = PANEL; ctx.fill();
        rich(it.label, x0 - 40, y + bh * 0.68, 46, { align: 'right', maxW: 470, alpha: Math.max(0.3, a) }); ctx.restore();
        const g = eio(seg(t, it.t, it.t + 0.9)), w = (x1 - x0) * clamp(it.value / max) * g; if (w < 4) return;
        rr(x0, y, w, bh, Math.min(16, w / 2)); ctx.fillStyle = it.danger ? RED : GOLD; ctx.fill();
        ctx.save(); ctx.globalAlpha *= a; ctx.font = '900 46px Inter'; ctx.fillStyle = IVORY; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(num(it.value * g, o), x0 + w + 26, y + bh / 2 + 2); ctx.restore();
      });
    } };
  },
  // line chart drawn on a word. { title, points: [numbers], labels: [x labels], at, endAt, endLabel, kicker }
  line(o, R) {
    const at = R.at(o.at, R.st + 0.4), endAt = R.at(o.endAt, at + 1.7);
    R.cue(at, 'slide', { dur: 1.4, gain: 0.5 }); if (o.endLabel) R.cue(endAt, 'pop');
    const P = o.points, n = P.length, lo = Math.min(0, ...P), hi = Math.max(...P);
    const X0 = M + 60, X1 = W - M - 300, Y0 = 880, Y1 = 380;
    const pts = P.map((v, k) => [lerp(X0, X1, n === 1 ? 0 : k / (n - 1)), lerp(Y0, Y1, (v - lo) / ((hi - lo) || 1))]);
    const cum = [0]; for (let k = 1; k < n; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      if (o.title) up(rev(t, R.st, 0.5), () => rich(o.title, M, 270, 64));
      poly([[X0, Y0 + 8], [X1 + 60, Y0 + 8]], MUTED, 4);
      (o.labels || []).forEach((lb, k) => { if (k < n) rich(String(lb), pts[k][0], Y0 + 72, 32, { align: 'center', color: MUTED }); });
      const p = eio(seg(t, at, at + 1.6)), Ld = cum[n - 1] * p; if (p <= 0) return;
      const vis = [pts[0]];
      for (let k = 1; k < n; k++) { if (cum[k] <= Ld) vis.push(pts[k]); else { const f = (Ld - cum[k - 1]) / ((cum[k] - cum[k - 1]) || 1); vis.push([lerp(pts[k - 1][0], pts[k][0], f), lerp(pts[k - 1][1], pts[k][1], f)]); break; } }
      ctx.save(); ctx.beginPath(); ctx.moveTo(vis[0][0], Y0); vis.forEach((q) => ctx.lineTo(q[0], q[1])); ctx.lineTo(vis[vis.length - 1][0], Y0); ctx.closePath();
      ctx.fillStyle = GOLD; ctx.globalAlpha *= 0.09; ctx.fill(); ctx.restore();
      poly(vis, GOLD, 10);
      const e = vis[vis.length - 1]; rr(e[0] - 11, e[1] - 11, 22, 22, 6); ctx.fillStyle = IVORY; ctx.fill();
      if (o.endLabel) K.pill(o.endLabel, pts[n - 1][0], pts[n - 1][1] - 80, 44, GOLD, BG, eob(seg(t, endAt, endAt + 0.35)));
    } };
  },
  // two columns. { left: {title, points, danger}, right: {...}, at (right appears), kicker }
  compare(o, R) {
    const at = R.at(o.at, R.st + 1.2); R.cue(at, 'pop');
    const col = (c, x, a, accent) => {
      if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 30);
      rr(x, 250, 760, 640, 32); ctx.fillStyle = PANEL; ctx.fill();
      rich(c.title, x + 60, 360, 64, { color: accent, maxW: 640 });
      (c.points || []).forEach((pt, k) => { rr(x + 60, 446 + k * 130, 18, 18, 4); ctx.fillStyle = accent; ctx.fill(); rich(pt, x + 100, 468 + k * 130, 42, { maxW: 600 }); });
      ctx.restore();
    };
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      col(o.left, M, rev(t, R.st + 0.1, 0.5), o.left.danger ? RED : IVORY);
      col(o.right, W - M - 760, rev(t, at, 0.5), o.right.danger ? RED : GOLD);
      const v = rev(t, at, 0.3); if (v > 0) rich('VS', W / 2, 590, 44, { align: 'center', color: MUTED, alpha: v });
    } };
  },
  // one big line. { text, by, size, kicker }
  quote(o, R) {
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      const size = o.size || 92, h = richHeight(o.text, size, 1500), y0 = H / 2 - h / 2 + size * 0.78;
      up(rev(t, R.st + 0.05, 0.6), () => rich(o.text, W / 2, y0, size, { align: 'center', maxW: 1500 }));
      if (o.by) up(rev(t, R.st + 0.6), () => rich(o.by, W / 2, y0 + h + 20, 34, { align: 'center', color: MUTED }));
    } };
  },
  // numbered steps left to right (2-5). { title, items: ["text" | {text, at}], kicker }
  steps(o, R) {
    const items = o.items.map((it) => (typeof it === 'string' ? { text: it } : { ...it })), n = items.length;
    items.forEach((it, k) => { it.t = R.at(it.at, R.even(k, n)); R.cue(it.t, 'pop', { gain: 0.5 }); });
    const gx = 70, cw = (W - 2 * M - gx * (n - 1)) / n, ch = 380, y = 380;
    return { draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      if (o.title) up(rev(t, R.st, 0.5), () => rich(o.title, M, 270, 64));
      items.forEach((it, k) => {
        const p = rev(t, it.t, 0.4), x = M + k * (cw + gx), g = rev(t, R.st, 0.4);
        ctx.save(); ctx.globalAlpha *= Math.max(0.45 * g, p); rr(x, y, cw, ch, 28); ctx.fillStyle = PANEL; ctx.fill(); ctx.restore(); if (p <= 0) return;
        ctx.save(); ctx.globalAlpha *= p; ctx.translate(0, (1 - p) * 30);
        ctx.font = '900 88px Inter'; ctx.fillStyle = GOLD; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(String(k + 1), x + 44, y + 126);
        rich(it.text, x + 44, y + 210, 42, { maxW: cw - 88 });
        if (k < n - 1) rich('→', x + cw + gx / 2, y + ch / 2 + 16, 48, { align: 'center', color: GOLD });
        ctx.restore();
      });
    } };
  },
  // a kit component with labels, optional text on the right. { draw, x, y, s, labels: [{text, x, y, tx, ty, at, gold}], text, textAt, kicker, ...component args }
  kit(o, R) {
    const labels = (o.labels || []).map((l) => ({ ...l }));
    labels.forEach((l, k) => { l.t = R.at(l.at, R.even(k, labels.length)); R.cue(l.t, 'pop', { gain: 0.5 }); });
    const textAt = R.at(o.textAt, R.st + 0.5), x = o.x ?? (o.text ? 560 : W / 2), y = o.y ?? 580, s = o.s ?? 1;
    return { cam: [x, y], draw(lt, d, t) {
      bg(t); kicker(o.kicker);
      up(rev(t, R.st, 0.5), () => (KIT[o.draw] || KIT.bolt)(x, y, s, t, o), 30);
      labels.forEach((l) => {
        const sc = eob(seg(t, l.t, l.t + 0.35)); if (sc <= 0) return;
        ctx.save(); ctx.globalAlpha *= clamp(sc); poly([[l.x, l.y], [l.tx ?? x, l.ty ?? y]], MUTED, 6); ctx.restore();
        K.pill(l.text, l.x, l.y, 40, l.gold ? GOLD : PANEL, l.gold ? BG : IVORY, sc);
      });
      if (o.text) up(rev(t, textAt), () => rich(o.text, 1060, 520, 72, { maxW: 720 }));
    } };
  },
  // end screen: text on the left, the right side left free for YouTube end-screen elements. { title, sub, kicker }
  end(o, R) {
    return { zoom: 0.02, draw(lt, d, t) {
      bg(t); kicker(o.kicker || 'Up next', rev(t, R.st, 0.5));
      up(rev(t, R.st + 0.1, 0.6), () => rich(o.title, M, 330, 84, { maxW: 760 }));
      if (o.sub) up(rev(t, R.st + 0.5), () => rich(o.sub, M, 330 + richHeight(o.title, 84, 760) + 40, 40, { color: MUTED, maxW: 760 }));
    } };
  },
};

export const SCENE_TYPES = Object.keys(SCENES);
export function make(o, R) {
  const f = SCENES[o.type];
  if (!f) throw new Error(`unknown scene type "${o.type}" (have: ${SCENE_TYPES.join(', ')})`);
  return f(o, R);
}
