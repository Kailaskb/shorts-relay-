#!/usr/bin/env python3
"""Word timing without Whisper: forced alignment with PocketSphinx, fully offline.

faceless-shorts' words.py needs the Whisper model from Hugging Face, which some sandboxes block. This aligns the
narration to the script's own words instead (the text is known, so it is alignment, not recognition). The PyPI wheel
of pocketsphinx ships the US English model, so nothing else is downloaded.

  <faceless-shorts>/scripts/py align.py <project>                  after voice.py (AI voice). Replaces words.py.
  <faceless-shorts>/scripts/py align.py <project> --audio vo.m4a   your own recording: also rebuilds data/lines.json
  add --srt                                                         also writes data/captions.srt (long-form subtitles)

Writes data/words.json [{w, line, s, e}] and data/words.txt, the same format as words.py.
Words the dictionary lacks get their sounds from the Kokoro voice's own phonemizer, so names, acronyms and numbers are
aligned the way the voice said them. A line that cannot be aligned falls back to spreading its words inside the
line's exact time window (the same fallback words.py uses) and is reported.
"""
import argparse, json, re, subprocess, sys
from pathlib import Path

FPS = 100   # PocketSphinx frames per second
RATE = 16000
norm = lambda w: re.sub(r'[^a-z0-9]+', '', w.lower())


def ensure_pocketsphinx():
    try:
        import pocketsphinx  # noqa: F401
    except ImportError:
        if subprocess.run(['uv', 'pip', 'install', '-q', '--python', sys.executable, 'pocketsphinx'], capture_output=True).returncode:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', 'pocketsphinx'])


# espeak-style IPA (what Kokoro speaks) -> CMU ARPAbet, longest symbols first
IPA = [('aɪ', 'AY'), ('aʊ', 'AW'), ('eɪ', 'EY'), ('oʊ', 'OW'), ('əʊ', 'OW'), ('ɔɪ', 'OY'), ('tʃ', 'CH'), ('dʒ', 'JH'),
       ('ɑː', 'AA'), ('iː', 'IY'), ('uː', 'UW'), ('ɔː', 'AO'), ('ɜː', 'ER'), ('ɪə', 'IH R'), ('eə', 'EH R'), ('ʊə', 'UH R'),
       ('ɝ', 'ER'), ('ɚ', 'ER'), ('ɜ', 'ER'), ('ɑ', 'AA'), ('æ', 'AE'), ('ʌ', 'AH'), ('ə', 'AH'), ('ɐ', 'AH'), ('ɔ', 'AO'),
       ('ɒ', 'AA'), ('ɛ', 'EH'), ('e', 'EH'), ('ɪ', 'IH'), ('ᵻ', 'IH'), ('i', 'IY'), ('o', 'OW'), ('ʊ', 'UH'), ('u', 'UW'),
       ('a', 'AA'), ('b', 'B'), ('d', 'D'), ('ð', 'DH'), ('f', 'F'), ('ɡ', 'G'), ('g', 'G'), ('h', 'HH'), ('k', 'K'),
       ('l', 'L'), ('m', 'M'), ('n', 'N'), ('ŋ', 'NG'), ('p', 'P'), ('ɹ', 'R'), ('r', 'R'), ('s', 'S'), ('ʃ', 'SH'),
       ('t', 'T'), ('θ', 'TH'), ('v', 'V'), ('w', 'W'), ('j', 'Y'), ('z', 'Z'), ('ʒ', 'ZH'), ('ɾ', 'T'), ('x', 'K'),
       ('ç', 'HH'), ('ɬ', 'L'), ('ʍ', 'W')]
LETTER = dict(a='AE', b='B', c='K', d='D', e='EH', f='F', g='G', h='HH', i='IH', j='JH', k='K', l='L', m='M', n='N',
              o='AA', p='P', q='K', r='R', s='S', t='T', u='AH', v='V', w='W', x='K S', y='IY', z='Z')


def ipa_to_arpa(ipa):
    out, i = [], 0
    while i < len(ipa):
        for sym, arp in IPA:
            if ipa.startswith(sym, i):
                out += arp.split(); i += len(sym); break
        else:
            i += 1   # stress, length and syllabic marks, spaces
    return ' '.join(out)


class G2P:
    """Sounds for words the dictionary lacks: Kokoro's phonemizer (what the voice actually said), else letters."""
    def __init__(self):
        self.tk = None
        try:
            from kokoro_onnx.tokenizer import Tokenizer
            self.tk = Tokenizer()
        except Exception:
            pass

    def __call__(self, word, lang):
        if self.tk:
            try:
                arp = ipa_to_arpa(self.tk.phonemize(word, lang=lang))
                if arp:
                    return arp
            except Exception:
                pass
        ph = [p for ch in word.lower() for p in LETTER.get(ch, '').split()]
        return ' '.join(p for k, p in enumerate(ph) if k == 0 or p != ph[k - 1]) or 'AH'


def key_for(tok):
    return re.sub(r"^[^a-z0-9']+|[^a-z0-9']+$", '', tok.lower().replace('’', "'"))


def dict_words(dec, toks, g2p, lang, added):
    """Map script tokens to dictionary entries, adding pronunciations for unknown words."""
    out = []
    for tok in toks:
        k = key_for(tok)
        if k and dec.lookup_word(k):
            out.append(k); continue
        if k in added:
            out.append(added[k]); continue
        parts = [p for p in re.split(r"[-/–—]", k) if p]
        if len(parts) > 1 and all(dec.lookup_word(p) for p in parts):
            phones = ' '.join(dec.lookup_word(p) for p in parts)
        elif k.endswith("'s") and dec.lookup_word(k[:-2]):
            base = dec.lookup_word(k[:-2]); last = base.split()[-1]
            phones = base + (' IH Z' if last in ('S', 'Z', 'SH', 'ZH', 'CH', 'JH') else ' S' if last in ('P', 'T', 'K', 'F', 'TH') else ' Z')
        else:
            phones = g2p(tok.strip(".,!?;:\"()[]"), lang)
        name = f'oov{len(added)}'; added[k] = name
        dec.add_word(name, phones, True)
        out.append(name)
    return out


