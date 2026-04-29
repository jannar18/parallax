#!/usr/bin/env bash
# new-lattice-worktree.sh — create a sibling git worktree wired to the primary
# checkout's shared .lattice/ directory, per the Lattice worktree protocol
# (~/.claude/skills/lattice/references/worktree-guide.md).
#
# Usage:
#   scripts/new-lattice-worktree.sh ASMV-96 mobile-nav-reorder
#
# Effect:
#   - Creates ../worktree-ASMV-96/ as a sibling directory
#   - Creates branch feature/ASMV-96-mobile-nav-reorder
#   - Prints the LATTICE_ROOT export and the cd command to enter it
#
# After running this, paste the printed export + cd lines into the agent shell
# that will work on the task. All `lattice` commands from inside that worktree
# write to the primary checkout's shared .lattice/, so the board stays
# coherent across parallel agents.

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: $0 <task-id> <slug>" >&2
  echo "  e.g.: $0 ASMV-96 mobile-nav-reorder" >&2
  exit 1
fi

TASK_ID="$1"
SLUG="$2"
BRANCH="feature/${TASK_ID}-${SLUG}"
WORKTREE_DIR="../worktree-${TASK_ID}"

PRIMARY="$(git rev-parse --show-toplevel)"
LATTICE_DIR="${PRIMARY}/.lattice"

if [[ ! -d "${LATTICE_DIR}" ]]; then
  echo "error: ${LATTICE_DIR} does not exist — run from the primary checkout" >&2
  exit 1
fi

if [[ -e "${PRIMARY}/${WORKTREE_DIR}" ]] || git worktree list | grep -q "worktree-${TASK_ID}"; then
  echo "error: worktree-${TASK_ID} already exists" >&2
  exit 1
fi

(cd "${PRIMARY}" && git worktree add "${WORKTREE_DIR}" -b "${BRANCH}")

ABS_PRIMARY="$(cd "${PRIMARY}" && pwd)"
ABS_WORKTREE="$(cd "${PRIMARY}/${WORKTREE_DIR}" && pwd)"

cat <<EOF

worktree ready: ${ABS_WORKTREE}
branch:         ${BRANCH}

run these in the agent's shell:

  export LATTICE_ROOT="${ABS_PRIMARY}"
  cd "${ABS_WORKTREE}"

then verify:

  lattice list | head -3   # should show the same tasks as the primary checkout

when the task is done, from the primary checkout:

  git worktree remove "${WORKTREE_DIR}"
  git branch -d ${BRANCH}   # only after the PR has merged
EOF
