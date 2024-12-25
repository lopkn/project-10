let Width = 1080
let Height = 1645
let zoom = 3
let dy = 0
let dx = 0
let ctx;
let globalRGBA = [255,255,255,1]
var MOUSEOPERATION = "normal"

function newDiv(name){
  let div = document.createElement("div")
  div.style.backgroundColor = "black"
  div.innerText="temp"
  div.style.color = "lime"
  div.contentEditable=true
  div.id = name
  document.body.appendChild(div)
  return(div)
}
var myPicker
function setup() {
  scale(0.3)
  let canvas = createCanvas(Width/zoom, Height/zoom);
  ctx = canvas.drawingContext
  noStroke()
  strokeJoin(ROUND)
  myPicker = createColorPicker('#9000FF')
}

var frames = []

var UUID = 0;
function genUUID(){
  return(UUID++)
}

//var frames = [{"layers":[{"layerName":"layer","lines":[
//{"id":1,"parr":[{"id":"L0,1","pt":[0,0]}]}
//]}]}]

function drawMultiline(frame,parr,w=10,color="black"){
  // parr.forEach((e)=>{e[0]=Math.floor(e[0]);e[1]=Math.floor(e[1])})
    let line = {"id":"L"+genUUID(),"color":color,"parr":parr,"type":0,"width":w}
    frame.push(line)
}
function drawMultiline2(layer,parr,w=10,color="black"){
  let lineId = layer.id + ",L" + genUUID()
  parr.forEach((e,i)=>{parr[i] = {"id":lineId+","+genUUID(),"pt":e}})
  
    let line = {"id":lineId,"color":color,"parr":parr,"type":0,"width":w}
    layer.lines.push(line)
}

function toScreen(arr){
  return([(arr[0]+dx)/zoom,(arr[1]+dy)/zoom])
}
function toPoint(arr){
  return([(arr[0]*zoom)-dx,(arr[1]*zoom)-dy])
}


function renderFrame(f){
  f.forEach((e)=>{
    if(e.type === 0){
      if(e.parr.length<2){return}
      ctx.beginPath()
      ctx.strokeStyle = e.color
      ctx.lineWidth = e.width/zoom
      ctx.moveTo(...toScreen(e.parr[0]))
      for(let i = 1; i < e.parr.length; i++){
        ctx.lineTo(...toScreen(e.parr[i]))
      }
      ctx.stroke()
    }
  })
}
            
function renderFrame2(f){
    f.layers.forEach((y)=>{
      y.lines.forEach((e)=>{
        if(e.type === 0){
        if(e.parr.length<2){return}
        ctx.beginPath()
        ctx.strokeStyle = e.color
        ctx.lineWidth = e.width/zoom
        ctx.moveTo(...toScreen(e.parr[0].pt))
        for(let i = 1; i < e.parr.length; i++){
          ctx.lineTo(...toScreen(e.parr[i].pt))
        }
        ctx.stroke()
      }
      })
    })
  }
var mouseDown = false
var drawLine = []
var currentFrame = 0
var currentLayer = 0
var globalColor = "yellow"
changeColor(255,0,255)
var globalSize = 25
var TYPE = 0
var FRAMERATE = 10
var PLAYING = false
var TYPES = ["freedraw","line"]

var markers = {"selecteds":[],"moving":undefined}

