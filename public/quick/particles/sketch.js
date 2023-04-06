let myCanvas = document.getElementById("myCanvas")

let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"

document.getElementById("help").style.width = Math.floor(Width-20)+"px"
document.getElementById("help").style.height = Math.floor(Height)+"px"
document.getElementById("help").style.position = "absolute"
document.getElementById("help").style.left = 0
document.getElementById("help").style.top = 0
document.getElementById("help").innerHTML =
`
<strong>
</br>This is lopkns particle simulator, LPRTS for short. (Undulating balls!!)
</br>LPRTS is an infinite space particle sandbox built using <span style="color:orange">javascript</span>
</br>This game is currently getting new updates every single day!
</br>Press <span style="color:cyan">[h]</span> to toggle this help menu. Please note that this game is <span style="color:yellow">CASE SENSITIVE</span>
</br>
</br>This help menu is still being developed, still feel free to tell me what you think should change.
</br>Lopkns discord tag is <span style="color:yellow">lopkn#0019</span>
</br>
</br>
</br>
</br><span style="color:green">= == === BASIC INFO === == =</span>
</br>
</br>-Content order of help menu:
</br><span style="color:green">-BASIC INFO-</span>
</br><span style="color:green">-KEYBOARD & MOUSE CONTROLS-</span>
</br><span style="color:green">-MOBILE CONTROLS-</span>
</br>
</br>
</br>-Default color schemes:
</br><span style="color:green">green</span> => content page name
</br><span style="color:yellow">yellow</span> => important information
</br><span style="color:cyan">cyan</span> => game controls
</br><span style="color:red">turquoise</span> => false information
</br>
</br>
</br>-If you have a keyboard, you can close/toggle mobile UI by pressing <span style="color:cyan">[i]</span>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br><span style="color:green">= == === KEYBOARD & MOUSE CONTROLS === == =</span>
</br>
</br>
</br><span style="color:orange"> basic mouse controls </span>
</br>
</br><span style="color:cyan">left clicking</span> will place down a particle of the current type where you click.
</br>
</br><span style="color:cyan">[ctrl] + holding left click</span> autoclick/spams current particle where your cursor is.
</br>
</br><span style="color:cyan">[alt] + holding left click + dragging / holding right click + dragging </span> kill enclosed particles.
</br>
</br><span style="color:cyan">[alt] + [shift] + holding left click + dragging</span> kill enclosed particles of the current selected particle type.
</br>
</br>
</br><span style="color:orange"> miscellaneous </span>
</br>
</br><span style="color:cyan">[i]</span> toggles the mobile UI.
</br>
</br><span style="color:cyan">[h] or [?]</span> toggles this current help menu.
</br>
</br><span style="color:cyan">[z]</span> toggles sub-type mode.
</br>
</br><span style="color:cyan">[g]</span> toggles grid background.
</br>
</br>
</br><span style="color:orange"> particle selection </span>
</br>
</br><span style="color:cyan">letters [A] to [L]</span> switches the selected particle to that <span style="color:yellow">category</span>
</br>
</br><span style="color:cyan">numbers [0] to [9]</span> switches the selected particle to that <span style="color:yellow">type</span>
</br>
</br><span style="color:cyan">[ctrl] + numbers [0] to [9]</span> switches the selected particle to that <span style="color:yellow">sub-type</span>
</br>This can be also be done when "sub-type mode" is toggled on.
</br>
</br>
</br><span style="color:orange"> camera controls </span>
</br>
</br><span style="color:cyan">[=]</span> zooms out.
</br>
</br><span style="color:cyan">[-]</span> zooms in.
</br>
</br><span style="color:cyan">arrow keys</span> <span style="color:yellow">moves camera</span> in respective direction. moves twice as fast if <span style="color:cyan">[alt]</span> is held down.
</br>
</br><span style="color:cyan">[shift] + arrow keys</span> applies a <span style="color:yellow">velocity</span> to the camera indicated by a line from the middle of the screen. Your camera will move by itself in that direction.
</br>
</br><span style="color:cyan">[r]</span> resets the current camera velocity to 0.
</br>
</br>
</br><span style="color:orange"> time dialation controls </span> -- please note that changing the speed will affect the FPS since the main update loop is tied to drawing the frame. It will also affect the stat graphs for your device preformance accordingly.
</br>
</br><span style="color:cyan">[\>]</span> speeds up simulation.
</br>
</br><span style="color:cyan">[\<]</span> slows down simulation.
</br>
</br><span style="color:cyan">[.]</span> speeds up simulation by a small bit.
</br>
</br><span style="color:cyan">[,]</span> slows down simulation by a small bit.
</br>
</br><span style="color:cyan">[/]</span> returns simulation to default speed.
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br>
</br> PARTICLE CATEGORIES (under construction)
</br> Category A: Default particles
</br> Category B: semi Default particles
</br> Category C: universal decayers
</br> Category D: viruses
</br>
</br>
</br>
</strong>
`

let CTX = {"main":myCanvas.getContext("2d")}
let ctx = CTX.main

let mouseX = 0
let mouseY = 0

onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

function camPosRel(x,y){
	return([(-GI.cam.x+(x))/GI.zoom,(-GI.cam.y+(y))/GI.zoom])
}

document.addEventListener("mousedown",(e)=>{

	if(interactor.clickedOn(mouseX,mouseY)){
		interactor.phaseSpace = true;
		interactor.handleStart()
		return;
	}


	if(GI.mouseModeArr[GI.mouseMode] == "normal"){
		e.preventDefault()
		if(e.altKey||GI.altPressed || GI.functionals.alt || e.which === 3){
			GI.selectionStart = [mouseX,mouseY,e.shiftKey?e.shiftKey:GI.functionals.shift]
		}

		if(e.ctrlKey || GI.functionals.ctrl){
			GI.mouseInterval = setInterval(()=>{G.newParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom,GI.type[0]+GI.type[2]+GI.type[1],10,e)},GI.autoclickSpeed)
		}
	} else if(GI.mouseModeArr[GI.mouseMode] == "selector"){
		let selected = G.selectParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom)
		if(selected !== "none"){
			GI.selectedParticles.push(selected[0])
			if(e.ctrlKey || GI.functionals.ctrl){
				GI.mouseInterval = setInterval(()=>{GI.particles[selected[0]].x = GI.cam.x+(mouseX)*GI.zoom;GI.particles[selected[0]].y =GI.cam.y+(mouseY)*GI.zoom},GI.autoclickSpeed)
			}
		}
	} else if(GI.mouseModeArr[GI.mouseMode] == "activator"){
		let selected = G.selectParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom)
		if(selected !== "none"){
			let p = GI.particles[selected[0]]
			if(p.capsule !== undefined){
				if(p.capsule.version === 1){
				p.capsule.chainRes(GI.AE,0)} else {
					p.capsule.chainRes([GI.AE],0)
				}
			}
			if(e.ctrlKey || GI.functionals.ctrl){
				GI.mouseInterval = setInterval(()=>{GI.particles[selected[0]].x = GI.cam.x+(mouseX)*GI.zoom;GI.particles[selected[0]].y =GI.cam.y+(mouseY)*GI.zoom},GI.autoclickSpeed)
			}
		}
	}
})

document.addEventListener("mouseup",(e)=>{


	clearInterval(GI.mouseInterval)


	if(interactor.phaseSpace){
		interactor.phaseSpace = false;
		interactor.handleEnd()
		return;
	}


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
					if(inRectA(p.x,p.y,ax1,ay1,ax2,ay2)&&p.t == GI.type[0]+GI.type[2]+GI.type[1]){
					G.delParticle(p)
				}
				}
			}

			GI.selectionStart = false
			return
		}
	G.newParticle(GI.cam.x+(mouseX)*GI.zoom,GI.cam.y+(mouseY)*GI.zoom,GI.type[0]+GI.type[2]+GI.type[1],10,e)

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




})

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();})

document.addEventListener("keyup",(e)=>{
	let k = e.key
	if(k == "Control" || k == "Shift" || k == "Alt" || k == "Tab"){
		GI.functionals[k] = false
		if(k == "Alt"){
			GI.altPressed = false;
		}
	}
	
})

const regexp1 = new RegExp('^[A-Z]+$');
const regexp2 = new RegExp('^[0-9]+$');

