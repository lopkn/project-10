// let D = (window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth)-50

let Width = (window.innerWidth>window.innerHeight?window.innerWidth:window.innerHeight)-20
let Height = (window.innerWidth<window.innerHeight?window.innerWidth:window.innerHeight)-20

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
let newAng = 0
let ang = 0
let ang2 = 0;

let resolution = 20;

function draw(){

  let h = 0.9
  let size = 85*3

  ctx.fillStyle = "#000020"
  ctx.clearRect(0,0,Width,Height)
  

 

  ctx.lineCap = "square"
  ctx.lineWidth = 5
  for(let i = 0; i <= resolution;i++){
    let p = i/resolution
    let xx = Math.sin(Math.PI*(p-0.5))
    let yy = Math.cos(Math.PI*(p-0.5))
    ctx.strokeStyle = "rgb("+(p*225+30)+",0,0)"
    ctx.beginPath()
    ctx.moveTo(xx*size+Width/2,Height*h-yy*size)
    ctx.lineTo(xx*size*1.1+Width/2,Height*h-yy*size*1.1)
    ctx.stroke()
  }

  for(let i = 0; i <= resolution+6;i++){
    let p = i/(resolution+6)
    let xx = Math.sin(Math.PI*(p-0.5))
    let yy = Math.cos(Math.PI*(p-0.5))
    ctx.strokeStyle = "rgb(0,"+((1-p)*200+55)+",0)"
    ctx.beginPath()
    ctx.moveTo(xx*size*1.1+Width/2,Height*h-yy*size*1.1)
    ctx.lineTo(xx*size*1.15+Width/2,Height*h-yy*size*1.15)
    ctx.stroke()
  }


  

  ctx.font = "bold 30px Courier New"
  ctx.fillStyle = "#FF0000"
  ctx.fillText("BULLSHIT",Width/1.4,Height*h*1.04)
  ctx.fillText("Nothing detected",Width/8.4,Height*h*1.04)

   let x = Math.sin(ang-Math.PI/2)
  let y = Math.cos(ang-Math.PI/2)
  ctx.beginPath()
  ctx.moveTo(Width/2,Height*h)
  x*=size
  y*=size
  ctx.lineCap = "round"
  ctx.lineTo(x+Width/2,Height*h-y)
  ctx.lineWidth = 15
  ctx.strokeStyle="#FFFFFF"
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(Width/2,Height*h)
  x*=size
  y*=size
  ctx.lineCap = "round"
  x = Math.sin(ang2-Math.PI/2)*size/2
  y = Math.cos(ang2-Math.PI/2)*size/2
  ctx.lineTo(x+Width/2,Height*h-y)
  ctx.lineWidth = 10
  ctx.strokeStyle="#7000C0"
  ctx.stroke()

  let bx = 20
  ctx.fillStyle = "#FFAAAA"
  ctx.fillRect(Width/2-bx,Height*h-bx,bx*2,bx*2)
  // ctx.fillText(lastAout,200,200)

  ctx.fillText(rfactor.toFixed(3),200,200)

}




let main = setInterval(()=>{data();smooth();draw();board.draw()},20)



let smoothness = 0.01

function smooth(){
  ang = ang + smoothness*(newAng - ang)
}

function smoothf(o,n,f){
  return(o+f*(n-o))
}

let infactor = 0

let pd = Date.now()

