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

let myCanvas2 = document.getElementById("myCanvas2")

myCanvas2.style.top = 0
myCanvas2.style.left = 0
myCanvas2.style.zIndex = 6
myCanvas2.width = Width
myCanvas2.height = Height
myCanvas2.style.position = "absolute"


var SOUND = {}

function rint(x){
	return(Math.floor(Math.random()*x))
}

function init(){
	initSounds([])
}

function RNG(seed) {
    var m_as_number = 2**53 - 111
    var m = 2n**53n - 111n
    var a = 5667072534355537n
    var s = BigInt(seed) % m
    return function () {
        return Number(s = s * a % m) / m_as_number
    }
}

function initSounds(arr){
Tone.Transport.start();
Tone.Transport.scheduleRepeat((time) => {
    music.runbar(time)
}, scene.interval*scene.beatsPerBar)

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

function mtn(midiNumber) {
    return Tone.Frequency(midiNumber, "midi");
}


var scene = {
	"sounds":true,
	"interval":0.3,
	"beatsPerBar":4
}

class music{
	static bar = {"scheduled":false,"position":0,"noteTimes":[60,64,67,72,71,72,67,64],"interval":0.3,"relativity":0} //64 for now
	static stanza = {"repeats":0,"position":0,"bars":[]}
	static counter = 0
	static synth = new Tone.PolySynth(Tone.Synth,8).toDestination(); // Connect to audio output
	static eq = new Tone.EQ3(-10, 3, 0);
	static reverb = new Tone.Reverb({
    decay: 20, // Duration of the reverb tail
    preDelay: 0.3,
    wet: 0.95,
    input:1,
    output:1
}).toDestination();
	static bell = new Tone.Sampler({
	urls: {
		"C4":"./untitled.mp3",
	},
}).toDestination();
	static kick = new Tone.Sampler({
	urls: {
		"C4":"./kick.mp3",
	},
}).toDestination();
	static click = new Tone.Sampler({
	urls: {
		"C4":"./test.mp3",
	},
}).toDestination();
	static drumSynth = new Tone.MembraneSynth().toDestination();
	static echo = new Tone.PingPongDelay(scene.interval*2, scene.interval*2).toDestination();

	static runbar(time){
		this.counter += 1
		if(this.counter%4!==0){return}
		// if(Math.random()>0.3){return}
		// this.scheduleBar(this.bar,time)
		// this.playBell(Math.floor(normalRandom(50,7)))
			// music.PD2(music.GSC({70:true,75:true,78:true}),this.mainDel)
		if(scene.sounds){
			this.playBellSynthChord(Math.floor(normalRandom(50,7)))
		}
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
	static playBell(note,vel=1,delay=0){
			this.bell.triggerAttackRelease(mtn(note),1.7,Tone.now()+delay,vel);
			// this.synth.triggerAttackRelease(mtn(note),1.7,Tone.now()+delay,vel);
			// this.synth.triggerAttackRelease(mtn(note+4),0.7,undefined,0.2);
	}
	static playFile(file,note,vel=1,delay=0){
		this.sounds[file].triggerAttackRelease(mtn(note),1.7,Tone.now()+delay,vel);
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

	static checkCollider(note,dict,dist=1,oct=1){
		for(let i = 0; i < oct+1; i++){
			if(dict[note+dist+i*12] === true){return(true)}
			if(dict[note-dist+i*12] === true){return(true)}
			if(dict[note+dist-i*12] === true){return(true)}
			if(dict[note-dist-i*12] === true){return(true)}
		}
		return(false)
	}


	static playBellSynthChord(note,vel=1,adel=scene.interval/3*2,seed=Math.floor(Math.random()*5000000)){
		let notes = [note] // adel here should be /3*2 !! but we made it slow
		let dell = 0.2
		let avel = vel
		this.playBell(note,vel)
		let trand = RNG(seed)
		let str = ""
		let counter = 0
		while(notes.length<16  && counter<10000){
			counter += 1
					let del = adel 
					if(trand()>0.7){
						del*=2
					} else if(trand()>0.9){
						del*=3
					}
			if(note > events.varbs.noteCeiling){
				note-=48
				str += ("notes too high, reducing by 4 octaves (48 semitones)")
			}
			str += ("notes:"+JSON.stringify(notes)+"\n")
			if(trand() > 0.9){
					let rel = 4
					note += rel
					if(this.checkCollide(note,notes)){note -= rel;continue}
					if(this.checkCollide(note,notes,2)){note -= rel;continue}
					vel *= 0.8
					dell += del
					notes.push(note)
				} else if(trand() > 0.2){
					let rel = 5
					note += rel
					if(this.checkCollide(note,notes)){note -= rel;continue}
					if(this.checkCollide(note,notes,2)){note -= rel;continue}
					vel *= 0.8
					dell += del
					notes.push(note)
				} else {
					let rel = Math.floor(1+trand()*8)
					note += rel
					if(this.checkCollide(note,notes)){note -= rel;continue}
					if(this.checkCollide(note,notes,2)){note -= rel;continue}
					vel *= 0.8
					dell += del
					notes.push(note)
				}
			}
		let shuffledNotes = notes.sort((a,b)=>{return(0.5-trand())})
		let delran = 0
		let delrans = []
		notes.forEach((e,i)=>{
			// if(Math.random() > 0.9){delran += adel*1}
			// if(Math.random() > 0.8){delran += adel*0.25;delrans.push(0.25)}
			// if(Math.random() > 0.8){delran += adel*0.5;delrans.push(0.5)}
			// if(Math.random() > 0.8){delran += adel*-0.25;delrans.push(-0.25)}
			// if(Math.random() > 0.8){delran += adel*-0.5;delrans.push(-0.5)}
			// if(Math.random()>0.7 && delrans.length > 0){
			// 	let delransChoice = Math.floor(Math.random()*delrans.length)
			// 	delran -= adel*delrans[delransChoice]
			// 	delrans.splice(delransChoice,1)
			// }

			this.playBell(e,avel*0.9**(i-1),i*adel+delran)
			// notes[i] = Tone.Frequency(e, "midi").toNote();
		})

		this.noteProcessing(notes)

		console.log(JSON.stringify(notes))
		return(notes)
	}

	static properShuffle(arr){

	}

	static playBellSynthChord2(notes,avel=1,adel=0.2,seed=Math.floor(Math.random()*5000000)){
		let dell = 0.2
		let trand = RNG(seed)
		let counter = 0
		let notearr = []



		while(counter<10000){
			counter++
			let note = Math.floor(Math.random()*(events.varbs.noteCeiling-events.varbs.noteFloor)+events.varbs.noteFloor);
			if(notes[note] !== undefined){continue}
			let collided1 = this.checkCollider(note,notes,1,2)
			let collided2 = this.checkCollider(note,notes,2,2)
			if(collided2 || collided1){notes[note] = false} else {
				notes[note] = true
			}

		}

		let objk = Object.keys(notes)
		objk.forEach((e)=>{
			if(notes[e] == true){notearr.push(e)}
		})

		

		// let shuffledNotes = notearr.sort((a,b)=>{return(0.5-trand())})
		notearr.forEach((e,i)=>{
			this.playBell(e,avel*0.9**(i-1),i*adel)
			notes[i] = Tone.Frequency(e, "midi").toNote();
		})
		// this.noteProcessing(notearr)
		console.log(JSON.stringify(notearr))
		return(notes)
	}
	static playBellSynthChord3(notes,avel=1,adel=0.2,seed=Math.floor(Math.random()*5000000)){
		let dell = 0.2
		let trand = RNG(seed)
		let counter = 0
		let notearr = []

		let objk = Object.keys(notes)

		let note = events.varbs.noteFloor
		while(note<events.varbs.noteCeiling){
			note++
			if(notes[note] !== undefined){continue}
			let collided1 = this.checkCollider(note,notes,1,2)
			let collided2 = this.checkCollider(note,notes,2,2)
			if(collided2 || collided1 || Math.random()>0.8){notes[note] = false } else {
				notes[note] = true
			}

		}

		objk = Object.keys(notes)
		objk.forEach((e)=>{
			if(notes[e] == true){notearr.push(e)}
		})

		

		// let shuffledNotes = notearr.sort((a,b)=>{return(0.5-trand())})
		notearr.forEach((e,i)=>{
			this.playBell(e,avel*0.9**(i-1),i*adel)
			notes[i] = Tone.Frequency(e, "midi").toNote();
		})
		// this.noteProcessing(notearr)
		console.log(JSON.stringify(notearr))
		return(notes)
	}
	static GSC(notes,avel=1,adel=0.2,seed=Math.floor(Math.random()*5000000)){ //generate synthetic chord
		let dell = 0.2
		let trand = RNG(seed)
		let counter = 0
		let notearr = []
		let objk = Object.keys(notes)
		let note = events.varbs.noteFloor
		while(note<events.varbs.noteCeiling){
			note++
			if(notes[note] !== undefined){continue}
			let collided1 = this.checkCollider(note,notes,1,4)
			let collided2 = this.checkCollider(note,notes,2,4)
			if(collided2 || collided1){notes[note] = false } else {
				if(Math.random()>0.4){
					notes[note] = "skip"
				} else {
					notes[note] = true
				}
			}
		}
		objk = Object.keys(notes)
		objk.forEach((e)=>{
			if(notes[e] == "skip"){notes[e]=!(this.checkCollider(e,notes,1,4),this.checkCollider(e,notes,2,4))}
		})
		objk.forEach((e)=>{
			if(notes[e] == true){notearr.push(e)}
		})
		// // let shuffledNotes = notearr.sort((a,b)=>{return(0.5-trand())})
		// notearr.forEach((e,i)=>{
		// 	this.playBell(e,avel*0.9**(i-1),i*adel)
		// 	notes[i] = Tone.Frequency(e, "midi").toNote();
		// })
		// // this.noteProcessing(notearr)
		console.log(JSON.stringify(notearr))
		return(notes)
	}
	static conform(dict,arr){ //make notes conform to another set of allowables

	}

	static PD1(dict,avel=1,adel=0.2){ //play dict 1
		let objk = Object.keys(dict)
		let notearr = []
		objk.forEach((e)=>{
			if(dict[e] == true){notearr.push(e)}
		})

		let delran = 0
		let delrans = []
		let summer = 0
		if(notearr.length>12 || Math.random()>0.8){
			while(notearr.length < 16){
			notearr.push(notearr[notearr.length-rint(notearr.length/2)-1])
			}
		} else {
			while(notearr.length < 13){
			notearr.push(notearr[notearr.length-rint(notearr.length/2)-1])
			}
		}
		notearr.forEach((e,i)=>{

			if(e == "blank"){return}

			if(Math.random() > 0.9){delran += adel*1}
			if(Math.random() > 0.9){delran += adel*0.25;delrans.push(0.25)}
			if(Math.random() > 0.9){delran += adel*0.5;delrans.push(0.5)}
			// if(Math.random() > 0.9){delran += adel*-0.25;delrans.push(-0.25)}
			// if(Math.random() > 0.9){delran += adel*-0.5;delrans.push(-0.5)}
			// if(Math.random()>0.7 && delrans.length > 0){
			// 	let delransChoice = Math.floor(Math.random()*delrans.length)
			// 	delran -= adel*delrans[delransChoice]
			// 	delrans.splice(delransChoice,1)
			// }
			summer += i*adel+delran
			if(summer>16){return}
			this.playBell(e,avel*0.9**(i-1),i*adel+delran)
		})
		console.log(summer)
		if(Math.sign(notearr[notearr.length-2]-notearr[notearr.length-1])==Math.sign(notearr[notearr.length-3]-notearr[notearr.length-2])){
			console.log("comp")
		} else {console.log("incom")}
		return(notearr)
	}

	static PD2(dict,delarr,avel=1){
		let objk = Object.keys(dict)
		let notearr = []
		objk.forEach((e)=>{
			if(dict[e] == true){notearr.push(e)}
		})

		let summer = 0
		if(notearr.length>12 || Math.random()>0.8){
			while(notearr.length < 16){
			notearr.push(notearr[notearr.length-rint(notearr.length/2)-1])
			}
		} else {
			while(notearr.length < 13){
			notearr.push(notearr[notearr.length-rint(notearr.length/2)-1])
			}
		}
		if(delarr === undefined){
			delarr = []
		}
		while(notearr.length > delarr.length){
				delarr.push(1)
			}
		let cumulativeDelay = 0
		notearr.forEach((e,i)=>{

			if(e == "blank"){return}
			summer += i*delarr[i]
			// if(summer>16){return}
			this.playBell(e,avel*0.9**(i-1),cumulativeDelay*scene.interval)
			cumulativeDelay += delarr[i]
		})
		console.log(summer)
		if(Math.sign(notearr[notearr.length-2]-notearr[notearr.length-1])==Math.sign(notearr[notearr.length-3]-notearr[notearr.length-2])){
			console.log("comp")
		} else {console.log("incom")}
		return(notearr)
	}

	static GD1(x=16,arr=[]){ //generate Delay
		let summer = 0
		arr.forEach((e)=>{summer+=e})

		while(summer<x){
			if(Math.random()>0.5){
				summer += arr[arr.push(0.5)-1]
			} else {
				summer += arr[arr.push(1)-1] // only the first number matters
			}
		}
		while(summer>=x){
			summer -= arr.pop()
			arr.pop()
		}
		console.log(summer)
		return(arr)
	}
	static GD2(x=4,arr=[],symmetry=2){ //4 rep symmetry
		let summer = 0
		arr.forEach((e)=>{summer+=e})

		while(summer<x){
			if(Math.random()>0.5){
				summer += arr[arr.push(0.5)-1]
			} else if(Math.random()>0.8){
				summer += arr[arr.push(0.25)-1]
			} else {
				summer += arr[arr.push(1)-1] // only the first number matters
			}
		}
		while(summer>=x){
			summer -= arr.pop()
			arr.pop()
		}
		let larr = arr.length
		let lack = x-summer
		while(symmetry>0){
			symmetry -= 1
			arr.push(lack)
			for(let i = 0; i < larr; i++){
				arr.push(arr[i])
				// if(i===0){arr[arr.length-1]+=lack}
			}
		}
		
		console.log(summer)
		return(arr)
	}

	static noteProcessing(arr){
		arr = arr.sort((a, b) => a - b)
		let rootRel = []
		arr.forEach((e,i)=>{rootRel[i] = arr[i]-arr[0]})
		console.log(rootRel)
		let importanceHierarchy = []

		this.chordClash(arr,this.lastChord)
		this.lastChord = arr
	}

	static lastChord = []

	static chordClash(c1,c2){
		let clasharr = []
		c1.forEach((e,i)=>{
			if(c2[i] == undefined){return}
			clasharr[i] = Math.abs(e-c2[i])
		})
		console.log("chord clash: "+JSON.stringify(clasharr))
	}
}

music.bell.connect(music.reverb)
music.bell.connect(music.echo)
music.bell.connect(music.eq)
music.bell.set({volume:-20})
music.drumSynth.set({volume:-20})
music.kick.set({volume:-20})
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
    volume:-60
})
music.generateNextStanza()


NoteRelativity = {
	"major":{"0":0,"1":0.5,"2":1,"3":1.5,"4":2,"5":3,"6":3.5,"7":4,"8":4.5,"9":5,"10":5.5,"11":6},
	"minor":{"0":0,"1":0.5,"2":1,"3":2,"4":2.5,"5":3,"6":3.5,"7":4,"8":4.5,"9":5,"10":5.5,"11":6},
	// "nathan"
	// "mainor":{"0":0,"1":2,"2":3,"3":5,"4":7,"5":8,"6":11,"7":12},
}

let lastnote = 0
let updown = false




// get cos/sin from time
// cos(COUNTER/100)

// let sounds = true

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
	// if(sounds === false){
	// 	return
	// }
	// let arr = soundDict[s]
	// for(let i = 0; i < arr.length; i++){
	// 	if(arr[i].paused){
	// 		arr[i].play()
	// 		return("this");
	// 	} else {
	// 	}
	// }
	// let a = new Audio(soundNameDict[s])
	// arr.push(a)
	// a.play()
	// return(a)
}

