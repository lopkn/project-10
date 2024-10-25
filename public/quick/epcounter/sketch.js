let myCanvas = document.getElementById("myCanvas")

let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.style.zIndex = 5
myCanvas.width = Width
WidthM = Width/2
myCanvas.height = Height
HeightM = Height/2
myCanvas.style.position = "absolute"



var SOUND = {}

function init(){
	initSounds([])
}

function initSounds(arr){
Tone.Transport.start();
Tone.Transport.scheduleRepeat((time) => {
    music.runbar(time)
}, 1.2)

{	let audio = new Tone.Sampler({
	urls: {
		"C4":"./../../soundEffects/sinC4.mp3",
		"F3":"./../../soundEffects/sinF3.mp3",
	},
}).toDestination();
		SOUND["sinC4"] = audio

}
	arr.forEach((E,i)=>{
		let e = "./../../soundEffects/"+E+".mp3"
		let audio = new Tone.Sampler({
	urls: {
		"C4":e,
	},
}).toDestination();
		SOUND[E] = audio
	})
}

function normalRandom(mean, stderr) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stderr + mean;
}

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

function mtn(midiNumber) {
    return Tone.Frequency(midiNumber, "midi");
}


class music{
	static bar = {"scheduled":false,"position":0,"noteTimes":[60,64,67,72,71,72,67,64],"interval":0.3,"relativity":0} //64 for now
	static stanza = {"repeats":0,"position":0,"bars":[]}
	static counter = 0
	static synth = new Tone.PolySynth(Tone.Synth,4).toDestination(); // Connect to audio output

	static reverb = new Tone.Reverb({
    decay: 20, // Duration of the reverb tail
    preDelay: 0.3,
    wet: 0.7
}).toDestination();

	static runbar(time){
		this.counter += 1
		// if(this.counter%2==0){return}
		if(Math.random()>0.3){return}
		// this.scheduleBar(this.bar,time)
		// this.playBell(Math.floor(normalRandom(50,7)))

		this.playBellSynthChord(Math.floor(normalRandom(40,7)))
	}

	static scheduleBar(bar,time){
		if(!bar){bar = this.bar}

			bar.noteTimes.forEach((e,i)=>{
				if(e===undefined){return}
				Tone.Transport.schedule((time) => {
			    this.synth.triggerAttackRelease(mtn(e+bar.relativity), "4n", time);
				}, time + bar.interval*i);
			})
		bar.scheduled = true
		// this.generateNextBar(bar)
		this.getBarStanza(this.stanza)
	}

	static generateNextBar(oldBar){
		if(!oldBar){oldBar = this.bar}
			let newbar = {"scheduled":false,"position":oldBar.position+1,"noteTimes": oldBar.noteTimes,"interval":0.25}
			let rnd = Math.floor(Math.random()*6-3)
			newbar.noteTimes.forEach((e,i)=>{newbar.noteTimes[i] = e+rnd})
			// this.bar = newbar
			return(newbar)
	}
	static generateDefaultBar(r){
		return({"scheduled":false,"position":0,"noteTimes":[50,54,57,62,61,62,57,54],"interval":0.3,"relativity":r})
	}
	static getBarStanza(stanza){
			stanza.position += 1
			this.bar = stanza.bars[stanza.position]
		if(stanza.position+1 >= stanza.repeats){
			this.generateNextStanza(stanza)
		}
	}
	static generateNextStanza(oldStanza){
		if(!oldStanza){oldStanza = this.stanza}
			this.stanza = {"repeats":8,"position":-1,"bars":[],"relatives":[0,0,-2,-2,-4,-4,-2,-2]}
			let rnd = Math.floor(Math.random()*4-2)
			for(let i = 0; i < 8; i++){
				this.stanza.bars.push(this.generateDefaultBar(this.stanza.relatives[i]+rnd))
			}
	}
	static playBell(note,vel=1){
			this.synth.triggerAttackRelease(mtn(note),0.7,undefined,vel);
			// this.synth.triggerAttackRelease(mtn(note+4),0.7,undefined,0.2);
	}

