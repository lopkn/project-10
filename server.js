
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

// ahdbakhbdhkabkb
console.log(`Process pid ${process.pid}`);

const concol = {"Black" : "\x1b[30m" ,"Red" : "\x1b[31m" ,"Green" : "\x1b[32m" ,
"Yellow" : "\x1b[33m" ,"Blue" : "\x1b[34m" ,"Magenta" : "\x1b[35m" ,"Cyan" : "\x1b[36m" ,
"White" : "\x1b[37m" ,"BBlack" : "\x1b[40m" ,"BRed" : "\x1b[41m" ,"BGreen" : "\x1b[42m" ,"BYellow" : "\x1b[43m" ,
"BBlue" : "\x1b[44m" ,"BMagenta" : "\x1b[45m" ,"BCyan" : "\x1b[46m" ,"BWhite" : "\x1b[47m"}


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



const INFUNCS = require("./funcs.js")

INFUNCS.enDict = enDict
INFUNCS.enArr = enArr
INFUNCS.plArr = plArr
/*	
	vectorFuncs,
	LuuidGenerator,
	vectorNormal,
	myMath,
	retInsideLine,
	ArrRemoveFromTile,
	minSub,
	vectorNormalize,
	arrayBoundingBox,
	randomItem,
	TNEWgenerateTileFromNumber,
	generateChestContents,
	brackedator,
	alreadyHasBlockATT,
	alreadyHasBlock,
	strHasBrackets,
	strHas,
	removeOutterBracket,
	bracketCompressionProcess,
	bracketLevels,
	BASEATTRIBUTESOF,
	TNEWATTRIBUTEOF,
	removeAttributeOf,
	inListRS,
	inEffectArr,
	inListR,
	ATTRIBUTESTROF,
	TNEWbreakBlockBy,
	getBlockDurability,
	TNEWremoveFromTile,
	tileItemable,
	TNEWkeepOnlyTile,
	getRelativity,
	itemStackable,
	structureArrDecompress,
	structureArrCompress,
	rotateStructure,
	deductStrAtt,
	amountOfItems,
	selectedSlotItems
*/
let vectorFuncs = INFUNCS.vectorFuncs
let myMath = INFUNCS.myMath
let vectorNormal = INFUNCS.vectorNormal
let LuuidGenerator = INFUNCS.LuuidGenerator
let retInsideLine = INFUNCS.retInsideLine
let ArrRemoveFromTile = INFUNCS.ArrRemoveFromTile
let minSub = INFUNCS.minSub
let	vectorNormalize = INFUNCS.vectorNormalize
let	arrayBoundingBox = INFUNCS.arrayBoundingBox
let	randomItem = INFUNCS.randomItem
let	TNEWgenerateTileFromNumber = INFUNCS.TNEWgenerateTileFromNumber
let generateChestContents = INFUNCS.generateChestContents
let brackedator = INFUNCS.brackedator
let alreadyHasBlockATT = INFUNCS.alreadyHasBlockATT
let alreadyHasBlock = INFUNCS.alreadyHasBlock
let strHasBrackets = INFUNCS.strHasBrackets
let	strHas = INFUNCS.strHas
let	removeOutterBracket = INFUNCS.removeOutterBracket
let	bracketCompressionProcess = INFUNCS.bracketCompressionProcess
let	bracketLevels = INFUNCS.bracketLevels
let	BASEATTRIBUTESOF = INFUNCS.BASEATTRIBUTESOF
let	TNEWATTRIBUTEOF = INFUNCS.TNEWATTRIBUTEOF
let	removeAttributeOf = INFUNCS.removeAttributeOf
let inListRS = INFUNCS.inListRS
let	inEffectArr = INFUNCS.inEffectArr
let	inListR = INFUNCS.inListR
let ATTRIBUTESTROF = INFUNCS.ATTRIBUTESTROF
let	TNEWbreakBlockBy = INFUNCS.TNEWbreakBlockBy
let	getBlockDurability = INFUNCS.getBlockDurability
let	TNEWremoveFromTile = INFUNCS.TNEWremoveFromTile
let	tileItemable = INFUNCS.tileItemable
let	TNEWkeepOnlyTile = INFUNCS.TNEWkeepOnlyTile
let getRelativity = INFUNCS.getRelativity
let	itemStackable = INFUNCS.itemStackable
let structureArrDecompress = INFUNCS.structureArrDecompress
let	structureArrCompress = INFUNCS.structureArrCompress
let	rotateStructure = INFUNCS.rotateStructure
let grabFirstOfDict = INFUNCS.grabFirstOfDict
let deductStrAtt = INFUNCS.deductStrAtt
let	amountOfItems = INFUNCS.amountOfItems
let	selectedSlotItems = INFUNCS.selectedSlotItems

function getStrLengthOf(e){
	return(JSON.stringify(e).length)
}

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
		// naturalMobSpawn(10,"hunter")
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
INFUNCS.io = io
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
	socket.on("JOINGAME",(e)=>{joinGame(e,socket)})
}

