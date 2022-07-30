
var plArr = []
var enArr = []
var enDict = {}

var generatedStructures = []

var map = []
var tnewMap = {"O":[],"T":[]}
var usedIDs = {}
var generatedChunks = {"O":{},"T":{}}
var chunkSize = 20
var allChestLinks = {}

var dimension = "O"


var allTickyBlocks = []



const fs = require('fs');

const process = require('process');


console.log(`Process pid ${process.pid}`);

process.on('uncaughtException',(err)=>{
	fs.writeFileSync('./errorlog.json',JSON.stringify(enDict,null,4), function writeJSON(err){if(err)return console.log(err)})
	console.log(concol.Red + "%s" + "\x1b[1m" ,"ERROR")
	throw err
})


// const uuidv4 = require("uuid/dist/v4")
var perlin2 = require('./perlin')
var perlin = require('simplex-noise')
var DEBUGGINGLOGS = {"ticktoggle":0,"combat":0,"click":0}
var SERVERCOUNTERS = {"ticks":0}


// fs.writeFile('./memory.json',inp, function writeJSON(err){if(err)return console.log(err)})

var CURRENTCONFIGS = require("./config")
var changingConfig = require("./changingConfig")
var playerList = require("./playerList")

var cmdc = {"success":"#00C000","error":"#FF0000","small_error":"#FFCFCF","item":"#FFFF00","combat":"#FF8800"}

var promiseChunks = {"O":{},"T":{}}

var consoleKey = "216"


var pping = 0
var startPing = 0

function getStrLengthOf(e){
	return(JSON.stringify(e).length)
}

const concol = {"Black" : "\x1b[30m" ,"Red" : "\x1b[31m" ,"Green" : "\x1b[32m" ,"Yellow" : "\x1b[33m" ,"Blue" : "\x1b[34m" ,"Magenta" : "\x1b[35m" ,"Cyan" : "\x1b[36m" ,"White" : "\x1b[37m" ,"BBlack" : "\x1b[40m" ,"BRed" : "\x1b[41m" ,"BGreen" : "\x1b[42m" ,"BYellow" : "\x1b[43m" ,"BBlue" : "\x1b[44m" ,"BMagenta" : "\x1b[45m" ,"BCyan" : "\x1b[46m" ,"BWhite" : "\x1b[47m"}


function testFunctionSpeed(opt,vars,func,p1,p2,p3,p4,p5,p6,p7,p8){
	

	if(opt == "for"){
		console.time("Function speed")
		for(let i= 0; i < vars; i++){
			func(p1,p2,p3,p4,p5,p6,p7,p8)}
		console.timeEnd("Function speed")
		return("done")
	}

	
}


function getServerDataSize(){
	let strl = 0
	strl += getStrLengthOf(CURRENTCONFIGS)
	strl += getStrLengthOf(tnewMap)
	strl += getStrLengthOf(enDict)
	strl += getStrLengthOf(enArr)
	strl += getStrLengthOf(allTickyBlocks)
	let strl2 = getStrLengthOf(perSeeds)
	return(strl + "-" + strl2)

}



function ping(a){


	io.to(plArr[a]).emit('PING')
	startPing = 1
	
}
//old seed 164.44
// perSeed = new perlin(174.44)

let perSeeds = {"O":new perlin(174.44),"T":new perlin(164.44)}


// main events

class cvents{
	static allCvents = ["AMtick","WMtick","Tick","Turn","ATick"]
	static CventsDict = {
		"Mtick":this.AMtick,
		"WMtick":this.WMtick,
		"Tick":this.Tick,
		"Turn":this.Turn,
		"ATick":this.ATick
	}

	static call(x){

		this.CventsDict[x]()

	}

	static AMtick(){
		
	}

	static WMtick(){

	}

	static Tick(){

	}

	static Turn(){

	}

	static ATick(){
		naturalMobSpawn(10,"hunter")
	}

}



class mob{
	constructor(type,x,y,id,dimension,stats,link){
		this.entityType = type
		this.id = id
		this.x = x
		this.y = y
		this.dimension = dimension
		this.chunk = {"x":0,"y":0}
		this.selectedSlot = 0
		this.Inventory = [""]
		this.effects = []
		this.inCombat = false
		this.stats = {}


		this.turncounters = {"calm":1,"energy":1}
		this.followerTargeting = {}
		this.movethought = []
		this.Cstats = {"hp":0}
		if(stats != undefined){
			this.stats = stats
			if(stats.ownerH != undefined){
				this.ownerH = stats.ownerH
			}

			if(stats.sleeprange == undefined){
				this.stats["sleeprange"] = 100
			}

			if(stats.despawnRange == undefined){
				this.stats["despawnRange"] = 200
			}

			if(stats.dropItems == undefined){
				this.stats["dropItems"] = true
			}

		} else{
			this.ownerH = {"master":id}
			this.stats = {"sleeprange":100,"despawnRange":200}
		}



		this.playerLink = {}
		if(link != undefined){
			this.playerLink = {"p":link.player,"dist":fastdistance(enDict[link].x,enDict[link].y,this.x,this.y),"sleep":0}
		} else {
			this.playerLink = {"sleep":1}
			this.recalculatePlayerLink()
		}


		this.entityStats = {
			"strength" : 1,
			"agility" : 1,
			"mana" : 1,
			"magic" : 1

		}


		switch(type){

  case "zombie":

    this.Cstats.hp = 60

    break;
  case "rampant":

    this.Inventory = ["U:6-A:1","B:1-A:6"]
	this.Cstats.hp = 30

    break;
  case "minion":
	this.Cstats.hp = 30

    break;
  case "preponderant":

    this.Inventory = ["U:6-A:1","U:3-A:1"]
	this.Cstats.hp = 50
	this.entityStats.strength += 2

    break;

  case "verdant":

    this.Inventory = ["","B:6-A:1"]
	this.Cstats.hp = 170

    break;

  case "hunter":


  	this.Cstats.hp = 70
  	this.Inventory = [randomItem(["",40,"In:2-A:1",7,"In:1-A:1",1]),randomItem(["",40,"In:2-A:1",7,"In:1-A:1",1])]

  	break


  case "duck":

    this.Cstats.hp = 30

    break;
  case "instance":
  	this.Cstats.hp = 30
  	this.Inventory = [randomItem(["",40,"In:2-A:1",7,"In:1-A:1",1]),randomItem(["",40,"In:2-A:1",7,"In:1-A:1",1])]
  default:
  	this.Cstats.hp = 100
}

		
		
	
			// this.Inventory = ["U:6-A:10","U:5-A:10","U:4-A:10","U:3-A:10","U:2-A:10","U:1-A:10","B:7-A:10","B:5-A:10","B:4-A:10","B:3-A:10","B:2-A:10","B:1-A:10","B:6-A:10"]
			
		




	}
	say(){}
		heal(e){
		this.Cstats.hp += e
		if(this.Cstats.hp > this.Cstats.maxhp){
			this.Cstats.hp = this.Cstats.maxhp
		}
	}

	movethoughtUpdate(e){
		if(e == "s"){
			this.movethought[1] += 1
		} else if(e == "w") {
			this.movethought[1] -= 1
		} else if(e == "a") {
			this.movethought[0] -= 1
		} else if(e == "d") {
			this.movethought[0] += 1
		}
	}


	getPosTarget(e){
		if(e == "owner" && enDict[this.ownerH.master] != undefined && enDict[this.ownerH.master].dimension == this.dimension){
			let target = this.ownerH.master

			if(target == this.id){
				return([this.x + Math.floor(Math.random()*10-5),this.y + Math.floor(Math.random()*10-5)])
			}

			let a = enDict[target].followerTargeting[this.entityType]
			if(a != undefined){

			return([a[0],a[1]])
				
			}
			return([enDict[target].x,enDict[target].y])
		} else if(e == "ranradius"){
			return([this.x + Math.floor(Math.random()*10-5),this.y + Math.floor(Math.random()*10-5)])
		} else if(e == "findTarget"){
			if(this.targeting != undefined){
			this.targeting.turns -= 1
			if(this.targeting.turns < 0 || enDict[this.targeting.id] == undefined){
				this.targeting = undefined
				return([this.x + Math.floor(Math.random()*10-5),this.y + Math.floor(Math.random()*10-5)])
			}
			return([enDict[this.targeting.id].x,enDict[this.targeting.id].y])

			}
			return(this.getPosTarget("owner"))
		} else {



			return([this.x,this.y])


		}
	}

	damage(e){
		this.Cstats.hp -= e
		return(this.kill())
	}
	hungerHeal(e){}


	nonPlayerActions(){
		let myAction = []
		myAction.push(this.id)

		if(this.playerLink.sleep == 0){
			this.recalculatePlayerLink()
		}
		if(this.playerLink.sleep > 0){
			this.playerLink.sleep -= 1
			return;
		}
		if(this.playerLink.sleep<0){
			this.playerLink.sleep += 1
		}


		switch (this.entityType){
		case "zombie":{
			let moveAmount = Math.random()*20
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",2,"a",2,"s",2,"d",2,["com","001"],1,["com","002"],1,"",10])
				myAction.push(tr)

			}
		}break;
		case "instance":{
			// let moveAmount = Math.random()*20
			// for(let i = 0; i < moveAmount; i++){
			// 	let tr = randomItem(["w",2,"a",2,"s",2,"d",2,["com","001"],1,["com","002"],1,"",10])
			// 	myAction.push(tr)

			// }
			let a = CoordToChunk(this.x+3,this.y)
			let b = ["click",a,a.cx + a.cy*chunkSize+3]
			let myActionChain = ["d","d","d","d","d","d","d","d","d","d","d","d","d","d"]
			myActionChain.forEach((i)=>{myAction.push(i)})
			


		}break;
		case "rampant":{
			let moveAmount = Math.random()*5 + 14
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",6,"a",6,"s",6,"d",6,["com","003"],1,["com","002"],1])
				myAction.push(tr)

			}
		} break;
		case "verdant":{

			if(Math.random() > 0.6 && this.inCombat == false){
				for(let b = 0; b < enArr.length; b++){

					let i = enArr[b]
					if(enDict[i].entityType == "player" && enDict[i].dimension == this.dimension&&distance(this.x,this.y,enDict[i].x,enDict[i].y) < 5){
						let a = CoordToChunk(enDict[i].x,enDict[i].y)
						myAction.push(["click",a,a.cx + a.cy*chunkSize+3])

					}
				}


			}

			let moveAmount = Math.random()*19
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",1,"a",1,"s",1,"d",1,["com","002"],1,"",17])
				myAction.push(tr)

			}
		}break;
		case "minion":{

			if(Math.random() > 0.5 && this.inCombat == false){
				for(let b = 0; b < enArr.length; b++){
					let i = enArr[b]
					if(!isSameTeam(i,this.id)&&enDict[i].dimension == this.dimension&&distance(this.x,this.y,enDict[i].x,enDict[i].y) <= 6){
						let a = CoordToChunk(enDict[i].x,enDict[i].y)
						myAction.push(["click",a,a.cx + a.cy*chunkSize+3])

					}
				}


			}

			if(this.inCombat == false){

				this.movethought = [this.x,this.y]

				let tar = this.getPosTarget("owner")
			let moveAmount = distance(this.x,this.y,tar[0],tar[1])
			for(let i = 0; (i < moveAmount && i < 20); i++){
				let tr = randomItem(["w",1,"a",1,"s",1,"d",1,"",20])
				if(Math.random()*20 < moveAmount){
						tr = calculatePathStep(this.movethought[0],this.movethought[1],tar[0],tar[1],this.dimension)
					}

				let NEWPATHFINDER = Pathfind(this.movethought[0],this.movethought[1],tar[0],tar[1],this.dimension,55)

				if(NEWPATHFINDER[2].length > distance(this.movethought[0],this.movethought[1],tar[0],tar[1]) + 5){
					for(let p = 0; p < NEWPATHFINDER[2].length; p++){
						this.movethoughtUpdate(NEWPATHFINDER[2][p])
						myAction.push(NEWPATHFINDER[2][p])
					}
				}

				this.movethoughtUpdate(tr)
				myAction.push(tr)

			}
			} else {
				let moveAmount = Math.random()*2 + 17
				for(let i = 0; i < moveAmount; i++){
					let tr = randomItem(["w",2,"a",2,"s",2,"d",2,["com","001"],1])
					
					myAction.push(tr)

				}
			}


		} break;
		case "hunter":{
			//try to enter combat
			if(Math.random() > 0.5 && this.inCombat == false){
				for(let b = 0; b < enArr.length; b++){
					let i = enArr[b]
					if(!isSameTeam(i,this.id) &&enDict[i].dimension == this.dimension&&distance(this.x,this.y,enDict[i].x,enDict[i].y) <= 10){
						let a = CoordToChunk(enDict[i].x,enDict[i].y)
						myAction.push(["click",a,a.cx + a.cy*chunkSize+3])

					}
				}


			}
			//not in combat
			if(this.inCombat == false){

				this.movethought = [this.x,this.y]

				let tar = this.getPosTarget("findTarget")
			let moveAmount = distance(this.x,this.y,tar[0],tar[1])
			for(let i = 0; (i < moveAmount && i < 20); i++){
				let tr = randomItem(["w",1,"a",1,"s",1,"d",1,"",1])
				if(Math.random()*20 < moveAmount && this.Cstats.hp > 20){
						tr = calculatePathStep(this.movethought[0],this.movethought[1],tar[0],tar[1],this.dimension)
					}

				this.movethoughtUpdate(tr)
				myAction.push(tr)

			}

			}
			//inside combat
			 else {
				let moveAmount = Math.random()*2 + 17
				let ttar = ((allCombatInstances[this.inCombat].p1 == this.id )?allCombatInstances[this.inCombat].p2:allCombatInstances[this.inCombat].p1)
				let tar = [enDict[ttar].x,enDict[ttar].y]
				this.targeting = {"id":ttar,"turns":3}
				for(let i = 0; i < moveAmount; i++){
					let tr = randomItem(["w",1,"a",1,"s",1,"d",1,["com","001"],1,["com","002"],1])
					if(Math.random() > 0.5 && this.Cstats.hp > 20){			
						tr = calculatePathStep(this.movethought[0],this.movethought[1],tar[0],tar[1],this.dimension)
					}
					this.movethoughtUpdate(tr)
					myAction.push(tr)

				}
			}


		}break;
		case "preponderant":{

			if(Math.random() > 0.9 && this.inCombat == false){
				for(let b = 0; b < enArr.length; b++){
					let i = enArr[b]
					if(enDict[i].entityType == "player" && enDict[i].dimension == this.dimension&&distance(this.x,this.y,enDict[i].x,enDict[i].y) <= 3){
						let a = CoordToChunk(enDict[i].x,enDict[i].y)
						myAction.push(["click",a,a.cx + a.cy*chunkSize+3])

					}
				}


			}

			if(this.inCombat == false){
			let moveAmount = Math.random()*12
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",1,"a",1,"s",1,"d",1,"",30])
				myAction.push(tr)

			}
			} else {
				let moveAmount = Math.random()*2 + 17
				for(let i = 0; i < moveAmount; i++){
					let tr = randomItem(["w",2,"a",2,"s",2,"d",2,["com","001"],1,["com","002"],1,["com","003"],1])
					myAction.push(tr)

				}
			}
		}break;
		case "duck":{
			let moveAmount = Math.random()*20
			for(let i = 0; i < moveAmount; i++){
				let tr = randomItem(["w",2,"a",2,"s",2,"d",2,"",10])
				myAction.push(tr)

			}
		}break;
	}


		ACTIONPROCESS(myAction)
	}
	relay2(){



	}
	combatRelay(){}
	invrelay(){}
	recalculatePlayerLink(){
		if(this.stats.nondespawnable !== true){

			let dst = ["",10000000000]
			for(let i = 0; i < plArr.length; i++){
				let en = enDict[plArr[i]]
				let tdist = fastdistance(en.x,en.y,this.x,this.y)
				if(tdist < dst[1]){
					dst = [plArr[i],tdist]
				}

			}

			if(dst[1] < this.stats.despawnRange * this.stats.despawnRange){
				this.playerLink.p = dst[0]
				this.playerLink.dist = dst[1] 
				this.playerLink.sleep += Math.floor((Math.sqrt(dst[1])-this.stats.sleeprange)/20)
			} else {
				//i should despawn
				this.playerLink.p = dst[0]
				this.playerLink.dist = dst[1] 
				this.playerLink.sleep += Math.floor((Math.sqrt(dst[1])-this.stats.sleeprange)/20)
				console.log("despawn " + this.id)
			}
			return(this.playerLink)
		}
		return(0)
	}
	removeSelf(){
		
		delete usedIDs[this.id]
			let titems = removeEmptyArrStrings(this.Inventory)
			if(titems.length > 0 && this.stats.dropItems){
				DropItems(this.x,this.y,titems,this.dimension)
			}
		for(let i = enArr.length - 1; i > -1; i--){
			if(enArr[i] == this.id){
				enArr.splice(i,1)
			}
		}
		removeEntity(this.id)
	}

	kill(){				
		
		if(this.Cstats.hp <= 0 ){

			endCombatInstance(this.comid)

			this.removeSelf()
			return(true)
		}
		return(false)
	}
	save(){}

	entityCheckIfBlock(coords){
		let a;
		let t = CoordToMap(coords[0],coords[1],this.dimension)
		try{
			a = tnewMap[dimension][t[0]][t[1]][2]
		} catch {
			let ctc = CoordToChunk(coords[0],coords[1])

			GenerateChunk(ctc.x,ctc.y,this.dimension)

		}
			
		

		return(!isBlockage(coords[0],coords[1],this.dimension))

	}


	pressed(i){

		if(this.Cstats.hp <= 0 ){
			this.removeSelf()
			return;
		}


		if(i == "w"){
			let t = [this.x,this.y-1]
			if(this.entityCheckIfBlock(t)){
			this.y -= 1}
		}
		if(i == "s"){
			let t = [this.x,this.y+1]
			if(this.entityCheckIfBlock(t)){
			this.y += 1}
		}
		if(i == "a"){
			let t = [this.x-1,this.y]
			if(this.entityCheckIfBlock(t)){
			this.x -= 1}
		}
		if(i == "d"){
			let t = [this.x+1,this.y]
			if(this.entityCheckIfBlock(t)){
			this.x += 1}
		}
	}
	log(){}
	update(){
this.chunk = CoordToChunk(this.x,this.y)
	}
}