	static checkCollide(note,arr,dist=1){

		let mod = note%12
		for(let i = 0; i < arr.length; i++){
			let resd = Math.abs(arr[i]-mod)%12
			if(resd == dist || resd == 12-dist){
				return(true)
			}
		}
		return(false)
	}


	static playBellSynthChord(note,vel=1){
		let notes = [note]
		this.playBell(note,vel)
		while(note < 75)
		if(Math.random() > 0.5){
			let rel = 4
			note += rel
			if(this.checkCollide(note,notes)){note -= rel;continue}
			if(this.checkCollide(note,notes,2)){note -= rel;continue}
			vel *= 0.8
			this.playBell(note,vel)
			notes.push(note)
		} else if(Math.random() > 0.5){
			let rel = 5
			note += rel
			if(this.checkCollide(note,notes)){note -= rel;continue}
			if(this.checkCollide(note,notes,2)){note -= rel;continue}
			vel *= 0.8
			this.playBell(note,vel)
			notes.push(note)
		} else {
			let rel = Math.floor(Math.random()*8)
			note += rel
			if(this.checkCollide(note,notes)){note -= rel;continue}
			if(this.checkCollide(note,notes,2)){note -= rel;continue}
			vel *= 0.8
			this.playBell(note,vel)
			notes.push(note)
		}
		return(notes)
	}
}

music.synth.connect(music.reverb)
music.synth.set({
    oscillator: {
        type: 'sine4' 
    },
    envelope: {
		    attack: 0.005,
		    decay: 0.5,
		    sustain:1,
		    release:2
    },
    volume: -20
})
music.generateNextStanza()


NoteRelativity = {
	"major":{"0":0,"1":2,"2":4,"3":5,"4":7,"5":9,"6":11,"7":12},
	// "nathan"
	"mainor":{"0":0,"1":2,"2":3,"3":5,"4":7,"5":8,"6":11,"7":12},
}

let lastnote = 0
let updown = false
function startPlay(){
	setInterval((e)=>{
	// let note=Math.floor(15+normalRandom(0,5));
		let note 
		let rnum
		while (note == lastnote || (updown?(note>lastnote):(note<lastnote)) || note == undefined){
			rnum = Math.floor(Math.random()*8)
			note = 1+NoteRelativity.major[rnum]
		}
		updown = !updown
		lastnote = note		
		console.log(rnum)
	SOUND.sinC4.triggerAttack(soundMapper[note]);},250)
}



// get cos/sin from time
// cos(COUNTER/100)

let sounds = false

let soundNameDict = {
	"Sf3":"./../../soundEffects/sinF3.mp3",
	"Sc4":"./../../soundEffects/sinC4.mp3",
}

date_disruptor = 0

let soundDict = {
	"Sf3":[],
	"Sc4":[]
}

function ps(s){
	if(sounds === false){
		return
	}
	let arr = soundDict[s]
	for(let i = 0; i < arr.length; i++){
		if(arr[i].paused){
			arr[i].play()
			return("this");
		} else {
		}
	}
	let a = new Audio(soundNameDict[s])
	arr.push(a)
	a.play()
	return(a)
}

let ctx = myCanvas.getContext("2d")

let GTOGGLE = false


ctx.textAlign = 'center'

class comparer{


	static disabled = {
		"0":0,
		"1":0,
		"2":0,
		"3":0,
		"4":0,
		"5":0,
		"6":0,
		"7":0,
		"8":0,
		"9":0
	}
	static last = "" + (Date.now()+date_disruptor)

	static compare(d){
		for(let i = 1; i < d.length+1; i++){
			let j = d.length-i

			if(d[j] !== this.last[j]){

				if(d[j] == 5){
					this.update(i+0.5)
				} else {
				this.update(i)
				}
			}

		}

		this.last = d
	}