document.addEventListener("keydown",(e)=>{
	let k = e.key

	GI.currentKey = k

	if(k == "Control" || k == "Shift" || k == "Alt" || k == "Tab"){
		GI.functionals[k] = true
	}

	console.log(k)

	if(regexp1.test(k)){
		GI.type[0] = k
	}

	if(regexp2.test(k)){
		if(e.ctrlKey || GI.functionals.ctrl || GI.altNumber){
			GI.type[2] = k
		} else {
			GI.type[1] = k
		}
	}


	switch(k){

		case "=":
			GI.zoom += 0.1
			break;
		case "-":
			GI.zoom -= 0.1
			break;

		case "+":
			GI.zoom += 0.5
			break;
		case "_":
			GI.zoom -= 0.5
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
		case "/":
			GI.FRATE = 50
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			break;
		case " ":
			if(GI.paused){
				interactor.abuttons[17].color = "#00F000"
				psf = ()=>{G.updateParticles()}
				} else {
					interactor.abuttons[17].color = "#FF0000"
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
		case "i":
			interactor.opened = !interactor.opened;
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
		case "z":
			GI.altNumber = !GI.altNumber
			if(GI.altNumber){
					interactor.abuttons[27].color = "#FF0000"
				} else {
					interactor.abuttons[27].color = "#704000"
				}
			break;
		case "h":
		case "?":
			GI.help = !GI.help
			if(GI.help){
			document.getElementById("help").style.visibility = "visible"
			} else {
				document.getElementById("help").style.visibility = "hidden"
			}
			break;
	}

	if(e.ctrlKey||GI.functionals.ctrl){
		e.preventDefault()
	}

	

	let r = ["",15*GI.zoom]
	if(e.shiftKey || GI.functionals.shift){
		r = ["v",1*GI.zoom]
	}

	if(e.altKey || GI.functionals.alt){
		e.preventDefault()
	if(k == "ArrowUp"){
		GI.cam[r[0]+"y"] -= r[1]
	}else if(k == "ArrowDown"){
		GI.cam[r[0]+"y"] += r[1]
	}else if(k == "ArrowRight"){
		GI.cam[r[0]+"x"] += r[1]
	}else if(k == "ArrowLeft"){
		GI.cam[r[0]+"x"] -= r[1]
	}}
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
		GI.cam.vx = 0
		GI.cam.vy = 0
	} else if(k == "t"){
		GI.grapherTrans = !GI.grapherTrans
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


class LGPH{

	//new LGPH(myCtx,200,150,400,0,"green",true,20)
	constructor(mainCtx,w,h,x,y,color,trsp,maxv){
		this.ctx = mainCtx
		if(mainCtx.top == undefined){
			mainCtx.top = 0
		}
		if(mainCtx.left == undefined){
			mainCtx.left = 0
		}
		this.w = w
		this.h = h
		this.x = x
		this.y = y
		this.values = [0]
		this.maxValues = maxv
		this.lineSize = w/maxv
		this.trsp = trsp
		this.color = color
		this.lineWidth = 5
		this.heightVide = (x)=>{return(x/3)}
	}


	vPush(val){
		this.values.unshift(val)
		if(this.values.length > this.maxValues){
			this.values.splice(this.maxValues,1)
		}
	}

	coverBack(){
		this.ctx.fillStyle = "#000000"
		this.ctx.fillRect(this.x,this.y,this.w,this.h)
	}

	draw(){
		this.ctx.beginPath()
		this.ctx.strokeStyle = this.color
		this.ctx.lineWidth = this.lineWidth
		this.ctx.moveTo(0+this.x,this.h-this.heightVide(this.values[0]))
		for(let i = 1; i < this.values.length; i++){
			this.ctx.lineTo(i*this.lineSize+this.x,this.h-this.heightVide(this.values[i]))
		}
		this.ctx.stroke()
	}

	move(x,y){
		if(this.trsp){
			this.ctx.top = y
			this.ctx.left = x
		}
	}

	

}


class G{

	static grapher = []
	static grapherInfo = {"px":8,"f":(e)=>{return(e*5)},"ln":120}

	static pgph = new LGPH(ctx,960,Height,0,Height,"red",false,60)


	static updateGrapher(e){
		let pt = this.grapherInfo.f(e)
		this.grapher.unshift(pt)
		if(this.grapher.length > this.grapherInfo.ln){
			this.grapher.splice(this.grapherInfo.ln,1)
		}
	}

	static drawGrapher(){
		let x = 0
		ctx.strokeStyle = GI.grapherTrans?"rgba(0,255,0,0.3)":"#00FF00"
		ctx.lineWidth = 5
		ctx.beginPath()
		ctx.moveTo(this.grapherInfo.px*this.grapherInfo.ln,Height-this.grapher[0])
		for(let i = 1; i < this.grapher.length;i++){
			ctx.lineTo((this.grapherInfo.px*(this.grapherInfo.ln-i)),Height-this.grapher[i])
		}
		ctx.stroke()
	}

	static fvirus(){
		let count = 0
		let list = []
		GI.particlesArr.forEach((e)=>{
			let a = GI.particles[e]
			if(isNaN(a.x) || isNaN(a.y)){
				count += 1
				list.push(e)
			}
		})
		console.log("found "+count+" broken particles")
		return([count,list])
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

		if(!e||(!e.shiftKey && !GI.functionals.shift)){GI.particlesArr.push(id)}else{GI.particlesArr.unshift(id)}
		return(id)
	}

	static drawCircle(x,y,r,f){
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		if(f){ctx.fill()}
		ctx.stroke();
	}

	static loadParticles(a,l){
		if(l){
			a.forEach((e)=>{
				this.newParticle(e.x,e.y,e.t,10)
				GI.particles[GI.particlesArr[GI.particlesArr.length-1]].life = e.l
			})
		} else {
			a.forEach((e)=>{
				this.newParticle(e.x,e.y,e.t,10)
			})
		}
	}
	static loadState(d){
		GI.cam.x = d.camx
		GI.cam.y = d.camy
		GI.zoom = d.zoom
		GI.FRATE = d.frate
	}

	static loadS(s){
		let a = JSON.parse(s)
		this.loadParticles(a[0],a[1].l)
		this.loadState(a[1])
	}

	static saveState(life){
		let d = []

		life = life?true:false

		if(life){
		GI.particlesArr.forEach((e)=>{
			d.push({"x":GI.particles[e].x,"y":GI.particles[e].y,"t":GI.particles[e].t,"l":GI.particles[e].life})
		})
		} else {
			GI.particlesArr.forEach((e)=>{
			d.push({"x":GI.particles[e].x,"y":GI.particles[e].y,"t":GI.particles[e].t})
		})
		}

		let gd = {"camx":GI.cam.x,"camy":GI.cam.y,"zoom":GI.zoom,"frate":GI.FRATE,"l":life}

		let a = [d,gd]

		console.log(JSON.stringify(a))
		return(JSON.stringify(a))
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

	static drawLines(){
		let d = Date.now()

		//{"x":,"y":,"tx":,"ty":,"color":,"expireTime":,"size":,}
		for(let i = GI.lines.length-1;i>-1;i--){

			let e = GI.lines[i]
			e.life -= 1
			if(e.life < 1){
				GI.lines.splice(i,1)
				continue;
			}

			ctx.beginPath()
			ctx.strokeStyle = e.color
			ctx.lineWidth = e.size/GI.zoom*e.life/e.maxlife
			let apos = camPosRel(e.x,e.y)
			let bpos = camPosRel(e.tx,e.ty)
			ctx.moveTo(apos[0],apos[1])
			ctx.lineTo(bpos[0],bpos[1])
			ctx.stroke()
		}
		
	}

	static drawParticles(){
		ctx.lineWidth = 1
		ctx.strokeStyle = "#000000"
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
		GI.particlesArr.forEach((e,i)=>{
			this.updateParticle2(GI.particles[e])
		})
	}

	static updateParticle2(p){
		let nxad = p.nxadd

		if(p.info.stability !== undefined){
			nxad.x *= p.info.stability.x
			nxad.y *= p.info.stability.y
			nxad.vx *= p.info.stability.vx
			nxad.vy *= p.info.stability.vy
		}

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
	static type = ["A","1","0"]

	static debuggingInfo = ""
	static customDebugger = true

	static display = {"background":"#000000"}

	static selectionStart = false
	static mouseInterval = 0

	static help = false

	static currentKey = "nothing"

	static grapherTrans = true

	static mouseMode = 0
	static mouseModeArr = ["normal","selector","activator"]
	static selectedParticles = []

	static AE = 150;

	static functionals = {
		"ctrl":false,
		"shift":false,
		"alt":false,
		"tab":false
	}

	static altNumber = false

	static autoclickSpeed = 100
	static grid = false
	static frame = 0
	static paused = false
	static preformanceCalculate = 0
	static altPressed = false
	static zoom = 1

	static lines = []


	static barFont = Width > 1000? "40px Arial":"25px Arial"

	static getPI(){
		this.partIDcount++
		return(this.partIDcount)
	}

	static FRATE = 50

	static typeDict = {
		"F01":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*Math.sin(dx/50)/d
				op.y -= 150*Math.sin(dy/50)/d

				return([-d*dx,-d*dy])

			}
		},
		"F02":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= 150*0.01*Math.sin(dx/35)
				op.y -= 150*0.01*Math.sin(dy/35)

				return([-d*dx,-d*dy])

			}
		},
		"F03":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x -= d*0.01*Math.cos(dx/45)
				op.y -= d*0.01*Math.cos(dy/45)

				return([-d*dx,-d*dy])

			}
			
		},
		"F04":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.x += 51/dx
				op.y += 51/dy

				return([-d*dx,-d*dy])

			}
			
		},
		"F05":{
			
		},
		"F06":{
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
		"F07":{
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



		"B01":{
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
		"B02":{
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
		"B03":{
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
		"B04":{
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
		"B14":{
			"stability":{"x":0.02,"y":0.02,"vx":0.5,"vy":0.5},
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
		"B05":{
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
		"B06":{
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
		"B07":{
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
		"B08":{
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
		"C01":{
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
				G.newParticle(p.x,p.y,"B04",10)
			}
			
		},
		"C02":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				op.nxadd.x -= 0.005*dx
				op.nxadd.y -= 0.005*dy

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"C01",10)
			}
			
		},
		"C03":{
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
				G.newParticle(p.x,p.y,"B05",10)
			}
			
		},
		"D01":{
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
				G.newParticle(p.x,p.y,"B01",10)
			}
			
		},
		"D11":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d < 200 && op.t !== "D11"){
				if(d < 60){

				op.life -= 3

				if(d<1){
						d = 1
					}
				}
				op.nxadd.x -= 2*dx/d	
				op.nxadd.y -= 2*dy/d
				}
			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"D01",10)
			}
			
		},
		"D21":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d < 200 && op.t !== "D21"){
				if(d < 60){

				op.life -= 6

				if(d<1){
						d = 1
					}
				}
				op.nxadd.x -= 2*dx/d	
				op.nxadd.y -= 2*dy/d
				}
			}
			
		},
		"D02":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}

				if(op.t != "D02"){
				if(d < 60 && op.t != "B01"){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y,"D02",10)
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
				G.newParticle(p.x,p.y,"B01",10)
			}
			
		},
		"D12":{
			"stability":{"x":0.002,"y":0.002,"vx":0.25,"vy":0.25},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<1){
						d = 1
					}

				if(op.t != "D02"){
				if(d < 60 && op.t != "B01"){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y,"D02",10)
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
				G.newParticle(p.x,p.y,"B01",10)
			}
			
		},
		"D03":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<3){
						d = 3
					}

				if(op.t != "D03"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y,"D03",10)
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
			"D13":{
				"stability":{"x":0.002,"y":0.002,"vx":0.25,"vy":0.25},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<3){
						d = 3
					}

				if(op.t != "D03"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y,"D03",10)
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
			"D04":{
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
					if(f%5==0){
					GI.lines.push({"x":p.x,"y":p.y,"tx":op.x,"ty":op.y,"size":5,"life":8,"maxlife":8,"color":"#00FFFF"})
					}
					if(op.life <= 0){
						G.newParticle(op.x,op.y,"D04",10)
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
					if(op.t == "D04"){return}
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
					if(op.t != "D04"){
						op.nxadd.x -= 180*dx/d/d	
						op.nxadd.y -= 180*dy/d/d
					}
				})

				

			}

			},
			
		},
		"D05":{
			"stability":{"x":0.02,"y":0.02,"vx":0.5,"vy":0.5},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<3){
						d = 3
					}

				if(op.t !== "D05"){
					if(d < 60){

					op.life -= 50

						if(op.life <= 0){
							G.newParticle(op.x,op.y,"D05",10)
							G.delParticle(op)
							p.life += 400

							return
						}				
					}
				} else {
					op.nxadd.x += Math.random()*500*dx/d/d
					op.nxadd.y += Math.random()*500*dy/d/d
				}

			},
			"eachFrame":(f,p)=>{
				p.stinfo.color = "rgba(255,"+(p.life/4)+",0,"+(p.life/200)+")"
			}
		},
		"D15":{
			"stability":{"x":0.02,"y":0.02,"vx":0.5,"vy":0.5},
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<3){
						d = 3
					}

				if(op.t !== "D15" && op.t !== "D25"){
					if(d < 90){

					op.life -= Math.floor(50*d/70)

						if(op.life <= 0){
							if(Math.random()>0.1){
							if(p.life > 2000){
								G.newParticle(op.x,op.y,"D25",10)
							}else{
								G.newParticle(op.x,op.y,"D15",10)
							}
							}
							G.delParticle(op)
							p.life += 400

							return
						}				
					}
				} else {
					if(d < 60){
						op.life -= 2
					}
					op.nxadd.x += Math.random()*500*dx/d/d
					op.nxadd.y += Math.random()*500*dy/d/d
				}

			},
			"eachFrame":(f,p)=>{
				p.stinfo.color = "rgba(255,"+(p.life/4)+",0,"+(p.life/200)+")"
				p.vy -= p.stinfo.flameVel
			},
			"initiate":(p)=>{
				p.stinfo.flameVel = Math.random()*0.3
			}
		},
		"D25":{
			"stability":{"x":0.02,"y":0.02,"vx":0.5,"vy":0.5},
			"eachFrame":(f,p)=>{
				if(f%3===0){
					G.newParticle(p.x,p.y,"D15",10)
				}
				p.vy += p.stinfo.flameVel
			},
			"initiate":(p)=>{
				if(Math.random()<0.5){
					p.stinfo.color = "rgb(255,255,"+(Math.random()*150+100)+")"
				} else {
					p.stinfo.color = "rgb(200,200,"+(Math.random()*55+220)+")"
				}
				p.vx = Math.random()*5-2.5
				p.life *= Math.random()*2+1
				p.stinfo.flameVel = Math.random()*0.3
			}
		},
		"D27":{
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
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B01",10)
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B01",10)
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
					if(op.t !== "B04"){return}
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
		"D28":{
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
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B04",10)
						G.newParticle(op.x+Math.random()-0.5,op.y+Math.random()-0.5,"B04",10)
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
					if(op.t !== "B01"){return}
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
		"D07":{
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
						G.newParticle(op.x+Math.random(),op.y+Math.random(),"B01",10)
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
					if(op.t !== "B04"){return}
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
		"D17":{
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
						G.newParticle(op.x+Math.random(),op.y+Math.random(),"B01",10)
						G.delParticle(op)
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t !== "B04"){return}
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
		"D08":{
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
						G.newParticle(op.x+Math.random(),op.y+Math.random(),"B04",10)
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
					if(op.t !== "B01"){return}
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
		"D18":{
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
						G.newParticle(op.x+Math.random(),op.y+Math.random(),"B04",10)
						G.delParticle(op)
						return
						}
					}

					p.x += 0.05 * dx
					p.y += 0.05 * dy

				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					if(op.t !== "B01"){return}
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
		"D09":{
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
					if(f%17==(Math.floor(Math.abs((p.x+p.y)/80))%17)){
					GI.lines.push({"x":p.x,"y":p.y,"tx":op.x,"ty":op.y,"size":12,"life":8,"maxlife":8,"color":"#5FF05F"})
					}
					if(op.life <= 0){
						G.newParticle(op.x,op.y,"D09",10)
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
					if(op.t == "D09" || op.t == "B08"){return}
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 3000){
					if(Math.random()>0.99){
						p.stinfo.following = e
					}
					}
				})

				

			}

			},
			"onDeath":(p)=>{
				G.newParticle(p.x,p.y,"B08",10)
			}
			
		},
		"E01":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<10){
						d = 10
					}

				if(op.t != "B01" && op.t != "E01"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y+5,"B01",10)
					G.newParticle(op.x,op.y-5,"B01",10)
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
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B08",10)
				}
			}
			
		},
		"E02":{
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
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"E01",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%60 == 0){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B08",10)
				}
			}
			
		},
		"E03":{
			"onDeath":(p)=>{
				for(let i = 0; i < 2; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"E01",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%20 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					let r = Math.random()
					if(r > 0.7){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B08",10,undefined,p)
					}else if(r > 0.4){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B04",10,undefined,p)
					} else {
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B05",10,undefined,p)
					}
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E04":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B05",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					let r = Math.random()
					if(r > 0.9){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B05",10,undefined,p)
					}else if(r > 0.7){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B04",10,undefined,p)
					} else {
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B03",10,undefined,p)
					}
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E05":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B05",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					let r = Math.random()
					if(r > 0.9){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B05",10,undefined,p)
					}else if(r > 0.7){
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B04",10,undefined,p)
					} else {
						G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"B06",10,undefined,p)
					}
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E06":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A03",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"A03",10,{"shiftKey":true},p)
					
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E07":{
			"onDeath":(p)=>{
				for(let i = 0; i < 6; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"A04",10)
				}
			},
			"eachFrame":(f,p)=>{
				if(f%6 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A04",10,{"shiftKey":true},p)
					
				}
			},
			"childOnDeath":(c,p)=>{
				p.stinfo.children -= 1
			}
			
		},
		"E08":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<10){
						d = 10
					}

				if(op.t != "A04" && op.t != "E08"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y+5,"A04",10)
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
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A04",10)
				}
			}
			
		},
		"E09":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(d<10){
						d = 10
					}

				if(op.t != "A03" && op.t != "E09"){
				if(d < 60){

				op.life -= 5

				if(op.life <= 0){
					G.newParticle(op.x,op.y+5,"A03",10)
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
					G.newParticle(p.x+Math.random()*16-8,p.y+Math.random()*16-8,"A03",10)
				}
			}
			
		},

		"A01":{
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
		"A02":{
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
		"A03":{
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
		"A04":{
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
		"A05":{
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
		"A06":{
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
		"A07":{
			"onDeath":(p)=>{
				for(let i = 0; i < 50; i++){
					setTimeout(()=>{G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B01",10)},Math.random()*500)
				}
			}
			
		},
		"A17":{
			"onDeath":(p)=>{
				GI.particlesArr.forEach((e)=>{
					let op = GI.particles[e]
					let d = distance(p.x,p.y,op.x,op.y)
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)

					if(d < 400){
						op.nxadd.x += Math.random()*1000*dx/d
						op.nxadd.y += Math.random()*1000*dy/d
					}
				})
			}
			
		},
		"A27":{
			"onDeath":(p)=>{
				for(let i = 0; i < 50; i++){
					setTimeout(()=>{G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B01",10)},Math.random()*500)
				}
			}
			
		},
		"A37":{
			"onDeath":(p)=>{
				let rr = Math.random()*3 + 1
				for(let i = 0; i < 20; i++){
					setTimeout(()=>{
						let tp = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"D25",10)
						GI.particles[tp].vy = (Math.random()*5-2.5)*rr*rr
						GI.particles[tp].vx *= Math.random()*2.5 + 0.5
						GI.particles[tp].vx *= rr
					},Math.random()*5)
				}
			}
			
		},
		"A47":{
			"onDeath":(p)=>{
				let rr = Math.random()*3 + 2
				for(let i = 0; i < 4; i++){
					setTimeout(()=>{
						let tp = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"D25",10)
						GI.particles[tp].vy = (Math.random()*5-2.5)*rr*rr
						GI.particles[tp].vx *= Math.random()*2.5 + 0.5
						GI.particles[tp].vx *= rr
					},Math.random()*5)
				}
			}
			
		},
		"A57":{
			"onDeath":(p)=>{
				let rr = Math.random()*3 + 2
				for(let i = 0; i < 4; i++){
					setTimeout(()=>{
						let tp = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"D25",10)
						GI.particles[tp].vy = (Math.random()*5-2.5)*rr*rr
						GI.particles[tp].vx *= Math.random()*2.5 + 0.5
						GI.particles[tp].life *= 0.5
						GI.particles[tp].vx *= rr
					},Math.random()*5)
				}
			}
			
		},
		"A67":{
			"onDeath":(p)=>{
				let rr = Math.random()*3 + 2
				for(let i = 0; i < 6; i++){
					setTimeout(()=>{
						let tp = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"A57",10)
							GI.particles[tp].life = 100000
							GI.particles[tp].vx = Math.random()*5-2.5
							GI.particles[tp].stinfo.decay = 5000
						GI.particles[tp].vy = (Math.random()*5-2.5)*rr*rr
						GI.particles[tp].vx *= Math.random()*2.5 + 0.5
						GI.particles[tp].vx *= rr
					},Math.random()*5)
				}
			}
			
		},
		"A08":{
			"onDeath":(p)=>{
				let r = Math.random()*7
				let a = Object.keys(GI.typeDict2)
				let R = Math.floor(Math.random()*a.length)
				for(let i = 0; i < r+3; i++){
				G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,a[R],10)
				}
			}
			
		},
		"A09":{
			"onDeath":(p)=>{
				let r = Math.random()*7
				let a = Object.keys(GI.typeDict2)
				for(let i = 0; i < r; i++){
				let R = Math.floor(Math.random()*a.length)
				G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,a[R],10)
				}
			}
			
		},
		"G01":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B08",10)
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
		"G02":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B08",10)
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
		"G03":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B08",10)
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

			"G04":{
			"onDeath":(p)=>{
				for(let i = 0; i < 4; i++){
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"B08",10)
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

			"H01":{
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
			"H02":{

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
			"H03":{

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
			},
				"eachFrame":(f,p)=>{
				let s = p.capsule
				s.mem -= s.mem*0.02
				if(s.mem < 0){
					s.mem = 0
				}
				// p.stinfo.color = "rgb(0,"+(s.mem)+",0)"

				if(s.mem < 1){
					p.stinfo.color = "rgb("+(s.mem*255)+",0,0)"
				} else if(s.mem < 10){
					p.stinfo.color = "rgb(255,"+(s.mem*25.5)+",0)"
				} else if(s.mem < 100){
					p.stinfo.color = "rgb(255,255,"+(s.mem*2.55)+")"
				} else if(s.mem < 1000){
					p.stinfo.color = "rgb("+(255-s.mem*0.255)+",255,"+(255-s.mem*0.255)+")"
				} else if(s.mem < 10000){
					p.stinfo.color = "rgb(0,255,"+(s.mem*0.0255)+")"
				} else if(s.mem < 100000){
					p.stinfo.color = "rgb(0,"+(255-s.mem*0.00255)+",255)"
				} else if(s.mem < 1000000){
					p.stinfo.color = "rgb("+(s.mem*0.000255)+",0,255)"
				}

			},
				"initiate":(p)=>{
					p.capsule = new nur1()
					p.capsule.maxMem = Infinity;
				}
			},
			"H04":{

				"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d<200){
					if(d < 150){
					if(d < 2){
						d = 2
					}
					op.nxadd.x += 50*dx/d/d
					op.nxadd.y += 50*dy/d/d
					}

					if(op.capsule!==undefined &&p.capsule.outToD[op.id] !== true && p.capsule.inFromD[op.id] !== true){
						if(Math.random()>0.5){
						nur1.connect(p,op)} else {
							nur1.connect(op,p)
						}
					}

				} else {
					if(p.capsule.outToD[op.id] === true){
						nur1.disconnect(p,op)
					}
					if(p.capsule.inFromD[op.id] === true){
						nur1.disconnect(op,p)
					}
				}
			},
				"eachFrame":(f,p)=>{
				let s = p.capsule
				s.mem *= 0.95
				if(s.mem < 0){
					s.mem = 0
				}
				if(s.mem < 1){
					p.stinfo.color = "rgb("+(s.mem*255)+",0,0)"
				} else if(s.mem < 10){
					p.stinfo.color = "rgb(255,"+(s.mem*25.5)+",0)"
				} else if(s.mem < 100){
					p.stinfo.color = "rgb(255,255,"+(s.mem*2.55)+")"
				} else if(s.mem < 1000){
					p.stinfo.color = "rgb("+(255-s.mem*0.255)+",255,"+(255-s.mem*0.255)+")"
				} else if(s.mem < 10000){
					p.stinfo.color = "rgb(0,255,"+(s.mem*0.0255)+")"
				} else if(s.mem < 100000){
					p.stinfo.color = "rgb(0,"+(255-s.mem*0.00255)+",255)"
				} else if(s.mem < 1000000){
					p.stinfo.color = "rgb("+(s.mem*0.000255)+",0,255)"
				}
			},
				"initiate":(p)=>{
					p.capsule = new nur1()
					p.capsule.maxMem = Infinity;
				}
			},
			"H05":{

				"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				if(d<200){
					if(d < 150){
					if(d < 2){
						d = 2
					}
					op.nxadd.x += 50*dx/d/d
					op.nxadd.y += 50*dy/d/d
					}

					if(op.capsule!==undefined &&p.capsule.outToD[op.id] !== true && p.capsule.inFromD[op.id] !== true){
						if(Math.random()>0.5){
						nur1.connect(p,op)} else {
							nur1.connect(op,p)
						}
					}

				} else {
					if(p.capsule.outToD[op.id] === true){
						nur1.disconnect(p,op)
					}
					if(p.capsule.inFromD[op.id] === true){
						nur1.disconnect(op,p)
					}
				}
			},
				"eachFrame":(f,p)=>{
				let s = p.capsule
				s.mem *= 0.95
				if(s.mem < 0){
					s.mem = 0
				}
				if(s.mem < 1){
					p.stinfo.color = "rgb("+(s.mem*255)+",0,0)"
				} else if(s.mem < 10){
					p.stinfo.color = "rgb(255,"+(s.mem*25.5)+",0)"
				} else if(s.mem < 100){
					p.stinfo.color = "rgb(255,255,"+(s.mem*2.55)+")"
				} else if(s.mem < 1000){
					p.stinfo.color = "rgb("+(255-s.mem*0.255)+",255,"+(255-s.mem*0.255)+")"
				} else if(s.mem < 10000){
					p.stinfo.color = "rgb(0,255,"+(s.mem*0.0255)+")"
				} else if(s.mem < 100000){
					p.stinfo.color = "rgb(0,"+(255-s.mem*0.00255)+",255)"
				} else if(s.mem < 1000000){
					p.stinfo.color = "rgb("+(s.mem*0.000255)+",0,255)"
				}

				if(f%120 == p.stinfo.pulseSpawn){
					p.capsule.chainRes(300,0)
				}
			},
				"initiate":(p)=>{
					p.capsule = new nur1()
					p.capsule.maxMem = Infinity;
					p.stinfo.pulseSpawn = Date.now()%120
				}
			},

			"I01":{
				"toOther":(p,op)=>{
					let d = distance(p.x,p.y,op.x,op.y)
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(d < 700){
						if(d < 300){
						if(d < 100){
						if(d < 2){
							d = 2
						}
						op.nxadd.x += 50*dx/d/d
						op.nxadd.y += 50*dy/d/d
						}

						if(op.stinfo.team !== undefined && op.stinfo.team != p.stinfo.team && p.stinfo.reload < 0 && Math.random()>0.9){
							GI.lines.push({"x":p.x,"y":p.y,"tx":op.x,"ty":op.y,"size":2,"life":30,"maxlife":30,"color":"#FFFF00"})
							p.stinfo.reload = 40 + Math.floor(Math.random()*20)
							op.life -= 200
						}
						}
					}

				},
				"eachFrame":(f,p)=>{
					p.stinfo.reload -= 1
				}
			},
			"I02":{
				"toOther":(p,op)=>{
					let d = distance(p.x,p.y,op.x,op.y)
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(d < 300){
						if(d < 100){
						if(d < 2){
							d = 2
						}
						op.nxadd.x += 50*dx/d/d
						op.nxadd.y += 50*dy/d/d
						}

						if(op.stinfo.team !== undefined && op.stinfo.team === -1){
							op.stinfo.team = p.stinfo.team
							op.stinfo.color = p.stinfo.color
						}
					}


				},
				"eachFrame":(f,p)=>{
				if(f%61 == 0 && p.stinfo.children < 20){
					p.stinfo.children += 1
					G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"I03",10,undefined,p)
					
				}
				},
				"childOnDeath":(c,p)=>{
					p.stinfo.children -= 1
				}
			},
			"I03":{
				"eachFrame":(f,p)=>{
					p.stinfo.reload -= 1
				let op1 = GI.particles[p.stinfo.following]

				if(op1 !== undefined && op1.stinfo.team != p.stinfo.team){
					let d = distance(p.x,p.y,op1.x,op1.y)
					let dx = (op1.x-p.x)
					let dy = (op1.y-p.y)
					if(d<3){
						d = 3
					}

					if(d < 260){

						if(op1.stinfo.team !== undefined && op1.stinfo.team != p.stinfo.team && p.stinfo.reload < 0 && Math.random()>0.9){
							GI.lines.push({"x":p.x,"y":p.y,"tx":op1.x,"ty":op1.y,"size":2,"life":30,"maxlife":30,"color":"#FFFF00"})
							p.stinfo.reload = 40 + Math.floor(Math.random()*20)
							op1.life -= 200
							op1.nxadd.x += 10*dx/d
							op1.nxadd.y += 10*dy/d
						}
					
					}

					if(d > 100){
					p.x += 1.5 * dx/d
					p.y += 1.5 * dy/d
					}
							GI.particlesArr.forEach((e)=>{
							

							let op = GI.particles[e]
							if(op.stinfo.team == undefined || op.stinfo.team != p.stinfo.team){return}
							let d2 = distance(p.x,p.y,op.x,op.y)

							if(d2<200){
							if(d2<3){
								d2 = 3
							}
							let dx2 = (op.x-p.x)
							let dy2 = (op.y-p.y)

							if(op.stinfo.team == p.stinfo.team){
								op.nxadd.x += 80*dx2/d2/d2
								op.nxadd.y += 80*dy2/d2/d2
							}
							}
						})


				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 1000){
					if(op.stinfo.team != p.stinfo.team && Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(op.t != "I02" && d<100){
						op.nxadd.x += 180*dx/d/d	
						op.nxadd.y += 180*dy/d/d
					}
					}
					
				})

				

			}

			},
			},
			"I04":{
				"eachFrame":(f,p)=>{
					p.stinfo.reload -= 1
				let op1 = GI.particles[p.stinfo.following]

				if(op1 !== undefined && op1.stinfo.team != p.stinfo.team){
					let d = distance(p.x,p.y,op1.x,op1.y)
					let dx = (op1.x-p.x)
					let dy = (op1.y-p.y)
					if(d<3){
						d = 3
					}

					if(d < 260){

						if(op1.stinfo.team !== undefined && op1.stinfo.team != p.stinfo.team && p.stinfo.reload < 0 && Math.random()>0.9){
							GI.lines.push({"x":p.x,"y":p.y,"tx":op1.x,"ty":op1.y,"size":2,"life":30,"maxlife":30,"color":"#FFFF00"})
							p.stinfo.reload = 10 + Math.floor(Math.random()*2)
							op1.life -= 200
							op1.nxadd.x += 10*dx/d
							op1.nxadd.y += 10*dy/d
						}
					
					}

					if(d > 100){
					p.x += 5.5 * dx/d
					p.y += 5.5 * dy/d
					}
							GI.particlesArr.forEach((e)=>{
							

							let op = GI.particles[e]
							if(op.stinfo.team == undefined || op.stinfo.team != p.stinfo.team){return}
							let d2 = distance(p.x,p.y,op.x,op.y)

							if(d2<300){
							if(d2<3){
								d2 = 3
							}
							let dx2 = (op.x-p.x)
							let dy2 = (op.y-p.y)

							if(op.stinfo.team == p.stinfo.team){
								op.nxadd.x += 80*dx2/d2/d2
								op.nxadd.y += 80*dy2/d2/d2
							}
							}
						})


				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 1000){
					if(op.stinfo.team != p.stinfo.team && Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(op.t != "I02" && d<100){
						op.nxadd.x += 180*dx/d/d	
						op.nxadd.y += 180*dy/d/d
					}
					}
					
				})

				

			}

			},
			},
			"I05":{
				"eachFrame":(f,p)=>{
					p.stinfo.reload -= 1
				let op1 = GI.particles[p.stinfo.following]

				if(op1 !== undefined && op1.stinfo.team != p.stinfo.team){
					let d = distance(p.x,p.y,op1.x,op1.y)
					let dx = (op1.x-p.x)
					let dy = (op1.y-p.y)
					if(d<3){
						d = 3
					}

					if(d < 260){

						if(op1.stinfo.team !== undefined && op1.stinfo.team != p.stinfo.team && p.stinfo.reload < 0){
							GI.lines.push({"x":p.x,"y":p.y,"tx":op1.x+Math.random()*5,"ty":op1.y+Math.random()*5,"size":2,"life":30,"maxlife":30,"color":"#FFFFFF"})
							p.stinfo.reload = Math.floor(Math.random()*10)
							op1.life -= 100
							op1.nxadd.x += 10*dx/d
							op1.nxadd.y += 10*dy/d
						}
					
					}

					if(d > 100){
					p.x += 5.5 * dx/d
					p.y += 5.5 * dy/d
					}
							GI.particlesArr.forEach((e)=>{
							

							let op = GI.particles[e]
							if(op.stinfo.team == undefined || op.stinfo.team != p.stinfo.team){return}
							let d2 = distance(p.x,p.y,op.x,op.y)

							if(d2<300){
							if(d2<3){
								d2 = 3
							}
							let dx2 = (op.x-p.x)
							let dy2 = (op.y-p.y)

							if(op.stinfo.team == p.stinfo.team){
								op.nxadd.x += 80*dx2/d2/d2
								op.nxadd.y += 80*dy2/d2/d2
							}
							}
						})


				} else {

				GI.particlesArr.forEach((e)=>{
					

					let op = GI.particles[e]
					let d = distance(p.x,p.y,op.x,op.y)

					if(d < 1000){
					if(op.stinfo.team != p.stinfo.team && Math.random()>0.9){
						p.stinfo.following = e
					}
					if(d<3){
						d = 3
					}
					let dx = (op.x-p.x)
					let dy = (op.y-p.y)
					if(op.t != "I02" && d<100){
						op.nxadd.x += 180*dx/d/d	
						op.nxadd.y += 180*dy/d/d
					}
					}
					
				})

				

			}

			},
			},
			"J01":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				// let dx = (op.x-p.x)
				// let dy = (op.y-p.y)

				// let r = 1
				if(d < 300){
					op.nxadd.y += 1
				}

			}
			
		},
		"J02":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				// let dx = (op.x-p.x)
				// let dy = (op.y-p.y)

				// let r = 1
				if(d < 300){
					op.nxadd.y -= 1
				}

			}
			
		},
		"J03":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				// let dx = (op.x-p.x)
				// let dy = (op.y-p.y)

				// let r = 1
				if(d < 300){
					op.nxadd.x -= 1
				}

			}
			
		}, 

		"J04":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				// let dx = (op.x-p.x)
				// let dy = (op.y-p.y)

				// let r = 1
				if(d < 300){
					op.nxadd.x -= 1
				}

			}
			
		}, 

		"J05":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				// let dx = (op.x-p.x)
				// let dy = (op.y-p.y)

				// let r = 1
				if(d < 300){
					op.nxadd.x += p.stinfo.pulse
				}

			},
			"eachFrame":(f,p)=>{
				p.stinfo.pulse = (f%20>10?(20-f%20):f%20)-5
			},
			
		},
		"J06":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				// let dx = (op.x-p.x)
				// let dy = (op.y-p.y)

				// let r = 1
				if(d < 300){
					op.nxadd.y += p.stinfo.pulse
				}

			},
			"eachFrame":(f,p)=>{
				p.stinfo.pulse = (f%20>10?(20-f%20):f%20)-5
			},
			
		},
		"K01":{
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

			},
			"eachFrame":(f,p)=>{
				if(f%100===p.stinfo.pulseSpawn && Math.random()>0.5){
					p.life -= 2000
				}
			},
			"initiate":(p)=>{
				p.stinfo.pulseSpawn = Math.floor(Math.random()*100)
			}
			
		},

		"K02":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				let r = 1
				if(d < 50){
					if(d<2){
						d = 2
					}
					r = 1
				}

				op.nxadd.x += 50*dx/d/d*r
				op.nxadd.y += 50*dy/d/d*r

			},
			"eachFrame":(f,p)=>{
				if(f%100===p.stinfo.pulseSpawn && Math.random()>0.5){
					p.life -= 2000
					let a = Object.keys(GI.typeDict2)
				
					for(let i = 0; i < Math.random()*10; i++){
						let R = Math.floor(Math.random()*a.length)
						G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,a[R],10)
					}
				}

				if(f%60 === 0){
					let a = Object.keys(GI.typeDict2)
					let R = Math.floor(Math.random()*a.length)
						G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,a[R],10)
				}

			},
			"initiate":(p)=>{
				p.stinfo.pulseSpawn = Math.floor(Math.random()*100)
			}
			
		},
		"K12":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				let r = 1
				if(d < 50){
					if(d<2){
						d = 2
					}
					r = 1
				}

				op.nxadd.x += 50*dx/d/d*r
				op.nxadd.y += 50*dy/d/d*r

			},
			"eachFrame":(f,p)=>{
				if(f%500===p.stinfo.pulseSpawn && Math.random()>0.5){
					p.life -= 2000
					let a = Object.keys(GI.typeDict2)
				
					for(let i = 0; i < Math.random()*10; i++){
						let R = Math.floor(Math.random()*a.length)
						G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,a[R],10)
					}
				}

				if(f%60 === 0){
					let a = Object.keys(GI.typeDict2)
					let R = Math.floor(Math.random()*a.length)
						G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,a[R],10)
				}

			},
			"initiate":(p)=>{
				p.stinfo.pulseSpawn = Math.floor(Math.random()*500)
			}
			
		},

		"K03":{
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

				op.nxadd.x += 50*dx/d/d*r
				op.nxadd.y += 50*dy/d/d*r

			},
			"eachFrame":(f,p)=>{
				if(f%100===p.stinfo.pulseSpawn && Math.random()>0.5){
					p.life -= 2000
				}
			},
			"initiate":(p)=>{
				p.stinfo.pulseSpawn = Math.floor(Math.random()*100)
			}
			
		},

		"L01":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(p.r > d+op.r){
					p.r += op.r
					G.delParticle(op)
				}

			},
			"eachFrame":(f,p)=>{
				p.r -= 0.5
				if(p.r > 100){
					p.r = 100
				}
				p.life = p.r
			},
			"initiate":(p)=>{
				p.r = 30
			}
			
		},

		"L02":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(p.r > d+op.r){
					p.r = Math.sqrt(op.r*op.r+p.r*p.r)
					G.delParticle(op)
				}

			},
			"eachFrame":(f,p)=>{
				p.r *= 0.99
				p.life = p.r-5
			},
			"initiate":(p)=>{
				p.r = 30
			}
			
		},
		"L03":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(p.r > d+op.r && (op.t !== "L03" || p.stinfo.pulse > -30)){
					p.r = Math.sqrt(op.r*op.r+p.r*p.r)
					G.delParticle(op)
				} else if(op.t==="L03"){

					if(d<1){
						d = 1/d
					}
					let rr = Math.sqrt(p.r)/1.5
					// if(p.stinfo.pulse > 0){rr*=2}
					op.nxadd.x += p.stinfo.pulse*dx/d/d*rr
					op.nxadd.y += p.stinfo.pulse*dy/d/d*rr
				}

			},
			"eachFrame":(f,p)=>{

				if(p.r > 150){
					p.r *= 0.9995
				}

				if(f%100 === 0 && p.r > 40){
					p.r = Math.sqrt(p.r*p.r/2)
					let tid = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"L03",10)
					GI.particles[tid].r = p.r
				}

				// p.r *= 0.995
				p.life = p.r-10
				p.stinfo.pulse = 50 - f%100
				if(f%400 > 350){
					p.stinfo.pulse *= 2
				}
			},
			"initiate":(p)=>{
				p.r = 40
			}
			
		},

		"L04":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)
				let rr = Math.sqrt(p.r)*2

				if(p.r +op.r> d){
					op.nxadd.x -= 5*dx/d/d*rr
					op.nxadd.y -= 5*dy/d/d*rr
				}

				if(p.r > d+op.r && (op.t !== "L04" || p.stinfo.pulse < -30)){
					p.r = Math.sqrt(op.r*op.r+p.r*p.r)
					G.delParticle(op)
				} else if(op.t==="L04"){

					if(d<10){
						d *= 5
						if(d < 1){
							d = 1/d
						}
					}
					// if(p.stinfo.pulse < 0){??}
					op.nxadd.x += p.stinfo.pulse*dx/d/d*rr
					op.nxadd.y += p.stinfo.pulse*dy/d/d*rr
				}

			},
			"eachFrame":(f,p)=>{

					p.r *= 0.9998

				if(f%100 === 0 && p.r > 40 + Math.random()*40){
					p.r = Math.sqrt(p.r*p.r/2)
					let tid = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"L04",10)
					GI.particles[tid].r = p.r
				}

				// p.r *= 0.995
				p.life = p.r-10
				p.stinfo.pulse = 50 - f%100
				if(f%300 > 250){
					p.stinfo.pulse *= 4.5
				}
			},
			"initiate":(p)=>{
				p.r = 40
			}
			
		},

		"L14":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				if(p.r > d+op.r && (op.t !== "L14" || p.stinfo.pulse < -30)){
					p.r = Math.sqrt(op.r*op.r+p.r*p.r)
					G.delParticle(op)
				} else if(op.t==="L14"){

					if(d<10){
						d *= 5
						if(d < 1){
							d = 1/d
						}
					}
					let rr = Math.sqrt(p.r)*2
					// if(p.stinfo.pulse < 0){??}
					op.nxadd.x += p.stinfo.pulse*dx/d/d*rr
					op.nxadd.y += p.stinfo.pulse*dy/d/d*rr
				}

			},
			"eachFrame":(f,p)=>{

					p.r *= 0.9998

				if(f%100 === 0 && p.r > 40 + Math.random()*40){
					p.r = Math.sqrt(p.r*p.r/2)
					let tid = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"L14",10)
					GI.particles[tid].r = p.r
				}

				// p.r *= 0.995
				p.life = p.r-10
				p.stinfo.pulse = 50 - f%100
				if(f%300 > 250){
					p.stinfo.pulse *= 4.5
				}
			},
			"initiate":(p)=>{
				p.r = 40
			}
			
		},

		"L05":{
			"toOther":(p,op)=>{
				let d = distance(p.x,p.y,op.x,op.y)
				let dx = (op.x-p.x)
				let dy = (op.y-p.y)

				
				let rr = Math.sqrt(p.r)/1.5

				if(p.r > d+op.r && (op.t !== "L05" || p.stinfo.pulse < -30)){
					p.r = Math.sqrt(op.r*op.r+p.r*p.r)
					G.delParticle(op)
				} else if(op.t==="L05"){

					if(d<1){
						d = 1/d
					}
					
					// if(p.stinfo.pulse > 0){rr*=2}
					op.nxadd.x += p.stinfo.pulse*dx/d/d*rr
					op.nxadd.y += p.stinfo.pulse*dy/d/d*rr
				}

				if(d < 50){d = 50}
				op.nxadd.x += -100*dy/d/d*rr
				op.nxadd.y += 100*dx/d/d*rr

			},
			"eachFrame":(f,p)=>{

				if(p.r > 150){
					p.r *= 0.9995
				}

				if(f%100 === 0 && p.r > 40){
					p.r = Math.sqrt(p.r*p.r/2)
					let tid = G.newParticle(p.x+Math.random()-0.5,p.y+Math.random()-0.5,"L05",10)
					GI.particles[tid].r = p.r
				}

				// p.r *= 0.995
				p.life = p.r-10
				p.stinfo.pulse = 50 - f%100
				if(f%300 > 250){
					p.stinfo.pulse *= 4
				}
			},
			"initiate":(p)=>{
				p.r = 40
			}
			
		},

		}

	static typeDict2 = {
		"F01":{"color":"#00FF00","letter":"U"},
		"F02":{"color":"#FF0000","letter":"U"},
		"F03":{"color":"#FFFF00","letter":"U"},//gridpt ST
		"F04":{"color":"#FFFFFF","letter":"U"},//cross displace INF
		"F05":{"color":"#0000FF","letter":"U"},//does nothing
		"F06":{"color":"#FF005F","letter":"U"},//gravity
		"F07":{"color":"#800000","letter":"U"},//shell ST?

		"A01":{"color":"#00FF00"},
		"A02":{"color":"#0000FF"},
		"A03":{"color":"#FF00FF"},
		"A04":{"color":"#FF0000"},
		"A05":{"color":"#FF00FF","letter":"I"},
		"A06":{"color":"#FF0000","letter":"I"},
		"A07":{"color":"#FF00FF","decay":15,"letter":"E"},//explosion
			"A17":{"color":"#EF00FF","decay":15,"letter":"E"},//explosion
			"A27":{"color":"#EF00FF","letter":"E"},//explosion
			"A37":{"color":"#AF00FF","letter":"E"},//fire explosion
			"A47":{"color":"#8F00FF","letter":"E"},//small fire explosion
			"A57":{"color":"#7F00FF","letter":"E"},//small blast explosion
			"A67":{"color":"#6F00FF","letter":"E"},//MIRV explosion
		"A08":{"color":"#a881fc"},//structured chaos bomb
		"A09":{"color":"#5000FF"},//chaos bomb

		"B01":{"color":"#808080"},//push
		"B02":{"color":"#F08080"},//shell
		"B03":{"color":"#80F080"},//wall Y
		"B04":{"color":"#8080F0"},//gravity
			"B14":{"color":"#8080F0"},//stable gravity
		"B05":{"color":"#F080F0"},//shell
		"B06":{"color":"#80F0F0"},//wall X
		"B07":{"color":"#4040FF"},//gravity
		"B08":{"color":"#C0C0C0"},//push

		"C01":{"color":"#303030","decay":5},//gravity -> B4
		"C02":{"color":"#008000","decay":10},//gravity ST -> C1
		"C03":{"color":"#FF9F00","decay":5},//shell ST -> B5

		"D01":{"color":"#280040","decay":5,"letter":"V"},//push + killer
			"D11":{"color":"#230040","decay":5,"letter":"V"},//pull + killer
			"D21":{"color":"#130040","decay":3,"letter":"V"},//pull + killer
		"D02":{"color":"#F000F0","decay":5},//virus -> B1
			"D12":{"color":"#F000F0","decay":5},//unmobing virus -> B1
		"D03":{"color":"#800080","decay":5},//virus
			"D13":{"color":"#800080","decay":5},//unmoving virus
		"D04":{"color":"#800080","decay":2,"letter":"F","following":-1},//virus, following
		"D05":{"color":"#FFC000","decay":25,"letter":"V"},//fire
			"D15":{"color":"#FFC000","decay":25,"letter":"g"},//gravity effected fire
			"D25":{"color":"#FFC000","decay":15,"letter":"g"},//gravity effected fire spark
		"D07":{"color":"#808080","letter":"F","following":-1},//catalyser, following
			"D17":{"color":"#808080","letter":"F","following":-1},//catalyser, following
			"D27":{"color":"#404040","letter":"F","following":-1},//catalyser, following, previously D05
		"D08":{"color":"#008080","letter":"F","following":-1},//catalyser, following
			"D18":{"color":"#008080","letter":"F","following":-1},//catalyser, following
			"D28":{"color":"#004040","letter":"F","following":-1},//catalyser, following, previously D06
		"D09":{"color":"#F00080","decay":2,"letter":"F","following":-1},//virus, following -> B8

		"E01":{"color":"#628000","letter":"C"},//gravity killer +> 2x B1 -> 4x B8
		"E02":{"color":"#2E230A","letter":"G"},//generator(B8) -> E1
		"E03":{"color":"#6E2300","children":0,"letter":"G"},//generator(B8,B5,B4) -> E1
		"E04":{"color":"#00A000","children":0,"letter":"G"},//generator(B3,B5,B4) -> E1
		"E05":{"color":"#00A0A0","children":0,"letter":"G"},//generator(B6,B5,B4) -> E1
		"E06":{"color":"#A000A0","children":0,"letter":"G"},//generator(A3)
		"E07":{"color":"#A00000","children":0,"letter":"G"},//generator(A4)
		"E08":{"color":"#620000","letter":"C"},//gravity killer +> A4 -> 4x A4
		"E09":{"color":"#620062","letter":"C"},//gravity killer +> A3 -> 4x A3

		"G01":{"color":"#FFFFFF","letter":"P","pulse":0},//pulsar push
		"G02":{"color":"#808080","letter":"P","pulse":0},//pulsar push
		"G03":{"color":"#F8BBD0","letter":"S","pulse":0},//phaser spin
		"G04":{"color":"#BBF8D0","letter":"P","pulse":0},//pulsar gravity

		"H01":{"color":"#605050","letter":"M"},//memory core
		"H02":{"color":"#605050","letter":"M"},//repulsive memory core
		"H03":{"color":"#000000","letter":"I"},//indicator particle
		"H04":{"color":"#000000","letter":"M"},//connector particle
		"H05":{"color":"#000000","letter":"P","pulse":0},//pulsar activation particle

		"I01":{"color":"#303030","letter":"A","team":-1,"reload":-1,"following":-1}, ///army particles
		"I02":{"color":"#306030","letter":"A","team":1,"children":0},
		"I03":{"color":"#303030","letter":"A","team":-1,"reload":-1,"following":-1},
		"I04":{"color":"#303030","letter":"A","team":-1,"reload":-1,"following":-1},
		"I05":{"color":"#303030","letter":"A","team":-1,"reload":-1,"following":-1},

		"J01":{"color":"#000088","letter":"D"}, //direction down
		"J02":{"color":"#505088","letter":"D"}, //direction up
		"J03":{"color":"#500088","letter":"D"}, //direction left
		"J04":{"color":"#005088","letter":"D"}, //direction right
		"J05":{"color":"#000088","letter":"P","pulse":0}, //phaser left right
		"J06":{"color":"#505088","letter":"P","pulse":0}, //phaser up down

		"K01":{"color":"#8080F0","letter":"H"}, //hl B4
		"K02":{"color":"#6000FF","letter":"H"}, //hl Chaos generator
			"K12":{"color":"#7000FF","letter":"H"}, //hl Chaos generator
		"K03":{"color":"#808080","letter":"H"}, //hl B8

		"L01":{"color":"#80F080","letter":"S"}, //slime
		"L02":{"color":"#90F090","letter":"S"}, //smart slime
		"L03":{"color":"#90F0C0","letter":"S","pulse":0}, //very smart slime
		"L04":{"color":"#80B080","letter":"S","pulse":0}, //high repulsion hunter random smart slime
			"L14":{"color":"#209020","letter":"S","pulse":0}, //high repulsion random smart slime
		"L05":{"color":"#00F0C0","letter":"S","pulse":0}, //spinner smart slime

	}

	static getTypeInfo(t){
		return(this.typeDict[t])
	}
	static getTypeInfo2(t){
		return(JSON.parse(JSON.stringify(this.typeDict2[t])))
	}
}




