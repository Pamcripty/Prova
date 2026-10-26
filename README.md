# Video toolkit: HyperFrames + Remotion + FFmpeg

| Tool | Version | Folder | Good for |
|---|---|---|---|
| [HyperFrames](https://hyperframes.heygen.com) | 0.8.203 | `hyperframes-studio/` | HTML + GSAP → MP4. Fastest path for AI-written motion graphics, captions, title cards |
| [Remotion](https://remotion.dev) | 4.0.539 | `remotion-studio/` | React → MP4. Data-driven/templated videos, reusable components |
| FFmpeg | 6.1.1 | system | Cutting, joining, crossfades, audio, subtitles, GIF/WebM/ProRes export |

## Setup

```bash
# needs Node 22+ and FFmpeg (apt install ffmpeg / brew install ffmpeg)
npm run setup     # installs both projects + headless Chrome
npm run verify    # renders a test video with each tool and an FFmpeg edit
```

`verify.sh` renders to `renders/`: `hyperframes-test.mp4`, `remotion-test.mp4`, and `ffmpeg-edit-test.mp4`/`.gif` (both clips crossfaded, with a text overlay and audio).

## Everyday commands

```bash
# HyperFrames
cd hyperframes-studio
npm run dev                          # Studio preview in the browser
npm run check                        # lint + runtime + layout + contrast
npx hyperframes snapshot --at 1,3    # PNG frames to eyeball
npm run render                       # MP4

# Remotion
cd remotion-studio
npm run dev                          # Remotion Studio
npm run still                        # PNG of frame 60
npm run render                       # MP4
```

## Notes

- GSAP is vendored in `hyperframes-studio/assets/vendor/` instead of loaded from a CDN, so renders work offline and stay reproducible.
- If Remotion can't download its own Chrome (locked-down network), point it at any Chrome Headless Shell:
  `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell npm run render`. `verify.sh` does this automatically using the one HyperFrames installs.
- When crossfading clips from different renderers with `xfade`, normalize them first (`settb=AVTB,fps=30,format=yuv420p`); otherwise FFmpeg errors on mismatched timebases.
- HyperFrames AI skills (`/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry`, `/media-use`) are installed with `npx hyperframes skills update`.

## Cortedoro

- `cortedoro-reel/` — 15 s vertical brand reel (HyperFrames). `cd cortedoro-reel && npm run render`
- `cortedoro-evento/` — 12 s vertical event/offer announcement (HyperFrames); event name, date and time are placeholders in `index.html`. `cd cortedoro-evento && npm run render`
- `remotion-studio/src/cortedoro/` — square review template (Remotion). Add reviews to
  `remotion-studio/cortedoro/recensioni.json` (`file`, `testo`, `autore`, `stelle`), then
  `cd remotion-studio && npm run recensioni` renders one video per review into `renders/recensioni/`.
  Duration grows with the text (min 10 s) and long reviews get a smaller font.
