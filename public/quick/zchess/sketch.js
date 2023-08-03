let myCanvas = document.getElementById("myCanvas")

let Height = window.innerHeight /*>window.innerHeight?window.innerHeight:window.innerWidth*/
let Width = window.innerWidth /*>window.innerHeight?window.innerWidth:window.innerHeight*/
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
	static gamemode = "none"
	static team = "p1";
	static pieceFrequency = 1000;
	static x = 1.2;
	static y = 1.2;
	static particles = [];
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
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY-2); mouseToBoardUpdate();
	if(mouseDown){
		let pos = spos(mouseDownPlace[0],mouseDownPlace[1])
		if(board.tiles[pos] == undefined || board.tiles[pos].piece == undefined){
			camera.x += (mouseX-mouseDeltaMovement[0])/tileSize
			camera.y += (mouseY-mouseDeltaMovement[1])/tileSize
    		mouseDeltaMovement = [mouseX,mouseY]
		}
	}
}
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
let mouseDeltaMovement = [0,0]
let pieceSelected = "none"
let mouseDown = false
document.addEventListener("mousedown",(e)=>{
	mouseX = (e.clientX); mouseY = (e.clientY-2);
	mouseToBoardUpdate()
	console.log(e.clientX,e.clientY)
    mouseDownPlace = [mouseBoardX,mouseBoardY,mouseX,mouseY]
    mouseDeltaMovement = [mouseX,mouseY]
	mouseToBoardUpdate()
    mouseDown = true

})

let gameStart = "mode"

function specialRender(){
	

	ctx.fillStyle = "#488000"
	mrect(0,0)
	// ctx.fillStyle = "#500299"
	// mrect(0,2)
	// mrect(0,4)
	fill(255,255,255)
	drawText("Choose game mode:",0,-1)
	drawText("Normal",1,0)
	drawText("King's Raid",1,2)
	drawText("Knight's Raid",1,4)

	fill(155,0,255,Math.random())
	ctx.beginPath()
	let coord1 = board_to_screen(0.1,0.85)
	let coord2 = board_to_screen(0.9,0.85)
	let coord3 = board_to_screen(0.5,0)
	ctx.moveTo(coord1[0],coord1[1]+2*tileSize)
	ctx.lineTo(coord2[0],coord2[1]+2*tileSize)
	ctx.lineTo(coord3[0],coord3[1]+2*tileSize)
	ctx.fill()
	ctx.closePath()
	ctx.beginPath()
	ctx.moveTo(coord1[0],coord1[1]+4*tileSize)
	ctx.lineTo(coord2[0],coord2[1]+4*tileSize)
	ctx.lineTo(coord3[0],coord3[1]+4*tileSize)
	ctx.fill()
	ctx.closePath()

	ctx.fillStyle = "#999900"
	drawText("K",0,2)
	drawText("N",0,4)

	


}

document.addEventListener("mouseup",(e)=>{
    mouseDown = false
	mouseToBoardUpdate()

	if(mouseDownPlace[0] == mouseBoardX && mouseDownPlace[1] == mouseBoardY){
		if(gameStart != "started"){
			if(gameStart == "mode"){
				if(mouseBoardX == 0){
					if(mouseBoardY == 0){
						camera.gamemode = "Normal"
						gameStart = "started"
						startGame()

					} else if(mouseBoardY == 2){
						camera.gamemode = "King's Raid"
						gameStart = "started"
						startGame()

					} else if(mouseBoardY == 4){
						camera.gamemode = "Knight's Raid"
						gameStart = "started"
						startGame()
					}
				}
			}

			return;
		}
		let t = board.tiles[mouseBoardX+","+mouseBoardY]
		if(t != undefined && t.piece != undefined && t.piece.team == camera.team){
			t.piece.temporaryLegals = t.piece.legals().arr
			pieceSelected = t.piece
			return;	
		}
	}
	pieceSelected = "none"
	attemptMove(mouseDownPlace[0],mouseDownPlace[1],mouseBoardX,mouseBoardY,camera.team)
})

ctx.font = "bold 40px Courier New"

function drawText(l,x,y){
	ctx.fillText(l,(x+camera.x+0.26)*tileSize,(y+camera.y)*tileSize+37.5)
}

