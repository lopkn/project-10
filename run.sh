node -e "$(cat server.js)" -i 1>errorlog2.txt 2>&1;
sleep 10;
node server.js;
sleep 10;
node server.js &> errorlog2.txt;
sleep 10;
node server.js;
sleep 10;
node server.js;