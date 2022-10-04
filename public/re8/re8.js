
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
  ENAHD.SEL(e)
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


var MRef = {"MTS":800,"vision":0,"wholeHeight":0,"wholeWidth":0,"MTD":{},"buttonW":250,"buttonH":100}


class game{
  static state = "lobby"
  static map = {}
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
    // if(ss.boxes == "main"){
      switch(ss.mode){
        case "inspect":
          boarderRect(ss.x*MRef.MTS,ss.y*MRef.MTS,MRef.MTS,MRef.MTS,4,"white")
          break;
        case "drag":
          boarderRect(ss.x*MRef.MTS,ss.y*MRef.MTS,MRef.MTS,MRef.MTS,4,"red")
          boarderRect(this.ms.heldSpace[0]*MRef.MTS,this.ms.heldSpace[1]*MRef.MTS,MRef.MTS,MRef.MTS,4,"#FFA000")
          break;
      }
    // }
  }

  static entityUpdate(e){
    if(e[1] !== "-DEL-"){
      this.enDict[e[0]] = e[1]
    } else {
      delete this.enDict[e[0]]
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
      socket.emit("drag",{"sel":B.selection,"id":ID,"x":game.ss.ax,"y":game.ss.ay,"tx":game.ms.heldSpace[2],"ty":game.ms.heldSpace[3],"mode":"main"})
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

  }

  static buttonPressed(){
    let bh = MRef.buttonH
    let bno = Math.floor(mouseY/MRef.buttonH)

    if(B.BREF.normal[B.selection]){
      if(B.selection == "none" || B.selection != bno){
        B.selection = bno
      } else {
        B.selection = "none"
      }
    }

  }

  static SEL(e){
    B.selection = e.name
    B.specialSel = e
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
        boarderRect(0,0,MRef.wholeWidth,MRef.wholeHeight,6,e.specialSel.color)
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

document.addEventListener("keydown",(e)=>{

  let key = e.key

})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key

  if(key == "ArrowUp"){
     game.camera[1] -= 1
    } else if(key == "ArrowDown"){
        game.camera[1] += 1
    } else if(key == "ArrowLeft"){
      game.camera[0] -= 1
    } else if(key == "ArrowRight"){
      game.camera[0] += 1
    } else {

      socket.emit("key",{"id":ID,"key":key})
    }
})


let mainLoopint = setInterval(()=>{
  repeat()
},1000/30)


function repeat(e){
  if(game.state == "started"){
    mainCTX.fillStyle = "#303030"
    mainCTX.clearRect(0,0,wWidth,wHeight)
    mainCTX.fillRect(0,0,wWidth,wHeight)

    let mapArr = Object.keys(game.map.tiles)
    // mapArr.forEach((e,i)=>{
    //   // let coord = e.split(",")
    //   // let tileInfo = game.map[e]

    //   // mainCTX.fillStyle = tileInfo.color
    //   // mainCTX.fillRect(MRef.MTS*coord[0],MRef.MTS*coord[1],MRef.MTS,MRef.MTS)
    // })

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

  switch(e.type){
    case "factory":
      mainCTX.fillStyle = e.color
      mainCTX.fillRect(ax*MRef.MTS+4,ay*MRef.MTS+4,MRef.MTS-8,MRef.MTS-8)
      break;
    case "architect":
      mainCTX.fillStyle = e.color
      mainCTX.fillRect(ax*MRef.MTS+MRef.MTD["0.2"],ay*MRef.MTS+MRef.MTD["0.2"],MRef.MTS-MRef.MTD["0.2"]*2,MRef.MTS-MRef.MTD["0.2"]*2)
      break;
  }
}

