const socket = io.connect('/')
let GAMESESSION = "G10.2"
socket.emit("JOINGAME",GAMESESSION)


socket.on("drawers",(e)=>{drawDrawers(e[0]);tick();})
// socket.on("walls",(e)=>{drawWalls(e)})
socket.on("acknowledge G10.2",acknowledge)
socket.on("CROBJECT",(e)=>{crobject(e)})
socket.on("upwalls",upwalls)
socket.on("cameraUp",(e)=>{cameraX = e[0]-410;cameraY = e[1]-410})

function ALTF3(){
	altf3 = (n,e)=>{player.dataNodes.push([n,JSON.stringify(e).length,Date.now()])}
	socket.onAny((n,e)=>{altf3(n,e)})
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
	static dataNodes = []
	static weapon = "norm"
	static wall = "norm"
	static snapping = false
	static gridSize = 80
	static weaponCounter = 1
	static weaponDict = {"1":"norm","2":"scat","3":"lazr","4":"cnon"}
	static wallCounter = 1
	static wallDict = {"1":"norm","2":"bhol","3":"ghol"}
}
class map{
	
	static walls = {}
	static players = []
	static bullets = []
}


function acknowledge(e){
	ID = e
	console.log(e)
}

function upwalls(e){
	let ob = Object.keys(e)
	// console.log(e)
	for(let i = 0; i < ob.length; i++){
		if(e[ob[i]] == "_DEL"){
			delete map.walls[ob[i]]
			continue
		}
		map.walls[ob[i]] = e[ob[i]]
	}
}

function crobject(e){
	// console.log(e[0])
	map.walls = e[0]
	map.players = e[1]
}

function tick(){
	socket.emit("keys",[ID,keyHolds])
	mainCTX.clearRect(0,0,840,840)


	
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
			case "upwalls":
				mainCTX.strokeStyle = "#00FF00"
				break;
			case "drawers":
				mainCTX.strokeStyle = "#FF00FF"
				break;
			case "CROBJECT":
				mainCTX.strokeStyle = "#FFFF00"
				break;
		}
		
		mainCTX.lineWidth = 3
		mainCTX.beginPath()
		mainCTX.moveTo((nodeDate-n[2])/2,n[1]/10)
		mainCTX.lineTo((nodeDate-n[2])/2,0)
		mainCTX.stroke()
		// console.log(lastNode,nodeDate)
	}

	

	let CXR = player.gridSize-(cameraX%player.gridSize)
	let CYR = player.gridSize-(cameraY%player.gridSize)
	mainCTX.strokeStyle = "#404040"
	mainCTX.lineWidth = 2
	mainCTX.beginPath()
	for(let i = -1; i < 10; i++){
		mainCTX.moveTo(i*player.gridSize + CXR,0)
		mainCTX.lineTo(i*player.gridSize + CXR,840)
	}
	for(let i = -1; i < 10; i++){
		mainCTX.moveTo(0,i*player.gridSize + CYR)
		mainCTX.lineTo(840,i*player.gridSize + CYR)
	}
	mainCTX.stroke()


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
		mainCTX.lineWidth = (e[1]+1) * (e[6].tailmult == undefined?1:e[6].tailmult)
		if(e[0] == "norm" || e[0] == "scat" || e[0] == "cnon"){
		mainCTX.strokeStyle = "#FFFF00"} else if(e[0] == "lazr"){
			mainCTX.strokeStyle = "#00FFFF"
		}
		mainCTX.moveTo(e[2]-cameraX,e[3]-cameraY)
		mainCTX.lineTo(e[4]-cameraX,e[5]-cameraY)
		mainCTX.stroke()
	}


	let wallsArr = Object.keys(map.walls)
	for(let j = 0 ; j < wallsArr.length; j++){
		let i = map.walls[wallsArr[j]]
		if(i.type == "norm" || i.type == "player"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 3
		mainCTX.strokeStyle = "rgba(255,255,255,"+(i.hp/2000+0.5)+")"
		mainCTX.moveTo(i.x1-cameraX,i.y1-cameraY)
		mainCTX.lineTo(i.x2-cameraX,i.y2-cameraY)
		mainCTX.stroke()
		} else if(i.type == "bhol" || i.type == "ghol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3
			mainCTX.strokeStyle = i.type == "bhol"?"#FF0000":"#0000FF"
			mainCTX.moveTo(i.x-i.radius-cameraX,i.y-cameraY)
			mainCTX.lineTo(i.x+i.radius-cameraX,i.y-cameraY)
			mainCTX.moveTo(i.x-cameraX,i.y-i.radius-cameraY)
			mainCTX.lineTo(i.x-cameraX,i.y+i.radius-cameraY)
			mainCTX.stroke()
		}
	}
	// mainCTX.fillStyle = "#00FF00"
	// mainCTX.fillRect(mouseX+player.gridSize/2-5,mouseY+player.gridSize/2-5,10,10)
	// mainCTX.fillRect(mouseX+cameraX+player.gridSize/2-(Math.abs((mouseX+cameraX+player.gridSize/2)%player.gridSize))-5-cameraX,
		// mouseY+cameraY+player.gridSize/2-(Math.abs((mouseY+cameraY+player.gridSize/2)%player.gridSize))-5-cameraY,10,10)
}


let mainCTX = document.getElementById("myCanvas").getContext("2d")

	// mainCTX.clearRect(0,0,840,840)

function drawDrawers(e){
	// mainCTX.clearRect(0,0,840,840)
	e.forEach((i)=>{
		map.bullets.push(i)
	})
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

onmousemove = (e)=>{mouseX = (e.clientX - 5); mouseY = (e.clientY - 2)}

document.addEventListener("mousedown",(e)=>{
	socket.emit("click",[ID,mouseX,mouseY,player.weapon])
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
  		placing = [true,mouseX+cameraX,mouseY+cameraY]
  		break;
    case "q":
  		player.weaponCounter -= 1
  		player.weapon = player.weaponDict[player.weaponCounter]
  		break;
  	case "e":
  		player.weaponCounter += 1
  		player.weapon = player.weaponDict[player.weaponCounter]
  		break;
  	case "z":
  		player.wallCounter -= 1
  		player.wall = player.wallDict[player.wallCounter]
  		break;
  	case "c":
  		player.wallCounter += 1
  		player.wall = player.wallDict[player.wallCounter]
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
  		let mx = mouseX+cameraX+player.gridSize/2
  		let my = mouseY+cameraY+player.gridSize/2
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
  		socket.emit("placeWall",[placing[1]-(placing[1]%player.gridSize),placing[2]-(placing[2]%player.gridSize),mx-(mx%player.gridSize),my-(my%player.gridSize)])
  	} else {
  	socket.emit("placeWall",[placing[1],placing[2],mouseX+cameraX,mouseY+cameraY,player.wall])}
  	placing = [false]
  }


})