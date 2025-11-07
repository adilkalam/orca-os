#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

MODE_FILE=".orchestration/mode.json"
raw=${1:-}
case "$raw" in
  on|strict) cmd="strict" ;;
  off) cmd="off" ;;
  tweak) cmd="tweak" ;;
  *) cmd="$raw" ;;
esac

usage() {
  echo "Usage: $0 [on|off|strict|tweak]"; exit 2
}

[ -n "$cmd" ] || usage

mkdir -p .orchestration
if [ ! -f "$MODE_FILE" ]; then
  echo '{"verify_mode":"strict"}' > "$MODE_FILE"
fi

tmp=$(mktemp)
if grep -q '"verify_mode"' "$MODE_FILE"; then
  sed "s/\"verify_mode\"\s*:\s*\"[^\"]*\"/\"verify_mode\": \"$cmd\"/" "$MODE_FILE" > "$tmp"
else
  sed "s/}/, \"verify_mode\": \"$cmd\"}/" "$MODE_FILE" > "$tmp"
fi
mv "$tmp" "$MODE_FILE"
echo "verify_mode set to $cmd in $MODE_FILE"
