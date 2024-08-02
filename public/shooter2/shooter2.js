
document.body.style.backgroundColor = "black"
const socket = io.connect('/')


let GAMESESSION = "G10.2"
socket.emit("JOINGAME",GAMESESSION)

let COOKIE = {"playerType":"tank"}
try{
	if(window.localStorage.getItem("playerType") !== null){
		COOKIE.playerType=window.localStorage.getItem("playerType")
	}
}catch(e){}
socket.on("drawers",(e)=>{drawDrawers(e[0],e[1]);tick();})
// socket.on("walls",(e)=>{drawWalls(e)})
socket.on("acknowledge G10.2",acknowledge)
socket.on("CROBJECT",(e)=>{crobject(e)})
socket.on("spec",(e)=>{spec(e)})
socket.on("upWalls",upwalls2)
socket.on("upEntities",upEntities)
socket.on("particle",(e)=>{updateParticles(e)})
socket.on("cameraUp",(e)=>{cameraX = e[0]-canvasDimensions[2];cameraY = e[1]-canvasDimensions[3]})

let cameraX2 = 0
let cameraY2 = 0

socket.on("mass",(e)=>{MASS(e)})
socket.on("chat",(e)=>{pchat(e)})
socket.on("pong",(e)=>{player.ping = Date.now()-e})


weaponInfo = {
	"heal":{"repeating":2},
	"dril":{"repeating":2},
	"lzr2":{"repeating":2},
	"fire":{"repeating":2},
	"zapr":{"repeating":3},
	"mchg":{"repeating":3},
	"grnd":{"hold":true},
	"bounder":{"hold":true},
	"bounder2":{"hold":true},
	"dbheal":{"hold":true},
	"kb":{"hold":true}

}


function MASS(e){

	drawDrawers(e.drawers[0],e.drawers[1]);
	drawDynam(e.trak)
	tick();
	if(e.upWalls){
		upwalls2(e.upWalls)
	}
	if(e.upEntities){
		upEntities(e.upEntities)
	}

	if(e.cameraUp){
		cameraX = e.cameraUp[0]-canvasDimensions[2];cameraY = e.cameraUp[1]-canvasDimensions[3]
		cameraX2 = e.cameraUp[0]-0;cameraY2 = e.cameraUp[1]-0 //turn into number. bruh
	}
}


// socket.onAny(()=>{})



class explosionR{
	constructor(x,y,color,speed,s2,size){
		this.x = x
		this.speed = speed?speed:1
		this.s2 = (s2?s2:1)/5
		this.y = y
		this.color = color
		if(typeof(color) !== "string"){this.colorf = color; this.color = "#FF00FF"}
		this.size = 3
		this.lineWidth = size?size:1
		this.actLife = 600
		this.lastTime = Date.now()		
	}

	update(t){
		this.size += this.speed*(t-this.lastTime)/50
		this.actLife -= this.s2*(t-this.lastTime)
		this.lastTime = t
		if(this.colorf !== undefined){
			this.color = this.colorf(this.actLife/600)
		}
	}
	draw(){
		if(this.actLife < 0){
			return('del')
		}
		mainCTX.strokeStyle = this.color
		mainCTX.lineWidth = (1 + this.actLife/10)*this.lineWidth*player.zoom*2//*camera.tileRsize
		mainCTX.beginPath()
		let bts = coordToMap(this.x,this.y)
		mainCTX.arc(bts[0],bts[1], this.size*player.zoom*2, 0, 2 * Math.PI);
		mainCTX.stroke()
		
	}
}

class explosionR2{
	constructor(x,y,color,life=600,lineRelation,radiusRelation,fillcolor="rgba(0,0,0,0)"){
		this.x = x
		this.y = y
		this.color = color
		this.fillcolor = fillcolor
		if(typeof(color) !== "string"){this.colorf = color; this.color = "#FF00FF"}
		if(typeof(fillcolor) !== "string"){this.fillcolorf = fillcolor; this.fillcolor = "#FF00FF"}
		this.lineRelation = lineRelation?lineRelation:((x)=>{return(15*x/life)})
		this.radiusRelation = radiusRelation?radiusRelation:((x)=>{return((life-x)*300/life)})
		this.actLife = life
		this.maxlife = life
		this.lastTime = Date.now()		
	}

	update(t){
		this.actLife -= t-this.lastTime
		this.frameLineWidth = this.lineRelation(this.actLife)
		this.frameRadius = this.radiusRelation(this.actLife)
		this.lastTime = t
		if(this.colorf !== undefined){
			this.color = this.colorf(this.actLife/this.maxlife)
		}
		if(this.fillcolorf !== undefined){
			this.fillcolor = this.fillcolorf(this.actLife/this.maxlife)
		}
	}
	draw(){
		if(this.actLife < 0){
			return('del')
		}
		mainCTX.strokeStyle = this.color
		mainCTX.fillStyle = this.fillcolor
		mainCTX.lineWidth = this.frameLineWidth*player.zoom
		mainCTX.beginPath()
		let bts = coordToMap(this.x,this.y)
		mainCTX.arc(bts[0],bts[1], this.frameRadius*player.zoom, 0, 2 * Math.PI);
		mainCTX.stroke()
		mainCTX.fill()
		
	}
}

let bloodTiles = {}

function blood(amt,coordx,coordy,wall){
	if(player.noBlood){return}

	if(wall){
		coordx = (wall.x1 + wall.x2)/2/player.gridSize
		coordy = (wall.y1 + wall.y2)/2/player.gridSize
	}

	coordx = Math.floor(coordx)
	coordy = Math.floor(coordy)

	if(amt < 0.01){return}

	// if(coordx < 0){coordx+=1}
	// if(coordy < 0){coordy+=1}

	let coord = coordx + "," + coordy
	if(bloodTiles[coord]==undefined){
		bloodTiles[coord] = {"amt":0,"x":coordx,"y":coordy}
	}
	bloodTiles[coord].amt += amt
	if(bloodTiles[coord].amt > 0.7+Math.random()){
			let leak = bloodTiles[coord].amt * (Math.random()*0.1+0.4)
			bloodTiles[coord].amt -= leak
			blood(leak,coordx+Math.random()*2-0.5,coordy+Math.random()*2-0.5)
		
	}
	
}


let mid = [410,410]
let canvasDimensions = [820,820,410,410]

function StCcord(x,y){
	return([ (x-cameraX)  ])
}


function spec(s){
	if(s[0] == "mat"){
		player.materials = s[1]
	} if(s[0] == "zoom"){
		player.rezoom(s[1])
	}
}

function drawCircle(x,y,size){
	ctx.beginPath()
		ctx.arc(x, y, size, 0, 2 * Math.PI);
		ctx.stroke()
}


function ALTF3(){
	altf3 = (n,e)=>{player.dataNodes.push([n,JSON.stringify(e).length,Date.now()])}
	socket.onAny((n,e)=>{altf3(n,e);player.packetSec.push(Date.now()+1000)})
}
function altf3(n,e){
	player.dataNodes.push([n,JSON.stringify(e).length,Date.now()])
}
function unALTF3(){
	altf3 = ()=>{}
	player.dataNodes = []
}

var ID = ""
var cameraX = 0
var cameraY = 0



