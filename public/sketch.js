
var renderBlocks = 20
var BlockPixels = 20
var BlockPixelsHalf = 10

var renderingVariables = {"itemsize":{"B":40,"Sl":42,"U":42,"In":42}}

var DEBUGGINGLOGS = {"Timeticker" : 0}



var wholeScreenRender = {"alphaColors":[]}


class Player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    // this.hp = 100
    this.Cstats = {"hp":100,"maxhp":100,"hunger":500,"maxhunger":500,"energy":200,"maxenergy":200}
    // this.hunger = 100
    this.chunk = {"x":0,"y":0}
    this.selectedSlot = 0
    this.Inventory = ["B:1-A:50","B:5-A:50","U:4-A:100","Sl:1-A:30",""]
    this.clientInfo = {"MouseHolding":{"default":[false,0],"drag":[false]},"sound":"on","tileRenderer":0,"blockOutlineColor":"#000000","scanmode":"off","clickUpdate":"on","schmode":"off","actionTextColor":"rgba(255,0,200,0.5)"}
    this.serverSelctedSlot = 0

  }
}

// var allExplosions = []

class Explosion{
  constructor(x,y,size,type,frame,tempctx){
    this.x = ((x+20-player.x) * BlockPixels + BlockPixelsHalf)
    this.y = ((y+20-player.y) * BlockPixels + BlockPixelsHalf)
    this.size = size
    this.life = size
    this.type = type
    this.frame = frame
    this.Sbeams = []

    this.ctx = tempctx == undefined ? CTX.ctx : tempctx

    for(let i = 0; i < size; i++){
      this.Sbeams.push(new BeamSnake([x,y,x+Math.random()*6-3,y+Math.random()*6-3,"Explosion"],109,0.1))
    }

    allParticles.push(new cirParticle(this.x,this.y,size,{"ctx":ctx}))

  }

  update(){
    let frame = Math.floor(this.life/(this.size/this.frame))
    if(this.frame != frame){
      for(let i = 0; i < this.Sbeams.length; i++){
        this.Sbeams[i].step(Math.round(Math.random()*2),0.9)
        
      }
      this.frame = frame
    }


    this.life -= (this.size/50)*60/(fps)
  }


}

class cirParticle{
  constructor(x,y,life,options){
    this.life = life
    this.size = life
    this.x = x
    this.y = y
    this.spawnpos = [player.x,player.y]
    this.options = (options == undefined ? {} : options)
    this.ctx = this.options.ctx == undefined ? CTX.ctx :this.options.ctx 
    this.lifedrain = (this.options.speed == undefined ? 1 : this.options.speed)
  }
  update(){
    
    if(this.life <= 0){
      return("kill")
    }

    this.x -= (player.x - this.spawnpos[0])*BlockPixels
    this.y -= (player.y - this.spawnpos[1])*BlockPixels
    this.spawnpos = [player.x,player.y]

    this.ctx.beginPath()
    this.ctx.lineWidth = this.options.Sinverse == undefined ? this.life*5 : (this.size-this.life+1)*5
    this.ctx.strokeStyle = (this.options.color == undefined ? "rgba(255,255,0,0.8)" : this.options.color)

    if(this.options.Dinverse == undefined){
      this.ctx.arc(this.x, this.y, (this.size-this.life)*20, 0, 2 * Math.PI)
    } else {
      this.ctx.arc(this.x, this.y, this.life*20, 0, 2 * Math.PI)
    }
    this.ctx.stroke()
    this.life -= (this.size/50)*60/fps*this.lifedrain
  }
}


var allBeamSnakes = []

class BeamSnake{
  constructor(original,steps,random){
    this.currentBeams = [original]
    this.original = original
    this.steps = steps + 1
    this.length = length
    this.random = random * (distance(original[0],original[1],original[2],original[3]))
    this.step(1)
  }

  step(lightning,decay){
    let newBeams = []
    for(let i = 0; i < this.currentBeams.length; i++){
      let ts = this.currentBeams[i]
      animationBeams.push(new Beam(Math.round(ts[0]),Math.round(ts[1]),Math.round(ts[2]),Math.round(ts[3]),ts[4]))
      for(let i = 0; i < lightning; i++){
        let velocity1 = (ts[2]-ts[0])+(Math.random()*this.random-(this.random/2))
        let velocity2 = (ts[3]-ts[1])+(Math.random()*this.random-(this.random/2))
        if(decay != undefined){
          velocity2 *= decay
          velocity1 *= decay
        }
        newBeams.push([ts[2],ts[3],ts[2]+velocity1,ts[3]+velocity2,ts[4]])
      }
    }
    this.currentBeams = newBeams
    this.steps -= 1
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

    this.playerpos = [player.x,player.y]


    this.shooter = [this.x,this.y,this.tx,this.ty]
  }

  upDraw(){
  let a = Math.random()
  let normtype = 1
  let tposx
  let tposy
  let TrelativeCorrection = [(this.playerpos[0]-player.x)*20,(this.playerpos[1]-player.y)*20]
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

  case "Staff":

    ctx.lineWidth = this.life/5


    ctx.strokeStyle = ("rgb("+a*150+",0,"+a*120+")")

    break;

  case "EnterCombat":

    ctx.lineWidth = this.life/6

    ctx.strokeStyle = ("rgb("+a*255+","+(1-a)*255+","+(1-a)*255+")")

    break;
  case "Chest":

    ctx.lineWidth = this.life/6

    ctx.strokeStyle = ("rgb(0,"+(1-a)*255+","+(1-a)*255+")")

    break;
  case "DevLightning":

    ctx.lineWidth = this.life/6

    ctx.strokeStyle = ("rgb("+(1-a)*255+","+(a)*255+",255)")

    break;
  case "Explosion":

    ctx.lineWidth = this.life/6

    ctx.strokeStyle = ("rgb(255,"+this.life*3.5*a+",0)")

    break;
case "Teleport":

    ctx.lineWidth = 25
    ctx.strokeStyle = ("rgb(0,"+this.life*3.5*(1-a)+",255)")
    tposx = this.shooter[2]*2/fps
    tposy = this.shooter[3]*2/fps
    line(this.shooter[0]+TrelativeCorrection[0],this.shooter[1]+TrelativeCorrection[1],tposx,tposy)
    this.shooter[0] += tposx
    this.shooter[1] += tposy

    ctx.lineWidth = this.life/6
    ctx.strokeStyle = ("rgb(0,"+this.life*3.5*a+",255)")
    this.life -= 100/fps
    break;
case "Attack":

    ctx.lineWidth = 15
    ctx.strokeStyle = ("rgb(255,"+this.life*3.5*(1-a)+",0)")
    tposx = this.shooter[2]*0.1
    tposy = this.shooter[3]*0.1
    line(this.shooter[0]+TrelativeCorrection[0],this.shooter[1]+TrelativeCorrection[1],tposx,tposy)
    this.shooter[0] += tposx
    this.shooter[1] += tposy

    ctx.lineWidth = this.life/6
    ctx.strokeStyle = ("rgb(255,"+this.life*3.5*a+",0)")
    this.life -= 100/fps
    break;

  }


      ctx.lineWidth *= 20/BlockPixels

      line(this.x+TrelativeCorrection[0],this.y+TrelativeCorrection[1],this.tx,this.ty)
      this.life -= 100/fps

}


}

// class ACTIONLIMITER{
//   static current = "none"

//   static reset(){
//     this.current = "none"
//   }

//   static

// }

var ACTIONLIMITER = "none"


class pingCounter{

  static ping = 0
  static interval = 0

  static start(){
    this.ping = 0
    socket.emit("CTsping",player.id)
    this.interval = setInterval(() => {this.ping++},1)
  }

  static stop(){
    clearInterval(this.interval)
    console.log("PING : " + this.ping)
    return(this.ping)
  }

}

var fps = 20



var walker = {"x":20,"y":20}
var ActionPrint = []

document.body.style.webkitTransform =  "scale(1)"; 
document.body.style.MozTransform = "scale(1)";
document.body.style.MozTransformOrigin = "0 0";
var mouseStatus = "canvas"
var player;
var currentlyPressedKeys = []
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var InterfaceCanvas = document.getElementById("Interface")
var menuCTX = InterfaceCanvas.getContext("2d")



var mouseX = 0
var mouseY = 0
var ActionStore = []
var AActionStore = []
var ChatBox = ""
var flash = 0

var ZOOMSETTINGS = {"windowWidth":window.innerWidth, "windowHeight":window.innerHeight,"expectWidth":1560,"expectHeight":940}

var allzoom = 1




