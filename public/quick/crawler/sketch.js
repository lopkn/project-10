
let canvas=document.getElementById("myCanvas")
Width = window.innerWidth
Height = window.innerHeight
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.top = "0px"
canvas.style.position = "absolute"
canvas.style.left = "0px"
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

ctx = canvas.getContext("2d")


let mainMem = {}
class moderator{
	static reference = {}
	static id = 0
	static getId(){
		this.id += 1
		return(this.id)
	}

	static pushId(t){
		let a = this.getId()
		this.reference[a] = t
		return(a)
	}

	static delUseless(){
		let a = []
		let removals = []
		let val = Object.keys(this.reference)

		val.forEach((r)=>{
			let e = this.reference[r]

			a.forEach((E)=>{if(e === this.reference[E]){
				removals.push(r)
			}})

			a.push(r)

		})

		removals.forEach((e)=>{
			delete this.refence[e]
		})

	}

}


zoom = 1

class shell1{
	static id = 0
	static getId(){
		this.id += 1
		return(this.id)
	}
	constructor(){
		this.id = shell1.getId()
		this.parents = {}
		this.children = {}
	}
}

class link{
	constructor(fid,tid){
		this.from = fid
		this.to = tid
		this.shell = undefined
	}

}

class txt{
	static id = 0
	static getId(){
		this.id += 1
		return(this.id)
	}
	constructor(s,x,y,col,shell){
		this.referenced = false
		this.referenceNo = undefined
		this.s = s
		this.links = []
		this.linksFrom = []

		// this.shell = shell===undefined?s:shell

		if(shell === undefined){
			this.shell = {}
			// this.shell[s] = {}
		} else {
			this.shell = shell
		}

		let div = document.createElement("div")
		div.id = txt.getId()
		div.innerHTML = s
		div.style.top = Math.floor(y)+"px"
		div.style.left = Math.floor(x)+"px"
		div.style.color = col?col:"white"
		div.style.position = "absolute"
		div.style.font = "20px Arial"
		div.draggable = true
		div.onclick = (e)=>{
			this.clicked(e)
		}


		div.onmousedown = (e)=>{
			this.down(e)
		}

		div.onmouseup = (e)=>{
			this.up(e)
		}

		
		div.ondragend = (e)=>{
			e.preventDefault()
			this.dragEnd(e)
		}
		div.ondragstart = (e)=>{
			this.dragStart(e)
		}
		document.body.appendChild(div)
		this.id = div.id
		this.div = div
		this.x = x
		this.y = y
		this.lastMouseButton = 0
	}

	del(){
		this.div.remove()
	}

	move(x,y){
		this.x = x
		this.y = y
		this.div.style.top = Math.floor(y/zoom)+"px"
		this.div.style.left = Math.floor(x/zoom)+"px"
	}
	moveBy(x,y){
		this.x -= -x
		this.y -= -y
		this.move(this.x,this.y)
	}

	down(e){
		this.lastMouseButton = e.button
		if(e.button == 2){
			dragLining = this.id
			dragLine = [e.clientX,e.clientY]
		} else {
			dragLining = false
		}
		divclicked = true
	}

	clicked(e){
		console.log('hi')
	}
	dragStart(e){
		this.dragStartX = e.clientX
		this.dragStartY = e.clientY
	}
	dragEnd(e){
		let x = e.clientX - this.dragStartX
		let y = e.clientY - this.dragStartY
		if(dragBody){

			this.moveLinks(x,y,{})
		} else {
		this.moveBy(x,y)

		}
	}

	moveLinks(x,y,ids){
		if(ids[this.id]){return}
			ids[this.id] = true
			this.moveBy(x,y)
		this.links.forEach((e)=>{
			texts[e.from].moveLinks(x,y,ids)
		})
	}

	up(e){
		if(dragLining === false){
			return
		}
		if(dragLining == this.id){
			this.rightClicked(e)
		} else {
			// this.links.push(dragLining)
			// texts[dragLining].linksFrom.push(this.id)
			// console.log("huh??")
			this.link(dragLining)
		}
		console.log(dragLining)

	}