class nur1{


	static disconnect(from,to){
		let fa = from.capsule.outTo
		for(let i = fa.length-1; i>-1;i--){
			if(fa[i] == to.id){
				from.capsule.outTo.splice(i,1)
			}
		}

		let ta = from.capsule.outTo
		for(let i = ta.length-1; i>-1;i--){
			if(ta[i] == from.id){
				to.capsule.outTo.splice(i,1)
			}
		}
		delete from.capsule.outToD[to.id]
		delete to.capsule.inFromD[from.id]
		delete to.capsule.inSort[from.id]
	}

	static connect(from,to,n){
		from.capsule.outTo.push(to.id)
		to.capsule.inFrom.push(from.id)
		from.capsule.outToD[to.id] = true
		to.capsule.inFromD[from.id] = true
		to.capsule.inSort[from.id] = n===undefined?0:n
	}

	constructor(){
		this.version = 1
		this.mem = 0;
		this.inMults = [0,0,0];
		this.inAdds = [0,0,0];
		this.outLim = 10;
		this.decay = 1;
		this.outNum = 1;
		this.lastAction = {"in":[],"out":0}
		this.outTo = [];
		this.inFrom = [];

		this.outToD = {};
		this.inFromD = {};

		this.maxChain = 10;
		this.maxMem = 255;

		this.tempMem = {}

		this.inSort = {}

	}


