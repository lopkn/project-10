#!/bin/bash

CONTAINER="beautiful_turing"

docker logs --tail 0 -f beautiful_turing | while read LINE; do

        # Send the push notification
        if [[ "$LINE" == *"joined"* ]] || [[ "$LINE" == *"left"* ]] || [[ "$LINE" == *"Secure"* ]]; then
    		curl -d "$LINE" "ntfy.sh/Lopkn_mc"
	fi

done