function removeEntity(id){
	delete enDict[id]
	console.log(id + " died")
}

function calculatePathStep(x,y,tx,ty,d){

	let stepTo = "none"

	let shortest = 999999


	let tk = distance(x,y-1,tx,ty)
	if(tk < shortest && !isBlockage(x,y-1,d)){
		stepTo = "w"
		shortest = tk
	}

	tk = distance(x,y+1,tx,ty)
	if(tk < shortest&& !isBlockage(x,y+1,d)){
		stepTo = "s"
		shortest = tk
	}

	tk = distance(x-1,y,tx,ty)
	if(tk < shortest&& !isBlockage(x-1,y,d)){
		stepTo = "a"
		shortest = tk
	}

	tk = distance(x+1,y,tx,ty)
	if(tk < shortest&& !isBlockage(x+1,y,d)){
		stepTo = "d"
		shortest = tk
	}

	return(stepTo)

}

function Pathfind(pt1x,pt1y,pt2x,pt2y,dimension,maxsteps){

  let Mempath = {}
  let alreadyFinished = {}
  alreadyFinished[pt1x+","+pt1y] = true
  Mempath[pt1x+","+pt1y] = -1
  let counter = 0
  let tempMempath = [[pt1x,pt1y]]
  let found = false
  
  for(let STEPS = 0; STEPS < maxsteps && !found; STEPS++){
    let alreadyStepped = {}
    let newtempMempath = []
    for(let i = 0; i < tempMempath.length; i++){
      let adderCx = tempMempath[i][0]
      let adderCy = tempMempath[i][1]
      
      for(let j = 0; j < 4; j++){
        
        let fin = []
        
        if(j == 0){
          fin = [adderCx+1,adderCy]
        } else if(j == 1){
          fin = [adderCx-1,adderCy]
        } else if(j == 2){
          fin = [adderCx,adderCy+1]
        } else if(j == 3){
          fin = [adderCx,adderCy-1]
        }
        
        
        if(alreadyFinished[fin[0]+","+fin[1]]==undefined&&!isBlockage(fin[0],fin[1],dimension) && alreadyStepped[fin[0]+","+fin[1]] == undefined){
          alreadyStepped[fin[0]+","+fin[1]] = true
          newtempMempath.push(fin)
        }
        
        if(fin[0] == pt2x && fin[1] == pt2y){
          found = true
          break;
        }
        
      }
    }
    
    tempMempath = newtempMempath
    for(let i = 0; i < tempMempath.length; i++){
      Mempath[tempMempath[i][0]+","+tempMempath[i][1]] = counter
      alreadyFinished[tempMempath[i][0]+","+tempMempath[i][1]] = true
    }
    counter++
    
  }
  
  let finalpath = []
   let finwalkstr = ""
  if(found){
    
    let stepsarr = [[pt2x,pt2y]]
    let currentPx = pt2x
    let currentPy = pt2y
    
    let currentCounter = counter
    for(let i = counter-1; i > -2; i--){
    for(let j = 0; j < 4; j++){
        
        let fin = []
        
        let walkstr = ""
       
        if(j == 0){
          fin = [currentPx+1,currentPy]
          walkstr = "a"
        } else if(j == 1){
          fin = [currentPx-1,currentPy]
          walkstr = "d"
        } else if(j == 2){
          fin = [currentPx,currentPy+1]
          walkstr = "w"
        } else if(j == 3){
          fin = [currentPx,currentPy-1]
          walkstr = "s"
        }
      
      let str = fin[0] + "," + fin[1]
      if(Mempath[str] == i-1){
        // currentCounter = Mempath[str] 
        stepsarr.unshift(fin)
        finwalkstr = walkstr + finwalkstr
        currentPx = fin[0]
        currentPy = fin[1]
        break;
        
      }
      
    }}
    
    finalpath = stepsarr

  }
  return([Mempath,finalpath,finwalkstr])
  
}



function isBlockage(x,y,d){

			let a;
		let t = CoordToMap(x,y,d)
		try{
			a = tnewMap[d][t[0]][t[1]][2]
		} catch {
			let ctc = CoordToChunk(x,y)

			GenerateChunk(ctc.x,ctc.y,d)
			t = CoordToMap(x,y,d)
		}
	
	if(!alreadyHasBlock(tnewMap[d][t[0]][t[1]][2])){

		for(let b = 0; b < enArr.length; b++){
			let i = enArr[b]
			if(enDict[i].x == x && enDict[i].y == y){
				return(true)
			}
		}
		return(false)

	}
	return(true)

}











var StartingPlayerSight = {}
for(let i = -20; i < 21;i++){
	for(let j = -20; j < 21;j++){
		StartingPlayerSight[i+","+j] = true
	}	
}

//================================ ------ =======================================================================
//================================ PLAYER =======================================================================
//================================ ------ =======================================================================
class player{
	constructor(id){
		this.sight = StartingPlayerSight
		this.entityType = "player"
		this.id = id
		usedIDs[id] = true
		this.x = -100
		this.y = 102
		this.chunk = {"x":0,"y":0}
		this.selectedSlot = 0
		this.dimension = "O"
		this.Inventory = ["U:12-A:10","B:5-A:250","U:5-A:100","U:4-A:100",""]
		this.effects = []
		this.inCombat = false
		this.followerTargeting = {}
		this.turncounters = {"calm":1,"energy":1}

		this.ownerH = {"master":id}

		this.Cstats = {"hp":100,"maxhp":100,"hunger":500,"maxhunger":500,"energy":200,"maxenergy":200}

		this.chestLink = ["none"]


		this.temporalMap = {}

		this.stepStatus = {"hp":0}


		this.entityStats = {
			"strength" : 1,
			"agility" : 1,
			"mana" : 1,
			"magic" : 1,
			"summoning" : 10

		}



		
	}



	switchItems(of,i1slot,i2slot){
		if(of == "chest" && this.chestLink[0]!="none"){
			let splitchiv = this.chestLink[1].split("=")
			let i1 = splitchiv[i1slot]
			let i2 = this.Inventory[i2slot]
			splitchiv[i1slot] = i2
			this.Inventory[i2slot] = i1
			let chivstr = ""
			for(let i = 0; i < splitchiv.length; i++){
				chivstr += "=" + splitchiv[i]
			}
			chestUpdate("update",chivstr.substring(1),this.chestLink[0],this.dimension)

		}

		
	}

	purgeMap(){
		this.temporalMap = {}
		io.to(this.id).emit("rarelay",["purge"])
	}


	say(e){
		for(let b = 0; b < plArr.length; b++){

			let i = plArr[b]

			if(distance(enDict[i].x,enDict[i].y,this.x,this.y) < 33){
				io.to(enDict[i].id).emit("chat",[(this.name ? this.name : this.id),e,this.x,this.y])
			}


		}
		console.log((this.name ? this.name : this.id) + " : " + e)
	}


	heal(e,supress){
		this.Cstats.hp += e
		if(this.Cstats.hp > this.Cstats.maxhp){
			this.Cstats.hp = this.Cstats.maxhp
			if(supress == undefined){
				this.log("you are fully healed!",cmdc.success)
			}
		}
	}


	hungerDeplete(e){
		if(e == undefined){
			this.Cstats.hunger -= Math.floor(Math.random()*3)
			if(this.Cstats.hunger < 150){
				this.Cstats.hp -= Math.floor((150-this.Cstats.hunger)/30)
				if(this.Cstats.hunger < 0){
					this.Cstats.hp -= 3
					this.Cstats.hunger = 0
				}
			}
		}else if(e == "tick"){
			this.Cstats.hunger -= Math.floor(Math.random()*3)
			if(this.Cstats.hunger < 150){
				this.Cstats.hp -= Math.floor((150-this.Cstats.hunger)/30)
				if(this.Cstats.hunger < 0){
					this.Cstats.hp -= 3
					this.Cstats.hunger = 0
				}
			} else if(this.Cstats.hunger > 200 && this.Cstats.hp != this.Cstats.maxhp){

				this.heal(1,"yes")
				if(this.Cstats.hp > this.Cstats.maxhp){
					this.Cstats.hp = this.Cstats.maxhp
				}
				this.Cstats.hunger -= 2

			}
		} else {
			this.Cstats.hunger -= e
			if(this.Cstats.hunger < 150){
				if(this.Cstats.hunger < 0){
					this.Cstats.hunger = 0
				}
		}
	}
}


	energyDeplete(e){
		let deplete = e
		this.turncounters.energy = minSub(this.turncounters.energy,2,0)[0]
		if(e == "walk"){
			deplete = [2,0.25]
		}

		if(this.Cstats.energy < this.Cstats.maxenergy * deplete[1] && this.Cstats.energy > 0){

			if(deplete[2] == undefined){
				if(Math.random() < 0.5){
					this.log("you are a bit exausted",cmdc.small_error)
					return(1)
				}
			} else {
				if(Math.random() > (this.Cstats.energy/this.Cstats.maxenergy)/deplete[2]){
					this.log("you are a bit exausted",cmdc.small_error)
					return(1)
				}
			}
		}

		this.Cstats.energy -= deplete[0]
		if(this.Cstats.energy <= 0){
			this.log("you are completely out of energy",cmdc.small_error)
			this.Cstats.energy = 0
			return(2)
		}		

		return(0)
	}
	hungerHeal(e){

		this.Cstats.hunger += e
		if(this.Cstats.hunger > this.Cstats.maxhunger){
			this.Cstats.hunger = this.Cstats.maxhunger
		}

	}
	energyHeal(e){

		if(e == undefined){

			if(this.Cstats.energy < this.Cstats.maxenergy){
				let hmulti = Math.floor(1+this.turncounters.energy/3)
				this.Cstats.energy += 5 * hmulti
				this.hungerDeplete(1*hmulti)
				if(this.Cstats.energy > this.Cstats.maxenergy){

					this.Cstats.energy = this.Cstats.maxenergy

				}

			}

		} else {

			this.Cstats.energy += e
			if(this.Cstats.energy > this.Cstats.maxenergy){
				this.Cstats.energy = this.Cstats.maxenergy
			}
		}
	}


	damage(e){
		this.Cstats.hp -= e
		return(this.kill())
	}


