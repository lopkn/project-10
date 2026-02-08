
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


let room;
const socket = io.connect('/')
let GAMESESSION = "G10.8"
socket.emit("JOINGAME",GAMESESSION)
var ID = 0
socket.on("acknowledge G10.8",(e)=>{ID = e; console.log("joined as "+ID);room = prompt("room")
  socket.emit("room",{"name":room})})
  socket.on("down",(e)=>{console.log(e)
  down(e)

})
socket.on("message",(e)=>{console.log(message)})


// let b0 = document.createElement("button")
// let b1 = document.createElement("button")
// let res = document.createElement("div")

// b1.innerHTML = "send 1"
// b0.innerHTML = "send 0"
// res.innerText = "results appear here"

// document.body.appendChild(b1)
// document.body.appendChild(b0)
// document.body.appendChild(res)

// b1.onclick = ()=>{socket.emit("measure",{"room":room,"input":1})}
// b0.onclick = ()=>{socket.emit("measure",{"room":room,"input":0})}


var a = ()=>{
  return({
    "astate":-1,
    "state":0,
    "result":-1,
  })
}
var col = (x)=>{
  if(x==-1){return("rgba(0,0,0,0)")}
  if(x==0){return("#B00")}
  if(x==1){return("#0B0")}
}

var hidden = false

var game = {players:[a(),a()],answer:undefined,type:"correlated",prompt:[0,0],final:[],hide:true,hideLock:undefined}

function reset(){
  game = {players:[a(),a()],answer:undefined,type:"correlated",prompt:[0,0],final:[],hide:true,hideLock:undefined}
  update()
}

function update(){
  str = JSON.stringify(game)
  socket.emit("up",{"room":room,"input":str})
  // down(str)
}
function down(str){
  game = JSON.parse(str)
  game.players.forEach((e,i)=>{
    document.getElementById('result-'+i).style.backgroundColor = col(e.result)
    document.getElementById('b0'+i).style.backgroundColor = e.state==-1?"white":(e.state==0?"#0B0":"#999")
    document.getElementById('b1'+i).style.backgroundColor = e.state==-1?"white":(e.state==1?"#B00":"#999")
    document.getElementById('a0'+i).style.backgroundColor = e.astate==-1?"white":(e.astate==0?"#0B0":"#999")
    document.getElementById('a1'+i).style.backgroundColor = e.astate==-1?"white":(e.astate==1?"#B00":"#999")
    document.getElementById('s'+i).style.backgroundColor = game.final[i]==undefined?"white":(game.final[i]==1?"#B00":"#0B0")
    document.getElementById('hi'+i).style.visibility = game.hide?"hidden":"visible"

    if(game.hideLock!==undefined && !hidden){
      hidey(document.getElementById("hide"+game.hideLock),game.hideLock,true)
    }
    if(game.hideLock== undefined){
      unhidy("hide0")
      unhidy("hide1")
    }



    let stt = "PLAYER:" + i + " --- your prompt is: " + (game.prompt[i]?"RED":"GREEN")
    if(game.final[i] === 1 || game.final[i] === 0){
      stt += " = your answer was: "+(game.final[i]?"red =  ":"green =  ")
    }
    if(game.verdict !== undefined){
      stt += " ==game over, YOU "+(game.verdict?"WIN!!":"LOSE!!") +"=="
    }
    document.getElementById('p'+i).innerText = stt

    
  })
}

function r(){
  return(Math.round(Math.random()))
}

function measure(x){
  
  if(game.answer===undefined){
    game.answer = genans()
  }
  
  game.players[x].result = game.answer[x]

  update()
  
}




function genans(){
  let t = game.type
  let a1 = game.players[0].state
  let a2 = game.players[1].state
  if(t=="correlated"){
    if(a1==a2 && a1==1){return([1,0])}else{return([1,1])}
  }
  if(t=="reliable"){
    if(Math.random()>0.5){if(a1==a2 && a1==1){return([1,0])}else{return([a1,a2])}}else{x=r();return([x,1-x])}
  }
  if(t=="unreliable"){
    if(Math.random()>0.15){if(a1==a2 && a1==1){return([1,0])}else{return([a1,a2])}}else{return([r(),r()])}
  }
  if(t=="quantum"){
    if(a1==a2 && a1==1){x=r();return([x,1-x])}else{x=r();return([x,x])}
  }
}

