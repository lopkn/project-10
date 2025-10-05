
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = "100%"
  myCanvas.style.height = "100%"
  myCanvas.style.position = "fixed"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let smallerDim = Width<Height?Width:Height

let ctx = document.getElementById("myCanvas").getContext("2d")





let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


// const socket = io.connect('/')

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

class startclock{

  static time = 0

  static tick(dt){
      dt/=1000
      let t1 = 0.7
      let t2 = 1
      if(this.time<t1){

      ctx.clearRect(0,0,Width,Height)
      ctx.lineCap = "round"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 25
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/5,-Math.PI/2,-Math.PI/2+Math.PI*2*(this.time/t1))
      ctx.stroke()

      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 15
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(6),0,Math.PI*0.75*(this.time/t1))
      ctx.stroke()
      } else if(this.time<1){
        ctx.clearRect(0,0,Width,Height)
      ctx.lineCap = "round"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 25
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/5,-Math.PI/2,-Math.PI/2+Math.PI*2)
      ctx.stroke()

      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 15
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(6),0,Math.PI*0.75)
      ctx.stroke()
      } else if(this.time<2){
        let d = 0.4
      ctx.fillStyle = "rgba(0,0,0,"+d+")"
      ctx.fillRect(0,0,Width,Height)
      ctx.lineCap = "round"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 25*(this.time+(1-t2))*(this.time+(1-t2))
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(5-(this.time-t2)*5),-Math.PI/2,-Math.PI/2+Math.PI*2)
      ctx.stroke()

      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 15*(this.time+(1-t2))*(this.time+(1-t2))
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(6-(this.time-t2)*6),0,Math.PI*0.75)
      ctx.stroke()
      // } else if(time<3){
        // let d = 0.4+(time-2)*0.6
      // ctx.fillStyle = "rgba(0,0,0,"+d+")"
        // ctx.fillRect(0,0,Width,Height)
      } else {
        // ctx.clearRect(0,0,Width,Height)
        myCanvas.style.zIndex = -1
        let div = document.createElement("div")
        let txt = document.createElement("h1")
        txt.style.zIndex = 1
        txt.innerText = "Hey"
        div.classList.add("text")
        document.body.appendChild(div)
        div.appendChild(txt)

        return("delete")
      }

      this.time+=dt
  }
}


let mainLoop = setInterval(main,30)
let start = time = Date.now()

let events = [startclock]

function main(t){
  let dt = Date.now()-time
  time = Date.now()



  for(let i = events.length-1; i > -1; i--){
    if(events[i].tick(dt)=="delete"){events.splice(i,1)}
  }
  // ctx.fillStyle = "red"
  // ctx.fillRect(0,0,Width/2,Height/2)



}






/*
 * plan:
 *
 * Tailwind
 *
 * top bar
 * -------
 *  About me
 *
 *  Showcase of stuff
 *
 * QnA (dynamic)
 *
 *
 *
 *
 *
 *
 *
 */


