	chainRes(i,c){
		c+=1
		this.mem += i
		if(this.mem > this.maxMem){
			this.mem = this.maxMem
		}
		let out = i * 0.8
		if(c < this.maxChain){
			this.outTo.forEach((e)=>{
				GI.particles[e].capsule.chainRes(out,c)
			})
		}
	}

	AChainRes(a,c,cmid,p){
		c+=1
		if(this.tempMem.id !== cmid){
			this.tempMem = {"id":cmid,"in":[]}
		}



		this.tempMem.in[this.inSort[p.id]].push({"p":p,"a":a})
		
		let i = 0;
		this.inMults.forEach((e,j)=>{
			if(a[j] === undefined){return;}
			i += (a[j]+this.inAdds[j])*e
		})

		let m = this.mem
		this.mem += i

		if(this.mem < 0){
			this.mem = 0
		}

		if(c < this.maxChain){ 
			if(this.outLim < this.mem && this.outLim > m){
				this.outTo.forEach((e)=>{
					GI.particles[e].capsule.AChainRes(this.outNum,c,cmid,this)
				})
			}
		}
	}

	evaluateSelf(m,a,s){
		return(this.evaluate(m,a,s,this.inAdds,this.inMults,this.outLim,this.outNum))
	}

	selfCorrectBP(a,t){
		let originalError = 0
		let originalError2 = 0
		a.forEach((e)=>{
			let b = this.evaluateSelf(e[0],e[1],e[2])
			originalError2 += b[1]
			originalError += b[0]
		})

		let aorigin = [originalError,originalError2]

		for(let i = 0; i < t; i++){
			let td = [JSON.parse(JSON.stringify(this.inAdds)),JSON.parse(JSON.stringify(this.inMults)),this.outLim,this.outNum,e[0],e[1],e[2]]
			let mut = 1
			if(Math.random() > 0.99){
				mut = Math.random() * 100
			}

			let r = Math.random()
			let BP = false
			if(Math.random()>0.7){
				BP = true
				td[Math.floor(Math.random()*3)+4] += mut*(originalError * Math.random() * 2 - originalError)
			}else 

			if(r>0.65){
				td[0][Math.floor(Math.random()*td[0].length)] += mut*(originalError * Math.random() * 2 - originalError)
			} else if(r>0.3){
				td[1][Math.floor(Math.random()*td[0].length)] += mut*(originalError * Math.random() * 2 - originalError)
			} else {
				if(Math.random()>0.5){
					td[2] += mut*(originalError * Math.random() * 2 - originalError)
				} else {
					td[3] += mut*(originalError * Math.random() * 2 - originalError)
				}
			}

			let ev = [0,0]


			a.forEach((e)=>{
			let aa = this.evaluate(td[4],td[5],td[6],td[0],td[1],td[2],td[3])
				ev[0] += aa[0]
				ev[1] += aa[1]
			})
			

			if(ev[0] < originalError){
				if(BP){

				}else{
				this.inAdds = td[0]
				this.inMults = td[1]
				this.outLim = td[2]
				this.outNum = td[3]

				originalError = ev[0]
				originalError2 = ev[1]
				}
			} else if(ev[0] == originalError && ev[1] < originalError2){
				if(BP){

				}else{
				this.inAdds = td[0]
				this.inMults = td[1]
				this.outLim = td[2]
				this.outNum = td[3]

				originalError = ev[0]
				originalError2 = ev[1]
				}
			}

		}
		return([originalError,aorigin[0],originalError2,aorigin[1]])

	}

