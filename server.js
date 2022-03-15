

var players = []
var map = []
var generatedChunks = {}
var chunkSize = 20
const fs = require('fs');
var perlin2 = require('./perlin')
var perlin = require('simplex-noise')
var ticktoggle = 0


// fs.writeFile('./memory.json',inp, function writeJSON(err){if(err)return console.log(err)})

var CURRENTCONFIGS = require("./config")
var playerList = require("./playerList")

var cmdc = {"success":"#00C000","error":"#FF0000","small_error":"#FFCFCF","item":"#FFFF00","combat":"#FF8800"}

var promiseChunks = {}

var consoleKey = "216"


var pping = 0
var startPing = 0


function ping(e){
	io.to(players[e].id).emit('PING')
	startPing = 1
}

perSeed = new perlin(164.44)


class player{
	constructor(id){
		this.id = id
		this.x = Math.floor(Math.random()*7)
		this.y = Math.floor(Math.random()*7)
		this.chunk = {"x":0,"y":0}
		this.selectedSlot = 0
		this.Inventory = ["B1-50","B2-40","U2-100",""]
		this.effects = []
		this.inCombat = false
		this.hp = 100
		
	}
	say(e){
		for(let i = 0; i < players.length; i++){
			if(distance(players[i].x,players[i].y,this.x,this.y) < 33){
				io.to(players[i].id).emit("chat",[(this.name ? this.name : this.id),e,this.x,this.y])
			}


		}
	}


	save(){
		if(this.name != undefined){
			let n = this.name
			playerList[n].x = this.x
			playerList[n].y = this.y
			playerList[n].chunk = this.chunk
			playerList[n].selectedSlot = this.selectedSlot
			playerList[n].Inventory = this.Inventory
		}
	}





	login(n,p){
		if(n.length > 10){
			this.log(CURRENTCONFIGS.ConsoleResponses.IGNLong,cmdc.error)
			return;
		}
		if(p.length > 3){
			this.log(CURRENTCONFIGS.ConsoleResponses.PsswdLong,cmdc.error)
			return;
		}
		if(playerList[n] == undefined){
				if(this.name == undefined){
				playerList[n] = {"psswd":p}
				playerList[n].x = this.x
				playerList[n].y = this.y
				playerList[n].chunk = this.chunk
				playerList[n].selectedSlot = this.selectedSlot
				playerList[n].Inventory = this.Inventory
				this.name = n
				this.log("successfully created account named "+n,cmdc.success)
			} else {
				this.log(CURRENTCONFIGS.ConsoleResponses.AlreadyLoggedIn,cmdc.error)
			}
		} else {
			for(let i = 0; i < players.length; i++){
				if(players[i].name == n){
					this.log("Player with this account is online right now!",cmdc.error)
					return;
				}
			}
			if(playerList[n].psswd == p){
				this.x = playerList[n].x
				this.y = playerList[n].y
				this.chunk = playerList[n].chunk
				this.selectedSlot = playerList[n].selectedSlot
				this.Inventory = playerList[n].Inventory
				this.name = n
				this.log("successfully logged in as "+n,cmdc.success)
				this.invrelay()
			} else {
				if(this.name == undefined){
					this.log("account is already taken/incorrect password for account "+n,cmdc.error)
				} else {
					this.log("wrong password",cmdc.small_error)
				}
			}
		}

	}

	log(e,c){
		let pe = "<span style='color:"+c+";'>" + e + "</span>"
		io.to(this.id).emit("chat",[">",pe,0,0])
	}


