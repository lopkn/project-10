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

for(let i = 0; i < 1020; i++){
	let str = numToBinput(i)
	for(let j = 0; j < str.length; j++){
		sample[j][i] = parseInt(str[j])
			}
	answer.push((i%6==0)?1:0)
}



let comps = []
let deprecated = {}
let creationNodes = {}

function RCA(){
	comps = []
	for(let i = 0; i < sample.length; i++){
		comps.push(roughCompare(sample[i],answer,deprecated))
	}
}
RCA()

let ansstr = ""
function clearMatchesAll(){
	let cp = [0,0,0,0]
	for(let j = 0; j < sample.length; j++){
		let tcp = comps[j]
		if(Math.abs(tcp[0]) == 1 ){
			if(tcp[2] > cp[2]){
				cp = [tcp[0],tcp[1],tcp[2],j]
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
					if(e){deprecated[j] = i+""}
				})
			if(cp[0] == 1){
				ansstr += "("+(creationNodes[i]?i+"("+creationNodes[i]+")":i)+" or "
			} else {
				ansstr += "(not "+(creationNodes[i]?i+"("+creationNodes[i]+")":i)+" and "
			}
		} else if(Math.abs(cp[1]) == 1){
				sample[i].forEach((e,j)=>{
					if(!e){deprecated[j] = i+""}
				})
			if(cp[1] == 1){
				ansstr += "(not "+(creationNodes[i]?i+"("+creationNodes[i]+")":i)+" or "
			} else {
				ansstr += "("+(creationNodes[i]?i+"("+creationNodes[i]+")":i)+" and "
			}
		}
	if(answer.length == Object.keys(deprecated).length){ansstr+="else"}
	return(ansstr)
}
let lastSampleLength = 0
function proliferate(){
		let lsl = sample.length
		for(let i = 0; i < lsl-lastSampleLength-1; i++){
			for(let j = i+1; j < lsl-lastSampleLength; j++){
				let tarr = []
				creationNodes[sample.length] = i + " and not " + j
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]&&!sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				creationNodes[sample.length] = "not "+ i + " and " + j
				answer.forEach((e,p)=>{
					tarr.push((!sample[i][p]&&sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				creationNodes[sample.length] = i + " xor " + j
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]?!sample[j][p]:sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				creationNodes[sample.length] = i + " and " + j
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]&&sample[j][p])?1:0)
				})
				sample.push(tarr)
				tarr = []
				creationNodes[sample.length] = i + " or " + j
				answer.forEach((e,p)=>{
					tarr.push((sample[i][p]||sample[j][p])?1:0)
				})
				sample.push(tarr)
			}
		}
		lastSampleLength = lsl
}
//A and not B, B and not A, xor, or, and




















