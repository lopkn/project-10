
class Player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    this.chunk = {"x":0,"y":0}
    this.selectedSlot = 0
    this.Inventory = ["B1-50","B2-40","U1-100"]
  }
}


var walker = {"x":20,"y":20}
var ActionPrint = []

document.body.style.webkitTransform =  "scale(1)"; 
var mouseStatus = "canvas"
var player;
var currentlyPressedKeys = []
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var mouseX = 0
var mouseY = 0
var ActionStore = []
var AActionStore = []
var ChatBox = ""
var flash = 0

        var inv = document.getElementById("Inventory");
        var invctx = inv.getContext("2d");
        inv.width = 820;
        inv.height = 50;
        inv.style.left = "5px";
        inv.style.top = "825px";
        inv.style.position = "absolute";
        var timer = document.getElementById("Timer");
        var timerctx = timer.getContext("2d");
        timer.style.top = "0px";
        timer.style.left = "825px";
        timer.style.position = "absolute";
        timerctx.lineCap = "round"
        timerctx.lineWidth = "20"

        var laser = document.getElementById("GIF");
        // var laserctx = laser.getContext("2d")
        laser.style.top = "385px";
        laser.style.left = "395px";
        laser.style.display = "none"
        laser.style.position = "absolute";
        laser.style.width = "40px"
        laser.style.height = "40px"


        var LASER = 0
        function laserToggle(){
          if(LASER == 0){
            LASER = 1
            laser.style.display = "block"
          } else {
            LASER = 0
            laser.style.display = "none"
          }
        }

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

var display2 = document.getElementById("text2")
display2.innerHTML = "DISPLAY"
display2.style.position = "absolute";
display2.style.top = "0px"
display2.style.left = "850px"


socket = io.connect('/');
socket.on('sendWhenJoin',joinSuccess)
socket.on('relay',relayPlayer)
socket.on('mapUpdate',updateMap)
socket.on('invrelay',updateInv)
socket.on('TIME',timeUpdate)
socket.on('TICK',tick)
socket.on('PING',returnPing)
socket.on("chat",chatProcess)
// socket.on('playersRelay',playersUpdate)

// socket.on('players',drawPlayers)
function returnPing(){
  socket.emit('returnPing')
}

let flashpoint = 10
function timeUpdate(e){
  if(e%(flashpoint*2) < flashpoint){
  flash = (e%flashpoint )/ 100} else{
    flash = (flashpoint - (e% flashpoint))/ 100
  }
  text("<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>"+ChatBox)
  timerUpdate(e)

  
}


function timerUpdate(e){
  timerctx.fillStyle = "#000000"
  timerctx.fillRect(0, 0, 140, 140)
  let a = "rgb("+(255 * e / 80)+","+(255 - 255 * e / 80)+",120)"
  timerctx.strokeStyle = a
  timerctx.beginPath();
  timerctx.arc(70, 70, 50, Math.PI * 2 * e/80, 2 * Math.PI);
  timerctx.stroke();
  timerctx.font = "20px Arial"
  timerctx.fillStyle = "#00FF00"
  timerctx.fillText(e,0,20)
}

function joinSuccess(m){
    console.log(m)
    player = new Player(m)
}



onmousemove = function(e){mouseX = e.clientX - 5 ; mouseY = e.clientY -2 + scrollY}
ondrag = function(e){}



var img = new Image();
img.src = 'ItemMap.png';
// img.onload = function() {
//     ctx.drawImage(img.image, 400, 400);
//     tempp = 1
// };





