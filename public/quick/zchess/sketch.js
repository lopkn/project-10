

let tv = {int:0,deg:0,rmom:[0,0,0,0],cr:0,cg:0,cb:0,gg:Math.random()*125+125}
let buttonInterval = setInterval(()=>{
	// tv.rmom[0] += Math.random() - 0.5
	tv.int += 0.1
	tv.rmom.forEach((e,i)=>{
	tv.rmom[i] += (Math.random() - 0.5)
		if(tv.rmom[i] < -5){tv.rmom[i] = -5}
		if(tv.rmom[i] > 5){tv.rmom[i] = 5}
	})
	
	tv.deg += tv.rmom[0]/5
	tv.cr += tv.rmom[1]
	tv.cg += tv.rmom[2]
	tv.cb += tv.rmom[3]

	tv.cr = Math.abs(250-(tv.cr+250)%500)
	tv.cg = Math.abs(250-(tv.cg+250)%500)
	tv.cb = Math.abs(250-(tv.cb+250)%500)


	let btn = document.getElementById("wow")
	btn.style.background = "linear-gradient("+(tv.deg/2)+"deg, rgba("+tv.cr+","+tv.cg+","+tv.cb+",1) "+(50-tv.int<0?0:50-tv.int)+"%, rgba(0,"+tv.gg+",44,1) 100%)"
},20)

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
ctx.textAlign = "center"
		ctx.textBaseline="middle"

function rect(x,y,w,h){
	ctx.fillRect(x,y,w,h)
}


function initSounds(arr){
	arr.forEach((E)=>{
		let e = "./sounds/"+E+".wav"
		let audio = new Tone.Sampler({
	urls: {
		"C4":e,
	},
}).toDestination();
		camera.sounds[E] = audio
	})
}


let pieceDict = {
	"Q":[[200,46],[177,57],[177,84],[192,94],[173,195],[136,102],[150,76],[123,52],[99,70],[118,109],[113,187],[74,130],[81,94],[52,74],[31,112],[54,132],[74,242],[104,281],[74,337],[150,357],[200,357],[200,357],[250,357],[326,337],[296,281],[326,242],[346,132],[369,112],[348,74],[319,94],[326,130],[287,187],[282,109],[301,70],[277,52],[250,76],[264,102],[227,195],[208,94],[223,84],[223,57],[200,46]],
	"K":[[190,49],[189,64],[169,63],[169,81],[188,85],[190,104],[168,120],[160,150],[123,126],[65,147],[42,202],[65,243],[106,273],[105,336],[158,357],[200,361],[200,361],[242,357],[295,336],[294,273],[335,243],[358,202],[335,147],[277,126],[240,150],[232,120],[210,104],[212,85],[231,81],[231,63],[211,64],[210,49],[200,49]],
	"R":[[200,75],[172,76],[171,96],[140,96],[129,77],[93,77],[91,131],[115,157],[118,269],[98,283],[96,313],[73,316],[71,358],[200,357],[200,357],[329,358],[327,316],[304,313],[302,283],[282,269],[285,157],[309,131],[307,77],[271,77],[260,96],[229,96],[228,76],[200,75]] ,
	// "B":[[200,47],[167,73],[184,100],[123,151],[118,207],[143,238],[123,272],[127,296],[157,307],[82,315],[49,332],[51,358],[92,350],[179,355],[200,346],[200,346],[221,355],[308,350],[349,358],[351,332],[318,315],[243,307],[273,296],[277,272],[257,238],[282,207],[277,151],[216,100],[233,73],[200,47]],
	"B":
[[200,25],[113,193],[149,237],[122,285],[156,306],[82,313],[46,342],[62,359],[185,361],[200,345],[200,345],[215,361],[338,359],[354,342],[318,313],[244,306],[278,285],[251,237],[287,193],[200,25]] ,
	"P":[[200,73],[163,87],[157,123],[172,137],[141,159],[136,203],[157,230],[116,257],[92,347],[200,351],[200,351],[308,347],[284,257],[243,230],[264,203],[259,159],[228,137],[243,123],[237,87],[200,73]],
	"N":[[155,89],[122,63],[116,102],[69,174],[47,232],[63,271],[87,275],[96,256],[103,262],[102,285],[142,244],[153,247],[206,184],[186,256],[142,299],[127,356],[344,354],[326,177],[261,102],[203,84],[188,51],[167,87]],
	"W":[[336,27],[135,124],[78,292],[19,332],[384,320],[311,279],[243,156],[335,29]] 
}

