#!/bin/bash
# Turn a fresh faceless-shorts Inside Out project into a 16:9 long-form project (run AFTER kit/apply.sh).
#   bash kit/longform/apply.sh <project-dir>
# 1920x1080 canvas, no burned captions (long-form subtitles are a separate .srt from tools/align.py --srt),
# softer cuts, and a data-driven shots.js: scenes live in script.json, so a new video needs no new code.
set -eu
LF="$(cd "$(dirname "$0")" && pwd)"; P="${1:?usage: longform/apply.sh <project-dir>}"
cp "$LF/longform.js" "$P/src/core/longform.js"
cp "$LF/shots.js" "$P/src/shots.js"
python3 - "$P" <<'PY'
import sys, re
from pathlib import Path
P = Path(sys.argv[1])
def patch(rel, pairs):
    f = P / rel; s = f.read_text()
    for a, b in pairs:
        if b in s: continue                      # already applied
        if a not in s: sys.exit(f'{rel}: expected text not found: {a!r}')
        s = s.replace(a, b)
    f.write_text(s)
patch('src/core/lib.js', [('export const W = 1080, H = 1920', 'export const W = 1920, H = 1080')])
patch('index.html', [('width="1080" height="1920"', 'width="1920" height="1080"')])
patch('tools/capture.mjs', [("'--window-size=1080,1920'", "'--window-size=1920,1080'"), ('scale=216:384', 'scale=384:216')])
patch('src/main.js', [('buildShots();', 'buildShots(script);'),
                      ('const punch = 1 + 0.13 *', 'const punch = 1 + (sh.punch ?? 0.13) *'),
                      ("globalAlpha = 0.55 * (1 - lt / 0.12)", "globalAlpha = (sh.flash ?? 0.55) * (1 - lt / 0.12)")])
patch('src/core/captions.js', [('export const CAP = { y: 1400, size: 150, maxW: 900 };', 'export const CAP = { y: 1400, size: 150, maxW: 900, off: true };'),
                               ('export function drawCaption(t) {\n', 'export function drawCaption(t) {\n  if (CAP.off) return;   // long-form: subtitles ship as data/captions.srt\n')])
PY
echo "long-form (16:9) overlay applied to $P"
