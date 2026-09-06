sleep 4;
AWID=$(xprop -root _NET_ACTIVE_WINDOW | awk '{print $NF}')
while true;
do 
        AWID2=$(xprop -root _NET_ACTIVE_WINDOW | awk '{print $NF}')
        if [[ "$AWID2" != "$AWID" ]]; then
		exit 0;
	fi
	xdotool mousedown 3; sleep $1; xdotool mouseup 3; sleep 0.1;
done