	update(){
		this.chunk = CoordToChunk(this.x,this.y)
	}
	pressed(i){
		if(i == "w"){
			let t = CoordToMap(this.x,this.y-1)
			if(!alreadyHasBlock(map[t[0]][t[1]][2])){
			this.y -= 1}
		}
		if(i == "s"){
			let t = CoordToMap(this.x,this.y+1)
			if(!alreadyHasBlock(map[t[0]][t[1]][2])){
			this.y += 1}
		}
		if(i == "a"){
			let t = CoordToMap(this.x-1,this.y)
			if(!alreadyHasBlock(map[t[0]][t[1]][2])){
			this.x -= 1}
		}
		if(i == "d"){
			let t = CoordToMap(this.x+1,this.y)
			if(!alreadyHasBlock(map[t[0]][t[1]][2])){
			this.x += 1}
		}
	}
	relay(){
		io.to(this.id).emit('relay',[this.x,this.y,this.chunk])
		let tmap = [];
		for(let i = 0; i < map.length; i++){
			if(distance(map[i][0]*20+10,map[i][1]*20+10,this.x,this.y)<49){
				tmap.push(map[i])
			}
		}
		let t = []
		for(let i = 0; i < players.length; i++){
			if(distance(players[i].x,players[i].y,this.x,this.y) < 33 && players[i].id != this.id){
				t.push([players[i].x,players[i].y])
			}
		}
		io.to(this.id).emit('mapUpdate',[tmap,t])


	}
	relay2(){
		io.to(this.id).emit('relay',[this.x,this.y,this.chunk])
		let tmap = [];
		let tmap2 = {}
		for(let i = 0; i < map.length; i++){
			if(distance(map[i][0]*20+10,map[i][1]*20+10,this.x,this.y)<49){
				let sS = [map[i][0],map[i][1],map[i][2]]
				for(let j = 3; j < map[i].length; j ++){
					
					let xx = map[i][j][0] + sS[0]*chunkSize
					let yy = map[i][j][1] + sS[1]*chunkSize
					if(inRect(xx,yy,this.x-27,this.y-27,53,53)){
						tmap.push(xx+","+yy)
						tmap2[xx+","+yy] = map[i][j][2]
					}


				}
			}
		}

if(inEffectArr("blind1",this.effects)){
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x+20,this.y+axx)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet >0){
									if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$" + yet} else {
						let tempeee = parseInt(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = removeFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$" + tempeee
					}
				} if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x+axx,this.y+20)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet > 0){
									if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$" + yet} else {
						let tempeee = parseInt(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = removeFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$" + tempeee
					}
				}  if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x-20,this.y+axx)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet > 0){
									if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$"+yet} else {
						let tempeee = parseInt(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = removeFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$" + tempeee
					}
				} if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x+axx,this.y-20)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet > 0){
					if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$" + yet} else {
						let tempeee = parseInt(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = removeFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$" + tempeee
					}
				}  if(ATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	}



		let t = []
		for(let i = 0; i < players.length; i++){
			if(distance(players[i].x,players[i].y,this.x,this.y) < 33 && players[i].id != this.id){
				t.push([players[i].x,players[i].y])
			}
		}
		io.to(this.id).emit('mapUpdate2',[tmap,t,tmap2])

	}



	combatRelay(close){
		io.to(this.id).emit('comrelay',[this.hp,close])
	}

	invrelay(){
		io.to(this.id).emit('invrelay',[this.Inventory])
	}
}








function inRect(x,y,rx,ry,w,h){
	if(x >= rx && y >= ry && x <= rx+w && y <= ry + h){
		return(true)
	}
	return(false)
}




function retInsideLine(x,y,x1,y1){
	let fout = []
	let dx = x1 - x
	if(dx != 0){
	let slope = (y1-y)/(dx)
	let dist = distance(x,y,x1,y1)

	for(let i = 1; i < 21; i++){
		let e = x+i*dx/20
		fout.push([Math.round(e),Math.round(y + (e-x)*slope)])
	}


	} else {
		slope = y1 > y ? 1 : -1
		for(let i = 1; i < 21; i++){
		fout.push([x,y + i*slope])
		}
	}

	return(fout)

}





function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}


///////////////////////////////////////////////////////////////
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

console.log("server is opened")
console.log(perSeed.noise2D(0.2,0,0))






var socket = require('socket.io');

var io = socket(server);

// socket = io("https://home.unsown.top")

io.sockets.on('connection', newConnection)





