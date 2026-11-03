#!/usr/bin/env bash
# Ship the last commit from this PC to the server, then migrate, rebuild and restart
# there. For a server that can't pull from GitHub. Run from Git Bash, anywhere in the repo:
#   deploy/push.sh
# The restart at the end asks for the dawr password, unless the server has
# /etc/sudoers.d/dawr-restart (see docs/vultr.md).
set -euo pipefail
SERVER="${DAWR_SERVER:-dawr@45.63.100.246}"
cd "$(git rev-parse --show-toplevel)"

# Only committed code is sent, so say if anything is left out.
if [ -n "$(git status --porcelain)" ]; then
  echo "Note: uncommitted changes are not sent. Shipping $(git rev-parse --short HEAD) as committed."
fi
rev=$(git rev-parse --short HEAD)

echo "Sending $rev to $SERVER..."
git archive --format=tar HEAD | ssh "$SERVER" "rm -rf ~/app.incoming && mkdir ~/app.incoming && tar -x -C ~/app.incoming"

# Copy over the running code: --delete drops files removed from the repo, while
# the secrets, installed packages and the current build stay until update.sh
# replaces them.
ssh "$SERVER" "rsync -a --delete \
    --exclude=/web/.env.production.local --exclude=/web/node_modules/ \
    --exclude=/web/.next/ --exclude=/web/next-env.d.ts --exclude=/DEPLOYED_FROM \
    ~/app.incoming/ ~/app/ && rm -rf ~/app.incoming && echo $rev > ~/app/DEPLOYED_FROM"

# -t so sudo can ask for the password.
ssh -t "$SERVER" "~/app/deploy/update.sh"
