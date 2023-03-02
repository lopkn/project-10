// class nur{

// 	constructor(){
// 		this.inputMultipliers = [0,0,0]
// 		this.inputAdders = [0,0,0]
// 		this.memory = 0
// 		this.phenotype = ""
// 		this.outputter = false

// 		this.usefulness = 0

// 		this.used = false;

// 		this.outputLimit = 1;
// 		this.outputAmount = 1;
// 		this.decay = 1;
// 	}

// 	decay(){
// 		this.memory -= this.decay
// 		if(this.memory < 0){
// 			this.memory = 0;
// 		}
// 	}

// 	activate(amount,num,u){
// 		this.usefulness += 1
// 		this.decay();
// 		let adder = (this.inputAdders[num]+amount)*this.inputMultipliers[num]
// 		this.memory += adder;
// 		if(adder > 0){

// 			if(this.memory-adder < this.outputLimit && this.memory > this.outputLimit){
// 				let out = this.outputting(u)
// 			}

// 		} else {
// 		if(this.memory < 0){
// 			this.memory = 0;
// 		}
// 		}

// 		return({"num":this.memory,"out":out})

// 	}

// 	outputting(u){
// 		if(this.outputter){
// 			console.log(this.phenotype,this.outputAmount)
// 			if(u){
// 				return([[this.outputAmount,this.phenotype,this.memory-this.outputLimit]])
// 			}
// 			return([this.outputAmount,this.phenotype,this.memory-this.outputLimit])
// 		} else {
// 			if(this.linked !== undefined){
// 				let aout = []
// 				for(let i = 0; i < this.linked.length; i++){
// 					let activation = this.linked[i][0].activate(this.outputAmount,this.linked[i][1],u)
// 					aout.push(activation).out
// 				}
// 			}
// 		}
// 		// return(this.outputAmount)	
// 	}


// }

// class structure{
// 	constructor(amount,phenotypes){
// 		this.nurs = []
// 		for(let i = 0; i < amount+1; i++){
// 			this.nurs.push(new nur())
// 			if(phenotypes[i] !== undefined){
// 				this.nurs[i].outputter = true;
// 				this.nurs[i].phenotype = phenotypes[i]
// 				this.nurs[i].used = true;
// 			}
// 		}
// 		let linkers = []
// 		for(let i = 0; i < phenotypes.length; i++){
// 			let r = Math.floor(Math.random()*amount)
// 			if(!this.nurs[r].used){
// 				this.nurs[r].used = true;
// 				this.nurs[r].linked.push([this.nurs[i],Math.floor(Math.random()*3)])
// 				linkers.push(r)
// 			}
// 		}

// 		for(let i = 0; i < linkers.length; i++){
// 			this.nurs[amount].linked.push([this.nurs[linkers[i]]],[this.nurs[i],Math.floor(Math.random()*3)])
// 		}

// 		this.questions = []

// 		this.events = {
// 			"h":[[amount,0]],
// 			"i":[[amount,1]],
// 			" ":[[amount,2]]
// 		}

// 	}

// 	// activate(a,b){
// 	// 	this.nurs[this.nurs.length-1].activate(a,b)
// 	// }

// 	activate(x){
// 		for(let i = 0; i < this.events[x].length; i++){
// 			let e = this.events[x][i];
// 			this.nurs[e[0]].activate(1,e[1],true)
// 		}
// 	}

// 	evaluate(inn,num,expected,neur){

// 	}

// }

let mainCanvas = document.getElementById("myCanvas")
mainCanvas.height = window.innerHeight
mainCanvas.width = window.innerWidth

mainCanvas.style.top = "0px"
mainCanvas.style.left = "0px"



let callStack = ["checkBodyFuncs_"]
let ramStack = {}
let memory = {"-1":{"name":"mainMem","id":-1,"iterators":[]}}

class memChunk{
	static cid = 0
	static GetId(){
		this.cid++
		return(this.cid)
	}
	constructor(name,iterators,id){
		this.name = name //sweet
		this.id = id?id:memChunk.GetId() //1
		this.iterators = iterators?iterators:[] //[0.6,2,0.3,3]
	}

