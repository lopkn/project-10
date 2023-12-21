function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function dball(b1,b2){
  return(distance(b1.x,b1.y,b2.x,b2.y))
}
let balls = []
let scl=5

let down = false
let cb = [0,0]
function draw() {
  background(0);
 
  fill(255)

  let c = collBall2D2(balls[0],balls[1])
  if(c.ans < 1){
    fill(0,100,0)
  }
  let DDT = 1
  let breaker = 0
  let COL = collideDT(balls,DDT*0.01)
  let repeated = false
  
  let colRecord = ""
  // colResolv(balls)
  while(COL.result == "collide"&&breaker < 1000 && DDT > 0 && COL.info.ans <= DDT){
    COL.info.ans *= 100
    breaker++
    cb = [COL.info.b1,COL.info.b2]
    advance(COL.info.ans)
    if(distance(COL.info.b1.x,COL.info.b1.y,COL.info.b2.x,COL.info.b2.y) >= COL.info.b1.r+COL.info.b2.r-200){
      momentumTransfer2D(COL.info.b1,COL.info.b2)
      colRecord += "|"+COL.info.b1.id+"-"+COL.info.b2.id+"-"
        // +dball(balls[2],balls[3])
    }
      DDT -= COL.info.ans
    COL = collideDT(balls,DDT*0.01)
    if(COL.result == "collide" && cb[0]==COL.info?.b1 && cb[1] ==COL.info?.b2){
      console.log("cb repeat")
      repeated = true
    } else {repeated = false}
    if(breaker == 99){
      console.log(dist(COL.info.b1.vx,COL.info.b1.vy,0,0))
    }
  } 
  if(breaker > 10){
  // console.log("breaker reached: "+breaker)
  //   console.log(colRecord)
  //   console.log(balls[2],balls[3])
  //   console.log(balls[3].x-balls[2].x)
  //   console.log(collBall2D(balls[2],balls[3]))
  }
  advance(DDT)
  balls.forEach((e,i)=>{
    circle(e.x*scl,e.y*scl,e.r*scl*2)
  })
  if(keyIsDown(32)){
    if(down == false){
      balls.push(new ball(mouseX/scl,mouseY/scl,5,0,0,true))
      down = true
    }
  } else {down =false}
}

function advance(dt){
   balls.forEach((e,i)=>{
    e.update1(0.01*dt)
  })
}

function colResolv(objs){
	// for(let i = 0; i < objs.length; i++){
	// 	for(let j = i+1; j < objs.length; j++){
	// let ddb = dball(objs[i],objs[j])
	// let db = ddb-objs[i].r-objs[j].r
	// 		if(db < 0){
	// let deltaVector = [(objs[j].x-objs[i].x)/ddb*-db/1.9,(objs[j].y-objs[i].y)/ddb*-db/1.9]
	// objs[j].x += deltaVector[0]
	// objs[j].y += deltaVector[1]
	// objs[i].x -= deltaVector[0]
	// objs[i].y -= deltaVector[1]
	// }
	// 	}
	// }
}

function collideDT(objs, DT){
	let collideTime = Infinity;
	let collideInfo = "none";
	for(let i = 0; i < objs.length; i++){
		for(let j = i+1; j < objs.length; j++){
			//quick check of collision
			//find collision time
            let col = collBall2D2(objs[i],objs[j])
            if(col.ans < 1 && col.ans < collideTime){
              //if collide time is smaller, make it the new collision info & time
              collideTime = col.ans
              collideInfo = col
            }
		}
	}
  if(collideTime > DT){//might check for equality error here later
    return({"result":"advance","time":DT})
  } else {
    return({"result":"collide","info":collideInfo})
  }
}

class ball{
  static id = 0;
  static getID(){return(this.id++)};
	constructor(x,y,r=1,vx=0,vy=0,mouseControl=false,mass = 1){
      this.id = ball.getID()
		this.x = x
		this.y = y
		this.r = r
		this.vy = vy
		this.vx = vx
        this.m = mass
      this.mouseControl = mouseControl
	}
  
    update1(dt=1){
      this.x += this.vx*dt
      this.y += this.vy*dt
      // if(this.mouseControl && keyIsDown(32)){
      if(this.mouseControl && mouseIsPressed){
      this.vx -= (this.x-mouseX/scl)*0.5
      this.vy -= (this.y-mouseY/scl)*0.5
      }
    }
}

// let bl1 = new ball(10,1000000,100,6,-350000)  
// let bl2 = new ball(10,110,50,27,35)

// balls.push(new ball(50,45,5,1,0,true)) 
balls.push(new ball(50,55,5,1,0,true)) 
// balls.push(new ball(60.01,50,5,1,0)) 
balls.push(new ball(80,50,5,-15,0)) 
// balls.push(new ball(90,50,5,-15,0)) 
// balls.push(new ball(91,50,5,-16,0)) 

