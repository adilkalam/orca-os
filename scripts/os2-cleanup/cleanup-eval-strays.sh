#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

echo "Scanning for stray eval workspace directories..."
count=0
while IFS= read -r d; do
  # Only remove top-level dirs that look like "[HH:MM:SS] Create workspace: ..."
  if [[ "$d" =~ ^\[.*Create\ workspace:.*\]$ ]]; then
    echo "Removing: $d"
    rm -rf -- "$d"
    count=$((count+1))
  fi
done < <(find . -maxdepth 1 -type d -regex "\./\[.*\] Create workspace: .*" -printf "%f\n" 2>/dev/null || true)

echo "Removed $count stray directories."

