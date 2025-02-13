
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = Math.floor(Width)+"px"
  myCanvas.style.height = Math.floor(Height)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")





let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


const socket = io.connect('/')
let GAMESESSION = "G10.9"
socket.emit("JOINGAME",GAMESESSION)
var ID = 0;
socket.on("acknowledge G10.9",(e)=>{
  ID = e
  console.log("joined as: "+ID)

requestAnimationFrame(mainLoop)
})

var jp
socket.on("update",(e)=>{
  jp = JSON.parse(e)
  ballArr = Object.values(jp)
  // console.log(e)
})



class LCanvas{ //lopkns template canvas
  constructor(w=100,h=100,id=("LCanvas-"+Math.random())){
    this.canvas = document.createElement("canvas")
    this.canvas.id = id
    this.ctx = this.canvas.getContext("2d")
    this.canvas.style.position = "absolute"
    this.canvas.style.top = "0px"
    this.canvas.style.left = "0px"
    this.canvas.zIndex = "1500"
    this.canvas.width = w
    this.canvas.height = h
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    document.body.appendChild(this.canvas)
    return(this)
  }

  fitScreenSize(){
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  }

  oneTimeDown(f){ // pass in a function for what to do with one click
    this.canvas.addEventListener("mousedown",f,{once:true})
  }

  getPixelRGB(x,y){
    let d = this.ctx.getImageData(x, y, 1, 1).data
    return(d)
  }


}


function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}


var frameFuncs = []

function mainLoop(time){
  frameFuncs.forEach((e)=>{
    e(time)
  })
  requestAnimationFrame(mainLoop)
}

function oneTimeTrustedButton(f){
  let button = document.createElement("button")
  button.style.position = "absolute"
  button.style.backgroundColor = "purple"
  button.innerText = "one time verifier"
  button.style.top = button.style.left = "0px"

  button.style.zIndex = 5000
  button.addEventListener("click",(e)=>{f(e);button.remove()},{once:true})
  document.body.appendChild(button)
}


function Lvideo(type="screen",append=false){
    let video = document.createElement('video')
    video.id = "Lvideo-"+Math.random()
    video.setAttribute("autoplay","autoplay")
    // document.body.append(video)
    if(type=="screen"){
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });video.srcObject = stream;})
    } else {
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });video.srcObject = stream;})
    }
    return(video)
  }

function copyToCanvas(img,Lcan){
  Lcan.ctx.drawImage(img, 0, 0, Lcan.canvas.width, Lcan.canvas.height);
}

function setDefaultAbsolute(elm){
  elm.style.position = "absolute"
  elm.style.top = elm.style.left = "0px"
}




class Lcolorf{ //lopkn's color functions
  static dictify(arr){ //turns arrays of numbers into arrays of dicts
    let outarr = []
    for(let i = 0; i < arr.length; i+=4){
      outarr.push({"r":arr[0],"g":arr[1],"b":arr[2],"a":arr[3]})
    }
    return(outarr)
  }
  static colorDistA(arr1,arr2){//only works on Arrays of numbers //arr2 should be same length or shorter
    let dst = 0
    for(let i = 0; i < arr2.length; i++){
      dst += Math.abs(arr1[i]-arr2[i])
    }
    return(dst)
  }
}

class LPerceptron{ //it should have input name, input value. each input should have a multiplier towards a result
  constructor(){
    this.outputInputpair = {"testOutput":{"testInput":2}}
    this.inputs = {}
  }
  input(dict){
    this.inputs = dict
  }
  generateOutput(item){
    let result = 0
    item = this.outputInputpair[item]
    let objk = Object.keys(item)
    for(let i = 0; i < objk.length; i++){
      let inputting = objk[i]
      result += this.input[inputting] * item[inputting]
    }
    return(result)
  }
  learn(item,expected){
    item = this.outputInputpair[item]
    let objk = Object.keys(item)
    for(let i = 0; i < objk.length; i++){
      let inputting = objk[i]
      this.input[inputting] += item[inputting] * (expected?1:-1)
    }
  }
}


/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============




let ballArr = [{x:100,y:100,color:"red",r:50}]

let camx = camy = 0


let lastx = 0
let lasty = 0

ctx.textAlign = "center"

function draw(){

  if(ID === 0 || jp === undefined){return}
  ctx.setTransform(1, 0, 0, 1, 0, 0)


  camx = -jp[ID].x
  camy = -jp[ID].y

  ctx.globalCompositeOperation = "copy";
  ctx.drawImage(ctx.canvas,(camx-lastx), (camy-lasty));

  lastx = camx
  lasty = camy

  // reset back to normal for subsequent operations.
  ctx.globalCompositeOperation = "source-over"

  ctx.fillStyle = "rgba(0,0,0,0.01)"
  ctx.fillRect(0,0,Width,Height)






  

  ctx.translate(camx+Width/2,camy+Height/2)
    ctx.lineWidth = 1
    ctx.strokeStyle = "green"
  for(let i = 1; i < 20; i++){
    ctx.beginPath()
    ctx.arc(0,0,i*120,0,2*Math.PI)
    ctx.stroke()
  }
  ballArr.forEach((e)=>{
    ctx.strokeStyle = e.holding?"white":"green"
    ctx.lineWidth = (e.holding?3:1)
    // ctx.lineWidth = 0
    ctx.fillStyle = e.color
    ctx.beginPath()
    ctx.arc(e.x,e.y,e.r,0,2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    // ctx.font = "bold 18px Arial";
    // ctx.fillStyle = "red"
    // ctx.fillText(e.hp,e.x,e.y+5)
    ctx.fillStyle = "rgb("+Math.floor((100-e.hp)*2.5)+","+Math.floor(e.hp*2.5)+",0)"
    ctx.fillRect(e.x-e.r,e.y-5,e.r*2,10)
  })
}

frameFuncs.push(draw)



document.addEventListener("keydown",(e)=>{
  let k = e.key
  if(e.repeat){return}
  socket.emit("keyd",k)
})


document.addEventListener("keyup",(e)=>{
  let k = e.key
  socket.emit("keyu",k)
  console.log(k)
})