	kill(){

		if(this.Cstats.hp <= 0 ){
			io.to(this.id).emit("DeathScreen")
			DropItems(this.x,this.y,JSON.parse(JSON.stringify(this.Inventory)),this.dimension)

			this.heal = ()=>{}
			this.kill = ()=>{}
			return(true)

		}
		return(false)

	}
	save(){
		if(this.name != undefined){
			let n = this.name
			playerList[n].x = this.x
			playerList[n].y = this.y
			playerList[n].chunk = this.chunk
			playerList[n].selectedSlot = this.selectedSlot
			playerList[n].Inventory = this.Inventory
			if(this.keyholder != undefined){
				playerList[n].Inventory = this.Inventory
			}

		}
	}




	sendBeam(){
		let tempBeams = []
		for(let i = 0; i < relayBeams.length; i++){
			if(distance(relayBeams[i][0],relayBeams[i][1],this.x,this.y) < 100 && relayBeams[i][5] == this.dimension){
				tempBeams.push(relayBeams[i])
			}
		}

		io.to(this.id).emit("BeamRelay",tempBeams)

	}





	login(n,p){


		try{
		if(n.length > 16){
			this.log(CURRENTCONFIGS.ConsoleResponses.IGNLong,cmdc.error)
			return;
		}
		if(p.length > 3){
			this.log(CURRENTCONFIGS.ConsoleResponses.PsswdLong,cmdc.error)
			return;
		}
	} catch {
		this.log("invalid syntax",cmdc.error)
			return;
	}

		if(playerList[n] == undefined){
				if(this.name == undefined){
				playerList[n] = {"psswd":p}
				playerList[n].x = this.x
				playerList[n].y = this.y

				if(this.keyholder != undefined){
					playerList[n].keyholder = this.keyholder
				}

				playerList[n].dimension = this.dimension
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
			for(let b = 0; b < enArr.length; b++){
				let i = enArr[b]
				if(enDict[i].name == n && enDict[i].name != this.name){
					this.log("Player with this account is online right now!",cmdc.error)
					return;
				}
			}
			if(playerList[n].psswd == p){
				this.x = playerList[n].x
				this.y = playerList[n].y
				if(playerList[n].keyholder != undefined){
					this.keyholder = playerList[n].keyholder
				}
				this.dimension = playerList[n].dimension
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
			let t = CoordToMap(this.x,this.y-1,this.dimension)
			if(!alreadyHasBlock(tnewMap[this.dimension][t[0]][t[1]][2]) && this.energyDeplete("walk") == 0){
			this.y -= 1}
		}
		else if(i == "s"){
			let t = CoordToMap(this.x,this.y+1,this.dimension)
			if(!alreadyHasBlock(tnewMap[this.dimension][t[0]][t[1]][2])&& this.energyDeplete("walk") == 0){
			this.y += 1}
		}
		else if(i == "a"){
			let t = CoordToMap(this.x-1,this.y,this.dimension)
			if(!alreadyHasBlock(tnewMap[this.dimension][t[0]][t[1]][2])&& this.energyDeplete("walk") == 0){
			this.x -= 1}
		}
		else if(i == "d"){
			let t = CoordToMap(this.x+1,this.y,this.dimension)
			if(!alreadyHasBlock(tnewMap[this.dimension][t[0]][t[1]][2])&& this.energyDeplete("walk") == 0){
			this.x += 1}
		}
		else if(i == "t"){
			let item = this.Inventory[this.selectedSlot]
			this.Inventory[this.selectedSlot] = ""
			DropItems(this.x,this.y,[item],this.dimension)
			this.invrelay()

		}else if(i == "p"){

			let coord = CoordToMap(this.x,this.y,this.dimension)

			let item = removeOutterBracket(TNEWATTRIBUTEOF(tnewMap[this.dimension][coord[0]][coord[1]][2],"I"))
			if(item == "NONE"){return;}
			let amount = TNEWATTRIBUTEOF(item,"A")
			if(amount == "NONE"){
				amount = 1
				
			} else {

				amount = parseInt(amount)
				item = removeAttributeOf(item,"A")
			}

			let seegive = give(this.id,amount,item)
			if(seegive != "no space"){
				tnewMap[this.dimension][coord[0]][coord[1]][2] = removeAttributeOf(tnewMap[this.dimension][coord[0]][coord[1]][2],"I")
			}


		

		}
	}

	relay2(){
		io.to(this.id).emit('relay',[this.x,this.y,this.chunk])
		let tnpe = [];
		let tmap2 = {}

		for(let i = 0; i < tnewMap[this.dimension].length; i++){
			if(distance(tnewMap[this.dimension][i][0]*20+10,tnewMap[this.dimension][i][1]*20+10,this.x,this.y)<49){
				let sS = [tnewMap[this.dimension][i][0],tnewMap[this.dimension][i][1],tnewMap[this.dimension][i][2]]
				for(let j = 3; j < tnewMap[this.dimension][i].length; j ++){
					
					let xx = tnewMap[this.dimension][i][j][0] + sS[0]*chunkSize
					let yy = tnewMap[this.dimension][i][j][1] + sS[1]*chunkSize
					if(inRect(xx,yy,this.x-27,this.y-27,53,53)){
						if(tnewMap[this.dimension][i][j][2] != this.temporalMap[xx+","+yy]){
							tmap2[xx+","+yy] = tnewMap[this.dimension][i][j][2]
						}
						this.temporalMap[xx+","+yy] = tnewMap[this.dimension][i][j][2]

					}


				}
			}
		}


		// let unneeded = 0
		// for(let i = this.x-26; i < this.x+26; i++){
		// 	for(let j = this.y-26; j < this.y+26; j++){
		// 		let ctm = CoordToMap(i,j,this.dimension)
		// 		if(ctm[0] == undefined){
		// 			unneeded += 1
		// 			continue;
		// 		}
		// 		let tblock = tnewMap[this.dimension][ctm[0]][ctm[1]]

		// 		let	blockStr = tblock[2]
		// 		let coordstr = (i+","+j)
		// 		if(blockStr != this.temporalMap[coordstr]){
		// 			tmap2[coordstr] = blockStr
		// 		}
		// 		this.temporalMap[coordstr] = blockStr


		// 	}
		// }





		let t = []
		for(let b = 0; b < enArr.length; b++){
			let i = enArr[b]
			if(distance(enDict[i].x,enDict[i].y,this.x,this.y) < 33 && enDict[i].dimension == this.dimension&&i != this.id){
				t.push([enDict[i].x,enDict[i].y,enDict[i].entityType,[enDict[i].name,isSameTeam(i,this.id),i]])
			}
		}

		

		let stats = [this.Cstats.hp]
		// let testerData = [CURRENTCONFIGS,CURRENTCONFIGS,CURRENTCONFIGS,CURRENTCONFIGS]
		io.to(this.id).emit('mapUpdate2',[stats,t,tmap2])

	}



	combatRelay(close){
		io.to(this.id).emit('comrelay',[close])
	}



	statusRelay(){
		this.stepStatus = {"hp":this.Cstats.hp,"hunger":this.Cstats.hunger,"energy":this.Cstats.energy}
		io.to(this.id).emit("statusRelay",this.stepStatus)
		return(this.id)
	}



	invrelay(){
		let chiv = ""
		if(this.chestLink[0] != "none"){

			let chestXY = this.chestLink[0].split(",")

			if(distance(this.x,this.y,parseInt(chestXY[0]),parseInt(chestXY[1])) <= 3){
			chiv = this.chestLink
			} else {

				delete allChestLinks[this.chestLink[0]][this.id]
				this.chestLink = ["none"]


			}
		}
		io.to(this.id).emit('invrelay',[this.Inventory,this.selectedSlot,chiv])
	}
}





function isSameTeam(e1,e2){
	if(enDict[e1].ownerH.master == enDict[e2].ownerH.master){
		return(true)
	}
	return(false)
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

	for(let i = 1; i < dist; i++){
		let e = x+i*dx/dist
		let tout = [Math.round(e),Math.round(y + (e-x)*slope)]
		if(fout[0] == undefined||fout[fout.length-1][0] != tout[0] ||fout[fout.length-1][1] != tout[1]){
		fout.push(tout)}
	}


	} else {
		slope = y1 > y ? 1 : -1
		for(let i = 1; i < Math.abs(y1-y)+1; i++){
		let tout = [x,y + i*slope]
		if(fout[0] == undefined||fout[fout.length-1][0] != tout[0] ||fout[fout.length-1][1] != tout[1]){
		fout.push(tout)}
		}
	}

	return(fout)

}





function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}
function fastdistance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(a*a+b*b)
}

///////////////////////////////////////////////////////////////
var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('public'));

console.log("server is opened")
// console.log(perSeed.noise2D(0.2,0,0))
// console.log("seeds: " + JSON.stringify(perSeeds))





var socket = require('socket.io');

var ranStrucLists = {"GoldOre":["gold ore vein1",1,"gold ore vein2",1,"gold ore vein3",1,"gold ore vein4",1]}


var io = socket(server);

// socket = io("https://home.unsown.top")

io.sockets.on('connection', newConnection)
changingConfig.Build += 1
function updateChangingConfigFile(){
	fs.writeFile('./changingConfig.json',JSON.stringify(changingConfig), function writeJSON(err){if(err)return console.log(err)})
}
updateChangingConfigFile()

var shortValidationCode = Math.floor(Math.random()*1000)
console.log("new short validation code: " +shortValidationCode)
function tablearn(e){
	let indict = e[0]
	let inarr = e[1]
	let type = e[2]
	if(e[3] != shortValidationCode){
		return
	}

	console.log("recieved a tabcuts push by code: "+e[3])

	if(type == "force"){

		changingConfig.Tabcuts.dict = indict
		changingConfig.Tabcuts.arr = inarr

	}



	updateChangingConfigFile()
	shortValidationCode = Math.floor(Math.random()*1000)
	console.log("new short validation code: " +shortValidationCode)
}









var MainHelpMenu = CURRENTCONFIGS.ConsoleResponses.Help["Help1-1"] + changingConfig.Build + CURRENTCONFIGS.ConsoleResponses.Help["Help1-2"]
var disconnected = []

function newConnection(socket){
	// socket.on('requestMap', sendMap)
	socket.on('key', processKey)
	socket.on('CTsping',(e)=>{io.to(e).emit("cTSping")})
	socket.on('click', processClick)
	socket.on('selectInventorySlot', selectSlot)
	socket.on('AT',ACTIONPROCESS)
	socket.on("tablearn",tablearn)
	socket.on("returnPing",STOPPING)
	console.log(socket.id + " has joined at " + Date())

	let clientIp = socket.request.connection.remoteAddress

	console.log("Join IP = " + clientIp)

	broadcast("--"+socket.id+" has joined!",cmdc.item)
	enArr.push(socket.id)
	plArr.push(socket.id)
	enDict[socket.id] = new player(socket.id)


	enDict[socket.id].log(MainHelpMenu,"#A000FF")
	joined(socket.id)

	if(clientIp == "::ffff:192.168.1.1" || clientIp == "::1" || clientIp == "::ffff:223.18.29.177"){
		enDict[socket.id].keyholder = true
		enDict[socket.id].log("Automatic keyholder! welcome back","#00FFFF")
		enDict[socket.id].Inventory = ["U:12-A:1-Unb:0","B:5-A:250","U:18-A:100-Unb:0","U:4-A:100-Unb:0","U:13-A:1-Unb:0","U:17-A:1-Unb:0",""]
		enDict[socket.id].entityStats.summoning += 100
	}


	io.to(socket.id).emit('sendWhenJoin', socket.id)
	io.to(socket.id).emit("rarelay",["ticklim",TickLimit-10])
	enDict[socket.id].relay2()
	
	    socket.on('disconnect',function(){disconnected.push(socket)});
}



	



	function joined(e){

		let a = [
			CURRENTCONFIGS.BLOCKSALL,
			CURRENTCONFIGS.HeightMap,
			CURRENTCONFIGS.TILESALL,
			CURRENTCONFIGS.SLABSALL,
			CURRENTCONFIGS.TileImageReferenceDict,
			CURRENTCONFIGS.EntityImageReferenceDict,
			CURRENTCONFIGS.IimageLinkReferenceDict,
			[CURRENTCONFIGS.ConsoleResponses.Help,MainHelpMenu]
		]

		io.to(e).emit("config",a)
	}


 function disconnect(){
 	updatePlayerFile()
 	for(let i = 0; i < disconnected.length; i++){
 		let socket = disconnected[i]
        console.log(socket.id + " has disconnected");
        broadcast("--"+socket.id+" has left!",cmdc.small_error)

        


        if(enDict[socket.id].chestLink[0] != "none"){
        	delete allChestLinks[enDict[socket.id].chestLink[0]][socket.id]

        }


        if(enDict[socket.id].inCombat !== false){
        			endCombatInstance(enDict[socket.id].inCombat)
        		}

        for(let i = 0; i < enArr.length; i++){

        	if(enArr[i] == socket.id){


        		enArr.splice(i,1)
        		break
        		}
        	}

        for(let i = 0; i < plArr.length; i++){

        	if(plArr[i] == socket.id){


        		plArr.splice(i,1)
        		break
        		}
        }
        delete enDict[socket.id]

    	}

        disconnected = []
    }


function allPlayersGenerateChunks(){
		// let ps = enArr
	for(let p = 0; p < enArr.length; p++){

		let entityID = enArr[p]

		enDict[entityID].update()
		if(enDict[entityID].entityType == "player"){


			
	for(let i = -1; i < 2; i++){
		for(let j = -1; j < 2; j++){
			try{
			if(generatedChunks[enDict[entityID].dimension][(enDict[entityID].chunk.x+j)+","+(enDict[entityID].chunk.y+i)] == undefined){
				GenerateChunk(enDict[entityID].chunk.x+j,enDict[entityID].chunk.y+i,enDict[entityID].dimension)
			}}
			catch(err){
				console.log(err)
				break
			}
		}	
	}

		enDict[entityID].relay2()

	}
}
}




class timeAllowedFunctions{

	static nppVars = {"counter":0,"done":false}

	static nonPlayerProcess(timeAllowed){
	if(this.nppVars.done){
		return(true)
	}
	let starttime = Date.now()
	let tcounter = this.nppVars

	for(;tcounter.counter < enArr.length && Date.now() < starttime + timeAllowed; tcounter.counter++){
			if(enDict[enArr[tcounter.counter]].entityType!="player"){
				enDict[enArr[tcounter.counter]].nonPlayerActions()
			}
		}
	if(tcounter.counter >= enArr.length){
		tcounter.counter = 0
		tcounter.done = true
		return(true)
	} else {
		return(tcounter.counter)}


	}
}