function collBall2D(b1,b2){

	let b = (b2.vx-b1.vx)
	let c = b2.x
	let d = b1.x
	let e = (b2.vy-b1.vy)
	let f = b2.y
	let g = b1.y

	let answers = [NaN,NaN]
	// let answers = [b,c,d,e,f,g]

	// t1 = (-2*b*c+2*b*d-2*e*f+2*e*g+-2*Math.sqrt(-b*b*f*f+2*e*b*c*f+2*b*b*f*g-e*e*c*c-e*e*d*d+2*e*e*c*d-b*b*g*g-2*e*b*c*g+2*e*b*d*g)) / 2(b*b+e*e)

	try{answers[0] = (-2*b*c+2*b*d-2*e*f+2*e*g+Math.sqrt(Math.pow(2*b*c-2*b*d+2*e*f-2*e*g,2)-4*(b*b+e*e)*(c*c-2*c*d+d*d-2*f*g+f*f+g*g-Math.pow(b1.r+b2.r,2)))) / (2*(b*b+e*e))}catch{}
	try{answers[1] = (-2*b*c+2*b*d-2*e*f+2*e*g-Math.sqrt(Math.pow(2*b*c-2*b*d+2*e*f-2*e*g,2)-4*(b*b+e*e)*(c*c-2*c*d+d*d-2*f*g+f*f+g*g-Math.pow(b1.r+b2.r,2)))) / (2*(b*b+e*e))}catch{}
  
  
  
  
  

    // let ans = answers[0]>answers[1]?answers[1]:answers[0]
    if(isNaN(answers[0])){
      if(isNaN(answers[1])){
        ans = Infinity
      } else {
        ans = answers[1]
      }
    } else {
      if(isNaN(answers[1])){
        ans = answers[0]
      } else {
        if(answers[0] < 0){
          ans = answers[1]
        } else if(answers[1] < 0){ans = answers[0]} else{
          ans = answers[0]>answers[1]?answers[1]:answers[0]
        }
      }
    }
  if(ans == 0){console.log("zeroed")}
  if(ans < 0){ans = Infinity}
  let t = ans
let answerDelta1 = 2*(b1.x+b1.vx*t-b2.x-b2.vx*t)*(b1.vx-b2.vx)+2*(b1.y+b1.vy*t-b2.y-b2.vy*t)*(b1.vy-b2.vy)

  if(answerDelta1 >= 0 || isNaN(answerDelta1)){ans = Infinity}  
	return({"ans":ans,"answers":answers,"b1":b1,"b2":b2,"delta":answerDelta1})

}

function momentumTransfer2D4(b1,b2){
  let vb12x = b2.x-b1.x
  let vb12y = b2.y-b1.y //differential vector
  
  let normVB12 = normalize(vb12x,vb12y)
  
  let dotHx1 = dot(normVB12[0],normVB12[1],b1.vx,b1.vy)
  let dotHx2 = dot(normVB12[0],normVB12[1],b2.vx,b2.vy)
  
  let Vaverage = ( dotHx1 + dotHx2 )/ 2
  let MT1 = (dotHx1-Vaverage*1) * b1.m
  let MT2 = (dotHx2-Vaverage*1) * b2.m
  
  let elast = 0.9
  
  b2.vx += normVB12[0] * MT1 / b2.m * elast
  // console.log(MT1,dotHx1,normVB12,vb12x,vb12y)
  b2.vy += normVB12[1] * MT1 / b2.m * elast
  
  b1.vx -= normVB12[0] * MT1 / b1.m 
  b1.vy -= normVB12[1] * MT1 / b1.m 
  
  
  b2.vx -= normVB12[0] * MT2 / b2.m 
  // console.log(MT1,dotHx1,normVB12,vb12x,vb12y)
  b2.vy -= normVB12[1] * MT2 / b2.m 
  
  b1.vx += normVB12[0] * MT2 / b1.m * elast
  b1.vy += normVB12[1] * MT2 / b1.m * elast
}
function momentumTransfer2D(b1,b2){
  let vb12x = b2.x-b1.x
  let vb12y = b2.y-b1.y //differential vector
  
  let normVB12 = normalize(vb12x,vb12y)
  
  let dotHx1 = dot(normVB12[0],normVB12[1],b1.vx,b1.vy)
  let dotHx2 = dot(normVB12[0],normVB12[1],b2.vx,b2.vy)
  
  let Vaverage = ( dotHx1 + dotHx2 )/ 2
  let MT1 = (dotHx1-Vaverage*1) * b1.m
  let MT2 = (dotHx2-Vaverage*1) * b2.m
  
  let ELA = 9
  
  // let VF2 = -Math.sqrt(((b1.m * dotHx1 + b2.m * dotHx2)/ELA - b1.m * dotHx1) / b2.m + dotHx2 * dotHx2 - dotHx2)
  let a = b1.m
  let b = dotHx1
  let c = b2.m
  let d = dotHx2
  let z = ELA
  let VF2 = (c*d*z+a*b*z-a*d+a*b)/(z*(c+a))
    let VF1 = (b1.m * dotHx1 + b2.m * dotHx2 - b2.m * VF2) / b1.m
  console.log(b,d,VF1,VF2)
    // VF1 = 0

  
  b1.vx -= normVB12[0] * dotHx1
  b1.vy -= normVB12[1] * dotHx1
  b1.vx += normVB12[0] * VF1
  b1.vy += normVB12[1] * VF1
  b2.vx -= normVB12[0] * dotHx2
  b2.vy -= normVB12[1] * dotHx2
  b2.vx += normVB12[0] * VF2
  b2.vy += normVB12[1] * VF2

}