function joinGame(game,socket){
	if(game == "G10"){
		socket.join("G10")
	socket.on('key', processKey)
	socket.on('CTsping',(e)=>{io.to(e).emit("cTSping")})
	socket.on('click', processClick)
	socket.on('selectInventorySlot', selectSlot)
	socket.on('AT',ACTIONPROCESS)
	socket.on("tablearn",tablearn)
	socket.on("returnPing",STOPPING)
	console.log(socket.id + " has joined G10 at " + Date())

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
		io.to(socket.id).emit("rarelay",["op"])
	}


	io.to(socket.id).emit('sendWhenJoin', socket.id)
	io.to(socket.id).emit("rarelay",["ticklim",[TickLimit-10,serverTickWait]])
	enDict[socket.id].relay2()
	
	    socket.on('disconnect',function(){disconnected.push(socket)});}



	else if(game == "G10.1"){
		socket.join("G10.1")
		io.to(socket.id).emit("acknowledge",socket.id)
	} else if(game == "G10.2"){
		socket.join("G10.2")
		io.to(socket.id).emit("acknowledge G10.2",socket.id)
		shooter2C.initiatePlayer(socket.id)
		socket.on("click",(e)=>{shooter2C.playerClick(e[0],e[1],e[2],e[3]);})
		socket.on("placeWall",(e)=>{shooter2C.placeWall(e[0],e[1],e[2],e[3],e[4],e[4]=="body"?{id:e[5]}:undefined);console.log(e)})
		socket.on("keys",(e)=>{shooter2C.playerKeyUpdate(e)})
		socket.on('disconnect',()=>{shooter2C.disconnect(socket)})
	} else if(game == "G10.3"){
		socket.join("G10.3")
		io.to(socket.id).emit("acknowledge G10.3",socket.id)
		socket.on("jointeam",(e)=>{re8.initiatePlayer(e,socket)})
		socket.on("startRoom",(e)=>{re8.startRoom(e)})
		socket.on("click",(e)=>{re8.rmHandler(e,"click")})
		socket.on("drag",(e)=>{re8.rmHandler(e,"drag")})
		socket.on("key",(e)=>{re8.rmHandler(e,"key")})
		socket.on("button",(e)=>{re8.rmHandler(e,"button")})
		socket.on("disconnect",()=>{re8.disconnect(socket)})
		socket.on("reloadLobby",(e)=>{re8.loadLobby(e)})

		socket.onAny((e,n)=>{re8.logger.push([Date.now(),e,n])})
	}
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

	static taf3done = {}

	static nppVars = {"counter":0,"done":false}

	// static nonPlayerProcess(timeAllowed){
	// if(this.nppVars.done){
	// 	return(true)
	// }
	// let starttime = Date.now()
	// let tcounter = this.nppVars

	// for(;tcounter.counter < enArr.length && Date.now() < starttime + timeAllowed; tcounter.counter++){
	// 		if(enDict[enArr[tcounter.counter]].entityType!="player"){
	// 			enDict[enArr[tcounter.counter]].nonPlayerActions()
	// 		}
	// 	}
	// if(tcounter.counter >= enArr.length){
	// 	tcounter.counter = 0
	// 	tcounter.done = true
	// 	return(true)
	// } else {
	// 	return(tcounter.counter)}


	// }

	static nonPlayerProcess2(t){
		if(this.taf3done.npp2){return(true)}
		if(TAF3.declare("npp2")){
			TAF3.memories.npp2 = {
				"i":0
			}
		}
		let tpass = TAF3.memories.npp2
		for(;tpass.i < enArr.length; tpass.i++){
			if(TAF3.checktime(t)){return("!CHECK!")}//checkpoint
			if(enDict[enArr[tpass.i]].entityType!="player"){
				enDict[enArr[tpass.i]].nonPlayerActions(t)
			}
		}

		TAF3.del()
		this.taf3done.npp2 = true
		return(true)
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

function ttest1(t){
	if(TAF3.declare("tt")){
		TAF3.memories.tt = {
			"i":0,
			"fin":0
		}
	}
	
	let tpass = TAF3.memories.tt

	for(;tpass.i < 200000; tpass.i++){
		if(TAF3.checktime(t)){return("!CHECK!")}//checkpoint
		tpass.fin += tpass.i
	}

	let r = tpass.fin
	TAF3.del()
	return(r)
}


class TAF3{
	static memories = {}
	static nowspace = ""

	static declare(space){
		this.nowspace = space
		if(this.memories[space] == undefined){
			this.memories[space] = {}
			return(true)
		}
		return(false)
	}

	static checktime(t,dict){
		if(Date.now() > t){
			return(true)
		}
		return(false)
	}


	static del(){
		delete this.memories[this.nowspace]
	}

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

class TAF4{
	static undone = {}
}



//ticksearch & main loop/mainloop
var ACTIONLOGS = []
var TIME = 0

var TickLimit = 70
var serverTickWait = 50

function doSomething(startTime){


	if(TIME < TickLimit-10){
		TIME += 1
		io.to("G10").emit('TIME',TIME)
		if(TIME > 0){
			// timeAllowedFunctions.nonPlayerProcess(startTime+serverTickWait-Date.now()-10)
			timeAllowedFunctions.nonPlayerProcess2(startTime)
		}
	} else if(TIME == TickLimit-10){
		allPlayersGenerateChunks()
		TIME += 1
		io.to("G10").emit('TICK')
		SERVERCOUNTERS.ticks += 1
		if(DEBUGGINGLOGS.ticktoggle == 1){
		console.log("tick")
	}

		timeAllowedFunctions.nonPlayerProcess2(Infinity)
		timeAllowedFunctions.nppVars.done = false
		timeAllowedFunctions.taf3done.npp2 = false

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



var shooter2doSomething = (d)=>{
	shooter2C.repeat()
}
class MAINGAMETOGGLES{
	static games = {
		"sc2":true
	}
	static sc2(){
		
		if(!this.games.sc2){
			shooter2doSomething = (d)=>{
			shooter2C.repeat()
		}} else {
			shooter2doSomething = ()=>{}
		}
		this.games.sc2 = !this.games.sc2
	}
}
setInterval(()=>{
	let ttime = Date.now()+serverTickWait
    doSomething(ttime)
    shooter2doSomething(Date.now()+serverTickWait)
}, serverTickWait);


setInterval(function(){if(startPing == 1){pping++}},1)


function TicklimUpdate(e){
	TickLimit = e + 10
	io.to("G10").emit("rarelay",["ticklim",e])
}

function tellPerlin(x,y,d){
	console.log(perSeeds[d].noise2D(x/100,y/100,0))
}



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
				io.to(p).emit("rarelay",["op"])
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


// BR block reference
// EC exact coordinate
// RC relative coordinate
function MasterCoordTranslator(x,y,d,options){
	
}

function anBreakBlock(x,y,d,options){

	let tctm = CoordToMap(x,y,d)
	let str = tnewMap[d][tctm[0]][tctm[1]][2]


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



function tp(r,i1,i2){
	if(i2 == undefined){

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

		if(!isBlockage(enDict[plArr[j]].x+tx,enDict[plArr[j]].y+ty,enDict[plArr[j]].dimension)){
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






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////







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
















//============ block tickers ======
function tickAllBlocks(){ 
	for(let i = allTickyBlocks.length-1; i > -1; i--){
		let dimension = allTickyBlocks[i][2]
		let tempctm = CoordToMap(allTickyBlocks[i][0],allTickyBlocks[i][1],dimension)
		let blockStr = tnewMap[dimension][tempctm[0]][tempctm[1]][2]

		let tickAtt = removeOutterBracket(TNEWATTRIBUTEOF(blockStr,"Tk"))

		if(NATTRIBUTEOF(blockStr,"Tk") == "NONE" || NATTRIBUTEOF(blockStr,"Tk") == "[]"){
			tnewMap[dimension][tempctm[0]][tempctm[1]][2] = removeAttributeOf(blockStr,"Tk")
			allTickyBlocks.splice(i,1)
			continue
		}


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


	for(let i = enArr.length - 1; i > -1 ; i--){
		let enid = enArr[i]
		let a = distance(enDict[enid].x,enDict[enid].y,x,y)
		if(enDict[enid].dimension == dimension && a <= size){
			enDict[enid].damage(Math.floor((size-a)*20))
		}
	}

	ParticleRelay(["Explosion",[x,y,size]],dimension)

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
			let splitLoop = 1
			while(splitLoop > 0){
				
				vx += Math.random()*random - random/2
				vy += Math.random()*random - random/2

				let tnewBeam = [e[2],e[3],e[2] + vx,e[3]+vy]
				hitFunc(Math.round(e[2]+vx),Math.round(e[3]+vy),options.dur*(i+1))
				
				if(Math.random() > 0.5){splitLoop++}

				foutSteps[stepAt+1].push(tnewBeam)
				let tnewBeam2 = [Math.round(e[2]),Math.round(e[3]),Math.round(e[2]+vx),Math.round(e[3]+vy)]
				rfoutSteps[stepAt+1].push(tnewBeam2)
				splitLoop -= 1
			}
			

		})
stepAt += 1

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
    currentBeams = Beams
    
  }


    return(fout)
  
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


function NATTRIBUTEOF(str,type){

	let a = brackedator(str)
	if(a[type]!=undefined){
		return(a[type])
	} else if(a == "BRACKETS NOT MATCHING"){
		return("BRACKERROR")
	}
	return("NONE")
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





//game10 functions end//===============================================================================


//shooter2 functions start//======================


class shooter2C{
	static walls = {}
	static bullets = []
	//{x,y,vx,vy,tailLength,tail[l,x,y,tx,ty],life}
	static players = {}

	static drawers = []
	static wallPushers = {}

	static nuuIDGEN = 0

	static pushBullet(x,y,vx,vy,id,type){
		switch(type){
			case "norm":
				this.bullets.push({"shooter":id,"type":"norm","x":x,"y":y,"vx":vx,"vy":vy,
					"lingerance":10,"tailLength":10,"tail":[],"life":2000,"slowd":0.95})
				break;
			case "scat":
				this.bullets.push({"shooter":id,"type":"scat","x":x,"y":y,"vx":vx,"vy":vy,
					"tailLength":6,"dmgmult":3,"lingerance":6,"tail":[],"life":2000,"slowd":0.95})
				break;
			case "lazr":
				this.bullets.push({"shooter":id,"type":"lazr","x":x,"y":y,"vx":vx,"vy":vy,
					"tailLength":20,"dmgmult":0.1,"lingerance":20,"tail":[],"life":200,"slowd":1})
				break;
			case "cnon":
				this.bullets.push({"shooter":id,"type":"cnon","x":x,"y":y,"vx":vx,"vy":vy,
					"tailLength":10,"lingerance":10,"tail":[],"life":200,
					"slowd":1,"dmgmult":9,"extra":{"tailmult":3}})
				break;

			case "heal":
				this.bullets.push({"shooter":id,"type":"heal","x":x,"y":y,"vx":vx,"vy":vy,
					"lingerance":2,"dmgmult":-1,"tailLength":2,"tail":[],"life":2000,"slowd":0.95})
				break;

		}
	}

	static playerClick(id,x,y,w){
		let p = this.players[id]
		if(p.reloading > 0){
			return;
		}
		let n = vectorNormalize([p.x,p.y,x+p.x-410,y+p.y-410])
		p.rotation = [n[2]-p.x,n[3]-p.y]
		let reload = 0
		switch(w){
			case "norm":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"norm")
				break;
			case "scat":
			for(let i = 0; i < 5; i++){
				
				this.pushBullet(p.x,p.y,(n[2]-p.x)*110+Math.random()*40-20,(n[3]-p.y)*110+Math.random()*40-20,id,"scat")
			}
				break;
			case "lazr":
				
				this.pushBullet(p.x,p.y,(n[2]-p.x)*1100,(n[3]-p.y)*1100,id,"lazr")
				break;
			case "cnon":
				p.vx -= (n[2]-p.x)*10
				p.vy -= (n[3]-p.y)*10
				this.pushBullet(p.x,p.y,(n[2]-p.x)*100,(n[3]-p.y)*100,id,"cnon")
				break;
			case "heal":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"heal")
				break;
		}
		p.reloading += reload;
	}

	static getNewNUUID(){
		this.nuuIDGEN++
		return(this.nuuIDGEN)
	}
	static placeWall(x1,y1,x2,y2,type,options,special){
		
		if(type == undefined){
			type = "norm"
		}
		if(distance(x1,y1,x2,y2) < 40 && type=="norm"){
			return
		}

		let a = this.getNewNUUID()
		switch(type){
			case "norm":
				this.walls[a] = {
					"type":"norm","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":1,
					"frad":distance(x1,y1,x2,y2)/2
				}
				break;
			case "player":
				this.walls[a] = {"frad":distance(x1,y1,x2,y2)/2,"plid":options.id,"type":"player","x1":x1,"y1":y1,"x2":x2,"y2":y2,"hp":1000,
					"defense":0.5,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"frad":distance(x1,y1,x2,y2)/2
				}
				break;
			case "body":
			this.walls[a] = {"frad":distance(x1,y1,x2,y2)/2,"plid":options.id,"type":"body","x1":0,"y1":0,"x2":0,"y2":0,"hp":1000,
					"defense":0.2,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"frad":distance(x1,y1,x2,y2)/2
				}
				let pp = this.players[options.id]
				this.players[options.id].boidyVect.push([x1-pp.x,y1-pp.y,x2-pp.x,y2-pp.y])
				this.players[options.id].boidy.push(a)
				break;
			case "bhol":
				this.walls[a] = {
					"type":"bhol","x":x1,"y":y1,"radius":160,"velmult":0.95,
					"midpt":[x1,y1],"handle":"bhol","hp":4000,
					"defense":1,
					"frad":x2
				}
				break;
			case "ghol":
				this.walls[a] = {
					"type":"ghol","x":x1,"y":y1,"radius":460,"velmult":0.98,
					"midpt":[x1,y1],"handle":"ghol","hp":4000,
					"defense":1,
					"frad":x2
				}
				break;
		}

		if(special != undefined){
			let targs = Object.keys(special)
			targs.forEach((e)=>{
				this.walls[a][e] = special[e]
			})
		}

		this.updateWall(a)
		return(a)
	}
	static initiatePlayer(id,type){

		if(type == undefined || type == "ntri"){

		this.players[id] = {"reloading":0,"rotation":[0,1],"boidyVect":[[0,-40,30,30],[30,30,-30,30],[-30,30,0,-40]],"boidy":[],"x":410,"y":410,"vx":0,"vy":0,"hp":100,"id":id,"keys":{}}

		let a = this.placeWall(410,390,395,425,"player",{"id":id})
		this.players[id].boidy.push(a)
		 a = this.placeWall(425,425,395,425,"player",{"id":id})
		 this.players[id].boidy.push(a)

		 a = this.placeWall(410,390,425,425,"player",{"id":id})
		 this.players[id].boidy.push(a)
		} else if(type == "shld") {
			this.players[id].boidy.push(this.placeWall(0,0,0,0,"player",{"id":id},{"defense":10}))
		}

		this.sendAllWombjects(id)
	}

	static playerVelUpdate(){



		let objt = Object.keys(this.players)
		for(let i = 0; i < objt.length; i++){
			let p = this.players[objt[i]]
			if(p.reloading > 0){
				p.reloading -= 1
			}
			let cont = false
			p.boidy.forEach((BOI)=>{
				if(this.walls[BOI] == undefined){
					cont = true
				}
			})
			if(cont){
				continue
			}

			let tv = [0,0]
			if(p.keys.w == "a"){
				tv[1] -= 1
			}
			if(p.keys.a == "a"){
				tv[0] -= 1
			}
			if(p.keys.s == "a"){
				tv[1] += 1
			}
			if(p.keys.d == "a"){
				tv[0] += 1
			}

			let ttv = vectorNormalize([0,0,tv[0],tv[1]])
		
			p.vx += ttv[2]*1.5
			p.vy += ttv[3]*1.5
			p.vx *= 0.97
			p.vy *= 0.97

			p.x += p.vx
			p.y += p.vy


			for(let k = 0; k < p.boidyVect.length; k++){
				if(p.boidyVect[k][2] == "next"){
				this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y1 = ((p.boidyVect[k][1] * p.rotation[1] - p.boidyVect[k][0] * p.rotation[0]) + p.y)
				let K = k+1
				if(K == p.boidyVect.length){
					K = 0
				}
				
				this.walls[p.boidy[k]].x2 = ((p.boidyVect[K][0] * p.rotation[1] + p.boidyVect[K][1] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y2 = ((p.boidyVect[K][1] * p.rotation[1] - p.boidyVect[K][0] * p.rotation[0]) + p.y)
				} else {
				this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y1 = ((p.boidyVect[k][1] * p.rotation[1] - p.boidyVect[k][0] * p.rotation[0]) + p.y)
				this.walls[p.boidy[k]].x2 = ((p.boidyVect[k][2] * p.rotation[1] + p.boidyVect[k][3] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y2 = ((p.boidyVect[k][3] * p.rotation[1] - p.boidyVect[k][2] * p.rotation[0]) + p.y)
				}
			}

			p.boidy.forEach((B)=>{
				this.updateWall(B)
			})

			io.to(objt[i]).emit("cameraUp",[p.x,p.y])
		}
	}

	static sendAllWombjects(plid){
		io.to(plid).emit("CROBJECT",[this.walls,this.players])
	}

	static wallSameTeamBullet(bullet,wall){
		if(bullet.shooter == wall.plid){
			return(true)
		}
		return(false)
	}


	static fdistClose(pl,en){
		let plr = pl.frad
		let plvr = Math.sqrt(pl.vx*pl.vx + pl.vy*pl.vy)
		let enr = en.frad
		let enli = en.lingerance ? en.lingerance : 1

		

		let FBDIST = plr+plvr*enli+enr
		if(distance(pl.x,pl.y,en.midpt[0],en.midpt[1]) <= FBDIST){
			return(false)
		}
		return(true)
	}

	static speedCurveCalc(f){
		// (o+a)*r

	}

	static repeat(){
		this.drawers = []
		if(Object.keys(this.wallPushers).length > 0){
			io.to("G10.2").emit("upwalls",this.wallPushers)
		}
		this.wallPushers = {}

		this.playerVelUpdate()

		// let wallsArr = Object.keys(this.walls)
		for(let k = this.bullets.length-1; k > -1; k--){
			let B = this.bullets[k]
			B.life--
			if(B.life < 0){
				this.bullets.splice(k,1)
				continue;
			}
			let coled = "dn"

			
			let counter = 201

			let lastCol = {}
			let i = JSON.parse(JSON.stringify(B))
			let wallsArr = Object.keys(this.walls)
			let bspeed = distance(0,0,B.vx,B.vy)
			// let unhandledWalls = []
			while(coled != "stop" && counter > 0){

				counter --
				coled = "stop"
				let colsave = []
				
				for(let j = 0; j < wallsArr.length; j++){
					let w = this.walls[wallsArr[j]]

					if(lastCol[wallsArr[j]] != undefined){
								let LC = lastCol[wallsArr[j]]
								if(LC == "single"){
										delete lastCol[wallsArr[j]]
										continue;

									}
									else if(LC == "infinite"){
										continue;
			
								}
							}

					if(w?.handle == undefined){
							
							if( w == undefined || this.wallSameTeamBullet(B,w)){
								continue;
							}
							let e = this.walls[wallsArr[j]]
							// let col = this.p5re(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							let col = this.pointLineCollision(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							if(col[4]){
								colsave.push([col,wallsArr[j],[i.x+i.vx,i.y+i.vy]])
								coled = "c1"
							}

					}else{
							switch(w.handle){
								case "bhol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										i.vx += (w.x-B.x)
										i.vy += (w.y-B.y)
										this.damageWall(wallsArr[j],B)
										bspeed *= w.velmult
										coled = "dn"
										lastCol[wallsArr[j]] = "infinite"
									}
									break;
								case "ghol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										let td = distance(w.x,w.y,B.x,B.y)
										let ad = 1000000/(td*td)
										let nor = vectorNormalize([0,0,w.x-B.x,w.y-B.y])
										ad = ad>50?50:ad
										i.vx += nor[2]*ad
										i.vy += nor[3]*ad
										// bspeed += distance(B.x,B.y,B.vx+nor[2]*ad,B.vy+nor[2]*ad)-bspeed
										this.damageWall(wallsArr[j],B)
										// if(td > 50){
										// bspeed *= w.velmult}
										coled = "dn"
										lastCol[wallsArr[j]] = "infinite"
									}
									break;
							}
					}
				}


			

				if(coled == "c1"){

					 	B.shooter = ""


						let f = 0
					if(colsave.length != 1){
						let fd = Infinity
						for(let I = 0; I < colsave.length; I++){
							let tempdist = distance(colsave[I][0][0],colsave[I][0][1],i.x,i.y)
							if(tempdist<fd){
								fd = tempdist
								f = I
							}
						}
					}
						let tj = colsave[f][1]
						let tcol = colsave[f][0]
					lastCol[tj] = "single"
					let DAM = this.damageWall(tj,B)
					if(DAM){
						let tw = this.walls[tj]
						tcol = this.p5rre(tcol,colsave[f][2][0],colsave[f][2][1],tw.x1,tw.y1,tw.x2,tw.y2)
						this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1],i.extra])
						i.x = tcol[0]
						i.y = tcol[1]
						i.vx = 0.6*(tcol[2]-tcol[0])
						i.vy = 0.6*(tcol[3]-tcol[1])
						bspeed *= 0.6
					} else {
						this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1],i.extra])
						i.vx = (i.vx - (tcol[0] - i.x)) * 0.3
						i.vy = (i.vy - (tcol[1] - i.y)) * 0.3
						bspeed *= 0.3
						i.x = tcol[0]
						i.y = tcol[1]
					}
				// }
				}

			}

			if(counter == 0){
				console.log("crashed here")
			}




			// B.tail.push([i.tailLength,i.x,i.y,i.x+i.vx,i.y+i.vy])
			this.drawers.push([i.type,i.tailLength,i.x,i.y,i.x+i.vx,i.y+i.vy,i.extra])
	
			

			let vnorm = vectorNormalize([0,0,i.vx,i.vy])
			B.x = i.x + i.vx
			B.y = i.y + i.vy
			B.vx = vnorm[2] * bspeed
			B.vy = vnorm[3] * bspeed
			
			// if(B.type == "norm" || B.type == "scat" || B.type == "cnon"){
				B.vx *= B.slowd
				B.vy *= B.slowd
	
			// }

				
			let sp = B.vx*B.vx + B.vy*B.vy 

				if(B.life > 6 && ( sp < 1)){
					B.life = 5
				}
		}



		this.send()

	}
	static damageWall(wid,b){
		if(this.walls[wid].type == "norm" || this.walls[wid].type == "player" || this.walls[wid].type == "body"){
		let vy = b.vy
		let vx = b.vx
		this.walls[wid].hp -= 0.005*(vx*vx+vy*vy)*(b.dmgmult?b.dmgmult:1)/this.walls[wid].defense
		if(this.walls[wid].hp < 0){
			delete this.walls[wid]
			this.wallPushers[wid] = "_DEL"
			return(false)
		}
		this.updateWall(wid)
		return(true)
		} else if(this.walls[wid].type == "bhol"){
			b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			delete this.walls[wid]
			this.wallPushers[wid] = "_DEL"
			return(false)
		}
		this.updateWall(wid)
		return(true)
		} else if(this.walls[wid].type == "ghol"){
			// b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			delete this.walls[wid]
			this.wallPushers[wid] = "_DEL"
			return(false)
		}
	}
}
	static send(){
		io.to("G10.2").emit("drawers",[this.drawers])
	}


	static updateWall(nuuid){

		this.wallPushers[nuuid] = this.walls[nuuid]
	}

	static pointLineCollision(x1,y1,x2,y2,x3,y3,x4,y4){
  let slopeL1 = (y2-y1)/(x2-x1)
  let slopeL2 = (y4-y3)/(x4-x3)
  if(slopeL1 != slopeL2){
    

    let yc = 0
    let xc = 0
    
    xc = (-slopeL2*x3 + y3 + slopeL1*x1 - y1)/(slopeL1-slopeL2)
    if(isNaN(xc)){if(slopeL1 == Infinity || slopeL1 == -Infinity){
      xc = x1
    } else {
      xc = x3
    }}
    yc = (xc-x1)*slopeL1+y1
    if(isNaN(yc)){yc = (xc-x3)*slopeL2+y3}
    let cola = myMath.pointInLine(xc,yc,x1,y1,x2,y2)
    let colb = myMath.pointInLine(xc,yc,x3,y3,x4,y4)
    let colc = (cola&&colb)
    return([xc,yc,cola,colb,colc])
  } else {
    return("none")
  }
}

	static playerKeyUpdate(e){
		this.players[e[0]].keys = e[1]
	}

	static disconnect(s){
		delete this.players[s.id]
	}

	static p5re(MX,MY,px2,py2,MA,MB,MC,MD){

  let a = this.pointLineCollision(MX,MY,px2,py2,MA,MB,MC,MD)

  
		if(a[4]){
    let nn = vectorNormal(MA,MB,MC,MD)    
    let nv = [px2-a[0],py2-a[1]]

    
    let nv1 = [nv[0] * nn[2], nv[1] * nn[3]]
    let mult = 2 * (nv[0] * nn[0] + nv[1] * nn[1])
    let nn2 = [nv[0]-nn[0]*mult,nv[1]-nn[1]*mult]
    
    // line(a[0],a[1],a[0]+nn2[0],a[1]+nn2[1])
    
    	return([a[0],a[1],a[0]+nn2[0],a[1]+nn2[1]])
    
  	} else {
  		return("noCol")
  	}
	}
	static p5rre(a,px2,py2,MA,MB,MC,MD){
		if(a[4]){
    let nn = vectorNormal(MA,MB,MC,MD)    
    let nv = [px2-a[0],py2-a[1]]

    
    let nv1 = [nv[0] * nn[2], nv[1] * nn[3]]
    let mult = 2 * (nv[0] * nn[0] + nv[1] * nn[1])
    let nn2 = [nv[0]-nn[0]*mult,nv[1]-nn[1]*mult]
    
    // line(a[0],a[1],a[0]+nn2[0],a[1]+nn2[1])
    
    	return([a[0],a[1],a[0]+nn2[0],a[1]+nn2[1]])
    
  	} else {
  		return("noCol")
  	}
	}
}