function temptest(){
	let final = TAF2.PMEM("final",0)
	for(let i = TAF2.checkpoints1.a; i < 148; i++){


		if(TAF2.checkPoint("end","a",i)){
			TAF2.memories1.final = final
			return(["checked",final])
		}

		let tout = temptest4()
		if(tout[0] == "checked"){
			TAF2.memories1.final = final
			return([tout,final])
		}
		final += tout

		
	}
	delete TAF2.memories1.final
	TAF2.checkpoints1.a = 0
	return(final)
}
function temptest4(){
	let final = TAF2.PMEM("final2",0)
	for(let j = TAF2.checkpoints1.b; j < 1; j++){
		if(TAF2.checkPoint("end","b",j)){
			TAF2.memories1.final2 = final
			return(["checked",final])
		}
		final += Math.pow(Math.PI,Math.PI)
	}
	delete TAF2.memories1.final2
	TAF2.checkpoints1.b = 0
	return(final)
}






function temptest2(){
	let final = 0
	for(let j = 0; j < 1; j++){
		final += Math.pow(Math.PI,Math.PI)
	}
	return(final)
}
function temptest3(){
	let final = 0
	for(let i = 0; i < 148; i++){
		final += temptest2()
	}
	return(final)
}


class TAF2{
	static checkpoints1 = {"a":0,"b":0}
	static memories1 = {}

	static PMEM(mem,startup){
		if(this.memories1[mem] != undefined){
			return(this.memories1[mem])
		}
		this.memories1[mem] = startup
		return(startup)
	}


	static checkPoint(a,b,c){
		this.checkpoints1[b] = c
		if(Math.random()<0.01){
			return(true)
		}
		return(false)
	}

	static discardQ(e){

	}
}



//ticksearch & main loop/mainloop
var ACTIONLOGS = []
var TIME = 0

var TickLimit = 70
var serverTickWait = 50

function doSomething(startTime){
	if(TIME < TickLimit-10){
		TIME += 1
		io.emit('TIME',TIME)
		if(TIME > 0){
		timeAllowedFunctions.nonPlayerProcess(startTime+serverTickWait-Date.now()-10)}
	} else if(TIME == TickLimit-10){
		allPlayersGenerateChunks()
		TIME += 1
		io.emit('TICK')
		SERVERCOUNTERS.ticks += 1
		if(DEBUGGINGLOGS.ticktoggle == 1){
		console.log("tick")
	}

		timeAllowedFunctions.nonPlayerProcess(Infinity)
		timeAllowedFunctions.nppVars.done = false

	} else if(TIME < TickLimit){
		TIME += 1
	} else if(TIME == TickLimit){

		TIME = getLongestPlayerAction() * -5
		ACTIONLOGS.push(processees)
		tickAllBlocks()
	}
	if(TIME < 0 && TIME % 5 === 0){
		processPlayersActions()
		allPlayersSendBeams()
		allPlayersGenerateChunks()

		for(let i = 0; i < plArr.length; i++){
				let a = enDict[plArr[i]].statusRelay()
				if(enDict[plArr[i]].chestLink[0] != "none"){
					enDict[plArr[i]].invrelay()
				}
		}

	}else if(TIME == 0){

		cvents.call("ATick")

		ProcessStep = 1
		for(let i = enArr.length -1; i > -1; i--){
			let enid = enArr[i]
			enDict[enid].save()
			if(enDict[enid].entityType=="player"){
				enDict[enid].relay2()
				enDict[enid].invrelay()
				if(enDict[enid].turncounters.energy < 10){
				enDict[enid].turncounters.energy += 1}
				
				enDict[enid].hungerDeplete("tick")
				enDict[enid].energyHeal()
				enDict[enid].statusRelay()
			io.to(enDict[enid].id).emit('chatUpdate')}
			enDict[enid].kill()
			
		}



		entitiesCollectiveActions = []
		combatMoveTracker = {}



		allEffectTick()
		
		disconnect()

	}
	
}



setInterval(()=>{
	let a = Date.now() 
    doSomething(a)
}, serverTickWait);


setInterval(function(){if(startPing == 1){pping++}},1)


function TicklimUpdate(e){
	TickLimit = e + 10
	io.emit("rarelay",["ticklim",e])
}

function tellPerlin(x,y,d){
	console.log(perSeeds[d].noise2D(x/100,y/100,0))
}


/////////////////////////////////////////////////////////////
//game functions//===================================================================================

function posHasEntity(x,y,d){
	for(let i = 0; i < enArr.length; i++){
		let en = enDict[enArr[i]]
		if(en.x == x && en.y == y && en.dimension == d){
			return(enArr[i])
		}
	}
}

function allEffectTick(){
	for(let i = 0; i < enArr.length; i++){
		let enid = enArr[i]
		for(let j = enDict[enid].effects.length-1; j > -1 ; j--){
			enDict[enid].effects[j][1] -= 1
			if(enDict[enid].effects[j][1] < 1){
				enDict[enid].effects.splice(j,1)
			}
		}
	}
}


function allPlayersSendBeams(){
	for(let i = 0 ; i < plArr.length; i++){
		let enid = plArr[i]
		enDict[enid].sendBeam()
	}

	relayBeams = []

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
	"switch":[],
	"drag":[],
	"command":[],
	"key":[],
	"combat":[]
}
var processeeOrders = ["click","combat","drag","key","command","select","switch"]

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
		} else if(s[0] == "drag"){
			//if action is drag
			processees["drag"].push([q,s])
		}  else if(s[0] == "com" && CombatMoveUpdate(q)){
			processees["combat"].push([q,s])
		} else if(s[0] == "swt" && CombatMoveUpdate(q)){
			processees["switch"].push([q,s])
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
	"drag":[],
	"switch":[],
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
	// let r = findPlayerInArr(p)

	if(typeof(s) == "string" && s.length == 1){
		//if action is key
		processKey([p,s])
	} else if(typeof(s) == "string" && s[0] == "$"){
		s = s.substring(1)
		processCommand(p,s)



	} else {
		if(s[0] == "click"){
			//if action is click
			processClick([p,s[1],s[2]])
		} else if(s[0] == "sel"){
			//if action is select
			selectSlot([p,s[1]])
		} else if(s[0] == "drag"){
			//if action is drag

			for(let i = 0; i < s[1].length; i++){
				processClick([p,s[1][i][0],s[1][i][1]])
			}

			// processClick([p,s[1],s[2]])
		} else if(s[0] == "swt"){
			//if action is switch
			enDict[p].switchItems("chest",s[1],enDict[p].selectedSlot)
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

		enDict[p].say(fstr)
	} 
	//help command
	else if(strsplit[0] == "H" || strsplit[0] == "h" || strsplit[0] == "help"){
		// helpCommand(strsplit,p)
	}
	//setblock command
	else if(strsplit[0] == "set" && enDict[p].keyholder == true){
		let pos = getRelativity(p,strsplit[1],strsplit[2])
		setblock(pos[0],pos[1],strsplit[3],enDict[p].dimension)
	}

	//give command
		else if(strsplit[0] == "give" && enDict[p].keyholder == true){
		give(p,parseInt(strsplit[1]),strsplit[2])
	}
	//tp command
		else if((strsplit[0] == "tp" || strsplit[0] == "teleport")&& enDict[p].keyholder == true){
		tp(p,strsplit[1],strsplit[2])
	}
	//fgoto command
		else if(strsplit[0] == "fgoto" || strsplit[0] == "commandto"){
			let tempos = getRelativity(p,strsplit[2],strsplit[3])
			if(strsplit[2] == "me"){
				enDict[p].followerTargeting[strsplit[1]] = undefined
			}
			else if(tempos != "NONE"){
			enDict[p].followerTargeting[strsplit[1]] = [tempos[0],tempos[1]]}

		}

	//ticklimit command
		else if((strsplit[0] == "ticklim" || strsplit[0] == "ticklimit" )&&enDict[p].keyholder == true){
			TicklimUpdate(parseInt(strsplit[1]))
		}

	//broadcast command
		else if(strsplit[0] == "broadcast" && enDict[p].keyholder == true){
		broadcast(str.substring(9),"#FF0000")
	}	else if(strsplit[0] == "broadcastcol" && enDict[p].keyholder == true){
		broadcast(str.substring(13+strsplit[1].length),strsplit[1])
	}

		else if((strsplit[0] == "dimensionjump" || strsplit[0] == "djump")&& enDict[p].keyholder == true){
		if(strsplit[1] == "O" || strsplit[1] == "T"){
			enDict[p].dimension = strsplit[1]
			enDict[p].log("jumped to dimension " + strsplit[1],cmdc.success)
		} else {
			enDict[p].log("non existant dimension - " + strsplit[1],cmdc.error)
		}
	}

	//summon command
		else if(strsplit[0] == "summon" && enDict[p].keyholder == true){
		let tempFstore = summonCmd(p,strsplit[1],strsplit[2],strsplit[3],strsplit[4])
		if(tempFstore == undefined){
			enDict[p].log("summoned successfully",cmdc.success)
		} else {
			enDict[p].log("Cannot summon, Possible overlapping ID",cmdc.error)
		}

	}
	
	//generate structure command
	else if(strsplit[0] == "gen" && enDict[p].keyholder == true){
		generateStructureCmd(p,strsplit[1],strsplit[2],strsplit[3],strsplit[4],strsplit[5])

	}

	//pull tabcuts command
	else if(strsplit[0] == "pulltabcuts" && enDict[p].keyholder == true){
		io.to(p).emit("rarelay",["pulltabcuts",changingConfig.Tabcuts])
		enDict[p].log("successfully pulled tabcuts",cmdc.success)
	}

	//playerno command
		else if(strsplit[0] == "pno"){
		ArrLoc(p)
	}
	//purge command
		else if(strsplit[0] == "purge" || strsplit[0] == "mapurge"){
		enDict[p].purgeMap()
	}
	//login command

		else if(strsplit[0] == "login"){
		enDict[p].login(strsplit[1],strsplit[2])
		updatePlayerFile()
	}
	//permissions command
		else if(strsplit[0] == "keyholder" || strsplit[0] == "kh"){
			if(strsplit[1] == consoleKey){
				enDict[p].keyholder = true
				enDict[p].log("you are now a keyholder",cmdc.success)
			} else {
				enDict[p].log("wrong key!",cmdc.error)
			}
	}


	//unrecognized command
	else{
		console.log("invalid command:" + strsplit)
		enDict[p].log("Invalid command.</br> If you think this should be a command, tell me your idea in discord. (lopkn#0019)","#FF0000")
	}


} else {
	//normal say
	if(st[0] == " "){
		st = st.substring(1)
	}
	enDict[p].say(st)

}


}

function updatePlayerFile(){
fs.writeFile('./playerList.json',JSON.stringify(playerList,null,4), function writeJSON(err){if(err)return console.log(err)})
}

function processKey(e){
	if(enDict[e[0]] != undefined){
		enDict[e[0]].pressed(e[1])
	}
}



function generateStructureCmd(p,s,x,y,d,o){
	generateStructure(s,parseInt(x),parseInt(y),d,JSON.parse(o))
}

function emitServerLightning(i1,i2){
	ParticleRelay(["DevServerLightning",i1,i2],dimension)
}

function emitLightning(x,y,xx,yy,ty,dimension){
	let xa = x + (xx-x)/7
	let ya = y + (yy-y)/7
	ParticleRelay(["DevLightning",[x,y,xa,ya,ty]],dimension)
}


function ParticleRelay(arr,dimension,bounding){

	for(let i = 0; i < plArr.length; i++){
		let enid = plArr[i]
		if(enDict[enid].dimension == dimension){
			io.to(enDict[enid].id).emit("ParticleRelay",arr)
		}
	}


}


function chestUpdate(type,str,pos,d){
	let dimension = "O"
	if(d != undefined){
		dimension = d
	}
	let apos = pos.split(",")
	let tctm = CoordToMap(parseInt(apos[0]),parseInt(apos[1]),dimension)
	let tcstr = tnewMap[dimension][tctm[0]][tctm[1]][2]
	
	if(type == "update"){
		let nstrn = removeAttributeOf(tcstr,"Ch") + "-Ch:["+str+"]"
		tnewMap[dimension][tctm[0]][tctm[1]][2] = nstrn
		let objk = Object.keys(allChestLinks[pos])
		for(let i = 0; i < objk.length; i++){
			enDict[objk[i]].chestLink[1] = str
			// enDict[objk[i]].invrelay()
		}
	}


	else if(type == "delete"){
		tnewMap[dimension][tctm[0]][tctm[1]][2] = removeAttributeOf(tcstr,"Ch")
	}
}



