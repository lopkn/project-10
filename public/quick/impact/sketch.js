
let Width = window.innerWidth
let Height = window.innerHeight

let WidthM = Width/2
let HeightM = Height/2

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
  if(x < 1){
    if(x < 0){return(Math.random()*x-x/2)}
    return(Math.random()<x)
  }
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
    this.canvas.zIndex = "1"
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
  let date = Date.now()
  frameFuncs.forEach((e)=>{
    e(time,dt,date)
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




can = new LCanvas()
can.clear()
can.fitScreenSize()
can.canvas.style.pointerEvents = "none"


let overlayCan = new LCanvas()
overlayCan.clear()
overlayCan.fitScreenSize()
overlayCan.canvas.style.pointerEvents = "none"
overlayCan.canvas.style.zIndex = 2




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

function line_to_line_collision_pt(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};



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
  constructor(x,y,r,ctx,AI=true){
    this.x = x
    this.y = y
    // this.ax = 0
    // this.ay = 0

    this.mass = 1

    this.team = "enemy"

    this.r = r/1.25
    this.vx = 0
    this.vy = 0

    this.color = "rgb(170,40,40)"
    this.ctx = ctx

    this.name = "dummy" 
    this.updateFuncs = []

    this.tags = new Set()
    
    this.hp = 100
    this.maxHp = 100
    this.hpRegen = 0.002
    this.damageMultiplier = 1

    this.lastCollideTime = 0
    this.collideTime = 0

    this.collisionInitiative = 1500

    this.wallBreakMultiplier = 0.1

    this.energy = 100
    this.maxEnergy = 100
    this.energyRegen = 0.01

    this.lastJumpTime = 0
    if(AI){
      this.AIinit()
    }


  }

  jump(vx,vy,mag){
    if(this.tags.has("isDead")){return}
    let actualForce = distance(vx,vy)*mag
    let spentEnergy = actualForce*30
    this.energy -= spentEnergy
    if(this.energy<0){

      let energyPenalty = (spentEnergy+this.energy)/spentEnergy
      mag*=energyPenalty
      this.energy = 0

    }

    this.force(vx,vy,mag)
    this.lastJumpTime = gameWorld.lastTime
  }

  force(x,y,mag){
    this.vx += x * mag
    this.vy += y * mag
  }

  speed(){
    return(distance(this.vx,this.vy))
  }

  damage(dmg){

    let lastCollideTime = gameWorld.lastTime==this.collideTime?this.lastCollideTime:this.collideTime

    let damagePercentage = Math.min((gameWorld.lastTime-lastCollideTime)/this.collisionInitiative,1)

    this.hp -= dmg * damagePercentage



    if(this.hp <= 0){
      this.die()
      return(true)
    }
    return(false)
  }

  die(){
    this.tags.add("isDead")
    this.tags.add("noCollideWall")
    this.tags.add("noCollideBall")
    this.deathTime = Date.now()
    this.color = "gray"
  }

  collided(time,by){
    if(time != this.collideTime){
      this.lastCollideTime = this.collideTime;
      this.collideTime = time
    }
  }

  AIupdate(dt){

    if(gameWorld.lastTime - this.AIlastUpdate < 1000){
      return;
    }



    this.AIlastUpdate = gameWorld.lastTime
    let player = entityList.player
    if(this.energy > 50 && gameWorld.lastTime - this.lastJumpTime > this.AInextUpdateTime){
      // jump towards player
      this.AInextUpdateTime = rand(1000)+1000

      let los = true;
      entityList.walls.forEach((w)=>{
        if(w.tags.has("AIdamage")){return}
        let not_blocked = line_to_line_collision_pt(this.x,this.y,player.x,player.y,w.x,w.y,w.x2,w.y2)
        if(not_blocked!==false){los=false}
      })

      if(los){
        this.jump(player.x-this.x,player.y-this.y-rand(200),0.003)
      }
    }
  }

  AIinit(){
    this.AIlastUpdate = 0
    this.AInextUpdateTime = 4000
    this.tags.add("AI")
  }


  update(dt){


    if(this.tags.has("AI") && !this.tags.has("isDead")){
      this.AIupdate(dt)
    }

    this.energy += this.energyRegen*dt
    if(this.energy > this.maxEnergy){
      this.energy = this.maxEnergy
    }

    //natural hp regen
    if(gameWorld.lastTime - this.collideTime > 2000){ // 2 seconds after battle      
      this.hp += this.hpRegen*dt
      if(this.hp > this.maxHp){
        this.hp = this.maxHp
    }
    }

    this.damageMultiplier += Math.min((1-this.damageMultiplier)*0.002,0.0001)*dt

    this.vy += gameWorld.gravity*dt

    // this.vx += this.ax*dt
    // this.vy += this.ay*dt


    let lastX = this.x
    let lastY = this.y
    
    this.x += this.vx*dt
    this.y += this.vy*dt

    let speed = this.speed()
    this.vx *= (1-gameWorld.airFriction*speed)**dt
    this.vy *= (1-gameWorld.airFriction*speed)**dt

    this.wallBreakMultiplier -= (this.wallBreakMultiplier-0.1)*0.0009*dt

    //check collisions
    if(!this.tags.has("noCollideWall")){

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


          let forceToWall = dot(this.vx,this.vy,normalizedDirectionToWall.x,normalizedDirectionToWall.y)
          let mult;
          if(this.tags.has("AI")){mult = w.tags.has("AIdamage")?3:0.2} else {mult = this.wallBreakMultiplier}
          let wallBroken = w.damage(forceToWall,mult, this, closest)

          if(wallBroken){this.vx*=0.7;this.vy*=0.5;return}

          let reflectionVector = normalizedDirectionToWall


          let reflection = reflect(this.vx,this.vy,reflectionVector.x,reflectionVector.y)
          this.vx = reflection.x * w.bounce
          this.vy = reflection.y * w.bounce



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
    }



    this.updateFuncs.forEach((f)=>{
      f(dt)
    })

  }
  draw(){
    this.ctx.lineWidth = 7
    this.ctx.strokeStyle = "rgb("+this.hp/this.maxHp*255+",20,40)"
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
    this.ctx.fill()
    if(this !== entityList.player){
      this.ctx.stroke()
    }

    //debug
    this.ctx.lineWidth = 1
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

    this.hp = 10 

    this.name = "default wall" 
    this.tags = new Set()

    this.normalized = {x:(y2-y1)/this.length,y:(x2-x1)/this.length}
    this.normal = Lrotate(this.normalized.x,this.normalized.y,Math.PI/2)
    this.midpoint = {x:(x1+x2)/2,y:(y1+y2)/2}

    this.hp = this.hp + this.hp*Math.abs(dot(this.normal.x,this.normal.y,1,0)) // floors should have more HP


    this.damageThreshold = 1

    this.bounce = 0.9

  }

  damage(d,mult,by,impactPt){

    if(this.tags.has("breakable")){mult=Math.max(1,mult)}
    d*=mult


    if(d < this.damageThreshold){return}
    this.hp -= d
    if(this.hp <= 0){
      this.break(by,impactPt)
      return(true)
    }
    return(false)
  }

  break(by,impactPt){
    this.tags.add("isBroken")
    let dx = this.x2 - this.x
    let dy = this.y2 - this.y
    let seg = 0
    let nextSeg = Math.random()*0.2

    while(nextSeg < 1){
      particles.push(new shatteredWallParticle(this,this.x+dx*seg,this.y+dy*seg,this.x+dx*nextSeg,this.y+dy*nextSeg,by.vx,by.vy,impactPt,nextSeg-seg))
      seg = nextSeg
      nextSeg = seg + Math.random()*0.2
    }
    particles.push(new shatteredWallParticle(this,this.x+dx*seg,this.y+dy*seg,this.x2,this.y2,by.vx,by.vy,impactPt,1-seg))

  }

  draw(){

    this.ctx.lineWidth = Math.max(this.hp**0.5,5)
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.lineTo(this.x2,this.y2)
    this.ctx.stroke()
  }
}

class particle{
  constructor(x,y,vx,vy,life=1000){

    this.z=1

    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.ay = gameWorld.gravity/2
    this.color = [140+rand(60),0,0]
    this.size = 5 + rand(10)
    this.life = life + rand()*life
    this.maxLife = this.life
    this.ctx = can.ctx
  }
  update(dt){
    this.vy += this.ay*dt

    this.vx *= 0.999**dt
    this.vy *= 0.999**dt

    this.x += this.vx*dt
    this.y += this.vy*dt
    this.life -= dt
    if(this.life <= 0){
      return("del")
    }
  }
  draw(){
    this.ctx.fillStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+(this.life/this.maxLife)+")"
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.size,0,Math.PI*2)
    this.ctx.fill()
  }
}


