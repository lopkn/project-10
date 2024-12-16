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
	if(events.happening.ballgame){
		events.happening["ballgame"].maxDifficulty = 1
		events.happening["ballgame"].summonWave(1)
		command("scene.sounds=false")
	}

}

document.addEventListener("contextmenu",(e)=>{e.preventDefault()})


class l{
	static dotProduct2(x1,y1,x2,y2){
		return(x1*x2+y1*y2)
	}
	static distance2(x1,y1,x2,y2) {
		let a = x2-x1
		let b = y2-y1
	  return(Math.sqrt(a*a+b*b))
	}

	static vectorCatchUp2(vx1,vy1,vx2,vy2){ // if first vector is catching up to second vector
		let d = this.dotProduct2(vx1,vy1,vx2,vy2)
		if(d < 0){return("headon")}
		let d2 = this.distance2(vx2,vy2,0,0)
	} //// UNFINISHED

	static boundingBoxPoint(x1,y1,bx1,by1,bx2,by2){ // point, box
		let bx,sx,by,sy
		if(bx1 > bx2){bx = bx1;sx=bx2}else{bx=bx2;sx=bx1}
		if(by1 > by2){by = by1;sy=by2}else{by=by2;sy=by1}
		if(x1 >= sx && x1 <= bx && y1 >= sy && y1 <= by){return(true)}
		return(false)
	}

