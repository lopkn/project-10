
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

// can = new LCanvas()
// can.clear()
// can.fitScreenSize()
// can.canvas.style.pointerEvents = "none"



let main = document.getElementById("main")
let overlay = document.getElementById("overlay")




class wind{
  constructor(name="untitled",canvas=false,res=false){

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

    if(canvas){
    this.div.style.height = "130px"
      this.lc = new LCanvas()
      this.cdiv.appendChild(this.lc.canvas)
      this.lc.fit()

      this.rf = ()=>{console.log("HEY"); this.lc.fit()}
      this.ros = new ResizeObserver(this.rf).observe(this.cdiv)
    }

    
  }

  close(){
    this.div.remove()
  }
  tick(){
    if(this.lim){this.lim()}
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
      el2.style.width = Math.floor(a)+"%";el3.style.width = Math.floor(b)+"%"}
}


let mainWindow = new wind("TASKS")

let windowArr = [mainWindow]

let taskArr = []

let eventBank = {}

let gameEvents = [{time:Infinity,event:()=>{console.log("infinity reached")}}] //{"time":}

let start = Date.now()

let mainLoop = setInterval(()=>{
  mainFunc(20)
},20)



var PROGRESS = 0
// var DIF = 0.05 //difficulty
var DIF = 1 //difficulty

class ENV{
  static YEAR = 60 //a year is 60 progress seconds
  static DAY = 0
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


class task{
  constructor(name="unnamed",windf,pref=()=>{}){

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

    pref(this)

    this.div.addEventListener("mousedown",()=>{
      this.wind = new wind("task: "+name)
      this.wind.div.style.top = Math.floor(mouseY) + "px"
      this.wind.div.style.left = Math.floor(mouseX + 50) + "px"

      windf(this,this.wind)
    },{once:true})

  }

  setCompleteBefore(t){
    this.completeBefore = t;
    this.timeAllowed = t-PROGRESS
  }

  tick(sdt){
    this.progress += sdt
    this.hp -= sdt/0.6

  }
  check(){
    if(this.hp <= 0 || PROGRESS > this.completeBefore){
      this.lose()
    }
    if(this.completion >= 100){
      this.complete = true
      this.div.classList.add("complete")
      this.div.classList.remove("urgent")

      this.win()
      console.log("task complete: "+this.name)


      this.limit = 0
      if(this.wind){this.wind.tick()}
        return;
    }
    
    this.calculate()

    if(this.limit<30){
      this.div.classList.add("urgent")
    } else {
      this.div.classList.remove("urgent")
    }

    if(this.wind){this.wind.tick()}


  }

  calculate(){
    let candidate = [this.hp]
    if(this.timeAllowed!==undefined){
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


function loseGame(reason="no reason"){
  el= DCC("div",document.body)
  el.style.zIndex="99999"
  el.classList.add("loser")
  el.innerText = "YOU DIED:\n"+reason

  clearInterval(mainLoop)
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

function learn1(w,t,arr,func){ // [{"name":"learn",f:f}] , master func

  arr.forEach((e)=>{
    let times = e.times?e.times:1
    for(let i = 0; i < times; i++){
      let el = DCC("button",w.cdiv)
      el.innerText = e.name
      el.onclick = ()=>{
        e.f(w,t)
        func(w,t)
      }
    }
  })



  Wlimit(w,t)

}


function reward(x){
  return((w,t)=>{t.completion += x/DIF})
}


















new task("be born",(t,w)=>{
  let el = DCC("button",w.div)
  el.innerText = "GET BORN"
  el.onclick = ()=>{
    t.completion += 5 / DIF
  }
  t.win = ()=>{PROGRESS=0;
    activateEvent("cry");
    startYearCounter()
    closeIn(t)}
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
      t.completion += 5 / DIF
    }
      Wlimit(w,t)
  },(t)=>{
    t.setCompleteBefore(PROGRESS + 80*ENV.DAY)
    t.win = ()=>{if(PROGRESS<2*ENV.YEAR){activateEvent("cry2")};closeIn(t)}
    t.lose = ()=>{loseGame("forgot to cry, parents neglected you. You starved.")}
  })
})




gameEvent(4*ENV.YEAR,()=>{
    new task("go to kindergarten",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "struggle"
    el.onclick = ()=>{
      t.completion += 4 / DIF
    }
  },(t)=>{
    t.completeBefore = PROGRESS + 40*ENV.DAY
    t.win = ()=>{activateEvent("cry");closeIn(t)}
    t.lose = ()=>{loseGame("skipped kindergarten")}
  })
})


gameEvent(0.25*ENV.YEAR,()=>{
    new task("Learn to walk",(t,w)=>{

    let el = DCC("button",w.div)
    el.innerText = "Learn"
    el.onclick = ()=>{
      t.completion += 2 / DIF
    }
    Wlimit(w,t)
  },(t)=>{
    t.completeBefore = 1.5*ENV.YEAR
    t.win = ()=>{activateEvent("Learn to run");closeIn(t)}
    t.lose = ()=>{loseGame("crippled")}
  })
})



pendEvent("Learn to run","+0",()=>{
    new task("Learn to run",(t,w)=>{

    learn1(w,t,[{"name":"learn",f:reward(5)},{"name":"observe",f:reward(1),times:2},{"name":"stumble",f:reward(-0.2),times:3}],(w,t)=>{shuffleChildren(w.cdiv)})
    
  },(t)=>{
    t.completeBefore = 1.5*ENV.YEAR
    t.win = ()=>{closeIn(t)}
    t.lose = ()=>{loseGame("crippled")}
  })
})




// gameEvent(0,()=>{
//     new task("Learn to debug",(t,w)=>{

//     learn1(w,t,[{"name":"learn",f:reward(5)},{"name":"observe",f:reward(1),times:2},{"name":"stumble",f:reward(-0.2),times:3}],(w,t)=>{shuffleChildren(w.cdiv);console.log("hey")})
//   },(t)=>{
//     t.completeBefore = 1.5*ENV.YEAR
//     t.win = ()=>{activateEvent("Learn to run");closeIn(t)}
//     t.lose = ()=>{loseGame("crippled")}
//   })
// })