	static update(t,s){
		let c;
		let a = WidthM + 300 - Math.floor(t)*40

		if(this.disabled[t] > 0){
			this.disabled[t] -= 1
			return
		}
		if(t > 4)
		console.log(t)

		switch(t){
		case 1:

			break;
		case 2:
			
			break;
		case 3:
			c = new explosionR(Math.random()*Width,Math.random()*Height,"rgb(2,"+(125+Math.random()*125)+",255)")
			c.actLife = Math.random()*20+20
			c.size += 2
			parr.push(c)
			break;
		case 8:
			let G = setInterval(()=>{
				c = new liner(a,Height/2-30,4,7,0)
				c.maxActLife = 40
				c.vx += Math.random()*216-108
				c.vy += Math.random()*216-108
				parr.push(c)
			},500)

			setTimeout(()=>{clearInterval(G)},100000)

			break;
		case 7:

			if(GTOGGLE){
				return
			}
			// GTOGGLE = true
			c = new liner(a,Height/2-30,5,6,0)
			c.maxActLife = 10000000
			c.vx += Math.random()*50-25
			c.vy += Math.random()*50-25
			c.lineLife = 12000
			c.size += 10
			c.counter = 18
			c.lineUp = 0
			c.myDat = 2
			parr.push(c)


			break;
		case 7.5:

			if(GTOGGLE){
				return
			}
			// GTOGGLE = true
			c = new liner(a,Height/2-30,5,7,0)
			c.maxActLife = 10000000
			c.vx += Math.random()*50-25
			c.vy += Math.random()*50-25
			c.lineLife = 12000
			c.size += 10
			c.counter = 18
			c.lineUp = 0
			c.myDat = 2
			parr.push(c)


			break;
		case 5:
			for(let i = 0; i < 10; i++){
				c = new rollingBall(a,Height/2-30,Math.random()*4-2,Math.random()*4-2)
				c.actLife *= Math.random()*2+1.2
				parr.push(c)
			}
			break;
		case 5.5:
			for(let i = 0; i < 15; i++){
				c = new rollingBall(a,Height/2-30,Math.random()*8-4,Math.random()*8-4)
				c.actLife *= Math.random()*2+1.2
				parr.push(c)
			}
			c = new rollingBall(a,Height/2-30,Math.random()*8-4,Math.random()*8-4)
				c.actLife = 6000+Math.random()*6200
				c.dissapearLife = c.actLife/10
				c.size += 20
				c.trailer = true
				parr.push(c)
			break;
		case 6.5:

				c = new explosionR(a,Height/2-30,"#FFFF00")
				parr.push(c)

				// for(let i = 0; i < 5; i++){
				// 	c = new liner(a,Height/2-30,4,3)
				// 	c.maxActLife = 120
				// 	c.vx += Math.random()*216-108
				// 	c.vy += Math.random()*216-108
				// 	parr.push(c)
				// }

				for(let i = 0; i < 15; i++){
					let r= Math.random()*2000+200
					setTimeout(()=>{
						c = new explosionR(a+Math.random()*r/1.5-r/3,Height/2-30+Math.random()*r/1.5-r/3,"#FFFF00")
						c.actLife = 80+Math.random()*150
						parr.push(c)
					},r)
				}

				for(let i = 0; i < 20; i++){
				c = new rollingBall(a,Height/2-30,Math.random()*16-8,Math.random()*16-8)
				c.actLife *= Math.random()*2+1.2
				parr.push(c)
				if(i < 3){
					c = new rollingBall(a,Height/2-30,Math.random()*8-4,Math.random()*8-4)
					c.actLife = 6000+Math.random()*6200
					c.size += 14
					c.trailer = true
					parr.push(c)
				}
				}

				for(let i = 0; i < 720; i++){
					let r =  Math.random()*6000
				setTimeout(()=>{c = new explosionR(a+Math.random()*r/2-r/4,Height/2+Math.random()*r/2-r/4,"rgb(2,"+(125+Math.random()*125)+",255)",0.5)
				c.actLife = Math.random()*60+30
				c.size += 8
				parr.push(c)},r+1000)


				}
			break;
		case 6:

				c = new explosionR(a,Height/2-30,"#FFFF00")
				parr.push(c)

				for(let i = 0; i < 35; i++){
					let r= Math.random()*2000+200
					setTimeout(()=>{
						c = new explosionR(a+Math.random()*r/1.5-r/3,Height/2-30+Math.random()*r/1.5-r/3,"#FFFF00")
						c.actLife = 80+Math.random()*150
						parr.push(c)
					},r)
				}

				for(let i = 0; i < 30; i++){
				c = new rollingBall(a,Height/2-30,Math.random()*16-8,Math.random()*16-8)
				c.actLife *= Math.random()*2+1.2
				parr.push(c)
				}

				for(let i = 0; i < 360; i++){
					let r =  Math.random()*3000
				setTimeout(()=>{c = new explosionR(a+Math.random()*r/2-r/4,Height/2+Math.random()*r/2-r/4,"rgb(2,"+(125+Math.random()*125)+",255)")
				c.actLife = Math.random()*40+20
				c.size += 5
				parr.push(c)},r+1000)


				}
			break;
		case 4:
			c = new liner(a,Height/2-30,4,1,0)
			c.maxActLife = 40
			c.vx += Math.random()*216-108
			c.vy += Math.random()*216-108
			parr.push(c)
			break;
		case 4.5:
			for(let i = 0; i < 5; i++){
				c = new liner(a,Height/2-30,4,1,0)
				c.maxActLife = 40
				c.vx += Math.random()*216-108
				c.vy += Math.random()*216-108
				parr.push(c)
			}
			break;
		}

	

	}

}

