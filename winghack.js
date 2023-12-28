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

let allObjects = []
let toggleDraw = true
let nameDraw = false
ctx.textAlign = "center"


let bot = {"on":false,"loyal":false,"mode":"engage","compadrae":["lopAssistant"],"aiming":"closest","aimAddx":0,"aimAddy":0,"followBoundary":1200}

let whiteList = {}
let blackList = {}


let weaponColor = {
  "2":"#FFFF00",
  "4":"#FF0000",
  "8":"#000000",
  "16":"#FFFF00",
  "128":"#FF00FF",
  "256":"#FFFFFF"
}


let Counter = 0

setTimeout(()=>{
  let name = document.getElementById('nick').value
  Object.keys(window.B).forEach((a)=>{
    if(window.B[a].name == name){
      pla = a
    }
  })
},5000)

let adjust = 20
let drop = 20
let main = setInterval(()=>{


  if(Counter%500){
    if(window.B[pla] == undefined){
      pla = -1
      let name = document.getElementById('nick').value
      Object.keys(window.B).forEach((a)=>{
        if(window.B[a].name == name){
          pla = a
        }
      })
    }
  }

  if(bot.on && Counter%5==0){
    window.A.sendDirection = ()=>{}
    window.A.sendInput = ()=>{}
    bot.compadrae.forEach((e)=>{WL(e,true)})
    window.onfocus()
    if(bot.loyal){
      let loyalty = window.B[bot.loyalID]
      if(loyalty == undefined){bot.loyal = false}
      bot.loyalDist = distance(window.B[pla].x,window.B[pla].y,loyalty.x,loyalty.y)
      let orgmode = bot.mode
      if(bot.loyalDist>bot.followBoundary&&loyalty.inGame){
        bot.mode = "followLoyal"
      } else if(bot.loyalDist<500){
        if(loyalty.hover == 1){
          bot.mode = "turret"
        } else {
          bot.mode = "engage"
        }
      }

      if(bot.mode != orgmode){
        console.log("mode: "+bot.mode)
      }

    } else {
      if(bot.loyalID&&Counter%150==0){
        loyal(bot.loyalName)
      }
    }
  }
  Counter ++
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
    if(window.B[pla] == undefined||window.B[pla].inGame == false){
        setTimeout(()=>{
        clickPlay(document.getElementById('nick').value)
        },2000)
      }
objk.forEach((a,i)=>{
  let e = window.B[a]
       if(e.inGame == false){return}

    let t = tran(e.x,e.y)
      let invuln = e.isInvulnerable()

    if(last[a] == undefined){
      last[a] = {"lx":t[0],"ly":t[1],"vy":0,"vx":0}
    } else {
      last[a] = {"vx":t[0]-last[a].lx,"vy":t[1]-last[a].ly,"lx":t[0],"ly":t[1]}
    }
        if(toggleDraw){
            ctx.fillStyle = "orange"
            if(highlights[a]){ctx.fillStyle="green"}
              if(blackList[a]){ctx.fillStyle="red"}
              if(whiteList[a]){ctx.fillStyle="yellow"}
            if(a == pla){ctx.fillStyle = "yellow"}
              
            
                    

           
            
            ctx.fillRect((t[0]-7.5)*zoom-lx,(t[1]-7.5)*zoom-ly,15*zoom,15*zoom)
            if(invuln){
              ctx.fillStyle = "rgba(0,0,255,0.5)"
              ctx.fillRect((t[0]-10)*zoom-lx,(t[1]-10)*zoom-ly,20*zoom,20*zoom)
            }

            if(nameDraw || downs["w"]){
              ctx.font = "bold 17px Courier New"
              ctx.fillStyle = weaponColor[e.weapon]
              ctx.fillText(e.name,t[0]*zoom-lx,(t[1]-15)*zoom-ly,50)
            }

        }
    if(pla !== -1){
      let tdist = distance(e.x,e.y,window.B[pla].x,window.B[pla].y)
      if(a!=pla&&tdist < distclosest&&!whiteList[a]&&!invuln){
        distclosest = tdist
        closest = a
      }
    }

})

  if(toggleDraw){

    if(Counter%10 == 0){
       allObjects = Object.values(window.W)
       allObjects.forEach((e)=>{
        if(e.date == undefined){e.date = Date.now()}
       })
    }
    let dn = Date.now()
    ctx.fillStyle = "#FF00FF"
    allObjects.forEach((a)=>{
      if(a.type == 64){return}
        ctx.font = "bold 10px Courier New"
      if(a.type == 32 || a.type == 8){
        ctx.font = "bold 17px Courier New"
      } else if(a.type == 16){
        ctx.font = "bold 27px Courier New"
      }

      let t = tran(a.x,a.y+(dn-a.date)/drop)
      ctx.fillText(a.type,t[0]*zoom-lx,t[1]*zoom-ly)
    })
  }


  if(aimedAt !== -1){
    let t = tran(window.B[aimedAt].x,window.B[aimedAt].y)
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(t[0]-5-lx,t[1]-5-ly,10,10)
    if(Counter%200 && window.B[aimedAt] == undefined){
      aimedAt = -1
    }
  }
  if(closest !== -1 && toggleDraw){
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
      

    } 
  }
  if(autoFire){
      autoF(closest)
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
  if(key == "b"){
    if(bot.on){
      botoff()
    } else {boton("lopkn")}
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
let shootThreshold = 0.2
let lead = 40
let friendlyThreshold = 0.4
function autoF(c){
  aimedAt = -1
  if(window.B[pla].y > 770){return}
  let tp = [window.B[c].x-window.B[pla].x,window.B[c].y-window.B[pla].y]
  let aEnemy = ang(tp[0],-tp[1])
  let aMe = ang(mouseX-canvas.width/2,-(mouseY-canvas.height/2))
  let aGame = window.B[pla].angle%(2*Math.PI)
  if(aGame < 0){
    aGame = 2*Math.PI+aGame
  }

  let closestAng = Infinity
  let closestFriendly = Infinity
  let closestFriendlyPos = Infinity
  let closestFriendlyID = -1

  Object.keys(window.B).forEach((a)=>{
    let e = window.B[a]
    if(!e.inGame || e.isInvulnerable()){return}
    
    if(a ==pla || distP(pla,a) > minDist){return}
    let aEnemy2 = ang(window.B[a].x-window.B[pla].x,-window.B[a].y+window.B[pla].y)
  if(whiteList[a]){
      let tang2 = Math.abs(aGame-aEnemy2)
      let dst = distP(pla,a)
      if(dst < closestFriendlyPos){closestFriendlyPos = dst;closestFriendlyID = a}
      if(tang2 < closestFriendly && dst < 1400){closestFriendly = tang2}
        return
    }
    let tang = Math.abs(aMe-aEnemy2)
    if(tang < closestAng){closestAng = tang;aimedAt = a}
  })

  // console.log(tp[0])
  if(downs["x"] == true || bot.on){
    c = bot.on?(bot.aiming=="closest"?c:bot.aiming):(mouseDown?(aimedAt == -1?c:aimedAt):c)
      if(window.B[c] == undefined){bot.aiming = "closest"}
    let leadingAngle = ang(window.B[c].x+last[c].vx*lead-window.B[pla].x+bot.aimAddx,-(window.B[c].y+last[c].vy*lead-window.B[pla].y+bot.aimAddy))
      window.U.angle = Math.PI-leadingAngle
      



      if(bot.on){
        bot.aimAddx = 0
        bot.aimAddy = 0


        if(closestFriendlyPos < 300 && mode != "turret"){
          // window.U.angle += 1
          bot.aimAddx += window.B[pla].x - window.B[closestFriendlyID].x
          bot.aimAddy += window.B[pla].y - window.B[closestFriendlyID].y
        }

        if(bot.mode == "engage"){
          bot.aiming = "closest"
          window.U.hover = Math.random()>0.5?1:0
        } else if(bot.mode == "followLoyal"){
          window.U.hover = Math.random()>0.85?1:0
          bot.aiming = bot.loyalID
        } else if(bot.mode == "turret"){
          bot.aiming = "closest"
          window.U.hover = 1
        }
      }

      if(downs["d"]){
        window.U.angle = Math.PI-aMe
      }

      window.SI()
      window.SD()
    }
  if( ((Math.abs(aGame-aEnemy) < shootThreshold && distP(pla,closest) < minDist)|| closestAng < shootThreshold )&&(bot.on||downs["x"])){
    if(closestFriendly > friendlyThreshold){
      window.A?.sendShooting(1)
    } else {
      console.log("stopped")
      window.A?.sendShooting(0)
    }
  } else if(Math.abs(aGame-aEnemy) >0.3 && !mouseDown){
    window.A?.sendShooting(0)
  }
}

function distP(a,b){
  return(distance(window.B[a].x,window.B[a].y,window.B[b].x,window.B[b].y))
}


window.SD = window.A.sendDirection
window.SI = window.A.sendInput

function WL(str,c){
  let objk = Object.keys(window.B)
  objk.forEach((a,i)=>{
    let e = window.B[a]
    if(e.name == str){
      if(whiteList[a]&&!c){
        whiteList[a] = false
      } else {
        whiteList[a] = true
      }
    }
  })
}
function BL(str){
  let objk = Object.keys(window.B)
  objk.forEach((a,i)=>{
    let e = window.B[a]
    if(e.name == str){
      if(blackList[a]){
        blackList[a] = false
      } else {
        blackList[a] = true
      }
    }
  })
}





//window.A=A;window.B=B;window.U = U;window.W=W

function boton(str){
  bot.on  = true
  tranmode = 3
  window.A.sendDirection = ()=>{}
  window.A.sendInput = ()=>{}
  window.onfocus()
  lock = true
  autoFire = true
  if(str){
    loyal(str)
  }
}

function botoff(){
  bot.on = false
  window.A.sendDirection = window.SD
  window.A.sendInput = window.SI
  window.onfocus()
  mouseDown = 0
  bot.aimAddx = 0
  bot.aimAddy = 0
}

function loyal(str,str2){
  let objk = Object.keys(window.B)
  objk.forEach((a,i)=>{
    let e = window.B[a]
    if(e.name == str){
      bot.loyalName = str
      bot.loyalID = a
      bot.loyal = true
    }
  })
  bot.compadrae.push(str)
  document.getElementById('nick').value = str2?str2:"lopAssistant"
}


function name(str){document.getElementById('nick').value=str}