#!/usr/bin/env bash
# Fire the Vercel deploy hook once the account's daily build rate limit clears.
#
# Why this exists: on 2026-08-09 the push of 581c5fb was rejected with
# `build-rate-limit` (a Hobby-plan cap counted across every project on the
# account, not just this one). Vercel does not retry a rejected build, and
# nothing else notices, so the commit would have sat pushed-but-not-live
# indefinitely. That is the exact failure mode the always-push-live rule exists
# to prevent, one layer further out: the code was pushed, the site was not.
#
# Behaviour: compares the newest READY production deployment against the head of
# main on GitHub. If production is behind, it fires the deploy hook. If it is
# current, it removes its own launchd agent and exits, because this is a
# recovery mechanism and not something worth running forever.
#
# Reads the Vercel token from the local CLI's auth file. Nothing is stored in a
# repo, a secret, or a workflow.

set -euo pipefail

PROJECT_ID="prj_kpYh9qnBmcExwCfe137EUHYoLd0Z"       # trove-site
HOOK="https://api.vercel.com/v1/integrations/deploy/${PROJECT_ID}/h2Et3Kl0L9"
REPO="ArnavGoel03/trove-site"
AGENT="dev.arnavgoel.trove-site-deploy-retry"
AUTH="$HOME/Library/Application Support/com.vercel.cli/auth.json"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

if [[ ! -f "$AUTH" ]]; then
  log "no Vercel CLI auth at $AUTH, cannot check deployment state"
  exit 1
fi
TOKEN="$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['token'])" "$AUTH")"

WANT="$(curl -fsS --max-time 20 "https://api.github.com/repos/${REPO}/commits/main" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["sha"])')"

HAVE="$(curl -fsS --max-time 20 -H "Authorization: Bearer $TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&target=production&state=READY&limit=1" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin)["deployments"]; print(d[0].get("meta",{}).get("githubCommitSha","") if d else "")')"

log "main=${WANT:0:8} production=${HAVE:0:8}"

if [[ "$WANT" == "$HAVE" ]]; then
  log "production is current, retiring the retry agent"
  # Self-removal is the point: leaving an hourly job behind to guard against a
  # limit that has already cleared is exactly the kind of quiet recurring cost
  # this repo tries not to accumulate.
  launchctl bootout "gui/$(id -u)/${AGENT}" 2>/dev/null || true
  rm -f "$HOME/Library/LaunchAgents/${AGENT}.plist"
  exit 0
fi

log "production is behind, firing the deploy hook"
RESP="$(curl -fsS --max-time 30 -X POST "$HOOK" || true)"
log "hook response: ${RESP:-<none>}"
# A queued job is not a build. If the limit is still in force the job is dropped
# silently, this run changes nothing, and the next run tries again.
