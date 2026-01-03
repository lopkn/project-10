function init(){
	console.log("hey")
}



class scene{
	static interval = 0.3
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
		"C4":"../epcounter/untitled.mp3",
	},
}).toDestination();
	static kick = new Tone.Sampler({
	urls: {
		"C4":"../epcounter/kick.mp3",
	},
}).toDestination();
	static click = new Tone.Sampler({
	urls: {
		"C4":"../epcounter/test.mp3",
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

	static playBellf(note,vel=1,delay=0){
			this.bell.triggerAttackRelease(note,1.7,Tone.now()+delay,vel);
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
		let notelog=[]
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
			notelog[i] = Tone.Frequency(e, "midi").toNote();
		})

		this.noteProcessing(notes)

		console.log(JSON.stringify(notelog))
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


function normalRandom(mean, stderr) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stderr + mean;
}

function mtn(midiNumber) {
    return Tone.Frequency(midiNumber, "midi");
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


function rless(){
	let z = 0
	while(Math.random()>0.5){
		z++
	}
	return(z)
}









////////////////// snippets


function test1(center=500){

	let mdiv = document.createElement("div")
	document.body.appendChild(mdiv)
	mdiv.style.color = "#308050"


let z = center
	for(let i = 0; i < 120; i++){
	    music.playBellf(z,undefined,i/5)

	    let a = Math.floor(rless()+1)
	    let b = Math.floor(rless()+1)

	    while(a==b && Math.random()>0.1){
	    	a = Math.floor(rless()+1)
	    	b = Math.floor(rless()+1)
	    }

	    

	    if(z>center){
	    	if(Math.random()<0.5**(12/(z-center))){
	    		if(a>b){
		    		z *= b/a
	    		} else {
	    			z*= a/b
	    		}
	    	}


	    }else {
	    	if(Math.random()>z/center){
	    		if(a<b){
		    		z *= b/a
	    		} else {
	    			z*= a/b
	    		}
	    	} else {
		    	z*= a/b
	    	}
	    }

	    let x = z

		setTimeout(()=>{mdiv.innerText = Math.round(x) + " " + a + " " + b  + " --- " + a/b + "\n" + mdiv.innerText},i*1000/5)



	    console.log(z,a/b)
	}
}

/////////////