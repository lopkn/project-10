let D = (window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth)-100

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(D+50)
  myCanvas.height = Math.floor(D+50)
  myCanvas.style.width = Math.floor(D+50)+"px"
  myCanvas.style.height = Math.floor(D+50)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
document.addEventListener("keydown",(e)=>{
  if(e.key == "u"){
    unDo()
  }
})
let mouseIsPressed = false
document.addEventListener("mousedown",()=>{mouseIsPressed = true;draw()

  setTimeout(draw,10)
})
document.addEventListener("mouseup",()=>{mouseIsPressed = false;draw()
  setTimeout(draw,10)
})


function background(x){
  ctx.fillStyle = x
  ctx.fillRect(0,0,D+200,D+200)
}

function line(x,y,x2,y2){
  ctx.beginPath()
  ctx.moveTo(x,y)
  ctx.lineTo(x2,y2)
  ctx.stroke()
}

function cline(x,y,x2,y2){
  line(x*spacing+spacing/2,y*spacing+spacing/2,x2*spacing+spacing/2,y2*spacing+spacing/2)
}

function textSize(x){
  ctx.font = "bold "+Math.floor(x)+"px Courier New"
}
function text(t,x,y){
  ctx.fillText(t,x,y)
}
function fill(x){
  ctx.strokeStyle = x
  ctx.fillStyle = x
}

function dangerFill(d){
  if(d["vuln"] ){if(counter%2 === 0){fill("#FF0000")};return}
  if(d["bad-trd-vuln"] ){if(counter%2 === 0){fill("#FF6600")};return}
  if(d["semi-vuln"] && (counter%5 === 0 ||counter%5 === 1)){fill("#FFAAAA")}
  if(d["trd-vuln"] && counter%5 === 0){fill("#FFFFAA")}
}

function buttonPressed(){
  a = false
  buttons.forEach((e)=>{
    if(e.detect(mouseX,mouseY))
      a = true
  })
  return(a)
}

class button{
  constructor(x,y,w,h,col){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.col = col
  }

  draw(){
    fill(this.col)
    ctx.fillRect(this.x,this.y,this.w,this.h)
  }

  detect(x,y){
    if(x > this.x && y > this.y &&x < this.x +this.w&& y < this.y +this.h){
      this.clicked()
      return(true)
    }
    return(false)
  }

  clicked(){}
}


checkers = {
  "H":[[[1,2]],[[2,1]],[[-1,-2]],[[1,-2]],[[-1,2]],[[-2,-1]],[[2,-1]],[[-2,1]]],
  "R":[[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0]],[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]],[[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7]]],
  "B":[[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]],[[-1,-1],[-2,-2],[-3,-3],[-4,-4],[-5,-5],[-6,-6],[-7,-7]],[[-1,1],[-2,2],[-3,3],[-4,4],[-5,5],[-6,6],[-7,7]],[[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6],[7,-7]]],
  "P":[[[1,-1]],[[-1,-1]]],
  "Q":[[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]],[[-1,-1],[-2,-2],[-3,-3],[-4,-4],[-5,-5],[-6,-6],[-7,-7]],[[-1,1],[-2,2],[-3,3],[-4,4],[-5,5],[-6,6],[-7,7]],[[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6],[7,-7]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0]],[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]],[[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7]]],
  "K":[[[1,0]],[[1,1]],[[-1,0]],[[-1,-1]],[[-1,1]],[[1,-1]],[[0,1]],[[0,-1]]]
}

class piece{
  constructor(name,x,y,en){
    let space = x+","+y
    this.x = x
    this.y = y
    this.name = name
    this.space = space
    chkALL(-1)
    pieces[space] = this
    this.spts = JSON.parse(JSON.stringify(checkers[name]))
    this.enemy = en?en:1
    if(name == "P"){
      if(this.enemy == -1){
        this.spts.forEach((e)=>{
          e.forEach((r)=>{
            r[1] *= -1
          })
        })
      }
    }
    this.fDict = this.enemy == 1? fDict:enDict
    this.fMDict = this.enemy == 1? fMDict:enMDict
    this.enDict = this.enemy == -1? fDict:enDict
    this.enMDict = this.enemy == -1? fMDict:enMDict
    chkALL(1)
  }
  
  move(x,y){
    let space = x+","+y
    histPush()
    chkALL(-1)
    delete pieces[this.space]
    
    this.space = space
    this.x = x
    this.y = y
    if(pieces[space] !== undefined){
      // pieces[space].chk(-1)
    }
    pieces[space] = this
    
    
    chkALL(1)
  }
  
