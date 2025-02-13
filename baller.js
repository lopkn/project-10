let io;
let myMath
let crypto = require("crypto")
let INFUNCS = require("./funcs.js")


let fs = require("fs")
function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

let vectorNormalize;
let vectorFuncs;
function copyFuncs(v,v2){
	vectorNormalize = v
	vectorFuncs = v2
}

class baller{

	static balls = {}

	static setio(i,m,v,v2){
		io = i
		myMath = m
		copyFuncs(v,v2)
	}
	static handle(d,e,n,socket){//date, message, content, socket
		if(e === "keyd"){
			if(e.dead){return}
			n=n.toLowerCase()
			if(n === "d"){
				this.balls[socket.id].cax += 1
			}
			if(n === "a"){
				this.balls[socket.id].cax -= 1
			}
			if(n === "s"){
				this.balls[socket.id].cay += 1
			}
			if(n === "w"){
				this.balls[socket.id].cay -= 1
			}if(n === "shift"){
				this.balls[socket.id].mass *= 1.4
				this.balls[socket.id].holding = true
			}
		} else if(e === "keyu"){
			if(e.dead){return}
			n=n.toLowerCase()
			if(n === "d"){
				this.balls[socket.id].cax += -1
			}
			if(n === "a"){
				this.balls[socket.id].cax -= -1
			}
			if(n === "s"){
				this.balls[socket.id].cay += -1
			}
			if(n === "w"){
				this.balls[socket.id].cay -= -1
			}
			if(n === "shift"){
				this.balls[socket.id].mass /= 1.4
				this.balls[socket.id].holding = undefined
			}

		} 
	}

	static disconnect(s){
		delete this.balls[s.id]
	}
	static join(s){
		this.balls[s.id] = {"x":0,"y":0,"r":25,"color":"blue","vx":0,"vy":0,"cax":0,"cay":0,"mass":1,"hp":100}
	}

	static started = false;
	static start(){
		if(!this.started){
			this.started = true
		} else {return}
		this.interval = setInterval(()=>{this.loop()},35)
	}
	static loop(){
		io.to("G10.9").emit("update",JSON.stringify(this.balls))

		let ballArr = Object.values(this.balls)




		ballArr.forEach((e)=>{
			e.vx += e.cax
	    	e.vy += e.cay
	    
	    	e.x += e.vx
	    	e.y += e.vy


	    	e.vx -= e.x*0.0005
	    	e.vy -= e.y*0.0005

	    	e.hp -= distance(e.x,e.y,0,0)/10000
	    	if(e.hp<0){
	    		dead(e)
	    	}


	    	ballArr.forEach((E)=>{
		      collided(E,e)
		      if(isNaN(e.vx)){console.log(E,e);noLoop()}
		    })
		})
		

    
    
	}
}

function dead(b){
	b.cax = 0
	b.cay = 0
	b.dead = true
	b.color = "red"
}

function collided(b1,b2,d){
  if(d===undefined){d = distance(b1.x,b1.y,b2.x,b2.y)}
  if(d===0){return}
  if(b1.r + b2.r > d){
    b2.normx = (b2.x-b1.x)/d
    b2.normy = (b2.y-b1.y)/d
    b1.normx = -b2.normx //normx is the normal (away bounce)
    b1.normy = -b2.normy
    
    b2.vdot = -dot(b2.normx,b2.normy,b2.vx,b2.vy)
    b1.vdot = -dot(b1.normx,b1.normy,b1.vx,b1.vy)
    
    let overlap = b2.r + b1.r - d
    
    
    b1.x += b1.normx * overlap/1.999
    b1.y += b1.normy * overlap/1.999
    b2.x += b2.normx * overlap/1.999
    b2.y += b2.normy * overlap/1.999
    


    force(b1,b2)



    // b2.vx += b2.vdot * b1.normx / b2.mass
    // b2.vy += b2.vdot * b1.normy / b2.mass
    // b1.vx += b2.vdot * b2.normx / b1.mass
    // b1.vy += b2.vdot * b2.normy / b1.mass

  }
}
  
  function force(b1,b2){
    b1.cvx = b1.vdot * b1.normx
    b1.cvy = b1.vdot * b1.normy //cv is "the component it was travelling into the normal"
    b2.cvx = b2.vdot * b2.normx
    b2.cvy = b2.vdot * b2.normy
    
    // let type = "neutral"


    if(distance(b2.vx,b2.vy,0,0) > distance(b1.vx,b1.vy,0,0)){
    	let b3 = b2
    	b2 = b1
    	b1 = b3
    }
    
    attack(b1,b2)
    
    
  }

function dot(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
}

  
  function attack(b1,b2){//attacker, attakee
    
    // b2.vx += b1.cvx
    // b2.vy += b1.cvy
    
    // b1.vx = 0
    // b1.vy = 0
    let massratio = b1.mass / b2.mass
	b2.vx -= (b1.cvx-b2.cvx) * massratio//attackee push
    b2.vy -= (b1.cvy-b2.cvy) * massratio
    
    b1.vx += b1.cvx//attacker recoil
    b1.vy += b1.cvy 

    
    // b1.vx -= b1.cvx
    // b1.vy -= b1.cvy
  }






module.exports={baller}