
let mainCanvas = document.getElementById("myCanvas")
mainCanvas.height = window.innerHeight
mainCanvas.width = window.innerWidth
let wWidth = window.innerWidth
let wHeight = window.innerHeight
let mainCTX = mainCanvas.getContext("2d")

const socket = io.connect('/')

let GAMESESSION = "G10.3"
socket.emit("JOINGAME",GAMESESSION)

var ID = 0
var TEAM = window.prompt("what room would you join?","0")+":"+window.prompt("room type?","t")+"-"+window.prompt("what team would you join?","0")+"-"+window.prompt("what color?","p")

socket.on("acknowledge G10.3",(e)=>{ID = e; console.log("joined as e")
  socket.emit("jointeam",[TEAM,ID])
})
socket.on("joinedRoom",(e)=>{
  mainCTX.lineWidth = 3
  // mainCTX.clearRect(0,0,2000,2000)
  mainCTX.font = "bold 20px Arial"
  mainCTX.fillStyle = "#FFFFFF"
  mainCTX.fillText("join info: "+JSON.stringify([e.name,e.type,e.started,TEAM,ID]),100,100)
  console.log("joined team: "+JSON.stringify(e))
})
socket.on("startGame",(e)=>{
  game.startProcess(e)
})
socket.on("entityUpdate",(e)=>{
  game.entityUpdate(e)
})
socket.on("personalMapUpdate",(e)=>{
  game.pmu(e)
})
socket.on("SEL",(e)=>{
  EHAND.SEL(e)
})
socket.on("entityPDel",(e)=>{
  game.entityDel(e)
})

socket.on("sline",(e)=>{
  game.pushSline(e)
})

socket.on("resourcesUpdate",(e)=>{
  game.resources = e
})


function lobby(){
  let b1 = document.createElement("button")
  b1.id = "b1"
  b1.innerHTML = "start"
  b1.style.top = "200px"
  b1.style.left = "100px"
  b1.style.height = '30px'
  b1.style.width = '70px'
  b1.style.zIndex = 2
  b1.style.position = "absolute"
  b1.onclick = ()=>{startGame()}
  document.body.appendChild(b1)

  let t1 = document.createElement("input")
  t1.id = "t1"
  t1.value = "800"
  t1.style.top = "250px"
  t1.style.left = "100px"
  t1.style.height = '25px'
  t1.style.width = '70px'
  t1.style.zIndex = 2
  t1.style.position = "absolute"
  t1.onchange = ()=>{let v = document.getElementById("t1").value;
    console.log(v);
    if(!isNaN(parseFloat(v))){MRef.MTS = parseFloat(v)}
    document.getElementById("t1").blur()}
  document.body.appendChild(t1)
}
lobby()

function bloatRect(x,y,w,h,bloat,col){
  mainCTX.fillStyle = col
  mainCTX.fillRect(x-bloat,y-bloat,w+bloat+bloat,w+bloat+bloat)
}

function boarderRect(x,y,w,h,bloat,col){
  mainCTX.lineWidth = bloat
  mainCTX.strokeStyle = col
  mainCTX.beginPath()
  mainCTX.moveTo(x,y)
  mainCTX.lineTo(x+w,y)
  mainCTX.lineTo(x+w,y+h)
  mainCTX.lineTo(x,y+h)
  mainCTX.lineTo(x,y)
  mainCTX.lineTo(x+w,y)
  mainCTX.stroke();
}