	selfCorrect(a,t){
		let originalError = 0
		let originalError2 = 0
		a.forEach((e)=>{
			let b = this.evaluateSelf(e[0],e[1],e[2])
			originalError2 += b[1]
			originalError += b[0]
		})

		let aorigin = [originalError,originalError2]

		for(let i = 0; i < t; i++){
			let td = [JSON.parse(JSON.stringify(this.inAdds)),JSON.parse(JSON.stringify(this.inMults)),this.outLim,this.outNum]
			let mut = 1
			if(Math.random() > 0.99){
				mut = Math.random() * 100
			}

			let r = Math.random()
			if(r>0.65){
				td[0][Math.floor(Math.random()*td[0].length)] += mut*(originalError * Math.random() * 2 - originalError)
			} else if(r>0.3){
				td[1][Math.floor(Math.random()*td[0].length)] += mut*(originalError * Math.random() * 2 - originalError)
			} else {
				if(Math.random()>0.5){
					td[2] += mut*(originalError * Math.random() * 2 - originalError)
				} else {
					td[3] += mut*(originalError * Math.random() * 2 - originalError)
				}
			}

			let ev = [0,0]


			a.forEach((e)=>{
			let aa = this.evaluate(e[0],e[1],e[2],td[0],td[1],td[2],td[3])
				ev[0] += aa[0]
				ev[1] += aa[1]
			})
			

			if(ev[0] < originalError){
				this.inAdds = td[0]
				this.inMults = td[1]
				this.outLim = td[2]
				this.outNum = td[3]

				originalError = ev[0]
				originalError2 = ev[1]

			} else if(ev[0] == originalError && ev[1] < originalError2){
				this.inAdds = td[0]
				this.inMults = td[1]
				this.outLim = td[2]
				this.outNum = td[3]

				originalError = ev[0]
				originalError2 = ev[1]

			}

		}
		return([originalError,aorigin[0],originalError2,aorigin[1]])

	}

