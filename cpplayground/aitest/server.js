const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
// Create an HTTP server to wrap the Express app, allowing Express and WebSockets to share the same port
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static client files from a "public" directory
app.use(express.static('public'));

// Crucial: Capture the body as a raw binary Buffer up to 50MB
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));

let floatArr = [];

app.post('/stream-data', (req, res) => {
    const buffer = req.body; // This is a Node.js Buffer

    if (!buffer || buffer.length === 0) {
        return res.status(400).send('No data received');
    }

    // Zero-copy: Instantly interpret the raw bytes as standard 32-bit floats
    const floats = new Float32Array(
        buffer.buffer, 
        buffer.byteOffset, 
        buffer.byteLength / Float32Array.BYTES_PER_ELEMENT
    );

    // Process your data
    console.log(`Received ${floats.length} floats. First value: ${floats[0]}`);
    floatArr.push(floats);

    // Broadcast the raw binary buffer directly to all connected WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(buffer); 
        }
    });

    // Instantly reply 200 so C++ can send the next batch
    res.sendStatus(200);
});

// Handle WebSocket client connections (optional logging/initialization)
wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    
    // Optional: If you want new clients to get all historical data upon connecting:
    // floatArr.forEach(floats => ws.send(floats.buffer));

    ws.on('close', () => console.log('Client disconnected'));
});

server.listen(3000, () => console.log('JS Server listening on port 3000'));