class sparkleParticle{
  constructor(x,y,life=1000){

    this.z = 2

    this.x = x
    this.y = y
    this.color = [255,255,255]
    this.size = 15
    this.life = life
    this.maxLife = this.life
    this.ctx = can.ctx
    this.rotation = 0
    this.rotSpeed = rand(-0.1)
  }
  update(dt){
    this.life -= dt
    this.size *= 1.002 ** dt
    if(this.life <= 0){
      return("del")
    }
  }
  draw(){
    this.ctx.fillStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+(this.life/this.maxLife)+")"
    this.ctx.beginPath()
    // 4 corner star

    let cornerSize = this.size/4

    //translate
    this.rotation += this.rotSpeed
    this.ctx.translate(this.x,this.y)

    this.ctx.rotate(this.rotation)

    this.ctx.moveTo(0,0-this.size)
    this.ctx.lineTo(0+cornerSize,0-cornerSize)
    this.ctx.lineTo(0+this.size,0)
    this.ctx.lineTo(0+cornerSize,0+cornerSize)
    this.ctx.lineTo(0,0+this.size)
    this.ctx.lineTo(0-cornerSize,0+cornerSize)
    this.ctx.lineTo(0-this.size,0)
    this.ctx.lineTo(0-cornerSize,0-cornerSize)
    this.ctx.fill()
    this.ctx.rotate(-this.rotation)
    this.ctx.translate(-this.x,-this.y)

  }
}