	evaluate(om,a,s,iad,imu,olm,onm){
		let aout = "none"
		let error = 0
		let er2 = 0
		let i = 0

		imu.forEach((e,j)=>{
			if(a[j] === undefined){return;}
			i += (a[j]+iad[j])*e
		})

		let omi = om+i < 0?0:om+i

		if(s == "none"){

			if(olm < omi){
				if(olm > om){
					aout = onm
					error = Math.abs(onm)
					if(GI.debugger){console.log(omi)}
					er2 = olm-omi
				}
			}

		} else {
			

			//had output
			if(olm < omi){
				if(GI.debugger){console.log("1")}
				if(olm > om){
					if(GI.debugger){console.log("2")}
					aout = onm
					error = Math.abs(s-onm)
					er2 = Math.abs(s-onm)
					
				} else {
					error = s
					if(GI.debugger){console.log(omi)}
					er2 = olm-omi
				}


				//no output
			} else {
				if(GI.debugger){console.log("4")}
				error = s
				er2 = olm-omi
			}




		}

		return([error,Math.abs(er2),aout,om+i])

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


	if(GI.typeDict2[GI.type[0]+GI.type[2]+GI.type[1]] !== undefined){
	ctx.fillStyle = "purple"} else {
		ctx.fillStyle = "red"
		GI.type[2] = 0
	}
	ctx.font = GI.barFont
	ctx.fillText(GI.type[0]+GI.type[1]+"."+GI.type[2]+"  -  Particles: "+GI.particlesArr.length+" - key: "+GI.currentKey+" - mode: "+GI.mouseModeArr[GI.mouseMode],0,40)
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
	G.drawLines()

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

	G.pgph.vPush(GI.particlesArr.length)
	G.pgph.draw()
	G.drawGrapher()

	GI.preformanceCalculate += ((ED-D)/GI.particlesArr.length)*100
	G.updateGrapher(ED-D)
	
	if(GI.frame%100 == 0){
		console.log("AVERAGE PARTICLE CALCULATION TIME: "+(GI.preformanceCalculate/100))
		GI.preformanceCalculate = 0
	}


	if(interactor.opened){
		interactor.draw()
		if(interactor.phaseSpace){
			interactor.phaseTick()
		}
	}
}







function touchHandler(event)
{

	console.log(event.type)
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        case "touchcancel":   type = "mouseup";   break;
        default:           return;
    }


    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);




    if(type !== "mouseup"){
    mouseX = event.touches[0].clientX
    mouseY = event.touches[0].clientY}


    var simulatedEvent = document.createEvent("MouseEvent");

    if(event.type == "touchend"){
       	console.log("t4")
       }

    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    if(event.type == "touchend"){
       	console.log("t5")
       }

    // if(type=="mouseup"){
    // console.log("hi")} else {
    // 	console.log(event.type)
    // }
    document.body.dispatchEvent(simulatedEvent);
    
    event.preventDefault();
}


