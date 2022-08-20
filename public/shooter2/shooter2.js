const socket = io.connect('/')
let GAMESESSION = "G10.2"
socket.emit("JOINGAME",GAMESESSION)


socket.on("drawers",(e)=>{drawDrawers(e[0]);drawWalls(e[1])})
// socket.on("walls",(e)=>{drawWalls(e)})
socket.on("acknowledge G10.2",acknowledge)
var ID
function acknowledge(e){
	ID = e
	console.log(e)
}

let mainCTX = document.getElementById("myCanvas").getContext("2d")

	mainCTX.clearRect(0,0,840,840)

function drawDrawers(e){
	mainCTX.clearRect(0,0,840,840)
	e.forEach((i)=>{
		mainCTX.beginPath()
		mainCTX.lineWidth = (i[0]+1)
		mainCTX.strokeStyle = "#FFFF00"
		mainCTX.moveTo(i[1],i[2])
		mainCTX.lineTo(i[3],i[4])
		mainCTX.stroke()
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