class shatteredWallParticle{
  constructor(wall,x1,y1,x2,y2,vx,vy,impactPt,lengthPers,life=4000){
    this.z = 1

    this.x = (x1+x2)/2
    this.y = (y1+y2)/2
    this.dx = (x2-this.x)
    this.dy = (y2-this.y)

    this.length = lengthPers*wall.length

    this.distToShatteringPt = Math.max(distance(this.x,this.y,impactPt.x,impactPt.y),20)

    this.vx = vx / this.distToShatteringPt * 20
    this.vy = vy / this.distToShatteringPt * 20

    this.color = wall.color
    this.lineWidth = 5

    this.ctx = can.ctx
    this.rotation = rand(-12.5/this.length)
    this.life = life
  }

  update(dt){
    this.vy += gameWorld.gravity*dt

    this.vx *= 0.999 ** dt
    this.vy *= 0.999 ** dt

    this.x += this.vx * dt
    this.y += this.vy * dt

    this.life -= dt

    //rotate
      let rotated = Lrotate(this.dx,this.dy,this.rotation)
      this.dx = rotated.x
      this.dy = rotated.y


    if(this.life <= 0){
      return("del")
    }
  }

  draw(){
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = this.color

    let mult = Math.min(1,this.life/1000)

    let dx = this.dx*mult
    let dy = this.dy*mult
    
    this.ctx.beginPath()
    this.ctx.moveTo(this.x-dx,this.y-dy)
    this.ctx.lineTo(this.x+dx,this.y+dy)
    this.ctx.stroke()
  }
}


class entityList{
  static balls = []
  static walls = []

}

class particles{
  static list = []
  static update(dt){
    for(let i = this.list.length-1; i >= 0; i--){
      let p = this.list[i]
      let res = p.update(dt)
      if(res == "del"){
        this.list.splice(i,1)
      }
    }
  }
  static draw(layer){
    this.list.forEach((p)=>{
      let l = p.z?p.z:1
      if(p.z!==layer){return}
      p.draw()
    })
  }

  static push(p){
    this.list.push(p)
  }
}

class gameWorld{
    static gravity = 0.001
    static airFriction = 0.0003
    static lastTime = 0

