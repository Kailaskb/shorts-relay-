// ═════════════════════════ BRAND EXTRAS ═════════════════════════
const GOLD = C.yellow;   // champagne gold in this project
/** coffee mug. t drives the steam */
export function cup(x, y, s, t = 0, body = '#2B2B31') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(98, 6, 46, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = body; ctx.lineWidth = 26; ctx.stroke();
  rr(-100, -90, 200, 190, [8, 8, 64, 64]); ctx.fillStyle = body; ctx.fill();
  rr(-62, -46, 18, 110, 9); ctx.fillStyle = GOLD; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
  ell(0, -90, 100, 22, '#3A3A42'); ell(0, -88, 84, 15, '#5A3F2B');
  for (const k of [-1, 0, 1]) {
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const u = i / 20, px = k * 44 + Math.sin(u * 6 + t * 3 + k) * 14, py = -130 - u * 100; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.strokeStyle = '#A59D8E'; ctx.globalAlpha = 0.6; ctx.lineWidth = 9; ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.restore();
}
/** the viewer's comment as a social card (name blurred) */
export function commentCard(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-422, -216, 860, 430, 38); ctx.fillStyle = C.ink; ctx.globalAlpha = a * 0.16; ctx.fill(); ctx.globalAlpha = a;
  rr(-430, -230, 860, 430, 38); ctx.fillStyle = C.white; ctx.fill();
  rr(-390, -190, 84, 84, 24); ctx.fillStyle = '#CFC6B2'; ctx.fill();
  rr(-280, -178, 240, 30, 15); ctx.fillStyle = '#DDD5C3'; ctx.fill();
  rr(-280, -132, 120, 22, 11); ctx.fill();
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '900 42px Inter';
  ctx.fillText('This is false information.', -390, -30);
  ctx.fillText('Coffee always makes me tired.', -390, 40);
  ctx.fillStyle = '#80808A'; ctx.fillText('And I rarely drink it.', -390, 110);
  ctx.restore();
}
/** a rubber-stamp label (rotated rounded box + bold text). s animates the slam */
export function stamp(text, x, y, s, rot, bg, fg, size = 96) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.font = `900 ${size}px Inter`; ctx.letterSpacing = '4px';
  const w = ctx.measureText(text).width + size * 0.9, h = size * 1.5;
  rr(-w / 2 + 8, -h / 2 + 10, w, h, 22); ctx.fillStyle = C.ink; ctx.globalAlpha = 0.28; ctx.fill(); ctx.globalAlpha = 1;
  rr(-w / 2, -h / 2, w, h, 22); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.04);
  ctx.letterSpacing = '0px'; ctx.restore();
}
/** lightning bolt (energy) */
export function bolt(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(30, -150); ctx.lineTo(-70, 20); ctx.lineTo(-5, 20); ctx.lineTo(-30, 150); ctx.lineTo(75, -35); ctx.lineTo(5, -35); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = GOLD; ctx.fill();
  ctx.restore();
}
/** flat brain. sleepy 0..1 closes the eyes and yawns */
export function brain(x, y, s, sleepy = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const blob = () => { ctx.beginPath(); for (let a = 0; a <= TAU + 0.05; a += 0.05) { const r = 1 + 0.05 * Math.sin(6 * a + 0.5) + 0.035 * Math.sin(11 * a); const px = Math.cos(a) * 300 * r, py = Math.sin(a) * 230 * r; a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.closePath(); };
  blob(); ctx.fillStyle = C.pinkDark; ctx.fill();
  ctx.save(); ctx.translate(-4, -6); ctx.scale(0.965, 0.965); blob(); ctx.fillStyle = C.pink; ctx.fill(); ctx.restore();
  ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 12;
  for (const f of [[[-220, -90], [-140, -160], [-50, -100]], [[-240, 30], [-160, -30], [-100, 50]], [[60, -120], [140, -70], [200, -150]], [[80, 20], [150, 80], [230, 10]], [[-190, 130], [-110, 90], [-50, 150]], [[90, 130], [160, 170], [210, 120]]]) {
    ctx.beginPath(); ctx.moveTo(f[0][0], f[0][1]); ctx.quadraticCurveTo(f[1][0], f[1][1], f[2][0], f[2][1]); ctx.stroke();
  }
  ell(-100, -140, 110, 34, C.pinkLight, -0.25);
  if (sleepy > 0) {
    ctx.globalAlpha = sleepy; ctx.strokeStyle = C.ink; ctx.lineWidth = 13;
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 90, 20, 36, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    ell(0, 110, 24, 18 + 12 * Math.sin(sleepy * 3), C.mouth); ctx.globalAlpha = 1;
  }
  ctx.restore();
}
/** adenosine = a little pink "z" block */
export function adeno(x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-36, -26, 72, 56, 14); ctx.fillStyle = C.pinkDark; ctx.fill();
  rr(-36, -30, 72, 54, 14); ctx.fillStyle = C.pink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 38px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('z', 0, -2);
  ctx.restore();
}
const SOCK = [150, 345, 540, 735, 930];
/** the receptor wall: caffeine plugs the sockets, adenosine piles up above, then floods through.
 *  o = { t, plug (0..1 plugs dropping in), plugA (alpha), pile (0..1 of 40 pieces), flood (0..1) } */