let left = document.createElement("div")
left.style.backgroundColor = "#111"
left.style.width = "50vw"
left.style.padding = "5px"
document.body.appendChild(left)

function unhidy(h){
  let hide = document.getElementById(h)
  hide.style.position = "static"
    hide.style.top = hide.style.left = ""
    hide.style.width = hide.style.height = ""
    hide.innerText = "hide"
    hide.classList.remove("fla")
    hide.style.backgroundColor = "white"
    game.hideLock = undefined;
    hide.style.visibility="visible"
    hidden=false
}

function hidey(hide,x,down){
  if(hide.style.position == "static"){
  hide.style.position = "absolute"
  hide.style.top = hide.style.left = "0px"
  hide.style.width = hide.style.height = "100%"
  hide.innerText = "unhide"
  hide.classList.add("fla")
  hidden=true
  document.getElementById("hide"+(1-x)).style.visibility="hidden"
  if(!down){
      game.hideLock = 1-x;
      update()
  }

  } else {
    hide.style.position = "static"
    hide.style.top = hide.style.left = ""
    hide.style.width = hide.style.height = ""
    hide.innerText = "hide"
    hide.classList.remove("fla")
    hide.style.backgroundColor = "white"
    game.hideLock = undefined;
    document.getElementById("hide0").style.visibility="visible"
    document.getElementById("hide1").style.visibility="visible"
    hidden=false
    update()
  }
}

function box(x){

let d = document.createElement("div")
d.style.position="relative"
let p = document.createElement("div")


let hide = document.createElement("button")
hide.innerText = "hide"
  hide.style.position = "static"
  hide.id = "hide"+x
hide.onclick = ()=>{
  hidey(hide,x)
}


let start = document.createElement("button")
start.onclick = ()=>{game.prompt = [Math.round(Math.random()),Math.round(Math.random())];update();}
start.innerText = "START/SYNC"

let hi = document.createElement("div")
p.style.color = "white"
p.innerText = "PLAYER:" + x
p.id = "p"+x
let b0 = document.createElement("button")
let b1 = document.createElement("button")

b0.id = "b0"+x
b1.id = "b1"+x

b0.onclick = ()=>{game.players[x].state = 0; update()}
b1.onclick = ()=>{game.players[x].state = 1; update()}
b0.innerText = b1.innerText = "input"
b0.style.backgroundColor = "#0B0"
b1.style.backgroundColor = "#999"

let m = document.createElement("button")
let r = document.createElement("div")
r.innerText = "result"
r.id = "result-"+x
let a0 = document.createElement("button")
let a1 = document.createElement("button")

a0.onclick = ()=>{game.players[x].astate = 0; update()}
a1.onclick = ()=>{game.players[x].astate = 1; update()}
a0.id = "a0"+x
a1.id = "a1"+x



let s = document.createElement("button")
m.innerText = "measure"
m.onclick = ()=>{measure(x)}

a0.innerText = a1.innerText = "ANSWER"
s.innerText = "submit"
a0.style.backgroundColor = a1.style.backgroundColor = s.style.backgroundColor = "white"
s.id = "s"+x
s.onclick = ()=>{
  if(game.players[x].astate!==-1 && game.final[x]!== 1 && game.final[x]!== 0){game.final[x] = game.players[x].astate; 

  if(game.final[0] !== undefined && game.final[1] !== undefined){
    if(prompt[0] == 1 && prompt[1] == 1){game.verdict = game.final[0] != game.final[1]} else {game.verdict = game.final[0]==game.final[1]}
  }
  update()}
}

hi.style.visibility = "hidden"
hi.style.backgroundColor = "#303"
hi.id = "hi"+x

d.appendChild(hide)
d.appendChild(p)
d.appendChild(start)
d.appendChild(hi)
hi.appendChild(b0)
hi.appendChild(b1)
hi.appendChild(m)
hi.appendChild(r)
d.appendChild(a0)
d.appendChild(a1)
d.appendChild(s)
d.style.backgroundColor = "#002040"
d.style.margin = "10px"

left.appendChild(d)
return(d)
}


let res = document.createElement("button")
document.body.appendChild(res)
res.innerText = "RESET"
res.onclick = reset

box(0)
box(1)
