// needed Funcs


var CURRENTCONFIGS = require("./config")
var BLOCKSALL = CURRENTCONFIGS.BLOCKSALL

function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}
function fastdistance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(a*a+b*b)
}



//EXP1

class vectorFuncs{
	static vectorizor(px,py,vx,vy){
		//this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
		//xb+ya,yb-xa
		return([px*vy+py*vx,py*vy-px*vx])
	}
	static INvectorizor(px,py,vx,vy){
		//xb-ya,yb+xa
		return([px*vy-py*vx,py*vy+px*vx])
	}
	static ShatterComponents(vx,vy,dx,dy){
		let normalized = this.originVectorNormalize(dx,dy)
		let invectorized = this.INvectorizor(vx,vy,normalized[0],normalized[1])

		let tyaxis = this.vectorizor(normalized[0],normalized[1],1,0)

		let resultx = [invectorized[1]*normalized[0],invectorized[1]*normalized[1]]
		let resulty = [invectorized[0]*tyaxis[0],invectorized[0]*tyaxis[1]]
		return([resultx,resulty,[invectorized[1],invectorized[0]]])

	}

	static ShComp(vx,vy,dx,dy){
		let normalized = this.originVectorNormalize(dx,dy)

		let dp = this.dotProduct(vx,vy,normalized[0],normalized[1])

		let n2 = [normalized[1],-normalized[0]]

		let dp2 = this.dotProduct(vx,vy,n2[0],n2[1])
		let resultx = [normalized[0]*dp,normalized[1]*dp]
		let resulty = [n2[0]*dp2,n2[1]*dp2]

		return([resultx,resulty,[dp,dp2]])

	}

	static dotProduct(x1,y1,x2,y2){
		return(x1*x2+y1*y2)
	}

	static originVectorNormalize(vx,vy){
		let d = Math.sqrt(vx*vx+vy*vy)
		return([vx/d,vy/d])
	}
}


//EXP2
class LuuidGenerator{
	static counter = 0

	static generate(){

		let hexstr = this.counter.toString(16)
		while(hexstr.length < 10){
			hexstr = "0"+hexstr
		}
		this.counter ++
		return(hexstr)
	}
}

//EXP3
function vectorNormal(x1,y1,x2,y2){
  let d = distance(x1,y1,x2,y2)
  let dx = (x2-x1)/d
  let dy = (y2-y1)/d
  return([-dy,dx,dy,-dx])
}

//EXP4
class myMath{
	static pointInLine(px,py,x1,y1,x2,y2){
	  let extremelySmall = 0.000000001
	  if((px <= x1 + extremelySmall && px >= x2 - extremelySmall )||(px >= x1 - extremelySmall && px <= x2 + extremelySmall)){
	    if((py <= y1 + extremelySmall && py >= y2  - extremelySmall)||(py >= y1 - extremelySmall && py <= y2 + extremelySmall)){
	      return(true)
	    }
	  }
	  return(false)
	}
	

	static midPointOfLine(x1,y1,x2,y2){
		return([(x1+x2)/2,(y1+y2)/2])
	}

