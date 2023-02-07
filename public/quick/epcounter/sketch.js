let myCanvas = document.getElementById("myCanvas")

let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.style.zIndex = 5
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"

let ctx = myCanvas.getContext("2d")


class liner{

	constructor(x,y,type,colType,following){
		this.x = x
		this.y = y
		this.vx = 0
		this.vy = 0
		this.size = 3

		this.nvx = 0
		this.nvy = 0

		this.oldPath = []
		this.lineLife = 100
		this.actLife = 0
		this.maxActLife = 10000000
		this.counter = 0
		this.type = type
		this.colType = colType
		this.bounded = false
		this.following = false

	}


	update(){
		this.counter += 1
		let updated = false

		if(this.following || ctoggle){
		let d = distance(this.x,this.y,mouseX,mouseY)
			this.nvy -= (this.y - mouseY)/d*0.4
			this.nvx -= (this.x - mouseX)/d*0.4
		}

		if(this.type == 0){
			this.x += this.vx
			this.y += this.vy
			this.vx += Math.random()-0.5
			this.vy += Math.random()-0.5
			this.vx += this.nvx
			this.vy += this.nvy
			this.nvx = 0
			this.nvy = 0
			updated = true

		} else if(this.type == 1){
			if(this.counter%5 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0
				this.vx += (Math.random()-0.5)*5
				this.vy += (Math.random()-0.5)*5
				updated = true
				
			}
		} else if(this.type == 2){
			if(this.counter%15 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0	
				this.vx += (Math.random()-0.5)*15
				this.vy += (Math.random()-0.5)*15
				updated = true
				
			}
		} else if(this.type == 3){
			if(this.counter%15 == 0){
				this.x += this.vx
				this.y += this.vy
				this.vx += this.nvx
				this.vy += this.nvy
				this.nvx = 0
				this.nvy = 0
				this.size += 0.2
				this.vx += (Math.random()-0.5)*15
				this.vy += (Math.random()-0.5)*15
				updated = true
			}
		}


		if(this.actLife < this.maxActLife && this.bounded === false && (updated||this.counter < 20)){
			this.actLife += 1
			this.oldPath.push([this.x,this.y,this.x+this.vx,this.y+this.vy,this.lineLife])
		}


		if(this.x < 0 || this.y < 0 || this.x > Width || this.y > Height){
			this.bounded = true
		}
		
	}

	draw(){
		
		for(let i = this.oldPath.length-1; i > -1; i--){
			let e = this.oldPath[i]
			getCol(this.colType,0.7+0.3*e[4]/this.lineLife,e)
    		ctx.lineWidth = this.size
			ctx.beginPath()
			ctx.moveTo(e[0],e[1])
			ctx.lineTo(e[2],e[3])
			ctx.stroke()
			e[4] -= 2
			if(e[4] <= 0){
				this.oldPath.splice(i,1)
			}
		}
	

		if(this.oldPath.length == 0){
			return("del")
		}

	}

}

function getCol(type,l,e){
	let a = Math.random()
	switch(type){
		case 0:
    		ctx.strokeStyle = ("rgba(0,"+e[4]*3.5*(1-a)+",255,"+l+")")
			break;
		case 1:
			ctx.strokeStyle = ("rgba("+(1-a)*255+","+(a)*255+",255,"+l+")")
			break;
		case 2:
			ctx.strokeStyle = ("rgba(255,"+(1-a)*255+",255,"+l+")")
			break;
		case 3:
			if(Math.random()<0.70){
			ctx.strokeStyle = ("rgba(255,"+(a*255)+",0,"+l+")")} else {
				ctx.strokeStyle = ("rgba(235,0,0,"+l+")")
			}
			break;
		case 4:
			ctx.strokeStyle = ("rgba(0,"+(1-a)*255+",0,"+l+")")
			break;
		case 5:
			ctx.strokeStyle = ("rgba("+(1-a)*255+",255,"+(1-a)*255+","+l+")")
			break;
	}
}

var mouseX = 0
var mouseY = 0
var ctoggle = false

onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY);

	let dd = distance(0,0,e.movementX,e.movementY)
if(Math.random()>1-dd*0.005){
		let a = new liner(mouseX+Math.random()-0.5,mouseY+Math.random()-0.5,Math.floor(Math.random()*3),4+Math.floor(Math.random()*2))
		a.following = true
		parr.push(a)
		console.log("hi?")
	}
}

document.addEventListener("mousedown",()=>{
	let r = Math.random()*5
	if(Math.random()>0.9){
		r = 14
	}
	for(let i = 0; i < r; i++){
	// parr.push(new liner(mouseX,mouseY,3,1))
		if(ctoggle){
		parr.push(new liner(mouseX+Math.random()-0.5,mouseY+Math.random()-0.5,Math.floor(Math.random()*4),3))

			return
		}
	parr.push(new liner(mouseX,mouseY,Math.floor(Math.random()*4),3))

	}
})

document.addEventListener("keydown",(e)=>{
	let k = e.key
	if(k == " "){
		parr.forEach((e)=>{
			let d = distance(e.x,e.y,mouseX,mouseY)
			e.nvy -= (e.y - mouseY)/d*15
			e.nvx -= (e.x - mouseX)/d*15
		})

	} else if(k == "/"){
		ctoggle = !ctoggle
	} else{
		let r = Math.random()*5
	if(Math.random()>0.9){
		r = 14
	}
	for(let i = 0; i < r; i++){
	// parr.push(new liner(mouseX,mouseY,3,1))
		if(ctoggle){
		parr.push(new liner(mouseX+Math.random()-0.5,mouseY+Math.random()-0.5,Math.floor(Math.random()*4),3))

			return
		}
	parr.push(new liner(mouseX,mouseY,Math.floor(Math.random()*4),3))

	}
	}
})

function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}

let parr = []


let COUNTER = 0
setInterval(()=>{
	COUNTER ++
	if(COUNTER %2 ===0){
	ctx.clearRect(0,0,Width,Height)
	}
	for(let i = parr.length-1; i > -1; i--){
		let e = parr[i]
		e.update()
		if(COUNTER%2 === 0){
		if(e.draw() === "del"){
			parr.splice(i,1)
		}}
	}
	// if(ctoggle){
	// parr.forEach((e)=>{
	// 		let d = distance(e.x,e.y,mouseX,mouseY)
	// 		e.nvy -= (e.y - mouseY)/d*0.4
	// 		e.nvx -= (e.x - mouseX)/d*0.4
	// 	})}
	ctx.fillStyle = "#B00000"
	ctx.strokeStyle = "#900000"
	ctx.font = "80px Arial"
	ctx.fillText(Date.now(),Width/2-300,Height/2)
	if(Math.random()>0.99){
		parr.push(new liner(Math.random()*Width,Math.random()*Height,Math.floor(Math.random()*3),Math.floor(Math.random()*2)))
	}
})