class player{
	static debugging = false
	static keyholder = false
	static ping = 100;
	static dataNodes = []
	static packetSec = []
	static weapon = "norm"
	static materials = 100
	static wall = "norm"
	static snapping = false
	static noBlood = true
	static gridSize = 80
	static weaponCounter = 1
	static weaponMin = 1
	static wallMin = 1
	static weaponDict = {"1":"norm","2":"scat","3":"lazr","4":"cnon","5":"heal","6":"grnd","7":"msl","8":"dril",
											"9":"msl2","10":"snpr","11":"lzr2","12":"mchg","13":"zapr","14":"kb","15":"kbml",
											"16":"vipr","17":"tlpt","18":"trak"
										}
	static wallCounter = 1
	static wallDict = {
		"1":"norm","2":"bhol","3":"ghol","4":"body","5":"metl",
		"6":"rflc","7":"mbdy","8":"whol","9":"box","10":"turr",
		"11":"turr2","12":"turr3","13":"Bmr","14":"brfc"
	}

	static zoom = 1
	static zoomR = 410*(1-this.zoom)

	static levelTrip = 1

	static rezoom(x){
		this.zoom = x
		this.zoomR = 410*(1-this.zoom)
	}
}
class map{
	
	static walls = {}
	static players = []
	static bullets = []
	static particles = []

}


function acknowledge(e){
	ID = e
	console.log(e)
	socket.emit("initiate",COOKIE.playerType)
}

function upwalls(e){
	let ob = Object.keys(e)
	for(let i = 0; i < ob.length; i++){
		if(e[ob[i]] == "_DEL"){
			delete map.walls[ob[i]]
			continue
		}
		map.walls[ob[i]] = e[ob[i]]
	}
}

function upwalls2(e){
	let ob = Object.keys(e)
	for(let i = 0; i < ob.length; i++){
		let obj = e[ob[i]]
		if(obj == "_DEL"){
			blood(20,0,0,map.walls[ob[i]])
			delete map.walls[ob[i]]

			continue
		}
		if(obj["hpUpdate"]){
			let originalHP = map.walls[ob[i]].hp
			map.walls[ob[i]].hp = obj.hp
			if(map.walls[ob[i]].attached){

				let hpDiff = originalHP-obj.hp
				blood(hpDiff*0.1,0,0,map.walls[ob[i]])
			}
			continue
		} // remember to continue or else it will default to cloning
		if(!map.walls[ob[i]]){map.walls[ob[i]] = {}} 
			Object.assign(map.walls[ob[i]],obj)
	}
}
function upEntities(a){
	a.forEach((e)=>{

		if(e.type == "pos"){
			// console.log(e)
			map.players[e.id].x = e.x
			map.players[e.id].y = e.y
			map.players[e.id].rotation = e.r

			updatePlayerRot(e.id)
		}  else if(e.type == "createEntity"){
			map.players[e.entity.id] = e.entity
		}else if(e.type == "create"){
			map.players[e.id].boidyVect.push(e.v)
			map.players[e.id].boidy.push(e.wid)
		} else if(e.type == "dead"){
			map.players[e.id].dead = true
			map.players[e.id].chatp?.remove()
		} else if(e.type == "team"){
			map.players[e.id].color = e.c
		}
	})
}


function updatePlayerRot(id){
	let p = map.players[id]

	for(let j = p.boidy.length-1; j > -1; j--){
				if(map.walls[p.boidy[j]] == undefined){
					p.boidy.splice(j,1)
					p.boidyVect.splice(j,1)
					// this.entityPushers[]
					cont = true
				}
			}

	for(let k = 0; k < p.boidyVect.length; k++){
				if(p.boidyVect[k][2] == "next"){
				map.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
				map.walls[p.boidy[k]].y1 = ((p.boidyVect[k][1] * p.rotation[1] - p.boidyVect[k][0] * p.rotation[0]) + p.y)
				let K = k+1
				if(K == p.boidyVect.length){
					K = 0
				}
				
				map.walls[p.boidy[k]].x2 = ((p.boidyVect[K][0] * p.rotation[1] + p.boidyVect[K][1] * p.rotation[0]) + p.x)
				map.walls[p.boidy[k]].y2 = ((p.boidyVect[K][1] * p.rotation[1] - p.boidyVect[K][0] * p.rotation[0]) + p.y)
				} else {
				map.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
				map.walls[p.boidy[k]].y1 = ((p.boidyVect[k][1] * p.rotation[1] - p.boidyVect[k][0] * p.rotation[0]) + p.y)
				map.walls[p.boidy[k]].x2 = ((p.boidyVect[k][2] * p.rotation[1] + p.boidyVect[k][3] * p.rotation[0]) + p.x)
				map.walls[p.boidy[k]].y2 = ((p.boidyVect[k][3] * p.rotation[1] - p.boidyVect[k][2] * p.rotation[0]) + p.y)
				}
			}
}

function crobject(e){
	// console.log(e[0])
	map.walls = e[0]
	map.players = e[1]
}


	let bulletAtt = {"norm":10,"scat":6,"lazr":20,"cnon":10,"heal":2,"grnd":4,"msl":4,"msl2":4,
									"dril":3,"lzr2":3,"zapr":3,"zapr2":13,"encn":23,"dbgd":20,"kbml":20,"vipr":20,"tlpt":20}


let tripVel = 0

