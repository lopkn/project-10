const socket = io.connect('/')
let GAMESESSION = "G10.2"
socket.emit("JOINGAME",GAMESESSION)


socket.on("drawers",(e)=>{drawDrawers(e[0]);tick();})
// socket.on("walls",(e)=>{drawWalls(e)})
socket.on("acknowledge G10.2",acknowledge)
socket.on("CROBJECT",(e)=>{crobject(e)})
socket.on("upwalls",upwalls)
socket.on("cameraUp",(e)=>{cameraX = e[0]-410;cameraY = e[1]-410})
var ID = ""
var cameraX = 0
var cameraY = 0
class player{
	static weapon = "norm"
	static snapping = false
	static gridSize = 80
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
		mainCTX.lineWidth = (e[1]+1)
		mainCTX.strokeStyle = "#FFFF00"
		mainCTX.moveTo(e[2]-cameraX,e[3]-cameraY)
		mainCTX.lineTo(e[4]-cameraX,e[5]-cameraY)
		mainCTX.stroke()
	}
	let wallsArr = Object.keys(map.walls)
	for(let j = 0 ; j < wallsArr.length; j++){
		let i = map.walls[wallsArr[j]]
		mainCTX.beginPath()
		mainCTX.lineWidth = 3
		mainCTX.strokeStyle = "rgba(255,255,255,"+(i.hp/2000+0.5)+")"
		mainCTX.moveTo(i.x1-cameraX,i.y1-cameraY)
		mainCTX.lineTo(i.x2-cameraX,i.y2-cameraY)
		mainCTX.stroke()
	}
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

  if(key == "e"){
  	placing = [true,mouseX+cameraX,mouseY+cameraY]
  }


})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key
  delete keyHolds[key]
  if(key == "e"){
  	if(player.snapping){
  		socket.emit("placeWall",[placing[1]-(placing[1]%player.gridSize),placing[2]-(placing[2]%player.gridSize),mouseX+cameraX-((mouseX+cameraX)%player.gridSize),mouseY+cameraY-((mouseY+cameraY)%player.gridSize)])
  	} else {
  	socket.emit("placeWall",[placing[1],placing[2],mouseX+cameraX,mouseY+cameraY])}
  	placing = [false]
  }


})