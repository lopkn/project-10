
let mainCanvas = document.getElementById("myCanvas")
mainCanvas.height = window.innerHeight
mainCanvas.width = window.innerWidth
mainCanvas.style.zIndex = 1
let wWidth = window.innerWidth
let wHeight = window.innerHeight
let mainCTX = mainCanvas.getContext("2d")

const socket = io.connect('/')

let GAMESESSION = "G10.3"
socket.emit("JOINGAME",GAMESESSION)

var ID = 0
// var TEAM = window.prompt("what room would you join?","0")+":"+window.prompt("room type?","t")+"-"+window.prompt("what team would you join?","0")+"-"+window.prompt("what color?","p")

socket.on("acknowledge G10.3",(e)=>{ID = e; console.log("joined as e")
  socket.emit("reloadLobby",ID)
})

socket.on("lobby",(e)=>{
  lobby2(e)
})

socket.on("joinedRoom",(e)=>{
  mainCTX.lineWidth = 3
  // mainCTX.clearRect(0,0,2000,2000)
  mainCTX.font = "bold 20px Arial"
  mainCTX.fillStyle = "#FFFFFF"
  // mainCTX.fillText("join info: "+JSON.stringify([e.name,e.type,e.started,TEAM,ID]),100,100)
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
socket.on("dmgnum",(e)=>{
  game.pushDmgnum(e)
})

socket.on("enRef",(e)=>{
  game.enRef = e[0]
  game.mainEnRef = e[1]
  B.disprefUpdate()
})

socket.on("joinMenu",(e)=>{
  let d = document.getElementById("d1")
  d.style.fontSize = "30px" 
  if(d !== null){
    d.innerHTML = JSON.stringify(e)
  }
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

  let d1 = document.createElement("div")
  d1.id = "d1"
  d1.innerHTML = "Waiting for players.."
  d1.style.top = "200px"
  d1.style.left = "200px"
  d1.style.height = '300px'
  d1.style.width = '70px'
  d1.style.color = "white"
  d1.style.zIndex = 2
  d1.style.position = "absolute"
  document.body.appendChild(d1)

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
// lobby()


let allLobrooms = []

function lobby2(a){


  // let currentRooms = [{"name":"hello","players":[{"id":"abcbbcbbcbbcbbc","color":"p","team":1},{"id":"bbcbbcbbcbbcbbc","color":"r","team":0}]}]
  let currentRooms = a

  allLobrooms.forEach((e)=>{
    document.getElementById("j"+e).remove()
      document.getElementById(e).remove()
      
    })
    allLobrooms = []

  currentRooms.forEach((e,i)=>{

    

    let PLRd = ""

    e.players.forEach((E)=>{
      PLRd+="|  id: "+E.id+"<br>|-  team: "+E.team+"<br>|-  color: "+E.color+"<br><br>"
    })


    let div = document.createElement("div")
    div.id = "di"+i
    allLobrooms.push(div.id)
    div.style.display = "inline-block"
    div.style.width += 20
    div.style.fontSize = "20px"
    div.style.zIndex = 20
    div.style.position = "relative"
    div.style.border = "3px solid rgb("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+")"
    div.style.color = "white"
    div.innerHTML = "room name: "+e.name+"<br><br><br>players:<br>"+PLRd
    document.body.appendChild(div)

    txt = document.createElement("button")
    txt.id = "jdi"+i
    txt.style.position = "relative"
    txt.zIndex = 200
    txt.innerHTML = "join"
    txt.onclick = ()=>{
      createRoom2(e)
    }
    document.getElementById("di"+i).appendChild(txt)

  })

  if(document.getElementById("reloadButton")===null){
  let btn = document.createElement("button")
  btn.innerHTML = "reload lobby"
  btn.style.backgroundColor = "#00000F"
  btn.id = "reloadButton"
  btn.style.color = "#00FFAF"
  btn.style.zIndex = 30
  btn.style.fontSize = "25px"
  btn.style.position = "relative"
  btn.onclick = ()=>{
    socket.emit("reloadLobby",ID)
  }
  document.body.appendChild(btn)
  }
  if(document.getElementById("createRoom")===null){
  let btn = document.createElement("button")
  btn.innerHTML = "create room"
  btn.style.backgroundColor = "#00000F"
  btn.id = "createRoom"
  btn.style.color = "#FFFFAF"
  btn.style.zIndex = 30
  btn.style.fontSize = "25px"
  btn.style.position = "relative"
  btn.onclick = ()=>{
    createRoom()
  }
  document.body.appendChild(btn)
  }

}
lobby2([])

function createRoom2(A){
  allLobrooms.forEach((e)=>{
      document.getElementById(e).remove()
    })
  document.getElementById("reloadButton").remove()
  document.getElementById("createRoom").remove()
  let div = document.createElement("div")

  div.id = "roomCreation"
  div.style.position = "relative"
  div.style.fontSize = "20px"
  div.style.top = Math.floor(window.innerHeight/10)+"px"
  // console.log(div.style.top,Math.floor(Window.innerHeight/10)+"px")
  div.style.left = "10%"
  div.style.width = "80%"
  div.style.height = "80%"
  div.innerHTML = "NAME: "+A.name+"<br>TYPE: "+A.type+"<br>YOUR TEAM: <br>YOUR COLOR:"
  div.style.zIndex = 2
  div.style.border = "3px solid rgb("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+")"
  div.style.color = "white"
  div.style.overflow = "auto"

  document.body.appendChild(div)


  txt = document.createElement("input")
  txt.id = "txt3"
  txt.style.marginLeft = "20px"
  txt.style.marginTop = "-23px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.value = "team1"
  txt.onchange = ()=>{
    let v = document.getElementById("txt3").value;
    console.log(v);
    txt.blur()
  }
  document.getElementById("roomCreation").appendChild(txt)
  txt = document.createElement("input")
  txt.id = "txt4"
  txt.style.marginLeft = "20px"
  txt.style.marginTop = "0px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.value = "p"
  txt.onchange = ()=>{
    let v = document.getElementById("txt4").value;
    console.log(v);
    txt.blur()
  }
  document.getElementById("roomCreation").appendChild(txt)

  txt = document.createElement("button")
  txt.id = "txt5"
  txt.style.marginLeft = "20px"
  txt.style.marginTop = "-64px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.innerHTML = "-> join <-"
  txt.onclick = ()=>{
    //name:type-team-color

    let t3 = document.getElementById("txt3").value;
    let t4 = document.getElementById("txt4").value;

    document.getElementById("txt3").remove()
    document.getElementById("txt4").remove()
    document.getElementById("txt5").remove()
    socket.emit("jointeam",[A.name+":"+A.type+"-"+t3+"-"+t4,ID])
    document.getElementById("roomCreation").innerHTML = "ROOM NAME: "+A.name+"<br>ROOM TYPE: "+A.type+"<br>YOUR TEAM: "+t3+"<br>YOUR COLOR: "+t4


    lobby()

  }
  document.getElementById("roomCreation").appendChild(txt)

}

function createRoom(){
  allLobrooms.forEach((e)=>{
      document.getElementById(e).remove()
    })
  document.getElementById("reloadButton").remove()
  document.getElementById("createRoom").remove()
  let div = document.createElement("div")

  div.id = "roomCreation"
  div.style.position = "relative"
  div.style.fontSize = "20px"
  div.style.top = Math.floor(window.innerHeight/10)+"px"
  // console.log(div.style.top,Math.floor(Window.innerHeight/10)+"px")
  div.style.left = "10%"
  div.style.width = "80%"
  div.style.height = "80%"
  div.innerHTML = "NAME: <br>TYPE: <br>YOUR TEAM: <br>YOUR COLOR:"
  div.style.zIndex = 2
  div.style.border = "3px solid rgb("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+")"
  div.style.color = "white"
  div.style.overflow = "auto"

  document.body.appendChild(div)

  let txt = document.createElement("input")
  txt.id = "txt4"
  txt.style.marginLeft = "20px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.value = "p"
  txt.onchange = ()=>{
    let v = document.getElementById("txt4").value;
    console.log(v);
    document.getElementById("txt4").blur()
  }
  document.getElementById("roomCreation").appendChild(txt)
  txt = document.createElement("input")
  txt.id = "txt3"
  txt.style.marginTop = "-22px"
  txt.style.marginLeft = "20px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.value = "team1"
  txt.onchange = ()=>{
    let v = document.getElementById("txt3").value;
    console.log(v);
    document.getElementById("txt3").blur()
  }
  document.getElementById("roomCreation").appendChild(txt)
  txt = document.createElement("input")
  txt.id = "txt2"
  txt.style.marginLeft = "20px"
  txt.style.marginTop = "-43px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.value = "t"
  txt.onchange = ()=>{
    let v = document.getElementById("txt2").value;
    console.log(v);
    document.getElementById("txt2").blur()
  }
  document.getElementById("roomCreation").appendChild(txt)
  
  
  txt = document.createElement("input")
  txt.id = "txt1"
  txt.style.marginTop = "-64px"
  txt.style.marginLeft = "20px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.value = "room1"

  txt.onchange = ()=>{
    let v = document.getElementById("txt1").value;
    console.log(v);
    document.getElementById("txt1").blur()
  }
  document.getElementById("roomCreation").appendChild(txt)


  txt = document.createElement("button")
  txt.id = "txt5"
  txt.style.marginLeft = "240px"
  txt.style.marginTop = "-64px"
  txt.style.position = "absolute"
  txt.zIndex = 3
  txt.innerHTML = "create and join"
  txt.onclick = ()=>{
    //name:type-team-color
    let t1 = document.getElementById("txt1").value;
    let t2 = document.getElementById("txt2").value;
    let t3 = document.getElementById("txt3").value;
    let t4 = document.getElementById("txt4").value;
    document.getElementById("txt1").remove()
    document.getElementById("txt2").remove()
    document.getElementById("txt3").remove()
    document.getElementById("txt4").remove()
    document.getElementById("txt5").remove()
    socket.emit("jointeam",[t1+":"+t2+"-"+t3+"-"+t4,ID])
    document.getElementById("roomCreation").innerHTML = "ROOM NAME: "+t1+"<br>ROOM TYPE: "+t2+"<br>YOUR TEAM: "+t3+"<br>YOUR COLOR: "+t4

    

    console.log("hi")

    lobby()

  }
  document.getElementById("roomCreation").appendChild(txt)

}


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
    mainCTX.fillStyle = "rgba("+(255-colotime)+","+colotime+","+colotime+",0.4)"
    mainCTX.fillRect(pxx,pyy,S-S*zotime,S)
  }else if(style == 3 || style == "reloading"){
    mainCTX.fillStyle = "rgba("+(255-colotime)+","+(255-colotime)+",0,0.35)"
    mainCTX.fillRect(pxx,pyy,S-S*zotime,S)
    mainCTX.fillStyle = "rgba("+(255-colotime)+",0,0,0.35)"
    mainCTX.fillRect(pxx,pyy+S*0.3,S-S*zotime,S*0.4)
  }else if(style == 4 || style == "mine"){
    mainCTX.fillStyle = "rgba(255,255,0,0.5)"
    mainCTX.fillRect(pxx,pyy,S,S*zotime)
  }else if(style == 4 || style == "antiMine"){
    mainCTX.fillStyle = "rgba(255,0,0,0.35)"
    mainCTX.fillRect(pxx,pyy,S,S*zotime)
  }

}

var MRef = {"FPS":30,"FPSR":1/30,"MTS":800,"vision":0,"wholeHeight":0,"wholeWidth":0,"MTD":{},"buttonW":250,"buttonH":100}


class game{
  static state = "lobby"
  static map = {}
  static resources = {}
  static slines = []
  static dmgnums = []

  static shiftingInfo = {"to":[0,0],"toggle":false}

  static enDict = {}
  static camera = [0,0]
  static enRef = {}
  static selectedLayer = 1

  static mainEnRef = {}

  static slineRef = {
    "soldier":{"life":800,"size":7,"reducing":true},
    "sniper":{"life":1800,"size":8,"reducing":true},
    "tank":{"life":1800,"size":17,"reducing":true},
    "medic":{"life":1200,"size":7}
  }

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


    let deleteButtonsArr = ["b1","t1","roomCreation","d1"]
    deleteButtonsArr.forEach((e)=>{
      document.getElementById(e).remove()
    })

    let txtb = document.createElement('input')
    txtb.id = "textInput"
    txtb.style.left = (window.innerWidth-200)+"px"
    txtb.style.top = (window.innerHeight-75)+"px"
    txtb.width = "200px"
    txtb.height = "75px"
    txtb.style.backgroundColor = "cyan"
    txtb.style.position = "absolute"
    txtb.style.zIndex = 3
    document.body.appendChild(txtb)

    txtb = document.createElement('button')
    txtb.id = "textToggle"
    txtb.style.left = (window.innerWidth-300)+"px"
    txtb.style.top = (window.innerHeight-75)+"px"
    txtb.width = "100px"
    txtb.height = "75px"
    txtb.style.backgroundColor = "red"
    txtb.style.position = "absolute"
    txtb.innerHTML = "chatBox"
    txtb.data = {"toggled":false}
    txtb.onclick = ()=>{
      let d = document.getElementById("textToggle")
      if(!d.data.toggle){

        console.log("turn on txbx")
      }
      d.data.toggle = !d.data.toggle
    }
    txtb.style.zIndex = 3
    document.body.appendChild(txtb)

    let t1 = document.createElement("div");
    t1.innerHTML = "act 1"
    t1.id = "t1"
    t1.style.top = "0px"
    t1.style.userSelect = "none"
    t1.style.color = "white"
    t1.style.font = "17px Arial"
    t1.style.left = Math.floor(MRef.wholeWidth+2)+"px"
    t1.style.height = Math.floor(MRef.buttonH)+'px'
    t1.style.width = Math.floor(MRef.buttonW)+'px'
    t1.style.zIndex = 2
    t1.style.position = "absolute"
    document.body.appendChild(t1)
    t1 = document.createElement("div");
    t1.innerHTML = "act 2"
    t1.id = "t2"
    t1.style.userSelect = "none"
    t1.style.color = "white"
    t1.style.font = "17px Arial"
    t1.style.top = Math.floor(MRef.buttonH)+"px"
    t1.style.left = Math.floor(MRef.wholeWidth+2)+"px"
    t1.style.height = Math.floor(MRef.buttonH)+'px'
    t1.style.width = Math.floor(MRef.buttonW)+'px'
    t1.style.zIndex = 2
    t1.style.position = "absolute"
    document.body.appendChild(t1)
    t1 = document.createElement("div");
    t1.id = "t3"
    t1.innerHTML = "act 3"
    t1.style.userSelect = "none"
    t1.style.color = "white"
    t1.style.font = "17px Arial"
    t1.style.top = Math.floor(MRef.buttonH*2)+"px"
    t1.style.left = Math.floor(MRef.wholeWidth+2)+"px"
    t1.style.height = Math.floor(MRef.buttonH)+'px'
    t1.style.width = Math.floor(MRef.buttonW)+'px'
    t1.style.zIndex = 2
    t1.style.position = "absolute"
    document.body.appendChild(t1)
    t1 = document.createElement("div");
    t1.id = "t4"
    t1.innerHTML = "act 4"
    t1.style.userSelect = "none"
    t1.style.color = "white"
    t1.style.font = "17px Arial"
    t1.style.top = Math.floor(MRef.buttonH*3)+"px"
    t1.style.left = Math.floor(MRef.wholeWidth+2)+"px"
    t1.style.height = Math.floor(MRef.buttonH)+'px'
    t1.style.width = Math.floor(MRef.buttonW)+'px'
    t1.style.zIndex = 2
    t1.style.position = "absolute"
    document.body.appendChild(t1)

    setTimeout(()=>{
      B.selection = "none"
    })

  }

  static OtM(x,y){
    return([Math.floor(x/MRef.MTS),Math.floor(y/MRef.MTS)])
  }

  static ss = {"mode":"inspect","ax":0,"ay":0,"x":0,"y":0,"boxes":"main","selEn":false}
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

      if(this.ss.selEn === false && this.ss.ax == e[1].x&& this.ss.ay == e[1].y&& this.selectedLayer == e[1].layer){
        EHAND.updateSelector(0,0,"add")
      }

    } else {
      let en = this.enDict[e[0]]
      if(en != undefined && this.ss.selEn !== false && this.ss.ax == en.x&& this.ss.ay == en.y&& this.selectedLayer == en.layer){
        this.ss.selEn = false
      } 
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
          if(this.ss.selEn !== false && this.ss.ax == en.x&& this.ss.ay == en.y&& this.selectedLayer == en.layer){
            this.ss.selEn = false
          }
          delete this.enDict[e]
        }
      })
    })
    
  }


  static pushDmgnum(e){
    e[1][2] = 1000 + e[1][0]
    this.dmgnums[e[0]] = e[1]
  }

  static numDecrease(){
    let objk = Object.keys(this.dmgnums)
    objk.forEach((e,i)=>{
        this.dmgnums[e][2] -= MRef.FPSR*1000
        if(this.dmgnums[e][2] <= 0){
          delete this.dmgnums[e]
          return;
        }
    })
  }

  static renderDmgNums(a){
    a.forEach((e)=>{
      if(this.dmgnums[e[0]][0] >= 0){
        mainCTX.fillStyle = "rgb("+(Math.random()*170+20)+",0,0)"
        mainCTX.strokeStyle = "rgb("+(Math.random()*170+20)+",0,0)"
      } else {
        mainCTX.fillStyle = "rgb(0,"+(Math.random()*170+20)+",200)"
        mainCTX.strokeStyle = "rgb(0,"+(Math.random()*170+20)+",200)"
      }
      let size = 30
      if(this.dmgnums[e[0]][1]){
        size += 7
      }
      mainCTX.font = "bold "+size+"px serif"
      mainCTX.textAlign = "center"
      mainCTX.fillText(Math.abs(this.dmgnums[e[0]][0]),MRef.MTS*(0.5+e[1]),MRef.MTS*e[2]+MRef.MTS*(this.dmgnums[e[0]][2]*0.001-0.2))     
      mainCTX.textAlign = "left"
    })
  }

  static pushSline(e){
    let info = this.slineRef[e.name]
    e.life = info.life
    e.size = info.size
    e.maxlife = e.life
    e.info = info
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
        if(e.info.reducing){
          mainCTX.lineWidth = e.size*(e.life/e.maxlife)
        }else{
          mainCTX.lineWidth = e.size
        }
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
      case "soldier":
        return("rgba("+(mr*255)+",0,0,"+lp+")")
        break;
      case "sniper":
      case "tank":
        return("rgba("+(mr*255)+",0,0,"+(lp/2+0.5)+")")
        break;
      case "medic":
        return("rgba(0,"+(mr*255)+",20,"+(lp/2+0.5)+")")
        break;

    }
  }

  static pmu(e){
    game.map = {"height":game.map.height,"width":game.map.width,"tiles":e.map}
  }


  static selectedEntity(){
    let out = false
    let enobj = Object.keys(game.enDict)
    enobj.forEach((e)=>{
      let en = game.enDict[e]
      if(en.layer == game.selectedLayer && en.x == game.ss.ax && en.y == game.ss.ay){
        out = e
      }
    })
    return(out)
  }

}