let ctx = myCanvas.getContext("2d")
let ctx2 = myCanvas2.getContext("2d")

let GTOGGLE = false


ctx2.textAlign = 'center'

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
		// if(t > 4)
		// console.log(t)

		switch(t){
		case 1:

			break;
		case 2:
			
			break;
		case 3:
			c = new explosionR(Math.random()*Width,Math.random()*Height,"rgb(2,"+(125+Math.random()*125)+",255)")
			c.actLife = Math.random()*20+20
			c.size += 2
			// parr.push(c)
			if(Math.random()>0.009){
				let thiscol = "rgba(2,"+(125+Math.random()*125)+",255,"
				c = new explosionR(Math.random()*Width,Math.random()*Height,(a)=>{return(thiscol+(0.7+0.3*a)+")")})
				c.actLife = (Math.random()*20+20)*events.varbs.rippleStrength
				c.size += 2
				c.colf = true
				parr.push(c)
			}

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
			c.updateSpeed = 250
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
			c.updateSpeed = 500
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
		if(this.colf){
			ctx.strokeStyle = this.color(this.actLife/600,this.color)
		} else {
			ctx.strokeStyle = this.color
		}
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
		this.friction = 1
	}


	update(){
		this.x += this.vx
		this.y += this.vy

		if(this.mover && COUNTER % 2 == 0){
			this.vx += Math.random()*this.mover-this.mover/2
			this.vy += Math.random()*this.mover-this.mover/2
			// this.vx *= 0.99
			// this.vy *= 0.99
		}
		this.vx *= this.friction
		this.vy *= this.friction


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
		} else if(this.trailer && Math.random()>0.8){
			let c = new explosionR(this.x,this.y,"rgb(2,"+(125+Math.random()*125)+",255)",0.2-Math.random()*0.16,0.3-Math.random()*0.2)
			c.actLife = Math.random()*20+10
			c.size += 12
			parr.push(c)
		}

	}

	draw(){

		// ctx.strokeStyle = Math.random()>0.5?"#FFB0FF":"#FFFFFF"
		ctx.strokeStyle = this.stroke?this.stroke:"#FFFFFF"
		if(this.strokef){
			ctx.strokeStyle = this.strokef(this.actLife/this.dissapearLife)
		}
		ctx.lineWidth = 1
		ctx.fillStyle = "rgba(255,0,0,"+(this.actLife/this.dissapearLife)+")"
		if(this.colorf){
			ctx.fillStyle = this.colorf(this.actLife/this.dissapearLife)
		}
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
			if(this.counter%this.updateSpeed == 0){
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
				if(this.lineUp%this.myDat == 0 && this.bounded === false && parr.length < 1500){
					let c = new liner(this.x,this.y,5,this.colType,0)
					c.maxActLife = 10000000
					c.vx = this.vx + Math.random()*100-50
					c.vy = this.vy + Math.random()*100-50
					c.lineLife = this.lineLife
					c.size = this.size - 1
					c.lineUp = 1
					c.counter = 18
					c.myDat = 1+this.myDat
					c.updateSpeed = this.updateSpeed
					parr.push(c)
				}
				updated = true
			} 
		} else if(this.type == 6){ // rotary
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
			} else if(this.type == 7){ // line
				if(this.counter%3 == 2){
					this.x += this.vx 
					this.y += this.vy 
					this.vx += this.nvx 
					this.vy += this.nvy
					this.nvx = 0
					this.nvy = 0
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
    		if(this.sizef){
    			ctx.lineWidth = this.sizef(this,(i+1)/this.oldPath.length)
    		}
			ctx.beginPath()
			ctx.moveTo(e[0],e[1])
			ctx.lineTo(e[2],e[3])
			ctx.stroke()
			e[4] -= 2
			if(e[4] <= 0){
				this.oldPath.splice(i,1)
			}
		}

		if(this.specialDraw){
			this.specialDraw(this)
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
			ctx.strokeStyle = ("rgba(0,"+e[4]*3.5*(1-a)+",255,"+(0.3+0.7*l)+")") // quelled darkblue
			break;
		// case 8:
		// 	a = 1-a/2 // ??? broken?
		// 	ctx.strokeStyle = (""+e+(0.7+0.3*l)+")") // quelled darkblue
		// 	break;
		case 9:
    		ctx.strokeStyle = ("rgba("+e[4]*3.5*(1-a)*5+","+e[4]*3.5*(1-a)*5+","+(e[4]*3.5*(1-a)*2.5*Math.random())+","+(0.7+0.3*l)+")") // shooting star
			break;
		case 10:
			ctx.strokeStyle = ("rgba(255,255,"+(e[4]*3.5*2.5*Math.random())+","+(0.7+0.3*l)+")") // shooting star
			break;
		case 11: //sinusoidal blue
			ctx.strokeStyle = "rgba(0,0,"+(100*Math.sin(e[4]/30)+100)+","+(0.3*a+0.7)+")"
			break;
		case 12: //red green phase shifter
			ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/300))+",100%,"+(50*Math.sin(COUNTER/30+e[4]/30)+25)+"%,"+(0.3*a+0.7)+")"
			break;
		case 13: //rainbow hsla
			ctx.strokeStyle = "hsla("+((COUNTER)%360)+",100%,50%,"+(0.3*a+0.7)+")"
			break;
		case 14: //stripped hsla
			ctx.strokeStyle = "hsla("+((COUNTER+Math.sin(e[4]*50)*40)%360)+",100%,50%,"+(0.3*a+0.7)+")"
			break;
		case 15: //forward phase shifter
			ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/115+COUNTER/150))+",100%,50%,"+(3.7*l)+")"
			break;
		case 16: //osmotic forward phase shifter
			ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/115+COUNTER/150))+",100%,"+(25*Math.sin(e[4]/10+COUNTER/15)+70)+"%,"+(3.7*l)+")"
			break;
		case 17: //reverse osmotic reverse phase shifter
			ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/150+COUNTER/115))+",100%,"+(25*Math.sin(e[4]/15+COUNTER/10)+70)+"%,"+(3.7*l)+")"
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
	let c = new liner(mouseX,mouseY,1,17)
			c.maxActLife = 4200
			c.vx += Math.random()*50-25
			c.vy += Math.random()*50-25
			c.lineLife = 4200
			c.size += 10
			c.counter = 18
			c.lineUp = 0
			c.myDat = 2
			c.updateSpeed = 25
			parr.push(c)
	}
})


