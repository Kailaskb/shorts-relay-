#!/usr/bin/env python3
"""Long-form thumbnail (1280x720 JPEG): a video frame on the right, 2-5 big words on graphite on the left, *gold* word.

  python3 tools/thumb.py <frame.jpg> "HOW MONEY *DOUBLES*" <out.jpg> [--focus 0.5,0.45] [--zoom 1.2]

2-4 words work best. --focus = the point of the frame to keep in view (fractions of width, height); pick a frame with
one strong visual (a big number, a chart peak, a kit object). --zoom > 1 crops tighter on it.

Brand: graphite #17171B, ivory #F4EFE4, champagne gold #D9B76A. No gradients, no borders. Keeps the file under 2 MB.
"""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BG, IVORY, GOLD = (23, 23, 27), (244, 239, 228), (217, 183, 106)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('frame'); ap.add_argument('text'); ap.add_argument('out')
    ap.add_argument('--font', default=str(Path(__file__).resolve().parent.parent / 'kit' / 'Inter-Black.otf'))
    ap.add_argument('--focus', default='0.5,0.5'); ap.add_argument('--zoom', type=float, default=1.0)
    a = ap.parse_args()
    W, H, split = 1280, 720, 600
    img = Image.new('RGB', (W, H), BG)
    fr = Image.open(a.frame).convert('RGB'); fw, fh = fr.size
    sc = max((W - split) / fw, H / fh) * max(1.0, a.zoom); fr = fr.resize((int(fw * sc), int(fh * sc)))
    fx, fy = (float(v) for v in a.focus.split(','))
    x0 = int(min(max(fx * fr.width - (W - split) / 2, 0), fr.width - (W - split))); y0 = int(min(max(fy * fr.height - H / 2, 0), fr.height - H))
    img.paste(fr.crop((x0, y0, x0 + W - split, y0 + H)), (split, 0))
    d = ImageDraw.Draw(img)
    words = [(w.strip('*'), w.startswith('*')) for w in a.text.split()]
    for size in range(150, 56, -4):                        # biggest size whose wrapped lines fit the left panel
        f = ImageFont.truetype(a.font, size); sp = int(size * 0.28); lines, cur, cw = [], [], 0
        for w, g in words:
            ww = d.textlength(w, font=f)
            if cur and cw + sp + ww > split - 90: lines.append(cur); cur, cw = [], 0
            cur.append((w, g, ww)); cw += (sp if len(cur) > 1 else 0) + ww
        lines.append(cur)
        widest = max(sum(w[2] for w in ln) + sp * (len(ln) - 1) for ln in lines)
        if widest <= split - 100 and len(lines) <= 3 and len(lines) * size * 1.05 <= H - 170: break
    y = (H - len(lines) * size * 1.05) / 2
    for ln in lines:
        x = 56
        for w, g, ww in ln:
            d.text((x, y), w, font=f, fill=GOLD if g else IVORY); x += ww + sp
        y += size * 1.05
    d.rectangle([56, H - 70, 56 + 120, H - 58], fill=GOLD)
    q = 92
    while True:
        img.save(a.out, quality=q, optimize=True)
        if Path(a.out).stat().st_size < 2_000_000 or q <= 60: break
        q -= 8
    print(f'{a.out} ({Path(a.out).stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