  chk(NUM){
    NUM *= this.enemy
    let mvers = []
    let atkrs = []
    let I = 0
      this.spts.forEach((D)=>{
        
        for(let i = 0; i < D.length; i++){
        
          let e = D[i]
          
        let str = (this.x + e[0]) + "," +(this.y + e[1])
        if(masterDict[str] !== undefined){
          masterDict[str] += NUM

          let D1
          let D2
          if(this.enemy == 1){
            D1 = fDict
            D2 = fMDict
          } else {
            D1 = enDict
            D2 = enMDict
          }

          D1[str] += NUM
          atkrs.push(str)
          if(this.name != "P"){
            if(pieces[str] == undefined || pieces[str].enemy !== this.enemy){
              D2[str] += NUM
              mvers.push(str)
            }
            } else {
              if(I == 0){
                I++
                str = this.x+"," +(this.y + e[1])
                if(pieces[str] == undefined){
                  D2[str] += NUM
                  mvers.push(str)
                }
                str = this.x+"," +(this.y + Math.floor(e[1]*2))
                if(pieces[str] == undefined){
                if(this.enemy == 1){
                  if(this.y == 6){
                    D2[str] += NUM
                    mvers.push(str)
                  }
                } else {
                  if(this.y == 1){
                    D2[str] += NUM
                    mvers.push(str)
                  }
                }
              }
              } 
            }


          
        }
          
          if(pieces[str] !== undefined && pieces[str].name !== undefined){
            break;
          }
          
        }
        
        
      })
      return({"mv":mvers,"atk":atkrs})
    }
  

  
  moveRel(x,y){
    this.move(this.x+x,this.y+y)
  }

  danger(){
    let dangers = {
      "semi-vuln":false,
      "vuln":false,
      "trd-vuln":false,
      "bad-trd-vuln":false
    }
      if(masterDict[this.space]*this.enemy < 1){
        dangers["semi-vuln"] = true
        // if(masterDict[this.space]*this.enemy < 0){
        //   dangers["trd-vuln"] = true
        // }
        
      }
      if(this.enDict[this.space] != 0){
          dangers["trd-vuln"] = true
          if(Math.abs(this.fDict[this.space]) < Math.abs(this.enDict[this.space])){
            dangers["bad-trd-vuln"] = true
          }
          if(this.fDict[this.space] == 0){
            dangers["vuln"] = true
          }
        }

    return(dangers)
  }
}


function MV(x,y){
  pieces[selected.join(",")].moveRel(x,y)
}

function chkALL(num){
  let objk = Object.values(pieces)
  objk.forEach((e)=>{
    e.chk(num)
  })
}

function histPush(){
  let arr = []
  let objk = Object.values(pieces)
  objk.forEach((e)=>{
    arr.push({"name":e.name,"x":e.x,"y":e.y,"enemy":e.enemy})
  })
  if(HIST.length > 40){
    HIST.splice(1,0)
  }
  HIST.push(arr)
}

function unDo(){
  if(HIST.length < 1){return}
  chkALL(-1)
  pieces = {}
  let arr = HIST[HIST.length-1]
  arr.forEach((e)=>{
    new piece(e.name,e.x,e.y,e.enemy)
  })
  HIST.pop()
  draw()
}


var selected = [0,0]

let selectedPiece;
let selectedLoop;

var buttons = []
var options = {"enemy":"all","numbers":"all"}

var masterDict = {}
var enDict = {}
var fDict = {}
var fMDict = {}
var enMDict = {}

var HIST = []

var pieces = {}
let sel = false
let spacing = D/8

let counter = 0

for(let i = 0; i < 8; i++){
  for(let j = 0; j < 8; j++){
    masterDict[i+","+j] = 0
    enDict[i+","+j] = 0
    fDict[i+","+j] = 0
    fMDict[i+","+j] = 0
    enMDict[i+","+j] = 0
  }
}

let cb = new button(D,0,50,50,"cyan")
cb.clicked = ()=>{
if(options.enemy == "all"){
    options.enemy = true
  } else if(options.enemy === true){
    options.enemy = false
  } else if(options.enemy === false){
    options.enemy = "all"
  }
}
buttons.push(cb)

cb = new button(D,55,50,50,"red")
cb.clicked = ()=>{
  if(options.numbers == "all"){
    options.numbers = "danger"
  } else if(options.numbers == "danger"){
    options.numbers = "friendly"
  } else if(options.numbers == "friendly"){
    options.numbers = "none"
  } else if(options.numbers == "none"){
    options.numbers = "all"
  }
}
buttons.push(cb)