var GLO = 9
let summonItem = ()=>{
	// parr.push(new liner(mouseX,mouseY,GLO,2))
	let c = new rollingBall(mouseX,mouseY,Math.random()*10-5,Math.random()*10-5)
	c.colorf = (a)=>{return("rgba(0,0,"+(100*Math.sin(COUNTER/30)+100)+","+(0.3*a+7)+")")}
	c.strokef = (a)=>{return("rgba(0,"+(100*Math.sin(COUNTER/30+Math.PI)+100)+",0,"+(0.3*a+7)+")")}
	c.mover = 0.2
	c.friction = 0.999
	c.size *= 2
	parr.push(c)
			// let c = new liner(mouseX,mouseY,5,6,0)
			// c.maxActLife = 10000000
			// c.vx += Math.random()*50-25
			// c.vy += Math.random()*50-25
			// c.lineLife = 120
			// c.size += 10
			// c.counter = 7
			// c.lineUp = 0
			// c.myDat = 2
			// c.updateSpeed = 15
			// parr.push(c)
	}

// let keymapper = {"w":"B3","2":"A#3","q":"A3","e":"C4","4":"C#4","r":"D4","5":"D#4","t":"E4","y":"F4","7":"F#4","u":"G4","8":"G#4","i":"A4","9":"A#4","o":"B4","p":"C5"}
let keymapper = {"z":48,"s":49,"x":50,"d":51,"c":52,"v":53,"g":54,"b":55,"h":56,"n":57,"j":58,"m":59,",":60,"l":61,".":62,";":63,"/":64,"0":75,"2":61,"3":63,"5":66,"6":68,"7":70,"9":73,"q":60,"w":62,"e":64,"r":65,"t":67,"y":69,"u":71,"i":72,"o":74,"p":76,"[":77,"=":78,"]":79,"\\":81,"Backspace":80}

