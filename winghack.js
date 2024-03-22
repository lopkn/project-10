window.A=A;window.B=B;window.U = U;window.W=W;window.N=N;
(function(){
    window.canvas2 = document.createElement("canvas")
document.body.appendChild(canvas2)
canvas2.style.position = "absolute"
canvas2.style.zIndex = 5000
canvas2.style.width = Math.floor(window.innerWidth)+"px"
canvas2.style.height = Math.floor(window.innerHeight)+"px"
canvas2.width = window.innerWidth; canvas2.height = window.innerHeight
window.mouseDown = false;
window.Width = canvas2.width
window.Height = canvas2.height
document.body.onmousedown = function(e) {
  if(e.which == 1){
    mouseDown = true;
  } else if(e.which == 2){
          if(focusedOn == -1){
        focusedOn = focusSave
      } else {
        focusSave = focusedOn
        focusedOn = -1
      }
  }  else if(e.which == 3){
    if(downs["x"] == false){
    window.A.sendDirection = ()=>{}
    window.A.sendInput = ()=>{}
    downs['x'] = true
    }
  }
}
document.body.onmouseup = function(e) {
  if(e.which == 1){
    mouseDown = false;
  } else if(e.which == 3){
    window.A.sendDirection = window.SD
    window.A.sendInput = window.SI
    downs["x"] = false
  }
  e.preventDefault()
}
window.priorityTargetMode = false
window.ctx = canvas2.getContext("2d")
canvas2.style.pointerEvents = "none"
window.highlights = {}

window.boostRadarLast = Date.now()
window.miss = "UDF"

window.dodgeFactor = 40000
window.lock = false
window.autoFire = false
window.pla = -1
window.zoom = 1
window.last = {}
window.closest = -1;
window.aimedAt = -1;
window.projectiles = []
window.dodgeThreshold = 150

window.boostRadar = []

window.autoDowns = false
window.downFrequency = 200
window.throttleShift = true
window.throttleShiftPercentage = 0

window.allObjects = []
window.toggleDraw = true
window.nameDraw = false
ctx.textAlign = "center"
window.bot = {"destinationRadius":20,"on":false,"loyal":false,"mode":"engage","compadrae":["lopAssist"],
"aiming":"closest","aimAddx":0,"aimAddy":0,"followBoundary":1200,
"dodgeX":0,"dodgeY":0,"permAimY":0
}

window.resortPlayer = {"update":(a)=>{},"isInvulnerable":()=>{return(false)},"highlightValue":0,"lastUpdate":1704172062897,"id":1,"x":0,"y":0,"prevX":1,"prevY":1,"origX":-37.09577560424805,"origY":52.94370174407959,"dstX":-2.211310863494873,"dstY":52.387943267822266,"energy":255,"inGame":true,"updateBool":true,"colorHue":0,"speed":11.629630488697506,"momentum":0,"maxMomentum":8,"angle":7.838051719665527,"origAngle":7.838051795959473,"dstAngle":7.8380513191223145,"controlAngle":360,"rotSpeed":4,"directionX":0,"directionY":-1,"targetX":0,"targetY":0,"targetMomentum":8,"name":"cornhol.io","first_set":false,"rank":3,"score":165,"frameSwitchTime":40,"timeToNextFrame":40,"flameState":true,"flipLastImage":-1,"planeImages":[{"x":0,"y":0,"width":35,"height":12},{"x":0,"y":0,"width":35,"height":11},{"x":0,"y":0,"width":35,"height":13},{"x":0,"y":0,"width":35,"height":16},{"x":0,"y":0,"width":35,"height":18},{"x":0,"y":0,"width":35,"height":19},{"x":0,"y":0,"width":35,"height":20},{"x":0,"y":0,"width":35,"height":22}],"planeImagesReflex":[{"x":0,"y":0,"width":35,"height":12,"canvas":{}},{"x":0,"y":0,"width":35,"height":11,"canvas":{}},{"x":0,"y":0,"width":35,"height":13,"canvas":{}},{"x":0,"y":0,"width":35,"height":16,"canvas":{}},{"x":0,"y":0,"width":35,"height":18,"canvas":{}},{"x":0,"y":0,"width":35,"height":19,"canvas":{}},{"x":0,"y":0,"width":35,"height":20,"canvas":{}},{"x":0,"y":0,"width":35,"height":22,"canvas":{}}],"colorID":5,"decalID":1,"hover":0,"hadHover":true,"isBot":0,"isShooting":2048,"weapon":4,"ammo":8,"laserTimer":0,"laserFrame":0,"decalFrames":[{"x":0,"y":0,"width":31,"height":8,"canvas":{}},{"x":0,"y":0,"width":32,"height":9,"canvas":{}},{"x":0,"y":0,"width":31,"height":8,"canvas":{}},{"x":0,"y":0,"width":32,"height":13,"canvas":{}},{"x":0,"y":0,"width":30,"height":15,"canvas":{}},{"x":0,"y":0,"width":25,"height":18,"canvas":{}},{"x":0,"y":0,"width":32,"height":19,"canvas":{}},{"x":0,"y":0,"width":33,"height":19,"canvas":{}}],"showName":true,"lastImage":{"x":0,"y":0,"width":35,"height":12},"lastImageReflex":{"x":0,"y":0,"width":35,"height":12,"canvas":{}}}

window.whiteList = {}
window.blackList = {}
window.normVector = [0,-1]

window.boostPath = []
window.autoThresh = true

window.weaponColor = {
  "1":"#707070",
  "2":"#FF7F00",
  "4":"#FF0000",
  "8":"#000000",
  "16":"#FFFF00",
  "128":"#FF00FF",
  "256":"#FFFFFF"
}
window.weaponPreset = {
  "1":()=>{
    lead = 32;
    Dlead = 1;
    Alead = 200
    shootThreshold = 0.3
    window.minDist = 700
  },
  "2":()=>{
    lead = 32;
    Dlead = 1;
    Alead = 31
    shootThreshold = 0.5
    window.minDist = 700
  },
  "4":()=>{
    lead = 90;
    Alead = 5;
    Dlead = 3.3;
    shootThreshold = 0.2
    window.minDist = 1200
  },
  "8":()=>{
    lead = 31;
    Alead = 130;
    Dlead = 0;
    shootThreshold = 0.1;
    window.minDist = 1200
  },
  "16":()=>{
    lead = 31;
    Dlead = 0;
    Alead = 160;
    shootThreshold = 0.2
    window.minDist = 1200
  },
  "128":()=>{
    lead = 50;
    Alead = 30;
    Dlead = 2
    shootThreshold = 0.2;
    window.minDist = 500
  },
  "256":()=>{
    lead = 40;
    shootThreshold = 30
    window.minDist = 99999
  }
}
window.autoDodge = false
window.Counter = 0
window.adjust = 6
window.drop = 20
window.aname = "lopknA65"
window.minDist = 1200
window.shootThreshold = 0.2
window.tranmode = 1
window.lead = 31
window.Alead = 40
window.Dlead = 0
window.friendlyThreshold = 0.4
window.mouseX = 0
window.mouseY = 0
window.onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
window.downs = {}
window.engageSpeed = 0.5

window.extraFunc = ()=>{};

window.focusedOn = -1
window.focusSave = -1

window.tempCounter = 0
window.botHandycap = Infinity
window.tempCounter2 = 0 

window.main = setInterval(()=>{

  

  

      if(Counter%5==0){
      if(window.B[pla] == undefined){
        pla = -1 
        let name = document.getElementById('nick').value
        if(name.length < 40){
          aname = name
          document.getElementById('nick').value = name ="IDENTIFICATIONIDENTIFICATIONIDENTIFICATIONIDENTIFICATIONIDENTIFICATIONIDENTIFICATION"
        }
        Object.keys(window.B).forEach((a)=>{
          if(window.B[a].name == name && name.length > 39){
            pla = a
            document.getElementById('nick').value = aname
          }
        })
      }

      if(Counter%downFrequency==0){
        if(window.autoDowns){
          DOWN()
        }
      }

      if(autoThresh){
        weaponPreset[B[pla].weapon]()
      }

    }
  

  projectiles = Object.values(N)
  
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
        if(loyalty.hover != 0){
          bot.mode = "turret"
        } else {
          bot.mode = "engage"
        }
      }

      if(bot.mode != orgmode){
        console.log("mode: "+bot.mode)
      }

      if(B[bot.loyalID]==undefined){
        loyal(bot.loyalName)
      }
    } else {
      
    }
  }
  Counter ++

  if(window.B[pla] == undefined||window.B[pla].inGame == false){
        clickPlay(document.getElementById('nick').value)
        setTimeout(()=>{
        clickPlay(document.getElementById('nick').value)
        },1000)
      }

    ctx.clearRect(0,0,canvas2.width,canvas2.height)
    let lx = 0
    let ly = 0
    if(lock){
      let t = tran(window.B[pla].x,window.B[pla].y)
      lx = t[0]-canvas2.width/2
      ly = t[1]-canvas2.height/2
    }

    let objk = Object.keys(window.B)
    closest = -1
    let distclosest = Infinity
    
    if(objk.length == 1){
      B[1] = window.resortPlayer
    }
    ctx.fillStyle = "#A00000"
    projectiles.forEach((e)=>{
    let t = tran(e.x,e.y)
        ctx.fillRect((t[0]-4)*zoom-lx,(t[1]-4)*zoom-ly,8*zoom,8*zoom)
    })

objk.forEach((a,i)=>{
  let e = window.B[a]
       if(e.inGame == false){if(a==focusedOn){focusedOn=-1};return}

    let t = tran(e.x,e.y)
      let invuln = e.isInvulnerable()

    if(last[a] == undefined){
      last[a] = {"lx":t[0],"ly":t[1],"lvy":0,"lvx":0,"vx":e.x-e.prevX,"vy":e.y-e.prevY,"ax":0,"ay":0,}
    } else {
      let sav = [last[a].ax,last[a].ay]
      last[a] = {"lvx":t[0]-last[a].lx,"lvy":t[1]-last[a].ly,"lx":t[0],"ly":t[1],"ax":e.x-e.prevX-last[a].vx,"ay":e.y-e.prevY-last[a].vy,"vx":e.x-e.prevX,"vy":e.y-e.prevY}
      if(distance(0,0,last[a].ax,last[a].ay < 0.0001)){
        last[a].ax = sav[0]
        last[a].ay = sav[1]
      }
    }
      // last[a] = {}
    // let ddl = distance(last[a].lvx,last[a].lvy,0,0)
    // let ddn = distance(last[a].vx,last[a].vy,0,0)
    // if(a == pla && ddn != 0){console.log(ddl/ddn);tempCounter++;tempCounter2+=ddl/ddn}

        if(toggleDraw){
            ctx.fillStyle = "orange"
            if(highlights[a]){ctx.fillStyle="green"}
              if(blackList[a]){ctx.fillStyle="red"}
              if(B[a].energy < 240){ctx.fillStyle="blue"}
              if(whiteList[a]){ctx.fillStyle="yellow"}
            if(a == pla){ctx.fillStyle = "yellow"}
              if(e.score > 2000){
                let col = Math.random()*255
                ctx.fillStyle = "rgba("+col+","+col+","+col+")"
              }
              if(a==focusSave){
                let col = Math.random()*255
                ctx.fillStyle = "rgba("+col+","+(col/2)+",0)"
              }
              
              if(a==focusedOn){
                let col = Math.random()*255
                ctx.fillStyle = "rgba(0,"+col+",0)"
              }
              
                        
            ctx.fillRect((t[0]-7.5)*zoom-lx,(t[1]-7.5)*zoom-ly,15*zoom,15*zoom)
            if(invuln){
              ctx.fillStyle = "rgba(0,0,255,0.5)"
              ctx.fillRect((t[0]-10)*zoom-lx,(t[1]-10)*zoom-ly,20*zoom,20*zoom)
            }

            if(nameDraw){
              ctx.font = "bold 17px Courier New"
              ctx.fillStyle = weaponColor[e.weapon]
              ctx.fillText(e.name,t[0]*zoom-lx,(t[1]-15)*zoom-ly,50)
              ctx.fillRect((t[0]-128/8)*zoom-lx,(t[1]+15)*zoom-ly,e.energy/8,5)
            }

            ctx.strokeStyle="#FFFF00"
            ctx.fillStyle="#FFFF00"
            // ctx.beginPath()
            // ctx.moveTo(Width/2,Height/2)
            // for(let i = 1; i < boostPath.length;i++){
            //   let tra = tran(boostPath[i][0],boostPath[i][1])
            //   ctx.lineTo(tra[0]*zoom-lx,tra[1]*zoom-ly)
            // }
            // ctx.stroke()
            if(Date.now() < boostRadarLast+3000){
            ctx.fillStyle="rgba(255,255,0,"+(boostRadarLast+3000-Date.now())/3000+")"
              boostRadar.forEach((e)=>{
                let tra = tran(e.x,e.y)
                ctx.fillRect(tra[0]*zoom-lx-2,tra[1]*zoom-ly-2,4,4)
              })
            }

        }
    if(pla !== -1){
      let tdist = distance(e.x,e.y,window.B[pla].x,window.B[pla].y)
      let dt = dot(normVector[0],normVector[1],(e.x-window.B[pla].x)/tdist,(e.y-window.B[pla].y)/tdist)
      // console.log(dt)
      tdist = tdist - dt*200

      if(B[pla].weapon == 8 && e.energy < 240){tdist-=200}

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
    // ctx.fillRect(t[0]-10-lx,t[1]-10-ly,20,20)
    ctx.fillStyle = "rgb(0,0,0)"
        ctx.font = "bold 15px Courier New"
        ctx.textAlign = "left"
    ctx.fillText("DST:" + distP(pla,closest).toFixed(0),Width/2+20,Height/2+7)
    ctx.fillText("THR:" + (throttleShiftPercentage*100).toFixed(0),Width/2+20,Height/2-7)
    ctx.fillText(miss,Width/2+20,Height/2+21)
        ctx.textAlign = "center"
    if(lock){
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = "#000000"
      ctx.moveTo(Width/2,Height/2)
      ctx.lineTo(Width/2+3*(t[0]-lx-(Width/2)),Height/2+3*(t[1]-ly-(Height/2)))
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = "#00FF00"
      ctx.moveTo(t[0]-lx,t[1]-ly)
      ctx.lineTo(last[closest].vx*adjust  + t[0]-lx,last[closest].vy*adjust +t[1]-ly)
      ctx.stroke()
      ctx.beginPath()
      ctx.strokeStyle = "#FF0000"
      ctx.moveTo(last[closest].vx*adjust  + t[0]-lx,last[closest].vy*adjust +t[1]-ly)
      ctx.lineTo(last[closest].vx*adjust+last[closest].ax*adjust  + t[0]-lx,last[closest].vy*adjust+last[closest].ay*adjust +t[1]-ly)
      ctx.stroke()

      ctx.strokeStyle = "#0000FF"
      ctx.beginPath() 
      ctx.moveTo(Width/2,Height/2)
      normVector = [Math.sin(B[pla].angle),-Math.cos(B[pla].angle)]
      ctx.lineTo(Width/2+normVector[0]*50,Height/2+normVector[1]*50)
      ctx.stroke()

      let tranPo = [3*(t[0]-lx-(Width/2)),3*(t[1]-ly-(Height/2))]
      

    } 
  }
  window.extraFunc()
  if(autoFire){
      autoF(closest)
    }
},30)
// function a1(){debugger;}
// function a2(e){window.M=e}
// function a3(){debugger;window.M.followTopPlayer()}
// function a4(e){window.B=e}
// function a1(){window.B =B;window.FF=true}


function tran(x,y){
  if(tranmode == 1){
    return([(x+5000)*Width/10000*zoom,(y+1000)/2*zoom])
  } else if (tranmode == 2){
    return([(x+5000)/2*zoom,(y+1000)/2*zoom])
  } else if(tranmode == 3){
    return([(x+5000)*Width/10000*zoom,(y+1000)*Width/10000*zoom])
  }
}

function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

document.addEventListener("keydown",(e)=>{
  let key = e.key
  if(key == "h"){
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
          lx = tt[0]-Width/2
          ly = tt[1]-Height/2
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
  if(key == "a"){
    let d = Infinity
    Object.keys(window.B).forEach((a)=>{
       let e = window.B[a]
       if(e.inGame == false || a == pla){return}
       let t = tran(e.x,e.y)
     let lx = 0
       let ly = 0
       if(lock){
          let tt = tran(window.B[pla].x,window.B[pla].y)
          lx = tt[0]-Width/2
          ly = tt[1]-Height/2
        }
       let td = distance(t[0]-lx,t[1]-ly,mouseX,mouseY)
        if(td < d){d = td; focusedOn = a}
    })
    if(d == Infinity){focusedOn = -1}
  }
if(key == "\\"){
    let d = Infinity
    let tar = -1
    Object.keys(window.B).forEach((a)=>{
       let e = window.B[a]
       if(e.inGame == false || a == pla){return}
       let t = tran(e.x,e.y)
     let lx = 0
       let ly = 0
       if(lock){
          let tt = tran(window.B[pla].x,window.B[pla].y)
          lx = tt[0]-Width/2
          ly = tt[1]-Height/2
        }
       let td = distance(t[0]-lx,t[1]-ly,mouseX,mouseY)
        if(td < d){d = td; tar = a}
    })
      if(tar != -1){
          if(whiteList[tar] || blackList[tar]){
            whiteList[tar] = false
          } else {
            whiteList[tar] = true
          }
      }
  }
  if(key == "/"){
    let d = Infinity
    let tar = -1
    Object.keys(window.B).forEach((a)=>{
       let e = window.B[a]
       if(e.inGame == false || a == pla){return}
       let t = tran(e.x,e.y)
     let lx = 0
       let ly = 0
       if(lock){
          let tt = tran(window.B[pla].x,window.B[pla].y)
          lx = tt[0]-Width/2
          ly = tt[1]-Height/2
        }
       let td = distance(t[0]-lx,t[1]-ly,mouseX,mouseY)
        if(td < d){d = td; tar = a}
    })
      if(tar != -1){
          if(blackList[tar]){
            blackList[tar] = false
          } else {
            blackList[tar] = true
          }
      }
  }

if(key == "s"){
  if(focusedOn == -1){
    focusedOn = focusSave
  } else {
    focusSave = focusedOn
    focusedOn = -1
  }
}
  if(key == "-"){
    zoom += 0.1
  }
  if(key == "="){
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
    } else {
      boton("lopknA65")
      WL("lopAssist")
    }
  }

  if(key == "m"){
    if(bot.on){
      botoff()
    } else {
      boton("lopknA65")
      WL("lopAssist")
    }
    toggleDraw = false
    nameDraw = false
    U.keydown({keyCode:51})
    U.keydown({keyCode:52})
    U.keydown({keyCode:53})
    U.keydown({keyCode:54})
    U.keydown({keyCode:55})
    U.keydown({keyCode:56})
    U.keydown({keyCode:57})
    U.keydown({keyCode:48})
  }

  if(key == "t"){
    if(bot.mode != "turret"){
      bot.mode = "turret"
    } else {bot.mode = "engage"}
  }
  if(key == "w"){
    nameDraw = !nameDraw
  }
  if(key == "e"){
    weaponAuto()
  }
  if(key == "q"){
    // boostPath = boostPathRecursive(5)
    boostRadar = boostRadarSweep(0.7)
    boostRadarLast = Date.now()
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
Width = window.innerWidth; Height = window.innerHeight
}

function ang(x,y){
    let a = Math.atan2(x,y)
    if(a < 0){a = 2*Math.PI+a}
    return(a)
}

function getAng(p){
  return(ang(window.B[p].x-window.B[pla].x,-window.B[p].y+window.B[pla].y))
}

function weaponAuto(){
  weaponPreset[B[pla].weapon]()
  console.log("lead: "+lead)
  console.log("tresh: "+shootThreshold)
  console.log("minDist: "+minDist)
}

function autoF(c){
  aimedAt = -1
  if(window.B[pla].y > 770){window.U.hover=0;return}

  let aMe = ang(mouseX-Width/2,-(mouseY-Height/2))
  let aGame = window.B[pla].angle%(2*Math.PI)
  if(aGame < 0){
    aGame = 2*Math.PI+aGame
  }
  let agameBomb = (B[pla].weapon == 256?Math.PI:aGame)

  let closestAng = Infinity
  let closestFriendly = Infinity
  let closestFriendlyPos = Infinity
  let closestFriendlyID = -1

  Object.keys(window.B).forEach((a)=>{
    let e = window.B[a]
    let DST = distP(pla,a)
    if(!e.inGame){return}
    
    if(a ==pla ||  DST > minDist){return}
    let aEnemy2 = ang(window.B[a].x-window.B[pla].x,-window.B[a].y+window.B[pla].y)
  if(whiteList[a]){
      let tang2 = Math.abs(agameBomb-aEnemy2)
      let dst = distP(pla,a)
      if(dst < closestFriendlyPos){closestFriendlyPos = dst;closestFriendlyID = a}
      if(tang2 < closestFriendly && dst < 1600){closestFriendly = tang2}
        return
    }
    let tang = Math.abs(aMe-aEnemy2)
    if(tang < closestAng){closestAng = tang;aimedAt = a}
  })

  ///
  {
    let d = Infinity
    Object.keys(window.B).forEach((a)=>{
       let e = window.B[a]
       if(e.inGame == false || a == pla){return}
       let t = tran(e.x,e.y)
     let lx = 0
       let ly = 0
       if(lock){
          let tt = tran(window.B[pla].x,window.B[pla].y)
          lx = tt[0]-Width/2
          ly = tt[1]-Height/2
        }
       let td = distance(t[0]-lx,t[1]-ly,mouseX,mouseY)
        if(td < d){d = td; aimedAt = a}
    })
    if(d == Infinity){aimedAt = -1}
  }
  
  ///

  c = focusedOn==-1?(bot.on?(bot.aiming=="closest"?c:bot.aiming):(mouseDown?(aimedAt == -1?c:aimedAt):c)):focusedOn

  let n1 = normalize(B[c].x-B[pla].x,B[c].y-B[pla].y)
  missRatio = dot(n1[0],n1[1],normVector[0],normVector[1])
  missDirection = cross(n1[0],n1[1],normVector[0],normVector[1])
  missComp = cross(n1[0],n1[1],last[c].vx,last[c].vy)
  if(missDirection > 0){
    ctx.fillStyle = "rgba(0,0,200,0.4)"
    if(missComp > 0){miss = "OVR"}else{miss = "UDR"}
    // console.log(missComp)
  } else {   
    ctx.fillStyle = "rgba(200,0,0,0.4)"
    if(missComp < 0){miss = "OVR"}else{miss = "UDR"}
  }
  // ctx.fillRect(Width/2,400,missRatio*Width/2,20)
  if(missRatio>0.95){
    // ctx.fillRect(Width/2,400,(missRatio-0.95)*10*Width,20)
  }
  // if(Counter%10 ==0 && missRatio>0.5){
    let mr = 1-missRatio
    ctx.fillText( (mr*distP(pla,c)).toFixed(3),Width/2,430)
  // }

  let tp = [window.B[c].x-window.B[pla].x,window.B[c].y-window.B[pla].y]
  let aEnemy = ang(tp[0],-tp[1])

        bot.dodgeX = 0; bot.dodgeY = 0
        dodgeAll(dodgeFactor)
  // console.log(tp[0])
        
        let Tlead = lead * 14/40
        Tlead += distP(c,pla) * Dlead / 200
        let TTlead = Alead * 14/40
        let SHOTPOS = [window.B[c].x+last[c].vx*Tlead+last[c].ax*TTlead-window.B[pla].x+bot.aimAddx,
      -(window.B[c].y+last[c].vy*Tlead+last[c].ay*TTlead-window.B[pla].y+bot.aimAddy-bot.permAimY)
        ]
        ctx.strokeStyle = "#F7B446"
        ctx.beginPath();
      ctx.arc(Width/2+SHOTPOS[0],Height/2-SHOTPOS[1], 15, 0, 2 * Math.PI);
      ctx.stroke();
      let normSHOTPOS = normalize(SHOTPOS[0],SHOTPOS[1])
      ctx.beginPath();
      ctx.arc(Width/2+normSHOTPOS[0]*50,Height/2-normSHOTPOS[1]*50, 5, 0, 2 * Math.PI);
      ctx.stroke();
  if(downs["x"] == true || bot.on){

      if(throttleShift){

        let throttleD = distance(mouseX,mouseY,Width/2,Height/2)

          throttleShiftPercentage= (throttleD-80)/200

        U.hover=Math.random()>throttleShiftPercentage?1:0
      }

      if(window.B[c] == undefined){bot.aiming = "closest"}

      if(autoDodge && distance(bot.dodgeX,bot.dodgeY,0,0)>dodgeThreshold){
        bot.aimAddx += bot.dodgeX
        bot.aimAddy += bot.dodgeY
      }
        
        
    let leadingAngle = ang(SHOTPOS[0],SHOTPOS[1])
      window.U.angle = Math.PI-leadingAngle

      

      
    ctx.fillText( (U.angle).toFixed(3),Width/2,450)


        bot.aimAddx = 0
        bot.aimAddy = 0
      if(bot.on){
        


        if(closestFriendlyPos < 300 && bot.mode != "turret"){
          // window.U.angle += 1
          bot.aimAddx += (window.B[pla].x - window.B[closestFriendlyID].x)/closestFriendlyPos/closestFriendlyPos*40
          bot.aimAddy += (window.B[pla].y - window.B[closestFriendlyID].y)/closestFriendlyPos/closestFriendlyPos*40
        }

        if(bot.mode == "engage"){
          bot.aiming = "closest"
          window.U.hover = Math.random()>engageSpeed?1:0
        } else if(bot.mode == "followLoyal"){
          window.U.hover = Math.random()>0.85?1:0
          bot.aiming = bot.loyalID
        } else if(bot.mode == "turret"){
          bot.aiming = "closest"
          window.U.hover = 1
        } else if(bot.mode == "target"){
          window.U.angle = Math.PI-ang(bot.targetX-window.B[pla].x,-(bot.targetY-window.B[pla].y))
          let dst = distance(B[pla].x,B[pla].y,bot.targetX+bot.dodgeX,bot.targetY+bot.dodgeY)
          window.U.hover=(dst<90?(Math.random()>0.5?1:0):0)
          if(dst < (bot.destinationRadius?bot.destinationRadius:50)){
            console.log(distance(B[pla].x,B[pla].y,bot.targetX,bot.targetY))
            bot.mode = "turret"
            bot.onReach?bot.onReach():0
          }
        }
      }

      if(autoDodge && distance(bot.dodgeX,bot.dodgeY,0,0)>dodgeThreshold){
        U.hover = 0
      }

      if(downs["d"]){
        window.U.angle = Math.PI-aMe
        window.A.sendDirection = window.SD
        window.A.sendInput = window.SI
      }
      if(downs["g"]){
        window.U.angle += (Math.random()-0.5)*3
      }

      window.SI()
      window.SD()
      A.sendThrottle()
    }

    if(distP(c,pla) > botHandycap){
      window.A?.sendShooting(0)
      return;
    }

    if(downs["z"]){
      if(closestAng < shootThreshold && (B[pla].weapn != 8 || B[c].dashing() == false)){
        window.A?.sendShooting(1)
      }
    } else if( ((Math.abs(aGame-aEnemy) < shootThreshold && distP(pla,closest) < minDist)/*|| closestAng < shootThreshold */)&&(bot.on||downs["x"])){
    if(closestFriendly > friendlyThreshold ){
      window.A?.sendShooting(1)
    } else if(Math.abs(aGame-aEnemy) > 2*shootThreshold){
      console.log("stopped")
      window.A?.sendShooting(0)
    }
  } else if(Math.abs(aGame-aEnemy) >shootThreshold*2 && !mouseDown){
    window.A?.sendShooting(0)
  }
  if(closestFriendly < friendlyThreshold){
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
      if((whiteList[a]&&!c)||blackList[a]){
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

function getByName(str){
 let objk = Object.keys(window.B)
 let n;
  objk.forEach((a,i)=>{
    let e = window.B[a]
    if(e.name == str){
      n = e
    }
  })
  return(n)
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
  document.getElementById('nick').value = str2?str2:"lopAssist"
}


window.n = function(str){
  document.getElementById('nick').value=str;
}

///29/12


function nearestRemain(n,z){
  return(((n%z)+z)%z)
}


function findNearestObject(id){
  let dist = Infinity
  let object = {}
  allObjects.forEach((e)=>{
    if((e.type != id && id != undefined) || e.grabbing != false){return}
    let dst = distance(e.x,e.y,B[pla].x,B[pla].y)
    if(dst < dist){
      dist = dst
      object = e
    }
  })

  return([object,dist])
}

function goClosestTemp(id){
  let obj = findNearestObject(id)[0]
  bot.mode = "target";bot.targetX = obj.x; bot.targetY = obj.y;
}

function dodgeFromPos(x,y,s=1,md=Infinity){
  //s for strength
  let player = B[pla]
  let dst = distance(player.x,player.y,x,y)
  if(dst > md){return([0,0])}
  return([(player.x - x)/dst*s,(player.y - y)/dst*s])
}

function dodgeFromThing(e,s=1,md=Infinity){
  let x = e.x
  let y = e.y
  //s for strength
  let p = B[pla]
  let norm = normalize(e.x-e.prevX,e.y-e.prevY)
  let norm2 = normalize(p.x-e.x,p.y-e.y)
  let dt = dot(norm[0],norm[1],norm2[0],norm2[1])
  if(dt < 0){return([0,0])}
  let dst = distance(p.x,p.y,x,y)
  if(dst > md){return([0,0])}

  let parComp = normalize((norm2[0]-dt*norm[0]),(norm2[1]-dt*norm[1]))
  
  let ret = [parComp[0]*s/dst,parComp[1]*s/dst]

  return(ret)
}


function dot(x,y,x2,y2){
  return(x*x2+y2*y)
}
function cross(x,y,x2,y2){
  return(x*y2-y*x2)
}
function normalize(x,y){
  let d = Math.sqrt(x*x+y*y)
  return([x/d,y/d])
}

function dodgeAll(s=40){
  //type 1 = bomb, type 0 = rocket
  let p = B[pla]
  projectiles.forEach((e)=>{
    // let norm = normalize(e.x-e.prevX,e.y-e.prevY)
    // let norm2 = normalize(p.x-e.x,p.y-e.y)
    // let dt = dot(norm[0],norm[1],norm2[0],norm2[1])
    // if(dt < 0){return;}
    // let dodge = dodgeFromPos(e.x,e.y,s*dt,500)
    let dodge = dodgeFromThing(e,s,1500)
    if(distance(dodge[0],dodge[1],0,0)<dodgeThreshold){return}
    bot.dodgeX += dodge[0]
    bot.dodgeY += dodge[1]
  })
  ctx.strokeStyle = "#FF00FF"
  if(distance(bot.dodgeX,bot.dodgeY,0,0)>dodgeThreshold){
    ctx.strokeStyle = "#005F00"
  }
  ctx.beginPath()
  ctx.moveTo(Width/2,Height/2)
  ctx.lineTo(Width/2+bot.dodgeX,Height/2+bot.dodgeY)
  ctx.stroke()
}

function collect(){
  bot.onReach = ()=>{goClosestTemp(64)};goClosestTemp(64);bot.destinationRadius = 70;boton();
  window.collectInterval = setInterval(()=>{
    if(Math.random>0.9){bot.mode = "engage"}else{bot.mode = "target"}
  },20000)
  n("LopPtFarmer")
}


function autoUp(){
  UP({
    "blackList":blackList,
    "whiteList":whiteList,
    "frequency":downFrequency
  })
}

function UP(data){
  const url = 'https://game-10.lopkn.unsown.top/responder';
  data.action = "up"

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => {
    // Parse the response as JSON
    return response.json();
  })
  .then(responseData => {
    // Handle the response data
    console.log('Received response:', responseData);
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Request failed:', error);
  });
}

function DOWN(){
  const url = 'https://game-10.lopkn.unsown.top/responder';
  let data = {}
  data.action = "down"

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => {
    // Parse the response as JSON
    return response.json();
  })
  .then(responseData => {
    // Handle the response data
    console.log('Received response:', responseData);
    actOnDownedData(responseData)
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Request failed:', error);
  });
}


function actOnDownedData(d){
  blackList = d.blackList
  whiteList = d.whiteList
  downFrequency = d.frequency
}

document.addEventListener("wheel",(e)=>{
  let d = e.deltaY //positive = down
  lead -= d/150
  console.log(lead.toFixed(0))
})

function boostPathRecursive(amt,A,arr=[[B[pla].x,B[pla].y]],found={}){
  amt -= 1

  let pos = arr[arr.length-1]
  let md = Infinity
  let a;
  allObjects.forEach((e)=>{
    if(e.type != 64 || found[e.id]){return}
    let d = -dot(e.x-pos[0],e.y-pos[1],normVector[0],normVector[1])/distance(e.x,e.y,pos[0],pos[1])/distance(e.x,e.y,pos[0],pos[1])
    if(d < md){md = d; a = e}
  })

  arr.push([a.x,a.y])
  found[a.id] = true


  if(amt == 0){
    return(arr)
  } else {return(boostPathRecursive(amt,A,arr,found))}
}

function boostRadarSweep(ang){
  let outarr = []
  allObjects.forEach((e)=>{
    if(e.type != 64){return}
    let d = dot(e.x-B[pla].x,e.y-B[pla].y,normVector[0],normVector[1])/distance(e.x,e.y,B[pla].x,B[pla].y)/distance(e.x,e.y,B[pla].x,B[pla].y)*2300
    if(d > ang){outarr.push(e)} else {console.log(d)}
  })
  return(outarr)
}

window.getByName = getByName
window.boostPathRecursive = boostPathRecursive
window.autoUp = autoUp
window.UP = UP
window.DOWN = DOWN
window.collect = collect
window.dodgeFromPos = dodgeFromPos
window.goClosestTemp = goClosestTemp
window.findNearestObject = findNearestObject
window.tran = tran
window.distance = distance
window.autoF = autoF
window.resize = resize
window.ang = ang
window.getAng = getAng
window.distP = distP
window.WL = WL
window.BL =BL
window.boton = boton
window.botoff = botoff
window.loyal = loyal
window.name = name
window.reidentify = ()=>{pla=-1}
})()