class camera{
	static gamemode = "none"
	static team = "p1";
	static pieceRender = "text";
	static increaseMargin = 1;
	static menuButtonSize = 40;
	static pieceFrequency = 1300;
	static escaped = false
	static escapePos = [0,0]
	static specialRenderOn = true;
	static x = 1.2;
	static y = 1.2;
	static particles = [];
	static sounds = {}
	static soundArr = []
	static tileRsize = 1
	static soundOn = true;
	// static playSound(url){
	// 	let click = this.sounds[url].cloneNode()
	// 	click.play()
	// }
	static playSound(file,note){
		if(this.soundOn === false){return}
		note = note?note:"C4"
		this.sounds[file].triggerAttack(note)
	}
	static playSoundF(no){
		if(this.soundOn === false){return}
		sampler1.triggerAttack([soundMapper[no]])
	}
	static playSoundURL(url){
		if(this.soundOn === false){return}
		let audio = new Tone.Player(url).toDestination()
		audio.onStop = ()=>{audio.dispose()}
		audio.autostart = true;
	}
	static captureStreak = 0;
}
let initSoundsArr = ["shot","escape","select","move","captureF","capture","captureS1","captureS2","captureS3","captureS4","captureS5","captureS6","captureS7","captureS8"]
initSounds(initSoundsArr)