function drawPiece(l,x,y,team,cd){
	if(team == camera.team){
	fill(255,255,255)} else {
		fill(0,100,0)
	}
	ctx.fillText(l,(x+camera.x+0.26)*tileSize,(y+camera.y)*tileSize+37.5)
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


	let tn = Date.now()
	for(let i = camera.particles.length-1; i > -1; i--){
		let p = camera.particles[i]
		p.update(tn)
		if(p.draw()=="del"){
			camera.particles.splice(i,1)
		}
	} 
	//particles.push(new explosionR(300,300,"#FFFF00"))


	fill(255,0,0,0.3)
	mrect(mouseBoardX,mouseBoardY)

	if(mouseDown){
		ctx.lineWidth = 5;
		ctx.strokeStyle = "rgba(255,150,40,0.6)"
		ctx.beginPath()
		ctx.moveTo(mouseDownPlace[2],mouseDownPlace[3])
		ctx.lineTo(mouseX,mouseY)
		ctx.stroke()
	}
	specialRender();
}

setInterval(()=>{render()},30)



function startGame(){
specialRender = ()=>{}
board.emptyNew()


if(camera.gamemode == "Knight's Raid"){
			board.tiles[4+","+11].piece = new piece("knight",4,11,"p1")
			board.tiles["4,11"].piece.maxCD = 0.2
} else if(camera.gamemode == "King's Raid"){
			board.tiles[4+","+11].piece = new piece("king",4,11,"p1")
			board.tiles["4,11"].piece.maxCD = 0.2
} else if(camera.gamemode == "Normal"){
	for(let i = 0; i < 8; i++){
		board.tiles[i+","+10].piece = new piece("pawn",i,10,"p1",{"direction":"y-"})
		board.tiles[0+","+11].piece = new piece("rook",0,11,"p1",)
		board.tiles[1+","+11].piece = new piece("knight",1,11,"p1")
		board.tiles[2+","+11].piece = new piece("bishop",2,11,"p1",)
		board.tiles[3+","+11].piece = new piece("queen",3,11,"p1")
		board.tiles[4+","+11].piece = new piece("king",4,11,"p1")
		board.tiles[5+","+11].piece = new piece("bishop",5,11,"p1")
		board.tiles[6+","+11].piece = new piece("knight",6,11,"p1")
		board.tiles[7+","+11].piece = new piece("rook",7,11,"p1")
	}
	board.AIwait = ()=>{ruturn(Math.random()*4000)}
	board.AIblowkWait = ()=>{ruturn(Math.random()*4000+3000)}
	camera.pieceFrequency = 10000
}
board.spawnRates = ["pawn",0.7,"king",0.85,"knight",0.95,"bishop",0.98,"rook"]

	board.tiles[3+",0"].piece = new piece("pawn",3,0,"zombies",{"direction":"y+"})
	board.tiles[5+",0"].piece = new piece("pawn",5,0,"zombies",{"direction":"y+"})
	board.tiles[6+",0"].piece = new piece("pawn",6,0,"zombies",{"direction":"y+"})

let gameInterval = setInterval(()=>{
	let x = Math.floor(Math.random()*8)
	let y = board.topTile;
	while(board.tiles[x+","+y] == undefined || board.tiles[x+","+y].piece != undefined){
		y+=1
	}
	if(y > 2){return;}

	let name = board.spawnRates[0]
	let rng = Math.random()
	for(let i = 0; i < board.spawnRates.length/2;i++){
		if(rng < board.spawnRates[i*2+1]){name = board.spawnRates[i*2];break;}
	}
	// if(Math.random()>0.7){name = "king"}
	// if(Math.random()>0.85){name = "knight"}
	// if(Math.random()>0.95){name = "bishop"}
	// if(Math.random()>0.98){name = "rook"}
	board.tiles[x+","+y].piece = new piece(name,x,y,"zombies",{"direction":"y+"})

	if(Math.random()>0.5){
		let y = -1
		while(Math.random()>0.4){
			y-=1
		}
		let x = Math.floor(Math.random()*8)
		if(board.tiles[x+","+y] == undefined){board.tiles[x+","+y] = {}; if(y < board.topTile){board.topTile=y}}
	}

},camera.pieceFrequency)

}


//touch handler

function touchHandler(event)
{

	console.log(event.type)
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        case "touchcancel":   type = "mouseup";   break;
        default:           return;
    }


    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);




    if(type !== "mouseup"){
    mouseX = event.touches[0].clientX
    mouseY = event.touches[0].clientY}


    var simulatedEvent = document.createEvent("MouseEvent");

    if(event.type == "touchend"){
       	console.log("t4")
       }

    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    if(event.type == "touchend"){
       	console.log("t5")
       }

    // if(type=="mouseup"){
    // console.log("hi")} else {
    // 	console.log(event.type)
    // }
    document.body.dispatchEvent(simulatedEvent);
    
    event.preventDefault();
}


function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
    // document.addEventListener('touchmove', function() { e.preventDefault();GI.debuggingInfo = "cancled" }, { passive:false });
}
init()
//touch handler
