    static timeWarp = 1
}

class controller{
  static mouseDownPos = {x:0,y:0}
  static mouseIsDown = false

  static keys = {}

  static dv = {x:0,y:0}


}

class camera{
  static pos = {x:-WidthM,y:-HeightM}
}

function makeWooden(wall,mult=0.5){
  wall.color = "brown"
  wall.hp *= mult
  wall.tags.add("breakable")
  wall.tags.add("wooden")
  wall.damageThreshold *= 0.1
  return(wall)
}

function makeAIbreakable(wall){
  wall.tags.add("AIdamage")
  return(wall)
}


function allBallsCollide(time){


  for(let i = 0; i < entityList.balls.length; i++){
    for(let j = i+1; j < entityList.balls.length; j++){

        let a = entityList.balls[i]
        let b = entityList.balls[j]

        if(a.tags.has("noCollideBall") || b.tags.has("noCollideBall") || b.team==a.team){continue}

        // only do anything if the balls are moving towards each other

        let towards = dot(a.vx,a.vy,b.x-a.x,b.y-a.y) <= 0
        if(!towards){
          // return
        }


        if(check_collision_circles(a.x,a.y,a.r,b.x,b.y,b.r)){
          console.log("collision",a.name)


          let dist = distance(a.x,a.y,b.x,b.y)
          let contactPoint = {x:(a.x+b.x)/2,y:(a.y+b.y)/2}

          let normalizedVectorTo = {x:(b.x-a.x)/dist, y:(b.y-a.y)/dist}

          let dmgA = dot(a.vx,a.vy,normalizedVectorTo.x,normalizedVectorTo.y) * a.mass
          let dmgB = - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y) * b.mass

          dmgA = Math.max(dmgA*50,0) 
          dmgB = Math.max(dmgB*50,0) 

          if(dmgA>dmgB){
            dmgB*=0.5
          } else {
            dmgA*=0.5
          }
          dmgA *= a.damageMultiplier
          dmgB *= b.damageMultiplier


          console.log(dmgA,dmgB)
          let killed_b = 1+b.damage(dmgA)
          let killed_a = 1+a.damage(dmgB)

          //particles A
          let spread = -0.6
          let spread2 = -0.3
          let mult = 0.25
          for(let i = 0; i < dmgB*mult*killed_b; i++){
            let rnd = rand(1.1)
            setTimeout(()=>{
              particles.push(new particle(contactPoint.x,contactPoint.y,a.vx*rnd*(1+rand(spread))+rand(spread2),a.vy*rnd*(1+rand(spread))+rand(spread2)))
            },rand(100))
          }

          //particles B
          for(let i = 0; i < dmgA*mult*killed_a; i++){
            let rnd = rand(1.1)
            setTimeout(()=>{
              particles.push(new particle(contactPoint.x,contactPoint.y,b.vx*rnd*(1+rand(spread))+rand(spread2),b.vy*rnd*(1+rand(spread))+rand(spread2)))
            },rand(100))
          }

          let forceMultiplier = dot(a.vx,a.vy,normalizedVectorTo.x,normalizedVectorTo.y) - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)
          // let forceMultiplier2 = dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)
          
          let forceTo = {x:forceMultiplier * normalizedVectorTo.x,y:forceMultiplier * normalizedVectorTo.y}
          a.force(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier)
          // counterforce
          b.force(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier)




          //push balls out of each other (good enough for now, fix later, bleeding E)

          let overlap = a.r + b.r - dist
          if(overlap > 0){
            overlap += 0.001
            let pushX = normalizedVectorTo.x * overlap / 2
            let pushY = normalizedVectorTo.y * overlap / 2
            a.x -= pushX
            a.y -= pushY
            b.x += pushX
            b.y += pushY
          }

          a.collided(time,b)
          b.collided(time,a)

        }
      }
    }
}


/////// game setup


