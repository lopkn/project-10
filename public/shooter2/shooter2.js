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


socket.on("mass",(e)=>{MASS(e)})
socket.on("pong",(e)=>{player.ping = Date.now()-e})


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

weaponInfo = {
	"heal":{"repeating":2},
	"dril":{"repeating":2},
	"lzr2":{"repeating":2},
	"fire":{"repeating":2},
	"zapr":{"repeating":3},
	"mchg":{"repeating":3}

}

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
	static gridSize = 80
	static weaponCounter = 1
	static weaponMin = 1
	static wallMin = 1
	static weaponDict = {"1":"norm","2":"scat","3":"lazr","4":"cnon","5":"heal","6":"grnd","7":"msl","8":"dril",
											"9":"msl2","10":"snpr","11":"lzr2","12":"mchg","13":"zapr","14":"dbgd","15":"kbml",
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
			delete map.walls[ob[i]]

			continue
		}
		if(obj["hpUpdate"]){
			map.walls[ob[i]].hp = obj.hp
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
									"dril":3,"lzr2":3,"zapr":3,"zapr2":13,"dbgd":20,"kbml":20,"vipr":20,"tlpt":20}


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

	

	let CXR = player.gridSize-(cameraX%player.gridSize)
	let CYR = player.gridSize-(cameraY%player.gridSize)


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
		mainCTX.lineWidth = (e[1]+1) * (e[6].tailmult == undefined?1:e[6].tailmult) * player.zoom
		if(e[0] == "norm" || e[0] == "scat" || e[0] == "cnon"){
		mainCTX.strokeStyle = "#FFFF00"} else if(e[0] == "lazr" || e[0] == "lzr2" || e[0] == "zapr"){
			mainCTX.strokeStyle = "#00FFFF"
		} else if(e[0] == "heal"){
			mainCTX.strokeStyle = "#FF0000"
		} else if(e[0] == "grnd" || e[0] == "dbgd" || e[0] == "vipr"){
			mainCTX.strokeStyle = "#007000"
		} else if(e[0] === "msl" || e[0] == "msl2" || e[0] == "kbml"){
			mainCTX.strokeStyle = "#A00000"
		} else if(e[0] === "trak" || e[0] === "dril"){
			mainCTX.strokeStyle = "#A0A000"
		} else if(e[0] === "tlpt"){
			mainCTX.strokeStyle = "rgb(0,"+Math.floor(Math.random()*255)+",255)"
		} else if(e[0] === "zapr2"){

			mainCTX.strokeStyle = "rgb("+Math.floor(Math.random()*255)+",255,255)"
		}
		mainCTX.moveTo((e[2]-cameraX)*player.zoom + player.zoomR,(e[3]-cameraY)*player.zoom + player.zoomR)
		mainCTX.lineTo((e[4]-cameraX)*player.zoom + player.zoomR,(e[5]-cameraY)*player.zoom + player.zoomR)
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
		mainCTX.moveTo((i.x1-cameraX)*player.zoom+player.zoomR,(i.y1-cameraY)*player.zoom+player.zoomR)
		mainCTX.lineTo((i.x2-cameraX)*player.zoom+player.zoomR,(i.y2-cameraY)*player.zoom+player.zoomR)
		mainCTX.stroke()
		}else if(i.type == "metl" || i.type == "mbdy"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 9*player.zoom
		mainCTX.strokeStyle = col?col:"rgba(205,205,225,"+(renderHP/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX)*player.zoom+player.zoomR,(i.y1-cameraY)*player.zoom+player.zoomR)
		mainCTX.lineTo((i.x2-cameraX)*player.zoom+player.zoomR,(i.y2-cameraY)*player.zoom+player.zoomR)
		mainCTX.stroke()
		}else if(i.type == "rflc"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 9*player.zoom
		mainCTX.strokeStyle = col?col:"rgba(155,205,"+(205+rwc*50)+","+(renderHP/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX)*player.zoom+player.zoomR,(i.y1-cameraY)*player.zoom+player.zoomR)
		mainCTX.lineTo((i.x2-cameraX)*player.zoom+player.zoomR,(i.y2-cameraY)*player.zoom+player.zoomR)
		mainCTX.stroke()
		}  else if(i.type == "bhol" || i.type == "ghol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3*player.zoom
			mainCTX.strokeStyle = i.type == "bhol"?"#FF0000":"#0000FF"
			mainCTX.moveTo( (i.x-i.radius-cameraX)*player.zoom+player.zoomR,(i.y-cameraY)*player.zoom+player.zoomR)
			mainCTX.lineTo( (i.x+i.radius-cameraX)*player.zoom+player.zoomR,(i.y-cameraY)*player.zoom+player.zoomR)
			mainCTX.moveTo( (i.x-cameraX)*player.zoom+player.zoomR,(i.y-i.radius-cameraY)*player.zoom+player.zoomR)
			mainCTX.lineTo( (i.x-cameraX)*player.zoom+player.zoomR,(i.y+i.radius-cameraY)*player.zoom+player.zoomR)
			mainCTX.stroke()
		}else if(i.type == "whol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3*player.zoom
			mainCTX.strokeStyle = "#707000"
			mainCTX.moveTo( (i.x-i.radius-cameraX)*player.zoom+player.zoomR,(i.y-cameraY)*player.zoom+player.zoomR)
			mainCTX.lineTo( (i.x+i.radius-cameraX)*player.zoom+player.zoomR,(i.y-cameraY)*player.zoom+player.zoomR)
			mainCTX.moveTo( (i.x-cameraX)*player.zoom+player.zoomR,(i.y-i.radius-cameraY)*player.zoom+player.zoomR)
			mainCTX.lineTo( (i.x-cameraX)*player.zoom+player.zoomR,(i.y+i.radius-cameraY)*player.zoom+player.zoomR)
			mainCTX.stroke()
		}
	}


	// map.players[e.id].x
	Object.values(map.players).forEach((e)=>{
		if(e.dead){return}
		let ran = Math.random()*10
			mainCTX.fillStyle = "hsla("+e.color+",70%,75%,"+((10-ran)/5)+")"
			mainCTX.fillRect((e.x-cameraX)*player.zoom+player.zoomR-ran,(e.y-cameraY)*player.zoom+player.zoomR-ran,ran*2,ran*2)
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
	mainCTX.fillText("position: "+Math.floor(cameraX/20)+" "+Math.floor(cameraY/20),20,770)
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

let mainCanvas = document.getElementById("myCanvas")
let mainCTX = mainCanvas.getContext("2d")




var ZOOMSETTINGS = {"windowWidth":window.innerWidth, "windowHeight":window.innerHeight,"expectWidth":1560,"expectHeight":940}

var allzoom = 1


function coordToMap(x,y){
	return([(x-cameraX)*player.zoom + player.zoomR,(y-cameraY)*player.zoom + player.zoomR])
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

mainCanvas.style.left = Math.floor(window.innerWidth/allzoom/2-canvasDimensions[0]/2)+"px"
mid[0] += Math.floor(window.innerWidth/allzoom/2-canvasDimensions[0]/2)
mid[2] = Math.floor(window.innerWidth/allzoom/2-canvasDimensions[0]/2)

	// mainCTX.clearRect(0,0,840,840)

function drawDrawers(e,dynam){


	e.forEach((i)=>{
		let a = i[5]?(i[5].tailLength?i[5].tailLength:bulletAtt[i[0]]):bulletAtt[i[0]]
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
function drawWalls(e){
	// console.log(e)
	e.forEach((i)=>{
		// let i = a[j]
		mainCTX.beginPath()
		mainCTX.lineWidth = 3
		mainCTX.strokeStyle = "#FFFFFF"
		mainCTX.moveTo(i.x1,i.y1)
		mainCTX.lineTo(i.x2,i.y2)
		mainCTX.stroke()
	})
}

var mouseX = 0
var mouseY = 0

onmousemove = (e)=>{mouseX = (e.clientX)/allzoom; mouseY = (e.clientY - 2*allzoom)/allzoom}

document.addEventListener("mousedown",(e)=>{
	socket.emit("click",[ID,mouseX-mid[0],mouseY-mid[1],player.weapon])
	player.clickheld = true
})

document.addEventListener("wheel",(e)=>{
	player.rezoom(player.zoom-e.deltaY/5000)
	if(player.zoom < 0){
		player.rezoom(0.01)
	}
})

document.addEventListener("mouseup",(e)=>{
	player.clickheld = false
})

var placing = [false]
var keyHolds = {}
document.addEventListener("keydown",(e)=>{
  e.preventDefault()
  let key = e.key

  if(keyHolds[key] == "a"){
  	return
  }
  keyHolds[key] = "a"

  switch(key){
  	case "r":
  		placing = [true,(mouseX-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX,mouseY/player.zoom-player.zoomR/player.zoom+cameraY]
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
  		player.weaponMin = -6
  		player.weaponDict["0"] = "dbdril"
  		player.weaponDict["-1"] = "dbml"
  		player.weaponDict["-2"] = "spawner"
  		player.weaponDict["-3"] = "keyheal"
  		player.weaponDict["-4"] = "zapr2"
  		player.weaponDict["-5"] = "scat2"
  		player.weaponDict["-6"] = "unloader"

  		player.wallMin = -2
  		player.wallDict["0"] = "spawnpad"
  		player.wallDict["-1"] = "grv1"
  		player.wallDict["-2"] = "grv2"

  		break;
  	case "F1":
  		window.localStorage.setItem("playerType",prompt("type?"))
  		COOKIE.playerType = window.localStorage.getItem('playerType')
  		break;
  	case "j":
			socket.emit("key","test")
  		break;
  }  
  console.log(key)

})


document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key
  delete keyHolds[key]
  if(key == "r"){
  	if(player.snapping){
  		placing[1] += player.gridSize/2
  		placing[2] += player.gridSize/2
  		let mx = (mouseX-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX+player.gridSize/2
  		let my = mouseY/player.zoom-player.zoomR/player.zoom+cameraY+player.gridSize/2
  		if(placing[1] < 0){
  			placing[1] -= player.gridSize
  		}
  		if(placing[2] < 0){
  			placing[2] -= player.gridSize
  		}
  		if(mx < 0){
  			mx -= player.gridSize
  		}
  		if(my < 0){
  			my -= player.gridSize
  		}
  		//idfk where this 10 came from
  		socket.emit("placeWall",[placing[1]+10-(placing[1]%player.gridSize),placing[2]+10-(placing[2]%player.gridSize),mx+10-(mx%player.gridSize),my+10-(my%player.gridSize),player.wall,{"regen":10}])
  	} else {
  	socket.emit("placeWall",[placing[1],placing[2],(mouseX-mid[2])/player.zoom-player.zoomR/player.zoom+cameraX,mouseY/player.zoom-player.zoomR/player.zoom+cameraY,player.wall])}
  	placing = [false]
  }


})




function updateParticles(arr){
	arr.forEach((e)=>{
		if(e.type == "explosion"){
				map.particles.push(new explosionR(e.x+0.5,e.y+0.5,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
					16,8,2))
				map.particles.push(new explosionR(e.x+0.5,e.y+0.5,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
					10,5,1))

		}
	})
}















function touchHandler(e)
{
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
      	if(e.target == Mobile.canvas){
      		let E = touches[touches.length-1]
      		// if(E.pageX/allzoom < 400){

      		// Mobile.activeTouches[E.identifier].type = "joystick_move"
      		// Mobile.activeTouches[E.identifier].color = "green"
      		// 	} else {
      		// Mobile.activeTouches[E.identifier].type = "joystick_fire"
      		// Mobile.activeTouches[E.identifier].color = "red"
      		// 	}

      		if(distance(Mobile.joystick_move.mx,Mobile.joystick_move.my,E.pageX,E.pageY) < Mobile.joystick_move.r){

      		Mobile.activeTouches[E.identifier].type = "joystick_move"
      		Mobile.activeTouches[E.identifier].color = "green"
      			} else if(distance(Mobile.joystick_fire.mx,Mobile.joystick_fire.my,E.pageX,E.pageY) < Mobile.joystick_fire.r){
      		Mobile.activeTouches[E.identifier].type = "joystick_fire"
      		Mobile.activeTouches[E.identifier].color = "red"
      			}


      	} else if(e.target == myCanvas){
      		Mobile.activeTouches[E.identifier].type = "mainCanvas"
      		Mobile.activeTouches[E.identifier].color = "purple"
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
    		}


    	}

  } else {
    		for(let i = 0; i < touches.length; i++){
    			let E = touches[i]
    			let EUID = Mobile.activeTouches[E.identifier]

    		if(EUID.type == "joystick_move"){Mobile.joystick_move.vect = [0,0]}
    		else if(EUID.type == "joystick_fire"){

					socket.emit("click",[ID,Mobile.joystick_fire.vect[0],Mobile.joystick_fire.vect[1],player.weapon])
					Mobile.joystick_fire.vect = [0,0]
					// console.log(Mobile.joystick_fire[0]+mid[0],Mobile.joystick_fire[1]+mid[1])
    		}
    		delete Mobile.activeTouches[E.identifier]
    	}

  }






    if(e.type == "touchend"){

       }


    
	e.preventDefault()
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
	static activeTouches = {}
	static canvas;
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
		mobileCanvas.style.userSelect = "none"
		mobileCanvas.style.touchAction = "none"
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
		

	}
}

// Mobile.init()
// Mobile.draw()

ALTF3()
player.debugging = true

function ranrange(x){
	return(Math.random()*x-x/2)
}