function windowRescale(e){

  if(e != undefined && !isNaN(parseFloat(e))){
    allzoom = parseFloat(e)
    document.body.style.zoom = allzoom
    document.body.style.MozTransform = "scale("+allzoom+")";
    document.body.style.MozTransformOrigin = "0 0";
    return(allzoom)
    return;
  }

  let zoomScale = 1

  ZOOMSETTINGS = {"windowWidth":window.innerWidth, "windowHeight":window.innerHeight,"expectWidth":1560,"expectHeight":940}

  if(ZOOMSETTINGS.windowWidth < ZOOMSETTINGS.expectWidth){
    zoomScale = ZOOMSETTINGS.windowWidth/ZOOMSETTINGS.expectWidth
  }

  if(ZOOMSETTINGS.windowHeight < ZOOMSETTINGS.expectHeight){
    let tzoomScale = ZOOMSETTINGS.windowHeight/ZOOMSETTINGS.expectHeight
    if(tzoomScale < zoomScale){
      zoomScale = tzoomScale
    }
  }


  allzoom = zoomScale
  document.body.style.zoom= allzoom
  return(zoomScale)

}

windowRescale()




// document.body.style.zoom= allzoom

var cm = document.getElementById("mapCanvas");
var ctxm = cm.getContext("2d");
  ctxm.font = "20px Arial"
  ctxm.fillStyle = "#FFFF00"


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
socket.on("ParticleRelay",ParticleUpdate)
socket.on("statusRelay",statusUpdate)
socket.on("rarelay",rareprocess)
socket.on("cTSping",()=>{selfLog(pingCounter.stop())})


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
  socket.on("ParticleRelay",(e) =>{sizeTell(e,"15")})
  socket.on("statusRelay",(e) =>{sizeTell(e,"16")})
  socket.on("rarelay",(e)=>{sizeTell(e,"17")})
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

  var CLOCKNUMBER = 0
  var clockmax = 60


  var BLOCKSALL
  var HeightMap
  var TILESALL
  var SLABSALL
  var ImgReferenceDict
  var EntityReferenceDict
  var canvasAnimation
  var IimageLinkReferenceDict
  var consoleHelpResponses
  var MainHelpMenu

  var CTX = {
    "td":document.getElementById("TopDisplay").getContext("2d"),
    "ctx":ctx,
    "ctxm":ctxm,
    "menuCTX":menuCTX,
    "combatctx":combatctx,
    "invctx":invctx,
    "timerctx":timerctx
  }



function configure(e){



   BLOCKSALL = e[0]
   HeightMap = e[1]
   TILESALL = e[2]
   SLABSALL = e[3]
   ImgReferenceDict = e[4]
   EntityReferenceDict = e[5]
   IimageLinkReferenceDict = e[6]
   consoleHelpResponses = e[7][0]
   MainHelpMenu = e[7][1]
   console.log(e[7])
  clearInterval(canvasAnimation)
  canvasAnimation = setInterval(function(){ 
        repeat()
        CLOCKNUMBER++
      }, 100/(fps/10));



}


// socket.on('players',drawPlayers)
function returnPing(){
  socket.emit('returnPing')
}

let flashpoint = 10

function updateChat(){
  let tempa ="<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>"

  if(player != undefined && player.clientInfo.schmode == "on"){
    tempa +="<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>"
  }

  text(tempa+ChatBox)
}

function timeUpdate(e){
  if(e%(flashpoint*2) < flashpoint){
  flash = (e%flashpoint )/ 100} else{
    flash = (flashpoint - (e% flashpoint))/ 100
  }
  
  timerUpdate(e)

  
}


function rareprocess(e){
  let rtype = e[0]

  switch(rtype){
    case "ticklim":
    clockmax = e[1]
    break;
    case "purge":
    map = {}
    break;
    case "pulltabcuts":
    wordTabDict = e[1].dict
    wordTabArr = e[1].arr
    break;

  }


}


function timerUpdate(e,flash){

  if(e - DEBUGGINGLOGS.Timeticker > 1){
    console.log (e,DEBUGGINGLOGS.Timeticker)
  }
  DEBUGGINGLOGS.Timeticker = e

  timerctx.fillStyle = "#000000"
   if(flash == 1){timerctx.fillStyle = "#2F2F00"
   setTimeout(() => {timerUpdate(clockmax)},100);
 }
  timerctx.fillRect(0, 0, 140, 140)



  let a = "rgb("+(255 * e / clockmax)+","+(255 - 255 * e / clockmax)+",120)"

  if(player.clientInfo.schmode == "on"){
    a = "#303030"
  }

  timerctx.strokeStyle = a
  timerctx.beginPath();
  timerctx.arc(70, 70, 50, Math.PI * 2 * e/clockmax, 2 * Math.PI);
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
  // CLOCKNUMBER = e
}

function joinSuccess(m){
    console.log(m)
    player = new Player(m)
}



onmousemove = function(e){mouseX = (e.clientX - 5*allzoom +scrollX)/allzoom; mouseY = (e.clientY - 2*allzoom + scrollY)/allzoom}
ondrag = function(e){}


var sounds = {"music.R10":"tl-music/R10-4Discovery.mp3"}
var currentSounds = []



var img = new Image();
var tileMapImg = new Image();
var entityMapImg = new Image();
var animation = new Image();


entityMapImg.src = 'entitiesMap.png'
tileMapImg.src = 'tilesMap.png'
img.src = 'newItemMap.png';
animation.src = 'AnimationItem.png'

var playerSprites = new Image();
playerSprites.src = 'playerSprites.png'

// img.onload = function() {
//     ctx.drawImage(img.image, 400, 400);
//     tempp = 1
// };

