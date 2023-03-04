class caller{
	constructor(c){
		this.functionalGroup_ = "caller"
		this.calls = c!==undefined?c:[]
		return(this)
	}

	call(){
		this.calls.forEach((e)=>{
			if(e == 0){return}
			mainMemory.memRef[this.calls].getCalled()
		})
	}
}

let debugging = true

class ifBlock{
	constructor(x,y,caller,anticaller,name,cond){
		this.x = x
		this.cond = cond?cond:"eql"
		this.y = y
		this.name_ = name
		// this.caller = typeof(caller) === "number"?[caller]:caller
		// this.anticaller = typeof(anticaller) === "number"?[anticaller]:anticaller
		this.caller = caller
		this.anticaller = anticaller
		this.id = -1
	}

	getCalled(){
		if(debugging){
			console.log(this.id)
		}
		if(this.x == this.y){
			this.do()
			mainMemory.newCallers(this.caller)
		} else {
			this.eldo()
			mainMemory.newCallers(this.anticaller)
		}
	}

	do(){}
	eldo(){}
}
class ifBlock2{
	constructor(ifunc,caller,anticaller,name){
		this.ifunc = ifunc
		this.name_ = name
		// this.caller = typeof(caller) === "number"?[caller]:caller
		// this.anticaller = typeof(anticaller) === "number"?[anticaller]:anticaller
		this.caller = caller
		this.anticaller = anticaller
		this.id = -1
	}

	getCalled(){
		if(debugging){
			console.log(this.id)
		}
		if(this.ifunc()){
			this.do()
			mainMemory.newCallers(this.caller)
		} else {
			this.eldo()
			mainMemory.newCallers(this.anticaller)
		}
	}

	do(){}
	eldo(){}
}


class mainMemory{
	static memRef = {}
	static nameMemRef = {}
	static id = 0

	static callStack = []

	static callFirst(){
		if(this.callStack[0]){
			this.callStack[0].call()
			this.callStack.splice(0,1)
		}
	}

	static getId(){
		this.id ++
		return(this.id)
	}

	static makeNewMem(x){
		let newObjId = this.getId()
		x.id = newObjId
		this.memRef[newObjId] = x
		if(x.name_ !== undefined){
			if(this.nameMemRef[x.name_] === undefined){
				this.nameMemRef[x.name_] = []
			}
			this.nameMemRef[x.name_].push(newObjId)
		}
		return(x)
	}
	static delMemById(id){
		if(this.memRef[id] !== undefined){
			let obj = this.memRef[id]
			if(obj.name_ !== undefined){
				let index = this.nameMemRef.indexOf(id)
				if(index !== -1){
					this.nameMemRef.splice(index,1)
				}
			}

			delete this.memRef[id]

		}
	}
	static newCallers(arr){
		mainMemory.callStack.push(new caller([arr]))
	}
	static mem = {"current sentence":""}
}

function newIfMem(x,y,caller,anticaller){
		let block = mainMemory.makeNewMem(new ifBlock(x,y,caller,anticaller))
		if(anticaller === ""){block.anticaller = block.id + 1}
		return(block)
	}
function newIfMem2(ifunc,caller,anticaller){
		let block = mainMemory.makeNewMem(new ifBlock2(ifunc,caller,anticaller))
		if(caller === ""){block.anticaller = block.id + 1}
		if(anticaller === ""){block.anticaller = block.id + 1}
		return(block)
	}



function setup(){

	let M = mainMemory.mem
	let MR = mainMemory.memRef
	{
		let IB = newIfMem(1,1,0,0)
		mainMemory.newCallers([IB.id])
		IB.do = ()=>{console.log("successfully started")}
	}// just for testing

	{//following sketch1 [ 1 ]
		let IB = newIfMem2(()=>{return(M["current sentence"] !== undefined)},"","")
		mainMemory.newCallers([IB.id])

		let IB2 = newIfMem2(()=>{return(M["current sentence"].length !== undefined)})

		IB = newIfMem(1,1,0,0)
		IB.do = ()=>{console.log("what was i thinking?")}


		IB2.caller = newIfMem2(()=>{return(M["current sentence"].verb == "is")}).id
		// MR[IB2.caller]

	}


}
setup()



mainMemory.callFirst()
setInterval(()=>{
	mainMemory.callFirst()
},500)