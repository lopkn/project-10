let myCanvas = document.getElementById("myCanvas")

let Width = window.innerWidth
let Height = window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"

let CTX = {"main":myCanvas.getContext("2d")}
let ctx = CTX.main

let mouseX = 0
let mouseY = 0

document.addEventListener("mousedown",()=>{
	FIRSTTOUCH = false
	handle.msd = true
})
document.addEventListener("mouseup",()=>{
	handle.msd = false
})

onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
// let auds = {
// 	"1":new "./music/Note1.mp3",
// 	"2":"./music/Note2.mp3",
// 	"3":"./music/Note3.mp3",
// 	"4":"./music/Note4.mp3",
// 	"5":"./music/Note5.mp3",
// 	"6":"./music/Note6.mp3",
// 	"7":"./music/7.mp3",
// 	"8":"./music/8.mp3",
// 	"9":"./music/9.mp3",
// 	"10":"./music/10.mp3",
// 	"11":"./music/11.mp3",
// 	"12":"./music/12.mp3",
// 	"13":"./music/13.mp3",
// 	"14":"./music/14.mp3",
// 	"15":"./music/15.mp3",
// 	"16":"./music/16.mp3",
// 	"17":"./music/17.mp3",
// 	"18":"./music/18.mp3",
// 	"19":"./music/19.mp3",
// 	"20":"./music/20.mp3",
// 	"21":"./music/21.mp3",
// 	"22":"./music/22.mp3",
// 	"23":"./music/23.mp3",
// 	"24":"./music/24.mp3",
// 	"25":"./music/25.mp3",
// 	"26":"./music/26.mp3",
// 	"27":"./music/27.mp3",
// 	"28":"./music/28.mp3",
// 	"29":"./music/29.mp3",
// 	"30":"./music/30.mp3",
// 	"31":"./music/31.mp3",
// 	"32":"./music/32.mp3",
// 	"33":"./music/33.mp3",
// 	"34":"./music/34.mp3",
// 	"35":"./music/35.mp3",
// 	"36":"./music/36.mp3",
// 	"37":"./music/37.mp3",
// 	"38":"./music/38.mp3",
// 	"39":"./music/39.mp3",
// 	"R18":"./music/R18.mp3",
// }
let auds = {
	"1":new Audio("./music/Note1.mp3"),
	"2":new Audio("./music/Note2.mp3"),
	"3":new Audio("./music/Note3.mp3"),
	"4":new Audio("./music/Note4.mp3"),
	"5":new Audio("./music/Note5.mp3"),
	"6":new Audio("./music/Note6.mp3"),
	"7":new Audio("./music/7.mp3"),
	"8":new Audio("./music/8.mp3"),
	"9":new Audio("./music/9.mp3"),
	"10":new Audio("./music/10.mp3"),
	"11":new Audio("./music/11.mp3"),
	"12":new Audio("./music/12.mp3"),
	"13":new Audio("./music/13.mp3"),
	"14":new Audio("./music/14.mp3"),
	"15":new Audio("./music/15.mp3"),
	"16":new Audio("./music/16.mp3"),
	"17":new Audio("./music/17.mp3"),
	"18":new Audio("./music/18.mp3"),
	"19":new Audio("./music/19.mp3"),
	"20":new Audio("./music/20.mp3"),
	"21":new Audio("./music/21.mp3"),
	"22":new Audio("./music/22.mp3"),
	"23":new Audio("./music/23.mp3"),
	"24":new Audio("./music/24.mp3"),
	"25":new Audio("./music/25.mp3"),
	"26":new Audio("./music/26.mp3"),
	"27":new Audio("./music/27.mp3"),
	"28":new Audio("./music/28.mp3"),
	"29":new Audio("./music/29.mp3"),
	"30":new Audio("./music/30.mp3"),
	"31":new Audio("./music/31.mp3"),
	"32":new Audio("./music/32.mp3"),
	"33":new Audio("./music/33.mp3"),
	"34":new Audio("./music/34.mp3"),
	"35":new Audio("./music/35.mp3"),
	"36":new Audio("./music/36.mp3"),
	"37":new Audio("./music/37.mp3"),
	// "38":new Audio("./music/38.mp3"),
	// "39":new Audio("./music/39.mp3"),
	"R18":new Audio("./music/R18.mp3"),
}

let objkt = Object.keys(auds)
objkt.forEach((e)=>{
	auds[e].preload = "auto"
	auds[e].load()
})

function playSound(n) {
	let sound = auds[n]
	if(sound == undefined){return}
  	let click=sound.cloneNode();
    console.log(n)
    click.play();
}