	static cosineInterp(x1,y1,x2,y2,x){
		let ab = x-x1
		if(y1 < y2){
		return(0.5 * Math.cos(ab*Math.PI/(x2-x1)-Math.PI)+(y2+y1)*0.5)}
		return(0.5 * Math.cos(ab*Math.PI/(x2-x1))+(y2+y1)*0.5)
	}
	static bicubicInterp(s1,x1,y1,s2,x2,y2,x){
		let C = s1
		//3ax^2 + 10b + C = -1
		// let B = (3*s1*x2-3*x2-3*y2)/(-x2*x2)
		// let A = (y2-s1*x2-B*x2*x2)/(x2*x2*x2)
		let ax = x2-x1
    let ay = y2-y1
        
		let B = (ax*s2-3*ay+2*ax*s1)/(-ax*ax)
    let A = (ay-s1*ax-B*ax*ax)/(ax*ax*ax)

		let X = x-x1
		return(A*X*X*X + B*X*X + C*X + y1)
	}
	static bicubicInterp2(x1,y1,x2,y2,x3,y3,x4,y4,x){
		let slope1 = this.getSlopeOf(x1,y1,x2,y2)
		let slope2 = this.getSlopeOf(x2,y2,x3,y3)
		let slope3 = this.getSlopeOf(x3,y3,x4,y4)

		let S1 = 0
		let S2 = 0
		if(slope1 == slope2){
			S1 = slope1
		} else {

			// let aS1 = -1/slope1
			// let aS2 = -1/slope2

			// let intsct = this.findIntersection2L(aS1,x1,y1,aS2,x3,y3)

			// S1 = -1/this.getSlopeOf(intsct[0],intsct[1],x2,y2)

			S1 = this.getAverageSlopeOf(x1,y1,x2,y2,x3,y3)

		}

		if(slope2 == slope3){
			S2 = slope2
		} else {
			// let aS1 = -1/slope2
			// let aS2 = -1/slope3

			// let intsct = this.findIntersection2L(aS1,x2,y2,aS2,x4,y4)

			// S2 = -1/this.getSlopeOf(intsct[0],intsct[1],x3,y3)
			S2 = this.getAverageSlopeOf(x2,y2,x3,y3,x4,y4)
		}

		return(this.bicubicInterp(S1,x2,y2,S2,x3,y3,x))
	}

	static getSlopeOf(x1,y1,x2,y2){
		return((y2-y1)/(x2-x1))
	}

	static getAverageSlopeOf(x1,y1,x2,y2){
		let d1 = distance(x1,y1,0,0)
		let ax1 = x1/d1
		let ay1 = y1/d1

		let d2 = distance(x2,y2,0,0)
		let ax2 = x2/d2
		let ay2 = y2/d2
		return(this.getSlopeOf(0,0,ax1+ax2,ay2+ay1))
	}

	static findIntersection2L(s1,x1,y1,s2,x2,y2){
		if(s1 == s2){
			// if(x1 == x2){
			// 	return([x1,y1])
			// }
			return("none")
		}
		let X = 0
		if(s1 == Infinity || s1 == -Infinity){
			X = x1
		} else if(s2 == Infinity || s2 == -Infinity){
			X = x2
		} else {X = (y1-s1*x1+s2*x2-y2)/(s2-s1)}

		if(s1 != Infinity && s1 != -Infinity){
			return([X,s1*X-s1*x1+y1])
		} else {
			return([X,s2*X-s2*x2+y2])
		}

	}

	static findIntersection4P(x1,y1,x2,y2,x3,y3,x4,y4){

		let iSlope = this.getSlopeOf(x1,y1,x2,y2)

		let lSlope = this.getSlopeOf(x3,y3,x4,y4)

		let cent = this.midPointOfLine(x3,y3,x4,y4)

		let fd = distance(x4,y4,cent[0],cent[1])

		let fi2l = this.findIntersection2L(iSlope,x1,y1,lSlope,x3,y3)
		if(fi2l == "none"){
			return("none")
		}
		let ffd = distance(fi2l[0],fi2l[1],cent[0],cent[1])

		if(ffd <= fd){
			return(fi2l)
		}
		return("none")

	}

}

