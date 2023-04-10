


class RSOLV{

	static Values = {
		"Initial speed":false,
		"Final speed":false,
		"Acceleration":false,
		"Time taken":false
	}


	static equations = [
		{
			"needed":["Initial speed","Time taken","Acceleration"],
			"takeas":["u","t","a"],
			"outputs":"Final speed",
			"equa":"u [+] a [*] t"
		}
	]


	static clearValues(){
		let k = Object.keys(this.Values)

		k.forEach((e)=>{
			this.Values[e] = false
		})

	}

	static giveVal(name,val){
		this.Values[name] = val
	}

	static solv(){
		this.equations.forEach((e)=>{
			if(this.Values[e.outputs] === false){
				let solvable = true
				e.needed.forEach((e)=>{
					if(this.Values[e] === false){
						solvable = false
					}
				})

				if(solvable){

				}


			}
		})
	}
}