class EHAND{
  static mouseHandler(e){

    if(game.ms.held){
      return;
    }

    if(inRect(mouseX,mouseY,0,0,MRef.wholeWidth,MRef.wholeHeight)){
      game.ss.boxes = "main"
      let t = game.OtM(mouseX,mouseY)
      this.updateSelector(t[0],t[1],"abs")

    } else if(inRect(mouseX,mouseY,MRef.wholeWidth,0,MRef.wholeWidth+MRef.buttonW,MRef.buttonH*B.buttons.length)){
      let bno = Math.floor(mouseY/MRef.buttonH)
      this.buttonPressed(bno)
    } else {
      game.ss.boxes = "out"
    }
    game.ms.held = "mouse"
  }

  static AmouseHandler(e){

    if(game.ms.held){
      return;
    }

    e.x = e.x * MRef.MTS + MRef.MTS/2
    e.y = e.y * MRef.MTS + MRef.MTS/2

      game.ss.boxes = "main"
      let t = game.OtM(e.x,e.y)
      this.updateSelector(t[0],t[1],"abs")

    
    game.ms.held = "artificial"
  }

  static updateSelector(x,y,type){
    if(type == "add"){
      game.ss.x += x
      game.ss.y += y
    } else {
      game.ss.x = x
      game.ss.y = y
    }
    let A = reApos(game.ss.x+game.camera[0],game.ss.y+game.camera[1],game.map.width,game.map.height)
    game.ss.ax = A[0]
    game.ss.ay = A[1]

    game.ss.selEn = game.selectedEntity()

    let t1 = document.getElementById('t1')
    let t2 = document.getElementById('t2')
    let t3 = document.getElementById('t3')
    let t4 = document.getElementById('t4')

    if(game.ss.selEn !== false){
      let dr = B.displayReference[game.enDict[game.ss.selEn].type]
      if(dr != undefined){
      t1.innerHTML = dr[0].disp
      t2.innerHTML = dr[1].disp
      t3.innerHTML = dr[2].disp
      t4.innerHTML = dr[3].disp
    } else {
      t1.innerHTML = "act 1"
      t2.innerHTML = "act 2"
      t3.innerHTML = "act 3"
      t4.innerHTML = "act 4"
    }} else {
      t1.innerHTML = "act 1"
      t2.innerHTML = "act 2"
      t3.innerHTML = "act 3"
      t4.innerHTML = "act 4"
    }

  }

