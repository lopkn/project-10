#!/bin/bash

echo "Snooping D-Bus for Claude notifications... (Press Ctrl+C to stop)"

# Monitor the freedesktop Notification interface
dbus-monitor "interface='org.freedesktop.Notifications',member='Notify'" | \
while read -r line; do
    
    # Check if the notification block contains "Claude"
    # --line-buffered ensures the script handles the stream immediately without lagging
    if echo "$line" | grep --line-buffered -iq "claude"; then
        
        echo ":bell: Claude notification detected! Triggering script..."
        
        # ========================================================
        # PLACE YOUR CUSTOM BASH SCRIPT OR COMMAND HERE
        # ========================================================
        # Example 1: Loud Sound
        curl -d "DONE WITH JOB" "ntfy.sh/Lopkn_mc"
        sleep 3
    fi
done