class explosionR{
	constructor(x,y,color,speed,s2){
		this.x = x
		this.speed = speed?speed:1
		this.s2 = s2?s2:1
		this.y = y
		this.color = color
		this.size = 3
		this.actLife = 600
		this.counter = 0
		this.following = false
		this.basename = "explosionR"
	}

	update(){
		this.size += this.speed
		this.actLife -= this.s2
	}
	draw(){
		ctx.strokeStyle = this.color
		ctx.lineWidth = 1 + this.actLife/10
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.stroke()
		if(this.actLife < 0){
			return('del')
		}
	}
}


class rollingBall{


	constructor(x,y,vx,vy){
		this.x = x
		this.y = y
		this.vx = vx
		this.trailer = false
		this.vy = vy
		this.size = 3 + Math.random()*3
		this.actLife = 400
		this.dissapearLife = 40
		this.counter = 0
		this.following = false
		this.mover = false
		this.basename = "ball"
		this.mass = this.size * this.size
	}


	update(){
		this.x += this.vx
		this.y += this.vy

		if(this.mover){
			this.vx += Math.random()*this.mover-this.mover-2
			this.vy += Math.random()*this.mover-this.mover-2
			this.vx *= 0.99
			this.vy *= 0.99
		}


		if(this.x < 0 || this.x > Width){
			this.vx *= -1
			if(this.trailer){
				ps("Sc4")
			}
		}
		if(this.y < 0 || this.y > Height){
			this.vy *= -1
			if(this.trailer){
			ps("Sf3")}
		}
		// if(this.invincible){this.invincible-=1}
		this.actLife -= 1
		this.counter += 1

		if(distance(this.vx,this.vy,0,0) < 0.1){
			this.actLife -= this.size/10
		}


		if(this.trailer && Math.random()>0.8){
			let c = new explosionR(this.x,this.y,"rgb(2,"+(125+Math.random()*125)+",255)",0.2-Math.random()*0.16,0.3-Math.random()*0.2)
			c.actLife = Math.random()*20+10
			c.size += 12
			parr.push(c)
		}

	}

	draw(){

		ctx.strokeStyle = Math.random()>0.5?"#FFB0FF":"#FFFFFF"
		ctx.lineWidth = 1
		ctx.fillStyle = "rgba(255,0,0,"+(this.actLife/this.dissapearLife)+")"
		if(this.actLife < this.dissapearLife){
			ctx.lineWidth = this.actLife/this.dissapearLife
		}
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.fill()
		ctx.stroke()
		if(this.actLife < 0){
			return('del')
		}
	}

	//credit to daniel 
}


class liner{

	constructor(x,y,type,colType,following){
		this.x = x
		this.y = y
		this.vx = 0
		this.vy = 0
		this.size = 3

		this.nvx = 0
		this.nvy = 0

		this.oldPath = []
		this.lineLife = 100
		this.actLife = 0
		this.maxActLife = 10000000
		this.counter = 0
		this.type = type
		this.colType = colType
		this.bounded = false
		this.following = false
		this.basename = "liner"
		this.mass = this.size

		if(type == 5){
			this.nonPlayerControllable = true
		} else if(type == 6){
			this.radius = Math.random()*8+0.2
			if(Math.random()>0.5){this.radius*=-1}
		}



		return(this)
	}