function randarr(arr){
  return(arr[Math.floor(Math.random()*arr.length)])
}
let mode = "calm"
let sfactor = 20;
let rfactor = 1;
function data(){

  if(Date.now() > pd){
    pd += Math.random()*10000+1000
    infactor = Math.random()*3.7-1.6

    if(Math.random()<0.2){
      mode = randarr(["default","calm","mid","danger"])
      console.log(mode)
    }

    if(mode == "default"){
      infactor = smoothf(infactor,infactor/2-1.6,0.6)
      smoothness *= 0.2
      sfactor = 20
      rfactor = 1
    }else if(mode == "calm"){
      infactor = smoothf(infactor,infactor/2-1.6,0.4)
      smoothness *= 0.6
      if(infactor < -1){
        pd += 1000
      }
      sfactor = 40
      rfactor = 0.7
    } else if(mode == "mid"){
      infactor = smoothf(infactor,infactor/2,0.2)
      sfactor = 40
      rfactor = 0.5
    } else {
      smoothness *= 1+Math.random();
      if(smoothness > 0.35){
        smoothness = 0.35
      } else if(smoothness > 0.13){
        smoothness /= 0.13
      }
      sfactor = 60
      rfactor = 0.2
    }

    if(true){
      let rr = Math.random()
      sfactor = rr*60
      rfactor = 1-rr
    }


    smoothness = smoothf(smoothness,0.15 * Math.random(),0.1)
    if(infactor > 1.2){
      smoothness = smoothf(smoothness,0.2,0.1*Math.random())
    } else if(infactor < -1){
      smoothness = smoothf(smoothness,0.01,0.1*Math.random())
    }

    if(smoothness > 0.1){
      board.dict["High fluctuation"].on = true
    } else {
      board.dict["High fluctuation"].on = false
    }

  }
  if(infactor > -1.3 && Math.random()<0.02){
    infactor -= 0.1
  }

  newAng = Math.sqrt(Math.random()*Math.PI*Math.PI) + infactor
  if(newAng < 0|| newAng >Math.PI){newAng/=1.2}


    let abl = Math.abs(AOUT[0][0][0])
    abl = abl>1?1+Math.log10(abl):abl

    let algo = (Math.abs(abl)*sfactor)

    lastAout = smoothf(lastAout,algo,lastAout>algo?0.02:0.05)

    newAng =  newAng * (lastAout + rfactor)
    if(newAng > 3.6){newAng = 3 + Math.random()}

    ang2 = lastAout
}




let workProcessor;
let audioContext;
let lastAout = 0
let AOUT = [[[0]]];
if(true){
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  audioContext = new AudioContext();
  let mic = audioContext.createMediaStreamSource(stream);
  audioContext.audioWorklet
    .addModule("./test.js")
    .then(() => {
      workProcessor = new AudioWorkletNode(audioContext, "worklet-processor",{
  numberOfInputs: 1
});
      mic.connect(workProcessor).connect(audioContext.destination);
      console.log("Audio context successfully initialized.");
        workProcessor.port.onmessage = (e)=>{AOUT = e.data}
    })
    .catch((error) => {
      console.error("Error adding audio worklet module:", error);
    });
});
}





class board{
  // static arr = [
  //   {"name":"Danger BS intensity","on":false},
  //   {"name":"BS flux warning","on":false},
  //   {"name":"High fluctuation","on":false}
  // ]
  static dict = {
    "Danger BS intensity":{"on":false},
    "BS flux warning":{"on":false},
    "High fluctuation":{"on":false},
  }
  static hx = 3
  static h = 30;
  static hd = 40;
  static w = 250;
  static wd = 300;

  static draw(){

    let arr = Object.keys(this.dict)

    arr.forEach((name,i)=>{
      let e = this.dict[name]
    let blink = Math.floor(Date.now()/500)%2==0
    
    ctx.fillStyle = "#202020"
    if(e.on && blink){  
      ctx.fillStyle = e.onBColor?e.onBColor:"#FF0000"
    }
    ctx.fillRect(this.wd+this.w*(Math.floor(i/4))-10,this.hd*(i%this.hx)+50,this.w,-this.h)

  ctx.font = "bold 20px Courier New"
    ctx.fillStyle = "#808080"
    if(e.on && blink){  
      ctx.fillStyle = e.onColor?e.onColor:"#FFFFFF"
    }
    ctx.fillText(name,this.wd+this.w*(Math.floor(i/4)),this.hd*(i%this.hx)+40)
  })
  }
}