class re8{
	static players = {}
	static rooms = {}
	static referencer = {"color":{"r":"#A00000","b":"#0000A0","y":"#A0A000","o":"#A04000","p":"#6000C0","c":"#0060C0"}}


	static logger = []

	static enIDCnt = 0

	static initiatePlayer(e,socket){
		if(this.players[e[1]]== undefined ){
			let split = e[0].split("-")
			this.players[e[1]] = {
				"id":e[1],
				"color":DFNorm(this.referencer.color,split[2]),
				"team":split[1],
				"room":split[0].split(":")[0],
				"camera":[0,0],
				"factoryUnplaced":true,
				"temporalMap":[{},[]],
				"entities":{},
				"resources":{"money":1500},
				"selector":[0,0],
				"specialState":{"name":"none"}
			}
			let n = split[0].split(":")[0]
			if(this.rooms[n]==undefined){
				this.rooms[n] = {"name":n,"vision":15,
				"type":split[0].split(":")[1],"started":false,"players":{},"map":{},
				"teamVision":false,"teams":{},
				"enRef":{
					"architect":{"m":400,"r":1},
					"soldier":{"m":100,"r":2},
					"mine":{"m":400,"r":1},
					"tank":{"m":340,"r":1},
					"sniper":{"m":320,"r":2},
					"road":{"m":200,"r":1},
					"armory":{"m":2400,"r":1},
					"medic":{"m":600,"r":2}
				}, "loop":"", "currentIntervals":{}
			}
			}
			
			if(this.rooms[n].started===false){
				socket.join(n)
				this.rooms[n].players[e[1]] = this.players[e[1]]
				if(this.rooms[n].teams[split[1]] == undefined){
					this.rooms[n].teams[split[1]] = {"entities":{},"players":{},"temporalMap":[],"type":"normal"}
				}
				this.rooms[n].teams[split[1]].players[e[1]] = this.players[e[1]]
				io.to(n).emit("joinedRoom",this.rooms[n])




			}
		}
	}