	update(){
		this.counter += 1
		let updated = false

		if(this.following || ctoggle && !this.nonPlayerControllable){
		let d = distance(this.x,this.y,mouseX,mouseY)
			this.nvy -= (this.y - mouseY)/d*0.4
			this.nvx -= (this.x - mouseX)/d*0.4
		}

		if(this.type == 0){ //small line
			this.x += this.vx
			this.y += this.vy
			this.vx += Math.random()-0.5
			this.vy += Math.random()-0.5
			this.vx += this.nvx
			this.vy += this.nvy
			this.nvx = 0
			this.nvy = 0
			updated = true

		} else if(this.type == 1){ //more spontaneous small line
			if(this.counter%5 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0
				this.vx += (Math.random()-0.5)*5
				this.vy += (Math.random()-0.5)*5
				updated = true
				
			}
		} else if(this.type == 2){ // slower electric small line
			if(this.counter%15 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0	
				this.vx += (Math.random()-0.5)*15
				this.vy += (Math.random()-0.5)*15
				updated = true
				
			}
		} else if(this.type == 3){  //grower
			if(this.counter%15 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0
				this.size += 0.2
				this.vx += (Math.random()-0.5)*15
				this.vy += (Math.random()-0.5)*15
				updated = true
			}
		} else if(this.type == 4){ //lightning
			if(this.counter%5 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0
				this.size += 0.6
				this.vx += (Math.random()-0.5)*55
				this.vy += (Math.random()-0.5)*55
				updated = true
			}
		} else if(this.type == 5){ //tree
			if(this.counter%500 == 0){
				this.mass = Infinity
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0
				this.vx += (Math.random()-0.5)*55
				this.vy += (Math.random()-0.5)*55

				this.lineUp += 1
				if(this.lineUp%this.myDat == 0 && this.bounded === false){
					let c = new liner(this.x,this.y,5,this.colType,0)
					c.maxActLife = 10000000
					c.vx = this.vx + Math.random()*100-50
					c.vy = this.vy + Math.random()*100-50
					c.lineLife = 6000
					c.size = this.size - 1
					c.lineUp = 1
					c.counter = 18
					c.myDat = 1+this.myDat
					parr.push(c)
				}
				updated = true
			} 
		} else if(this.type == 6){
				if(this.counter%5 == 0){
					this.x += this.vx 
					this.y += this.vy 
					this.vx += this.nvx + Math.cos(COUNTER/10) * this.radius
					this.vy += this.nvy + Math.sin(COUNTER/10) * Math.abs(this.radius)
					this.nvx = 0
					this.nvy = 0
					this.vx += (Math.random()-0.5)*2
					this.vy += (Math.random()-0.5)*2
					updated = true
				}
			}



		if(this.actLife < this.maxActLife && this.bounded === false && (updated||this.counter < 20)){
			this.actLife += 1
			this.oldPath.push([this.x,this.y,this.x+this.vx,this.y+this.vy,this.lineLife])
		}


		if(this.x < 0 || this.y < 0 || this.x > Width || this.y > Height){
			if(this.invincible>0){
				this.invincible -= 1
			} else {
				this.bounded = true
			}
		}
		
	}

	draw(){
		
		for(let i = this.oldPath.length-1; i > -1; i--){
			let e = this.oldPath[i]
			getCol(this.colType,e[4]/this.lineLife,e)
    		ctx.lineWidth = this.size
			ctx.beginPath()
			ctx.moveTo(e[0],e[1])
			ctx.lineTo(e[2],e[3])
			ctx.stroke()
			e[4] -= 2
			if(e[4] <= 0){
				this.oldPath.splice(i,1)
			}
		}
	

		if(this.oldPath.length == 0){
			this.DEL = true
			return("del")
		}

	}

}


class textile{
	constructor(text,x,y){

		this.x = x
		this.y = y
		this.vx = vx
		this.vy = vy
		this.trailer = false
		this.size = 3 + Math.random()*3
		this.actLife = 400
		this.counter = 0
		this.following = false

		return(this)
	}
}



