SHELL := /bin/bash

.PHONY: tweak finalize atlas mem-index mem-search guard-warn guard-off guard-strict guard-tweak session-start

tweak:
	@bash scripts/design-tweak.sh run

finalize:
	@bash scripts/finalize.sh

atlas:
	@python3 scripts/generate-design-atlas.py

mem-index:
	@python3 scripts/memory-index.py update-changed --include-out

mem-index-all:
	@python3 scripts/memory-index.py index-all --include-out

mem-search:
	@echo "Usage: make mem-search Q=\"query terms\"" && exit 2

guard-warn:
	@bash scripts/design-tweak.sh guard warn

guard-off:
	@bash scripts/design-tweak.sh guard off

guard-tweak:
	@bash scripts/verification-mode.sh tweak

guard-strict:
	@bash scripts/verification-mode.sh strict

session-start:
	@bash hooks/session-start.sh