	static lineCircleCollision(cx,cy,r,x1,y1,x2,y2,leng){ //circle, line segment
		if(this.distance2(cx,cy,x1,y1) <= r || this.distance2(cx,cy,x2,y2) <= r){return(true)}  //can think about this to optimize
		// if(x1>x2){let a = x2; x2=x1; x1=a}
		// if(y1>y2){let a = y2; y2=y1; y1=a}
		if(leng === undefined){leng = this.distance2(x1,y1,x2,y2)}
			if(leng === 0){return(false)}
		let dotdiv = this.dotProduct2(cx-x1,cy-y1,x2-x1,y2-y1)/leng**2
		let closestx = x1 + dotdiv * (x2-x1)
		let closesty = y1 + dotdiv * (y2-y1)
		return(this.distance2(cx,cy,closestx,closesty) <= r && this.boundingBoxPoint(closestx,closesty,x1,y1,x2,y2))

	}

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
	static bomb = new Tone.Sampler({
	urls: {
			"C4":"./bomb.mp3",
		},
	}).toDestination();
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
music.bomb.set({volume:-15})
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
		"0":100000,
		"1":100000,
		"2":100000,
		"3":100000,
		"4":100000,
		"5":100000,
		"6":100000,
		"7":100000,
		"8":100000,
		"9":100000
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
		this.size += this.speed*RDT
		this.actLife -= this.s2*RDT
	}
	draw(){
		if(this.colf){
			ctx.strokeStyle = this.color(this.actLife/600,this.color)
		} else if(this.colorf){
			ctx.strokeStyle = this.colorf(this.actLife/600,this.color)
		} else {
			ctx.strokeStyle = this.color
		}
		ctx.lineWidth = 1 + this.actLife/10
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
		ctx.stroke()
		if(this.actLife < 0){
			this.DEL = true
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
		if(this.ballgame){
			if(this.stun>0){this.stun-=1*RDT;return}
			this.x += this.vx*this.speed*events.happening.ballgame.universalDT*RDT
			this.y += this.vy*this.speed*events.happening.ballgame.universalDT*RDT
		} else {
			this.x += this.vx*RDT
			this.y += this.vy*RDT
		}

		

		if(this.mover && COUNTER % 2 == 0){

			if(this.movingType){
				if(this.movingType == "fractional"){
					this.vx *= (1+Math.random()*this.mover-this.mover/2)
					this.vy *= (1+Math.random()*this.mover-this.mover/2)
				}
			}else{
				this.vx += (Math.random()*this.mover-this.mover/2)*RDT
				this.vy += (Math.random()*this.mover-this.mover/2)*RDT
			}
			
			// this.vx *= 0.99
			// this.vy *= 0.99
		}
		this.vx *= this.friction**RDT
		this.vy *= this.friction**RDT

		let hit = false
		if(this.x < 0){
			this.vx *= -1
			this.x = 0
			hit = true
			if(this.ballgame){
				if(this.horizontalPortal){
					this.x = Width
					this.vx *= -1
				} else {
					if(this.wallDamageBase!==undefined){
						if(this.vx > this.wallDamageBase){
							events.happening.ballgame.damageBall(this,this.vx*this.wallDamageMult,{"vx":-this.vx*4.5,"vy":this.vy*4.5,"leng":l.distance2(this.vx,this.vy,0,0)*40})
						}
					}
				this.vx *= this.hbaseFriction
				}
			}
			// if(this.trailer){ps("Sc4")}//legacy
		} else if(this.x > Width){
			this.vx *= -1
			this.x = Width
			hit = true
			if(this.ballgame){
				if(this.horizontalPortal){
					this.vx *= -1
					this.x = 0
				} else {
					if(this.wallDamageBase!==undefined){
						if(this.vx < -this.wallDamageBase){
							events.happening.ballgame.damageBall(this,-this.vx*this.wallDamageMult,{"vx":this.vx*4.5,"vy":this.vy*4.5,"leng":l.distance2(this.vx,this.vy,0,0)*40})
						}
					}
					this.vx *= this.hbaseFriction
				}
				
			}
		}
		if(this.y < 0){
			if(this.ballgame){
				this.vy = 0
			}

				this.vy *= -1
				this.y = 0
				hit = true
			
			// if(this.trailer){ps("Sf3")}//legacy
		} else if(this.y > Height){
			if(this.ballgame){
				if(this.passThrough){
					this.captureCounter = 0		
					if(this.y > Height + this.size){
					events.instantaneous["splatter"](this.x,this.y,6)
					let b = 66
					this.y = -this.size
					this.passThrough -= 1
					music.playBell(b,1)
					music.playBell(b+rint(5),1,scene.interval*0.15)
					music.playBell(b+rint(5),1,scene.interval*0.3)
					this.floor += 1
					}
				} else {
					this.captureCounter += 1
					this.vy *= -this.baseFriction
					this.y=Height
					hit = true
				}
				
			} else {
				this.vy *= -1
				this.y = Height
				hit = true
			}
		}


		if(this.ballgame){
			if(this.y > Height*0.9 && !this.passThrough){
			// this.captureCounter += 1
				if(this.captureCounter>this.maxCaptureCounter-1){

					if(this.floor > events.happening.ballgame.maxFloor-1){
						if(this.captureCounter>this.maxCaptureCounter){
						this.captureCounter = 0		
						this.vy -= 0.4 + Math.random()*4
						this.vx += Math.random()*10-5
						let b = 77
						music.playBell(b,1)
						music.playBell(b+rint(5),1,scene.interval*0.15)
						music.playBell(b+rint(5),1,scene.interval*0.3)
						music.playBell(b+rint(5),1,scene.interval*0.45)
						music.playBell(b+rint(5),1,scene.interval*0.6)
						if(Math.random()>0.5){
							let n = 100
							let tn = Tone.now()
							let lim = 1000
							for(let i = 0; i < 160; i++){
								n *= 1 + Math.random()/5
								tn += Math.random()/20
								if(i%2==0){
									music.bell.triggerAttack(n,tn+i*0.05)
								} else {
									music.bell.triggerAttack(n/1.3,tn+i*0.05)
								}
								if(n > lim){
									n /= 1.5 + Math.random()*3
									lim *= 1.1
								}
							}
						} else {
							let n = 100
							let tn = Tone.now()
							let lim = 1000
							for(let i = 0; i < 160; i++){
								n *= 1 + Math.random()/5
								tn += Math.random()/20
								if(i%2==0){
									music.bell.triggerAttack(n,tn+i*0.05)
								} else {
									music.bell.triggerAttack(n**0.9,tn+i*0.05)
								}
								if(n > lim){
									n /= 1.5 + Math.random()*3
									lim *= 1.1
								}
							}
						}
						
						events.instantaneous["blue splatter"](this.x,this.y)
						events.instantaneous["blue splatter"](this.x,this.y-10)
						events.interactions.cutInteraction.forEach((e)=>{
							if(e === this){return}
							events.happening.ballgame.damageBall(e,9999999,{vx:(e.x-this.x)/3,vy:(e.y-this.y)/3,"leng":10,"sound":false})
						})
					}} else {
						this.passThrough = 1
					}
					
				}
			}
			// else if(this.captureCounter > 0){this.captureCounter -= 1}
		} 


		// if(this.invincible){this.invincible-=1}
		this.actLife -= RDT
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
		if(this.ballgame){
			let mainLineMultiplier = 1
			if(this.stealthLevel){
					mainLineMultiplier = 1 / this.stealthLevel
				}
			if(this.floor > 0){
				ctx.beginPath()
				ctx.strokeStyle = "yellow"
				ctx.lineWidth = 5 * mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*0.5,0,2*Math.PI*this.floor/events.happening.ballgame.maxFloor)
				ctx.stroke()
			}
			if(this.captureCounter > 0){
				ctx.beginPath()
				ctx.fillStyle = "rgba(255,255,255,"+this.captureCounter/this.maxCaptureCounter+")"
				let size = 0.3
				if(this.captureCounter > this.maxCaptureCounter-1){
					ctx.fillStyle = "white"
					size = 0.34
				}
				size *= mainLineMultiplier
				ctx.strokeStyle = "transparent"
				// ctx.lineWidth = 4* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*size,0,2*Math.PI)
				ctx.fill()
				ctx.stroke()
			} if (this.tags.includes("bomb")){
				ctx.beginPath()
				ctx.strokeStyle = "green"
				ctx.lineWidth = 5* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*(COUNTER%50)/50,0,2*Math.PI)
				ctx.stroke()
			} if (this.tags.includes("freezebomb")){
				ctx.beginPath()
				ctx.strokeStyle = "blue"
				ctx.lineWidth = 5* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*(COUNTER%50)/50,0,2*Math.PI)
				ctx.stroke()
			} if (this.tags.includes("reverser")){
				ctx.beginPath()
				ctx.strokeStyle = "#FFFFFF"
				ctx.lineWidth = 5* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*(150-COUNTER%150)/150,0,2*Math.PI)
				ctx.stroke()
			} if (this.tags.includes("motivator")){
				ctx.beginPath()
				ctx.strokeStyle = "#FF00FF"
				ctx.lineWidth = 5* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*Math.random(),0,2*Math.PI)
				ctx.stroke()
			}if (this.tags.includes("recharger")){
				ctx.beginPath()
				ctx.strokeStyle = "#00FFFF"
				ctx.lineWidth = 7* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*(COUNTER%150)/150,0,2*Math.PI)
				ctx.stroke()
			}if (this.tags.includes("arcview")){
				ctx.beginPath()
				ctx.strokeStyle = "#A00000"
				ctx.lineWidth = 5* mainLineMultiplier
				ctx.arc(this.x,this.y,this.size*(COUNTER%110)/110,0,2*Math.PI)
				ctx.stroke()
			}
			
		}
		if(this.actLife < 0){
			this.DEL = true
			this.HEYTHERE = {"WHAT":"IS UP "}
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
			} else if(this.type == 8){ //same as type 1 but straight
			if(this.counter%5 == 0){
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
var mouseTrail = [[0,0,"white"],[0,0,"white"],[0,0,"white"]]

onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY);

	let dd = distance(0,0,e.movementX,e.movementY)
if(Math.random()>1-dd*0.005*events.varbs.conjureStrength){
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
			// parr.push(c)
	}
	// let thiscol = (a,b)=>"hsla("+COUNTER%360+",100%,50%,1)"
	// let c = new explosionR(mouseX,mouseY,thiscol,13)
	// c.actLife = (Math.random()*20+20)*50
	// c.size += 2
	// c.colf = true
	// parr.splice(0,0,c)
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

		if(events.happening.ballgame && e.repeat == false){
			if(events.happening.ballgame.paused){
				let n = 2000
				let tn = Tone.now()
				for(let i = 19; i >-1; i--){
					n/=1.08
					music.bell.triggerAttack(n,tn+i**1.5*0.05)
					music.bell.triggerAttack(n/1.3,tn+i**1.5*0.05)
				}
				for(let i = 0; i < 100; i++){
						setTimeout(()=>{
							events.happening.ballgame.universalDT = (Math.sin(i*Math.PI/200))
						},i*40)
					}
			} else {
				let n = 2000
				let tn = Tone.now()
				for(let i = 0; i < 20; i++){
					n/=1.08
					music.bell.triggerAttack(n,tn+i**1.5*0.05)
					music.bell.triggerAttack(n/1.3,tn+i**1.5*0.05)
				}
				for(let i = 0; i < 100; i++){
					setTimeout(()=>{
						events.happening.ballgame.universalDT = (Math.cos(i*Math.PI/200))
					},i*40)
				}
			}
			
				events.happening.ballgame.paused = !events.happening.ballgame.paused
		}
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
	} else if(k == "-"){
		// mouseTrail.splice(0,0,[mouseX,mouseY])
		// while(mouseTrail.length > 50){
		// 	mouseTrail.pop()
		// }
		events.varbs.handOnScreen = !events.varbs.handOnScreen
	} else if(k == "="){
		time_fill_color = "rgba(100,0,0,0.2)"
		time_outline_color = "rgba(0,0,0,0)"
	} else if(k == "\\"){

		// summonItem()
		let summoned = events.instantaneous["knocker ball"](mouseX,mouseY,"debugger",["dingus"])
		// summoned.phasePower = 8

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
	static interactions = {"cutInteraction":[]}
	static varbs = {handOnScreen:true,boltrate:0.99,rippleStrength:1,trip:1,noteCeiling:85,noteFloor:45,octave:0,conjureStrength:0}
	static updateAll(dt){
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
				e.update(e,dt)
			}
			e.life -= 1
		})

		if(events.happening.ballgame){
			if(COUNTER%4===0){
			
		}
			if(events.varbs.handOnScreen){
				mouseTrail.splice(0,0,[mouseX,mouseY])
			} else {
				mouseTrail.splice(0,0,mouseTrail[0])
			}
			while(mouseTrail.length > 50){
				mouseTrail.pop()
			}
			let d = l.distance2(mouseTrail[0][0],mouseTrail[0][1],mouseTrail[1][0],mouseTrail[1][1])
			events.happening["ballgame"].strength = Math.min(events.happening["ballgame"].energy/d,1)
			events.happening["ballgame"].energy -= d
			mouseTrail[0][2] = events.happening.ballgame.mouseColor(d)
		


		}
		
		let d = l.distance2(mouseTrail[0][0],mouseTrail[0][1],mouseTrail[1][0],mouseTrail[1][1])
		if(mouseTrail[1] !== mouseTrail[2]){
		for(let i = this.interactions.cutInteraction.length-1; i > -1; i--){
				let e = this.interactions.cutInteraction[i]
				if(e.DEL){this.interactions.cutInteraction.splice(i,1);continue}
				e.cutInteraction(mouseTrail[0][0],mouseTrail[0][1],mouseTrail[1][0],mouseTrail[1][1],d,dt)
			}
		}

		//theyre giving uses of "enzymes" not "enzyme kinetics" SCIE001 2024 haha
		// this.interactions.cutInteraction.forEach((e)=>{
			
		// })	
	}

	//an event needs to have life (num) and update (func) 
	// i want one sentence to explain shannon,,, what do i say


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
		"blood splatter ball":(x,y,vx=0,vy=0,d=10)=>{
			let c = new rollingBall(x,y,Math.random()*d-d/2+vx,Math.random()*d-d/2+vy)
			c.colorf = (a)=>{return("rgba(125,0,0,"+(1.3*a)+")")}
			c.strokef = (a)=>{return("rgba("+(100*Math.sin(COUNTER/30+Math.PI)+100)+",0,0,"+(1.3*a)+")")}
			c.mover = 0.05
			c.friction = 0.98
			c.size *= 2
			c.actLife *= (1+Math.random())
			c.actLife *= (1+Math.abs(normalRandom(0,2)))
			c.dissapearLife = c.actLife
			// c.movingType = "fractional"
			// c.mover = 0.5
			parr.splice(0,0,c)
			return(c)
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
		"knocker ball":(x,y,type="normal",tag=[])=>{
			let ballgame = events.happening["ballgame"]
			let c = new rollingBall(x,y,Math.random()*10-5,Math.random()*10-5)
			let phaseColorR = Math.random()*255
			let phaseColorG = Math.random()*255
			let phaseColorB = Math.random()*255
			// return("rgba("+phase*phaseColorR+","+phase*phaseColorG+","+phase*phaseColorB+","+(0.3*a+0.7)+")")}
			// c.strokef = (a)=>{return("rgba(0,"+(100*Math.sin(COUNTER/30+Math.PI)+100)+",0,"+(0.3*a+0.7)+")")}
			c.color = "white"
			c.stroke = "transparent"
			c.mover = 0
			c.friction = 1
			c.size *= 7
			if(c.size<30){c.size += 20}
			// c.actLife *= (1+Math.random())*5
			// c.actLife *= (1+Math.abs(normalRandom(0,2)))
			c.actLife = 9999999
			c.dissapearLife = c.actLife/10
			c.maxhp = 35
			c.captureCounter = 0
			c.maxCaptureCounter = 3
			c.vknockback = 1
			c.hknockback = 1
			c.colorf = ()=>{return("HSL("+c.hue+","+(c.hp/c.maxhp*100)+"%,"+c.light+"%)")}
			c.lastHit = 0
			c.baseFriction = 1
			c.hbaseFriction = 1
			c.floor = 0
			c.mass  = 1
			c.gravityMultiplier = 1
			c.onDeath = []
			c.difficulty = 1
			c.stun = 0
			c.stunTime = 15
			c.speedLimx = 3.5
			c.speed = 1
			c.stunMax = 12
			c.baseKnockUp = 0.2
			c.ballgame = true
			events.varbs.boltrate = 1
			c.phase = Math.random()*2*Math.PI
			c.hue = 0
			c.light = 50
			c.capturePhase = Math.random()*2*Math.PI
			c.bloodMultiplier = 1
			// setTimeout(()=>{events.interactions.cutInteraction.push(c)},200) //used for manual spawning
			// if(Math.random()>0.85){
			// 	type="grunt1"	
			// }
			if(type==="boss1"){
				c.maxhp = 500
				c.vknockback = 0.8
				c.hknockback = 0.2
				c.baseFriction = 0.97
				c.difficulty = 8
				c.hue = 170
				c.light = 20
				// ballgame.maxDifficulty += 1
				c.hitNoteSignature = ()=>{
					let note = Math.random()*15+50
					music.playBell(note)
					music.playBell(note+3)
				}
			} else if(type==="boss2"){
				c.maxhp = 800
				c.vknockback = 1.3
				c.hknockback = 0.2
				c.baseFriction = 0.97
				c.difficulty = 10
				c.gravityMultiplier = 1.8
				c.hue = 270
				c.light = 20
				// ballgame.maxDifficulty += 1
				c.hitNoteSignature = ()=>{
					let note = Math.random()*15+50
					music.playBell(note)
					music.playBell(note+3)
				}
			}  else if(type === "boss3"){
				c.maxhp = 800
				c.vknockback = 1.4
				c.hknockback = 1.4
				c.baseFriction = 0.95
				c.difficulty = 20
				c.gravityMultiplier = 2.7
				c.speedLimx = 2
				c.hue = 325
				c.light = 26
			} else if(type==="necromancer1"){
				c.maxhp = 1800
				c.vknockback = 0.4
				c.hknockback = 0.2
				c.baseFriction = 0.97
				c.difficulty = 18
				c.size *= 2
				c.hue = 280
				c.light = 20
				c.speedLimx = 1
				c.bloodMultiplier = 4
				c.stableIgnore = 5
				c.updater = ()=>{
					if(Math.random()>0.998){
						events.instantaneous["knocker ball"](c.x,c.y,"normal")
					}
				}
				c.hitNoteSignature = ()=>{
					let note = Math.random()*15+50
					music.playBell(note+4)
					music.playBell(note+8)
				}
			}  else if(type==="necromancer2"){
				c.maxhp = 2000
				c.vknockback = 0.3
				c.hknockback = 0.4
				c.baseFriction = 0.97
				c.difficulty = 25
				c.size *= 1.7
				c.hue = 280
				c.light = 20
				c.speedLimx = 1
				c.bloodMultiplier = 4
				c.stableIgnore = 5
				c.updater = ()=>{
					if(Math.random()>0.996){
						events.instantaneous["knocker ball"](c.x,c.y,"normal")
					}
				}
				c.hitNoteSignature = ()=>{
					let note = Math.random()*15+50
					music.playBell(note+4)
					music.playBell(note+8)
				}
			}  else if(type==="delusionary1"){
				c.maxhp = 2000
				c.vknockback = 0.3
				c.hknockback = 0.1
				c.baseFriction = 0.97
				c.difficulty = 25
				c.size *= 1.6
				c.hue = 280
				c.light = 80
				c.speedLimx = 1
				c.bloodMultiplier = 4
				c.stableIgnore = 5
				c.stealthLevel = 5
				c.timeframe = 50
				c.phasePower = 0.5
				c.signature = 0
				c.hitNoteSignature=()=>{
					let note = Math.random()*12+42
					music.playBell(note)
					music.playBell(note+3)
				}
				c.colorf = ()=>{return("HSLA("+c.hue+","+(c.hp/c.maxhp*100)+"%,"+c.light+"%,"+(0.5+Math.sin(COUNTER/c.timeframe+c.signature)*0.5)**c.phasePower+")")}
			
				c.updater = ()=>{
					if(Math.random()>0.996 && !c.dead){
						let z = events.instantaneous["knocker ball"](c.x,c.y,"normal",["horizontalPortal"])
						z.vknockback = 0
						z.hknockback = 0
						z.hue = c.hue + Math.random()*10-5
						z.signature = Math.random()*Math.PI*2
						z.phasePower = 0.5+Math.random()*2
						z.timeframe = Math.floor(30+Math.random()*40)
						z.stealthLevel = 5
						z.vx = c.vx + Math.random()*2-1
						z.vy = c.vy + Math.random()*2-1
						if(z.size > c.size){z.size = c.size}
						z.colorf = ()=>{return("HSLA("+z.hue+","+(z.hp/z.maxhp*100)+"%,"+z.light+"%,"+(0.5+Math.sin(COUNTER/z.timeframe+z.signature)*0.5)**z.phasePower+")")}
						
						if(Math.random()>0.5){
							let z = new rollingBall(c.x,c.y,Math.random()*10-5,Math.random()*10-5)
							Object.assign(z,c)
							z.actLife = 2500
							parr.push(z)
						}
						
					}
				}


				
			}  else if(type==="delusionary2"){
				c.maxhp = 2000
				// c.vknockback = 0.3
				c.hknockback = 0.4
				c.baseFriction = 0.97
				c.difficulty = 25
				c.size *= 1.6
				c.hue = 280
				c.light = 80
				c.speedLimx = 1
				c.bloodMultiplier = 4
				c.stableIgnore = 5
				c.stealthLevel = 5
				c.timeframe = 50
				c.phasePower = 0.5
				c.signature = 0
				c.hitNoteSignature=()=>{
					let note = Math.random()*12+42
					music.playBell(note)
					music.playBell(note+3)
				}
				c.colorf = ()=>{return("HSLA("+c.hue+","+(c.hp/c.maxhp*100)+"%,"+c.light+"%,"+(0.5+Math.sin(COUNTER/c.timeframe+c.signature)*0.5)**c.phasePower+")")}
			
				c.updater = ()=>{
					if(Math.random()>0.99){
						if(Math.random()>0.5){
							let z = new rollingBall(c.x,c.y,Math.random()*10-5,Math.random()*10-5)
							Object.assign(z,c)
							z.actLife = 2500
							parr.push(z)
							if(Math.random()>0.6){
								z.vx += Math.random()-0.5
								z.vy += Math.random()-0.5
							}
						} else {
							let z = events.instantaneous["knocker ball"](c.x,c.y,"normal",["horizontalPortal"])
							z.vknockback = 0
							z.hknockback = 0
							z.hue = c.hue + Math.random()*10-5
							z.signature = Math.random()*Math.PI*2
							z.phasePower = 0.5+Math.random()*2
							z.timeframe = Math.floor(30+Math.random()*40)
							z.stealthLevel = 5
							z.vx = c.vx + Math.random()*2-1
							z.vy = c.vy + Math.random()*2-1
							if(z.size > c.size){z.size = c.size}
							z.colorf = ()=>{return("HSLA("+z.hue+","+(z.hp/z.maxhp*100)+"%,"+z.light+"%,"+(0.5+Math.sin(COUNTER/z.timeframe+z.signature)*0.5)**z.phasePower+")")}
						}
						
						
						
					}
				}


				
			}  else if(type==="delusionary"){
				c.maxhp = 200
				c.baseFriction = 0.97
				c.difficulty = 25
				c.hue = 280
				c.light = 80
				c.speedLimx = 1
				c.stableIgnore = 5
				c.timeframe = 50
				c.phasePower = 0.5
				c.signature = 0
				c.hitNoteSignature=()=>{
					let note = Math.random()*12+42
					music.playBell(note)
					music.playBell(note+3)
				}
				c.colorf = ()=>{return("HSLA("+c.hue+","+(c.hp/c.maxhp*100)+"%,"+c.light+"%,"+(0.5+Math.sin(COUNTER/c.timeframe+c.signature)*0.5)**c.phasePower+")")}
			
				c.updater = ()=>{
					if(Math.random()>0.996){
							let z = new rollingBall(c.x,c.y,Math.random()*10-5,Math.random()*10-5)
							Object.assign(z,c)
							z.actLife = 2500
							parr.push(z)
							if(Math.random()>0.6){
								z.vx += Math.random()-0.5
								z.vy += Math.random()-0.5
							}
						
					}
				}


				
			}else if(type==="debugger"){
				c.maxhp = 200
				// c.vknockback = 0.3
				c.hknockback = 0.4
				c.baseFriction = 0.97
				c.difficulty = 25
				c.size *= 1.6
				c.hue = 280
				c.light = 80
				c.speedLimx = 1
				c.bloodMultiplier = 4
				c.stableIgnore = 5
				c.stealthLevel = 5
				c.timeframe = 50
				c.phasePower = 0.5
				c.signature = 0
				c.hitNoteSignature=()=>{
					let note = Math.random()*12+42
					music.playBell(note)
					music.playBell(note+3)
				}
				c.colorf = ()=>{return("HSLA("+c.hue+","+(c.hp/c.maxhp*100)+"%,"+c.light+"%,"+(0.5+Math.sin(COUNTER/c.timeframe+c.signature)*0.5)**c.phasePower+")")}
			
				c.updater = ()=>{
					if(Math.random()>0.95){
						if(Math.random()>0.5){
							let z = new rollingBall(c.x,c.y,Math.random()*10-5,Math.random()*10-5)
							Object.assign(z,c)
							z.actLife = 2500
							parr.push(z)
							if(Math.random()>0.6){
								z.vx += Math.random()-0.5
								z.vy += Math.random()-0.5
							}
						} else {
							let z = events.instantaneous["knocker ball"](c.x,c.y,"normal",["horizontalPortal"])
							z.vknockback = 0
							z.hknockback = 0
							z.hue = c.hue + Math.random()*10-5
							z.signature = Math.random()*Math.PI*2
							z.phasePower = 0.5+Math.random()*2
							z.timeframe = Math.floor(30+Math.random()*40)
							z.stealthLevel = 5
							z.vx = c.vx + Math.random()*2-1
							z.vy = c.vy + Math.random()*2-1
							if(z.size > c.size){z.size = c.size}
							z.colorf = ()=>{return("HSLA("+z.hue+","+(z.hp/z.maxhp*100)+"%,"+z.light+"%,"+(0.5+Math.sin(COUNTER/z.timeframe+z.signature)*0.5)**z.phasePower+")")}
						}
						
						
						
					}
				}


				c.gravityMultiplier = 25.1
				
			}else if(type === "grunt1"){
				c.maxhp = 100
				c.vknockback = 0.9
				c.baseFriction = 0.97
				c.difficulty = 3
				c.hue = 0
				c.light = 30
				// ballgame.maxDifficulty += 1
			} else if(type === "scout1"){
				c.maxhp = 80
				c.vknockback = 1
				c.hknockback = 1.2
				c.baseFriction = 0.95
				c.difficulty = 10
				c.gravityMultiplier = 2.1
				c.speedLimx = 2
				c.hue = 335
				c.light = 70
			} else if(type === "scout2"){
				c.maxhp = 125
				c.vknockback = 1
				c.hknockback = 1.2
				c.baseFriction = 0.95
				c.difficulty = 17
				c.gravityMultiplier = 3.1
				c.speedLimx = 2
				c.hue = 325
				c.light = 60
			} else if(type === "wallBouncer1"){
				c.maxhp = 800
				c.vknockback = 2.3
				c.stunTime *= 3
				c.hknockback = 5.2
				c.baseFriction = 0.95
				c.difficulty = 2
				c.gravityMultiplier = 2.1
				c.speedLimx = 2
				c.wallDamageMult = 30
				c.wallDamageBase = 6
				c.hue = 160
				c.hbaseFriction = 0.6
				c.stableIgnore = 5
				// c.bloodMultiplier = 0.3
			} else if(type === "wallBouncer2"){
				c.maxhp = 2500
				c.vknockback = 2.7
				c.stunTime *= 2.5
				c.hknockback = 7.2
				c.baseFriction = 0.95
				c.difficulty = 12
				c.gravityMultiplier = 2.1
				c.speedLimx = Infinity
				c.wallDamageMult = 30
				c.wallDamageBase = 8
				c.hue = 160
				c.light = 70
				c.hbaseFriction = 0.4
				c.stableIgnore = 9
				c.bloodMultiplier = 1.3
			} else if(type === "ninja1"){
				c.maxhp = 200
				c.vknockback = 0.9
				c.baseFriction = 0.97
				c.difficulty = 8
				c.hue = 70
				c.stealthLevel = 9
				c.gravityMultiplier = 0.5
				c.hitNoteSignature=()=>{}
				c.light = 0
			} else if(type === "assassin1"){
				c.maxhp = 200
				c.vknockback = 0.9
				c.baseFriction = 0.97
				c.gravityMultiplier = 0.5
				c.difficulty = 8
				c.hue = 230
				c.stealthLevel = 5
				c.timeframe = 50
				c.phasePower = 1
				c.hitNoteSignature=()=>{
					let note = Math.random()*12+42
					music.playBell(note)
				}
				c.signature = Math.random()*Math.PI*2
				c.colorf = ()=>{return("HSLA("+c.hue+","+(c.hp/c.maxhp*100)+"%,"+c.light+"%,"+(0.5+Math.sin(COUNTER/c.timeframe+c.signature)*0.5)**c.phasePower+")")}
			}
			if(tag.includes("arcview")){
				c.deathNoteSignature = (c)=>{
					let n = 100*(Math.random()+1)
					let tn = Tone.now()
					for(let i = 0; i < 6; i++){
						n*=1.25
						music.bell.triggerAttack(n,tn+i*0.05)
					}
					n /= 2.3
					for(let i = 0; i < 6; i++){
						n*=1.25
						music.bell.triggerAttack(n,tn+i*0.05+0.3)
					}

				}
				c.onDeath.push((c)=>{

					ballgame.arcView += 1300
				})

			}
			if(tag.includes("bomb") || type === "bomb"){
				c.deathNoteSignature = (c)=>{
					music.bomb.triggerAttack("C4")
				}
				c.explosionSize = 280
				c.onDeath.push((c)=>{
					events.instantaneous["blood splatter"](c.x,c.y,20,0,0,20)
					let C = new explosionR(c.x,c.y,"#FFFF00",4,2)
					C.actLife = 80+Math.random()*150
					parr.push(C)
					events.interactions.cutInteraction.forEach((e)=>{
					if(e===c||e.dead){return}

					let d = Math.max(distance(e.x,e.y,c.x,c.y),c.explosionSize)
					if(d > Width/3){return}
					if(e.stun < 25000/d){
						e.stun += 25000/d-e.stun
						if(e.stun > 150){e.stun=150}
					}
					e.vy += (e.y-c.y)/d/d*2000
					e.vx += (e.x-c.x)/d/d*2000
					if(d > c.explosionSize){d = Math.min(1/d,e.maxhp/d*80)} else {
						d = Math.max(500,e.maxhp/1.5);events.varbs.trip/=3;
						for(let i = 0; i < 3; i++){
							let C = new liner(c.x,c.y,8,7)
							C.vx += Math.random()*150-75
							C.vy += Math.random()*150-75
							C.size += 3
							C.counter = 18
							C.lineUp = 0
							C.myDat = 2
							C.updateSpeed = 25
							parr.push(C)
						}
						
					}
					ballgame.damageBall(e,d,{"vx":(e.x-c.x),"vy":(e.y-c.y),"leng":25,"stun":false,"sound":false})
				})
					if(events.varbs.trip < 0){events.varbs.trip = 0}
				})

			}
			if(tag.includes("freezebomb") || type === "freezebomb"){
				c.deathNoteSignature = (c)=>{
					music.bomb.triggerAttack("G4")
				}
				c.explosionSize = 280
				c.onDeath.push((c)=>{
					events.instantaneous["blood splatter"](c.x,c.y,20,0,0,20)
					let C = new explosionR(c.x,c.y,"#004FFF",4,1)
					C.actLife = 80+Math.random()*150
					parr.push(C)
					events.interactions.cutInteraction.forEach((e)=>{
					if(e===c||e.dead){return}

					let d = Math.max(distance(e.x,e.y,c.x,c.y),c.explosionSize)
					if(e.stun < 160000/d){
						e.stun += 160000/d-e.stun
					}
					e.vy *= 0.96-(c.explosionSize/d)
					e.vx *= 0.96-(c.explosionSize/d)
					if(d > c.explosionSize){d = Math.min(1/d,e.maxhp/d*80)} else {
						d = Math.max(500,e.maxhp/1.5);events.varbs.trip*=1.1;
						for(let i = 0; i < 8; i++){
							let C = new liner(c.x,c.y,8,8)
							C.vx += Math.random()*150-75
							C.vy += Math.random()*150-75
							C.size += 3
							C.counter = 18
							C.lineUp = 0
							C.myDat = 2
							C.updateSpeed = 25
							parr.push(C)
						}
						
					}
				})
					if(events.varbs.trip > 1){events.varbs.trip = 1}
				})

			}
			if(tag.includes("reverser")){
				c.deathNoteSignature = (c)=>{
					let n = 2000
					let tn = Tone.now()
					for(let i = 0; i < 20; i++){
						n/=1.08
						music.bell.triggerAttack(n,tn+i**1.5*0.05)
						music.bell.triggerAttack(n/1.3,tn+i**1.5*0.05)
					}
				}
				c.onDeath.push((c)=>{
					let C = new explosionR(c.x,c.y,"#FFFFFF",8,0.2)
					C.actLife = 80+Math.random()*150
					parr.push(C)
					events.interactions.cutInteraction.forEach((e)=>{
					if(e===c||e.dead){return}
					e.vy *=-1
					e.vx *=-1
				})
					ballgame.universalDT = -1

					for(let i = 0; i < 100; i++){
						setTimeout(()=>{
							ballgame.universalDT = -(Math.cos(i*Math.PI/100))
						},i*40)
					}
				})

			}
			if(tag.includes("motivator")){
				c.explosionSize = 280
				c.deathNoteSignature = (c)=>{
					let n = 400
					let tn = Tone.now()
					for(let i = 0; i < 10; i++){
						n*=1.1+Math.random()/5
						music.bell.triggerAttack(n,tn+i*0.1)
					}
				}
				c.onDeath.push((c)=>{
					let C = new explosionR(c.x,c.y,"#FF00FF",4,1)
					C.actLife = 80+Math.random()*150
					parr.push(C)
					events.interactions.cutInteraction.forEach((e)=>{
					if(e===c||e.dead){return}
					let d = Math.max(distance(e.x,e.y,c.x,c.y),c.explosionSize)
					if(e.mover === undefined){e.mover = 0}
					e.mover += c.explosionSize*0.3/d
				})
				})

			} if(tag.includes("recharger")){
				c.deathNoteSignature = (c)=>{
					let n = 100*(Math.random()+1)
					let tn = Tone.now()
					for(let i = 0; i < 6; i++){
						n*=1.2
						music.bell.triggerAttack(n,tn+i*0.05)
					}
					n /= 2
					for(let i = 0; i < 6; i++){
						n*=1.2
						music.bell.triggerAttack(n,tn+i*0.05+0.3)
					}
					n /= 2
					for(let i = 0; i < 6; i++){
						n*=1.2
						music.bell.triggerAttack(n,tn+i*0.05+0.6)
					}

				}
				c.onDeath.push((c)=>{
					// let C = new explosionR(c.x,c.y,"#FF00FF",4,1)
					// C.actLife = 80+Math.random()*150
					// parr.push(C)
					ballgame.energy += ballgame.maxEnergy*8
				})

			}
			
			if(tag.includes("horizontalPortal")){
				c.horizontalPortal = true
			}
			if(tag.includes("warner")){
				c.hitNoteSignature=()=>{
					events.interactions.cutInteraction.forEach((e)=>{
					if(e===c||e.dead){return}
					let d = Math.max(distance(e.x,e.y,c.x,c.y),220)
					e.vy += (e.y-c.y)/(d**3)*185400
					e.vx += (e.x-c.x)/(d**3)*185400
				})//tomorrow: try if aligned, flip
				}
			}

			c.type = type
			c.tags = tag
			ballgame.amount += 1
			if(ballgame.balltypes[c.type] === undefined){ballgame.balltypes[c.type]=0}
			ballgame.balltypes[c.type] += 1
			c.hue += ballgame.difficultyRamper * 10
			c.maxhp *= 1+(0.25*ballgame.difficultyRamper)
			c.difficulty *= 1+(0.25*ballgame.difficultyRamper)

			if(ballgame.amount > 4){
				let tdifficultyRamper = Math.floor((ballgame.amount - 4)/3)
				c.hue -= tdifficultyRamper
				c.maxhp *= 1+(0.25*tdifficultyRamper)
				c.difficulty *= 1+(0.25*tdifficultyRamper)
			}
			c.hp = c.maxhp

			events.interactions.cutInteraction.push(c)
			ballgame.difficulty += c.difficulty
			c.cutInteraction = (x1,y1,x2,y2,aleng)=>{

				if(c.stun<=0){
					c.vy += 0.006*c.gravityMultiplier*ballgame.universalDT*RDT
					if(Math.abs(c.vx)>c.speedLimx){
						c.vx *= 0.997
					}
					if(c.updater){
						c.updater(c)
					}
				}


				if(l.lineCircleCollision(c.x,c.y,c.size,x1,y1,x2,y2,aleng)){
					let leng = aleng/RDT*3
					if(c.stableIgnore!==undefined){if(c.stableIgnore>leng){return}}
					if(ballgame.reverseKB &&leng>10&& Math.sign(-c.vx) === Math.sign(x1-x2)){
						c.vx -= 2*c.vx*Math.min((Date.now()-c.lastHit)/500*c.hknockback**2,1) //think of kbility
					}
					c.vx += (x1-x2)*0.01*c.hknockback/RDT*8
					if(c.vy > 0 && ballgame.strength == 1){c.vy = -c.baseKnockUp*ballgame.strength}
						
					c.vy += -Math.abs((y1-y2)*0.01)*c.vknockback*ballgame.strength/RDT*8
					if(!c.hit){
						let r = Math.random()*360
						if(c.colorff !== undefined){
							c.colorf = c.colorff()
						}
						let dmg = leng/3 * ballgame.strength * ballgame.damageMultiplier * ballgame.damageComboMultiplier * (0.5+Math.sin(mouseY/Height*Math.PI)*0.5)
						if(ballgame.strength===1){ballgame.damageComboMultiplier += 0.05}
						ballgame.damageBall(c,dmg,{"vx":(x1-x2)/RDT*3,"vy":(y1-y2)/RDT*3,leng,"stun":ballgame.strength===1})

					} // end hit
					c.hit = true
				} else {c.hit = false}
			}
			parr.push(c)
			return(c)
		},
		"blue splatter":(x,y,n=15)=>{
			for(let i = 0; i < n; i++){
				this.instantaneous["blue splatter ball"](x,y)
			}
		},"blood splatter":(x,y,n=4,vx=0,vy=0,d=5)=>{
			let arr = []
			for(let i = 0; i < n; i++){
				arr.push(this.instantaneous["blood splatter ball"](x,y,vx,vy,d))
			}
			return(arr)
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

events.addEvent("ballgame",{
	"energy":300,
	"strength":1,
	"difficulty":0,
	"maxDifficulty":0,
	"arcView":200,
	"amount":0,
	"maxFloor":1,
	"difficultyRamper":1,
	"universalDT":1,
	"rampingCounter":0,
	"score":0,
	"display":0,
	"maxEnergy":500,
	"damageMultiplier":1,
	"damageComboMultiplier":2,
	"energyGen":8,
	"reverseKB":true,
	"paused":false,
	"gamemode":"waves",
	"balltypes":{},
	"balltypesMax":{"normal":8,"boss1":3,"boss2":3,"scout1":4,"wallBouncer1":4,"necromancer1":1,"necromancer2":1},
	"waveTable":[
		{"type":"normal","chance":0,"limit":Infinity,"difficultyThreshold":0},
		{"type":"TAG","tag":"bomb","chance":0.9,"limit":1,"difficultyThreshold":0},
		{"type":"TAG","tag":"arcview","chance":0.8,"limit":1,"difficultyThreshold":0},
		{"type":"TAG","tag":"recharger","chance":0.98,"limit":2,"difficultyThreshold":0},
		{"type":"grunt1","chance":0.85,"limit":Infinity,"difficultyThreshold":3},
		{"type":"boss1","chance":0.8,"limit":2,"difficultyThreshold":11},
		{"type":"TAG","tag":"freezebomb","chance":0.9,"limit":2,"difficultyThreshold":0},
		{"type":"boss2","chance":0.9,"limit":2,"difficultyThreshold":18},
		{"type":"necromancer1","chance":0.98,"limit":1,"difficultyThreshold":28},
		{"type":"TAG","tag":"bomb","chance":0.99,"limit":1,"difficultyThreshold":28},
		{"type":"boss1","chance":0.9,"limit":1,"difficultyThreshold":30},
		{"type":"wallBouncer1","chance":0.8,"limit":5,"difficultyThreshold":33},
		{"type":"necromancer2","chance":0.99,"limit":1,"difficultyThreshold":65},
		{"type":"TAG","tag":"reverser","chance":0.95,"limit":1,"difficultyThreshold":65},
		{"type":"TAG","tag":"motivator","chance":0.95,"limit":1,"difficultyThreshold":70},
		{"type":"scout1","chance":0.6,"limit":8,"difficultyThreshold":70,"skipper":true},
		{"type":"TAG","tag":"bomb","chance":0.96,"limit":1,"difficultyThreshold":71},
		{"type":"TAG","tag":"freezebomb","chance":0.9,"limit":1,"difficultyThreshold":71},
		{"type":"grunt1","chance":0.6,"limit":28,"difficultyThreshold":73,"skipper":true},
		{"type":"assassin1","chance":0.95,"limit":2,"difficultyThreshold":75},
		{"type":"assassin1","chance":0.98,"limit":1,"difficultyThreshold":80,
			"wavefunction":(c)=>{
				let n = 4 + Math.random()*5
				let p = 4
				while(Math.random()>0.7){
					p *= 1.3
				}
				for(let i = 0; i < n; i++){
					let a = events.instantaneous["knocker ball"](Width*Math.random(),10,"assassin1",["horizontalPortal"])
					a.phasePower = p
				}
			}
		},
		{"type":"ninja1","chance":0.95,"limit":2,"difficultyThreshold":85},
		{"type":"ninja1","chance":0.99,"limit":1,"difficultyThreshold":90,
			"wavefunction":(c)=>{
				let n = 3 + Math.random()*3
				for(let i = 0; i < n; i++){
					let a = events.instantaneous["knocker ball"](Width*Math.random(),10,"ninja1",["horizontalPortal"])
				}
			}
		},
		{"type":"scout2","chance":0.95,"limit":3,"difficultyThreshold":92,"skipper":true},

		{"type":"wallBouncer2","chance":0.86,"limit":5,"difficultyThreshold":95,"skipper":true},
		{"type":"boss3","chance":0.997,"limit":1,"difficultyThreshold":96,"skipper":true,
			"wavefunction":(c)=>{
				let a = events.instantaneous["knocker ball"](Width*Math.random(),10,"boss3",[])
			}
		},
		{"type":"boss3","chance":0.9997,"limit":1,"difficultyThreshold":100,"skipper":true,
			"wavefunction":(c)=>{
				c.hp = 2300
				c.light = 20
				c.difficulty = 40
				c.hbaseFriction = 0.7
			let a = events.instantaneous["knocker ball"](Width*Math.random(),10,"boss3",[])
				a.hp = 2800
				a.light = 20
				a.difficulty = 40
				a.hbaseFriction = 0.7
			}
		},{"type":"delusionary","chance":0.997,"limit":2,"difficultyThreshold":103,"skipper":true,},


		{"type":"ENDER OF TIME BOSS","chance":0,"limit":1,"difficultyThreshold":Infinity},
		],
	"spawning":{"tags":[],"saturation":[]},
	"update":(e)=>{
		let dm = l.distance2(mouseTrail[0][0],mouseTrail[0][1],mouseTrail[1][0],mouseTrail[1][1])
		if(e.energy < e.maxEnergy){
			if(e.energy < 0){e.energy = 0}
			e.energy += e.energyGen / (1+dm/5/RDT) *RDT/1.5
		} else if(dm<1){
			e.energy += e.energyGen/(1+(e.energy-e.maxEnergy)/10) *RDT/1.5
		}

		e.damageComboMultiplier = 1 + (e.damageComboMultiplier-1)*0.99997
		e.damageComboMultiplier -= 0.0001

		if(e.damageComboMultiplier<1){e.damageComboMultiplier = 1}

		if(e.arcView > 0){
			ctx.strokeStyle = "red"
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.arc(mouseX,mouseY,Math.max(e.energy,0),0,Math.PI*2)
			ctx.stroke()
			e.arcView -= 1
		}


		if(e.gamemode === "endless"){
			if(COUNTER%400 === 0){
			if(e.difficulty < e.maxDifficulty){
				events.instantaneous["knocker ball"](Width*Math.random(),10)
				e.rampingCounter += 1
				if(e.rampingCounter > 5){
					e.difficultyRamper += 1
					e.rampingCounter = 0
				}
			} else {
				e.rampingCounter -= 1
				if(e.rampingCounter < -5){
					if(e.difficultyRamper>1){
						e.difficultyRamper -= 1
					}
					e.rampingCounter = 0
				}
			}

			}
		} else if(e.gamemode === "waves"){
			if(COUNTER%200 === 0 && e.amount === 0){
				e.maxDifficulty += 1
				setTimeout(()=>{
					e.spawning.saturation = {}
					e.summonWaveTable(e.maxDifficulty)
				},3000)
			}
		} else if(e.gamemode === "endless waves"){
			if(COUNTER%40 === 0){
				e.maxDifficulty += 0.05
				// 0.1 is BRUAL
				setTimeout(()=>{
					e.summonWaveTable(e.maxDifficulty)
				},3000)
			}
		}
		
		
		if(events.varbs.trip < 1){
			events.varbs.trip += 0.00002*RDT
		}

	},"summonWave":(difficulty)=>{
		let e = events.happening.ballgame
		let saturated = {}
		let tags = ["bomb"]
		while(e.difficulty<e.maxDifficulty){
			let type = "normal"
			if(saturated["normal"]){
				type = "scout1"
			}
				if(Math.random()>0.7){
					type = "wallBouncer1"
				}
				// if(Math.random()>0.1){
				// }
				if(Math.random()>0.9){
					type = "boss1"
				} else if(Math.random()>0.97){
					type = "boss2"
				} else if(Math.random()>0.99){type = "grunt1"}

				if(e.maxDifficulty > 30){
					if(Math.random()>0.99){
						type = "necromancer1"
						if(e.maxDifficulty > 60){
							type = "necromancer2"
						}
					}
				}
			if(e.balltypesMax[type] !== undefined && e.balltypes[type] >= e.balltypesMax[type]){saturated[type]=true;continue}
			if(Math.random()>0.92){
					tags.push("bomb")
			}else if(Math.random()>0.92){
					tags.push("freezebomb")
			}
			events.instantaneous["knocker ball"](Width*Math.random(),10,type,tags)
			tags = []
		}
	},
	"waveTableIndex":1
	,"summonWaveTable":(difficulty)=>{
		let ballgame = events.happening.ballgame
		while(ballgame.maxDifficulty > ballgame.waveTable[ballgame.waveTableIndex].difficultyThreshold){
			// let index = ballgame.waveTable[ballgame.waveTableIndex]
			// events.instantaneous["knocker ball"](Width*Math.random(),10,index.type,[])
			ballgame.dospawn(ballgame.waveTableIndex)
			ballgame.waveTableIndex += 1
		}
		// let saturated = {}
		let tags = []
		while(ballgame.difficulty < ballgame.maxDifficulty){
			for(let i = ballgame.waveTableIndex-1; i > -1 ; i--){
				
				if(ballgame.spawning.saturation[i]===true){continue}
				let dex = ballgame.waveTable[i]
				if(Math.random() < dex.chance){continue}
				let result = ballgame.dospawn(i)
				if(result === "skip"){i = -1} // to skip loop
			}
		}
	},
	"dospawn":(d)=>{
		let ballgame = events.happening.ballgame
		let dex = ballgame.waveTable[d]
		let ball;
		if(dex.type === "TAG"){
			ballgame.spawning.tags.push(dex.tag)
		} else {
			ball = events.instantaneous["knocker ball"](Width*Math.random(),10,dex.type,ballgame.spawning.tags)
			ballgame.spawning.tags = []
		}
		if(dex.wavefunction){
			dex.wavefunction(ball,ballgame.spawning.tags)
		}

		if(ballgame.spawning.saturation[d] == undefined){ballgame.spawning.saturation[d] = 0}
		ballgame.spawning.saturation[d] += 1
		if(ballgame.spawning.saturation[d] >= dex.limit){ballgame.spawning.saturation[d]=true}
		if(dex.skipper){return("skip")} // so the deck reshuffles to top
	}
	,
	"damageBall":(c,dmg,direction={"vx":0,"vy":0,"leng":5,"stun":true,"sound":true})=>{
		let x1 = direction.x1
		let x2 = direction.x2
		let y1 = direction.y1
		let y2 = direction.y2
		let VX = direction.vx
		let VY = direction.vy
		let sound = direction.sound===undefined?true:direction.sound
		let leng = direction.leng
		let ballgame = events.happening.ballgame
		c.lastHit = Date.now()
		c.hp -= dmg
		if(direction.stun){
			c.stun += c.stunTime
		}
		if(c.hp < 0){dmg += c.hp}
		events.instantaneous["blood splatter"](c.x,c.y,dmg/c.maxhp*10*c.bloodMultiplier,(VX)*0.03*c.hknockback,(VY)*0.03*c.vknockback).forEach((e)=>{
			let mr = Math.random()
			e.vx *= mr
			e.vy *= mr
		})
		c.size += 0.5
		
		let note = Math.random()*15+50
		if(sound){
		if(c.hitNoteSignature){
			c.hitNoteSignature()
		} else {
			music.playBell(note)
			music.playBell(note+5)
		}}
		
		if(c.hp < 0 && !c.dead){
			c.stun = 0
			c.dead = true
			if(c.onDeath.length>0){
				c.onDeath.forEach((e)=>{
					e(c)
				})
			}
			ballgame.score += dmg/c.maxhp*3
			ballgame.amount -= 1
			c.actLife = 2
			if(sound){
				if(c.deathNoteSignature){
					c.deathNoteSignature(c)
				} else {
				music.playBell(note+3,1,scene.interval*0.25)
				music.playBell(note+8,1,scene.interval*0.25)
				music.playBell(note+6,1,scene.interval*0.5)
				music.playBell(note+11,1,scene.interval*0.5)
				}

			}
			
			setTimeout(()=>{
				events.instantaneous["blood splatter"](c.x,c.y,Math.sqrt(dmg)*1.4*c.bloodMultiplier,(VX)*0.04,(VY)*0.04,1+leng/160).forEach((e)=>{
					let rnd = Math.random() * 2
					e.vx *= rnd
					e.vy *= rnd
				})
			},100)
			ballgame.difficulty -= c.difficulty
			ballgame.balltypes[c.type] -= 1
		} else {
			ballgame.score += dmg/c.maxhp
		}
	},
	"mouseColor":(l)=>{
		if(l < 80){
			return("hsla(60,0%,100%,"+events.happening.ballgame.strength+")")
		} else {
			return("hsla("+(10+l/6)+",100%,50%,"+events.happening.ballgame.strength+")")
		}
	}
})

function randomEvents(){
	if(events.happening["ballgame"]!==undefined){return}
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
			events.varbs.boltrate = 1 - (1-events.varbs.boltrate)/3
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

				events.varbs.boltrate = 3 * events.varbs.boltrate - 2
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
time_fill_color = "#B00000"
time_fill_color = "rgba(0,0,0,0)"
time_outline_color = "#900000"

let lastTime = 0
var RDT = 1


function mainLoop(currentTime){

	let dt = currentTime - lastTime
	lastTime = currentTime
	RDT = dt/5

	COUNTER ++
	// if(COUNTER %2 ===0){
		ctx2.clearRect(0,0,Width,Height)
		ctx.fillStyle = "rgba(0,0,0,"+events.varbs.trip+")"
		ctx.fillRect(0,0,Width,Height)
	events.updateAll(dt)
	events.loop()
	// }
	for(let i = parr.length-1; i > -1; i--){
		let e = parr[i]
		e.update()
		// if(COUNTER%2 === 0){
		if(e.draw() === "del"){
			parr.splice(i,1)
		}
		// }
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
	if(events.happening.ballgame){
		let ballgame = events.happening.ballgame
		d = ballgame.display?ballgame.display:"Score: "+Math.floor( (mouseTrail[1][1]-mouseTrail[0][1])/RDT )+", Damage multiplier: "+ballgame.damageComboMultiplier.toFixed(2)
	}
	ctx2.fillText(d,Width/2,Height/2)
	ctx2.lineWidth = 2
	ctx2.strokeText(d,Width/2,Height/2) 
	comparer.compare(d)
	if(Math.random()>events.varbs.boltrate){
		parr.push(new liner(Math.random()*Width,Math.random()*Height,Math.floor(Math.random()*3),Math.floor(Math.random()*2)))
	}


	//draw mouse trail
	for(let i = mouseTrail.length-2; i > -1;i--){
		// ctx.strokeStyle = "rgba(255,255,255,"+events.happening["ballgame"].energy/100+")"
		// if(events.happening.ballgame.energy > 200 && events.happening.ballgame.energy < 400){
		// 	let conc = Math.sin((events.happening["ballgame"].energy-200)/ 200*Math.PI)*50
		// 	ctx.strokeStyle = "hsl(74,100%,"+(100-conc)+"%,255)"
		// }
		if(mouseTrail[i+1] === mouseTrail[i+2]){continue}
		ctx.strokeStyle = mouseTrail[i][2] 
		ctx.beginPath()
		ctx.moveTo(mouseTrail[i+1][0],mouseTrail[i+1][1])
		ctx.lineTo(mouseTrail[i][0],mouseTrail[i][1])
		ctx.lineWidth = (mouseTrail.length-i)*0.3
		ctx.stroke()
	}




	requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)
// setInterval(()=>{mainLoop(Date.now())},10)
// lastTime = Date.now()








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
		} else if(cmdsplit[0] == "dmgmult"){
			if(!isNaN(parseFloat(cmdsplit[1]))){
				events.happening.ballgame.damageMultiplier = parseFloat(cmdsplit[1])
			}
		} else if(cmdsplit[0] == "skip"){
			if(!isNaN(parseFloat(cmdsplit[1]))){
				events.happening.ballgame.maxDifficulty += parseFloat(cmdsplit[1])
				events.happening.ballgame.damageComboMultiplier = 10
			}
		} else if(cmdsplit[0] == "tester"){
			let bg = events.happening.ballgame
			bg.damageComboMultiplier = 12
			bg.maxDifficulty = 73
			bg.damageMultiplier = 2
			bg.energyGen *= 2
			bg.arcView = true
		} else if(cmdsplit[0] == "debugger"){
			let bg = events.happening.ballgame
			bg.damageComboMultiplier = 12
			bg.damageMultiplier = 2000
			bg.maxDifficulty = 74
			bg.energyGen *= 2
			bg.arcView = true
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


function touchHandler(e){
	e.preventDefault
	// events.instantaneous
	let touches = e.changedTouches,
        first = touches[0]


        // for(let i = 0; i < touches.length; i++){
    	// 		let E = touches[i]
    	// 		if(!Mobile.activeTouches[E.identifier]){
    	// 			Mobile.activeTouches[E.identifier] = {"type":"unidentified"}
    	// 		}
    	// }

      if(e.type == "touchstart"){
      		let E = touches[touches.length-1]
      		mouseX = E.pageX
      		mouseY = E.pageY
      	} else {
      		let E = touches[touches.length-1]
      		mouseX = E.pageX
      		mouseY = E.pageY
      	}
}

function mobileInit(){

    document.addEventListener("touchstart", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchmove", (e)=>{e.preventDefault();touchHandler(e)}, true);
    document.addEventListener("touchend", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchcancel", (e)=>{touchHandler(e)}, true);    
}
mobileInit()



//player controlling events
//more events


//peddal
//firefly events
//rare dingdong event



// command("/reverb off")	
command("/echo off")


music.mainDel = music.GD1()






// (copy pasted horrible documentation)
// its a ball cutting game kind of like fruit ninja
// point of the game is to not let the ball hit the floor too many times
// -- balls have a central point that increase in brightness when they hit the floor
// -- balls pass through the floor once when they get to max brightness, denoted by a sound and some colored sparkles
// --- the second time they get to max, you lose, denoted by every other ball immediately dying, a string of shitty notes playing, and blue sparkles

// Unlike fruit ninja, you dont just touch the balls, you want to gut them hard, so you swing your sword fast
// but you also lose energy while swinging your sword, it can only move a set distance and needs to recharge
// Sword with no energy deals almost no damage (denoted by a transparent swing), let your mouse stand still to recharge energy
// the faster you swing, the more damage you deal
// the rightmost number denotes your damage multiplier, which increases 5% each time you hit something while the sword has any energy

// levels get really hard

/*'{"x":921.6793740462208,"y":172.8245038662147,"vx":3.4910127101271726,"trailer":false,"vy":244.74642788440002,
"size":43.29876574308311,"actLife":9996462.82,"dissapearLife":999999.9,"counter":884,"following":false,"mover":0,
"basename":"ball","mass":1,"friction":1,"color":"white","stroke":"transparent","maxhp":125,"captureCounter":1,
"maxCaptureCounter":3,"vknockback":0.9,"hknockback":1,"lastHit":1734318746338,"baseFriction":0.97,"hbaseFriction":1,
"floor":1,"gravityMultiplier":1,"onDeath":[],"difficulty":3.75,"stun":-1.0072702100024813,"stunTime":15,"speedLimx":3.5,
"speed":1,"stunMax":12,"baseKnockUp":0.2,"ballgame":true,"phase":1.7998787479564133,"hue":10,"light":30,
"capturePhase":5.528099517431435,"bloodMultiplier":1,"type":"grunt1","tags":[],"hp":120.78421244232511,"hit":false,"passThrough":0}'
*/



