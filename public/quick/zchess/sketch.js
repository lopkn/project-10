
let cacheName = [
        // '/',
        './index.html',
        './sketch.js',
        './tone.js',
        'game.js'
      ];
let cacheQuota = 0;
let soundLoaded = false
;(async () => {
   cacheQuota = await navigator.storage.estimate().then(async (e)=>{return(e.quota)})
  console.log(cacheQuota)
})()


let tv = {int:0,deg:0,rmom:[0,0,0,0],cr:0,cg:0,cb:0,gg:Math.random()*125+125};
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


function canvasResize(){
	Height = window.innerHeight /*>window.innerHeight?window.innerHeight:window.innerWidth*/
	Width = window.innerWidth /*>window.innerHeight?window.innerWidth:window.innerHeight*/
	myCanvas.width = Width
	myCanvas.height = Height
}

window.addEventListener("resize",canvasResize)

let CTX = {"main":myCanvas.getContext("2d")}
let ctx = CTX.main
ctx.textAlign = "center"
		ctx.textBaseline="middle"

function rect(x,y,w,h){
	ctx.fillRect(x,y,w,h)
}


function initSounds(arr){
	arr.forEach((E)=>{
		let e = "./soundsM/"+E+".mp3"
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
	// "P":[[200,49],[251,198],[468,330],[294,38],[527,94],[320,307],[516,295],[435,30],[215,102],[245,325],[496,370],[543,141],[501,49],[375,233],[318,261],[325,334],[407,367],[530,283],[288,47],[222,323],[220,390],[571,15],[556,355],[400,47],[400,47],[244,355],[229,15],[580,390],[578,323],[512,47],[270,283],[393,367],[475,334],[482,261],[425,233],[299,49],[257,141],[304,370],[555,325],[585,102],[365,30],[284,295],[480,307],[273,94],[506,38],[332,330],[549,198],[400,49],[95,88],[53,224],[51,311],[134,323],[161,270],[108,150],[60,97],[54,65],[163,63],[192,168],[91,286],[112,319],[202,311],[276,244],[229,106],[111,58],[61,145],[79,254],[60,323],[317,59],[20,56],[276,311],[82,365],[265,69],[39,94],[220,305],[37,233],[279,146],[265,353],[200,48],[200,48],[135,353],[121,146],[363,233],[180,305],[361,94],[135,69],[318,365],[124,311],[380,56],[83,59],[340,323],[321,254],[339,145],[289,58],[171,106],[124,244],[198,311],[288,319],[309,286],[208,168],[237,63],[346,65],[340,97],[292,150],[239,270],[266,323],[349,311],[347,224],[305,88],[0,49],[-149,198],[68,330],[-106,38],[127,94],[-80,307],[116,295],[35,30],[-185,102],[-155,325],[96,370],[143,141],[101,49],[-25,233],[-82,261],[-75,334],[7,367],[130,283],[-112,47],[-178,323],[-180,390],[171,15],[156,355],[0,47],[0,47],[-156,355],[-171,15],[180,390],[178,323],[112,47],[-130,283],[-7,367],[75,334],[82,261],[25,233],[-101,49],[-143,141],[-96,370],[155,325],[185,102],[-35,30],[-116,295],[80,307],[-127,94],[106,38],[-68,330],[149,198],[200,49]],
	"N":[[155,89],[122,63],[116,102],[69,174],[47,232],[63,271],[87,275],[96,256],[103,262],[102,285],[142,244],[153,247],[206,184],[186,256],[142,299],[127,356],[344,354],[326,177],[261,102],[203,84],[188,51],[167,87]],
	"W":[[336,27],[135,124],[78,292],[19,332],[384,320],[311,279],[243,156],[335,29]],
	"C":[[385,80],[332,106],[334,117],[311,128],[304,118],[180,179],[141,115],[132,122],[148,157],[98,180],[97,219],[60,237],[74,269],[83,266],[84,275],[46,275],[33,299],[3,301],[3,308],[38,309],[57,286],[88,288],[105,307],[132,321],[165,317],[192,293],[200,262],[192,234],[179,219],[184,216],[202,243],[213,237],[198,211],[319,150],[317,142],[339,129],[345,135],[400,110],[390,81]],
	"J":[[200,9],[89,159],[163,137],[137,172],[140,213],[156,232],[109,271],[97,309],[90,358],[200,361],[200,361],[310,358],[303,309],[291,271],[244,232],[260,213],[263,172],[237,137],[311,159],[200,9]],
	"M":[[200,71],[158,112],[183,141],[136,191],[172,235],[92,357],[200,359],[200,359],[308,357],[228,235],[264,191],[217,141],[242,112],[200,71]],
	"A":[[200,24],[150,155],[27,192],[150,244],[200,357],[200,357],[250,244],[373,192],[250,155],[200,24]] 

}
let pieceDict2 = {
	"queen":[[200,46],[177,57],[177,84],[192,94],[173,195],[136,102],[150,76],[123,52],[99,70],[118,109],[113,187],[74,130],[81,94],[52,74],[31,112],[54,132],[74,242],[104,281],[74,337],[150,357],[200,357],[200,357],[250,357],[326,337],[296,281],[326,242],[346,132],[369,112],[348,74],[319,94],[326,130],[287,187],[282,109],[301,70],[277,52],[250,76],[264,102],[227,195],[208,94],[223,84],[223,57],[200,46]],
	"king":[[190,49],[189,64],[169,63],[169,81],[188,85],[190,104],[168,120],[160,150],[123,126],[65,147],[42,202],[65,243],[106,273],[105,336],[158,357],[200,361],[200,361],[242,357],[295,336],[294,273],[335,243],[358,202],[335,147],[277,126],[240,150],[232,120],[210,104],[212,85],[231,81],[231,63],[211,64],[210,49],[200,49]],
	"rook":[[200,75],[172,76],[171,96],[140,96],[129,77],[93,77],[91,131],[115,157],[118,269],[98,283],[96,313],[73,316],[71,358],[200,357],[200,357],[329,358],[327,316],[304,313],[302,283],[282,269],[285,157],[309,131],[307,77],[271,77],[260,96],[229,96],[228,76],[200,75]] ,
	// "B":[[200,47],[167,73],[184,100],[123,151],[118,207],[143,238],[123,272],[127,296],[157,307],[82,315],[49,332],[51,358],[92,350],[179,355],[200,346],[200,346],[221,355],[308,350],[349,358],[351,332],[318,315],[243,307],[273,296],[277,272],[257,238],[282,207],[277,151],[216,100],[233,73],[200,47]],
	"bishop":
[[200,25],[113,193],[149,237],[122,285],[156,306],[82,313],[46,342],[62,359],[185,361],[200,345],[200,345],[215,361],[338,359],[354,342],[318,313],[244,306],[278,285],[251,237],[287,193],[200,25]] ,
	"pawn":[[200,73],[163,87],[157,123],[172,137],[141,159],[136,203],[157,230],[116,257],[92,347],[200,351],[200,351],[308,347],[284,257],[243,230],[264,203],[259,159],[228,137],[243,123],[237,87],[200,73]],
	// "P":[[200,49],[251,198],[468,330],[294,38],[527,94],[320,307],[516,295],[435,30],[215,102],[245,325],[496,370],[543,141],[501,49],[375,233],[318,261],[325,334],[407,367],[530,283],[288,47],[222,323],[220,390],[571,15],[556,355],[400,47],[400,47],[244,355],[229,15],[580,390],[578,323],[512,47],[270,283],[393,367],[475,334],[482,261],[425,233],[299,49],[257,141],[304,370],[555,325],[585,102],[365,30],[284,295],[480,307],[273,94],[506,38],[332,330],[549,198],[400,49],[95,88],[53,224],[51,311],[134,323],[161,270],[108,150],[60,97],[54,65],[163,63],[192,168],[91,286],[112,319],[202,311],[276,244],[229,106],[111,58],[61,145],[79,254],[60,323],[317,59],[20,56],[276,311],[82,365],[265,69],[39,94],[220,305],[37,233],[279,146],[265,353],[200,48],[200,48],[135,353],[121,146],[363,233],[180,305],[361,94],[135,69],[318,365],[124,311],[380,56],[83,59],[340,323],[321,254],[339,145],[289,58],[171,106],[124,244],[198,311],[288,319],[309,286],[208,168],[237,63],[346,65],[340,97],[292,150],[239,270],[266,323],[349,311],[347,224],[305,88],[0,49],[-149,198],[68,330],[-106,38],[127,94],[-80,307],[116,295],[35,30],[-185,102],[-155,325],[96,370],[143,141],[101,49],[-25,233],[-82,261],[-75,334],[7,367],[130,283],[-112,47],[-178,323],[-180,390],[171,15],[156,355],[0,47],[0,47],[-156,355],[-171,15],[180,390],[178,323],[112,47],[-130,283],[-7,367],[75,334],[82,261],[25,233],[-101,49],[-143,141],[-96,370],[155,325],[185,102],[-35,30],[-116,295],[80,307],[-127,94],[106,38],[-68,330],[149,198],[200,49]],
	"knight":[[155,89],[122,63],[116,102],[69,174],[47,232],[63,271],[87,275],[96,256],[103,262],[102,285],[142,244],[153,247],[206,184],[186,256],[142,299],[127,356],[344,354],[326,177],[261,102],[203,84],[188,51],[167,87]],
	"wizard":[[336,27],[135,124],[78,292],[19,332],[384,320],[311,279],[243,156],[335,29]],
	"cannon":[[385,80],[332,106],[334,117],[311,128],[304,118],[180,179],[141,115],[132,122],[148,157],[98,180],[97,219],[60,237],[74,269],[83,266],[84,275],[46,275],[33,299],[3,301],[3,308],[38,309],[57,286],[88,288],[105,307],[132,321],[165,317],[192,293],[200,262],[192,234],[179,219],[184,216],[202,243],[213,237],[198,211],[319,150],[317,142],[339,129],[345,135],[400,110],[390,81]],
	"jumper":[[200,9],[89,159],[163,137],[137,172],[140,213],[156,232],[109,271],[97,309],[90,358],[200,361],[200,361],[310,358],[303,309],[291,271],[244,232],[260,213],[263,172],[237,137],[311,159],[200,9]],
	"mercinary":[[200,71],[158,112],[183,141],[136,191],[172,235],[92,357],[200,359],[200,359],[308,357],[228,235],[264,191],[217,141],[242,112],[200,71]], 
	"artillery":[[200,24],[150,155],[27,192],[150,244],[200,357],[200,357],[250,244],[373,192],[250,155],[200,24]] 

}

class DBG{
	static debugging = false;
	static tickTime = 0;
	static frameCounter = 0;
	static lastFrameCount = 0;
	static render(){
		ctx.font = "bold 15px Courier New"
		ctx.textAlign = "right"
		ctx.fillStyle = "white"

		ctx.fillText(Math.floor(this.tickTime)+"/"+Math.floor(camera.fps*this.tickTime/10)+"%",Width,15)
		ctx.fillText(this.frameCounter+"/"+this.lastFrameCount,Width,30)
	}
}

var dummyPiece = new piece("dummy",undefined,undefined,"zombies")

class camera{

	static shapeBlind = false

	static cookies = false
	static gamemode = "none"
	static team = "p1";
	static pieceRender = "image";
	static cooldownRender = "linear";
	static flashpiece = true;
	static increaseMargin = 1;
	static menuButtonSize = 40;
	static pieceFrequency = 1300;
	static escaped = false
	static escapePos = [0,0]
	static specialRenderOn = true;
	static money = 0;
	static x = 1.2;
	static y = 1.2;
	static particles = [];
	static sounds = {}
	static soundArr = []
	static tileRsize = 1
	static soundOn = true;
	static fps = 28
	// static volume = 0;

	static highScores = {"Normal":[0,0],"King's Raid":[0,0],"Knight's Raid":[0,0],"Knight's Rush":[0,0],"Phantom":[0,0],"Universal":[0,0],"Cannonflight":[0,0]}
	static score = 0;

	// static playSound(url){ dogassass
	// 	let click = this.sounds[url].cloneNode()
	// 	click.play()
	// }
	static playSound(file,note="C4",vel=1){
		if(this.soundOn === false || soundLoaded === false){return}
		this.sounds[file].triggerAttack(note,undefined,vel)
	}
	static playSoundF(no){
		if(this.soundOn === false|| soundLoaded === false){return}
		sampler1.triggerAttack([soundMapper[no]])
	}
	static playSoundURL(url){//dog
		if(this.soundOn === false|| soundLoaded === false){return}
		let audio = new Tone.Player(url).toDestination()
		audio.onStop = ()=>{audio.dispose()}
		audio.autostart = true;
	}
	static captureStreak = 0;
}

class music{
	static Synth1 = new Tone.Synth().toDestination()
	static Hihat = new Tone.NoiseSynth().toDestination()
	static Kick = new Tone.MembraneSynth().toDestination()
	static freeverb = new Tone.Freeverb().toDestination();
	static reverb = new Tone.Reverb({
   	decay: 20, // Duration of the reverb tail
   	preDelay: 0,
   	wet: 0.95,
   	input:1,
   	output:1
	}).toDestination();
	static init(){
		this.Synth1.connect(this.reverb)
	}
	static play(num="C4",time=0.2,vel=1,synth=this.Synth1){
		synth.triggerAttackRelease(num,time,undefined,vel)
	}
}
music.init()

let initSoundsArr = ["start4","start3","start2","start","bomb","shot","escape","select","move","captureF","capture","captureS1","captureS2","captureS3","captureS4","captureS5","captureS6","captureS7","captureS8"]
initSounds(initSoundsArr)

function fill(r,g,b,a){
	a = a==undefined?1:a
	let c = "rgba(" + r+","+g+","+b+","+a+")"
	ctx.fillStyle = c
	return(c)
}

if(navigator.onLine == false){
	camera.soundOn = false
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
		if(board.tiles[pos] == undefined || board.tiles[pos].piece == undefined || board.tiles[pos].piece.team != camera.team){
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
let pieceLocked = "none"
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
    	if(tile.piece.lock){
    		pieceLocked = tile.piece
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


	ctx.textAlign = "left"

	ctx.font = "bold "+Math.floor(0.5*tileSize)+"px Courier New"
	fill(180,180,255)
	let hs = camera.highScores
	let gmpos = Math.floor(mouseBoardY/2)

	if(mouseBoardX < 9){

		if(gmpos === 0){
			drawText("session high: "+hs["Normal"][0]+(camera.cookies?" all time high: "+hs["Normal"][1]:""),1,0.8)
		} else if(gmpos === 1){
			drawText("session high: "+hs["King's Raid"][0]+(camera.cookies?" all time high: "+hs["King's Raid"][1]:""),1,2.8)
		} else if(gmpos === 2){
			drawText("session high: "+hs["Knight's Raid"][0]+(camera.cookies?" all time high: "+hs["Knight's Raid"][1]:""),1,4.8)
		} else if(gmpos === 4){
			drawText("session high: "+hs["Phantom"][0]+(camera.cookies?" all time high: "+hs["Phantom"][1]:""),1,8.8)
		} else if(gmpos === 5){
			drawText("session high: "+hs["Universal"][0]+(camera.cookies?" all time high: "+hs["Universal"][1]:""),1,10.8)
		} else if(gmpos === 6){
			drawText("session high: "+hs["Cannonflight"][0]+(camera.cookies?" all time high: "+hs["Cannonflight"][1]:""),1,12.8)
		}
	} else {
		if(gmpos === 2){
			drawText("session high: "+hs["Knight's Rush"][0]+(camera.cookies?" all time high: "+hs["Knight's Rush"][1]:""),10,4.8)
		}
	}


	fill(255,255,255)
	ctx.font = "bold "+Math.floor(0.8*tileSize)+"px Courier New"

	drawText("Choose game mode:",0,-1)
	drawText("Normal",1,0)
	drawText("King's Raid",1,2)
	drawText("Knight's Raid",1,4)
	drawText("Knight's Rush",10,4)
	drawText("God complex",1,6)
	drawText("Phantom",1,8)
	drawText("Universal",1,10)
	drawText("Cannonflight",1,12)
	



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
	ctx.beginPath()
	ctx.moveTo(coord1[0]+9*tileSize,coord1[1]+4*tileSize)
	ctx.lineTo(coord2[0]+9*tileSize,coord2[1]+4*tileSize)
	ctx.lineTo(coord3[0]+9*tileSize,coord3[1]+4*tileSize)
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
	ctx.fillStyle = "#488000"
	ctx.beginPath()
	ctx.moveTo(coord1[0],coord1[1]+10*tileSize)
	ctx.lineTo(coord2[0],coord2[1]+10*tileSize)
	ctx.lineTo(coord3[0],coord3[1]+10*tileSize)
	ctx.fill()
	ctx.closePath()
	fill(155,0,255,mra)
	ctx.beginPath()
	ctx.moveTo(coord1[0],coord1[1]+12*tileSize)
	ctx.lineTo(coord2[0],coord2[1]+12*tileSize)
	ctx.lineTo(coord3[0],coord3[1]+12*tileSize)
	ctx.fill()
	ctx.closePath()

		fill(215,0,0,mra)
	coord1 = board_to_screen(0.1,0.15)
	coord2 = board_to_screen(0.9,0.15)
	coord3 = board_to_screen(0.5,1)
	ctx.beginPath()
	ctx.moveTo(coord1[0],coord1[1]+6*tileSize)
	ctx.lineTo(coord2[0],coord2[1]+6*tileSize)
	ctx.lineTo(coord3[0],coord3[1]+6*tileSize)
	ctx.fill()
	ctx.closePath()

	ctx.fillStyle = "#F9F900"
	drawText("K",0,2)
	drawText("N",9,4)
	drawText("N",0,4)
	drawText("&",0,6)
	drawText("A",0,12)


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

	let volumeSlide = ""
	for(let i = 0; i < (Tone.Master.volume.value+40)/5+1; i++){
		volumeSlide += "-"
	}
	volumeSlide += "|"
	while(volumeSlide.length < 11){
		volumeSlide += "-"
	}

	ctx.fillStyle = "#FFFFFF"
	let y = -4
	drawText("Send to origin",1,y); y+=2
	drawText("Quit",1,y);y+=2
	drawText("Buttons & Switches:",0,y);y+=1
	drawText("Piece cooldown mode ["+camera.cooldownRender+"]",17,y);
	drawText("Piece render mode ["+camera.pieceRender+"]",2,y);y+=2
	drawText("flashpiece ["+(camera.flashpiece?"on":"off")+"]",17,y);
	drawText("Sounds ["+(camera.soundOn?"on":"off")+"]",2,y);y+=2
	drawText("Declare to be homosexual ["+(camera.shapeBlind?"on":"off")+"]",17,y);
	drawText("Play random sound",2,y);y+=2
	drawText("Increase margin ["+camera.increaseMargin+"]",2,y);y+=2
	drawText("Menu button size ["+camera.menuButtonSize+"]",2,y);y+=2
	drawText("Tilesize ["+tileSize.toPrecision(3)+"]",2,y);y+=2
	drawText("Volume (requires sound) ["+Math.round(Tone.Master.volume.value)+"]",2,y);y+=0.8
	drawText("["+volumeSlide+"]"+(Tone.Master.volume.value>10?" you are liable for any damage":""),2,y);y+=1.2
	drawText("Save state/cookies ["+(camera.cookies===false?'off':'on')+"]",2,15);y+=0.8
	drawText("saved last ["+(camera.cookies===false?'/':camera.cookies)+"]",2,15.8);y+=1.2;
	drawText("DELETE CACHE (if you are not updating)",2,17);y+=0.8
	drawText("cache quota ["+cacheQuota+"]",2,17.8);y+=1.2
	drawText("Debugging info ["+(DBG.debugging?"on":"off")+"]",2,19)

	if(camera.pieceRender == "image"){
		fill(255,255,255)
	} else {
		fill(255,255,255)
	}
	((camera.pieceRender=="image")?(()=>{fill(255,255,0)}):(()=>{fill(255,255,255)}))();
	mrect(0.2,1.2,0.6,0.6);
	((camera.cooldownRender=="exponential")?(()=>{fill(255,255,0)}):(()=>{fill(255,255,255)}))();
	mrect(16.2,1.2,0.6,0.6);

	camera.flashpiece?fill(0,255,0):fill(255,0,0);
	mrect(16.2,3.2,0.6,0.6);

	camera.shapeBlind?fill(0,255,0):fill(255,0,0);
	mrect(16.2,5.2,0.6,0.6);


	((camera.soundOn)?(()=>{fill(0,255,0)}):(()=>{fill(255,0,0)}))();
	mrect(0.2,3.2,0.6,0.6);//sound
	mrect(0.2,5.2,0.6,0.6);//random sound

	((DBG.debugging)?(()=>{fill(0,255,0)}):(()=>{fill(255,0,0)}))();
	mrect(0.2,19.2,0.6,0.6);

	fill(255,0,0)
	mrect(0.2,7.2,0.8,0.6)
	mrect(0.2,9.2,0.8,0.6)
	mrect(0.2,11.2,0.8,0.6)
	mrect(0.2,13.2,0.8,0.6)
	fill(0,255,0)
	mrect(1,7.2,0.8,0.6)
	mrect(1,9.2,0.8,0.6)
	mrect(1,11.2,0.8,0.6);
	mrect(1,13.2,0.8,0.6);
	mrect(0.2,17.2,0.6,0.6);

	((camera.cookies)?(()=>{fill(0,255,0)}):(()=>{fill(255,0,0)}))(); //cookies
	mrect(0.2,15.2,0.6,0.6);



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
					// navigator.vibrate(200)
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
				} else if(Y === 13){
					Tone.Master.volume.value -= camera.increaseMargin
				} else if(Y === 15){
					camera.playSound("select")
					if(camera.cookies){
						camera.cookies = false
						deleteCookies()
					} else {
						let d = new Date().toISOString()
						camera.cookies = d
						saveCookies(d)
					}


				} else if(Y === 17){
					deleteCache()
					if ('serviceWorker' in navigator) {
						  navigator.serviceWorker.getRegistrations().then(function(registrations) {
						    for (let registration of registrations) {
						      registration.unregister();
						    }
						  }).catch(function(error) {
						    console.error('Error unregistering service worker:', error);
						  });
						}
					camera.playSound("select")

				} else if(Y === 19){
					DBG.debugging = !DBG.debugging
					camera.playSound("select")
				}  else if(Y === -2){
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
				} else if(Y === 13){
					Tone.Master.volume.value += camera.increaseMargin
				}
			} else if(X === 16){
				if(Y === 1){
					if(camera.cooldownRender == "exponential"){
						camera.cooldownRender = "linear"
					} else {
						camera.cooldownRender = "exponential"
					}
					camera.playSound("select")
				} else if(Y===3){
					camera.flashpiece = !camera.flashpiece
					camera.playSound("select")
				}else if(Y===5){
					camera.shapeBlind = !camera.shapeBlind
					camera.playSound("select")
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
					}
					//  else if(mouseBoardY == 6){
					// 	camera.gamemode = "Roaming"
					// 	gameStart = "started"
					// 	startGame()
					// } 
					else if(mouseBoardY == 6){
						camera.gamemode = "God complex"
						gameStart = "started"
						startGame()
					} 

					else if(mouseBoardY == 8){
						camera.gamemode = "Phantom"
						gameStart = "started"
						startGame()
					} else if(mouseBoardY == 10){
						camera.gamemode = "Universal"
						gameStart = "started"
						startGame()
					}else if(mouseBoardY == 12){
						camera.gamemode = "Cannonflight"
						gameStart = "started"
						startGame()
					}
				} else if(mouseBoardX == 9) {
					if(mouseBoardY == 4){
						camera.gamemode = "Knight's Rush"
						gameStart = "started"
						startGame()
					}
				}
			}

			return;
		}
		if(pieceLocked !== "none"){
			if(pieceLocked.cooldown == 0){
				let mv = attemptMove(pieceLocked.x,pieceLocked.y,mouseBoardX,mouseBoardY,camera.team)
				friendlyMoved(mv)
				if(mv!==false){
					pieceSelected = "none"
					pieceClicked = "none"
					return
				}
			} else if(mouseBoardY!=pieceLocked.y || mouseBoardX != pieceLocked.x){
				pieceLocked.premoves.push([mouseBoardX,mouseBoardY])
				pieceSelected = "none"
				pieceClicked = "none"
				return;
			}
			
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


var blindDict = {
pawn     : "hsl(204, 46%,55%)",
knight   : "hsl(57, 81%,55%)",
bishop   : "hsl(95, 90%,55%)",
rook     : "hsl(26, 63%,55%)",
queen    : "hsl(10, 90%,55%)",
king     : "hsl(232, 70%,55%)",
cannon  : "hsl(283, 49%,55%)",
artillery  : "hsl(283, 26%,55%)"
}
// Lightness by default is
// 55% for dark
// 40% for light
// (if adjustable, should be slidable within 25% and 80%)


function drawPiece(l,x,y,team,cd,pc){

	if(cd != 0){
		if(team == camera.team){
			fill(0,0,150,0.3)} else {
			fill(150,0,0,0.3)
			// if(cd < 0.2){
			// 	fill(150,150,0,0.3)
			// }
		}

		if(camera.flashpiece){
			if(pc.cooldown < 0.5){
				if(pc.travelVectors){
					pc.stroke = {color:`rgb(${pc.cooldown*512},0,0)`,width:2}
				}else {
					pc.stroke = {color:`rgb(${pc.cooldown*512},0,${pc.cooldown*512})`,width:2}
				}
			} else {
				pc.stroke = undefined
			}
		}

		if(camera.cooldownRender === "exponential"){
			// mrect(x,y,1,Math.sqrt(cd>1?1:cd))
			mrect(x,y,1,(cd>1?1:cd)**(1/2.71828182846))

		} else {
			mrect(x,y,1,cd>1?1:cd)
		}
		if(cd>1){
			let CDD = cd-1
			fill(0,0,0,0.1)
			while(CDD>1){
				mrect(x,y,1,1)
				CDD -= 1
			}
		}

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

		if(blindDict[pc.id] && camera.shapeBlind){
			ctx.fillStyle = blindDict[pc.id]
		}

	}
	if(camera.pieceRender === "image" && pieceDict[l] != undefined){
		let arr = pieceDict[l]  
		pieceImage(x,y,arr,pc)
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

function pieceImage(x,y,arr,piece){
	ctx.beginPath()
	ctx.moveTo(arr[0][0]/(400/tileSize)+(x+camera.x)*tileSize,arr[0][1]/(400/tileSize)+(y+camera.y)*tileSize)
	for(let i = 1; i < arr.length; i++){
		ctx.lineTo(arr[i][0]/(400/tileSize)+(x+camera.x)*tileSize,arr[i][1]/(400/tileSize)+(y+camera.y)*tileSize)
	}
	ctx.fill()
	ctx.closePath()
	if(piece?.stroke){
		ctx.strokeStyle = piece.stroke.color
		ctx.lineWidth = piece.stroke.width
		ctx.stroke()
	}
}

function normalShopRender(){
	fill(20,0,0)
	for(let i = -camera.x-2;i<Width/tileSize+5;i++){
		mrect(i, 13)
	}
}

var seconds = 0;

function render(){


	let renderStartTime = Date.now()

	if(DBG.debugging){
		if(Math.floor(renderStartTime/1000) != seconds){
			seconds = Math.floor(renderStartTime/1000)
			DBG.lastFrameCount = DBG.frameCounter
			DBG.frameCounter = 0;
		}
		DBG.frameCounter++
	}

	

	fill(0,0,0)
	rect(0,0,Width,Height)

	

	let arr = Object.keys(board.tiles)

	normalShopRender()


	arr.forEach((e)=>{
		let pos = ipos(e)
		let tile = board.tiles[e]

		if(tile == undefined){return}
			let pprr = (pos.x+pos.y)%2
		if(pprr == 1){
		fill(60,60,60)} else if(pprr == 0){
			fill(70,70,70)
		} else {
			fill(80,80,70)
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
	let tn = Date.now()
	arr.forEach((e)=>{
		let pos = ipos(e)
		let tile = board.tiles[e]
		ctx.textAlign = "center"
		if(tile?.piece != undefined){
			let tpc = tile.piece
			tpc.CDcheck(tn)
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


	// let tn = Date.now()
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
		drawArrow(mouseDownPlace[2],mouseDownPlace[3],mouseX,mouseY,Math.random(),0.2,0.1)

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
	if(DBG.debugging){
		DBG.render()
	}
	if(camera.escaped){
		menuRender(0,0)
	}
	fill(255,0,0,0.3)
	mrect(mouseBoardX,mouseBoardY)
	fill(125,0,255,0.3)

	// for(let i = 0; i < 20000000; i++){
	// 	Math.random()
	// } wow this game is terrifically optimized

	ctx.fillRect(0,0,camera.menuButtonSize,camera.menuButtonSize)
	DBG.tickTime = DBG.tickTime + 0.05*(Date.now()-renderStartTime- DBG.tickTime)
}

// setInterval(()=>{if(document.hasFocus()){render()}},35)
let renderInterval = setInterval(()=>{render()},Math.floor(1000/camera.fps))
function setFps(x){
	camera.fps = x
	clearInterval(renderInterval)
	renderInterval = setInterval(()=>{render()},Math.floor(1000/camera.fps))
}



let gameInterval;
let gameSpecialInterval = ()=>{}

function startGame(){
camera.specialRenderOn = false
board.emptyNew()
board.spawnRates = ["pawn",0.65,"king",0.80,"knight",0.95,"bishop",0.98,"rook",0.998,"cannon",0.9995,"queen",1]
if(Math.random()>0.1){
	camera.playSound("start4")
} else if(Math.random()>0.5){
		camera.playSound("start2")
} else if(Math.random()>0.5){
		camera.playSound("start")
} else {
		camera.playSound("start3")
}

let relativeEventFrequency = Math.random()

if(camera.gamemode == "Roaming"){
		for(let i = 0; i < 32; i++){
			for(let j = 0; j < 32; j++){
				board.tiles[i+","+j] = {};
			}
		}
		board.tiles["16,16"].color = ()=>{return("rgb(0,200,200)")}
		camera.pieceFrequency = 2935209357230
		board.tiles[16+","+16].piece = new piece("rook",16,16,"p1")
			let ap = board.tiles["16,16"].piece


			ap.maxCD = 0.2
			ap.onDeath=()=>{
				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"

			}
}else if(camera.gamemode == "Knight's Raid"){
			camera.pieceFrequency = 1100
			gameSpecialInterval = ()=>{if(board.iterations%18 == 0 && board.iterations > 30){
				// for(let i = 0; i < 6; i++){
				// 	board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.8
				// 	// if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				// 	if(board.spawnRates[2*i+1] < 0.1){board.spawnRates[2*i+1] = 0.1}
				// }

				let interp = board.iterations/500
				board.spawningSequence.forEach((e)=>{
					e.rate = e.startRate + Math.min((e.maxRate-e.startRate)*interp,1)
				})


				if(board.pieces.size > 50 && !board.happening.has("zombie wizard")){
						if(gameEvents["zombie wizard"]()!==false){
							board.happening.add("zombie wizard")
						}
					}

				}
				if(board.iterations % 20 == 0 && camera.pieceFrequency > 800){
					camera.pieceFrequency -= 5
					startGameInterval(camera.pieceFrequency)
				// board.pieces.forEach((e)=>{
   			// 	 let pos = spos(e.x+Math.floor(Math.random()*3-1),e.y+Math.floor(Math.random()*3-1))
   			//  if(board.tiles[pos]==undefined){board.tiles[pos]={}}})

					
                        
				}
			}
			board.specialIntervals["bombers"] = ()=>{if(board.iterations > 30 &&Math.random()<0.005*relativeEventFrequency){gameEvents["bomber pawn"]()}}
			board.specialIntervals["elite cannon"] = ()=>{if(board.iterations > 30 &&Math.random()<0.008*relativeEventFrequency){gameEvents["elite cannon"]()}}
			board.specialIntervals["elite knight"] = ()=>{if(board.iterations > 30 &&Math.random()<0.01*relativeEventFrequency){gameEvents["elite knight"]()}}
			board.specialIntervals["allied knight"] = ()=>{if(board.iterations > 30 && Math.random()<0.005*relativeEventFrequency){gameEvents["white knights"]()}}

			board.arrFuncs.pieceModifiers.push((e)=>{
				e.maxCD = 8
			})

			board.spawningSequence = [
				{"type":"pawn","startRate":1,"maxRate":1},
				{"type":"king","startRate":0.3,"maxRate":0.5},
				{"type":"knight","startRate":0.05,"maxRate":0.1},
				{"type":"bishop","startRate":0.04,"maxRate":0.2},
				{"type":"rook","startRate":0.02,"maxRate":0.09},
				{"type":"cannon","startRate":0.002,"maxRate":0.08},
				{"type":"queen","startRate":0.001,"maxRate":0.1}
			]
				board.spawningSequence.forEach((e)=>{e.rate=e.startRate})


			// board.spawnRates[5] = 0.2
			// board.spawnRates[7] = 0.9
			// board.spawnRates[9] = 0.95

			board.tiles[4+","+11].piece = new piece("knight",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			ap.lock = true
			pieceLocked = ap
			ap.arrFuncs.onMove.push((px,py,pc,type)=>{
				let time = 0.4
				f = (x)=>{return("rgba(200,200,0,"+(x/Math.max(1,2-camera.captureStreak*0.1))+")")}

				if(type=="capture"){
					f = (x)=>{let r = Math.random();return("rgba(0,"+(r*200)+",200,"+(x/Math.max(1,1.8-camera.captureStreak*0.1))+")")}
					// time = time/(camera.captureStreak*0.2+1)
				}

					camera.particles.push(new lineParticle(px+0.5,py+0.5,ap.x+0.5,ap.y+0.5,Math.min(2+camera.captureStreak,20),
						f,time))
						}
					)
			ap.maxCD = 0.2
			// ap.hp *= 200
			ap.onDeath=()=>{
				
				camera.score = ap.kills

				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"

			}

			if(Math.random()<0.05 && false){ // flight chamber is disabled from 09-07-25
				gameEvents["flight chamber"](ap)
			board.extension1 = false //stop board expansion
			} else if(Math.random()<0.2){
				gameEvents["piece storm"]()
			}
			
} else if(camera.gamemode == "King's Raid"){
			
			camera.pieceFrequency = 1200
			gameSpecialInterval = ()=>{if(board.iterations%12 == 0 && board.iterations > 120){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.4
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
					console.log(board.spawnRates)
				} if(board.iterations % 20 == 0 && camera.pieceFrequency > 550){
					camera.pieceFrequency -= 25
					startGameInterval(camera.pieceFrequency)
				}
			}

			board.specialIntervals["bombers"] = ()=>{if(board.iterations > 30 &&Math.random()<0.0001*relativeEventFrequency){gameEvents["bomber pawn"]()}}
			board.specialIntervals["elite cannon"] = ()=>{if(board.iterations > 30 &&Math.random()<0.008*relativeEventFrequency){gameEvents["elite cannon"]()}}
			board.specialIntervals["elite knight"] = ()=>{if(board.iterations > 30 &&Math.random()<0.01*relativeEventFrequency){gameEvents["elite knight"]()}}
			board.specialIntervals["allied knight"] = ()=>{if(board.iterations > 30 &&Math.random()<0.005*relativeEventFrequency){gameEvents["white knights"]()}}

			board.tiles[4+","+11].piece = new piece("king",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			ap.lock = true
			pieceLocked = ap
			ap.arrFuncs.onMove.push((px,py,pc,type)=>{
				let time = 0.4
				f = (x)=>{return("rgba(200,200,0,"+(x/Math.max(1,2-camera.captureStreak*0.1))+")")}

				if(type=="capture"){
					f = (x)=>{let r = Math.random();return("rgba(0,"+(r*200)+",200,"+(x/Math.max(1,1.8-camera.captureStreak*0.1))+")")}
					// time = time/(camera.captureStreak*0.2+1)
				}

					camera.particles.push(new lineParticle(px+0.5,py+0.5,ap.x+0.5,ap.y+0.5,Math.min(2+camera.captureStreak,20),
						f,time))
						}
					)
			ap.maxCD = 0.2
			ap.onDeath=()=>{
				
				camera.score = ap.kills
				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"
			}

			if(Math.random()<0.05){ // flight chamber is introduced to kings raid from 09-07-25
				gameEvents["flight chamber"](ap)
			board.extension1 = false //stop board expansion
			} else if(Math.random()<0.2){
				gameEvents["piece storm"]()
			}
} else if(camera.gamemode == "Knight's Rush"){
			camera.pieceFrequency = 1200
			gameSpecialInterval = ()=>{if(board.iterations%18 == 0 && board.iterations > 30){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
				}
				if(board.iterations % 20 == 0 && camera.pieceFrequency > 900){
					camera.pieceFrequency -= 5
					startGameInterval(camera.pieceFrequency)
				}
			}
			board.specialIntervals["bombers"] = ()=>{if(board.iterations > 30 &&Math.random()<0.015*relativeEventFrequency){gameEvents["bomber pawn"]()}}
			board.specialIntervals["elite cannon"] = ()=>{if(board.iterations > 30 &&Math.random()<0.024*relativeEventFrequency){gameEvents["elite cannon"]()}}
			board.specialIntervals["elite knight"] = ()=>{if(board.iterations > 30 &&Math.random()<0.03*relativeEventFrequency){gameEvents["elite knight"]()}}
			board.specialIntervals["allied knight"] = ()=>{if(board.iterations > 30 && Math.random()<0.005*relativeEventFrequency){gameEvents["white knights"]()}}

			board.tiles[4+","+11].piece = new piece("knight",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			ap.lock = true
			pieceLocked = ap
			ap.arrFuncs.onMove.push((px,py,pc,type)=>{
				let time = 0.4
				f = (x)=>{return("rgba(200,200,0,"+(x/Math.max(1,2-camera.captureStreak*0.1))+")")}

				if(type=="capture"){
					f = (x)=>{let r = Math.random();return("rgba(0,"+(r*200)+",200,"+(x/Math.max(1,1.8-camera.captureStreak*0.1))+")")}
					// time = time/(camera.captureStreak*0.2+1)
				}

					camera.particles.push(new lineParticle(px+0.5,py+0.5,ap.x+0.5,ap.y+0.5,Math.min(2+camera.captureStreak,20),
						f,time))
						}
					)
			ap.maxCD = 0.2
			ap.onDeath=()=>{
				
				camera.score = ap.kills
				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"

			}

			gameEvents["flight chamber"](ap)
			board.extension1 = false //stop board expansion

			
}

else if(camera.gamemode == "God complex"){
			camera.pieceFrequency = 2200
			gameSpecialInterval = ()=>{if(board.iterations%18 == 0 && board.iterations > 3){
				for(let i = 0; i < 6; i++){
					board.spawnRates[2*i+1]=(-0.001/board.spawnRates[2*i+1])+board.spawnRates[2*i+1]
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
				}
				if(board.iterations % 20 == 0 && camera.pieceFrequency > 800){
					camera.pieceFrequency -= 2
					startGameInterval(camera.pieceFrequency)
				}
			}
			board.specialIntervals["bombers"] = ()=>{if(board.iterations > 30 &&Math.random()<0.005*relativeEventFrequency){gameEvents["bomber pawn"]()}}
			board.specialIntervals["elite cannon"] = ()=>{if(board.iterations > 30 &&Math.random()<0.008*relativeEventFrequency){gameEvents["elite cannon"]()}}
			board.specialIntervals["elite knight"] = ()=>{if(board.iterations > 30 &&Math.random()<0.01*relativeEventFrequency){gameEvents["elite knight"]()}}
			board.specialIntervals["allied knight"] = ()=>{if(board.iterations > 30 && Math.random()<0.005*relativeEventFrequency){gameEvents["white knights"]()}}

			board.tiles[4+","+11].piece = new piece("wizard",4,11,"p1",{"godComplex":1})
			board.extension1 = false //stop board expansion
			let ap = board.tiles["4,11"].piece
			ap.arrFuncs.onMove.push((px,py)=>{


					camera.particles.push(new lineParticle(px+0.5,py+0.5,ap.x+0.5,ap.y+0.5,2,
						(x)=>{
							return("rgba(200,200,0,"+(x/2)+")")},0.4))

			})
			ap.maxCD = 1.2
			ap.color = "#F0F050"
			ap.chargeTime = 500
			ap.onDeath=()=>{
				
				camera.score = ap.kills

				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"

			}

			if(Math.random()<10.05){
				gameEvents["flight chamber"](ap)
			} else if(Math.random()<0.2){
				gameEvents["piece storm"]()
			}
			
}

else if(camera.gamemode == "Phantom"){
			camera.pieceFrequency = 1500
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

					fill(0,100,0,cd<0.2?0:(cd-0.2)*1.25)
					if(camera.pieceRender === "image"&&pieceDict[l] != undefined){
						let arr = pieceDict[l]  
						pieceImage(x,y,arr)
					} else {
						ctx.fillText(l,(x+camera.x+0.5)*tileSize,(y+camera.y+0.56)*tileSize)
					}}
				setPieceCooldown(e,3)

			})
			board.arrFuncs.pieceModifiers.push((e)=>{
				e.arrFuncs.onMove.push((x,y,e,t)=>{
					camera.particles.push(new lineParticle(x+0.5,y+0.5,e.x+0.5,e.y+0.5,10,
						(x)=>{let mr = Math.random()*125+125
							return("rgb(0,"+(mr/2)+",0)")},1))
				})
			})
			board.AIwait = ()=>{return(Math.random()*3000+10)}
			board.AIblockWait = ()=>{return(Math.random()*5000+10)}
			ap.onDeath=()=>{
				camera.score = ap.kills
				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"
			}
			if(Math.random()<0.2){
				gameEvents["board expansion"](30)
				gameEvents["flight chamber"](ap)
			}
}else if(camera.gamemode == "Cannonflight"){
			camera.pieceFrequency = 2100
			gameSpecialInterval = ()=>{if(board.iterations%18 == 0 && board.iterations > 30){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
				}
				if(board.iterations % 20 == 0 && camera.pieceFrequency > 1100){
					camera.pieceFrequency -= 5
					startGameInterval(camera.pieceFrequency)
				}
			}
			board.specialIntervals["bombers"] = ()=>{if(board.iterations > 30 &&Math.random()<0.005*relativeEventFrequency){gameEvents["bomber pawn"]()}}
			board.specialIntervals["elite cannon"] = ()=>{if(board.iterations > 30 &&Math.random()<0.008*relativeEventFrequency){gameEvents["elite cannon"]()}}
			board.specialIntervals["elite knight"] = ()=>{if(board.iterations > 30 &&Math.random()<0.01*relativeEventFrequency){gameEvents["elite knight"]()}}
			board.specialIntervals["allied knight"] = ()=>{if(board.iterations > 30 && Math.random()<0.005*relativeEventFrequency){gameEvents["white knights"]()}}

			board.tiles[4+","+11].piece = new piece("artillery",4,11,"p1")
			let ap = board.tiles["4,11"].piece
			ap.lock = true
			ap.range = 30
			pieceLocked = ap
			ap.arrFuncs.onMove.push((px,py,pc,type)=>{
				let time = 0.4
				f = (x)=>{return("rgba(200,200,0,"+(x/Math.max(1,2-camera.captureStreak*0.1))+")")}

				if(type=="capture"){
					f = (x)=>{let r = Math.random();return("rgba(0,"+(r*200)+",200,"+(x/Math.max(1,1.8-camera.captureStreak*0.1))+")")}
					// time = time/(camera.captureStreak*0.2+1)
				}

					camera.particles.push(new lineParticle(px+0.5,py+0.5,ap.x+0.5,ap.y+0.5,Math.min(2+camera.captureStreak,20),
						f,time))
						}
					)
								ap.maxCD = 0.2
			ap.onDeath=()=>{
				
				camera.score = ap.kills

				mainPieceDeath(ap)
				clearInterval(gameInterval)
				gameStart = "lost"

			}

			if(Math.random()<0.05){
				gameEvents["flight chamber"](ap)
			} else if(Math.random()<0.2){
				gameEvents["piece storm"]()
			}
			
} else if(camera.gamemode == "Normal"){

	camera.pieceFrequency = 10000
	gameSpecialInterval = ()=>{
		camera.score += 1
		if(board.iterations%18 == 0 && board.iterations > 30){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
				}
				if(board.iterations % 10 == 0 && camera.pieceFrequency > 8500){
					camera.pieceFrequency -= 25
					startGameInterval(camera.pieceFrequency)
				}
			}


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
}else if(camera.gamemode == "Universal"){

	camera.pieceFrequency = 9000
	gameSpecialInterval = ()=>{
		camera.score += 1
		if(board.iterations%18 == 0 && board.iterations > 30){
				for(let i = 0; i < 4; i++){
					board.spawnRates[2*i+1]-=(1-board.spawnRates[2*i+1])*(1-board.spawnRates[2*i+1])*0.2
					if(board.spawnRates[2*i+1] < (i+1)*0.1){board.spawnRates[2*i+1] = (i+1)*0.1}
				}
				}
				if(board.iterations % 10 == 0 && camera.pieceFrequency > 7500){
					camera.pieceFrequency -= 25
					startGameInterval(camera.pieceFrequency)
				}
			}

	board.arrFuncs.pieceModifiers.push((e)=>{
				e.maxCD = 10;
			})


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
		board.tiles[0+","+9].piece = new piece("cannon",0,9,"p1")
		board.tiles[7+","+9].piece = new piece("cannon",7,9,"p1")

		let objk = Object.values(board.tiles)
		objk.forEach((e)=>{
			if(e != undefined && e.piece != undefined){e.piece.maxCD = 10}
		})

	board.AIwait = ()=>{return(Math.random()*4000)}
	board.AIblockWait = ()=>{return(Math.random()*4000+3000)}
}


	board.tiles[3+",0"].piece = new piece("pawn",3,0,"zombies",{"direction":"y+"})
	board.tiles[5+",0"].piece = new piece("pawn",5,0,"zombies",{"direction":"y+"})
	board.tiles[6+",0"].piece = new piece("pawn",6,0,"zombies",{"direction":"y+"})


	board.gameFunction = ()=>{
	board.iterations += 1
	let x = Math.floor(Math.random()*8)
	let y = board.topTile;
	while(board.tiles[x+","+y] == undefined || board.tiles[x+","+y].piece != undefined){
		y+=1
		if(y > 1){return;}
		
	}

	let name = board.spawnRates[0]

	if(board.spawningSequence){
		for(let i = board.spawningSequence.length-1; i>-1; i--){
			let spawn = board.spawningSequence[i]
			let rng = Math.random()
			if(rng< spawn.rate){
				name = spawn.type
				break;
			}
		}
	} else {
		let rng = Math.random()
		for(let i = 0; i < board.spawnRates.length/2;i++){
			if(rng < board.spawnRates[i*2+1]){name = board.spawnRates[i*2];break;}
		}
	}
	

	board.tiles[x+","+y].piece = new piece(name,x,y,"zombies",{"direction":"y+"})

	board.arrFuncs.pieceModifiers.forEach((e)=>{
		e(board.tiles[x+","+y].piece)
	})

	if(Math.random()>0.45 && board.extension1){
		let x = Math.floor(Math.random()*8)
		let y = board.tileExtensionBoarder-1
		while(Math.random()>0.4||board.tiles[x+","+y] != undefined){
			y-=1
		}
		if(board.tiles[x+","+y] == undefined){board.tiles[x+","+y] = {}
			tileSubscription.update(x+","+y)
			if(y < board.topTile){board.topTile=y}
			let tilePut = 0;
			for(let i = board.spawnRange[0]; i < board.spawnRange[1]; i++){
				if(board.tiles[i+","+y] != undefined){tilePut += 1}
			}
		if(tilePut > 6){board.tileExtensionBoarder -= 1;
			for(let i = 0; i < 8; i++){
				if(board.tiles[i+","+(board.tileExtensionBoarder+1)] == undefined){board.tiles[i+","+(board.tileExtensionBoarder+1)] = {"color":()=>{return("#404050")}}}
			}
		}
		}
	}
	gameSpecialInterval()
	Object.values(board.specialIntervals).forEach((e)=>{e()})
	}

	startGameInterval(camera.pieceFrequency)
}

function mainPieceDeath(ap){
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
}

function startGameInterval(f){
	clearInterval(gameInterval);
	gameInterval = setInterval(()=>{board.gameFunction()
	},f)
}

function stopGame(){
	specialRenderIn()
	tileSubscription.subscriptions = {}
	board.spawningSequence = undefined
	board.spawnRange = [0,8]
	board.arrFuncs.pieceModifiers = []
	board.AIwait = ()=>{return(10)}
	board.AIblockWait = ()=>{return(300)}
	board.extension1 = true
	camera.pieceFrequency = 1300
	board.specialIntervals = {}
	board.tileExtensionBoarder = 0
	clearInterval(gameInterval);
	board.tiles = {}
	board.pieces = new Set()
	board.happening = new Set()
	board.iterations = 0;
	camera.money = 0;
	camera.specialRenderOn = true
	if(camera.highScores[camera.gamemode]!== undefined && camera.highScores[camera.gamemode][0] < camera.score){
		camera.highScores[camera.gamemode][0] = camera.score
		if(camera.highScores[camera.gamemode][1] < camera.score){
			camera.highScores[camera.gamemode][1] = camera.score		
		}		
	}
	camera.score = 0;
	board.bottomTile = 11
	board.topTile = 0

	if(camera.cookies != false){
		let objk = Object.keys(camera.highScores)
		let val2 = {}

		objk.forEach((e)=>{
			val2[e]=camera.highScores[e][1]
		})
		document.cookie = "scores="+JSON.stringify(val2)+";path=/;";
	}

	gameStart = "mode"
}






















//touch handler

function mobileScale(x,md){
	let stb1 = screen_to_board(md[0],md[1])
	tileSize -= x/5
	if(tileSize < 4){tileSize = 4}
	camera.tileRsize = tileSize/50
	let stb2 = screen_to_board(md[0],md[1])
	camera.x += stb2[0] - stb1[0]
	camera.y += stb2[1] - stb1[1]


}

let pinchDist = -1
let pinchMdx = -1
let pinchMdy = -1
let mobileInverse = -1

function touchHandler(event)
{

	// console.log(event.type)
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

    // if(event.type == 'touchmove' &&event.touches.length == 2){
    // 	console.log(Math.hypot(
    // 		event.touches[0].pageX - event.touches[1].pageX,
    // 		event.touches[0].pageY - event.touches[1].pageY))
    // }

    if(event.type == 'touchmove' && event.touches.length == 2){
    	let newDist = Math.hypot(
    		event.touches[0].pageX - event.touches[1].pageX,
    		event.touches[0].pageY - event.touches[1].pageY);
    	let md = [(event.touches[0].clientX+event.touches[1].clientX)/2,(event.touches[0].clientY+event.touches[1].clientY)/2]

    	if(pinchDist != -1){
    		mobileScale(pinchDist - newDist,md)
    		camera.x -= (md[0]-pinchMdx)/tileSize*mobileInverse
    		camera.y -= (md[1]-pinchMdy)/tileSize*mobileInverse
    	}
    	pinchDist = newDist
    	pinchMdx = md[0]
    	pinchMdy = md[1]
    	return;
    }


    if(type !== "mouseup"){
    mouseX = event.touches[0].clientX
    mouseY = event.touches[0].clientY}


    var simulatedEvent = document.createEvent("MouseEvent");

    if(event.type == "touchend"){
       	console.log("t4")
       	pinchDist = -1
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
	onload : ()=>{soundLoaded = true;console.log("soundLoaded")}
}).toDestination();



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


//cache and shit
async function deleteCache() {
  try {
    // Get all cache keys
    const cacheKeys = await caches.keys();

    // Filter and delete cache entries with the name "my-cache"
    const deletePromises = cacheKeys.map(async (cacheKey) => {
      if (cacheKey === 'my-cache') {
        await caches.delete(cacheKey);
      }
    });

    // Wait for all cache entries to be deleted
    await Promise.all(deletePromises);

    console.log('Cache deleted successfully.');
  } catch (error) {
    console.error('Error deleting cache:', error);
  }
}

//noise n' stuff



function escaped(){if(gameStart == "lost"){
			stopGame()
			camera.playSound("escape")
			return;
		}
		camera.escaped = !camera.escaped
		camera.escapePos = [camera.x,camera.y]
		camera.playSound("escape")
	}



//cookies n' smores
// document.addEventListener('unload',()=>{
	
// })
function saveCookies(d){
	if(camera.cookies == false){return}
	let val = {
		"sound":camera.soundOn,
		"render":camera.pieceRender,
		"size":tileSize,
		"menuSize":camera.menuButtonSize,
		"volume":Math.round(Tone.Master.volume.value),
		"date":d
	}
	let objk = Object.keys(camera.highScores)
	let val2 = {}

	objk.forEach((e)=>{
		val2[e]=camera.highScores[e][1]
	})

	document.cookie = "settings="+JSON.stringify(val)+";path=/;";
	document.cookie = "scores="+JSON.stringify(val2)+";path=/;";
	console.log("settings="+JSON.stringify(val)+";scores="+JSON.stringify(val2)+";path=/;")
	console.log(document.cookie)
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function loadCookies(){
	let val1 = getCookie("settings")
	if(val1 != ""){
		let val = JSON.parse(val1)
		camera.soundOn = val.sound
		camera.pieceRender = val.render
		tileSize = val.size

		camera.tileRsize = tileSize/50
		camera.menuButtonSize = val.menuSize
		camera.cookies = val.date

		Tone.Master.volume.value = val.volume?val.volume:0
	}
	let val2 = getCookie("scores")
	if(val2 != ""){
		let val = JSON.parse(val2)
		let objk = Object.keys(val)
		objk.forEach((e)=>{
			camera.highScores[e][1] = camera.highScores[e][1]<val[e]?val[e]:camera.highScores[e][1]
		})
	}
	
	return(val1)
}
loadCookies()

function deleteCookies(){
	document.cookie = "settings=;scores=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
	document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}












