// needed Funcs
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
//EXP8
//EXP9
//EXP10
//EXP11
//EXP12
//EXP13
//EXP14
//EXP15
//EXP16

module.exports = {
	vectorFuncs,
	LuuidGenerator,
	vectorNormal,
	myMath,
	retInsideLine,
	ArrRemoveFromTile
}