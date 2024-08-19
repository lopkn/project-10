
let Width = window.innerWidth
let Height = window.innerHeight

// let myCanvas = document.getElementById("myCanvas")

//   myCanvas.width = Math.floor(Width)
//   myCanvas.height = Math.floor(Height)
//   myCanvas.style.width = Math.floor(Width)+"px"
//   myCanvas.style.height = Math.floor(Height)+"px"
//   myCanvas.style.top = "0px"
//   myCanvas.style.left = "0px"

// let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


let room;
const socket = io.connect('/')
let GAMESESSION = "G10.8"
socket.emit("JOINGAME",GAMESESSION)
var ID = 0
socket.on("acknowledge G10.8",(e)=>{ID = e; console.log("joined as "+ID);room = prompt("room")
  socket.emit("room",{"name":room})})
socket.on("return",(e)=>{console.log(e)

  document.getElementById("results").innerText = e

})
socket.on("message",(e)=>{console.log(message)})
let b0 = document.createElement("button")
let b1 = document.createElement("button")
let res = document.createElement("div")

b1.innerHTML = "send 1"
b0.innerHTML = "send 0"
res.innerText = "results appear here"

document.body.appendChild(b1)
document.body.appendChild(b0)
document.body.appendChild(res)

b1.onclick = ()=>{socket.emit("measure",{"room":room,"input":1})}
b0.onclick = ()=>{socket.emit("measure",{"room":room,"input":0})}
