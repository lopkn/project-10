
const INFUNCS = require("./funcs.js")

let myMath = INFUNCS.myMath
let vectorFuncs = INFUNCS.vectorFuncs
let vectorNormal = INFUNCS.vectorNormal
let	vectorNormalize = INFUNCS.vectorNormalize

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors')//jan7-2024
// var http = require('http')

var server = app.listen(3000);
// var server = http.createServer(app);
// server.listen(3000,"0.0.0.0",()=>{console.log(server.address().address + " port")})

app.use(cors()) //jan7-2024

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.post('/responder', (req, res) => {
    console.log('Got body:', req.body);
    responder.process1(req.body,res)
    // res.sendStatus(200);
})
console.log("server is opened: "+Date.now())
// console.log(perSeed.noise2D(0.2,0,0))
// console.log("seeds: " + JSON.stringify(perSeeds))


var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection)
function newConnection(socket){
	// socket.on('requestMap', sendMap)
	socket.on("JOINGAME",(e)=>{joinGame(e,socket)})
}

function joinGame(game,socket){
	if(game == "G10.2"){
		socket.join("G10.2")
		io.to(socket.id).emit("acknowledge G10.2",socket.id)
		
		socket.on("initiate",(e)=>{shooter2C.initiatePlayer(socket.id,e)})
		socket.on("click",(e)=>{shooter2C.playerClick(e[0],e[1],e[2],e[3]);})
		socket.on("placeWall",(e)=>{shooter2C.placeWall(socket.id,e[0],e[1],e[2],e[3],e[4],e[5],e[6])})
		socket.on("keys",(e)=>{shooter2C.playerKeyUpdate(e)})
		socket.on("joys",(e)=>{shooter2C.playerKeyUpdate(e,2,socket.id)})
		socket.on('disconnect',()=>{shooter2C.disconnect(socket)})
		let clientIp = socket.request.connection.remoteAddress
		if(clientIp == "::ffff:192.168.1.1" || clientIp == "::1" || clientIp == "::ffff:223.18.29.177"){
				shooter2C.keyholders[socket.id] = true
			}
	}
}


let s2cc = require("./s2c.js")

let shooter2C = s2cc.shooter2C	
shooter2C.setio(io,myMath)

setInterval(()=>{shooter2C.repeat()},50)