function getCol(type,l,e){
	let a = Math.random()
	switch(type){
		case 0:
    		ctx.strokeStyle = ("rgba(0,"+e[4]*3.5*(1-a)+",255,"+(0.7+0.3*l)+")") // dark blue
			break;
		case 1:
			ctx.strokeStyle = ("rgba("+(1-a)*255+","+(a)*255+",255,"+(0.7+0.3*l)+")") // lightning
			break;
		case 2:
			ctx.strokeStyle = ("rgba(255,"+(1-a)*255+",255,"+(0.7+0.3*l)+")") //cherry blossom
			break;
		case 3: 
			if(Math.random()<0.70){
			ctx.strokeStyle = ("rgba(255,"+(a*255)+",0,"+(0.7+0.3*l)+")")} else { //keyfire
				ctx.strokeStyle = ("rgba(235,0,0,"+l+")")
			}
			break;
		case 4:
			ctx.strokeStyle = ("rgba(0,"+(1-a)*255+",0,"+(0.7+0.3*l)+")") //conjure darkgreen
			break;
		case 5:
			ctx.strokeStyle = ("rgba("+(1-a)*255+",255,"+(1-a)*255+","+l+")") // conjure lightgreen
			break;
		case 6:
			ctx.strokeStyle = ("rgba(0,"+((1-a)*55+200)+",0,"+(l)+")") // tree green
			break;
		case 7:
			ctx.strokeStyle = ("rgba("+((1-a)*55+200)+",0,0,"+(l)+")") // tree red
			break;
		case 8:
			a = 1-a/2
			ctx.strokeStyle = ("rgba(0,"+e[4]*3.5*(1-a)+",255,"+(0.7+0.3*l)+")") // quelled darkblue
			break;
	}
}

var mouseX = 0
var mouseY = 0
var ctoggle = false

onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY);

	let dd = distance(0,0,e.movementX,e.movementY)
if(Math.random()>1-dd*0.005){
		let a = new liner(mouseX+Math.random()-0.5,mouseY+Math.random()-0.5,Math.floor(Math.random()*3),4+Math.floor(Math.random()*2))
		a.following = true
		parr.push(a)
	}
}

document.addEventListener("mousedown",()=>{
	let r = Math.random()*5
	if(Math.random()>0.9){
		r = 14
	}
	for(let i = 0; i < r; i++){
	// parr.push(new liner(mouseX,mouseY,3,1))
		if(ctoggle){
		parr.push(new liner(mouseX+Math.random()-0.5,mouseY+Math.random()-0.5,Math.floor(Math.random()*4),3))

			return
		}
	parr.push(new liner(mouseX,mouseY,Math.floor(Math.random()*4),3))

	}
})


var GLO = 6
let summonItem = ()=>{parr.push(
	new liner(mouseX,mouseY,GLO,2)
	)}

document.addEventListener("keydown",(e)=>{
	let k = e.key
	if(k == " "){
		parr.forEach((e)=>{
			if(e.nonPlayerControllable){return}
			let d = distance(e.x,e.y,mouseX,mouseY)
			e.nvy -= (e.y - mouseY)/d*15
			e.nvx -= (e.x - mouseX)/d*15
		})

	} else if(k == "/"){
		ctoggle = !ctoggle
	} else if(k == "="){
		time_fill_color = "rgba(100,0,0,0.2)"
		time_outline_color = "rgba(0,0,0,0)"
	} else if(k == "\\"){

		summonItem()

	} else{
		let r = Math.random()*5
	if(Math.random()>0.9){
		r = 14
	}
	for(let i = 0; i < r; i++){
	// parr.push(new liner(mouseX,mouseY,3,1))
		if(ctoggle){
		parr.push(new liner(mouseX+Math.random()-0.5,mouseY+Math.random()-0.5,Math.floor(Math.random()*4),3))

			return
		}
	parr.push(new liner(mouseX,mouseY,Math.floor(Math.random()*4),3))

	}
	}
})

function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}




let parr = []



class events{
	static happening = {}
	static updateAll(){
		let objk = Object.keys(this.happening)
		objk.forEach((E)=>{
			let e = this.happening[E]
			if(e.life < 0){
				if(e.end){
					e.end(e)
				}
				delete this.happening[E]
				return
			}	
			e.update(e)
			e.life -= 1
		})
	}