function newConnection(socket){
	// socket.on('requestMap', sendMap)
	// socket.on('key', processKey)
	// socket.on('click', processClick)
	// socket.on('selectInventorySlot', selectSlot)
	socket.on('AT',ACTIONPROCESS)
	socket.on("returnPing",STOPPING)
	console.log(socket.id + " has joined at " + Date())
	broadcast(socket.id+" has joined!",cmdc.item)
	players.push(new player(socket.id))
	players[findPlayerInArr(socket.id)].log(CURRENTCONFIGS.ConsoleResponses.Help1,"#A000FF")
	io.to(socket.id).emit('sendWhenJoin', socket.id)
	players[players.length-1].relay2()
	    socket.on('disconnect', function () {
        console.log(socket.id + " has disconnected");
        broadcast(socket.id+" has left!",cmdc.small_error)
        for(let i = 0; i < players.length; i++){
        	if(players[i].id == socket.id){
        		players.splice(i,1)
        		break
        	}
        }
    });
}


function allPlayersGenerateChunks(){
		let ps = players
	for(let p = 0; p < ps.length; p++){


			players[p].update()
	for(let i = -1; i < 2; i++){
		for(let j = -1; j < 2; j++){
			try{
			if(generatedChunks[(ps[p].chunk.x+j)+","+(ps[p].chunk.y+i)] == undefined){
				GenerateChunk(ps[p].chunk.x+j,ps[p].chunk.y+i)
			}}
			catch(err){
				console.log(ps,err)
				break
			}
		}	
	}

		players[p].relay2()
}
}
var TIME = 60
function doSomething(){
	if(TIME < 80){
		TIME += 1
		io.emit('TIME',TIME)
	} else if(TIME == 80){
		allPlayersGenerateChunks()
		TIME += 1
		io.emit('TICK')
		if(ticktoggle == 1){
		console.log("tick")
	}
	} else if(TIME < 90){
		TIME += 1
	} else if(TIME == 90){

		TIME = getLongestPlayerAction() * -1
	}
	if(TIME < 0 && TIME % 1 === 0){
		processPlayersActions()
		allPlayersGenerateChunks()
	}else if(TIME == 0){
		ProcessStep = 1
		for(let i = 0; i < players.length; i++){
			players[i].save()
		}
		playersCollectiveActions = []

		allEffectTick()



	}
	
}



setInterval(function(){ 
    doSomething()
}, 100);


setInterval(function(){if(startPing == 1){pping++}},1)




function tellPerlin(x,y){
	console.log(perSeed.noise2D(x/100,y/100,0))
}


/////////////////////////////////////////////////////////////
//game functions//===================================================================================



function allEffectTick(){
	for(let i = 0; i < players.length; i++){
		for(let j = players[i].effects.length-1; j > -1 ; j--){
			players[i].effects[j][1] -= 1
			if(players[i].effects[j][1] < 1){
				players[i].effects.splice(j,1)
			}
		}
	}
}










var playersCollectiveActions = []
function ACTIONPROCESS(e){
	playersCollectiveActions.push(e)
}

var ProcessStep = 1

function processPlayersActions(){
	let mx = 0
	for(let i = 0; i < playersCollectiveActions.length; i++){
		if(playersCollectiveActions[i][ProcessStep] != undefined){
			let STEP = playersCollectiveActions[i][ProcessStep]
			CompleteActionStep(playersCollectiveActions[i][0],STEP)
			CompleteCombatSimul()
		}
	}
	ProcessStep += 1
}
// [["ID",stuff,stuff] []]

function getLongestPlayerAction(){
		let mx = 0
		let pca = playersCollectiveActions
	for(let i = 0; i < pca.length; i++){
		if(pca[i][1] != undefined && pca[i].length - 1 > mx){

		if(pca[i].length > 20){
			playersCollectiveActions[i] = pca[i].splice(0,21)
		}

		if(pca[i].length >= 20){
			mx = 20
			break
		}
		
		mx = pca[i].length
		}
	}
	return(mx)
}