function timerDraw(time,maxtime,x,y,style){
  if(time>maxtime){
    return;
  }
  let zotime = time/maxtime
  let colotime = zotime*255
  let S = MRef.MTS
  let SD = MRef.MTD
  let pxx = x*S
  let pyy = y*S

  if(style == undefined || style == 1 || style == "building"){
    mainCTX.fillStyle = "rgba(255,0,0,"+(1-zotime)+")"
    mainCTX.fillRect(pxx+SD[0.1],pyy+SD[0.1],SD[0.2],SD[0.2])
    mainCTX.fillRect(pxx+S-SD[0.1]*3,pyy+S-SD[0.1]*3,SD[0.2],SD[0.2])

    mainCTX.fillStyle = "rgba(0,250,250,"+zotime+")"
    mainCTX.fillRect(pxx+SD[0.1],pyy+S-SD[0.1]*3,SD[0.2],SD[0.2])
    mainCTX.fillRect(pxx+S-SD[0.1]*3,pyy+SD[0.1],SD[0.2],SD[0.2])
  }else if(style == 2 || style == "moving"){
    mainCTX.fillStyle = "rgba("+(255-colotime)+","+colotime+","+colotime+",0.35)"
    mainCTX.fillRect(pxx,pyy,S-S*zotime,S)
  }else if(style == 3 || style == "reloading"){
    mainCTX.fillStyle = "rgba("+(255-colotime)+","+(255-colotime)+",0,0.35)"
    mainCTX.fillRect(pxx,pyy,S-S*zotime,S)
  }else if(style == 4 || style == "mine"){
    mainCTX.fillStyle = "rgba(255,255,0,0.5)"
    mainCTX.fillRect(pxx,pyy,S,S*zotime)
  }

}

var MRef = {"FPS":30,"FPSR":1/30,"MTS":800,"vision":0,"wholeHeight":0,"wholeWidth":0,"MTD":{},"buttonW":250,"buttonH":100}


class game{
  static state = "lobby"
  static map = {}
  static resources = {}
  static slines = []
  static enDict = {}
  static camera = [0,0]
  static startProcess(e){

    // this.enDict = e.enDict
    this.map = e.map
    MRef.MTS = document.getElementById("t1").value
    MRef.MTS /= e.vision
    MRef.vision = e.vision

    MRef.wholeHeight = MRef.MTS * e.vision
    MRef.wholeWidth = MRef.MTS * e.vision

    let mm = MRef.MTS

    MRef.MTD = {
      "0.1":mm/10,
      "0.2":mm/5,
      "0.5":mm/2
    }

    this.state = "started"


    let deleteButtonsArr = ["b1","t1"]
    deleteButtonsArr.forEach((e)=>{
      document.getElementById(e).remove()
    })



  }

  static OtM(x,y){
    return([Math.floor(x/MRef.MTS),Math.floor(y/MRef.MTS)])
  }

  static ss = {"mode":"inspect","ax":0,"ay":0,"x":0,"y":0,"boxes":"main"}
  static ms = {"held":false,"hacted":false,"heldTime":0,"heldSpace":[false]}

  static renderSelectedSpot(){
    let ss = this.ss
    if(inRect(ss.x,ss.y,-1,-1,MRef.vision,MRef.vision)){
      switch(ss.mode){
        case "inspect":
          boarderRect(ss.x*MRef.MTS,ss.y*MRef.MTS,MRef.MTS,MRef.MTS,4,"white")
          break;
        case "drag":
          boarderRect(ss.x*MRef.MTS,ss.y*MRef.MTS,MRef.MTS,MRef.MTS,4,"red")
          boarderRect(this.ms.heldSpace[0]*MRef.MTS,this.ms.heldSpace[1]*MRef.MTS,MRef.MTS,MRef.MTS,4,"#FFA000")
          break;
      }
    }
  }

  static entityUpdate(e){
    if(e[1] !== "-DEL-"){
      this.enDict[e[0]] = e[1]
    } else {
      delete this.enDict[e[0]]
    }
  }

  static entityDel(p){
    let objK = Object.keys(this.enDict)
    p.forEach((pos)=>{
      objK.forEach((e)=>{
        let en = this.enDict[e]
        if(en == undefined){
          return
        }
        if(en.x+","+en.y==pos){
          delete this.enDict[e]
        }
      })
    })
    
  }



  static pushSline(e){
    e.maxlife = e.life
    this.slines.push(e)
  }

