
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
var TEAM = window.prompt("what room would you join?","0:t")+"-"+window.prompt("what team would you join?","0")+"-"+window.prompt("what color?","p")

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
  b1.onclick = ()=>{startGame();console.log("hi")}
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
  mainCTX.stroke();
}


var MRef = {"MTS":800}


class game{
  static state = "lobby"
  static map = {}
  static startProcess(e){

    
    this.map = e.map
    MRef.MTS = document.getElementById("t1").value
    MRef.MTS /= e.map.width>e.map.height?e.map.width:e.map.height
    this.state = "started"


    let deleteButtonsArr = ["b1","t1"]
    deleteButtonsArr.forEach((e)=>{
      document.getElementById(e).remove()
    })
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



document.addEventListener("mousedown",(e)=>{


})


document.addEventListener("keydown",(e)=>{
  // e.preventDefault()
  let key = e.key



})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key



})


let mainLoopint = setInterval(()=>{
  repeat()
},1000/30)


function repeat(){
  if(game.state == "started"){
    mainCTX.fillStyle = "#303030"
    mainCTX.clearRect(0,0,wWidth,wHeight)
    mainCTX.fillRect(0,0,wWidth,wHeight)

    let mapArr = Object.keys(game.map)
    mapArr.forEach((e,i)=>{
      let coord = e.split(",")
      let tileInfo = game.map[e]

      mainCTX.fillStyle = tileInfo.color
      mainCTX.fillRect(MRef.MTS*coord[0],MRef.MTS*coord[1],MRef.MTS,MRef.MTS)
    })

    boarderRect(MRef.MTS,MRef.MTS,MRef.MTS,MRef.MTS,2,"white")


  }
}