function CompleteActionStep(p,s){
	let r = findPlayerInArr(p)


	if(typeof(s) == "string" && s.length == 1){
		//if action is key
		processKey([p,s])
	} else if(typeof(s) == "string" && s[0] == "$"){
		s = s.substring(1)
		processCommand(r,s)



	} else {
		if(s[0] == "click"){
			//if action is click
			processClick([p,s[1],s[2]])
		} else if(s[0] == "sel"){
			//if action is select
			selectSlot([p,s[1]])
		} else if(s[0] == "com"){
			combatProcess(p,s[1])
		}
	}
}








function processCommand(p,st){
	//if is command
if(st[0] == "/"){
	let str = st.substring(1)
	let strsplit = str.split(" ")
	//command say
	if(str[0] == "S" || str[0] == "s"){
		let fstr = str
		if(str[1] == " "){
			fstr = fstr.substring(2)
		} else {fstr = fstr.substring(1)}

		players[p].say(fstr)
	} 
	//help command
	else if(str[0] == "H" || str[0] == "h"){
		helpCommand(strsplit,p)
	}
	//setblock command
	else if(strsplit[0] == "set" && players[p].keyholder == true){
		setblock(parseInt(strsplit[1]),parseInt(strsplit[2]),strsplit[3])
	}

	//give command
		else if(strsplit[0] == "give" && players[p].keyholder == true){
		give(p,parseInt(strsplit[1]),strsplit[2])
	}
	//tp command
		else if(strsplit[0] == "tp" && players[p].keyholder == true){
		tp(p,strsplit[1],strsplit[2])
	}
	//playerno command
		else if(strsplit[0] == "pno"){
		ArrLoc(p)
	}

	//login command

		else if(strsplit[0] == "login"){
		players[p].login(strsplit[1],strsplit[2])
		updatePlayerFile()
	}
	//permissions command
		else if(strsplit[0] == "keyholder"){
			if(strsplit[1] == consoleKey){
				players[p].keyholder = true
				players[p].log("you are now a keyholder",cmdc.success)
			} else {
				players[p].log("wrong key!",cmdc.error)
			}
	}


	//unrecognized command
	else{
		console.log(strsplit)
		players[p].log("Invalid command.</br> If you think this should be a command, tell me your idea in discord. (lopkn#0019)","#FF0000")
	}


} else {
	//normal say
	if(st[0] == " "){
		st = st.substring(1)
	}
	players[p].say(st)

}


}

function updatePlayerFile(){
fs.writeFile('./playerList.json',JSON.stringify(playerList,null,4), function writeJSON(err){if(err)return console.log(err)})
}

function processKey(e){
	let i = findPlayerInArr(e[0])
	if(i === false){
		console.log(i)
	} else {
		players[i].pressed(e[1])
	}
}
function processClick(e){
	let r = findPlayerInArr(e[0])
	let chunkPos = generatedChunks[e[1].x + "," + e[1].y]
	let item = selectedSlotItems(e[0])
	let a = parseInt(amountOfItems(e[0]))
	let att = ATTRIBUTEOF(item,"B")

	let decodedXY = rCoordToChunk(e[1])
	
	for(let i = 0; i < players.length; i++){
		if(i != r && decodedXY.x == players[i].x && decodedXY.y == players[i].y && !players[i].inCombat && !players[r].inCombat){
			allCombatInstances[JSON.stringify(combatIdCounter)] = new combatInstance(players[r].id,players[i].id)
			console.log("new combat instance: " +players[r].id+","+players[i].id)
			players[r].combatRelay(true)
			players[i].combatRelay(true)
			players[r].log((players[i].name ? players[i].name : players[i].id)+" has entered combat with you!",cmdc.combat)
			players[i].log((players[r].name ? players[r].name : players[r].id)+" has entered combat with you!",cmdc.combat)

		}


	}




	if(att != "NONE" && a > 0){
		if(!alreadyHasBlock(map[chunkPos][e[2]][2])){
			
			if(distance(decodedXY.x,decodedXY.y,players[r].x,players[r].y) <= 12){
				map[chunkPos][e[2]][2] += "-B" + att
				removeItemFromSelected(e[0],1)
			} else {
				players[r].log("you are too far away to place a block there!",cmdc.small_error)
			}

		}
	} else {
		if(alreadyHasBlock(map[chunkPos][e[2]][2]) && ATTRIBUTEOF(item,"U") != "NONE"){
			// 
			let seeBreak = breakBlockBy(map[chunkPos][e[2]][2],25+Math.floor(Math.random()*10-5))
			if(seeBreak == "remove"){
				give(r,1,"B"+ATTRIBUTEOF(map[chunkPos][e[2]][2],"B"))
				map[chunkPos][e[2]][2] = removeFromTile(removeFromTile(removeFromTile(map[chunkPos][e[2]][2],"B"),"D"),"T")
			} else {
				map[chunkPos][e[2]][2] = seeBreak
			}
		}
	}
}







