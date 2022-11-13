class nur{

	constructor(){
		this.inputMultipliers = [0,0,0]
		this.inputAdders = [0,0,0]
		this.memory = 0
		this.phenotype = ""
		this.outputter = false

		this.usefulness = 0

		this.used = false;

		this.outputLimit = 1;
		this.outputAmount = 1;
		this.decay = 1;
	}

	decay(){
		this.memory -= this.decay
		if(this.memory < 0){
			this.memory = 0;
		}
	}

	activate(amount,num,u){
		this.usefulness += 1
		this.decay();
		let adder = (this.inputAdders[num]+amount)*this.inputMultipliers[num]
		this.memory += adder;
		if(adder > 0){

			if(this.memory-adder < this.outputLimit && this.memory > this.outputLimit){
				let out = this.outputting(u)
			}

		} else {
		if(this.memory < 0){
			this.memory = 0;
		}
		}

		return({"num":this.memory,"out":out})

	}

	outputting(u){
		if(this.outputter){
			console.log(this.phenotype,this.outputAmount)
			if(u){
				return([[this.outputAmount,this.phenotype,this.memory-this.outputLimit]])
			}
			return([this.outputAmount,this.phenotype,this.memory-this.outputLimit])
		} else {
			if(this.linked !== undefined){
				let aout = []
				for(let i = 0; i < this.linked.length; i++){
					let activation = this.linked[i][0].activate(this.outputAmount,this.linked[i][1],u)
					aout.push(activation).out
				}
			}
		}
		// return(this.outputAmount)	
	}


}

class structure{
	constructor(amount,phenotypes){
		this.nurs = []
		for(let i = 0; i < amount+1; i++){
			this.nurs.push(new nur())
			if(phenotypes[i] !== undefined){
				this.nurs[i].outputter = true;
				this.nurs[i].phenotype = phenotypes[i]
				this.nurs[i].used = true;
			}
		}
		let linkers = []
		for(let i = 0; i < phenotypes.length; i++){
			let r = Math.floor(Math.random()*amount)
			if(!this.nurs[r].used){
				this.nurs[r].used = true;
				this.nurs[r].linked.push([this.nurs[i],Math.floor(Math.random()*3)])
				linkers.push(r)
			}
		}

		for(let i = 0; i < linkers.length; i++){
			this.nurs[amount].linked.push([this.nurs[linkers[i]]],[this.nurs[i],Math.floor(Math.random()*3)])
		}

		this.questions = []

		this.events = {
			"h":[[amount,0]],
			"i":[[amount,1]],
			" ":[[amount,2]]
		}

	}

	// activate(a,b){
	// 	this.nurs[this.nurs.length-1].activate(a,b)
	// }

	activate(x){
		for(let i = 0; i < this.events[x].length; i++){
			let e = this.events[x][i];
			this.nurs[e[0]].activate(1,e[1],true)
		}
	}

	evaluate(inn,num,expected,neur){

	}

}

let mainCanvas = document.getElementById("myCanvas")
mainCanvas.height = window.innerHeight
mainCanvas.width = window.innerWidth

mainCanvas.style.top = "0px"
mainCanvas.style.left = "0px"
