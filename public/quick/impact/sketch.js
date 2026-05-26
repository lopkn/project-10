
let debug = 0;
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

    this.canvas.classList.add("mobile")

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
  if(dt < 15*test.slower){requestAnimationFrame(mainLoop);return}
  gameWorld.lastTime = time
  gameWorld.frame += 1
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
overlayCan.canvas.classList.add("mobile")

let underCan = new LCanvas()
underCan.clear()
underCan.fitScreenSize()
underCan.canvas.style.pointerEvents = "none"
underCan.canvas.style.zIndex = -1


////////// game engine functions

function dot(x1,y1,x2,y2){
  return(x1*x2+y1*y2)
}

function normalize(x,y){
  let len = Math.sqrt(x*x+y*y)
  return {x: x/len, y: y/len}
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

function point_on_infinite_line(x, y, x1, y1, x2, y2) {
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
    // Find the closest point

    return({x: x1 + t * abx, y: y1 + t * aby})

}

function point_to_line_distance(x, y, x1, y1, x2, y2) {
    const closest = point_on_line(x, y, x1, y1, x2, y2);
    const distX = x - closest.x;
    const distY = y - closest.y;
    return Math.sqrt(distX * distX + distY * distY);
}

function point_to_infinite_line_distance(x, y, x1, y1, x2, y2) {
    const closest = point_on_infinite_line(x, y, x1, y1, x2, y2);
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
    if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)){
      return({x: a + lambda * (c - a), y: b + lambda * (d - b)});
    };
  }
  return false
};

function swept_ball_to_line_collision(bx1, by1, vx, vy, r, x1, y1, x2, y2) { // assume dt = 1
    // We can treat the ball's movement as a capsule from (x, y) to (x + vx, y + vy) with radius r
    // Check if this capsule intersects the line segment from (x1, y1) to (x2, y2)
    // 1. Check if the line segment intersects the capsule's central line (ignoring radius)
    let bx2 = bx1 + vx;
    let by2 = by1 + vy;
  
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = distance(dx,dy); 
  
    let speed = distance(vx,vy)
    let nvx = vx / speed
    let nvy = vy / speed

    let n = { x: -dy / len, y: dx / len };

    let collision = false
  
    let temp1 = line_to_line_collision_pt(bx1, by1, bx2, by2, x1, y1, x2, y2)
    if (temp1) {
      let res = temp1
      let d = Math.abs(dot(n.x,n.y,nvx,nvy))
      let p = {x:res.x-r/d*nvx,y:res.y-r/d*nvy}
      // collision = {p:p,res:res,dist:distance(res.x,res.y,bx1,by1),type:1} // wrong!
      collision = {p:p,closest:point_on_line(p.x,p.y,x1,y1,x2,y2),dist:distance(res.x,res.y,bx1,by1),type:1}
    }


    // 3. Check if distance from endpoints of line segment to the capsule's path is less than r (for cases where line is short and ball passes over it)
    if (point_to_line_distance(x1, y1, bx1, by1, bx2, by2) <= r && dot(vx,vy,bx1-x1,by1-y1) < 0) {


      let d = point_to_infinite_line_distance(x1, y1, bx1, by1, bx2, by2)
      let pol = point_on_infinite_line(x1, y1, bx1, by1, bx2, by2)
      let res = {x:x1, y:y1}
      d=Math.sqrt(r*r-d*d)
      let p = {x:pol.x-nvx*d,y:pol.y-nvy*d}
      let dist = distance(res.x,res.y,bx1,by1)
      if(!collision || dist <= collision.dist){
        collision = {p:p,closest:res,dist:dist,type:4}
      }
    }
    if (point_to_line_distance(x2, y2, bx1, by1, bx2, by2) <= r && dot(vx,vy,bx1-x1,by1-y1) < 0) {
      let d = point_to_infinite_line_distance(x2, y2, bx1, by1, bx2, by2)
      let pol = point_on_infinite_line(x2, y2, bx1, by1, bx2, by2)
      let res = {x:x2, y:y2}
      d=Math.sqrt(r*r-d*d)
      let p = {x:pol.x-nvx*d,y:pol.y-nvy*d}
      let dist = distance(res.x,res.y,bx1,by1)
      if(test.expect(distance(p.x,p.y,res.x,res.y),r)){debugger} // energen
      if(!collision || dist <= collision.dist){
        collision = {p:p,closest:res,dist:dist,type:5} // p = the pos of ball when collide, closest = the point of collision
      }
    }

    



        // 2. Check if the distance from the line segment to either endpoint of the capsule is less than r
    // if (point_to_line_distance(bx1, by1, x1, y1, x2, y2) <= r) {
    //   // the start of the capsule collided
    //   return(2);
    // } // dont need this yet
    if (point_to_line_distance(bx2, by2, x1, y1, x2, y2) <= r) {
      let pol = point_on_line(bx2, by2, x1, y1, x2, y2)
      let p = {x:bx2,y:by2}
      let dist = distance(bx1,by1,pol.x,pol.y)
      if(!collision || dist <= collision.dist){
        collision = {p:p,closest:pol,dist:dist,passDist:distance(bx2,by2,pol.x,pol.y),type:3}
      }
    } 

    return(collision)

}


