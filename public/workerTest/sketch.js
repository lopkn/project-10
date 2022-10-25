

let bigdict = {}

for(let i = 0; i < 20000; i++){
	bigdict[Math.random()] = Math.random()
}


class workers{

	static workIdistributor = 0

	static worker1 = new Worker("worker1.js")


	static distribute(){
		this.workIdistributor += 1
		return(this.workIdistributor)
	}

	static initiateWorker1(){
		this.worker1.postMessage({"id":this.workIdistributor})
		console.log("worker 1 has started")
		this.worker1.onmessage = (a)=>{
			let e = a.data
			console.log(e)
		}
	}

}

workers.initiateWorker1()

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

		if(ffd <= fd && (x2>x1?fi2l[0]>=x1:fi2l[0]<=x1)&& (y2>y1?fi2l[1]>=y1:fi2l[1]<=y1)){
			return(fi2l)
		}
		return("none")

	}

}

function distance(x,y,a,b){
	let c = x-a
	let d = y-b
	return(Math.sqrt(c*c+d*d))
}

class my3ren{
	static tris = []

	static triMaker(x,y,z,x2,y2,z2,x3,y3,z3){
		this.tris.push({"x":[x,x2,x3],"y":[y,y2,y3],"z":[z,z2,z3]})
	}

	static rayHitTri(trino,ray){
		let tri = tris[trino]



	}

	static throughTriangle(x,y,x2,y2,tri){

		let hit = 0
		let coords = {"x":0,"y":0,"z":0}

		let tx = tri.x[0]
		let ty = tri.y[0]
		let txx = tri.x[1]
		let tyy = tri.y[1]

		let h1 = myMath.findIntersection4P(x,y,x2,y2,tx,ty,txx,tyy)
		if(h1 !== "none"){
			hit += 1
		}

		let txx = tri.x[2]
		let tyy = tri.y[2]

		let h2 = myMath.findIntersection4P(x,y,x2,y2,tx,ty,txx,tyy)
		if(h2 !== "none"){
			hit += 1
		} else {
			if(hit != 1){
				return("none")
			}
		}

		let tx = tri.x[1]
		let ty = tri.x[2]

		let h3 = myMath.findIntersection4P(x,y,x2,y2,tx,ty,txx,tyy)
		if(h3 !== "none"){
			hit += 1
		}

		if(hit < 2){
			return("none")
		}


	}
}