function fill(r,g,b,a){
	a = a==undefined?1:a
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

	if(k == "Escape"){
		escaped()
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


document.addEventListener("wheel",(e)=>{
	let stb1 = screen_to_board(Width/2,Height/2)
	tileSize -= e.deltaY/40
	if(tileSize < 4){tileSize = 4}
	camera.tileRsize = tileSize/50
	let stb2 = screen_to_board(Width/2,Height/2)
	camera.x += stb2[0] - stb1[0]
	camera.y += stb2[1] - stb1[1]
})


let mouseDownPlace = [0,0]
let mouseDeltaMovement = [0,0]
let pieceSelected = "none"
let pieceDowned = "none"
let pieceClicked = "none"
let mouseDown = false

document.addEventListener("contextmenu",(e)=>{e.preventDefault()})

document.addEventListener("mousedown",(e)=>{
	mouseX = (e.clientX); mouseY = (e.clientY-2);
	mouseToBoardUpdate()
    mouseDownPlace = [mouseBoardX,mouseBoardY,mouseX,mouseY]
    mouseDeltaMovement = [mouseX,mouseY]
	mouseToBoardUpdate()
    mouseDown = true
    let tile = board.tiles[spos(mouseBoardX,mouseBoardY)]
    if(tile != undefined && tile.piece != undefined && tile.piece.team == camera.team){

    	pieceClicked = tile.piece
    	if(tile.piece.cooldown == 0){
    	pieceDowned = tile.piece
    	if(tile.piece.downed !== undefined){
    		tile.piece.downed()
    	}
    	}
    }
})

let gameStart = "mode"
let specialRender;
function specialRenderIn(){
	
	specialRender = ()=>{
	// mrect(0,0)
	// ctx.fillStyle = "#500299"
	// mrect(0,2)
	// mrect(0,4)
	fill(255,255,255)
	ctx.textAlign = "left"
	ctx.font = "bold "+Math.floor(0.8*tileSize)+"px Courier New"

	drawText("Choose game mode:",0,-1)
	drawText("Normal",1,0)
	drawText("King's Raid",1,2)
	drawText("Knight's Raid",1,4)
	drawText("Roaming",1,6)
	drawText("Phantom",1,8)

	let mra = Math.random()

	fill(155,0,255,mra)
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
	// ctx.fillStyle = "#488000"
	let gradient = ctx.createLinearGradient(0, coord3[1], 0, coord2[1]);

	// Add three color stops
	gradient.addColorStop(1, "#488000");
	gradient.addColorStop(0.1, "#20FFA0");
	ctx.fillStyle = gradient
	ctx.beginPath()
	ctx.moveTo(coord1[0],coord1[1])
	ctx.lineTo(coord2[0],coord2[1])
	ctx.lineTo(coord3[0],coord3[1])
	ctx.fill()
	ctx.closePath()

	ctx.fillStyle = "#F9F900"
	drawText("K",0,2)
	drawText("N",0,4)
	drawText("&",0,6)


}
}

specialRenderIn()

function menuRender(){

	let rnd = Math.random()
	camera.x -= Math.floor(camera.escapePos[0])
	camera.y -= Math.floor(camera.escapePos[1])
	ctx.font = "bold "+Math.floor(0.8*tileSize)+"px Courier New"
	ctx.textAlign = "left"
	fill(0,0,0,0.8)
	ctx.fillRect(0,0,Width,Height)

	fill(rnd*255,0,0)
	mrect(0,-1.8,1,0.6)
	fill(rnd*255,rnd*255,0)
	mrect(0,-3.8,1,0.6)


	ctx.fillStyle = "#FFFFFF"
	drawText("Quit",1,-2)
	drawText("Send to origin",1,-4)
	drawText("Buttons & Switches:",0,0)
	drawText("Piece render mode ["+camera.pieceRender+"]",2,1)
	drawText("Sounds ["+(camera.soundOn?"on":"off")+"]",2,3)
	drawText("Play random sound",2,5)
	drawText("Increase margin ["+camera.increaseMargin+"]",2,7)
	drawText("Menu button size ["+camera.menuButtonSize+"]",2,9)
	drawText("Tilesize ["+tileSize.toPrecision(3)+"]",2,11)

	if(camera.pieceRender == "image"){
		fill(255,255,255)
	} else {
		fill(255,255,255)
	}
	((camera.pieceRender=="image")?(()=>{fill(255,255,0)}):(()=>{fill(255,255,255)}))();
	mrect(0.2,1.2,0.6,0.6);

	((camera.soundOn)?(()=>{fill(0,255,0)}):(()=>{fill(255,0,0)}))();
	mrect(0.2,3.2,0.6,0.6);//sound
	mrect(0.2,5.2,0.6,0.6);//random sound

	fill(255,0,0)
	mrect(0.2,7.2,0.8,0.6)
	mrect(0.2,9.2,0.8,0.6)
	mrect(0.2,11.2,0.8,0.6)
	fill(0,255,0)
	mrect(1,7.2,0.8,0.6)
	mrect(1,9.2,0.8,0.6)
	mrect(1,11.2,0.8,0.6)

	camera.x += Math.floor(camera.escapePos[0])
	camera.y += Math.floor(camera.escapePos[1])
}

document.addEventListener("mouseup",(e)=>{
    mouseDown = false
	mouseToBoardUpdate()

	if(pieceDowned !== "none"){
		
		let ph = pieceDowned.held
		if(ph){
			pieceDowned.unhold(mouseBoardX,mouseBoardY)
		}

		if(ph){
			pieceDowned = "none"
			return;
		}    	
    	pieceDowned = "none"
	}


	if(mouseX < camera.menuButtonSize && mouseY < camera.menuButtonSize){
		escaped()
		return;
	}

	if(mouseDownPlace[0] == mouseBoardX && mouseDownPlace[1] == mouseBoardY){
		let mbx = mouseBoardX;
		let mby = mouseBoardY;
		pieceClicked = "none"
		if(camera.escaped){
			let X = mbx+Math.floor(camera.escapePos[0]);
			let Y = mby+Math.floor(camera.escapePos[1]);
			
			if(X === 0){
				if(Y === 1){
					if(camera.pieceRender == "image"){
						camera.pieceRender = "text"
					} else {
						camera.pieceRender = "image"
					}
					camera.playSound("select")
				} else if(Y === 3){
					camera.soundOn = !camera.soundOn
					camera.playSound("select")
				} else if(Y === 5){
					camera.playSound(initSoundsArr[Math.floor(Math.random()*initSoundsArr.length)])
				} else if(Y === 7){
					camera.increaseMargin -= 1
				} else if(Y === 9){
					camera.menuButtonSize -= camera.increaseMargin
				} else if(Y === 11){
					tileSize -= camera.increaseMargin
					if(tileSize < 2){
						tileSize = 2
					}
					camera.tileRsize = tileSize/50
				} else if(Y === -2){
					if(gameStart != "started"){
						window.open('','_self').close()
						clearInterval(renderInterval)
						drawText("Please kill manually",-camera.x,-camera.y)
						drawText("Static game started",-camera.x,-camera.y+1)
					} else {
						stopGame()
						escaped()
					}
				} else if(Y === -4){
					camera.x = 0;
					camera.y = 0;
					camera.playSound("select")
				}
			} else if(X === 1){
				if(Y === 7){
					camera.increaseMargin += 1
				} else if(Y === 9){
					camera.menuButtonSize += camera.increaseMargin
				} else if(Y === 11){
					tileSize += camera.increaseMargin
					if(tileSize < 2){
						tileSize = 2
					}
					camera.tileRsize = tileSize/50
				}
			}

			return;
		}
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
					} else if(mouseBoardY == 6){
						camera.gamemode = "Roaming"
						gameStart = "started"
						startGame()
					} else if(mouseBoardY == 8){
						camera.gamemode = "Phantom"
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
			pieceSelected.premoves = []
			return;	
		}
	}
	let move = attemptMove(mouseDownPlace[0],mouseDownPlace[1],mouseBoardX,mouseBoardY,camera.team)
	if(move !== false){
		friendlyMoved(move)
	} else if(pieceClicked.cooldown != 0 && pieceClicked != "none"){
		pieceClicked.premoves.push([mouseBoardX,mouseBoardY])
	}
	pieceSelected = "none"
	pieceClicked = "none"
	console.log(pieceClicked)
})

ctx.font = "bold "+Math.floor(0.8*tileSize)+"px Courier New"

function drawText(l,x,y){
	ctx.fillText(l,(x+camera.x+0.26)*tileSize,(y+camera.y+0.56)*tileSize)
}
function friendlyMoved(move){
	if(move == false){return}
	console.log(move)
		if(move == "empty"){
			camera.captureStreak = 0;
			// camera.playSound("./sounds/move.wav")
			camera.playSoundF(1)
		} else if(move == "capture" && camera.captureStreak < 4){
			camera.captureStreak += 1;
			camera.playSoundF(2)
			// camera.playSound("./sounds/capture.wav")
		} else {
			camera.captureStreak += 1;
			let a = camera.captureStreak>8?9+Math.floor((camera.captureStreak-9)/2):camera.captureStreak
			a = a>13?13:a
			// camera.playSound("./sounds/captureS"+(a-4)+".wav")
			camera.playSoundF(a-1)
		}
}

function drawPiece(l,x,y,team,cd,pc){

	if(cd != 0){
		if(team == camera.team){
			fill(0,0,150,0.3)} else {
			fill(150,0,0,0.3)
			// if(cd < 0.2){
			// 	fill(150,150,0,0.3)
			// }
		}
		mrect(x,y,1,cd>1?1:cd)
	}
	if(pc.color !== undefined){
		ctx.fillStyle = pc.color
	}else if(team == camera.team){
		fill(255,255,255)
		if(cd != 0){
			fill(250,180,180)
		}
	} else {
		fill(0,100,0)
	}
	if(camera.pieceRender === "image" && pieceDict[l] != undefined){
		let arr = pieceDict[l]  
		pieceImage(x,y,arr)
	} else {
		ctx.fillText(l,(x+camera.x+0.5)*tileSize,(y+camera.y+0.56)*tileSize)
	}

	if(team == camera.team && pc.premoves.length > 0){

		ctx.lineWidth = 2;
		let lastpos = [pc.x+0.5,pc.y+0.5]
		for(let i = 0; i < pc.premoves.length; i++){
			ctx.strokeStyle = "rgb("+(255-i*40)+",0,0)"
			ctx.beginPath()
			let bts1 = board_to_screen(lastpos[0],lastpos[1])
			let bts2 = board_to_screen(pc.premoves[i][0]+0.5,pc.premoves[i][1]+0.5)
			lastpos = [pc.premoves[i][0]+0.5,pc.premoves[i][1]+0.5]
			ctx.moveTo(bts1[0],bts1[1])
			ctx.lineTo(bts2[0],bts2[1])
			ctx.stroke()
		}
	}
	
}

function pieceImage(x,y,arr){
	ctx.beginPath()
	ctx.moveTo(arr[0][0]/(400/tileSize)+(x+camera.x)*tileSize,arr[0][1]/(400/tileSize)+(y+camera.y)*tileSize)
	for(let i = 1; i < arr.length; i++){
		ctx.lineTo(arr[i][0]/(400/tileSize)+(x+camera.x)*tileSize,arr[i][1]/(400/tileSize)+(y+camera.y)*tileSize)
	}
	ctx.fill()
	ctx.closePath()
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
		if(tile.color != undefined){
			ctx.fillStyle = tile.color()
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

	ctx.font = "bold "+Math.floor(0.8*tileSize)+"px Courier New"
	arr.forEach((e)=>{
		let pos = ipos(e)
		let tile = board.tiles[e]
		ctx.textAlign = "center"
		if(tile.piece != undefined){
			let tpc = tile.piece
			tpc.CDcheck()
			if(tpc.draw !== undefined){
				let d = tpc.draw(tpc.renderLetter,tpc.x,tpc.y,tpc.team,tpc.cooldown/tpc.maxCD,tpc)
				if(d){
					drawPiece(tpc.renderLetter,tpc.x,tpc.y,tpc.team,tpc.cooldown/tpc.maxCD,tpc)
				}
			} else {
				drawPiece(tpc.renderLetter,tpc.x,tpc.y,tpc.team,tpc.cooldown/tpc.maxCD,tpc)
			}
		}
	})

	ctx.lineWidth = Math.round(tileSize/50)+1
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




	tn = Date.now()

	if(mouseDown){
		ctx.lineWidth = 5;
		ctx.strokeStyle = "rgba(255,150,40,0.6)"
		ctx.beginPath()
		ctx.moveTo(mouseDownPlace[2],mouseDownPlace[3])
		ctx.lineTo(mouseX,mouseY)
		ctx.stroke()
		if(pieceDowned !== "none"){
			if(board.tiles[spos(mouseBoardX,mouseBoardY)]?.piece == pieceDowned || (pieceDowned.held === true && pieceDowned.alive)){
				if(pieceDowned.hold != undefined){
				let progress = pieceDowned.hold(tn)
				}
			} else if(pieceDowned.held !== true || !piece.alive){
				pieceDowned = "none"
			}
		}
	}
	if(camera.specialRenderOn){
		specialRender();
	}
	if(camera.escaped){
		menuRender(0,0)
	}
	fill(255,0,0,0.3)
	mrect(mouseBoardX,mouseBoardY)
	fill(125,0,255,0.3)
	ctx.fillRect(0,0,camera.menuButtonSize,camera.menuButtonSize)
}

// setInterval(()=>{if(document.hasFocus()){render()}},35)
let renderInterval = setInterval(()=>{render()},35)


let gameInterval;
let gameSpecialInterval = ()=>{}

function startGame(){
camera.specialRenderOn = false
board.emptyNew()


if(camera.gamemode == "Roaming"){
		for(let i = 0; i < 32; i++){
			for(let j = 0; j < 32; j++){
				board.tiles[i+","+j] = {};
			}
		}
		board.tiles["16,16"].color = ()=>{return("rgb(0,200,200)")}
		camera.pieceFrequency = 2935209357230
		board.tiles[16+","+16].piece = new piece("knight",16,16,"p1")
			let ap = board.tiles["16,16"].piece
			// board.tiles[16+","+16].piece = new piece("knight",16,16,"p1")
			// let ap = board.tiles["16,16"].piece

			ap.maxCD = 0.2
			ap.onDeath=()=>{
				

				for(let i = 0; i < 26; i++){
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
				}
				for(let i = 0; i < ap.kills*2; i++){
					setTimeout(()=>{
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
					camera.particles[camera.particles.length-1].color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.6+0.4)+")"
					},i*40)
				}
				displayKills(ap.kills,ap.x,ap.y,1,2)
				camera.particles.push(new explosionR(ap.x+0.5,ap.y+0.5,
					(x)=>{
						let a = 250*Math.random()
						return("rgba("+a+","+a+","+(250-a)+","+(2.5*x)+")")},
					2,0.7,1))
				clearInterval(gameInterval)
				gameStart = "lost"

			}
}else if(camera.gamemode == "Knight's Raid"){
			gameSpecialInterval = ()=>{if(board.iterations%18 == 0 && board.iterations > 30){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
				}
			}

			board.tiles[4+","+11].piece = new piece("knight",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			// board.tiles[16+","+16].piece = new piece("knight",16,16,"p1")
			// let ap = board.tiles["16,16"].piece
			ap.maxCD = 0.2
			ap.onDeath=()=>{
				

				for(let i = 0; i < 26; i++){
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
				}
				for(let i = 0; i < ap.kills*2; i++){
					setTimeout(()=>{
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
					camera.particles[camera.particles.length-1].color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.6+0.4)+")"
					},i*40)
				}
				displayKills(ap.kills,ap.x,ap.y,1,2)
				camera.particles.push(new explosionR(ap.x+0.5,ap.y+0.5,
					(x)=>{
						let a = 250*Math.random()
						return("rgba("+a+","+a+","+(250-a)+","+(2.5*x)+")")},
					2,0.7,1))
				clearInterval(gameInterval)
				gameStart = "lost"

			}
} else if(camera.gamemode == "King's Raid"){
			
			gameSpecialInterval = ()=>{if(board.iterations%12 == 0 && board.iterations > 120){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
					console.log(board.spawnRates)
				} if(board.iterations % 20 == 0 && camera.pieceFrequency > 950){
					camera.pieceFrequency -= 50
					startGameInterval(camera.pieceFrequency)
				}
			}


			board.tiles[4+","+11].piece = new piece("king",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			ap.maxCD = 0.2
			ap.onDeath=()=>{
				
				for(let i = 0; i < 26; i++){
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
camera.particles[camera.particles.length-1].color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.6+0.4)+")"

				}
				for(let i = 0; i < ap.kills*2; i++){
					setTimeout(()=>{
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
camera.particles[camera.particles.length-1].color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.6+0.4)+")"
					},i*40)
				}
				displayKills(ap.kills,ap.x,ap.y,1,2)
				camera.particles.push(new explosionR(ap.x+0.5,ap.y+0.5,
					(x)=>{
						let a = 250*Math.random()
						return("rgba("+a+","+a+","+(250-a)+","+(2.5*x)+")")},
					2,0.7,1))
				clearInterval(gameInterval)
				gameStart = "lost"
			}
} else if(camera.gamemode == "Phantom"){
			
			camera.pieceFrequency = 2500
			gameSpecialInterval = ()=>{if(board.iterations%12 == 0 && board.iterations > 40){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
					console.log(board.spawnRates)
				} if(board.iterations % 20 == 0 && camera.pieceFrequency > 950){
					camera.pieceFrequency -= 25
					startGameInterval(camera.pieceFrequency)
				}
			}


			board.tiles[4+","+11].piece = new piece("king",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			ap.maxCD = 0.2
			board.arrFuncs.pieceModifiers.push((e)=>{
				e.draw = (l,x,y,team,cd,pc)=>{

					fill(0,100,0,cd)
					if(camera.pieceRender === "image"&&pieceDict[l] != undefined){
						let arr = pieceDict[l]  
						pieceImage(x,y,arr)
					} else {
						ctx.fillText(l,(x+camera.x+0.5)*tileSize,(y+camera.y+0.56)*tileSize)
					}}
			})
			board.arrFuncs.pieceModifiers.push((e)=>{
				e.arrFuncs.onMove.push((x,y,e,t)=>{
					camera.particles.push(new lineParticle(x+0.5,y+0.5,e.x+0.5,e.y+0.5,10,
						(x)=>{let mr = Math.random()*125+125
							return("rgb(0,"+(mr/2)+",0)")},1))
				})
			})
			board.AIwait = ()=>{return(Math.random()*5000+10)}
			board.AIblockWait = ()=>{return(Math.random()*10000+10)}
			ap.onDeath=()=>{
				
				for(let i = 0; i < 26; i++){
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
camera.particles[camera.particles.length-1].color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.6+0.4)+")"

				}
				for(let i = 0; i < ap.kills*2; i++){
					setTimeout(()=>{
					let dx = Math.random()-0.5
					let dy = Math.random()-0.5
					camera.particles.push(new bloodParticle(ap.x+0.5+0.6*dx,ap.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
					camera.particles[camera.particles.length-1].friction = 0.97
camera.particles[camera.particles.length-1].color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.6+0.4)+")"
					},i*40)
				}
				displayKills(ap.kills,ap.x,ap.y,1,2)
				camera.particles.push(new explosionR(ap.x+0.5,ap.y+0.5,
					(x)=>{
						let a = 250*Math.random()
						return("rgba("+a+","+a+","+(250-a)+","+(2.5*x)+")")},
					2,0.7,1))
				clearInterval(gameInterval)
				gameStart = "lost"
			}
} else if(camera.gamemode == "Normal"){
	for(let i = 0; i < 8; i++){
		board.tiles[i+","+10].piece = new piece("pawn",i,10,"p1",{"direction":"y-"})
	}
	board.tiles[0+","+11].piece = new piece("rook",0,11,"p1",)
		board.tiles[1+","+11].piece = new piece("knight",1,11,"p1")
		board.tiles[2+","+11].piece = new piece("bishop",2,11,"p1",)
		board.tiles[3+","+11].piece = new piece("queen",3,11,"p1")
		board.tiles[4+","+11].piece = new piece("king",4,11,"p1")
		board.tiles[5+","+11].piece = new piece("bishop",5,11,"p1")
		board.tiles[6+","+11].piece = new piece("knight",6,11,"p1")
		board.tiles[7+","+11].piece = new piece("rook",7,11,"p1")
		board.tiles[7+","+9].piece = new piece("wizard",7,9,"p1")
	board.AIwait = ()=>{return(Math.random()*4000)}
	board.AIblockWait = ()=>{return(Math.random()*4000+3000)}
	camera.pieceFrequency = 10000
}
board.spawnRates = ["pawn",0.7,"king",0.85,"knight",0.95,"bishop",0.98,"rook",1]

	board.tiles[3+",0"].piece = new piece("pawn",3,0,"zombies",{"direction":"y+"})
	board.tiles[5+",0"].piece = new piece("pawn",5,0,"zombies",{"direction":"y+"})
	board.tiles[6+",0"].piece = new piece("pawn",6,0,"zombies",{"direction":"y+"})


	board.gameFunction = ()=>{
	board.iterations += 1
	let x = Math.floor(Math.random()*8)
	let y = board.topTile;
	while(board.tiles[x+","+y] == undefined || board.tiles[x+","+y].piece != undefined){
		y+=1
		if(y > 2){return;}
		
	}

	let name = board.spawnRates[0]
	let rng = Math.random()
	for(let i = 0; i < board.spawnRates.length/2;i++){
		if(rng < board.spawnRates[i*2+1]){name = board.spawnRates[i*2];break;}
	}

	board.tiles[x+","+y].piece = new piece(name,x,y,"zombies",{"direction":"y+"})

	board.arrFuncs.pieceModifiers.forEach((e)=>{
		e(board.tiles[x+","+y].piece)
	})

	if(Math.random()>0.5){
		let y = -1
		while(Math.random()>0.4){
			y-=1
		}
		let x = Math.floor(Math.random()*8)
		if(board.tiles[x+","+y] == undefined){board.tiles[x+","+y] = {}; if(y < board.topTile){board.topTile=y}}
	}
	gameSpecialInterval()
	}

	startGameInterval(camera.pieceFrequency)
}

function startGameInterval(f){
	clearInterval(gameInterval);
	gameInterval = setInterval(()=>{board.gameFunction()
	},f)
}

function stopGame(){
	specialRenderIn()
	board.arrFuncs.pieceModifiers = []
	board.AIwait = ()=>{return(10)}
	board.AIblockWait = ()=>{return(300)}
	camera.pieceFrequency = 1300
	clearInterval(gameInterval);
	board.tiles = {}
	board.iterations = 0;
	camera.specialRenderOn = true
	gameStart = "mode"
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
//touch handler


//noise n' stuff

var sampler1 = new Tone.Sampler({
	urls: {
		// "C1100":"./sounds/select.wav",
		"C2":"./sounds/captureF.wav",
		"C4":"./sounds/move.wav",
		"C#4":"./sounds/capture.wav",
		"D4":"./sounds/captureS1.wav",
		"D#4":"./sounds/captureS2.wav",
		"E4":"./sounds/captureS3.wav",
		"E#4":"./sounds/captureS4.wav",
		"F4":"./sounds/captureS5.wav",
		"F#4":"./sounds/captureS6.wav",
		"G4":"./sounds/captureS7.wav",
		"G#4":"./sounds/captureS8.wav"

	},
}).toDestination();
// var sampler1 = new Tone.Sampler({
// 	urls: {
// 		"X20":"./sounds/select.wav",
// 		"11":"./sounds/captureF.wav",
// 		"12":"./sounds/move.wav",
// 		"13":"./sounds/capture.wav",
// 		"14":"./sounds/captureS1.wav",
// 		"15":"./sounds/captureS2.wav",
// 		"16":"./sounds/captureS3.wav",
// 		"17":"./sounds/captureS4.wav",
// 		"18":"./sounds/captureS5.wav",
// 		"19":"./sounds/captureS6.wav",
// 		"20":"./sounds/captureS7.wav",
// 		"21":"./sounds/captureS8.wav"

// 	},
// }).toDestination();
var sampler2 = new Tone.Players({
	"1":"./sounds/select.wav"
}).toDestination()
let soundMapper = {
	"0":"C2",
	"1":"C4",
	"2":"C#4",
	"3":"D4",
	"4":"D#4",
	"5":"E4",
	"6":"F4",
	"7":"F#4",
	"8":"G4",
	"9":"G#4",
	"10":"A4",
	"11":"A#4",
	"12":"B4",
	"13":"C5",
	"14":"C#5",
	"15":"D5",
	"16":"D#5",
	"17":"E5",
	"18":"F5",
	"19":"F#5",
	"20":"G5",
	"21":"G#5",
	"22":"A5",
	"23":"A#5",
	"24":"B5",
	"25":"C6",
	"26":"C#6",
	"27":"D6",
	"28":"D#6",
	"29":"E6",
	"30":"F6",
	"31":"F#6",
	"32":"G6",
	"33":"G#6",
	"34":"A6",
	"35":"A#6",
	"36":"B6",
	"37":"C7"
}



Tone.loaded().then(() => {
	sampler1.triggerAttack(["C4"])
})
document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})

//noise n' stuff

function escaped(){if(gameStart == "lost"){
			stopGame()
			camera.playSound("escape")
			return;
		}
		camera.escaped = !camera.escaped
		camera.escapePos = [camera.x,camera.y]
		camera.playSound("escape")}












