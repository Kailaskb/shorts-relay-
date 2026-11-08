// Silhouette storytelling kit (The High-ROI Life): Kai as a cinematic silhouette, flat world, gold = the one who still moves.
// Same palette as the brand (graphite / champagne gold / ivory). Pure functions of their arguments.
import { ctx, W, H, TAU, lerp, clamp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';

export const P = { ivory: '#F4EFE4', gold: '#D9B76A', goldDk: '#B8985A', gr: '#17171B', gr2: '#202026', gr3: '#2A2A31', ink: '#1A1A1E', mute: '#8E8A80', red: '#D62839' };
const h2 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a, b, t) => { const A = h2(a), B = h2(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
export const GY = 1120; // ground line (feet)

/** text without outline, centred */
export function txt(text, x, y, size, fill = P.ivory, align = 'center', a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.font = `900 ${size}px Inter`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = fill; ctx.fillText(text, x, y); ctx.restore();
}

/** the street. k = 0 (rainy dusk, ivory) .. 1 (time stopped, graphite). px = parallax shift. */
export function world(k, px = 0) {
  ctx.fillStyle = mix(P.ivory, P.gr, k); ctx.fillRect(-400, -400, W + 800, H + 800);
  ctx.fillStyle = mix('#EBDDB7', '#1C1C21', k); ctx.fillRect(-400, GY - 560, W + 800, 560);
  for (let i = -3; i < 14; i++) { // far skyline
    const w = 100 + rnd(i) * 60, hh = 300 + rnd(i + 5) * 330;
    ctx.fillStyle = mix('#D9CFB8', '#202026', k); ctx.fillRect(i * 120 + px * 0.25, GY - hh, w, hh);
  }
  for (let i = -2; i < 9; i++) { // near blocks
    const w = 130 + rnd(i + 20) * 50, hh = 160 + rnd(i + 30) * 260;
    ctx.fillStyle = mix('#C2B8A1', '#26262C', k); ctx.fillRect(i * 190 + px * 0.6, GY - hh, w, hh);
    if (k > 0.5) for (let j = 0; j < 3; j++) { if (rnd(i * 7 + j) > 0.45) { ctx.fillStyle = '#4A4538'; ctx.fillRect(i * 190 + px * 0.6 + 22 + j * 36, GY - hh + 36 + rnd(i + j) * 80, 18, 24); } }
  }
  ctx.fillStyle = mix('#2A2A31', '#121215', k); ctx.fillRect(-400, GY, W + 800, 1000);
  ctx.fillStyle = mix('#3E3E46', '#26262C', k); ctx.fillRect(-400, GY, W + 800, 10);
  for (let i = -1; i < 8; i++) { ctx.fillStyle = mix('#8E8A80', '#3A3A42', k); ctx.fillRect(i * 200 + px * 0.9, GY + 190, 110, 12); }
  for (const lx of [90, 960]) { // street lamps
    const x = lx + px * 0.6; line([[x, GY], [x, GY - 520], [x + 70, GY - 540]], mix('#2A2A31', '#3A3A42', k), 14);
    ctx.fillStyle = mix('#2A2A31', P.gold, k); ctx.beginPath(); ctx.roundRect(x + 40, GY - 548, 64, 24, 8); ctx.fill();
  }
}

/** rain; tt = effective time (frozen shots pass a constant) */
export function rain(tt, k) {
  ctx.save(); ctx.globalAlpha = lerp(0.5, 0.85, k);
  for (let i = 0; i < 120; i++) {
    const sp = 1500 + rnd(i + 1) * 600, len = 70 + rnd(i + 4) * 50;
    const x = rnd(i) * 1500 - 200, y = ((rnd(i + 2) * 2300 + sp * tt) % 2300) - 260;
    line([[x, y], [x - len * 0.22, y + len]], mix('#4A4A53', P.ivory, k), 4.5);
  }
  ctx.restore();
}

/** Kai (or anyone) as a silhouette. angles: from straight down, + = forward. Returns hand and head positions in world coords. */
export function sil(o) {
  const { x, y, h = 600, dir = 1, col = P.ink, curl = false, hipH = 0.5, lean = 0, tilt = 0 } = o;
  const col2 = o.col2 || col;
  const arms = o.arms || { L: [0.08, 0.12], R: [0.08, 0.12] };
  const legs = o.legs || [0, 0], knee = o.knee || [0, 0];
  const T = h * 0.25, S = h * 0.25, UA = h * 0.17, FA = h * 0.16;
  const loc = (px, py) => [x + dir * px, y + py];
  const step = (p, a, l) => [p[0] + Math.sin(a) * l, p[1] + Math.cos(a) * l];
  const hip = [0, -h * hipH];
  const sh = [hip[0] + Math.sin(lean) * h * 0.31, hip[1] - Math.cos(lean) * h * 0.31];
  const hd = [sh[0] + Math.sin(lean + tilt) * h * 0.115, sh[1] - Math.cos(lean + tilt) * h * 0.115];
  const lw = h * 0.055, aw = h * 0.045;
  const limb = (pts, c, w) => line(pts.map((p) => loc(p[0], p[1])), c, w);
  const legPts = (i) => { const k0 = step(hip, legs[i], T), a1 = step(k0, legs[i] - knee[i], S); return [hip, k0, a1, [a1[0] + h * 0.055, a1[1]]]; };
  const ik = (to, fa) => { // two-bone reach to a world target
    const lx = (to[0] - x) / dir - sh[0], ly = to[1] - y - sh[1];
    const d = clamp(Math.hypot(lx, ly), 1, UA + FA - 1), base = Math.atan2(lx, ly);
    const A = Math.acos(clamp((UA * UA + d * d - FA * FA) / (2 * UA * d), -1, 1)), B = Math.acos(clamp((FA * FA + d * d - UA * UA) / (2 * FA * d), -1, 1));
    return [base - A, A + B];
  };
  const A = { L: o.reachL ? ik(o.reachL) : arms.L, R: o.reachR ? ik(o.reachR) : arms.R };
  const armPts = (s) => { const e = step(sh, A[s][0], UA), hn = step(e, A[s][0] + A[s][1], FA); return [sh, e, hn]; };
  limb(legPts(0), col2, lw); limb(armPts('L'), col2, aw);
  limb([hip, sh], col, h * 0.11);
  limb(legPts(1), col, lw);
  const hp = loc(hd[0], hd[1]), r = h * 0.065;
  circle(hp[0], hp[1], r, col);
  if (curl) {
    ctx.beginPath(); ctx.moveTo(hp[0] - dir * r * 0.1, hp[1] - r * 0.8);
    ctx.bezierCurveTo(hp[0] - dir * r * 0.5, hp[1] - r * 2.0, hp[0] + dir * r * 0.9, hp[1] - r * 2.3, hp[0] + dir * r * 0.8, hp[1] - r * 1.5);
    ctx.bezierCurveTo(hp[0] + dir * r * 0.7, hp[1] - r * 1.1, hp[0] + dir * r * 0.3, hp[1] - r * 1.3, hp[0] + dir * r * 0.45, hp[1] - r * 1.6);
    ctx.strokeStyle = col; ctx.lineWidth = r * 0.36; ctx.lineCap = 'round'; ctx.stroke();
  }
  limb(armPts('R'), col, aw);
  const hl = armPts('L')[2], hr = armPts('R')[2];
  const L = loc(hl[0], hl[1]), R = loc(hr[0], hr[1]);
  circle(L[0], L[1], h * 0.03, col2); circle(R[0], R[1], h * 0.03, col);
  return { L, R, head: hp, sh: loc(sh[0], sh[1]) };
}

export function walk(ph, amp = 0.5) {
  return { legs: [Math.sin(ph) * amp, -Math.sin(ph) * amp], knee: [Math.max(0, -Math.cos(ph)) * amp * 1.3, Math.max(0, Math.cos(ph)) * amp * 1.3],
    arms: { L: [-Math.sin(ph) * amp * 0.9, 0.3], R: [Math.sin(ph) * amp * 0.9, 0.3] } };
}
export function run(ph) {
  const a = 0.95;
  return { legs: [Math.sin(ph) * a, -Math.sin(ph) * a], knee: [Math.max(0, -Math.cos(ph)) * 1.5 + 0.2, Math.max(0, Math.cos(ph)) * 1.5 + 0.2],
    arms: { L: [-Math.sin(ph) * 1.0, 1.3], R: [Math.sin(ph) * 1.0, 1.3] } };
}

export function bird(x, y, s, flap, col, dir = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = col;
  for (const side of [-1, 1]) {
    const tx = side * 95 * s, ty = lerp(-70, 45, flap) * s;
    ctx.beginPath(); ctx.moveTo(0, -8 * s); ctx.quadraticCurveTo(side * 48 * s, ty * 0.35 - 42 * s, tx, ty);
    ctx.quadraticCurveTo(side * 52 * s, ty * 0.35 - 4 * s, 0, 10 * s); ctx.closePath(); ctx.fill();
  }
  ell(0, 2 * s, 16 * s, 10 * s, col); circle(15 * s, -2 * s, 7 * s, col);
  ctx.beginPath(); ctx.moveTo(21 * s, -4 * s); ctx.lineTo(32 * s, 0); ctx.lineTo(21 * s, 1 * s); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12 * s, 0); ctx.lineTo(-38 * s, -6 * s); ctx.lineTo(-38 * s, 8 * s); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** the pause device: screen with digits, big gold button */
export function device(x, y, s, o = {}) {
  const { press = 0, glow = 0, digits = '10', dcol = P.gold } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-110, -170, 220, 340, 34); ctx.fillStyle = '#2B2B31'; ctx.fill(); ctx.strokeStyle = '#6A675F'; ctx.lineWidth = 6; ctx.stroke();
  rr(-84, -138, 168, 92, 14); ctx.fillStyle = '#0F0F12'; ctx.fill();
  txt(digits, 0, -91, digits.length > 3 ? 46 : 70, dcol);
  const bs = 1 - 0.1 * press;
  circle(0, 58, 68 * bs, P.goldDk); circle(0, 58 - 7 * (1 - press), 61 * bs, P.gold);
  if (glow > 0) { ctx.globalAlpha = glow * 0.6; ctx.beginPath(); ctx.arc(0, 58, 70 + 34 * glow, 0, TAU); ctx.strokeStyle = P.gold; ctx.lineWidth = 10; ctx.stroke(); }
  ctx.restore();
}

/** a hand holding the device with the thumb over the button. off = thumb lift (px at s=1); press 0..1 */
export function handDevice(x, y, s, col, o = {}) {
  const { off = 0, offX = 0, press = 0, glow = 0, digits = '10', dcol } = o;
  rr(x - 150 * s, y + 40 * s, 300 * s, 400 * s, 120 * s); ctx.fillStyle = col; ctx.fill();
  for (let i = 0; i < 3; i++) line([[x - 140 * s, y + (90 + i * 70) * s], [x - 200 * s, y + (70 + i * 70) * s]], col, 62 * s);
  device(x, y, s, { press, glow, digits, dcol });
  line([[x + 300 * s, y + 480 * s], [x + (20 + offX) * s, y + (95 - off) * s]], col, 118 * s);
}

/** time-stop shock ring; p 0..1 */
export function shockRing(x, y, p, col = P.gold, maxR = 1500) {
  if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalAlpha = (1 - p) * 0.9; ctx.beginPath(); ctx.arc(x, y, lerp(40, maxR, eo(p)), 0, TAU);
  ctx.strokeStyle = col; ctx.lineWidth = lerp(28, 6, p); ctx.stroke(); ctx.restore();
}

export function glass(x, y, s, rot, col = P.ivory) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-45, -65); ctx.lineTo(45, -65); ctx.lineTo(34, 65); ctx.lineTo(-34, 65); ctx.closePath();
  ctx.fillStyle = 'rgba(244,239,228,0.16)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-40, -10); ctx.lineTo(40, -10); ctx.lineTo(34, 65); ctx.lineTo(-34, 65); ctx.closePath(); ctx.fillStyle = 'rgba(244,239,228,0.34)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-45, -65); ctx.lineTo(45, -65); ctx.lineTo(34, 65); ctx.lineTo(-34, 65); ctx.closePath();
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}

