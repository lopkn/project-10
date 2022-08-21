const socket = io.connect('/')
let GAMESESSION = "G10.2"
socket.emit("JOINGAME",GAMESESSION)


socket.on("drawers",(e)=>{drawDrawers(e[0]);tick();})
// socket.on("walls",(e)=>{drawWalls(e)})
socket.on("acknowledge G10.2",acknowledge)
socket.on("CROBJECT",(e)=>{crobject(e)})
socket.on("upwalls",upwalls)
var ID


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
	for(let i = 0; i < ob.length; i++){
		map.walls[ob[i]] = e[ob[i]]
	}
}

function crobject(e){
	// console.log(e[0])
	map.walls = e[0]
	map.players = e[1]
}

function tick(){
	mainCTX.clearRect(0,0,840,840)
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
		mainCTX.moveTo(e[2],e[3])
		mainCTX.lineTo(e[4],e[5])
		mainCTX.stroke()
	}
	let wallsArr = Object.keys(map.walls)
	for(let j = 0 ; j < wallsArr.length; j++){
		let i = map.walls[wallsArr[j]]
		mainCTX.beginPath()
		mainCTX.lineWidth = 3
		mainCTX.strokeStyle = "#FFFFFF"
		mainCTX.moveTo(i.x1,i.y1)
		mainCTX.lineTo(i.x2,i.y2)
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
	socket.emit("click",[ID,mouseX,mouseY])
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
  	placing = [true,mouseX,mouseY]
  }


})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key
  keyHolds[key] = "b"
  if(key == "e"){
  	socket.emit("placeWall",[placing[1],placing[2],mouseX,mouseY])
  	placing = [false]
  }


})