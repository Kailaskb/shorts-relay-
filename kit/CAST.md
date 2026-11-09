# The High-ROI Life cast (character bible)

The channel's Shorts star the same characters every time, so viewers recognise the channel in the feed and come back for them. The characters are the constant; topics, scenes, hooks and layouts keep changing (YouTube's inauthentic-content rule penalises templated near-duplicates, not recurring characters).

Code: `kit/kit-extras.js` (added to every project by `kit/apply.sh`). Debut: "What happens if you stay awake 11 days?" (2026-11-08).

## Kai: the one who tries everything
- Role: the everyman stand-in for "you". Whatever the example is (throwing trash into a volcano, drinking the coffee, staying awake), Kai does it.
- Look: champagne-gold hoodie with ivory drawstrings and a pocket, graphite pants, dark hair with ONE tall curl on top (his silhouette). Never change these.
- `K.kai({ x, y, s, arm, armL, finger, eyes: 'wide'|'closed'|undefined, mouth: 'smile'|'smirk'|'flat'|'o'|'grin'|'chew', brow, smirk, frown, look, tired: 0..1, rot, holding: (x, y) => drawFn, xray })`. Same options as the kit's `man()` plus `tired` (heavy lids and eye bags) and `rot` (whole-body tilt; -PI/2 lies him down).
- Personality: curious, a little reckless, game for anything, never mean. He reacts on the beat (shock, smirk, finger wag) and looks at the camera on the last line.
- Running gags: he always tries it first and regrets it a little; his curl droops when he is exhausted (idea for later).

## Bit: Kai's small robot
- Role: the voice of data and the owner's engineer angle. Bit shows the numbers (day counters, hours, percentages, money math) on a screen above his head and reacts with his visor eyes. He never speaks a line himself; the narrator does.
- Look: mid-graphite rounded body, black visor with gold eyes, a gold antenna tip, two gold thrusters. Reads on both the ivory day room and the graphite night room.
- `K.bit({ x, y, s, t, face: 'n'|'happy'|'wide'|'sad'|'scan', look, tilt, screen: 'TEXT', screenA: 0..1 })`. The screen panel keeps itself inside the frame.

## Sets and props added with the cast
`K.nightRoom()` (the room at night, moon in the window), `K.tv(x, y, s, t)`, `K.meltWall(x, y, w, h, melt, reveal, t)`, `K.recordBook(x, y, s, rot)` (generic, no real logos), `K.bubble(x, y, text, a, size)` (ivory speech bubble, ink text).

Money set (episode 2, "₹100 a day"): `K.snackBag(x, y, s, rot, price, crinkle)`, `K.coin(x, y, s, spin)` (₹ coin), `K.coinJar(x, y, s, fill, label)`, `K.growthChart(x, y, w, h, p, { dips, color, redA, label })` (returns the tip), `K.barPair(x, y, h, a, b, [value, label], [value, label])`, `K.fiftyGrid(x, y, k)` (50 company blocks), `K.caveat(lines, x, y, a)` (small ivory disclaimer card for money episodes).

## Series formats (pick one per Short; rotate)
1. **Kai tries it**: "What happens if you [do X]?" Kai does it, Bit counts. Body, brain, science and wild what-ifs.
2. **Kai vs the numbers**: money and career math. Kai spends or saves, Bit shows the compound result.
3. **Kai asks Bit**: AI and robots explained by an engineer. Bit shows how it really works inside.
4. **Kai replays a real case**: a documented experiment or record, re-enacted (clearly said to be a replay).
5. **Viewer dares Kai**: a real comment becomes the episode (agree-first when the commenter has a point).

## Rules
- Kai appears in every Short; Bit in most. Say "Kai" in the first two lines of an episode while the channel is new, so the name sticks.
- Same design, same colours, every time. New poses, props and sets are fine and encouraged.
- Never copy another channel's characters or style closely (no Zack D. Films or Kurzgesagt lookalikes).
- Kai is a cartoon re-enacting real facts: when he replays a real person's story, the narration names the real person and the sources back every detail.
- Health topics: Kai shows the effect, never a how-to; end with the safety point when there is one.

## Silhouette set (kit/sil.js, copied into src/ by apply.sh)
Kai as a cinematic silhouette (`sil()` with his curl, `walk`/`run` poses, two-bone reach), the frozen street (`world(k)` + `rain`), `device`, `handDevice`, `clockFace`, `car`, `bird`, `glass`, `speech`, `waves`. Rule: ink = the living world, muted ivory-grey = frozen people, **gold = the one who still moves**. Debut: "What if you could pause time for ten seconds?" (2026-11-08).