//EXP5
function retInsideLine(x,y,x1,y1){
	let fout = []
	let dx = x1 - x
	if(dx != 0){
	let slope = (y1-y)/(dx)
	let dist = distance(x,y,x1,y1)

	for(let i = 1; i < dist; i++){
		let e = x+i*dx/dist
		let tout = [Math.round(e),Math.round(y + (e-x)*slope)]
		if(fout[0] == undefined||fout[fout.length-1][0] != tout[0] ||fout[fout.length-1][1] != tout[1]){
		fout.push(tout)}
	}


	} else {
		slope = y1 > y ? 1 : -1
		for(let i = 1; i < Math.abs(y1-y)+1; i++){
		let tout = [x,y + i*slope]
		if(fout[0] == undefined||fout[fout.length-1][0] != tout[0] ||fout[fout.length-1][1] != tout[1]){
		fout.push(tout)}
		}
	}

	return(fout)

}
//EXP6
function ArrRemoveFromTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){

		let isRemove = 0

		for(let j = 0 ; j < type.length; j++){
			if(split[i].split(":")[0] == type[j]){
				isRemove = 1
				break;
				
			}
		}
		if(isRemove == 0){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
}
//EXP7
function minSub(act,sub,min){

	let a = act - sub
	if(a < min){
		return([min,min-a])
	}
	return([a,0])

}

//EXP8
function vectorNormalize(original,multiplier){

	if(multiplier == undefined){
		multiplier = 1
	}

	let tx = original[2] - original[0]
	let ty = original[3] - original[1]

	let d = Math.sqrt(tx*tx+ty*ty)

	if(d == 0){
		return(original)
	}

	tx = tx*multiplier/d
	ty = ty*multiplier/d

	return([original[0],original[1],original[0]+tx,original[1]+ty])

}
//EXP9
function arrayBoundingBox(arr,type){

	if(type = "notArr"){

	}

	let maxx
	let maxy
	let minx
	let miny

	arr.forEach((e)=>{

		if(e[0] > maxx){
			maxx = e[0]
		}
		if(e[0] < minx){
			minx = e[0]
		}
		if(e[1] > maxy){
			maxy = e[1]
		}
		if(e[1] < miny){
			miny = e[1]
		}

	})

	return([maxx,minx,maxy,miny])

}
//EXP10

function randomItem(List){
	let sum = 0
	for(let i = 1; i < List.length; i+=2){
		sum += List[i]
	}
	let value = Math.random()*sum
	let tempvalue = 0
	for(let i = 1; i < List.length; i+=2){
	tempvalue += List[i]
	if(value < tempvalue){
		return(List[i-1])
		}
	}


}
//EXP11
function TNEWgenerateTileFromNumber(input,d){


	if(d == "O"){
		let tile = "G:"
		if(input < 70){
			tile += "1"
		} else if(input < 120){
			tile += "2"
		} else if(input < 140){
			tile += "3"
		} else if(input < 150){
			tile += "4"
		} else if(input < 210){
			tile += "5"
		} else if(input < 260){
			tile += "6"
		} else if(input < 310){
			tile += "7"
		} else if(input < 335){
			tile += "8"
		} else if(input >= 335){
			tile += "9"
		}
		if(input >= 150 && input < 300){
			if(Math.random() > 1-input/30000){
				tile += "-B:3-T:"+(Math.floor(Math.random()*9))+"-S:" + (Math.floor(Math.random()*3)+4)
			}
		}

		


			return(tile)
	}

	 else if(d == "T"){
		let tile = "G:"
		 if(input < 90){
			tile += "2"
		} else if(input < 140){
			tile += "3"
		} else if(input < 145){
			tile += "4"
		} else if(input < 230){
			tile += "5"
		} else if(input < 300){
			tile += "6"
		} else if(input < 335){
			tile += "7"
		} else if(input >= 335){
			tile += "8"
		}
		if(input >= 150 && input < 300){
			if(Math.random() > 1-input/30000){
				tile += "-B:3-T:1-S:" + (Math.floor(Math.random()*3)+1)
			}
		}

		


			return(tile)
	}
}

//EXP12
function brackedator(str,option){

	let tempbrackedate = []
	let tempbasestring = ""

	let outbases = []
	let outbaselinks = []
	let outeffect = "base"
	let ttout = ""

	for(let i = 0; i < str.length; i++){
		let brconfig =  CURRENTCONFIGS.brackets[str[i]]
		if(brconfig != undefined){
			
			if(brconfig[0] == "c"){

				if(tempbrackedate[tempbrackedate.length-1] == brconfig.substring(1)){
					tempbrackedate.pop()
				} else {
					return("BRACKETS NOT MATCHING")
				}

			} else {
				tempbrackedate.push(str[i])
			}

		} else if(tempbrackedate.length == 0){
			tempbasestring += str[i]

		}


		if(tempbrackedate.length == 0&&str[i] == ":"){
				outeffect == "link"
				outbases.push(ttout)
				ttout = ""
			}else if(tempbrackedate.length == 0&&str[i] == "-"){
				outeffect == "base"
				outbaselinks.push(ttout)
				ttout = ""
			} else {
					ttout += str[i]
			}

	}
	outbaselinks.push(ttout)

	if(option == undefined || option == "normal"){
		let outdict = {}
		for(let i = 0; i < outbases.length; i++){
			outdict[outbases[i]] = outbaselinks[i]
		}
		return(outdict)

	} else if(option == "debug1"){


		return(tempbasestring)


	} else if(option == "debug2"){
		return([outbases,outbaselinks])
	}

}

//EXP13

function generateChestContents(input){

	let outitems = ""

	if(typeof(input)=="string"){
		input = input.split("==")
	}

	for(let i = 0; i < input.length; i++){

			if(CURRENTCONFIGS.chestLootTables[input[i]] == undefined){
				outitems += ("=" + input[i])
			} else {
				outitems += "=" + randomItem(CURRENTCONFIGS.chestLootTables[input[i]])
			}
		}

		return(outitems.substring(1))

}

//G:1-Ch:[B:1-Bbr:{r:1}=Bj:{h:[b:1]}]
//EXP14
function alreadyHasBlockATT(str,att){
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i].split(":")[0] == att){
      return(true)
    }
  }
  return(false)
}


