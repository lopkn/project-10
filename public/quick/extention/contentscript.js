
window.canvas2 = document.createElement("canvas")
document.body.appendChild(canvas2)
canvas2.style.position = "fixed"
canvas2.style.zIndex = -5000
canvas2.style.width = Math.floor(window.innerWidth)+"px"
canvas2.style.height = Math.floor(window.innerHeight)+"px"
canvas2.width = window.innerWidth; canvas2.height = window.innerHeight
canvas2.id = "c2"
canvas2.style.overflow = "hidden"
window.Width = canvas2.width
window.Height = canvas2.height

ctx = canvas2.getContext("2d")
ctx.fillRect(0,0,Width,Height)

ctx.clearRect(0,0,Width,Height)
let blocked = 0
let ON = false

document.addEventListener("keydown",(e)=>{
	let k = e.key
	if(k == "l"){
		if(ON){
			canvas2.style.zIndex = -5000
			ctx.clearRect(0,0,Width,Height)
			ON = false
			blocked = 0
		} else {
			ON = true
			canvas2.style.zIndex = 5000
			ctx.fillStyle = "rgba(255,0,255,0.5)"
			// ctx.fillRect(0,0,50,50)
			ctx.font = "bold 17px Courier New"
			ctx.fillText("Leo's inputLock - inputs blocked: "+blocked,0,20)
		}
	} else if(ON){
		e.preventDefault()
	e.stopPropagation()
	blocked++
	}
})

canvas2.addEventListener("mousedown",(e)=>{
	e.preventDefault()
	e.stopPropagation()
	console.log("prevented")
	blocked++
})

canvas2.addEventListener("contextmenu",(e)=>{
	e.preventDefault()
	e.stopPropagation()
	console.log("prevented")
	blocked++
})

canvas2.addEventListener("scroll",(e)=>{
	e.preventDefault()
	e.stopPropagation()
	console.log("prevented")
	blocked++
})
canvas2.addEventListener("wheel",(e)=>{
	e.preventDefault()
	e.stopPropagation()
	console.log("prevented")
})
canvas2.addEventListener("mouseover",(e)=>{
	e.stopPropagation()
})