	link(l){

		let newLink = new link(this.id,l)

		this.linksFrom.push(newLink)
		texts[l].links.push(newLink)
		// if(typeof(texts[l].shell) === "string"){
		// 	texts[l].shell = {}
		// 	texts[l].shell[this.s] = this.shell
		// }else{
			texts[l].shell[this.s] = this.shell
			if(this.referenced === false){
				let a = moderator.pushId(this.shell)
			console.log("new shell: "+a + " - "+ this.s)
			this.referenced = true
			this.referenceNo = a
			}
		// }
	}


	shellUpdate(type,info){

	}


	rightClicked(e){
		// read(this.shell)
		rmenu.aopen(e.clientX+20,e.clientY-80,this)
	}

	rightClicked2(sw){
		switch(sw){
		case 0:
			derive1(this.shell)
			break;
		case 1:
			read(this.shell)
			break;
		case 2:
			let a = derive1(this.shell)
			console.log(a[0])
			break;
		}
	}
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('mouseup',(e)=>{
    divclicked = false
	dragLining = false
})

let divclicked = false
let inputting;

myCanvas.addEventListener('mousedown',(e)=>{
	if(divclicked){return}

		e.preventDefault()
		if(e.button == 0){
			inputHere("new")
		}
})

function inputHere(e){
	document.getElementById('input').style.visibility = "visible"
	document.getElementById('input').style.left = Math.floor(mouseX) + "px"
	document.getElementById('input').style.top = Math.floor(mouseY) + "px"
	document.getElementById('input').x = mouseX
	document.getElementById('input').y = mouseY
	inputting = e
	document.getElementById('input').focus();
}


dragBody = false

document.addEventListener('dragover',(e)=>{e.preventDefault()})

document.addEventListener('keydown',(e)=>{
	if(e.key == "Enter" && document.activeElement.id == "input"){
		document.getElementById('input').blur()
		document.getElementById('input').style.visibility = "hidden"
		textUp(document.getElementById('input'))
		document.getElementById('input').value = ""
	}
	if(e.key == "b"){
		dragBody = !dragBody
	}
})


function textUp(e){
	console.log(e.value)
	if(inputting == "new" && e.value != ""){

		if(e.value[0] === ":"){

			let split = e.value.split("/")

			let num = parseInt(split[0].substring(1))

			let t = new txt(split[1],e.x,e.y,"red",moderator.reference[num])
			t.referenced = true
			texts[t.id] = t
			return;
		} else if(e.value == "/IS" || e.value == "/is"){
			let t = new txt(":IS:",e.x,e.y,"green")
			texts[t.id] = t
			return;
		} else if(e.value == "/T"){
			let t = new txt(":TRUE:",e.x,e.y,"green")
			texts[t.id] = t
			return;
		} else if(e.value == "/F"){
			let t = new txt(":FALSE:",e.x,e.y,"green")
			texts[t.id] = t
			return;
		} else if(e.value == "/RM"){
			read(mainMem)
			return;
		}

		let t = new txt(e.value,e.x,e.y)
		texts[t.id] = t
	}
}



let texts = {}

lines = []
let dragLining = false
let dragLine = [0,0]

setInterval(()=>{
	ctx.clearRect(0,0,Width,Height)
	lines.forEach((e)=>{
		ctx.strokeStyle = "purple"
		ctx.lineWidth = 3
		ctx.beginPath()
		ctx.moveTo(e[0],e[1])
		ctx.lineTo(e[2],e[3])
		ctx.stroke()
	})

	let tarr = Object.values(texts)
	tarr.forEach((e)=>{

		// e.links.forEach((E)=>{
		// 	ctx.strokeStyle = "purple"
		// 	ctx.lineWidth = 3
		// 	ctx.beginPath()
		// 	if(texts[E] == undefined && Math.random()>0.95){
		// 		console.log(E)
		// 	}
		// 	ctx.moveTo(texts[E].x/zoom,(texts[E].y+10)/zoom)
		// 	ctx.lineTo(e.x/zoom,(e.y+10)/zoom)
		// 	ctx.stroke()
		// })

		e.links.forEach((E)=>{
			myLine(E.from,E.to,"purple",3)
		})

	})

	if(dragLining){
	ctx.strokeStyle = "blue"
		ctx.lineWidth = 3
		ctx.beginPath()
		ctx.moveTo(dragLine[0],dragLine[1])
		ctx.lineTo(mouseX,mouseY)
		ctx.stroke()
	}

})


class rmenu{
	static open = false
	static choises = {}

