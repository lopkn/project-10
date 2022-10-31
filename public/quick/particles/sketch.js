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

document.addEventListener("mousedown",(e)=>{
	e.preventDefault()
	if(e.altKey){
		GI.selectionStart = [mouseX,mouseY]

	}

	if(e.ctrlKey){
		GI.mouseInterval = setInterval(()=>{G.newParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom,GI.type[0]+GI.type[1],10,e)},GI.autoclickSpeed)
	}
})

document.addEventListener("mouseup",(e)=>{
	if(GI.selectionStart !== false){

			let s =GI.selectionStart

			let acmap = [GI.cam.x+(s[0])*GI.zoom,GI.cam.y+(s[1])*GI.zoom,GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom]


			for(let i = GI.particlesArr.length-1; i > -1; i--){
				let r = GI.particlesArr[i]
				let p = GI.particles[r]

				if(inRect(p.x,p.y,acmap[0],acmap[1],acmap[2]-acmap[0],acmap[3]-acmap[1])){
					G.delParticle(p)
				}
			}

			GI.selectionStart = false
			return
		}
	clearInterval(GI.mouseInterval)
		G.newParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom,GI.type[0]+GI.type[1],10,e)



})

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();})

document.addEventListener("keydown",(e)=>{
	let k = e.key

	console.log(k)

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
		case "7":
			GI.type[1] = "7"
			break;
		case "8":
			GI.type[1] = "8"
			break;
		case "9":
			GI.type[1] = "9"
			break;


		case "B":
			GI.type[0] = "B"
			break;
		case "A":
			GI.type[0] = "A"
			break;
		case "C":
			GI.type[0] = "C"
			break;
		case "D":
			GI.type[0] = "D"
			break;
		case "E":
			GI.type[0] = "E"
			break;


		case "=":
			GI.zoom += 0.1
			break;
		case "-":
			GI.zoom -= 0.1
			break;

		case "F1":
			e.preventDefault()
			GI.display.background = "#000000"
			break;
		case "F2":
			e.preventDefault()
			GI.display.background = "rgba(0,0,0,0.1)"
			break;

		case "]":
			GI.autoclickSpeed -= 5
			break;
		case "[":
			GI.autoclickSpeed += 5
			break;


		case "Control":
			e.preventDefault()
			break
	}

	let r = ["",15*GI.zoom]
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

function inRect(x,y,rx,ry,w,h){
	if(x >= rx && y >= ry && x <= rx+w && y <= ry + h){
		return(true)
	}
	return(false)
}

class G{


	static newParticle(x,y,type,r,e,parent){

		let typeInfo = GI.getTypeInfo(type)
		if(typeInfo == undefined){return}
		let typeInfo2 = GI.getTypeInfo2(type)
		let id = GI.getPI()

		GI.particles[id] = {
			"x":x,"y":y,"t":type,"r":r,
			"id":id,"info":typeInfo,
			"vx":0,"vy":0,
			"stinfo":typeInfo2,
			"life":1000,
			"nxadd":{"x":0,"y":0,"vx":0,"vy":0},
			"nxrps":{}
		}

		if(parent != undefined){
			GI.particles[id].parent = parent.id
		}


		if(!e||!e.shiftKey){GI.particlesArr.push(id)}else{GI.particlesArr.unshift(id)}
	}

	static drawCircle(x,y,r,f){
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		if(f){ctx.fill()}
		ctx.stroke();
	}

	static drawParticle(p){
		ctx.fillStyle = p.stinfo.color
		this.drawCircle((p.x-GI.cam.x)/GI.zoom,(p.y-GI.cam.y)/GI.zoom,(p.r)/GI.zoom,true)

		if(p.stinfo.letter != undefined){
			let dy = Math.floor(15/GI.zoom)
			ctx.font = dy+"px Arial"
			ctx.fillStyle = "#FFFFFF"
			ctx.fillText(p.stinfo.letter,(p.x-GI.cam.x)/GI.zoom-dy/2.5,(p.y-GI.cam.y)/GI.zoom+dy/2.5)
		}

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

		if(p.info.eachFrame!=undefined){
			p.info.eachFrame(GI.frame,p)
		}
	}

	static updateParticles(){
		GI.particlesArr.forEach((e)=>{
			this.updateParticle(GI.particles[e])
		})
		GI.particlesArr.forEach((e)=>{
			this.updateParticle2(GI.particles[e])
		})
	}

	static updateParticle2(p){
		let nxad = p.nxadd
		p.x += nxad.x
		p.y += nxad.y
		p.vy += nxad.vy
		p.vx += nxad.vx

		if(p.stinfo.decay !== undefined){
			p.life -= p.stinfo.decay
		}

		if(p.life <= 0){
			this.delParticle(p)
		}

		p.nxadd = {"x":0,"y":0,"vx":0,"vy":0}
	}
	static delParticle(p){
		let id = p.id
		for(let i =0; i < GI.particlesArr.length; i++){
			if(GI.particlesArr[i] == id){
				GI.particlesArr.splice(i,1)
				break;
			}
		}

		if(p.info.onDeath != undefined){
			p.info.onDeath(p)
		}

		if(p.parent != undefined){
		let parent = GI.particles[p.parent]

		if(parent != undefined){
			parent.info.childOnDeath(p,parent)
		}}


		delete GI.particles[id]
	}

}

class GI{
	static partIDcount = 0
	static cam = {"x":0,"y":0,'vx':0,"vy":0}
	static particles = {}
	static particlesArr = []
	static type = ["A","1"]

	static display = {"background":"#000000"}

	static selectionStart = false
	static mouseInterval = 0

	static autoclickSpeed = 100

	static frame = 0

	static zoom = 1

	static getPI(){
		this.partIDcount++
		return(this.partIDcount)
	}

	static FRATE = 50

	static typeDict = {
		"A1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*Math.sin(dx/50)/d
				op.y -= 150*Math.sin(dy/50)/d

				return([-d*dx,-d*dy])

			}
		},
		"A2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*0.01*Math.sin(dx/35)
				op.y -= 150*0.01*Math.sin(dy/35)

				return([-d*dx,-d*dy])

			}
		},
		"A3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= d*0.01*Math.cos(dx/45)
				op.y -= d*0.01*Math.cos(dy/45)

				return([-d*dx,-d*dy])

			}
			
		},
		"A4":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x += 51/dx
				op.y += 51/dy

				return([-d*dx,-d*dy])

			}
			
		},
		"A5":{
			
		},
		"A6":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= dx/d
				op.y -= dy/d


			}
			
		},
		"A7":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}
				let a = d
				if(d > 2000){
					a = 2000
				}

				op.nxadd.x += dx*Math.sqrt(a)*Math.sin(d/40)*0.001
				op.nxadd.y += dy*Math.sqrt(a)*Math.sin(d/40)*0.001

			}
			
		},



		"B1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d < 0.1){
					d = 0.1
				}

				op.nxadd.x += 50*dx/d/d
				
				op.nxadd.y += 50*dy/d/d

			}
		
		},
		"B2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<0.1){
						d = 0.1
					}

				op.nxadd.x += dx/d/d*Math.sin(d/100)*450
				op.nxadd.y += dy/d/d*Math.sin(d/100)*450

			}
			
		},
		"B3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}

				op.nxadd.x += dx/d/d*Math.cos(d/40)*450
				op.nxadd.y += dy/d/d*Math.sin(d/40)*450

			}
			
		},
		"B4":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				let r = 1
				if(d < 50){
					if(d<2){
						d = 2
					}
					r = -1
				}

				op.nxadd.x -= 50*dx/d/d*r
				op.nxadd.y -= 50*dy/d/d*r

			}
			
		},
		"B5":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}

				op.nxadd.x += dx/d/d*Math.sin(d/40)*450
				op.nxadd.y += dy/d/d*Math.sin(d/40)*450

			}
			
		},
		"B6":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}

				op.nxadd.x += dx/d/d*Math.sin(d/40)*450
				op.nxadd.y += dy/d/d*Math.cos(d/40)*450

			}
			
		},
		"B7":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				let r = 1
				if(d < 50){
					if(d<2){
						d = 2
					}
					r = -0.8
				}

				op.nxadd.x -= 450*dx/d/d*r
				op.nxadd.y -= 450*dy/d/d*r

			}
			
		},
		"B8":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 100){
				if(d < 2){
					d = 2
				}
				op.nxadd.x += 50*dx/d/d
				op.nxadd.y += 50*dy/d/d
				}
			}
		
		},
		"C1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				let r = 1
				if(d < 50){
					if(d<2){
						d = 2
					}
					r = -0.8
				}

				op.nxadd.x -= 450*dx/d/d*r
				op.nxadd.y -= 450*dy/d/d*r

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"B4",10)
			}
			
		},
		"C2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.nxadd.x -= 0.005*dx
				op.nxadd.y -= 0.005*dy

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"C1",10)
			}
			
		},
		"C3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}
				if(d > 2000){
					d = 2000
				}

				op.nxadd.x += dx*Math.sqrt(d)*Math.sin(d/40)*0.001
				op.nxadd.y += dy*Math.sqrt(d)*Math.sin(d/40)*0.001

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"B5",10)
			}
			
		},
		"D1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d < 60){

				op.life -= 3

				if(d<1){
						d = 1
					}
				}
				op.nxadd.x += 50*dx/d/d	
				op.nxadd.y += 50*dy/d/d
			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"B1",10)
			}
			
		},
		"D2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}

				if(op.t != "D2"){
				if(d < 60 && op.t != "B1"){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y,"D2",10)
					G.delParticle(op)
					p.life -= 10
					return
				}

				
				}


				op.nxadd.x -= 80*dx/d/d	
				op.nxadd.y -= 80*dy/d/d
				}

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"B1",10)
			}
			
		},
		"D3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<3){
						d = 3
					}

				if(op.t != "D3"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y,"D3",10)
					G.delParticle(op)
					p.life -= 10

					return
				}

				
				}


				op.nxadd.x -= 180*dx/d/d	
				op.nxadd.y -= 180*dy/d/d
				}

			},
		},
			"D4":{
			"eachFrame":(f,p)=>{
				let op = GI.particles[p.stinfo.following]

				if(op !== undefined){
					let d = distance(p.x,p.y,op.x,op.y)
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(d<3){
						d = 3
					}

					if(d < 60){

					op.life -= 15

					if(op.life <= 0){
						G.newParticle(op.x,op.y,"D4",10)
						G.delParticle(op)
						p.life -= 10
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t == "D4"){return}
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 3000){
					if(Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(op.t != "D4"){
						op.nxadd.x -= 180*dx/d/d	
						op.nxadd.y -= 180*dy/d/d
					}
				})

				

			}

			},
			
		},
		"E1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<10){
						d = 10
					}

				if(op.t != "B1" && op.t != "E1"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y+5,"B1",10)
					G.newParticle(op.x,op.y-5,"B1",10)
					G.delParticle(op)
					p.life -= 75
					// console.log(op)
					return
				}

				
				}


				op.nxadd.x -= 180*dx/d/d	
				op.nxadd.y -= 180*dy/d/d
				}

			},
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B8",10)
				}
			}
			
		},
		"E2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d < 0.1){
					d = 0.1
				}

				op.nxadd.x += 50*dx/d/d
				
				op.nxadd.y += 50*dy/d/d

			},
			"onDeath":(p)=>{
				for(let i = 0; i < 2; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"E1",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%60 == 0){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B8",10)
				}
			}
			
		},
		"E3":{
			"onDeath":(p)=>{
				for(let i = 0; i < 2; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"E1",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%20 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					let r = Math.random()
					if(r > 0.7){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B8",10,undefined,p)
					}else if(r > 0.4){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B4",10,undefined,p)
					} else {
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B5",10,undefined,p)
					}
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E4":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B5",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					let r = Math.random()
					if(r > 0.9){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B5",10,undefined,p)
					}else if(r > 0.7){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B4",10,undefined,p)
					} else {
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B3",10,undefined,p)
					}
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E5":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B5",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					let r = Math.random()
					if(r > 0.9){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B5",10,undefined,p)
					}else if(r > 0.7){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B4",10,undefined,p)
					} else {
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B6",10,undefined,p)
					}
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},


		}

	static typeDict2 = {
		"A1":{"color":"#00FF00"},
		"A2":{"color":"#FF0000"},
		"A3":{"color":"#FFFF00"},//gridpt ST
		"A4":{"color":"#FFFFFF"},//cross displace INF
		"A5":{"color":"#0000FF"},//does nothing
		"A6":{"color":"#FF005F"},//gravity
		"A7":{"color":"#800000"},//shell ST?

		"B1":{"color":"#808080"},//push
		"B2":{"color":"#F08080"},//shell
		"B3":{"color":"#80F080"},//wall Y
		"B4":{"color":"#8080F0"},//gravity
		"B5":{"color":"#F080F0"},//shell
		"B6":{"color":"#80F0F0"},//wall X
		"B7":{"color":"#4040FF"},//gravity
		"B8":{"color":"#C0C0C0"},//push

		"C1":{"color":"#303030","decay":5},//gravity -> B4
		"C2":{"color":"#008000","decay":10},//gravity ST -> C1
		"C3":{"color":"#FF9F00","decay":5},//shell ST -> B5

		"D1":{"color":"#280040","decay":5},//push + killer
		"D2":{"color":"#F000F0","decay":5},//virus -> B1
		"D3":{"color":"#800080","decay":5},//virus
		"D4":{"color":"#800080","decay":2,"letter":"F","following":-1},//virus, following

		"E1":{"color":"#628000"},//gravity killer +> 2x B1 -> 4x B8
		"E2":{"color":"#2E230A"},//generator(B8) -> E1
		"E3":{"color":"#6E2300","children":0,"letter":"G"},//generator(B8,B5,B4) -> E1
		"E4":{"color":"#00A000","children":0,"letter":"G"},
		"E5":{"color":"#00A0A0","children":0,"letter":"G"},
	}

	static getTypeInfo(t){
		return(this.typeDict[t])
	}
	static getTypeInfo2(t){
		return(JSON.parse(JSON.stringify(this.typeDict2[t])))
	}
}


