
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


// const socket = io.connect('/')

class LCanvas{ //lopkns template canvas
  constructor(w=100,h=100,id=("LCanvas-"+Math.random())){
    this.canvas = document.createElement("canvas")
    // this.canvas.classList.add("passThrough")
    this.canvas.id = id
    this.ctx = this.canvas.getContext("2d")
    // this.canvas.style.position = "absolute"
    // this.canvas.style.top = "0px"
    // this.canvas.style.left = "0px"
    // this.canvas.zIndex = "1500"
    this.canvas.width = w
    this.canvas.height = h
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    return(this)
  }

  fitScreenSize(){
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  fit(){
    // Make it visually fill the positioned parent
    this.canvas.style.width ='100%';
    this.canvas.style.height='100%';
    // ...then set the internal size to match
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
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


class LrandVel{
  constructor(mult=1,friction=0.999){
    this.val = 0
  }
  update(){
    this.val += (Math.random()-0.5)*mult
    this.val *= friction
    return(this.val)
  }
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


class LNgram{
  static dict = {}
  static history = []
  static learn(action,ans,n=10){
    this.history.splice(0,0,action)

    if(n>this.history.length){n=this.history.length}

    if(ans!==undefined){

      for(let i = 0; i <= n; i++){
        let tarr = this.history.slice(0,i).reverse()
        let str = tarr.join("-")
        this.addEntry(str,ans)
      }

    }

  }


  static predict(arr){

    if(typeof(arr)==="string"){
      arr=arr.split("")
    }

    if(arr!==undefined){
      arr.reverse()
    } else {
      arr = this.history
    }

    let cont = true
    let chain = ""
    let out = []
    let i = 0;
    let item = this.dict[chain]

      out.push(item.score/item.count)

      chain += arr[i]
      item = this.dict[chain]
      if(item===undefined){cont=false}
      i++

    while(cont){
      out.push(item.score/item.count)

      chain = arr[i] + "-" + chain
      item = this.dict[chain]
      if(item===undefined){console.log(chain);break;}
      i++
    }

    return(out)

  }

  static addEntry(entry,ans){
    if(this.dict[entry]===undefined){
      this.dict[entry] = {"count":0,"score":0}
    }
    this.dict[entry].count+=1
    this.dict[entry].score+=ans
  }


  static paragraphy(p,letter="y"){
    for(let i = 0; i < p.length; i++){
      this.learn(p[i],p[i+1]===letter)
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


// ctx = document.querySelector("canvas").getContext("2d")


function DCC(el,par){
  el = document.createElement(el)
  if(par){par.appendChild(el)}
    return(el)
}


document.addEventListener("keydown",(e)=>{

})



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  // if (document.getElementById(elmnt.id + "header")) {
  //   /* if present, the header is where you move the DIV from:*/
  //   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  // } else {
  //   /* otherwise, move the DIV from anywhere inside the DIV:*/
  //   elmnt.onmousedown = dragMouseDown;
  // }

  elmnt.firstChild.onmousedown=dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function ranarr(arr){
  return(arr[Math.floor(Math.random()*arr.length)])
}
function genHS(){
  let arr1 = ["Dong","Chau","Ding","Ming","Ling","Lin","Fang","Guan","Diu","dé","Ning","Ping","Jang","Nam","Po","Leung","Kok","Bok","Kei","Gwai","Heung","Cheung","Ching","Chong"]
  let arr = ["Dong","Chau","Ding","Ming","Ling","Lin","Fang","Guan","Diu","Ning","Ping","Jang","Nam","Po","Leung","Kok","Bok","Kei","Gwai","Heung","Cheung","Ching","Chong"]
  let arr2 = [" Christian"," Catholic", " Bhuddist"," Goverment"," Baptist"," Intranational"," Chinese"," Chinese","","","","",""]
  let arr3 = ["Secondary School", "College"]
  let name = ranarr(arr)+" "+ranarr(arr)+" "
  while(Math.random()>0.7){
    name += ranarr(arr1)+" "
  }

  name += ranarr(arr)+ranarr(arr2)+" "+ranarr(arr3)
  return(name)
}


// can = new LCanvas()
// can.clear()
// can.fitScreenSize()
// can.canvas.style.pointerEvents = "none"



let main = document.getElementById("main")
let overlay = document.getElementById("overlay")




class wind{
  constructor(name="untitled",res=false){

    this.div = document.createElement("div")
    this.bar = document.createElement("div")
    this.div.classList.add("wind")
    this.cdiv = document.createElement("div")
    this.title = document.createElement("span")
    this.title.innerText = name
    this.title.classList.add("title")
    this.bar.appendChild(this.title)

    this.bar.classList.add("bar")
    this.cdiv.classList.add("cdiv")
    this.div.draggable=true

    this.div.style.width = "230px"

    this.div.appendChild(this.bar)
    this.div.appendChild(this.cdiv)
      dragElement(this.div)
      main.appendChild(this.div)


   
    if(res){
      this.div.style.resize="both"
    }

    
  }

  close(){
    this.div.remove()
    if(this.subWinds){
      Object.values(this.subWinds).forEach((e)=>{
        e.close()
      })
    }
  }
  tick(t){
    if(this.lim){this.lim()}

    if(this.graph){
      if(this.graph.type == undefined){

        let ctx = this.lc.ctx
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,Width,Height)
        ctx.lineWidth=2
        ctx.strokeStyle = "white"
        ctx.textAlign = "center"
        ctx.beginPath()
        ctx.moveTo(15,5)
        ctx.lineTo(15,260)
        ctx.lineTo(360,260)
        ctx.stroke()

        let tx = this.graph.tx // time the graph should show
        ctx.strokeStyle = this.graph.color?this.graph.color:"green"
        ctx.beginPath()
        while(t.progress-t.record[0].time > tx){
          t.record.splice(0,1)
        }
        let offset = t.record[0].time
        for(let i = 0; i<t.record.length-2; i++){

          let r1 = t.record[i]
          let x1 = 15+(r1.time-offset)/tx*360
          let y1 = 260-r1.y*255/100

          let r2 = t.record[i+1]
          let x2 = 15+(r2.time-offset)/tx*360
          let y2 = 260-r2.y*255/100
          ctx.moveTo(x1,y1)
          ctx.lineTo(x2,y2)      
        }
        ctx.stroke()
      } else if(this.graph.type == 2){
        let ctx = this.lc.ctx
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,Width,Height)

        ctx.lineWidth=1
        ctx.strokeStyle = "yellow"
        ctx.beginPath()
        ctx.moveTo(15,255/2+5)
        ctx.lineTo(360,255/2+5)
        ctx.stroke()

        ctx.lineWidth=2
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.moveTo(15,5)
        ctx.lineTo(15,260)
        ctx.lineTo(360,260)
        ctx.stroke()



        let tx = this.graph.tx // time the graph should show
        ctx.strokeStyle = "green"
        ctx.beginPath()
        if(t.record.length==0){return}
        while(t.progress-t.record[0].time > tx){
          t.record.splice(0,1)
        }
        let offset = t.record[0].time
        for(let i = 0; i<t.record.length-2; i++){

          let r1 = t.record[i]
          let x1 = 15+(r1.time-offset)/tx*360
          let y1 = 260-r1.y*250/100

          let r2 = t.record[i+1]
          let x2 = 15+(r2.time-offset)/tx*360
          let y2 = 260-r2.y*250/100
          ctx.moveTo(x1,y1)
          ctx.lineTo(x2,y2)      
        }
        ctx.stroke()
        } else if(this.graph.type == 3){
        let ctx = this.lc.ctx
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,Width,Height)

        ctx.lineWidth=1
        ctx.strokeStyle = "red"
        ctx.beginPath()
        ctx.moveTo(15,255/2+5)
        ctx.lineTo(360,255/2+5)
        ctx.stroke()

        ctx.lineWidth=2
        ctx.strokeStyle = "white"
        ctx.beginPath()
        ctx.moveTo(15,5)
        ctx.lineTo(15,260)
        ctx.lineTo(360,260)
        ctx.stroke()


        let offset;
        let tx = this.graph.tx // time the graph should show


        t.subarr.forEach((e)=>{
          ctx.strokeStyle = t.wind.subWinds[e].color
          ctx.beginPath()
          while(t.progress-t.records[e][0].time > tx){
            t.records[e].splice(0,1)
          }
          offset = t.records[e][0].time
          for(let i = 0; i<t.records[e].length-2; i++){

            let r1 = t.records[e][i]
            let x1 = 15+(r1.time-offset)/tx*350
            let y1 = 260-r1.y*250/100

            let r2 = t.records[e][i+1]
            let x2 = 15+(r2.time-offset)/tx*350
            let y2 = 260-r2.y*250/100
            ctx.moveTo(x1,y1)
            ctx.lineTo(x2,y2)      
          }
          ctx.stroke()
        })

        this.graph.lines.forEach((e)=>{
          ctx.lineWidth = 3
          ctx.strokeStyle = "white"
            let x = 15+(e-offset)/tx*350
          ctx.beginPath()
            ctx.moveTo(x,260)
            ctx.lineTo(x,260-30)      
          ctx.stroke()
        })
        




      }
    }
  }

  canv(w=390,h=300,graph){
    // this.div.style.width = Math.floor(w)+"px"
    // this.div.style.height = Math.floor(h)+"px"
    this.lc = new LCanvas()
    this.cdiv.appendChild(this.lc.canvas)

    this.lc.canvas.width = w
    this.lc.canvas.height = h
    this.div.style.width = ""
    if(graph){this.graph=graph}
    // this.lc.fit()

    // this.rf = ()=>{console.log("resize"); this.lc.fit()}
    // this.ros = new ResizeObserver(this.rf).observe(this.cdiv)
      return(this)
  }
}

function Wlimit(w,t){
      let el2 = DCC("div",w.bar)
      el2.classList.add("tasklimit")

      let el3 = DCC("div")
      w.bar.insertBefore(el3, w.bar.firstChild)

      el3.classList.add("taskcompletion")

      w.lim = ()=>{
      let a = t.limit;
      let b = t.completion
      el2.style.width = Math.min(100,Math.floor(a))+"%";el3.style.width = Math.min(100,Math.floor(b))+"%"}
}


let mainWindow = new wind("TASKS")
mainWindow.div.style.top = "300px"
mainWindow.div.style.left = "300px"

let windowArr = [mainWindow]

let taskArr = []

let eventBank = {}

let gameEvents = [{time:Infinity,event:()=>{console.log("infinity reached")}}] //{"time":}

let start = Date.now()

let mainLoop = setInterval(()=>{
  mainFunc(20)
},20)



var PROGRESS = -Infinity
// var DIF = 0.05 //difficulty
var DIF = 1 //difficulty

class ENV{
  static YEAR = 60 //a year is 60 progress seconds
  static DAY = 0
  static dt = 1
}
//calc
ENV.DAY = ENV.YEAR/365

///



function gameEvent(time,event){
  if(time[0]=="+"){
    time = parseInt(time) + PROGRESS
  }

  let eventPackage = {time,event}
  for(let i = 0; i < gameEvents.length; i++){
    if(time < gameEvents[i].time){
      gameEvents.splice(i,0,eventPackage)
      break;
    }
  }
}


function mainFunc(dt){

  // if(taskArr[0].complete){dt*=15}

  dt *= ENV.dt

  let sdt = dt/1000
  PROGRESS += sdt 

  if(ENV.n){ENV.n[0].style.left = ENV.n[1].style.left = (PROGRESS/ENV.YEAR/20*100)+"vw"}

  for(let i = 0; i < gameEvents.length; i++){
    if(PROGRESS<gameEvents[i].time){break}
    if(gameEvents[i].ran){continue}
    gameEvents[i].event()
    gameEvents[i].ran = true
  }


  windowArr.forEach((e)=>{
    if(e.lc){
      e.lc.clear()
      let ctx = e.lc.ctx
      ctx.fillStyle = "black"
      ctx.fillRect(0,0,20,20)
    }
  })

  taskArr.forEach((e)=>{
    if(e.complete){return}
    e.tick(sdt)
    e.check()
  })


}

function startYearCounter(){
  let tb = DCC("div",document.body)
  tb.classList.add("topbar")
  for(let i = 1; i < 20; i++){
    //full length of bar = 20 years
    let n = DCC("div",tb)
    n.classList.add("notch")
    n.style.left = (i*100/20-0.25)+"vw"

    let l = DCC("div",tb)
    l.innerText=i
    l.classList.add("birthday")
    l.style.left = (i*100/20-0.25)+"vw"

    gameEvent(ENV.YEAR*i,()=>{notify("Happy birthday")})

  }

    let n = DCC("div",tb)
    n.classList.add("notch")
    n.classList.add("moving")
    n.style.left = (PROGRESS/ENV.YEAR/20*100)+"vw"

    let l = DCC("div",tb)
    l.innerText="^"
    l.classList.add("birthday")
    l.classList.add("moving")
    l.style.left = (PROGRESS/ENV.YEAR/20*100)+"vw"

    ENV.n=[n,l]
}








var debuffs = {}

function debuff(str){
  debuffs[str] = true
  notify("debuffed: "+str)

  let db = document.getElementById("debuff_center")
  let d = DCC("div",db)
  d.innerText = str
  d.classList.add("debuff")

}


class stats{
  static kindergarten_friends;
  static CFS = [];
  static CFST = 0;
  static repeatGrade = 0;
}














var completedTasks = {}
var SKIPS = new Set()

class task{
  constructor(name="unnamed",windf,pref=()=>{}){

    if(SKIPS.has(name)){return}

    this.name=name
    this.div = document.createElement("div")
    this.div.classList.add("task")
    this.div.innerText = name

    this.startTime = PROGRESS
    this.progress = 0

    this.completeBefore = Infinity

    this.limit = 100;


    this.hp = 100
    // mainWindow.cdiv.appendChild(this.div)
    mainWindow.cdiv.insertBefore(this.div, mainWindow.cdiv.firstChild)
    taskArr.splice(0,0,this)

    this.completion = 0


    this.wind = new wind("task: "+name)
        this.wind.div.style.visibility = "hidden";
    this.wind.bar.style.visibility = "hidden";
    pref(this)
    windf(this,this.wind)


    this.div.addEventListener("mousedown",()=>{
      this.wind.div.style.top = Math.floor(mouseY) + "px"
      this.wind.div.style.left = Math.floor(mouseX + 50) + "px"
      this.wind.div.style.visibility = "visible";
      this.wind.bar.style.visibility = "visible";
    },{once:true})

  }

  setCompleteBefore(t){
    this.completeBefore = t;
    this.timeAllowed = t-this.startTime
  }

  tick(sdt){
    this.progress += sdt
    this.hp -= sdt/0.6

  }
  dcLose(){
    this.complete = true
      this.div.classList.add("depleat")
      this.lose()
  }
  check(){
    if(this.hp <= 0){
      this.dcLose()
      return;
    }
    if(PROGRESS > this.completeBefore){
      if(this.done){this.completion=100}else{
      this.dcLose()
      }
    }
    if(this.completion >= 100){
      this.complete = true
      this.div.classList.add("complete")
      this.div.classList.remove("urgent")

      if(this.done){this.done()}else{
        this.win()
      }
      if(completedTasks[this.name]==undefined){completedTasks[this.name]=0}
        completedTasks[this.name]+=1
      console.log("task complete: "+this.name)


      this.limit = 0
      if(this.wind){this.wind.tick(this)}
        return;
    }
    if(this.completion < 0){this.completion = 0}
    
    this.calculate()

    if(this.limit<30){
      this.div.classList.add("urgent")
    } else {
      this.div.classList.remove("urgent")
    }

    if(this.wind){this.wind.tick(this)}


  }

  calculate(){
    let candidate = [this.hp]
    if(this.timeAllowed!==undefined && this.done == undefined){
      candidate.push((this.completeBefore-PROGRESS)/this.timeAllowed*100)
    }
    this.limit = Math.min(...candidate)
  }



  win(){}
  lose(){console.log("LOL u died.");loseGame();this.complete=true}

  close(){
    this.wind.close()

  }
}

var STO = setTimeout

function closeIn(t,x=10){
  STO(()=>{t.close();},x*1000)
}


function pendEvent(name,time,event){
  eventBank[name] = {time,event}
}

function activateEvent(name,time){
  if(time){
    gameEvent(time,eventBank[name].event)
  } else {
    gameEvent(eventBank[name].time,eventBank[name].event)
  }
}


function loseGame(reason="no reason",t){
  el= DCC("div",document.body)
  el.style.zIndex="99999"
  el.classList.add("loser")
  el.innerText = "YOU DIED:\n"+reason

  clearInterval(mainLoop)
  console.log(t)
  throw(new Error)
}

function winGame(reason="no reason",t){
  el= DCC("div",document.body)
  el.style.zIndex="99999"
  el.classList.add("winner")
  el.innerText = "YOU WON:\n"+reason

  document.querySelector(".effects").style.zIndex = "9999999"

  clearInterval(mainLoop)
  console.log(t)
  throw(new Error)
}


function shuffleChildren(parent) {
  const children = parent.children;
  const newArray = [];
  for (let i = 0; i < children.length; i++) {
    newArray.push(children[i]);
  }

  // Fisher-Yates (aka Knuth) Shuffle
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }

  // Clear the parent and re-append the shuffled children
  parent.innerHTML = "";
  for (let i = 0; i < newArray.length; i++) {
    parent.appendChild(newArray[i]);
  }
}

// function shuffleChildren(container) {
//     const children = Array.from(container.children);
    
//     for (let i = children.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [children[i], children[j]] = [children[j], children[i]];
//     }
    
//     // Clear the container and append the shuffled children
//     container.innerHTML = '';
//     children.forEach(child => container.appendChild(child));
// }

function learn1(w,t,arr,func=()=>{},div){ // [{"name":"learn",f:f}] , master func

  if(div===undefined){div=w.cdiv}
  arr.forEach((e)=>{
    let times = e.times?e.times:1
    for(let i = 0; i < times; i++){
      let el = DCC("button",div)
      el.innerText = e.name
      el.onclick = ()=>{
        e.f(w,t)
        func(w,t,div)
      }
    }
  })


  if(!w.NOTWIND){
    Wlimit(w,t)
  }

}


function reward(x,v="completion"){
  if(x < 0){
    return((w,t)=>{t[v] += x})
  }
  return((w,t)=>{t[v] += x/DIF})
}

function reward2(x,v="hp"){
  if(x < 0){
    return((w,t)=>{t[v] += (t.hp)*x/DIF})
  }
  return((w,t)=>{t[v] += (100-t.hp)*x})
}

function reward3(x,v="hp"){
  if(x < 0){
    return((w,t)=>{t[v] += Math.max(t.hp,50)*x/DIF})
  }
  return((w,t)=>{t[v] += Math.min(100-t.hp,50)*x})
}


function notify(str,x=10){
  let notif = document.getElementById("notification_center")
  let n = DCC("div",notif)
  n.innerText = str
  setTimeout(()=>{
    n.remove()
  },x*1000)
}











notify("move the task window around by dragging the blue bar")


















let skiptime = 0




new task("be born",(t,w)=>{
  let el = DCC("button",w.div)
  el.innerText = "GET BORN"
  el.onclick = ()=>{
    t.completion += 500 / DIF
    // t.completion += 5 / DIF
  }

  // <select name="cars" id="cars">
  //   <option value="volvo">Volvo</option>
  //   <option value="saab">Saab</option>
  //   <option value="opel">Opel</option>
  //   <option value="audi">Audi</option>
  // </select>

  let d1 = DCC("div",w.div)
  let lab = DCC("span",d1)
  lab.innerText = "Difficulty: "
  lab.style.color = "white"
  let sel = DCC("select",d1)
  let arr = ["wussy","daniel","daniel+","nightmare"]
  arr.forEach((e)=>{
    let op = DCC("option",sel)
    op.innerText = e
    op.value = e
  })


  t.win = ()=>{PROGRESS=skiptime;

    if(sel.value == "nightmare"){DIF *= 1.5}
    if(sel.value == "wussy"){DIF /= 1.4}
    if(sel.value == "daniel"){DIF *= 1}
    if(sel.value == "daniel+"){DIF *= 1.2}

    activateEvent("cry");
    startYearCounter()
    closeIn(t)}
  t.lose = ()=>{loseGame("you got aborted")}
})

pendEvent("cry","+2",()=>{
  new task("cry",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "CRY"
    el.onclick = ()=>{
      t.completion += 5 / DIF
    }
      Wlimit(w,t)
  },(t)=>{
    t.setCompleteBefore(PROGRESS + 40*ENV.DAY)
    t.win = ()=>{activateEvent("cry2");closeIn(t)}
    t.lose = ()=>{loseGame("forgot to cry, died of suffocation")}
  })
})


pendEvent("cry2","+2",()=>{
  new task("cry",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "CRY"
    el.onclick = ()=>{
      t.completion += 7 / (DIF**0.5)
    }
      Wlimit(w,t)
  },(t)=>{
    t.setCompleteBefore(PROGRESS + 100*ENV.DAY)
    t.win = ()=>{if(PROGRESS<1.3*ENV.YEAR){if(!completedTasks["Learn to speak"]){activateEvent("cry2")}};closeIn(t)}
    t.lose = ()=>{if(Math.random()<0.5){loseGame("forgot to cry, parents neglected you. You starved.")}else{
      debuff("neglected")
    }}
  })
})






gameEvent(0.25*ENV.YEAR,()=>{
    new task("Learn to walk",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "Learn"
    el.onclick = ()=>{
      t.completion += 3 / DIF
    }
    Wlimit(w,t)
  },(t)=>{
    t.setCompleteBefore(1.5*ENV.YEAR)
    t.win = ()=>{activateEvent("Learn to run");closeIn(t)}
    t.lose = ()=>{loseGame("very crippled")}
  })
})



