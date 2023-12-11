function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

let balls = []
let scl=5

let down = false
let cb = [0,0]
function draw() {
  background(0);
 
  fill(255)
  // if(Math.random()<0.01){
  //   console.log(collBall2D(balls[0],balls[1]).ans)
  // }
  let c = collBall2D(balls[0],balls[1])
  if(c.ans < 1){
    fill(0,100,0)
  }
  let DDT = 1
  let breaker = 0
  let COL = collideDT(balls,DDT*0.01)
  while(COL.result == "collide"&&breaker < 10000 && DDT > 0){
    breaker++
    cb = [COL.info.b1,COL.info.b2]
    advance(COL.info.ans)
    momentumTransfer2D(COL.info.b1,COL.info.b2)
    DDT -= COL.info.ans
    COL = collideDT(balls,DDT*0.01)
    if(COL.result == "collide" && cb[0]==COL.info?.b1 && cb[1] ==COL.info?.b2){
      console.log("cb repeat")
    }
    if(breaker == 99){
      console.log(dist(COL.info.b1.vx,COL.info.b1.vy,0,0))
    }
  } 
  if(breaker > 10){
  console.log("breaker reached: "+breaker)
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



function collideDT(objs, DT){
  let collideTime = Infinity;
  let collideInfo = "none";
  for(let i = 0; i < objs.length; i++){
    for(let j = i; j < objs.length; j++){
      //quick check of collision
      //find collision time
            let col = collBall2D(objs[i],objs[j])
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
  constructor(x,y,r=1,vx=0,vy=0,mouseControl=false,mass = 1){
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

let bl1 = new ball(10,1000000,100,6,-350000)  
let bl2 = new ball(10,110,50,27,35)

balls.push(new ball(0,0,5,1))
balls.push(new ball(0,2,5,1,0))

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

    let ans = answers[0]>answers[1]?answers[1]:answers[0]
    if(isNaN(answers[0])){
      if(isNaN(answers[1])){
        ans = Infinity
      } else {
        ans = answers[1]
      }
    } else {
      if(isNaN(answers[1])){
        ans = answers[0]
      }
    }
  if(ans <= 0){ans = Infinity}
  

  
  return({"ans":ans,"answers":answers,"b1":b1,"b2":b2})

}

function momentumTransfer2D(b1,b2){
  let vb12x = b2.x-b1.x
  let vb12y = b2.y-b1.y //differential vector
  
  let normVB12 = normalize(vb12x,vb12y)
  
  let dotHx1 = dot(normVB12[0],normVB12[1],b1.vx,b1.vy)
  let dotHx2 = dot(normVB12[0],normVB12[1],b2.vx,b2.vy)
  
  let Vaverage = ( dotHx1 + dotHx2 )/ 2
  let MT1 = (dotHx1-Vaverage*0) * b1.m
  
  b2.vx += normVB12[0] * MT1 / b2.m
  // console.log(MT1,dotHx1,normVB12,vb12x,vb12y)
  b2.vy += normVB12[1] * MT1 / b2.m
  
  b1.vx -= normVB12[0] * MT1 / b1.m
  b1.vy -= normVB12[1] * MT1 / b1.m
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







  