function helpCommand(e,p){
	
	if(e[1] != undefined){
		e[1] = e[1].toLowerCase()
	}
	if(e[1] == "1" || e[1] == undefined || e[1] == "game" || e[1] == "general"){
		players[p].log(CURRENTCONFIGS.ConsoleResponses.Help1,"#A000FF")
	} else if(e[1] == "2" || e[1] == "list" || e[1] == "content"){
		players[p].log(CURRENTCONFIGS.ConsoleResponses.Help2,"#FFFF00")
	} else if(e[1] == "3" || e[1] == "buffer"){
		players[p].log(CURRENTCONFIGS.ConsoleResponses.Help3,"#FFFF00")
	} else if(e[1] == "4" || e[1] == "tick" || e[1] == "ticks" || e[1] == "movement" || e[1] == "move"){
		players[p].log(CURRENTCONFIGS.ConsoleResponses.Help4,"#FFFF00")
	} else if(e[1] == "5" || e[1] == "text" || e[1] == "input"){
		players[p].log(CURRENTCONFIGS.ConsoleResponses.Help5,"#FFFF00")
	} else {
		players[p].log("Invalid help option.</br> If you think players would need help with this, tell me your idea in discord. (lopkn#0019)","#FF0000")
	}
}











function breakBlockBy(str,a){

  let split = str.split("-")
  let e = -1
  let ee = 0
  let fin = ""
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == "D"){
      e = parseInt(split[i].substring(1))
    }else if(split[i][0] == "B"){
      ee = BLOCKSALL[split[i].substring(1)][2]
      fin += "-" + split[i]
    } else {
    	fin += "-" + split[i]
    }
  }
  if(e == -1 || ee == e){
  	e = ee
  }
  let durability = e - a

  if(durability > 0){
  fin += ("-D"+durability)
  return(fin.substring(1))
	} else{
		return("remove")
	}
}



function broadcast(s,e){
	for(let i = 0; i < players.length; i++){
		players[i].log(s,e)
	}
}



function removeItemFromSelected(p,a){
	let e = findPlayerInArr(p)
	let player = players[e]
	let original = player.Inventory[player.selectedSlot]
	let split = original.split("-")
	let aa = (parseInt(split[1])-a)
	if(aa > 0){	players[e].Inventory[player.selectedSlot] = split[0]+"-"+aa}else{
		players[e].Inventory[player.selectedSlot] = "empty"
	}
	players[e].invrelay()
}


function selectSlot(e){
	let i = findPlayerInArr(e[0])
	if(i === false){
		console.log(i)
	} else {
		players[i].selectedSlot = (e[1])
	}
}


function removeFromTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){
		if(split[i][0] != type){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
}
function keepOnlyTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){
		if(split[i][0] == type){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
}




function GenerateChunk(x,y){
	let t = [x,y,"buffer"]
	for(let i = 0; i < chunkSize; i++){
		for(let j = 0; j < chunkSize; j++){
			let value =200+perSeed.noise2D((0.2+j+x*chunkSize)/199.7,(0.2+i+y*chunkSize)/199.7)*200
			t.push([j,i,generateTileFromNumber(value,0)])
		}
	}
	map.push(t)
	let ee = x+","+y
	generatedChunks[ee] = (map.length-1)

	if(promiseChunks[ee] != undefined){
		for(let i = 0; i < promiseChunks[ee].length; i++){
			setBlock(promiseChunks[ee][i][0],promiseChunks[ee][i][1],promiseChunks[ee][i][2])
		}
	}
}



///put in coordinates to find the coordinate's chunk. returns in Dict
function CoordToChunk(x,y){
	return({"x":Math.floor(x/chunkSize),"y":Math.floor(y/chunkSize),"cx":x%chunkSize,"cy":y%chunkSize})
}

function rCoordToChunk(i){
	let a = i.x * chunkSize + i.cx
	let b = i.y * chunkSize + i.cy


	return{"x":a,"y":b}
}




function generateStructure(st,x,y){
	let structure = CURRENTCONFIGS.Structures[st]
	let ctm = CoordToMap(x,y)
	let a = structure[0]
	for(let i = 1; i < structure.length; i++){
		let j = i-1
		setBlock(x+j - Math.floor(j/a)*a,y+Math.floor(j/a),structure[i])
	}

}




function setBlock(x,y,block){
	let ctm = CoordToMap(x,y)

	if(ctm[0] != undefined){
		map[ctm[0]][ctm[1]][2] = keepOnlyTile(map[ctm[0]][ctm[1]][2],"G")
			if(block != ""){
				map[ctm[0]][ctm[1]][2] += "-" + block
			}
		} else {
			let ctc = CoordToChunk(x,y)
			let coord = ctc.x+","+ctc.y
			if(promiseChunks[coord] == undefined){
				promiseChunks[coord] = [[x,y,block]]
			} else {
				promiseChunks[coord].push([x,y,block])
			}
		}
}


function setblock(x,y,block){
	let ctm = CoordToMap(x,y)
	map[ctm[0]][ctm[1]][2] = block
}



function give(p,amount,item){
	for(let i = 0; i < players[p].Inventory.length; i++){
		let t = players[p].Inventory[i].split("-")
		if(t[0] == item){
			players[p].Inventory[i] = addToItem(players[p].Inventory[i],amount)
			players[p].invrelay()
			return("1")
		}
	}
	for(let i = 0; i < players[p].Inventory.length; i++){
		if(players[p].Inventory[i] == "" || players[p].Inventory[i] == undefined){
			players[p].Inventory[i] = (item + "-" + amount)
			players[p].invrelay()
			return("2")
		}
	}
}

function ArrLoc(p){
	players[p].log("you are player "+p,cmdc.success)
}

function tp(r,i1,i2){
	if(i2 == undefined){
		let temp = findPlayerString(i1)
		if(temp !== false){
			players[r].x = players[temp].x
			players[r].y = players[temp].y
			players[r].log("successfully teleported to P:"+temp,cmdc.success)
		} else {
			players[r].log("cannot teleport to P:"+i1,cmdc.error)
		}


	} else if(parseInt(i1) != NaN && parseInt(i2) != NaN){
		players[r].x = parseInt(i1)
		players[r].y = parseInt(i2)
		players[r].log("successfully teleported to "+i1+","+i2,cmdc.success)
	}

}









function addToItem(str,amount){
	let split = str.split("-")
	let fout = ''
	let a = parseInt(split[split.length-1])+amount
	for(let i = 0; i < split.length -1; i++){
		fout += ("-" + split[i])
	}
	fout += ("-" + a )
	return(fout.substring(1))
}





function findPlayerString(e){
	if(e.length == 1 && parseInt(e) != NaN){
		return(parseInt(e))
	}
	if(findPlayerInArr(e) !== false){
		return(findPlayerInArr(e))
	}
	for(let i = 0; i < players.length; i++){
		if(players[i].name == e){
			return(i)
		}
	}
	return(false)


}


///inputs an array and an item, returns index of item in array, returns false if not in array
function inListR(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp == arr[i]){
      return(i)
    }
  } return(false)
}

//for effects
function inEffectArr(effect,arr){
	for(let i = 0; i < arr.length; i++){
		if(arr[i][0] == effect){
			return(true)
		}
	}
	return(false)
}


