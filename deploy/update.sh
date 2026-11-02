#!/usr/bin/env bash
# Migrate, rebuild, restart. Run as the dawr user. In a git checkout it pulls the
# latest code first; a copy sent by deploy/push.sh is already up to date.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -d .git ]; then
  git pull --ff-only
  git rev-parse --short HEAD > DEPLOYED_FROM
fi
cd web
npm ci
npm run db:migrate
npm run build
sudo systemctl restart dawr
echo "Updated to $(cat ../DEPLOYED_FROM)."
