

var entities = []
var map = []
var usedIDs = {}
var generatedChunks = {}
var chunkSize = 20
const fs = require('fs');
// const uuidv4 = require("uuid/dist/v4")
var perlin2 = require('./perlin')
var perlin = require('simplex-noise')
var ticktoggle = 0


// fs.writeFile('./memory.json',inp, function writeJSON(err){if(err)return console.log(err)})

var CURRENTCONFIGS = require("./config")
var changingConfig = require("./changingConfig")
var playerList = require("./playerList")

var cmdc = {"success":"#00C000","error":"#FF0000","small_error":"#FFCFCF","item":"#FFFF00","combat":"#FF8800"}

var promiseChunks = {}

var consoleKey = "216"


var pping = 0
var startPing = 0


function ping(e){
	io.to(entities[e].id).emit('PING')
	startPing = 1
}

perSeed = new perlin(164.44)
class mob{
	constructor(type,x,y,id){
		this.entityType = type
		this.id = id
		this.x = x
		this.y = y
		this.chunk = {"x":0,"y":0}
		this.selectedSlot = 0
		this.Inventory = ["","B:2-A:40","U:2-A:100","Sl:1-A:30",""]
		this.effects = []
		this.inCombat = false
		this.entityStats = {
			"strength" : 1,
			"agility" : 1,
			"mana" : 1,
			"magic" : 1

		}

		if(type == "zombie"){
			this.hp = 60
		}else if(type == "rampant"){
			this.hp = 30
		}else if(type == "preponderant"){
			this.hp = 50
			this.entityStats.strength += 2
		} else {
			this.hp = 100
		}




	}
	say(){}
	nonPlayerActions(){
		let myAction = []
		myAction.push(this.id)

		if(this.entityType == "zombie"){
			let moveAmount = Math.random()*20
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",2,"a",2,"s",2,"d",2,["com","001"],1,["com","002"],1,"",10])
				myAction.push(tr)

			}
		} else if(this.entityType == "rampant"){
			let moveAmount = Math.random()*5 + 14
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",6,"a",6,"s",6,"d",6,["com","003"],1,["com","002"],1])
				myAction.push(tr)

			}
		} else if(this.entityType == "verdant"){

			if(Math.random() > 0.6 && this.inCombat == false){
				for(let i = 0; i < entities.length; i++){
					if(entities[i].entityType == "player" && distance(this.x,this.y,entity[i].x,entity[i].y) < 5){
						let a = coordToChunk(entities[i].x,entities[i].y)
						myAction.push(["click",a,a.cx + a.cy*chunkSize+3])

					}
				}


			}

			let moveAmount = Math.random()*19
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",1,"a",1,"s",1,"d",1,"",10])
				myAction.push(tr)

			}
		} else if(this.entityType == "preponderant"){

			if(Math.random() > 0.1 && this.inCombat == false){
				for(let i = 0; i < entities.length; i++){
					if(entities[i].entityType == "player" && distance(this.x,this.y,entity[i].x,entity[i].y) <= 3){
						let a = coordToChunk(entities[i].x,entities[i].y)
						myAction.push(["click",a,a.cx + a.cy*chunkSize+3])

					}
				}


			}

			if(this.inCombat == false){
			let moveAmount = Math.random()*12
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",1,"a",1,"s",1,"d",1,["com","003"],2,["com","002"],2,"",30])
				myAction.push(tr)

			}
			} else {
				let moveAmount = Math.random()*2 + 17
				for(let i = 0; i < moveAmount; i++){
					let tr = randomItem(["w",2,"a",2,"s",2,"d",2,["com","003"],1,["com","002"],1,["com","003"],1])
					myAction.push(tr)

				}
			}
		}



		ACTIONPROCESS(myAction)
	}
	relay2(){



	}
	combatRelay(){}
	invrelay(){}
	removeSelf(){
		for(let i = entities.length - 1; i > -1; i--){
			if(entities[i].id == this.id){
				entities.splice(i,1)
			}
		}
	}

	kill(){				
		
		if(this.hp <= 0 ){
			this.removeSelf()
		}
}
	save(){


	}
	pressed(i){

		if(this.hp <= 0 ){
			this.removeSelf()
			return;
		}


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
	log(){}
	update(){
this.chunk = CoordToChunk(this.x,this.y)
	}
}