export function wallScene(o) {
  const wy = 900, N = 40;
  ctx.fillStyle = '#2B2B32'; ctx.fillRect(-300, wy + 70, W + 600, 700);
  if (o.flood > 0) { ctx.fillStyle = C.red; ctx.globalAlpha = 0.3 * clamp(o.flood * 1.5); ctx.fillRect(-300, wy + 70, W + 600, 700); ctx.globalAlpha = 1; }
  for (const [a, b] of [[-300, 90], [210, 285], [405, 480], [600, 675], [795, 870], [990, 1380]]) {
    rr(a, wy, b - a, 70, 14); ctx.fillStyle = '#4A4A53'; ctx.fill();
    rr(a, wy, b - a, 14, 7); ctx.fillStyle = GOLD; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
  }
  const A = o.plugA ?? 1;
  if (o.plug > 0 && A > 0) SOCK.forEach((sx, i) => {
    const p = clamp(o.plug * 1.7 - i * 0.16); if (p <= 0) return;
    const py = lerp(wy - 420, wy + 6, eob(p));
    ctx.save(); ctx.globalAlpha = A; rr(sx - 52, py - 38, 104, 76, 18); ctx.fillStyle = '#B9954F'; ctx.fill();
    rr(sx - 52, py - 40, 104, 70, 18); ctx.fillStyle = GOLD; ctx.fill(); rr(sx - 34, py - 28, 40, 12, 6); ctx.fillStyle = C.white; ctx.globalAlpha = A * 0.5; ctx.fill(); ctx.restore();
  });
  const cnt = Math.floor(o.pile * N);
  for (let i = 0; i < cnt; i++) {
    const row = Math.floor(i / 8), col = i % 8;
    const rx = 105 + col * 125 + (row % 2) * 30, ry = wy - 44 - row * 62 + Math.sin(o.t * 5 + i) * 2;
    const arrive = eo(clamp((o.pile * N - i) / 2.2));
    let x = rx, y = lerp(ry - 600, ry, arrive), rot = (rnd(i) - 0.5) * 0.35;
    if (o.flood > 0) {
      const f = eo(clamp((o.flood - rnd(i) * 0.45) / 0.55));
      x = lerp(rx, SOCK[i % 5] + (rnd(i + 2) - 0.5) * 70, eo(clamp(f * 2)));
      y = lerp(ry, wy + 140 + rnd(i + 1) * 330, f); rot += f * (rnd(i + 4) - 0.5) * 3;
    }
    adeno(x, y, 1, rot);
  }
}
/** flat liver */
export function liver(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  const p = () => { ctx.beginPath(); ctx.moveTo(-300, -40); ctx.bezierCurveTo(-300, -160, -60, -190, 120, -150); ctx.bezierCurveTo(260, -120, 320, -40, 300, 40); ctx.bezierCurveTo(260, 140, 100, 170, -60, 150); ctx.bezierCurveTo(-200, 130, -300, 60, -300, -40); ctx.closePath(); };
  p(); ctx.fillStyle = '#7F2C2E'; ctx.fill(); ctx.save(); ctx.translate(-5, -8); ctx.scale(0.96, 0.96); p(); ctx.fillStyle = '#A33C3A'; ctx.fill(); ctx.restore();
  ell(-110, -90, 120, 30, '#C25A55', -0.2); ctx.strokeStyle = '#7F2C2E'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(60, -120); ctx.quadraticCurveTo(30, -20, 90, 60); ctx.stroke();
  ctx.restore();
}
/** flat crescent moon */
export function moon(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.clip();
  ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.arc(46, -26, 84, 0, TAU); ctx.fillStyle = GOLD; ctx.fill('evenodd');
  ctx.restore();
}
/** latte glass with sugar cubes */
export function latte(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-84, -130, 168, 270, [16, 16, 56, 56]); ctx.fillStyle = '#EFE6D3'; ctx.fill();
  ctx.save(); rr(-84, -130, 168, 270, [16, 16, 56, 56]); ctx.clip();
  ctx.fillStyle = '#E6D2AE'; ctx.fillRect(-90, -40, 180, 60); ctx.fillStyle = '#7A5638'; ctx.fillRect(-90, 20, 180, 130);
  ctx.fillStyle = C.white; ctx.fillRect(-90, -130, 180, 62); ctx.restore();
  rr(-84, -130, 168, 270, [16, 16, 56, 56]); ctx.strokeStyle = '#2B2B31'; ctx.lineWidth = 8; ctx.stroke();
  for (const [cx, cy, r] of [[-30, -150, -0.2], [26, -158, 0.25], [-4, -190, 0.1]]) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(r); rr(-24, -24, 48, 48, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = '#BDB4A2'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
/** rotating DNA helix, h tall, centred on (x, y) */
export function dna(x, y, h, t) {
  const n = 26, A = [];
  for (let i = 0; i <= n; i++) { const yy = y - h / 2 + (i / n) * h, ph = i * 0.55 + t * 2.2; A.push([yy, Math.sin(ph) * 150, Math.cos(ph)]); }
  for (const [yy, dx] of A) line([[x + dx, yy], [x - dx, yy]], '#8B8B93', 9);
  for (const [yy, dx, d] of A) { const sz = 30 + d * 6; rr(x + dx - sz / 2, yy - sz / 2, sz, sz, 10); ctx.fillStyle = GOLD; ctx.fill(); rr(x - dx - sz / 2, yy - sz / 2, sz, sz, 10); ctx.fillStyle = '#2B2B31'; ctx.fill(); }
}
