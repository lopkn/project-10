function setup() {
  createCanvas(800, 800);
  // noLoop();
}


var gridsizex = 80
var gridsizey = 80
var pixlength = 10
var grid = {}
let findict;
let finbrr;
let finoutt;
let finoutt2;
let finoutt3;
let collisionpts;


var keytimer = 0

for(let i = 0; i < gridsizex; i++){
  for(let j = 0; j < gridsizey; j++){
    grid[i+","+j] = ""
  }
}

let finder = {"x":3,"y":3}
let destination = {"x":7,"y":18}
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
  if(keyIsDown(68) && keytimer < 0){
    keytimer = 20
    finoutt = Pathfind(finder.x,finder.y,destination.x,destination.y,75)
    findict = finoutt[0]
    finbrr = finoutt[1]
  }
  
  if(keyIsDown(83) && keytimer < 0){
    keytimer = 20
    finoutt3 = PathfindDouble(finder.x,finder.y,destination.x,destination.y,20)
    finoutt2 = finoutt3[0]
    collisionpts = finoutt3[1]
  }
  
  
  keytimer -= 1
  
  
  if(finoutt2 != undefined){
    let finoutt2obj = Object.keys(finoutt2)
    for(let i = 0; i < finoutt2obj.length; i++){
      // noStroke()
      if(finoutt2[finoutt2obj[i]] > 0){
      fill(0,0,255-(abs(finoutt2[finoutt2obj[i]]*20)),150)} else {
        fill(255-(abs(finoutt2[finoutt2obj[i]]*20)),0,0,150)
      }
      let tsplit = finoutt2obj[i].split(",")
      rect(tsplit[0]*pixlength,tsplit[1]*pixlength,pixlength,pixlength)
    }
    
    for(let i = 0; i < collisionpts.length; i++){
      fill(0,255,0)
      rect(collisionpts[i][0]*pixlength,collisionpts[i][1]*pixlength,pixlength,pixlength)
    }
    
    
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

function sleep(ms){
  let i = 0
  while(i < ms){
    i++
  }
  return(true)
}

function PathfindDouble(p1x,p1y,p2x,p2y,maxsteps){

  let Mempath = {}
  let tempMempath1 = [[p1x,p1y]]
  let tempMempath2 = [[p2x,p2y]]
  let collisions = []
  let newMempath1 = []
  let newMempath2 = []
  let collisioncounter = []
  let choosecase = 1
  let counter = 1
  for(let STEPS = 0; STEPS < maxsteps && collisions.length == 0; STEPS++){
    newMempath1 = []
    newMempath2 = []
  for(let i = 0; i < tempMempath1.length; i++){
    
          for(let j = 0; j < 4; j++){
        
        let fin = []
        
        if(j == 0){
          fin = [tempMempath1[i][0]+1,tempMempath1[i][1]]
        } else if(j == 1){
          fin = [tempMempath1[i][0]-1,tempMempath1[i][1]]
        } else if(j == 2){
          fin = [tempMempath1[i][0],tempMempath1[i][1]+1]
        } else if(j == 3){
          fin = [tempMempath1[i][0],tempMempath1[i][1]-1]
        }
          
          let finstr = fin[0] + "," + fin[1]
  
            
        if(isPossible(fin[0],fin[1])){
          if(Mempath[finstr] == undefined){
          newMempath1.push([fin,finstr])} else if(Mempath[finstr] < 0){
            console.log("collide")
            collisions.push(fin)
          } else {
            // console.log(Mempath[finstr])
          }
        }
      }
  }
  
    if(collisions.length > 0){
      if( Math.random()>0.5){
      collisioncounter = [counter-1,-(counter-2)]
      } else {
      collisions = []
      choosecase = 2
      }
    }
    
    tempMempath1 = []
    
  for(let i = 0; i < newMempath1.length; i++){
    tempMempath1.push(newMempath1[i][0])
    Mempath[newMempath1[i][1]] = counter
  }
  
  //=================================================
   if(collisions.length == 0){
    for(let i = 0; i < tempMempath2.length; i++){
    
          for(let j = 0; j < 4; j++){
        
        let fin = []
        
        if(j == 0){
          fin = [tempMempath2[i][0]+1,tempMempath2[i][1]]
        } else if(j == 1){
          fin = [tempMempath2[i][0]-1,tempMempath2[i][1]]
        } else if(j == 2){
          fin = [tempMempath2[i][0],tempMempath2[i][1]+1]
        } else if(j == 3){
          fin = [tempMempath2[i][0],tempMempath2[i][1]-1]
        }
          
          let finstr = fin[0] + "," + fin[1]
  
            
        if(isPossible(fin[0],fin[1])){
          if(Mempath[finstr] == undefined){
          newMempath2.push([fin,finstr])} else if(Mempath[finstr] > 1){
            console.log("collide")
            collisions.push(fin)
          } else {
            // console.log(Mempath[finstr])
          }
        }
            
      }
  }
     
    if(collisions.length > 0){
        collisioncounter = [counter-choosecase,-(counter-1)]
    }
     
  tempMempath2 = []
  for(let i = 0; i < newMempath2.length; i++){
    tempMempath2.push(newMempath2[i][0])
    Mempath[newMempath2[i][1]] = -counter
  }
    
    counter++
  }
  }
  
  if(collisions.length != 0){
    
    let pathchoise = collisions[Math.floor(Math.random()*collisions.length)]
    let path1 = []
    let path2 = []
    for(let j = 0; j < 4; j++){
        
        let fin = []
        
        if(j == 0){
          fin = [pathchoise[0]+1,pathchoise[1]]
        } else if(j == 1){
          fin = [pathchoise[0]-1,pathchoise[1]]
        } else if(j == 2){
          fin = [pathchoise[0],pathchoise[1]+1]
        } else if(j == 3){
          fin = [pathchoise[0],pathchoise[1]-1]
        }
    
    
    let finstr2 = fin[0] + "," + fin[1]
    
    if(Mempath[finstr2] == collisioncounter[0]){
        path1[0] = fin
      }else if(Mempath[finstr2] == collisioncounter[1]){
        path2[0] = fin
      }
    }

  }
  
  
  return([Mempath,collisions])

}








function Pathfind(pt1x,pt1y,pt2x,pt2y,maxsteps){
  
  let tempAt = {"x":pt1x,"y":pt1y}
  let Mempath = {}
  Mempath[pt1x+","+pt1y] = -1
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
   let finwalkstr = ""
  if(found){
    
    let stepsarr = [[pt2x,pt2y]]
    let currentPx = pt2x
    let currentPy = pt2y
    
    let currentCounter = counter
    for(let i = counter-1; i > -2; i--){
    for(let j = 0; j < 4; j++){
        
        let fin = []
        
        let walkstr = ""
       
        if(j == 0){
          fin = [currentPx+1,currentPy]
          walkstr = "a"
        } else if(j == 1){
          fin = [currentPx-1,currentPy]
          walkstr = "d"
        } else if(j == 2){
          fin = [currentPx,currentPy+1]
          walkstr = "w"
        } else if(j == 3){
          fin = [currentPx,currentPy-1]
          walkstr = "s"
        }
      
      let str = fin[0] + "," + fin[1]
      if(Mempath[str] == i-1){
        // currentCounter = Mempath[str] 
        stepsarr.unshift(fin)
        finwalkstr = walkstr + finwalkstr
        currentPx = fin[0]
        currentPy = fin[1]
        break;
        
      }
      
    }}
    
    finalpath = stepsarr

  }
  return([Mempath,finalpath,finwalkstr])
  
}