	static loadLobby(id){
		let pl = this.players[id]
		let rmph = []
		let rmobjk = Object.keys(this.rooms)
		rmobjk.forEach((e)=>{
			let rm = this.rooms[e]
			if(rm.started){
				return
			}
			let rmd = {"name":rm.name,"type":rm.type,"players":[]}
			let objP = Object.keys(rm.players)

			objP.forEach((E)=>{
				let tpl = this.players[E]
				rmd.players.push({"id":E,"team":tpl.team,"color":tpl.color})
			})
			rmph.push(rmd)

		})
		console.log(id)
		io.to(id).emit("lobby",rmph)
	}


	static startRoom(e){
		if(this.rooms[this.players[e.id].room].started === false){
			let tr = this.rooms[this.players[e.id].room]
			tr.started = true
			let map = {"width":45,"height":45,"tiles":{}}
			for(let i = 0; i < map.width; i++){
				for(let j = 0; j < map.height; j++){
					map.tiles[i+","+j] = this.generateTile()
				}
			}
			tr.map = map
			tr.enmap = {}
			tr.enDict = {}
			let ar = this.players[e.id].room
			tr.loop = setInterval(()=>{
				this.roomLoop(ar)
			},1000/20)
			// io.to(this.players[e.id].room).emit("startGame",{"map":map,"vision":15})
			this.sendRoomMapUpdate(this.players[e.id].room)
			Object.keys(this.rooms[this.players[e.id].room].players).forEach((e)=>{
				this.resourcesUpdate(e,tr)
				io.to(e).emit("enRef",[tr.enRef,CURRENTCONFIGS.re8])
			})
		}
	}