  static heldMouseDown(e,type){
    if(type == "n"){
    if(inRect(mouseX,mouseY,0,0,MRef.wholeWidth,MRef.wholeHeight)){
      game.ss.boxes = "main"
      let t = game.OtM(mouseX,mouseY)
      this.updateSelector(t[0],t[1])
    } else {
      game.ss.boxes = "out"
    }}

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
        "vx":game.ss.x-game.ms.heldSpace[0],"vy":game.ss.y-game.ms.heldSpace[1],"layer":game.selectedLayer

      })
      console.log("dragged from:"+JSON.stringify(game.ms.heldSpace)+" to "+game.ss.ax+","+game.ss.ay)
      EHAND.updateSelector(game.ss.x,game.ss.y,"abs")
    } else {
      socket.emit("click",{"sel":B.selection,"id":ID,"x":game.ss.ax,"y":game.ss.ay,"mode":"main","layer":game.selectedLayer})
      console.log("clicked on: "+game.ss.ax+","+game.ss.ay)
    }} else if(game.ss.boxes == "out"){
  
    }

    // if(B.selection != "none" && B.selection != 0 && B.selection != 1 && B.selection != 2 && B.selection != 3 ){
    //   B.selection = "none"
    // }

    game.ms.hacted = false
    game.ss.mode = "inspect"
    game.ms.heldTime = 0
  }

  static repeat(e){
    if(game.ms.held == "mouse"){
      game.ms.heldTime++
      this.heldMouseDown(e,"n")
    }
    if(game.ms.held == "artificial"){
      game.ms.heldTime++
      this.heldMouseDown(e,"a")
    }

    B.renderAll()
    this.renderResources()
    this.renderScan()
    game.renderSlines()
  }

  static buttonPressed(bno){
    let bh = MRef.buttonH
    

    if(B.BREF.normal[B.selection]){
      if(B.selection == "none" || B.selection != bno){
        B.selection = "none"
        socket.emit("button",{"sel":bno,"id":ID,"x":game.ss.ax,"y":game.ss.ay})
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
    mainCTX.fillRect(MRef.wholeWidth+MRef.buttonW,0,200,250)
    let objk = Object.keys(game.resources)
    objk.forEach((e,i)=>{
      mainCTX.fillStyle = "#FFFFFF"
      mainCTX.font = "27px Arial"
      mainCTX.fillText(e+": "+game.resources[e],MRef.wholeWidth+MRef.buttonW,20+30*i)
    })

  }
  static renderScan(){
    mainCTX.fillStyle = "#000020"
    mainCTX.fillRect(MRef.wholeWidth+MRef.buttonW,250,200,500)
    
    mainCTX.fillStyle = "#FFFF00"
    mainCTX.font = "24px Arial"

    if(game.ss.selEn !== false){
      let en = game.enDict[game.ss.selEn]
        mainCTX.fillText("type: "+en.type,MRef.wholeWidth+MRef.buttonW,270)
        mainCTX.fillText("team: "+en.team,MRef.wholeWidth+MRef.buttonW,300)
        if(en.ownerID == ID){
          mainCTX.fillText("hp: "+en.hp,MRef.wholeWidth+MRef.buttonW,330)
          if(en.income != undefined){
            mainCTX.fillText("income: "+en.income[0]+"/"+((en.income[2]/1000).toFixed(1))+"s",MRef.wholeWidth+MRef.buttonW,390)
          }
        }
      }
  

  }


}


class B{

  static displayReference = {
  }

  static disprefUpdate(){
      this.displayReference = {"factory":{
        "0":{
          "disp":"act 1 - spawn architect </br>cost: "+
          game.enRef.architect.m+"</br>spawn range: "+
          game.enRef.architect.r+"</br>build time: "+
          ((game.mainEnRef.architect.cooldown[2]/1000).toFixed(1))+"s"
        },
        "1":{
          "disp":"act 2 - spawn soldier </br>cost: "+
          game.enRef.soldier.m+"</br>spawn range: "+
          game.enRef.soldier.r+"</br>build time: "+
          ((game.mainEnRef.soldier.cooldown[2]/1000).toFixed(1))+"s"
        },
        "2":{
          "disp":"act 3 - build tank </br>cost: "+
          game.enRef.tank.m+"</br>spawn range: "+
          game.enRef.tank.r+"</br>build time: "+
          ((game.mainEnRef.tank.cooldown[2]/1000).toFixed(1))+"s"
        },
        "3":{
          "disp":"act 4 - spawn sniper </br>cost: "+
          game.enRef.sniper.m+"</br>spawn range: "+
          game.enRef.sniper.r+"</br>build time: "+
          ((game.mainEnRef.sniper.cooldown[2]/1000).toFixed(1))+"s"
        }
      },
      "architect":{
        "0":{
          "disp":"act 1 - build mine</br>cost: "+
          game.enRef.mine.m+"</br>spawn range: "+
          game.enRef.mine.r+"</br>build time: "+
          ((game.mainEnRef.mine.cooldown[2]/1000).toFixed(1))+"s</br>built only on mountains"
        },
        "1":{
          "disp":"act 2 - build road</br>cost: "+
          game.enRef.road.m+"</br>spawn range: "+
          game.enRef.road.r+"</br>build time: "+
          ((game.mainEnRef.road.cooldown[2]/1000).toFixed(1))+"s</br>increases movement speed"
        },
        "2":{
          "disp":"act 3 - build armory</br>cost: "+
          game.enRef.armory.m+"</br>spawn range: "+
          game.enRef.armory.r+"</br>build time: "+
          ((game.mainEnRef.armory.cooldown[2]/1000).toFixed(1))+"s</br>unlocks units"
        },
        "3":{
          "disp":"act 4"
        }
      },
      "armory":{
        "0":{
          "disp":"act 1 - spawn medic</br>cost: "+
          game.enRef.medic.m+"</br>spawn range: "+
          game.enRef.medic.r+"</br>build time: "+
          ((game.mainEnRef.medic.cooldown[2]/1000).toFixed(1))+"s"
        },
        "1":{"disp":"act 1 - spawn combat jeep</br>cost: "+
          game.enRef["combat jeep"].m+"</br>spawn range: "+
          game.enRef["combat jeep"].r+"</br>build time: "+
          ((game.mainEnRef["combat jeep"].cooldown[2]/1000).toFixed(1))+"s</br>includes 4 soldiers"},
        "2":{"disp":"act 3"},
        "3":{"disp":"act 4"}
      }

    }
  }


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


    if(this.selection != "none"){
      if(B.BREF.normal[B.selection]){
        boarderRect(MRef.wholeWidth,MRef.buttonH*this.selection,MRef.buttonW,
        MRef.buttonH,4,this.buttons[this.selection].color)
      } else {
        boarderRect(0,0,MRef.wholeWidth,MRef.wholeHeight,6,this.specialSel.color)
      }
    }

    for(let i = 0; i < this.buttons.length; i++){
    boarderRect(MRef.wholeWidth,MRef.buttonH*i,MRef.buttonW,
        MRef.buttonH,4,this.buttons[i].color)}


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

  if(pressedKeys[key] === true || game.state == "lobby"){
    return;
  } else {
    pressedKeys[key] = true
  }

  if(key == "o"){
    // game.camera = [0,0]
    let enobj = Object.keys(game.enDict)
    enobj.forEach((a)=>{
      let e = game.enDict[a]
      if(e.type == "factory" && e.ownerID == ID){
        game.camera = [e.x-7,e.y-7]
      }
    })
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

    switch(key){
      case "W":
        game.shiftingInfo.to[1] -= 1
        break;
      case "S":
        game.shiftingInfo.to[1] += 1
        break;
      case "A":
        game.shiftingInfo.to[0] -= 1
        break;
      case "D":
        game.shiftingInfo.to[0] += 1
        break;
      case " ":
        EHAND.AmouseHandler({"x":game.shiftingInfo.to[0]+game.ss.x,"y":game.shiftingInfo.to[1]+game.ss.y})
        break;
      case "1":
        EHAND.buttonPressed(0)
        break;
      case "2":
        EHAND.buttonPressed(1)
        break;
      case "3":
        EHAND.buttonPressed(2)
        break;
      case "4":
        EHAND.buttonPressed(3)
        break;
      
    }

})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  if(game.state == "lobby"){
    return;
  }
  let key = e.key
  pressedKeys[key] = false

  if(key[0] == "A" && key[1] == "r"){
    clearInterval(moveVals[key])
    clearTimeout(moveVals[key])
    clearInterval(moveVals[key])
  }

  if(key == "w"){
     EHAND.updateSelector(0,-1,"add")
    } else if(key == "s"){
     EHAND.updateSelector(0,1,"add")
    } else if(key == "a"){
     EHAND.updateSelector(-1,0,"add")
    } else if(key == "d"){
     EHAND.updateSelector(1,0,"add")
    } else if(key == " "){
      EHAND.mouseUpHandler(undefined)
    }

  if(key == "Shift"){
    let gc = game.shiftingInfo.to
    EHAND.updateSelector(gc[0],gc[1],"add")
    game.shiftingInfo.to = [0,0]
  }

      socket.emit("key",{"id":ID,"key":key,"layer":game.selectedLayer})

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

    let numrender = []

    for(let i = 0; i < MRef.vision; i++){
      for(let j = 0; j < MRef.vision; j++){
        let gp = getApos(i,j)
        let pos = gp[0] + ","+gp[1]

        if(game.dmgnums[pos] != undefined){
          numrender.push([pos,i,j])
        }

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


    let enobj = Object.keys(game.enDict)
    enobj.sort((a,b)=>{return(game.enDict[a].layer-game.enDict[b].layer)})

    // console.log(enobj)

    enobj.forEach((e,i)=>{
      entityRender(game.enDict[e])
    })


    EHAND.repeat(e)
    game.renderDmgNums(numrender)
    game.numDecrease()
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

  let ax = rrp[0]
  let ay = rrp[1]

  if(ax > MRef.vision-1 || ay > MRef.vision-1){
    return
  }

  let S = MRef.MTS

  switch(e.type){
    case "factory":
      mainCTX.fillStyle = e.color
      mainCTX.fillRect(ax*S+S*0.075,ay*S+S*0.075,S-S*0.15,S-S*0.15)
      break;
    case "armory":
      mainCTX.fillStyle = e.color
      mainCTX.beginPath()
      mainCTX.moveTo(ax*S+S*0.2,ay*S+S*0.075)
      mainCTX.lineTo(ax*S+S*0.8,ay*S+S*0.075)
      mainCTX.lineTo(ax*S+S*0.925,ay*S+S*0.925)
      mainCTX.lineTo(ax*S+S*0.075,ay*S+S*0.925)
      mainCTX.closePath()
      mainCTX.fill()
      break;
    case "combat jeep":
      mainCTX.fillStyle = e.color
      mainCTX.beginPath()
      mainCTX.moveTo(ax*S+S*0.2,ay*S+S*0.2)
      mainCTX.lineTo(ax*S+S*0.8,ay*S+S*0.2)
      mainCTX.lineTo(ax*S+S*0.925,ay*S+S*0.8)
      mainCTX.lineTo(ax*S+S*0.075,ay*S+S*0.8)
      mainCTX.closePath()
      mainCTX.fill()
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
      mainCTX.arc(ax*S+S*0.5, ay*S+S*0.5, MRef.MTD[0.1]*2.25, 0, 2 * Math.PI, false);
      mainCTX.moveTo(ax*S+S*0.5,ay*S+S*0.15)
      mainCTX.lineTo(ax*S+S*0.5,ay*S+S-S*0.15)
      mainCTX.moveTo(ax*S+S*0.15,ay*S+S*0.5)
      mainCTX.lineTo(ax*S+S-S*0.15,ay*S+S*0.5)
      mainCTX.lineWidth = 4;
      mainCTX.strokeStyle = e.color;
      mainCTX.stroke();
      break;
    case "medic":
      mainCTX.beginPath();
      mainCTX.moveTo(ax*S+S*0.5,ay*S+S*0.15)
      mainCTX.lineTo(ax*S+S*0.5,ay*S+S-S*0.15)
      mainCTX.moveTo(ax*S+S*0.15,ay*S+S*0.5)
      mainCTX.lineTo(ax*S+S-S*0.15,ay*S+S*0.5)
      mainCTX.lineWidth = 6;
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
    case "road":
      mainCTX.fillStyle = "rgba(255,255,0,0.6)"
      mainCTX.fillRect(ax*S,ay*S+S*0.25,S,S*0.5)
      break;
  }

  let DN = DNOW()

  if(e.cooldown[0] != "none"){
    let ec = e.cooldown

    if(DN-ec[1] < 0){
      ec[1] += (DN-ec[1])
    }

    if(DN-ec[1]>ec[2]){
      e.cooldown = ["none",0,0]
    } else {
      timerDraw(DN-ec[1],ec[2],ax,ay,e.cooldown[0])
    }
  } if(e.income != undefined){
    let ei = e.income
    if(DN-ei[1] < 0){
      ei[1] += (DN-ei[1])
    }

    if(e.income[0] > 0){
    timerDraw((DN-ei[1])%ei[2],ei[2],ax,ay,"mine")} else {
      timerDraw((DN-ei[1])%ei[2],ei[2],ax,ay,"antiMine")
    }
  }
}

function DNOW(){
  return(Date.now())
}

