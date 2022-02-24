
class Player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    this.chunk = {"x":0,"y":0}
    this.selectedSlot = 0
    this.Inventory = ["B1-50","B2-40"]
  }
}


var walker = {"x":20,"y":20}
var ActionPrint = []


var mouseStatus = "canvas"
var player;
var currentlyPressedKeys = []
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var mouseX = 0
var mouseY = 0
var ActionStore = []
var AActionStore = []

        var inv = document.getElementById("Inventory");
        var render = inv.getContext("2d");
        inv.width = 820;
        inv.height = 50;
        inv.style.left = "0px";
        inv.style.top = "825px";
        inv.style.position = "absolute";
        var timer = document.getElementById("Timer");
        var timerctx = timer.getContext("2d");
        timer.style.top = "0px";
        timer.style.left = "825px";
        timer.style.position = "absolute";
        timerctx.lineCap = "round"
        timerctx.lineWidth = "20"


        // var disp = document.getElementById("Display");
        // var render2 = disp.getContext("2d");
        // inv.style.left = "825px";
        // inv.style.top = "0px";
        // inv.style.position = "absolute";

var display = document.getElementById("text")
display.innerHTML = "DISPLAY"
display.style.position = "absolute";
display.style.top = "0px"
display.style.left = "850px"

socket = io.connect('/');
socket.on('sendWhenJoin',joinSuccess)
socket.on('relay',relayPlayer)
socket.on('mapUpdate',updateMap)
socket.on('invrelay',updateInv)
socket.on('TIME',timeUpdate)
socket.on('TICK',tick)
// socket.on('playersRelay',playersUpdate)

// socket.on('players',drawPlayers)

function timeUpdate(e){
  text(e)
  timerUpdate(e)
}


function timerUpdate(e){

  timerctx.clearRect(0, 0, 140, 140)
  let a = "rgb("+(255 * e / 80)+","+(255 - 255 * e / 80)+",120)"
  timerctx.strokeStyle = a
  timerctx.beginPath();
  timerctx.arc(70, 70, 50, Math.PI * 2 * e/80, 2 * Math.PI);
  timerctx.stroke();
}

function joinSuccess(m){
    console.log(m)
    player = new Player(m)
}



onmousemove = function(e){mouseX = e.clientX -2 ; mouseY = e.clientY -2}
ondrag = function(e){}



var tempp = 0
var img = new Image();

img.onload = function() {
    ctx.drawImage(img, 400, 400);
    tempp = 1
};
img.src = 'https://i.gifer.com/33HU.gif';




function text(str){
  display.innerHTML = str
}
function line(x,y,w,h){
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(w+x, h+y);
  ctx.stroke();
}
function rect(x,y,x2,y2){
  ctx.fillRect(x,y,x2,y2)
}
function fill(i){
  ctx.fillStyle = i
}
function textO(str,x,y){
  ctx.font = "30px Arial"
  ctx.fillText(str,x,y)
}

function rectI(x,y,x2,y2){
  render.fillRect(x,y,x2,y2)
}
function fillI(i){
  render.fillStyle = i
}
function textI(str,x,y){
  render.fillText(str,x,y)
}

////////////////////////////////////////////////////


function inRect(x,y,rx,ry,rw,rh){

  return((x > rx && y > ry && x < rx+rw && y < ry+rh))
}
function relayPlayer(i){
  player.x = i[0]
  player.y = i[1]
  player.chunk = i[2]
}

function inListR(inp,arr){
  for(let i = 0; i < arr.length; i++){
    if(inp == arr[i]){
      return(i)
    }
  } return(false)
}

KeyboardEvent.repeat = false
document.addEventListener('keydown', (event) => {
  var name = event.key;
  ActionStore.push(name)
  AActionStore.push(name)

  if(name == "w"){
    walker.y -= 1
    ActionPrint.push([walker.x,walker.y,"rgba(0,0,0,0.3)"])
  } else if(name == "s"){
    walker.y += 1
    ActionPrint.push([walker.x,walker.y,"rgba(0,0,0,0.3)"])
  } else if(name == "d"){
    walker.x += 1
    ActionPrint.push([walker.x,walker.y,"rgba(0,0,0,0.3)"])
  } else if(name == "a"){
    walker.x -= 1
    ActionPrint.push([walker.x,walker.y,"rgba(0,0,0,0.3)"])
  }

  // if(inListR(name,currentlyPressedKeys)===false){
    // currentlyPressedKeys.push(name)
    // console.log(name,currentlyPressedKeys)
    // socket.emit('key',[player.id,name])

  // }

}, false);
// document.addEventListener('keyup', (event) => {
//   var name = event.key;
//   currentlyPressedKeys.splice(inListR(name,currentlyPressedKeys),1)
// }, false);

reloaded = true

