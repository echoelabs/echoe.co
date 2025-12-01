#!/bin/bash
# Enforce PR template format when creating PRs

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check gh pr create commands
if [[ "$COMMAND" == *"gh pr create"* ]]; then
  MISSING=""

  # Check for required sections
  if [[ "$COMMAND" != *"## Summary"* ]]; then
    MISSING="${MISSING}## Summary, "
  fi

  if [[ "$COMMAND" != *"## Type of Change"* ]]; then
    MISSING="${MISSING}## Type of Change, "
  fi

  if [[ "$COMMAND" != *"## Testing"* ]]; then
    MISSING="${MISSING}## Testing, "
  fi

  # Also block claude mentions in PR body
  if echo "$COMMAND" | grep -iqE "(claude|anthropic|Generated with|Co-Authored-By:.*Claude)"; then
    echo "Blocked: PR body cannot mention Claude or Anthropic" >&2
    exit 2
  fi

  if [[ -n "$MISSING" ]]; then
    MISSING="${MISSING%, }"
    echo "Blocked: PR body is missing required sections: $MISSING" >&2
    echo "Use the template from .github/PULL_REQUEST_TEMPLATE.md" >&2
    exit 2
  fi
fi

exit 0