export function car(x, y, s, dir, col, win, beam = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  if (beam > 0) { ctx.globalAlpha = 0.22 * beam; ctx.fillStyle = P.gold; ctx.beginPath(); ctx.moveTo(236, -86); ctx.lineTo(980, -230); ctx.lineTo(980, 30); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
  ctx.beginPath(); ctx.moveTo(-230, -40); ctx.lineTo(-230, -100); ctx.quadraticCurveTo(-225, -130, -170, -134); ctx.lineTo(-95, -140); ctx.lineTo(-50, -200);
  ctx.lineTo(90, -200); ctx.lineTo(150, -140); ctx.lineTo(215, -128); ctx.quadraticCurveTo(240, -120, 240, -80); ctx.lineTo(240, -40); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-35, -190); ctx.lineTo(80, -190); ctx.lineTo(125, -143); ctx.lineTo(-70, -143); ctx.closePath(); ctx.fillStyle = win; ctx.fill();
  circle(-140, -32, 48, '#0F0F12'); circle(-140, -32, 20, '#6A675F'); circle(140, -32, 48, '#0F0F12'); circle(140, -32, 20, '#6A675F');
  circle(232, -84, 11, P.gold);
  ctx.restore();
}

export function umbrella(x, y, s, col) { // x,y = top of the handle
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, -10, 120, Math.PI, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  line([[0, -10], [0, 140]], col, 9); ctx.restore();
}