///input a player id to get its position in the array 
function findPlayerInArr(inp){
  for(let i = 0; i < players.length; i++){
    if(inp == players[i].id){
      return(i)
    }
  } return(false)
}


///inputs an array and an item, returns index of item in array's second item, returns false if not in array
function inListRS(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp[0] == arr[i][0] && inp[1] == arr[i][1] ){
      return(i)
    }
  } return(false)
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///input a attribute string and an attribute to find the value of the attribute
function ATTRIBUTEOF(str,e){
  if(str == undefined){return("NONE")}
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == e){
      return(split[i].substring(1))

    }
  }
  return("NONE")
}


function MasterTileDeparser(str){
  let split = str.split('-')
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < split.length; j++){
      if(split[j][0]==HeightMap[i]){
        let key = split[j].substring(1)
        if(HeightMap[i] == "B"){
          return(BLOCKSALL[key])
        }
        else if(HeightMap[i] == "G"){
          return(TILESALL[key])
        }


      }
    }


  }
}

///finds the durability of an attribute string, returns "full" if full
function deparseDurability(str){
  let split = str.split("-")
  let e = -1
  let ee = 0
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == "D"){
      e = parseInt(split[i].substring(1))
    }
    if(split[i][0] == "B"){
      ee = BLOCKSALL[split[i].substring(1)][2]
    }
  }
  if(e == -1 || ee == e){return("full")} else {return(e/ee)}
}






function deparseTileToColor(str){
  let split = str.split('-')
  let fin = ""
  for(let i = 0; i < split.length; i ++){
    //case ground
    if(split[i][0] == "G"){
      let read = split[i][1]
      fin += ("-G"+ColorTileReferenceDict[read])
    } else if(split[i][0] == "B"){
      let read = split[i][1]
      fin += ("-B"+BLOCKSALL[read][0])
    }
  }
  let finSplit = fin.split("-")
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < finSplit.length; j++){
      if(finSplit[j][0] == HeightMap[i]){
        return(finSplit[j].substring(1))
      }

    }
  }

}




function deparseTileToName(str){
  let split = str.split('-')
  let fin = ""
  for(let i = 0; i < split.length; i ++){
    //case ground
    if(split[i][0] == "G"){
      let read = split[i][1]
      fin += ("-G"+NameTileReferenceDict[read])
    } else if(split[i][0] == "B"){
      let read = split[i][1]
      fin += ("-B"+BLOCKSALL[read][1])
    }
  }
  let finSplit = fin.split("-")
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < finSplit.length; j++){
      if(finSplit[j][0] == HeightMap[i]){
        return(finSplit[j].substring(1))
      }

    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////

var BLOCKSALL = CURRENTCONFIGS.BLOCKSALL
var HeightMap = CURRENTCONFIGS.HeightMap






var TILESALL = CURRENTCONFIGS.TILESALL
var ColorTileReferenceDict = CURRENTCONFIGS.ColorTileReferenceDict
var NameTileReferenceDict = CURRENTCONFIGS.NameTileReferenceDict

//-------------------------------------------
function selectedSlotItems(p){
	let r = findPlayerInArr(p)
	let e = players[r].selectedSlot
	if(players[r].Inventory[e] != undefined){
		let split = players[r].Inventory[e].split('-')

		// if(itemType(split[0])=="block"){

		// }

		return(split[0])
	
	}
}


function itemType(i){
	if(i == 0){
		return("block")
	} else {return("none")}
}

function STOPPING(){
	startPing = 0
	console.log(pping)
	pping = 0
}



function alreadyHasBlock(str){
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == "B"){
      return(true)
    }
  }
  return(false)
}


function removeAcc(Acc){
	delete playerList[Acc]
	updatePlayerFile()
}


