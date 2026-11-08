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

// ═════════════════════════ VOLCANO / WASTE EXTRAS ═════════════════════════
/** volcano cone on a dark background. origin = crater centre. glow 0..1 = lava brightness, t drives the shimmer */
export function volcano(x, y, s, glow = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) {
    const g = ctx.createRadialGradient(0, -20, 20, 0, -20, 460);
    g.addColorStop(0, `rgba(217,183,106,${0.5 * glow})`); g.addColorStop(1, 'rgba(217,183,106,0)');
    ctx.fillStyle = g; ctx.fillRect(-500, -500, 1000, 1000);
  }
  ctx.beginPath(); ctx.moveTo(-135, 0); ctx.lineTo(-540, 660); ctx.lineTo(540, 660); ctx.lineTo(135, 0); ctx.closePath(); ctx.fillStyle = '#34343C'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(135, 0); ctx.lineTo(540, 660); ctx.lineTo(170, 660); ctx.closePath(); ctx.fillStyle = '#2A2A31'; ctx.fill();
  ctx.save(); ctx.globalAlpha = glow;
  line([[-70, 24], [-108, 140], [-84, 270], [-150, 430]], C.yellow, 26);
  line([[70, 24], [104, 170], [74, 300]], C.yellow, 22);
  ctx.restore();
  ell(0, 0, 140, 36, '#26262C');
  ell(0, 2, 122, 25, glow > 0.05 ? C.yellow : '#4A4A53');
  ctx.save(); ctx.globalAlpha = glow;
  ell(Math.sin(t * 2) * 40, -2, 44, 7, '#F2E2B4'); ell(-60 + Math.cos(t * 1.7) * 30, 10, 26, 5, '#F2E2B4');
  ctx.restore();
  ctx.restore();
}
/** knotted trash bag. origin = centre */
export function trashBag(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-30, -70); ctx.bezierCurveTo(-112, -40, -122, 70, -60, 100); ctx.quadraticCurveTo(0, 122, 60, 100); ctx.bezierCurveTo(122, 70, 112, -40, 30, -70); ctx.closePath();
  ctx.fillStyle = '#EDE7D8'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -62); ctx.bezierCurveTo(112, -30, 112, 70, 60, 100); ctx.quadraticCurveTo(92, 20, 40, -62); ctx.fillStyle = '#CFC7B2'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30, -70); ctx.lineTo(-56, -122); ctx.lineTo(-8, -84); ctx.lineTo(8, -84); ctx.lineTo(56, -122); ctx.lineTo(30, -70); ctx.closePath(); ctx.fillStyle = '#EDE7D8'; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.7; ell(-52, 8, 12, 38, '#FFFFFF', 0.2); ctx.restore();
  ctx.restore();
}
/** flame (red outer, gold middle, pale core). origin = bottom centre */
export function flame(x, y, s, t = 0, ph = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const f = (w, h, col, p) => {
    const k = 1 + 0.12 * Math.sin(t * 14 + p + ph);
    ctx.beginPath(); ctx.moveTo(-w, 0); ctx.bezierCurveTo(-w * 1.1, -h * 0.4, -w * 0.2, -h * 0.55, Math.sin(t * 9 + p + ph) * w * 0.35, -h * k);
    ctx.bezierCurveTo(w * 0.3, -h * 0.55, w * 1.1, -h * 0.4, w, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  };
  f(60, 170, C.red, 0); f(42, 125, C.yellow, 1.3); f(22, 80, '#F2E2B4', 2.1);
  ctx.restore();
}
/** radiation trefoil on a gold disc. a = alpha */
export function trefoil(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  circle(0, 0, 150, C.yellow);
  for (let k = 0; k < 3; k++) {
    const an = -Math.PI / 2 + k * TAU / 3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 104, an - Math.PI / 6, an + Math.PI / 6); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  }
  circle(0, 0, 34, C.yellow); circle(0, 0, 22, C.ink);
  ctx.restore();
}
/** steel barrel with a trefoil. origin = centre */
export function barrel(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-90, -130, 180, 270, 26); ctx.fillStyle = '#4A4A53'; ctx.fill();
  rr(-90, -130, 56, 270, 26); ctx.fillStyle = '#5C5C66'; ctx.fill();
  rr(-90, -78, 180, 16, 0); ctx.fillStyle = C.yellow; ctx.fill();
  rr(-90, 70, 180, 16, 0); ctx.fillStyle = C.yellow; ctx.fill();
  ell(0, -130, 90, 22, '#6A6A74');
  trefoil(0, -4, 0.34);
  ctx.restore();
}
/** thermometer. f = 0..1 mercury level. origin = tube centre */
export function thermo(x, y, s, f) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-36, -300, 72, 500, 36); ctx.fillStyle = '#E6DFCF'; ctx.fill();
  circle(0, 230, 70, '#E6DFCF');
  circle(0, 230, 52, C.red);
  rr(-16, 200 - f * 470, 32, f * 470 + 40, 16); ctx.fillStyle = C.red; ctx.fill();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = '#9A937F'; ctx.fillRect(40, -270 + i * 84, i % 2 ? 26 : 44, 8); }
  ctx.restore();
}
/** rising ash cloud. x, y = crater; p 0..1 = how far it has grown */
export function ashPlume(x, y, p, t = 0) {
  for (let i = 0; i < 36; i++) {
    const u = clamp(p * 1.25 - i * 0.017, 0, 1); if (u <= 0) continue;
    const h = eo(u) * 1050, sp = 1 + h / 260;
    const px = x + Math.sin(i * 2.3 + t * 0.8) * 34 * sp + (rnd(i) - 0.5) * 70 * (h / 300);
    circle(px, y - h, 36 + 92 * eo(u) * (0.55 + rnd(i + 5)), i % 3 ? '#4A4A53' : '#5C5C66');
  }
}

