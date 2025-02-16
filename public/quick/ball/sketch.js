
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
var updateSignal = Date.now()
var updateTime = updateSignal
let timeError = 0
let thisTimeError = 0
socket.on("update",(e)=>{
  updateTime = e.time
  // console.log(e)
  updateSignal = Date.now()
  thisTimeError = updateSignal - updateTime
  timeError =  dampen(thisTimeError,timeError,0.1)
  if(thisTimeError - timeError < 15){
    // console.log(timeError)
    jp = JSON.parse(e.balls)
    ballArr = Object.values(jp)
    ballArr.forEach((e)=>{
      e.x = parseFloat(e.x)
      e.vx = parseFloat(e.vx)
      e.y = parseFloat(e.y)
      e.vy = parseFloat(e.vy)
      e.hp = parseFloat(e.hp)
    })
  } else {
    console.log(thisTimeError)
  }
})


function dampen(n,o,factor){
  return(n*factor + o*(1-factor))
}


class explosionR2{
  constructor(x,y,color,life=600,lineRelation,radiusRelation,fillcolor="rgba(0,0,0,0)"){
    this.x = x
    this.y = y
    this.color = color
    this.fillcolor = fillcolor
    if(typeof(color) !== "string"){this.colorf = color; this.color = "#FF00FF"}
    if(typeof(fillcolor) !== "string"){this.fillcolorf = fillcolor; this.fillcolor = "#FF00FF"}
    this.lineRelation = lineRelation?lineRelation:((x)=>{return(15*x/life)})
    this.radiusRelation = radiusRelation?radiusRelation:((x)=>{return((life-x)*300/life)})
    this.actLife = life
    this.maxlife = life
    this.lastTime = Date.now()    
  }

  update(t){
    this.actLife -= t-this.lastTime
    this.frameLineWidth = this.lineRelation(this.actLife)
    this.frameRadius = this.radiusRelation(this.actLife)
    this.lastTime = t
    if(this.colorf !== undefined){
      this.color = this.colorf(this.actLife/this.maxlife)
    }
    if(this.fillcolorf !== undefined){
      this.fillcolor = this.fillcolorf(this.actLife/this.maxlife)
    }

    // if(this.tracking){
    //   if(map.players[this.tracking]){
    //    this.coords = getFPlayerRot(this.tx,this.ty,this.tracking)
      
    // } 
    // this.x = this.coords[0]
    // this.y = this.coords[1]
    // }
  }
  draw(){
    if(this.actLife < 0){
      return('del')
    }
    ctx.strokeStyle = this.color
    ctx.fillStyle = this.fillcolor
    ctx.lineWidth = this.frameLineWidth*SCALE
    ctx.beginPath()
    let bts = [this.x,this.y]
    ctx.arc(bts[0],bts[1], this.frameRadius*SCALE, 0, 2 * Math.PI);
    ctx.stroke()
    ctx.fill()
    
  }
}

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



let SCALE = 1

let ballArr = [{x:100,y:100,color:"red",r:50}]

let camx = camy = 0


let lastx = 0
let lasty = 0

var PARR = []

ctx.textAlign = "center"


let lastFrame = Date.now()

function draw(){

  if(ID === 0 || jp === undefined){return}



        let now = Date.now()
  DT = now - lastFrame
  // if(DT > 9){console.log("HEY")}
  dt = now - updateSignal
  updateSignal = now
  lastFrame = now
    ballArr.forEach((e)=>{
      e.x += e.vx * dt / 35
      e.y += e.vy * dt / 35
    })   
  // if(dt > 10){console.log("skipped frame")}
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0)



  camx = -jp[ID].x
  camy = -jp[ID].y

  // SCALE = 1 - 1/(distance(jp[ID].vx,jp[ID].vy,0,0)/20+2) // trip
  // SCALE = 1-Math.min((distance(jp[ID].vx,jp[ID].vy,0,0)/220),0.8)

  ctx.globalCompositeOperation = "copy";
  ctx.drawImage(ctx.canvas,(camx-lastx), (camy-lasty),Width/SCALE,Height/SCALE);

  lastx = camx
  lasty = camy

  // reset back to normal for subsequent operations.
  ctx.globalCompositeOperation = "source-over"

  ctx.fillStyle = "rgba(0,0,0,2)"
  ctx.fillRect(0,0,Width/SCALE,Height/SCALE)



    ctx.fillStyle = "rgb(255,255,0)"
    ctx.fillRect(0,Height-20,Math.abs(thisTimeError),20)
  ctx.fillRect(0,Height-40,Math.abs(timeError),20)



  

  ctx.translate(camx+Width/2/SCALE,camy+Height/2/SCALE)
    ctx.lineWidth = 1
    ctx.strokeStyle = "green"
  for(let i = 1; i < 20; i++){
    ctx.beginPath()
    ctx.arc(0,0,i**1.3*80,0,2*Math.PI)
    ctx.stroke()
  }



  // updateSignal += 1

 
  for(let i = PARR.length-1; i > -1; i--){
    let p = PARR[i]
    p.update(now)
    if(p.draw()=="del"){
      PARR.splice(i,1)
    }
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
    ctx.strokeStyle = "rgb("+Math.floor((100-e.hp)*2.5)+","+Math.floor(e.hp*2.5)+",0)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(e.x,e.y,e.r/2.4,0,2*Math.PI)
    ctx.stroke()
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







