
let mainCanvas = document.getElementById("myCanvas")
let mainCTX = mainCanvas.getContext("2d")



onmousemove = (e)=>{mouseX = (e.clientX - 5); mouseY = (e.clientY - 2)}


mainCTX.fillStyle = "#FFFFFF"
mainCTX.fillRect(0,0,840,840)


class car{
  constructor(color,x,y,w,h,id){
    this.id = id
    this.color = color
    this.quad = [[x+w,y+h],[x-w,y+h],[x+w,y-h],[x-w,y-h]]
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.mass = w*h*4
    this.vy = 0
    this.vx = 0

    this.d = [0,-1]

    this.ill = false
    this.irr = false
    this.iff = false
    this.ibb = false
    this.il = 0
    this.acceleration = 15
    this.ir = 0
    this.if = 0
    this.ib = 0
    this.masterVelocityMul = 0.7
  }

  turn(x){
    //s0 = 0
    x = x/(distance(0,0,this.vx,this.vy)+1)
    if(x > 0.06){
      x = 0.06
    }
    if(x < -0.06){
      x = -0.06
    }

    let finx = this.d[0]*Math.cos(x)-this.d[1]*Math.sin(x)
    let finy = this.d[0]*Math.sin(x)+this.d[1]*Math.cos(x)
    this.d = [finx,finy]
    // console.log(finx,finy)
  }

  updateQuadPoints(){
    this.quad[0] = [this.x+(this.w*this.d[1]+this.h*this.d[0]),this.y+(this.h*this.d[1]-this.w*this.d[0])]
    this.quad[1] = [this.x-(this.w*this.d[1]-this.h*this.d[0]),this.y+(this.h*this.d[1]+this.w*this.d[0])]
    this.quad[2] = [this.x+(this.w*this.d[1]-this.h*this.d[0]),this.y-(this.h*this.d[1]+this.w*this.d[0])]
    this.quad[3] = [this.x-(this.w*this.d[1]+this.h*this.d[0]),this.y-(this.h*this.d[1]-this.w*this.d[0])]

  }

  loop(){
    if(this.x > 840){
      this.x = 0
    }
    if(this.x < 0){
      this.x = 840
    }
    if(this.y < 0){
      this.y = 840
    }
    if(this.y > 840){
      this.y = 0
    }
  }

  draw(){
    mainCTX.strokeStyle = this.color
    renderQuad(this.quad)
    // mainCTX.beginPath()
    // mainCTX.strokeStyle = "#FFFFFF"
    // mainCTX.moveTo(this.x,this.y)
    // mainCTX.lineTo(this.x+this.vx*2,this.y+this.vy*2)
    // mainCTX.stroke()
    mainCTX.beginPath()
    mainCTX.strokeStyle = "#FFFFFF"
    mainCTX.moveTo(this.x,this.y)
    mainCTX.lineTo(this.x+this.d[0]*13,this.y+this.d[1]*13)
    mainCTX.stroke()
  }

  update(){

    this.vx *= 0.95
    this.vy *= 0.95 

    this.x += this.vx
    this.y += this.vy
  }


  left(e){
    if(e == "activate"){
      if(!this.ill){
        this.ill = true
        this.il = setInterval(()=>{this.turn(0.5)},10)
      }
    } else {
      this.ill = false
      clearInterval(this.il)
    }
  }

  right(e){
    if(e == "activate"){
      if(!this.irr){
        this.irr = true
        this.ir = setInterval(()=>{this.turn(-0.5)},10)
      }
    } else {
      this.irr = false
      clearInterval(this.ir)
    }
  }

  front(e){
    if(e == "activate"){
      if(!this.iff){
        this.iff = true
        this.if = setInterval(()=>{this.vx += this.d[0]* this.masterVelocityMul*this.acceleration/50;
         this.vy += this.d[1]* this.masterVelocityMul*this.acceleration/50;
         if(this.acceleration < 50){
          this.acceleration += 0.5
         }},10)
      }
    } else {
      this.iff = false
      clearInterval(this.if)
      this.acceleration = 15
    }
  }

  back(e){
    if(e == "activate"){
      if(!this.ibb){
        this.ibb = true
        this.ib = setInterval(()=>{this.vx -= this.d[0]* this.masterVelocityMul;
         this.vy -= this.d[1]* this.masterVelocityMul},10)
      }
    } else {
      this.ibb = false
      clearInterval(this.ib)
    }
  }

}


function distance(x,y,x2,y2){
  let a = x-x2
  let b = y-y2
  return(Math.sqrt(a*a+b*b))
}

function vectorNormalize2(original,multiplier){

  if(multiplier == undefined){
    multiplier = 1
  }

  let tx = original[2] - original[0]
  let ty = original[3] - original[1]

  let d = Math.sqrt(tx*tx+ty*ty)

  if(d == 0){
    return(original)
  }

  tx = tx*multiplier/d
  ty = ty*multiplier/d

  return([original[0],original[1],original[0]+tx,original[1]+ty])

}

function vectorNormalize(original,multiplier){

  if(multiplier == undefined){
    multiplier = 1
  }

  let tx = original[2]
  let ty = original[3]

  let d = Math.sqrt(tx*tx+ty*ty)

  if(d == 0){
    return(original)
  }

  tx = tx*multiplier/d
  ty = ty*multiplier/d

  return([original[0]+tx,original[1]+ty])

}

function renderQuad(arr){
  mainCTX.beginPath()
  mainCTX.lineWidth = 3
  mainCTX.moveTo(arr[0][0],arr[0][1])
  mainCTX.lineTo(arr[1][0],arr[1][1])
  mainCTX.lineTo(arr[2][0],arr[2][1])
  mainCTX.lineTo(arr[3][0],arr[3][1])
  mainCTX.lineTo(arr[0][0],arr[0][1])
  mainCTX.stroke()
}

let allVehicles = {}
let allKeyCaps = {}

function createCar(a,b,c,d,e){



  let id = Math.random()
  allVehicles[id] = (new car(a,b,c,d,e,id))

  let k = window.prompt("front")
  allKeyCaps[k] = (e)=>{allVehicles[id].front(e)}
   k = window.prompt("right")
  allKeyCaps[k] = (e)=>{allVehicles[id].right(e)}
   k = window.prompt("back")
  allKeyCaps[k] = (e)=>{allVehicles[id].back(e)}
   k = window.prompt("left")
  allKeyCaps[k] = (e)=>{allVehicles[id].left(e)}


}

createCar("#FF0000",400,400,8,12)
createCar("#00FFFF",440,400,8,12)

document.addEventListener("mousedown",(e)=>{

  mainCTX.fillStyle = "#303030"
  mainCTX.clearRect(0,0,840,840)
  mainCTX.fillRect(0,0,840,840)


})


document.addEventListener("keydown",(e)=>{
  e.preventDefault()
  let key = e.key

  if(allKeyCaps[key] != undefined){
    allKeyCaps[key]("activate")
  }


})

document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key

  if(allKeyCaps[key] != undefined){
    allKeyCaps[key]("deactivate")
  }


})


let mainLoopint = setInterval(()=>{
  repeat()
},1000/30)

let allVehiclesArr = Object.keys(allVehicles)

function repeat(){

  mainCTX.fillStyle = "#303030"
  mainCTX.clearRect(0,0,840,840)
  mainCTX.fillRect(0,0,840,840)



  allVehiclesArr.forEach((e)=>{
    let a = allVehicles[e]
    a.update()
    a.updateQuadPoints()
    a.loop()
    a.draw()
  })
}




