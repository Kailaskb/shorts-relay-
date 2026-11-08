# Long-form (16:9) videos

Same engine, palette and kit as the Shorts, plus this overlay. Scenes are data in `script.json`, so a new video needs a
script, not code. `FS` = the faceless-shorts skill folder, `REPO` = this repo's clone.

## Make one
1. `bash FS/scripts/new_video.sh inside-out <name>` then `bash REPO/kit/apply.sh <project> && bash REPO/kit/longform/apply.sh <project>`
2. Write `script.json` (start from `example-script.json`): voice `am_michael` x1.0, `gap` 0.3, about 150 spoken words per minute
   (1,200-1,700 words for 8-12 min). One line = a sentence or clause. A line with `scene` cuts to a new scene; lines without
   one keep the previous scene. Aim for a new scene every 4-10 s and never 3 of the same type in a row.
3. `FS/scripts/py FS/scripts/voice.py <project>` (about 1 min of compute per minute of audio).
4. `FS/scripts/py REPO/tools/align.py <project> --srt`: word timing and `data/captions.srt` (the separate subtitle file).
5. In the project: `node tools/capture.mjs check` (CHECK OK) > `node tools/capture.mjs cues` > `FS/scripts/py tools/mix.py .` >
   `node tools/capture.mjs sheet review/all.jpg 4 6`: look at every frame, then full-size `frames` for anything suspect.
6. Render in the background (about 1.1 s per second of video): `node tools/capture.mjs video renders/<name>.mp4`.
   Relay copy under 95 MB: `ffmpeg -i renders/<name>.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 160k -movflags +faststart renders/<name>-relay.mp4` (raise -crf by 2 until it fits).
7. Thumbnail: pick a frame with one strong visual, then
   `python3 REPO/tools/thumb.py <frame.jpg> "2-4 *WORDS*" renders/<name>-thumb.jpg --focus 0.5,0.45 --zoom 1.2` and look at it.
8. Chapters for the description: each `chapter` scene's line start from `data/lines.json` (first one `00:00`, at least 3, each 10 s or longer).

## Scene types
All accept `kicker` (small gold label, top left). In any text, `*word*` turns gold. `at` = the spoken word that triggers a
reveal (exact word first, then prefix; a word that is not spoken in the scene's lines fails `check`). Without `at`, items
reveal evenly. Every scene shows its layout at the cut and fills in on the words: no empty frames.

| type | params | use |
|---|---|---|
| `title` | `title`, `sub`, `subAt`, `size` | opening, section openers |
| `chapter` | `n`, `title` | chapter cards (also the YouTube chapters) |
| `stat` | `value` (number counts up, or text), `from`, `prefix`, `suffix`, `decimals`, `label`, `note`, `at`, `danger` | one big number |
| `list` | `title`, `items`: `["text"]` or `[{text, at}]` | 2-5 points, 8 words or fewer each |
| `bars` | `title`, `items`: `[{label, value, at, danger}]`, `max`, `prefix`, `suffix` | comparisons |
| `line` | `title`, `points`, `labels`, `at`, `endAt`, `endLabel` | growth over time |
| `compare` | `left` / `right`: `{title, points, danger}`, `at` (right side appears) | A vs B |
| `quote` | `text`, `by`, `size` | the one line to remember |
| `steps` | `title`, `items`: `["text"]` or `[{text, at}]` | 2-5 steps |
| `kit` | `draw` (brain, liver, cup, latte, moon, bolt, dna, heart, stopwatch, calendar, stomach, man), `x`, `y`, `s`, `labels`: `[{text, x, y, tx, ty, at, gold}]`, `text`, `textAt` | diagrams from the Shorts kit (man: `s` 0.8, `y` 560) |
| `end` | `title`, `sub` | last 10-20 s; the right side stays free for YouTube end-screen elements |

New visuals: add components to `kit/kit-extras.js` (shared with the Shorts) and a key to `KIT` in `longform.js`.

## Quality rules
- Facts and numbers: compute them (put the calculation in `sources`) and cite a source for every claim.
- Variety: one topic-specific visual (a `kit` scene or a new component) in every video; rotate layouts so videos never look templated.
- Burned captions are off in long-form; upload `data/captions.srt` as English subtitles.
