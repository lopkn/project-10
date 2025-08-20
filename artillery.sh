sleep 4;
while true;
do 
	xdotool key slash; 
	sleep 0.2;
	xdotool key Up;
	sleep 0.2;
	xdotool key Return;
	sleep 0.1;
	xdotool keydown w;
	sleep 0.6;
	xdotool keyup w;
	start=$(date +%s%3N);
	end=$((start + 1000));  # Set the end time to 2 seconds from now

	#while [[ "$start" -lt "$end" ]]; do
    # Your code here
	#	start=$(date +%s%3N);
	#	xdotool mousemove_relative -- 0 -2;    
	#done
		xdotool mousemove_relative -- 0 -2;    
		xdotool mousemove_relative -- 0 -464;    
	sleep 0.1;
	xdotool mousedown 3; sleep 1.1; xdotool mouseup 3; sleep 0.2;
	xdotool mousedown 3; sleep 1.1; xdotool mouseup 3; sleep 0.2;
	xdotool mousedown 3; sleep 1.1; xdotool mouseup 3; sleep 0.2;

done