//initialize player

  entityList.player = new ball(-100,400,50,can.ctx,false)
  entityList.player.team = "player"
  entityList.player.mass = 1.5
  entityList.player.color = "rgb(40,170,60)"
  entityList.player.name = "player"
  entityList.player.hpRegen *= 2
  entityList.balls.push(entityList.player)
  entityList.player.tags.delete("AI")


  //initialize walls
  entityList.walls.push(new wall(-200,0,800,0,can.ctx))
  entityList.walls.push(new wall(-200,0,-200,600,can.ctx))
  let firstBreakableWall = new wall(800,0,800,600,can.ctx)
  entityList.walls.push(makeWooden(new wall(800,0,800,600,can.ctx)))

  entityList.walls.push(new wall(-200,600,800,600,can.ctx)) // floor
  // entityList.walls.push(new wall(110,500,110,1600,can.ctx)) // beam
  // entityList.walls.push(new wall(110,500,150,450,can.ctx)) // beam
  // entityList.walls.push(new wall(110,500,70,450,can.ctx)) // beam

  entityList.walls.push( makeAIbreakable(makeWooden(new wall(50,500,150,500,can.ctx),0.1)))
  entityList.walls.push( makeAIbreakable(makeWooden(new wall(100,600,100,500,can.ctx),0.1))) //table


  entityList.balls.push(new ball(380,450,50,can.ctx))


  /// initialize rest of level
  let x = 800, y = 600
  let vx = 1000; vy = 400
  for(let i = 0; i < 4; i++){
    vx += rand(-400)
    vy += rand(-400)
    entityList.walls.push(new wall(x,y,x+vx,y+vy,can.ctx))
    x+=vx
    y+=vy
  }

  generateLevels(x,y)



  //// Debugging

  entityList.player.calcEnergy = ()=>{
    let mgh = -gameWorld.gravity*entityList.player.y
    let ke = 0.5*(entityList.player.vx*entityList.player.vx + entityList.player.vy*entityList.player.vy)
    let E = mgh + ke
    console.log(E)
  }

  // entityList.player.updateFuncs.push(entityList.player.energy)





requestAnimationFrame(mainLoop)



/////// main game loop & drawing


setTimeout(()=>{
  frameFuncs.push((time,dt,date)=>{
  

  // dt = 16.6 // debugging
    dt = Math.min(100,dt)

  //move camera

  can.clear()
  camera.pos.x += (entityList.player.x-WidthM-camera.pos.x)*0.03
  camera.pos.y += (entityList.player.y-HeightM-camera.pos.y)*0.03
  can.ctx.translate(-camera.pos.x,-camera.pos.y)


  particles.update(dt)
  particles.draw(1)

  for(let i = entityList.balls.length-1; i>-1; i--){
    let e = entityList.balls[i]
    if(e.tags.has("isDead") && date-e.deathTime > 5000){
      entityList.balls.splice(i,1)
      continue;
    }

    e.update(dt*gameWorld.timeWarp)
    e.draw()
  }

  allBallsCollide(time)


  for(let i = entityList.walls.length-1; i>-1; i--){
    let e = entityList.walls[i]
    if(e.tags.has("isBroken")){
      entityList.walls.splice(i,1)
      continue;
    }
    e.draw()
  }
  particles.draw(2)



  drawShootAngle(date)

  controlBall()

  gameWorld.timeWarp += (1-gameWorld.timeWarp)*0.1
  if(controller.mouseIsDown){gameWorld.timeWarp*=0.90}


  can.ctx.translate(camera.pos.x,camera.pos.y)
  drawPlayerGUI()


  })
},400) // wait for website to stabalize



function drawShootAngle(date){
  if(controller.mouseIsDown){

    controller.dv = {x:controller.mouseDownPos.x-mouseX,y:controller.mouseDownPos.y-mouseY}

    can.ctx.lineWidth = 1
    can.ctx.strokeStyle = "yellow"
    can.ctx.beginPath()
    can.ctx.moveTo(entityList.player.x,entityList.player.y)
    can.ctx.lineTo(entityList.player.x-controller.dv.x*0.5,entityList.player.y-controller.dv.y*0.5)
    can.ctx.stroke()

    if(!controller.mouseDownPos.charged && date-controller.mouseDownPos.time>700){
      controller.mouseDownPos.charged = true
      console.log("charged")
      particles.push(new sparkleParticle(entityList.player.x,entityList.player.y))
      entityList.player.damageMultiplier = 2
    }

  }
}

