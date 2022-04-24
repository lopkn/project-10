
var renderBlocks = 20
var BlockPixels = 20
var BlockPixelsHalf = 10


class Player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    this.hp = 100
    this.chunk = {"x":0,"y":0}
    this.selectedSlot = 0
    this.Inventory = ["B:1-A:50","B:5-A:50","U:4-A:100","Sl:1-A:30",""]
    this.clientInfo = {"scanmode":"off"}


  }
}

class Beam{

//for(let i = 0; i < 50; i++){animationBeams.push(new Beam(player.x,player.y,Math.random()*50-25,Math.random()*50-25,"EnterCombat"))}
//for fun client beam


  constructor(x,y,tx,ty,type){
    this.setPos(x,y,tx,ty)
    this.life = 100
    this.type = type
  }

  setPos(x,y,tx,ty){
    this.x = ( (x+20-player.x) * BlockPixels + BlockPixelsHalf)
    this.y = ((y+20-player.y) * BlockPixels + BlockPixelsHalf)
    this.tx = ((tx+20-player.x) * BlockPixels + BlockPixelsHalf) - this.x
    this.ty = ((ty+20-player.y) * BlockPixels + BlockPixelsHalf) - this.y
  }

  upDraw(){
  let a = Math.random()
  switch(this.type){

  case "client":

    ctx.lineWidth = this.life/16

    ctx.strokeStyle = ("rgba(255,0,0,"+this.life/150+")")

    break;
  case "none":

    ctx.lineWidth = this.life/7

    ctx.strokeStyle = ("rgb("+a*255+","+this.life*2*a+",0)")
    break;  
  case "HitBlock":

    ctx.lineWidth = this.life/5

    ctx.strokeStyle = ("rgb("+a*255+","+this.life*2*a+",0)")

    break;
  case "BreakBlock":

    ctx.lineWidth = this.life/4


    ctx.strokeStyle = ("rgb("+a*255+","+this.life*2*a+","+255*(1-a)+")")

    break;
  case "BlockPlace":

    ctx.lineWidth = this.life/5


    ctx.strokeStyle = ("rgba(200,100,0,"+this.life/100+")")

    break;
  case "SlabPlace":

    ctx.lineWidth = this.life/5


    ctx.strokeStyle = ("rgba(200,150,0,"+this.life/100+")")

    break;
  case "FarBlockPlace":

    ctx.lineWidth = this.life/7
    ctx.strokeStyle = ("rgba("+a*200+","+a*this.life+",0,"+this.life/100+")")

    
    break;
  case "FarSlabPlace":
    ctx.lineWidth = this.life/7
    ctx.strokeStyle = ("rgba("+a*200+","+a*1.5*this.life+",0,"+this.life/100+")")
    break;

  case "EnterCombat":

    ctx.lineWidth = this.life/6

    ctx.strokeStyle = ("rgb("+a*255+","+(1-a)*255+","+(1-a)*255+")")

    break;


  }
      line(this.x,this.y,this.tx,this.ty)
      this.life -= 100/fps

}


}



var fps = 20



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

// document.body.style.zoom=1

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
socket.on('chatUpdate',updateChat)
socket.on('mapUpdate2',UPDATEMAP)
socket.on('invrelay',updateInv)
socket.on('TIME',timeUpdate)
socket.on('TICK',tick)
socket.on("DeathScreen",deathScreen)
socket.on('PING',returnPing)
socket.on("chat",chatProcess)
socket.on("comrelay",combatProcess)
socket.on("combatText",combatText)
socket.on("config",configure)
socket.on("BeamRelay",BeamUpdate)


var PSDon = false
function PacketSizeDebuggerToggle(){
  if(PSDon){
    PSDon = false
  } else {
    PSDon = true
  }
}

