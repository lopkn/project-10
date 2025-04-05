
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


var words = {}
var wordlist = []
var ID;
var prompt = "";
const socket = io.connect('/')
let GAMESESSION = "G10.10"
socket.emit("JOINGAME",GAMESESSION)
socket.on("acknowledge G10.10",acknowledge)
socket.on("accepted",(e)=>{console.log("accepted");words[e.word]=e.id;wordlist.splice(0,0,e.word)

addScore(e.id)
document.getElementById("divout").innerText = JSON.stringify({"already":wordlist},null,4).substring(18)


})
socket.on("prompt",(e)=>{console.log("prompt:"+e);prompt=e[0]
document.getElementById("divout2").innerText = "prompt: "+prompt + "\n\n\n" + JSON.stringify(scores)


if(ID == e[1] || e[1] == "FFA"){
  document.getElementById("divout2").style.backgroundColor = "#FFA0A0"
  document.getElementById("divout").style.backgroundColor = "#FFA0A0"

  timer = Date.now()+10000
} else {
  timer = 0
    document.getElementById("divout2").style.backgroundColor = "lightblue"
  document.getElementById("divout").style.backgroundColor = "lightblue"
}
})
function acknowledge(e){
  ID = e
  console.log(e)
}

var scores = {}
function addScore(id){
  if(scores[id]===undefined){scores[id]=0}
  scores[id] += 1
}

var timer = 0
var flashing = true

let _MainInterval_ = setInterval(()=>{
  let timeLeft = timer-Date.now()
  if(timeLeft>0){
    let tl = timeLeft/10000*255
    if(flashing){
    document.body.style.backgroundColor = "rgb("+tl+","+tl*0.2+","+0+")"
    }
  } else {
    document.body.style.backgroundColor = "black"
  }
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
    if(append){
      document.body.append(video)
    }
    if(type=="screen"){
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });video.srcObject = stream;})
    } else {
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });video.srcObject = stream;})
    }
    return(video)
  }


//oneTimeTrustedButton(Lvideo)


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

function normalRandom(mean, stderr) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stderr + mean;
}

/* MUSIC/TONE

var scene = {
  "sounds":true,
  "interval":0.3,
  "beatsPerBar":4
}

function soundInit(){
    Tone.Transport.start();
    Tone.Transport.scheduleRepeat((time) => {
        music.runbar(time)
    }, scene.interval*scene.beatsPerBar)

    { let audio = new Tone.Sampler({
      urls: {
        "C4":"./../../soundEffects/sinC4.mp3",
        "F3":"./../../soundEffects/sinF3.mp3",
      },
    }).toDestination();
        SOUND["sinC4"] = audio

    }
      arr.forEach((E,i)=>{
        let e = "./../../soundEffects/"+E+".mp3"
        let audio = new Tone.Sampler({
      urls: {
        "C4":e,
      },
    }).toDestination();
        SOUND[E] = audio
      })
}

function mtn(midiNumber) {
    return Tone.Frequency(midiNumber, "midi");
}

class music{
  static counter = 0
  static synth = new Tone.PolySynth(Tone.Synth,8).toDestination(); // Connect to audio output
  static eq = new Tone.EQ3(-10, 3, 0);
  static reverb = new Tone.Reverb({
    decay: 20, // Duration of the reverb tail
    preDelay: 0.3,
    wet: 0.95,
    input:1,
    output:1
}).toDestination();
  static bell = new Tone.Sampler({
  urls: {
    "C4":"../epcounter/untitled.mp3",
  },
}).toDestination();
  static kick = new Tone.Sampler({
  urls: {
    "C4":"../epcounter/kick.mp3",
  },
}).toDestination();
  static click = new Tone.Sampler({
  urls: {
    "C4":"../epcounter/test.mp3",
  },
}).toDestination();
  static drumSynth = new Tone.MembraneSynth().toDestination();
  static echo = new Tone.PingPongDelay(scene.interval*2, scene.interval*2).toDestination();
  static playBell(note,vel=1,delay=0){
      this.bell.triggerAttackRelease(mtn(note),1.7,Tone.now()+delay,vel);
  }
  static playFile(file,note,vel=1,delay=0){
    this.sounds[file].triggerAttackRelease(mtn(note),1.7,Tone.now()+delay,vel);
  }

  static checkCollide(note,arr,dist=1){

    let mod = note%12
    for(let i = 0; i < arr.length; i++){
      let resd = Math.abs(arr[i]-mod)%12
      if(resd == dist || resd == 12-dist){
        return(true)
      }
    }
    return(false)
  }

  static checkCollider(note,dict,dist=1,oct=1){
    for(let i = 0; i < oct+1; i++){
      if(dict[note+dist+i*12] === true){return(true)}
      if(dict[note-dist+i*12] === true){return(true)}
      if(dict[note+dist-i*12] === true){return(true)}
      if(dict[note-dist-i*12] === true){return(true)}
    }
    return(false)
  }



}

music.bell.connect(music.reverb)
music.bell.connect(music.echo)
music.bell.connect(music.eq)
music.bell.set({volume:-20})
music.synth.set({
    oscillator: {
        type: 'sine4' 
    },
    envelope: {
        attack: 0.005,
        decay: 0.5,
        sustain:1,
        release:2
    },
    volume:-60
})
*/

/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============



let divin = document.getElementById("divin")


divin.addEventListener("keydown",(e)=>{
  if(e.key=="Enter"){
    e.preventDefault()
    let str = divin.innerText.replaceAll("\n","")
    if(str === "!flashing"){
      flashing = !flashing
    }
    sendWord(str)
  divin.innerText = ""
  }
})



function sendWord(str){
  socket.emit("word",str)
}












