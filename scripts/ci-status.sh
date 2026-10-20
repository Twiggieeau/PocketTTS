#!/usr/bin/env bash
# Watch the latest GitHub Actions run for this repository.
# Usage: scripts/ci-status.sh [watch]
set -euo pipefail

REPO="$(git -C "$(dirname "$0")/.." remote get-url origin | sed -E 's#\.git$##; s#.*github.com[:/]([^/]+)/([^/]+)$#\1/\2#')"
TOKEN="$(sed -n 's#^https://[^:]*:\([^@]*\)@github.com.*#\1#p' "$HOME/.git-credentials" 2>/dev/null || true)"
if [ -z "$TOKEN" ]; then
    echo "No GitHub token found in ~/.git-credentials" >&2
    exit 1
fi

latest() {
    curl -s -H "Authorization: token $TOKEN" \
        "https://api.github.com/repos/$REPO/actions/runs?per_page=1" |
        python3 -c "
import json, sys
try:
    runs = json.load(sys.stdin).get('workflow_runs', [])
except Exception:
    runs = []
if not runs:
    print('none|-|none|no runs')
else:
    r = runs[0]
    print('{}|{}|{}|{}'.format(r.get('status'), r.get('conclusion') or '-', r.get('head_sha', '')[:8], r.get('html_url', '')))
"
}

if [ "${1:-}" = "watch" ]; then
    while true; do
        line="$(latest)"
        status="$(printf '%s' "$line" | cut -d'|' -f1)"
        conclusion="$(printf '%s' "$line" | cut -d'|' -f2)"
        sha="$(printf '%s' "$line" | cut -d'|' -f3)"
        url="$(printf '%s' "$line" | cut -d'|' -f4)"
        echo "$(date +%H:%M:%S)  $status  $conclusion  $sha  $url"
        case "$status" in
            completed) break ;;
        esac
        sleep 20
    done
else
    latest
fi
