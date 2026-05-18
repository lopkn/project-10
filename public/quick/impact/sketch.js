
let Width = window.innerWidth
let Height = window.innerHeight

// let myCanvas = document.getElementById("myCanvas")

//   myCanvas.width = Math.floor(Width)
//   myCanvas.height = Math.floor(Height)
//   myCanvas.style.width = Math.floor(Width)+"px"
//   myCanvas.style.height = Math.floor(Height)+"px"
//   myCanvas.style.top = "0px"
//   myCanvas.style.left = "0px"

// let ctx = document.getElementById("myCanvas").getContext("2d")


var rand = (x)=>{
  if(x == undefined){return(Math.random())}
  if(x < 1){return(Math.random()<x)}
  return(Math.random()*x)
}


let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


// const socket = io.connect('/')
function readCSV(str,del=","){
  let arr = str.split("\n")
  for(let i = 0; i < arr.length; i++){
    arr[i] = arr[i].split(del)
  }
  return(arr)
}


class LCanvas{ //lopkns template canvas
  constructor(w=100,h=100,id=("LCanvas-"+Math.random())){
    this.canvas = document.createElement("canvas")
    this.canvas.id = id
    this.ctx = this.canvas.getContext("2d")
    this.canvas.style.position = "absolute"
    this.canvas.style.top = "0px"
    this.canvas.style.left = "0px"
    this.canvas.zIndex = "1500"
    this.canvas.width = w
    this.canvas.height = h
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    document.body.appendChild(this.canvas)
    return(this)
  }

  fitScreenSize(){
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  }

  oneTimeDown(f){ // pass in a function for what to do with one click
    this.canvas.addEventListener("mousedown",f,{once:true})
  }

  getPixelRGB(x,y){
    let d = this.ctx.getImageData(x, y, 1, 1).data
    return(d)
  }


}


function distance(x1,y1,x2=0,y2=0) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}


var frameFuncs = []

function mainLoop(time){
  let dt= (time-gameWorld.lastTime)
  gameWorld.lastTime = time
  frameFuncs.forEach((e)=>{
    e(time,dt)
  })
  requestAnimationFrame(mainLoop)
}

function oneTimeTrustedButton(f){
  let button = document.createElement("button")
  button.style.position = "absolute"
  button.style.backgroundColor = "purple"
  button.innerText = "one time verifier"
  button.style.top = button.style.left = "0px"

  button.style.zIndex = 5000
  button.addEventListener("click",(e)=>{f(e);button.remove()},{once:true})
  document.body.appendChild(button)
}


function Lvideo(type="screen",append=false){
    let video = document.createElement('video')
    video.id = "Lvideo-"+Math.random()
    video.setAttribute("autoplay","autoplay")
    if(append){
      document.body.append(video)
    }
    if(type=="screen"){
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });video.srcObject = stream;})
    } else {
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });video.srcObject = stream;})
    }
    return(video)
  }


//oneTimeTrustedButton(Lvideo)


function copyToCanvas(img,Lcan){
  Lcan.ctx.drawImage(img, 0, 0, Lcan.canvas.width, Lcan.canvas.height);
}

function setDefaultAbsolute(elm){
  elm.style.position = "absolute"
  elm.style.top = elm.style.left = "0px"
}


class LrandVel{
  constructor(mult=1,friction=0.999){
    this.val = 0
  }
  update(){
    this.val += (Math.random()-0.5)*mult
    this.val *= friction
    return(this.val)
  }
}



class Lcolorf{ //lopkn's color functions
  static dictify(arr){ //turns arrays of numbers into arrays of dicts
    let outarr = []
    for(let i = 0; i < arr.length; i+=4){
      outarr.push({"r":arr[0],"g":arr[1],"b":arr[2],"a":arr[3]})
    }
    return(outarr)
  }
  static colorDistA(arr1,arr2){//only works on Arrays of numbers //arr2 should be same length or shorter
    let dst = 0
    for(let i = 0; i < arr2.length; i++){
      dst += Math.abs(arr1[i]-arr2[i])
    }
    return(dst)
  }
}