def align_window(dec, raw, lo, hi, words):
    """Force-align `words` to raw[lo:hi] (seconds). Returns [(start, end)] per word, or None."""
    a, b = int(lo * RATE) * 2, int(hi * RATE) * 2
    dec.set_align_text(' '.join(words))
    dec.start_utt(); dec.process_raw(raw[a:b], full_utt=True); dec.end_utt()
    segs = [s for s in dec.seg() if not s.word.startswith(('<', '[', '+'))]
    if len(segs) != len(words):
        return None
    return [(lo + s.start_frame / FPS, lo + (s.end_frame + 1) / FPS) for s in segs]


def spread(toks, lo, hi):
    """words.py's fallback: share the line's window by word length, with pauses at commas and full stops."""
    wts = [len(norm(w)) + 2.5 + (2.5 if w.endswith(',') else 4.5 if re.search(r'[.?!]$', w) and k < len(toks) - 1 else 0) for k, w in enumerate(toks)]
    tot, c, out = sum(wts), lo, []
    for w, wt in zip(toks, wts):
        d = (hi - lo) * wt / tot; speak = d - (hi - lo) * (wt - len(norm(w)) - 2.5) / tot
        out.append((c, c + speak * 0.92)); c += d
    return out


def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


def write_srt(words, path, max_chars=42, max_dur=3.2):
    cues, cur = [], []
    for w in words:
        if cur and (len(' '.join(x['w'] for x in cur + [w])) > max_chars or w['e'] - cur[0]['s'] > max_dur or w['line'] != cur[-1]['line']):
            cues.append(cur); cur = []
        cur.append(w)
        if re.search(r'[.?!]$', w['w']):
            cues.append(cur); cur = []
    if cur:
        cues.append(cur)
    path.write_text('\n'.join(f"{n}\n{ts(c[0]['s'])} --> {ts(c[-1]['e'])}\n{' '.join(x['w'] for x in c)}\n" for n, c in enumerate(cues, 1)))
    return len(cues)


def main():
    ap = argparse.ArgumentParser(description='Offline word timing for faceless-shorts (PocketSphinx forced alignment).')
    ap.add_argument('project'); ap.add_argument('--audio', help='your own recording (rebuilds data/lines.json)')
    ap.add_argument('--srt', action='store_true', help='also write data/captions.srt')
    a = ap.parse_args()
    P = Path(a.project); S = json.loads((P / 'script.json').read_text())
    lang = 'en-gb' if str(S.get('voice', '')).startswith('b') else 'en-us'
    ensure_pocketsphinx()
    from pocketsphinx import Decoder
    if a.audio:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.audio, '-ac', '1', '-ar', '24000', str(P / 'data/narration.wav')], check=True)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(P / 'data/narration.wav'), '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    dur = len(raw) / (2 * RATE)
    dec, g2p, added = Decoder(samprate=RATE, loglevel='FATAL'), G2P(), {}
    toks = [[w for w in ln['text'].split() if norm(w)] for ln in S['lines']]
    words, failed = [], []
    if a.audio or not (P / 'data/lines.json').exists():
        flat = [w for t in toks for w in t]
        times = align_window(dec, raw, 0.0, dur, dict_words(dec, flat, g2p, lang, added))
        if times is None:
            raise SystemExit('Could not align the recording to script.json. Does the recording follow the script word for word?')
        k, lines = 0, []
        for i, t in enumerate(toks):
            tt = times[k:k + len(t)]; k += len(t)
            words += [{'w': w, 'line': i, 's': round(s, 3), 'e': round(e, 3)} for w, (s, e) in zip(t, tt)]
            lines.append({'i': i, 'text': S['lines'][i]['text'], 'start': round(tt[0][0], 3), 'end': round(tt[-1][1], 3)})
        (P / 'data/lines.json').write_text(json.dumps({'duration': round(dur, 3), 'lines': lines}, indent=1))
    else:   # AI voice: voice.py's line windows are exact, so align each line inside its own window
        L = json.loads((P / 'data/lines.json').read_text())['lines']
        for i, t in enumerate(toks):
            lo, hi = L[i]['start'], L[i]['end']
            try:
                tt = align_window(dec, raw, max(0.0, lo - 0.12), min(dur, hi + 0.12), dict_words(dec, t, g2p, lang, added))
            except Exception:
                tt = None
            if tt is None:
                failed.append(i); tt = spread(t, lo, hi)
            for w, (s, e) in zip(t, tt):
                s = min(max(s, lo), hi); e = min(max(e, s), hi)
                words.append({'w': w, 'line': i, 's': round(s, 3), 'e': round(e, 3)})
    (P / 'data/words.json').write_text(json.dumps(words, indent=1))
    (P / 'data/words.txt').write_text('\n'.join(f"{w['s']:7.2f} {w['e']:7.2f}  L{w['line']:<2d} {w['w']}" for w in words))
    msg = f'data/words.json: {len(words)} words aligned offline (PocketSphinx), {len(added)} new words via the voice phonemizer'
    if failed:
        msg += f'; lines {failed} fell back to spreading inside their window'
    if a.srt:
        msg += f'; data/captions.srt: {write_srt(words, P / "data/captions.srt")} cues'
    print(msg)


if __name__ == '__main__':
    main()