  static renderSlines(){
    let flevelcam = reApos(game.camera[0],game.camera[1],game.map.width,game.map.height)
    this.slines.forEach((e,i)=>{
      // if(inRect(e.x,e.y,flevelcam[0]-1,flevelcam[1]-1,MRef.vision,MRef.vision)){
        e.life -= MRef.FPSR*1000
        if(e.life <= 0){
          this.slines.splice(i,1)
          return;
        }
        mainCTX.beginPath()
        mainCTX.lineWidth = 7
        mainCTX.strokeStyle = this.getShootingLine(e.name,e.life,e.maxlife)
        for(let i = -1; i < 2; i++){
          for(let j = -1; j < 2; j++){
            mainCTX.moveTo(MRef.MTS*(e.x-flevelcam[0]+i*game.map.width)+MRef.MTD[0.5],MRef.MTS*(e.y-flevelcam[1]+j*game.map.height)+MRef.MTD[0.5])
            mainCTX.lineTo(MRef.MTS*(e.x-flevelcam[0]+e.vx+i*game.map.width)+MRef.MTD[0.5],MRef.MTS*(e.y-flevelcam[1]+e.vy+j*game.map.height)+MRef.MTD[0.5])
          }
        }
        mainCTX.stroke()
      // }
    })
  }


  static getShootingLine(name,l,ml){
    let lp = l/ml
    let mr = Math.random()
    switch(name){
      case "soldier1":
        return("rgba("+(mr*255)+",0,0,"+lp+")")
        break;
    }
  }

  static pmu(e){
    game.map = {"height":game.map.height,"width":game.map.width,"tiles":e.map}
  }

}


class EHAND{
  static mouseHandler(e){
    if(inRect(mouseX,mouseY,0,0,MRef.wholeWidth,MRef.wholeHeight)){
      game.ss.boxes = "main"
      let t = game.OtM(mouseX,mouseY)
      game.ss.x = t[0]
      game.ss.y = t[1]

      let A = reApos(t[0]+game.camera[0],t[1]+game.camera[1],game.map.width,game.map.height)
      game.ss.ax = A[0]
      game.ss.ay = A[1]

    } else if(inRect(mouseX,mouseY,MRef.wholeWidth,0,MRef.wholeWidth+MRef.buttonW,MRef.buttonH*B.buttons.length)){
      this.buttonPressed()
    } else {
      game.ss.boxes = "out"
    }
    game.ms.held = true
  }

  static updateSelector(x,y){
    game.ss.x += x
    game.ss.y += y
    let A = reApos(game.ss.x+game.camera[0],game.ss.y+game.camera[1],game.map.width,game.map.height)
    game.ss.ax = A[0]
    game.ss.ay = A[1]
  }

  static heldMouseDown(e){
    if(inRect(mouseX,mouseY,0,0,MRef.wholeWidth,MRef.wholeHeight)){
      game.ss.boxes = "main"
      let t = game.OtM(mouseX,mouseY)
      game.ss.x = t[0]
      game.ss.y = t[1]
      let A = reApos(t[0]+game.camera[0],t[1]+game.camera[1],game.map.width,game.map.height)
      game.ss.ax = A[0]
      game.ss.ay = A[1]
    } else {
      game.ss.boxes = "out"
    }

    if(game.ms.heldTime > 15){
        if(game.ms.hacted === false){
        this.heldDown(e)
        }
      } else {
        mainCTX.fillStyle = "rgba(255,0,0,"+game.ms.heldTime/30+")"
        mainCTX.fillRect(mouseX,mouseY,150-game.ms.heldTime*10,20)
      }
  }

  static heldDown(e){
    game.ms.hacted = true
    game.ss.mode = "drag"
    game.ms.heldSpace = [game.ss.x,game.ss.y,game.ss.ax,game.ss.ay]
  }

  static mouseUpHandler(e){
    game.ms.held = false
    if(game.ss.boxes == "main"){
    if(game.ms.hacted){
      game.ms.hacted = false
      socket.emit("drag",{"sel":B.selection,"id":ID,"tx":game.ss.ax,"ty":game.ss.ay,"x":game.ms.heldSpace[2],"y":game.ms.heldSpace[3],
        "dist":distance(game.ss.x,game.ss.y,game.ms.heldSpace[0],game.ms.heldSpace[1]),"mode":"main",
        "vx":game.ss.x-game.ms.heldSpace[0],"vy":game.ss.y-game.ms.heldSpace[1]})
      console.log("dragged from:"+JSON.stringify(game.ms.heldSpace)+" to "+game.ss.ax+","+game.ss.ay)
    } else {
      socket.emit("click",{"sel":B.selection,"id":ID,"x":game.ss.ax,"y":game.ss.ay,"mode":"main"})
      console.log("clicked on: "+game.ss.ax+","+game.ss.ay)
    }} else if(game.ss.boxes == "out"){
  
    }
    game.ms.hacted = false
    game.ss.mode = "inspect"
    game.ms.heldTime = 0
  }

