
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = Math.floor(Width)+"px"
  myCanvas.style.height = Math.floor(Height)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"










let myrec = document.getElementById("final")

  myrec.width = "80%"
  myrec.height = Math.floor(Height)
  myrec.style.width = "80%"
  myrec.style.height = Math.floor(Height)+"px"
  myrec.style.top = "0px"
  myrec.style.left = "0px"

let myterm = document.getElementById("term")

  myterm.width = "20%"
  myterm.height = Math.floor(Height)
  myterm.style.width = "20%"
  myterm.style.height = Math.floor(Height)+"px"
  myterm.style.top = "0px"
  myterm.style.left = "80%"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
let moveEnd = false
let autoEnter = false
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}




if ('speechSynthesis' in window) {
  // Create a new SpeechSynthesisUtterance instance
  var message = new SpeechSynthesisUtterance();
  message.voice = speechSynthesis.getVoices()[3];

}


function speak(str){
  message.rate = 1
  message.voice = speechSynthesis.getVoices()[3];
  message.text = str;
  speechSynthesis.cancel()
  speechSynthesis.speak(message)
}



const socket = io.connect('/')


let lastManualSave = ""

document.addEventListener('keydown',(e)=>{
  if(e.key == "1"){
    e.preventDefault()
    let span = document.createElement("span")

    span.style.color = "yellow"

    span.innerHTML = rst[final][0].transcript
    lastMeanualSave = rst[final][0].transcript
    myrec.appendChild(span)
    if(moveEnd){
      moveCaretToEnd(myrec)
    }

    let arr = myrec.getElementsByClassName("temp")
    for(let i = 0; i < arr.length; i++){
      arr[i].remove()
    }
    // final +=1
  }
  if(e.key == "2"){
    last.remove()
  }
  if(e.key == "\\" && e.metaKey){
    fahadMode=true
    document.body.style.backgroundColor = "white"
  }
})
let final = 0

let fahadMode = false
let rec = new webkitSpeechRecognition()
rec.onresult = (e)=>{recf(e)}
    
let restartAMT = 2000;

setInterval((e)=>{restartAMT+=1},1000)

rec.onend=()=>{rec.start();console.log("restart");

  final = 0; 
  myrec.innerHTML += storestring + "\n"
  if(moveEnd){
      moveCaretToEnd(myrec)
    }
  storestring = ""
  restartAMT -= 1
  if(restartAMT < 0){
    rec.onend = ()=>{}
  }
}


rec.continuous = true
rec.interimResults = true
rec.maxAlternatives = 3
rec.start()

let storestring = ""

let rst = {}
let AUTO = true
let last = ""

function recf(e){

  let arr = document.getElementById("final").getElementsByClassName("temp")
    for(let i = 0; i < arr.length; i++){
      arr[i].remove()
    }

  rst=e.results
  storestring = e.results[e.results.length-1][0].transcript
  console.log(e.results.length+"::"+storestring)
  interm(storestring)

  if(e.results[final].isFinal){


    let span = document.createElement("span")

    let conf = e.results[e.results.length-1][0].confidence
    console.log("CONF = " + conf)
    if(e.results[e.results.length-1][1]){
    console.log("ALT = "+e.results[e.results.length-1][1].transcript)
    span.alternative1 = e.results[e.results.length-1][1].transcript
    if(e.results[e.results.length-1][2]){
    console.log("ALT = "+e.results[e.results.length-1][2].transcript)
    span.alternative2 = e.results[e.results.length-1][2].transcript

    }}

    conf = (conf-0.75)*4

    rgb = Math.floor((1-conf)*255) + "," +Math.floor(conf*255) +",0"
    span.style.color = "rgb("+rgb+")"
    if(fahadMode){
      span.style.color="black"
    }

    let result = e.results[final][0].transcript
    if(lastManualSave != ""){
      while(result[0] == lastManualSave[0]){
        result = result.substring(1)
        lastManualSave = lastManualSave.substring(1)
      }
      lastManualSave = ""
    }


    result = resultDecoder(result)

    span.innerHTML = result

    let lower = result.toLowerCase()
    if(lower.includes("toggle auto")){
      AUTO = !AUTO
    } else if(lower.includes("toggle enter")){
      autoEnter = !autoEnter
      console.log('hi')
    } else if(AUTO){
      socket.emit("text",{"text":result,"enter":autoEnter})
    }

    last = span
    document.getElementById("final").appendChild(span)
if(moveEnd){
  moveCaretToEnd(myrec)
}
    // document.getElementById("final").innerHTML += "<span style='color:rgb("+rgb+")'>"+e.results[final][0].transcript+"</span>"

    final+=1
  } else {
    
    whiteText()
  }

}

function resultDecoder(r){
  // let letter = ""
  // if(r[0] != " " && r[1] == " "){
  //   letter = letter = r[0]
  // }
  // for(let i = 1; i < r.length; i++){
  //   if(r[i] != " " && r[i+1] == " "&& r[i-1] == " "){
  //     letter = letter + r[i]
  //     i++
  //     continue
  //   }
  // }
  // return()
  let split = r.split(" ")
  let arr = []
  split.forEach((e)=>{
    if(e.length !== 1){
      if(arr[arr.length-1]?.spaced && e == "space"){
        arr[arr.length-1].spaced = false
        return
      }
      if(arr[arr.length-1]?.spaced && arr[arr.length-1]?.text.length==2){
        arr[arr.length-1].text = arr[arr.length-1].text[1] 
      }
      arr.push({"text":e,"spaced":false})
    } else {
      if(arr[arr.length-1]?.spaced){
        arr[arr.length-1].text += e
      } else {
        arr.push({"text":(" "+e),"spaced":true})
      }
    }
  })
  arr.forEach((e,i)=>{arr[i] = e.text})
  console.log(arr.join(" "),r)
  return(arr.join(" "))
}

function whiteText(){
  let span = document.createElement("span")
    span.classList.add('temp')
    span.style.color = "white"
    if(fahadMode){span.style.color="green"}
    let str = ""
    let ff = final
    while(ff < rst.length){
      str += rst[ff][0].transcript
      ff+=1
    }
    span.innerHTML = str
    document.getElementById("final").appendChild(span)
}

function interm(){
  let span = document.createElement("span")
    span.classList.add('temp')
    span.style.color = "white"
    if(fahadMode){span.style.color="black"}
    let str = "</br>"
    let ff = final
    while(ff < rst.length){
      str += rst[ff][0].transcript
      ff+=1
    }
    span.innerHTML = str
    let lower = str.toLowerCase()
    if(lower.includes("translate chinese"),lower.includes("start chinese")){
      rec.lang = "zh-yue"
      restart()
    }if(lower.includes("translate cantonese") || lower.includes("start cantonese")){
      rec.lang = "yue-Hant-HK"
      restart()
    } else if(lower.includes("英")){
      rec.lang = "en-ca"
      restart()
    } else if(lower.includes("clip")){
      localStorage.setItem('storage', myrec.innerText);
    }
    if(myterm.children.length == 0 || span.innerHTML != myterm.firstChild.innerHTML ){
      document.getElementById("term").insertBefore(span,myterm.firstChild)
    }

    if(myterm.children.length > 100){
      myterm.lastChild.remove()
    }
}

function restart(){
  rec.stop()
}


function moveCaretToEnd(element) {
  var range = document.createRange();
  var selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);

  element.focus();
}