function momentumTransfer2D5(b1,b2){
  let vb12x = b2.x-b1.x
  let vb12y = b2.y-b1.y //differential vector
  
  let normVB12 = normalize(vb12x,vb12y)
  
  let dotHx1 = dot(normVB12[0],normVB12[1],b1.vx,b1.vy)
  let dotHx2 = dot(normVB12[0],normVB12[1],b2.vx,b2.vy)
  
  let Vaverage = ( dotHx1 + dotHx2 )/ 2
  let MT1 = (dotHx1-Vaverage*1) * b1.m
  let MT2 = (dotHx2-Vaverage*1) * b2.m
  
  let ELA = 1
  
  // let VF2 = -Math.sqrt(((b1.m * dotHx1 + b2.m * dotHx2)/ELA - b1.m * dotHx1) / b2.m + dotHx2 * dotHx2 - dotHx2)
  let a = b1.m
  let b = dotHx1
  let c = b2.m
  let d = dotHx2
  let z = ELA
  let VF2 = (a*b*b*z*(a+c)-Math.sqrt(b*z*(-a*a*a*b*b*z-a*b*b*c*c*z-2*a*a*b*b*c*z+a*a*b*b*b+a*b*b+a*b*c*d*d+c*d*d)))/(b*z*(a*b+1))
  let VF1 = (b1.m * dotHx1 + b2.m * dotHx2 - b2.m * VF2) / b1.m
  
  b1.vx -= normVB12[0] * dotHx1
  b1.vy -= normVB12[1] * dotHx1
  b1.vx += normVB12[0] * VF2
  b1.vy += normVB12[1] * VF2
  b2.vx -= normVB12[0] * dotHx2
  b2.vy -= normVB12[1] * dotHx2
  b2.vx += normVB12[0] * VF1
  b2.vy += normVB12[1] * VF1

}

function dot(x,y,x2,y2){
  return(x*x2+y2*y)
}

function normalize(x,y){
  let d = Math.sqrt(x*x+y*y)
  return([x/d,y/d])
}


function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}


function collBall2D2(b1,b2){

	let b = (b2.vx-b1.vx)
	let c = b2.x
	let d = b1.x
	let e = (b2.vy-b1.vy)
	let f = b2.y
	let g = b1.y

	let answers = [NaN,NaN]
	// let answers = [b,c,d,e,f,g]

	// t1 = (-2*b*c+2*b*d-2*e*f+2*e*g+-2*Math.sqrt(-b*b*f*f+2*e*b*c*f+2*b*b*f*g-e*e*c*c-e*e*d*d+2*e*e*c*d-b*b*g*g-2*e*b*c*g+2*e*b*d*g)) / 2(b*b+e*e)

	try{answers[0] = (-2*b*c+2*b*d-2*e*f+2*e*g+Math.sqrt(Math.pow(2*b*c-2*b*d+2*e*f-2*e*g,2)-4*(b*b+e*e)*(c*c-2*c*d+d*d-2*f*g+f*f+g*g-Math.pow(b1.r+b2.r,2)))) / (2*(b*b+e*e))}catch{}
  
	try{answers[1] = (-2*b*c+2*b*d-2*e*f+2*e*g-Math.sqrt(Math.pow(2*b*c-2*b*d+2*e*f-2*e*g,2)-4*(b*b+e*e)*(c*c-2*c*d+d*d-2*f*g+f*f+g*g-Math.pow(b1.r+b2.r,2)))) / (2*(b*b+e*e))}catch{}
  if(isNaN(answers[0])){
    if(!isNaN(answers[1])){console.log("prediction error")}
    return({"ans":Infinity,"answers":answers,"b1":b1,"b2":b2,"delta":NaN})
  }
  if(answers[0] + answers[1] < 0){
    return({"ans":50,"answers":answers,"b1":b1,"b2":b2,"delta":NaN})
  }
  // let t = answers[1]
  // let answerDelta1 = 2*(b1.x+b1.vx*t-b2.x-b2.vx*t)*(b1.vx-b2.vx)+2*(b1.y+b1.vy*t-b2.y-b2.vy*t)*(b1.vy-b2.vy)
  return({"ans":answers[1],"answers":answers,"b1":b1,"b2":b2,"delta":-1})
}




	