/////////////////////////////////////////////////////

  function deathScreen(){
    setTimeout(deathScreentimed,500)
  }

  function deathScreentimed(){

    clearInterval(canvasAnimation)
    fill("rgba(80,0,0,0.7)")
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


  "00":["use item","punch","jab","kick"],
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
    COMfill("rgb("+(255-2.55*player.Cstats.hp)+","+(2.55*player.Cstats.hp)+",0)")
    COMrect(5,5,player.Cstats.hp*2,10)



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


class AllActions{
  static create(text,actual,draw){
    ActionStore.push(text)
    AActionStore.push(actual)
    ActionPrint.push(draw)
  }

  static edit(text,actual,draw){
    ActionStore[ActionStore.length-1] = text
    AActionStore[AActionStore.length-1] = actual
    ActionPrint[ActionPrint.length-1] = draw
  }

  static remove(e){
    if(e == undefined || e == "top"){
      ActionStore.splice(ActionStore.length - 1)
      AActionStore.splice(AActionStore.length -1)
    }
  }
}


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

function textOs(str,x,y){
  ctx.font = "30px Monaco"
  let cstr = seperateStringSpecial(str)
  let raise = cstr.length - 1
  for(let i = raise; i > -1 ; i--){
    ctx.fillText(cstr[i],x,y + (i*23) - (raise*20),820)
  }

  
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



function seperateStringSpecial(str){
  let outarr = []
  let pushstr = ""
  let strleng = str.length
  for(let i = 0; i< strleng; i++){

    if(i < 37){
      pushstr += str[i]
    } else if(i < 47){
      if(str[i] != " " && str[i] != "," && str[i] != "."){
        pushstr += str[i]
      } else {
        pushstr += str[i]
        strleng -= i
        str = str.substring(i)
        i = 0
        outarr.push(pushstr)
        pushstr = ""
      }
    } else {
      pushstr += str[i] + "-"
      strleng -= i
      str = str.substring(i)
        i = 0
        outarr.push(pushstr)
        pushstr = ""
    }

  }

  if(pushstr.length > 0){
    outarr.push(pushstr)
  }

  return(outarr)
}






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



  if(e == " "){
    let str = ActionStore[ActionStore.length-1]
    let tsplit = str.split(" ")
    learnTabWord(tsplit[tsplit.length-1],1)
  }
  ActionStore[ActionStore.length-1] += e
  AActionStore[AActionStore.length-1] += e




  } else if(e == "Backspace") {
    if(ActionStore[ActionStore.length-1].length > 0){
      let str = ActionStore[ActionStore.length-1]
      if(str[str.length-1] == " "){
        let tsplit = str.split(" ")
        learnTabWord(tsplit[tsplit.length-2],-1)
      }

      ActionStore[ActionStore.length-1] = ActionStore[ActionStore.length-1].substring(0,ActionStore[ActionStore.length-1].length - 1)
      AActionStore[AActionStore.length-1] = AActionStore[AActionStore.length-1].substring(0,AActionStore[AActionStore.length-1].length - 1)
    } else {
      if(ACTIONLIMITER == "commanding"){
        ACTIONLIMITER = "none"
      }
      commanding = 0
      ActionStore.splice(ActionStore.length - 1)
      AActionStore.splice(AActionStore.length -1)
    }
  } else if(e == "Enter"){
    ACTIONLIMITER = "none"
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

    }else if((tempsplit[0] == "/rendermode" ||tempsplit[0] == "/renderstyle" )){
      let tempnan = parseInt(tempsplit[1])
      if(!isNaN(tempnan)){
        player.clientInfo.tileRenderer = tempnan
      }

    }else if(tempsplit[0] == "/sound"){
      player.clientInfo.sound = tempsplit[1]
      stopSound("all")
    } else if((tempsplit[0] == "/clickupdate" ||tempsplit[0] == "/cupdate" )){
      player.clientInfo.clickUpdate = tempsplit[1]

    } else if((tempsplit[0] == "/rezoom" ||tempsplit[0] == "/autozoom"||tempsplit[0] == "/rescale")){
      windowRescale(tempsplit[1])
    } else if((tempsplit[0] == "/schoolmode" ||tempsplit[0] == "/schmode" || tempsplit[0] == "/bosskey")){
      let option = tempsplit[1]
      if(option == undefined || option != "on" || option != "off"){
        if(player.clientInfo.schmode == "off"){
          option = "on"
        } else {
          option = "off"
        }
      }

      player.clientInfo.schmode = option
      if(option == "on"){
        ctxm.fillStyle = "#000000"
        ctxm.fillRect(0,0,840,840)

      MCVs.PlayerBars.maxed = false


      }

    } else if((tempsplit[0] == "/actxt" ||tempsplit[0] == "/actiontext" )){
      player.clientInfo.actionTextColor = tempsplit[1]
    } else if((tempsplit[0] == "/coinflip")){

      if(Math.random() > 0.5){
        selfLog("Heads")
      } else {
        selfLog("Tails")
      }

    } else if((tempsplit[0] == "/pushtabcuts")){
      socket.emit("tablearn",[wordTabDict,wordTabArr,"force",tempsplit[1]])
    } else if(tempsplit[0] == "/help" || tempsplit[0] == "/h"){

      helpCommand(tempsplit)


    } else if(tempsplit[0] == "/playsound"){
      if(tempsplit[2] == undefined){
      playSound(tempsplit[1])} else {
        playSound(tempsplit[1],JSON.parse(tempsplit[2]))

      }

      selfLog("playing sound: " + tempsplit[1])

    } else if(tempsplit[0] == "/stopsound"){
      stopSound(tempsplit[1])

      selfLog("stopping all sounds")

    } else if(tempsplit[0] == "/process"){
      SentenceProcess(temp.substring(9))
    } else if(tempsplit[0] == "/ping"){
      pingCounter.start()
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




function helpCommand(e){
  
  if(e[1] != undefined){
    e[1] = e[1].toLowerCase()
  }
  if(e[1] == "1" || e[1] == undefined || e[1] == "game" || e[1] == "general"){
    selfLog(MainHelpMenu,"#A000FF")
  } else if(e[1] == "2" || e[1] == "list" || e[1] == "content"){
    selfLog(consoleHelpResponses.Help2,"#FFFF00")
  } else if(e[1] == "3" || e[1] == "buffer"){
    selfLog(consoleHelpResponses.Help3,"#FFFF00")
  } else if(e[1] == "4" || e[1] == "tick" || e[1] == "ticks" || e[1] == "movement" || e[1] == "move"){
    selfLog(consoleHelpResponses.Help4,"#FFFF00")
  } else if(e[1] == "5" || e[1] == "text" || e[1] == "input"){
    selfLog(consoleHelpResponses.Help5,"#FFFF00")
  } else if(e[1] == "6" || e[1] == "command" || e[1] == "commands" || e[1] == "6.0"){
    selfLog(consoleHelpResponses["Help6-0"],"#FFFF00")
  } else if(e[1] == "6.1" || e[1] == "command1" || e[1] == "commands1"){
    selfLog(consoleHelpResponses["Help6-1"],"#FFFF00")
  } else if(e[1] == "6.2" || e[1] == "command2" || e[1] == "commands2"){
    selfLog(consoleHelpResponses["Help6-2"],"#FFFF00")
  } else if(e[1] == "6.3" || e[1] == "command3" || e[1] == "commands3"){
    selfLog(consoleHelpResponses["Help6-3"],"#FFFF00")
  } else if(e[1] == "7" || e[1] == "combat" || e[1] == "battle"){
    selfLog(consoleHelpResponses.Help7,"#FFFF00")
  } else {
    selfLog("Invalid help option.</br> If you think entities would need help with this, tell me your idea in discord. (lopkn#0019)","#FF0000")
  }
}




// function SentenceProcess(e){


//   selfLog(e)


// }



function selfLog(e,c){
  let pe = "<span style='color:"+c+";'>" + e + "</span>"
  chatProcess([">",pe,0,0])
}

function commandTabcut(type){
  switch(type){

    case "cx":
      return(mouseCoords[0])
      break;
    case "cy":
      return(mouseCoords[1])
      break;

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

var wordTabDict = {}
var wordTabArr = []
var currentTabSuggestion = ["",""]

learnTabWord(["hello","/help","/schmode","/actxt","/scanmode","/login","/clickupdate","/keyholder","/commandto","/process"],3)

function learnTabWord(input,score){
  if(score == undefined){
    score = 1
  }

  if(typeof(input) == "string"){
    if(input.split(" ").length == 1){
     
      input = tabPurifiedStr(input)
      if(input === false){
        return;
      }

      if(wordTabDict[input] != undefined){

        wordTabDict[input].freq += score
        if(score < 0 && wordTabDict[input].freq <= 0){
          // delete wordTabArr[wordTabDict[input].arrNum]

          for(let i = wordTabArr.length -1; i > -1 ; i--){
            if(wordTabArr[i] == input){
              wordTabArr.splice(i,1)
              break;
            }
          }


          delete wordTabDict[input];

        }
        return;
      }

      if(score > 0){
        wordTabDict[input] = {"freq":1}
        wordTabArr.push(input)
        return;
      }


    } else {
      learnTabWord(input.split(" "),score)
    }
  } else {

    for(let i = 0; i < input.length; i++){
      learnTabWord(input[i],score)
    }


  }

}


function joinArrBy(arr,by){
  let outstr = ""
  for(let i = 0; i < arr.length; i++){
    outstr += by + arr[i]
  }

  return(outstr.substring(1))

}

function tabPurifiedChar(char){
  char = char.toLowerCase()
  if(char == "=" || char == "(" || char == ")" || char == "{" || char == "}" || char == "[" || char == "]" || char == ":"){
    return("descimate")
  }
  if(char == "," || char == "."){
    return("delete")
  }
  return(char)
}

function tabPurifiedStr(str){
  let outstr = ""
  for(let i = 0; i < str.length; i++){
    let a = tabPurifiedChar(str[i])
    

    if(a.length == 1){
      outstr += a
    } else if(a == "descimate"){
      return(false)
    }


  }
  return(outstr)
}

function processTab(str){

  let strsplit = str.split(" ")
  let unlowered = strsplit[strsplit.length-1]
  let endword = unlowered.toLowerCase()
  let resultantArr = eliminateArr(endword,wordTabArr,0)

  let fout = ["",0]

  for(let i = 0; i < resultantArr.length; i++){
    let wordStats = wordTabDict[resultantArr[i]]

    let tscore = wordStats.freq * resultantArr[i].length
    if(tscore > fout[1]){

      fout = [resultantArr[i],tscore]

    }

  }

  if(fout[0].length > 0){
    fout[0] = unlowered + fout[0].substring(unlowered.length)
  }


  return(fout)

}

function eliminateArr(str,arr,pos){
  let outarr = []

  for(let i = 0; i < arr.length; i++){
    if(str[0] == arr[i][pos]){
      outarr.push(arr[i])
    }
  }
  if(str.length > 1){
    return(eliminateArr(str.substring(1),outarr,pos+1))
  } else {
    return(outarr)
  }

}



let commanding = 0
KeyboardEvent.repeat = false
document.addEventListener('keydown', (event) => {
  var name = event.key;

  if(event.which === 9 || event.which === 32|| event.which === 191){
    event.preventDefault();
  }

  if(name.length < 2 && name != "Shift" && name != "Backspace" && name != "/" && commanding == 0 && ACTIONLIMITER == "none"){
    ActionStore.push(name)
    AActionStore.push(name)


    if(name == "w"){
      walker.y -= 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "s"){
      walker.y += 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "d"){
      walker.x += 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    } else if(name == "a"){
      walker.x -= 1
      ActionPrint.push([walker.x,walker.y,"rgba(200,0,0,0.3)"])
    }

  } else if(name == "/"){
    if(commanding == 0){
      ACTIONLIMITER = "commanding"
      commanding = 1
      ActionStore.push("/")
      AActionStore.push("/")
    } else if(name == "/"){
      commandingPush("/")
    }








  } else if(commanding == 0 &&(name == "ArrowDown"|| name == "ArrowUp")){
    ACTIONLIMITER = "commanding"
    commanding = 1
    ActionStore.push("/")
    AActionStore.push("/")
    commandingPush(name)
  } else if(commanding == 1 && (name.length == 1 || name == "Backspace" || name == "Enter"|| name == "ArrowDown"|| name == "ArrowUp")){
    commandingPush(name)
  } else if(name == "Backspace" && ACTIONLIMITER == "none"){
    let ee = ActionStore.splice(ActionStore.length-1,1)
    AActionStore.splice(AActionStore.length-1,1)
    // ActionPrint.splice(ActionPrint.length-1,1)
        if(ee == "w"){
      walker.y += 1
    } else if(ee == "s"){
      walker.y -= 1
    } else if(ee == "d"){
      walker.x -= 1
    } else if(ee == "a"){
      walker.x += 1
    }
  } else if(name == "Tab" && commanding == 1){

    let a = ActionStore[ActionStore.length-1]
    let aa = AActionStore[AActionStore.length-1]
   
    let tabsuggest = processTab(ActionStore[ActionStore.length-1])

    if(tabsuggest[0] != ""){
      let sp = ActionStore[ActionStore.length-1].split(" ")
      sp.pop()
      sp.push(tabsuggest[0])
      ActionStore[ActionStore.length-1] = joinArrBy(sp," ")
      AActionStore[AActionStore.length-1] = ActionStore[ActionStore.length-1]

    }


  }




}, false);





document.addEventListener('mouseup', (event) => {

  MCVs.held = "none"
  player.clientInfo.MouseHolding.default = [false,0]

  if(player.clientInfo.MouseHolding.drag[2] != undefined){
    console.log(player.clientInfo.MouseHolding.drag[2])
  }

  player.clientInfo.MouseHolding.drag = [false]

  if(ACTIONLIMITER == "clicking"){
    ACTIONLIMITER = "none"
  }

})

document.addEventListener('mousedown', (event) => {
  // console.log(mouseX,mouseY,mouseCoords)

  mouseStatusUpdate()

  event.preventDefault();
  let clickedOn = "none"
  // player.clientInfo.MouseHolding.default = [true,0,mouseX,mouseY,mouseStatus]
  if(player.clientInfo.clickUpdate == "on"){
    repeat()
  }


if(ACTIONLIMITER == "none"){
    ACTIONLIMITER = "clicking"
  }

  let onBarCheck = onBar(mouseX,mouseY)
  if( onBarCheck != "no"){

    clickedOn = "bar"

    if(onBarCheck[0] == 1){

      if(MCVs[onBarCheck[1]].maxed){
        MCVs[onBarCheck[1]].maxed = false
      } else {
        MCVs[onBarCheck[1]].maxed = true
      }

    } else if(onBarCheck[0] == 2) {
      MCVs.held = [onBarCheck[1],mouseX,mouseY]
    } else if(onBarCheck[0] == 3) {
    
    ActionStore.push("switch:"+player.selectedSlot+"~"+onBarCheck[2])
    AActionStore.push(["swt",onBarCheck[2]])
    ActionPrint.push([200,200,"#FF00FF"])
    }

    return;
  }


  // allBeamSnakes.push(new BeamSnake([player.x,player.y,mouseCoords[0],mouseCoords[1],"DevLightning"],15,0.4))
  // allExplosions.push(new Explosion(mouseCoords[0],mouseCoords[1],10,1,5))

  if(inRect(mouseX,mouseY,0,825,820,50) && ACTIONLIMITER == "clicking"){
    clickedOn = "inventory"
  if(player.selectedSlot == Math.floor(mouseX/50)){
    player.selectedSlot = -1



    // socket.emit('selectInventorySlot',[player.id,-1])
  } else {
  player.selectedSlot = Math.floor(mouseX/50)}
  ActionStore.push("select:"+player.selectedSlot)
  AActionStore.push(["sel",player.selectedSlot])
  ActionPrint.push([200,200,"#FF00FF"])

  if(player.IMMEDITY == true){
  socket.emit('selectInventorySlot',[player.id,player.selectedSlot])
  AActionStore.splice(AActionStore.length-1,1)
  }

  }



  if(mouseStatus == "canvas"&& ACTIONLIMITER == "clicking"){

    clickedOn = "canvas"

    let a = CoordToChunk(mouseCoords[0],mouseCoords[1])
    let b = a.cx + a.cy*chunkSize+3
    // console.log([player.id,a,b])
    ActionStore.push("click:"+mouseCoords[0]+","+mouseCoords[1])
    // console.log(ee,a,b)

    animationBeams.push(new Beam(player.x,player.y,mouseCoords[0],mouseCoords[1],"client"))


    AActionStore.push(["click",a,b])
    ActionPrint.push([mouseCoords[0]-player.x+20,mouseCoords[1]-player.y+20,"rgba(255,0,0,0.3)"])
    if(player.IMMEDITY == true){
    socket.emit('click',[player.id,a,b])
    AActionStore.splice(AActionStore.length-1,1)
    ActionStore.splice(ActionStore.length-1,1)

    }
  }

  if(combatScreen.screenActive != 0 && inRect(mouseX,mouseY,850,675,380,130)&& ACTIONLIMITER == "clicking"){

    clickedOn = "combat"

    let temp = Math.floor((mouseY-675)/32.5)


    combatScreen.optionClick(temp)
  }
  if(inRect(mouseX,mouseY,1150,642.5,80,32.5)&& ACTIONLIMITER == "clicking"){

    clickedOn = "combat"

    combatScreen.optionClick(4)
  }

  player.clientInfo.MouseHolding.default = [true,0,mouseX,mouseY,mouseStatus,clickedOn]

})




function statusUpdate(e){
  let hpChange = e.hp - player.Cstats.hp
  player.Cstats.hp = e.hp
  if(hpChange < 0){
    MCVs.PlayerBars.Bars[0][2].height -= hpChange * (190/player.Cstats.maxhp)
  }

  let hungerChange = e.hunger - player.Cstats.hunger
  player.Cstats.hunger = e.hunger
  if(hungerChange < 0){
    MCVs.PlayerBars.Bars[1][2].height -= hungerChange * (190/player.Cstats.maxhunger)
  }

   let energyChange = e.energy - player.Cstats.energy
  player.Cstats.energy = e.energy
  if(energyChange < 0){
    MCVs.PlayerBars.Bars[2][2].height -= energyChange * (190/player.Cstats.maxenergy)
  }
  drawMenuCtx()
}



function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}


function debugRect(x,y){
  fill("#FF00FF")
  rectAtCoords(x,y)
}




function dragging(){

  if(mouseStatus != "canvas"){
    player.clientInfo.MouseHolding.drag = ["out"]
    return;
  }

  let e = player.clientInfo.MouseHolding.drag

  if(e[2][e[2].length-1][0] != mouseCoords[0] || e[2][e[2].length-1][1] != mouseCoords[1]){
    if(e[2][e[2].length-2] != undefined && (e[2][e[2].length-2][0] == mouseCoords[0] && e[2][e[2].length-2][1] == mouseCoords[1])){
      player.clientInfo.MouseHolding.drag[2].splice([e[2].length-1],1)
    }else{
    e[2].push(mouseCoords)
    }
  }

  let tempPrint = []
  let tempPrint2 = []
    player.clientInfo.MouseHolding.drag[2].forEach((e)=>{
      tempPrint.push([e[0]-player.x+20,e[1]-player.y+20,"#FF5F00"])
      let a = CoordToChunk(e[0],e[1])
      let b = a.cx + a.cy*chunkSize+3
      tempPrint2.push([a,b])
    })
 



  AllActions.edit("drag",["drag",tempPrint2],tempPrint)

}


var scrollTop = 0
var scrollHorizontal = 0
var mouseCoords = []

var circleSIGH = [[20,8],[13,11],[11,13],[8,20],[11,27],[13,29],[20,32],[27,29],[29,27],[32,20],[29,13],[27,11]]

var animationBeams = []

let MCVstate = {}

// main loop
// ==================================================================================================================


function repeat(){
  CTX.td.fillStyle = "rgba(0,0,0,0)"
  CTX.td.clearRect(0, 0, 1560, 950)
  if(player.clientInfo.MouseHolding.default[0] && player.clientInfo.MouseHolding.drag[0] === false && player.clientInfo.MouseHolding.default[5] == "canvas"){
    let tamt = player.clientInfo.MouseHolding.default[1]/5

    CTX.td.lineWidth = 10
    CTX.td.strokeStyle = "rgba(255,0,0,"+tamt/4+")"
    CTX.td.beginPath()
    CTX.td.arc(mouseX,mouseY,20,0,Math.PI*tamt)
    CTX.td.stroke()
    player.clientInfo.MouseHolding.default[1]+= 20/fps

    if(player.clientInfo.MouseHolding.default[1] > 10){
      player.clientInfo.MouseHolding.drag = [true,[mouseX,mouseY],[mouseCoords]]
      AllActions.create("drag",["drag",player.clientInfo.MouseHolding.drag[2]],[])
      allParticles.push(new cirParticle(mouseX,mouseY,5,{"ctx":CTX.td,"color":"#FF7700"}))
    }

  } else if (player.clientInfo.MouseHolding.drag[0] === true){
    CTX.td.lineWidth = 10
    CTX.td.strokeStyle = "rgb(255,100,0)"
    CTX.td.beginPath()
    CTX.td.arc(mouseX,mouseY,20,0,Math.PI*2)
    CTX.td.stroke()
    dragging()
  }
  // for(let i = 0; i < 3; i++){allParticles.push( new CustomParticle(100,100,["rgba(0,0,0,1)"],"pixel",{"size":10,"width":3,"physics":{"type":"gravity","gravity":280,"vx":Math.random()*200-100,"vy":Math.random()*125-325,"ground":{"bottom":Math.random()*100+100,"restitution":Math.random()*-0.7+0.1}},"life":150}))}
  if(MCVs.held != "none"){

    MCVs[MCVs.held[0]].x += mouseX - MCVs.held[1]
    MCVs[MCVs.held[0]].y += mouseY - MCVs.held[2]

    if(MCVs[MCVs.held[0]].x < 0){

      MCVs[MCVs.held[0]].x = 0
      
    }if(MCVs[MCVs.held[0]].x > 1560 - MCVs[MCVs.held[0]].width){

      MCVs[MCVs.held[0]].x = 1560- MCVs[MCVs.held[0]].width
    }if(MCVs[MCVs.held[0]].y < 0){

      MCVs[MCVs.held[0]].y = 0
    }if(MCVs[MCVs.held[0]].y > 920){

      MCVs[MCVs.held[0]].y = 920
    }


    MCVs.held[1] = mouseX
    MCVs.held[2] = mouseY


  }



  if(MCVs.TemporalInv.Items.length > 0){
  MCVs.TemporalInv.open = true
} else {
  MCVs.TemporalInv.open = false
}
if(MCVs.ChestInv.Items.length > 0){
  MCVs.ChestInv.open = true
} else {
  MCVs.ChestInv.open = false
}
  let strifiedmcv = JSON.stringify(MCVs)
  if(MCVstate !== strifiedmcv){
    MCVstate = strifiedmcv
    drawMenuCtx()
  }



  clearCanvas()
  InvDraw()
  


  mouseStatusUpdate()

  // if(inRect(mouseX,mouseY,0,0,820,820)){
  //   mouseStatus = "canvas"
  //   scrollTop = window.scrollY
  //   scrollHorizontal = window.scrollX
  //   try{
  //     mouseCoords = [Math.floor(mouseX/BlockPixels)-20+player.x,Math.floor(mouseY/BlockPixels)-20+player.y]
  //   } catch{}
  
  //   fill("rgba(200,0,255,0.3)")
  //   rectAtCoords(Math.floor(mouseX/BlockPixels),Math.floor(mouseY/BlockPixels))
  //   if(player.clientInfo.scanmode == "on"){
  //     fill("rgb(255,0,"+(flash*2550)+")")
  //     textO(map[mouseCoords[0]+","+mouseCoords[1]],mouseX-30,mouseY-30)
  //     textO(mouseCoords[0]+","+mouseCoords[1],mouseX-30,mouseY-60)

  //     for(let i = 0; i < players.length; i++){

  //       if(players[i][0] == mouseCoords[0] && players[i][1] == mouseCoords[1]){
  //         textO(players[i][3][2],mouseX-30,mouseY-90)
  //       }

  //     }


  //   }


  // } else if(inRect(mouseX,mouseY,0,825,820,50)){
  //   mouseCoords = [Math.floor(mouseX/50)]
  //   mouseStatus = "inventory" 

  //   fillI("rgba(200,0,255,0.5)")
  //   rectI(Math.floor(mouseX/50)*50,0,50,50)
  
  // } else if(inRect(mouseX,mouseY,850,675,380,130)){
  //   mouseStatus = "combatoptions"
  // } else {
  //   mouseStatus = "outside"
  // }










  for(let i = 0; i < ActionPrint.length; i++){

    if(ActionPrint[i][0] == undefined){
      continue;
    }if(typeof(ActionPrint[i][0]) == "object"){

      ActionPrint[i].forEach((tprint) => {

        fill(tprint[2])
        rect(tprint[0]*BlockPixels+5,tprint[1]*BlockPixels+5,BlockPixels-10,BlockPixels-10)
      })
      continue;

    }

    fill(ActionPrint[i][2])
    rect(ActionPrint[i][0]*BlockPixels+5,ActionPrint[i][1]*BlockPixels+5,BlockPixels-10,BlockPixels-10)
  }





  let l = ""
  for(let i = 0; i < ActionStore.length; i++){
    l += ",\"" + ActionStore[i] + "\""
  }
  l = "[" + l.substring(1) + "]"


  ctx.textAlign = "center"
  fill(player.clientInfo.actionTextColor)

  textOs(l,410,370)
  ctx.textAlign = "start"
  if(commanding == 1){
    fill("#FF4F00")
    textO("Input mode: text",310,450)
    ctx.font = "15px Arial"
    ctx.fillText("press tab for autofill, press enter to complete",280,475)

    let prtsuggest = ""
    let ac = ActionStore[ActionStore.length-1]
    if(currentTabSuggestion[0] != ac){
      currentTabSuggestion = [ac,processTab(ac)]
    }
    prtsuggest = currentTabSuggestion[1][0]
    ctx.font = "20px Arial"
    fill("#FFFF00")
    ctx.fillText(prtsuggest,330,495)

  }

  for(let i = 0; i < animationBeams.length; i++){
    if(animationBeams[i].life <= 0){
      animationBeams.splice(i,1)
      i--
    } else {
    animationBeams[i].upDraw()}


  }
    for(let i = 0; i < allBeamSnakes.length; i++){
    if(allBeamSnakes[i].steps <= 0){
      allBeamSnakes.splice(i,1)
      i--
    } else {
      allBeamSnakes[i].step(1+Math.floor(Math.random()*2))
    }
  }


  for(let i = allParticles.length-1; i >-1 ; i--){


    if(allParticles[i].update() == "kill"){
      allParticles.splice(i,1)
    }


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

var LocBoxes = {
  "map":[0,0,820,820],
  "inventory":[0,825,820,50],
  "secondary":[850,675,380,130]

}

function mouseStatusUpdate(){
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
      textO(mouseCoords[0]+","+mouseCoords[1],mouseX-30,mouseY-60)

      for(let i = 0; i < players.length; i++){

        if(players[i][0] == mouseCoords[0] && players[i][1] == mouseCoords[1]){
          textO(players[i][3][2],mouseX-30,mouseY-90)
        }

      }


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

function ParticleUpdate(e){
let a = e[1]
  if(e[0] == "DevLightning"){
  allBeamSnakes.push(new BeamSnake(a,15,0.4))
  } else if (e[0] == "Explosion"){

    allParticles.push(new Explosion(a[0],a[1],a[2],1,a[2]))
  }


}

function BeamUpdate(e){
  for(let i = 0; i < e.length; i++){
    animationBeams.push(new Beam(e[i][0],e[i][1],e[i][2],e[i][3],e[i][4]))
 
  }
}


function tick(){

  timerUpdate(clockmax,1)


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
  if(e[0] != undefined){
    if(e[0] === false){
      combatScreen.stopscreen()
    } else

    {
      combatScreen.restart(e[0])
    }
    


  }
}


function chatProcess(e){
  if(e[0] != ">" && e[0].length <= 16){
    ChatBox = "<span style='color:#F0E5FF'>" + e[0] + ": " + e[1] + "</span></br>" + ChatBox
  } else if(e[0].length > 16){
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
    drawItemMapSprite(player.Inventory[i],"inventory",i)
  }

  if(player.clientInfo.schmode == "on"){
    fillI("#00002F")
    rectI(0,0,820,50)
  }

  fillI("rgba(255,255,0,0.3)")
  rectI(player.selectedSlot*50,0,50,50)
  fillI("rgba(0,255,0,0.1)")
  rectI(player.serverSelectedSlot*50,0,50,50)
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


  ctxm.clearRect(0,0,840,840)


  if(player.clientInfo.schmode == "on"){
    ctxm.fillStyle = "#000000"
    ctxm.fillRect(0,0,820,820)
    return;
  }




//updatemap
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
      let a = TNEWdeparseDurability(tblock)
      let bb = constructedMap[i].split(",")
      let ccx = parseInt(bb[0])+20-player.x
      let ccy = parseInt(bb[1])+20-player.y

      let style = player.clientInfo.tileRenderer
      if(deparsed[0][style] == undefined){
        style = 0
      }

      if(deparsed[0][style][0] == "#"){
      fillM(deparsed[0][style])
      rectAtCoordsM(ccx,ccy)} else{
        //render image
        drawTilesMapSprite(deparsed[0][style],ccx,ccy)
      }


      if(TNEWATTRIBUTEOF(tblock,"$") != "NONE"){
        shades.push([ccx,ccy,parseInt(TNEWATTRIBUTEOF(tblock,"$"))*0.2])
      }
      if(TNEWATTRIBUTEOF(tblock,"T") != "NONE"){
        if(ccx > -5 && ccy > -5 && ccx < 46 && ccy < 46){
        
        trees.push([ccx,ccy,[10*TNEWATTRIBUTEOF(tblock,"T")],parseInt(TNEWATTRIBUTEOF(tblock,"S"))])}
      }
            if(a != "full"){
        ctxm.lineWidth = a * 5
        ctxm.strokeStyle = "#000000"
        lineM(ccx*BlockPixels+10-a*9,ccy*BlockPixels+10-a*9,a*18,a*18)
        lineM(ccx*BlockPixels+10-a*9,ccy*BlockPixels+10+a*9,a*18,-a*18)
      
      }

      if(TNEWATTRIBUTEOF(tblock,"I") != "NONE"){

        let item = TNEWATTRIBUTEOF(tblock,"I")

        // drawTileItemsMapSprite(item,ccx,ccy)
        drawItemMapSprite(item,"map",[ccx,ccy])


        

      
      }

      if(20 == ccx && 20 == ccy){
        if(TNEWATTRIBUTEOF(tblock,"I") != "NONE"){
          let item = TNEWATTRIBUTEOF(tblock,"I")
          MCVs.TemporalInv.Items = [item]
        } else {
          MCVs.TemporalInv.Items = []
        }

        }


  }



        
    for(let i = player.x - 20; i < player.x + 21;i++){
        for(let j = player.y - 20; j < player.y + 21; j++){
          
          getBlockOutline(i,j)
      }
    }


    playersUpdate(input[1])
    // NPEsUpdate(input[0])
    fillM("white")
    rectAtCoordsM(20,20)

    for(let i = 0; i < input[1].length; i++){
      let tcol = input[1][i][3][1] ? "#00FF00" : "#FF0000"
      drawOutline(input[1][i][0],input[1][i][1],tcol,1)
    }


  for(let i = 0; i < trees.length; i++){
    let a = trees[i]
    drawTree(a[0],a[1],a[2],a[3])
  }

  for(let i = 0; i < shades.length; i++){
    fillM("rgba(0,0,0,"+shades[i][2]+")")
    rectAtCoordsM(shades[i][0],shades[i][1])
  }


  for(let i = 0; i < wholeScreenRender.alphaColors.length; i++){
    fillM(wholeScreenRender.alphaColors[i])
    rectM(0,0,840,840)
  }


}



























function drawAtCoords(x,y,col){
  fillM(col)
  rectAtCoordsM(x+renderBlocks-player.x,y+renderBlocks-player.y)
}

function playersUpdate(e){
  for(let i = 0; i < e.length; i++){
    drawEntitiesMapSprite(e[i][2],e[i][0],e[i][1])

    if(e[i][2] == "player"){

    let trenderName = e[i][3][0] ? e[i][3][0] : "guest"

    ctxm.fillStyle = "#FF0000"
    ctxm.fillText(trenderName,(e[i][0]+renderBlocks-player.x)*BlockPixels-trenderName.length*3,BlockPixels*(e[i][1]+ renderBlocks-player.y)-10)
    }

    if(e[i][3][1] == true){

      drawBannerAt(e[i][0],e[i][1])

    }

  }

}


function drawBannerAt(x,y){

  let fx = (x - player.x + renderBlocks) * BlockPixels
  let fy = (y - player.y + renderBlocks) * BlockPixels

    let tctxm = new Path2D()

    tctxm.moveTo(fx,fy);
    tctxm.lineTo(fx+BlockPixels/4,fy);
    tctxm.lineTo(fx,fy+BlockPixels/4);  
    // tctxm.lineTo(fx,fy+5);
    tctxm.closePath();
    ctxm.fillStyle = "white"
    ctxm.fill(tctxm);

}



function drawTree(x,y,l,s){
  // fill(c)
  // rectAtCoords(x,y)

  for(let i = -7; i < 8; i++){
    for(let j = -7; j < 8; j++){
      let d = distance(x+j,y+i,x,y)
      if(d <= s){
        fillM("rgba("+l+",65,10,"+(0.5+(s-d)*0.02)+")")
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
    if(a[0] == "Sl"){
      ee = ((ee == 0 )? SLABSALL[a[1]][2] : ee)
    }
  }
  if(e == -1 || ee == e){return("full")}
    return(1-(e/ee))
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
  player.serverSelectedSlot = e[1]
   if(e[2] != ""){
    let chiv = e[2]
    MCVs.ChestInv.open = true
    MCVs.ChestInv.type = chiv[2]
    let splitchiv = chiv[1].split("=")
    MCVs.ChestInv.clickAreas = []
    for(let i = 0; i < splitchiv.length; i++){
    MCVs.ChestInv.Items[i] = splitchiv[i]
    MCVs.ChestInv.clickAreas[i] = ([0,20+(70*i),70,70,i])
    }
  } else {
    MCVs.ChestInv.open = false
    MCVs.ChestInv.Items = []
  }
}






// function drawTileItemsMapSprite(itemstr,x,y){

//   let a = TNEWATTRIBUTEOF(itemstr,"B")
//   if(a != "NONE"){
//     ctxm.drawImage(img,20*(parseInt(a)-1)+1,1,18,18,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
//   }
//   let b = TNEWATTRIBUTEOF(itemstr,"U")
//   if(b !="NONE"){
//     ctxm.drawImage(img,20*(parseInt(b)-1)+1,21,19,19,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
//   }
//     let c = TNEWATTRIBUTEOF(itemstr,"Sl")
//   if(c !="NONE"){
//     // console.log("eee")
//     ctxm.drawImage(img,20*(parseInt(c)-1)+1,41,19,19,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
//   }
  
// }



function drawTilesMapSprite(tileName,x,y){

    let a = ImgReferenceDict[tileName]

    ctxm.drawImage(tileMapImg,21*(a)+1,1,20,20,x*BlockPixels,y*BlockPixels,BlockPixels,BlockPixels)

  
}

function drawEntitiesMapSprite(entityName,x,y){

    let a = EntityReferenceDict[entityName]

    ctxm.drawImage(entityMapImg,21*(a)+1,1,20,20,(x+20-player.x)*BlockPixels,(y+20-player.y)*BlockPixels,BlockPixels,BlockPixels)

  
}


function itemDictLinks(type,num){

  if(IimageLinkReferenceDict[type][num] == undefined){
      return(num)
  }

  return(IimageLinkReferenceDict[type][num])
}

function drawItemMapSprite(itemID,where,variables){
  let ATTs = ["B","U","Sl","In"]

  for(let i = 0; i < ATTs.length; i++){
    let a = TNEWATTRIBUTEOF(itemID,ATTs[i])
    if(a != "NONE"){

      a = itemDictLinks(ATTs[i],a)
      let no = parseInt(a)
      let tsize = renderingVariables.itemsize[ATTs[i]]


      if(where == "inventory"){
        let slot = variables
        invctx.drawImage(img,40*(no-1),(i*40),tsize,tsize,50*slot,0,50,50)
      }

       else if(where == "map"){
        let x = variables[0]
        let y = variables[1]
        ctxm.drawImage(img,40*(no-1)+2,2+(i*40),tsize-4,tsize-4,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
      }

      else if(where == "menu"){
        let x = variables[0]
        let y = variables[1]
        let slot = variables[2]
        menuCTX.drawImage(img,40*(no-1),(i*40),tsize,tsize,x,70*slot+y,70,70)
      }



      break;
    }
  }
  // if(itemID == "undefined"){
  //         ctxm.fillStyle = "#FF00FF"
  //         ctxm.fillRect(variables[0]*20,variables[1]*20,20,20)
  //       }
  
}


// function menuDrawItemMapSprite(itemID,Slot,x,y){
//   let a = TNEWATTRIBUTEOF(itemID,"B")
//   if(a != "NONE"){
//     menuCTX.drawImage(img,20*(parseInt(a)-1),0,20,20,x,70*Slot+y,70,70)
//   }
//   let b = TNEWATTRIBUTEOF(itemID,"U")
//   if(b !="NONE"){
//     menuCTX.drawImage(img,20*(parseInt(b)-1),20,21,21,x,70*Slot+y,70,70)
//   }
//     let c = TNEWATTRIBUTEOF(itemID,"Sl")
//   if(c !="NONE"){
//     // console.log("eee")
//     menuCTX.drawImage(img,20*(parseInt(c)-1),40,21,21,x,70*Slot+y,70,70)
//   }
  
// }

// function odrawItemMapSprite(itemID,Slot){
//   let a = TNEWATTRIBUTEOF(itemID,"B")
//   if(a != "NONE"){
//     invctx.drawImage(img,20*(parseInt(a)-1),0,20,20,50*Slot,0,50,50)
//   }
//   let b = TNEWATTRIBUTEOF(itemID,"U")
//   if(b !="NONE"){
//     invctx.drawImage(img,20*(parseInt(b)-1),20,21,21,50*Slot,0,50,50)
//   }
//     let c = TNEWATTRIBUTEOF(itemID,"Sl")
//   if(c !="NONE"){
//     // console.log("eee")
//     invctx.drawImage(img,20*(parseInt(c)-1),40,21,21,50*Slot,0,50,50)
//   }
  
// }





function isKnownBlock(x,y){
  let str = x+","+y
  if(TNEWATTRIBUTEOF(map[str],"B") != "NONE"){
    return(true)
  }
  return(false)
}

function drawOutline(ix,iy,col,size){

  x = ix - player.x + renderBlocks
  y = iy - player.y + renderBlocks

  ctxm.strokeStyle = col
  ctxm.lineWidth = size

  ctxm.beginPath()
    ctxm.moveTo(x*BlockPixels,y*BlockPixels)
    ctxm.lineTo(x*BlockPixels+BlockPixels,y*BlockPixels)
    ctxm.lineTo(x*BlockPixels+BlockPixels,y*BlockPixels+BlockPixels)
    ctxm.lineTo(x*BlockPixels,y*BlockPixels+BlockPixels)
    ctxm.lineTo(x*BlockPixels,y*BlockPixels)
  ctxm.stroke()

}

function getBlockOutline(x,y){
  if(!isKnownBlock(x,y)){
    return;
  }


  let tdict = {"top":isKnownBlock(x,y-1),"bottom":isKnownBlock(x,y+1),"left":isKnownBlock(x-1,y),"right":isKnownBlock(x+1,y)}
  ctxm.strokeStyle = player.clientInfo.blockOutlineColor
  ctxm.lineWidth = 2

  x = x - player.x + renderBlocks
  y = y - player.y + renderBlocks

  ctxm.beginPath()
  if(!tdict.top){
    ctxm.moveTo(x*BlockPixels,y*BlockPixels)
    ctxm.lineTo((x+1)*BlockPixels,y*BlockPixels)
  }
  if(!tdict.bottom){
    ctxm.moveTo(x*BlockPixels,(y+1)*BlockPixels)
    ctxm.lineTo((x+1)*BlockPixels,(y+1)*BlockPixels)
  }
  if(!tdict.left){
    ctxm.moveTo(x*BlockPixels,y*BlockPixels)
    ctxm.lineTo(x*BlockPixels,(y+1)*BlockPixels)
  }
  if(!tdict.right){
    ctxm.moveTo((x+1)*BlockPixels,y*BlockPixels)
    ctxm.lineTo((x+1)*BlockPixels,(y+1)*BlockPixels)
  }
  ctxm.stroke()

}









// ======================================== -------- =======================================
// ======================================== MENU CTX =======================================
// ======================================== -------- =======================================


class barDropper{

  constructor(col,barno){
    this.barno = barno
    this.col = col
    let tmenu = MCVs.PlayerBars
    this.width = (tmenu.width - (5* tmenu.Bars.length + 5))/tmenu.Bars.length
    this.x = 5 + barno * (this.width+5)
    this.height = 0
  }

  upDraw(){
    if(this.height > 0){

      let tmenu = MCVs.PlayerBars
      MCTXfill(this.col)
      let actfill = tmenu.Bars[this.barno][0]
      if(tmenu.Bars[this.barno][0] == "HP"){
        actfill = 190*(player.Cstats.hp/player.Cstats.maxhp)
      }else if(tmenu.Bars[this.barno][0] == "hunger"){
        actfill = 190*(player.Cstats.hunger/player.Cstats.maxhunger)
      }else if(tmenu.Bars[this.barno][0] == "energy"){
        actfill = 190*(player.Cstats.energy/player.Cstats.maxenergy)
      }
      MCTXrect(tmenu.x + this.x,tmenu.y +25+(190-actfill),this.width,this.height*-1)

      this.height -= 10/fps

    }
  }

}


var MCVs = {

  "held":"none",
  "allBars":["TemporalInv","ChestInv","PlayerBars","EntityMenu"],
  "TemporalInv":{
    "open":false,
    "maxed":true,
    "x": 5,
    "y": 5,
    "width": 70,
    "Items":["U:1-A:1"]
  },
  "ChestInv":{
    "open":false,
    "maxed":true,
    "type":"Ch",
    "x": 200,
    "y": 5,
    "width": 70,
    "Items":["U:1-A:1"],
    "clickAreas":[]
  },
  "PlayerBars":{
    "maxed":true,
    "x":1400,
    "y":5,
    "width":100,
    "Bars":[["HP","#00FF00"],["hunger","#FFFF00"],["energy","#00FFFF"]]
  },
  "EntityMenu":{
    "open":false,
    "maxed":true,
    "x":700,
    "y":5,
    "width":160,
    "entity":[],
    "options":[]
  }

}
 function MCTXrect(x,y,x2,y2){
    menuCTX.fillRect(x,y,x2,y2)
  }
 function MCTXfill(i){
    menuCTX.fillStyle = i
  }

function MCTXtext(i,x,y){
  menuCTX.fillText(i,x,y)
}

function MaximiniButton(x,y,maxed){
  if(maxed == true){
  MCTXfill("rgba(150,0,0,0.9")} else {
    MCTXfill("rgba(0,100,0,0.9")
  }
  MCTXrect(x+2,y+2,16,16)
}

function renderBar(Menu,color){
  MCTXfill(color)
  MCTXrect(MCVs[Menu].x,MCVs[Menu].y,MCVs[Menu].width,20)
  MaximiniButton(MCVs[Menu].x,MCVs[Menu].y,MCVs[Menu].maxed)
}


MCVs.PlayerBars.Bars[0][2] = new barDropper("#700000",0)
MCVs.PlayerBars.Bars[1][2] = new barDropper("#505000",1)
MCVs.PlayerBars.Bars[2][2] = new barDropper("#0000F0",2)



function drawMenuCtx(){

menuCTX.fillStyle = "rgba(0,0,0,0.6)"
menuCTX.clearRect(0, 0, 1560, 940)


//draw entitymenu
if(MCVs.EntityMenu.open){
if(MCVs.EntityMenu.maxed == true){

  renderBar('EntityMenu',"rgba(200,200,255,0.7)")
  MCTXfill("rgba(70,70,70,0.7)")
  let menuheight = MCVs.EntityMenu.options.length * 30
  MCTXrect(MCVs.EntityMenu.x,MCVs.EntityMenu.y+20,MCVs.EntityMenu.width,MCVs.EntityMenu)

  for(let i = 0; i < MCVs.ChestInv.Items.length; i++){
    drawItemMapSprite(MCVs.ChestInv.Items[i],"menu",[MCVs.ChestInv.x,MCVs.ChestInv.y+20,i])
  }



} else {
  renderBar('EntityMenu',"rgba(255,200,200,0.7)")

}
}


//draw playerBars
if(MCVs.PlayerBars.maxed == true){

  let tmenu = MCVs.PlayerBars
  renderBar('PlayerBars',"rgba(255,200,200,0.7)")
  MCTXfill("rgba(70,70,70,0.7)")
  MCTXrect(tmenu.x,tmenu.y+20,tmenu.width,200)

  let BarSpace =  (tmenu.width - (5* tmenu.Bars.length + 5))/tmenu.Bars.length
  let twidtholder = 5

  for(let i = 0; i < tmenu.Bars.length; i++){
    MCTXfill("#000000")
    MCTXrect(tmenu.x+twidtholder,tmenu.y+25,BarSpace,190)
    MCTXfill(tmenu.Bars[i][1])

    let actfill = tmenu.Bars[i][0]
    if(tmenu.Bars[i][0] == "HP"){
      actfill = 190*(player.Cstats.hp/player.Cstats.maxhp)
    }else if(tmenu.Bars[i][0] == "hunger"){
      actfill = 190*(player.Cstats.hunger/player.Cstats.maxhunger)
    }else if(tmenu.Bars[i][0] == "energy"){
      actfill = 190*(player.Cstats.energy/player.Cstats.maxenergy)
    }

    MCTXrect(tmenu.x+twidtholder,tmenu.y+25+(190-actfill),BarSpace,actfill)
    twidtholder += BarSpace+5

    if(tmenu.Bars[i][2] != undefined){
      tmenu.Bars[i][2].upDraw()
    }


  }




} else {
  renderBar('PlayerBars',"rgba(255,100,100,0.7)")

}


//draw tempinv




if(MCVs.TemporalInv.open){
if(MCVs.TemporalInv.maxed == true){

  renderBar('TemporalInv',"rgba(200,200,255,0.7)")
  MCTXfill("rgba(70,70,70,0.7)")
  MCTXrect(MCVs.TemporalInv.x,MCVs.TemporalInv.y+20,MCVs.TemporalInv.width,MCVs.TemporalInv.Items.length*70)

  for(let i = 0; i < MCVs.TemporalInv.Items.length; i++){
    drawItemMapSprite(MCVs.TemporalInv.Items[i],"menu",[MCVs.TemporalInv.x,MCVs.TemporalInv.y+20,i])
  }



} else {
  renderBar('TemporalInv',"rgba(255,200,200,0.7)")

}
}


//draw chestinv






if(MCVs.ChestInv.open){
if(MCVs.ChestInv.maxed == true){

  if(MCVs.ChestInv.type == "Ch"){
    renderBar('ChestInv',"rgba(200,200,255,0.7)")
    MCTXfill("rgba(70,70,70,0.7)")
    MCTXrect(MCVs.ChestInv.x,MCVs.ChestInv.y+20,MCVs.ChestInv.width,MCVs.ChestInv.Items.length*70)

    for(let i = 0; i < MCVs.ChestInv.Items.length; i++){
      drawItemMapSprite(MCVs.ChestInv.Items[i],"menu",[MCVs.ChestInv.x,MCVs.ChestInv.y+20,i])
    }

  } else if(MCVs.ChestInv.type == "CH"){
    renderBar('ChestInv',"rgba(200,200,255,0.7)")
    MCTXfill("rgba(255,0,0,0.7)")
    MCTXrect(MCVs.ChestInv.x,MCVs.ChestInv.y+20,MCVs.ChestInv.width,MCVs.ChestInv.Items.length*70)

    for(let i = 0; i < MCVs.ChestInv.Items.length; i++){
      drawItemMapSprite(MCVs.ChestInv.Items[i],"menu",[MCVs.ChestInv.x,MCVs.ChestInv.y+20,i])
    }

  }

} else {
  renderBar('ChestInv',"rgba(255,200,200,0.7)")

}
}


return(true)

}

function onBar(x,y){
  for(let i = 0; i < MCVs.allBars.length; i++){
    if(MCVs[MCVs.allBars[i]].open || MCVs[MCVs.allBars[i]].open == undefined){
    if(inRect(x,y,MCVs[MCVs.allBars[i]].x,MCVs[MCVs.allBars[i]].y,MCVs[MCVs.allBars[i]].width,20)){
      
      if(inRect(x,y,MCVs[MCVs.allBars[i]].x+2,MCVs[MCVs.allBars[i]].y+2,16,16)){
        return([1,MCVs.allBars[i]])
      }
      return([2,MCVs.allBars[i]])


    }}

    if(MCVs[MCVs.allBars[i]].clickAreas != undefined && MCVs[MCVs.allBars[i]].clickAreas.length > 0){
      for(let j = 0; j < MCVs[MCVs.allBars[i]].clickAreas.length; j++){

        let tarr = MCVs[MCVs.allBars[i]].clickAreas[j]

      if(inRect(x,y,MCVs[MCVs.allBars[i]].x+tarr[0],MCVs[MCVs.allBars[i]].y+tarr[1],tarr[2],tarr[3])){
        return([3,MCVs.allBars[i],tarr[4]])
        }
      }
    }


  }

  return("no")

}



var allParticles = []

class CustomParticle{
  constructor(x,y,particleArr,type,custom){

    this.type = type
    this.x = x
    this.y = y
    this.spawnPos = [x,y]
    this.spawnpos = [player.x,player.y]
    this.physicsdict = custom.physics
    this.life = custom.life
  if(type == "pixel"){
    this.size = custom.size
    this.width = custom.width

    this.parr = []

      for(let i = 0; i < particleArr.length; i++){

        let px = (i%this.width)*this.size + this.x
        let py = (Math.floor(i/this.width))*this.size + this.y
        this.parr.push([px,py,particleArr[i]]) 
      }
  }


  }

  render(){

    if(this.life <= 0){
      return("kill")
    }

    for(let i = 0; i < this.parr.length; i++){
      let tempar = this.parr[i]
      fill(tempar[2])
      rect(tempar[0]+this.x,tempar[1]+this.y,this.size,this.size)

    }

  }


  update(){

    this.x -= (player.x - this.spawnpos[0])*BlockPixels
    this.y -= (player.y - this.spawnpos[1])*BlockPixels
    this.spawnpos = [player.x,player.y]
    if(this.physicsdict.type == "vector"){
      this.x += this.physicsdict.vx/fps
      this.y += this.physicsdict.vy/fps

    }else if(this.physicsdict.type == "gravity"){
      this.x += this.physicsdict.vx/fps
      this.y += this.physicsdict.vy/fps
      this.physicsdict.vy += this.physicsdict.gravity/fps
    }

    if(this.physicsdict.ground != undefined){
      if(this.physicsdict.ground.bottom != undefined){
        if(this.physicsdict.ground.slope == undefined){
        if(this.y > this.physicsdict.ground.bottom){
          this.physicsdict.vy *= this.physicsdict.ground.restitution
          this.physicsdict.vx *= 0.9
          this.y = this.physicsdict.ground.bottom
        }} else {
          if(this.y > this.physicsdict.ground.bottom + (this.x - this.spawnPos[0])*this.physicsdict.ground.slope){
          this.physicsdict.vy *= this.physicsdict.ground.restitution
          this.physicsdict.vx *= 0.9
          this.y = this.physicsdict.ground.bottom + (this.x - this.spawnPos[0])*this.physicsdict.ground.slope
        }
        }


      }

    }


    this.life -= 20/fps
    return(this.render())
  }



}



function playSound(sound,options){

  if(player.clientInfo.sound == "off"){
    return("sound off")
  }

  currentSounds.unshift(new Audio(sounds[sound]))
  currentSounds[0].play()

  if(options != undefined){
    if(options.speed != undefined){

      currentSounds[0].playbackRate = options.speed

    }
    if(options.loop != undefined){

      currentSounds[0].loop = options.loop

    }
    if(options.volume != undefined){
      currentSounds[0].volume = options.volume
    }

  }
  return("done")
}

function stopSound(options){

  if(options == undefined){
    options = "all"
  }

  if(options == "all"){

    for(let i = 0; i < currentSounds.length; i++){
      currentSounds[i].pause()
    }

    currentSounds = []
    return("done")
  }

  if(options == "paused"){

    for(let i = currentSounds.length-1; i > -1; i--){
      if(currentSounds[1] == undefined && currentSounds[i].paused){
        currentSounds.splice(i)
      }
    }

    return("done")

  }

}


function backslashRemover(string){

  let outstr = ""

  for(let i = 0; i < string.length; i++){
    if(string[i] != "\\"){
      outstr += string[i]
    }
  }

  return(outstr)

}