document.addEventListener("keydown",(e)=>{
	let k = e.key
	// music.playBell(e.keyCode-10)
	// if(keymapper[e.key])(music.playBell(Tone.Frequency(keymapper[e.key]).toMidi()))
	
	if(e.key == '`'){command(prompt("enter command:"));return}
	if(keymapper[e.key] && e.repeat == false)(music.playBell(keymapper[e.key]+12*events.varbs.octave))
	if(e.code == "ShiftLeft"){events.varbs.octave--}
	if(e.code == "ShiftRight"){events.varbs.octave++}
	if(k == " "){
		parr.forEach((e)=>{
			if(e.nonPlayerControllable){return}
			let d = distance(e.x,e.y,mouseX,mouseY)
			e.nvy -= (e.y - mouseY)/d*15
			e.nvx -= (e.x - mouseX)/d*15
			if(e.basename == "ball"){
				e.vy -= (e.y - mouseY)/d*1 / e.mass
				e.vx -= (e.x - mouseX)/d*1 / e.mass
			}
		})

	} else if(k == "/"){
		ctoggle = !ctoggle
	} else if(k == "="){
		time_fill_color = "rgba(100,0,0,0.2)"
		time_outline_color = "rgba(0,0,0,0)"
	} else if(k == "\\"){

		// summonItem()
		events.instantaneous["splatter"](mouseX,mouseY,20)

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
	parr.push(new liner(mouseX,mouseY,Math.floor(Math.random()*4),15))

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
	static varbs = {rippleStrength:1,trip:1,noteCeiling:85,noteFloor:45,octave:0}
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
			if(e.update){
				e.update(e)
			}
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

	static loop(){
		// this.varb.starShineGradient = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, asize);
	}

	static instantaneous = {
		"blue splatter ball":(x,y)=>{
			let c = new rollingBall(x,y,Math.random()*10-5,Math.random()*10-5)
			c.colorf = (a)=>{return("rgba(0,0,"+(100*Math.sin(COUNTER/30)+100)+","+(0.3*a+0.7)+")")}
			c.strokef = (a)=>{return("rgba(0,"+(100*Math.sin(COUNTER/30+Math.PI)+100)+",0,"+(0.3*a+0.7)+")")}
			c.mover = 0.2
			c.friction = 0.99
			c.size *= 2
			c.actLife *= (1+Math.random())
			c.actLife *= (1+Math.abs(normalRandom(0,2)))
			parr.push(c)
		},
		"splatter ball":(x,y)=>{
			let c = new rollingBall(x,y,Math.random()*10-5,Math.random()*10-5)
			let phaseColorR = Math.random()*255
			let phaseColorG = Math.random()*255
			let phaseColorB = Math.random()*255
			c.colorf = (a)=>{let phase = 0.5+0.5*Math.sin(COUNTER/50+c.phase);
			// return("rgba("+phase*phaseColorR+","+phase*phaseColorG+","+phase*phaseColorB+","+(0.3*a+0.7)+")")}
			return("rgba("+phaseColorR+","+phaseColorG+","+phaseColorB+","+Math.min(1,(0.3*a+0.7))*phase+")")}
			// c.strokef = (a)=>{return("rgba(0,"+(100*Math.sin(COUNTER/30+Math.PI)+100)+",0,"+(0.3*a+0.7)+")")}
			c.stroke = "transparent"
			c.mover = 0.2
			c.friction = 0.99
			c.size *= 2
			c.actLife *= (1+Math.random())
			c.actLife *= (1+Math.abs(normalRandom(0,2)))
			c.dissapearLife = c.actLife/10
			c.phase = Math.random()*2*Math.PI
			parr.push(c)
		},
		"blue splatter":(x,y,n)=>{
			for(let i = 0; i < n; i++){
				this.instantaneous["blue splatter ball"](x,y)
			}
		},"splatter":(x,y,n)=>{
			for(let i = 0; i < n; i++){
				this.instantaneous["splatter ball"](x,y)
			}
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
		events.addEvent("storm",{"chaotic":(Math.random()>0.97),"strength":(1+Math.floor(Math.random()*3)),"parr":[],"life":7000,
			"vect":[Math.random()-0.5,Math.random()-0.15],"update":(e)=>{
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
	if(Math.random() > 0.99995 && events.happening.storm == undefined){
		let startPoint = [Math.random()*Width*3-Width,Math.random()*Height-Height]
		if(!(startPoint[0]>0 && startPoint[0]<Width &&startPoint[1]>0 && startPoint[1]<Height)){
		events.addEvent("beam storm",{"chaotic":(Math.random()>0.97),"strength":1,"parr":[],"life":1000,
			"startPoint":startPoint,"target":[Math.random()*Width,Math.random()*Height],"update":(e)=>{
			if(COUNTER%5 == 0){
				for(let i = 0; i < e.strength; i++){
					let c = new liner(mouseX,mouseY,7,10)
					c.vx = e.startPoint[0] - e.target[0]
					c.vy = e.startPoint[1] - e.target[1]
					c.size = distance(c.vx,c.vy,0,0)/3
					c.sizef = (a,b)=>{return(c.size*b*b*4)}
					c.mass = c.size * 300
					let asize = 20*c.size
					c.specialDraw = (a)=>{
						const gradient = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, asize);
						let A = Math.abs(Math.sin(COUNTER/20))*100+125
						gradient.addColorStop(0, "rgba("+A+","+A+","+A*Math.random()+","+1+")");
						gradient.addColorStop(1, "rgba(0,0,0,0)");

						ctx.fillStyle = gradient;
						ctx.fillRect(a.x-asize, a.y-asize, asize*2, asize*2);
					}

					parr.push(c)
					e.parr.push(c)
					c.invincible = 5
				}
				


			}
		}})}
	}
	if(Math.random() > 0.9999 && events.happening.storm == undefined){
		let startPoint = [Math.random()*Width*3-Width,Math.random()*Height-Height]
		if(!(startPoint[0]>0 && startPoint[0]<Width &&startPoint[1]>0 && startPoint[1]<Height)){
		events.addEvent("star shower",{"chaotic":(Math.random()>0.97),"strength":(1+Math.floor(Math.random()*2)),
			"parr":[],"life":3000,"maxLife":3000,
			"startPoint":startPoint,"target":[Math.random()*Width,Math.random()*Height],
			"start":(e)=>{e.life = e.maxLife}
			,"update":(e)=>{
			if(COUNTER%25 == 0){
				for(let i = 0; i < e.strength; i++){
					if(Math.random()>Math.sin(e.life/e.maxLife*Math.PI)){return}
					let c = new liner(startPoint[0],startPoint[1],7,10)
					c.vx = -(e.startPoint[0] - Width*Math.random())/180
					c.vy = -(e.startPoint[1] - Height*Math.random())/180
					// c.vx *= Math.random()*2-1
					// c.vy *= Math.random()*2-1
					c.size = distance(c.vx,c.vy,0,0)/3
					c.sizef = (a,b)=>{return(c.size*b*b*4)}
					c.mass = c.size * 30
					c.starSignature = Math.random()*Math.PI*2
					let asize = 3*(c.size+1)**1.7
					c.specialDraw = (a)=>{
						gradient = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, asize)
						let A = Math.abs(Math.sin(COUNTER/(asize+3)+a.starSignature))*0.6+0.4
						gradient.addColorStop(0.2, "rgba(255,255,"+A*Math.random()*255+","+A+")");
						// gradient.addColorStop(0, "rgba(255,255,0,1)");
						gradient.addColorStop(1, "rgba(255,255,0,0)");

						ctx.fillStyle = gradient;
						ctx.fillRect(a.x-asize, a.y-asize, asize*2, asize*2);
					}

					parr.push(c)
					e.parr.push(c)
					c.invincible = 1550
				}
				


			}
		}})}
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

					// if(E.mass){
					// // if(false){
					// 	E.vx *= 1 - (1 / E.mass)
					// 	E.vy *= 1 - (1 / E.mass)
					// 	E.nvx *= 1 - (1 / E.mass)
					// 	E.nvy *= 1 - (1 / E.mass)
					// } else {
						let calmingEffect = 0.05
						if(E.calming){calmingEffect*=E.calming}
						calmingEffect = 1-calmingEffect
						E.vx *= calmingEffect
						E.vy *= calmingEffect
						E.nvx *= calmingEffect
						E.nvy *= calmingEffect
					// }
					
					E.life -= 50
				})
			}
		},"end":(e)=>{

				NATURAL_BOLTRATE = 3 * NATURAL_BOLTRATE - 2
		}})
	}

	if(Math.random() > 0.9997){
		events.addEvent("ripple",{"life":8000,"store":{},"start":(e)=>{
			events.varbs.rippleStrength = Math.random()*6 + 2
		},"end":(e)=>{
			events.varbs.rippleStrength = 1
		}})
	}
	if(Math.random() > 0.999){
		events.addEvent("trip",{"life":8000,"store":{},"start":(e)=>{
			events.varbs.trip = Math.random()*0.3 + 0.01
		},"end":(e)=>{
			events.varbs.trip = 1
		}})
	}
}