class player{
	constructor(id){
		this.entityType = "player"
		this.id = id
		usedIDs[id] = true
		this.x = Math.floor(Math.random()*7)
		this.y = Math.floor(Math.random()*7)
		this.chunk = {"x":0,"y":0}
		this.selectedSlot = 0
		this.Inventory = ["B:7-A:50","B:2-A:40","U:2-A:100","Sl:1-A:30",""]
		this.effects = []
		this.inCombat = false
		this.hp = 100

		this.entityStats = {
			"strength" : 1,
			"agility" : 1,
			"mana" : 1,
			"magic" : 1

		}
		
	}
	say(e){
		for(let i = 0; i < entities.length; i++){
			if(distance(entities[i].x,entities[i].y,this.x,this.y) < 33){
				io.to(entities[i].id).emit("chat",[(this.name ? this.name : this.id),e,this.x,this.y])
			}


		}
	}

	kill(){

		if(this.hp <= 0 ){
			io.to(this.id).emit("DeathScreen")
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
				// broadcast("--"+this.id + " has created account "+n,cmdc.item)
			} else {
				this.log(CURRENTCONFIGS.ConsoleResponses.AlreadyLoggedIn,cmdc.error)
			}
		} else {
			for(let i = 0; i < entities.length; i++){
				if(entities[i].name == n && entities[i].name != this.name){
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
				// broadcast("--"+this.id + " has logged in as "+n,cmdc.item)
				this.invrelay()
			}  else if(n == this.name){
					playerList[n].psswd = p
					this.log("successfully changed password to "+p,cmdc.success)
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

	relay2(){
		io.to(this.id).emit('relay',[this.x,this.y,this.chunk])
		let tnpe = [];
		let tmap2 = {}
		for(let i = 0; i < map.length; i++){
			if(distance(map[i][0]*20+10,map[i][1]*20+10,this.x,this.y)<49){
				let sS = [map[i][0],map[i][1],map[i][2]]
				for(let j = 3; j < map[i].length; j ++){
					
					let xx = map[i][j][0] + sS[0]*chunkSize
					let yy = map[i][j][1] + sS[1]*chunkSize
					if(inRect(xx,yy,this.x-27,this.y-27,53,53)){
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
									if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + yet} else {
						let tempeee = parseInt(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = TNEWremoveFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + tempeee
					}
				} if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x+axx,this.y+20)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet > 0){
									if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + yet} else {
						let tempeee = parseInt(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = TNEWremoveFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + tempeee
					}
				}  if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x-20,this.y+axx)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet > 0){
									if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$:"+yet} else {
						let tempeee = parseInt(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = TNEWremoveFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + tempeee
					}
				} if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	for(let axx = -20; axx < 21; axx++){
			let ret = retInsideLine(this.x,this.y,this.x+axx,this.y-20)
			let yet = 0
			for(let i = 0; i < ret.length; i++){
				if(yet > 0){
					if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$") == "NONE"){
					tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + yet} else {
						let tempeee = parseInt(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"$")) + yet
						tmap2[ret[i][0]+","+ret[i][1]] = TNEWremoveFromTile(tmap2[ret[i][0]+","+ret[i][1]],"$")
						tmap2[ret[i][0]+","+ret[i][1]] += "-$:" + tempeee
					}
				}  if(TNEWATTRIBUTEOF(tmap2[ret[i][0]+","+ret[i][1]],"B") != "NONE"){
					yet += 1
				}
			}
		}
	}



		let t = []
		for(let i = 0; i < entities.length; i++){
			if(distance(entities[i].x,entities[i].y,this.x,this.y) < 33 && entities[i].id != this.id){
				t.push([entities[i].x,entities[i].y,entities[i].entityType])
			}
		}



		io.to(this.id).emit('mapUpdate2',["",t,tmap2])

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

var ranStrucLists = {"GoldOre":["gold ore vein1",1,"gold ore vein2",1,"gold ore vein3",1,"gold ore vein4",1]}


var io = socket(server);

// socket = io("https://home.unsown.top")

io.sockets.on('connection', newConnection)
changingConfig.Build += 1
fs.writeFile('./changingConfig.json',JSON.stringify(changingConfig), function writeJSON(err){if(err)return console.log(err)})

var MainHelpMenu = CURRENTCONFIGS.ConsoleResponses["Help1-1"] + changingConfig.Build + CURRENTCONFIGS.ConsoleResponses["Help1-2"]


function newConnection(socket){
	// socket.on('requestMap', sendMap)
	// socket.on('key', processKey)
	// socket.on('click', processClick)
	// socket.on('selectInventorySlot', selectSlot)
	socket.on('AT',ACTIONPROCESS)
	socket.on("returnPing",STOPPING)
	console.log(socket.id + " has joined at " + Date())
	broadcast("--"+socket.id+" has joined!",cmdc.item)
	entities.push(new player(socket.id))
	entities[findPlayerInArr(socket.id)].log(MainHelpMenu,"#A000FF")
	joined(socket.id)


	io.to(socket.id).emit('sendWhenJoin', socket.id)
	entities[entities.length-1].relay2()
	
	    socket.on('disconnect',function(){disconnect(socket)});
}



