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


checkers = {
  "K":[[[1,2]],[[2,1]],[[-1,-2]],[[1,-2]],[[-1,2]],[[-2,-1]],[[2,-1]],[[-2,1]]],
  "R":[[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0]],[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]],[[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7]]],
  "B":[[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]],[[-1,-1],[-2,-2],[-3,-3],[-4,-4],[-5,-5],[-6,-6],[-7,-7]],[[-1,1],[-2,2],[-3,3],[-4,4],[-5,5],[-6,6],[-7,7]],[[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6],[7,-7]]],
  "P":[[[1,-1]],[[-1,-1]]],
  "Q":[[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]],[[-1,-1],[-2,-2],[-3,-3],[-4,-4],[-5,-5],[-6,-6],[-7,-7]],[[-1,1],[-2,2],[-3,3],[-4,4],[-5,5],[-6,6],[-7,7]],[[1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6],[7,-7]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0]],[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]],[[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7]]],
  "G":[[[1,0]],[[1,1]],[[-1,0]],[[-1,-1]],[[-1,1]],[[1,-1]],[[0,1]],[[0,-1]]]
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
    chkALL(1)
  }
  
  move(x,y){
    let space = x+","+y

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
      this.spts.forEach((D)=>{
        
        for(let i = 0; i < D.length; i++){
        
          let e = D[i]
          
        let str = (this.x + e[0]) + "," +(this.y + e[1])
        if(masterDict[str] !== undefined){
          masterDict[str] += NUM
          if(this.enemy == -1){
          enDict[str] += NUM
          } else {
            
          fDict[str] += NUM
          }
        }
          
          if(pieces[str] !== undefined && pieces[str].name !== undefined){
            break;
          }
          
        }
        
        
      })
    }
  

  
  moveRel(x,y){
    this.move(this.x+x,this.y+y)
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
    arr.push({"name":e.name,"space":e.space})
  })
  if(HIST.length > 40){
    HIST.splice(1,0)
  }
  HIST.push(arr)
}

function unDo(){
  chkALL(-1)
  pieces = {}
}


var selected = [0,0]

var masterDict = {}
var enDict = {}
var fDict = {}

var HIST = []

var pieces = {}
let sel = false
let spacing = D/8

for(let i = 0; i < 8; i++){
  for(let j = 0; j < 8; j++){
    masterDict[i+","+j] = 0
    enDict[i+","+j] = 0
    fDict[i+","+j] = 0
  }
}

function draw() {
  background("#141414");
  for(let i = spacing; i < D+spacing; i+= spacing){
    line(0,i,D,i)
    line(i,0,i,D)
  }
  
  let objk = Object.keys(masterDict)
  objk.forEach((e)=>{
    let s = e.split(",")
    let i1 = parseInt(s[0])
    let i2 = parseInt(s[1])
    textSize(spacing/4)
    if(masterDict[e] > 0){
      fill("rgb(0,"+(masterDict[e]*50+100)+",0)")
    } else if(masterDict[e] < 0){
      fill("rgb("+(-masterDict[e]*50+100)+",0,0)")
    }
    text(masterDict[e],s[0]*spacing+spacing*0.1,s[1]*spacing+spacing*0.3)
    
    textSize(spacing/6)
    if(enDict[e]<0){
      fill("red")
      text(enDict[e]*-1,s[0]*spacing+spacing*0.8,s[1]*spacing+spacing*0.9)
    }
    if(fDict[e]>0){
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
    if(pieces[e].enemy == 1){
      fill("rgb(130,0,160)")
    }
    text(pieces[e].name,s[0]*spacing+spacing*0.35,s[1]*spacing+spacing*0.65)
    fill("white")
  })
  if(mouseIsPressed){
    if(!sel){
      sel = true
    selected = [Math.floor(mouseX/spacing),Math.floor(mouseY/spacing)]
    }
  } else if(sel){
    sel = false
    let jd = selected.join(",")
    let jd2 = (Math.floor(mouseX/spacing))+","+(Math.floor(mouseY/spacing))
    if(jd != jd2){
      pieces[jd].move((Math.floor(mouseX/spacing)),(Math.floor(mouseY/spacing)))
    }
  }
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
      new piece("K",i,0,-1)
      new piece("K",i,7)
    }
    if(i == 2 || i == 5){
      new piece("B",i,0,-1)
      new piece("B",i,7)
    }
  }
  
  new piece("Q",3,0,-1)
  new piece("Q",3,7)
  new piece("G",4,0,-1)
  new piece("G",4,7)
  
  // new piece("Q",4,0,-1)
  // new piece("Q",4,7)
  // new piece("G",3,0,-1)
  // new piece("G",3,7)
  
}
newBoard()
setInterval(()=>{
  draw()
},1000)