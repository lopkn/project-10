
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
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

const socket = io.connect('/')


let lastManualSave = ""

document.addEventListener('keydown',(e)=>{
  if(e.key == "1"){
    e.preventDefault()
    let span = document.createElement("span")

    span.style.color = "yellow"

    span.innerHTML = rst[final][0].transcript
    lastMeanualSave = rst[final][0].transcript
    document.getElementById("final").appendChild(span)

    let arr = document.getElementById("final").getElementsByClassName("temp")
    for(let i = 0; i < arr.length; i++){
      arr[i].remove()
    }
    // final +=1
  }
})
let final = 0


let rec = new webkitSpeechRecognition()
rec.onresult = (e)=>{recf(e)}
    
rec.onend=()=>{rec.start();console.log("restart");final = 0; 
  document.getElementById("final").innerHTML += storestring
  storestring = ""
}
rec.continuous = true
rec.interimResults = true
rec.maxAlternatives = 3
rec.start()

let storestring = ""

let rst = {}
let AUTO = true

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

    let result = e.results[final][0].transcript
    if(lastManualSave != ""){
      while(result[0] == lastManualSave[0]){
        result = result.substring(1)
        lastManualSave = lastManualSave.substring(1)
      }
      lastManualSave = ""
    }


    span.innerHTML = result
    if(AUTO){
      socket.emit("text",e.results[final][0].transcript)
    }

    document.getElementById("final").appendChild(span)

    // document.getElementById("final").innerHTML += "<span style='color:rgb("+rgb+")'>"+e.results[final][0].transcript+"</span>"

    final+=1
  } else {
    
    whiteText()
  }

}

function whiteText(){
  let span = document.createElement("span")
    span.classList.add('temp')
    span.style.color = "white"
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
    let str = "</br>"
    let ff = final
    while(ff < rst.length){
      str += rst[ff][0].transcript
      ff+=1
    }
    span.innerHTML = str
    let lower = str.toLowerCase()
    if(lower.includes("translate chinese")){
      rec.lang = "zh-yue"
      restart()
    } else if(lower.includes("英")){
      rec.lang = "en-ca"
      restart()
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