	function joined(e){

		let a = [
			CURRENTCONFIGS.BLOCKSALL,
			CURRENTCONFIGS.HeightMap,
			CURRENTCONFIGS.TILESALL,
			CURRENTCONFIGS.SLABSALL,
			CURRENTCONFIGS.TileImageReferenceDict,
			CURRENTCONFIGS.EntityImageReferenceDict
		]

		io.to(e).emit("config",a)
	}


 function disconnect(socket) {
        console.log(socket.id + " has disconnected");
        broadcast("--"+socket.id+" has left!",cmdc.small_error)
        for(let i = 0; i < entities.length; i++){
        	if(entities[i].id == socket.id){
        		if(entities[i].inCombat !== false){
        			endCombatInstance(entities[i].inCombat)
        		}




        		entities.splice(i,1)
        		break
        	}
        }
    }


function allPlayersGenerateChunks(){
		let ps = entities
	for(let p = 0; p < ps.length; p++){
		entities[p].update()
		if(entities[p].entityType == "player"){


			
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

		entities[p].relay2()

	}
}
}
var TIME = 40
function doSomething(){
	if(TIME < 60){
		TIME += 1
		io.emit('TIME',TIME)
	} else if(TIME == 60){
		allPlayersGenerateChunks()
		TIME += 1
		io.emit('TICK')
		if(ticktoggle == 1){
		console.log("tick")
	}

		for(let i = 0; i < entities.length; i++){
			if(entities[i].entityType!="player"){
				entities[i].nonPlayerActions()
			}
		}


	} else if(TIME < 70){
		TIME += 1
	} else if(TIME == 70){

		TIME = getLongestPlayerAction() * -5
	}
	if(TIME < 0 && TIME % 5 === 0){
		processPlayersActions()
		allPlayersGenerateChunks()
	}else if(TIME == 0){
		ProcessStep = 1
		for(let i = entities.length -1; i > -1; i--){
			entities[i].save()
			if(entities[i].entityType=="player"){
			io.to(entities[i].id).emit('chatUpdate')}
			entities[i].kill()
		}
		entitiesCollectiveActions = []
		combatMoveTracker = {}



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
	for(let i = 0; i < entities.length; i++){
		for(let j = entities[i].effects.length-1; j > -1 ; j--){
			entities[i].effects[j][1] -= 1
			if(entities[i].effects[j][1] < 1){
				entities[i].effects.splice(j,1)
			}
		}
	}
}










var entitiesCollectiveActions = []
function ACTIONPROCESS(e){
	entitiesCollectiveActions.push(e)
}

var ProcessStep = 1

var combatMoveTracker = {}



function CombatMoveUpdate(e){
	if(combatMoveTracker[e] == undefined){
		combatMoveTracker[e] = 1
		return(true)
	} else {
		combatMoveTracker[e] += 1
		return((combatMoveTracker[e]<5))
	}
}


var processees = {
	"click":[],
	"select":[],
	"command":[],
	"key":[],
	"combat":[]
}
var processeeOrders = ["click","combat","key","command","select"]

function processPlayersActions(){
	let mx = 0
	for(let i = 0; i < entitiesCollectiveActions.length; i++){
		if(entitiesCollectiveActions[i][ProcessStep] != undefined){
			let s = entitiesCollectiveActions[i][ProcessStep]
			let q = entitiesCollectiveActions[i][0]


	if(typeof(s) == "string" && s.length == 1){
		processees["key"].push([q,s])
	} else if(typeof(s) == "string" && s[0] == "$"){
		processees["command"].push([q,s])



	} else {
		if(s[0] == "click"){
			//if action is click
			processees["click"].push([q,s])
		} else if(s[0] == "sel"){
			//if action is select
			processees["select"].push([q,s])
		} else if(s[0] == "com" && CombatMoveUpdate(q)){
			processees["combat"].push([q,s])
		}
	}



			
		}
	}

	for(let i = 0; i < processeeOrders.length; i++){
		for(let j = 0; j < processees[processeeOrders[i]].length; j++){
			CompleteActionStep(processees[processeeOrders[i]][j][0],processees[processeeOrders[i]][j][1])

		}

	}

	CompleteCombatSimul()
	processees = {
	"click":[],
	"select":[],
	"command":[],
	"key":[],
	"combat":[]
}
	ProcessStep += 1
}
// [["ID",stuff,stuff] []]

function getLongestPlayerAction(){
		let mx = 0
		let pca = entitiesCollectiveActions
	for(let i = 0; i < pca.length; i++){
		if(pca[i][1] != undefined && pca[i].length - 1 > mx){

		if(pca[i].length > 20){
			entitiesCollectiveActions[i] = pca[i].splice(0,21)
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
	if(strsplit[0] == "S" || strsplit[0] == "s"){
		let fstr = str
		if(str[1] == " "){
			fstr = fstr.substring(2)
		} else {fstr = fstr.substring(1)}

		entities[p].say(fstr)
	} 
	//help command
	else if(strsplit[0] == "H" || strsplit[0] == "h"){
		helpCommand(strsplit,p)
	}
	//setblock command
	else if(strsplit[0] == "set" && entities[p].keyholder == true){
		setblock(parseInt(strsplit[1]),parseInt(strsplit[2]),strsplit[3])
	}

	//give command
		else if(strsplit[0] == "give" && entities[p].keyholder == true){
		give(p,parseInt(strsplit[1]),strsplit[2])
	}
	//tp command
		else if(strsplit[0] == "tp" && entities[p].keyholder == true){
		tp(p,strsplit[1],strsplit[2])
	}
	//summon command
		else if(strsplit[0] == "summon" && entities[p].keyholder == true){
		let tempFstore = summonCmd(p,strsplit[1],strsplit[2],strsplit[3],strsplit[4])
		if(tempFstore == undefined){
			entities[p].log("summoned successfully",cmdc.success)
		} else {
			entities[p].log("Cannot summon, Possible overlapping ID",cmdc.error)
		}

	}
	//playerno command
		else if(strsplit[0] == "pno"){
		ArrLoc(p)
	}

	//login command

		else if(strsplit[0] == "login"){
		entities[p].login(strsplit[1],strsplit[2])
		updatePlayerFile()
	}
	//permissions command
		else if(strsplit[0] == "keyholder" || strsplit[0] == "kh"){
			if(strsplit[1] == consoleKey){
				entities[p].keyholder = true
				entities[p].log("you are now a keyholder",cmdc.success)
			} else {
				entities[p].log("wrong key!",cmdc.error)
			}
	}


	//unrecognized command
	else{
		console.log(strsplit)
		entities[p].log("Invalid command.</br> If you think this should be a command, tell me your idea in discord. (lopkn#0019)","#FF0000")
	}


} else {
	//normal say
	if(st[0] == " "){
		st = st.substring(1)
	}
	entities[p].say(st)

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
		entities[i].pressed(e[1])
	}
}
function processClick(e){

	let r = findPlayerInArr(e[0])

	let chunkPos = generatedChunks[e[1].x + "," + e[1].y]

	let item = selectedSlotItems(e[0])

	let a = parseInt(amountOfItems(e[0]))

	let att = TNEWATTRIBUTEOF(item,"B")
	let att2 = TNEWATTRIBUTEOF(item,"Sl")

	let decodedXY = rCoordToChunk(e[1])
	

	//click player

	for(let i = 0; i < entities.length; i++){
		if(i != r && decodedXY.x == entities[i].x && decodedXY.y == entities[i].y && !entities[i].inCombat && !entities[r].inCombat){
			allCombatInstances[JSON.stringify(combatIdCounter)] = new combatInstance(entities[r].id,entities[i].id)
			console.log("new combat instance: " +entities[r].id+","+entities[i].id)
			entities[r].combatRelay(true)
			entities[i].combatRelay(true)
			entities[r].log((entities[i].name ? entities[i].name : entities[i].id)+" has entered combat with you!",cmdc.combat)
			entities[i].log((entities[r].name ? entities[r].name : entities[r].id)+" has entered combat with you!",cmdc.combat)
			break;
		}


	}



	//if block
	if(att != "NONE" && a > 0){
		if(!alreadyHasBlock(map[chunkPos][e[2]][2])){
			
			if(distance(decodedXY.x,decodedXY.y,entities[r].x,entities[r].y) <= 12){
				map[chunkPos][e[2]][2] += "-B:" + att
				removeItemFromSelected(e[0],1)
			} else {
				entities[r].log("you are too far away to place a block there!",cmdc.small_error)
			}

		} //util break
	}else	if(att2 != "NONE" && a > 0){
		if(!alreadyHasBlockATT(map[chunkPos][e[2]][2],"Sl")){
			
			if(distance(decodedXY.x,decodedXY.y,entities[r].x,entities[r].y) <= 12){
				map[chunkPos][e[2]][2] += "-Sl:" + att2
				removeItemFromSelected(e[0],1)
			} else {
				entities[r].log("you are too far away to place a slab there!",cmdc.small_error)
			}

		} //util break
	} else {
		if(alreadyHasBlock(map[chunkPos][e[2]][2]) && TNEWATTRIBUTEOF(item,"U") != "NONE"){
			// 
			let seeBreak = TNEWbreakBlockBy(map[chunkPos][e[2]][2],25+Math.floor(Math.random()*10-5))
			if(seeBreak == "remove"){
				give(r,1,"B:"+TNEWATTRIBUTEOF(map[chunkPos][e[2]][2],"B"))
				map[chunkPos][e[2]][2] = TNEWremoveFromTile(TNEWremoveFromTile(TNEWremoveFromTile(map[chunkPos][e[2]][2],"B"),"D"),"T")
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
		entities[p].log(MainHelpMenu,"#A000FF")
	} else if(e[1] == "2" || e[1] == "list" || e[1] == "content"){
		entities[p].log(CURRENTCONFIGS.ConsoleResponses.Help2,"#FFFF00")
	} else if(e[1] == "3" || e[1] == "buffer"){
		entities[p].log(CURRENTCONFIGS.ConsoleResponses.Help3,"#FFFF00")
	} else if(e[1] == "4" || e[1] == "tick" || e[1] == "ticks" || e[1] == "movement" || e[1] == "move"){
		entities[p].log(CURRENTCONFIGS.ConsoleResponses.Help4,"#FFFF00")
	} else if(e[1] == "5" || e[1] == "text" || e[1] == "input"){
		entities[p].log(CURRENTCONFIGS.ConsoleResponses.Help5,"#FFFF00")
	} else if(e[1] == "6" || e[1] == "command" || e[1] == "commands"){
		entities[p].log(CURRENTCONFIGS.ConsoleResponses.Help6,"#FFFF00")
	} else if(e[1] == "7" || e[1] == "combat" || e[1] == "battle"){
		entities[p].log(CURRENTCONFIGS.ConsoleResponses.Help7,"#FFFF00")
	} else {
		entities[p].log("Invalid help option.</br> If you think entities would need help with this, tell me your idea in discord. (lopkn#0019)","#FF0000")
	}
}






function TNEWbreakBlockBy(str,a){

  let split = str.split("-")
  let e = -1
  let ee = 0
  let fin = ""
  for(let i = 0; i < split.length; i++){
  	let spl2 = split[i].split(":")
    if(spl2[0] == "D"){
      e = parseInt(spl2[1])
    }else if(spl2[0] == "B"){
      ee = BLOCKSALL[spl2[1]][2]
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
  fin += ("-D:"+durability)
  return(fin.substring(1))
	} else{
		return("remove")
	}
}








function broadcast(s,e){
	for(let i = 0; i < entities.length; i++){
		entities[i].log(s,e)
	}
}



function removeItemFromSelected(p,a){
	let e = findPlayerInArr(p)
	let player = entities[e]
	let original = player.Inventory[player.selectedSlot]
	let split = original.split("-")
	let aa = (parseInt(TNEWATTRIBUTEOF(original,"A"))-a)
	if(aa > 0){	entities[e].Inventory[player.selectedSlot] = split[0]+"-A:"+aa}else{
		entities[e].Inventory[player.selectedSlot] = ""
	}
	entities[e].invrelay()
}


function selectSlot(e){
	let i = findPlayerInArr(e[0])
	if(i === false){
		console.log(i)
	} else {
		entities[i].selectedSlot = (e[1])
	}
}


function TNEWremoveFromTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){
		if(split[i].split(":")[0] != type){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
}


function TNEWkeepOnlyTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){
		if(split[i].split(":")[0] == type){
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
			t.push([j,i,TNEWgenerateTileFromNumber(value,0)])
			generateStructureFromNumber(value,x*chunkSize+j,y*chunkSize+i)
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



function rotateStructure(arr,rotate,mirror){
	let newArr = []

		//fill in the spaces undefined
		while(((arr.length-1)/arr[0])%1 != 0){
			arr.push("")
		}



	if(rotate == 1 || rotate == "left"){

		let newBorder = (arr.length-1)/arr[0]
		newArr[0] = newBorder
		for(let j = arr[0]; j > 0; j--){
			for(let i = 0; i < newBorder; i++){
				newArr.push(arr[j+i*arr[0]])
			}

		}
	} else if(rotate == 2 || rotate == "180"){
		
		newArr[0] = arr[0]
		for(let i = arr.length-1; i > 0; i--){
			newArr.push(arr[i])
		}

	} else if(rotate == 3 || rotate == "right"){
		let newBorder = (arr.length-1)/arr[0]
		newArr[0] = newBorder
		for(let j = 1; j <= arr[0]; j++){
			for(let i = newBorder -1; i > -1; i--){
				newArr.push(arr[j+i*arr[0]])
			}

		}



	} else {
		newArr = arr
	}

	if(mirror == 1){
		let newBorder2 = (newArr.length-1)/newArr[0]
		let half = Math.floor(newArr[0]/2) + 1
		let na0 = newArr[0]
		for(let i = 1; i < half; i++){
			for(let j = 0; j < newBorder2; j++){
				let Swap_temp = newArr[i+j*na0]
				newArr[i+j*na0] = newArr[(na0-i+1)+j*na0]
				newArr[(na0-i+1)+j*na0] = Swap_temp
			}
		}
	}



	return(newArr)
}



function generateStructure(st,x,y,options){
	let structure = CURRENTCONFIGS.Structures[st]
	if(options != undefined){
		let rotate = 0
		let mirror = 0
		if(options.rotate != undefined){
			if(options.rotate == "random" || options.rotate == "rand"){
				rotate = Math.floor(Math.random()*4)
			} else {
				rotate = options.rotate
			}
		}

		if(options.mirror == "random" || options.mirror == "rand"){
			mirror = Math.floor(Math.random()*2)
		} else {
			mirror = options.mirror
		}

		structure = rotateStructure(structure,rotate,mirror)
	}



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
		map[ctm[0]][ctm[1]][2] = TNEWkeepOnlyTile(map[ctm[0]][ctm[1]][2],"G")
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
	for(let i = 0; i < entities[p].Inventory.length; i++){
		let t = entities[p].Inventory[i].split("-")
		if(t[0] == item){
			entities[p].Inventory[i] = addToItem(entities[p].Inventory[i],amount)
			entities[p].invrelay()
			return("1")
		}
	}
	for(let i = 0; i < entities[p].Inventory.length; i++){
		if(entities[p].Inventory[i] == "" || entities[p].Inventory[i] == undefined){
			entities[p].Inventory[i] = (item + "-A:" + amount)
			entities[p].invrelay()
			return("2")
		}
	}
}

function ArrLoc(p){
	entities[p].log("you are player "+p,cmdc.success)
}


function getRelativity(p,x,y){
	let outx = 0
	let outy = 0
	if(x[0] == "="){
		if(x[1] != undefined){
			outx = entities[p].x + parseInt(x.substring(1))
		} else {
			outx = entities[p].x
		}

	} else {
			outx = parseInt(x)
	}
	if(y[0] == "="){
		if(y[1] != undefined){
			outy = entities[p].y + parseInt(y.substring(1))
		} else {
			outy = entities[p].y
		}
	} else {
		outy = parseInt(y)
	}

	return([outx,outy])
}


function tp(r,i1,i2){
	if(i2 == undefined){
		let temp = findPlayerString(i1)
		if(temp !== false){
			entities[r].x = entities[temp].x
			entities[r].y = entities[temp].y
			entities[r].log("successfully teleported to P:"+temp,cmdc.success)
		} else {
			entities[r].log("cannot teleport to P:"+i1,cmdc.error)
		}


	} else if(!isNaN(parseInt(i1))&& !isNaN(parseInt(i2))){
		entities[r].x = parseInt(i1)
		entities[r].y = parseInt(i2)
		entities[r].log("successfully teleported to "+i1+","+i2,cmdc.success)
	} else if(i1[0] == "=" && i2[0] == "="){
		let ar = parseInt(i1.split("=")[1])
		let ae = parseInt(i2.split("=")[1])
		if(!isNaN(ar) && !isNaN(ae)){
			entities[r].x += ar
			entities[r].y += ae
			entities[r].log("successfully teleported to "+i1+","+i2,cmdc.success)
		}
	}

}


function summonCmd(p,name,x,y,id){
	let r = getRelativity(p,x,y)
	summonNewMob(name,r[0],r[1],id)

}

function summonNewMob(name,x,y,id){

	if(id == undefined){
		id = Math.floor(Math.random()*10000)
	}

		if(usedIDs[id] == true){
			return("id exists already!")
		}
	
	usedIDs[id] = true
	entities.push(new mob(name,x,y,id))



}






function addToItem(str,amount){
	let split = str.split("-")
	let fout = ''
	let a;
	for(let i = 0 ; i < split.length; i++){
		if(TNEWATTRIBUTEOF(split[i],"A")!="NONE"){
			a = parseInt(split[i].split(":")[1])+amount
		} else {
			fout += "-"+split[i]
		}
	}

	fout += ("-A:" + a )
	return(fout.substring(1))
}





function findPlayerString(e){
	if(e.length == 1 && parseInt(e) != NaN){
		return(parseInt(e))
	}
	if(findPlayerInArr(e) !== false){
		return(findPlayerInArr(e))
	}
	for(let i = 0; i < entities.length; i++){
		if(entities[i].name == e){
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
  for(let i = 0; i < entities.length; i++){
    if(inp == entities[i].id){
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

function TNEWATTRIBUTEOF(str,e){
  if(str == undefined){return("NONE")}
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
  	let act = split[i].split(":")
  	if(act[0] == e){
  		return(act[1])
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







///////////////////////////////////////////////////////////////////////////////////////////////////

var BLOCKSALL = CURRENTCONFIGS.BLOCKSALL
var HeightMap = CURRENTCONFIGS.HeightMap






var TILESALL = CURRENTCONFIGS.TILESALL
var ColorTileReferenceDict = CURRENTCONFIGS.ColorTileReferenceDict
var NameTileReferenceDict = CURRENTCONFIGS.NameTileReferenceDict

//-------------------------------------------
function selectedSlotItems(p){
	let r = findPlayerInArr(p)
	if(r !== false){
	let e = entities[r].selectedSlot
	if(entities[r].Inventory[e] != undefined){
		let split = entities[r].Inventory[e].split('-')

		// if(itemType(split[0])=="block"){

		// }

		return(split[0])
	
	}} else {
		console.log(p,"error")
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
    if(split[i].split(":")[0] == "B"){
      return(true)
    }
  }
  return(false)
}
function alreadyHasBlockATT(str,att){
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i].split(":")[0] == att){
      return(true)
    }
  }
  return(false)
}


function removeAcc(Acc){
	delete playerList[Acc]
	updatePlayerFile()
}


function generateStructureFromNumber(input,x,y){
			if(input > 310 && input < 335){
			if(Math.random() > 0.995){
				generateStructure(randomItem(ranStrucLists.GoldOre),x,y,{"mirror":"random","rotate":"random"})
			}
		}

}

function TNEWgenerateTileFromNumber(input,e){
	if(e == 0){
		let tile = "G:"
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
				tile += "-B:3-T:1-S:" + (Math.floor(Math.random()*3)+4)
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
	let player = entities[r]
  if(player.Inventory[player.selectedSlot] != undefined){
    let e = TNEWATTRIBUTEOF(player.Inventory[player.selectedSlot],"A")
    return(e)
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
		this.textarr = [[this.p1,"",""],[this.p2,"",""]]


		this.p1n = findPlayerInArr(p1)
		this.p2n = findPlayerInArr(p2)
		allCombatInstancesA.push(JSON.stringify(combatIdCounter))
		// this.comId = combatIdCounter
		entities[this.p1n].inCombat = JSON.stringify(combatIdCounter)
		entities[this.p2n].inCombat = JSON.stringify(combatIdCounter)
		this.comid = JSON.stringify(combatIdCounter)
		combatIdCounter += 1
	}

	process(p,str){

		if(p == this.p1){
			console.log(p,str,1)
			let temp = this.process2(this.p1m,this.p2m,this.p1d,this.p2d,str,0)
			this.p1m *= temp[0]
			this.p2m *= temp[1]
			this.p1d = temp[2]
			this.p2d = temp[3]


		}
		if(p == this.p2){
			console.log(p,str,2)
			let temp = this.process2(this.p2m,this.p1m,this.p2d,this.p1d,str,1)
			this.p2m *= temp[0]
			this.p1m *= temp[1]
			this.p2d = temp[2]
			this.p1d = temp[3]



		}
	}


	process2(atkr,dfer,atkrn,dfern,str,a){

		let b = (a == 0 ? 1 : 0)
		let pno = (a == 0 ? this.p1n : this.p2n)
//punch
		if(str == "001"){
			let ts = getstats(pno,"strength")
			console.log(ts)
			dfern += 3 + ts*0.3 + ts*Math.random()*2
			this.textarr[a][1] += "punch"
		}
//jab
		if(str == "002"){
			let ts = getstats(pno,"strength")
			dfern += 3 + ts*0.3 + ts*Math.random()*2
			dfern += 3
			this.textarr[a][1] += "jab"
		}
//kick
		if(str == "003"){
			let ts = getstats(pno,"agility")
			dfern += 3 + ts*0.5 + ts*Math.random()*1
			this.textarr[a][1] += "kick"
		}
//block
	if(str == "10"){
		atkr = 0.7
		this.textarr[a][2] += "block"
	}
//dodge
	if(str == "11"){
		let ts = getstats(pno,"agility")
		
		if(Math.random() < 0.4 + Math.sqrt(ts,2) ){
			atkr = 0
			this.textarr[a][2] += "dodge"
		}


	}


		return([atkr,dfer,atkrn,dfern,str])

	}





	simul(){

		this.p1n = findPlayerInArr(this.p1)
		this.p2n = findPlayerInArr(this.p2)
		if(this.p1n === false || this.p2n === false){
			endCombatInstance(this.comid)
		}



		//maybe a bit of redundancy

		let a = Math.round(this.p1d * this.p1m)
		let b = Math.round(this.p2d * this.p2m)

		if(this.textarr[0][2] == "" && a != 0){
			this.textarr[0][2] = a
		}
		if(this.textarr[1][2] == "" && b != 0){
			this.textarr[1][2] = b
		}
		if(this.textarr[0][2] == "block" && a != 0){
			this.textarr[0][2] = "b-" + a
		}
		if(this.textarr[1][2] == "block" && b != 0){
			this.textarr[1][2] = "b-" + b
		}



		entities[this.p1n].hp -= a
		entities[this.p2n].hp -= b

		entities[this.p1n].combatRelay()
		entities[this.p2n].combatRelay()


		io.to(entities[this.p1n].id).emit("combatText",this.textarr)
		io.to(entities[this.p2n].id).emit("combatText",this.textarr)

		this.p1d = 0
		this.p2d = 0

		this.p1m = 1
		this.p2m = 1

		if(distance(entities[this.p1n].x,entities[this.p1n].y,entities[this.p2n].x,entities[this.p2n].y) > 13){
			endCombatInstance(this.comid)
		}
		if(entities[this.p1n].hp <= 0 || entities[this.p2n].hp <= 0){
			endCombatInstance(this.comid)
		}




		this.textarr = [[this.p1,"",""],[this.p2,"",""]]

	}


	end(){
		if(entities[this.p1n] != undefined){
		entities[this.p1n].inCombat = false
		entities[this.p1n].combatRelay(false)}
		entities[this.p2n].inCombat = false
		entities[this.p2n].combatRelay(false)


	}

}




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!







function getstats(p,str){
	return(entities[p].entityStats[str])
}



function combatProcess(p,str){

	let r = findPlayerInArr(p)
	if(r !== false && entities[r].inCombat){

		allCombatInstances[entities[r].inCombat].process(p,str)

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






function randomItem(List){
	let sum = 0
	for(let i = 1; i < List.length; i+=2){
		sum += List[i]
	}
	let value = Math.random()*sum
	let tempvalue = 0
	for(let i = 1; i < List.length; i+=2){
	tempvalue += List[i]
	if(value < tempvalue){
		return(List[i-1])
		}
	}


}














//game functions end//===============================================================================