pendEvent("Learn to run","+0",()=>{
    new task("Learn to run",(t,w)=>{

    learn1(w,t,[{"name":"learn",f:reward(7)},{"name":"observe",f:reward(1/3),times:2},{"name":"stumble",f:reward(-2),times:3}],(w,t)=>{shuffleChildren(w.cdiv)})
    
  },(t)=>{
    t.tick = (sdt)=>{t.progress += sdt}
    t.setCompleteBefore(2.5*ENV.YEAR)
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{if(Math.random()>1-(0.4*DIF)){loseGame("crippled")} else {debuff("crippled")}}
  })
})


gameEvent(0.5*ENV.YEAR,()=>{
    new task("Learn to speak",(t,w)=>{

    learn1(w,t,[{"name":"learn",f:reward(4)},{"name":"observe",f:reward(3),times:2},{"name":"practice",f:reward(5)},{"name":"stutter",f:reward(-2),times:3}],(w,t)=>{shuffleChildren(w.cdiv)})
    

  },(t)=>{
    t.setCompleteBefore(2.2*ENV.YEAR)
    t.tick = (sdt)=>{t.progress += sdt}
    t.win = ()=>{activateEvent("Speaking#2");closeIn(t)}
    t.lose = ()=>{debuff("mute");closeIn(t)}
  })
})