	static disconnect(socket){
		let id = socket.id
		let p = this.players[id]

		if(p == undefined){
			return;
		}
		let rm = p.room
		delete this.rooms[p.room].players[id]
		delete this.players[id]
		if(Object.keys(this.rooms[rm].players).length == 0){
			clearInterval(this.rooms[rm].loop)
			delete this.rooms[rm].enDict
			delete this.rooms[rm].enmap
			delete this.rooms[rm]
		}
		
	}


	static roomLoop(rm){
		let room = this.rooms[rm]
		let ci = room.currentIntervals
		let objk = Object.keys(ci)
		let d = Date.now()

		objk.forEach((e)=>{
			let aci = ci[e]

			if(aci.type == "income"){
				let en = room.enDict[aci.enid]
				let incomeAmt = en.income
				let p = this.players[en.ownerID]

				let cd = this.OffCooldown(room.name,aci.enid)
				if(cd){
					if(en.income[1] != "cooldown"){
						if(d-incomeAmt[1] > incomeAmt[2]){
							let amt = Math.floor((d-incomeAmt[1])/incomeAmt[2])
							room.enDict[aci.enid].income[1] += incomeAmt[2] * amt
							p.resources.money += incomeAmt[0] * amt
							this.resourcesUpdate(en.ownerID,room)
						}
						
					} else {
						en.income[1] = d
						this.emitEntityUpdate(aci.enid,room)
					}
				}

				

			}

		})
	}