function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
    // document.addEventListener('touchmove', function() { e.preventDefault();GI.debuggingInfo = "cancled" }, { passive:false });
}
init()










class interactor{
	static page = 1
	static pageButtons = [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],[0,1,2,3,28]]
	static pos = {"x":Width/2-175,"y":Height/2-120}
	static phaseSpace = false
	static phaseState = "none"
	static opened = true
	static phaseButton = 0
	//300*240

	static abuttons = abuttons
	static buttons = []

	static downPos = [0,0]
	static phasePos = [0,0]

	static transform = 1
	static w = 350
	static h = 240
	static pressStart = 0
	static maximized = true
	static mainBoxInfo = {
		"color":"rgba(0,0,255,0.4)"
	}

	static draw(){
		if(this.phaseState === "none" || this.phaseState === "moving"){
		ctx.fillStyle = this.mainBoxInfo.color
		ctx.fillRect(this.pos.x,this.pos.y,this.w*this.transform,this.h*this.transform)
		
		if(this.maximized){
		this.buttons.forEach((e)=>{
			ctx.fillStyle = e.color
			ctx.fillRect(this.pos.x+e.x*this.transform,this.pos.y+e.y*this.transform,e.w*this.transform,e.h*this.transform)
		})
		}
		} else {
			let e = this.buttons[this.phaseButton]
			ctx.fillStyle = e.color
			ctx.fillRect(this.pos.x+e.x*this.transform,this.pos.y+e.y*this.transform,e.w*this.transform,e.h*this.transform)
		}
	}

	static clickedOn(x,y){
		return(this.opened&&inRect(x,y,this.pos.x,this.pos.y,this.w*this.transform,this.h*this.transform))
	}

	static loadPageButtons(){
		let pb = this.pageButtons[this.page-1]
		this.buttons.forEach((e)=>{
			if(e.offLoad !== undefined){
				e.offLoad()
			}
		})
		this.buttons = []
		pb.forEach((e)=>{
			this.buttons.push(this.abuttons[e])
			if(this.abuttons[e].onLoad !== undefined){
				this.abuttons[e].onLoad()
			}
		})
	}

	static handleStart(){
		this.pressStart = Date.now()
		this.downPos = [mouseX,mouseY]
		this.phasePos = [mouseX,mouseY]
		let ret = true
		if(!this.maximized){
			this.maximized = true
			this.w = 350
			this.h = 240
			this.mainBoxInfo.color = "rgba(0,0,255,0.4)"
			return;
		}
		this.buttons.forEach((e,i)=>{
			if(inRect(mouseX,mouseY,this.pos.x+e.x*this.transform,this.pos.y+e.y*this.transform,e.w*this.transform,e.h*this.transform)){
				this.handleButton(i)
				ret = false
			}
		})
			//heldDefault
			if(ret===true){this.phaseState = "moving"}
	}

	static handleButton(n){
		this.phaseButton = n
		this.buttons[n].clicked()
	}

	static phaseTick(){
		if(this.phaseState === "moving"){
			this.pos.x += mouseX - this.phasePos[0]
			this.pos.y += mouseY - this.phasePos[1]
		} else if(this.phaseState === "movingCam"){
			GI.cam.x += (mouseX - this.downPos[0])/9*GI.zoom
			GI.cam.y += (mouseY - this.downPos[1])/9*GI.zoom
			ctx.beginPath()
			ctx.lineWidth = 3
			ctx.strokeStyle = "#5000A0"
			ctx.moveTo(this.downPos[0],this.downPos[1])
			ctx.lineTo(mouseX,mouseY)
			ctx.stroke()
		} else if(this.phaseState === "movingCamVel"){
			GI.cam.vx = (mouseX - this.downPos[0])/9*GI.zoom
			GI.cam.vy = (mouseY - this.downPos[1])/9*GI.zoom
			ctx.beginPath()
			ctx.lineWidth = 3
			ctx.strokeStyle = "#5000A0"
			ctx.moveTo(this.downPos[0],this.downPos[1])
			ctx.lineTo(mouseX,mouseY)
			ctx.stroke()
		} else if(this.phaseState === "zooming"){
			GI.cam.x += (mouseX - this.downPos[0])/9*GI.zoom
			GI.zoom *= 1+(mouseY - this.downPos[1])/5000
			ctx.beginPath()
			ctx.lineWidth = 3
			ctx.strokeStyle = "#5000A0"
			ctx.moveTo(this.downPos[0],this.downPos[1])
			ctx.lineTo(mouseX,mouseY)
			ctx.stroke()
		} else if(this.phaseState === "timeDile"){
			GI.FRATE += ((mouseY - this.downPos[1])/8000*GI.FRATE)
			if(GI.FRATE < 1){
				GI.FRATE = 1
			}
			clearInterval(_MainInterval_)
			_MainInterval_ = setInterval(()=>{repeat()},GI.FRATE)
			ctx.beginPath()
			ctx.lineWidth = 3
			ctx.strokeStyle = "#5000A0"
			ctx.moveTo(this.downPos[0],this.downPos[1])
			ctx.lineTo(mouseX,mouseY)
			ctx.stroke()

			ctx.fillText(GI.FRATE.toPrecision(4),mouseX,mouseY-50)

		} else if(this.phaseState === "padPhase"){
			let unt = this.transform*(this.buttons[this.phaseButton].w + 30)
			let uux = this.pos.x+this.transform*(this.buttons[this.phaseButton].x - 15) - unt
			let uuy = this.pos.y+this.transform*(this.buttons[this.phaseButton].y - 15) - unt
			ctx.fillStyle = "#C0C0C0"
			ctx.fillRect(uux,uuy,unt*3,unt*3)
			ctx.beginPath()
			ctx.strokeStyle = "#000000"
			ctx.lineWidth = 3
			ctx.moveTo(uux+unt,uuy)
			ctx.lineTo(uux+unt,uuy+unt*3)
			ctx.moveTo(uux+unt+unt,uuy)
			ctx.lineTo(uux+unt+unt,uuy+unt*3)

			ctx.moveTo(uux,uuy+unt)
			ctx.lineTo(uux+unt*3,uuy+unt)
			ctx.moveTo(uux,uuy+unt+unt)
			ctx.lineTo(uux+unt*3,uuy+unt*2)
			ctx.stroke()


			let mpx = Math.floor((mouseX-uux)/unt)
			let mpy = Math.floor((mouseY-uuy)/unt)
			
			if((mpx === 0 || mpx === 1 || mpx === 2 )&&(mpy === 0 || mpy === 1 || mpy === 2 )){
				ctx.fillStyle = "#008000"
				ctx.fillRect(uux+unt*mpx,uuy+unt*mpy,unt,unt)
			}
		}
		this.phasePos = [mouseX,mouseY]
	}

	static handleEnd(){

		if(this.phaseState === "moving"){
			this.pos.x += mouseX - this.phasePos[0]
			this.pos.y += mouseY - this.phasePos[1]
		} else if(this.phaseState === "padPhase"){
			let unt = this.transform*(this.buttons[this.phaseButton].w + 30)
			let uux = this.pos.x+this.transform*(this.buttons[this.phaseButton].x - 15) - unt
			let uuy = this.pos.y+this.transform*(this.buttons[this.phaseButton].y - 15) - unt


			let mpx = Math.floor((mouseX-uux)/unt)
			let mpy = Math.floor((mouseY-uuy)/unt)

			if((mpx === 0 || mpx === 1 || mpx === 2 )&&(mpy === 0 || mpy === 1 || mpy === 2 )){
				this.buttons[this.phaseButton].up(mpx+mpy*3+1)
			} else {
				this.buttons[this.phaseButton].up(0)
			}


		}

		if(Date.now()-this.pressStart < 200){
			if(this.phaseState = "movingCamVel"){
				GI.cam.vx = 0
				GI.cam.vy = 0
			}
		}


		this.phaseState = "none"
	}
}