var relayBeams = []
function processClick(e){

	let r = e[0]

	if(r == undefined || enDict[r] == undefined || enDict[r].Cstats.hp <= 0){
		if(DEBUGGINGLOGS.click == 1){
			console.log("processClick: " + e)
		}
		return
	}

	let dimension
	try{
		dimension = enDict[r].dimension
	} catch{
		console.log(r + "," + JSON.stringify(enDict).length)
	}
	let chunkPos



	try{chunkPos = generatedChunks[dimension][e[1].x + "," + e[1].y]
	} catch {console.log(concol.Red,e)}
	let item = selectedSlotItems(e[0])
	let a = parseInt(amountOfItems(e[0]))

	let att = TNEWATTRIBUTEOF(item,"B")
	let att2 = TNEWATTRIBUTEOF(item,"Sl")

	let originPos = [enDict[r].x,enDict[r].y]

	let decodedXY = rCoordToChunk(e[1])
	let clickedDistance = distance(enDict[r].x,enDict[r].y,decodedXY.x,decodedXY.y)
	let clickedEntity = posHasEntity(decodedXY.x,decodedXY.y,dimension)
	
	let clickResult = "none"
	

	try{
		if(alreadyHasBlock(tnewMap[dimension][chunkPos][e[2]][2])){}
	} catch {
		console.log("cerr",chunkPos,e)
	}
	//use instant item
	let itemconfigs = CURRENTCONFIGS.IinstantReferenceDict[TNEWATTRIBUTEOF(item,"In")]
	if(itemconfigs != undefined){

		let tempinst = processInstantItemUsage(r,itemconfigs,decodedXY.x,decodedXY.y)
		if(tempinst == undefined){
			return;
		}


	}




		let c = clickedEntity

		if(c != undefined && c != r && !enDict[c].inCombat && !enDict[r].inCombat && !isSameTeam(r,c)){
			if(clickedDistance <= 13 && enDict[c].Cstats.hp > 0){
			allCombatInstances[JSON.stringify(combatIdCounter)] = new combatInstance(enDict[r].id,enDict[c].id)
			console.log("new combat instance: " +enDict[r].id+","+enDict[c].id)
			enDict[r].combatRelay(enDict[c].entityType)
			enDict[c].combatRelay(enDict[r].entityType)
			enDict[r].log((enDict[c].name ? enDict[c].name : ((enDict[c].entityType == "player") ? enDict[c].id : enDict[c].entityType))+" has entered combat with you!",cmdc.combat)
			enDict[c].log((enDict[r].name ? enDict[r].name : ((enDict[r].entityType == "player") ? enDict[r].id : enDict[r].entityType))+" has entered combat with you!",cmdc.combat)
			clickResult = "EnterCombat"
		}
	}





//clicked on a chest

	let tchestblocktypes = CURRENTCONFIGS.AttributeTypes.ChivBlocks

	for(let loop = 0; loop < tchestblocktypes.length; loop++){
		if(TNEWATTRIBUTEOF(tnewMap[dimension][chunkPos][e[2]][2],tchestblocktypes[loop]) != "NONE"){
			if(clickedDistance <= 3){

			chestInv = removeOutterBracket(TNEWATTRIBUTEOF(tnewMap[dimension][chunkPos][e[2]][2],tchestblocktypes[loop]))

			let chestAtt = [decodedXY.x+","+decodedXY.y]

		    	if(enDict[r].chestLink[0] != chestAtt){
		    		enDict[r].chestLink = [decodedXY.x+","+decodedXY.y,chestInv,tchestblocktypes[loop]] 
		    		let tempclink = allChestLinks[decodedXY.x+","+decodedXY.y]

		    		if(tempclink == undefined){
		    			allChestLinks[decodedXY.x+","+decodedXY.y] = {}
		    		}

		    		allChestLinks[decodedXY.x+","+decodedXY.y][r] = tchestblocktypes[loop]
		    		enDict[r].invrelay()


		    	} else {
		    		enDict[r].chestLink = ["none"]
		    		delete allChestLinks[decodedXY.x+","+decodedXY.y][enDict[r].id] 
		    		if(Object.keys(allChestLinks[decodedXY.x+","+decodedXY.y]).length == 0){
		    			delete allChestLinks[decodedXY.x+","+decodedXY.y]
		    		}
		    		enDict[r].invrelay()

		    	}

		    	clickResult = "Chest"
			} else {
				enDict[r].log("you are too far away!",cmdc.small_error)
			}
		}	
	}


	if(clickResult == "none"){
	if(att != "NONE" && a > 0){
		//placeblock
		if(!alreadyHasBlock(tnewMap[dimension][chunkPos][e[2]][2])){
			
			if(clickedDistance <= 12 && clickedDistance != 0){
				tnewMap[dimension][chunkPos][e[2]][2] = removeAttributeOf(tnewMap[dimension][chunkPos][e[2]][2],"D")
				tnewMap[dimension][chunkPos][e[2]][2]  += "-B:" + att
				let txatt = CURRENTCONFIGS.BLOCKSALL[att].datt
				if(txatt != undefined){
					tnewMap[dimension][chunkPos][e[2]][2] += "-"+ txatt.att

					if(txatt.tk){
						allTickyBlocks.push([decodedXY.x,decodedXY.y,dimension])
					}

				}
				// if(att == "8"){
				// 	tnewMap[dimension][chunkPos][e[2]][2] += "-Tk:[XPL:1]"
				// 	allTickyBlocks.push([decodedXY.x,decodedXY.y,dimension])
				// }
				processItemUsage(r,"norm")

				if(TNEWATTRIBUTEOF(tnewMap[dimension][chunkPos][e[2]][2],"I") != "NONE"){
					DropItems(decodedXY.x,decodedXY.y,[removeOutterBracket(TNEWATTRIBUTEOF(tnewMap[dimension][chunkPos][e[2]][2],"I"))],dimension)
					tnewMap[dimension][chunkPos][e[2]][2] = removeAttributeOf(tnewMap[dimension][chunkPos][e[2]][2],"I")
				}


				clickResult = "BlockPlace"
			} else {
				enDict[r].log("you are too far away to place a block there!",cmdc.small_error)
				clickResult = "FarBlockPlace"
			}

		}
	}else if(att2 != "NONE" && a > 0){
		if(!alreadyHasBlockATT(tnewMap[dimension][chunkPos][e[2]][2],"Sl")){
			
			if(distance(decodedXY.x,decodedXY.y,enDict[r].x,enDict[r].y) <= 12){
				tnewMap[dimension][chunkPos][e[2]][2] += "-Sl:" + att2
				processItemUsage(r,"norm")
				clickResult = "SlabPlace"
			} else {
				enDict[r].log("you are too far away to place a slab there!",cmdc.small_error)
				clickResult = "FarSlabPlace"
			}

		} //util break


		}





	else {
		let utilityNum = TNEWATTRIBUTEOF(item,"U")
		if(utilityNum != "NONE"){
			
			let utilityType = CURRENTCONFIGS.IutilityReferenceDict[utilityNum].type
			let utilityStrength = CURRENTCONFIGS.IutilityReferenceDict[utilityNum].strength
			if((utilityType == "multitul" || utilityType == "pax")&&alreadyHasBlock(tnewMap[dimension][chunkPos][e[2]][2])){

			let seeBreak = TNEWbreakBlockBy(tnewMap[dimension][chunkPos][e[2]][2],utilityStrength+Math.floor(Math.random()*10-5))
			processItemUsage(r,"utility")
			if(seeBreak == "remove"){

	
				let temparr =BreakBlock(tnewMap[dimension][chunkPos][e[2]][2],"block",decodedXY.x,decodedXY.y,dimension,r)
				tnewMap[dimension][chunkPos][e[2]][2] = temparr[0]
				DropItems(decodedXY.x,decodedXY.y,temparr[1],dimension)

				clickResult = "BreakBlock"
		
	

			} else {
				tnewMap[dimension][chunkPos][e[2]][2] = seeBreak
				clickResult = "HitBlock"
			}

		}else if(utilityType == "staff"){
			let staffInfo = CURRENTCONFIGS.IutilityReferenceDict[utilityNum].staff
			
			if(staffInfo.type == "lightning" && a > 0){
				if(utilityNum == 7){
					emitLightning(enDict[r].x,enDict[r].y,decodedXY.x,decodedXY.y,"DevLightning",dimension)
				} else {

					let tnormalized = vectorNormalize([enDict[r].x,enDict[r].y,decodedXY.x,decodedXY.y],2)

					let tf = (x,y,dur)=>{
						let td = dimension
						enArr.forEach((e)=>{
							let en = enDict[e]
							if(en.x == x && en.y == y && en.dimension == td){

								en.damage(Math.floor(Math.random()*11 + 10))
								ParticleRelay(["Apar",["Circle",[x,y,3]],dur],td)
							}

							
						})
					if(breakBlockBy(x,y,td,Math.random()*20+20,{"type":"all"}) != "no block"){
								ParticleRelay(["Apar",["Circle",[x,y,2]],dur],td)
							}
					}


					let tlight = serverLightning2(tnormalized,7,0.5,{"dur":0},tf)



					emitServerLightning(tlight[0],tlight[1])
				}
				processItemUsage(r,"utility")
			}
			else if(staffInfo.type == "explosive" && a > 0){
				explosion(decodedXY.x,decodedXY.y,staffInfo.size,dimension)
				processItemUsage(r,"utility")
			}else if(staffInfo.type == "teleporting" && a > 0){
				enDict[r].x = decodedXY.x
				enDict[r].y = decodedXY.y
				clickResult = "Teleport"
				processItemUsage(r,"utility")
			}

			else if(staffInfo.type == "summoning" && a > 0){


				let playermagic = enDict[r].entityStats.summoning
				let tid = r+Math.floor(Math.random()*playermagic+1.3)
				let tcstats = {"ownerH":{"master":"wild"+tid},"dropItems":false}
				if(staffInfo.following == true){
					tcstats["ownerH"] = {"master":enDict[r].ownerH.master,"summoner":r}
				} 
				summonNewMob(staffInfo.mob,decodedXY.x,decodedXY.y,tid,dimension,tcstats)
				clickResult = "Staff"
				processItemUsage(r,"utility")


			}

		}	
	}


	}}

	relayBeams.push([originPos[0],originPos[1],decodedXY.x,decodedXY.y,clickResult,dimension])
}


function removeEmptyArrStrings(arr){
	for(let i = arr.length-1; i > -1; i--){

		if(arr[i] == ""){

			arr.splice(i,1)
		}
	}
	return(arr)
}



function DropItems(x,y,arr,d,forced){


	let dimension = "O"
	if(d != undefined){
		dimension = d
	}
	
	let cchunk = CoordToMap(x,y,dimension)


	let tilename = undefined;
	// let e2 = 3+((x%chunkSize)+(y%chunkSize)*chunkSize)
	try{
	tilename = tnewMap[dimension][cchunk[0]][cchunk[1]][2]} catch{
		console.log("cerr dropi",cchunk,x,y)
		let ccc = CoordToChunk(x,y)
		GenerateChunk(ccc.x,ccc.y,dimension)
		cchunk = CoordToMap(x,y,dimension)
		tilename = tnewMap[dimension][cchunk[0]][cchunk[1]][2]
	}

	if(tileItemable(tilename) || forced == true){
		if(arr[0] != "" && arr[0] != undefined){
			tnewMap[dimension][cchunk[0]][cchunk[1]][2] += ("-I:["+arr[0]+"]")
		}
		

		if(arr.length > 1){
			try{
			arr.splice(0,1)} catch {console.log("cerr dropi2",arr)}
			DropItems(x+Math.round(Math.random()*4-2),y+Math.round(Math.random()*4-2),arr,dimension)
		}
		return(true)

	} else {
		DropItems(x+Math.round(Math.random()*4-2),y+Math.round(Math.random()*4-2),arr,dimension)
	}




}




function helpCommand(e,p){
	
	if(e[1] != undefined){
		e[1] = e[1].toLowerCase()
	}
	if(e[1] == "1" || e[1] == undefined || e[1] == "game" || e[1] == "general"){
		enDict[p].log(MainHelpMenu,"#A000FF")
	} else if(e[1] == "2" || e[1] == "list" || e[1] == "content"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses.Help2,"#FFFF00")
	} else if(e[1] == "3" || e[1] == "buffer"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses.Help3,"#FFFF00")
	} else if(e[1] == "4" || e[1] == "tick" || e[1] == "ticks" || e[1] == "movement" || e[1] == "move"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses.Help4,"#FFFF00")
	} else if(e[1] == "5" || e[1] == "text" || e[1] == "input"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses.Help5,"#FFFF00")
	} else if(e[1] == "6" || e[1] == "command" || e[1] == "commands" || e[1] == "6.0"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses["Help6-0"],"#FFFF00")
	} else if(e[1] == "6.1" || e[1] == "command1" || e[1] == "commands1"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses["Help6-1"],"#FFFF00")
	} else if(e[1] == "6.2" || e[1] == "command2" || e[1] == "commands2"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses["Help6-2"],"#FFFF00")
	} else if(e[1] == "6.3" || e[1] == "command3" || e[1] == "commands3"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses["Help6-3"],"#FFFF00")
	} else if(e[1] == "7" || e[1] == "combat" || e[1] == "battle"){
		enDict[p].log(CURRENTCONFIGS.ConsoleResponses.Help7,"#FFFF00")
	} else {
		enDict[p].log("Invalid help option.</br> If you think entities would need help with this, tell me your idea in discord. (lopkn#0019)","#FF0000")
	}
}




function breakBlockBy(x,y,d,a,options){

	let type = options.type
	let r = options.player
	let tout;
	let tctm = CoordToMap(x,y,d)
	let str = tnewMap[d][tctm[0]][tctm[1]][2]
	let baseatt = BASEATTRIBUTESOF(str)
	if(type == undefined || type == "block"){
		
		if(baseatt.includes("B")){

			let blocktype = TNEWATTRIBUTEOF(str,"B")
			let tempdur = baseatt.includes("D") ? TNEWATTRIBUTEOF(str,"D") : BLOCKSALL[blocktype][2]
			tempdur -= a
			if(tempdur <= 0){
				
	
				let temparr = BreakBlock(str,"block",x,y,d,r)
				tnewMap[d][tctm[0]][tctm[1]][2] = temparr[0]
				//ITEMDROP
				if(options.item != "remove"){
					if(options.item == "scatter"){
						DropItems(x+Math.round(Math.random()*4-2),y+Math.round(Math.random()*4-2),temparr[1],d)
					} else {
						DropItems(x,y,temparr[1],d)
					}
				}

				return("remove")
			}
			tout = MODIFYATTRIBUTEOF(str,"D",tempdur)
			tnewMap[d][tctm[0]][tctm[1]][2] = tout

			return(tout)
		}
		return("no block")
	}



	if(type == "all"){
		if(baseatt.includes("B")){

			let blocktype = TNEWATTRIBUTEOF(str,"B")
			let tempdur = baseatt.includes("D") ? TNEWATTRIBUTEOF(str,"D") : BLOCKSALL[blocktype][2]
			tempdur -= a
			if(tempdur <= 0){
				
	
				let temparr = BreakBlock(str,"block",x,y,d,r)
				tnewMap[d][tctm[0]][tctm[1]][2] = temparr[0]
				//ITEMDROP
				if(options.item != "remove"){
					if(options.item == "scatter"){
						DropItems(x+Math.round(Math.random()*4-2),y+Math.round(Math.random()*4-2),temparr[1],d)
					} else {
						DropItems(x,y,temparr[1],d)
					}
				}

				return("remove")
			}
			tout = MODIFYATTRIBUTEOF(str,"D",tempdur)
			tnewMap[d][tctm[0]][tctm[1]][2] = tout

			return(tout)
		} else if(baseatt.includes("Sl")){

			let blocktype = TNEWATTRIBUTEOF(str,"Sl")
			let tempdur = baseatt.includes("D") ? TNEWATTRIBUTEOF(str,"D") : BLOCKSALL[blocktype][2]
			tempdur -= a
			if(tempdur <= 0){
				let temparr = BreakBlock(str,"slab",x,y,d,r)
				tnewMap[d][tctm[0]][tctm[1]][2] = temparr[0]
				//ITEMDROP
				if(options.item != "remove"){
					if(options.item == "scatter"){
						DropItems(x+Math.round(Math.random()*4-2),y+Math.round(Math.random()*4-2),temparr[1],d)
					} else {
						DropItems(x,y,temparr[1],d)
					}
				}
				return("remove")
			}
			tout = MODIFYATTRIBUTEOF(str,"D",tempdur)
			tnewMap[d][tctm[0]][tctm[1]][2] = tout

			return(tout)
		}
		return("no block")

	}



	if(type == "slab"){
		if(baseatt.includes("B")){
			return("cant break")
		}
		if(baseatt.includes("Sl")){

			let blocktype = TNEWATTRIBUTEOF(str,"Sl")
			let tempdur = baseatt.includes("D") ? TNEWATTRIBUTEOF(str,"D") : BLOCKSALL[blocktype][2]
			tempdur -= a
			if(tempdur <= 0){
				let temparr = BreakBlock(str,"slab",x,y,d,r)
				tnewMap[d][tctm[0]][tctm[1]][2] = temparr[0]
				//ITEMDROP
				if(options.item != "remove"){
					if(options.item == "scatter"){
						DropItems(x+Math.round(Math.random()*4-2),y+Math.round(Math.random()*4-2),temparr[1],d)
					} else {
						DropItems(x,y,temparr[1],d)
					}
				}
				return("remove")
			}
			tout = MODIFYATTRIBUTEOF(str,"D",tempdur)
			tnewMap[d][tctm[0]][tctm[1]][2] = tout

			return(tout)
		}
		return("no block")		
	}


}


