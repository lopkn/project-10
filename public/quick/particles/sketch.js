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
	if(GI.mouseModeArr[GI.mouseMode] == "normal"){
		e.preventDefault()
		GI.debuggingInfo = JSON.stringify(e.altKey)
		if(e.altKey||GI.altPressed){
			GI.selectionStart = [mouseX,mouseY,e.shiftKey]
		}

		if(e.ctrlKey){
			GI.mouseInterval = setInterval(()=>{G.newParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom,GI.type[0]+GI.type[1],10,e)},GI.autoclickSpeed)
		}
	} else if(GI.mouseModeArr[GI.mouseMode] == "selector"){
		let selected = G.selectParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom)
		if(selected !== "none"){
			GI.selectedParticles.push(selected[0])
			if(e.ctrlKey){
				GI.mouseInterval = setInterval(()=>{GI.particles[selected[0]].x = GI.cam.x+(mouseX)*GI.zoom;GI.particles[selected[0]].y =GI.cam.y+(mouseY)*GI.zoom},GI.autoclickSpeed)
			}
		}
	} else if(GI.mouseModeArr[GI.mouseMode] == "activator"){
		let selected = G.selectParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom)
		if(selected !== "none"){
			let p = GI.particles[selected[0]]

			p.capsule.chainRes(GI.AE,0)
		}
	}
})

document.addEventListener("mouseup",(e)=>{
	if(GI.mouseModeArr[GI.mouseMode] == "normal"){
	if(GI.selectionStart !== false){

			let s = GI.selectionStart

			let acmap = [GI.cam.x+(s[0])*GI.zoom,GI.cam.y+(s[1])*GI.zoom,GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom]

			let ax1 = acmap[0] > acmap[2] ? acmap[2] : acmap[0]
			let ax2 = acmap[0] > acmap[2] ? acmap[0] : acmap[2]
			let ay1 = acmap[1] > acmap[3] ? acmap[3] : acmap[1]
			let ay2 = acmap[1] > acmap[3] ? acmap[1] : acmap[3]

			for(let i = GI.particlesArr.length-1; i > -1; i--){
				let r = GI.particlesArr[i]
				let p = GI.particles[r]


				if(!s[2]){


				if(inRectA(p.x,p.y,ax1,ay1,ax2,ay2)){
					G.delParticle(p)
				}} else {
					if(inRectA(p.x,p.y,ax1,ay1,ax2,ay2)&&p.t == GI.type[0]+GI.type[1]){
					G.delParticle(p)
				}
				}
			}

			GI.selectionStart = false
			return
		}
	G.newParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom,GI.type[0]+GI.type[1],10,e)

} else if(GI.mouseModeArr[GI.mouseMode] == "selector"){
		let selected = G.selectParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom)

		if(selected[0] != GI.selectedParticles[0]){
			let sp = GI.particles[GI.selectedParticles[0]]
			let tp = GI.particles[selected[0]]

			if(sp.capsule !== undefined && tp.capsule !== undefined){
				//assume other is defined
				//assume chainto is defined

				sp.capsule.outTo.push(selected[0])
				tp.capsule.inFrom.push(selected[0])
			}

		}

		GI.selectedParticles = []
	} else if(GI.mouseModeArr[GI.mouseMode] == "activator"){
		GI.selectedParticles = []
	}



	clearInterval(GI.mouseInterval)

})

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();})

document.addEventListener("keyup",(e)=>{
	let k = e.key
	if(k == "Alt"){
			GI.altPressed = false;
	}
})