let song1 = {
	"info":{"repeat":256},
	"0":{
		"0":[29,17],
		"4":[21],
		"6":[24],
		"8":[17],
		"12":[21]
	},
	"1":{
		"0":[31,17],
		"2":[33],
		"4":[21],
		"6":[29],
		"8":[17],
		"10":[24],
		"12":[21]
	},
	"2":{
		"0":[27,13],
		"4":[17],
		"6":[25],
		"8":[19],
		"12":[20]
	},
	"3":{
		"0":[19],
		"4":[17],
		"8":[13],
		"12":[12,24]
	},
	"4":{
		"0":[29,17],
		"4":[21],
		"6":[24],
		"8":[17],
		"12":[21]
	},
	"5":{
		"0":[31,17],
		"2":[33],
		"4":[21],
		"6":[29],
		"8":[17],
		"10":[24],
		"12":[21]
	},
	"6":{
		"0":[27,13],
		"4":[17],
		"6":[25],
		"8":[19],
		"12":[20]
	},
	"7":{
		"0":[19,22],
		"4":[17,24],
		"8":[13,25],
		"12":[12,27]
	},
	"8":{
		"0":[29,10],
		"4":[13],
		"6":[25],
		"8":[20],
		"12":[13]
	},
	"9":{
		"0":[29,10],
		"2":[31],
		"4":[12],
		"6":[27],
		"8":[16],
		"10":[22],
		"12":[12]
	},
	"10":{
		"0":[24,5],
		"4":[8],
		"8":[12],
		"12":[17],
		"14":[20]
	},
	"11":{
		"0":[29,5],
		"4":[8],
		"8":[12],
		"12":[17]
	},
	"12":{
		"0":[25,10],
		"4":[13],
		"8":[32,20],
		"12":[13],
		"14":[29]
	},
	"13":{
		"0":[31,12],
		"4":[16],
		"8":[19],
		"12":[28,24]
	},
	"14":{
		"0":[29,5],
		"4":[8],
		"8":[12],
		"12":[17]
	},
	"15":{
		"0":[17],
		"4":[19],
		"8":[20],
		"12":[24]
	}
}

//C 1,13,25,37 :E 5,17,29 : F 6,18,30 : G 8,20,32 : A 10,22,34

let song2 = {
	"info":{"repeat":256},
	"0":{
		"0":[13,37],
		"2":[20],
		"4":[24,37],
		"6":[25],
		"8":[36],
		"10":[20,36],
		"12":[24],
		"14":[25]
	},
	"1":{
		"0":[13,32],
		"2":[20],
		"4":[24],
		"6":[25],
		"8":[27],
		"10":[29],
		"12":[25],
		"14":[20]
	},
	"2":{
		"0":[13,37],
		"2":[20],
		"4":[24,37],
		"6":[25,36],
		"10":[20,36],
		"12":[24],
		"14":[25]
	},
	"3":{
		"0":[13,32],
		"2":[20],
		"4":[24],
		"6":[25],
		"8":[27],
		"10":[29],
		"12":[25],
		"14":[20]
	},
	"4":{
		"0":[10,37],
		"2":[17],
		"4":[24,37],
		"6":[25],
		"8":[36],
		"10":[17,36],
		"12":[24],
		"14":[25]
	},
	"5":{
		"0":[10,34],
		"2":[17],
		"4":[24],
		"6":[25],
		"8":[27],
		"10":[29],
		"12":[25],
		"14":[24]
	},
	"6":{
		"0":[10,37],
		"2":[17],
		"4":[24,37],
		"6":[25,36],
		"10":[17,36],
		"12":[24],
		"14":[25]
	},
	"7":{
		"0":[10,34],
		"2":[17],
		"4":[24],
		"6":[25],
		"8":[27],
		"10":[29],
		"12":[25],
		"14":[22]
	},
	"8":{
		"0":[6,34],
		"2":[13],
		"4":[18,34],
		"6":[22],
		"8":[32],
		"10":[13,32],
		"12":[18],
		"14":[22]
	},
	"9":{
		"0":[6,30],
		"2":[13],
		"4":[18],
		"6":[22],
		"8":[20],
		"10":[22],
		"12":[20],
		"14":[13]
	},
	"10":{
		"0":[6,34],
		"2":[13],
		"4":[18,34],
		"6":[22,32],
		"10":[13,32],
		"12":[20],
		"14":[22]
	},
	"11":{
		"0":[6,30],
		"2":[13],
		"4":[18],
		"6":[22],
		"8":[20,25],
		"10":[22,30],
		"12":[20,15],
		"14":[13]
	},
	"12":{
		"0":[8,36],
		"2":[15],
		"4":[20,36],
		"6":[24],
		"8":[34],
		"10":[15,34],
		"12":[20],
		"14":[24]
	},
	"13":{
		"0":[8,32],
		"2":[15],
		"4":[20],
		"6":[24],
		"10":[15],
		"12":[20],
		"14":[24]
	},
	"14":{
		"0":[8,36],
		"2":[15],
		"4":[20,36],
		"6":[24,34],
		"10":[15],
		"12":[20,34],
		"14":[24]
	},
	"15":{
		"0":[8,32],
		"2":[15],
		"4":[20],
		"6":[24],
		"8":[27],
		"10":[15,32],
		"12":[20,27],
		"14":[24]
	}
}
//C 1,13,25,37 :E 5,17,29 : F 6,18,30 : G 8,20,32 : A 10,22,34
let currentAud = [0,0]