function draw() {
  background(220);
  if(TYPES[TYPE] == "freedraw"){
  if(mouseIsPressed && MOUSEOPERATION=="normal"&& mouseX<Width/zoom && mouseY<Height/zoom){
    if(mouseDown === false){
      drawLine = [toPoint([mouseX,mouseY])]
    } else {
      if(dist(...toPoint([mouseX,mouseY]),drawLine[drawLine.length-1][0],drawLine[drawLine.length-1][1]) > 3){
        
      drawLine.push(toPoint([mouseX,mouseY]))
      }
    }
    mouseDown = true
  } else if(mouseDown){mouseDown = false;
         
          drawLine.push(toPoint([mouseX,mouseY]))
          drawMultiline2(frames[currentFrame].layers[currentLayer],drawLine,globalSize,globalColor)
          drawLine = []
         }
} else if(TYPES[TYPE] == "line"){
  if(mouseIsPressed&& MOUSEOPERATION=="normal"&& mouseX<Width/zoom && mouseY<Height/zoom){
    if(mouseDown === false){
      drawLine = [toPoint([mouseX,mouseY])]
    }
    mouseDown = true
  } else if(mouseDown){mouseDown = false;
    drawLine.push(toPoint([mouseX,mouseY]))
    drawMultiline2(frames[currentFrame].layers[currentLayer],drawLine,globalSize,globalColor)
    drawLine = []
   }
}
  renderFrame2(frames[currentFrame])

    div.innerText = "frames: "+frames.length+"\ncurrent frame: "+currentFrame + " current layer: "+currentLayer + "\nline objects: not available"+"\nmode: "+TYPES[TYPE]+"\nwidth: "+globalSize+"\ncolor: "+globalColor+"\nframerate: "+FRAMERATE
  
    drawMarkers()
  
    if(PLAYING){
      nextFrame()
    }
  
      if(mouseIsPressed){
      drawLine.push(toPoint([mouseX,mouseY]))
      }
      
    if(MOUSEOPERATION=="normal"){
      if(drawLine.length<2){return}
        ctx.beginPath()
        ctx.strokeStyle = globalColor
        ctx.lineWidth = globalSize/zoom
        ctx.moveTo(...toScreen(drawLine[0]))
        for(let i = 1; i < drawLine.length; i++){
          ctx.lineTo(...toScreen(drawLine[i]))
        }
        ctx.stroke()
    } else if(MOUSEOPERATION=="select"){
      if(drawLine.length<2){return}
      ctx.fillStyle="rgba(255,0,0,0.1)"
      let tscn = toScreen(drawLine[1])
      let tsct = toScreen(drawLine[0])
      ctx.fillRect(...toScreen(drawLine[0]),tscn[0]-tsct[0],tscn[1]-tsct[1])
      // console.log(toScreen(drawLine[1]))
    }
  
      
      if(mouseIsPressed){
      drawLine.pop()}
                            
                            
}
  
  document.addEventListener("keydown",(e)=>{
    if(e.key == "u"){
      console.log(frames[currentFrame].layers[currentLayer].lines.splice(frames[currentFrame].layers[currentLayer].lines.length-1,1))
    } 
    if(e.key == " "){play()}
    // else if(e.key == "e"){
    //   console.log(JSON.stringify(frames[currentFrame]))
    // } else if(e.key == "s"){
    //   drawLine = [[mouseX*zoom,mouseY*zoom]]
    // } else if(e.key == " "){
    //   drawLine.push([mouseX*zoom,mouseY*zoom])
    // } else if(e.key == "d"){
    //   drawMultiline(frames[currentFrame],drawLine,globalSize,globalColor)
    // } 
    
    if(e.key == "ArrowRight"){
      nextFrame()
    } else if(e.key == "ArrowLeft"){
      lastFrame()
    } else if(e.key == "ArrowUp"){
        newFrame()
    } else if(e.key == "ArrowDown"){
      changePen()
    } else if(e.key == "Backspace"){
      deleteSelection()
    }
  })
  
  function changePen(){
    TYPE += 1
      if(TYPE+1>TYPES.length){
        TYPE = 0
      }
  }
  
  let playButton = document.createElement("button")
  playButton.onclick=play
  playButton.innerText="Play"
  document.body.append(playButton)
  function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

  function play(){
    PLAYING = !PLAYING
    if(PLAYING){
      frameRate(FRAMERATE)
    } else {
      frameRate(30)
    }
  }
  
  function nextFrame(){
    markers.selecteds =[]
    currentFrame += 1
      if(currentFrame+1>frames.length){
        currentFrame = 0
      }
  }
  function lastFrame(){
    currentFrame -= 1
    markers.selecteds =[]
      if(currentFrame<0){
        currentFrame = frames.length-1
      }
  }
  function newFrame(){
    //var frames = [{"layers":[{"layerName":"layer","lines":[
    //{"id":1,"parr":[{"id":"L0,1","pt":[0,0]}]}
    //]}]}]
    let nf = {"id":"F"+genUUID(),"layers":[]}
    newLayer(nf)
      frames.splice(currentFrame+1,0,nf)
    return(nf)
  }
  function newLayer(frame,push="push"){
    let y = {"id":frame.id+",y"+genUUID(),"layerName":"layer","lines":[]}
    if(push == "push"){
      frame.layers.push(y)
    } else if(push == "up"){
      frame.layers.splice(currentLayer+1,0,y)
    } else if(push == "down"){
      frame.layers.splice(currentLayer,0,y)
      layerUp()
    }
    return(y)
  }
  
  function freeSelect(x1,y1,x2,y2){
    let layer = frames[currentFrame].layers[currentLayer]
    let selecteds = []
    for(let i = 0; i < layer.lines.length; i++){
      let object = layer.lines[i]
      for(let j = 0; j < object.parr.length; j++){
        let inbox = inRect(x1,y1,x2,y2,object.parr[j].pt[0],object.parr[j].pt[1])
        if(inbox){
          selecteds.push(object.parr[j])
        }
      }
    }
    return(selecteds)
  }
  
  function drawMarkers(){
    ctx.strokeStyle="red"
    stroke("#FF0000")
    strokeWeight(1) 
    markers.selecteds.forEach((e)=>{
      let pt = toScreen(e.pt)
      line(pt[0]-5,pt[1]-5,pt[0]+5,pt[1]+5)
      line(pt[0]-5,pt[1]+5,pt[0]+5,pt[1]-5)
    })
  }