interactor.loadPageButtons()



// function conf() {
//     return 'Are you sure you want to quit?';
// }

// window.onbeforeunload = conf;

window.onbeforeunload=()=> {
	console.log("confirm")
	alert("you")
	return "are you sure?"
}


function abd(x,y){
	return(Math.abs(x-y))
}

class p3{
	static inOuPairs = []
	static mpa = {"m":1,"p":1,"a":0}

	static interInput(x){
		let o = {"m":x*this.mpa.m,"p":Math.pow(x,this.mpa.p),"a":this.mpa.a+x}
		return(o)
	}
	static evalDiffs(){
		let o = {"tmd":0,"tpd":0,"tad":0,"t":0}
		this.inOuPairs.forEach((e)=>{
			let d = this.evalDiff(e[0],e[1])
			o.tmd += d.md
			o.tpd += d.pd
			o.tad += d.ad;
			o.t += d.t
		})
		return(o)
	}

	static evalm(v){
		let d = 0
		this.inOuPairs.forEach((e)=>{
			d += abd(e[1],e[0]*v)
		})
		return(d)
	}
	static evalp(v){
		let d = 0
		this.inOuPairs.forEach((e)=>{
			d += abd(e[1],Math.pow(e[0],v))
		})
		return(d)
	}
	static evala(v){
		let d = 0
		this.inOuPairs.forEach((e)=>{
			d += abd(e[1],e[0]+v)
		})
		return(d)
	}

	static evalDiff(x,y){
		let d = this.interInput(x)
		d.md = abd(d.m,y)
		d.pd = abd(d.p,y)
		d.ad = abd(d.a,y)
		d.t = d.md + d.pd + d.ad
		return(d)
	}
	static lfrom(){
		let d = this.evalDiffs()
		let rdt = Math.random()
		// if(rdt < d.tmd/d.t){
			if(1){
			let dm = d.tmd

			let tm = this.mpa.m + Math.random()*10-5

			let trr = this.evalm(tm)
			if(trr < dm){
				console.log("mchange:"+(dm-trr)+" and "+this.mpa.m+"->"+tm)
				this.mpa.m = tm
			}

		// } else if(rdt > 1-d.tad/d.t){
		}if(1){
			let dm = d.tpd

			let tm = this.mpa.p + Math.random()-0.5

			let trr = this.evalp(tm)
			if(trr < dm){
				console.log("pchange:"+(dm-trr)+" and "+this.mpa.p+"->"+tm)
				this.mpa.p = tm
			}
		// } else {
		}if(1){
			let dm = d.tad

			let tm = this.mpa.a + Math.random()*10-5

			let trr = this.evala(tm)
			if(trr < dm){
				console.log("achange:"+(dm-trr)+" and "+this.mpa.a+"->"+tm)
				this.mpa.a = tm
			}
		}
	}
	
}




class typeIs{

}


//mnotes LOL: E G# B C B G# E 'B


//notes: typeis() dict, Ambibuild