	static uplayerVision2(id,rm){
		let finalVision = {}
		let visionDict = {}
		let p = this.players[id]
		let room = this.rooms[rm]

		if(!room.teamVision){
			let penArr = Object.keys(p.entities)
			penArr.forEach((e,i)=>{
				let vis = room.enDict[e].Asight
				visionDict[e] = vis
				let objvis = Object.keys(vis)

				objvis.forEach((E,I)=>{
					if(finalVision[E] == undefined||finalVision[E].dist < vis[E].dist){

						if(finalVision[E]!=undefined&&finalVision[E]["enseen"]){
							finalVision[E] = vis[E]
							finalVision[E].enseen = true
						}else{
						finalVision[E] = vis[E]}
						finalVision[E]["by"] = e
					}
					if(vis[E].enseen){
						finalVision[E].enseen = true
					}
				})

			})
		}

		return([finalVision,visionDict])

	}


	static resourcesUpdate(id,room){
		let p = this.players[id]
		io.to(id).emit("resourcesUpdate",p.resources)
	}

	static uenVisionC(id,rm){
		let room = this.rooms[rm]

			let finalVision = {}
			
				let en = this.rooms[rm].enDict[id]

				let sightLim = [[0,en.x,en.y,0,0]]

				while(sightLim.length > 0){
					let tempVision = {}
					sightLim.forEach((E,I)=>{
						
							for(let j = 0; j < 4; j++){
								let W = this.walkerD(j,E[1],E[2])
								let d = distance(0,0,W[2]+E[3],W[3]+E[4])
								
								if(d > en.sight){
									continue;
								}
								let w = this.reApos(W[0],W[1],room.map.width,room.map.height) 
								let wl = w[0]+","+w[1]
								if(tempVision[wl] == undefined && finalVision[wl] == undefined){
									tempVision[wl] = [Math.floor(d),w[0],w[1],W[2]+E[3],W[3]+E[4],d]
								}
							}
						
					})

					sightLim = []


					let objk = Object.keys(tempVision)
					objk.forEach((E,I)=>{
						sightLim.push(tempVision[E])

						if(finalVision[E] == undefined){
							finalVision[E] = {"dist":tempVision[E][0],"x":tempVision[E][1],"y":tempVision[E][2]}
							if(en.ensight>tempVision[E][0]){
								finalVision[E]["enseen"] = true

							}
						}

					})
				}
		return(finalVision)
	}
	
	static uenVision(id,rm){
		let room = this.rooms[rm]

			let finalVision = {}
			
				let en = this.rooms[rm].enDict[id]

				let sightLim = [[en.sight,en.x,en.y,0,0]]

				while(sightLim.length > 0){
					let tempVision = {}
					sightLim.forEach((E,I)=>{
						let number = E[0]-1
						if(number > 0){
							for(let j = 0; j < 4; j++){
								let W = this.walkerD(j,E[1],E[2])
								let w = this.reApos(W[0],W[1],room.map.width,room.map.height) 
								let wl = w[0]+","+w[1]
								if(tempVision[wl] == undefined || tempVision[wl][0] < number){
									tempVision[wl] = [number,w[0],w[1],walkerD[0]+e[3],walkerD[1]+e[4]]
								}
							}
						}
					})

					sightLim = []


					let objk = Object.keys(tempVision)
					objk.forEach((E,I)=>{
						sightLim.push(tempVision[E])

						if(finalVision[E] == undefined || finalVision[E].dist < tempVision[E][0]){
							finalVision[E] = {"dist":en.sight-tempVision[E][0],"x":tempVision[E][1],"y":tempVision[E][2]}
							if(en.ensight<tempVision[E][0]){
								finalVision[E]["enseen"] = true

							}
						}

					})
				}
		return(finalVision)
	}

	static walkerD(num,x,y){
		if(num == 0){
			return([x+1,y,1,0])
		} else if(num == 1){
			return([x-1,y,-1,0])
		} else if(num == 2){
			return([x,y+1,0,1])
		} else if(num == 3){
			return([x,y-1,0,-1])
		}
	}

	static reApos(x,y,w,h){
		return([x%w>=0?x%w:(w+x%w),y%h>=0?y%h:h+y%h])
	}

	static rmHandler(e,type){
		if(this.players[e.id]&&this.rooms[this.players[e.id].room].started){
			let rm = this.rooms[this.players[e.id].room]
			switch(type){
				case "click":
					this.click(e,rm)
					break;
				case "drag":
					this.drag(e,rm)
					break;
				case "key":
					this.key(e,rm)
					break;
				case "button":
					this.button(e,rm)
					break;
			}
		}
	}


	static hasMoney(id,amt){
		return(this.players[id].resources.money >= amt)
	}

