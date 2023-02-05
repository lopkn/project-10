
let mainCanvas = document.getElementById("myCanvas")
mainCanvas.style.zIndex = 1
let wWidth = window.innerWidth
let wHeight = window.innerHeight
mainCanvas.width = wWidth > wHeight?wHeight:wWidth
mainCanvas.height = wWidth > wHeight?wHeight:wWidth
let WR = wWidth > wHeight?wHeight:wWidth
let mainCTX = mainCanvas.getContext("2d")

const socket = io.connect('/')

let GAMESESSION = "G10.4"
socket.emit("JOINGAME",GAMESESSION)

var ID = 0
// var TEAM = window.prompt("what room would you join?","0")+":"+window.prompt("room type?","t")+"-"+window.prompt("what team would you join?","0")+"-"+window.prompt("what color?","p")

socket.on("acknowledge G10.4",(e)=>{ID = e; console.log("joined as e")
  let rm = window.prompt("which room?","0")
  socket.emit("joinRm",[ID,rm])
})

socket.on("startRm",(e)=>{game.startRm(e)})
socket.on("updateMap",(e)=>{game.updateMap(e)})


let SIZE = WR


let _b = document.createElement("button")
_b.style.top = Math.floor(SIZE/2)+"px"
_b.style.left = Math.floor(SIZE) + "px"
_b.style.width = "100px"
_b.style.backgroundColor = "#303030"
_b.style.color = "white"
_b.style.height = "100px"
_b.style.position = "absolute"
_b.id = "darkB"
_b.innerHTML = "toggleBlack"
_b.onclick = ()=>{
  game.dark = true
  document.getElementById("darkB").remove()
}
document.body.appendChild(_b)


let S1 = SIZE/3
let S2 = S1/3

class game{

  static dark = false
  static turn = 1
  static map = {}
  static objkm = []
  static objkm2 = []
  static myNum = 0
  static mainloop = 0
  static started = false

  static limiting = "all"

  static startRm(e){
    let m = e[0]
    this.updateMap([e[0],e[1],"all"])
    this.myNum = e[2]
    this.started = true
    this.mainloop = setInterval(()=>{
      this.repeat()
    },200)
  }

  static updateMap(e){
    this.map = e[0]
    this.limiting = e[2]
    this.turn = e[1]
    this.objkm2 = []
    this.objkm = Object.keys(this.map)
    this.objkm.forEach((E)=>{
      console.log(E)
      this.objkm2.push(Object.keys(this.map[E].minmap))
    })
  }

  static col(e){
    if(e == 0){
      return("rgba(0,0,0,0)")
    }
    return(e == this.myNum ? "#00A000" : "#A00000")
  }

  static repeat(){
      mainCTX.fillStyle = "black"
      mainCTX.fillRect(0,0,wWidth,wHeight)

    if(this.limiting == 'all'){
      if(this.myNum == this.turn){
        mainCTX.fillStyle = "rgba(0,255,255,0.4)"
      } else {
        mainCTX.fillStyle = "rgba(255,255,0,0.4)"
      }
      mainCTX.fillRect(0,0,wWidth,wHeight)
    } else {
      let SS = this.limiting.split(",")
      if(this.myNum == this.turn){
        mainCTX.fillStyle = "rgba(0,255,255,0.4)"
      } else {
        mainCTX.fillStyle = "rgba(255,255,0,0.4)"
      }
      mainCTX.fillRect(SS[0]*S1,SS[1]*S1,S1,S1)
    }

    this.objkm.forEach((e,i)=>{
      let split = e.split(",")
      if(this.map[e].checked !== 0){
        
        mainCTX.fillStyle = this.col(this.map[e].checked)
        mainCTX.fillRect(split[0]*S1,split[1]*S1,S1,S1)

        return;
      }

      this.objkm2[i].forEach((E)=>{
        let split2 = E.split(",")
        mainCTX.fillStyle = this.col(this.map[e].minmap[E].checked)
        mainCTX.fillRect(split[0]*S1+split2[0]*S2,split[1]*S1+split2[1]*S2,S2,S2)

      })

    })

    mainCTX.strokeStyle ="#A0A0A0"
    for(let i = 0; i < 10; i++){
      if(i%3 == 0){
        mainCTX.lineWidth = 8
      } else {
        mainCTX.lineWidth = 3
      }
      mainCTX.beginPath()
      mainCTX.moveTo(i*S2,0)
      mainCTX.lineTo(i*S2,wHeight)
      mainCTX.stroke()
    }
    for(let i = 0; i < 10; i++){
      if(i%3 == 0){
        mainCTX.lineWidth = 8
      } else {
        mainCTX.lineWidth = 3
      }
      mainCTX.beginPath()
      mainCTX.moveTo(0,i*S2)
      mainCTX.lineTo(wWidth,i*S2)
      mainCTX.stroke()
    }

    if(game.dark){
      mainCTX.fillStyle = "black"
      mainCTX.fillRect(0,0,wWidth,wHeight)
    }


  }


}


onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

document.addEventListener("mousedown",(e)=>{

  if(game.dark){
    game.dark = false
    let _b = document.createElement("button")
    _b.style.top = Math.floor(SIZE/2)+"px"
    _b.style.left = Math.floor(SIZE) + "px"
    _b.style.width = "100px"
    _b.style.height = "100px"
    _b.style.backgroundColor = "#303030"
    _b.style.color = "white"
    _b.style.position = "absolute"
    _b.id = "darkB"
    _b.innerHTML = "toggleBlack"
    _b.onclick = ()=>{
      game.dark = true
      document.getElementById("darkB").remove()
    }
    document.body.appendChild(_b)
    return
  }

  if(mouseX > S1*3 || mouseY > S1*3){
    return;
  }

  let boxx = Math.floor(mouseX/S1)
  let boxy = Math.floor(mouseY/S1)

  let boxx2 = Math.floor(mouseX/S2)%3
  let boxy2 = Math.floor(mouseY/S2)%3

  mainCTX.fillStyle = "rgba(200,0,200,0.4)"
  mainCTX.fillRect(boxx*S1,boxx2*S2,boxy*S1+boxy*S2,S2,S2)

  socket.emit("click",{"id":ID,"x":boxx,"y":boxy,"c":boxx+","+boxy,"c2":boxx2+","+boxy2,"bx":boxx2,"by":boxy2})

  console.log(boxx+","+boxy,boxx2+","+boxy2)
})


