const fs = require('fs');

const process = require('process');

// ahdbakhbdhkabkb
console.log(`Process pid ${process.pid}`);


var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors')
const { exec } = require('child_process');

var server = app.listen(3000);


app.use(cors()) 

app.use(express.static('./'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.post('/responder', (req, res) => {
    console.log('Got body:', req.body);
    responder.process1(req.body,res)

})
console.log("server is opened: "+Date.now())





var socket = require('socket.io');
var io = socket(server);


io.sockets.on('connection', newConnection)

var shortValidationCode = Math.floor(Math.random()*1000)
console.log("new short validation code: " +shortValidationCode)

function newConnection(socket){
	// socket.on('requestMap', sendMap)
	socket.on("text",(a)=>{
		let e = a.text
		let enter = a.enter
		e.replaceAll('"',"quotes")
		if(a.enter){
		exec('xdotool type "'+e+'" && xdotool key Return')
	} else {
		exec('xdotool type "'+e+'"')
		//exec(echo "'tell application \"System Events\" to keystroke \"kelaterol\"' | osascript")
	}
		if(e[0] != " "){e = " "+e}
		fs.writeFileSync("textlog.txt","\n [" + Date.now()+"]" + e,{'flag':'a'}) 

	})
}