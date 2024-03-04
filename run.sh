node -e "$(cat server.js)" -i 1>public/debug/errorlog3.txt 2>&1;
sleep 5;
node server.js;
sleep 10;
node server.js;
sleep 10;
node server.js;
sleep 10;
node server.js;