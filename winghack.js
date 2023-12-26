let canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.style.position = "absolute"
canvas.style.zIndex = 5000
canvas.style.width = Math.floor(window.innerWidth)+"px"
canvas.style.height = Math.floor(window.innerHeight)+"px"
canvas.width = window.innerWidth; canvas.height = window.innerHeight
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}
let priorityTargetMode = false
let ctx = canvas.getContext("2d")
canvas.style.pointerEvents = "none"
let highlights = {}
// window.B = {}
let lock = false
let autoFire = false
let pla = -1
let zoom = 1
let last = {}
let closest = -1;
let aimedAt = -1;

let adjust = 20

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
    closest = -1
    let distclosest = Infinity
objk.forEach((a,i)=>{
  let e = window.B[a]
       if(e.inGame == false){return}

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

    if(last[a] == undefined){
      last[a] = {"lx":t[0],"ly":t[1],"vy":0,"vx":0}
    } else {
      last[a] = {"vx":t[0]-last[a].lx,"vy":t[1]-last[a].ly,"lx":t[0],"ly":t[1]}
    }
    
    ctx.fillRect(t[0]-7.5*zoom-lx,t[1]-7.5*zoom-ly,15*zoom,15*zoom)
})
  if(aimedAt !== -1){
    let t = tran(window.B[aimedAt].x,window.B[aimedAt].y)
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(t[0]-5-lx,t[1]-5-ly,10,10)
  }
  if(closest !== -1){
    let t = tran(window.B[closest].x,window.B[closest].y)
    ctx.fillStyle = "rgba(255,0,255,0.5)"
    ctx.fillRect(t[0]-10-lx,t[1]-10-ly,20,20)
    if(lock){
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = "#000000"
      ctx.moveTo(canvas.width/2,canvas.height/2)
      ctx.lineTo(canvas.width/2+3*(t[0]-lx-(canvas.width/2)),canvas.height/2+3*(t[1]-ly-(canvas.height/2)))
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = "#00FF00"
      ctx.moveTo(t[0]-lx,t[1]-ly)
      ctx.lineTo(last[closest].vx*adjust  + t[0]-lx,last[closest].vy*adjust  +t[1]-ly)
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
let downs = {}
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
  if(key == "z"){
    priorityTargetMode = !priorityTargetMode
  }
  if(key == "x" && downs[key] == false){
    window.A.sendDirection = ()=>{}
    window.A.sendInput = ()=>{}
  }
  downs[e.key] = true
})
document.addEventListener("keyup",(e)=>{
  if(e.key == "x"){
    window.A.sendDirection = window.SD
    window.A.sendInput = window.SI
  }
  downs[e.key] = false
})

function resize(){
canvas.width = window.innerWidth; canvas.height = window.innerHeight
}
function ang(x,y){
    let a = Math.atan2(x,y)
    if(a < 0){a = 2*Math.PI+a}
    return(a)
}

function getAng(p){
  return(ang(window.B[p].x-window.B[pla].x,-window.B[p].y+window.B[pla].y))
}


let minDist = 2000
let shootThreshold = 0.1
let lead = 40
function autoF(c){
  aimedAt = -1
  let tp = [window.B[c].x-window.B[pla].x,window.B[c].y-window.B[pla].y]
  let aEnemy = ang(tp[0],-tp[1])
  let aMe = ang(mouseX-canvas.width/2,-(mouseY-canvas.height/2))
  let aGame = window.B[pla].angle%(2*Math.PI)
  if(aGame < 0){
    aGame = 2*Math.PI+aGame
  }

  let closestAng = Infinity
  Object.keys(window.B).forEach((a)=>{
    let e = window.B[a]
    if(!e.inGame){return}
    if(a ==pla || distP(pla,a) > minDist){return}
    let aEnemy2 = ang(window.B[a].x-window.B[pla].x,-window.B[a].y+window.B[pla].y)
    let tang = Math.abs(aMe-aEnemy2)
    if(tang < closestAng){closestAng = tang;aimedAt = a}
  })

  // console.log(tp[0])
  if(downs["x"] == true){
    c = mouseDown?(aimedAt == -1?c:aimedAt):c
    let leadingAngle = ang(window.B[c].x+last[c].vx*lead-window.B[pla].x,-(window.B[c].y+last[c].vy*lead-window.B[pla].y))
      window.U.angle = Math.PI-leadingAngle
      console.log(window.U.angle)
      window.SI()
      window.SD()
    }
  if( ((Math.abs(aGame-aEnemy) < shootThreshold && distP(pla,closest) < minDist)|| closestAng < shootThreshold )&&downs["x"]){
    window.A?.sendShooting(1)
  } else if(Math.abs(aGame-aEnemy) >0.3 && !mouseDown){
    window.A?.sendShooting(0)
  }
}

function distP(a,b){
  return(distance(window.B[a].x,window.B[a].y,window.B[b].x,window.B[b].y))
}


window.SD = window.A.sendDirection
window.SI = window.A.sendInput