function PacketSizeDebugger(){
  socket.on('sendWhenJoin', (e) =>{sizeTell(e,"1")})
  socket.on('relay',(e) =>{sizeTell(e,"2")})
  socket.on('chatUpdate',(e) =>{sizeTell(e,"3")})
  socket.on('mapUpdate2',(e) =>{sizeTell(e,"4")})
  socket.on('invrelay',(e) =>{sizeTell(e,"5")})
  socket.on('TIME',(e) =>{sizeTell(e,"6")})
  socket.on('TICK',(e) =>{sizeTell(e,"7")})
  socket.on("DeathScreen",(e) =>{sizeTell(e,"8")})
  socket.on('PING',(e) =>{sizeTell(e,"9")})
  socket.on("chat",(e) =>{sizeTell(e,"0")})
  socket.on("comrelay",(e) =>{sizeTell(e,"11")})
  socket.on("combatText",(e) =>{sizeTell(e,"12")})
  socket.on("config",(e) =>{sizeTell(e,"13")})
  socket.on("BeamRelay",(e) =>{sizeTell(e,"14")})
}

function sizeTell(e,n){
  if(PSDon){
    try{
    console.log(n+"-"+JSON.stringify(e).length)}
    catch{
      console.log(n+"=err="+e)
    }
  }
}




// socket.on('playersRelay',playersUpdate)



  var BLOCKSALL
  var HeightMap
  var TILESALL
  var SLABSALL
  var ImgReferenceDict
  var EntityReferenceDict
  var canvasAnimation

function configure(e){



   BLOCKSALL = e[0]
   HeightMap = e[1]
   TILESALL = e[2]
   SLABSALL = e[3]
   ImgReferenceDict = e[4]
   EntityReferenceDict = e[5]
 


  clearInterval(canvasAnimation)
  canvasAnimation = setInterval(function(){ 
        repeat()
      }, 100/(fps/10));



}


// socket.on('players',drawPlayers)
function returnPing(){
  socket.emit('returnPing')
}

let flashpoint = 10

function updateChat(){
  text("<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>"+ChatBox)
}

function timeUpdate(e){
  if(e%(flashpoint*2) < flashpoint){
  flash = (e%flashpoint )/ 100} else{
    flash = (flashpoint - (e% flashpoint))/ 100
  }
  
  timerUpdate(e)

  
}


function timerUpdate(e,flash){
  timerctx.fillStyle = "#000000"
   if(flash == 1){timerctx.fillStyle = "#2F2F00"
   setTimeout(() => {timerUpdate(60)},100);
 }
  timerctx.fillRect(0, 0, 140, 140)



  let a = "rgb("+(255 * e / 60)+","+(255 - 255 * e / 60)+",120)"
  timerctx.strokeStyle = a
  timerctx.beginPath();
  timerctx.arc(70, 70, 50, Math.PI * 2 * e/60, 2 * Math.PI);
  timerctx.stroke();


  if(e < 0){
    timerctx.lineWidth = 5
  timerctx.strokeStyle = "#FFFF00"
  timerctx.beginPath();
  timerctx.arc(70, 70, 30,0, 2 * Math.PI * (e/-100));
  timerctx.stroke();
  timerctx.lineWidth = 20
  }


  timerctx.font = "20px Arial"
  timerctx.fillStyle = "#00FF00"
  timerctx.fillText(e,0,20)
}

function joinSuccess(m){
    console.log(m)
    player = new Player(m)
}



onmousemove = function(e){mouseX = e.clientX - 5 +scrollX; mouseY = e.clientY -2 + scrollY}
ondrag = function(e){}



var img = new Image();
var tileMapImg = new Image();
var entityMapImg = new Image();


entityMapImg.src = 'entitiesMap.png'
tileMapImg.src = 'tilesMap.png'
img.src = 'ItemMap.png';

var playerSprites = new Image();
playerSprites.src = 'playerSprites.png'

// img.onload = function() {
//     ctx.drawImage(img.image, 400, 400);
//     tempp = 1
// };