function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

let _MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)


function repeat(){

	let D = Date.now()

	ctx.fillStyle = GI.display.background
	ctx.fillRect(0,0,Width,Height)
	if(GI.typeDict2[GI.type[0]+GI.type[1]] !== undefined){
	ctx.fillStyle = "purple"} else {
		ctx.fillStyle = "red"
	}
	ctx.font = "40px Arial"
	ctx.fillText(GI.type[0]+GI.type[1]+"  -  Particles: "+GI.particlesArr.length,0,40)

	ctx.strokeStyle = "purple"
	ctx.lineWidth = 4
	ctx.beginPath()
	ctx.moveTo(Width/2,Height/2)
	ctx.lineTo(Width/2+GI.cam.vx*10,Height/2+GI.cam.vy*10)
	ctx.stroke()

	ctx.strokeStyle = "black"
	ctx.lineWidth = 1

	GI.cam.x += GI.cam.vx
	GI.cam.y += GI.cam.vy

	G.updateParticles()
	G.drawParticles()

	if(GI.selectionStart !== false){
		ctx.fillStyle = "rgba(255,0,255,0.4)";
		ctx.fillRect(GI.selectionStart[0],GI.selectionStart[1],mouseX-GI.selectionStart[0],mouseY-GI.selectionStart[1])
	}

	GI.frame ++
	

	ctx.fillStyle = "rgba(0,255,0,0.2)"
	ctx.fillRect(0,5,Width,15)

	ctx.fillStyle = "rgba(255,0,0,0.2)"
	let ED = Date.now()
	ctx.fillRect(0,5,Width*(ED-D)/GI.FRATE,15)
	if(ED-D > GI.FRATE){
	ctx.fillStyle = "rgba(255,0,0,0.5)"
	ctx.fillRect(0,5,Width*(ED-D-GI.FRATE)/GI.FRATE,15)
	}

	if(GI.frame%100 == 0){
		console.log("AVERAGE PARTICLE CALCULATION TIME: "+((ED-D)/GI.particlesArr.length)*100)
	}
}