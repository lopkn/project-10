let canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.style.position = "absolute"
canvas.style.zIndex = 5000
canvas.style.width = Math.floor(window.innerWidth)+"px"
canvas.style.height = Math.floor(window.innerHeight)+"px"
canvas.width = window.innerWidth; canvas.height = window.innerHeight
let ctx = canvas.getContext("2d")
canvas.style.pointerEvents = "none"
let highlights = {}
// window.B = {}
let lock = false
let autoFire = false
let pla = -1
let zoom = 1
let main = setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height)

    let lx = 0
    let ly = 0
    if(lock){
      t = tran(window.B[pla].x,window.B[pla].y)
      lx = t[0]-canvas.width/2
      ly = t[1]-canvas.height/2
    }

    let objk = Object.keys(window.B)
    let closest = -1
    let distclosest = Infinity
objk.forEach((a,i)=>{
  let e = window.B[a]
  // if(i == 0){console.log(e.x,e.y)}
    ctx.fillStyle = "red"
    if(highlights[a]){ctx.fillStyle="green"}
    if(a == pla){ctx.fillStyle = "yellow"}
    let t = tran(e.x,e.y)
    if(pla !== -1){
      let tdist = distance(e.x,e.y,window.B[pla].x,window.B[pla].y)
      if(a!=pla&&tdist < distclosest){
        distclosest = tdist
        closest = a
      }
    }

    
    ctx.fillRect(t[0]-7.5*zoom-lx,t[1]-7.5*zoom-ly,15*zoom,15*zoom)
})
  if(closest !== -1){
    let t = tran(window.B[closest].x,window.B[closest].y)
    ctx.fillStyle = "rgba(255,0,255,0.5)"
    ctx.fillRect(t[0]-10-lx,t[1]-10-ly,20,20)
    if(lock){
      ctx.beginPath()
      ctx.strokeStyle = "#000000"
      ctx.moveTo(canvas.width/2,canvas.height/2)
      ctx.lineTo(canvas.width/2+3*(t[0]-lx-(canvas.width/2)),canvas.height/2+3*(t[1]-ly-(canvas.height/2)))
      ctx.stroke()

      let tranPo = [3*(t[0]-lx-(canvas.width/2)),3*(t[1]-ly-(canvas.height/2))]
      if(autoFire){
        autoF(closest)
      }

    }
    
  }
},30)
// function a1(){debugger;}
// function a2(e){window.M=e}
// function a3(){debugger;window.M.followTopPlayer()}
// function a4(e){window.B=e}
function a1(){window.B =B;window.FF=true}
let tranmode = 1
function tran(x,y){
  if(tranmode == 1){
    return([(x+5000)*canvas.width/10000*zoom,(y+1000)/2*zoom])
  } else if (tranmode == 2){
    return([(x+5000)/2*zoom,(y+1000)/2*zoom])
  } else if(tranmode == 3){
    return([(x+5000)*canvas.width/10000*zoom,(y+1000)*canvas.width/10000*zoom])
  }
}
function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
document.addEventListener("keydown",(e)=>{
  let key = e.key
  
  if(key == "q"){
        highlights = {}
     console.log("ho?")
     Object.keys(window.B).forEach((a)=>{
       let e = window.B[a]
       if(e.inGame == false){return}
       let t = tran(e.x,e.y)
       let lx = 0
       let ly = 0
       if(lock){
          let tt = tran(window.B[pla].x,window.B[pla].y)
          lx = tt[0]-canvas.width/2
          ly = tt[1]-canvas.height/2
        }
        if(distance(t[0]-lx,t[1]-ly,mouseX,mouseY)<70){
        highlights[a] = true        
        }
    })
  }
  if(key == "p"){
    let d = Infinity
    Object.keys(window.B).forEach((a)=>{
       let e = window.B[a]
       if(e.inGame == false){return}
       let t = tran(e.x,e.y)
       let td = distance(t[0],t[1],mouseX,mouseY)
        if(td < d){d = td; pla = a}
    })
  }
  if(key == "e"){
    zoom += 0.1
  }
  if(key == "r"){
    zoom -= 0.1
  }
  if(key == "["){
    lock = !lock
  }
  if(key == "1"){
    tranmode = 1
  }
  if(key == "2"){
    tranmode = 2
  }
  if(key == "3"){
    tranmode = 3
  }
  if(key == "]"){
    autoFire=!autoFire
  }
})


function resize(){
canvas.width = window.innerWidth; canvas.height = window.innerHeight
}
function ang(x,y){
    let a = Math.atan2(x,y)
    if(a < 0){a = 2*Math.PI+a}
    return(a)
}
function autoF(c){
  let tp = [window.B[c].x-window.B[pla].x,window.B[c].y-window.B[pla].y]
  let aEnemy = ang(tp[0],-tp[1])
  let aMe = ang(mouseX-canvas.width/2,mouseY-canvas.height/2)
  let aGame = window.B[pla].angle%(2*Math.PI)
  if(aGame < 0){
    aGame = 2*Math.PI+aGame
  }
  // aGame*=2
  // console.log(tp[0])
  if(Math.abs(aGame-aEnemy) < 0.1){
    window.A?.sendShooting(1)
  } else if(Math.abs(aGame-aEnemy) >0.3){
    window.A?.sendShooting(0)
  }
}

