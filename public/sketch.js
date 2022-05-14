
var renderBlocks = 20
var BlockPixels = 20
var BlockPixelsHalf = 10

var renderingVariables = {"itemsize":{"B":20,"Sl":21,"U":21,"In":21}}

var DEBUGGINGLOGS = {"Timeticker" : 0}


class Player{
  constructor(id){
    this.id = id
    this.x = 0
    this.y = 0
    this.hp = 100
    this.chunk = {"x":0,"y":0}
    this.selectedSlot = 0
    this.Inventory = ["B:1-A:50","B:5-A:50","U:4-A:100","Sl:1-A:30",""]
    this.clientInfo = {"scanmode":"off","clickUpdate":"off"}
    this.serverSelctedSlot = 0

  }
}

var allExplosions = []

class Explosion{
  constructor(x,y,size,type,frame){
    this.x = ((x+20-player.x) * BlockPixels + BlockPixelsHalf)
    this.y = ((y+20-player.y) * BlockPixels + BlockPixelsHalf)
    this.size = size
    this.life = size
    this.type = type
    this.frame = frame
    this.Sbeams = []
    for(let i = 0; i < size; i++){
      this.Sbeams.push(new BeamSnake([x,y,x+Math.random()*6-3,y+Math.random()*6-3,"Explosion"],109,0.1))
    }


  }

  upDraw(){
    let frame = Math.floor(this.life/(this.size/this.frame))
    if(this.frame != frame){
      for(let i = 0; i < this.Sbeams.length; i++){
        this.Sbeams[i].step(Math.round(Math.random()*2),0.9)
        
      }
      this.frame = frame
    }

    ctx.beginPath()
    ctx.lineWidth = this.life*5
    ctx.strokeStyle = "rgba(255,255,0,0.8)"
    ctx.arc(this.x, this.y, (this.size-this.life)*20, 0, 2 * Math.PI)
    ctx.stroke()


    this.life -= (this.size/50)*60/(fps)
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
    tposx = this.shooter[2]*0.1
    tposy = this.shooter[3]*0.1
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


      

      line(this.x+TrelativeCorrection[0],this.y+TrelativeCorrection[1],this.tx,this.ty)
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

var InterfaceCanvas = document.getElementById("Interface")
var menuCTX = InterfaceCanvas.getContext("2d")


var mouseX = 0
var mouseY = 0
var ActionStore = []
var AActionStore = []
var ChatBox = ""
var flash = 0


var allzoom = 1

document.body.style.zoom= allzoom

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
        CLOCKNUMBER++
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

  if(e - DEBUGGINGLOGS.Timeticker > 1){
    console.log (e,DEBUGGINGLOGS.Timeticker)
  }
  DEBUGGINGLOGS.Timeticker = e

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
  // CLOCKNUMBER = e
}

function joinSuccess(m){
    console.log(m)
    player = new Player(m)
}



onmousemove = function(e){mouseX = (e.clientX - 5 +scrollX)/allzoom; mouseY = (e.clientY -2 + scrollY)/allzoom}
ondrag = function(e){}



var img = new Image();
var tileMapImg = new Image();
var entityMapImg = new Image();
var animation = new Image();


entityMapImg.src = 'entitiesMap.png'
tileMapImg.src = 'tilesMap.png'
img.src = 'ItemMap.png';
animation.src = 'AnimationItem.png'

var playerSprites = new Image();
playerSprites.src = 'playerSprites.png'

// img.onload = function() {
//     ctx.drawImage(img.image, 400, 400);
//     tempp = 1
// };

/////////////////////////////////////////////////////


