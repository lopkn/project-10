
class s5{
	static samples = []
	static sampleBin = []
	static answers = []
	static numPairs = {}
	static binLength = 10

	static assumeCollapsed = {}

	static findPairs(){
		this.samples.forEach((e,i)=>{
			if(this.numPairs[e] === undefined){
				console.log("create mode: "+e+"->"+this.answers[i])
				this.numPairs[e] = [1,this.answers[i]]
			} else if(this.numPairs[e][1] == this.answers[i]){
				this.numPairs[e][0] += 1
			} else {
				console.log("FATAL ERROR: CONFLICTING ANSWERS: "+e)
			}
		})
		return("done")
	}

	static sampleConvert(){
		let maxInt = Math.pow(2,this.binLength-1)
		this.samples.forEach((e,i)=>{
			if(e > maxInt){console.log("FATAL ERROR: OVERSIZED NUMBER: "+e+" AT "+i)}
			let nbp = numToBinput(e,this.binLength)
			for(let j = 0; j < nbp.length; j++){
				if(this.sampleBin[j] === undefined){this.sampleBin[j] = []}
				this.sampleBin[j][i] = parseInt(nbp[j])
			}
		})
		return(this)
	}

	static collapsable(){
		this.assumeCollapsed = {}
		let collapsables = []
		this.sampleBin.forEach((arr,i)=>{
			let numpow = Math.pow(2,this.sampleBin.length-i-1)
			let tempDict = {}
			for(let j = 0; j < arr.length; j++){
				if(arr[j]){
					let num = this.samples[j]-numpow
					if(this.numPairs[num] !== undefined){
						if(this.numPairs[num][1] != this.answers[j]){
							return;
						}
					} else if(tempDict[num] !== undefined){
						if(tempDict[num] != this.answers[j]){
							return;
						}
					} else {
						tempDict[num] = this.answers[j]
					}
				}
			}
			collapsables.push(i)
			this.assumeCollapsed[i] = true
		})
		return(collapsables)
	}
}




function roughCompare(arr1,arr2,skips){
	let var1 = 0;
	let var2 = 0;
	let v1t = 0;
	let v2t = 0;
	skips = skips?skips:{}
	arr1.forEach((e,i)=>{
		if(skips[i] !== undefined){return}
		let E = arr2[i]
		if(e){
			v1t += 1
			if(e == E){
				var1 += 1
			} else {
				var1 -= 1
			}
		} else {
			v2t += 1
			if(e == E){
				var2 -= 1
			} else {
				var2 += 1
			}
		}
	})
	return([var1/v1t,var2/v2t,v1t,v2t])
}
let sample = []
let answer = []
let ansTotals = [0,0]

function numToBinput(num,l){
	 l = l?l:10
	let str = num.toString(2)
	str = str.substring(str.length-l)
	while(str.length < l){
		str = "0"+str
	}
	return(str)
}

for(let i = 0; i < 10; i++){
	sample[i] = []
}

for(let i = 0; i < 30; i++){
	let str = numToBinput(i)
	for(let j = 0; j < str.length; j++){
		sample[j][i] = parseInt(str[j])
			}
	let ans = (i%3==0)?1:0
	answer.push(ans)
	s5.samples.push(i)
	s5.answers.push(ans)
	if(ans){ansTotals[1]+=1}else{ansTotals[0]+=1}

}



let comps = []
let deprecated = {}
let creationNodes = {}
// let usedNodes = {}

function RCA(){
	comps = []
	for(let i = 0; i < sample.length; i++){
		comps.push(roughCompare(sample[i],answer,deprecated))
	}
}
RCA()

