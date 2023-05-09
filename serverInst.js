var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
})
var socket = require('socket.io');
var io = socket(server);
console.log("server is opened")

const Instagram = require('instagram-web-api')



client.login().then(()=>{
    client.getProfile().then(console.log("hey??"))
})