  function deathScreen(){
    clearInterval(canvasAnimation)
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

function textOs(str,x,y){
  ctx.font = "30px Arial"
  ctx.fillText(str,x,y,840)
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

    } else if((tempsplit[0] == "/clickupdate" ||tempsplit[0] == "/cupdate" )){
      player.clientInfo.clickUpdate = tempsplit[1]

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





document.addEventListener('mouseup', (event) => {

  MCVs.held = "none"


})

document.addEventListener('mousedown', (event) => {
  // console.log(mouseX,mouseY,mouseCoords)
  if(player.clientInfo.clickUpdate == "on"){
  repeat()}

  let onBarCheck = onBar(mouseX,mouseY)
  if( onBarCheck != "no"){

    if(onBarCheck[0] == 1){

      if(MCVs[onBarCheck[1]].maxed){
        MCVs[onBarCheck[1]].maxed = false
      } else {
        MCVs[onBarCheck[1]].maxed = true
      }

    } else if(onBarCheck[0] == 2) {
      MCVs.held = [onBarCheck[1],mouseX,mouseY]
    } else if(onBarCheck[0] == 3) {
      // console.log("TEST")
    ActionStore.push("switch:"+player.selectedSlot+"~"+onBarCheck[2])
    AActionStore.push(["swt",onBarCheck[2]])
    ActionPrint.push([200,200,"#FF00FF"])
    }






    return;
  }


  // allBeamSnakes.push(new BeamSnake([player.x,player.y,mouseCoords[0],mouseCoords[1],"DevLightning"],15,0.4))
  // allExplosions.push(new Explosion(mouseCoords[0],mouseCoords[1],10,1,5))

  if(inRect(mouseX,mouseY,0,825,820,50)){
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



  if(mouseStatus == "canvas"){
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

  if(combatScreen.screenActive != 0 && inRect(mouseX,mouseY,850,675,380,130)){

    let temp = Math.floor((mouseY-675)/32.5)


    combatScreen.optionClick(temp)
  }
  if(inRect(mouseX,mouseY,1150,642.5,80,32.5)){
    combatScreen.optionClick(4)
  }


})




function statusUpdate(e){
  let hpChange = e.hp - player.hp
  player.hp = e.hp
  if(hpChange < 0){
  MCVs.PlayerBars.Bars[0][2].height -= hpChange * 1.9

  }
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


var scrollTop = 0
var scrollHorizontal = 0
var mouseCoords = []

var circleSIGH = [[20,8],[13,11],[11,13],[8,20],[11,27],[13,29],[20,32],[27,29],[29,27],[32,20],[29,13],[27,11]]

var animationBeams = []



// main loop
// ==================================================================================================================


function repeat(){
  if(MCVs.held != "none"){

    MCVs[MCVs.held[0]].x += mouseX - MCVs.held[1]
    MCVs[MCVs.held[0]].y += mouseY - MCVs.held[2]

    if(MCVs[MCVs.held[0]].x < 0){

      MCVs[MCVs.held[0]].x = 0
      
    }else if(MCVs[MCVs.held[0]].x > 820 - MCVs[MCVs.held[0]].width){

      MCVs[MCVs.held[0]].x = 820- MCVs[MCVs.held[0]].width
    }else if(MCVs[MCVs.held[0]].y < 0){

      MCVs[MCVs.held[0]].y = 0
    }else if(MCVs[MCVs.held[0]].y > 800){

      MCVs[MCVs.held[0]].y = 800
    }


    MCVs.held[1] = mouseX
    MCVs.held[2] = mouseY


  }

  drawMenuCtx()



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










  for(let i = 0; i < ActionPrint.length; i++){
    fill(ActionPrint[i][2])
    rect(ActionPrint[i][0]*20+5,ActionPrint[i][1]*20+5,10,10)





  }






  let l = JSON.stringify(ActionStore)

  fill("rgba(255,0,200,0.5)")
  textOs(l,400-(l.length-2)*6.25 ,370)
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
    for(let i = 0; i < allBeamSnakes.length; i++){
    if(allBeamSnakes[i].steps <= 0){
      allBeamSnakes.splice(i,1)
      i--
    } else {
      allBeamSnakes[i].step(1+Math.floor(Math.random()*2))
    }
  }
  for(let i = 0; i < allExplosions.length; i++){
    if(allExplosions[i].life <= 0){
      allExplosions.splice(i,1)
      i--
    } else {
      allExplosions[i].upDraw()
    }


  }

  for(let i = allParticles.length-1; i >-1 ; i--){

    allParticles[i].physicsUpdate()
    if(allParticles[i].render() == "kill"){
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

    allExplosions.push(new Explosion(a[0],a[1],10,1,5))
  }


}

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
    drawItemMapSprite(player.Inventory[i],"inventory",i)
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

  // player.hp = input[0][0]

  // if(input[0] != ""){
  //   let chiv = input[0]
  //   MCVs.ChestInv.open = true

  //   let splitchiv = chiv[1].split("=")
  //   for(let i = 0; i < splitchiv.length; i++){
  //   MCVs.ChestInv.Items[i] = splitchiv[i]}
  // } else {
  //   MCVs.ChestInv.open = false
  //   MCVs.ChestInv.Items = []
  // }











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
  rectAtCoordsM(x+renderBlocks-player.x,y+renderBlocks-player.y)
}

function playersUpdate(e){
  for(let i = 0; i < e.length; i++){
    drawEntitiesMapSprite(e[i][2],e[i][0],e[i][1])

    if(e[i][3][1] == "player"){

    let trenderName = e[i][3][0] ? e[i][3][0] : "guest"

    ctxm.fillStyle = "#FF0000"
    ctxm.fillText(trenderName,(e[i][0]+renderBlocks-player.x)*BlockPixels-trenderName.length*3,BlockPixels*(e[i][1]+ renderBlocks-player.y)-10)
    }
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
  player.serverSelectedSlot = e[1]
   if(e[2] != ""){
    let chiv = e[2]
    MCVs.ChestInv.open = true

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


function drawItemMapSprite(itemID,where,variables){
  let ATTs = ["B","U","Sl","In"]

  for(let i = 0; i < ATTs.length; i++){
    let a = TNEWATTRIBUTEOF(itemID,ATTs[i])
    if(a != "NONE"){



      let tsize = renderingVariables.itemsize[ATTs[i]]


      if(where == "inventory"){
        let slot = variables
        invctx.drawImage(img,20*(parseInt(a)-1),(i*20),tsize,tsize,50*slot,0,50,50)
      }

       else if(where == "map"){
        let x = variables[0]
        let y = variables[1]
        ctxm.drawImage(img,20*(parseInt(a)-1)+1,1+(i*20),tsize-2,tsize-2,BlockPixels*x,BlockPixels*y,BlockPixels,BlockPixels)
      }

      else if(where == "menu"){
        let x = variables[0]
        let y = variables[1]
        let slot = variables[2]
        menuCTX.drawImage(img,20*(parseInt(a)-1),(i*20),tsize,tsize,x,70*slot+y,70,70)
      }



      break;
    }
  }

  
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
        actfill = 190*(player.hp/100)
      }
      MCTXrect(tmenu.x + this.x,tmenu.y +25+(190-actfill),this.width,this.height*-1)

      this.height -= 20/fps

    }
  }

}


var MCVs = {

  "held":"none",
  "allBars":["TemporalInv","ChestInv","PlayerBars"],
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
    "x": 200,
    "y": 5,
    "width": 70,
    "Items":["U:1-A:1"],
    "clickAreas":[]
  },
  "PlayerBars":{
    // "open":true,
    "maxed":true,
    "x":700,
    "y":5,
    "width":100,
    "Bars":[["HP","#00FF00"],[190,"#FFFF00"],[100,"#00FFFF"]]
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





function drawMenuCtx(){

menuCTX.clearRect(0, 0, 820, 820)



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
      actfill = 190*(player.hp/100)
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

if(MCVs.TemporalInv.Items.length > 0){
  MCVs.TemporalInv.open = true
} else {
  MCVs.TemporalInv.open = false
}


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

if(MCVs.ChestInv.Items.length > 0){
  MCVs.ChestInv.open = true
} else {
  MCVs.ChestInv.open = false
}




if(MCVs.ChestInv.open){
if(MCVs.ChestInv.maxed == true){

  renderBar('ChestInv',"rgba(200,200,255,0.7)")
  MCTXfill("rgba(70,70,70,0.7)")
  MCTXrect(MCVs.ChestInv.x,MCVs.ChestInv.y+20,MCVs.ChestInv.width,MCVs.ChestInv.Items.length*70)

  for(let i = 0; i < MCVs.ChestInv.Items.length; i++){
    drawItemMapSprite(MCVs.ChestInv.Items[i],"menu",[MCVs.ChestInv.x,MCVs.ChestInv.y+20,i])
  }



} else {
  renderBar('ChestInv',"rgba(255,200,200,0.7)")

}
}





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


  physicsUpdate(){

    if(this.physicsdict.type == "vector"){
      this.x += this.physicsdict.vx/fps
      this.y += this.physicsdict.vy/fps

    }else if(this.physicsdict.type == "gravity"){
      this.x += this.physicsdict.vx/fps
      this.y += this.physicsdict.vy/fps
      this.y -= this.physicsdict.gravity/fps
    }



    this.life -= 20/fps

  }



}