	thinkOf(x){


	}

	func(x){

	}
}


memory["-1"] = new memChunk("mainMem",[1,1],-1)
memory["1"] = new memChunk("words",[])



let result;

// class p{

// 	// static wordBank = {

// 	// "say":{"recognition":{
// 	// 	"stringSpaceFunc":(w,p,s)=>{
// 	// 	if(p==0){console.log(s.substring(4))}
// 	// 	}},
// 	// 	"attributes":{
// 	// 		"part of speech":"verb"
// 	// 	}
// 	// },
// 	// // "is":{
// 	// // 	"recognition":{
// 	// // 		"stringSpaceFunc":(w,p,s)=>{
// 	// // 			if(p==0){
// 	// // 				console.log(this.analyzeTruthful(s.substring(3)))
// 	// // 			} else {

// 	// // 			}
// 	// // 		}
// 	// // 	}
// 	// // }

// 	// }

// 	static statementBank = {
// 		"1+1=2":true
// 	}

// 	static objectBank = {
// 		"a word":{
// 			"instances":{
// 				"say":{"recognition":{
// 					"stringSpaceFunc":(w,p,s)=>{
// 					if(p==0){console.log(s.substring(4))}
// 					}},
// 					"attributes":{
// 						"part of speech":"verb"
// 					}
// 				},
// 				"is":{"recognition":{
// 					"stringSpaceFunc":(w,p,s)=>{
// 						if(p==0){
// 							console.log(this.analyzeTruthful(s.substring(3)))
// 						} else {
// 							let split = s.split(" ")
// 							let first = []
// 							for(let i = 0; i < p; i++){
// 								first.push(split[i])
// 							}
// 							first = first.join(" ")

// 							let second = []
// 							for(let i = p+1; i < s.length; i++){
// 								second.push(split[i])
// 							}
// 							second = second.join(" ")

// 							console.log(first,second)

// 						}
// 					}},
// 					"attributes":{
// 						"part of speech":"verb"
// 					}
// 				},
// 				"a":{
// 					"attributes":{
// 						"part of speech":"adjective"
// 					}
// 				}
// 				// "means":{"recognition":{
// 				// 	"stringSpaceFunc":(w,p,s)=>{
// 				// 		if(p==0){}else if(p==1){

// 				// 		}
// 				// 	}},
// 				// 	"attributes":{
// 				// 		"part of speech":"verb"
// 				// 	}
// 				// },
// 			}
// 		},
// 		"a statement":{
// 			"instances":{
// 				"1+1=2":true
// 			}
// 		}
// 	}

// 	static analyzeTruthful(str){
// 		if(this.statementBank[str] !== undefined){
// 			return(this.statementBank[str])
// 		} else {
// 			this.stringProcess(str)
// 		}
// 	}

// 	static stringIsStatement(str){

// 	}

// 	static containedOrParallel(str,ostr){

// 		let obj = this.objectBank

// 		let objArr = Object.keys(this.objectBank)
// 	}


// 	static process(input){
// 		if(input === undefined){
// 			return
// 		}

// 		if(typeof(input) === "string"){
// 			this.stringProcess(input)
// 		}

// 	}

// 	static stringProcess(str){
// 		let words = str.split(" ")
// 		for(let i = 0; i < words.length; i++){
// 			this.recognizeWord(words[i],i,str)
// 		}
// 	}

// 	static recognizeWord(word,place,str){
// 		if(this.objectBank["a word"].instances[word]){
// 		if(this.objectBank["a word"].instances[word].recognition !== undefined){

// 			let recognized = this.objectBank["a word"].instances[word].recognition
// 			if(recognized.stringSpaceFunc !== undefined){
// 				recognized.stringSpaceFunc(word,place,str)
// 			}

// 			}
// 		}


// 		if(this.objectBank["a word"].instances[word].attributes?.["part of speech"] !== undefined){
// 			let pos = this.objectBank["a word"].instances[word].attributes["part of speech"]
// 			this.posPush(pos)
// 		}


// 		}

// 		static posAnalyzer = ""

