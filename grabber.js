const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to log IP addresses for requests to /images/test.gif
app.use('/images/test.gif', (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`Request for test.gif from IP: ${ip}`);
    next(); // Pass control to the next middleware
});

// Serve the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});