function drawPlayerGUI(){
  // health and energy bars on top left of screen
  let barWidth = 200
  let barHeight = 20
  let padding = 10

  // health bar
  can.ctx.fillStyle = "red"
  can.ctx.fillRect(0, padding, barWidth, barHeight)
  can.ctx.fillStyle = "rgb(40,170,60)"
  can.ctx.fillRect(0, padding, barWidth*(entityList.player.hp/entityList.player.maxHp), barHeight)

  // energy bar
  can.ctx.fillStyle = "gray"
  can.ctx.fillRect(0, padding+padding+barHeight, barWidth, barHeight)
  can.ctx.fillStyle = "rgb(40,170,250)"
  can.ctx.fillRect(0, padding+padding+barHeight, barWidth*(entityList.player.energy/entityList.player.maxEnergy), barHeight)
}






//// level generator


function segWalls(x1,y1,x2,y2,div){
  let dx = (x2-x1)/div
  let dy = (y2-y1)/div
  for(let i = 0; i < div; i++){
    entityList.walls.push(new wall(x1+i*dx,y1+i*dy,x1+i*dx+dx,y1+i*dy+dy,can.ctx))
  }
}


function generateLevels(x,y){
  // entityList.walls.push(new wall(x,y,x+vx,y+vy,can.ctx))
  // entityList.walls.push( makeAIbreakable(makeWooden(new wall(50,500,150,500,can.ctx),0.1)))

  let floorLength = 800+rand(1800)
  let heightDiff = floorLength * (0.6+rand(5))
  let height = y-heightDiff

  let heightDiv = Math.floor(heightDiff/300)

  let wallX = {"a":x+floorLength*(0.2+rand(-0.1)),"b":x+floorLength*(0.7+rand(-0.2))}

  entityList.walls.push(new wall(x,y,x+floorLength,y,can.ctx))
  let doorHeight = y-150-rand(50)
  entityList.walls.push(makeWooden(new wall(wallX.a,y,wallX.a,doorHeight,can.ctx),0.2))
  segWalls(wallX.a,doorHeight,wallX.a,height,heightDiv)
  segWalls(wallX.b,y,wallX.b,height,heightDiv)
  entityList.walls.push(new wall(wallX.a,height,wallX.b,height,can.ctx)) // roof


  let floor = doorHeight - rand(150)
  let floorWidth = wallX.b-wallX.a
  while(floor > height){

    let floorX = 40+rand(floorWidth-180)
    let start = wallX.a
    if(Math.random()>0.5){floorX*=-1;start=wallX.b} //left or right
    entityList.walls.push(new wall(start,floor,start+floorX,floor,can.ctx))
    if(Math.random()>0.5){ // spawn rate
      entityList.balls.push(new ball(start+floorX*0.5,floor-60,50,can.ctx))
    }


    floor -= 130+rand(200)
  }


}

















/// main game controls


function controlBall(){
  let movement = 0.005
  let player = entityList.player
  if(controller.keys.w){player.vy -= 0.005}
  if(controller.keys.s){player.vy += 0.005}
  if(controller.keys.a){player.vx -= 0.005}
  if(controller.keys.d){player.vx += 0.005}
}

document.addEventListener("mousedown",(e)=>{
  controller.mouseDownPos = {x:e.clientX,y:e.clientY,time:Date.now()}
  controller.mouseIsDown = true
})

document.addEventListener("mouseup",(e)=>{
  controller.mouseIsDown = false
  
  //last update for good measure
  controller.dv = {x:controller.mouseDownPos.x-mouseX,y:controller.mouseDownPos.y-mouseY}

  entityList.player.jump(controller.dv.x,controller.dv.y,0.001)
  if(controller.mouseDownPos.charged){
    entityList.player.wallBreakMultiplier += 4    
  }
  gameWorld.timeWarp += (1-gameWorld.timeWarp)*0.5
})





document.addEventListener("keydown",(e)=>{
  controller.keys[e.key.toLowerCase()]=true
})


document.addEventListener("keyup",(e)=>{
  controller.keys[e.key.toLowerCase()]=false
})