function playSound2(s){
	currentAud[1] = new Audio(auds[s])
	currentAud[1].play()
}



class song{
	static AintervalTime = 7
	static intervalTime = 7
	static interval = 0
	static counter = -1
	static currentSong = song2

	static repeat(){
		this.counter += 1
		let A = this.counter%this.currentSong.info.repeat
		let b = A%16
		let a = Math.floor(A/16)
		// console.log(a,b)

		if(this.currentSong[a] == undefined){return}

		let arr = this.currentSong[a][b]
		if(arr == undefined){return}
		arr.forEach((e)=>{
			playSound(e)
		})

		
	}
	static start(){
		// this.interval = setInterval(()=>{this.repeat()},this.intervalTime)
	}

	static changeSong(s){
		this.currentSong = s
		this.counter = -1
	}

}





let mainI = setInterval(()=>{Amain();mainCounter++},15)
let mainCounter = 0
function Amain(){
	if(mainCounter%song.intervalTime === 0){
		song.repeat()
		console.log("TEST")
	}
	if(mainCounter%50 === 0){
		main()
	}
	
}



// function playForce(a,s){
// 	playSound(s)
// 	currentAud[0] = a
// }

// let interval = setInterval(()=>{

// 	if(currentAud[0] > 0){
// 		currentAud[0] -= 1

// 		if(currentAud[0] > 50){
// 			currentAud[1].playbackRate = 1
// 		}else {
// 			currentAud[1].playbackRate = (currentAud[0]/50)*0.4+0.6
// 		}

// 	} else {
// 		if(currentAud[1] !== 0){
// 		// currentAud[1].pause()
// 	}
// 	}

// },100)

// setTimeout(()=>{song.start()},1000)



class vectorFuncs{
	static vectorizor(px,py,vx,vy){
		//this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
		//xb+ya,yb-xa
		return([px*vy+py*vx,py*vy-px*vx])
	}
	static INvectorizor(px,py,vx,vy){
		//xb-ya,yb+xa
		return([px*vy-py*vx,py*vy+px*vx])
	}
	static ShatterComponents(vx,vy,dx,dy){
		let normalized = this.originVectorNormalize(dx,dy)
		let invectorized = this.INvectorizor(vx,vy,normalized[0],normalized[1])

		let tyaxis = this.vectorizor(normalized[0],normalized[1],1,0)

		let resultx = [invectorized[1]*normalized[0],invectorized[1]*normalized[1]]
		let resulty = [invectorized[0]*tyaxis[0],invectorized[0]*tyaxis[1]]
		return([resultx,resulty,[invectorized[1],invectorized[0]]])

	}

	static ShComp(vx,vy,dx,dy){
		let normalized = this.originVectorNormalize(dx,dy)

		let dp = this.dotProduct(vx,vy,normalized[0],normalized[1])

		let n2 = [normalized[1],-normalized[0]]

		let dp2 = this.dotProduct(vx,vy,n2[0],n2[1])
		let resultx = [normalized[0]*dp,normalized[1]*dp]
		let resulty = [n2[0]*dp2,n2[1]*dp2]

		return([resultx,resulty,[dp,dp2]])

	}

	static dotProduct(x1,y1,x2,y2){
		return(x1*x2+y1*y2)
	}

	static originVectorNormalize(vx,vy){
		let d = Math.sqrt(vx*vx+vy*vy)
		return([vx/d,vy/d])
	}
}

function distance(x,y,a,b){
	let c = a-x
	let d = b-y
	return(Math.sqrt(c*c+d*d))
}

let mainLoop = setInterval(()=>{main()},50)



function main(){
	if(!document.hasFocus() && !G){

		return}
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,Width*2,Height*2)


	

	handle.draw()

	ctx.strokeStyle = "#F07040"
	ctx.lineWidth = 3
	ctx.beginPath()
	ctx.moveTo(Width*0.8-7,Height*0.4-7*40)
	ctx.lineTo(Width*0.8-7,Height*0.4)
	ctx.stroke()

	for(let i = -10; i < 34; i++){

	let A = (song.counter+i)%song.currentSong.info.repeat
	let b = A%16
	let a = Math.floor(A/16)

	if(song.currentSong[a] !== undefined && song.currentSong[a][b] !== undefined){
		let arr = song.currentSong[a][b]
		arr.forEach((e)=>{
			ctx.fillStyle = "rgb(0,255,"+(e*7)+")"
			ctx.fillRect(Width*0.8+i*7,Height*0.4-7*e,5,5)
		})
	}
	}
	

}