/////////////////////////////////////////////////////


  function deathScreen(){
    clearInterval(canvasAnimation)
    console.log(canvasAnimation)
    fill("#500000")
    rect(0,0,900,900)
    fill("#FF0000")
    textO("[YOU DIED]",350,400)
    player = 0
    timerUpdate = function(){}

  }

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
function comDrawEnemyMapSprite(entityName){

    let a = EntityReferenceDict[entityName]
    combatctx.drawImage(entityMapImg,21*(a)+1,1,20,20,350,100,50,50)

  
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
    this.life = 400 + this.t
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


    if(this.life < 400){

      if(this.life < 70){
        this.vx -= 0.5
      }


      this.vy += this.g

      if(this.y > 400){
        this.y = 400
        this.vy *= -0.8
      }

      this.y += this.vy*3

      this.x += this.vx*3
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
    this.enemy = "player"
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
 



  restart(enemy){
    this.screenActive = 1
    this.frame = 0
    this.started = 0
    this.enemy = enemy
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
    COMfill("rgb("+(255-2.55*player.hp)+","+(2.55*player.hp)+",0)")
    COMrect(5,5,player.hp*2,10)



      COMfill("#FFFFFF")
      COMrect(50,100,50,50)
    

      comDrawEnemyMapSprite(this.enemy)
    


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

    let et = e[tempt][2]
    let eb = e[tempb][2]

let splitt;
let splitb;

    try{
    splitt = et.split("-")
  } catch {splitt = []}


    try{
    splitb = eb.split("-")
  } catch {splitb = []}

    let tb;
    let tt ;

    if(isNaN(parseInt(eb)) == false){
      tb = "rgb(255,0,0)" 
    } else {
      tb = "rgb(255,255,0)"
    }

    if(isNaN(parseInt(et)) == false){
      tt =  "rgb(255,0,0)" 
    } else {
      tt = "rgb(255,255,0)"
    }


    if(splitt[0] == "b"){
      tt = "rgb(255,255,0)"
      et = splitt[1]
    }

    if(splitb[0] == "b"){
      tb = "rgb(255,255,0)"
      eb = splitb[1]
    }




    let f1 = new textPhysicsPiece(eb,375,100,tb,Math.random()*2-1,Math.random()*2-1,0.07)
    let f2 = new textPhysicsPiece(et,75,100,tt,Math.random()*2-1,Math.random()*2-1,0.07)

    this.ctext.push(new textPhysicsPiece(e[tempt][1],75,70,"rgb(255,0,255)",Math.random()*1-0.5,Math.random(),0.02,50,f1))
    this.ctext.push(new textPhysicsPiece(e[tempb][1],375,70,"rgb(255,0,255)",Math.random()*1-0.5,Math.random(),0.02,50,f2))

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


      this.choicePath = this.choicePath.substring(0,this.choicePath.length-1)
      // this.combatMenuPath1()




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











var textStore = []
var textStoreIndex = -1


function commandingPush(e){

  if(e != "ArrowUp" && e != "ArrowDown" && e != "Backspace" && e != "Enter" && e != "<" && e != ">"){
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
    textStoreIndex = -1
    textStore.splice(0,0,ActionStore[ActionStore.length-1])
    let temp = AActionStore[AActionStore.length -1]
    let tempsplit = temp.split(" ")
    let temp2 = parseInt(tempsplit[1])


    //=================CLIENT COMMANDS ================

    if(tempsplit[0] == "/fps" && isNaN(temp2)==false){
      fps = temp2
      clearInterval(canvasAnimation)
        canvasAnimation = setInterval(function(){ 
        repeat()
      }, 100/(fps/10));


      AActionStore.splice([AActionStore.length -1],1)

    }
     if((tempsplit[0] == "/scanmode" ||tempsplit[0] == "/scan" )){
      player.clientInfo.scanmode = tempsplit[1]


    }



  //=================CLIENT COMMANDS ================


     else {

    AActionStore[AActionStore.length -1] = "$" + temp
    }



  } else if(e == "ArrowUp"){
    commandingArrow("up")

  } else if(e == "ArrowDown"){
    commandingArrow("down")
  }
}



function commandingArrow(e){
  let a = ''
  if(e == "up"){
    if(textStoreIndex < textStore.length-1){
    textStoreIndex += 1}
    if(textStoreIndex > -1){
    a = textStore[textStoreIndex]
    }
  } else {
    if(textStoreIndex > -1){
    textStoreIndex -= 1}
    if(textStoreIndex > -1){
    a = textStore[textStoreIndex]
    }
  }

  ActionStore[ActionStore.length-1] = a
  AActionStore[AActionStore.length-1] = a

}





let commanding = 0
KeyboardEvent.repeat = false
document.addEventListener('keydown', (event) => {
  var name = event.key;

  if(name.length < 2 && name != "Shift" && name != "Backspace" && name != "/" && commanding == 0){
    ActionStore.push(name)
    AActionStore.push(name)

    if(name == "w" && AActionStore.length <= 2000){
      walker.y -= 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "s"&& AActionStore.length <= 2000){
      walker.y += 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "d"&& AActionStore.length <= 2000){
      walker.x += 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "a"&& AActionStore.length <= 2000){
      walker.x -= 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    }

  } else if(name == "/"){
    if(commanding == 0){
      commanding = 1
      ActionStore.push("/")
      AActionStore.push("/")
    } else if(name == "/"){
      commandingPush("/")
    }








  } else if(commanding == 0 &&(name == "ArrowDown"|| name == "ArrowUp")){
    commanding = 1
    ActionStore.push("/")
    AActionStore.push("/")
    commandingPush(name)
  } else if(commanding == 1 && (name.length == 1 || name == "Backspace" || name == "Enter"|| name == "ArrowDown"|| name == "ArrowUp")){
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

    animationBeams.push(new Beam(player.x,player.y,mouseCoords[0],mouseCoords[1],"client"))


    AActionStore.push(["click",a,b])
    ActionPrint.push([mouseCoords[0]-player.x+20,mouseCoords[1]-player.y+20,"rgba(255,0,0,0.3)"])
    // socket.emit('click',[player.id,a,b])
  }

  if(combatScreen.screenActive != 0 && inRect(mouseX,mouseY,850,675,380,130)){

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
var scrollHorizontal = 0
var mouseCoords = []

var circleSIGH = [[20,8],[13,11],[11,13],[8,20],[11,27],[13,29],[20,32],[27,29],[29,27],[32,20],[29,13],[27,11]]

var animationBeams = []



// main loop
// ==================================================================================================================


function repeat(){

  clearCanvas()
  InvDraw()
  fill("white")
  rectAtCoords(20,20)




  if(inRect(mouseX,mouseY,0,0,820,820)){
    mouseStatus = "canvas"
    scrollTop = window.scrollY
    scrollHorizontal = window.scrollX
    try{
      mouseCoords = [Math.floor(mouseX/BlockPixels)-20+player.x,Math.floor(mouseY/BlockPixels)-20+player.y]
    } catch{}
  
    fill("rgba(200,0,255,0.3)")
    rectAtCoords(Math.floor(mouseX/BlockPixels),Math.floor(mouseY/BlockPixels))
    if(player.clientInfo.scanmode == "on"){
      fill("rgb(255,0,"+(flash*2550)+")")
      textO(map[mouseCoords[0]+","+mouseCoords[1]],mouseX-30,mouseY-30)
    }


  } else if(inRect(mouseX,mouseY,0,825,820,50)){
    mouseCoords = [Math.floor(mouseX/50)]
    mouseStatus = "inventory" 

    fillI("rgba(200,0,255,0.5)")
    rectI(Math.floor(mouseX/50)*50,0,50,50)
  
  } else if(inRect(mouseX,mouseY,850,675,380,130)){
    mouseStatus = "combatoptions"
  } else {
    mouseStatus = "outside"
  }










  for(let i = 0; i < ActionPrint.length; i++){
    fill(ActionPrint[i][2])
    rect(ActionPrint[i][0]*20+5,ActionPrint[i][1]*20+5,10,10)





  }






  let l = JSON.stringify(ActionStore)

  fill("rgba(255,0,200,0.5)")
  textO(l,400-(l.length-2)*6.25 ,370)
  if(commanding == 1){
    fill("#FF4F00")
    textO("Input mode: text",310,340)
    ctx.font = "15px Arial"
    ctx.fillText("press enter to complete",330,315)
  }

  for(let i = 0; i < animationBeams.length; i++){
    if(animationBeams[i].life <= 0){
      animationBeams.splice(i,1)
      i--
    } else {
    animationBeams[i].upDraw()}


  }



  if(TNEWATTRIBUTEOF(player.Inventory[player.selectedSlot],"B") != "NONE"){
    fill("rgba(100,255,100,"+flash+")")


    for(let i = 0; i < circleSIGH.length; i++){
      rectAtCoords(circleSIGH[i][0],circleSIGH[i][1])
    }
    rect(240,240,340,340)
    rect(320,180,180,60)
    rect(320,580,180,60)
    rect(180,320,60,180)
    rect(580,320,60,180)

    rect(280,200,40,40)
    rect(500,200,40,40)
    rect(280,580,40,40)
    rect(500,580,40,40)

    rect(200,280,40,40)
    rect(580,280,40,40)
    rect(200,500,40,40)
    rect(580,500,40,40)
  }



}


function repeatCombat(){
    if(combatScreen.screenActive == 1){
    if(combatScreen.started == 0){
      combatScreen.startAnimation()
    } else {

      combatScreen.inCombat()



    }

  }

}


//repeat end =-=========================-================================-================================-=



function BeamUpdate(e){
  for(let i = 0; i < e.length; i++){
    animationBeams.push(new Beam(e[i][0],e[i][1],e[i][2],e[i][3],e[i][4]))
  }
}


function tick(){

  timerUpdate(60,1)


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
    console.log(AActionStore)
    AActionStore = [back[0]]
  }
}




function combatProcess(e){
  player.hp = e[0]
  if(e[1] != undefined){
    if(e[1] === false){
      combatScreen.stopscreen()
    } else

    {
      combatScreen.restart(e[1])
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

  updateChat()


}




function InvDraw(){
  try{
  fillI("#00002F")
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
    let e = TNEWATTRIBUTEOF(player.Inventory[player.selectedSlot],"A")
    return(e)
  } else {return("none")}
}







// canvasAnimation = setInterval(function(){ 
//     repeat()
// }, 100/(fps/10));

CombatAnimation = setInterval(function(){
    repeatCombat()
},41)




function rectAtCoords(x,y){
  rect(x*BlockPixels,y*BlockPixels,BlockPixels,BlockPixels)
}

function rectAtCoordsM(x,y){
  rectM(x*BlockPixels,y*BlockPixels,BlockPixels,BlockPixels)
}

function clearCanvas(){
  fill("#000000")
  ctx.clearRect(0, 0, 820, 820)
}


var map = {}
var players = []


function joinDict(d1, d2){
    let final = {}
    for (let i in d1) {
      final[i] = d1[i]
    }
    for (let j in d2) {
      final[j] = d2[j]
    }
    return final;
};


function UPDATEMAP(input){

  let constructedMap = []
  // NPEs = input[0]
  players = input[1]
  map = joinDict(map,input[2])

  let trees = []
  let shades = []


  for(let i = player.x - 27; i < player.x + 28;i++){
    for(let j = player.y - 27; j < player.y + 28; j++){
      if(map[i+","+j] != undefined){
      constructedMap.push(i+","+j)}
    }

  }
  for(let i = 0; i < constructedMap.length; i++){
     let tblock = map[constructedMap[i]]

      let deparsed = RFMasterTileDeparser(tblock)[0] 
      let a = 1 - TNEWdeparseDurability(tblock)
      let bb = constructedMap[i].split(",")
      let ccx = parseInt(bb[0])+20-player.x
      let ccy = parseInt(bb[1])+20-player.y

      if(deparsed[0][0] == "#"){
      fillM(deparsed[0])
      rectAtCoordsM(ccx,ccy)} else{
        //render image
        drawTilesMapSprite(deparsed[0],ccx,ccy)
      }


      if(TNEWATTRIBUTEOF(tblock,"$") != "NONE"){
        shades.push([ccx,ccy,parseInt(TNEWATTRIBUTEOF(tblock,"$"))*0.2])
      }
      if(TNEWATTRIBUTEOF(tblock,"T") != "NONE"){
        if(ccx > -5 && ccy > -5 && ccx < 46 && ccy < 46){
        // console.log(ccx,ccy,"rgba(30,95,30,0.7)",parseInt(TNEWATTRIBUTEOF(tblock,"S")))
        trees.push([ccx,ccy,"rgba(10,65,10,0.7)",parseInt(TNEWATTRIBUTEOF(tblock,"S"))])}
      }
            if(a != "full"){
        ctxm.lineWidth = a * 5
        lineM(ccx*BlockPixels+10-a*9,ccy*BlockPixels+10-a*9,a*18,a*18)
        lineM(ccx*BlockPixels+10-a*9,ccy*BlockPixels+10+a*9,a*18,-a*18)
      
      }

      if(TNEWATTRIBUTEOF(tblock,"I") != "NONE"){

        let item = TNEWATTRIBUTEOF(tblock,"I")

        drawTileItemsMapSprite(item,ccx,ccy)
      }

  }

    playersUpdate(input[1])
    // NPEsUpdate(input[0])


  for(let i = 0; i < trees.length; i++){
    let a = trees[i]
    drawTree(a[0],a[1],a[2],a[3])
  }

  for(let i = 0; i < shades.length; i++){
    fillM("rgba(0,0,0,"+shades[i][2]+")")
    rectAtCoordsM(shades[i][0],shades[i][1])
  }

}



























function drawAtCoords(x,y,col){
  fillM(col)
  rectAtCoordsM(x+20-player.x,y+20-player.y)
}

function playersUpdate(e){
  for(let i = 0; i < e.length; i++){
    drawEntitiesMapSprite(e[i][2],e[i][0],e[i][1])
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















///////////////////////////////////////////////////////////////////////////////////////////////////////////////////






function bracketLevels(str){
  let level = 0

  let counters = []

  let out = [""]
  for(let i = 0; i < str.length; i++){
    if(str[i] == "(" || str[i] == "[" || str[i] == "{" ){

      if(counters[level] == undefined){
        counters[level] = 0
      } else {
        counters[level] ++
      }

      out[level] += ("^"+counters[level]+"^")

      level += 1
      if(out[level] == undefined){
        out[level] = ""
      }
    } else if(str[i] == ")" || str[i] == "]" || str[i] == "}" ){

      out[level] += ("&")

      level -= 1

    } else {
      

      out[level] += str[i]
    }


  }

  return(out)

}

function bracketCompressionProcess(str,arr,parseLevel){

  let outStr = ""
  let parsedInt = ""
  let isParsing = 0

  for(let i = 0; i < str.length; i++){
    if(str[i] != "^" && isParsing == 0){
      outStr += str[i]
    } else if(str[i] != "^" && isParsing == 1){
      parsedInt += str[i] 
    } else {
      if(isParsing == 0){
        isParsing = 1
      } else {
        isParsing = 0

        let splitarr = arr[parseLevel].split("&")

        let toutStr = (splitarr[parseInt(parsedInt)])

        outStr += bracketCompressionProcess(toutStr,arr,parseLevel+1)



      }
    }



  }



    return(outStr)

}


function strHas(str,has){
  for(let i = 0; i < str.length; i++){
    for(let j = 0; j < has.length; j++){
      if(str[i] == has[j]){
        return([i,j])
      }
    }
  }
  return(false)

}

function TNEWATTRIBUTEOF(str,e){
  if(str == undefined){return("NONE")}

    if(!strHasBrackets(str)){

  let split = str.split("-")
  for(let i = 0; i < split.length; i++){
    let act = split[i].split(":")
    if(act[0] == e){
      return(act[1])
    }
  }
  return("NONE")
  } else {
    let BLs = bracketLevels(str)

  let BaseSplit = BLs[0].split("-")
  for(let i = 0; i < BaseSplit.length; i++){
    let act = BaseSplit[i].split(":")
    if(act[0] == e){

      if(strHas(act[1],"^")){


        

      return(bracketCompressionProcess(act[1],BLs,1))





      } else {

      return(act[1])
    }

    }
  }
  return("NONE")


  }




}
function strHasBrackets(str){
  for(let i = 0; i < str.length; i++){
    if(str[i] == "(" || str[i] == "[" || str[i] == "{" || str[i] == ")" || str[i] == "]" || str[i] == "}"){
      return(str[i])
    }
  }
  return(false)
}






function RFMasterTileDeparser(str){
  let split = str.split('-')
  let outarr = []
  loop1:
  for(let i = 0; i < HeightMap.length; i++){
    loop2:
    for(let j = 0; j < split.length; j++){


      let key = split[j].split(":")
      if(key[0]==HeightMap[i]){
        
        if(HeightMap[i] == "B"){
          outarr.push(BLOCKSALL[key[1]])
          break loop1
        }
        else if(HeightMap[i] == "Sl"){
          outarr.push(SLABSALL[key[1]])
          break loop1
        }
        else if(HeightMap[i] == "G"){
          outarr.push(TILESALL[key[1]])
          break loop1
        }


      }
    }


  }

  return(outarr)

}


function TNEWMasterTileDeparser(str){
  let split = str.split('-')
  for(let i = 0; i < HeightMap.length; i++){
    for(let j = 0; j < split.length; j++){
      if(split[j][0]==HeightMap[i]){
        let key = split[j].split(":")[1]
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


function TNEWdeparseDurability(str){
  let split = str.split("-")
  let e = -1
  let ee = 0
  for(let i = 0; i < split.length; i++){
    let a = split[i].split(":")
    if(a[0] == "D"){
      e = parseInt(a[1])
    }
    if(a[0] == "B"){
      ee = BLOCKSALL[a[1]][2]
    }
  }
  if(e == -1 || ee == e){return("full")} else {return(e/ee)}
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


/////////////////////////////////////////////////////////////////////////////////////



var chunkSize = 20
function CoordToChunk(x,y){
  return({"x":Math.floor(x/chunkSize),"y":Math.floor(y/chunkSize),"cx":x-Math.floor(x/chunkSize)*chunkSize,"cy":y-Math.floor(y/chunkSize)*chunkSize})
}


function updateInv(e){
  player.Inventory = e[0]

}




function drawTileItemsMapSprite(itemstr,x,y){

  let a = TNEWATTRIBUTEOF(itemstr,"B")
  if(a != "NONE"){
    ctxm.drawImage(img,20*(parseInt(a)-1)+1,1,18,18,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
  }
  let b = TNEWATTRIBUTEOF(itemstr,"U")
  if(b !="NONE"){
    ctxm.drawImage(img,20*(parseInt(b)-1)+1,21,19,19,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
  }
    let c = TNEWATTRIBUTEOF(itemstr,"Sl")
  if(c !="NONE"){
    // console.log("eee")
    ctxm.drawImage(img,20*(parseInt(c)-1)+1,41,19,19,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
  }
  
}



function drawTilesMapSprite(tileName,x,y){

    let a = ImgReferenceDict[tileName]

    ctxm.drawImage(tileMapImg,21*(a)+1,1,20,20,x*BlockPixels,y*BlockPixels,BlockPixels,BlockPixels)

  
}
function drawEntitiesMapSprite(entityName,x,y){

    let a = EntityReferenceDict[entityName]

    ctxm.drawImage(entityMapImg,21*(a)+1,1,20,20,(x+20-player.x)*BlockPixels,(y+20-player.y)*BlockPixels,BlockPixels,BlockPixels)

  
}






function drawItemMapSprite(itemID,Slot){
  let a = TNEWATTRIBUTEOF(itemID,"B")
  if(a != "NONE"){
    invctx.drawImage(img,20*(parseInt(a)-1),0,20,20,50*Slot,0,50,50)
  }
  let b = TNEWATTRIBUTEOF(itemID,"U")
  if(b !="NONE"){
    invctx.drawImage(img,20*(parseInt(b)-1),20,21,21,50*Slot,0,50,50)
  }
    let c = TNEWATTRIBUTEOF(itemID,"Sl")
  if(c !="NONE"){
    // console.log("eee")
    invctx.drawImage(img,20*(parseInt(c)-1),40,21,21,50*Slot,0,50,50)
  }
  
}