function draw() {
  background("#141414");
  fill("#808080")
  for(let i = spacing; i < D+spacing; i+= spacing){
    line(0,i,D,i)
    line(i,0,i,D)
  }

  buttons.forEach((e)=>{e.draw()})
  
  let objk = Object.keys(masterDict)
  objk.forEach((e)=>{
    let s = e.split(",")
    let i1 = parseInt(s[0])
    let i2 = parseInt(s[1])
    textSize(spacing/4)
    if((enDict[e] == masterDict[e]&&enMDict[e]<0)&&(options.enemy)){
      fill("rgba(255,255,0,0.5)")
      ctx.fillRect(s[0]*spacing,s[1]*spacing,spacing*0.2,spacing*0.2)
    }
    if((fDict[e] == masterDict[e]&&fMDict[e]>0)&&options.enemy!==true){
      fill("rgba(0,255,255,0.5)")
      ctx.fillRect(s[0]*spacing,s[1]*spacing,spacing*0.2,spacing*0.2)
    }
    if(masterDict[e] > 0){
      fill("rgb(0,"+(masterDict[e]*50+100)+",0)")
    } else if(masterDict[e] < 0){
      fill("rgb("+(-masterDict[e]*50+100)+",0,0)")
    } else {fill("white")}

    if(options.numbers != "none"){
      text(masterDict[e],s[0]*spacing+spacing*0.1,s[1]*spacing+spacing*0.3)
    }
    textSize(spacing/6)
    if(enDict[e]<0 && enDict[e] != masterDict[e] && (options.numbers === "all" || options.numbers === "danger")){
      fill("red")
      text(enDict[e]*-1,s[0]*spacing+spacing*0.8,s[1]*spacing+spacing*0.9)
    }
    if(fDict[e]>0&& fDict[e] != masterDict[e] && (options.numbers === "all" || options.numbers === "friendly")){
      fill("green")
      text(fDict[e],s[0]*spacing+spacing*0.1,s[1]*spacing+spacing*0.9)
    }
    fill("white")
    
  })
  let objk2 = Object.keys(pieces)
  objk2.forEach((e)=>{
    let s = e.split(",")
    let i1 = parseInt(s[0])
    let i2 = parseInt(s[1])
    textSize(spacing/2)
    fill("white")
    let dangers = pieces[e].danger()
    if(pieces[e].enemy == 1){
      fill("rgb(130,0,160)")
    }
    dangerFill(dangers)
    text(pieces[e].name,s[0]*spacing+spacing*0.35,s[1]*spacing+spacing*0.65)
  })
  if(mouseIsPressed){
    if(!sel){

      sel = true
      if( !buttonPressed() && (mouseX > D || mouseY > D )){
        unDo()
      }
      selected = [Math.floor(mouseX/spacing),Math.floor(mouseY/spacing)]

      if(pieces[selected.join(",")] !== undefined){
        selectedPiece = pieces[selected.join(",")]
        selectedLoop = selectedPiece.chk(0)
      } else {
        selectedPiece = undefined
        selectedLoop = undefined
      }

    }
  } else if(sel){
    sel = false
    let jd = selected.join(",")
    let jd2 = (Math.floor(mouseX/spacing))+","+(Math.floor(mouseY/spacing))
    if(jd != jd2 && pieces[jd] !== undefined){
      pieces[jd].move((Math.floor(mouseX/spacing)),(Math.floor(mouseY/spacing)))
      selectedLoop = selectedPiece.chk(0)
    }
  }


  //selectedPiece draw

  if(selectedPiece !== undefined){
    let sp = selectedPiece
    let md = spacing/2
      // if(selectedLoop.mv.length < 1){return}
      // let e = selectedLoop.mv[counter%selectedLoop.mv.length]

      // fill("#FF00FF")
      // let ss = e.split(",")
      // cline(sp.x,sp.y,ss[0],ss[1])

     selectedLoop.mv.forEach((e)=>{
      fill("#FF00FF")
      let ss = e.split(",")
      cline(sp.x,sp.y,ss[0],ss[1])
    })
  }


  counter ++

}

function newBoard(){
  for(let i = 0; i < 8; i++){
  new piece("P",i,1,-1)
  new piece("P",i,6)
    if(i == 0 || i == 7){
      new piece("R",i,0,-1)
      new piece("R",i,7)
    }
    if(i == 1 || i == 6){
      new piece("H",i,0,-1)
      new piece("H",i,7)
    }
    if(i == 2 || i == 5){
      new piece("B",i,0,-1)
      new piece("B",i,7)
    }
  }
  
  // new piece("Q",3,0,-1)
  // new piece("Q",3,7)
  // new piece("K",4,0,-1)
  // new piece("K",4,7)
  
  new piece("Q",4,0,-1)
  new piece("Q",4,7)
  new piece("K",3,0,-1)
  new piece("K",3,7)
  
}
newBoard()
draw()
draw()
draw()
setInterval(()=>{
  draw()
},100)



function touchHandler(event)
{

  console.log(event.type)
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        case "touchcancel":   type = "mouseup";   break;
        default:           return;
    }


    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);




    if(type !== "mouseup"){
    mouseX = event.touches[0].clientX
    mouseY = event.touches[0].clientY}


    var simulatedEvent = document.createEvent("MouseEvent");

    if(event.type == "touchend"){
        console.log("t4")
       }

    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    if(event.type == "touchend"){
        console.log("t5")
       }

    // if(type=="mouseup"){
    // console.log("hi")} else {
    //  console.log(event.type)
    // }
    document.body.dispatchEvent(simulatedEvent);
    
    event.preventDefault();
}


function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
    // document.addEventListener('touchmove', function() { e.preventDefault();GI.debuggingInfo = "cancled" }, { passive:false });
}
init()