function text(str){
  display.style.color = "#00FF00"
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
  invctx.fillRect(x,y,x2,y2)
}
function fillI(i){
  invctx.fillStyle = i
}
function textI(str,x,y){
  invctx.fillText(str,x,y)
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















function commandingPush(e){
  if(e != "Backspace" && e != "Enter" && e != "<" && e != ">"){
  ActionStore[ActionStore.length-1] += e
  AActionStore[AActionStore.length-1] += e
  } else if(e == "Backspace") {
    if(ActionStore[ActionStore.length-1].length > 0){
      ActionStore[ActionStore.length-1] = ActionStore[ActionStore.length-1].substring(0,ActionStore[ActionStore.length-1].length - 1)
      AActionStore[AActionStore.length-1] = AActionStore[AActionStore.length-1].substring(0,AActionStore[AActionStore.length-1].length - 1)
    } else {
      commanding = 0
      ActionStore.splice(ActionStore.length - 1)
      AActionStore.splice(AActionStore.length -1)
    }
  } else if(e == "Enter"){
    commanding = 0
    AActionStore[AActionStore.length -1] = "$" + AActionStore[AActionStore.length -1]
  }
}



let commanding = 0
KeyboardEvent.repeat = false
document.addEventListener('keydown', (event) => {
  var name = event.key;

  if(name != "Shift" && name != "Backspace" && name != "/" && commanding == 0){
    ActionStore.push(name)
    AActionStore.push(name)

    if(name == "w" && AActionStore.length <= maxSteps){
      walker.y -= 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "s"&& AActionStore.length <= maxSteps){
      walker.y += 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "d"&& AActionStore.length <= maxSteps){
      walker.x += 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "a"&& AActionStore.length <= maxSteps){
      walker.x -= 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    }

  } else if(name == "/"){
    if(commanding == 0){
      commanding = 1
      ActionStore.push("/")
      AActionStore.push("/")
    } else {
      commandingPush("/")
    }


    //  else {
    //   // commandingPush("/")
    //   commanding = 0
    //   AActionStore[AActionStore.length -1] = "$" + AActionStore[AActionStore.length -1]
    // }





  } else if(commanding == 1 && (name.length == 1 || name == "Backspace" || name == "Enter")){
    commandingPush(name)
  } else if(name == "Backspace"){
    let ee = ActionStore.splice(ActionStore.length-1,1)
    AActionStore.splice(AActionStore.length-1,1)
    ActionPrint.splice(ActionPrint.length-1,1)
        if(ee == "w"){
      walker.y += 1
    } else if(ee == "s"){
      walker.y -= 1
    } else if(ee == "d"){
      walker.x -= 1
    } else if(ee == "a"){
      walker.x += 1
    }
  }


}, false);







document.addEventListener('mousedown', (event) => {
  console.log(mouseX,mouseY,mouseCoords)
  if(inRect(mouseX,mouseY,0,825,820,50)){
  if(player.selectedSlot == Math.floor(mouseX/50)){
    player.selectedSlot = -1
    // socket.emit('selectInventorySlot',[player.id,-1])
  } else {
  player.selectedSlot = Math.floor(mouseX/50)}
  ActionStore.push("select:"+player.selectedSlot)
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


var scrollTop = 0
var mouseCoords = []

let maxSteps = 2000000

function repeat(){
  try{updateMap([map,players])}catch(err){}
  // drawTree(25,25,"#FFFFFF",5)

  InvDraw()
  fill("white")
  rectAtCoords(20,20)




  if(inRect(mouseX,mouseY,0,0,820,820)){
  mouseStatus = "canvas"
  scrollTop = window.scrollY
  try{
    mouseCoords = [Math.floor(mouseX/20)-20+player.x,Math.floor(mouseY/20)-20+player.y]
  } catch{}
  } else if(inRect(mouseX,mouseY,0,825,820,50)){
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
    rect(ActionPrint[i][0]*20+5,ActionPrint[i][1]*20+5,10,10)





  }



  if(AActionStore.length > maxSteps){
    ActionStore.splice(maxSteps,1)
    ActionPrint.splice(maxSteps,1)
    AActionStore.splice(maxSteps,1)
  }



  fill("rgba(255,0,200,0.5)")
  textO(l,400-(l.length-2)*6.25 ,370)
  if(commanding == 1){
    fill("#FF4F00")
    textO("Input mode: text",310,340)
    ctx.font = "15px Arial"
    ctx.fillText("press enter to complete",330,315)
  }


  if(ATTRIBUTEOF(player.Inventory[player.selectedSlot],"B") != "NONE"){
    for(let i = 0; i < 41; i++){
      for(let j = 0; j < 41; j++){
        if(distance(j,i,20,20) > 7){
          fill("rgba(255,0,0,"+flash+")")
          rectAtCoords(j,i)


        }


      }
    }
  }



}
//repeat end



function tick(){
  if(commanding  == 0){
    ActionStore = []
    ActionPrint = []
    walker = {"x":20,"y":20}
    AActionStore.splice(0,0,player.id)
    socket.emit('AT',AActionStore)
    AActionStore = []
  } else {
    ActionStore = [ActionStore[ActionStore.length-1]]
    ActionPrint = []
    walker = {"x":20,"y":20}
    let back = AActionStore.splice(AActionStore.length-1,1) 
    AActionStore.splice(0,0,player.id)
    socket.emit('AT',AActionStore)
    AActionStore = [back[0]]
  }
}





function chatProcess(e){
  if(e[0] != ">" && e[0].length <= 11){
    ChatBox = "<span style='color:#F0E5FF'>" + e[0] + ": " + e[1] + "</span></br>" + ChatBox
  } else if(e[0].length > 11){
    ChatBox = "Guest: " + e[1] + "</br>" + ChatBox
  } else {
    ChatBox = "<span style='font-weight:bold'>R></span>" + e[1] + "</br>" + ChatBox
  }
  if(ChatBox.length > 3000){
    ChatBox = ChatBox.substring(0,3000)
  }
}




function InvDraw(){
  try{
  fillI("#000000")
  rectI(0,0,820,50)

  for(let i = 0; i < player.Inventory.length; i++){
    drawItemMapSprite(player.Inventory[i],i)
  }

  fillI("rgba(255,255,0,0.4)")
  rectI(player.selectedSlot*50,0,50,50)
  let e = amountOfItems()
  if(e != "none"){
  fillI("#FFFFFF")
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
        trees.push([ccx,ccy,"rgba(10,65,10,0.7)",parseInt(ATTRIBUTEOF(map2[i][2],"S"))])}
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
// var ColorBlockReferenceDict = {"1":"#B96A04"}
// var NameBlockReferenceDict = {"1":"Oak Wood"}
// var DurabilityMap = {"1":100}
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














function drawItemMapSprite(itemID,Slot){
  let a = ATTRIBUTEOF(itemID,"B")
  if(a != "NONE"){
    invctx.drawImage(img,20*(parseInt(a)-1),0,21,21,50*Slot,0,50,50)
  }
  let b = ATTRIBUTEOF(itemID,"U")
  if(b !="NONE"){
    invctx.drawImage(img,20*(parseInt(b)-1),20,21,21,50*Slot,0,50,50)
  }
  
}