let cttr = 0
function tick(){
	let tickTimeTracker = Date.now()
	cttr++
	// if(cttr%2===0){
	// tripVel += (Math.random()-0.5)/20
	// }
	// player.levelTrip += tripVel/2
	// player.levelTrip *= 0.99
	// 	if(player.levelTrip < 0.4){
	// 		player.levelTrip = 0.4
	// 		if(Math.random()>0.9){
	// 			tripVel = 0
	// 		}
	// 	} else if (player.levelTrip > 6){
	// 		tripVel = 0
	// 		player.levelTrip = 6
	// 	}


	mainCTX.clearRect(0,0,840,840)

	if(Mobile.initialized){Mobile.draw();socket.emit("joys",[Mobile.joystick_move.vect,Mobile.joystick_fire.vect])}
	socket.emit("keys",[ID,keyHolds]) //inefficient!!!!!!!!!!!!!!!!!!!!!!! 

	if(player.clickheld && weaponInfo[player.weaponDict[player.weaponCounter]]?.repeating &&cttr%weaponInfo[player.weaponDict[player.weaponCounter]]?.repeating === 0){
		socket.emit("click",[ID,mouseX-mid[0],mouseY-mid[1]])
	}

	
	
	let nodeDate = Date.now()
	for(let i = player.dataNodes.length-1; i > -1 ; i--){
		let n = player.dataNodes[i]
		if(nodeDate-n[2] > 2000){
			player.dataNodes.splice(i,1)
			continue
		}
		switch(n[0]){
			case "cameraUp":
				mainCTX.strokeStyle = "#FF0000"
				break;
			case "upWalls":
				mainCTX.strokeStyle = "#00FF00"
				break;
			case "drawers":
				mainCTX.strokeStyle = "#FF00FF"
				break;
			case "CROBJECT":
				mainCTX.strokeStyle = "#FFFF00"
				break;
			case "spec":
				mainCTX.strokeStyle = "#00FFFF"
				break;
			case "upEntities":
				mainCTX.strokeStyle = "#FFFFFF"
				break;
			default:
				mainCTX.strokeStyle = "rgb(255,255,"+Math.floor(Math.random()*255)+")"
				break;
		}
		
		mainCTX.lineWidth = 3
		mainCTX.beginPath()
		mainCTX.moveTo((nodeDate-n[2])/2,n[1]/20)
		mainCTX.lineTo((nodeDate-n[2])/2,0)
		mainCTX.stroke()
		// console.log(lastNode,nodeDate)
	}

	

	let CXR = player.gridSize-(cameraX2%player.gridSize)
	let CYR = player.gridSize-(cameraY2%player.gridSize)


// 	mainCTX.strokeStyle = "#101040"
// 	mainCTX.lineWidth = 3/player.levelTrip
// 	mainCTX.beginPath()

// 	player.rezoom(player.zoom/player.levelTrip)

// for(let i = -player.gridSize-player.gridSize*Math.floor(1+player.zoomR/player.gridSize/player.zoom); i < 900/player.zoom+player.gridSize/player.levelTrip; i+= player.gridSize){
// 		mainCTX.moveTo( (i + CXR)*player.zoom+player.zoomR,0)
// 		mainCTX.lineTo( (i + CXR)*player.zoom+player.zoomR,840)
// 	}
// 	for(let i = -player.gridSize-player.gridSize*Math.floor(1+player.zoomR/player.gridSize/player.zoom); i < 900/player.zoom+player.gridSize/player.levelTrip; i+= player.gridSize){
// 		mainCTX.moveTo(0,(i + CYR)*player.zoom+player.zoomR)
// 		mainCTX.lineTo(840,(i + CYR)*player.zoom+player.zoomR)
// 	}

// 	player.rezoom(player.zoom*player.levelTrip)
	// mainCTX.stroke()

	let bloodk = Object.values(bloodTiles)
	bloodk.forEach((e)=>{
		mainCTX.fillStyle = "rgba(255,0,0,"+e.amt+")"
		mainCTX.fillRect((e.x*player.gridSize-cameraX+10)*player.zoom+player.zoomR,(e.y*player.gridSize-cameraY+10)*player.zoom+player.zoomR,player.gridSize*player.zoom,player.gridSize*player.zoom)
		e.amt *= 0.98
	})


	mainCTX.strokeStyle = "#404040"
	mainCTX.lineWidth = player.zoom>0.3?3:player.zoom*10
	mainCTX.beginPath()
	// for(let i = -player.gridSize-player.gridSize*Math.floor(1+player.zoomR/player.gridSize/player.zoom); i < canvasDimensions[0]/player.zoom; i+= player.gridSize){
	// 	mainCTX.moveTo( (i + CXR)*player.zoom+player.zoomR,0)
	// 	mainCTX.lineTo( (i + CXR)*player.zoom+player.zoomR,840)
	// }
	// for(let i = -player.gridSize-player.gridSize*Math.floor(1+player.zoomR/player.gridSize/player.zoom); i < canvasDimensions[1]/player.zoom; i+= player.gridSize){
	// 	mainCTX.moveTo(0,(i + CYR)*player.zoom+player.zoomR)
	// 	mainCTX.lineTo(840,(i + CYR)*player.zoom+player.zoomR)
	// }

	for(let i = canvasDimensions[2]+CXR*player.zoom; i < canvasDimensions[0]; i+=player.gridSize*player.zoom){
		mainCTX.moveTo(i,0)
		mainCTX.lineTo(i,840)
	}
	for(let i = canvasDimensions[2]+CXR*player.zoom; i > 0; i-=player.gridSize*player.zoom){
		mainCTX.moveTo(i,0)
		mainCTX.lineTo(i,840)
	}
	for(let i = canvasDimensions[3]+CYR*player.zoom; i < canvasDimensions[1]; i+=player.gridSize*player.zoom){
		mainCTX.moveTo(0,i)
		mainCTX.lineTo(840,i)
	}
	for(let i = canvasDimensions[3]+CYR*player.zoom; i > 0; i-=player.gridSize*player.zoom){
		mainCTX.moveTo(0,i)
		mainCTX.lineTo(840,i)
	}

mainCTX.stroke()
/// draw grid ^
//draw particles starting Jun 17 24
let tn = Date.now()

for(let i = map.particles.length-1; i > -1; i--){
		let p = map.particles[i]
		p.update(tn)
		if(p.draw()=="del"){
			map.particles.splice(i,1)
		}
	} 

	// let XXX = YYY = 0
	// map.particles.push(new explosionR(XXX+0.5,YYY+0.5,
	// 				(x)=>{
	// 					let rr = 250*Math.random()
	// 					return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
	// 				16,8,2))
			// camera.particles.push(new explosionR(pc.x+0.5,pc.y+0.5,
			// 		(x)=>{
			// 			let rr = 250*Math.random()
			// 			return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
			// 		6,2,1))




///start drawing bullets
	for(let i = map.bullets.length-1; i > -1; i--){
		map.bullets[i][1]--
		if(map.bullets[i][1] < 0){
			map.bullets.splice(i,1)
			continue
		}
		let e = map.bullets[i]
		mainCTX.beginPath()
		if(e[6]==undefined){
			e[6] = {}
		}
		mainCTX.lineWidth = (e[1]+1) * (e[6].tailmult == undefined?1:e[6].tailmult) * player.zoom // (e[6].tailtime?e[6].tailtime:1)

		if(e[0] == "norm" || e[0] == "scat" || e[0] == "cnon"){
		mainCTX.strokeStyle = "#FFFF00"
		} else if(e[0] == "lazr" || e[0] == "lzr2" || e[0] == "zapr"){
			mainCTX.strokeStyle = "#00FFFF"
		} else if(e[0] == "heal" || e[0] === "trav"){
			mainCTX.strokeStyle = "#FF0000"
		} else if(e[0] == "grnd" || e[0] == "dbgd" || e[0] == "vipr"){
			mainCTX.strokeStyle = "#007000"
		} else if(e[0] === "msl" || e[0] == "msl2" || e[0] == "kbml"){
			mainCTX.strokeStyle = "#A00000"
		} else if(e[0] === "trak" || e[0] === "dril"){
			mainCTX.strokeStyle = "#A0A000"
		} else if(e[0] === "tlpt"){
			mainCTX.strokeStyle = "rgb(0,"+Math.floor(Math.random()*255)+",255)"
		} else if(e[0] === "zapr2" || e[0] === "encn"){
			mainCTX.strokeStyle = "rgb("+Math.floor(Math.random()*255)+",255,255)"
		} else if(e[0] === "fire"){
			mainCTX.strokeStyle = "rgba(255,"+Math.floor(Math.random()*255)+",0,"+(Math.random()+0.5)+")"
		}
		mainCTX.moveTo((e[2]-cameraX2)*player.zoom + canvasDimensions[2],(e[3]-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.lineTo((e[4]-cameraX2)*player.zoom + canvasDimensions[2],(e[5]-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.stroke()
	}


	let wallsArr = Object.keys(map.walls)
	let rwc = Math.random()
	for(let j = 0 ; j < wallsArr.length; j++){
		let i = map.walls[wallsArr[j]]
		let dead = false
		let renderHP = i.hp
		let col;
		if(i.hp < 0){
			renderHP = 20
			if(Math.floor(Date.now()/600)%2){
				col = "rgba(100,0,0)"
			}
		}

		if(i.type == "norm" || i.type == "player" || i.type == "body"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 3*player.zoom
		mainCTX.strokeStyle = col?col:"rgba(255,255,255,"+(renderHP/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y1-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.lineTo((i.x2-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y2-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.stroke()
		}else if(i.type == "metl" || i.type == "mbdy"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 9*player.zoom
		mainCTX.strokeStyle = col?col:"rgba(205,205,225,"+(renderHP/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y1-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.lineTo((i.x2-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y2-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.stroke()
		}else if(i.type == "wall"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 12*player.zoom
		mainCTX.strokeStyle = col?col:"rgba(255,225,205,"+(renderHP/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y1-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.lineTo((i.x2-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y2-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.stroke()
		}else if(i.type == "rflc"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 9*player.zoom
		mainCTX.strokeStyle = col?col:"rgba(155,205,"+(205+rwc*50)+","+(renderHP/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y1-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.lineTo((i.x2-cameraX2)*player.zoom + canvasDimensions[2] ,(i.y2-cameraY2)*player.zoom + canvasDimensions[3])
		mainCTX.stroke()
		}  else if(i.type == "bhol" || i.type == "ghol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3*player.zoom
			mainCTX.strokeStyle = i.type == "bhol"?"#FF0000":"#0000FF"
			mainCTX.moveTo( (i.x-i.radius-cameraX2)*player.zoom+canvasDimensions[2],(i.y-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.lineTo( (i.x+i.radius-cameraX2)*player.zoom+canvasDimensions[2],(i.y-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.moveTo( (i.x-cameraX2)*player.zoom+canvasDimensions[2],(i.y-i.radius-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.lineTo( (i.x-cameraX2)*player.zoom+canvasDimensions[2],(i.y+i.radius-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.stroke()
		}else if(i.type == "whol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3*player.zoom
			mainCTX.strokeStyle = "#707000"
			mainCTX.moveTo( (i.x-i.radius-cameraX2)*player.zoom+canvasDimensions[2],(i.y-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.lineTo( (i.x+i.radius-cameraX2)*player.zoom+canvasDimensions[2],(i.y-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.moveTo( (i.x-cameraX2)*player.zoom+canvasDimensions[2],(i.y-i.radius-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.lineTo( (i.x-cameraX2)*player.zoom+canvasDimensions[2],(i.y+i.radius-cameraY2)*player.zoom+canvasDimensions[3])
			mainCTX.stroke()
		}
	}


	// map.players[e.id].x
	Object.values(map.players).forEach((e)=>{
		if(e.dead){return}
		let ran = Math.random()*10
			mainCTX.fillStyle = "hsla("+e.color+",70%,75%,"+((10-ran)/5)+")"
			mainCTX.fillRect((e.x-cameraX2)*player.zoom+canvasDimensions[2]-ran,(e.y-cameraY2)*player.zoom+canvasDimensions[3]-ran,ran*2,ran*2)
	

	//draw chat (temporary)
			if(e.chat){
				// mainCTX.font = "bold "+Math.floor(23*player.zoom)+"px Courier New"
				// mainCTX.fillText(e.chat,(e.x-cameraX2)*player.zoom+canvasDimensions[2]+25*player.zoom,(e.y-cameraY2)*player.zoom+canvasDimensions[3]-55*player.zoom,200)


				e.chatp.style.font = "bold "+Math.floor(23*player.zoom)+"px Courier New"
				e.chatp.style.bottom = Math.floor( ( (-e.y+35+cameraY2)*player.zoom+canvasDimensions[3]))+"px"
				e.chatp.style.left = Math.floor( ( (e.x+25-cameraX2)*player.zoom+canvasDimensions[2]) )+"px"

			}
		
	})

			




	// mainCTX.fillStyle = "#00FF00"
	// mainCTX.fillRect(mouseX+player.gridSize/2-5,mouseY+player.gridSize/2-5,10,10)
	// mainCTX.fillRect(mouseX+cameraX+player.gridSize/2-(Math.abs((mouseX+cameraX+player.gridSize/2)%player.gridSize))-5-cameraX,
		// mouseY+cameraY+player.gridSize/2-(Math.abs((mouseY+cameraY+player.gridSize/2)%player.gridSize))-5-cameraY,10,10)
		let ala = Math.random()
		let alb = Math.random()
	mainCTX.fillStyle = "rgba("+(200+ala*55)+",0,0,"+(alb*0.2+0.8)+")"
	mainCTX.font = "bold 23px Courier New"
	mainCTX.fillText("weapon: "+player.weaponCounter+" - "+player.weapon,20,800)
	mainCTX.fillText("building: "+player.wallCounter+" - "+player.wall,280,800)
	mainCTX.fillText("snapping: "+(player.snapping?"on":"off"),560,800)
	mainCTX.fillStyle = "rgba(0,"+(150+ala*55)+",0,"+(alb*0.2+0.8)+")"
	mainCTX.fillText("position: "+Math.floor(cameraX2/20)+" "+Math.floor(cameraY2/20),20,770)
	mainCTX.fillText("materials: "+player.materials,320,770)
	mainCTX.fillText("tick: "+(Date.now()- tickTimeTracker)+"ps-"+player.packetSec.length,620,770)
	if(player.debugging){
	mainCTX.fillStyle = "rgba("+(150+ala*55)+","+(150+ala*55)+",0,"+(alb*0.2+0.8)+")"
		mainCTX.fillText("ping: "+player.ping,20,740)
		if(cttr%50 == 0){
			socket.emit("ping",Date.now())
		}
		// mainCTX.fillText("materials: "+player.materials,320,770)
		// mainCTX.fillText("tick: "+(Date.now()- tickTimeTracker)+"ps-"+player.packetSec.length,620,770)
	}
	let dn = Date.now()
	for(let i = player.packetSec.length-1; i>-1; i--){
		if(player.packetSec[i] < dn){
			player.packetSec.splice(i,1)
		}
	}
}

let mainCanvas = document.getElementById("canvasRegress")
let mainCTX = mainCanvas.getContext("2d")
myCanvas.style.overflowX = "hidden"
myCanvas.style.overflowY = "hidden"

document.body.style.overflowX = "hidden"
document.body.style.overflowY = "hidden"



var ZOOMSETTINGS = {"windowWidth":window.innerWidth, "windowHeight":window.innerHeight,"expectWidth":1560,"expectHeight":940}

var allzoom = 1


function coordToMap(x,y){
	// return([(x-cameraX)*player.zoom + player.zoomR,(y-cameraY)*player.zoom + player.zoomR])
	return([(x-cameraX2)*player.zoom + canvasDimensions[2],(y-cameraY2)*player.zoom + canvasDimensions[3]])
}

function windowRescale(e){

  if(e != undefined && !isNaN(parseFloat(e))){
    allzoom = parseFloat(e)
    document.body.style.zoom = allzoom
    // document.body.style.MozTransform = "scale("+allzoom+")";
    // document.body.style.MozTransformOrigin = "0 0";
    return(allzoom)
    return;
  }

  let zoomScale = 1

  ZOOMSETTINGS = {"windowWidth":window.innerWidth, "windowHeight":window.innerHeight,"expectWidth":840,"expectHeight":840}

  if(ZOOMSETTINGS.windowWidth < ZOOMSETTINGS.expectWidth){
    zoomScale = ZOOMSETTINGS.windowWidth/ZOOMSETTINGS.expectWidth
  }

  if(ZOOMSETTINGS.windowHeight < ZOOMSETTINGS.expectHeight){
    let tzoomScale = ZOOMSETTINGS.windowHeight/ZOOMSETTINGS.expectHeight
    if(tzoomScale < zoomScale){
      zoomScale = tzoomScale
    }
  }

  if(ZOOMSETTINGS.windowHeight > ZOOMSETTINGS.expectHeight && ZOOMSETTINGS.windowWidth > ZOOMSETTINGS.expectWidth){
  	let b1 = ZOOMSETTINGS.windowHeight/ZOOMSETTINGS.expectHeight
  	let b2 = ZOOMSETTINGS.windowWidth/ZOOMSETTINGS.expectWidth
  	let a = b1 > b2?b2:b1
  	zoomScale = a
  }


  allzoom = zoomScale
  document.body.style.zoom = allzoom
  // document.body.style.MozTransform = "scale("+allzoom+")";
  // document.body.style.MozTransformOrigin = "0 0";





  return(zoomScale)

}

windowRescale()

myCanvas.style.left = Math.floor(window.innerWidth/allzoom/2-canvasDimensions[0]/2)+"px"
mid[0] += Math.floor(window.innerWidth/allzoom/2-canvasDimensions[0]/2)
mid[2] = Math.floor(window.innerWidth/allzoom/2-canvasDimensions[0]/2)


  // new shit 29 07 2024

	// canvasWrapper.style.width = Math.floor(myCanvas.offsetWidth) + "px"
  // canvasWrapper.style.height = Math.floor(myCanvas.offsetHeight) + "px"
  // canvasWrapper.style.top = Math.floor(myCanvas.offsetTop) + "px"
  // canvasWrapper.style.left = Math.floor(myCanvas.offsetLeft) + "px"
  // console.log(myCanvas.offsetLeft)

	// mainCTX.clearRect(0,0,840,840)

function drawDrawers(e,dynam){


	e.forEach((i)=>{
		let bat = bulletAtt[i[0]]
		if(bat == undefined){
			bat = 10
		}
		let a = i[5]?(i[5].tailLength?i[5].tailLength:bat):bat
		i.splice(1,0,a)
		map.bullets.push(i)
	})

	if(dynam){
		drawDynam(dynam)
	}

	}

function drawDynam(dynam){
	if(dynam){
	dynam.forEach((i)=>{
		i.splice(1,0,3)
		map.bullets.push(i)
	})}
}
// function drawWalls(e){
// 	// console.log(e)
// 	e.forEach((i)=>{
// 		// let i = a[j]
// 		mainCTX.beginPath()
// 		mainCTX.lineWidth = 3
// 		mainCTX.strokeStyle = "#FFFFFF"
// 		mainCTX.moveTo(i.x1,i.y1)
// 		mainCTX.lineTo(i.x2,i.y2)
// 		mainCTX.stroke()
// 	})
// }

var mouseX = 0
var mouseY = 0
// var mouseX2 = 0
// var mouseY2 = 0

onmousemove = (e)=>{mouseX = (e.clientX)/allzoom; mouseY = (e.clientY - 2*allzoom)/allzoom

	// mouseX2 = 
}

document.addEventListener("mousedown",(e)=>{
	if(e.button==2){

		if(placing[0] === false){
			placing = [true,(mouseX-mid[0])/player.zoom+cameraX2,(mouseY-mid[1])/player.zoom+cameraY2]
		}
		e.preventDefault()
		return;
	}
	if(weaponInfo[player.weapon]?.hold){
		socket.emit("clickdown",[(mouseX-mid[0])/player.zoom,(mouseY-mid[1])/player.zoom,player.weapon])
	} else {
		socket.emit("click",[ID,(mouseX-mid[0])/player.zoom,(mouseY-mid[1])/player.zoom,player.weapon])
	}
	player.clickheld = true
})

document.addEventListener("contextmenu",(e)=>{e.preventDefault()})

document.addEventListener("wheel",(e)=>{
	if(e.altKey){
		let CXR = player.gridSize-(cameraX2%player.gridSize)
		let CYR = player.gridSize-(cameraY2%player.gridSize)

		console.log(CXR,CYR)

		player.gridSize += e.deltaY/50
		return;	
	}
	player.rezoom(player.zoom-e.deltaY/5000)
	if(player.zoom < 0){
		player.rezoom(0.01)
	}
})

document.addEventListener("mouseup",(e)=>{

	if(e.button==2){
		buildWall(mouseX,mouseY)
		return;
	}

	if(weaponInfo[player.weapon]?.hold){
		socket.emit("clickup",[(mouseX-mid[0])/player.zoom,(mouseY-mid[1])/player.zoom,player.weapon])
	}
	player.clickheld = false
})

var placing = [false]
var keyHolds = {}
document.addEventListener("keydown",(e)=>{
  if(player.chatting){return}
  let key = e.key

  if(key == "h"){
  	helpMenu()
  }

  if(keyHolds[key] == "a"){
  	return
  }
  keyHolds[key] = "a"


  e.preventDefault()
  switch(key){
  	case "r":
  		// placing2 = [true,(mouseX-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX,mouseY/player.zoom-player.zoomR/player.zoom+cameraY]
  		if(placing[0] === false){
  			placing = [true,(mouseX-mid[0])/player.zoom+cameraX2,(mouseY-mid[1])/player.zoom+cameraY2]
  		}
  		break;
    case "q":
  		player.weaponCounter -= 1
  		if(player.weaponCounter < player.weaponMin){
  			player.weaponCounter = Object.values(player.weaponDict).length+ player.weaponMin-1
  		}
  		player.weapon = player.weaponDict[player.weaponCounter]
  		break;
  	case "e":
  		player.weaponCounter += 1
  		if(player.weaponCounter > Object.values(player.weaponDict).length+ player.weaponMin-1){
  			player.weaponCounter = player.weaponMin
  		}
  		player.weapon = player.weaponDict[player.weaponCounter]
  		break;
  	case "z":
  		player.wallCounter -= 1
  		if(player.wallCounter < player.wallMin){
  			player.wallCounter = Object.values(player.wallDict).length + player.wallMin-1
  		}
  		player.wall = player.wallDict[player.wallCounter]
  		break;
  	case "c":
  		player.wallCounter += 1
  		if(player.wallCounter > Object.values(player.wallDict).length+ player.wallMin-1){
  			player.wallCounter = player.wallMin
  		}
  		player.wall = player.wallDict[player.wallCounter]
  		break;
  	case "p":
  		player.snapping = !player.snapping
  		break;
  	case "F3":
  		if(!player.debugging){
  			ALTF3()
  			player.debugging = true
  		} else {
  			player.debugging = false
  			unALTF3()
  		}
  		break;
  	case "F2":
  		if(e.shiftKey){
  			player.wall = prompt("wall?")
  		} else {
				player.weapon = prompt("weapon?")
  		}
  		break;
  	case "F4":
  		player.weaponMin = -12
  		player.weaponDict["0"] = "dbdril"
  		player.weaponDict["-1"] = "dbml"
  		player.weaponDict["-2"] = "spawner"
  		player.weaponDict["-3"] = "keyheal"
  		player.weaponDict["-4"] = "zapr2"
  		player.weaponDict["-5"] = "scat2"
  		player.weaponDict["-6"] = "unloader"
  		player.weaponDict["-7"] = "grnd2"
  		player.weaponDict["-8"] = "fire"
  		player.weaponDict["-9"] = "trav"
  		player.weaponDict["-10"] = "encn"
  		player.weaponDict["-11"] = "encn2"
  		player.weaponDict["-12"] = "encn3"

  		player.wallMin = -4
  		player.wallDict["0"] = "spawnpad"
  		player.wallDict["-1"] = "grv1"
  		player.wallDict["-2"] = "grv2"
  		player.wallDict["-3"] = "spawnpad2"
  		player.wallDict["-4"] = "rbuild"

  		break;
  	case "F1":
  		window.localStorage.setItem("playerType",prompt("type?"))
  		COOKIE.playerType = window.localStorage.getItem('playerType')
  		break;
  	case "j":
			socket.emit("key","test")
  		break;
  	case "/":
  		let inputElm = document.createElement("div")
  		inputElm.contentEditable = true
  		inputElm.style.position = "absolute"
  		inputElm.style.zIndex = "4"
  		inputElm.style.minWidth = "20%"
  		inputElm.style.maxWidth = "30%"
  		inputElm.style.minHeight = "10%"
  		inputElm.style.padding = "1px"
  		inputElm.id = "chatInput"
  		inputElm.style.backgroundColor = "#A0A0A0"
  		inputElm.style.overflowY = "visible"
  		inputElm.addEventListener("keydown",(e)=>{
  			if(e.key == "Enter" && !e.shiftKey){
  		player.chatting = false
  				player.chat = inputElm.innerText

  				if(player.chat[0] == ";"){
  					let command = player.chat.substring(1)
  					let split = command.split(" ")
  					if(split[0] == "w" || split[0] == "weapon"){
  						player.weapon = split[1]
  					} else if(split[0] == "b" || split[0] == "building"){
  						player.wall = split[1]
  					} else if(split[0] == "c" || split[0] == "class"){
  						window.localStorage.setItem("playerType",split[1])
  						COOKIE.playerType = window.localStorage.getItem('playerType')
  					} else if(split[0] == "r" || split[0] == "reload"){
  						window.location.reload()
  					}
  				} else {
						socket.emit("chat",player.chat)
  				}

					inputElm.remove()
  			}
  		})
  		document.body.appendChild(inputElm)
  		player.chatting = true
  		inputElm.focus()
  		break;
  }  
  console.log(key)

})


document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key
  delete keyHolds[key]
  if(key == "r"){
  	//deleted stuff 22 07 2024
  	buildWall(mouseX,mouseY)
  }


})

function buildWall(x,y){
	if(player.snapping){
  		//overhauled 22 07 2024
  		placing[1] = Math.round(placing[1]/player.gridSize)*player.gridSize
  		placing[2] = Math.round(placing[2]/player.gridSize)*player.gridSize
  		let mx = (x-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX
  		let my = y/player.zoom-player.zoomR/player.zoom+cameraY
  		mx = Math.round(mx/player.gridSize)*player.gridSize
  		my = Math.round(my/player.gridSize)*player.gridSize


  		socket.emit("placeWall",[placing[1],placing[2],mx,my,player.wall,{"regen":10}])

  	} else {
  	socket.emit("placeWall",[placing[1],placing[2],(x-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX,y/player.zoom-player.zoomR/player.zoom+cameraY,player.wall])
  	}
  	placing = [false]
  
}


















function touchHandler(e)
{
	e.preventDefault()
	let touches = e.changedTouches,
        first = touches[0]



    // if(event.type == 'touchmove' && event.touches.length == 2){
    // 	let newDist = Math.hypot(
    // 		e.touches[0].pageX - e.touches[1].pageX,
    // 		e.touches[0].pageY - e.touches[1].pageY);
    // }

        for(let i = 0; i < touches.length; i++){
    			let E = touches[i]
    			if(!Mobile.activeTouches[E.identifier]){
    				Mobile.activeTouches[E.identifier] = {"type":"unidentified"}
    			}
    	}





      if(e.type == "touchstart"){
      		let E = touches[touches.length-1]
      		let x = E.pageX/allzoom
      		let y = E.pageY/allzoom
      	if(e.target == Mobile.canvas){
      		
      		// if(E.pageX/allzoom < 400){

      		// Mobile.activeTouches[E.identifier].type = "joystick_move"
      		// Mobile.activeTouches[E.identifier].color = "green"
      		// 	} else {
      		// Mobile.activeTouches[E.identifier].type = "joystick_fire"
      		// Mobile.activeTouches[E.identifier].color = "red"
      		// 	}

      		if(distance(Mobile.joystick_move.mx,Mobile.joystick_move.my,E.pageX/allzoom,E.pageY/allzoom) < Mobile.joystick_move.r){
      				Mobile.activeTouches[E.identifier].type = "joystick_move"
      				Mobile.activeTouches[E.identifier].color = "green"
      			} else if(distance(Mobile.joystick_fire.mx,Mobile.joystick_fire.my,E.pageX/allzoom,E.pageY/allzoom) < Mobile.joystick_fire.r){
      				Mobile.activeTouches[E.identifier].type = "joystick_fire"
      				Mobile.activeTouches[E.identifier].color = "red"
      			} else if(x > Mobile.scroller_weapon.x && y > Mobile.scroller_weapon.y && x < Mobile.scroller_weapon.x+Mobile.scroller_weapon.w && y < Mobile.scroller_weapon.y+Mobile.scroller_weapon.h){
      		Mobile.activeTouches[E.identifier].type = "scroller_weapon"
      		Mobile.activeTouches[E.identifier].color = "purple"
      		Mobile.scroller_weapon.startx = x
      		Mobile.scroller_weapon.oldval = Mobile.scroller_weapon.val
      			} else if(x > Mobile.scroller_wall.x && y > Mobile.scroller_wall.y && x < Mobile.scroller_wall.x+Mobile.scroller_wall.w && y < Mobile.scroller_wall.y+Mobile.scroller_wall.h){
      		Mobile.activeTouches[E.identifier].type = "scroller_wall"
      		Mobile.activeTouches[E.identifier].color = "purple"
      		Mobile.scroller_wall.startx = x
      		Mobile.scroller_wall.oldval = Mobile.scroller_wall.val
      			}


      	} else if(e.target == mainCanvas || e.target == myCanvas){
      		Mobile.activeTouches[E.identifier].type = "mainCanvas"
      		Mobile.activeTouches[E.identifier].color = "orange"
      		if(x > mid[2] && x < mid[2] + 820){
      		Mobile.activeTouches[E.identifier].color = "#FF00A0"
      		}
  				placing = [true,(x-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX,y/player.zoom-player.zoomR/player.zoom+cameraY]

  				Mobile.canvasFingers += 1
    			if(Mobile.canvasFingers == 1){
    				Mobile.canvasGesture = "placing"
    			} else if(Mobile.canvasFingers == 2){
    				Mobile.canvasGesture = "zooming"
      		Mobile.activeTouches[E.identifier].color = "purple"
      		Mobile.activeTouches[E.identifier].secondTouch = true
      		Mobile.zooming = {"orgZoom":player.zoom,"orgDist":undefined,"x2":x,"y2":y,"x1":undefined,"y1":undefined}
    			}
      	}
      }

      // if(e.type == "touchmove"){
      	
      // }

    if(e.type !== "touchend"){
   

    		// console.log(touches[0].pageX)
    	// touches.forEach((E)=>{


    		for(let i = 0; i < touches.length; i++){
    			let E = touches[i]
    			let EUID = Mobile.activeTouches[E.identifier]
    		Mobile.ctx.fillStyle = EUID.color?EUID.color:"cyan"

    		let x = E.pageX/allzoom, y = E.pageY/allzoom

    		Mobile.ctx.fillRect(x,y,10,10)

    		if(EUID.type == "joystick_move"){
    			Mobile.joystick_move.vect = [(x-Mobile.joystick_move.mx)/Mobile.joystick_move.r,(y-Mobile.joystick_move.my)/Mobile.joystick_move.r]
    			Mobile.ctx.beginPath()
    			Mobile.ctx.moveTo(Mobile.joystick_move.mx,Mobile.joystick_move.my)
    			Mobile.ctx.lineTo(Mobile.joystick_move.mx+Mobile.joystick_move.vect[0]*100,Mobile.joystick_move.my+Mobile.joystick_move.vect[1]*100)
    			Mobile.ctx.strokeStyle="white"
    			Mobile.ctx.stroke()
    		} else if(EUID.type == "joystick_fire"){
    			Mobile.joystick_fire.vect = [x-Mobile.joystick_fire.mx,y-Mobile.joystick_fire.my]
    		}else if(EUID.type == "scroller_weapon"){
    			Mobile.scroller_weapon.val = Mobile.scroller_weapon.oldval + Math.floor((x-Mobile.scroller_weapon.startx)/20)
  				player.weapon = player.weaponDict[Mobile.scroller_weapon.val]
  				player.weaponCounter = Mobile.scroller_weapon.val
    		}else if(EUID.type == "scroller_wall"){
    			Mobile.scroller_wall.val = Mobile.scroller_wall.oldval + Math.floor((x-Mobile.scroller_wall.startx)/20)
  				player.wall = player.wallDict[Mobile.scroller_wall.val]
  				player.wallCounter = Mobile.scroller_wall.val
    		}else if (EUID.type == "mainCanvas"){
    			// placing[3] = x
    			// placing[4] = y
    			if(Mobile.canvasGesture == "zooming"){
    				let mz = Mobile.zooming
    				if(EUID.secondTouch){
    			 		EUID.color = "green"
    			 		mz.x2 = x
    			 		mz.y2 = y
    				} else if(EUID.color == "orange"){
    					mz.x1 = x
    			 		mz.y1 = y
    				}
    				if(mz.x1 !== undefined){
    					if(mz.orgDist !==undefined){
    						mz.dist = distance(mz.x1,mz.y1,mz.x2,mz.y2)
    						player.rezoom(mz.orgZoom-(mz.orgDist-mz.dist)/500)
								if(player.zoom < 0){
									player.rezoom(0.01)
								}
    					} else {
    						mz.orgDist = distance(mz.x1,mz.y1,mz.x2,mz.y2)
    					}
    				}
    			}
    			
    		}


    	}

  } else {
    		for(let i = 0; i < touches.length; i++){
    			let E = touches[i]
    			let x = E.pageX/allzoom, y = E.pageY/allzoom
    			let EUID = Mobile.activeTouches[E.identifier]

    		if(EUID.type == "joystick_move"){Mobile.joystick_move.vect = [0,0]}
    		else if(EUID.type == "joystick_fire"){

					socket.emit("click",[ID,Mobile.joystick_fire.vect[0],Mobile.joystick_fire.vect[1],player.weapon])
					Mobile.joystick_fire.vect = [0,0]
					// console.log(Mobile.joystick_fire[0]+mid[0],Mobile.joystick_fire[1]+mid[1])
    		} else if (EUID.type == "mainCanvas"){
    			if(Mobile.canvasGesture == "placing"){
    				buildWall(x,y)
    			}
    			Mobile.canvasFingers-=1
    			if(Mobile.canvasFingers == 0){
    				Mobile.canvasGesture = "none"
    			}
    		}
    		delete Mobile.activeTouches[E.identifier]
    	}

  }






    // if(e.type == "touchend"){

    //    }


    
	e.preventDefault()
}
function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

function init() 
{

    document.addEventListener("touchstart", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchmove", (e)=>{e.preventDefault();touchHandler(e)}, true);
    document.addEventListener("touchend", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchcancel", (e)=>{touchHandler(e)}, true);    
    // document.addEventListener('touchmove', function(e) { e.preventDefault() }, { passive:false });
}




class Mobile {
	static joystick_move = {"mx":185,"my":821,"x":100,"y":100,"r":100,"vect":[0,0]}
	static joystick_fire = {"mx":600,"my":100,"x":600,"y":100,"r":100,"vect":[0,0]}
	static scroller_weapon = {"x":40,"y":60,"w":170,"h":40,"val":0}
	static scroller_wall = {"x":(window.innerWidth-10-170)/allzoom,"y":60,"w":170,"h":40,"val":0}
	static activeTouches = {}
	static canvas;
	static canvasFingers = 0
  static canvasGesture = "none"
	static initialized = false
	static init(){
	this.initialized = true

  document.body.style.touchAction = 'none';
		let mobileCanvas = document.createElement("canvas")
		mobileCanvas.width = window.innerWidth/allzoom
		mobileCanvas.height = window.innerHeight/allzoom
		mobileCanvas.style.position = "absolute"
		mobileCanvas.style.top = "0px"
		mobileCanvas.style.left = "0px"
		mobileCanvas.id = "mcanvas"
		mobileCanvas.style.userSelect = "none" //gay
		mobileCanvas.style.touchAction = "none"
		mobileCanvas.addEventListener("contextmenu",(e)=>{e.preventDefault()})
		myCanvas.addEventListener("contextmenu",(e)=>{e.preventDefault()})
		myCanvas.style.touchAction = "none"
		myCanvas.style.userSelect = "none" //gay
		myCanvas.classList.add("mobile")
		mobileCanvas.classList.add("mobile")
		this.ctx = mobileCanvas.getContext("2d")
		this.canvas = mobileCanvas
		document.body.insertBefore(mobileCanvas,myCanvas)
		mobileCanvas.addEventListener("touchstart",(e)=>{})
		let r = myCanvas.getBoundingClientRect()
		this.joystick_move.my = r.bottom - this.joystick_move.r-75
		this.joystick_move.mx = r.left - this.joystick_move.r-25
		this.joystick_fire.my = r.bottom - this.joystick_move.r-75
		this.joystick_fire.mx = r.left + r.width + this.joystick_move.r + 25
		console.log(r)
		init()

	}
	static draw(){
		this.ctx.clearRect(0,0,4000,4000)
		if(!this.initialized){return}
			this.ctx.beginPath()
		this.ctx.strokeStyle="white"
		this.ctx.lineWidth = 5
			this.ctx.arc(this.joystick_move.mx, this.joystick_move.my, this.joystick_move.r, 0, 2*Math.PI)
			this.ctx.stroke()
			this.ctx.beginPath()
			this.ctx.arc(this.joystick_fire.mx, this.joystick_fire.my, this.joystick_fire.r, 0, 2*Math.PI)
			this.ctx.stroke()

			if(this.joystick_fire.vect[0] !== 0 && this.joystick_fire.vect[1] !== 0){
				mainCTX.fillStyle = "rgba(255,0,0,0.5)"
				mainCTX.fillRect(this.joystick_fire.vect[0]*4-5+canvasDimensions[2],this.joystick_fire.vect[1]*4-5+canvasDimensions[3],10,10)
			}

		this.ctx.fillStyle = "#777777"
		this.ctx.fillRect(this.scroller_weapon.x,this.scroller_weapon.y,this.scroller_weapon.w,this.scroller_weapon.h)
		this.ctx.fillRect(this.scroller_wall.x,this.scroller_wall.y,this.scroller_wall.w,this.scroller_wall.h)
		this.ctx.fillStyle = "#FFFFFF"
		this.ctx.font = "28px Arial"
		this.ctx.fillText(this.scroller_weapon.val,this.scroller_weapon.x+this.scroller_weapon.w/2,this.scroller_weapon.y+this.scroller_weapon.h/1.5)
		this.ctx.fillText(this.scroller_wall.val,this.scroller_wall.x+this.scroller_wall.w/2,this.scroller_wall.y+this.scroller_wall.h/1.5)
		

	}
}

document.body.addEventListener('touchstart', function() {
  Mobile.init()
	Mobile.draw()
}, { once: true })



// ALTF3()
// player.debugging = true

function ranrange(x){
	return(Math.random()*x-x/2)
}









function helpMenu(){

if(document.getElementById("help") !== null){
	document.getElementById("help").remove()
	return
}

let help = document.createElement("div")
document.body.appendChild(help)

let Width = window.innerWidth
let Height = window.innerHeight

help.id = "help"
help.style.width = Math.floor(Width/allzoom+2)+"px"
help.style.height = Math.floor(Height)+"px"
help.style.position = "absolute"
help.style.left = 0
help.style.overflowX = "hidden"
document.body.style.overflowX = "hidden"
help.style.top = 0
help.style.zIndex = 100
help.style.color = "rgba(240,240,240)"
help.style.backgroundColor = "rgba(0,0,0,0.7)"
help.innerHTML =
`
<strong>
</br>This is lopkns shooter2 project, S2C for short. (walls and stuff!!)
</br>S2C is an infinite space wall sandbox built using <span style="color:orange">javascript</span>
</br>This game was built from scratch starting in 2022 to test out a custom collision engine!
</br>Press <span style="color:cyan">[h]</span> to toggle this help menu. Please note that this game is <span style="color:yellow">CASE SENSITIVE</span>
</br>
</br>This help menu is still being developed, still feel free to tell me what you think should change.
</br>Lopkns discord tag is <span style="color:yellow">lopkn#0019</span>
</br>Update, Lopkn's discord tag is just <span style="color:yellow">lopkn</span> now
</br>
</br>
</br><span style="color:green">= == === BASIC INFO === == =</span>
</br>
</br>-Content order of help menu:
</br><span style="color:green">-BASIC INFO-</span>
</br><span style="color:green">-KEYBOARD & MOUSE CONTROLS-</span>
</br><span style="color:green">-MOBILE CONTROLS-</span>
</br>
</br>
</br>at the bottom of your screen, you can see your position, weapon, building/wall and materials
</br>
</br>
</br>
</br>
</br>
</br>-Default color schemes:
</br><span style="color:green">green</span> => content page name
</br><span style="color:yellow">yellow</span> => important information
</br><span style="color:cyan">cyan</span> => game controls
</br><span style="color:red">turquoise</span> => false information
</br>
</br>
</br>-If you are on mobile, stuff is buggy. Report if you find shit fucked up
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br><span style="color:green">= == === KEYBOARD & MOUSE CONTROLS === == =</span>
</br>
</br>
</br><span style="color:orange"> basic mouse controls </span>
</br>
</br><span style="color:cyan">left clicking</span> shoot your current mouse weapon
</br>
</br>that's it. that's literally it
</br>
</br>(for now at least, scrollwheel also has zooming effects, but this will be patched later)
</br>
</br>
</br><span style="color:orange"> keyboard controls </span>
</br>
</br><span style="color:cyan">[w] [a] [s] [d]</span> movement
</br>
</br><span style="color:cyan">[q]</span> change weapons (lowers your weapon counter)
</br>
</br><span style="color:cyan">[e]</span> change weapons (increases your weapon counter)
</br>
</br><span style="color:cyan">[z]</span> change buildings (increases your buildings counter)
</br>
</br><span style="color:cyan">[c]</span> change buildings (increases your buildings counter)
</br>
</br><span style="color:cyan">[h] or [?]</span> toggles this current help menu.
</br>
</br><span style="color:cyan">[p]</span> toggles building snap to grid
</br>
</br><span style="color:cyan">[r]</span> Hold down, move mouse, release mouse to build walls (will build only if you have enough materials)
</br>
</br>
</br><span style="color:green">= == === MOBILE CONTROLS === == =</span>
</br>
</br>
</br><span style="color:cyan">left joystick</span> movement
</br>
</br><span style="color:cyan">right joystick</span> aiming and shooting (hold to aim, release to shoot)
</br>
</br><span style="color:cyan">top left scrollwheel</span> drag it left and right to change your weapon
</br>
</br><span style="color:cyan">top right scrollwheel</span> drag it left and right to change your building
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br> holy shit im the best
</br>
</br>
</br>
</strong>
`
}



function updateParticles(arr){
	arr.forEach((e)=>{
		if(e.type == "explosion"){
				map.particles.push(new explosionR(e.x,e.y,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
					16,8,2))
				map.particles.push(new explosionR(e.x,e.y,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
					10,5,1))

		} else if(e.type == "encn explosion"){
			map.particles.push(new explosionR(e.x,e.y,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb(0,"+(Math.random()*rr)+","+(rr)+")")},
					26,7,2))
				map.particles.push(new explosionR(e.x,e.y,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb(0,"+(Math.random()*rr)+","+(rr)+")")},
					10,2,1))
		} else if(e.type == "conc"){
			map.particles.push(new explosionR2(e.x,e.y,"#FFFF00",1000,(x)=>{return(x/40+3)},(x)=>{return(x/4)}))

		} else if(e.type == "bounding"){
			map.particles.push(new explosionR2(e.x,e.y,"#0000A0",3000,(x)=>{return(4)},(x)=>{return((3000-x)/3)}))
		} else if(e.type == "bounding2"){
			map.particles.push(new explosionR2(e.x,e.y,"#0000A0",3000,(x)=>{return(4)},(x)=>{return((3000-x)*3)}))
		} else if(e.type == "bounded"){
			map.particles.push(new explosionR2(e.x,e.y,"#0000A0",3000,(x)=>{return(x/300)},(x)=>{return(e.r)},(x)=>{return("rgba(20,20,125,"+(0.6*x)+")")}))
		} else if(e.type == "dbheal_bounding"){
			map.particles.push(new explosionR2(e.x,e.y,"#A00000",3000,(x)=>{return(4)},(x)=>{return((3000-x)/3)}))
		} else if(e.type == "dbheal_bounded"){
			map.particles.push(new explosionR2(e.x,e.y,"#A00000",3000,(x)=>{return(x/300)},(x)=>{return(e.r)},(x)=>{return("rgba(175,20,20,"+(0.6*x)+")")}))
		}
	})
}

function pchat(e){
	map.players[e.id].chat = e.c
	if(map.players[e.id].chatp !== undefined){
		map.players[e.id].chatp.innerText = e.c
		return
	}
	let nd = document.createElement("div")
	nd.style.pointerEvents =  "none";
  nd.style.backgroundColor= "transparent";
  nd.style.color = "hsla("+map.players[e.id].color+",70%,75%,0.9"
  nd.style.position = "absolute"
  // nd.style.width = "200px"
  // nd.style.height = "200px"
  nd.style.maxWidth = "300px"
  nd.style.overflowY = "visible"
  nd.style.zIndex = "4"
  nd.innerText = e.c
  myCanvas.appendChild(nd)
  map.players[e.id].chatp = nd
}