function normalRandom(mean, stderr) {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stderr + mean;
}



/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============



document.addEventListener("keydown",(e)=>{
})

can = new LCanvas()
can.clear()
can.fitScreenSize()
can.canvas.style.pointerEvents = "none"





////////// game engine functions

function dot(x1,y1,x2,y2){
  return(x1*x2+y1*y2)
}






function check_collision_circles(x1,y1,r1,x2,y2,r2){
  let dist = distance(x1,y1,x2,y2)
  if(dist < r1+r2){
    return(true)
  }
  return(false)
}

function check_collision_capsules(x1,y1,r1,h1,x2,y2,r2,h2){
  //check if the circles on the ends are colliding
  if(check_collision_circles(x1,y1,r1,x2,y2,r2)){
    return(true)
  }
  if(check_collision_circles(x1,y1+h1,r1,x2,y2,r2)){
    return(true)
  }
  if(check_collision_circles(x1,y1,r1,x2,y2+h2,r2)){
    return(true)
  }
  if(check_collision_circles(x1,y1+h1,r1,x2,y2+h2,r2)){
    return(true)
  }
  //check if the rectangles in the middle are colliding
  if(x1 < x2+r2 && x1+r1 > x2 && y1 < y2+h2 && y1+h1 > y2){
    return(true)
  }
  return(false)
}

function check_collision_ball_line(x, y, r, x1, y1, x2, y2) {
    // 1. Get the vector of the line segment (AB)
    const abx = x2 - x1;
    const aby = y2 - y1;

    // 2. Get the vector from the start of the line to the ball center (AC)
    const acx = x - x1;
    const acy = y - y1;

    // 3. Calculate the squared length of the line segment AB
    const ab2 = abx * abx + aby * aby;

    // Handle the edge case where the line segment is actually just a single point
    if (ab2 === 0) {
        const distSq = acx * acx + acy * acy;
        return distSq <= r * r;
    }

    // 4. Project vector AC onto AB to find the closest point, clamped between 0 and 1
    // This ensures the closest point stays on the actual segment
    let t = (acx * abx + acy * aby) / ab2;
    t = Math.max(0, Math.min(1, t));

    // 5. Find the coordinates of that closest point on the segment
    const closestX = x1 + t * abx;
    const closestY = y1 + t * aby;

    // 6. Calculate the squared distance from the ball center to this closest point
    const distX = x - closestX;
    const distY = y - closestY;
    const distanceSq = distX * distX + distY * distY;

    // 7. If squared distance is less than or equal to squared radius, they collide
    return distanceSq <= r * r;
}

function point_on_line(x, y, x1, y1, x2, y2) {
    const abx = x2 - x1;
    const aby = y2 - y1;
    const acx = x - x1;
    const acy = y - y1;

    const ab2 = abx * abx + aby * aby;

    // If the line segment is a single point
    if (ab2 === 0) {
        return Math.sqrt(acx * acx + acy * acy);
    }

    // Project AC onto AB, clamping to the segment bounds [0, 1]
    let t = (acx * abx + acy * aby) / ab2;
    t = Math.max(0, Math.min(1, t));

    // Find the closest point

    return({x: x1 + t * abx, y: y1 + t * aby})

}

function point_to_line_distance(x, y, x1, y1, x2, y2) {
    const closest = point_on_line(x, y, x1, y1, x2, y2);
    const distX = x - closest.x;
    const distY = y - closest.y;
    return Math.sqrt(distX * distX + distY * distY);
}