  static repeat(e){
    if(game.ms.held){
      game.ms.heldTime++
      this.heldMouseDown(e)
    }

    B.renderAll()
    this.renderResources()
    game.renderSlines()
  }

  static buttonPressed(){
    let bh = MRef.buttonH
    let bno = Math.floor(mouseY/MRef.buttonH)

    if(B.BREF.normal[B.selection]){
      if(B.selection == "none" || B.selection != bno){
        B.selection = bno
        socket.emit("button",{"sel":B.selection,"id":ID,"x":game.ss.ax,"y":game.ss.ay})
      } else {
        B.selection = "none"
      }
    }

  }

  static SEL(e){
    B.selection = e.name
    B.specialSel = e
  }

  static renderResources(){
    mainCTX.fillStyle = "#000030"
    mainCTX.fillRect(MRef.wholeWidth+MRef.buttonW,0,200,500)
    let objk = Object.keys(game.resources)
    objk.forEach((e,i)=>{
      mainCTX.fillStyle = "#FFFFFF"
      mainCTX.font = "27px Arial"
      mainCTX.fillText(e+": "+game.resources[e],MRef.wholeWidth+MRef.buttonW,20+30*i)
    })
  }

}


class B{

  static BREF = {
    "normal":{
      "none":true,
      "0":true,
      "1":true,
      "2":true,
      "3":true
    }
  }

  static buttons = [
    {
      "name":"act 1",
      "color":"#00FF00",
      "txtcolor":"#FFFFFF"
    },{
      "name":"act 2",
      "color":"#0000FF",
      "txtcolor":"#FFFFFF"
    },{
      "name":"act 3",
      "color":"#00FFFF",
      "txtcolor":"#FFFFFF"
    },{
      "name":"act 4",
      "color":"#FF0000",
      "txtcolor":"#FFFFFF"
    }
  ]


  static selection = "none"
  static specialSel = {}

  static renderAll(){
    mainCTX.fillStyle = "#000000"
    mainCTX.fillRect(MRef.wholeWidth,0,MRef.buttonW,MRef.buttonH*7)
    mainCTX.fillStyle = "#404040"
    mainCTX.fillRect(MRef.wholeWidth,0,MRef.buttonW,MRef.buttonH*this.buttons.length)
    mainCTX.lineWidth = 5
    mainCTX.font = "20px Arial"
    this.buttons.forEach((e,i)=>{
      mainCTX.fillStyle = e.txtcolor
      mainCTX.fillText(e.name,MRef.wholeWidth,i*MRef.buttonH+30)
    })

    if(this.selection != "none"){
      if(B.BREF.normal[B.selection]){
        boarderRect(MRef.wholeWidth,MRef.buttonH*this.selection,MRef.buttonW,
        MRef.buttonH,4,this.buttons[this.selection].color)
      } else {
        boarderRect(0,0,MRef.wholeWidth,MRef.wholeHeight,6,this.specialSel.color)
      }
    }


  }

}



onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}

function startGame(){
  socket.emit("startRoom",{"id":ID})
}

function vectorNormalize(original,multiplier){

  if(multiplier == undefined){
    multiplier = 1
  }

  let tx = original[2]
  let ty = original[3]

  let d = Math.sqrt(tx*tx+ty*ty)

  if(d == 0){
    return(original)
  }

  tx = tx*multiplier/d
  ty = ty*multiplier/d

  return([original[0]+tx,original[1]+ty])

}


function inRect(x,y,x1,y1,x2,y2){
  return(((x>x1&&x<x2)||(x>x2&&x<x1))&&(y>y1&&y<y2)||(y>y2&&x<y1))
}


