
class Player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    this.hp = 100
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



var cm = document.getElementById("mapCanvas");
var ctxm = cm.getContext("2d");


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


        var combat = document.getElementById("CombatMenu");
        var combatctx = combat.getContext("2d");
        combatctx.font = "20px Courier New"
        combatctx.textAlign = "center"

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
socket.on('mapUpdate2',UPDATEMAP)
socket.on('invrelay',updateInv)
socket.on('TIME',timeUpdate)
socket.on('TICK',tick)
socket.on('PING',returnPing)
socket.on("chat",chatProcess)
socket.on("comrelay",combatProcess)
socket.on("combatText",combatText)
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

var playerSprites = new Image();
playerSprites.src = 'playerSprites.png'

// img.onload = function() {
//     ctx.drawImage(img.image, 400, 400);
//     tempp = 1
// };

/////////////////////////////////////////////////////

//combatctx

 function COMrect(x,y,x2,y2){
    combatctx.fillRect(x,y,x2,y2)
  }
 function COMfill(i){
    combatctx.fillStyle = i
  }

function COMtext(i,x,y){
  combatctx.fillText(i,x,y)
}

class textPhysicsPiece{
  constructor(text,x,y,color,vx,vy,g,t,e){
    this.text = text
    this.x = x
    this.y = y
    this.color = color
    this.vx = vx
    this.vy = vy
    this.g = g
    this.t = (t == undefined ? 0 : t)
    this.life = 500 + this.t
    this.e = e
    if(e != undefined){
      this.an = 5
    } else {
      this.an = 0
    }


  }

  draw(){
    COMfill(this.color)
    combatctx.strokeStyle = "black"
    if(this.an > 0){
      combatctx.font = "bold "+(20 + 5 * this.an )+"px Arial"
    } else {

      if(this.e == undefined){
        combatctx.font = "20px Arial"
      } else {
        combatctx.font = "bold 20px Arial"
      }
    }

    if(isNaN(parseInt(this.text)) == true){
      combatctx.lineWidth = 3
      combatctx.strokeText(this.text,this.x,this.y)
      // combatctx.stroke()
    }

    COMtext(this.text,this.x,this.y)
  }
  update(){

    if(this.an == 0 && this.e != undefined){
      combatScreen.ctext.push(this.e)
    }


    if(this.life < 500){

      if(this.life < 70){
        this.vx -= 0.5
      }


      this.vy += this.g

      if(this.y > 400){
        this.y = 400
        this.vy *= -0.8
      }

      this.y += this.vy

      this.x += this.vx
    }
    
    this.life -= 1
    this.an -= 1



  }


}


class Combat{
  constructor(){
    this.screenActive = 0
    this.frame = 0
    this.started = 0
    this.party1 = [1]
    this.party2 = [1]
    this.choicePath = ""
    this.currentMenu = ["attack","defense","item","help"]
    this.allmenu = {




  "":["attack","defense","item","help"],
  "0":["physical","spells","staffs",""],
  "1":["block","dodge","",""],
  "2":function(){chatProcess([">"," you have no items"])},
  "3":function(){chatProcess([">"," for help use /h combat"])},


  "00":["swing item","punch","jab","kick"],
  "000":"return",
  "001":"return",
  "002":"return",
  "003":"return",

  "01":"return",
  "02":"return",
  "03":"do nothing",



  "10":"return",
  "11":"return",
  "12":"do nothing",
  "13":"do nothing"


}

      }
 



  restart(){
    this.screenActive = 1
    this.frame = 0
    this.started = 0
    this.party1 = [1]
    this.party2 = [1]
    this.ctext = []
  }



  startAnimation(){
    COMfill("#000000")
    COMrect(0,0,450,400)
    if(this.frame < 160){
      COMfill("rgb(0,0,50)")
      COMrect(0,270,this.frame*2.4,130)
    }
    if(this.frame < 15){
      COMfill("rgb(0,100,255)")
      COMrect(215,195-this.frame*14,20,10+this.frame*28)
    } else if(this.frame < 81){
      COMfill("rgb(0,100,255)")
      COMrect(215,0,20,400)
    } else if(this.frame < 160){
      COMfill("rgba(0,100,255,"+(1-((this.frame - 80)/110))+")")
      COMrect(215-(this.frame-80)*3,0,20+(this.frame-80)*6,400)
   } else {
      COMfill("rgb(0,27,69)")
      COMrect(0,0,450,400)
      this.started = 1
    }

    this.frame ++
  }

  stopscreen(){
    this.screenActive = 0
    this.frame = 0
    this.started = 0
    COMfill("#000000")
    COMrect(0,0,450,400)
  }