// ═════════════ THE CAST (High-ROI Life recurring characters; see kit/CAST.md) ═════════════
// Kai: the everyman who acts out every example (gold hoodie, one hair curl). Bit: his small robot, shows the numbers.
const KAI = { shirt: '#D9B76A', shirtShade: '#BC9A55', hair: '#232328', hairHi: '#3A3A42', pants: '#26262C', pantsShade: '#1D1D22' };
const BIT = { body: '#202026', fin: '#2E2E36', base: '#17171B', visor: '#0E0E11' };
/** Kai. o = man() options (x, y, s, arm, armL, finger, eyes, mouth, brow, smirk, frown, look, xray, holding)
 *  + tired 0..1 (heavy lids + eye bags), rot (whole body rotation around his chest, e.g. -PI/2 lying down) */
export function kai(o) {
  const keep = {}; for (const k in KAI) { keep[k] = C[k]; C[k] = KAI[k]; }
  const s = o.s || 1;
  ctx.save();
  if (o.rot) { ctx.translate(o.x, o.y); ctx.rotate(o.rot); ctx.translate(-o.x, -o.y); }
  man(o);
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s, s);
  if (!o.xray) {
    for (const sd of [-1, 1]) line([[sd * 24, -205], [sd * 28, -122]], C.bg, 9);
    rr(-78, 92, 156, 78, 26); ctx.fillStyle = KAI.shirtShade; ctx.fill();
  }
  ctx.beginPath(); ctx.moveTo(-16, -468); ctx.quadraticCurveTo(-44, -566, 50, -592); ctx.quadraticCurveTo(2, -550, 24, -470); ctx.closePath();
  ctx.fillStyle = KAI.hair; ctx.fill();
  const td = clamp(o.tired || 0), lk = (o.look || 0) * 6;
  if (td > 0 && !o.eyes) {
    ctx.fillStyle = C.skin; for (const sd of [-1, 1]) { rr(sd * 40 - 20 + lk, -364, 40, 4 + 28 * td, 6); ctx.fill(); }
    ctx.globalAlpha = 0.5 * td; ctx.strokeStyle = '#9A7563'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 40 - 16, -321); ctx.quadraticCurveTo(sd * 40, -313, sd * 40 + 16, -321); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  ctx.restore(); ctx.restore();
  for (const k in keep) C[k] = keep[k];
}
/** Bit. o = { x, y, s, t (bob + thrust), face: 'n'|'happy'|'wide'|'sad'|'scan', look -1..1, tilt, screen (text above him), screenA 0..1 } */
export function bit(o) {
  const s = o.s || 1, t = o.t || 0, bob = Math.sin(t * 3.2) * 10, f = o.face || 'n', lk = (o.look || 0) * 10;
  ctx.save(); ctx.translate(o.x, o.y + bob); ctx.rotate(o.tilt || 0); ctx.scale(s, s);
  ctx.globalAlpha = 0.6 + 0.3 * Math.sin(t * 20);
  for (const sx of [-34, 34]) { rr(sx - 8, 82, 16, 30 + 10 * Math.sin(t * 17 + sx), 8); ctx.fillStyle = C.yellow; ctx.fill(); }
  ctx.globalAlpha = 1;
  line([[0, -66], [0, -104]], BIT.body, 9); rr(-13, -126, 26, 26, 8); ctx.fillStyle = C.yellow; ctx.fill();
  for (const sd of [-1, 1]) { rr(sd * 98 - 14, -18, 28, 58, 12); ctx.fillStyle = BIT.fin; ctx.fill(); }
  rr(-88, -70, 176, 146, 48); ctx.fillStyle = BIT.body; ctx.fill();
  rr(-88, 34, 176, 42, [0, 0, 48, 48]); ctx.fillStyle = BIT.base; ctx.fill();
  rr(-64, -46, 128, 58, 28); ctx.fillStyle = BIT.visor; ctx.fill();
  ctx.fillStyle = C.yellow; ctx.strokeStyle = C.yellow; ctx.lineCap = 'round'; ctx.lineWidth = 8;
  if (f === 'happy') for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 26 + lk, -8, 12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
  else if (f === 'wide') for (const sd of [-1, 1]) { rr(sd * 26 - 12 + lk, -36, 24, 38, 11); ctx.fill(); }
  else if (f === 'sad') for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 26 - 12 + lk, -14 - sd * 5); ctx.lineTo(sd * 26 + 12 + lk, -14 + sd * 5); ctx.stroke(); }
  else if (f === 'scan') { const u = (Math.sin(t * 7) + 1) / 2; rr(-50 + u * 76, -24, 24, 16, 8); ctx.fill(); }
  else for (const sd of [-1, 1]) { rr(sd * 26 - 9 + lk, -30, 18, 28, 9); ctx.fill(); }
  ctx.restore();
  const a = o.screenA ?? 1;
  if (o.screen && a > 0) {
    ctx.save(); ctx.translate(o.x, o.y + bob - 200 * s); ctx.scale(s * eob(clamp(a)), s * eob(clamp(a)));
    ctx.font = '900 66px Inter'; const tw = ctx.measureText(o.screen).width;
    rr(-tw / 2 - 34, -54, tw + 68, 108, 26); ctx.fillStyle = BIT.body; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-16, 52); ctx.lineTo(16, 52); ctx.lineTo(0, 76); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.screen, 0, 4);
    ctx.restore();
  }
}
/** the same room at night: graphite walls, a moon in the window */
export function nightRoom() {
  fillAll('#202026');
  ctx.fillStyle = '#17171B'; ctx.fillRect(-300, 1560, W + 600, 700);
  rr(600, 230, 360, 440, 22); ctx.fillStyle = '#2E2E36'; ctx.fill();
  rr(622, 252, 316, 396, 12); ctx.fillStyle = '#121215'; ctx.fill();
  moon(800, 380, 0.8);
  ctx.fillStyle = '#2E2E36'; ctx.fillRect(772, 252, 14, 396); ctx.fillRect(622, 442, 316, 14);
}
/** flat TV on a stand. glow 0..1 flickers the screen */
export function tv(x, y, s, t = 0, glow = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { rr(sd * 120 - 10, 120, 20, 90, 8); ctx.fillStyle = '#2E2E36'; ctx.fill(); }
  rr(-190, -140, 380, 270, 26); ctx.fillStyle = '#0E0E11'; ctx.fill();
  rr(-166, -116, 332, 222, 14); ctx.fillStyle = '#D9D2C3'; ctx.globalAlpha = 0.5 + 0.4 * glow * (0.6 + 0.4 * Math.sin(t * 23)); ctx.fill(); ctx.globalAlpha = 1;
  for (let i = 0; i < 5; i++) { rr(-150, -96 + i * 44 + ((t * 120) % 44), 300, 8, 4); ctx.fillStyle = '#B9B1A1'; ctx.fill(); }
  ctx.restore();
}
/** a brick wall that melts away (melt 0..1) to show a path between gold trees (reveal 0..1) */
export function meltWall(x, y, w, h, melt, reveal, t = 0) {
  ctx.save(); rr(x, y, w, h, 30); ctx.clip();
  ctx.fillStyle = C.sky; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.floor; ctx.fillRect(x, y + h * 0.55, w, h);
  ctx.beginPath(); ctx.moveTo(x + w * 0.44, y + h * 0.55); ctx.lineTo(x + w * 0.56, y + h * 0.55); ctx.lineTo(x + w * 0.8, y + h); ctx.lineTo(x + w * 0.2, y + h); ctx.closePath(); ctx.fillStyle = C.pot; ctx.fill();
  for (let i = 0; i < 8; i++) {
    const sd = i % 2 ? 1 : -1, k = Math.floor(i / 2), u = 1 - k * 0.22, tx = x + w / 2 + sd * (w * 0.16 + k * w * 0.1) * (1.6 - u), ty = y + h * 0.55 + (1 - u) * -10 + u * h * 0.25;
    const g = clamp(reveal * 1.6 - k * 0.2), th = 210 * u * g;
    if (g <= 0) continue;
    rr(tx - 9 * u, ty - 20, 18 * u, 60 * u, 6); ctx.fillStyle = C.hair; ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx, ty - 20 - th); ctx.lineTo(tx + 70 * u * g, ty - 10); ctx.lineTo(tx - 70 * u * g, ty - 10); ctx.closePath(); ctx.fillStyle = k % 2 ? C.yellow : '#BC9A55'; ctx.fill();
  }
  const bw = 120, bh = 60;
  for (let r = 0; r * bh < h; r++) for (let c = -1; c * bw < w; c++) {
    const id = r * 31 + c, fall = clamp(melt * 1.7 - rnd(id) * 0.7), bx = x + c * bw + (r % 2) * bw / 2, by = y + r * bh + fall * fall * (h + 200);
    if (fall >= 1) continue;
    ctx.globalAlpha = 1 - fall * 0.6; rr(bx + 4, by + 4, bw - 8, bh - 8 + fall * 40, 8); ctx.fillStyle = r % 2 ? '#4A4A53' : '#3B3B43'; ctx.fill();
  }
  ctx.globalAlpha = 1; ctx.restore();
}
/** a generic world-records book (no real logos) */
export function recordBook(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-200, -260, 400, 520, 24); ctx.fillStyle = '#202026'; ctx.fill();
  rr(-200, -260, 46, 520, [24, 0, 0, 24]); ctx.fillStyle = C.yellow; ctx.fill();
  ctx.fillStyle = C.bg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 64px Inter';
  ctx.fillText('WORLD', 24, -120); ctx.fillText('RECORDS', 24, -46);
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(-36, 40); ctx.lineTo(84, 40); ctx.lineTo(60, 130); ctx.lineTo(-12, 130); ctx.closePath(); ctx.fill();
  rr(12, 130, 24, 50, 6); ctx.fill(); rr(-30, 176, 108, 26, 8); ctx.fill();
  ctx.restore();
}
/** speech bubble (graphite, ivory text) pointing down-left to the speaker */
export function bubble(x, y, text, a = 1, size = 70) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(eob(clamp(a)), eob(clamp(a)));
  ctx.font = `900 ${size}px Inter`; const tw = ctx.measureText(text).width;
  rr(-tw / 2 - 40, -size, tw + 80, size * 2, 40); ctx.fillStyle = '#202026'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-tw / 2, size - 4); ctx.lineTo(-tw / 2 + 60, size - 4); ctx.lineTo(-tw / 2 - 30, size + 60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.bg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4);
  ctx.restore();
}
