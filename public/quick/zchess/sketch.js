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
	static team = "p1";
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
	rect((x+camera.x)*tileSize,(y+camera.y)*tileSize,tileSize*w,tileSize*h)
}

let keyDowns = {}

document.addEventListener("keydown",(e)=>{
	let k = e.key
	if(keyDowns[k] != undefined){return}
	if(k == "w"){
	keyDowns[k] = setInterval(()=>{camera.y += 0.7},60)
	}
	if(k == "s"){
	keyDowns[k] = setInterval(()=>{camera.y -= 0.7},60)
	}
	if(k == "a"){
	keyDowns[k] = setInterval(()=>{camera.x += 0.7},60)
	}
	if(k == "d"){
	keyDowns[k] = setInterval(()=>{camera.x -= 0.7},60)
	}
})
document.addEventListener("keyup",(e)=>{
	let k = e.key
	clearInterval(keyDowns[k])
	keyDowns[k] = undefined
})
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY); mouseToBoardUpdate()}
function mouseToBoardUpdate(){
	nx = Math.floor(mouseX/tileSize-camera.x)
	ny = Math.floor(mouseY/tileSize-camera.y)
	if(nx != mouseBoardX || ny != mouseBoardY){
		mouseBoardY = ny
		mouseBoardX = nx
		render()
		
	}
}

let mouseDownPlace = [0,0]
let pieceSelected = "none"
document.addEventListener("mousedown",(e)=>{
    mouseDownPlace = [mouseBoardX,mouseBoardY]
	mouseToBoardUpdate()

})

document.addEventListener("mouseup",(e)=>{
	mouseToBoardUpdate()

	if(mouseDownPlace[0] == mouseBoardX && mouseDownPlace[1] == mouseBoardY){
		let t = board.tiles[mouseBoardX+","+mouseBoardY]
		if(t != undefined && t.piece != undefined && t.piece.team == camera.team){
			t.piece.temporaryLegals = t.piece.legals()
			pieceSelected = t.piece
			return;	
		}
	}
	pieceSelected = "none"
	attemptMove(mouseDownPlace[0],mouseDownPlace[1],mouseBoardX,mouseBoardY,camera.team)
})

ctx.font = "bold 40px Courier New"
function drawPiece(l,x,y,team,cd){
	if(team == camera.team){
	fill(255,255,255)} else {
		fill(0,100,0)
	}
	ctx.fillText(l,(x+camera.x)*tileSize+12.5,(y+camera.y)*tileSize+37.5)
	if(cd != 0){
		if(team == camera.team){
			fill(0,0,150,0.3)} else {
			fill(150,0,0,0.3)
		}
		mrect(x,y,1,cd)
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
		if((pos.x+pos.y)%2 == 1){
		fill(60,60,60)} else {
			fill(70,70,70)
		}
		mrect(pos.x,pos.y)
		
	})
	if(pieceSelected != "none"){
		if(pieceSelected.cooldown == 0){
		fill(40,155,40,0.2)}
		else{fill(120,120,40,0.2)}
		pieceSelected.temporaryLegals.forEach((e)=>{
			let ip = ipos(e)
			mrect(ip.x,ip.y)
		})
	}

	arr.forEach((e)=>{
		let pos = ipos(e)
		let tile = board.tiles[e]
		if(tile.piece != undefined){
			tile.piece.CDcheck()
			drawPiece(tile.piece.renderLetter,pos.x,pos.y,tile.piece.team,tile.piece.cooldown/tile.piece.maxCD)
		}
	})

	ctx.lineWidth = 2
	ctx.strokeStyle = "rgba(255,255,255,0.3)"
	ctx.beginPath()
	for(let i = (camera.x%1)*tileSize; i < Width; i+=tileSize){
		ctx.moveTo(i,0)
		ctx.lineTo(i,Height)
	}
	for(let i = (camera.y%1)*tileSize; i < Height; i+=tileSize){
		ctx.moveTo(0,i)
		ctx.lineTo(Width,i)
	}
	ctx.stroke()




	fill(255,0,0,0.3)
	mrect(mouseBoardX,mouseBoardY)
}
board.emptyNew()
setInterval(()=>{render()},60)

	board.tiles[3+",0"].piece = new piece("pawn",3,0,"zombies",{"direction":"y+"})
	board.tiles[5+",0"].piece = new piece("pawn",5,0,"zombies",{"direction":"y+"})
	board.tiles[6+",0"].piece = new piece("pawn",6,0,"zombies",{"direction":"y+"})

setInterval(()=>{
	let x = Math.floor(Math.random()*8)
	if(board.tiles[x+",0"].piece != undefined){
		return;
	}
	let name = "pawn"
	if(Math.random()>0.7){name = "king"}
	if(Math.random()>0.85){name = "knight"}
	if(Math.random()>0.95){name = "bishop"}
	if(Math.random()>0.98){name = "rook"}
	board.tiles[x+",0"].piece = new piece(name,x,0,"zombies",{"direction":"y+"})
},10000)