gameEvent(0.3*ENV.YEAR,()=>{
    new task("Potty train",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "Learn"
    el.onclick = ()=>{
      t.completion += 2 / DIF
    }
    Wlimit(w,t)

  },(t)=>{
    t.setCompleteBefore(1.5*ENV.YEAR)
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("Bad shitter");closeIn(t);
      for(let i = 0; i < 4; i++){
        gameEvent(PROGRESS+Math.random()*10*ENV.YEAR,()=>{notify("You shat yourself")})
      }
    }
  })
})

gameEvent(2*ENV.YEAR,()=>{
    new task("Human decency",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "Learn"
    el.onclick = ()=>{
      t.completion += 2 / DIF
    }
    Wlimit(w,t)

  },(t)=>{
    t.setCompleteBefore(6*ENV.YEAR)
    t.tick = (sdt)=>{t.progress += sdt}
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("Homosexual");closeIn(t);
      for(let i = 0; i < 14; i++){
        gameEvent(PROGRESS+Math.random()*10*ENV.YEAR,()=>{notify("You are gay")})
      }
    }
  })
})

gameEvent(2.5*ENV.YEAR,()=>{
    new task("common sense",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "Learn"
    el.onclick = ()=>{
      t.completion += 3 / DIF
    }
    Wlimit(w,t)

  },(t)=>{
    t.setCompleteBefore(5*ENV.YEAR)
    t.tick = (sdt)=>{t.progress += sdt}
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("sped");closeIn(t);
      for(let i = 0; i < 14; i++){
        gameEvent(PROGRESS+Math.random()*10*ENV.YEAR,()=>{notify("You are sped.")})
      }
    }
  })
})