document.addEventListener('mousedown', (event) => {
  console.log(mouseX,mouseY,mouseCoords)
  if(inRect(mouseX,mouseY,0,825,820,50)){
  if(player.selectedSlot == Math.floor(mouseX/50)){
    player.selectedSlot = -1
    socket.emit('selectInventorySlot',[player.id,-1])
  } else {
  player.selectedSlot = Math.floor(mouseX/50)}
  ActionStore.push("select:",player.selectedSlot)
  AActionStore.push(["sel",player.selectedSlot])
  ActionPrint.push([200,200,"#FF00FF"])
  // socket.emit('selectInventorySlot',[player.id,player.selectedSlot])
  }



  if(inRect(mouseX,mouseY,0,0,820,820)){
    let a = CoordToChunk(mouseCoords[0],mouseCoords[1])
    let b = a.cx + a.cy*chunkSize+3
    // console.log([player.id,a,b])
    ActionStore.push("click:"+mouseCoords[0]+","+mouseCoords[1])
    // console.log(ee,a,b)
    AActionStore.push(["click",a,b])
    ActionPrint.push([Math.floor(mouseX/20),Math.floor(mouseY/20),"rgba(255,0,0,0.3)"])
    // socket.emit('click',[player.id,a,b])
  }
})


function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}


function debugRect(x,y){
  fill("#FF00FF")
  rectAtCoords(x,y)
}



var mouseCoords = []
function repeat(){
  try{updateMap([map,players])}catch(err){}
  // drawTree(25,25,"#FFFFFF",5)
  InvDraw()
  fill("white")
  rectAtCoords(20,20)

  if(inRect(mouseX,mouseY,0,0,820,820)){
  mouseStatus = "canvas"
  mouseCoords = [Math.floor(mouseX/20)-20+player.x,Math.floor(mouseY/20)-20+player.y]
  }else if(inRect(mouseX,mouseY,0,825,820,50)){
  mouseCoords = [Math.floor(mouseX/50)]
  mouseStatus = "inventory"
  } else {
    mouseStatus = "outside"
  }
  let l = JSON.stringify(ActionStore)
    if(mouseStatus == "canvas"){
      // console.log("hi")
  fill("rgba(200,0,255,0.3)")
  rectAtCoords(Math.floor(mouseX/20),Math.floor(mouseY/20))
} else if(mouseStatus == "inventory"){
  fillI("rgba(200,0,255,0.5)")
  rectI(Math.floor(mouseX/50)*50,0,50,50)
}


for(let i = 0; i < ActionPrint.length; i++){
  fill(ActionPrint[i][2])
  rectAtCoords(ActionPrint[i][0],ActionPrint[i][1])





}




  fill("rgba(255,0,200,0.5)")
  textO(l,400-(l.length-2)*6.25 ,370)
    if(tempp == 1){
    ctx.drawImage(img, 400-20, 400-20,40,40);
  }
}




function tick(){
  ActionStore = []
  ActionPrint = []
  walker = {"x":20,"y":20}
  AActionStore.splice(0,0,player.id)
  socket.emit('AT',AActionStore)
  AActionStore = []
}










function InvDraw(){
  try{
  fillI("#000000")
  rectI(0,0,820,50)
  fillI("rgba(255,255,0,0.4)")
  rectI(player.selectedSlot*50,0,50,50)
  let e = amountOfItems()
  if(e != "none"){
  textI(e,35+player.selectedSlot*50,45)}}catch(err){}
}






function amountOfItems(){
  if(player.Inventory[player.selectedSlot] != undefined && player.Inventory[player.selectedSlot] != "empty"){
    let e = player.Inventory[player.selectedSlot].split("-")
    return(e[1])
  } else {return("none")}
}







function myFunction() {
   requestAnimationFrame(myFunction);
   repeat()
}
requestAnimationFrame(myFunction);


function rectAtCoords(x,y){
  rect(x*20,y*20,20,20)
}

function clearCanvas(){
  fill("#000000")
  rect(0,0,820,820)
}


var map = []
var players = []


















function updateMap(input){
  // console.log(input)
  map = input[0]
  players = input[1]
  clearCanvas()
  let trees = []
  for(let ch = 0; ch < map.length; ch++){
    let map2 = map[ch]
    let importantChunkInformation = [map2[0],map2[1],map2[2]]
    // map[ch].splice(0,3)

    //draw
    for(let i = 3; i < map2.length; i++){
      let deparsed = MasterTileDeparser(map2[i][2]) 

      
      let ccx = importantChunkInformation[0]*20+map2[i][0]+20-player.x
      let ccy = importantChunkInformation[1]*20+map2[i][1]+20-player.y
      let a = 1 - deparseDurability(map2[i][2])

      fill(deparsed[0])
      rectAtCoords(ccx,ccy)

      if(ATTRIBUTEOF(map2[i][2],"T") != "NONE"){
        if(ccx > -5 && ccy > -5 && ccx < 46 && ccy < 46){
        // console.log(ccx,ccy,"rgba(30,95,30,0.7)",parseInt(ATTRIBUTEOF(map2[i][2],"S")))
        trees.push([ccx,ccy,"rgba(10,65,10,0.5)",parseInt(ATTRIBUTEOF(map2[i][2],"S"))])}
      }
            if(a != "full"){
        ctx.lineWidth = a * 5
        line(ccx*20+10-a*9,ccy*20+10-a*9,a*18,a*18)
        line(ccx*20+10-a*9,ccy*20+10+a*9,a*18,-a*18)
      
      }
    }
  }
  playersUpdate(input[1])
  for(let i = 0; i < trees.length; i++){
    let a = trees[i]
    drawTree(a[0],a[1],a[2],a[3])
  }
}




