// function breakBlockBy(str,a,type){

// 	if(type == undefined || type == "block"){

// 	  let split = str.split("-")
// 	  let e = -1
// 	  let ee = 0
// 	  let fin = ""
// 	  for(let i = 0; i < split.length; i++){
// 	  	let spl2 = split[i].split(":")
// 	    if(spl2[0] == "D"){
// 	      e = parseInt(spl2[1])
// 	    }else if(spl2[0] == "B"){
// 	      ee = BLOCKSALL[spl2[1]][2]
// 	      fin += "-" + split[i]
// 	    } else {
// 	    	fin += "-" + split[i]
// 	    }
// 	  }
// 	  if(e == -1 || ee == e){
// 	  	e = ee
// 	  }
// 	  let durability = e - a

// 	  if(durability > 0){
// 	  fin += ("-D:"+durability)
// 	  return(fin.substring(1))
// 		} else{
// 			return("remove")
// 		}
// 	}

// 	if(type == "all"){

// 	}


// 	if(type == "slab"){

// 	}


// }

function BreakBlock(str,type,x,y,d,player){
	let outstr = ""
	let outitem = []
	if(type == "block"){
		let keepTypes = ["G","Sl"]
		let breakTypes = ["B","Ch","Tk"]

		for(let i = 0; i < keepTypes.length; i++){
			let a = ATTRIBUTESTROF(str,keepTypes[i])
			if(a!=""){
			outstr += "-" +a} 
		}
		

		for(let i=0;i<breakTypes.length; i++){
			let outx = processBreakAtt(TNEWATTRIBUTEOF(str,breakTypes[i]),breakTypes[i],x,y,d,"block",player)
			outstr += outx[0]

			for(let i = 0; i < outx[1].length; i++){
				outitem.push(outx[1][i])
			}
			
		}
		return([outstr.substring(1),outitem])
	}
	
	if(type == "slab"){
		let titem = ""
		if(player != undefined){
		let a = give(player,1,"Sl:"+TNEWATTRIBUTEOF(str,"Sl"))
		if(a == "no space"){
			titem = "Sl:"+TNEWATTRIBUTEOF(str,"Sl")
		}} else {
			titem = "Sl:"+TNEWATTRIBUTEOF(str,"Sl")
		}
		return([ArrRemoveFromTile(str,["Sl","D"]),[titem]])

	}

}

function processBreakAtt(str,att,x,y,d,type,player){

	if(str == "NONE"){
		return(["",""]);
	}
	else if(type == "block"){

		switch(att){
			case "B":
			let tm = ""
			if(player != undefined){
				let a = give(player,1,"B:"+str)
				if(a == "no space"){
					tm = [att+":"+str]
				}
			} else {
			tm = [att+":"+str]}
			return(["",tm])
			break;

			case "Ch":
			let items = removeOutterBracket(str).split("=")
			// DropItems(x,y,items,d,true)
			let pos = x+","+y
			chestUpdate("delete","",pos,d)
			return(["",items])
			break;

			case "Tk":
			let tkou = removeOutterBracket(str)
			let outstr = ""
			let breakTypes = ["XPL","DBG"]
			for(let i = 0; i < breakTypes.length; i++){
				outstr += processBreakAtt(TNEWATTRIBUTEOF(tkou,breakTypes[i]),breakTypes[i],x,y,d,"ticker")
			}
			if(outstr == ""){
				return(["",""])
			} else {
				return(["-Tk:["+outstr.substring(1)+"]",""])
			}

			break;

			case "I":
			return(["",""])
			break;

			case "D":
			return(["",""])
			break;


		}

	} else if(type == "ticker"){
		switch(att){
			case "XPL":
			return("")
			break;

			case "DBG":
			return("-DBG:"+str)
			break;
		}
	}

}

function ATTRIBUTESTROF(str,type){
	let a = TNEWATTRIBUTEOF(str,type)
	if(a != "NONE"){

		return(type+":"+a)

	}
	return("")
}

function TNEWbreakBlockBy(str,a){

	let tblockATT = TNEWATTRIBUTEOF(str,"B")
	if(tblockATT != "NONE"){
		let dura = parseInt(TNEWATTRIBUTEOF(str,"D"))
		if(isNaN(dura)){
			dura = BLOCKSALL[tblockATT][2]
		}
		let fdura = dura-a
		if(fdura > 0){
			return(removeAttributeOf(str,"D")+"-D:"+fdura)}
		else {
			return("remove")
		}
	}
	return("no block")
}

function getBlockDurability(str,a){
	let blockATT = TNEWATTRIBUTEOF(str,"B")
	if(blockATT != "NONE"){

		let dura = parseInt(TNEWATTRIBUTEOF(str,"D"))
		if(isNaN(dura)){
			dura = BLOCKSALL[blockATT][2]
		}

		return(dura)
	} else {
		return("no block")
	}
}






function broadcast(s,e){
	for(let i = 0; i < plArr.length; i++){
		enDict[plArr[i]].log(s,e)
	}
}



function removeItemFromSelected(p,a,slot){
let player = enDict[p]
	if(slot == undefined){
		slot = player.selectedSlot
	}

	
	let original = player.Inventory[slot]
	let split = original.split("-")
	let aa = (parseInt(TNEWATTRIBUTEOF(original,"A"))-a)
	if(aa > 0){	enDict[p].Inventory[slot] = split[0]+"-A:"+aa}else{
		enDict[p].Inventory[slot] = ""
	}
	enDict[p].invrelay()
}


function selectSlot(e){

	if(enDict[e[0]] == undefined){
		console.log("cerr selslot",e[0])
	} else {
		enDict[e[0]].selectedSlot = (e[1])
	}
}


function ArrRemoveFromTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){

		let isRemove = 0

		for(let j = 0 ; j < type.length; j++){
			if(split[i].split(":")[0] == type[j]){
				isRemove = 1
				break;
				
			}
		}
		if(isRemove == 0){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
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


function tileItemable(str){
	if(str == undefined){
		return(false)
	}
	if(TNEWATTRIBUTEOF(str,"B") == "NONE" && TNEWATTRIBUTEOF(str,"I") == "NONE"){
		return(true)
	}
	return(false)
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


function testGenerateChunks(e){
	for(let i = 0; i < e; i++){
		GenerateChunk(100,i)
	}
}

function GenerateChunk(x,y,d){
	let dimension = "O"
	if(d != undefined){
		dimension = d
	}


	let t = [x,y,"buffer"]
	for(let i = 0; i < chunkSize; i++){
		for(let j = 0; j < chunkSize; j++){
			let value =200+perSeeds[dimension].noise2D((0.2+j+x*chunkSize)/199.7,(0.2+i+y*chunkSize)/199.7)*200
			t.push([j,i,TNEWgenerateTileFromNumber(value,dimension)])
			generateStructureFromNumber(value,x*chunkSize+j,y*chunkSize+i,dimension)
		}
	}
	tnewMap[dimension].push(t)
	let ee = x+","+y
	generatedChunks[dimension][ee] = (tnewMap[dimension].length-1)

	if(promiseChunks[dimension][ee] != undefined){
		for(let i = 0; i < promiseChunks[dimension][ee].length; i++){
			setBlock(promiseChunks[dimension][ee][i][0],promiseChunks[dimension][ee][i][1],promiseChunks[dimension][ee][i][2],dimension,{"keep":["G"]})
		}
	}
}



///put in coordinates to find the coordinate's chunk. returns in Dict
function CoordToChunk(x,y){
  return({"x":Math.floor(x/chunkSize),"y":Math.floor(y/chunkSize),"cx":x-Math.floor(x/chunkSize)*chunkSize,"cy":y-Math.floor(y/chunkSize)*chunkSize})
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


function structureArrCompress(arr){

	let hold = "STARTHOLD"
	let number = 2

	for(let i = 1; i < arr.length; i++){

		if(arr[i] == hold){
			if(arr[i-1][0] != "@"){
				arr[i-1] = "@" + arr[i-1] + "@2"
			} else {
				number += 1
				arr[i-1] = "@" + hold + "@" + number
			}

			hold = arr[i]
			arr.splice(i,1)

			i--

		} else {
			hold = arr[i]
			number = 2
		}



		
	}
	return(arr)


}


function structureArrDecompress(arr){
	let outarr = []
	outarr[0] = arr[0]

	for(let i = 1; i < arr.length; i++){
		if(arr[i][0] == "@"){
			let split = (arr[i].substring(1)).split("@")
			let number = parseInt(split[1])
			let block = split[0]
			for(let j = 0; j < number; j++){

				outarr.push(block)
			}



		} else {
			outarr.push(arr[i])
		}


	}

	return(outarr)


}


function tryStructureGen(push){


	let tx = push.cx
	let ty = push.cy
	for(let i = 0; i < generatedStructures.length; i++){
		let gsdict = generatedStructures[i]
		let acdst = (gsdict.dst > push.dst ? gsdict.dst : push.dst)

		if(acdst == 0){
			continue;
		}

		if(fastdistance(tx,ty,gsdict.cx,gsdict.cy) < acdst){
			return(false)
		}

	}

	return(true)
}



function generateStructure(st,x,y,d,options,hard){
	if(d == undefined){
		d = "O"
	}
	let structure;
	let structurePush;
	if(CURRENTCONFIGS.Structures[st] != undefined){
		structure = structureArrDecompress(CURRENTCONFIGS.Structures[st].arr)
		structurePush = JSON.parse(JSON.stringify(CURRENTCONFIGS.Structures[st].push))
	} else {
		structure = structureArrDecompress(st.split("|nxt|"))
	}

	structurePush.cx += x
	structurePush.cy += y

	if(structurePush == undefined || hard == true || tryStructureGen(structurePush)){
		generatedStructures.push(structurePush)
	} else {
		return("blocked")
	}



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



	let ctm = CoordToMap(x,y,d)
	let a = structure[0]
	for(let i = 1; i < structure.length; i++){
		let j = i-1
		setBlock(x+j - Math.floor(j/a)*a,y+Math.floor(j/a),structure[i],d,{"keep":["G"]})
	}
	return("done")
}




function setBlock(x,y,block,d,options){
	let dimension = "O"
	if(d != undefined){
		dimension = d
	}
	let ctm = CoordToMap(x,y,dimension)

	if(NATTRIBUTEOF(block,"GEN") != "NONE"){
		let tgenattrs = brackedator(removeOutterBracket(NATTRIBUTEOF(block,"GEN")))

		if(tgenattrs["Ch"] != undefined){

			let tchestitem = generateChestContents(removeOutterBracket(tgenattrs["Ch"]))
			block += "-Ch:[" + tchestitem + "]"
		}




		block = TNEWremoveFromTile(block,"GEN")

	}


	if(ctm[0] != undefined){



		if(options.keep != undefined){

			let tstrip = ""
			let tblockdic = brackedator(tnewMap[dimension][ctm[0]][ctm[1]][2])
			for(let i = 0; i < options.keep.length; i++){
				if(tblockdic[options.keep[i]] != undefined){
					tstrip += "-" + options.keep[i] + ":"+tblockdic[options.keep[i]]
				}
			}


			tnewMap[dimension][ctm[0]][ctm[1]][2] = tstrip.substring(1)

				if(block != ""){
					tnewMap[dimension][ctm[0]][ctm[1]][2] += "-" + block
				}
		} else {tnewMap[dimension][ctm[0]][ctm[1]][2] = block}


		} else {
			let ctc = CoordToChunk(x,y)
			let coord = ctc.x+","+ctc.y
			if(promiseChunks[dimension][coord] == undefined){
				promiseChunks[dimension][coord] = [[x,y,block]]
			} else {
				promiseChunks[dimension][coord].push([x,y,block])
			}
		}
}


function setblock(x,y,block,d){
	let dimension = "O"
	if(d != undefined){
		dimension = d
	}
	let ctm = CoordToMap(x,y,dimension)
	tnewMap[dimension][ctm[0]][ctm[1]][2] = block
	if(TNEWATTRIBUTEOF(block,"Tk") != "NONE"){
		allTickyBlocks.push([x,y,dimension])
	}
}


function itemStackable(item1,item2){

	if(TNEWATTRIBUTEOF(item1,"stk") == "1" || TNEWATTRIBUTEOF(item2,"stk") == "1" ){
		return(false)
	}

	let baseatt = BASEATTRIBUTESOF(item1)
	for(let i = 0; i < baseatt.length; i++){
		if(baseatt[0] == "A" || baseatt[0] == "M"){
			continue;
		}
		if(TNEWATTRIBUTEOF(item1,baseatt[i]) != TNEWATTRIBUTEOF(item2,baseatt[i])){
			return(false)
		}

	}

	return(true)

}


function give(p,amount,item){
	for(let i = 0; i < enDict[p].Inventory.length; i++){

		if(itemStackable(item,enDict[p].Inventory[i])){
			enDict[p].Inventory[i] = addToItem(enDict[p].Inventory[i],amount)
			enDict[p].invrelay()
			return("1")
		}

	}
	for(let i = 0; i < enDict[p].Inventory.length; i++){
		if(enDict[p].Inventory[i] == "" || enDict[p].Inventory[i] == undefined){
			enDict[p].Inventory[i] = (item + "-A:" + amount)
			enDict[p].invrelay()
			return("2")
		}
	}

	return("no space")

}

function ArrLoc(p){
	for(let i = 0; i < plArr.length; i++){
		if(plArr[i] == p){
			enDict[p].log("you are player "+i+"/"+(plArr.length-1)+"/"+(enArr.length-1)+" => " + p,cmdc.success)
		}
	}
	
}


function getRelativity(p,x,y){
	let outx = 0
	let outy = 0
	if(x == undefined){
		return("NONE")
	}
	if(x[0] == "="){
		if(x[1] != undefined){
			outx = enDict[p].x + parseInt(x.substring(1))
		} else {
			outx = enDict[p].x

		}

	} else {
			outx = parseInt(x)

			if(isNaN(outx)){
				return("NONE")
			}
	}

	if(y == undefined){
		return("NONE")
	}

	if(y[0] == "="){
		if(y[1] != undefined){
			outy = enDict[p].y + parseInt(y.substring(1))
		} else {
			outy = enDict[p].y
		}
	} else {
		outy = parseInt(y)
			if(isNaN(outy)){
				return("NONE")
			}
	}

	return([outx,outy])
}


function tp(r,i1,i2){
	if(i2 == undefined){
		// let temp = findPlayerString(i1)
		if(enArr[parseInt(i1)] != undefined){
			let enid = enArr[parseInt(i1)]
			enDict[r].x = enDict[enid].x
			enDict[r].y = enDict[enid].y
			enDict[r].log("successfully teleported to P:"+enid,cmdc.success)
		}else if(enDict[i1] != undefined){
			enDict[r].x = enDict[i1].x
			enDict[r].y = enDict[i1].y
			enDict[r].log("successfully teleported to P:"+i1,cmdc.success)
		} else {
			enDict[r].log("cannot teleport to P:"+i1,cmdc.error)
		}


	}
	//  else if(!isNaN(parseInt(i1))&& !isNaN(parseInt(i2))){
	// 	enArr[r].x = parseInt(i1)
	// 	enArr[r].y = parseInt(i2)
	// 	enArr[r].log("successfully teleported to "+i1+","+i2,cmdc.success)
	// } else if(i1[0] == "=" && i2[0] == "="){
	// 	let ar = parseInt(i1.split("=")[1])
	// 	let ae = parseInt(i2.split("=")[1])
	// 	if(!isNaN(ar) && !isNaN(ae)){
	// 		enArr[r].x += ar
	// 		enArr[r].y += ae
	// 		enArr[r].log("successfully teleported to "+i1+","+i2,cmdc.success)
	// 	}
	// }
		else{
			let pos = getRelativity(r,i1,i2)
			enDict[r].x = pos[0]
			enDict[r].y = pos[1]
			enDict[r].log("successfully teleported to "+pos[0] + "," + pos[1],cmdc.success)
		}

}


function summonCmd(p,name,x,y,id){
	if(x == undefined || x == ""){
		x = enDict[p].x
	}
	if(y == undefined || y == ""){
		y = enDict[p].y
	}
	let r = getRelativity(p,x,y)
	summonNewMob(name,r[0],r[1],id,enDict[p].dimension)

}

function summonNewMob(name,x,y,id,d,stats){

	if(stats == undefined){
		stats = {"ownerH":{"master":"wild"+id}}
	}

	let dimension = "O"
	if(d != undefined){
		dimension = d
	}


	if(id == undefined || id == "rand"){
		id = Math.floor(Math.random()*10000)
	}

		if(usedIDs[id] == true){
			return("id exists already!")
		}
	
	usedIDs[id] = true
	enDict[id] = new mob(name,x,y,id,dimension,stats)
	enArr.push(id)
	return("successfully summoned")


}

function inAnyPlayerSight(x,y,d){
	let fout = []
	plArr.forEach((e)=>{
		let en = enDict[e]
		if(en.dimension == d && en.sight[(x-en.x) + "," + (y-en.y)] === true){
			fout.push(e)
		}
	})

	if(fout.length == 0){
		return(false)
	}

	return(fout)
}

function naturalMobSpawn(ampp,mob){
	let summonAmount = 0
	for(let j = 0; j < plArr.length; j++){
	for(let i = 0; i < ampp; i++){

		let tx = Math.floor(Math.random()*100-50)
		let ty = Math.floor(Math.random()*100-50)

		if((tx > 20 || tx < 0) && (ty > 20 || ty < 0) && !isBlockage(enDict[plArr[j]].x+tx,enDict[plArr[j]].y+ty,enDict[plArr[j]].dimension)){
			if(inAnyPlayerSight(enDict[plArr[j]].x+tx,enDict[plArr[j]].y+ty,enDict[plArr[j]].dimension) === false){
				summonNewMob(mob,enDict[plArr[j]].x+tx,enDict[plArr[j]].y+ty,"rand",enDict[plArr[j]].dimension)
				summonAmount++
			}
		}

	}
	}
	return(summonAmount)
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
	for(let i = 0; i < enArr.length; i++){
		if(enDict[ enArr[i]].name == e){
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
  // for(let i = 0; i < entities.length; i++){
  //   if(inp == enArr[i].id){
  //     return(i)
  //   }
  // } return(false)
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
function bracketLevels(str){
  let level = 0

  let counters = []

  let out = [""]
  for(let i = 0; i < str.length; i++){
    if(str[i] == "(" || str[i] == "[" || str[i] == "{" ){

    	if(counters[level] == undefined){
    		counters[level] = 0
    	} else {
    		counters[level] ++
    	}

			out[level] += ("^"+counters[level]+"^")

      level += 1
      if(out[level] == undefined){
      	out[level] = ""
      }
    } else if(str[i] == ")" || str[i] == "]" || str[i] == "}" ){

    	out[level] += ("&")

      level -= 1

    } else {
    	

      out[level] += str[i]
    }


  }

  return(out)

}

function bracketCompressionProcess(str,arr,parseLevel){

	let outStr = ""
	let parsedInt = ""
	let isParsing = 0

	for(let i = 0; i < str.length; i++){
		if(str[i] != "^" && isParsing == 0){
			outStr += str[i]
		} else if(str[i] != "^" && isParsing == 1){
			parsedInt += str[i] 
		} else {
			if(isParsing == 0){
				isParsing = 1
			} else {
				isParsing = 0

				let splitarr = arr[parseLevel].split("&")

				let toutStr = ("[" + splitarr[parseInt(parsedInt)] + "]")

				outStr += bracketCompressionProcess(toutStr,arr,parseLevel+1)



			}
		}



	}



		return(outStr)

}


function strHas(str,has){
	try{
	for(let i = 0; i < str.length; i++){
		for(let j = 0; j < has.length; j++){
			if(str[i] == has[j]){
				return([i,j])
			}
		}
	}
	return(false)
		} catch{
			console.log("cerr: strHas",str,has)
		}
}

function strHasBrackets(str){
	for(let i = 0; i < str.length; i++){
		if(str[i] == "(" || str[i] == "[" || str[i] == "{" || str[i] == ")" || str[i] == "]" || str[i] == "}"){
			return(str[i])
		}
	}
	return(false)
}



function removeOutterBracket(str){
	if(str[0] == "[" && str[str.length-1] == "]"){
		str = str.substring(1)
		str = str.slice(0,-1)
	}

	return(str)
}


function removeAttributeOf(str,e){
	let BLs = bracketLevels(str)
	let split = BLs[0].split("-")
	let outstr = ""

	for(let i = 0; i < split.length; i++){
		let split2 = split[i].split(":")
		if(split2[0] != e){
			outstr += "-" + split2[0] + ":" + TNEWATTRIBUTEOF(str,split2[0])
		}
	}

	return(outstr.substring(1))

}

function BASEATTRIBUTESOF(str){
	let outstr = ""
	let a = bracketLevels(str)[0]
	let deleting = false
	for(let i = 0; i < a.length; i++){
		if(a[i] == "^"){
			deleting = !deleting
			continue
		}if(deleting){
			continue
		}

		outstr += a[i]

	}
	let outarr = []
	let split1 = outstr.split("-")
	for(let i = 0; i < split1.length; i++){
		outarr.push(split1[i].split(":")[0])
	}


	return(outarr)
}

function TNEWATTRIBUTEOF(str,e){
  if(str == undefined){return("NONE")}

  	if(!strHasBrackets(str)){

	  let split = str.split("-")
	  for(let i = 0; i < split.length; i++){
	  	let act = split[i].split(":")
	  	if(act[0] == e){
	  		return(act[1])
	  	}
	  }
	  return("NONE")
	}




	 else {
		let BLs = bracketLevels(str)

  let BaseSplit = BLs[0].split("-")
  for(let i = 0; i < BaseSplit.length; i++){
  	let act = BaseSplit[i].split(":")
  	if(act[0] == e){

  		if(strHas(act[1],"^")){


  			

  		return(bracketCompressionProcess(act[1],BLs,1))





  		} else {

  		return(act[1])
  	}

  	}
  }
  return("NONE")


	}




}


function MODIFYATTRIBUTEOF(str,a,mod){
	let tout = removeAttributeOf(str,a) + "-" + a + ":" + mod
	return(tout)
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

//-------------------------------------------
function selectedSlotItems(p){
	let r = p
	if(enDict[r] !== undefined){
	let e = enDict[r].selectedSlot
	if(enDict[r].Inventory[e] != undefined){
		let split = enDict[r].Inventory[e].split('-')

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


function generateStructureFromNumber(input,x,y,d){
	if(d == "O"){
		if(input > 310 && input < 335){
			if(Math.random() > 0.995){
				generateStructure(randomItem(ranStrucLists.GoldOre),x,y,d,{"mirror":"random","rotate":"random"})
			}
		} else if(input > 210 && input < 260){
			if(Math.random() > 0.9){
				generateStructure("upHouse",x,y,d,{"mirror":"random","rotate":"random"})
			}
		}
	}
}

function TNEWgenerateTileFromNumber(input,d){


	if(d == "O"){
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
				tile += "-B:3-T:"+(Math.floor(Math.random()*9))+"-S:" + (Math.floor(Math.random()*3)+4)
			}
		}

		


			return(tile)
	}

	 else if(d == "T"){
		let tile = "G:"
		 if(input < 90){
			tile += "2"
		} else if(input < 140){
			tile += "3"
		} else if(input < 145){
			tile += "4"
		} else if(input < 230){
			tile += "5"
		} else if(input < 300){
			tile += "6"
		} else if(input < 335){
			tile += "7"
		} else if(input >= 335){
			tile += "8"
		}
		if(input >= 150 && input < 300){
			if(Math.random() > 1-input/30000){
				tile += "-B:3-T:1-S:" + (Math.floor(Math.random()*3)+1)
			}
		}

		


			return(tile)
	}
}




function CoordToMap(x,y,d){
	let dimension = "O"
	if(d != undefined){
		dimension = d
	}

	let cx = Math.floor(x/chunkSize)
	let cy = Math.floor(y/chunkSize)
	let p = x-cx*chunkSize + (y-cy*chunkSize)*chunkSize + 3



	return([generatedChunks[dimension][cx+","+cy],p])
}



function amountOfItems(p){
	// let r = findPlayerInArr(p)
	let player = enDict[p]

	try{if(player.Inventory){}} catch {console.log("cerr amOI",p)}

  if(player.Inventory[player.selectedSlot] != undefined){
    let e = TNEWATTRIBUTEOF(player.Inventory[player.selectedSlot],"A")
    return(e)
  } else {return("none")}
}
//error here
















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
		enDict[this.p1].inCombat = JSON.stringify(combatIdCounter)
		enDict[this.p2].inCombat = JSON.stringify(combatIdCounter)
		this.comid = JSON.stringify(combatIdCounter)
		combatIdCounter += 1
	}

	process(p,str){

		if(p == this.p1){
			if(DEBUGGINGLOGS.combat == 1){
			console.log(p,str,1)}
			let temp = this.process2(this.p1m,this.p2m,this.p1d,this.p2d,str,0)
			this.p1m *= temp[0]
			this.p2m *= temp[1]
			this.p1d = temp[2]
			this.p2d = temp[3]


		}
		if(p == this.p2){
			if(DEBUGGINGLOGS.combat == 1){
			console.log(p,str,2)}
			let temp = this.process2(this.p2m,this.p1m,this.p2d,this.p1d,str,1)
			this.p2m *= temp[0]
			this.p1m *= temp[1]
			this.p2d = temp[2]
			this.p1d = temp[3]



		}
	}


	process2(atkr,dfer,atkrn,dfern,str,a){

		let b = (a == 0 ? 1 : 0)
		let pno = (a == 0 ? this.p1 : this.p2)


		//USE ITEM

		if(str == "000"){

			let item = enDict[pno].Inventory[enDict[pno].selectedSlot]
			if(TNEWATTRIBUTEOF(item,"U") != "NONE"){
				let utilityDef = CURRENTCONFIGS.IutilityReferenceDict[TNEWATTRIBUTEOF(item,"U")]
				let utilityATK = utilityDef.attack



							dfern += 3*(utilityATK[1] + Math.random()*utilityATK[2])
							this.textarr[a][1] += utilityATK[0]

			} else {
				if(TNEWATTRIBUTEOF(item,"B") != "NONE"){
					let ts = getstats(pno,"strength")
					
					dfern += 3 + ts*0.5 + ts*Math.random()*2
					this.textarr[a][1] += CURRENTCONFIGS.BLOCKSALL[TNEWATTRIBUTEOF(item,"B")][1]
				}
			}

			
 
		}


//punch
		if(str == "001"){
			let ts = getstats(pno,"strength")
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

		// this.p1n = findPlayerInArr(this.p1)
		// this.p2n = findPlayerInArr(this.p2)
		if(enDict[this.p1] == undefined || enDict[this.p2] == undefined){
			endCombatInstance(this.comid)
			return;
		}



		//maybe a bit of redundancy

		let a = Math.round(this.p1d * this.p1m)
		let b = Math.round(this.p2d * this.p2m)

		if(this.textarr[0][2] == "" && a != 0){
			this.textarr[0][2] = a
			relayBeams.push([enDict[this.p2].x,enDict[this.p2].y,enDict[this.p1].x,enDict[this.p1].y,"Attack","O"])
		}
		if(this.textarr[1][2] == "" && b != 0){
			this.textarr[1][2] = b
			relayBeams.push([enDict[this.p1].x,enDict[this.p1].y,enDict[this.p2].x,enDict[this.p2].y,"Attack","O"])
		}
		if(this.textarr[0][2] == "block" && a != 0){
			this.textarr[0][2] = "b-" + a
		}
		if(this.textarr[1][2] == "block" && b != 0){
			this.textarr[1][2] = "b-" + b
		}



		if(enDict[this.p1].damage(a) || enDict[this.p2].damage(b)){
			endCombatInstance(this.comid)
			return;
		}
		

		enDict[this.p1].combatRelay()
		enDict[this.p2].combatRelay()


		io.to(enDict[this.p1].id).emit("combatText",this.textarr)
		io.to(enDict[this.p2].id).emit("combatText",this.textarr)

		this.p1d = 0
		this.p2d = 0

		this.p1m = 1
		this.p2m = 1

		if(distance(enDict[this.p1].x,enDict[this.p1].y,enDict[this.p2].x,enDict[this.p2].y) > 13){
			endCombatInstance(this.comid)
		}
		// enDict[this.p1].Cstats.hp <= 0 || enDict[this.p2].Cstats.hp <= 0
		if(enDict[this.p1].dimension != enDict[this.p2].dimension){
			endCombatInstance(this.comid)
		}




		this.textarr = [[this.p1,"",""],[this.p2,"",""]]

	}


	end(){



		if(enDict[this.p1] != undefined){
		enDict[this.p1].inCombat = false
		enDict[this.p1].combatRelay(false)

	}if(enDict[this.p2] != undefined){
		enDict[this.p2].inCombat = false
		enDict[this.p2].combatRelay(false)
	}

	}

}




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!







function getstats(p,str){
	return(enDict[p].entityStats[str])
}



function combatProcess(r,str){

	if(enDict[r] != undefined && enDict[r].inCombat){

		try{
		allCombatInstances[enDict[r].inCombat].process(r,str)
		} catch {
			console.log("cerr combatProcess",allCombatInstances,r,enDict[r].inCombat,str)
		}

	}
}



function CompleteCombatSimul(){
	for(let i = 0; i < allCombatInstancesA.length; i++){
		allCombatInstances[allCombatInstancesA[i]].simul()
	}
}



function endCombatInstance(str){

	if(allCombatInstances[str] != undefined){

	allCombatInstances[str].end()


	for(let i = allCombatInstancesA.length - 1; i > -1; i--){
		if(allCombatInstancesA[i] == str){
			allCombatInstancesA.splice(i,1)
			break;
		}
	}

	delete allCombatInstances[str]
	}

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










//============ block tickers ======
function tickAllBlocks(){
	for(let i = allTickyBlocks.length-1; i > -1; i--){
		let dimension = allTickyBlocks[i][2]
		let tempctm = CoordToMap(allTickyBlocks[i][0],allTickyBlocks[i][1],dimension)
		let blockStr = tnewMap[dimension][tempctm[0]][tempctm[1]][2]

		let tickAtt = removeOutterBracket(TNEWATTRIBUTEOF(blockStr,"Tk"))

		let tsplit1 = tickAtt.split("-")
		let outtick = ""
		for(let j = tsplit1.length-1; j > -1; j--){
			let tempRemove = false
			let tdestr
			
			tdestr = deductStrAtt(tsplit1[j])
			
			if(tdestr.split(":")[1] == "0"){
				tempRemove = tickAtZero(tdestr.split(":")[0],allTickyBlocks[i])
			}


			if(tempRemove === false){
				outtick += "-" + tdestr
			} else if (tempRemove === true){

			} else {

				outtick += "-" + tempRemove

			}


		}
		outtick = outtick.substring(1)
		tnewMap[dimension][tempctm[0]][tempctm[1]][2] = removeAttributeOf(tnewMap[dimension][tempctm[0]][tempctm[1]][2],"Tk") + "-Tk:[" + outtick + "]"
		if(outtick.length == 0){
			allTickyBlocks.splice(i,1)
			tnewMap[dimension][tempctm[0]][tempctm[1]][2] = removeAttributeOf(tnewMap[dimension][tempctm[0]][tempctm[1]][2],"Tk")
			continue;
		}
		
		

	}
}

function deductStrAtt(str){

	let split = str.split(":")
	if(!isNaN(split[1])){
		return(split[0]+":"+(parseInt(split[1])-1))
	}

}

function tickAtZero(str,pos){

	if(str == "DBG"){
		console.log("debugger tick")
		return(true)
	} else if (str == "XPL"){
		explosion(pos[0],pos[1],6,pos[2])
		return(true)
	} else if (str = "SPW"){
		summonNewMob("rampant",pos[0],pos[1])
		return("SPW:2")
	}
	return(false)
}



function explosion(x,y,size,d){
	let dimension = "O"
	if(d != undefined){
		dimension = d
	}

	let attemptx = x
	let attempty = y
	for(let i = 0; i < size*size*6; i++){
		
		let tempdist = distance(x,y,attemptx,attempty)
		if(tempdist <= size){

			let tctm = CoordToMap(attemptx,attempty,dimension)
			let tbstr
			if(tctm[0] == undefined){
				attemptx = x+Math.round(Math.random()*size*2-size)
				attempty = y+Math.round(Math.random()*size*2-size)
				continue;
			}
			tbstr = tnewMap[dimension][tctm[0]][tctm[1]][2]
			let TblockATT = TNEWATTRIBUTEOF(tbstr,"B")
			let TblockATT2 = TNEWATTRIBUTEOF(tbstr,"Sl")
			if((TblockATT == "NONE" && TblockATT2 == "NONE")|| (TblockATT == "8" && tempdist != 0)){
				attemptx = x+Math.round(Math.random()*size*2-size)
				attempty = y+Math.round(Math.random()*size*2-size)
				continue;
			}
			let tbreakAmt = (TblockATT == "NONE" ? CURRENTCONFIGS.SLABSALL[TblockATT2][2] : BLOCKSALL[TblockATT][2])
			let breakby = Math.floor((tbreakAmt + 40) * 0.3 * ((size-tempdist)/size))
			if(tempdist == 0){
				breakby = 9000
			}

			let breakoptions = {"type":"all","item":"scatter"}
			if(tempdist == 0){
				breakoptions.item = "remove"
			}

			breakBlockBy(attemptx,attempty,dimension,breakby,breakoptions)


		}
		attemptx = x+Math.round(Math.random()*size*2-size)
		attempty = y+Math.round(Math.random()*size*2-size)
	}

	for(let i = 0; i < enArr.length; i++){
		let enid = enArr[i]

		let a = distance(enDict[enid].x,enDict[enid].y,x,y)
		if(enDict[enid].dimension == dimension && a <= size){
			enDict[enid].damage(Math.floor((size-a)*20))
		}
	}

	ParticleRelay(["Explosion",[x,y,size]],dimension)

}

function arrayBoundingBox(arr,type){

	if(type = "notArr"){

	}

	let maxx
	let maxy
	let minx
	let miny

	arr.forEach((e)=>{

		if(e[0] > maxx){
			maxx = e[0]
		}
		if(e[0] < minx){
			minx = e[0]
		}
		if(e[1] > maxy){
			maxy = e[1]
		}
		if(e[1] < miny){
			miny = e[1]
		}

	})

	return([maxx,minx,maxy,miny])

}


function vectorNormalize(original,multiplier){

	if(multiplier == undefined){
		multiplier = 1
	}

	let tx = original[2] - original[0]
	let ty = original[3] - original[1]

	let d = Math.sqrt(tx*tx+ty*ty)

	if(d == 0){
		return(original)
	}

	tx = tx*multiplier/d
	ty = ty*multiplier/d

	return([original[0],original[1],original[0]+tx,original[1]+ty])

}


function serverLightning2(original,steps,random,options,hitFunc){

	let foutSteps = {"1":[original]}
	let rfoutSteps = {"1":[[Math.round(original[0]),Math.round(original[1]),Math.round(original[2]),Math.round(original[3])]]}
	hitFunc(Math.round(original[2]),Math.round(original[3]))
	let stepAt = 1

	for(let i = 0; i < steps; i++){

		foutSteps[stepAt+1] = []
		rfoutSteps[stepAt+1] = []

		foutSteps[stepAt].forEach((e)=>{

			let vx = e[2] - e[0]
			let vy = e[3] - e[1]

			vx += Math.random()*random - random/2
			vy += Math.random()*random - random/2

			let tnewBeam = [e[2],e[3],e[2] + vx,e[3]+vy]
			hitFunc(Math.round(e[2]+vx),Math.round(e[3]+vy),options.dur*(i+1))
			stepAt += 1
			foutSteps[stepAt].push(tnewBeam)
			let tnewBeam2 = [Math.round(e[2]),Math.round(e[3]),Math.round(e[2]+vx),Math.round(e[3]+vy)]
			rfoutSteps[stepAt].push(tnewBeam2)

		})


	}


	return([rfoutSteps,options])

}

function serverLightning(original,steps,random,lightning,decay){
    let currentBeams = [original]
    steps = steps + 1
    random = random * (distance(original[0],original[1],original[2],original[3]))
  
    let fout = []
    

  
    for(let s = 0; s < steps; s++){
  


    let newBeams = []
    for(let i = 0; i < currentBeams.length; i++){
      let ts = currentBeams[i]
      // animationBeams.push(new Beam(Math.round(ts[0]),Math.round(ts[1]),Math.round(ts[2]),Math.round(ts[3]),ts[4]))
      fout.push([s,Math.round(ts[0]),Math.round(ts[1]),Math.round(ts[2]),Math.round(ts[3])])
      for(let i = 0; i < lightning; i++){
        let velocity1 = (ts[2]-ts[0])+(Math.random()*random-(random/2))
        let velocity2 = (ts[3]-ts[1])+(Math.random()*random-(random/2))
        if(decay != undefined){
          velocity2 *= decay
          velocity1 *= decay
        }
        newBeams.push([ts[2],ts[3],ts[2]+velocity1,ts[3]+velocity2,ts[4]])
      }
    }
    currentBeams = newBeams
    
  }


    return(fout)
  
}



//============================


function minSub(act,sub,min){

	let a = act - sub
	if(a < min){
		return([min,min-a])
	}
	return([a,0])

}




//==================================

function processInstantItemUsage(p,item,x,y){

	if(item.type == "healing"){

		enDict[p].heal(item.amount)

		removeItemFromSelected(p,1)
		return;
	} else if(item.type == "food"){

		enDict[p].hungerHeal(item.amount)
		removeItemFromSelected(p,1)
		return;
	}

}




function processItemUsage(p,use,num,slot){

	if(use == undefined){
		use = "norm"
	}
	if(num == undefined){
		num = 1
	}

	if(slot == undefined){
		slot = enDict[p].selectedSlot
	}

	let item = enDict[p].Inventory[slot]

	let unbreaking = TNEWATTRIBUTEOF(item,"Unb")
	if(unbreaking != "NONE"){
		if(unbreaking == "0"){
			return;
		}
	}


	switch(use){
		case "norm":
			removeItemFromSelected(p,num,slot)
		break;

		case "utility":
		let att = TNEWATTRIBUTEOF(enDict[p].Inventory[slot],"U")
			if(CURRENTCONFIGS.IutilityReferenceDict[att].use == undefined){
				removeItemFromSelected(p,num,slot)
				return
			}
			num = CURRENTCONFIGS.IutilityReferenceDict[att].use
			removeItemFromSelected(p,num,slot)
		break;

	}


}


function generateChestContents(input){

	let outitems = ""

	if(typeof(input)=="string"){
		input = input.split("==")
	}

	for(let i = 0; i < input.length; i++){

			if(CURRENTCONFIGS.chestLootTables[input[i]] == undefined){
				outitems += ("=" + input[i])
			} else {
				outitems += "=" + randomItem(CURRENTCONFIGS.chestLootTables[input[i]])
			}
		}

		return(outitems.substring(1))

}

//G:1-Ch:[B:1-Bbr:{r:1}=Bj:{h:[b:1]}]


function NATTRIBUTEOF(str,type){

	// let SFOP = sameFunctionOutputs("NATTRIBUTEOF",arguments)
	// if(SFOP[0] == "true"){
	// 	return(SFOP[1])
	// }


	let a = brackedator(str)
	if(a[type]!=undefined){
		return(a[type])
	} else if(a == "BRACKETS NOT MATCHING"){
		return("BRACKERROR")
	}
	return("NONE")
}

function brackedator(str,option){

	let tempbrackedate = []
	let tempbasestring = ""

	let outbases = []
	let outbaselinks = []
	let outeffect = "base"
	let ttout = ""

	for(let i = 0; i < str.length; i++){
		let brconfig =  CURRENTCONFIGS.brackets[str[i]]
		if(brconfig != undefined){
			
			if(brconfig[0] == "c"){

				if(tempbrackedate[tempbrackedate.length-1] == brconfig.substring(1)){
					tempbrackedate.pop()
				} else {
					return("BRACKETS NOT MATCHING")
				}

			} else {
				tempbrackedate.push(str[i])
			}

		} else if(tempbrackedate.length == 0){
			tempbasestring += str[i]

		}


		if(tempbrackedate.length == 0&&str[i] == ":"){
				outeffect == "link"
				outbases.push(ttout)
				ttout = ""
			}else if(tempbrackedate.length == 0&&str[i] == "-"){
				outeffect == "base"
				outbaselinks.push(ttout)
				ttout = ""
			} else {
					ttout += str[i]
			}

	}
	outbaselinks.push(ttout)

	if(option == undefined || option == "normal"){
		let outdict = {}
		for(let i = 0; i < outbases.length; i++){
			outdict[outbases[i]] = outbaselinks[i]
		}
		return(outdict)

	} else if(option == "debug1"){


		return(tempbasestring)


	} else if(option == "debug2"){
		return([outbases,outbaselinks])
	}

}


var foutputDict = {"NATTRIBUTEOF":[]}
function sameFunctionOutputs(func,inputs){

  let b = []

  for(let i = 0; i < inputs.length; i++){
    if(foutputDict[func][0][i]!==inputs[i]){
      return(["false"])
    }
  }

  return(["true",foutputDict[func][1]])

}





//game functions end//===============================================================================


exports.add = function(i, j) {
  return i + j;
};