function inRect(x1,y1,x2,y2,x,y){
    let lx = x1
    let ly = y1
    let bx = x2
    let by = y2
    if(x1>x2){lx=x2;bx=x1}
    if(y1>y2){ly=y2;by=y1}

    if(x >= lx && y >= ly && x <= bx && y <= by){
        return(true)
    }
    return(false)
}
  
function newButton(name){
  let button = document.createElement("button")
  button.innerText = name
  document.body.appendChild(button)
  return(button)
}
  
function cloneFrame(){
  let jsn = JSON.stringify(frames[currentFrame].layers)
  console.log(jsn)
  let nf = newFrame()
  nf.layers.push(...JSON.parse(jsn))
}

  document.addEventListener("mousedown",(e)=>{
    
    
    changeColor(red(myPicker.color()),green(myPicker.color()),blue(myPicker.color()))
    
    if(e.which===3){
      MOUSEOPERATION = "select"
      drawLine = [toPoint([mouseX,mouseY])]
      console.log(drawLine[0][0],mouseX,mouseY)
      e.preventDefault()
    } else {
      if(markers.selecteds.length===0){
          MOUSEOPERATION = "normal"
      } else {
        if(e.shiftKey){
          MOUSEOPERATION = "selection edit"
          d = 30
            markers.moving = undefined
          markers.selecteds.forEach((e)=>{
            let td = distance(mouseX,mouseY,...toScreen(e.pt))
            if(td < d){
              d=td
              markers.moving = e
            }
            })
          
        } else {
          MOUSEOPERATION = "selection mass edit"
          drawLine = [toPoint([mouseX,mouseY])]
        }
      }
    }
  })
      
      document.addEventListener("mousemove",(e)=>{
        if(mouseIsPressed){
          if(MOUSEOPERATION=="selection edit" && markers.moving){
            markers.moving.pt[0] = toPoint([mouseX,mouseY])[0]
            markers.moving.pt[1] = toPoint([mouseX,mouseY])[1]
          } else if(MOUSEOPERATION == "selection mass edit"){
            let ntp = toPoint([mouseX,mouseY])
            markers.selecteds.forEach((e)=>{
              e.pt[0] += ntp[0]-drawLine[0][0]
              e.pt[1] += ntp[1]-drawLine[0][1]
            })
            drawLine = [ntp]
          }
        }
      })
      
  document.addEventListener("mouseup",(e)=>{
    if(MOUSEOPERATION=="select"){
      markers.selecteds=freeSelect(...drawLine[0],...toPoint([mouseX,mouseY]))
    drawLine = []
    } else if(MOUSEOPERATION === "selection edit"&& markers.moving){
      markers.moving[0] = toPoint([mouseX,mouseY])[0]
      markers.moving[1] = toPoint([mouseX,mouseY])[1]
    drawLine = []
    }
  })
  document.addEventListener("contextmenu",(e)=>{e.preventDefault()})
  
  newButton("last").onclick = lastFrame
  newButton("next").onclick = nextFrame
  newButton("newFrame").onclick = newFrame
  newButton("cloneFrame").onclick = cloneFrame
  newButton("+").onclick = ()=>{globalSize += 1}
  let pen_button = newButton("pen: "+TYPES[TYPE])
  pen_button.onclick = ()=>{changePen();pen_button.innerText = "pen: "+TYPES[TYPE]}
  newButton("-").onclick = ()=>{globalSize -= 1}
  
  newButton("up").onclick = ()=>{
    layerUp()
  }
  newButton("newLayerUp").onclick = ()=>{newLayer(frames[currentFrame],"up")}
  newButton("newLayerDown").onclick = ()=>{newLayer(frames[currentFrame],"down")}
  newButton("down").onclick = ()=>{
    layerDown()
  }
  newButton("delete").onclick = deleteSelection
  
  function layerUp(){currentLayer += 1
    markers.selecteds =[]
    if(currentLayer === frames[currentFrame].layers.length){currentLayer=0}
    }
  function layerDown(){
    currentLayer -= 1
    markers.selecteds =[]
    if(currentLayer === -1){currentLayer=frames[currentFrame].layers.length-1}
  }
  
  
  document.addEventListener("copy",(e)=>{
    myCopy()
  })
  document.addEventListener("paste",(e)=>{
    myPaste()
  })
  
      
  function myCopy(){
    console.log("copy")
  }
  function myPaste(){
    console.log("paste")
  }
      
  var div = newDiv("main")
  
  function changeColor(r,g,b,a=1){
    r = Math.floor(r)
    g = Math.floor(g)
    b = Math.floor(b)
    a = Math.floor(a*255)/255
    globalRGBA = [r,g,b,a]
    globalColor = "rgba("+r+","+g+","+b+","+a+")"
  }

      
      function getParentOfPoint(point,layer=frames[currentFrame].layers[currentLayer]){
        if(point.parent){return(point.parent)}
        let id = point.id.split(",")
        id.pop()
        id=id.join(",")
        for(let i = 0; i < layer.lines.length; i++){
          let ln = layer.lines[i]
          for(let j = 0; j < ln.parr.length; j++){
            ln.parr[j].parent = ln
          }
          if(ln.id === id){
            return(ln)
          }
        }
      }
      
      function deleteSelection(){
        let layer = frames[currentFrame].layers[currentLayer]
        let linesToDelete = new Set()
        markers.selecteds.forEach((e)=>{
          let ln = getParentOfPoint(e)
          ln.deleted = true
          linesToDelete.add(ln)
        })
        for(let i = layer.lines.length-1; i>-1; i--){
          if(linesToDelete.has(layer.lines[i])){
            layer.lines.splice(i,1)
          }
        }
        markers.selecteds = []
      }
      
      
      newFrame()
  
  
  
  
  