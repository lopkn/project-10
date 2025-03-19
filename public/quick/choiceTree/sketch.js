
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



let EDITOR = window.location.href.includes("localhost")

let mouseX = 0
let mouseY = 0
lastMouseMove = Date.now()
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY);lastMouseMove = Date.now()}


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




function normalRandom(mean, stderr) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stderr + mean;
}


var scene = {
  "sounds":true,
  "interval":0.4,
  "beatsPerBar":4
}

function soundInit(){
    Tone.Transport.start();
    Tone.Transport.scheduleRepeat((time) => {
        music.runbar(time)
    }, scene.interval*scene.beatsPerBar)

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

  static arpeggiate(arr,time=scene.interval){
    arr.forEach((e,i)=>{
      setTimeout(()=>{this.playBell(e)},i*time*1000)
    })
  }

  static runbar(){
    let arr = []

    this.arpeggiate(arr)
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


/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============




let mainDiv = document.getElementById("main")
function newElm(id=Math.random(),type="div",parent=mainDiv){
  let elm = document.createElement(type)
  parent.appendChild(elm)
  elm.id = id
  return(elm)
}

let pathDiv = newElm("path","div",mainDiv)
pathDiv.innerText="[0]"
pathDiv.style.backgroundColor = "#000050"
pathDiv.style.fontSize="10px"

let topTextDiv = newElm("top","div",mainDiv)
topTextDiv.style.backgroundColor = "#000050"
topTextDiv.style.width = "100%"
topTextDiv.style.display = "inline-block"
topTextDiv.style.height = "fit-content"
//topTextDiv.classList.add("hover1")
topTextDiv.style.fontSize="10px"
//topTextDiv.innerText = "[0]"


let mainText = newElm("mainText","div",topTextDiv)
mainText.style.backgroundColor = "#000050"
mainText.style.width = "100%"
mainText.style.display = "inline-block"
mainText.style.textAlign = "center"
mainText.style.height = "fit-content"
mainText.style.fontSize="40px"
mainText.innerText = "Welcome to my domain"
mainText.classList.add("hover1")




let mainEditor = document.getElementById("editor")
mainEditor.style.backgroundColor = "#0F0F0F"
// mainEditor.style.borderStyle = "dashed"
// mainEditor.style.borderWidth = "3px"
// mainEditor.style.borderColor = "purple"
mainEditor.style.border = "#A000FF 4px dashed"


let mainButtonDiv = newElm("btn","div",mainDiv)
mainButtonDiv.style.backgroundColor = "#005050"
mainButtonDiv.style.width = "100%"
mainButtonDiv.style.display = "inline-block"
mainButtonDiv.style.height = "fit-content"
mainButtonDiv.classList.add("hover1")





let subText = newElm("subText","div",mainDiv)
subText.style.backgroundColor = "#000000"
subText.style.width = "100%"
subText.style.display = "inline-block"
//subText.style.textAlign = "center"
subText.style.height = "fit-content"
subText.style.fontSize="20px"
subText.innerText = "LopknA65"
//subText.classList.add("hover1")




let mainInput = newElm("in","div",mainDiv)
mainInput.style.height= "20%"
mainInput.style.position = "absolute"
mainInput.style.bottom = "0%"
mainInput.style.left = "0%"
mainInput.style.color = "#00F000"
mainInput.contentEditable = true
mainInput.style.display = "inline-block"
mainInput.classList.add("focus1")




let inputPrompt = newElm("prompt","div",mainDiv)
inputPrompt.style.height= "fit-content"
inputPrompt.style.position = "absolute"
inputPrompt.style.bottom = "28%"
inputPrompt.style.left = "5%"
inputPrompt.style.color = "#00F000"
inputPrompt.style.display = "inline-block"
inputPrompt.innerText = ""


function changeMainText(str="testText"){
    mainText.innerText = str
    return(mainText)
}


function addButton(content="test",id=Math.random()){
    let btn = document.createElement("button")
    mainButtonDiv.appendChild(btn)    
    btn.innerText = content
    btn.id = id
    btn.style.fontSize = "26px"
    btn.classList.add("hover2")
    return(btn)
}

function removeAllChildren(elm) {
    while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
    }
    return(elm)
}


var context = {}


function editorOption(type="div",text="",optionName="option"){

    if(type==="exec"){return;}





    let wrapperDiv = document.createElement("div")
    let wrapperSpan = document.createElement("span")
    wrapperSpan.innerText = optionName
    wrapperSpan.style.font = "18px Monaco"
    wrapperSpan.style.color = "white"
    wrapperSpan.style.minWidth = "10%"
    wrapperSpan.style.display = "inline-block"
    wrapperSpan.style.margin = "3px"

    let elm = document.createElement(type)

    if(type === "switch"){
      elm = document.createElement("input")
      let lab = document.createElement("label")
      let spa = document.createElement("span")
      elm.type = "checkbox"
      lab.classList.add("switch")
      spa.classList.add("slider")
      elm.classList.add("switch")

      lab.appendChild(elm)
      lab.appendChild(spa)
      wrapperDiv.append(wrapperSpan)
      wrapperDiv.append(lab)
      mainEditor.appendChild(wrapperDiv)
      return(elm);
      // <label class="switch">
      //   <input class = "switch" type="checkbox">
      //   <span class="slider switch"></span>
      // </label>

    }

    elm.innerText = text
    elm.style.margin = "5px"
    // elm.style.backgroundColor = "white"
    elm.style.color = "black"
    elm.style.minWidth = "20%"
    elm.style.padding = "4px"
    elm.style.width = "auto"
    elm.style.height = "auto"
    elm.style.fontSize = "18px"
    elm.style.fontFamily = "Monaco"
    if(type==="div"){
        elm.contentEditable = true
        elm.style.backgroundColor = "white"
    } else if(type === "button"){
        elm.classList.add("hover2")
    }
    elm.style.display = "inline-block"

    wrapperDiv.appendChild(wrapperSpan)
    wrapperDiv.appendChild(elm)

    mainEditor.appendChild(wrapperDiv)



    return(elm)
}
function closeEditor(save=false){
    mainEditor.style.visibility = "hidden"
}

function extractEditor(l=editorLoaded){
  Object.keys(l).forEach((e)=>{

      if(l[e].type==="div"){
        l[e].val = l[e].ELM.innerText
        intermediate[e] = l[e].val
      } else if(l[e].type === "switch"){
        l[e].val = l[e].ELM.checked
        intermediate[e] = l[e].val
      }
    })  
  return(l)
}


var editorLoaded = {}

function loadEditor(l){
  editorLoaded = l
    Object.keys(l).forEach((e)=>{
        l[e].ELM = editorOption(l[e].type,l[e].default?l[e].default:intermediate[e],l[e].name?l[e].name:e+":") // if it doesnt have a name, make it the element name
    })   
}

function openEditor(l){
  if(l!== undefined){
    removeAllChildren(mainEditor)
    mainEditor.style.visibility = "visible"
    loadEditor(l)

    let exit = editorOption("button","CLOSE","")
    exit.onclick = ()=>{closeEditor()}

    let done = editorOption("button","DONE","")
    done.onclick = ()=>{extractEditor(editorLoaded);if(editorLoaded.done?.func){editorLoaded.done.func()}else{closeEditor()}}
  } else {
    mainEditor.style.visibility = "visible"
  }
    

}




// mainEditor.style.visibility = "visible"

function editorMenu(s,carry=true,varbs={}){
  if(carry===false){
    intermediate = {}
  }
  openEditor(editorDict(s,varbs))
}


// openEditor({"CHOICE":{"type":"span"},"name:":{"type":"div"},"to:":{"type":"div"}})

function editorDict(s,varbs){

  if(s === "choice"){
    return({
      "title":{"type":"span","name":"CHOICE"},
      "name":{"type":"div"},
      "to":{"type":"div"},
      "index":{"type":"div",default:V1[path].buttons.length},
      "done":{"type":"exec","func":(l)=>{


          if(intermediate.name === ""){
            intermediate.name = "unnamed"
          }

          intermediate.to = (intermediate.to===''||intermediate.to==="\n")?getCUUID():intermediate.to

          V1[path].buttons.splice(intermediate.index,0,{name:intermediate.name,to:intermediate.to})
          load(path)

          if(V1[intermediate.to]===undefined){
              intermediate = {to:intermediate.to}
              log("the stated path is empty.")
              editorMenu("new")
          } else {
              closeEditor()
          }

        }
      }
    })}
  else if(s === "new"){
     return({
      "title":{"type":"span","name":"NEW CELL"},
      "to":{"type":"div"},
      "text":{"type":"div"},
      "subtext":{"type":"div"},
      "done":{"type":"exec","func":(l)=>{
          log("V1["+intermediate.to+"]={buttons:[],text:`"+intermediate.text+"`,subtext:`"+intermediate.subtext+"`}");
          V1[intermediate.to]={buttons:[],text:intermediate.text,subtext:intermediate.subtext}
          closeEditor()
        }
      }
    })}
  else if(s === "edit button"){

    return({
      "title":{"type":"span","name":"EDIT BUTTON"},
      "name":{"type":"div",default:varbs.button.name},
      "to":{"type":"div",default:varbs.button.to},
      "index":{"type":"div",default:varbs.pos},
      "done":{"type":"exec","func":(l)=>{
        varbs.button.name = intermediate.name
        varbs.button.to = intermediate.to;
        [V1[path].buttons[varbs.pos],V1[path].buttons[intermediate.index]] = [V1[path].buttons[intermediate.index],V1[path].buttons[varbs.pos]];
        load(path)
        closeEditor()
      }
    }})
  }
  else if(s === "edit page"){

    return({
      "title":{"type":"span","name":"EDIT PAGE"},
      "text":{"type":"div",default:varbs.page.text},
      "subtext":{"type":"div",default:varbs.page.subtext},
      "done":{"type":"exec","func":(l)=>{
        varbs.page.text = intermediate.text
        varbs.page.subtext = intermediate.subtext;
        load(path)
        closeEditor()
      }
    }})
  }

}

// to call a func, change the intermediate, and just do editorDict(s,<varbs>).done.func()

function pressedButton(btn){
    log(btn.name + " §")
    //if(btn.text){
    //   changeMainText(btn.text) 
    //}

    if(btn.req){
        for(let i = 0; i < btn.req.length; i++){
            if(!context[btn.req[i]]){ // does not have this requirement
                load(btn.req[i])
                return;
            }
        }
    }

        load(btn.to)
        // music.arpeggiate([40+Math.random()*30,40+Math.random()*30,40+Math.random()*30])
        music.playBell(40+Math.random()*30)
}

function plog(str){
    log(str)
    inputPrompt.innerText = str
}

function seg(str){
    segregate.push({back:str,context:path})
}


let patharr = []

function load(p=path,dict=V1){
    if(p==="back"){
        if(segregate.length){
            segment = segregate.pop()
            p = segment.back
            context[segment.context] = true
        } else {
            log("error: there is no backtracking")
            return
        }
    }
    patharr.push(p)
    path = p
    removeAllChildren(mainButtonDiv)
    let d = dict[p]

    pathDiv.innerText += "-" + p
    if(d===undefined){
        changeMainText("Turn back")
        return;
    }

    if(d.text){
        mainText.style.fontSize="40px"
        changeMainText(d.text)
        if(mainText.getBoundingClientRect().height > window.innerHeight/3){
          mainText.style.fontSize="30px"
        }


    } else {changeMainText("untitled")}
    if(d.subtext){
        subText.innerText = d.subtext
    }  else {subText.innerText = ""}

    if(d.seg){
        seg(patharr[patharr.length-2])
        log("context segregate")
    }


    if(d.type=="v1"||d.type===undefined){
        d.buttons.forEach((btn,i)=>{
          let button = addButton(btn.name)
          button.onclick = (e)=>{pressedButton(btn)}

          if(EDITOR){

            button.onmouseup = (e)=>{
              if(e.which===3){
                editorMenu("edit button",false,{button:btn,pos:i})
              return;
            }
          }
        }

        })
        
    }



    if(EDITOR){
    let backButton = addButton("<-")
    backButton.onclick=()=>{
        patharr.pop()
        load(patharr.pop())
    }
    backButton.classList.add("hover3")
      let button = addButton("+")
      button.onclick = ()=>{editorMenu("choice",false)}
      button.classList.add("hover3")
      button = addButton("edit")
      button.onclick = ()=>{editorMenu("edit page",false,{page:V1[path]})}
      button.classList.add("hover3")
      button = addButton("copy")
      button.onclick = ()=>{navigator.clipboard.writeText(JSON.stringify(V1,null,4))}
            
      button.classList.add("hover3")
    }

}







//original V1 pasted




// CONTEXT SEGREGATES: HOW THEY WORK

// add the seg:1 tag on a cell
// that cell name is now a segregate
// the next time a button with to:"back" is clicked, this segregate will be flagged as done



var path = 0
var segregate = []


var log = (e)=>{console.log(e);let elm=document.getElementById("console");elm.innerText += "\n> " + e;elm.scrollTop=elm.scrollHeight}
load()


var inputQueue = []



function processInput(txt){
    inputPrompt.innerText = ""
    if(inputQueue.length){
        let f = inputQueue.pop()
        f(txt)
    } else {
        defaultInputQueue(txt)  
    }
}


function defaultInputQueue(txt){
    log("defaulted")
    if(txt==="choice"){
        plog("name?")
        inputQueueAdd(choiceINQ)
    }
    else if(txt === "eval"){
        plog("eval?")
        inputQueue.push((x)=>{eval(x)})
    }
    else if(txt === "home"){
        load(0)
    }
    else if(txt === "back"){
        patharr.pop()
        load(patharr.pop())
    }
    else if(txt === "edit"){
        plog("edit item?")
        setInput("text")
        inputQueueAdd(editINQ)
    }
    else if(txt === "copy"){
        navigator.clipboard.writeText(JSON.stringify(V1,null,4))
    }
    else if(txt === "redirect"){
        plog("redirect button?")
        inputQueueAdd(redirectINQ)
    }
    else if(txt === "goto"){
        plog("goto?")
        inputQueue.push((x)=>{load(x)})
    }
    else if(txt === "context"){
        
    }
    else if(txt === "editor"){
        EDITOR = !EDITOR
        plog("editing: "+EDITOR)
    }
}

function inputQueueAdd(x){
    for(let i = x.length-1; i > -1; i--){
        inputQueue.push(x[i])
    }
}

var intermediate = {}

var choiceUUID = 1;
function getCUUID(){
    while(V1[choiceUUID]){
        choiceUUID++
    }
    return(choiceUUID)
}

var choiceINQ = [
    (txt)=>{intermediate={};intermediate["name"] = txt;plog("to?")},
    //(txt)=>{intermediate["text"] = txt;log("subtext?")},
    //(txt)=>{intermediate["subtext"] = txt;log("to?")},
    (txt)=>{intermediate["to"] = ( (txt===''||txt==="\n")?getCUUID():txt);log(V1[intermediate.to]?"exists":"empty"); setInput("done? y")},
    (txt)=>{/*done?*/ if(txt==="done? y"){
        log("V1["+path+"].buttons.push("+JSON.stringify(intermediate)+")")
        V1[path].buttons.push(JSON.parse(JSON.stringify(intermediate)))
        load(path)

        if(V1[intermediate.to]===undefined){
            intermediate = {to:intermediate.to}
            log("the stated path is empty.")
            plog("text?")
            inputQueueAdd(pathINQ)
        }

    }}
]

var pathINQ = [
    (txt)=>{intermediate.text=txt; plog("subtext?")},
    (txt)=>{intermediate.subtext=txt; 
    log("V1["+intermediate.to+"]={buttons:[],text:`"+intermediate.text+"`,subtext:`"+intermediate.subtext+"`}");
        V1[intermediate.to]={buttons:[],text:intermediate.text,subtext:intermediate.subtext}
    },
]

var editINQ = [
    (t)=>{intermediate.editItem=t;plog("content?");setInput(V1[path][t])},
    (t)=>{V1[path][intermediate.editItem]=t;log("edited");load(path)}
]

var redirectINQ = [
    (t)=>{intermediate={};let x = V1[path].buttons[t];if(x){intermediate.button=x;plog("to?");setInput(x.to)}else{log("button does not exist")}},
    (t)=>{if(intermediate.button){intermediate.button.to=(t===""?getCUUID():t);
        log(V1[t]?"exists":"empty")

        if(V1[intermediate.button.to]===undefined){
            intermediate = {to:intermediate.to}
            log("the stated path is empty.")
            plog("text?")
            inputQueueAdd(pathINQ)
        }
    }}
]



function setInput(str){
    mainInput.innerText = str
}

let inputlog = []

var ilid = 0

mainInput.addEventListener("keydown",(e)=>{
    if(e.key=="Enter" && !e.shiftKey){
        txt = mainInput.innerText
        mainInput.innerText = ""

        while(txt[txt.length-1]==="\n"){
            txt=txt.slice(0, -1)
        }

        inputlog.push(txt)
        log(txt)
        if(txt==="\n"){console.log("hey did you just press enter?")}
        processInput(txt)
        e.preventDefault()
        ilid = 0
    }
    if(e.shiftKey || mainInput.innerText === ""){
        if(e.key === "ArrowUp"){
            ilid += 1
            mainInput.innerText = inputlog[inputlog.length-ilid]
        } else if(e.key === "ArrowDown"){
            ilid -= 1
            if(ilid<1){ilid=1}
            mainInput.innerText = inputlog[inputlog.length-ilid]
        }
    }
})



function processAuto(arr){
    arr.forEach((e)=>{
        processInput(e)
    })
}





window.addEventListener('beforeunload', function (event) {
            // Customize the message (not all browsers show this message)
            navigator.clipboard.writeText(JSON.stringify(V1,null,4))
            const message = "Are you sure you want to leave?";
            event.returnValue = message; // Standard way to show the dialog
            return message; // For some older browsers
        });


document.addEventListener("contextmenu",(e)=>{e.preventDefault()})




///// JS SHIT

let dcirc = (Width+Height)*2.6

function dampen(n,o,f){
  return(n*f+o*(1-f))
}

let t = 0

function mainLoop(){
  ctx.clearRect(0,0,Width,Height)

  let dt = Date.now()-lastMouseMove
  if(dt < t){
    t = dampen(dt,t,0.015)
    lastMouseMove = Date.now()-t/0.99
  } else {
    t = dt
  }

  if(t/10>dcirc){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,Width,Height)
    let hallucinationProgress = t-dcirc


    if(Math.random()>0.97){
        let div = document.createElement("div")
        div.style.color = "#0F0"

        let letter
        {

            lowercaseAsciiStart = 97;
            letterIndex = Math.floor(Math.random() * 26);
            letter = String.fromCharCode(lowercaseAsciiStart + letterIndex)
        }

        div.innerText = letter
        div.style.left = Math.floor(Math.random()*Width)+"px"
        div.style.position = "absolute"
        let siz = (Math.floor(Math.random()*120+10))
        div.style.fontSize = siz + "px"
        div.style.textShadow = "0px 0px "+Math.floor(siz/2)+"px #0F0"
        div.style.textShadow = div.style.textShadow+","+div.style.textShadow+","+div.style.textShadow
        div.classList.add("dstart")
        div.style.animation = "trans "+(Math.floor(Math.random()*100+50)/10)+"s linear forwards"
        document.getElementById("myTopDiv").appendChild(div)
    }
    let children = document.getElementById("myTopDiv").children
    for(let i = 0; i < children.length; i++){

        e=children[i]

        e.style.top = parseFloat(e.style.top.slice(0, -1)) + 1 + "%"
        if(e.getBoundingClientRect().y >= Height){
            e.remove()
        }
    }




  } else{
    let darkGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX,mouseY, Math.max(dcirc-t/10,1))
      darkGrad.addColorStop(0,"rgba(0,0,0,0)")
      darkGrad.addColorStop(0.15,"rgba(0,0,0,0.1)")
      darkGrad.addColorStop(0.5,"rgba(0,0,0,0.8)")
      darkGrad.addColorStop(1,"rgba(0,0,0,1)")
      ctx.fillStyle = darkGrad
      ctx.fillRect(0,0,Width,Height)
  }


  


  requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)













