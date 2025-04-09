const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
    console.log(`Received message from ${remote.address}:${remote.port} - ${message}`);
});

server.bind(41234); // Bind to a port

setInterval(() => {
    const gyroscopeData = JSON.stringify({ x: Math.random(), y: Math.random(), z: Math.random() });
    server.send(gyroscopeData, 0, gyroscopeData.length, remote.port, remote.address);
}, 100); // Send data every 100ms
