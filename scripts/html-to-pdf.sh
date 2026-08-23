#!/usr/bin/env bash
# Render an HTML file to PDF with headless Chrome.
#
#   ./scripts/html-to-pdf.sh resume/AI-Product-Engineer.html [out.pdf]
#
# Output defaults to the input path with a .pdf extension.
set -euo pipefail

CHROME="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"

if [ $# -lt 1 ]; then
  echo "usage: $0 <input.html> [output.pdf]" >&2
  exit 64
fi

IN="$1"
[ -f "$IN" ] || { echo "no such file: $IN" >&2; exit 66; }
[ -x "$CHROME" ] || { echo "no Chrome/Edge binary found; set CHROME_BIN" >&2; exit 69; }

ABS_IN="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"
OUT="${2:-${ABS_IN%.html}.pdf}"

"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$OUT" \
  "file://$ABS_IN" 2>/dev/null

[ -s "$OUT" ] || { echo "PDF was not produced: $OUT" >&2; exit 70; }
echo "$OUT"