document.addEventListener("keydown",(e)=>{
	let k = e.key

	GI.currentKey = k

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
		case "F":
			GI.type[0] = "F"
			break;
		case "G":
			GI.type[0] = "G"
			break;
		case "H":
			GI.type[0] = "H"
			break;
		case "I":
			GI.type[0] = "I"
			break;
		case "J":
			GI.type[0] = "J"
			break;


		case "=":
			GI.zoom += 0.1
			break;
		case "-":
			GI.zoom -= 0.1
			break;

		case "F1":
		case "!":
			e.preventDefault()
			GI.display.background = "#000000"
			break;
		case "F2":
		case "@":
			e.preventDefault()
			GI.display.background = "rgba(0,0,0,0.1)"
			break;

		case "]":
			GI.autoclickSpeed -= 5
			break;
		case "[":
			GI.autoclickSpeed += 5
			break;

		case ">":
			GI.FRATE -= 5
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			break;
		case "<":
			GI.FRATE += 5
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			break;
		case ".":
			GI.FRATE -= 1
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			break;
		case ",":
			GI.FRATE += 1
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			break;
		case "?":
			GI.FRATE = 50
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			break;
		case " ":
			if(GI.paused){
				psf = ()=>{G.updateParticles()}
			} else {
				psf = ()=>{}
			}
			GI.paused = !GI.paused
			break;

		case "Control":
			e.preventDefault()
			break
		case "g":
			GI.grid = !GI.grid
			break;

		case "#":
			GI.customDebugger = !GI.customDebugger
			break;
		case "Alt":
			GI.altPressed = true;
			break;
		case "Tab":
			e.preventDefault()
			GI.mouseMode = (GI.mouseMode+1)==GI.mouseModeArr.length?0:(GI.mouseMode+1)
			break;
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

function inRectA(x,y,rx,ry,rax,ray){
	if(x >= rx && y >= ry && x <= rax && y <= ray){
		return(true)
	}
	return(false)
}

class G{

	static grapher = []
	static grapherInfo = {"px":8,"f":(e)=>{return(e*5)},"ln":120}

	static updateGrapher(e){
		let pt = this.grapherInfo.f(e)
		this.grapher.unshift(pt)
		if(this.grapher.length > this.grapherInfo.ln){
			this.grapher.splice(this.grapherInfo.ln,1)
		}
	}

	static drawGrapher(){
		let x = 0
		ctx.strokeStyle = "#00FF00"
		ctx.lineWidth = 5
		ctx.beginPath()
		ctx.moveTo(this.grapherInfo.px*this.grapherInfo.ln,Height-this.grapher[0])
		for(let i = 1; i < this.grapher.length;i++){
			ctx.lineTo((this.grapherInfo.px*(this.grapherInfo.ln-i)),Height-this.grapher[i])
		}
		ctx.stroke()
	}

	static newParticle(x,y,type,r,e,parent){

		let typeInfo = GI.getTypeInfo(type)
		if(typeInfo == undefined){return}
		let typeInfo2 = GI.getTypeInfo2(type)
		let id = GI.getPI()

		GI.particles[id] = {
			"x":x,"y":y,"t":type,"r":r,
			"id":id,
			"info":typeInfo,
			"vx":0,"vy":0,
			"stinfo":typeInfo2,
			"life":1000,
			"nxadd":{"x":0,"y":0,"vx":0,"vy":0},
			"nxrps":{}
		}
		if(GI.particles[id].info.initiate !== undefined){
			GI.particles[id].info.initiate(GI.particles[id])	
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

	static drawParticleChainLine(p){
		if(p.capsule !== undefined){
			//assume outTo defined.
			
			ctx.lineWidth = 2/GI.zoom
			
			let s = p.capsule
			for(let i = s.outTo.length-1; i > -1; i--){
				if(GI.particles[s.outTo[i]] !== undefined){
					let op = GI.particles[s.outTo[i]]
					let xy1 = [(p.x-GI.cam.x)/GI.zoom,(p.y-GI.cam.y)/GI.zoom]
					let xy2 = [(op.x-GI.cam.x)/GI.zoom,(op.y-GI.cam.y)/GI.zoom]
					ctx.beginPath()
					ctx.strokeStyle = "#00FFFF"
					ctx.moveTo(xy1[0],xy1[1])
					ctx.lineTo(xy2[0],xy2[1])
					ctx.stroke()

					ctx.beginPath()
					ctx.strokeStyle = "#FF0000"
					ctx.moveTo(xy1[0]+(xy2[0]-xy1[0])/1.5,xy1[1]+(xy2[1]-xy1[1])/1.5)
					ctx.lineTo(xy2[0],xy2[1])
					ctx.stroke()

				}else {
					p.capsule.outTo.splice(i,1)
				}
			}
			
			
			ctx.strokeStyle = "#000000"
			ctx.lineWidth = 1

		}
	}

	static drawParticle(p){

		this.drawParticleChainLine(p)

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

	// static updateParticle3(p){
	// 	let t = p.t
	// 	if(GI.typeDict[t].toOther !== undefined){
	// 		GI.particlesArr.forEach((e)=>{
	// 			if(e!==p.id){

	// 			let op = GI.particles[e]
	// 			GI.typeDict[t].toOther(p,op)
	// 			}

	// 		})
	// 	}

	// 	if(GI.typeDict[t].eachFrame!=undefined){
	// 		GI.typeDict[t].eachFrame(GI.frame,p)
	// 	}

	// }


	// static particleChainUpdate(i,p,c){
	// 	if(p.info.chainRes !== undefined){
	// 		let a = p.info.chainRes(i,p,c)
	// 	}
	// }


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
		p.x += p.vx
		p.y += p.vy

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
		let t = p.t
		for(let i =0; i < GI.particlesArr.length; i++){
			if(GI.particlesArr[i] == id){
				GI.particlesArr.splice(i,1)
				break;
			}
		}

		if(GI.typeDict[t].onDeath != undefined){
			GI.typeDict[t].onDeath(p)
		}

		if(p.parent != undefined){
		let parent = GI.particles[p.parent]

		if(parent != undefined){
			GI.typeDict[parent.t].childOnDeath(p,parent)
		}}


		delete GI.particles[id]
	}

	static selectParticle(x,y){
		if(GI.particlesArr.length > 0){
			let p = [0,Infinity]

			for(let i = 0; i < GI.particlesArr.length; i++){
				let P = GI.particles[GI.particlesArr[i]]
				let d = distance(P.x,P.y,x,y)
				if(d <= p[1]){
					p = [GI.particlesArr[i],d]
				}
			}

			return(p)

		}
		return("none")
	}

}

class GI{
	static partIDcount = 0
	static cam = {"x":0,"y":0,'vx':0,"vy":0}
	static particles = {}
	static particlesArr = []
	static type = ["A","1"]

	static debuggingInfo = ""
	static customDebugger = false

	static display = {"background":"#000000"}

	static selectionStart = false
	static mouseInterval = 0

	static currentKey = "nothing"

	static mouseMode = 0
	static mouseModeArr = ["normal","selector","activator"]
	static selectedParticles = []

	static AE = 150;

	static autoclickSpeed = 100
	static grid = false
	static frame = 0
	static paused = false
	static preformanceCalculate = 0
	static altPressed = false
	static zoom = 1

	static getPI(){
		this.partIDcount++
		return(this.partIDcount)
	}

	static FRATE = 50

	static typeDict = {
		"F1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*Math.sin(dx/50)/d
				op.y -= 150*Math.sin(dy/50)/d

				return([-d*dx,-d*dy])

			}
		},
		"F2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*0.01*Math.sin(dx/35)
				op.y -= 150*0.01*Math.sin(dy/35)

				return([-d*dx,-d*dy])

			}
		},
		"F3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= d*0.01*Math.cos(dx/45)
				op.y -= d*0.01*Math.cos(dy/45)

				return([-d*dx,-d*dy])

			}
			
		},
		"F4":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x += 51/dx
				op.y += 51/dy

				return([-d*dx,-d*dy])

			}
			
		},
		"F5":{
			
		},
		"F6":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 1){
					d = 1/d
				}
				op.x -= dx/d
				op.y -= dy/d


			}
			
		},
		"F7":{
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

				if(d < 1){
					d = 1/d
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
		"D5":{
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
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B1",10)
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B1",10)
						G.delParticle(op)
						p.life -= 100
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t !== "B4"){return}
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 600){
					if(Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)

					op.nxadd.x -= 180*dx/d/d	
					op.nxadd.y -= 180*dy/d/d
				})

				

			}

			},
			
		},
		"D6":{
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
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B4",10)
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B4",10)
						G.delParticle(op)
						p.life -= 100
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t !== "B1"){return}
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 600){
					if(Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)

					op.nxadd.x -= 180*dx/d/d	
					op.nxadd.y -= 180*dy/d/d
				})

				

			}

			},
			
		},
		"D7":{
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
						G.newParticle(op.x+Math.random(),op.y+Math.random(),"B1",10)
						G.delParticle(op)
						p.life -= 50
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t !== "B4"){return}
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 600){
					if(Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)

					op.nxadd.x -= 180*dx/d/d	
					op.nxadd.y -= 180*dy/d/d
				})

				

			}

			},
			
		},
		"D8":{
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
						G.newParticle(op.x+Math.random(),op.y+Math.random(),"B4",10)
						G.delParticle(op)
						p.life -= 50
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t !== "B1"){return}
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 600){
					if(Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)

					op.nxadd.x -= 180*dx/d/d	
					op.nxadd.y -= 180*dy/d/d
				})

				

			}

			},
			
		},
		"D9":{
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
						G.newParticle(op.x,op.y,"D9",10)
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
					if(op.t == "D9" || op.t == "B8"){return}
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
						op.nxadd.x -= 180*dx/d/d	
						op.nxadd.y -= 180*dy/d/d
				})

				

			}

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"B8",10)
			}
			
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
		"E6":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A3",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"A3",10,{"shiftKey":true},p)
					
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E7":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"A4",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A4",10,{"shiftKey":true},p)
					
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E8":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<10){
						d = 10
					}

				if(op.t != "A4" && op.t != "E8"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y+5,"A4",10)
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
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A4",10)
				}
			}
			
		},
		"E9":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<10){
						d = 10
					}

				if(op.t != "A3" && op.t != "E9"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y+5,"A3",10)
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
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A3",10)
				}
			}
			
		},

		"A1":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
					if(d < 20){
					if(d<5){
						if(d === 0){
							return
						}
						dx = 0
						dy = 0
					}
					d*=5
					}
				op.nxadd.x -= 50*dx/d/d
				op.nxadd.y -= 50*dy/d/d
				}
			}
			
		},
		"A2":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
					if(d < 20){
					d*=5
					}
				op.nxadd.x += 50*dx/d/d
				op.nxadd.y += 50*dy/d/d
				}
			}
			
		},
		"A3":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
					if(d < 20){
						if(d < 1){
							d = 1/d
						}
					d*=5
					}
				op.nxadd.x += -50*dy/d/d
				op.nxadd.y += 50*dx/d/d
				}
			}
			
		},
		"A4":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
					if(d < 20){
						if(d < 1){
							d = 1/d
						}
					d*=5
					}
				op.nxadd.x -= -50*dy/d/d
				op.nxadd.y -= 50*dx/d/d
				}
			}
			
		},
		"A5":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
				op.nxadd.x += -dy*d/2000
				op.nxadd.y += dx*d/2000
				}
			}
			
		},
		"A6":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
				op.nxadd.x -= -dy*d/2000
				op.nxadd.y -= dx*d/2000
				}
			}
			
		},
		"G1":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B8",10)
				}
			},
			"eachFrame":(f,p)=>{
				p.stinfo.pulse = 4-f%40/10
			},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 300){
				if(d < 1){
					d = 1/d
				}
				op.nxadd.x += p.stinfo.pulse*p.stinfo.pulse*20*dx/d/d				
				op.nxadd.y += p.stinfo.pulse*p.stinfo.pulse*20*dy/d/d
				}
				}
			},
		"G2":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B8",10)
				}
			},
			"eachFrame":(f,p)=>{
				p.stinfo.pulse = f%70>40?0:40-f%70
			},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 300){
				if(d < 1){
					d = 1/d
				}
				op.nxadd.x += p.stinfo.pulse*p.stinfo.pulse*dx/d/d/2			
				op.nxadd.y += p.stinfo.pulse*p.stinfo.pulse*dy/d/d/2
				}
				}
			},
		"G3":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B8",10)
				}
			},
			"eachFrame":(f,p)=>{
				p.stinfo.pulse = (f%300>150?(300-f%300):f%300)-75
			},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 200){
					if(d < 20){
						if(d < 1){
							d = 1/d
						}
					d*=5
					}
				op.nxadd.x += -p.stinfo.pulse*15*dy/d/d
				op.nxadd.y += p.stinfo.pulse*15*dx/d/d
				}
			}
			},

			"G4":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B8",10)
				}
			},
			"eachFrame":(f,p)=>{
				p.stinfo.pulse = 4-f%40/10
			},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d < 300){
				if(d < 15){
					if(d<3){
						return
					}
					d*=15	
				}
				op.nxadd.x -= p.stinfo.pulse*p.stinfo.pulse*20*dx/d/d				
				op.nxadd.y -= p.stinfo.pulse*p.stinfo.pulse*20*dy/d/d
				}
				}
			},

			"H1":{
			// "chainRes":(i,p,c)=>{
			// 		c+=1
			// 		let s = p.stinfo.chainMem
			// 		s.mem += i
			// 		let out = i * 0.8
			// 		if(c < s.maxChain){
			// 		s.outTo.forEach((e)=>{
			// 			GI.particles[e].info.chainRes(out,GI.particles[e],c)
			// 		})
			// 		}

			// 	},
				"eachFrame":(f,p)=>{
				let s = p.capsule
				s.mem -= s.decay
				if(s.mem < 0){
					s.mem = 0
				}
				p.stinfo.color = "rgb(0,"+(s.mem)+",0)"
			},
				"initiate":(p)=>{
					p.capsule = new nur1()
				}
			},
			"H2":{

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
				"eachFrame":(f,p)=>{
				let s = p.capsule
				s.mem -= s.decay
				if(s.mem < 0){
					s.mem = 0
				}
				p.stinfo.color = "rgb(0,"+(s.mem)+",0)"
			},
				"initiate":(p)=>{
					p.capsule = new nur1()
				}
			},
			

		}

	static typeDict2 = {
		"F1":{"color":"#00FF00","letter":"U"},
		"F2":{"color":"#FF0000","letter":"U"},
		"F3":{"color":"#FFFF00","letter":"U"},//gridpt ST
		"F4":{"color":"#FFFFFF","letter":"U"},//cross displace INF
		"F5":{"color":"#0000FF","letter":"U"},//does nothing
		"F6":{"color":"#FF005F","letter":"U"},//gravity
		"F7":{"color":"#800000","letter":"U"},//shell ST?

		"A1":{"color":"#00FF00"},
		"A2":{"color":"#0000FF"},
		"A3":{"color":"#FF00FF"},
		"A4":{"color":"#FF0000"},
		"A5":{"color":"#FF00FF","letter":"I"},
		"A6":{"color":"#FF0000","letter":"I"},

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
		"D5":{"color":"#404040","letter":"F","following":-1},//catalyser, following
		"D6":{"color":"#004040","letter":"F","following":-1},//catalyser, following
		"D7":{"color":"#808080","letter":"F","following":-1},//catalyser, following
		"D8":{"color":"#008080","letter":"F","following":-1},//catalyser, following
		"D9":{"color":"#F00080","decay":2,"letter":"F","following":-1},//virus, following -> B8

		"E1":{"color":"#628000","letter":"C"},//gravity killer +> 2x B1 -> 4x B8
		"E2":{"color":"#2E230A","letter":"G"},//generator(B8) -> E1
		"E3":{"color":"#6E2300","children":0,"letter":"G"},//generator(B8,B5,B4) -> E1
		"E4":{"color":"#00A000","children":0,"letter":"G"},//generator(B3,B5,B4) -> E1
		"E5":{"color":"#00A0A0","children":0,"letter":"G"},//generator(B6,B5,B4) -> E1
		"E6":{"color":"#A000A0","children":0,"letter":"G"},//generator(A3)
		"E7":{"color":"#A00000","children":0,"letter":"G"},//generator(A4)
		"E8":{"color":"#620000","letter":"C"},//gravity killer +> A4 -> 4x A4
		"E9":{"color":"#620062","letter":"C"},//gravity killer +> A3 -> 4x A3

		"G1":{"color":"#FFFFFF","letter":"P","pulse":0},//pulsar push
		"G2":{"color":"#808080","letter":"P","pulse":0},//pulsar push
		"G3":{"color":"#F8BBD0","letter":"S","pulse":0},//phaser spin
		"G4":{"color":"#BBF8D0","letter":"P","pulse":0},//pulsar gravity

		"H1":{"color":"#605050","letter":"M","chainMem":{
			"mem":0,
			"inMults":[0,0,0],
			"inAdds":[0,0,0],
			"outLim":10,
			"decay":0.5,
			"outNum":1,
			"outTo":[],
			"maxChain":10,
		}},//memory core
	}

	static getTypeInfo(t){
		return(this.typeDict[t])
	}
	static getTypeInfo2(t){
		return(JSON.parse(JSON.stringify(this.typeDict2[t])))
	}
}




