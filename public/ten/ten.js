
let mainCanvas = document.getElementById("myCanvas")
mainCanvas.style.zIndex = 1
let wWidth = window.innerWidth
let wHeight = window.innerHeight
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


let SIZE = 820
let S1 = SIZE/3
let S2 = S1/3

class game{

  static turn = 1
  static map = {}
  static objkm = []
  static objkm2 = []
  static myNum = 0
  static mainloop = 0
  static started = false

  static startRm(e){
    let m = e[0]
    this.updateMap(m)
    this.myNum = e[1]
    this.started = true
    this.mainloop = setInterval(()=>{
      this.repeat()
    },200)
  }

  static updateMap(e){
    this.map = e
    this.objkm = Object.keys(e)
    this.objkm.forEach((E)=>{
      objkm2.push(Object.keys(e[E].minmap))
    })
  }

  static col(e){
    return(e == this.myNum ? "#00A000" : "#A00000")
  }

  static repeat(){
    objkm.forEach((e,i)=>{
      if(map[e].checked !== 0){
        let split = e.split(",")
        mainCTX.fillStyle = this.col(map[e].checked)
        mainCTX.fillRect(e[0]*S1,e[1]*S1,S1,S1)

        return;
      }
    })
  }


}