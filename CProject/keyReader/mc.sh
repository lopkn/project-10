#!/usr/bin/env bash
set -eo pipefail

LOG_FILE="/home/lopkn/.minecraft/logs/latest.log"
MODEL="lopknbot4"

# 1. Grab the latest line and strip everything up to and including the last colon
RAW_LINE=$(tail -n 1 "$LOG_FILE")
PROMPT=$(printf '%s' "$RAW_LINE" | sed -E 's/.*:[[:space:]]*//' | tr -d '\r')

# If nothing was extracted, exit early
if [[ -z "$PROMPT" ]]; then
    echo "No valid prompt found on last line." >&2
    exit 0
fi

echo "Prompt: $PROMPT" >&2

# 2. Query Ollama directly in memory, strip newlines into spaces, trim edges
RESPONSE=$(ollama run "$MODEL" "$PROMPT" | tr '\n' ' ' | sed -E 's/[[:space:]]+$//')

# 3. Type into Minecraft
if [[ -n "$RESPONSE" ]]; then
    xdotool type -- "$RESPONSE"
    echo "===TYPED: $RESPONSE==="
else
    echo "Ollama returned an empty response." >&2
fi