	// static toggle(){
	// 	this.open = !this.open
	// 	if(this.open){
	// 		this.aopen()
	// 	} else {
	// 		this.aclose()
	// 	}
	// }

	static aopen(x,y,t){
		this.open = true
		this.move(x,y)
		this.c.style.visibility = "visible"
		document.addEventListener("mousedown",(e)=>{this.openClick(e,t)},{once:true})
	}

	static aclose(){
		this.open = false
		this.c.style.visibility = "hidden"

	}

	static create(x,y,w,h){
		let c = document.createElement('canvas')
		c.width = w
		c.height = h
		this.w = w
		this.h = h
		this.x = x
		this.y = y
		c.style.top = y
		c.style.left = x
		c.style.position = "absolute"
		c.id = "rmenu"
		c.style.visibility = "hidden"
		c.style.zIndex = "16"



		document.body.appendChild(c)
		this.c = c
		this.ctx = document.getElementById("rmenu").getContext("2d")
		return(this)
	}

	static move(x,y){
		this.x = x
		this.y = y
		this.c.style.top = Math.floor(y)+"px"
		this.c.style.left = Math.floor(x)+"px"
		return(this)
	}

	static draw(){
		this.ctx.fillStyle = "#A0A0A0"
		this.ctx.fillRect(0,0,this.w,this.h)

		for(let a = 0; a < this.w; a+=40){
			this.ctx.strokeStyle = "#000000"
			this.ctx.lineWidth = 3
			this.ctx.beginPath()
			this.ctx.moveTo(this.x+a,this.y)
			this.ctx.lineTo(this.x+a,this.y+this.h)
			this.ctx.stroke()
		}
		for(let b = 0; b < this.h; b+=40){
			this.ctx.strokeStyle = "#000000"
			this.ctx.lineWidth = 3
			this.ctx.beginPath()
			this.ctx.moveTo(this.x,this.y+b)
			this.ctx.lineTo(this.x+this.w,this.y+b)
			this.ctx.stroke()
		}

		this.ctx.fillStyle = "#00FF00"
		this.ctx.fillRect(this.x,this.y,40,40)


		return(this)
	}

	static openClick(e,t){
		if(e.clientX > this.x && e.clientY > this.y && e.clientX < this.x+this.w && e.clientY < this.y+this.h){
			this.down(e,t)
		}

		this.aclose()

	}

