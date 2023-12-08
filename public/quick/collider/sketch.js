


function collideDT(objs, DT){
	let collideTime = Infinity;
	let collideInfo = "none";
	for(let i = 0; i < objs.length; i++){
		for(let j = i; j < objs.length; j++){
			//quick check of collision
			//find collision time
			//if collide time is smaller, make it the new collision info & time
		}
	}
}

class ball{
	constructor(x,y,r=1,vx=0,vy=0){
		this.x = x
		this.y = y
		this.r = r
		this.vy = vy
		this.vx = vx
	}
}

let bl1 = new ball(10,1000000,100,6,-350000)
let bl2 = new ball(10,110,50,27,35)

function collBall2D(b1,b2){

	let b = (b2.vx-b1.vx)
	let c = b2.x
	let d = b1.x
	let e = (b2.vy-b1.vy)
	let f = b2.y
	let g = b1.y

	let answers = ["none","none"]
	// let answers = [b,c,d,e,f,g]

	// t1 = (-2*b*c+2*b*d-2*e*f+2*e*g+-2*Math.sqrt(-b*b*f*f+2*e*b*c*f+2*b*b*f*g-e*e*c*c-e*e*d*d+2*e*e*c*d-b*b*g*g-2*e*b*c*g+2*e*b*d*g)) / 2(b*b+e*e)

	try{answers[0] = (-2*b*c+2*b*d-2*e*f+2*e*g+Math.sqrt(Math.pow(2*b*c-2*b*d+2*e*f-2*e*g,2)-4*(b*b+e*e)*(c*c-2*c*d+2*d*d-2*f*g+f*f+g*g-Math.pow(b1.r+b2.r,2)))) / (2*(b*b+e*e))}catch{}
	try{answers[1] = (-2*b*c+2*b*d-2*e*f+2*e*g-Math.sqrt(Math.pow(2*b*c-2*b*d+2*e*f-2*e*g,2)-4*(b*b+e*e)*(c*c-2*c*d+2*d*d-2*f*g+f*f+g*g-Math.pow(b1.r+b2.r,2)))) / (2*(b*b+e*e))}catch{}

	return({"ans":answers[0]>answers[1]?answers[1]:answers[0],"answers":answers,"b1":b1,"b2":b2})

}
	

