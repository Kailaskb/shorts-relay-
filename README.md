# The High-ROI Life: video site and production kit

Public site (GitHub Pages: Settings > Pages > branch `main`, folder `/`): https://kailaskb.github.io/shorts-relay-/
Direct file links (used for YouTube uploads through Zapier): `https://raw.githubusercontent.com/Kailaskb/shorts-relay-/main/videos/<file>`

| path | what it is |
|---|---|
| `videos/` | published files: `<slug>.mp4`, `<slug>.jpg` (cover), `<slug>-thumb.jpg` (long-form thumbnail) |
| `index.html` | the site; the `VIDEOS` list, newest first (`format`, `archived`) |
| `kit/apply.sh` | brand overlay for a faceless-shorts Inside Out project (palette + reusable components) |
| `kit/longform/` | 16:9 long-form overlay and data-driven scene library; see `kit/longform/README.md` |
| `tools/align.py` | offline word timing (PocketSphinx forced alignment), replaces Whisper where Hugging Face is blocked |
| `tools/thumb.py` | long-form thumbnail maker |
| `playbook.md` | brand, monetization targets and dates, strategy, what the data says |
| `plan.md` | content pillars and the topic backlog |
| `analytics/` | `videos.csv` (one row per upload), `channel.csv` (channel snapshots), `posts.csv` (community and Instagram posts) |

Keep it small: at most 40 Shorts and 8 long-form MP4s in `videos/`. Older ones get `archived: true` in `index.html`
(the card then plays the YouTube copy) and their MP4 is deleted. Long-form relay copies must stay under 95 MB
(GitHub's file limit is 100 MB). This repo is public: no drafts you don't want seen, no keys, no private data.