//EXP15

function alreadyHasBlock(str){
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i].split(":")[0] == "B"){
      return(true)
    }
  }
  return(false)
}



//EXP16
function strHasBrackets(str){
	for(let i = 0; i < str.length; i++){
		if(str[i] == "(" || str[i] == "[" || str[i] == "{" || str[i] == ")" || str[i] == "]" || str[i] == "}"){
			return(str[i])
		}
	}
	return(false)
}
//EXP17
function strHas(str,has){
	try{
	for(let i = 0; i < str.length; i++){
		for(let j = 0; j < has.length; j++){
			if(str[i] == has[j]){
				return([i,j])
			}
		}
	}
	return(false)
		} catch{
			console.log("cerr: strHas",str,has)
		}
}

//EXP18
function removeOutterBracket(str){
	if(str[0] == "[" && str[str.length-1] == "]"){
		str = str.substring(1)
		str = str.slice(0,-1)
	}

	return(str)
}
//EXP19
function bracketCompressionProcess(str,arr,parseLevel){

	let outStr = ""
	let parsedInt = ""
	let isParsing = 0

	for(let i = 0; i < str.length; i++){
		if(str[i] != "^" && isParsing == 0){
			outStr += str[i]
		} else if(str[i] != "^" && isParsing == 1){
			parsedInt += str[i] 
		} else {
			if(isParsing == 0){
				isParsing = 1
			} else {
				isParsing = 0

				let splitarr = arr[parseLevel].split("&")

				let toutStr = ("[" + splitarr[parseInt(parsedInt)] + "]")

				outStr += bracketCompressionProcess(toutStr,arr,parseLevel+1)
			}
		}
	}
		return(outStr)
}
//EXP20
///input a attribute string and an attribute to find the value of the attribute
function bracketLevels(str){
  let level = 0

  let counters = []

  let out = [""]
  for(let i = 0; i < str.length; i++){
    if(str[i] == "(" || str[i] == "[" || str[i] == "{" ){

    	if(counters[level] == undefined){
    		counters[level] = 0
    	} else {
    		counters[level] ++
    	}
	  out[level] += ("^"+counters[level]+"^")
      level += 1
      if(out[level] == undefined){
      	out[level] = ""
      }
    } else if(str[i] == ")" || str[i] == "]" || str[i] == "}" ){
    	out[level] += ("&")
      level -= 1
    } else {
      out[level] += str[i]
    }
  }
  return(out)
}
//EXP21
function BASEATTRIBUTESOF(str){
	let outstr = ""
	let a = bracketLevels(str)[0]
	let deleting = false
	for(let i = 0; i < a.length; i++){
		if(a[i] == "^"){
			deleting = !deleting
			continue
		}if(deleting){
			continue
		}

		outstr += a[i]

	}
	let outarr = []
	let split1 = outstr.split("-")
	for(let i = 0; i < split1.length; i++){
		outarr.push(split1[i].split(":")[0])
	}


	return(outarr)
}

