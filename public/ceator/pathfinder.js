function setup() {
  createCanvas(400, 400);
  // noLoop();s
}


var gridsizex = 40
var gridsizey = 40
var pixlength = 10
var grid = {}
let findict;
let finbrr;

for(let i = 0; i < gridsizex; i++){
  for(let j = 0; j < gridsizey; j++){
    grid[i+","+j] = ""
  }
}

let finder = {"x":3,"y":3}
let destination = {"x":22,"y":22}
let barrierdict = {}



function draw() {
  background(220);
  fill(255)
  rect(finder.x*pixlength,finder.y*pixlength,pixlength,pixlength)
  fill(0,255,0)
  rect(destination.x*pixlength,destination.y*pixlength,pixlength,pixlength)

  let barriers = Object.keys(barrierdict)
  for(let i = 0; i < barriers.length; i++){
    fill(0)
    let split = barriers[i].split(",")
    let tx = split[0]
    let ty = split[1]
    
    rect(tx*pixlength,ty*pixlength,pixlength,pixlength)
  }
  
  if(mouseIsPressed){
   barrierdict[Math.floor(mouseX/pixlength) + "," + Math.floor(mouseY/pixlength)] = true
  }
  if(keyIsDown(68)){
    let finout = Pathfind(finder.x,finder.y,destination.x,destination.y,75)
    findict = finout[0]
    finbrr = finout[1]
  }
  
    if(findict != undefined){
      let finarr = Object.keys(findict)
      for(let i = 0; i < finarr.length; i++){
        let ts = finarr[i].split(",")
        let tx = ts[0]
        let ty = ts[1]
        let col = findict[finarr[i]]
        
        fill(255-col*5,0,0)
        rect(tx*pixlength,ty*pixlength,pixlength,pixlength)
        
      }
      
      for(let i = 0; i < finbrr.length; i++){
        fill(0,0,255,100)
        rect(finbrr[i][0]*pixlength,finbrr[i][1]*pixlength,pixlength,pixlength)
        
      }
      

    }
  
  
  
}

function isPossible(x,y){
  if(barrierdict[x+","+y] != undefined){
    return(false)
  }
  if(grid[x+","+y] == undefined){
    return(false)
  }
  return(true)
}

function Pathfind(pt1x,pt1y,pt2x,pt2y,maxsteps){
  
  let tempAt = {"x":pt1x,"y":pt1y}
  let Mempath = {}
  let alreadyFinished = {}
  alreadyFinished[pt1x+","+pt1y] = true
  let counter = 0
  let tempMempath = [[pt1x,pt1y]]
  let found = false
  
  for(let STEPS = 0; STEPS < maxsteps && !found; STEPS++){
    let alreadyStepped = {}
    let newtempMempath = []
    for(let i = 0; i < tempMempath.length; i++){
      let adderCx = tempMempath[i][0]
      let adderCy = tempMempath[i][1]
      
      for(let j = 0; j < 4; j++){
        
        let fin = []
        
        if(j == 0){
          fin = [adderCx+1,adderCy]
        } else if(j == 1){
          fin = [adderCx-1,adderCy]
        } else if(j == 2){
          fin = [adderCx,adderCy+1]
        } else if(j == 3){
          fin = [adderCx,adderCy-1]
        }
        
        
        if(alreadyFinished[fin[0]+","+fin[1]]==undefined&&isPossible(fin[0],fin[1]) && alreadyStepped[fin[0]+","+fin[1]] == undefined){
          alreadyStepped[fin[0]+","+fin[1]] = true
          newtempMempath.push(fin)
        }
        
        if(fin[0] == pt2x && fin[1] == pt2y){
          console.log("FOUND")
          found = true
          break;
        }
        
      }
    }
    
    tempMempath = newtempMempath
    // Mempath[counter] = tempMempath
    for(let i = 0; i < tempMempath.length; i++){
      Mempath[tempMempath[i][0]+","+tempMempath[i][1]] = counter
      alreadyFinished[tempMempath[i][0]+","+tempMempath[i][1]] = true
    }
    counter++
    
  }
  
  let finalpath = []
  
  if(found){
    
    let stepsarr = [[pt2x,pt2y]]
    let currentPx = pt2x
    let currentPy = pt2y
    
    let currentCounter = counter
    for(let i = counter-1; i > -1; i--){
    for(let j = 0; j < 4; j++){
        
        let fin = []
        
        if(j == 0){
          fin = [currentPx+1,currentPy]
        } else if(j == 1){
          fin = [currentPx-1,currentPy]
        } else if(j == 2){
          fin = [currentPx,currentPy+1]
        } else if(j == 3){
          fin = [currentPx,currentPy-1]
        }
      
      let str = fin[0] + "," + fin[1]
      if(Mempath[str] == i-1){
        // currentCounter = Mempath[str] 
        stepsarr.unshift(fin)
        currentPx = fin[0]
        currentPy = fin[1]
        break;
        
      }
      
    }}
    
    finalpath = stepsarr

  }
  
  return([Mempath,finalpath])
  
}





