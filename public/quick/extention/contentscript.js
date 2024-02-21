console.log('started')
window.canvas2 = document.createElement("canvas")
document.body.appendChild(canvas2)
canvas2.style.position = "fixed"
canvas2.style.zIndex = -5000
canvas2.style.width = Math.floor(window.innerWidth)+"px"
canvas2.style.height = Math.floor(window.innerHeight)+"px"
canvas2.width = window.innerWidth; canvas2.height = window.innerHeight
canvas2.id = "c2"
canvas2.style.overflow = "hidden"
canvas2.style.top = "0px"
canvas2.style.left = "0px"
window.Width = canvas2.width
window.Height = canvas2.height

var maxZ = 2147483646

ctx = canvas2.getContext("2d")
ctx.fillRect(0,0,Width,Height)

ctx.clearRect(0,0,Width,Height)
var blocked = 0
var ON = false
var paused

document.addEventListener("keydown",(e)=>{
	let k = e.key
	if((k=="p" || k == "l")&& e.ctrlKey){
		if(ON){
			canvas2.style.zIndex = -5000
			ctx.clearRect(0,0,Width,Height)
			ON = false
			blocked = 0
		} else {
			ON = true
			canvas2.style.zIndex = maxZ
			ctx.fillStyle = "rgba(255,0,255,0.5)"
			// ctx.fillRect(0,0,50,50)
			ctx.font = "bold 17px Courier New"
			ctx.fillText("Leo's inputLock",0,20)
		}

		if(k == "p"&& e.ctrlKey){
		bosskey()
		}
	}
	 else if(ON){
		e.preventDefault()
	e.stopPropagation()
	blocked++
	}
})

function bosskey(){
	paused = !paused
    if(paused){
    let timg = document.createElement("img")
    timg.src = "https://game-10.lopkn.unsown.top/images/noInt2.png"
    timg.style.position = "fixed"
    //2704,1320
    timg.style.top="0px"
    timg.style.left="0px"
    let scale = 1

    if(1/(2704/Width) < scale){
      scale = 1/(2704/Width)
    }
    if(1/(1320/Height) < scale){
      scale = 1/(1320/Height)
    }


    timg.style.height = Math.floor(1320*scale)+"px"
    timg.style.width = Math.floor(2704*scale)+"px"
    timg.style.boarder = 0

    timg.style.zIndex = maxZ
    timg.id = "timg"
    document.body.appendChild(timg)

    ctx.fillStyle = "#232323"
    ctx.fillRect(0,0,Width,Height)
  } else {
      document.getElementById("timg").remove()
      ctx.clearRect(0,0,Width,Height)
    }

}

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