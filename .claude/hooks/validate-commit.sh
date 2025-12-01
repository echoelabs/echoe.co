#!/bin/bash
# Block commits mentioning "claude" or "anthropic" in commit messages

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check git commit commands
if [[ "$COMMAND" == *"git commit"* ]]; then
  # Case-insensitive check for claude/anthropic in the command
  if echo "$COMMAND" | grep -iqE "(claude|anthropic|Generated with|Co-Authored-By:.*Claude)"; then
    echo "Blocked: Commit message cannot mention Claude or Anthropic" >&2
    echo "Remove any AI attribution from your commit message" >&2
    exit 2
  fi
fi

exit 0