pendEvent("Speaking#2","+0",()=>{
    new task("refine speaking skills",(t,w)=>{

    let bt = DCC("button",w.cdiv)
        bt.innerText = "S p e a k."
        let delayed = false
        bt.onclick = ()=>{
          if(delayed){return}
          t.completion += 6 / (DIF**0.5)
          bt.classList.add("delay")
          delayed = true;
          STO(()=>{bt.classList.remove("delay");delayed=false},2000)
        }
    Wlimit(w,t)

  },(t)=>{
    t.setCompleteBefore(5*ENV.YEAR)
    t.tick = (sdt)=>{t.progress += sdt}
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("Quiet");closeIn(t)}
  })
})


gameEvent(3*ENV.YEAR,()=>{
    new task("Make childhood friends",(t,w)=>{
    learn1(w,t,[{"name":"make friends",f:()=>{t.vx+=44/DIF},times:2},{"name":"imaginary friends",f:reward2(-0.4),times:2},{"name":"solitude",f:reward2(-0.4),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

    w.canv().graph = {tx:40}

  },(t)=>{
    t.setCompleteBefore(5.7*ENV.YEAR)
    t.done = ()=>{
      closeIn(t);
      stats.kindergarten_friends = t.hp
      activateEvent("Maintain kindergarten friends")
    }
    t.record = []
      t.vx = 0
      t.hp = 1

    t.lose = ()=>{
      notify("you have lost all your childhood friends")
      closeIn(t)
    }
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 0.995
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (35+t.hp/2)*sdt/20
      t.hp += t.vx*sdt/20
      if(t.hp>100){t.vx=-1;t.hp=100}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})

gameEvent(5.7*ENV.YEAR,()=>{
    new task("Make primary school friends",(t,w)=>{
    learn1(w,t,[{"name":"make friends",f:()=>{t.vx+=37/DIF},times:2},{"name":"imaginary friends",f:reward2(-0.4),times:2},{"name":"solitude",f:reward2(-0.4),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

    w.canv().graph = {tx:40}

  },(t)=>{
    t.setCompleteBefore(11.7*ENV.YEAR)
    t.done = ()=>{
      closeIn(t);
      stats.ps_friends = t.hp
      activateEvent("Maintain primary school friends")
    }
    t.record = []
      t.vx = 0
      t.hp = 50

    t.lose = ()=>{
      notify("you have no primary school friends")
      debuff("social outcast")
      closeIn(t)
    }
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 0.995
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (35+t.hp/2)*sdt/20
      t.hp += t.vx*sdt/20
      if(t.hp>100){t.vx=-1;t.hp=100}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})

gameEvent(11.7*ENV.YEAR,()=>{
    new task("Make secondary school friends",(t,w)=>{
    learn1(w,t,[{"name":"make friends",f:()=>{t.vx+=27/DIF},times:2},{"name":"imaginary friends",f:reward2(-0.4),times:2},{"name":"regress",f:reward2(-0.4),times:4}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))
    w.canv().graph = {tx:40}

  },(t)=>{
    t.setCompleteBefore(17.7*ENV.YEAR)
    t.done = ()=>{
      closeIn(t);
      stats.hs_friends = t.hp
      activateEvent("Maintain secondary school friends")
    }
    t.record = []
      t.vx = 0
      t.hp = 25

    t.lose = ()=>{
      notify("you have no secondary school friends")
      debuff("bagged bob")
      closeIn(t)
    }
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 0.995
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (25+t.hp/2)*sdt/20
      t.hp += t.vx*sdt/20
      if(t.hp>100){t.vx=-1;t.hp=100}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})






gameEvent(4.5*ENV.YEAR,()=>{
    new task("eating habbits",(t,w)=>{

    let bt = DCC("button",w.cdiv)
        bt.innerText = "maintain"
        let delayed = false
        bt.onclick = ()=>{
          if(delayed){return}
          t.hp += 12 / (DIF**0.5)
          bt.classList.add("delay")
          delayed = true;
          STO(()=>{bt.classList.remove("delay");delayed=false},4000)
        }
    Wlimit(w,t)

  },(t)=>{
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("bulimic");closeIn(t)}
  })
  })


gameEvent(14.5*ENV.YEAR,()=>{
    new task("sleeping habbits",(t,w)=>{

    let bt = DCC("button",w.cdiv)
        bt.innerText = "maintain"
        let delayed = false
        bt.onclick = ()=>{
          if(delayed){return}
          t.hp += 8 / (DIF**0.5)
          bt.classList.add("delay")
          delayed = true;
          STO(()=>{bt.classList.remove("delay");delayed=false},2000)
        }
    Wlimit(w,t)

  },(t)=>{
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("insomiac");closeIn(t)}
  })
})

gameEvent(16.1*ENV.YEAR,()=>{
    new task("social status",(t,w)=>{

    let bt = DCC("button",w.cdiv)
        bt.innerText = "maintain"
        let delayed = false
        bt.onclick = ()=>{
          if(delayed){return}
          t.hp += 12 / (DIF**0.5)
          bt.classList.add("delay")
          delayed = true;
          STO(()=>{bt.classList.remove("delay");delayed=false},3000)
        }
    Wlimit(w,t)

  },(t)=>{
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("reject");closeIn(t)}
  })
})

gameEvent(17.1*ENV.YEAR,()=>{
    new task("Networking",(t,w)=>{

    let bt = DCC("button",w.cdiv)
        bt.innerText = "network"
        let delayed = false
        bt.onclick = ()=>{
          if(delayed){return}
          t.hp += 12 / (DIF**0.5)
          bt.classList.add("delay")
          delayed = true;
          STO(()=>{bt.classList.remove("delay");delayed=false},6000)
        }
    Wlimit(w,t)

  },(t)=>{
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{debuff("outcast");closeIn(t)}
  })
})

gameEvent(3*ENV.YEAR,()=>{
    new task("Go to kindergarten",(t,w)=>{
    learn1(w,t,[{"name":"learn",f:reward2(0.3)},{"name":"struggle",f:reward2(-0.4),times:3},{"name":"play",f:reward2(0.32),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))


  },(t)=>{
    t.setCompleteBefore(5.7*ENV.YEAR)
    t.done = ()=>{
      if(t.hp<30){
        debuff("dumb")
      }
      closeIn(t);
    }
    t.lose = ()=>{
      notify("you failed kindergarten")
      debuff("dumb")
    }
    t.record = []
    t.tick = (sdt)=>{
      t.progress += sdt
      t.hp -= sdt + t.hp*sdt/30
      if(t.hp < 0){t.hp=0}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})


gameEvent(3.3*ENV.YEAR,()=>{
    new task("Throw tamper tantrum",(t,w)=>{
    learn1(w,t,[{"name":"yell",f:reward2(0.3)},{"name":"fold",f:reward2(-0.4),times:3},{"name":"hit parents",f:reward2(0.1)},{"name":"throw",f:reward2(0.32)},{"name":"cry",f:reward2(0.20)}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))


  },(t)=>{
    t.setCompleteBefore(5.7*ENV.YEAR)
    t.lose = ()=>{
      debuff("wuss")
    }
    t.done = ()=>{
      if(t.hp<30){
        debuff("wuss")
      }
      closeIn(t);
    }
    t.record = []
    t.tick = (sdt)=>{
      t.progress += sdt
      t.hp -= sdt + t.hp*sdt/30
      if(t.hp < 0){t.hp=0}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})


pendEvent("Maintain kindergarten friends","+4",()=>{
    new task("Maintain childhood friends",(t,w)=>{
    learn1(w,t,[{"name":"remember",f:()=>{t.vx+=37/DIF}},{"name":"ignore",f:reward2(-0.4),times:3},{"name":"forget",f:reward2(-0.4),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

    w.canv().graph = {tx:40}

  },(t)=>{
    t.record = []
      t.vx = 0
      t.hp = stats.kindergarten_friends

    t.lose = ()=>{
      notify("you have lost all your kindergarten friends")
      debuff("nostalgiapathic")
      closeIn(t)
    }

    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 0.99
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (5+t.hp/2)*sdt/20
      t.hp += t.vx*sdt/20
      if(t.hp<1){t.hp = 1;} if(t.hp>stats.kindergarten_friends){t.vx=0;t.hp=stats.kindergarten_friends}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})

pendEvent("Maintain primary school friends","+4",()=>{
    new task("Maintain primary school friends",(t,w)=>{
    learn1(w,t,[{"name":"remember",f:()=>{t.vx+=37/DIF}},{"name":"ignore",f:reward2(-0.4),times:3},{"name":"forget",f:reward2(-0.4),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

    w.canv().graph = {tx:40}

  },(t)=>{
    t.record = []
      t.vx = 0
      t.hp = stats.ps_friends
    t.lose = ()=>{
      notify("you have lost all your primary school friends")
      debuff("poor social memory")
      closeIn(t)
    }
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 0.99
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (5+t.hp/2)*sdt/20
      t.hp += t.vx*sdt/20
      if(t.hp>stats.ps_friends){t.vx=0;t.hp=stats.ps_friends}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})

pendEvent("Maintain secondary school friends","+4",()=>{
    new task("Maintain secondary school friends",(t,w)=>{
    learn1(w,t,[{"name":"remember",f:()=>{t.vx+=37/DIF}},{"name":"ignore",f:reward2(-0.4),times:3},{"name":"forget",f:reward2(-0.4),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

    w.canv().graph = {tx:40}

  },(t)=>{
    t.record = []
      t.vx = 0
      t.hp = stats.hs_friends
      t.lose = ()=>{
      loseGame("lost all contact to society")
    }
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 0.99
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (5+t.hp/2)*sdt/20
      t.hp += t.vx*sdt/20
      if(t.hp<1){t.hp = 1;} if(t.hp>stats.hs_friends){t.vx=0;t.hp=stats.hs_friends}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})

gameEvent(5.7*ENV.YEAR,()=>{
    new task("Primary school grades (p1-p3)",(t,w)=>{
    learn1(w,t,[{"name":"muster",f:reward2(1.5*stats.focus,"vx")},{"name":"failure",f:reward(-5,"hp"),times:3},{"name":"neglect",f:reward2(-0.5,"vx"),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

    w.canv().graph = {tx:40}

  },(t)=>{
    t.record = []
      t.vx = 0
      t.hp = Math.random()*42+50

      t.done = ()=>{
        closeIn(t);
      }
      t.setCompleteBefore(8.7*ENV.YEAR)
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 1-(0.005*(t.hp/100)-0.001)
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (5+t.hp)*sdt/20
      t.hp += t.vx*sdt/40
      if(t.hp<1){t.hp = 1;} if(t.hp>100){t.vx=0;t.hp=100}
      t.record.push({time:t.progress,y:t.hp})
    }
  })
})

gameEvent(8.7*ENV.YEAR,()=>{
    new task("Primary school grades (p4-p6)",(t,w)=>{
    // learn1(w,t,[{"name":"muster",f:reward2(1.5,"vx")},{"name":"failure",f:reward(-5,"hp"),times:3},{"name":"neglect",f:reward2(-0.5,"vx"),times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))



    w.canv().graph = {tx:40,type:3,lines : []}

    w.subWinds = {
      "Chinese": new wind("subject: "),
      "English": new wind("subject: "),
      "Math": new wind("subject: "),
      "General studies": new wind("subject: "),
    }
    let subject_div = DCC("div",w.cdiv)

    t.subarr = Object.keys(w.subWinds)



    w.subWinds.Chinese.color = "orange"
    w.subWinds.English.color = "#40FFFF"
    w.subWinds.Math.color = "lime"
    w.subWinds["General studies"].color = "red"

    t.subarr.forEach((name)=>{
      let wind = w.subWinds[name]

      w.subWinds[name].cdiv.style.backgroundColor = w.subWinds[name].color

      t.records[name] = []
      wind.button = DCC("button",subject_div)
      wind.button.innerText = name

      wind.button.style.color = wind.color

      wind.score = Math.random()*80+20
      wind.div.style.visibility = "hidden";
      wind.bar.style.visibility = "hidden";
      wind.title.innerText = "subject: "+name

      wind.button.addEventListener("click",()=>{
        if(wind.div.style.visibility=="hidden"){
          wind.div.style.visibility = "visible";
          wind.bar.style.visibility = "visible";
          wind.div.style.top = Math.floor(mouseY) + "px"
          wind.div.style.left = Math.floor(mouseX + 50) + "px"
        } else {
          wind.div.style.visibility = "hidden";
          wind.bar.style.visibility = "hidden";
        }
      })
    })

    t.subarr.forEach((name)=>{
      let wind = w.subWinds[name]
      
      if(name=="Math"){
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "practice"
        wind.vx = 0
        bt.onclick = ()=>{wind.vx += 0.6+stats.focus*0.6}
      }

      if(name=="General studies"){
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "Grasp"
        wind.vx = 0
        let delayed = false
        bt.onclick = ()=>{
          if(delayed){return}
          wind.score += 10 + 4*stats.focus
          wind.vx += 5 + stats.focus
          bt.classList.add("delay")
          delayed = true;
          STO(()=>{bt.classList.remove("delay");delayed=false},2000)
        }
      }

      if(name=="Chinese"){
        wind.NOTWIND = true
        learn1(wind,t,[{"name":"memorize",f:()=>{wind.score+=stats.focus*3},times:5},{"name":"swear",f:()=>{wind.score+=5},times:5},{"name":"forget",f:()=>{wind.score-=5},times:40}],(w,t,d)=>{shuffleChildren(d)},DCC("div",wind.cdiv))

      }
      if(name=="English"){
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "curse"
        bt.style.position = "relative"
        bt.style.width = "20%"
        wind.vx = 0
        wind.bt = bt
        wind.x = 0
        wind.cdiv.style.overflow = "hidden"

        bt.onclick = ()=>{
          wind.score += 5 + stats.focus*2
          wind.vx += Math.random()-0.5
        }
      }

    })

  },(t)=>{
      t.cfs = [1.6,2.4,2.6,Infinity]
      t.cfsNo = 0
      t.vx = 0
      t.hp = Math.random()*42+50
      t.records = {}

      t.done = ()=>{

      let de = false
      console.log(t.wind.subWinds)
      Object.keys(t.wind.subWinds).forEach((e)=>{
        if(t.wind.subWinds[e].score < 40 && e!="Chinese"){
          notify("Failed horribly: "+e+"-"+Math.floor(t.wind.subWinds[e].score))
          de = true
        }
      })
      if(de){
        debuff(useful())
      }
        closeIn(t);
      }
      t.setCompleteBefore(11.7*ENV.YEAR)
    t.tick = (sdt)=>{

      t.progress += sdt


      t.subarr.forEach((e)=>{
        let tse=t.wind.subWinds[e]
        let sc = tse.score

        if(tse.score < 1){
          tse.score = 1
        }
        if(tse.score > 100){
          tse.score = 100
        }

        if(e == "Math"){
          tse.score -= (0.4+sc/150)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }

        if(e == "General studies"){
          tse.score -= (0.3 + sc/100)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }

        if(e == "Chinese"){
          tse.score -= (0.01+sc/150)*sdt * (DIF) /2
        }

        if(e == "English"){
          tse.score -= (0.3)*sdt * (DIF) /2
          tse.x += tse.vx
          tse.vx *= 0.995
          if(tse.x < 0){tse.x = 0; tse.vx = 0}
          if(tse.x > 80){tse.x = 80; tse.vx = 0}
          tse.vx += Math.random()-0.5
          tse.bt.style.left = Math.min(Math.floor(tse.x),80) + "%"
        }

        t.records[e].push({time:t.progress,y:tse.score})
      })
      if(t.progress > t.cfs[t.cfsNo]*ENV.YEAR){
        notify("Ching Fun Shit Exam!")


        t.wind.graph.lines.push(t.progress)
        let dict = {}
        let tot = 0
        t.subarr.forEach((e)=>{
          dict[e] = t.wind.subWinds[e].score
          tot += dict[e]
        })

        stats.CFS.push(dict)
        stats.CFST += tot
        t.cfsNo += 1
      }

    }
  })
})

gameEvent(7*ENV.YEAR,()=>{
    new task("Avoid anime",(t,w)=>{
    learn1(w,t,[{"name":"avoid",f:reward2(1.5,"vx")},{"name":"watch",f:(w,t)=>{t.hp -= 10; t.vx=Math.max(t.vx,0)},times:3},{"name":"watch",f:(w,t)=>{t.vx = Math.min(t.vx,0); t.vx -= (t.hp)*1.5*DIF},times:2}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))


    w.canv().graph = {tx:40,color:'red'}



  },(t)=>{
      t.record = []
      t.vx = 0
      t.hp = Math.random()*42+50

      t.lose = ()=>{
        closeIn(t);
        t.complete = true;
        t.div.classList.add("depleat")
        debuff("anime addict")
      }
      t.done = ()=>{
        closeIn(t);
      }
      t.setCompleteBefore(14*ENV.YEAR)
    t.tick = (sdt)=>{
      if(t.vx>0){
        t.vx *= 1-(0.005*(t.hp/100)-0.001)
      }
      t.progress += sdt
      // t.hp -= t.hp*sdt/30
      t.vx -= (5+t.hp)*sdt/20
      t.hp += t.vx*sdt/40
      
      if(t.hp>100){t.vx=0;t.hp=100}
      t.record.push({time:t.progress,y:100-t.hp})
    }
  })
})


gameEvent(5.7*ENV.YEAR,()=>{
    new task("focus",(t,w)=>{
    learn1(w,t,[{"name":"---",f:reward(-1.3,"current")},{"name":"+++",f:reward(1.3,"current")}],undefined,DCC("div",w.cdiv))
    w.canv().graph = {tx:40,type:2}


  },(t)=>{
    t.record = []

    t.aimto = 50
    t.current = 50

      t.vx = 0
      t.lastTick = 0
    t.tick = (sdt)=>{
      t.progress += sdt
      let tickpoint = Math.floor(t.progress*3)
      if(tickpoint > t.lastTick ){t.lastTick = tickpoint}else{return}
      t.hp = 100-Math.abs(t.current-t.aimto)*2
      t.vx += (Math.random()-0.5)/100
      t.vx *= 0.94
      t.current += (5*( (Math.random()-0.5)+(t.current/200-0.25))+ t.vx) * DIF
      //current = 0 -> -0.5
      //current = 1 -> 0.5
      stats.focus = t.hp/100
      if(t.current < 1){t.current = 1}
      if(t.current > 100){t.current = 100}
      t.hp = Math.max(t.hp,1)
      t.record.push({time:t.progress,y:t.current})
    }
  })
})




gameEvent(9.7*ENV.YEAR,()=>{
  new task("Select middle school",(t,w)=>{

    let d1 = DCC("div",w.div)
    let lab = DCC("span",d1)
    lab.innerText = "Choose Middle school: "
    lab.style.color = "white"
    let sel = DCC("select",d1)
    let arr = ["HLC","DBS","SHIT","RTD"]

    arr.forEach((e)=>{
      let op = DCC("option",sel)
      op.innerText = e
      op.value = e
    })

    t.setCompleteBefore((5.7+5.4)*ENV.YEAR)
    t.hp = Infinity
    t.done = ()=>{

      let grade_boundary = Math.floor(Math.random()*15 + 70)

      let avg = stats.CFST/8
      notify("grade boundary: "+grade_boundary)
      notify("your average: "+Math.floor(avg))

      if(avg<grade_boundary){
        notify("your average was too low to get into your school of choice. now rolling balls.")
        activateEvent("Rolling Ball: select HS")
      }



      t.complete = true;
      stats.HS = sel.value
      closeIn(t)
    }
  })
})


pendEvent("Rolling Ball: select HS","+2",()=>{
  new task("Roll pearl - select HS",(t,w)=>{
    w.title.innerText = "View: Roll pearl-select HS"
    t.buttons = []
    for(let i = 0; i < 20; i++){
      let bt = DCC("button",w.cdiv)
      bt.style.width = "100%"
      bt.innerText = genHS()
      t.buttons.push(bt)
    }

  },(t)=>{
    t.setCompleteBefore((5.7+6)*ENV.YEAR)
      t.lastTick = 0
      t.hp = Infinity
      t.done = ()=>{
        notify("Enrolled in: "+t.lastSchool)
        stats.HS = t.lastSchool
        closeIn(t)
      }
    t.tick = (sdt)=>{
      t.progress += sdt
      let tickpoint = Math.floor(t.progress*2)
      if(tickpoint > t.lastTick ){t.lastTick = tickpoint}else{return}
        
        let bt = ranarr(t.buttons)
        for( let i = 0; bt.classList.contains("roll") && i < 500; i++){
          bt = ranarr(t.buttons)
        }
        bt.classList.add("roll")
        STO(()=>{bt.classList.remove("roll")},1000)
        t.lastSchool=bt.innerText

    }
  })
})



gameEvent(11.7*ENV.YEAR,()=>{
    new task("Secondary school grades (s1-s3)",(t,w)=>{
    w.canv().graph = {tx:40,type:3,lines : []}
    w.subWinds = {
      "Chinese": new wind("subject: "),
      "English": new wind("subject: "),
      "Math": new wind("subject: "),
      "Science": new wind("subject: "),
      "History": new wind("subject: "),
    }
    let subject_div = DCC("div",w.cdiv)

    t.subarr = Object.keys(w.subWinds)



    w.subWinds.Chinese.color = "#707000"
    w.subWinds.English.color = "#208888"
    w.subWinds.Math.color = "#208020"
    w.subWinds["Science"].color = "#AA0000"
    w.subWinds["History"].color = "#803000"

    t.subarr.forEach((name)=>{
      let wind = w.subWinds[name]

      w.subWinds[name].cdiv.style.backgroundColor = w.subWinds[name].color

      t.records[name] = []
      wind.button = DCC("button",subject_div)
      wind.button.innerText = name

      wind.button.style.color = wind.color

      wind.score = Math.random()*80+20
      wind.div.style.visibility = "hidden";
      wind.bar.style.visibility = "hidden";
      wind.title.innerText = "subject: "+name

      wind.button.addEventListener("click",()=>{
        if(wind.div.style.visibility=="hidden"){
          wind.div.style.visibility = "visible";
          wind.bar.style.visibility = "visible";
          wind.div.style.top = Math.floor(mouseY) + "px"
          wind.div.style.left = Math.floor(mouseX + 50) + "px"
        } else {
          wind.div.style.visibility = "hidden";
          wind.bar.style.visibility = "hidden";
        }
      })
    })

    t.subarr.forEach((name)=>{
      let wind = w.subWinds[name]
      wind.vx = 0
      if(name=="Math"){
        let que = DCC("div",wind.cdiv)

        let barr = []


        let gen = ()=>{
          let x = Math.floor(Math.random()*200)
          let y = Math.floor(Math.random()*200)
          let ans = Math.floor(x+y)
          let ansarr = [ans]
          que.innerText = "whats "+x+" + "+y+"?"
          wind.ans = ans

          barr.forEach((e)=>{e.innerText=""})

          let zz= ranarr([0,1,2,3])

          barr.forEach((e,i)=>{
            if(i != zz){
              let tans = ans+Math.round(Math.random()*22-11)
              while(ansarr.includes(tans)){
                tans = ans+Math.round(Math.random()*22-11)
              }
              ansarr.push(tans)
              e.innerText = tans
            } else {e.innerText = ans}
          })


        }

        let fnc = (bt)=>{
          if(bt.innerText == wind.ans){
            notify("correct")
            wind.score += (5 + 2*stats.focus) / DIF
            wind.vx += 5 + stats.focus
          } else {
            notify("incorrect")
            wind.score -= 6
          }
          gen()
        }

        for(let i = 0; i < 4; i++){
          let bt = DCC("button",wind.cdiv)
          bt.innerText = ""
          barr.push(bt)
          bt.onclick = ()=>{fnc(bt)}
        }
        gen()

      }
      if(name=="History"){
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "Cram. Cram. Cram."
        wind.vx = 0
        bt.onclick = ()=>{wind.vx += 0.6+stats.focus*0.6}
      }

      if(name=="Science"){
        let delTime = [4000,2100,900,700]
        for(let i = 0; i < 4; i++){
          let bt = DCC("button",wind.cdiv)
          bt.innerText = "Grasp"
          wind.vx = 0
          let delayed = false
          bt.classList.add("delayThing")
          bt.onclick = ()=>{
            if(delayed){return}
            wind.score += (10 + 4*stats.focus)/2000*delTime[i]/10
            wind.vx += (5 + stats.focus)/2000*delTime[i]/10
            bt.style.animation = "flash7 "+(delTime[i]/1000)+"s forwards"
            delayed = true;
            STO(()=>{bt.style.animation="";delayed=false},delTime[i])
          }
        }
      }

      if(name=="Chinese"){
        wind.NOTWIND = true
        learn1(wind,t,[{"name":"memorize",f:()=>{wind.score+=stats.focus*3},times:5},{"name":"swear",f:()=>{wind.score+=5},times:5},{"name":"forget",f:()=>{wind.score-=5},times:40}],(w,t,d)=>{shuffleChildren(d)},DCC("div",wind.cdiv))
        wind.cdiv.classList.add("CHINESE")
        wind.div.style.width = "300px"
      }
      if(name=="English"){
        wind.cdiv.style.height = wind.cdiv.style.width = "230px"
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "curse"
        bt.style.position = "relative"
        bt.style.width = "20%"
        bt.style.height = "10%"
        wind.vx = 0
        wind.vy = 0
        wind.bt = bt
        wind.x = 0
        wind.y = 0
        wind.cdiv.style.overflow = "hidden"

        bt.onclick = ()=>{
          wind.score += 5 + stats.focus*2
          wind.vx += Math.random()-0.5
          wind.vy += Math.random()-0.5
        }
      }

    })

  },(t)=>{
      t.vx = 0
      t.hp = Math.random()*42+50
      t.records = {}
      t.cfs = 1

      t.done = ()=>{
        closeIn(t);
      }
      t.setCompleteBefore(14.7*ENV.YEAR)
    t.tick = (sdt)=>{

      t.progress += sdt


      t.subarr.forEach((e)=>{
        let tse=t.wind.subWinds[e]
        let sc = tse.score

        if(tse.score < 1){
          tse.score = 1
        }
        if(tse.score > 100){
          tse.score = 100
        }

        if(e == "Math"){
          tse.score -= (0.3 + sc/100)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt

        }

        if(e == "History"){
          tse.score -= (0.4+sc/150)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }

        if(e == "Science"){
          tse.score -= (0.3 + sc/100)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }

        if(e == "Chinese"){
          tse.score -= (0.01+sc/150)*sdt * (DIF) /2
        }

        if(e == "English"){
          tse.score -= (0.3)*sdt * (DIF) /2
          tse.x += tse.vx
          tse.y += tse.vy
          tse.vx *= 0.995
          tse.vy *= 0.995
          if(tse.x < 0){tse.x = 0; tse.vx = 0}
          if(tse.x > 80){tse.x = 80; tse.vx = 0}

          if(tse.y < 0){tse.y = 0; tse.vy = 0}
          if(tse.y > 90){tse.y = 80; tse.vy = 0}
          tse.vx += Math.random()-0.5
          tse.vy += Math.random()-0.5
          tse.bt.style.left = Math.min(Math.floor(tse.x),80) + "%"
          tse.bt.style.top = Math.min(Math.floor(tse.y),90) + "%"
        }

        t.records[e].push({time:t.progress,y:tse.score})
      })
      if(t.progress > (t.cfs-0.2)*ENV.YEAR){
        t.cfs += 1
        t.wind.graph.lines.push(t.progress)
        let dict = {}
        let tot = 0
        t.subarr.forEach((e)=>{
          dict[e] = t.wind.subWinds[e].score
          tot += dict[e]
        })
        let avg = tot/Object.keys(t.wind.subWinds).length
        notify("your average was: "+Math.floor(avg))

        if(avg<30){
          if(stats.repeatGrade == 1){
            loseGame("stupid and homeless - (repeat grade 2 times)")
          }
          notify("you had to repeat a grade.")
          stats.repeatGrade = 1
        }

      }
    }

  })
})


gameEvent((14.7 + stats.repeatGrade)*ENV.YEAR,()=>{
    new task("Secondary school grades (s4-s6)",(t,w)=>{
    w.canv().graph = {tx:40,type:3,lines : []}
    w.subWinds = {
      "Chinese": new wind("subject: "),
      "English": new wind("subject: "),
      "Math": new wind("subject: "),
      "Chemistry": new wind("subject: "),
      "Biology": new wind("subject: "),
      "Physics": new wind("subject: "),
    }
    let subject_div = DCC("div",w.cdiv)

    t.subarr = Object.keys(w.subWinds)



    w.subWinds.Chinese.color = "#707000"
    w.subWinds.English.color = "#208888"
    w.subWinds.Math.color = "#208020"
    w.subWinds["Chemistry"].color = "#AA0000"
    w.subWinds["Biology"].color = "#FF6060"
    w.subWinds["Physics"].color = "#2020FF"

    t.subarr.forEach((name)=>{
      let wind = w.subWinds[name]

      w.subWinds[name].cdiv.style.backgroundColor = w.subWinds[name].color

      t.records[name] = []
      wind.button = DCC("button",subject_div)
      wind.button.innerText = name

      wind.button.style.color = wind.color

      wind.score = Math.random()*80+20
      wind.div.style.visibility = "hidden";
      wind.bar.style.visibility = "hidden";
      wind.title.innerText = "subject: "+name

      wind.button.addEventListener("click",()=>{
        if(wind.div.style.visibility=="hidden"){
          wind.div.style.visibility = "visible";
          wind.bar.style.visibility = "visible";
          wind.div.style.top = Math.floor(mouseY) + "px"
          wind.div.style.left = Math.floor(mouseX + 50) + "px"
        } else {
          wind.div.style.visibility = "hidden";
          wind.bar.style.visibility = "hidden";
        }
      })
    })

    t.subarr.forEach((name)=>{
      let wind = w.subWinds[name]
      wind.vx = 0
      if(name=="Math"){
        let que = DCC("div",wind.cdiv)

        let barr = []


        let gen = ()=>{
          let x = Math.floor(Math.random()*50)
          let y = Math.floor(Math.random()*50)
          let ans = Math.floor(x*y)
          let ansarr = [ans]
          que.innerText = "whats "+x+" x "+y+"? (use calc)"
          wind.ans = ans

          barr.forEach((e)=>{e.innerText=""})

          let zz= ranarr([0,1,2,3,4,5])

          barr.forEach((e,i)=>{
            if(i != zz){
              let tans = ans+Math.round(Math.random()*42-21)
              while(ansarr.includes(tans)){
                tans = ans+Math.round(Math.random()*42-21)
              }
              ansarr.push(tans)
              e.innerText = tans
            } else {e.innerText = ans}
          })


        }

        let fnc = (bt)=>{
          if(bt.innerText == wind.ans){
            notify("correct")
            wind.score += (5 + 2*stats.focus) / DIF
            wind.vx += 5 + stats.focus
          } else {
            notify("incorrect")
            wind.score -= 6
          }
          gen()
        }

        for(let i = 0; i < 6; i++){
          let bt = DCC("button",wind.cdiv)
          bt.innerText = ""
          barr.push(bt)
          bt.onclick = ()=>{fnc(bt)}
        }
        gen()

      }
      if(name=="Biology"){
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "Stody. Study. Study."
        wind.vx = 0
        bt.onclick = ()=>{wind.vx += 0.2+stats.focus*0.6}
      }

      if(name=="Physics"){
        let d = DCC("div",wind.cdiv)
        d.innerText = "Experiment / THROB"
        let bt = DCC("input",wind.cdiv)
        bt.type = "range"
        bt.min = 1
        bt.max = 100
        bt.value = 50
        wind.vx = 0
        let lastval = 50
        bt.addEventListener('input', function() {
            wind.vx += 0.0025 * Math.abs(lastval - bt.value)
            lastval = bt.value
        });
      }

      if(name=="Chemistry"){
        let delTime = [4000,2100,900,700]
        for(let i = 0; i < 4; i++){
          let bt = DCC("button",wind.cdiv)
          bt.innerText = "Shek"
          wind.vx = 0
          let delayed = false
          bt.classList.add("delayThing")
          bt.onclick = ()=>{
            if(delayed){return}
            wind.score += (10 + 4*stats.focus)/2000*delTime[i]/10
            wind.vx += (5 + stats.focus)/2000*delTime[i]/10
            bt.style.animation = "flash7 "+(delTime[i]/1000)+"s forwards"
            delayed = true;
            STO(()=>{bt.style.animation="";delayed=false},delTime[i])
          }
        }
      }

      if(name=="Chinese"){
        wind.NOTWIND = true
        learn1(wind,t,[{"name":"memorize",f:()=>{wind.score+=stats.focus*6},times:5},{"name":"swear",f:()=>{wind.score+=10},times:5},{"name":"forget",f:()=>{wind.score-=5},times:40}],(w,t,d)=>{shuffleChildren(d)},DCC("div",wind.cdiv))
        wind.cdiv.classList.add("CHINESE")
        wind.div.style.width = "300px"
      }
      if(name=="English"){
        wind.cdiv.style.height = wind.cdiv.style.width = "230px"
        let bt = DCC("button",wind.cdiv)
        bt.innerText = "curse"
        bt.style.position = "relative"
        bt.style.width = "20%"
        bt.style.height = "20%"
        wind.vx = 0
        wind.vy = 0
        wind.bt = bt
        wind.x = 0
        wind.y = 0
        wind.cdiv.style.overflow = "hidden"

        bt.onclick = ()=>{
          wind.score += 5 + stats.focus*10
          wind.vx += Math.random()-0.5
          wind.vy += Math.random()-0.5
        }
      }

    })

  },(t)=>{
      t.vx = 0
      t.hp = Math.random()*42+50
      t.records = {}

      t.done = ()=>{
        closeIn(t);
      }
      t.setCompleteBefore((17.7+ stats.repeatGrade)*ENV.YEAR)
      t.cfs = 0
    t.tick = (sdt)=>{

      t.progress += sdt


      t.subarr.forEach((e)=>{
        let tse=t.wind.subWinds[e]
        let sc = tse.score

        if(tse.score < 1){
          tse.score = 1
        }
        if(tse.score > 100){
          tse.score = 100
        }

        if(e == "Math"){
          tse.score -= (0.3 + sc/100)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt

        }

        if(e == "Biology"){
          tse.score -= (0.4+sc/150)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }

        if(e == "Physics"){
          tse.score -= (0.4+sc/150)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }


        if(e == "Chemistry"){
          tse.score -= (0.3 + sc/100)*sdt * (DIF) /2
          tse.vx *= 0.99
          tse.score += tse.vx*sdt
        }

        if(e == "Chinese"){
          tse.score -= (0.01+sc/150)*sdt * (DIF) /2
        }

        if(e == "English"){
          tse.score -= (0.3)*sdt * (DIF) /2
          tse.x += tse.vx
          tse.y += tse.vy
          tse.vx *= 0.995
          tse.vy *= 0.995
          if(tse.x < 0){tse.x = 0; tse.vx = 0}
          if(tse.x > 80){tse.x = 80; tse.vx = 0}

          if(tse.y < 0){tse.y = 0; tse.vy = 0}
          if(tse.y > 80){tse.y = 80; tse.vy = 0}
          tse.vx += Math.random()-0.5
          tse.vy += Math.random()-0.5
          tse.bt.style.left = Math.min(Math.floor(tse.x),80) + "%"
          tse.bt.style.top = Math.min(Math.floor(tse.y),80) + "%"
        }

        t.records[e].push({time:t.progress,y:tse.score})
      })

       if(t.progress > (t.cfs-0.2)*ENV.YEAR){
        t.cfs += 1
        t.wind.graph.lines.push(t.progress)
        let dict = {}
        let tot = 0
        t.subarr.forEach((e)=>{
          dict[e] = t.wind.subWinds[e].score
          tot += dict[e]
        })
        let avg = tot/Object.keys(t.wind.subWinds).length
        notify("your average was: "+Math.floor(avg))

        if(avg<30){
          if(stats.repeatGrade == 1){
            loseGame("stupid and homeless - (repeat grade 2 times)")
          }
          notify("you had to repeat a grade.")
          stats.repeatGrade = 1
        }

      }

    }
  })
})



gameEvent(19*ENV.YEAR,()=>{
  winGame("Reached 19 years. Happy birthday")
})






// gameEvent(-Infinity,()=>{
//     new task("Learn to debug",(t,w)=>{
//     learn1(w,t,[{"name":"learn",f:reward2(0.3)},{"name":"observe",f:reward2(0.1),times:2},{"name":"stumble",f:reward2(-0.2),times:3}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))

//     w.canv().graph = {tx:40}



//   },(t)=>{
    // t.setCompleteBefore(1.5*ENV.YEAR)
//     // t.win = ()=>{activateEvent("Learn to run");closeIn(t)}
//     t.lose = ()=>{loseGame("crippled")}
//     t.record = []
//     t.tick = (sdt)=>{
//       t.progress += sdt
//       t.hp -= sdt/10 + t.hp*sdt/50  
//       t.record.push({time:t.progress,y:t.hp})
//     }
//   })
// })


// gameEvent(-Infinity,()=>{
//     new task("Learn to debug",(t,w)=>{
//     // learn1(w,t,[{"name":"learn",f:reward2(0.3)},{"name":"observe",f:reward2(0.1),times:2},{"name":"stumble",f:reward2(-0.2),times:3}],(w,t,d)=>{shuffleChildren(d)},DCC("div",w.cdiv))
//     learn1(w,t,[{"name":"---",f:reward(-1,"current")},{"name":"+++",f:reward(1,"current")}],undefined,DCC("div",w.cdiv))

//     w.canv().graph = {tx:40,type:2}



//   },(t)=>{
//     // t.win = ()=>{activateEvent("Learn to run");closeIn(t)}
//     t.lose = ()=>{loseGame("crippled")}
//     t.record = []

//     t.aimto = 50
//     t.current = 50

//     t.tick = (sdt)=>{
//       t.progress += sdt
//       t.hp = 100-Math.abs(t.current-t.aimto)*2
//       t.current += Math.random()-0.5 
//       t.record.push({time:t.progress,y:t.current})
//     }
//   })
// })






function useful(){
  return(atob('cmV0YXJkZWQ='))
}








// SKIPS.add("cry")
// SKIPS.add("cry2")
// SKIPS.add("Learn to run")
// SKIPS.add("Learn to speak")
// SKIPS.add("Learn to walk")
// SKIPS.add("Potty train")

// SKIPS.add("Make childhood friends")
// SKIPS.add("Go to kindergarten")
// SKIPS.add("Primary school grades (p1-p3)")
// SKIPS.add("Primary school grades (p4-p6)")
// SKIPS.add("Secondary school grades (s1-s3)")
// skiptime = 1.9*ENV.YEAR









/* IDEAS

Go out play: too much: Get kidnapped
Go out play: too little: socially stupid
//sep 2020 avoid genshin

Avoid anime/pokemon/ other temptations: 

["general studies","English","Chinese","Math"]
*/


// 75%+ 80+ // no pig -> wheel