



let memory = {
	"ram":{
		"value1":{"TemporalActivation":100,"certainty":999,"stored":"5"}
	}
}


function createN(inputs,output){
	let N = {
		"GeneralActivation":500,
		"InheritedActivation":0
		"Escore":500,
		"MainInputs":{},
		"output":output
	}

	inputs.forEach((e,i)=>{
		N.MainInputs[e[0]] = e[1]===undefined?500:e[1]
	})

}


let TN = createN([[""]])