//EXP22
function TNEWATTRIBUTEOF(str,e){
  if(str == undefined){return("NONE")}

  	if(!strHasBrackets(str)){

	  let split = str.split("-")
	  for(let i = 0; i < split.length; i++){
	  	let act = split[i].split(":")
	  	if(act[0] == e){
	  		return(act[1])
	  	}
	  }
	  return("NONE")
	}

	 else {
		let BLs = bracketLevels(str)

  let BaseSplit = BLs[0].split("-")
  for(let i = 0; i < BaseSplit.length; i++){
  	let act = BaseSplit[i].split(":")
  	if(act[0] == e){

  		if(strHas(act[1],"^")){

  		return(bracketCompressionProcess(act[1],BLs,1))

  		} else {

  		return(act[1])
  	}

  	}
  }
  return("NONE")


	}


}
//EXP23

function removeAttributeOf(str,e){
	let BLs = bracketLevels(str)
	let split = BLs[0].split("-")
	let outstr = ""

	for(let i = 0; i < split.length; i++){
		let split2 = split[i].split(":")
		if(split2[0] != e){
			outstr += "-" + split2[0] + ":" + TNEWATTRIBUTEOF(str,split2[0])
		}
	}

	return(outstr.substring(1))

}
//EXP24
///inputs an array and an item, returns index of item in array's second item, returns false if not in array
function inListRS(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp[0] == arr[i][0] && inp[1] == arr[i][1] ){
      return(i)
    }
  } return(false)
}
//EXP25
//for effects
function inEffectArr(effect,arr){
	for(let i = 0; i < arr.length; i++){
		if(arr[i][0] == effect){
			return(true)
		}
	}
	return(false)
}
//EXP26
///inputs an array and an item, returns index of item in array, returns false if not in array
function inListR(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp == arr[i]){
      return(i)
    }
  } return(false)
}


//EXP27
function ATTRIBUTESTROF(str,type){
	let a = TNEWATTRIBUTEOF(str,type)
	if(a != "NONE"){

		return(type+":"+a)

	}
	return("")
}
//EXP28

function TNEWbreakBlockBy(str,a){

	let tblockATT = TNEWATTRIBUTEOF(str,"B")
	if(tblockATT != "NONE"){
		let dura = parseInt(TNEWATTRIBUTEOF(str,"D"))
		if(isNaN(dura)){
			dura = BLOCKSALL[tblockATT][2]
		}
		let fdura = dura-a
		if(fdura > 0){
			return(removeAttributeOf(str,"D")+"-D:"+fdura)}
		else {
			return("remove")
		}
	}
	return("no block")
}
//EXP29