document.addEventListener("mousedown",(e)=>{

  //{"mode":"inspect","x":0,"y":0,"boxes":"main"}
  EHAND.mouseHandler(e)

})
document.addEventListener("mouseup",(e)=>{

  EHAND.mouseUpHandler(e)

})

var moveVals = {}
var pressedKeys = {}

document.addEventListener("keydown",(e)=>{

  let key = e.key

  if(pressedKeys[key] === true){
    return;
  } else {
    pressedKeys[key] = true
  }

  if(key == "o"){
    game.camera = [0,0]
  }

  if(key == "ArrowUp"){
      game.camera[1] -= 1
      game.ss.y += 1
      moveVals[key] = setTimeout(()=>{clearTimeout(moveVals[key]);moveVals[key]=setInterval(()=>{
      game.camera[1] -= 1
      game.ss.y += 1
      },40)},300)
    } else if(key == "ArrowDown"){
        game.camera[1] += 1
        game.ss.y -= 1
        moveVals[key] = setTimeout(()=>{clearTimeout(moveVals[key]);moveVals[key]=setInterval(()=>{
        game.camera[1] += 1
        game.ss.y -= 1
      },40)},300)
    } else if(key == "ArrowLeft"){
      game.camera[0] -= 1
      game.ss.x += 1
      moveVals[key] = setTimeout(()=>{clearTimeout(moveVals[key]);moveVals[key]=setInterval(()=>{
        game.camera[0] -= 1
      game.ss.x += 1
      },40)},300)
    } else if(key == "ArrowRight"){
      game.camera[0] += 1
      game.ss.x -= 1
      moveVals[key] = setTimeout(()=>{clearTimeout(moveVals[key]);moveVals[key]=setInterval(()=>{
        game.camera[0] += 1
      game.ss.x -= 1
      },40)},300)
    }

})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key
  pressedKeys[key] = false

  if(key[0] == "A" && key[1] == "r"){
    console.log("clear")
    clearInterval(moveVals[key])
    clearTimeout(moveVals[key])
    clearInterval(moveVals[key])
  }

  if(key == "w"){
     EHAND.updateSelector(0,-1)
    } else if(key == "s"){
     EHAND.updateSelector(0,1)
    } else if(key == "a"){
     EHAND.updateSelector(-1,0)
    } else if(key == "d"){
     EHAND.updateSelector(1,0)
    }

      socket.emit("key",{"id":ID,"key":key})

})


let mainLoopint = setInterval(()=>{
  repeat()
},1000/MRef.FPS)


function repeat(e){
  if(game.state == "started"){
    mainCTX.fillStyle = "#303030"
    mainCTX.clearRect(0,0,wWidth,wHeight)
    mainCTX.fillRect(0,0,wWidth,wHeight)
    let mapArr = Object.keys(game.map.tiles)


    for(let i = 0; i < MRef.vision; i++){
      for(let j = 0; j < MRef.vision; j++){
        let gp = getApos(i,j)
        let pos = gp[0] + ","+gp[1]

        let col = "#000000"
        
        if(game.map.tiles[pos]!=undefined){
          col = game.map.tiles[pos].color
        }
        mainCTX.fillStyle = col
        mainCTX.fillRect(MRef.MTS*i,MRef.MTS*j,MRef.MTS,MRef.MTS)
      }
    }



    mainCTX.strokeStyle = "#000000"
    mainCTX.lineWidth = 3
    mainCTX.beginPath()
    for(let i = 0; i < MRef.vision+1; i++){
      mainCTX.moveTo(MRef.MTS*i,0)
      mainCTX.lineTo(MRef.MTS*i,MRef.wholeHeight)
    }
    for(let i = 0; i < MRef.vision+1; i++){
      mainCTX.moveTo(0,MRef.MTS*i)
      mainCTX.lineTo(MRef.wholeWidth,MRef.MTS*i)
    }
    mainCTX.stroke()


    let enObj = Object.keys(game.enDict)

    enObj.forEach((e,i)=>{
      entityRender(game.enDict[e])
    })

    EHAND.repeat(e)
    game.renderSelectedSpot()

  }
}