let COUNTER = 0
NATURAL_BOLTRATE = 0.99
time_fill_color = "#B00000"
time_fill_color = "rgba(0,0,0,0)"
time_outline_color = "#900000"
setInterval(()=>{
	COUNTER ++
	if(COUNTER %2 ===0){
		ctx2.clearRect(0,0,Width,Height)
		ctx.fillStyle = "rgba(0,0,0,"+events.varbs.trip+")"
		ctx.fillRect(0,0,Width,Height)
	events.updateAll()
	events.loop()
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




	ctx2.fillStyle = time_fill_color
	ctx2.strokeStyle = time_outline_color
	ctx2.font = "80px Arial"
	let d = "" + (Date.now()+date_disruptor)
	ctx2.fillText(d,Width/2,Height/2)
	ctx2.lineWidth = 2
	ctx2.strokeText(d,Width/2,Height/2) 
	comparer.compare(d)
	if(Math.random()>NATURAL_BOLTRATE){
		parr.push(new liner(Math.random()*Width,Math.random()*Height,Math.floor(Math.random()*3),Math.floor(Math.random()*2)))
	}




})











function command(cmd){
	let recognized = false

	if(cmd[0]=="/"){
		let cmdsplit = cmd.substring(1).split(" ")
		if(cmdsplit[0] == "echo"){
			if(cmdsplit[1] == "false" || cmdsplit[1] == "off"){
				music.echo.set({wet:0})
			} else if(cmdsplit[1] == "true" || cmdsplit[1] == "on") {
				music.echo.set({wet:1})
			}
		} else if(cmdsplit[0] == "reverb"){
			if(cmdsplit[1] == "false" || cmdsplit[1] == "off"){
				music.reverb.set({wet:0})
			} else if(cmdsplit[1] == "true" || cmdsplit[1] == "on") {
				music.reverb.set({wet:0.95})
			}
		} else if(cmdsplit[0] == "tempo" || cmdsplit[0] == "bpm"){
			if(!isNaN(parseFloat(cmdsplit[1]))){
				Tone.Transport.bpm.value = parseFloat(cmdsplit[1])
				scene.interval = 36 / parseFloat(cmdsplit[1])

			}
		}
		recognized = true
	}

	if(!recognized){
		eval(cmd)
	}
}


function disrupt(d){
	date_disruptor += d
}




//player controlling events
//more events


//peddal
//firefly events
//rare dingdong event



command("/reverb off")
command("/echo off")
command("scene.sounds=false")


music.mainDel = music.GD1()