class handle{
	static middle = [Width*0.4+145,Height*0.4+85]
	static handle = [Width*0.4+145,Height*0.4+85-70]
	static pull = [0,0]
	static pullstat = [0,0]
	static wind = 0
	static msd = false

	static draw(){

		let c = this.wind > 120? 150 : this.wind+30
		if(!this.msd){
			if(this.wind > 0){
				this.wind -= 1
			}
		}else{
			let d = distance(0,0,this.pull[0],this.pull[1])*10
			c = d > 120 ? 150 : d + 30
		}

		if(this.pullstat[1] > 0 && this.msd){
			c = 30
		}

		if(c < 150){
			song.intervalTime = song.AintervalTime + Math.floor(150/(c-30))
		} else {
			song.intervalTime = song.AintervalTime
		}

		ctx.fillStyle = "rgb("+c+","+c+","+c+")"
		ctx.fillRect(Width*0.4,Height*0.4,250,170)

		
		ctx.lineWidth = 5
		ctx.beginPath()
		ctx.moveTo(this.middle[0],this.middle[1])
		ctx.lineTo(this.handle[0],this.handle[1])
		ctx.stroke()

		if(FIRSTTOUCH){
		ctx.fillStyle = "#008000"
		} else {
			ctx.fillStyle = "white"
		}
		ctx.beginPath()
		ctx.arc(this.handle[0], this.handle[1], 10, 0, 2 * Math.PI);
		ctx.fill()
		ctx.stroke()

		let D = distance(0,0,this.pull[0],this.pull[1])
		if(this.msd){
			this.getComp()

			
			if(distance(mouseX,mouseY,this.middle[0],this.middle[1])>120){
				this.pull[0] *= 50/distance(mouseX,mouseY,this.middle[0],this.middle[1])
				this.pull[1] *= 50/distance(mouseX,mouseY,this.middle[0],this.middle[1])
			}

		if(this.pullstat[1] < 0){
			if(D>20){
				this.pull = vectorFuncs.originVectorNormalize(this.pull[0],this.pull[1])
				this.pull[0] *= 20
				this.pull[1] *= 20
				if(this.wind < 120){
					this.wind = 120
				}
			}
		}else{
			this.wind = Math.floor(this.wind + D*0.5)
		}
			
		} else {

			if(this.wind > 2)
			{
				if(this.pullstat[1] < 0 && this.wind < 130){
					let n = vectorFuncs.originVectorNormalize(-(this.handle[1]-this.middle[1]),this.handle[0]-this.middle[0])
					this.pull[0] = n[0]*D*0.99
					this.pull[1] = n[1]*D*0.99
				}else{
					let n = vectorFuncs.originVectorNormalize(-(this.handle[1]-this.middle[1]),this.handle[0]-this.middle[0])
					this.pull[0] = n[0]
					this.pull[1] = n[1]
				}
			} else {
				this.pull[0] *= 0.9
				this.pull[1] *= 0.9
			}
		}

		this.apull()
	}

	static apull(){
		this.handle[0] += this.pull[0]*0.7
		this.handle[1] += this.pull[1]*0.7

		// let dx = this.handle[0] - this.middle[0]
		// let dy = this.handle[1] - this.middle[1]
		let n = vectorFuncs.originVectorNormalize(this.handle[0]-this.middle[0],this.handle[1]-this.middle[1])
		this.handle = [this.middle[0]+n[0]*70,this.middle[1]+n[1]*70]

	}

	static getComp(){

		let n = vectorFuncs.originVectorNormalize(this.handle[0]-this.middle[0],this.handle[1]-this.middle[1])
		let shc = vectorFuncs.ShComp(mouseX - this.handle[0],mouseY-this.handle[1],n[0],n[1])
		shc[1][0] *= 0.5
		shc[1][1] *= 0.5
		this.pull = shc[1]
		this.pullstat = shc[2]
	}
}


let G = false
let FIRSTTOUCH = true
function touchHandler(event)
{	
	G = true
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        default:           return;
    }

    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);
    if(!FIRSTTOUCH){
    event.preventDefault();
    handler.wind = 100
	}
}


function init(){
    document.addEventListener("touchstart", touchHandler);
    document.addEventListener("touchmove", touchHandler);
    document.addEventListener("touchend", touchHandler);
    document.addEventListener("touchcancel", touchHandler);    
}