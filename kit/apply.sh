#!/bin/bash
# Apply the High-ROI Life brand overlay to a fresh faceless-shorts Inside Out project.
#   bash kit/apply.sh <project-dir>
# Copies the brand palette (graphite / champagne gold / ivory, no green) into src/core/lib.js and appends the
# reusable components (cup, commentCard, stamp, bolt, brain, adeno, wallScene, liver, moon, latte, dna, volcano...)
# and the recurring cast (K.kai, K.bit; see kit/CAST.md) to kit.js.
set -eu
KIT="$(cd "$(dirname "$0")" && pwd)"; P="${1:?usage: apply.sh <project-dir>}"
cp "$KIT/lib.js" "$P/src/core/lib.js"
python3 - "$P/src/core/kit.js" "$KIT/kit-extras.js" <<'PY'
import sys
kp, ep = sys.argv[1:]; s = open(kp).read(); e = open(ep).read()
old = "import { ctx, C, W, H, TAU, lerp, clamp, rnd, rr, circle, ell, line, fillAll } from './lib.js';"
new = "import { ctx, C, W, H, TAU, lerp, clamp, seg, eo, eio, eob, rnd, rr, circle, ell, line, fillAll } from './lib.js';"
s = s.replace(old, new)
if 'BRAND EXTRAS' not in s:
    k = s.index('/** follow FOOD_PATH'); s = s[:k] + e + '\n' + s[k:]
open(kp, 'w').write(s)
PY
echo "brand overlay applied to $P"
