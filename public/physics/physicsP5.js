function turn(d,x){
    //s0 = 0
   

    let finx = d[0]*Math.cos(x)-d[1]*Math.sin(x)
    let finy = d[0]*Math.sin(x)+d[1]*Math.cos(x)
    return([finx,finy])
    // console.log(finx,finy)
  }

class PHOBJ{
  constructor(points,COM){
    this.rotation = [0,1]
    this.points = []
    
    this.vx = 0
    this.vy = 0
    
    this.x = 100
    this.y = 100
    
    this.COM = COM
    
    this.r = 0
    
    this.lines = []
    points.forEach((e,i)=>{
      let j = i+1
      if(i+1 == points.length){
        j = 0
      }
      // console.log(j,e[j])
      this.lines.push([e[0]-COM[0],e[1]-COM[1],points[j][0]-COM[0],points[j][1]-COM[1]])
      this.points.push([e[0]-COM[0],e[1]-COM[1],distance(0,0,e[0]-COM[0],e[1]-COM[1])])
                   })
    
  }
  
  
  update(){
    this.x += this.vx
    this.y += this.vy
    this.vy+=0.01
    this.rotation = turn(this.rotation,this.r)
    
    
    let momentum = distance(0,0,this.vx,this.vy)
    
    let notePts = []
    
    this.points.forEach((e,i)=>{
      let rx = (e[0] * this.rotation[1] + e[1] * this.rotation[0])
      let ry = (e[1] * this.rotation[1] - e[0] * this.rotation[0])
      let xx = rx + this.x
      let yy = ry + this.y
      
      
      if(yy > 600){
        notePts.push([xx,yy,rx,ry])
        
        this.applyForceInstance(rx,ry,0,-momentum*2)
        
      }
      
    })
    
    notePts.forEach((e,i)=>{
      if(e[1] > 600){
        this.y -= e[1]-600
      }
    })
    
    
  }
  
  
  draw(){
    this.lines.forEach((e)=>{
    let x1 = ((e[0] * this.rotation[1] + e[1] * this.rotation[0]) + this.x)
	let y1 = ((e[1] * this.rotation[1] - e[0] * this.rotation[0]) + this.y)
	let x2 = ((e[2] * this.rotation[1] + e[3] * this.rotation[0]) + this.x)
	let y2 = ((e[3] * this.rotation[1] - e[2] * this.rotation[0]) + this.y)
      line(x1,y1,x2,y2)
      circle(this.x,this.y,2)
    })
  }
  
  applyForceInstance(rx,ry,vx,vy){
    console.log("applyforce")
    allTempLines.push(new TempForceLine(200,"black",this.x+rx,this.y+ry,this.x+rx+(vx*50),this.y+ry+(vy*50)))
    let A = vectorFuncs.ShatterComponents(vx,vy,rx,ry)
    
    let ary = ry + this.y
    let arx = rx + this.x
    let avx = rx+vx+this.x
    let avy = ry+ry+this.y
    
    allTempLines.push(new TempForceLine(100,"red",arx,ary,arx+A[1][0]*50,ary+A[1][1]*50))
    allTempLines.push(new TempForceLine(100,"blue",arx,ary,arx+A[0][0]*50,ary+A[0][1]*50))
    allTempLines.push(new TempForceLine(100,"green",vx,vy,rx,ry))
    this.vx += A[0][0]
    this.vy += A[0][1]
    this.r -= A[2][1]/distance(this.x,this.y,rx,ry)

    // console.log("applied force:"+distance(0,0,vx,vy))
    // console.log("object moomentum now:"+this.r+distance(0,0,this.vx,this.vy))
    
    // setTimeout(()=>{draw=()=>{}},5)
  }
  
  
  collide(pt,othercom){
    
  }
  
}

class TempForceLine{
  constructor(life,col,x,y,vx,vy){
    this.life = life
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.col = col
  }
  draw(){
    this.life -= 1
    stroke(this.col)
    line(this.x,this.y,this.vx,this.vy)
    stroke(0)
    if(this.life < 0){
      return("remove")
    }
  }
}

let allTempLines = []

function setup() {
  createCanvas(800, 800);
}

var O1 = new PHOBJ([[0,0],[0,80],[80,80],[80,0]],[40,40])


let mouseState = {"held":false,"pos":[]}

function draw() {
  
 
  
  background(220);
   if(mouseIsPressed){
    if(!mouseState.held){
      mouseState.pos = [mouseX,mouseY,O1.x,O1.y]
    }
    mouseState.held = true
    line(mouseState.pos[0],mouseState.pos[1],mouseX,mouseY)
    
  } else {
    if(mouseState.held){
      O1.applyForceInstance(mouseState.pos[0]-mouseState.pos[2],mouseState.pos[1]-mouseState.pos[3],(mouseX-mouseState.pos[0])/50,(mouseY-mouseState.pos[1])/50)
      // console.log(mouseState.pos[0]-O1.x,mouseState.pos[1]-O1.y,(mouseX-mouseState.pos[0])/50,(mouseY-mouseState.pos[1])/50)
      mouseState.held = false
    }
  }
  O1.update()
  O1.draw()
  
  allTempLines.forEach((e,i)=>{
    if(e.draw()=="remove"){
      allTempLines.splice(i,1)
    }
  })
  
}

function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}


class vectorFuncs{
	static vectorizor(px,py,vx,vy){
		//this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
		//xb+ya,yb-xa
		return([px*vy+py*vx,py*vy-px*vx])
	}
	static INvectorizor(px,py,vx,vy){
		//xb-ya,yb+xa
		return([px*vy-py*vx,py*vy+px*vx])
	}
	static ShatterComponents(vx,vy,dx,dy){
		let normalized = this.originVectorNormalize(dx,dy)
		let invectorized = this.INvectorizor(vx,vy,normalized[0],normalized[1])

		let tyaxis = this.vectorizor(normalized[0],normalized[1],1,0)

		let resultx = [invectorized[1]*normalized[0],invectorized[1]*normalized[1]]
		let resulty = [invectorized[0]*tyaxis[0],invectorized[0]*tyaxis[1]]
		return([resultx,resulty,[invectorized[1],invectorized[0]]])

	}

	static originVectorNormalize(vx,vy){
		let d = Math.sqrt(vx*vx+vy*vy)
		return([vx/d,vy/d])
	}
}