  inCombat(){
    COMfill("rgb(0,27,69)")
    COMrect(0,0,450,400)
    COMfill("rgb(0,27,91)")
    COMrect(0,270,380,130)
    COMrect(300,237.5,80,32.5)
    COMfill("#00FF00")
    COMrect(5,5,player.hp*2,10)


    for(let i = 0; i < this.party1.length; i++){
      COMfill("#FFFFFF")
      COMrect(50,100,50,50)
    }
    for(let i = 0; i < this.party2.length; i++){
      COMfill("#FFFFFF")
      COMrect(350,100,50,50)
    }


    if(inRect(mouseX,mouseY,850,675,380,130)){
      COMfill("rgba(0,255,0,"+flash+")")
      COMrect(0,270,380,130)

      COMfill("rgba(255,255,255,0.3)")
      COMrect(0,270+32.5*Math.floor((mouseY-675)/32.5),380,32.5)
  
    }
    if(inRect(mouseX,mouseY,1150,642.5,80,32.5)){
      COMfill("rgba(255,255,255,0.3)")
      COMrect(300,237.5,80,32.5)
      
    }


    for(let i = 0; i < 4; i++){
      COMfill("rgb(255,255,255)")
      combatctx.font = "bold 20px Courier New"
      COMtext(this.currentMenu[i],190,295.5+32.5*i)
    }
    COMtext("back",340,263)


    // COMfill("#FF00FF")
    // let tempt = this.ctext[0][0] == player.id ? 0 : 1
    // let tempb = tempt == 0 ? 1 : 0
    // COMtext(this.ctext[tempt][1],50,50)
    // COMtext(this.ctext[tempb][1],400,50)
    // COMtext(this.ctext[tempt][2],400,70)
    // COMtext(this.ctext[tempb][2],50,70)
    

    for(let i = 0; i < this.ctext.length; i++){
      this.ctext[i].draw()
      this.ctext[i].update()
    }

    for(let i = this.ctext.length-1; i > -1; i--){
      if(this.ctext[i].life < 0){
        this.ctext.splice(i,1)
      }
    }


  
  }


  combattext(e){
    // this.ctext = e
    console.log(e)
    let tempt = e[0][0] == player.id ? 0 : 1
    let tempb = tempt == 0 ? 1 : 0

    let f1 = new textPhysicsPiece(e[tempb][2],375,100,"#FF0000",Math.random()*2-1,Math.random()*2-1,0.07)
    let f2 = new textPhysicsPiece(e[tempt][2],75,100,"#FF0000",Math.random()*2-1,Math.random()*2-1,0.07)

    this.ctext.push(new textPhysicsPiece(e[tempt][1],75,70,"#FF00FF",Math.random()*1-0.5,Math.random(),0.02,50,f1))
    this.ctext.push(new textPhysicsPiece(e[tempb][1],375,70,"#FF00FF",Math.random()*1-0.5,Math.random(),0.02,50,f2))

  }


  optionClick(num){
    if(num < 4){
      this.choicePath = this.choicePath + num
    }
    else{
      this.choicePath = this.choicePath.substring(0,this.choicePath.length-1)
    }
    this.combatMenuPath1()
  }
  


   combatMenuPath1(){
    if(this.allmenu[this.choicePath] == "return"){

      ActionStore.push(this.choicePath)
      AActionStore.push(["com",this.choicePath])
      ActionPrint.push([200,200,"#FF00FF"])


      this.choicePath = ""
      this.combatMenuPath1()
    } else if(this.allmenu[this.choicePath] == "do nothing"){

    }else if(typeof(this.allmenu[this.choicePath]) != "function"){
      this.currentMenu = this.allmenu[this.choicePath]
      

    } else {
      this.allmenu[this.choicePath]()
      this.choicePath = ""
    }

  }

    choice4(n,arr){
      return(arr[n])
    }




}





function combatText(e){
  combatScreen.combattext(e)
}








var combatScreen = new Combat()

/////////////////////////////////////////////////////

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


function lineM(x,y,w,h){
  ctxm.beginPath();
  ctxm.moveTo(x,y);
  ctxm.lineTo(w+x, h+y);
  ctxm.stroke();
}
function rectM(x,y,x2,y2){
  ctxm.fillRect(x,y,x2,y2)
}
function fillM(i){
  ctxm.fillStyle = i
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
  // console.log(mouseX,mouseY,mouseCoords)
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



  if(mouseStatus == "canvas"){
    let a = CoordToChunk(mouseCoords[0],mouseCoords[1])
    let b = a.cx + a.cy*chunkSize+3
    // console.log([player.id,a,b])
    ActionStore.push("click:"+mouseCoords[0]+","+mouseCoords[1])
    // console.log(ee,a,b)
    AActionStore.push(["click",a,b])
    ActionPrint.push([Math.floor(mouseX/20),Math.floor(mouseY/20),"rgba(255,0,0,0.3)"])
    // socket.emit('click',[player.id,a,b])
  }

  if(inRect(mouseX,mouseY,850,675,380,130)){

    let temp = Math.floor((mouseY-675)/32.5)


    combatScreen.optionClick(temp)
  }
  if(inRect(mouseX,mouseY,1150,642.5,80,32.5)){
    combatScreen.optionClick(4)
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

// main loop
// ==================================================================================================================

function repeat(){
// try{UPDATEMAP([NEWmap,players,map])}catch(err){}
  // drawTree(25,25,"#FFFFFF",5)
  clearCanvas()
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
  } else if(inRect(mouseX,mouseY,850,675,380,130)){
    mouseStatus = "combatoptions"
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
        if(distance(j,i,20,20) <= 12){
          fill("rgba(100,255,100,"+flash+")")
          rectAtCoords(j,i)


        }


      }
    }
  }

  if(combatScreen.screenActive == 1){
    if(combatScreen.started == 0){
      combatScreen.startAnimation()
    } else {

      combatScreen.inCombat()



    }

  }

}
//repeat end =-=========================-================================-================================-=



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