function drawAtCoords(x,y,col){
  fill(col)
  rectAtCoords(x+20-player.x,y+20-player.y)
}

function playersUpdate(e){
  for(let i = 0; i < e.length; i++){
    drawAtCoords(e[i][0],e[i][1],"#FFFFFF")
  }
}






function drawTree(x,y,l,s){
  // fill(c)
  // rectAtCoords(x,y)

  for(let i = -7; i < 8; i++){
    for(let j = -7; j < 8; j++){
      if(distance(x+j,y+i,x,y) <= s){
        fill(l)
        rectAtCoords(x+j,y+i)
      }
    }
  }

}






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function ATTRIBUTEOF(str,e){
  if(str == undefined){return("NONE")}
  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == e){
      return(split[i].substring(1))

    }
  }
  return("NONE")
}


function MasterTileDeparser(str){
  let split = str.split('-')
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < split.length; j++){
      if(split[j][0]==HeightMap[i]){
        let key = split[j].substring(1)
        if(HeightMap[i] == "B"){
          return(BLOCKSALL[key])
        }
        else if(HeightMap[i] == "G"){
          return(TILESALL[key])
        }


      }
    }


  }
}


function deparseDurability(str){
  let split = str.split("-")
  let e = -1
  let ee = 0
  for(let i = 0; i < split.length; i++){
    if(split[i][0] == "D"){
      e = parseInt(split[i].substring(1))
    }
    if(split[i][0] == "B"){
      ee = BLOCKSALL[split[i].substring(1)][2]
    }
  }
  if(e == -1 || ee == e){return("full")} else {return(e/ee)}
}
function deparseTileToColor(str){
  let split = str.split('-')
  let fin = ""
  for(let i = 0; i < split.length; i ++){
    //case ground
    if(split[i][0] == "G"){
      let read = split[i][1]
      fin += ("-G"+ColorTileReferenceDict[read])
    } else if(split[i][0] == "B"){
      let read = split[i][1]
      fin += ("-B"+BLOCKSALL[read][0])
    }
  }
  let finSplit = fin.split("-")
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < finSplit.length; j++){
      if(finSplit[j][0] == HeightMap[i]){
        return(finSplit[j].substring(1))
      }

    }
  }

}
var ColorBlockReferenceDict = {"1":"#B96A04"}
var NameBlockReferenceDict = {"1":"Oak Wood"}
var DurabilityMap = {"1":100}
var BLOCKSALL = {"1":["#B96A04","Oak Wood",100],"2":["#8C8C8C","Stone",400],"3":["#A95A00","Oak Tree Wood",400]}
var HeightMap = ["B","G"]


var TILESALL = {"0":["#FF00FF","Abyss"],"1":["#04399F","Deep Sea"],"2":["#0078FF","Sea"],"3":["#1FB1FF","Shallow Waters"],"4":["#D9DC00","Sand"],"5":["#20A020","Plains"],"6":["#207020","Forest"],"7":["#205020","Dense Forest"],"8":["#707070","Mountains"],"9":["#F0F0F0","Snowy Mountain Peaks"]}


var ColorTileReferenceDict = {"0":"#FF00FF","1":"#04399F","2":"#0078FF","3":"#1FB1FF","4":"#D9DC00","5":"#20A020","6":"#207020","7":"#205020","8":"#707070","9":"#F0F0F0"}
var NameTileReferenceDict = {"0":"Abyss","1":"Deep Sea","2":"Sea","3":"Shallow Waters","4":"Sand","5":"Plains","6":"Forest","7":"Dense Forest","8":"Mountains","9":"Snowy Mountain Peaks"}
function deparseTileToName(str){
  let split = str.split('-')
  let fin = ""
  for(let i = 0; i < split.length; i ++){
    //case ground
    if(split[i][0] == "G"){
      let read = split[i][1]
      fin += ("-G"+NameTileReferenceDict[read])
    } else if(split[i][0] == "B"){
      let read = split[i][1]
      fin += ("-B"+BLOCKSALL[read][1])
    }
  }
  let finSplit = fin.split("-")
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < finSplit.length; j++){
      if(finSplit[j][0] == HeightMap[i]){
        return(finSplit[j].substring(1))
      }

    }
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////



var chunkSize = 20
function CoordToChunk(x,y){
  return({"x":Math.floor(x/chunkSize),"y":Math.floor(y/chunkSize),"cx":x-Math.floor(x/chunkSize)*chunkSize,"cy":y-Math.floor(y/chunkSize)*chunkSize})
}


function updateInv(e){
  player.Inventory = e
}

