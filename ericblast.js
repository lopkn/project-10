let io;
let myMath
let crypto = require("crypto")
let INFUNCS = require("./funcs.js")

let fs = require("fs")

let json3 = JSON.parse(fs.readFileSync("./small_servers/words/scrabble.json","utf8"))
json2 = {}
json3.forEach((e)=>{
	json2[e]=true
})

let objk = Object.keys(json2)
for(let i = objk.length-1; i > -1; i--){
	if(objk[i].length < 5){
		objk.splice(i,1)
	}
}
let jn = objk.join("")

function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

let vectorNormalize;
let vectorFuncs;
function copyFuncs(v,v2){
	vectorNormalize = v
	vectorFuncs = v2
}

class ericBlast{

	static words = {}
	static players = {}
	static turn = -1
	static turnDate = 0;
	static prompt = ""
	static wrong = 0;
	static turnPlayer;
	static gamemode = "ffa"
	static corrects = 0;

	static setio(i,m,v,v2){
		io = i
		myMath = m
		copyFuncs(v,v2)
	}
	static handle(d,e,n,socket){//date, message, content, socket
			console.log(e,n)
			if(e==="word"){
				if(n.length >= 4&&(socket.id==this.turnPlayer||this.gamemode=="ffa")&&n.includes(this.prompt) && this.words[n]===undefined && json2[n] !== undefined){
					this.words[n] = socket.id
					io.emit("accepted",{"id":socket.id,"word":n})
					let ind = Math.floor(Math.random()*jn.length)


					if(this.gamemode!="ffa"){
						this.newTurn(true)
					}
					this.corrects += 1;
				}
			}
			if(e==="start"){
				this.start()
			}
	}

	static genChunk(n){
		let reject = true
		while(reject==true){
			reject = false
			let ind = Math.floor(Math.random()*(jn.length-n))
			this.prompt = ""
			for(let i = 0; i < n; i++){
				this.prompt += jn[ind+i]
			}
			if(!(this.prompt.includes("a")||this.prompt.includes("o")||this.prompt.includes("e")||this.prompt.includes("i")||this.prompt.includes("u"))||!this.inc(this.prompt)){
				reject=true
			}
		}
		return(this.prompt)
	}


	static disconnect(s){
		// if(Object.keys(this.balls).length>10){
			delete this.players[s.id]
		// }
	}
	static join(s){
		this.players[s.id] = {"id":s.id}
	}

	static started = false;
	static start(){
		if(!this.started){
			this.words = {}
			this.started = true
		} else {return}
		this.interval = setInterval(()=>{this.loop()},35)
	}
	static loop(){

		if(this.turn==-1 || this.turnDate < Date.now()){
					this.wrong += 1
					this.corrects = 0
					if(this.wrong>Object.keys(this.players).length*2){
			    	this.newTurn(true)

			    	this.wrong = 0
					} else {
						if(this.gamemode=="ffa"){
							this.newTurn(true)
							this.wrong += 1
						} else {
							this.newTurn()
						}
					}
		}

	}
	static newTurn(gen=false){
		if(gen){
					let promptLength = 2
					if(Object.values(this.words).length>40 && this.corrects > 2){
						promptLength = 3
					}if(Object.values(this.words).length>90 && this.corrects > 4){
						promptLength = 4
					}
					this.prompt = this.genChunk(promptLength)
		}

		let arr = Object.keys(this.players)
		this.turnDate = Date.now() + 10000
    this.turn += 1
    if(this.turn >= arr.length){this.turn=0}
    let TP = arr[this.turn]
  	this.turnPlayer = TP
  	if(this.gamemode == "ffa"){
				io.emit("prompt",[this.prompt,"FFA"])
			} else{
				io.emit("prompt",[this.prompt,TP])

			}
    console.log("turn: "+TP)
  	io.to(TP).emit("start","test")
	}
	static genLet(){
		const lowercaseAsciiStart = 97;
		let letterIndex = Math.floor(Math.random() * 26);
		let letter = String.fromCharCode(lowercaseAsciiStart + letterIndex);
		return(letter)
	}
	static inc(str){

	let arr = []

	objk.forEach((e)=>{
		if(e.includes(str)){
			arr.push(e)
		}
	})
	arr.sort((a,b)=>{return(b.length-a.length)})
	arr.forEach((e)=>{
		console.log(e)
	})
	if(arr.length == 0){
		return(false)
	}
	return(true)
}
}









module.exports={ericBlast}