function combatProcess(e){
  player.hp = e[0]
  if(e[1] != undefined){
    if(e[1]){
      combatScreen.restart()
    }
    if(!e[1]){
      combatScreen.stopscreen()
    }


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

function rectAtCoordsM(x,y){
  rectM(x*20,y*20,20,20)
}

function clearCanvas(){
  fill("#000000")
  ctx.clearRect(0, 0, 820, 820)
}


var map = {}
var players = []
var NEWmap = []







function UPDATEMAP(input){
  // console.log(input[0])

  NEWmap = input[0]
  players = input[1]
  map = input[2]
  clearCanvas()
  let trees = []
  let shades = []



  for(let i = 0; i < input[0].length; i++){
     let tblock = map[input[0][i]]
     // console.log(input[0][0]+","+input[0][1])
      let deparsed = MasterTileDeparser(tblock) 
      let a = 1 - deparseDurability(tblock)
      let bb = input[0][i].split(",")
      let ccx = parseInt(bb[0])+20-player.x
      let ccy = parseInt(bb[1])+20-player.y
      fillM(deparsed[0])
      rectAtCoordsM(ccx,ccy)
      if(ATTRIBUTEOF(tblock,"$") != "NONE"){
        shades.push([ccx,ccy,parseInt(ATTRIBUTEOF(tblock,"$"))*0.2])
      }
      if(ATTRIBUTEOF(tblock,"T") != "NONE"){
        if(ccx > -5 && ccy > -5 && ccx < 46 && ccy < 46){
        // console.log(ccx,ccy,"rgba(30,95,30,0.7)",parseInt(ATTRIBUTEOF(tblock,"S")))
        trees.push([ccx,ccy,"rgba(10,65,10,0.7)",parseInt(ATTRIBUTEOF(tblock,"S"))])}
      }
            if(a != "full"){
        ctxm.lineWidth = a * 5
        lineM(ccx*20+10-a*9,ccy*20+10-a*9,a*18,a*18)
        lineM(ccx*20+10-a*9,ccy*20+10+a*9,a*18,-a*18)
      
      }
  }

    playersUpdate(input[1])
  for(let i = 0; i < trees.length; i++){
    let a = trees[i]
    drawTree(a[0],a[1],a[2],a[3])
  }
  for(let i = 0; i < shades.length; i++){
    fillM("rgba(0,0,0,"+shades[i][2]+")")
    rectAtCoordsM(shades[i][0],shades[i][1])
  }

}









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
        fillM(l)
        rectAtCoordsM(x+j,y+i)
      }
    }
  }

}







// function SHADELINE(arr,slope,x,y,xe,ye){
//   let outarr = []
//   let distx = xe - x
//   let blocked = 0
//   for(let i = 0; i < 10; i++){
//     nx = x + distx * i / 10
//     ny = y + nx * slope

//     for(let j = 0; j < arr.length; j++){
//       if(arr[j][0] == Math.floor(nx) && arr[j][1] == Math.flor(ny)){
//         outarr.push(arr[j])
//         if(ATTRIBUTEOF(arr[j][2],"B") != "NONE"){
//           break;
//         }
//       }
//     }




//     return(outarr)
//   }


// }











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
var HeightMap = ["$","B","G"]


var TILESALL = {"0":["#000000","Abyss"],"1":["#04399F","Deep Sea"],"2":["#0078FF","Sea"],"3":["#1FB1FF","Shallow Waters"],"4":["#D9DC00","Sand"],"5":["#20A020","Plains"],"6":["#207020","Forest"],"7":["#205020","Dense Forest"],"8":["#707070","Mountains"],"9":["#F0F0F0","Snowy Mountain Peaks"]}


var ColorTileReferenceDict = {"0":"#000000","1":"#04399F","2":"#0078FF","3":"#1FB1FF","4":"#D9DC00","5":"#20A020","6":"#207020","7":"#205020","8":"#707070","9":"#F0F0F0"}
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
  player.Inventory = e[0]
  // player.selectedSlot = e[1]
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
