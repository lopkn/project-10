#!/bin/sh
echo "using run.sh";
getconf ARG_MAX
date




node -e "$(cat server.js)" -i 1>public/debug/errorlog3.txt 2>&1;
date
echo "server crashed, reason:";
echo "$(cat public/debug/errorlog3.txt)"
echo "server crash 1, restarting in 5 seconds";

sleep 5;
node -e "$(cat server.js)"
echo "server crash 1.5, restarting in 5 seconds";
sleep 5;
node server.js;
echo "server crash 2, restarting in 10 seconds";
sleep 10;
node -e "$(cat server.js)" -i 1>public/debug/errorlog3.txt 2>&1;
echo "server crash 3, restarting in 5 seconds";
sleep 5;
node server.js;
echo "server crash 4, restarting in 10 seconds";
sleep 10;
node -e "$(cat server.js)" -i 1>public/debug/errorlog3.txt 2>&1;
echo "server crash 5, restarting in 5 seconds";
sleep 5;
node server.js;
echo "server crash 6, restarting in 10 seconds";
sleep 10;
node server.js;