function getApos(x,y){

    let h = game.map.height
    let w = game.map.width

   let xx = game.camera[0] + x
   let yy = game.camera[1] + y

   return([xx%w>=0?xx%w:(w+xx%w),yy%h>=0?yy%h:h+yy%h])

  }

function reApos(x,y,w,h){
  return([x%w>=0?x%w:(w+x%w),y%h>=0?y%h:h+y%h])
}


function entityRender(e){

  let rp = reApos(game.camera[0],game.camera[1],game.map.width,game.map.height)

  let rrp = reApos(e.x-rp[0],e.y-rp[1],game.map.width,game.map.height)

  // let ax = e.x-rp[0]
  // let ay = e.y-rp[1]
  let ax = rrp[0]
  let ay = rrp[1]

  if(ax > MRef.vision-1 || ay > MRef.vision-1){
    return
  }

  let S = MRef.MTS

  switch(e.type){
    case "factory":
      mainCTX.fillStyle = e.color
      mainCTX.fillRect(ax*S+4,ay*S+4,S-8,S-8)
      break;
    case "architect":
      mainCTX.fillStyle = e.color
      mainCTX.fillRect(ax*S+MRef.MTD["0.2"],ay*S+MRef.MTD["0.2"],S-MRef.MTD["0.2"]*2,S-MRef.MTD["0.2"]*2)
      break;
    case "soldier":
      mainCTX.beginPath();
      mainCTX.arc(ax*S+S*0.5, ay*S+S*0.5, MRef.MTD[0.1]*2.5, 0, 2 * Math.PI, false);
      mainCTX.fillStyle = e.color;
      mainCTX.fill();
      mainCTX.lineWidth = 1;
      mainCTX.strokeStyle = '#000000';
      mainCTX.stroke();
      break;
    case "tank":
      mainCTX.beginPath();
      mainCTX.arc(ax*S+S*0.5, ay*S+S*0.5, MRef.MTD[0.1]*3.5, 0, 2 * Math.PI, false);
      mainCTX.fillStyle = e.color;
      mainCTX.fill();
      mainCTX.lineWidth = 1;
      mainCTX.strokeStyle = '#000000';
      mainCTX.stroke();
      break;
    case "sniper":
      mainCTX.beginPath();
      mainCTX.arc(ax*S+S*0.5, ay*S+S*0.5, MRef.MTD[0.1]*4, 0, 2 * Math.PI, false);
      mainCTX.moveTo(ax*S+S*0.5,ay*S+S*0.1)
      mainCTX.lineTo(ax*S+S*0.5,ay*S+S-S*0.1)
      mainCTX.moveTo(ax*S+S*0.1,ay*S+S*0.5)
      mainCTX.lineTo(ax*S+S-S*0.1,ay*S+S*0.5)
      mainCTX.lineWidth = 4;
      mainCTX.strokeStyle = e.color;
      mainCTX.stroke();
      break;
    case "mine":
      mainCTX.beginPath();
      mainCTX.moveTo(ax*S+MRef.MTD[0.5],ay*S+S-MRef.MTD[0.2])
      mainCTX.lineTo(ax*S+MRef.MTD[0.2],ay*S+MRef.MTD[0.2])
      mainCTX.lineTo(ax*S+S-MRef.MTD[0.2],ay*S+MRef.MTD[0.2])
   
      mainCTX.closePath()
      mainCTX.fillStyle = e.color;
      mainCTX.fill();
      mainCTX.lineWidth = 1;
      mainCTX.strokeStyle = '#000000';
      mainCTX.stroke();
      break;
  }

  if(e.cooldown[0] != "none"){
    let ec = e.cooldown
    if(Date.now()-ec[1]>ec[2]){
      e.cooldown = ["none",0,0]
    } else {
      timerDraw(Date.now()-ec[1],ec[2],ax,ay,e.cooldown[0])
    }
  } if(e.income != undefined){
    let ei = e.income
    timerDraw((Date.now()-ei[1])%ei[2],ei[2],ax,ay,"mine")
  }
}