function getBlockDurability(str,a){
	let blockATT = TNEWATTRIBUTEOF(str,"B")
	if(blockATT != "NONE"){

		let dura = parseInt(TNEWATTRIBUTEOF(str,"D"))
		if(isNaN(dura)){
			dura = BLOCKSALL[blockATT][2]
		}

		return(dura)
	} else {
		return("no block")
	}
}
//EXP30
function TNEWremoveFromTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){
		if(split[i].split(":")[0] != type){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
}
//EXP31

function tileItemable(str){
	if(str == undefined){
		return(false)
	}
	if(TNEWATTRIBUTEOF(str,"B") == "NONE" && TNEWATTRIBUTEOF(str,"I") == "NONE"){
		return(true)
	}
	return(false)
}

//EXP32
function TNEWkeepOnlyTile(str,type){
	let split = str.split("-")
	let fin = ""
	for(let i = 0; i < split.length; i++){
		if(split[i].split(":")[0] == type){
			fin += "-" + split[i]
		}
	}
	return(fin.substring(1))
}
//EXP33
function getRelativity(p,x,y){
	let outx = 0
	let outy = 0
	if(x == undefined){
		return("NONE")
	}
	if(x[0] == "="){
		if(x[1] != undefined){
			outx = enDict[p].x + parseInt(x.substring(1))
		} else {
			outx = enDict[p].x

		}

	} else {
			outx = parseInt(x)

			if(isNaN(outx)){
				return("NONE")
			}
	}

	if(y == undefined){
		return("NONE")
	}

	if(y[0] == "="){
		if(y[1] != undefined){
			outy = enDict[p].y + parseInt(y.substring(1))
		} else {
			outy = enDict[p].y
		}
	} else {
		outy = parseInt(y)
			if(isNaN(outy)){
				return("NONE")
			}
	}

	return([outx,outy])
}


//EXP34
function itemStackable(item1,item2){

	if(TNEWATTRIBUTEOF(item1,"stk") == "1" || TNEWATTRIBUTEOF(item2,"stk") == "1" ){
		return(false)
	}

	let baseatt = BASEATTRIBUTESOF(item1)
	for(let i = 0; i < baseatt.length; i++){
		if(baseatt[0] == "A" || baseatt[0] == "M"){
			continue;
		}
		if(TNEWATTRIBUTEOF(item1,baseatt[i]) != TNEWATTRIBUTEOF(item2,baseatt[i])){
			return(false)
		}

	}

	return(true)

}
//EXP35
function structureArrDecompress(arr){
	let outarr = []
	outarr[0] = arr[0]

	for(let i = 1; i < arr.length; i++){
		if(arr[i][0] == "@"){
			let split = (arr[i].substring(1)).split("@")
			let number = parseInt(split[1])
			let block = split[0]
			for(let j = 0; j < number; j++){

				outarr.push(block)
			}
		} else {
			outarr.push(arr[i])
		}
	}
	return(outarr)
}

//EXP36
function structureArrCompress(arr){

	let hold = "STARTHOLD"
	let number = 2

	for(let i = 1; i < arr.length; i++){

		if(arr[i] == hold){
			if(arr[i-1][0] != "@"){
				arr[i-1] = "@" + arr[i-1] + "@2"
			} else {
				number += 1
				arr[i-1] = "@" + hold + "@" + number
			}
			hold = arr[i]
			arr.splice(i,1)
			i--
		} else {
			hold = arr[i]
			number = 2
		}
	}
	return(arr)

}

//EXP37

function rotateStructure(arr,rotate,mirror){
	let newArr = []

		//fill in the spaces undefined
		while(((arr.length-1)/arr[0])%1 != 0){
			arr.push("")
		}



	if(rotate == 1 || rotate == "left"){

		let newBorder = (arr.length-1)/arr[0]
		newArr[0] = newBorder
		for(let j = arr[0]; j > 0; j--){
			for(let i = 0; i < newBorder; i++){
				newArr.push(arr[j+i*arr[0]])
			}

		}
	} else if(rotate == 2 || rotate == "180"){
		
		newArr[0] = arr[0]
		for(let i = arr.length-1; i > 0; i--){
			newArr.push(arr[i])
		}

	} else if(rotate == 3 || rotate == "right"){
		let newBorder = (arr.length-1)/arr[0]
		newArr[0] = newBorder
		for(let j = 1; j <= arr[0]; j++){
			for(let i = newBorder -1; i > -1; i--){
				newArr.push(arr[j+i*arr[0]])
			}

		}



	} else {
		newArr = arr
	}

	if(mirror == 1){
		let newBorder2 = (newArr.length-1)/newArr[0]
		let half = Math.floor(newArr[0]/2) + 1
		let na0 = newArr[0]
		for(let i = 1; i < half; i++){
			for(let j = 0; j < newBorder2; j++){
				let Swap_temp = newArr[i+j*na0]
				newArr[i+j*na0] = newArr[(na0-i+1)+j*na0]
				newArr[(na0-i+1)+j*na0] = Swap_temp
			}
		}
	}



	return(newArr)
}


//EXP38

function grabFirstOfDict(d){
	return(d[Object.keys(d)[0]])
}
//EXP39
function deductStrAtt(str){

	let split = str.split(":")
	if(!isNaN(split[1])){
		return(split[0]+":"+(parseInt(split[1])-1))
	}

}
//EXP40
function amountOfItems(p){
	// let r = findPlayerInArr(p)
	let player = enDict[p]

	try{if(player.Inventory){}} catch {console.log("cerr amOI",p)}

  if(player.Inventory[player.selectedSlot] != undefined){
    let e = TNEWATTRIBUTEOF(player.Inventory[player.selectedSlot],"A")
    return(e)
  } else {return("none")}
}
//error here
//EXP41
function selectedSlotItems(p){
	let r = p
	if(enDict[r] !== undefined){
	let e = enDict[r].selectedSlot
	if(enDict[r].Inventory[e] != undefined){
		let split = enDict[r].Inventory[e].split('-')

		return(split[0])
	
	}} else {
		console.log(p,"error")
	}
}

//EXP42


//EXP43
function DFNorm(dict,val){
	if(dict[val] == undefined){
		return(dict.default)
	}
	return(dict[val])
}


//EXP44
function mergeDict(d,d2){
	let obj = Object.keys(d2)
	obj.forEach((e)=>{
		d[e] = d2[e]
	})
	return(d)
}
//EXP45
	class myStat{
		static ranges = []
		static values = []

		static totalVal = 0

		static pushVal(r1,r2,v){
			if(v !== undefined){
			this.ranges.push([r1,r2])
			this.values.push(v)
			this.totalValUpdate()
			}else if(r2 === undefined){
				this.ranges.push([r1,r1])
				this.values.push(1)
				this.totalValUpdate()
			} else {
				this.ranges.push([r1,r2])
				this.values.push(1)
				this.totalValUpdate()
			}
		}

		static percentile(p,t){
			return(p/1*(t-1)+1)
		}

		static removeVal(i){
			this.ranges.splice(i,1)
			this.values.splice(i,1)
			this.totalValUpdate()
		}
		static clear(){
			this.totalVal = 0
			this.ranges = []
			this.values = []
		}

		static totalValUpdate(){
			this.totalVal = 0
			this.values.forEach((e)=>{
				this.totalVal += e
			})
		}

		static getValuePlace(n){
			let ctr = n
			let vlctr = 0
			while(ctr > 0){
				ctr -= this.values[vlctr]
				vlctr += 1
			}

			if(vlctr == 0){
				vlctr = 1
			}
			return({"place":vlctr-1,"over":-ctr})

		}

		static getValue(n){
			let d = this.getValuePlace(n)
			d["gvn"] = this.ranges[d.place][0] + (this.ranges[d.place][1]-this.ranges[d.place][0])*(this.values[d.place]-d.over)/this.values[d.place]
			
			return(d)
		}

		static vExplode(n,r){
			let d1 = this.getValue(n)
			let d2 = this.getValue(r)

			return([d2.gvn-d1.gvn,d1,d2])

		}

		static rearrange(){
			this.ranges.sort((a,b)=>{
				return(a[0]-b[0])
			})
		}



	}
//EXP46
//EXP47
//EXP48
//EXP49
//EXP50

module.exports = {
	vectorFuncs,
	LuuidGenerator,
	vectorNormal,
	myMath,
	retInsideLine,
	ArrRemoveFromTile,
	minSub,
	vectorNormalize,
	arrayBoundingBox,
	randomItem,
	TNEWgenerateTileFromNumber,
	brackedator,
	generateChestContents,
	alreadyHasBlockATT,
	alreadyHasBlock,
	strHasBrackets,
	strHas,
	removeOutterBracket,
	bracketCompressionProcess,
	bracketLevels,
	BASEATTRIBUTESOF,
	TNEWATTRIBUTEOF,
	removeAttributeOf,
	inListRS,
	inEffectArr,
	inListR,
	ATTRIBUTESTROF,
	TNEWbreakBlockBy,
	getBlockDurability,
	TNEWremoveFromTile,
	tileItemable,
	TNEWkeepOnlyTile,
	getRelativity,
	itemStackable,
	structureArrDecompress,
	structureArrCompress,
	rotateStructure,
	grabFirstOfDict,
	deductStrAtt,
	amountOfItems,
	selectedSlotItems,
	DFNorm,
	mergeDict,
	myStat
}