sleep 4;
AWID=$(xprop -root _NET_ACTIVE_WINDOW | awk '{print $NF}')
while true;
do 
	xdotool mousedown 3; sleep 1.1; xdotool mouseup 3; sleep 0.2;
done