function line_to_line_collision_pt(x1,y1,x2,y2,x3,y3,x4,y4){

    var det, gamma, lambda;
  det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
  if (det === 0) {
    return false;
  } else {
    lambda = ((y4 - y3) * (x3 - x1) + (x4 - x3) * (y3 - y1)) / det;
    gamma = ((y2 - y1) * (x3 - x1) + (x2 - x1) * (y3 - y1)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
}



function reflect(vx,vy, x,y) {
  // Formula: R = v - 2 * (v . n) * n
  const dot = vx * x + vy * y;
  return {
    x: vx - 2 * dot * x,
    y: vy - 2 * dot * y
  };
}

function Lrotate(x,y,d){
  return({
    x: x*Math.cos(d) - y*Math.sin(d),
    y: x*Math.sin(d) + y*Math.cos(d)
  })
}



////////// end game engine functions


class ball{
  constructor(x,y,r,ctx){
    this.x = x
    this.y = y
    this.ax = 0
    this.ay = 0

    this.mass = 1


    this.r = r
    this.vx = 0
    this.vy = 0

    this.color = "white"
    this.ctx = ctx

    this.name = "dummy" 
    this.updateFuncs = []
  }

  force(x,y,mag){
    this.vx += x * mag
    this.vy += y * mag
  }

  speed(){
    return(distance(this.vx,this.vy))
  }

  update(dt){

    this.vy += gameWorld.gravity*dt

    this.vx += this.ax*dt
    this.vy += this.ay*dt


    let lastX = this.x
    let lastY = this.y
    
    this.x += this.vx*dt
    this.y += this.vy*dt

    let speed = this.speed()
    this.vx *= (1-gameWorld.airFriction*speed)
    this.vy *= (1-gameWorld.airFriction*speed)

    //check collisions
    entityList.walls.forEach((w)=>{
      if(check_collision_ball_line(this.x,this.y,this.r,w.x,w.y,w.x2,w.y2)){

        let closest = point_on_line(this.x,this.y,w.x,w.y,w.x2,w.y2)
        let dist = distance(this.x,this.y,closest.x,closest.y)
        let fellback = false

        let normalizedDirectionToWall;
        if(dist!==0){
          normalizedDirectionToWall = {x:(closest.x-this.x)/dist,y:(closest.y-this.y)/dist}
        } else {
          // fallback to last position if ball center is exactly on the wall, not perfect but should work in most cases and prevents NaN errors
          fellback = true;
          dist = distance(lastX,lastY,closest.x,closest.y)
          normalizedDirectionToWall = {x:(closest.x-lastX)/dist,y:(closest.y-lastY)/dist}
        }

        this.color = "red"

        let reflectionVector = normalizedDirectionToWall


        let reflection = reflect(this.vx,this.vy,reflectionVector.x,reflectionVector.y)
        this.vx = reflection.x
        this.vy = reflection.y



        //push ball out of wall (good enough for now, fix later, bleeding E)


        let overlap = this.r - dist
        if(overlap > 0){
          let pushX = -normalizedDirectionToWall.x * overlap
          let pushY = -normalizedDirectionToWall.y * overlap
          this.x += pushX
          this.y += pushY
        }

      }
    })

    entityList.balls.forEach((b)=>{
      if(b != this){

        // only do anything if the balls are moving towards each other

        let towards = dot(this.vx,this.vy,b.x-this.x,b.y-this.y) <= 0
        if(!towards){
          // return
        }


        if(check_collision_circles(this.x,this.y,this.r,b.x,b.y,b.r)){
          console.log("collision",this.name)

          this.color = "green"
          b.color = "green"

          let dist = distance(this.x,this.y,b.x,b.y)

          let normalizedVectorTo = {x:(b.x-this.x)/dist, y:(b.y-this.y)/dist}

          let forceMultiplier = dot(this.vx,this.vy,normalizedVectorTo.x,normalizedVectorTo.y) - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)
          // let forceMultiplier2 = dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)
          
          let forceTo = {x:forceMultiplier * normalizedVectorTo.x,y:forceMultiplier * normalizedVectorTo.y}
          this.force(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier)
          // counterforce
          b.force(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier)




          //push balls out of each other (good enough for now, fix later, bleeding E)

          let overlap = this.r + b.r - dist
          if(overlap > 0){
            overlap += 0.001
            let pushX = normalizedVectorTo.x * overlap / 2
            let pushY = normalizedVectorTo.y * overlap / 2
            this.x -= pushX
            this.y -= pushY
            b.x += pushX
            b.y += pushY
          }

        }
      }
    })

    this.updateFuncs.forEach((f)=>{
      f(dt)
    })

  }
  draw(){
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
    this.ctx.fill()

    //debug
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.lineTo(this.x+this.vx*50,this.y+this.vy*50)
    this.ctx.stroke()
  }
}

class wall{
  constructor(x1,y1,x2,y2,ctx){
    this.x = x1
    this.y = y1
    this.x2 = x2
    this.y2 = y2
    this.color = "white"
    this.ctx = ctx
    this.length = distance(x1,y1,x2,y2)

    this.name = "default wall" 

    this.normalized = {x:(y2-y1)/this.length,y:(x2-x1)/this.length}
    this.normal = Lrotate(this.normalized.x,this.normalized.y,Math.PI/2)
    this.midpoint = {x:(x1+x2)/2,y:(y1+y2)/2}

  }

  draw(){
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.lineTo(this.x2,this.y2)
    this.ctx.stroke()
  }
}

class entityList{
  static balls = []
  static walls = []
}


class gameWorld{
    static gravity = 0.001
    static airFriction = 0.01
    static lastTime = 0
}

class controller{
  static mouseDownPos = {x:0,y:0}
  static mouseIsDown = false
  static dv = {x:0,y:0}
}




/////// game setup


//initialize player

  entityList.player = new ball(100,100,50,can.ctx)
  entityList.player.name = "player"
  entityList.balls.push(entityList.player)

  //initialize walls
  entityList.walls.push(new wall(0,0,800,0,can.ctx))
  entityList.walls.push(new wall(0,0,0,600,can.ctx))
  entityList.walls.push(new wall(800,0,800,600,can.ctx))

  entityList.walls.push(new wall(0,600,800,600,can.ctx)) // floor
  entityList.walls.push(new wall(110,500,110,1600,can.ctx)) // beam


  entityList.balls.push(new ball(150,100,50,can.ctx))


  //// Debugging

  entityList.player.energy = ()=>{
    let mgh = -gameWorld.gravity*entityList.player.y
    let ke = 0.5*(entityList.player.vx*entityList.player.vx + entityList.player.vy*entityList.player.vy)
    let E = mgh + ke
    console.log(E)
  }

  // entityList.player.updateFuncs.push(entityList.player.energy)





requestAnimationFrame(mainLoop)



/////// main game loop & drawing


setTimeout(()=>{
  frameFuncs.push((time,dt)=>{
  

  // dt = 16.6 // debugging

  can.clear()
  entityList.balls.forEach((e)=>{
    e.update(dt)
    e.draw()
  })
  entityList.walls.forEach((e)=>{
    e.draw()
  })

  drawShootAngle()

  })
},400) // wait for website to stabalize



function drawShootAngle(){
  if(controller.mouseIsDown){

    controller.dv = {x:controller.mouseDownPos.x-mouseX,y:controller.mouseDownPos.y-mouseY}

    can.ctx.strokeStyle = "yellow"
    can.ctx.beginPath()
    can.ctx.moveTo(entityList.player.x,entityList.player.y)
    can.ctx.lineTo(entityList.player.x+controller.dv.x*0.5,entityList.player.y+controller.dv.y*0.5)
    can.ctx.stroke()
  }
}




/// main game controls


document.addEventListener("mousedown",(e)=>{
  controller.mouseDownPos = {x:e.clientX,y:e.clientY}
  controller.mouseIsDown = true
})

document.addEventListener("mouseup",(e)=>{
  controller.mouseIsDown = false
  
  //last update for good measure
  controller.dv = {x:controller.mouseDownPos.x-mouseX,y:controller.mouseDownPos.y-mouseY}
  entityList.player.force(controller.dv.x,controller.dv.y,-0.001)
})