// 		static posPush(pos){
// 			if(typeof(pos) === "string"){
// 				this.posAnalyzer += "-"+pos
// 				this.posCollapse()
// 			}
// 		}

// 		static posCollapse(){
// 			if(this.posCollapser[this.posAnalyzer]){
// 				this.posAnalyzer = this.posCollapser[this.posAnalyzer]
// 			}
// 		}

// 		static posCollapser = {"-noun-verb-noun":"-statement"}


// }



// // a statement is an object

setInterval(()=>{

	result = p2.process(callStack[0])
	callStack.splice(0,1)

},2000)




class MIF{
	constructor(){
		this.constant = ""
	}

	call(val){

	}

}

class MIB{
	constructor(sub,cond,meet,arr,trig){
		if(sub){
			this.subject = sub
		}
		if(cond){
		this.condition = cond
		this.meeter = meet}
		this.arr = []
		this.trigger = 0.5
	}

	call(val){
		let tempVal = val
		if(typeof(val) === "boolean"){
			tempVal = val > this.trigger ? true : false
		}

		if(tempVal === false){
			return("ignore")
		}


		if(MIB.cheese(p2.getObj(this.subject),this.condition,this.meeter)){
			this.arr.forEach((e)=>{				
				p2.call(e)
			})
			return(val)
		}

		return(false)
	}

	static cheese(x,cond,y){
		if(x === undefined){
			return(false)
		}
		if(cond === undefined){
			return(x?true:false)
		}
		if(y === undefined){
			return(false)
		}
		switch(cond){
			case "eql":
				return(x === y)
				break;
			case "":
			case "equal":
				return(x == y)
				break;
			case "ueql":
				return(x !== y)
				break;
			case "unequal":
				return(x != y)
				break;
			case ">":
				return(x > y)
				break;
			case "<":
				return(x < y)
				break;
		}
		console.log("unknown condition: "+cond)
		return("unknown")
	}

}


class p2{//why human hard, yes, can not get people what think, relationship bad, why i need friend, how no lonely, cannot independent trash
	///how real, problem many, time none, not that. other problem also no time, how r u a problem,
	/// thats a problem, i cringe no want u see, me only, im suseptable to trash, trash aka cringe
	//idk she fine?????

	static mem = {"ram":{"actions":[]},"processes":{"checkBodyFuncs_":1.5,"relate":1},"myConditions":{"bored":["info",true]}}
	static memRef = {"0.5":{"call":(x)=>{console.log(x?x:"im Bored")}}}

	static cid = 0
	static GetId(){
		this.cid++
		return(this.cid)
	}

	static construct(){
		let m = this.memRef
		m["1.5"] = new MIB()
		m["1.5"].subject = this.mem.myConditions.bored
		m["1.5"].arr.push(0.5)
		let n = this.GetId()
		m[n] = {"call":(x)=>{}}
	}

	static process(s){
		if(s === undefined || s === ""){
			return
		}
		let letterDict = {}
		let wordDict = {}
		for(let i = 0; i < s; i++){
			letterDict[i] = s[i]
		}
		let split = s.split(" ")
		split.forEach((e,i)=>{
			wordDict[i] = e
		})
		this.mem.ram.letterDict = letterDict
		this.mem.ram.wordDict = wordDict


		this.progress(s)

	}

	static progress(s){
		if(this.mem.ram.wordDict[0] === "hi"){
			this.do("say","hi")
		} else if(this.mem.ram.wordDict[0] === "say"){
			this.do("say",wordDict.join(" "))
		}

		if(this.mem.ram.wordDict[0] === "checkBodyFuncs_"){
			callStack.push("");callStack.push("");callStack.push("");callStack.push("");callStack.push("checkBodyFuncs_");
			this.call(this.mem.processes["checkBodyFuncs_"],1)
		}
	}


	static call(item,calltype){
		this.getObj(item).call(calltype)
	}

	static getObj(item){
		if(typeof(item) === "number"){
			item = this.memRef[item]
		} else if(item[0] === "info"){
			item = item[1]
		}
		return(item)
	}

	static do(what,how){
		if(what === "say"){
			console.log(how)
		}
	}


}


p2.construct()

// 