let ansstr = ""
let ansfun = "((arr)=>{return("
function clearMatchesAll(){
	if(ansTotals[0] == 0){ansstr += "true";return;}
	if(ansTotals[1] == 0){ansstr += "false";return;}
	let cp = [0,0,0,0]
	for(let j = 0; j < sample.length; j++){
		let tcp = comps[j]
		if(Math.abs(tcp[0]) == 1 ){
			if(tcp[2] > cp[2]){
				cp = [tcp[0],tcp[1],tcp[2],j]
				if(Math.abs(tcp[1]) == 1){
					cp = [tcp[0],tcp[1],Infinity,j]
					if(tcp[0] == 1){
					ansstr += getBase(j) + "]"
					ansfun += getBaseFun(j)
					} else {
						ansstr += "not "+getBase(j) + "]"
						ansfun += "!"+getBaseFun(j)
					}
					console.log(ansfun)
					return(ansstr)
				}
			}
		} else if(Math.abs(tcp[1]) == 1){
			if(tcp[3] > cp[2]){
				cp = [tcp[0],tcp[1],tcp[3],j]
			}
		}
	}
	let i = cp[3]

	if(Math.abs(cp[0]) == 1){
				sample[i].forEach((e,j)=>{
					if(e){if(deprecated[j]===undefined){deprecated[j] = i+"";ansTotals[answer[j]]-=1}}
				})
			if(cp[0] == 1){
				ansstr += "("+getBase(i)+" or "
				ansfun += "("+getBaseFun(i)+"||"
			} else {
				ansstr += "(not "+getBase(i)+" and "
				ansfun += "(!"+getBaseFun(i)+"&&"
			}
		} else if(Math.abs(cp[1]) == 1){
				sample[i].forEach((e,j)=>{
					if(!e){if(deprecated[j]===undefined){deprecated[j] = i+"";ansTotals[answer[j]]-=1}}
				})
			if(cp[1] == 1){
				ansstr += "(not "+getBase(i)+" or "
				ansfun += "(!"+getBaseFun(i)+"||"
			} else {
				ansstr += "("+getBase(i)+" and "
				ansfun += "("+getBaseFun(i)+"&&"
			}
		}
	if(answer.length == Object.keys(deprecated).length){ansstr+="else"}
		console.log(ansfun)
	return(ansstr)
}
let lastSampleLength = 0

function getBase(i){
	if(creationNodes[i] !== undefined){
		switch(creationNodes[i][0]){
		case 1:
			return("("+getBase(creationNodes[i][1])+ " and not "+getBase(creationNodes[i][2])+")")
			break;
		case 2:
			return("(not"+getBase(creationNodes[i][1])+ " and "+getBase(creationNodes[i][2])+")")
			break;
		case 3:
			return("("+getBase(creationNodes[i][1])+ " xor "+getBase(creationNodes[i][2])+")")
			break;
		case 4:
			return("("+getBase(creationNodes[i][1])+ " and "+getBase(creationNodes[i][2])+")")
			break;
		case 5:
			return("("+getBase(creationNodes[i][1])+ " or "+getBase(creationNodes[i][2])+")")
			break;
		}
	}
	return(i)
}
function getBaseFun(i){
	if(creationNodes[i] !== undefined){
		switch(creationNodes[i][0]){
		case 1:
			return("("+getBaseFun(creationNodes[i][1])+ "&&!"+getBaseFun(creationNodes[i][2])+")")
			break;
		case 2:
			return("(!"+getBaseFun(creationNodes[i][1])+ "&&"+getBaseFun(creationNodes[i][2])+")")
			break;
		case 3:
			return("("+getBaseFun(creationNodes[i][1])+ "?!"+getBaseFun(creationNodes[i][2])+":"+getBaseFun(creationNodes[i][2])+")")
			break;
		case 4:
			return("("+getBaseFun(creationNodes[i][1])+ "&&"+getBaseFun(creationNodes[i][2])+")")
			break;
		case 5:
			return("("+getBaseFun(creationNodes[i][1])+ "||"+getBaseFun(creationNodes[i][2])+")")
			break;
		}
	}
	return("arr["+(i)+"]")
}

function proliferate(){
		let lsl = sample.length
		for(let i = 0; i < lsl-lastSampleLength-1; i++){
			for(let j = i+1; j < lsl-lastSampleLength; j++){
				let tarr = []
				creationNodes[sample.length] = [1,i,j]
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]&&!sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				creationNodes[sample.length] = [2,i,j]
				answer.forEach((e,p)=>{
					tarr.push((!sample[i][p]&&sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				// creationNodes[sample.length] = [3,i,j]
				// answer.forEach((e,p)=>{
				// 	tarr.push((sample[i][p]?!sample[j][p]:sample[j][p])?1:0)
				// })
				// sample.push(tarr)
				// tarr = []
				creationNodes[sample.length] = [4,i,j]
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]&&sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				creationNodes[sample.length] = [5,i,j]
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]||sample[j][p])?1:0)
				})
				sample.push(tarr)
			}
		}
		lastSampleLength = lsl
}
//A and not B, B and not A, xor, or, and




function allDeprecated(){
	return(Object.keys(deprecated.length))
}
function numBinArr(num,l){
	l = l?l:10
	let str = num.toString(2)
	str = str.substring(str.length-l)
	while(str.length < l){
		str = "0"+str
	}
	let arr = []
	for(let i = 0; i < str.length; i++){
		arr.push(str[i])
	}
	return(arr)
}
function fin(str){
	let b = 1
	for(let i = 0; i < str.length; i++){
		if(str[i] == "("){b+=1}
		if(str[i] == ")"){b-=1}
	}
	for(let i = 0; i < b; i++){
		str = str + ")"
	}
	return(str+"(numBinArr())")
}
















