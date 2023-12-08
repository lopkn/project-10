function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

let balls = []
let scl=5

function draw() {
  background(220);
 
  fill(255)
  // if(Math.random()<0.01){
  //   console.log(collBall2D(balls[0],balls[1]).ans)
  // }
  advance(1)
  if(collBall2D(balls[0],balls[1]).ans < 1){
    fill(10,10,10)
  }
  balls.forEach((e,i)=>{
    circle(e.x*scl,e.y*scl,e.r*scl*2)
  })
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
	constructor(x,y,r=1,vx=0,vy=0,mouseControl=false){
		this.x = x
		this.y = y
		this.r = r
		this.vy = vy
		this.vx = vx
      this.mouseControl = mouseControl
	}
  
    update1(dt=1){
      this.x += this.vx*dt
      this.y += this.vy*dt
      if(this.mouseControl && keyIsDown(32)){
      this.vx -= (this.x-mouseX/scl)*0.5
      this.vy -= (this.y-mouseY/scl)*0.5
      }
    }
}

let bl1 = new ball(10,1000000,100,6,-350000)  
let bl2 = new ball(10,110,50,27,35)

balls.push(new ball(0,0,5,1))
balls.push(new ball(0,2,5,1,0,true))

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
  if(ans < 0){ans = Infinity}
  
    if(isNaN(ans)){
      console.log([b1,b2])
    }
  
	return({"ans":ans,"answers":answers,"b1":b1,"b2":b2})

}
	