class nur1{
	constructor(){
		this.mem = 0;
		this.inMults = [0,0,0];
		this.inAdds = [0,0,0];
		this.outLim = 10;
		this.decay = 1;
		this.outNum = 1;
		this.lastAction = {"in":[],"out":0}
		this.outTo = [];
		this.inFrom = [];
		this.maxChain = 10;
	}


	chainRes(i,c){
		c+=1
		this.mem += i
		if(this.mem > 255){
			this.mem = 255
		}
		let out = i * 0.8
		if(c < this.maxChain){
			this.outTo.forEach((e)=>{
				GI.particles[e].capsule.chainRes(out,c)
			})
		}
	}

	AChainRes(a,c){
		c+=1

		let i = 0;
		this.inMults.forEach((e,j)=>{
			if(a[j] === undefined){return;}
			i += (a[j]+inAdds[j])*e
		})

		this.mem += i
		if(c < this.maxChain){ 
			if(this.outLim < this.mem && this.outLim > this.mem-i){
				this.outTo.forEach((e)=>{
					GI.particles[e].capsule.AChainRes(this.outNum,c)
				})
			}
		}
	}

	CorrShld(a){
		if(a == "none"){

		}
	}


}





function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

let _MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)

function psf(){
	G.updateParticles()
}

function repeat(){

	let D = Date.now()

	ctx.fillStyle = GI.display.background
	ctx.fillRect(0,0,Width,Height)


	if(GI.grid){
		ctx.beginPath()
		ctx.lineWidth = 1
		ctx.strokeStyle = "#303030"
		for(let i = 0; i < Width/80*GI.zoom+1; i++){
			ctx.moveTo((i*80-GI.cam.x%80)/GI.zoom,0)
			ctx.lineTo((i*80-GI.cam.x%80)/GI.zoom,Height)
		}
		for(let i = 0; i < Height/80*GI.zoom+1; i++){
			ctx.moveTo(0,(i*80-GI.cam.y%80)/GI.zoom)
			ctx.lineTo(Width,(i*80-GI.cam.y%80)/GI.zoom)
		}
		ctx.stroke()
	}


	if(GI.typeDict2[GI.type[0]+GI.type[1]] !== undefined){
	ctx.fillStyle = "purple"} else {
		ctx.fillStyle = "red"
	}
	ctx.font = "40px Arial"
	ctx.fillText(GI.type[0]+GI.type[1]+"  -  Particles: "+GI.particlesArr.length+" - key: "+GI.currentKey+" - mode: "+GI.mouseModeArr[GI.mouseMode],0,40)
	if(GI.customDebugger){
		ctx.fillText(GI.debuggingInfo,0,80)
	}

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

	psf()

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


	G.drawGrapher()

	GI.preformanceCalculate += ((ED-D)/GI.particlesArr.length)*100
	G.updateGrapher(ED-D)
	if(GI.frame%100 == 0){
		console.log("AVERAGE PARTICLE CALCULATION TIME: "+(GI.preformanceCalculate/100))
		GI.preformanceCalculate = 0
	}
}