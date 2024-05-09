
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

  myrec.width = Math.floor(Width)
  myrec.height = Math.floor(Height)
  myrec.style.width = Math.floor(Width)+"px"
  myrec.style.height = Math.floor(Height)+"px"
  myrec.style.top = "0px"
  myrec.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
let final = 0


let rec = new webkitSpeechRecognition()
rec.onresult = (e)=>{console.log(e.results.length+":"+e.results[e.results.length-1][0].transcript);recf(e)}
rec.onend=()=>{rec.start();console.log("restart");final = 0}
rec.continuous = true
rec.interimResults = true
rec.start()


function recf(e){

  if(e.results[final].isFinal){

    document.getElementById("final").innerHTML += e.results[final][0].transcript

    final+=1
  }

}