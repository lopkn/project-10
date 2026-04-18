#!/bin/bash

CONTAINER="beautiful_turing"

docker logs --tail 0 -f beautiful_turing | while read LINE; do

        # Send the push notification
        curl -d "$LINE" "ntfy.sh/Lopkn_mc"

done
