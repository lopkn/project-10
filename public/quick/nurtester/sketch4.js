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
				creationNodes[sample.length] = [3,i,j]
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]?!sample[j][p]:sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
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






















