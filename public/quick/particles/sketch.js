let myCanvas = document.getElementById("myCanvas")

let Width = window.innerWidth
let Height = window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"

let CTX = {"main":myCanvas.getContext("2d")}
let ctx = CTX.main

let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

document.addEventListener("mouseup",(e)=>{
		G.newParticle(GI.cam.x+mouseX,GI.cam.y+mouseY,GI.type[0]+GI.type[1],10,e)
})

document.addEventListener("keydown",(e)=>{
	let k = e.key

	switch(k){
		case "1":
			GI.type[1] = "1"
			break;
		case "2":
			GI.type[1] = "2"
			break;
		case "3":
			GI.type[1] = "3"
			break;
		case "4":
			GI.type[1] = "4"
			break;
		case "5":
			GI.type[1] = "5"
			break;
		case "6":
			GI.type[1] = "6"
			break;
	}

	let r = ["",15]
	if(e.shiftKey){
		r = ["v",1]
	}
	if(k == "ArrowUp"){
		GI.cam[r[0]+"y"] -= r[1]
	}else if(k == "ArrowDown"){
		GI.cam[r[0]+"y"] += r[1]
	}else if(k == "ArrowRight"){
		GI.cam[r[0]+"x"] += r[1]
	}else if(k == "ArrowLeft"){
		GI.cam[r[0]+"x"] -= r[1]
	}

	if(k == "r"){
		GI.cam.vx =0
		GI.cam.vy =0
	}

})

class G{


	static newParticle(x,y,type,r,e){

		let typeInfo = GI.getTypeInfo(type)
		let id = GI.getPI()

		GI.particles[id] = {"x":x,"y":y,"t":type,"r":r,"id":id,"info":typeInfo}
		if(!e.shiftKey){GI.particlesArr.push(id)}else{GI.particlesArr.unshift(id)}
	}

	static drawCircle(x,y,r,f){
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		if(f){ctx.fill()}
		ctx.stroke();
	}

	static drawParticle(p){
		ctx.fillStyle = p.info.color
		this.drawCircle(p.x-GI.cam.x,p.y-GI.cam.y,p.r,true)
	}

	static drawParticles(){
		GI.particlesArr.forEach((e)=>{
			let p = GI.particles[e]
			this.drawParticle(p)
		})
	}

	static updateParticle(p){
		if(p.info.toOther != undefined){
			GI.particlesArr.forEach((e)=>{
				if(e==p.id){return}

				let op = GI.particles[e]
				p.info.toOther(p,op)

			})
		}
	}

	static updateParticles(){
		GI.particlesArr.forEach((e)=>{
			this.updateParticle(GI.particles[e])
		})
	}

}

class GI{
	static partIDcount = 0
	static cam = {"x":0,"y":0,'vx':0,"vy":0}
	static particles = {}
	static particlesArr = []
	static type = ["A","1"]

	static getPI(){
		this.partIDcount++
		return(this.partIDcount)
	}

	static typeDict = {
		"A1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*Math.sin(dx/50)/d
				op.y -= 150*Math.sin(dy/50)/d

				return([-d*dx,-d*dy])

			},
			"color":"#00FF00"
		},
		"A2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*0.01*Math.sin(dx/35)
				op.y -= 150*0.01*Math.sin(dy/35)

				return([-d*dx,-d*dy])

			},
			"color":"#FF0000"
		},
		"A3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= d*0.01*Math.cos(dx/45)
				op.y -= d*0.01*Math.cos(dy/45)

				return([-d*dx,-d*dy])

			},
			"color":"#FFFF00"
		},
		"A4":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x += 51/dx
				op.y += 51/dy

				return([-d*dx,-d*dy])

			},
			"color":"#FFFFFF"
		},
		"A5":{
			"color":"#0000FF"
		},
		"A6":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= dx/d
				op.y -= dy/d

				return([d*dx,d*dy])

			},
			"color":"#FF70FF"
		},
	}

	static getTypeInfo(t){
		return(this.typeDict[t])
	}
}


function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

let _MainInterval_ = setInterval(()=>{repeat()},50)


function repeat(){
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,Width,Height)

	GI.cam.x += GI.cam.vx
	GI.cam.y += GI.cam.vy

	G.updateParticles()
	G.drawParticles()

}