	//an event needs to have life (num) and update (func)

	static addEvent(name,e){
		if(this.happening[name] == undefined){
			this.happening[name] = e
			if(e.start){
				e.start(e)
			}
		} else {
			this.happening[name].life += e.life/2
		}
	}
}

function push(particle,dx,dy){
	if(particle.mass === undefined){return}
	if(particle.basename === "ball"){
		particle.vx += dx / particle.mass
		particle.vy += dy / particle.mass
	}
}



function randomEvents(){
	if(Math.random() > 0.9995){
		events.addEvent("storm",{"chaotic":0,"strength":1,"parr":[],"life":7000,
			"vect":[Math.random()-0.5,Math.random()-0.5],"update":(e)=>{
			if(COUNTER%5 == 0){
				for(let i = 0; i < e.strength; i++){
					let rain = new liner(Math.random()*Width-e.vect[0]*Width,Math.random()*Height-e.vect[1]*Height,Math.floor(Math.random()*3),
						e.chaotic?"none":8
						)
					parr.push(rain)
					e.parr.push(rain)
					rain.invincible = 50
					rain.nvx += e.vect[0] * 15
					rain.nvy += e.vect[1] * 15
				}
				

				e.life -= e.strength

				for(let i = e.parr.length-1; i > -1; i--){
					let E = e.parr[i]
					if(E.DEL){
						e.parr.splice(i,1)
						continue;
					}
					E.nvx += e.vect[0] * 5 * (1+e.strength/5)
					E.nvy += e.vect[1] * 5 * (1+e.strength/5)
				}

				parr.forEach((E)=>{
					push(E,e.vect[0]* 5 * (1+e.strength/5),e.vect[1]* 5 * (1+e.strength/5))
				})

			}
		}})
	}
	if(Math.random() > 0.9996){
		events.addEvent("calm",{"life":7000,"store":{},"start":(e)=>{
			NATURAL_BOLTRATE = 1 - (1-NATURAL_BOLTRATE)/3
		},"update":(e)=>{
			if(COUNTER%5 == 0){
			comparer.disabled[4] = e.life
			comparer.disabled[4.5] = e.life
			comparer.disabled[3] = e.life
			comparer.disabled[2] = e.life
				parr.forEach((E)=>{
					if(E.following || E.mass == Infinity){return}
					E.vx *= 1 - (0.05)
					E.vy *= 1 - (0.05)
					E.nvx *= 0.95
					E.nvy *= 0.95
					E.life -= 50
				})
			}
		},"end":(e)=>{

				//boltrate is not restored!!
		}})
	}
}

let COUNTER = 0
NATURAL_BOLTRATE = 0.99
time_fill_color = "#B00000"
time_outline_color = "#900000"
setInterval(()=>{
	COUNTER ++
	if(COUNTER %2 ===0){
	ctx.clearRect(0,0,Width,Height)
	events.updateAll()
	}
	for(let i = parr.length-1; i > -1; i--){
		let e = parr[i]
		e.update()
		if(COUNTER%2 === 0){
		if(e.draw() === "del"){
			parr.splice(i,1)
		}}
	}


	if(COUNTER%50 == 0){
		randomEvents()
	}

	// if(ctoggle){
	// parr.forEach((e)=>{
	// 		let d = distance(e.x,e.y,mouseX,mouseY)
	// 		e.nvy -= (e.y - mouseY)/d*0.4
	// 		e.nvx -= (e.x - mouseX)/d*0.4
	// 	})}




	ctx.fillStyle = time_fill_color
	ctx.strokeStyle = time_outline_color
	ctx.font = "80px Arial"
	let d = "" + (Date.now()+date_disruptor)
	ctx.fillText(d,Width/2,Height/2)
	ctx.lineWidth = 2
	ctx.strokeText(d,Width/2,Height/2) 
	comparer.compare(d)
	if(Math.random()>NATURAL_BOLTRATE){
		parr.push(new liner(Math.random()*Width,Math.random()*Height,Math.floor(Math.random()*3),Math.floor(Math.random()*2)))
	}




})













function disrupt(d){
	date_disruptor += d
}




//howler polytone
//player controlling events
//more events











