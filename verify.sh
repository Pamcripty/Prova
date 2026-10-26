#!/usr/bin/env bash
# Verifies the video toolchain: FFmpeg, HyperFrames, Remotion.
# Usage: ./verify.sh   (outputs land in ./renders)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p renders

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
fail() { printf '  \033[31m✗\033[0m %s\n' "$1"; exit 1; }

echo "== FFmpeg"
command -v ffmpeg >/dev/null || fail "ffmpeg not installed"
ok "$(ffmpeg -version | head -1 | cut -d' ' -f1-3)"
encoders=$(ffmpeg -hide_banner -encoders 2>/dev/null)
filters=$(ffmpeg -hide_banner -filters 2>/dev/null)
for enc in libx264 libx265 libvpx-vp9 aac libmp3lame libopus prores_ks gif; do
  grep -qw -- "$enc" <<<"$encoders" && ok "encoder $enc" || fail "missing encoder $enc"
done
for f in drawtext subtitles xfade zoompan loudnorm overlay scale colorchannelmixer; do
  grep -qw -- "$f" <<<"$filters" && ok "filter $f" || fail "missing filter $f"
done

echo "== HyperFrames"
(cd hyperframes-studio && npx --yes hyperframes check >/dev/null 2>&1) && ok "composition check passed" || fail "hyperframes check failed"
(cd hyperframes-studio && npx --yes hyperframes render -o ../renders/hyperframes-test.mp4 --quiet >/dev/null 2>&1) \
  && ok "rendered renders/hyperframes-test.mp4" || fail "hyperframes render failed"

echo "== Remotion"
if [ -z "${REMOTION_BROWSER_EXECUTABLE:-}" ]; then
  hf_chrome=$(ls ~/.cache/hyperframes/chrome/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1 || true)
  (cd remotion-studio && npx remotion browser ensure >/dev/null 2>&1) || export REMOTION_BROWSER_EXECUTABLE="$hf_chrome"
fi
(cd remotion-studio && npx tsc --noEmit) && ok "typecheck passed" || fail "typecheck failed"
(cd remotion-studio && npx remotion render src/index.ts HelloVideo ../renders/remotion-test.mp4 >/dev/null 2>&1) \
  && ok "rendered renders/remotion-test.mp4" || fail "remotion render failed"

echo "== FFmpeg edit pipeline"
ffmpeg -hide_banner -loglevel error -y \
  -i renders/hyperframes-test.mp4 -i renders/remotion-test.mp4 \
  -f lavfi -i "sine=frequency=440:duration=7.5" \
  -filter_complex "[0:v]settb=AVTB,fps=30,format=yuv420p[a0];[1:v]settb=AVTB,fps=30,format=yuv420p[b0];[a0][b0]xfade=transition=fade:duration=0.5:offset=3.5[v];[v]drawtext=text='HyperFrames → Remotion':fontcolor=white:fontsize=36:x=40:y=h-80[vt];[2:a]afade=t=out:st=6.5:d=1,volume=0.2[a]" \
  -map "[vt]" -map "[a]" -c:v libx264 -pix_fmt yuv420p -crf 20 -c:a aac -shortest renders/ffmpeg-edit-test.mp4 \
  && ok "xfade + drawtext + audio → renders/ffmpeg-edit-test.mp4" || fail "ffmpeg edit failed"
ffmpeg -hide_banner -loglevel error -y -i renders/ffmpeg-edit-test.mp4 -vf "fps=12,scale=480:-1" renders/ffmpeg-edit-test.gif \
  && ok "gif export" || fail "gif export failed"
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height -of compact renders/ffmpeg-edit-test.mp4 | sed 's/^/    /'

echo; echo "All checks passed."