export function heartShape(x, y, s, col) {
  ctx.beginPath(); ctx.moveTo(x, y + 34 * s); ctx.bezierCurveTo(x - 70 * s, y - 6 * s, x - 42 * s, y - 60 * s, x, y - 24 * s);
  ctx.bezierCurveTo(x + 42 * s, y - 60 * s, x + 70 * s, y - 6 * s, x, y + 34 * s); ctx.fillStyle = col; ctx.fill();
}
export function speech(x, y, w, h, tx, ty, col = P.ivory) { // bubble centred at x,y with a tail pointing to tx,ty
  rr(x - w / 2, y - h / 2, w, h, h / 2.4); ctx.fillStyle = col; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 30, y + h / 2 - 6); ctx.lineTo(tx, ty); ctx.lineTo(x + 20, y + h / 2 - 6); ctx.closePath(); ctx.fill();
}
export function waves(x, y, dir, r0, n, col, a = 1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = 14;
  for (let i = 0; i < n; i++) { ctx.globalAlpha = a * (1 - i * 0.18); ctx.beginPath(); ctx.arc(x, y, r0 + i * 58, dir > 0 ? -0.62 : Math.PI - 0.62, dir > 0 ? 0.62 : Math.PI + 0.62); ctx.stroke(); }
  ctx.restore();
}

export function clockFace(x, y, r, ang, ring, hand) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = P.gr2; ctx.fill(); ctx.strokeStyle = ring; ctx.lineWidth = 16; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[x + Math.sin(a) * r * 0.82, y - Math.cos(a) * r * 0.82], [x + Math.sin(a) * r * 0.94, y - Math.cos(a) * r * 0.94]], ring, 8); }
  line([[x, y], [x + Math.sin(ang) * r * 0.72, y - Math.cos(ang) * r * 0.72]], hand, 12);
  circle(x, y, 14, hand);
}

/** small label pill: dark pill, coloured text */
export function tagPill(text, x, y, size, fg = P.gold, bg = P.gr, a = 1, sc = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + size * 0.9, h = size * 1.5;
  rr(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = fg; ctx.lineWidth = 4; ctx.stroke();
  txt(text, 0, 2, size, fg); ctx.restore();
}