function generateTileFromNumber(input,e){
	if(e == 0){
		let tile = "G"
		if(input < 70){
			tile += "1"
		} else if(input < 120){
			tile += "2"
		} else if(input < 140){
			tile += "3"
		} else if(input < 150){
			tile += "4"
		} else if(input < 210){
			tile += "5"
		} else if(input < 260){
			tile += "6"
		} else if(input < 310){
			tile += "7"
		} else if(input < 335){
			tile += "8"
		} else if(input >= 335){
			tile += "9"
		}
		if(input >= 150 && input < 300){
			if(Math.random() > 1-input/30000){
				tile += "-B3-T1-S" + (Math.floor(Math.random()*3)+4)
			}
		}


			return(tile)
	}
}




function CoordToMap(x,y){
	let cx = Math.floor(x/chunkSize)
	let cy = Math.floor(y/chunkSize)
	let p = x-cx*chunkSize + (y-cy*chunkSize)*chunkSize + 3
	return([generatedChunks[cx+","+cy],p])
}



function amountOfItems(p){
	let r = findPlayerInArr(p)
	let player = players[r]
  if(player.Inventory[player.selectedSlot] != undefined){
    let e = player.Inventory[player.selectedSlot].split("-")
    return(e[1])
  } else {return("none")}
}

















//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



let allCombatInstancesA = []
let allCombatInstances = {}

let combatIdCounter = 1

class combatInstance{
	constructor(p1,p2){
		this.p1 = p1
		this.p2 = p2
		this.p1d = 0
		this.p2d = 0

		this.p1m = 1
		this.p2m = 1



		this.p1n = findPlayerInArr(p1)
		this.p2n = findPlayerInArr(p2)
		allCombatInstancesA.push(JSON.stringify(combatIdCounter))
		// this.comId = combatIdCounter
		players[this.p1n].inCombat = JSON.stringify(combatIdCounter)
		players[this.p2n].inCombat = JSON.stringify(combatIdCounter)
		combatIdCounter += 1
	}

	process(p,str){

		if(p == this.p1){
			console.log(p,str,1)
			let temp = this.process2(this.p1m,this.p2m,this.p1d,this.p2d,str)
			this.p1m = temp[0]
			this.p2m = temp[1]
			this.p1d = temp[2]
			this.p2d = temp[3]


		}
		if(p == this.p2){
			console.log(p,str,2)
			let temp = this.process2(this.p2m,this.p1m,this.p2d,this.p1d,str)
			this.p2m = temp[0]
			this.p1m = temp[1]
			this.p2d = temp[2]
			this.p1d = temp[3]



		}
	}


	process2(atkr,dfer,atkrn,dfern,str){
		console.log(str)
//punch
		if(str == "001"){
			dfern += 30
		}
//jab
		if(str == "002"){
			dfern += 30
		}
//kick
		if(str == "003"){
			dfern += 40
		}
//block
	if(str == "10"){
		atkr -= 0.3
	}


		return([atkr,dfer,atkrn,dfern,str])

	}





	simul(){
		players[this.p1n].hp -= (this.p1d * this.p1m)
		players[this.p2n].hp -= (this.p2d * this.p2m)

		players[this.p1n].combatRelay()
		players[this.p2n].combatRelay()

		this.p1d = 0
		this.p2d = 0

		this.p1m = 1
		this.p2m = 1
	}


	end(){
		if(players[this.p1n] != undefined){
		players[this.p1n].inCombat = false
		players[this.p1n].combatRelay(false)}
		players[this.p2n].inCombat = false
		players[this.p2n].combatRelay(false)


	}

}




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!











function combatProcess(p,str){

	let r = findPlayerInArr(p)
	if(r !== false && players[r].inCombat){

		allCombatInstances[players[r].inCombat].process(p,str)

	}
}



function CompleteCombatSimul(){
	for(let i = 0; i < allCombatInstancesA.length; i++){
		allCombatInstances[allCombatInstancesA[i]].simul()
	}
}



function endCombatInstance(str){
	allCombatInstances[str].end()


	for(let i = allCombatInstancesA.length - 1; i > -1; i--){
		if(allCombatInstancesA[i] == str){
			allCombatInstancesA.splice(i,1)
			break;
		}
	}

	delete allCombatInstances[str]


}





















//game functions end//===============================================================================