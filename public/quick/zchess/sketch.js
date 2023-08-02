let myCanvas = document.getElementById("myCanvas")

let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"

document.getElementById("help").style.width = Math.floor(Width-20)+"px"
document.getElementById("help").style.height = Math.floor(Height)+"px"
document.getElementById("help").style.position = "absolute"
document.getElementById("help").style.left = 0
document.getElementById("help").style.top = 0
document.getElementById("help").innerHTML = `help menu unfinished`

let CTX = {"main":myCanvas.getContext("2d")}
let ctx = CTX.main

function rect(x,y,w,h){
	ctx.fillRect(x,y,w,h)
}

class camera{
	static x = 0;
	static y = 0;
}

function fill(r,g,b,a){
	a = a?a:1
	ctx.fillStyle = "rgba(" + r+","+g+","+b+","+a+")"
}

let mouseX = 0
let mouseY = 0

let mouseBoardX = 0;
let mouseBoardY = 0;

let tileSize = 50

function mrect(x,y,w,h){
	w = w?w:1
	h = h?h:1
	rect((x-camera.x)*tileSize,(y-camera.y)*tileSize,tileSize*w,tileSize*h)
}


onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY); mouseToBoardUpdate()}
function mouseToBoardUpdate(){
	nx = Math.floor(mouseX/tileSize)
	ny = Math.floor(mouseY/tileSize)
	if(nx != mouseBoardX || ny != mouseBoardY){
		mouseBoardY = ny
		mouseBoardX = nx
		render()
		fill(255,0,0,0.3)
		mrect(nx,ny)
	}
}

function render(){

	fill(0,0,0)
	rect(0,0,Width,Height)

	let arr = Object.keys(board.tiles)
	arr.forEach((e)=>{
		let pos = ipos(e)
		let tile = board.tiles[e]

		if(tile == undefined){return}
		fill(60,60,60)
		mrect(pos.x,pos.y)
	})
}