	static click(e,rm){
		let p = this.players[e.id]
		if(this.players[e.id].factoryUnplaced&&rm.enmap[e.x+","+e.y] == undefined){
			delete this.players[e.id].factoryUnplaced
			let p = this.players[e.id]
			let enid = this.newEntity(e.id,e.x,e.y,"factory",rm,p.team)
			rm.currentIntervals[enid] = {"type":"income","enid":enid}
			this.players[e.id].selector = [e.x,e.y]

			this.sendPlayerMapUpdate(e.id,rm)
		} else {

			let loc = e.x+","+e.y
			let end = rm.enDict

			let pss = this.players.specialState

			if(e.sel != "none" &&e.sel != "1" &&e.sel != "2"&&e.sel != "3"){
				let rref;
				let enid;
				if(end[pss.enid] == undefined){
					return;
					console.log("re8err",pss)
				}
				switch(e.sel){
					case "Factory1":
						rref = rm.enRef["architect"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m) && end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							enid = this.newEntity(e.id,e.x,e.y,"architect",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Factory2":
						rref = rm.enRef["soldier"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"soldier",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Factory3":
						rref = rm.enRef["tank"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"tank",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Factory4":
						rref = rm.enRef["sniper"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"sniper",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Architect1":
						rref = rm.enRef["mine"]
						if(rm.map.tiles[loc].ground == "mountain"&&!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"mine",rm,p.team)
							rm.currentIntervals[enid] = {"type":"income","enid":enid}
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Architect2":
						rref = rm.enRef["road"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"road",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Architect3":
						rref = rm.enRef["armory"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"armory",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Armory1":
						rref = rm.enRef["medic"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"medic",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;


				}
				io.to(e.id).emit("SEL",{"name":"none"})
				this.players.specialState = {}
			}
			else if(this.players[e.id].temporalMap[loc] == undefined){

			} else {

			}

			p.specialState = {"name":"none"}

		}
		this.players[e.id].selector = [e.x,e.y]
	}


	static button(e,room){
		let p = this.players[e.id]
		let loc = p.selector[0]+","+p.selector[1]
		let end = room.enDict

		// if(this.players[e.id].temporalMap[loc] == undefined){

			
			let SB = this.TNEWSELB(e.id,loc,room)
			
			if(SB[3] && this.OffCooldown(room.name,SB[1])){
				if(e.sel == 0){

					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory1","color":"#009000"})
						this.players.specialState = {"name":"Factory1","enid":SB[1]}
					} else if(end[SB[1]].type == "architect"){
						io.to(e.id).emit("SEL",{"name":"Architect1","color":"#009000"})
						this.players.specialState = {"name":"Architect1","enid":SB[1]}
					} else if(end[SB[1]].type == "armory"){
						io.to(e.id).emit("SEL",{"name":"Armory1","color":"#009000"})
						this.players.specialState = {"name":"Armory1","enid":SB[1]}
					}

				}else if(e.sel == 1){
					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory2","color":"#000090"})
						this.players.specialState = {"name":"Factory2","enid":SB[1]}
					} else if(end[SB[1]].type == "architect"){
						io.to(e.id).emit("SEL",{"name":"Architect2","color":"#000090"})
						this.players.specialState = {"name":"Architect2","enid":SB[1]}
					}
				}else if(e.sel == 2){
					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory3","color":"#009090"})
						this.players.specialState = {"name":"Factory3","enid":SB[1]}
					} else if(end[SB[1]].type == "architect"){
						io.to(e.id).emit("SEL",{"name":"Architect3","color":"#009090"})
						this.players.specialState = {"name":"Architect3","enid":SB[1]}
					}
				}else if(e.sel == 3){
					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory4","color":"#900000"})
						this.players.specialState = {"name":"Factory4","enid":SB[1]}
					}
				}

			}
		// }
	}

	static OffCooldown(rm,id){
		let en = this.rooms[rm].enDict[id]

		if(en.cooldown[0] == "none"){
			return true
		}
		if(Date.now()-en.cooldown[1] > en.cooldown[2]){
			en.cooldown = ["none",0,0]
			return true
		}
		return false

	}

	static entityAtPos(loc,room,layer){
		let ens = room.enmap[loc]
		if(ens == undefined || ens.length < 1){
			return([false,0])
		}
		for(let i = 0; i < ens.length; i++){
			let e = ens[i]
			let en = room.enDict[e]
			if(en.layer == layer){
				return([true,e])
			}
		}
		return([false,0])
	}

	static SELB(id,loc,room,num){
		//has entity, entity id, entity same team, entity same owner,entity off cooldown
		if(num==undefined){
			num = 0
		}
		let out = [false,0,false,false,true]
		let end = room.enmap
		let selen;

		if(end[loc] == undefined || end[loc].length == 0){
			return(out)
		} else {
			selen = room.enDict[end[loc][num]]
			out[0] = true
			out[1] = end[loc]
		}

		if(selen.cooldown[0] == "none"|| Date.now-selen.cooldown[1] > selen.cooldown[2]){
			selen.cooldown = ["none",0,0]
			out[4] = true
		}

		if(selen.team == this.players[id].team){
			out[2] = true
		}
		if(selen.ownerID == id){
			out[3] = true
		}
		return(out)
	}

	static TNEWSELB(id,loc,room,num){
		if(num==undefined){
			num = 1
		}
		let out = [false,0,false,false,true]
		let end = room.enmap
		let selen;

		if(end[loc] == undefined || end[loc].length == 0){
			return(out)
		} else {

			let selno = "none"
			end[loc].forEach((e)=>{
				if(room.enDict[e].layer == num){
					selno = e
				}
			})
			if(selno == "none"){
				return(out)
			}
			selen = room.enDict[selno]
			out[0] = true
			out[1] = selno
		}

		if(selen.cooldown[0] == "none"|| Date.now-selen.cooldown[1] > selen.cooldown[2]){
			selen.cooldown = ["none",0,0]
			out[4] = true
		}

		if(selen.team == this.players[id].team){
			out[2] = true
		}
		if(selen.ownerID == id){
			out[3] = true
		}
		return(out)
	}


static sendRoomMapUpdate(rm){
		let room = this.rooms[rm]
		let rmplarr = Object.keys(room.players)
		rmplarr.forEach((e,i)=>{
			if(room.players[e].factoryUnplaced){
				io.to(e).emit("startGame",{"map":room.map,"vision":room.vision})
			} else {

				let tmp = this.uplayerVision(e,rm)

				io.to(e).emit("updateMap",{})
			}
		})
	}

	static sendPlayerMapUpdate(id,room){
		let p = this.players[id]
		let prvWhole = this.uplayerVision2(id,room.name)
		let prv = prvWhole[0]

		this.players[id].temporalMap = prvWhole

		let map = {}
		
		let objk = Object.keys(prv)
		objk.forEach((e,i)=>{
			map[e] = mergeDict(prv[e],room.map.tiles[e])
		})

		io.to(id).emit("personalMapUpdate",{"map":map})

	}

	static drag(e,room){

		let p = this.players[e.id]
		let loc = e.x + "," + e.y
		let tloc = e.tx + "," + e.ty

		let SB = this.SELB(e.id,loc,room)
		let end = room.enDict
			
			if(SB[3] && this.OffCooldown(room.name,SB[1])){
				if(e.sel == "none"){
					if(end[SB[1]].canshoot && end[SB[1]].shootInfo.range >= e.dist){
						io.to(e.id).emit("sline",{"name":end[SB[1]].type,"color":"#F00000","x":e.x,"y":e.y,"vx":e.vx,"vy":e.vy})
						end[SB[1]].cooldown = ["reloading",Date.now(),end[SB[1]].shootInfo.cd]
						let eap = this.entityAtPos(tloc,room,e.layer)
						if(eap[0]){
							let dmg = this.damageEntity(SB[1],eap[1],e.dist,room)
							this.damageNumRel(dmg,tloc,room)
						}
						this.emitEntityUpdate(SB[1],room)
					}
				}

			}
		p.selector = [e.tx,e.ty]

	}

	static damageEntity(sid,rid,dist,room){
		let end = room.enDict
		let sifo = end[sid].shootInfo
		let dmg = sifo.dmg + Math.floor(Math.random()*sifo.dmgv)
		end[rid].hp -= dmg
		let fatal = false
		if(end[rid].hp <= 0){
			this.killEntity(rid,room.name)
			fatal = true
			io.to(room.name).emit("entityUpdate",[rid,"-DEL-"])
		}
		return([dmg,fatal])
	}

	static damageNumRel(dmg,loc,room){
		let objk = Object.keys(room.players)
		objk.forEach((e)=>{
			if(room.players[e].temporalMap[0][loc] != undefined){
				io.to(e).emit("dmgnum",[loc,dmg])
			}
		})
	}

	static key(e,room){

		let key = e.key
		let p = this.players[e.id]



	    switch(key){
	    	case "w":
	    		this.handleWalk(e.id,p.selector[0],p.selector[1]-1,e.layer,room)
	    		break;
	    	case "s":
	    		this.handleWalk(e.id,p.selector[0],p.selector[1]+1,e.layer,room)
	    		break;
	    	case "a":
	    		this.handleWalk(e.id,p.selector[0]-1,p.selector[1],e.layer,room)
	    		break;
	    	case "d":
	    		this.handleWalk(e.id,p.selector[0]+1,p.selector[1],e.layer,room)
	    		break;
	    }

	    if(key == "w"){
     		p.selector = this.selectorMove(e.id,room,0,-1)
	    } else if(key == "s"){
	        p.selector = this.selectorMove(e.id,room,0,1)
	    } else if(key == "a"){
	      	p.selector = this.selectorMove(e.id,room,-1,0)
	    } else if(key == "d"){
	      	p.selector = this.selectorMove(e.id,room,1,0)
	    }

	}

	static selectorMove(id,room,x,y){
		let ps = this.players[id].selector
		return(this.reApos(ps[0]+x,ps[1]+y,room.map.width,room.map.height))
	}

	static handleWalk(id,x,y,layer,room){
		let p = this.players[id]
		let s = this.TNEWSELB(id,p.selector[0]+","+p.selector[1],room,layer)
		if(s[3]){
			let h = this.entityAtPos(x+","+y,room,layer)

			if(!h[0]){

				let en = room.enDict[s[1]]

				if(this.OffCooldown(room.name,s[1]) && en.movable){
					let reap = this.reApos(x,y,room.map.width,room.map.height)
					this.rmREmapper(room.name,s[1],en.x+","+en.y,reap[0]+","+reap[1])
					
					room.enDict[s[1]].x = reap[0]
					room.enDict[s[1]].y = reap[1]
					let tcd = room.enDict[s[1]].movingInfo.cd
					let trd = this.TNEWSELB(id,reap[0]+","+reap[1],room,0)
					if(room.map.tiles[room.enDict[s[1]].x+","+room.enDict[s[1]].y].ground == "mountain"){
						tcd += tcd
					}
					if(trd[0] && room.enDict[trd[1]].type == "road" && this.OffCooldown(room.name,trd[1])){
						tcd = Math.floor(tcd*0.3)
					}
					room.enDict[s[1]].cooldown = ["moving",Date.now(),tcd]
					let oldsight = JSON.parse(JSON.stringify(room.enDict[s[1]].Asight))
					room.enDict[s[1]].Asight = this.uenVisionC(s[1],room.name)
					this.sendPlayerMapUpdate(id,room)
					this.entitySightUpdate(id,oldsight,room.enDict[s[1]].Asight,room)
					this.emitEntityUpdate(s[1],room)
					
					return(true)
				}
				
			}
		}
		return(false)
	}

	static generateTile(){
		let n = ""
		let c = ""
		let colran = Math.random()
		if(Math.random()>0.3){
			n = "grass"
			c = "rgb(0,"+(Math.random()*200+55)+",0)"
		} else {
			n = "mountain"
			c = "rgb("+(colran*40+80)+","+(colran*40+80)+","+(colran*40+80)+")"
		}

		return({"ground":n,"color":c})
	}

	static entitySightUpdate(id,os,ns,room){
		let cDict = {}
		// no -> yes = true
		let objkOS = Object.keys(os)
		let objkNS = Object.keys(ns)

		objkOS.forEach((e)=>{
			if(ns[e] == undefined){
				if(os[e].enseen){
				cDict[e] = false}
				return
			}
			if(os[e].enseen != ns[e].enseen){
				if(os[e].enseen){
					cDict[e] = false
					return
				}
				if(ns[e].enseen){
					cDict[e] = true
					return
				}
			}
		})

		objkNS.forEach((e)=>{
			if(os[e] == undefined){
				if(ns[e].enseen){
				cDict[e] = true
				}
				return
			}
			if(os[e].enseen != ns[e].enseen){
				if(os[e].enseen){
					cDict[e] = false
					return
				}
				if(ns[e].enseen){
					cDict[e] = true
					return
				}
			}
		})

		let objc = Object.keys(cDict)
		let delposes = []
		objc.forEach((e)=>{
			if(cDict[e]){
				if(room.enmap[e] == undefined){
					return;
				}
				room.enmap[e].forEach((E)=>{
					io.to(id).emit("entityUpdate",[E,room.enDict[E]])
				})
			} else {
				if(this.players[id].temporalMap[0][e] == undefined || this.players[id].temporalMap[0][e].enseen !== true){
					delposes.push(e)
				}
			}
		})
		io.to(id).emit("entityPDel",delposes)

	}

		




	static newEntity(id,x,y,entity,room,team){
		this.enIDCnt += 1
		let eid = this.enIDCnt

		room.enDict[eid] = this.entityDictor(entity)
		room.enDict[eid].id = eid
		room.enDict[eid].ownerID = id
		room.enDict[eid].x = x
		room.enDict[eid].y = y
		room.enDict[eid].color = this.players[id].color
		room.enDict[eid].type = entity
		room.enDict[eid].team = team
		room.enDict[eid].cooldown[1] = Date.now()
		room.enDict[eid].Asight = this.uenVisionC(eid,room.name)
		let OBJK = Object.keys(room.enDict[eid].Asight)


		this.players[id].entities[eid] = true
		room.teams[team].entities[eid] = true

		this.players[id].temporalMap = this.uplayerVision2(id,room.name)

		OBJK.forEach((e)=>{
			if(room.enDict[eid].Asight[e].enseen && room.enmap[e] != undefined && room.enmap[e].length > 0){
				room.enmap[e].forEach((E)=>{
				this.emitEntityUpdate(E,room)					
				})
			}
		})

		this.rmEnmaper(room,eid,x+","+y,"add")

		this.emitEntityUpdate(eid,room)
		return(eid)

	}

	static emitEntityUpdate(id,room){
		let plr = Object.keys(room.players)

		let en = room.enDict[id]

		if(en == undefined){
			console.log(id,room.name)
			return;
		}

		plr.forEach((e,i)=>{
			let tm = this.players[e].temporalMap[0]
			if(tm[en.x+","+en.y] != undefined && tm[en.x+","+en.y].enseen){
				io.to(e).emit("entityUpdate",[id,room.enDict[id]])
			} else {
				io.to(e).emit("entityUpdate",[id,"-DEL-"])
			}
		})

	}

	static killEntity(id,rm){
		let entity = this.rooms[rm].enDict[id]

		let entityOwner = entity.ownerID

		if(this.rooms[rm].currentIntervals[id] !== undefined){
			delete this.rooms[rm].currentIntervals[id]
		}

		delete this.players[entityOwner].entities[id]
		delete this.rooms[rm].teams[entity.team].entities[id]
		this.rmEnmaper(this.rooms[rm],id,entity.x+","+entity.y,"remove")
		delete this.rooms[rm].enDict[id]
	}

	static rmEnmaper(room,enid,loc,op){
		let place = room.enmap[loc]
		if(op == "add"){
			if(place == undefined){
				room.enmap[loc] = []
			}
				room.enmap[loc].push(enid)
		} else if(op == "remove"){
			room.enmap[loc] = place.filter(e => e !== enid)
			if(place.length == 0){
				delete room.enmap[loc]
			}
		}
	}

	static rmREmapper(rm,enid,prloc,loc){
		let room = this.rooms[rm]
		let enm = room.enmap[prloc]

		this.rmEnmaper(room,enid,prloc,"remove")
		this.rmEnmaper(room,enid,loc,"add")
	}


	static entityDictor(en){
		return(JSON.parse(JSON.stringify(CURRENTCONFIGS.re8[en])))
	}

}

function DFNorm(dict,val){
	if(dict[val] == undefined){
		return(dict.default)
	}
	return(dict[val])
}

function mergeDict(d,d2){
	let obj = Object.keys(d2)
	obj.forEach((e)=>{
		d[e] = d2[e]
	})
	return(d)
}