	static down(e,t){
		let ax = e.clientX - this.x
		let ay = e.clientY - this.y

		let boxId = Math.floor(ax/40)+6*Math.floor(ay/40)
		console.log(boxId)
		t.rightClicked2(boxId)
	}


}
rmenu.create(0,0,240,320).draw()


function myLine(id,id2,col,size){
		ctx.strokeStyle = col
		ctx.lineWidth = size
		ctx.beginPath()
		ctx.moveTo(texts[id].x/zoom,(texts[id].y)/zoom+10)
		ctx.lineTo(texts[id2].x/zoom,(texts[id2].y)/zoom+10)
		ctx.stroke()
}


function clearAll(){
	let tarr = Object.values(texts)
	tarr.forEach((e)=>{
		e.del()
	})
	tarr = {}
	texts = {}
}

function read(json,inVal,depth,repeating,x,y){
	if(repeating === undefined){
	clearAll()
	depth = depth?depth+5:10
	inVal = inVal==undefined?"main JSON":inVal
	let t = new txt(inVal,Width/2,Height/2,"cyan",json)
	texts[t.id] = t
	let tarr = Object.keys(json)
	tarr.forEach((e)=>{
		let a = read(json[e],e,depth-1,[json],Width/2,Height/2)
		texts[a].link(t.id)
	})
	return;

	}
	let col = "white"
	// if(json === repeating){
	// 	console.log("hey")
	// 	depth = -10
	// 	col = "pink"
	// }

	repeating.forEach((e)=>{if(json===e){
		depth = -10
		col = "#FF00FF"
	}})
	repeating.push(json)

	let t = new txt(inVal,x+Math.random()*20*depth-10*depth,y+Math.random()*20*depth-10*depth,col,json)
	texts[t.id] = t
	if(depth > 5){

		if(json.constructor == Object){
		let tarr = Object.keys(json)
		tarr.forEach((e)=>{
			let a = read(json[e],e,depth-1,repeating,t.x,t.y)
			texts[a].link(t.id)
		})
		} else {
			let a;
			if(typeof(json) == "string"){
				a = new txt(json,x+Math.random()*20*depth-10*depth,y+Math.random()*20*depth-10*depth)
			} else {
				a = new txt(JSON.stringify(json),x+Math.random()*20*depth-10*depth,y+Math.random()*20*depth-10*depth)
			}
			texts[a.id] = a
			texts[a.id].link(t.id)
		}
	}
	repeating.pop()
	return(t.id)

}


function moveAll(){
	let oarr = Object.values(texts)
	oarr.forEach((e)=>{
		e.moveBy(0,0)
	})
}



// function out(id, repeating){
// 	id = id?id:1
// 	if(repeating){

// 	} else {
// 		let json = {}
// 		texts[id].linksFrom.forEach((e)=>{
// 			json[texts[e]] = 
// 		})
// 	}

// }



function decomp(json,depth,S,sent){

	if(S === undefined){S = ""}
	if(sent === undefined){sent = 1}

	if(depth > 0){

		if(json["dxp_"] !== undefined){
			depth -= json["dxp_"]
		} else {
			depth -= 0.5
		}

		let k = Object.keys(json)
		if(k.length > 0){

			if(k[0][0] == ":"){
				sent -= 1
				if(sent <= 0){
					return(S)
				}
			}

		S += " " + k[0]
		S = decomper(json[k[0]],depth,S,sent)
		} else {
			depth = -20
		}

	}

	return(S)

}


function decomp2(json,depth,values){

}


function derive1(json){

	if(json[":IS:"] !== undefined){

	}
	let ret = [[],[]]
	let key1 = Object.keys(json)
	key1.forEach((e)=>{
		if(e[0] == "-"){
			// console.log("is "+e)
			ret[0].push("is "+e)
		} else {
			// console.log("is a set that contains "+e)
			ret[0].push("is a set that contains "+e)
			ret[1].push(json[e])
		}
	})
	return(ret)

}
function derive2(json,depth){

	if(json[":IS:"] !== undefined){

	}
	let ret = [[],[],[],[]]
	let ret2 = {"is":[],'can':[],"contains":[]}
	let key1 = Object.keys(json)
	key1.forEach((e)=>{
		if(e[0] == "-"){
			// console.log("is "+e)
			// ret[0].push("is "+e)
			// ret[1].push(e)
			ret2.is.push(e)
		} else {
			// console.log("is a set that contains "+e)
			ret[2].push("is a set that contains "+e)
			ret[3].push(json[e])
			ret2.contains.push()

			if(depth > 0){
				let a = derive2(json[e],depth-1)

			}

		}
	})
	return(ret)

}

// // your life cycle
// while($you.isAlive)
// {	
// 	$you.encoding;	
// 	$you.friend with me;
// }	
//-hugo







let t = new txt("MainMem",Width/2,Height/2,"cyan",mainMem)
texts[t.id] = t

let rt = new txt("RAM",Width/2-30,Height/2-20)
texts[rt.id] = rt
rt.link(t.id)
rt = new txt("long term",Width/2+30,Height/2-40)
texts[rt.id] = rt
rt.link(t.id)

moderator.reference[0] = mainMem