function find_parabola(A, B, C, D, E,d) {
  // Rename parameters internally to match your loop variables:
  // A = initial x, B = initial y, C = vx, D = vy, E = gravity
  const dt = d; 

  // Guard against division by zero if vx is 0 (vertical drop)
  if (C === 0) {
    return function(x) {
      return NaN; // Or handle purely vertical fallback logic if needed
    };
  }

  // Pre-calculate the quadratic coefficients: y = ax^2 + bx + c
  const a = E / (2 * (C ** 2));
  const b = (D / C) + ((E * dt) / (2 * C)) - ((E * A) / (C ** 2));
  const c = B - ((D * A) / C) - ((E * A * dt) / (2 * C)) + ((E * (A ** 2)) / (2 * (C ** 2)));

  // Return the evaluation function
  return [a,b,c]
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


class id{
  static count=0;
  static gen(){return(this.count++)}
}





class grid{ //Spatial Hash Grid
  static size = 2400
  static grid = {}

  static findCell(x,y){
    return([Math.floor(x/this.size),Math.floor(y/this.size)])
  }

  static mapIntToNat(n) {
    return n >= 0 ? 2 * n : -2 * n - 1;
  }

  static keyify(x,y){
    x = this.mapIntToNat(x)
    y = this.mapIntToNat(y)
    return(((x + y) * (x + y + 1)) / 2 + y)
  }


  static traceLineCells(startX, startY, endX, endY) { // might phase! does not have leeway
    let cellSize = this.size
    // 1. Find the starting cell coordinates
    let cx = Math.floor(startX / cellSize);
    let cy = Math.floor(startY / cellSize);

    // Find the end cell coordinates so we know when to stop
    const endCx = Math.floor(endX / cellSize);
    const endCy = Math.floor(endY / cellSize);

    const dx = endX - startX;
    const dy = endY - startY;

    // 2. Determine step direction (+1 or -1 cell)
    const stepX = dx >= 0 ? 1 : -1;
    const stepY = dy >= 0 ? 1 : -1;

    // 3. Calculate distance to the next cell boundary in world units
    const nextBoundaryX = (stepX > 0 ? cx + 1 : cx) * cellSize;
    const nextBoundaryY = (stepY > 0 ? cy + 1 : cy) * cellSize;

    // How far along the line (t parameter from 0 to 1) to hit the next X or Y boundary
    let tMaxX = dx !== 0 ? (nextBoundaryX - startX) / dx : Infinity;
    let tMaxY = dy !== 0 ? (nextBoundaryY - startY) / dy : Infinity;

    // How far along the line we travel to cross an entire cell width/height
    const tDeltaX = dx !== 0 ? Math.abs(cellSize / dx) : Infinity;
    const tDeltaY = dy !== 0 ? Math.abs(cellSize / dy) : Infinity;

    const cells = [];

    // 4. Trace the grid
    while (true) {
        cells.push(this.keyify(cx,cy));

        if (cx === endCx && cy === endCy) break;

        // Move to the next closest cell boundary
        if (tMaxX < tMaxY) {
            tMaxX += tDeltaX;
            cx += stepX;
        } else {
            tMaxY += tDeltaY;
            cy += stepY;
        }
    }

    return cells;
}

  static query(x1,y1,x2,y2){ //directionall!!!
    let cell1 = grid.findCell(x1,y1)
    let cell2 = grid.findCell(x2,y2)
    // let results = []
    let items = new Set()
    for(let i = cell1[0]; i <= cell2[0]; i++){
      for(let j = cell1[1]; j <= cell2[1]; j++){
        let key = grid.keyify(i,j)
        if(this.grid[key]){
          // results.push(this.grid[key])
          items = items.union(this.grid[key])
        }
      }
    }

    // return({array:results,items:items})
    return(items)
  }

  static add(x1,y1,x2,y2,entity){
    let cell1 = grid.findCell(x1,y1)
    let cell2 = grid.findCell(x2,y2)
    let results = []
    let items = new Set()
    for(let i = cell1[0]; i <= cell2[0]; i++){
      for(let j = cell1[1]; j <= cell2[1]; j++){
        let key = grid.keyify(i,j)
        if(this.grid[key]===undefined){
          this.grid[key] = new Set()
        }
        this.grid[key].add(entity)
        results.push(this.grid[key])
      }
    }
    return(results)

    // let arr = this.traceLineCells(x1,y1,x2,y2)
    // for(let i = 0; i < arr.length; i++){
    //   let key = arr[i]
    //   if(this.grid[key]===undefined){
    //     this.grid[key] = new Set()
    //   }
    //   this.grid[key].add(entity)
    // }

    // return(arr)
  }

  static addWall(wall){
    let x1 = Math.min(wall.x,wall.x2)
    let y1 = Math.min(wall.y,wall.y2)
    let x2 = Math.max(wall.x,wall.x2)
    let y2 = Math.max(wall.y,wall.y2)
    return(this.add(x1,y1,x2,y2,wall))
  }


  static draw(){
    let k = 0
    for(let i = -10; i < 10; i++){
      for(let j = -10; j < 11; j++){
        k++
        can.ctx.fillStyle = "rgb("+(k%2)*125+",0,0)"
        can.ctx.fillRect(i*this.size,j*this.size,this.size,this.size)
      }
    }
  }

  static dbg(){
    let arr = []
    for(let i = -10; i < 10; i++){
      for(let j = -10; j < 11; j++){
        arr.push(this.keyify(i,j))
      }
    }
    return(arr)
  } 


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
    this.push = {x:0,y:0}

    this.color = [0,62,41] // 0 62 41
    this.ctx = ctx

    this.name = "dummy" 
    this.updateFuncs = []
    this.drawFuncs = []
    this.onDeath = []

    this.tags = new Set()
    this.id = id.gen()
    this.hp = 100
    this.maxHp = 100
    this.hpRegen = 0.002
    this.damageMultiplier = 1
    this.maxTakenDamagePercentage = 1

    this.lastCollideTime = 0
    this.collideTime = 0
    this.damageTime = 0

    this.collisionInitiative = 1500

    this.wallBreakMultiplier = 0.1

    this.energy = 100
    this.maxEnergy = 100
    this.maxEnergySpend = 40
    this.energyRegen = 0.01

    this.wallJumpEnergy = 1

    this.lastJumpTime = 0
    this.lastCollideWallTime = 0
    if(AI){
      this.AIinit()
    }

    this.sidedWallEntryFrame = {}

    this.movementSpeed = 0.005



  }

  jump(vx,vy,mag){
    if(this.tags.has("isDead")){return}
    let actualForce = distance(vx,vy)*mag
    let spentEnergy = actualForce*30

    if(spentEnergy>this.maxEnergySpend){
      mag *= this.maxEnergySpend/spentEnergy
      spentEnergy = this.maxEnergySpend
    }

    this.energy -= spentEnergy
    if(this.energy<0){

      let energyPenalty = (spentEnergy+this.energy)/spentEnergy
      mag*=energyPenalty
      spentEnergy += this.energy
      this.energy = 0

    }

    this.force(vx,vy,mag)
    this.lastJumpTime = gameWorld.lastTime

    this.onJump?this.onJump(this,spentEnergy):0

  }

  force(x,y,mag){
    this.vx += x * mag
    this.vy += y * mag
  }
  forceM(x,y,mag){
    mag /= this.mass
    this.vx += x * mag
    this.vy += y * mag
  }

  speed(){
    return(distance(this.vx,this.vy))
  }
  speedSq(){
    return(this.vx*this.vx+this.vy*this.vy)
  }


  damage(dmg){

    let lastCollideTime = gameWorld.lastTime==this.collideTime?this.lastCollideTime:this.collideTime

    let damagePercentage = Math.min((gameWorld.lastTime-lastCollideTime)/this.collisionInitiative,1)

    dmg *= damagePercentage
    dmg = Math.min(dmg*damagePercentage,this.maxHp*this.maxTakenDamagePercentage)

    this.hp -= dmg 
    this.damageTime = gameWorld.lastTime


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
    this.vx *= 0.7
    this.vy *= 0.7
    this.deathTime = Date.now()
    this.onDeath.forEach((f)=>{
      f()
    })
  }

  collided(time,by){
    if(time != this.collideTime){
      this.lastCollideTime = this.collideTime;
      this.collideTime = time
    }
  }


  movement(){
    if(!this.tags.has("moves") || this.tags.has("isDead")){return}

    let ml = distance(this.movementVector.x,this.movementVector.y)
    if(ml===0){return}
    this.vx += this.movementVector.x/ml*this.movementSpeed*this.movementScalar
    this.vy += this.movementVector.y/ml*this.movementSpeed*this.movementScalar
  }


  AIupdate(dt){

    if(gameWorld.lastTime - this.AIlastUpdate < this.AInextUpdateTime){
      return;
    }
    this.AIlastUpdate = gameWorld.lastTime

    if(this.AICustomUpdate){
      this.AICustomUpdate(this,dt)
      return
    }

    /// default behaviour
    let player = entityList.player
    if(this.energy > 40 ){
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
    this.AInextUpdateTime = 4000 + rand(1000)
    this.tags.add("AI")
  }


  update(dt){


    if(this.tags.has("AI") && !this.tags.has("isDead")){
      this.AIupdate(dt)
    }



    //natural hp regen
    if(gameWorld.lastTime - this.damageTime > 2000){ // 2 seconds after battle      
      this.hp += this.hpRegen*dt
      if(gameWorld.lastTime - this.damageTime > 10000 || this.speedSq() < 0.02){
        this.hp += this.hpRegen*dt*3
      }
      if(this.hp > this.maxHp){
        this.hp = this.maxHp
      } 
    }

    this.damageMultiplier += Math.min((1-this.damageMultiplier)*0.002,0.0001)*dt

    this.vy += gameWorld.gravity*dt

    // this.vx += this.ax*dt
    // this.vy += this.ay*dt


    this.movement()

    let lastX = this.x
    let lastY = this.y
    
    this.x += this.vx*dt + this.push.x
    this.y += this.vy*dt + this.push.y
    if(distance(this.push.x,this.push.y)>this.r){
      console.log("what?")
    }
    this.push = {x:0,y:0}

    let speed = this.speed()
    let dleng = distance(lastX,lastY,this.x,this.y)

    let sweptWallHit = false

    if(dleng > this.r/2 && !this.tags.has("noCollideWall") ){
      let pseudovx = this.x-lastX
      let pseudovy = this.y-lastY
      if(debug){
        particles.push(new lineParticle(this.x,this.y,lastX,lastY))
      }
      let collisionData = {"collided":false,"minDist":Infinity}
      entityList.walls.forEach((w)=>{


        let awaySide = dot(pseudovx,pseudovy,w.normal.x,w.normal.y) < 0

        let sweep = swept_ball_to_line_collision(lastX,lastY,pseudovx,pseudovy,this.r, w.x,w.y,w.x2,w.y2)
        if(sweep){
        if(w.tags.has("sided") && (awaySide || this.sidedWallEntryFrame[w.id] === gameWorld.frame-1 )){return} // comment out to test
          if(sweep.dist < collisionData.minDist){
            collisionData.collided = w
            collisionData.minDist = sweep.dist
            collisionData.closest = sweep.closest
            collisionData.awaySide = awaySide
            collisionData.p = sweep.p
            collisionData.sweepType = sweep.type
            collisionData.sweepResponse = sweep

            if(sweep.type!==3&&Math.abs(distance(collisionData.closest.x,collisionData.closest.y,sweep.p.x,sweep.p.y)-this.r)>0.1){console.log("energen "+sweep.type)}
          }
        }
      })
      if(collisionData.collided){
        if(debug){console.log('too fast wall collision '+collisionData.sweepType)}
        collisionData.sweepDist = collisionData.minDist
        collisionData.minDist = collisionData.sweepType===3?collisionData.sweepResponse.passDist:this.r
        wall_collision_handler(this,collisionData,dt,collisionData.sweepType==3?"swept normal":"swept")
        sweptWallHit = collisionData.collided
      }
    } /// BALL MOVING TOO FAST!!!!!! FIX

    this.vx *= (1-gameWorld.airFriction*speed)**dt
    this.vy *= (1-gameWorld.airFriction*speed)**dt

    this.wallBreakMultiplier -= (this.wallBreakMultiplier-0.1)*0.0009*dt

    //check wall collisions collide wall
    if(!this.tags.has("noCollideWall")){

      let collisionData = {"collided":false,"minDist":Infinity}

      entityList.walls.forEach((w)=>{

        if(w === sweptWallHit){return}

        let awaySide = dot(this.vx,this.vy,w.normal.x,w.normal.y) < 0

        if(check_collision_ball_line(this.x,this.y,this.r,w.x,w.y,w.x2,w.y2)){
        if(w.tags.has("sided") && (awaySide || this.sidedWallEntryFrame[w.id] === gameWorld.frame-1 )){this.sidedWallEntryFrame[w.id] = gameWorld.frame;return}


          let closest = point_on_line(this.x,this.y,w.x,w.y,w.x2,w.y2)
          let dist = distance(this.x,this.y,closest.x,closest.y)
          if(dist<collisionData.minDist){
            collisionData.collided = w
            collisionData.minDist = dist
            collisionData.closest=closest
            collisionData.awaySide=awaySide
          } else {return}


        }
      })


      // after finding the wall that collides

      if(collisionData.collided){
        collisionData.p = {x:this.x,y:this.y}
        wall_collision_handler(this,collisionData,dt)
      }

    }

    if(this.lastJumpTime < this.lastCollideWallTime){
      this.energy += this.energyRegen*dt
    }
    if(this.energy > this.maxEnergy){
      this.energy = this.maxEnergy
    }

    this.updateFuncs.forEach((f)=>{
      f(dt)
    })

  }
  draw(){
    this.ctx.lineWidth = 7
    this.ctx.strokeStyle = "rgb("+this.hp/this.maxHp*255+",20,40)"
    let hpPers = Math.min(Math.max(this.hp/this.maxHp,0),1.4)
    let l = (50+(this.color[2]-50)*hpPers)
    let s = this.color[1]*(hpPers*0.7+0.3)
    if(this.tags.has("isDead")){l*=0.5; s=0}
    this.ctx.fillStyle = "hsl("+this.color[0]+ "," + s + "%," + l + "%)"
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
    this.ctx.fill()
    if(this !== entityList.player){
      this.ctx.stroke()
    }

    this.drawFuncs.forEach((e)=>{
      e(this,s,l)
    })

    //debug
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.lineTo(this.x+this.vx*50,this.y+this.vy*50)
    this.ctx.stroke()
  }
}

//@wall

class wall{
  constructor(x1,y1,x2,y2,ctx){
    this.x = x1
    this.y = y1
    this.x2 = x2
    this.y2 = y2
    this.color = "white"
    this.ctx = ctx
    this.length = distance(x1,y1,x2,y2)

    this.gridPos = grid.addWall(this)

    this.id = id.gen()

    this.hp = 10 

    this.name = "default wall" 
    this.tags = new Set()

    this.normal = {x:-(y2-y1)/this.length,y:(x2-x1)/this.length}
    this.normalized = {y:(y2-y1)/this.length,x:(x2-x1)/this.length}
    this.midpoint = {x:(x1+x2)/2,y:(y1+y2)/2}

    this.hp = this.hp + this.hp*Math.abs(dot(this.normalized.x,this.normalized.y,1,0)) // floors should have more HP


    this.damageThreshold = 1

    this.bounce = 0.8
    this.friction = 1


    this.events = {
      "onBreak":[],
      "onCollide":[],
    }
  }

  damage(d,mult,by,impactPt){

    this.events.onCollide.forEach((e)=>{
      e(this,d,mult,by,impactPt)
    })

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
    if(this.tags.has("isBroken")){return}
    this.tags.add("isBroken")
    let dx = this.x2 - this.x
    let dy = this.y2 - this.y
    let seg = 0
    let nextSeg = Math.random()*0.2

    this.events.onBreak.forEach((e)=>{
      e(this,by,impactPt)
    })

    while(nextSeg < 1){
      particles.push(new shatteredWallParticle(this,this.x+dx*seg,this.y+dy*seg,this.x+dx*nextSeg,this.y+dy*nextSeg,by.vx,by.vy,impactPt,nextSeg-seg))
      seg = nextSeg
      nextSeg = seg + Math.random()*0.2
    }
    particles.push(new shatteredWallParticle(this,this.x+dx*seg,this.y+dy*seg,this.x2,this.y2,by.vx,by.vy,impactPt,1-seg))

    //remove from grid
    this.gridPos.forEach((cell)=>{
      cell.delete(this)
    })

  }

  draw(){

    this.ctx.lineWidth = this.size?this.size:Math.min(Math.max(this.hp**0.5,5),10)
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.lineTo(this.x2,this.y2)
    this.ctx.stroke()

    if(this.tags.has("sided")){
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.moveTo(this.midpoint.x,this.midpoint.y)
      this.ctx.lineTo(this.midpoint.x+this.normal.x*10,this.midpoint.y+this.normal.y*10)
      this.ctx.stroke()
    }

  }
}

function wall_collision_handler(ball,collisionData,dt,type="normal"){

  ball.energy += 5
  let awaySide = collisionData.awaySide // not used
  let closest = collisionData.closest // the point of the wall that was hit
  let dist = collisionData.minDist // the distance from the ball to the point of the wall that was hit
  let w = collisionData.collided // the wall collided on
  let p = collisionData.p // the position of the ball when it hit the wall

  let old = {vx:ball.vx,vy:ball.vy} // not needed, debug only.

    let fellback = false

    let normalizedDirectionToWall;
    if(dist!==0){
      normalizedDirectionToWall = {x:(closest.x-p.x)/dist,y:(closest.y-p.y)/dist} // the normalized vector from the wall to the ball's position when colliding
    } else {
      // fallback to last position if ball center is exactly on the wall, not perfect but should work in most cases and prevents NaN errors
      fellback = true;
      console.log("fellback")
      dist = distance(ball.lastX,ball.lastY,closest.x,closest.y)
      normalizedDirectionToWall = {x:(closest.x-ball.lastX)/dist,y:(closest.y-ball.lastY)/dist}
    }


    // let forceToWall = dot(ball.vx,ball.vy,normalizedDirectionToWall.x,normalizedDirectionToWall.y)
    let forceToWall = Math.abs(dot(ball.vx,ball.vy,w.normal.x,w.normal.y))
    let mult;
    if(ball.tags.has("AI")){mult = w.tags.has("AIdamage")?3:0.2} else {mult = ball.wallBreakMultiplier}
    let wallBroken = w.damage(forceToWall,mult, ball, closest)

    if(wallBroken){ball.vx*=0.7;ball.vy*=0.5;return}

    let reflectionVector = normalizedDirectionToWall

    let reflection = reflect(ball.vx,ball.vy,reflectionVector.x,reflectionVector.y)
    // ball.vx = reflection.x * w.bounce
    // ball.vy = reflection.y * w.bounce

    let refBounce = dot(reflection.x,reflection.y,w.normal.x,w.normal.y) * w.bounce
    let refFriction = dot(reflection.x,reflection.y,w.normalized.x,w.normalized.y) * w.friction

    ball.vx = refBounce * w.normal.x + refFriction * w.normalized.x
    ball.vy = refBounce * w.normal.y + refFriction * w.normalized.y



    //push ball out of wall (good enough for now, fix later, bleeding E)

    if(type === "swept" && collisionData.sweepResponse.type===1){
      ball.x = collisionData.p.x
      ball.y = collisionData.p.y
      console.log(ball.speed())

    } else { // normal
      let overlap = ball.r - dist
      if(overlap > 0){
        let pushX = -normalizedDirectionToWall.x * overlap
        let pushY = -normalizedDirectionToWall.y * overlap
        ball.x += pushX
        ball.y += pushY
      }
    }
    if(debug){
        let lp = new lineParticle(ball.x,ball.y,ball.x+ball.vx*200,ball.y+ball.vy*200)
        lp.color = [255,0,255]
        particles.push(lp)
        crossParticle(p.x,p.y)
        crossParticle(closest.x,closest.y,[255,255,0])

        lp = new lineParticle(p.x,p.y,p.x-reflectionVector.x*200,p.y-reflectionVector.y*200)
        lp.color = [255,255,0]
        particles.push(lp)

        lp = new lineParticle(p.x,p.y,p.x-old.vx*200,p.y-old.vy*200)
        lp.color = [0,255,0]
        particles.push(lp)
        if(test.expect(distance(reflectionVector.x,reflectionVector.y),1)){debugger}
      }

    ball.lastCollideWallTime = gameWorld.lastTime

}


class particle{
  constructor(x,y,vx,vy,life=1000){

    this.z=1

    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.ay = gameWorld.gravity/2
    this.color = [100+rand(120),0,0]
    this.size = 5 + rand(10)
    this.life = life + rand()*life
    this.maxLife = this.life
    this.ctx = underCan.ctx

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
    if(!this.noFill){
      this.ctx.fill()
    } else{
      this.ctx.strokeStyle = this.ctx.fillStyle
      this.ctx.lineWidth = 3
      this.ctx.stroke()
    }
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

    this.vx *= (1-0.006/this.length) ** dt
    this.vy *= (1-0.006/this.length) ** dt

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

class lineParticle{
  constructor(x,y,x2,y2,life=1000){
    this.z = 2

    this.x = x
    this.y = y
    this.x2 = x2
    this.y2 = y2

    this.color = [255,255,255]
    this.lineWidth = 3

    this.ctx = can.ctx
    this.life = life
    this.maxLife = life
  }
  update(dt){
    this.life -= dt
    if(this.life <= 0){
      return("del")
    }
  }
  draw(){
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+(this.life/this.maxLife)+")"
    this.ctx.beginPath()
    this.ctx.moveTo(this.x,this.y)
    this.ctx.lineTo(this.x2,this.y2)
    this.ctx.stroke()
  }
}

function crossParticle(x,y,color = [255,0,0]){
  let size = 15
  let lp1 = new lineParticle(x+25,y+25,x-25,y-25)
  let lp2 = new lineParticle(x+25,y-25,x-25,y+25)
  lp1.color = lp2.color = color
  particles.push(lp1)
  particles.push(lp2)
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
    static frame = 0
}

class controller{
  static mouseDownPos = {x:0,y:0}
  static mouseIsDown = false

  static keys = {}

  static dv = {x:0,y:0}

  static activeTouches = {}
  static movement = {down:false}

  static updateJump(x,y){
    controller.dv = {x:(controller.mouseDownPos.x-x)*(settings.dragSensitivity+settings.mobileSensMultiplier*settings.mobile)/settings.relativeSize,y:(controller.mouseDownPos.y-y)*(settings.dragSensitivity+settings.mobileSensMultiplier*settings.mobile)/settings.relativeSize}
  }

  static endJump(x,y){
    controller.dv = {x:(controller.mouseDownPos.x-x)*(settings.dragSensitivity+settings.mobileSensMultiplier*settings.mobile)/settings.relativeSize,y:(controller.mouseDownPos.y-y)*(settings.dragSensitivity+settings.mobileSensMultiplier*settings.mobile)/settings.relativeSize}
    entityList.player.jump(this.dv.x,this.dv.y,0.001)
    if(this.mouseDownPos.charged){
      entityList.player.wallBreakMultiplier += 4    
    }
    gameWorld.timeWarp += (1-gameWorld.timeWarp)*0.5
    this.mouseIsDown = false
  }

}

class camera{
  static scale = 1
  static pos = {x:-WidthM,y:-HeightM}

}

class settings{
  static speedZoom = 5 // works anywhere from 2 (insane) to 12 (mild)
  static mobile = 0
  static relativeSize = (Height+Width)/3723
  static dragSensitivity = 1.5
  static mobileSensMultiplier = 1.333
  static offline = true
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


function allBallsCollide(time,i){


  // for(let i = entityList.balls.length-1; i > -1 ; i--){
    for(let j = i-1; j > -1; j--){

        let a = entityList.balls[i]
        let b = entityList.balls[j]

        if(a.tags.has("noCollideBall") || b.tags.has("noCollideBall") || b.team==a.team){continue}

        // only do anything if the balls are moving towards each other

        // let towards = dot(a.vx-b.vx,a.vy-b.vy,b.x-a.x,b.y-a.y) <= 0 // note to self: SUPER FUN
        let towards = dot(b.vx-a.vx,b.vy-a.vy,b.x-a.x,b.y-a.y) <= 0
        if(!towards){
          // return
        }


        if(check_collision_circles(a.x,a.y,a.r,b.x,b.y,b.r)){
          // console.log("collision",a.name)


          let dist = distance(a.x,a.y,b.x,b.y)
          dist = Math.max(dist,0.0000001)
          let contactPoint = {x:(a.x+b.x)/2,y:(a.y+b.y)/2}

          let normalizedVectorTo = {x:(b.x-a.x)/dist, y:(b.y-a.y)/dist}

          let massRatio = 2/(1/a.mass+1/b.mass)

          let dmgA = dot(a.vx,a.vy,normalizedVectorTo.x,normalizedVectorTo.y) * massRatio
          let dmgB = - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y) * massRatio

          dmgA = Math.max(dmgA*50,0) 
          dmgB = Math.max(dmgB*50,0) 

          if(dmgA>dmgB){
            dmgB*=0.5
          } else {
            dmgA*=0.5
          }
          dmgA *= a.damageMultiplier
          dmgB *= b.damageMultiplier




          //particles A
          let spread = -0.6
          let spread2 = -0.3
          let mult = 0.25

          let forceMultiplier = dot(a.vx,a.vy,normalizedVectorTo.x,normalizedVectorTo.y) * a.mass - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)* b.mass
          let forceTo = {x:forceMultiplier * normalizedVectorTo.x,y:forceMultiplier * normalizedVectorTo.y}
          a.forceM(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier)
          // counterforce
          b.forceM(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier)

          let killed_b = 1+b.damage(dmgA)
          let killed_a = 1+a.damage(dmgB)

          // @blood
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

          let p = new particle(b.x,b.y,0,0)
          p.life = 15*dmgB
          p.color = [255,10,12]
          p.ay = 0
          p.size = b.r+2
          p.noFill = 1
          particles.push(p)

          p = new particle(a.x,a.y,0,0)
          p.life = 15*dmgA
          p.color = [255,10,12]
          p.ay = 0
          p.size = a.r+2
          p.noFill = 1
          particles.push(p)
          
          




          //push balls out of each other (good enough for now, fix later, bleeding E)

          let overlap = a.r + b.r - dist
          if(overlap > 0){
            overlap += 0.001
            let pushX = normalizedVectorTo.x * overlap / 2
            let pushY = normalizedVectorTo.y * overlap / 2
            // a.x -= pushX
            // a.y -= pushY
            // b.x += pushX
            // b.y += pushY

            a.push.x -= pushX
            a.push.y -= pushY
            b.push.x += pushX
            b.push.y += pushY
          }

          a.collided(time,b)
          b.collided(time,a)

        }
      }
    // }
}


/////// game setup


class test{

  static perf = 0;

  static still(){
    entityList.balls.forEach((e)=>{e.hp=e.maxHp=400000;e.tags.delete("AI")});entityList.walls.forEach((e)=>{e.hp=e.maxHp=400000});entityList.player.energyRegen = 400
  }

  static nextPushDebug(){
    document.addEventListener("mouseup",(e)=>{debugger},{once:true})
  }

  static onFrameDebug(){
    frameFuncs.splice(0,0,()=>{debugger})
  }

  static expect(x,y,margin=0.1){
    return(Math.abs(x-y)>0.1 && debug)
  }

  static debug(){
    newWall(-100,890,100,4190);
    
    newWall(-200,490,800,490);
    newWall(1800,490-60,1000,490-60);
    newWall(-140,490,-140,0);
    
    // newWall(-200,0*400,800,0*400).tags.add("sided");
    // newWall(1200,490,800,790);
    // newWall(1200,490,800,790);
    // newWall(1200,490,1800,790);

    // for(let i = 0; i < 10; i++){
    //   newWall(-200,490-i*10,-200,480-i*10)
    // }

    this.still()
  }

  static balls(){
    for(let i = 0; i < 100; i++){newBall(player.x+rand()-70,player.y-60,50)}
  }

  static ballTop(){
    for(let i = 0; i < 100; i++){newBall(player.x,player.y-160,50)}
  }

  static particles(){
    setInterval((e)=>{
      let p = new particle(player.x,player.y-200,1,0)
      particles.push(p)
      p.life *= 5
    },200)
  }
  static slower = 1;
}

//initialize player @ip @player

  entityList.player = new ball(-100,400,50,can.ctx,false)
  entityList.player.team = "player"
  entityList.player.mass = 1.2
  entityList.player.color = [129,62,41] //129 62 41
  entityList.player.name = "player"
  entityList.player.hpRegen *= 2
  entityList.player.wallJumpEnergy = 5
  entityList.player.energyRegen *= 2
  entityList.balls.push(entityList.player)
  entityList.player.tags.delete("AI")
  entityList.player.onJump = (b,spentEnergy)=>{
    let p = new particle(b.x,b.y,0,0)
    p.life = 1500/b.maxEnergySpend*spentEnergy
    p.color = [120,245,230]
    p.ay = 0
    p.size = b.r+2
    p.noFill = 1
    particles.push(p)
  }
  entityList.player.tags.add("moves")
  entityList.player.movementVector = {x:0,y:0}
  entityList.player.movementScalar = 1

  entityList.player.onDeath.push(()=>{
    if(settings.mobile){
      setTimeout(()=>{
        document.addEventListener("touchstart",()=>{location.reload()})
      },2000)

    }
  })

  trailify(entityList.player)
  // implement player trail


  function newWall(a,b,c,d,ctx=can.ctx){
    let w = new wall(a,b,c,d,ctx)
    entityList.walls.push(w)
    return(w)
  }
  function newBall(x,y,r=50,ctx=can.ctx){
    let b = new ball(x,y,r,ctx)
    entityList.balls.push(b)
    return(b)
  }

  function build(x,y,x1,y1,type="normal",options={}){
    let w = newWall(x,y,x1,y1)
    let types = {
      "magma":()=>{
        w.color = "orange"
        w.size = 16
        w.events.onCollide.push((w,d,mult,b,impactPt)=>{b.damage(45)})
      }
    }

    if(types[type]){types[type]()}
  }


  function summon(x,y,type="normal",options={}){

    let b = newBall(x,y)
    let p = entityList.player
    let AIs = {
      "mover":()=>{
        b.tags.add("moves")
        b.movementVector = {x:0,y:0}
        b.movementSpeed = 0.03
        b.movementScalar = 1
        b.color = [30,62,41]
        trailify(b)

        b.AICustomUpdate = (b,dt)=>{
          b.movementVector = {x:p.x-b.x,y:p.y-b.y}
          b.AInextUpdateTime = 500
        }
      }
    }
    if(AIs[type]){AIs[type]()}
    return(b)
  }

  function trailify(ball,leng=50){
    ball.trail = []
    ball.drawFuncs.push((p,s,l)=>{

    p.ctx.save()
    p.ctx.globalCompositeOperation = "destination-over"

    p.trail.forEach((e,i)=>{
      p.ctx.fillStyle = "hsla("+(p.color[0])+ "," + s + "%," + l + "%,"+Math.min(0.5,0.01*i*e[2] - 0.5)+")"
      p.ctx.beginPath()
      p.ctx.arc(e[0],e[1],p.r*0.97,0,Math.PI*2)
      p.ctx.fill()
    })

    p.trail.push([p.x,p.y,p.speed()])
    if(p.trail.length>leng){
      p.trail.splice(0,1)
    }
    p.ctx.globalCompositeOperation = "source-over"
    p.ctx.restore()

  }) 
  }


  function newWallTo(a,b,c,d,ctx){
    return(newWall(a,b,a+c,b+d,ctx))
  }

  function mirror(f,a,b,c,d,x,flip=false){
    let w1 = f(a,b,c,d)

    let w2;
    if(flip){
      w2 = f(x+(x-c),b,x+(x-a),d)
    } else {
      w2 = f(x+(x-a),b,x+(x-c),d)
    }

    return([w1,w2])
  }


  function normalGenerate(){
      //initialize walls
    newWall(-200,0,800,0,can.ctx)
    newWall(-200,0,-200,600,can.ctx)
    makeWooden(newWall(800,0,800,600,can.ctx))

    entityList.walls.push(new wall(-200,600,800,600,can.ctx)) // floor
    // entityList.walls.push(new wall(110,500,110,1600,can.ctx)) // beam
    // entityList.walls.push(new wall(110,500,150,450,can.ctx)) // beam
    // entityList.walls.push(new wall(110,500,70,450,can.ctx)) // beam

    let tmp = makeAIbreakable(makeWooden(new wall(50,500,150,500,can.ctx),0.1))
    entityList.walls.push(tmp)
    let tmp2 = makeAIbreakable(makeWooden(new wall(100,600,100,500,can.ctx),0.1))
    tmp2.events.onBreak.push((a,b,c)=>{tmp.break(b,c)})
    entityList.walls.push(tmp2) //table


    entityList.balls.push(new ball(380,450,50,can.ctx))


    /// initialize rest of level
    let x = 800, y = 600
    let vx = 1000; vy = 400
    for(let i = 0; i < 4; i++){
      vx += rand(-400)
      vy += rand(-400)
      let w = newWall(x,y,x+vx,y+vy,can.ctx)
      w.hp*=10
      x+=vx
      y+=vy
  }

  generateLevels(x,y)
  }

  if(!debug ){
    normalGenerate()    
  } else {
    console.log('hey')
    test.debug()
  }





  //// Debugging

  entityList.player.calcEnergy = ()=>{
    let mgh = -gameWorld.gravity*entityList.player.y
    let ke = 0.5*(entityList.player.vx*entityList.player.vx + entityList.player.vy*entityList.player.vy)
    let E = mgh + ke
    console.log(E)
  }

  // entityList.player.updateFuncs.push(entityList.player.energy)





requestAnimationFrame(mainLoop)



/////// main game @loop & drawing

underCan.ctx.fillStyle = "rgba(0,0,0,1)"
underCan.ctx.globalCompositeOperation = 'destination-out';
underCan.ctx.save()

setTimeout(()=>{
  frameFuncs.push((time,dt,date)=>{
  
    let pn = performance.now()
    if(test.dtLock){
      dt = test.dtLock
    }
    dt = Math.min(100,dt)

  //move camera


  can.ctx.clearRect(0,0,can.canvas.width,can.canvas.height)

  camera.scale += (settings.speedZoom/(entityList.player.speed()+settings.speedZoom)*settings.relativeSize-camera.scale)*0.03
  let camDx = (entityList.player.x-WidthM/camera.scale-camera.pos.x)*0.03
  let camDy = (entityList.player.y-HeightM/camera.scale-camera.pos.y)*0.03
  camera.pos.x += camDx
  camera.pos.y += camDy

  can.ctx.save()
  can.ctx.translate(-camera.pos.x*camera.scale,-camera.pos.y*camera.scale)
  can.ctx.scale(camera.scale,camera.scale)

  underCan.ctx.restore()
  underCan.ctx.save()
  underCan.ctx.globalCompositeOperation = 'copy';
  // underCan.ctx.fillRect(0,0,underCan.canvas.width,underCan.canvas.height)
  underCan.ctx.drawImage(underCan.ctx.canvas, -camDx*camera.scale, -camDy*camera.scale); // should fix later: sudden zooming does not get adjusted for
  underCan.ctx.globalCompositeOperation = 'destination-out';
  underCan.ctx.fillRect(0,0,underCan.canvas.width,underCan.canvas.height)
  underCan.ctx.globalCompositeOperation = 'source-over';

  underCan.ctx.setTransform(can.ctx.getTransform());

  // grid.draw()

  particles.update(dt)
  particles.draw(1)

  let pn2 = performance.now()
  for(let i = entityList.balls.length-1; i>-1; i--){
    let e = entityList.balls[i]
    if(e.tags.has("isDead") && date-e.deathTime > 5000 && e !== entityList.player){
      entityList.balls.splice(i,1)
      continue;
    }

    allBallsCollide(time,i)
    e.update(dt*gameWorld.timeWarp)
    e.draw()
  }



  for(let i = entityList.walls.length-1; i>-1; i--){
    let e = entityList.walls[i]
    if(e.tags.has("isBroken")){
      entityList.walls.splice(i,1)
      continue;
    }
    e.draw()
  }
  test.perf = (performance.now()-pn2) * 0.1 + test.perf*0.9

  particles.draw(2)



  drawShootAngle(date)

  controlBall(entityList.player)

  gameWorld.timeWarp += (1-gameWorld.timeWarp)*0.1
  if(controller.mouseIsDown){gameWorld.timeWarp*=0.90}


  can.ctx.restore()
  drawPlayerGUI()

  can.ctx.fillStyle = "pink"
  can.ctx.fillText(Math.floor(dt)+" "+(Math.round(performance.now()-pn)+" "+Math.floor(test.perf*100)),100,100)
  if(settings.offline){
    can.ctx.fillStyle = "red"
    can.ctx.fillText("OFFLINE. SERVED OFFLINE. DEBUG NOT WORK BECAUSE OFFLINE",100,120)
  }

  })
},400) // wait for website to stabalize



function drawShootAngle(date){
  if(controller.mouseIsDown){

    if(!settings.mobile){
      controller.updateJump(mouseX,mouseY)
    }

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

  if(settings.mobile){
    if(controller.movement.down){
      can.ctx.lineWidth =3 
      can.ctx.strokeStyle = "#F0F0F0"
      can.ctx.beginPath()
      can.ctx.moveTo(controller.movement.x,controller.movement.y)
      can.ctx.lineTo(controller.movement.x+controller.movement.dx,controller.movement.y+controller.movement.dy)
      can.ctx.stroke()
    }
  }

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


  /// hell

  for(let i = 0; i < 15; i++){
    build(-18000+i*4000,y+4000+rand(2000),-4000+i*14000,y+4000+rand(2000),"magma")
    build(-16000+i*4000,y+4000+rand(2000),-2000+i*14000,y+4000+rand(2000),"magma")
  }

  /// end hell


  let tmp;
  let floorLength = 1800+rand(1800)
  let heightDiff = floorLength * (1.6+rand(7))
  let height = y-heightDiff

  let heightDiv = Math.floor(heightDiff/300)

  let wallX = {"a":x+floorLength*(0.2+rand(-0.1)),"b":x+floorLength*(0.7+rand(-0.2))}
  let floorWidth = wallX.b-wallX.a
  let midX = wallX.a + floorWidth/2


  tmp = newWall(x,y,x+floorLength,y,can.ctx)//base floor
  tmp.hp*=10

  let doorHeight = y-250-rand(150)
  entityList.walls.push(makeWooden(new wall(wallX.a,y,wallX.a,doorHeight,can.ctx),0.2))
  segWalls(wallX.a,doorHeight,wallX.a,height,heightDiv)
  segWalls(wallX.b,y,wallX.b,height,heightDiv)
  // entityList.walls.push(new wall(wallX.a,height,wallX.b,height,can.ctx)) // old roof
  mirror(newWall,wallX.a,height,wallX.a+floorWidth/3,height,midX,1).forEach((e)=>{makeWooden(e).tags.add("sided")}) // roof
  newWall(wallX.a+floorWidth/3,height,wallX.b-floorWidth/3,height)


  let floor = doorHeight - rand(150)
  while(floor > height + 200){

    let floorX = 40+rand(floorWidth-180)
    let start = wallX.a
    let end = wallX.b
    let flipped = false
    if(Math.random()>0.5){floorX*=-1;start=wallX.b;end=wallX.a;flipped=true} //left or right
    entityList.walls.push(new wall(start,floor,start+floorX,floor,can.ctx))


    if(rand(0.3)){
      let floorBoard = new wall(end,floor,start+floorX,floor,can.ctx)
      if(!flipped){
      floorBoard.normal.x *=-1
      floorBoard.normal.y *=-1
      }
      floorBoard.tags.add("sided")
      makeWooden(floorBoard)
      entityList.walls.push(floorBoard)
    }



    if(Math.random()>0.5){ // spawn rate
      entityList.balls.push(new ball(start+floorX*0.5,floor-60,50,can.ctx))
    }


    floor -= 230+rand(200)
  }

  /// boss level


  // newWallTo(wallX.a,height,200-floorWidth,-300)
  // newWallTo(wallX.b,height,-(200-floorWidth),-300)

  mirror(newWall,wallX.a,height,wallX.a,height-300,midX)
  height -= 300
  let fat = 900

  mirror(newWall,wallX.a,height,midX-180,height,midX)
  makeWooden(newWall(midX-180,height,midX+180,height)).tags.add("sided")
  mirror(newWall,wallX.a,height,midX-fat,height-300,midX)
  height -= 300
  mirror(newWall,midX-fat,height,midX-fat,height-2300,midX) // wall
  let top = height-2300

  height -= 400
      
  mirror(newWall,midX-fat,height,midX-500,height,midX).forEach((e)=>{entityList.balls.push(new ball(e.midpoint.x,e.midpoint.y-60,50,can.ctx))})
  height -= 200
  mirror(newWall,midX-fat,height,midX-600,height,midX).forEach((e)=>{entityList.balls.push(new ball(e.midpoint.x,e.midpoint.y-60,50,can.ctx))})
  height -= 200
  mirror(newWall,midX-fat,height,midX-700,height,midX).forEach((e)=>{entityList.balls.push(new ball(e.midpoint.x,e.midpoint.y-60,50,can.ctx))})
  height -= 400
  newWall(midX-200,height,midX+200,height)
  let boss = newBall(midX,height-60,80,can.ctx)
  boss.hp *= 5
  boss.maxHp *= 5
  boss.onDeath.push(()=>{boss.vx*=0.8;boss.vy*=0.8})



  // entityList.player.y = height
  // entityList.player.x = midX


  height = top
  newWall(midX-fat,height,midX+fat,height) // roof


}

















/// main game controls


function controlBall(ball){

  

  if(!settings.mobile){
    ball.movementVector = {x:0,y:0}
    if(controller.keys.w){ball.movementVector.y -= 1}
    if(controller.keys.s){ball.movementVector.y += 1}
    if(controller.keys.a){ball.movementVector.x -= 1}
    if(controller.keys.d){ball.movementVector.x += 1}
  }


  if(settings.mobile && controller.movement.down){
    let norm = distance(controller.movement.dx,controller.movement.dy)

    let lim = Math.max(1,norm) / movement
    let size = 100
    if(norm < size && norm !== 0){
      lim *= size/norm
    }


    ball.vx += controller.movement.dx / lim 
    ball.vy += controller.movement.dy / lim
  }
}

document.addEventListener("mousedown",(e)=>{
  controller.mouseDownPos = {x:e.clientX,y:e.clientY,time:Date.now()}
  controller.mouseIsDown = true
})

document.addEventListener("mouseup",(e)=>{
  controller.endJump(mouseX,mouseY)
})





document.addEventListener("keydown",(e)=>{
  controller.keys[e.key.toLowerCase()]=true
})


document.addEventListener("keyup",(e)=>{
  controller.keys[e.key.toLowerCase()]=false
})




























/////// touch handler


function touchHandler(event)
{

  // console.log(event.type)
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


    for(let i = 0; i < touches.length; i++){
        let E = touches[i]
        if(!controller.activeTouches[E.identifier]){
          controller.activeTouches[E.identifier] = {"type":"unidentified"}
        }
    }
    if(event.type == "touchstart"){
      let E = touches[touches.length-1]
      if(E.pageX < can.canvas.width/2){
        controller.activeTouches[E.identifier].type = "movement"
        controller.movement = {down:true,x:E.clientX,y:E.clientY,time:Date.now(),dx:0,dy:0}
      } else {
        controller.activeTouches[E.identifier].type = "jump"
        controller.mouseDownPos = {x:E.clientX,y:E.clientY,time:Date.now()}
        controller.updateJump(E.clientX,E.clientY)
        controller.mouseIsDown = true
      }
    }

    if(event.type == 'touchmove'){
      for(let i = 0; i < touches.length; i++){
        let E = touches[i]
        if(controller.activeTouches[E.identifier].type == "movement"){
          controller.movement.dx = E.clientX - controller.movement.x
          controller.movement.dy = E.clientY - controller.movement.y
        } else if(controller.activeTouches[E.identifier].type == "jump"){
          controller.updateJump(E.clientX,E.clientY)
        }
      }
    }


    if(type !== "mouseup"){
      mouseX = event.touches[0].clientX
      mouseY = event.touches[0].clientY
    }


    // var simulatedEvent = document.createEvent("MouseEvent");

    if(event.type == "touchend"){
        for(let i = 0; i < touches.length; i++){
          let E = touches[i]
          if(controller.activeTouches[E.identifier].type == "movement"){
            controller.movement.dx = 0
            controller.movement.dy = 0
            controller.movement.down = false
          } else if(controller.activeTouches[E.identifier].type == "jump"){
            controller.endJump(E.clientX,E.clientY)
          }
          delete controller.activeTouches[E.identifier]
        }
    }

    // simulatedEvent.initMouseEvent(type, true, true, window, 1, 
    //                               first.screenX, first.screenY, 
    //                               first.clientX, first.clientY, false, 
    //                               false, false, false, 0/*left*/, null);




    // document.body.dispatchEvent(simulatedEvent);
    
    if (event.cancelable) {
      event.preventDefault();
    }
}


function init() 
{

    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
    // document.addEventListener('touchmove', function() { e.preventDefault();GI.debuggingInfo = "cancled" }, { passive:false });


    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
}

init()


const isMobile = () => {
  // Checks for touch support and imprecise pointer (finger)
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (window.matchMedia("(any-pointer: coarse)").matches)
  );
};

settings.mobile = isMobile()
if(settings.mobile){
  settings.relativeSize*=1.2
}




// unbreakable walls
// player trail
// height advantage

// bounciness for wall //
// scrolling background
// trace through once side walls

const navigationEntry = performance.getEntriesByType("navigation")[0];
const isCached = navigationEntry.transferSize === 0;
console.log(isCached ? "Served from cache" : "Served from network");
settings.offline = isCached

if(!settings.offline){

  fetch('/getIP', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}



var player = entityList.player

//test gay ray


// summon(0,0,"mover")