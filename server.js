var players = []
var map = []
var generatedChunks = {}
var chunkSize = 20
const fs = require('fs');
var perlin2 = require('./perlin')
var perlin = require('simplex-noise'),

perSeed = new perlin(164.44)


class player{
	constructor(id){
		this.id = id
		this.x = 0
		this.y = 0
		this.chunk = {"x":0,"y":0}
		this.selectedSlot = 0
		this.Inventory = ["B1-50","B2-40"]


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
	invrelay(){
		io.to(this.id).emit('invrelay',this.Inventory)
	}
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



// console.log(W)

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection)






function newConnection(socket){
	// socket.on('requestMap', sendMap)
	socket.on('key', processKey)
	socket.on('click', processClick)
	socket.on('selectInventorySlot', selectSlot)
	socket.on('AT',ACTIONPROCESS)

	console.log(socket.id + " has joined")
	players.push(new player(socket.id))
	
	io.to(socket.id).emit('sendWhenJoin', socket.id)
	players[players.length-1].relay()
	    socket.on('disconnect', function () {
        console.log(socket.id + " has disconnected");
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
				// console.log(generatedChunks)
			}}
			catch(err){
				console.log(ps,err)
				break
			}
		}	
	}

		players[p].relay()
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
		console.log("tick")
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
		playersCollectiveActions = []
	}
	
}



setInterval(function(){ 
    doSomething()
}, 100);


function tellPerlin(x,y){
	console.log(perSeed.noise2D(x/100,y/100,0))
}


/////////////////////////////////////////////////////////////
//game functions//===================================================================================

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
		}
	}
	ProcessStep += 1
}
// [["ID",stuff,stuff] []]

function getLongestPlayerAction(){
		let mx = 0
	for(let i = 0; i < playersCollectiveActions.length; i++){
		if(playersCollectiveActions[i][1] != undefined && playersCollectiveActions[i].length - 1 > mx){
			mx = playersCollectiveActions[i].length - 1
		}
	}
	return(mx)
}






function CompleteActionStep(p,s){
	let r = findPlayerInArr(p)


	if(typeof(s) == "string"){
		//if action is key
		processKey([p,s])
	} else {
		if(s[0] == "click"){
			//if action is click
			processClick([p,s[1],s[2]])
		} else if(s[0] == "sel"){
			//if action is select
			selectSlot([p,s[1]])
		}
	}
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
	let chunkPos = generatedChunks[e[1].x + "," + e[1].y]
	let item = selectedSlotItems(e[0])
	let a = parseInt(amountOfItems(e[0]))
	let att = ATTRIBUTEOF(item,"B")



	if(att != "NONE" && a > 0){
	if(!alreadyHasBlock(map[chunkPos][e[2]][2])){
		map[chunkPos][e[2]][2] += "-B" + att
		removeItemFromSelected(e[0],1)
	}} else {
		if(alreadyHasBlock(map[chunkPos][e[2]][2])){
			// 
			let seeBreak = breakBlockBy(map[chunkPos][e[2]][2],25+Math.floor(Math.random()*10-5))
			if(seeBreak == "remove"){
				map[chunkPos][e[2]][2] = removeFromTile(removeFromTile(removeFromTile(map[chunkPos][e[2]][2],"B"),"D"),"T")
			} else {
				map[chunkPos][e[2]][2] = seeBreak
			}
		}
	}
}




function breakBlockBy(str,a){
	console.log(a)
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





function GenerateChunk(x,y){
	let t = [x,y,"buffer"]
	for(let i = 0; i < chunkSize; i++){
		for(let j = 0; j < chunkSize; j++){
			let value =200+perSeed.noise2D((0.2+j+x*chunkSize)/199.7,(0.2+i+y*chunkSize)/199.7)*200
			t.push([j,i,generateTileFromNumber(value,0)])
		}
	}
	map.push(t)
	generatedChunks[x+","+y] = (map.length-1)
	// generatedChunks.push([x,y])
}


function CoordToChunk(x,y){
	return({"x":Math.floor(x/chunkSize),"y":Math.floor(y/chunkSize)})
}

function inListR(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp == arr[i]){
      return(i)
    }
  } return(false)
}
function findPlayerInArr(inp){
  for(let i = 0; i < players.length; i++){
    if(inp == players[i].id){
      return(i)
    }
  } return(false)
}
function inListRS(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp[0] == arr[i][0] && inp[1] == arr[i][1] ){
      return(i)
    }
  } return(false)
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
var ColorBlockReferenceDict = {"1":"#B96A04"}
var NameBlockReferenceDict = {"1":"Oak Wood"}
var DurabilityMap = {"1":100}
var BLOCKSALL = {"1":["#B96A04","Oak Wood",100],"2":["#8C8C8C","Stone",400],"3":["#A95A00","Oak Tree Wood",400]}
var HeightMap = ["B","G"]


var TILESALL = {"0":["#FF00FF","Abyss"],"1":["#04399F","Deep Sea"],"2":["#0078FF","Sea"],"3":["#1FB1FF","Shallow Waters"],"4":["#D9DC00","Sand"],"5":["#20A020","Plains"],"6":["#207020","Forest"],"7":["#205020","Dense Forest"],"8":["#707070","Mountains"],"9":["#F0F0F0","Snowy Mountain Peaks"]}


var ColorTileReferenceDict = {"0":"#FF00FF","1":"#04399F","2":"#0078FF","3":"#1FB1FF","4":"#D9DC00","5":"#20A020","6":"#207020","7":"#205020","8":"#707070","9":"#F0F0F0"}
var NameTileReferenceDict = {"0":"Abyss","1":"Deep Sea","2":"Sea","3":"Shallow Waters","4":"Sand","5":"Plains","6":"Forest","7":"Dense Forest","8":"Mountains","9":"Snowy Mountain Peaks"}
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



function alreadyHasBlock(str){
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == "B"){
      return(true)
    }
  }
  return(false)
}


function generateTileFromNumber(input,e){
	// console.log(input,e)
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
		} else if(input < 200){
			tile += "5"
		} else if(input < 250){
			tile += "6"
		} else if(input < 300){
			tile += "7"
		} else if(input < 320){
			tile += "8"
		} else if(input >= 320){
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

//game functions end//===============================================================================