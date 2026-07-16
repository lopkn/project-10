
let debug = 0;
// let Width = window.innerWidth
// let Height = window.innerHeight
let  Width = document.documentElement.clientWidth
let  Height = document.documentElement.clientHeight

let WidthM = Width/2
let HeightM = Height/2

const TAU = Math.PI*2

// let myCanvas = document.getElementById("myCanvas")

//   myCanvas.width = Math.floor(Width)
//   myCanvas.height = Math.floor(Height)
//   myCanvas.style.width = Math.floor(Width)+"px"
//   myCanvas.style.height = Math.floor(Height)+"px"
//   myCanvas.style.top = "0px"
//   myCanvas.style.left = "0px"

// let ctx = document.getElementById("myCanvas").getContext("2d")

function DCC(el,par){
  el = document.createElement(el)
  if(par){par.appendChild(el)}
    return(el)
}
var rand = (x)=>{
  if(x == undefined){return(Math.random())}
  if(x < 1){
    if(x < 0){return(Math.random()*x-x/2)}
    return(Math.random()<x)
  }
  return(Math.random()*x)
}

function ranarr(...args){
  const arr = (args.length === 1 && Array.isArray(args[0])) ? args[0] : args;
  return(arr[Math.floor(Math.random()*arr.length)])
}

function ranRadius(r){
  let rr = r*2
  let out = {x:Math.random()*rr-r,y:Math.random()*rr-r}
  let r2 = r*r
  while(distanceSq(out.x,out.y) > r2){
    out = {x:Math.random()*rr-r,y:Math.random()*rr-r}
  }
  return(out)
}



let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


function minMax(low,x,high){
  return(Math.min(high,Math.max(low,x)))
}

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
    // this.canvas.classList.add("screen")

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

function dist(a,b={x:0,y:0}){
  return(distance(a.x,a.y,b.x,b.y))
}

function distanceSq(x1,y1,x2=0,y2=0) {
    let a = x2-x1
    let b = y2-y1
  return(a*a+b*b)
}


var frameFuncs = []

function mainLoop(){
  if(settings.RAF || settings.dualRAF){
    requestAnimationFrame(mainLoop)
  } else {
    console.log("hey")
  }
  let time = performance.now()-settings.startDate
  let dt = (time-gameWorld.lastTime)

  if(settings.RAF){
    dt = (time-gameWorld.lastDrawTime)
    gameWorld.lastDrawTime = time
  } else {
    gameWorld.lastTime = time
  }

  // if(settings.RAF && dt < 14*test.slower){requestAnimationFrame(mainLoop);return}
  gameWorld.frame += 1
  gameWorld.dt = dt
  let date = Date.now()
  frameFuncs.forEach((e)=>{
    e(time,dt,date)
  })

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

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(TAU * u2);
    return z0 * stderr + mean;
}







// function stupidCtxPatch(ctx) {
//   // Initialize the 2D matrix state: [a, b, c, d, e, f]
//   // Starts as an identity matrix: [1, 0, 0, 1, 0, 0]
//   ctx._matrixStack = [[1, 0, 0, 1, 0, 0]];
//   ctx._currentMatrix = [1, 0, 0, 1, 0, 0];

//   // 1. Save references to the original native functions
//   const nativeTranslate = ctx.translate;
//   const nativeScale = ctx.scale;
//   const nativeRotate = ctx.rotate;
//   const nativeTransform = ctx.transform;
//   const nativeSetTransform = ctx.setTransform;
//   const nativeSave = ctx.save;
//   const nativeRestore = ctx.restore;
//   const nativeResetTransform = ctx.resetTransform || function() { this.setTransform(1, 0, 0, 1, 0, 0); };

//   // ctx.myGetTransform = ()=>{return(ctx._currentMatrix)}

//   // 2. Override Transformation Functions with Matrix Math
//   ctx.translate = function(x, y) {
//     const m = this._currentMatrix;
//     m[4] += x * m[0] + y * m[2];
//     m[5] += x * m[1] + y * m[3];
//     nativeTranslate.call(this, x, y);
//   };

//   ctx.scale = function(sx, sy) {
//     const m = this._currentMatrix;
//     m[0] *= sx; m[1] *= sx;
//     m[2] *= sy; m[3] *= sy;
//     nativeScale.call(this, sx, sy);
//   };

//   ctx.rotate = function(rad) {
//     const m = this._currentMatrix;
//     const c = Math.cos(rad);
//     const s = Math.sin(rad);
//     const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
//     m[0] = m0 * c + m2 * s;   m[1] = m1 * c + m3 * s;
//     m[2] = m0 * -s + m2 * c;  m[3] = m1 * -s + m3 * c;
//     nativeRotate.call(this, rad);
//   };

//   ctx.transform = function(a, b, c, d, e, f) {
//     const m = this._currentMatrix;
//     const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
//     m[0] = a * m0 + b * m2;       m[1] = a * m1 + b * m3;
//     m[2] = c * m0 + d * m2;       m[3] = c * m1 + d * m3;
//     m[4] += e * m0 + f * m2;      m[5] += e * m1 + f * m3;
//     nativeTransform.call(this, a, b, c, d, e, f);
//   };

//   ctx.setTransform = function(a, b, c, d, e, f) {
//     // If called with a DOMMatrix object argument, handle fallback
//     if (typeof a === 'object') {
//       this._currentMatrix = [a.a, a.b, a.c, a.d, a.e, a.f];
//       nativeSetTransform.call(this, a);
//     } else {
//       this._currentMatrix = [a, b, c, d, e, f];
//       nativeSetTransform.call(this, a, b, c, d, e, f);
//     }
//   };

//   ctx.resetTransform = function() {
//     this._currentMatrix = [1, 0, 0, 1, 0, 0];
//     nativeResetTransform.call(this);
//   };

//   // 3. Keep track of ctx.save() and ctx.restore() context state rules
//   ctx.save = function() {
//     this._matrixStack.push([...this._currentMatrix]);
//     nativeSave.call(this);
//   };

//   ctx.restore = function() {
//     if (this._matrixStack.length > 1) {
//       this._currentMatrix = this._matrixStack.pop();
//     }
//     nativeRestore.call(this);
//   };

//   // 4. Expose the lightning fast matrix getter
//   ctx.myGetTransform = function() {
//     return this._currentMatrix; // Returns raw [a, b, c, d, e, f] array instantly
//   };

//   ctx.getInversedTransform = function() {
//     const m = this._currentMatrix; // [a, b, c, d, e, f]
    
//     // 1. Calculate the determinant
//     const det = m[0] * m[3] - m[1] * m[2];
    
//     // 2. Handle edge case: if scale is zero, matrix cannot be inverted
//     if (det === 0) {
//       return this._currentMatrix; 
//     }
    
//     // 3. Compute the inverse values
//     const invDet = 1.0 / det;
    
//     return [
//        m[3] * invDet,                             // new a
//       -m[1] * invDet,                             // new b
//       -m[2] * invDet,                             // new c
//        m[0] * invDet,                             // new d
//       (m[2] * m[5] - m[3] * m[4]) * invDet,       // new e
//       (m[1] * m[4] - m[0] * m[5]) * invDet        // new f
//     ];
//   };
// }

















/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============




can = new LCanvas()
can.clear()
can.fitScreenSize()
can.canvas.style.pointerEvents = "none"

// stupidCtxPatch(can.ctx)


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



function f(p1, p2, x) { // kind of trust. not really? works with negatives
  p1 = [p1.x,p1.y]
  p2 = [p2.x,p2.y]
    const mx = (p1[0] + p2[0]) / 2.0;
    const my = (p1[1] + p2[1]) / 2.0;
    
    const vx = p1[0] - p2[0];
    const vy = p1[1] - p2[1];
    const d = Math.hypot(vx, vy);
    
    if (d === 0) {
        throw new Error("p1 and p2 cannot be the same point.");
    }
        
    if (Math.abs(Math.cos(x)) < 1e-9) {
         return [mx, my];
    }

    const ux_perp = -vy / d;
    const uy_perp = vx / d;
    
    const dist_from_midpoint = (d / 2.0) * Math.tan(x);
    
    const p3_x = mx + ux_perp * dist_from_midpoint;
    const p3_y = my + uy_perp * dist_from_midpoint;
    
    return [p3_x, p3_y];
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
    const distSq = distX * distX + distY * distY;

    // 7. If squared distance is less than or equal to squared radius, they collide
    return distSq <= r * r;
}

function check_collision_AABB_line(x1, y1, x2, y2, x3, y3, x4, y4, rx, ry, ang=0) {
    // Ensure AABB coordinates are properly ordered as min/max

    if(ang!==0){
      ang = -ang
      let p1 = Lrotate(x3-rx,y3-ry,ang)
      p1.x+=rx; p1.y += ry
      let p2 = Lrotate(x4-rx,y4-ry,ang)
      p2.x+=rx; p2.y += ry
      x3 = p1.x; y3 = p1.y
      x4 = p2.x; y4 = p2.y
      // new lineParticle(x3,y3,x4,y4,50000)
    }

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    // Delta X and Delta Y of the line segment
    const dx = x4 - x3;
    const dy = y4 - y3;

    // t0 and t1 represent the parametric overlap interval [0, 1]
    let t0 = 0.0;
    let t1 = 1.0;

    // Array of pairs: [denominator, numerator] for the 4 edges
    // Liang-Barsky p and q values
    const checks = [
        [-dx, x3 - minX], // Left edge
        [ dx, maxX - x3], // Right edge
        [-dy, y3 - minY], // Top edge
        [ dy, maxY - y3]  // Bottom edge
    ];

    for (const [p, q] of checks) {
        if (p === 0) {
            // Line is parallel to this edge. 
            // If it's outside the boundary, no intersection is possible.
            if (q < 0) return false;
        } else {
            const t = q / p;
            if (p < 0) {
                // Line is entering the AABB volume
                if (t > t1) return false;
                if (t > t0) t0 = t;
            } else {
                // Line is leaving the AABB volume
                if (t < t0) return false;
                if (t < t1) t1 = t;
            }
        }
    }

    // If the entering time is less than or equal to the exiting time, 
    // a collision occurs within the segment length.
    return t0 <= t1;
}

// function check_rotated_AABB_line(x1, y1, x2, y2, x3, y3, x4, y4, rx, ry, ang){
//   let p1 = Lrotate(x3-rx,y3-ry,ang)
//   p1.x+=rx; p1.y += ry
//   let p2 = Lrotate(x4-rx,y4-ry,ang)
//   p2.x+=rx; p2.y += ry


//   return(check_collision_AABB_line(x1,y1,x2,y2,p1.x,p1.y,p2.x,p2.y))
// }

function get_rotated_AABB(x1, y1, x2, y2, rx, ry, rotationRadians) { // unchecked
    // 1. Calculate the original center and positive half-extents
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const hx = Math.abs(x2 - x1) / 2;
    const hy = Math.abs(y2 - y1) / 2;

    // 2. Rotate the center point around the pivot (rx, ry)
    const cosA = Math.cos(rotationRadians);
    const sinA = Math.sin(rotationRadians);
    
    const dx = cx - rx;
    const dy = cy - ry;
    
    const rotatedCx = rx + (dx * cosA - dy * sinA);
    const rotatedCy = ry + (dx * sinA + dy * cosA);

    // 3. Project the half-extents onto the axes (always uses absolute trig values)
    const absCos = Math.abs(cosA);
    const absSin = Math.abs(sinA);

    const hxNew = hx * absCos + hy * absSin;
    const hyNew = hx * absSin + hy * absCos;

    // 4. Return the new AABB centered at the rotated position
    return [
        rotatedCx - hxNew,
        rotatedCy - hyNew,
        rotatedCx + hxNew,
        rotatedCy + hyNew
    ];
}


function check_collision_AABB_ball(x1, y1, x2, y2, x, y, r,rx,ry,ang=0) { // generated
    // Find the closest point on the AABB to the circle center

    if(ang!==0){
      ang = -ang
      let p = Lrotate(x-rx,y-ry,ang)
      p.x+=rx; p.y += ry
      x=p.x; y = p.y
    }

    const closestX = Math.max(x1, Math.min(x, x2));
    const closestY = Math.max(y1, Math.min(y, y2));

    // Calculate the distance vector components
    const distanceX = closestX - x;
    const distanceY = closestY - y;

    // Calculate the squared distance
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    // Check if the squared distance is less than or equal to the squared radius
    return distanceSquared <= (r * r);
}

function getClockwiseAngle(x, y) { // unchecked but decent
    let angle = Math.atan2(x, y);
    return angle < 0 ? angle + 2 * Math.PI : angle;
}

function point_on_line(x, y, x1, y1, x2, y2) {
// returns the closest point on the line segment to (x, y) and the t value along the segment (0 at start, 1 at end)
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

    return({x: x1 + t * abx, y: y1 + t * aby, t: t})

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
    if (point_to_line_distance(x2, y2, bx1, by1, bx2, by2) <= r && dot(vx,vy,bx1-x1,by1-y1) < 0) { // if the end of wall PT is overlapping the sweeping ball
      let d = point_to_infinite_line_distance(x2, y2, bx1, by1, bx2, by2)
      let pol = point_on_infinite_line(x2, y2, bx1, by1, bx2, by2)
      let res = {x:x2, y:y2}
      d=Math.sqrt(r*r-d*d)
      let p = {x:pol.x-nvx*d,y:pol.y-nvy*d}
      let dist = distance(res.x,res.y,bx1,by1)
      if(test.expect(distance(p.x,p.y,res.x,res.y),r)){if(!settings.mobile){debugger}} // energen
      if(!collision || dist <= collision.dist){
        collision = {p:p,closest:res,dist:dist,type:5} // p = the pos of ball when collide, closest = the point of collision
      }
    }

    



        // 2. Check if the distance from the line segment to either endpoint of the capsule is less than r
    // if (point_to_line_distance(bx1, by1, x1, y1, x2, y2) <= r) {
    //   // the start of the capsule collided
    //   return(2);
    // } // dont need this yet


    if (point_to_line_distance(bx2, by2, x1, y1, x2, y2) <= r) { // the ball's end point overlaps the wall
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
  static entityGrid = {}
  static activationGrid = {}
  static miscGrid = {}

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

  static queryCells(x1,y1,x2,y2,grid=this.grid){ //directionall!!!
    let cell1 = this.findCell(x1,y1)
    let cell2 = this.findCell(x2,y2)
    let results = []
    for(let i = cell1[0]; i <= cell2[0]; i++){
      for(let j = cell1[1]; j <= cell2[1]; j++){
        let key = this.keyify(i,j)
        if(grid[key]){
          results.push(grid[key])
        }
      }
    }

    return(results)
  }

  static query(x1,y1,x2,y2,grid=this.grid){ //directionall!!!
    let cell1 = this.findCell(x1,y1)
    let cell2 = this.findCell(x2,y2)
    // let results = []
    let items = new Set()
    for(let i = cell1[0]; i <= cell2[0]; i++){
      for(let j = cell1[1]; j <= cell2[1]; j++){
        let key = this.keyify(i,j)
        if(grid[key]){
          items = items.union(grid[key])
        }
      }
    }

    return(items)
  }

  static add(x1,y1,x2,y2,entity){


    let results = []
    let arr = this.traceLineCells(x1,y1,x2,y2)
    for(let i = 0; i < arr.length; i++){
      let key = arr[i]
      if(this.grid[key]===undefined){
        this.grid[key] = new Set()
      }
      this.grid[key].add(entity)
      results.push(this.grid[key])
    }

    return(results)
  }

  static addChunk(x1,y1,x2,y2,entity,grid=this.grid){
    let cell1 = this.findCell(x1,y1)
    let cell2 = this.findCell(x2,y2)
    let results = []
    let items = new Set()
    for(let i = cell1[0]; i <= cell2[0]; i++){
      for(let j = cell1[1]; j <= cell2[1]; j++){
        let key = this.keyify(i,j)
        if(grid[key]===undefined){
          grid[key] = new Set()
        }
        grid[key].add(entity)
        results.push(grid[key])
      }
    }
    return(results)
  }

  static addPt(x,y,e,grid=this.grid){
    let cell = this.findCell(x,y)
    let key = this.keyify(cell[0],cell[1])
    if(grid[key]===undefined){
        grid[key] = new Set()
      }
      grid[key].add(e)
    return(grid[key])
  }

  static activate(x,y){
    let cell = this.findCell(x,y)
    let ret = []
    for(let i = -1; i < 2; i++){
      for(let j = -1; j < 2; j++){
        let key = this.keyify(cell[0]+i,cell[1]+j)
        if(!this.activationGrid[key]){continue;}
        this.activationGrid[key].forEach((activationFunction)=>{
          activationFunction()
        })
        ret.push(this.activationGrid[key])
        delete this.activationGrid[key]
      }
    }
    
    return(ret)
  }

  static getNearby(x,y,size=1,grid=this.grid){
    let cell = this.findCell(x,y)
    let items = new Set()
    for(let i = -size; i < size+1; i++){
      for(let j = -size; j < size+1; j++){
        let key = this.keyify(cell[0]+i,cell[1]+j)
        if(!grid[key]){continue;}
        items = items.union(grid[key])
      }
    }
    
    return(items)
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


function AIlos(x,y,ox,oy,ball){
  let los = true;
  if(ball && ball.losDistanceSq && distanceSq(x,y,ox,oy) > ball.losDistanceSq){
    return(false)
  }

  entityList.activatedWalls.forEach((w)=>{
    if(w.tags.has("AIdamage")){return}
    if(w.tags.has("sided")){
      let vx = ox-x
      let vy = oy-y
      if(dot(w.normal.x,w.normal.y,vx,vy)<0){return}
    }
    let not_blocked = line_to_line_collision_pt(x,y,ox,oy,w.x,w.y,w.x2,w.y2)
    if(not_blocked!==false){los=false}
  })
  return(los)
}




////////// end game engine functions

class Acceleration{
  constructor(){
    this.dict = {}
    this.dynamicDict = new Map()
    this.sum = {x:0,y:0}
  }

  set(x,y,name){
    this.dict[name] = {x,y}
    this.recalculate()
    return(this)
  }

  setDynamic(f,name){
    this.dynamicDict.set(name,f)
  }

  recalculate(){
    this.sum = {x:0,y:0}
    Object.values(this.dict).forEach((e)=>{
      this.sum.x += e.x
      this.sum.y += e.y;
    })
  }

  getSum(){
    let out = {...this.sum}
    this.dynamicDict.forEach((e)=>{
      let tmp = e();
      out.x += tmp.x
      out.y += tmp.y
    })
    return(out)
  }
}





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
    this.colorDest = [0,18.6,50]
    this.ctx = ctx

    this.name = "dummy" 
    this.updateFuncs = []
    this.drawFuncs = []
    this.onDeath = []
    this.onJump = []

    this.tags = new Set()
    this.id = id.gen()
    this.hp = 100
    this.maxHp = 100
    this.hpRegen = 0.002
    this.damageMultiplier = 1
    this.permanentDamageMultiplier = 1
    this.maxTakenDamagePercentage = 1.1 // so that overkills are allowed



    this.collisionInitiative = 1500

    this.wallBreakMultiplier = 0.1

    this.energy = 100
    this.maxEnergy = 100
    this.maxEnergySpend = 40
    this.energyRegen = 0.01
    this.energenin = 0

    this.wallJumpEnergy = 5

    this.jumpForceMultiplier = 1 // this uses energy
    this.jumpPower = 1 // this is a multiplier, does not use energy

    this.lastJumpTime = 0
    this.lastCollideWallTime = 0
    this.lastCollideBallTime = 0

    this.collideBallTime = 0
    this.damageTime = 0

    this.losDistanceSq = 1400**2

    if(AI){
      this.AIinit()
    }

    this.sidedWallEntryFrame = {}

    this.movementSpeed = 0.005

    this.effects = new effects(this)


    this.friction = 1
    this.bounce = 1
    this.elasticity = 0.9

    this.resetAccelerations()

    grid.addPt(this.x,this.y,()=>{this.activate()},grid.activationGrid)
    grid.addChunk(this.x-r,this.y-r,this.x+r,this.y+r,this,grid.entityGrid)

  }


  resetAccelerations(){
    this.accel = new Acceleration()
    this.accel.set(0,gameWorld.gravity,"gravity")

    this.decel = new Acceleration()
    this.decel.set(gameWorld.airFriction,gameWorld.airFriction,"air friction")
  }


  initPath(){
    // this.path = {at:0, trail:[{x:this.x,y:this.y}],lastVisiblePathPt:{x:this.x,y:this.y}}
    this.path = {x:this.x,y:this.y,to:[]}
    this.lastVisiblePathPt = {x:this.x,y:this.y}
  } // the problem is that this branches.


  pathTo(){
    let at = this.path
    let los = AIlos(at.x,at.y,this.x,this.y)

    if(los){
      this.path.lastVisiblePathPt = {x:this.x,y:this.y}
      return
    } // not here anymore. otherwise: where am i


    /// otherwise: generate new path
    let lastAt = this.path.lastVisiblePathPt
    let fallbackLos = AIlos(lastAt.x,lastAt.y,this.x,this.y)
    if(fallbackLos){
      this.path.trail.push(lastAt)
      this.path.at = this.path.trail.length-1
    }
  }

  shadow(ball){
    let traits = ["x","y","vx","vy","r","color","colorDest"] // theres a problem with inheriance here
    traits.forEach((e)=>{
      this[e] = ball[e]
    })
  }


  respawn(check){

    particleFuncs.respawn(check.x,check.y,this)

    let d = camera.addDestination(check.x,check.y,0)
    
    gameWorld.TO(1000,(e)=>{
      this.tags.delete("isDead")
      this.tags.delete("nodraw")
      this.tags.delete("noCollideWall")
      this.tags.delete("noCollideBall")
      this.hp = this.maxHp
      this.x = check.x
      this.y = check.y
      this.vx = 0
      this.vy = -0.1
      d.done=true
      e.done=true
    })
        
  }


  jump(vx,vy,mag){
    if(this.tags.has("isDead")){return}

    let origSpeed = this.speedSq()

    mag*= this.jumpForceMultiplier


    let norm = normalize(vx,vy)
    let actualForce = distance(vx,vy)*mag
    let spentEnergy = actualForce*30

    if(spentEnergy>this.maxEnergySpend){
      mag *= this.maxEnergySpend/spentEnergy
      spentEnergy = this.maxEnergySpend
    }

    if(this.minEnergySpend && spentEnergy < this.minEnergySpend){
      if(this.energy < this.minEnergySpend){return}

      spentEnergy = this.minEnergySpend
      mag *= spentEnergy/this.minEnergySpend
    }

    this.energy -= spentEnergy
    if(this.energy<0){

      let energyPenalty = (spentEnergy+this.energy)/spentEnergy
      mag*=energyPenalty
      spentEnergy += this.energy
      this.energy = 0

    }

    if(this.tags.has("enerjitsu")){
      let d = dot(this.vx,this.vy,norm.x,norm.y)
      if(d<0){
        this.vx -= norm.x * d
        this.vy -= norm.y * d
      }
    }

    mag *= this.jumpPower

    this.force(vx,vy,mag)
    this.lastJumpTime = gameWorld.lastTime


    this.onJump?this.onJump.forEach((f)=>{f(this,spentEnergy,origSpeed)}):0

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

  //@damage ball
  damage(dmg,options={}){
    let lastCollideBallTime = gameWorld.lastTime==this.collideBallTime?this.lastCollideBallTime:this.collideBallTime

    let damagePercentage = Math.min((gameWorld.lastTime-lastCollideBallTime)/this.collisionInitiative,1)

    dmg *= damagePercentage
    dmg = Math.min(dmg*damagePercentage,this.maxHp*this.maxTakenDamagePercentage)

    if(this.armor && !this.armor.broken){
      let blocked = this.armor.protection*dmg
      this.armor.hp -= blocked
      if(this.armor.hp <= 0){
        blocked += this.armor.hp
        this.armor.broken = true
      }
      if(blocked < 0 ){debugger}
      dmg -= blocked
    }

    this.hp -= dmg 
    this.damageTime = gameWorld.lastTime


    if(options.vel===undefined){options.vel=this}
    if(options.contact===undefined){options.contact={x:this.x,y:this.y}; }
      

    let spread = -0.6
    let spread2 = -0.3
    let mult = 0.25

    // // @blood


    let splatter = dmg>this.hp*0.7 && distance(options.vel.vx,options.vel.vy)>2.2

    let bloody = mult*dmg
    if(this.hp < 0 && splatter){bloody*=3}

    for(let i = 0; i < bloody; i++){
      let rnd = rand(1.1)
      setTimeout(()=>{
        new particle(options.contact.x,options.contact.y,this.vx*rnd*(1+rand(spread))+rand(spread2),this.vy*rnd*(1+rand(spread))+rand(spread2))
      },rand(100))
    }

    if(this.hp<0){ // blood spews ONLY on overkill (which is almost always)
      bloody = mult*dmg*100
      let contactV = {x:options.vel.vx,y:options.vel.vy}

      gameWorld.TIL(bloody,(e)=>{
        let timeLeft = e.til - gameWorld.lastTime
        if(timeLeft < 0){e.done=1;return}
          let ratio = timeLeft/bloody
          if(Math.random()>(ratio**6)*0.9+0.1){return}

        let rnd = rand(1.1)
        new particle(this.x,this.y,this.vx*rnd+rand(-0.3*ratio),this.vy*rnd+rand(-0.3*ratio))

        if(rand(0.5) && splatter){
          particleFuncs["bloody explosion"](this.x+rand(-80),this.y+rand(-80),1,rand(500)+1000)
        }
      })


      if(splatter){
      gameWorld.TIL(300,(e)=>{
        let timeLeft = e.til - gameWorld.lastTime
        if(timeLeft < 0){e.done=1;return}
          let ratio = timeLeft/300

        for(let i = 0; i < 3; i++){
          let ang = rand(TAU)
          let r = Lrotate(contactV.x,contactV.y,ang)
          let d = Math.cos(ang)+1.3
          // new particle(options.contact.x + r.x*(1-ratio)*250,options.contact.y + r.y*(1-ratio)*250,r.x/4,r.y/4)
          new particle(options.contact.x +contactV.x*(1-ratio),options.contact.y+contactV.y*(1-ratio),r.x*ratio/3*d,r.y*ratio/3*d)
        }


      })

          particleFuncs["bloody explosion2"](this.x,this.y)
          this.tags.add("nodraw")
          camera.shake += 13
        }
    }


    if(this.hp <= 0){
      this.die()
      return(splatter?"splatter":"normal")
    }
    return(false)
  }

  die(){
    this.tags.add("isDead")
    this.resetAccelerations()

    gameWorld.TO(300,(e)=>{ // might cause some issues
      this.tags.add("noCollideWall")
      e.done=true})
    this.tags.add("noCollideBall")
    // this.vx *= 0.7
    // this.vy *= 0.7
    this.deathTime = Date.now()
    this.onDeath.forEach((f)=>{
      f(this)
    })
  }

  collided(time,by){
    if(time != this.collideTime){
      this.lastCollideBallTime = this.collideBallTime;
      this.collideBallTime = time
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

    if(distance(this.x,this.y,entityList.player.x,entityList.player.y)>grid.size*3){
      this.deactivate()
    }

    if(this.AICustomUpdate){
      this.AICustomUpdate(this,dt)
      return
    }

    /// default behaviour
    let player = entityList.player
    if(this.energy > 40 ){
      // jump towards player
      this.AInextUpdateTime = rand(1000)+1000



      if(AIlos(this.x,this.y,player.x,player.y,this)){
        this.jump(player.x-this.x,player.y-this.y-rand(200),0.003)
      }
    }
  }



  AIinit(){
    this.AIlastUpdate = 0
    this.AInextUpdateTime = 4000 + rand(1000)
    this.home = {x:this.x,y:this.y}
    this.tags.add("AI")
  }


  update(dt){

    if(this.tags.has("AI") && !this.tags.has("isDead")){
      this.AIupdate(dt)
    }



    //natural hp regen
    if(!this.tags.has("isDead")){
      let regenAmt = 0
      regenAmt += this.effects.getValue("regenerative",0)
      if(gameWorld.lastTime - this.damageTime > 2000){// 2 seconds after battle  
        regenAmt += this.hpRegen
        if(gameWorld.lastTime - this.damageTime > 10000 || this.speedSq() < 0.02){
          regenAmt += this.hpRegen*3
        }
      }
      this.hp += regenAmt*dt
      if(this.hp > this.maxHp){
        this.hp = this.maxHp
      } 
    }

    this.damageMultiplier += Math.min((1-this.damageMultiplier)*0.002,0.0001)*dt


    let accel = this.accel.getSum()
    this.vx += accel.x*dt
    this.vy += accel.y*dt



    this.movement()

    let lastX = this.x
    let lastY = this.y
    

    this.x += this.vx*dt + this.push.x
    this.y += this.vy*dt + this.push.y

    // if(distance(this.push.x,this.push.y)>this.r){
    //   console.log("what?")
    // }
    this.push = {x:0,y:0}

    let speed = this.speed()
    let dleng = distance(lastX,lastY,this.x,this.y)

    let sweptWallHit = false

    let collidableWalls;
    if(!this.tags.has("noCollideWall")){
      collidableWalls = grid.query(this.x-3000,this.y-3000,this.x+3000,this.y+3000)
    }

    if(dleng > this.r/2 && !this.tags.has("noCollideWall") ){
      let pseudovx = this.x-lastX
      let pseudovy = this.y-lastY
      if(debug){
        new lineParticle(this.x,this.y,lastX,lastY)
      }
      let collisionData = {"collided":false,"minDist":Infinity}



      collidableWalls.forEach((w)=>{


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


    let decel = this.decel.getSum()
    this.vx *= (1-decel.x*speed)**dt
    this.vy *= (1-decel.y*speed)**dt



    this.wallBreakMultiplier -= (this.wallBreakMultiplier-0.1)*0.0009*dt

    //check wall collisions collide wall
    if(!this.tags.has("noCollideWall")){

      let collisionData = {"collided":false,"minDist":Infinity}

      collidableWalls.forEach((w)=>{

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



    this.energy += (this.energenin + this.effects.getValue("energenerative",0))*dt
    if(this.lastJumpTime < this.lastCollideWallTime){
      this.energy += this.energyRegen*dt
    }
    if(this.energy > this.maxEnergy){
      this.energy = this.maxEnergy
    }

    this.updateFuncs.forEach((f)=>{
      f(this,dt)
    })


  }

  activate(){
    entityList.activatedBalls.add(this)
    this.tags.add("activated")
  }

  deactivate(){
    entityList.activatedBalls.delete(this)
    this.tags.delete("activated")
    grid.addPt(this.x,this.y,()=>{this.activate()},grid.activationGrid)
  }

  draw(){ // @ball draw ball
    if(this.tags.has("nodraw")){return}
    this.ctx.lineWidth = 7
    this.ctx.strokeStyle = "rgb("+this.hp/this.maxHp*255+",20,40)"
    let hpPers = Math.min(Math.max(this.hp/this.maxHp,0),1.4)
    // let l = (50+(this.color[2]-50)*hpPers)
    // let s = this.color[1]*(hpPers*0.7+0.3)
    let l = this.colorDest[2] + (this.color[2] - this.colorDest[2])*hpPers
    let s = this.colorDest[1] + (this.color[1] - this.colorDest[1])*hpPers
    if(this.tags.has("isDead")){l*=0.5; s=0}
    let col = "hsl("+this.color[0]+ "," + s + "%," + l + "%)"
    if(this.colorFunc){
      col = this.colorFunc(this,this.color,s,l)
    }
    this.ctx.fillStyle = col
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.r,0,TAU)
    this.ctx.fill()
    if(!this.tags.has("noDefaultArc")){
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

var wallDontCopy = new Set(["id","tags","events"])
function copyWall(w,w2){
  Object.keys(w).forEach((e)=>{
      if(wallDontCopy.has(e)){return}
      w2[e] = w[e]
    })
  w2.tags = new Set(w.tags)
  w2.events = {...w.events}
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

    this.gridPos = grid.addWall(this)

    this.id = id.gen()

    this.hp = 10 

    this.name = "normal" 
    this.tags = new Set()

    this.brokenVelocityMult = {vx:0.7,vy:0.5}

    this.normal = {x:-(y2-y1)/this.length,y:(x2-x1)/this.length}
    this.normalized = {y:(y2-y1)/this.length,x:(x2-x1)/this.length}
    this.dir = {y:(y2-y1),x:(x2-x1)}
    this.midpoint = {x:(x1+x2)/2,y:(y1+y2)/2}

    this.hp = this.hp + this.hp*Math.abs(dot(this.normalized.x,this.normalized.y,1,0)) // floors should have more HP


    this.damageThreshold = 1

    this.bounce = 0.8
    this.friction = 1
    this.damageMinMult = -Infinity


    this.shatteringDistanceCap = 20

    this.events = {
      "onBreak":[],
      "onCollide":[],
    }
  }

  setPos(x1,y1,x2,y2,move=false){
    this.x = x1
    this.y = y1
    this.x2 = x2
    this.y2 = y2
    this.length = distance(x1,y1,x2,y2)
    this.normal = {x:-(y2-y1)/this.length,y:(x2-x1)/this.length}
    this.dir = {y:(y2-y1),x:(x2-x1)}
    this.normalized = {y:(y2-y1)/this.length,x:(x2-x1)/this.length}
    this.midpoint = {x:(x1+x2)/2,y:(y1+y2)/2}
    if(move){
      this.gridPos.push(...grid.addWall(this))
    } else {
      this.gridPos.forEach((cell)=>{
        cell.delete(this)
      })
      this.gridPos = grid.addWall(this)
    }
  }

  split(s1,s2,by,impactPt){
    let w1 = newWall(this.x,this.y,this.x+s1*this.dir.x,this.y+s1*this.dir.y)
    let w2 = newWall(this.x+s2*this.dir.x,this.y+s2*this.dir.y,this.x2,this.y2) // useless other than not impacting gridpos

    copyWall(this,w1)
    copyWall(this,w2)
    w1.setPos(this.x,this.y,this.x+s1*this.dir.x,this.y+s1*this.dir.y)
    w2.setPos(this.x+s2*this.dir.x,this.y+s2*this.dir.y,this.x2,this.y2)
    w1.hp = 10
    w2.hp = 10

    if(this.splitting.minLength > w1.length){
      w1.break(by,impactPt)
    }
    if(this.splitting.minLength > w2.length){
      w2.break(by,impactPt)
    }


    this.setPos(w1.x2,w1.y2,w2.x,w2.y,true)
    shatterWall(this,by,impactPt)
    this.remove()

  }

  silentSplit(p1x,p1y,p2x,p2y){
    let pt1 = point_on_line(p1x,p1y,this.x,this.y,this.x2,this.y2)
    let pt2 = point_on_line(p2x,p2y,this.x,this.y,this.x2,this.y2)
    let minT = Math.min(pt1.t,pt2.t)
    let maxT = Math.max(pt1.t,pt2.t)
    if(minT === maxT){
      return;
    }


    let w2 = newWall(this.x+maxT*this.dir.x,this.y+maxT*this.dir.y,this.x2,this.y2)
    copyWall(this,w2)
    w2.setPos(this.x+maxT*this.dir.x,this.y+maxT*this.dir.y,this.x2,this.y2)
    this.setPos(this.x,this.y,this.x+minT*this.dir.x,this.y+minT*this.dir.y,true)

    return(w2)
  }

  damage(d,mult,by={vx:0,vy:0},impactPt={x:0,y:0}){

    this.events.onCollide.forEach((e)=>{
      e(this,d,mult,by,impactPt)
    })

    if(this.tags.has("breakable")){mult=Math.max(1,mult)}
    mult = Math.max(mult,this.damageMinMult)
    d*= mult



    if(d < this.damageThreshold){return}
    this.hp -= d
    if(this.hp <= 0){

      if(this.splitting && this.length > this.splitting.minLength){
        let pt = distance(impactPt.x,impactPt.y,this.x,this.y)/this.length
        let breakLength = this.splitting.breakLength?this.splitting.breakLength:this.splitting.minLength

        let pers1 = breakLength/this.length
        let pers2 = breakLength/this.length
        if(this.splitting.breakVariability){
          pers1 *= this.splitting.breakVariability(breakLength)
          pers2 *= this.splitting.breakVariability(breakLength)
        }
        let s1 = minMax(0,pt-pers1,1)
        let s2 = minMax(0,pt+pers2,1)
        this.split(s1,s2,by,impactPt)
      } else {
        this.break(by,impactPt)
      }

      return(true)
    }
    return(false)
  }

  break(by={vx:0,vy:0},impactPt={x:0,y:0},collateral){
    if(this.tags.has("isBroken")){return}
    this.tags.add("isBroken")
    shatterWall(this,by,impactPt)

    this.events.onBreak.forEach((e)=>{
      e(this,by,impactPt)
    })

    if(this.collateral && !collateral){
      this.collateral.forEach((e)=>{
        e.break(by,impactPt,collateral)
      })
    }


    //remove from grid
    this.remove()

  }


  remove(){
    this.tags.add("isBroken")
    this.gridPos.forEach((cell)=>{
      cell.delete(this)
    })
  }

  draw(){


    if(this.tags.has("oneBody") && !this.tags.has("oneBodyRepresentor")){return}
    this.ctx.lineWidth = this.size?this.size:Math.min(Math.max(this.hp**0.5,5),10)
    this.ctx.strokeStyle = this.color
    this.ctx.save()
    if(this.lineDash){
      this.ctx.setLineDash(this.lineDash.sep)
      this.ctx.lineDashOffset = gameWorld.lastTime * this.lineDash.speed
    }






    if(this.tags.has("oneBodyRepresentor")){
      let path = this.oneBodyPath
      this.ctx.stroke(path)

    } else {
      this.ctx.beginPath()
      this.ctx.moveTo(this.x,this.y)
      this.ctx.lineTo(this.x2,this.y2)
      if(this.tags.has("sided")){

        this.ctx.shadowOffsetX = this.normal.x*-1
        this.ctx.shadowOffsetY = this.normal.y*-1
        // this.ctx.shadowColor = `color-mix(in srgb, ${this.ctx.strokeStyle}, white 50%)`
        this.ctx.shadowColor = `hsl(from ${this.ctx.strokeStyle} h s calc(100 - l))`
        // this.ctx.shadowColor = `rgb(255,25,0)`

        this.ctx.stroke() // matching stroke here

        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(this.midpoint.x,this.midpoint.y)
        this.ctx.lineTo(this.midpoint.x+this.normal.x*10,this.midpoint.y+this.normal.y*10)
        this.ctx.stroke()

      } else {
        this.ctx.stroke() // matching stroke here
      }
    }
    this.ctx.restore()

  }
}

function pointOnWall(w,percentage=0.5,off=0){
  return({x:w.x+w.dir.x*percentage  + w.normal.x*off  ,y:w.y+w.dir.y*percentage + w.normal.y*off})
}

//@col handler
function wall_collision_handler(ball,collisionData,dt,type="normal"){

  ball.energy += ball.wallJumpEnergy
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


    // let forceToWall = dot(ball.vx,ball.vy,normalizedDirectionToWall.x,normalizedDirectionToWall.y) // cant be this because then edges deal 0 damage
    let forceToWall = Math.abs(dot(ball.vx,ball.vy,normalizedDirectionToWall.x,normalizedDirectionToWall.y))
    let mult;
    if(ball.tags.has("AI")){mult = w.tags.has("AIdamage")?3:0.2} else {mult = ball.wallBreakMultiplier}
    let wallBroken = w.damage(forceToWall,mult, ball, closest)

    if(wallBroken){ball.vx*=w.brokenVelocityMult.vx;ball.vy*=w.brokenVelocityMult.vy;ball.lastCollideWallTime = gameWorld.lastTime;return}

    let reflectionVector = normalizedDirectionToWall

    let reflection = reflect(ball.vx,ball.vy,reflectionVector.x,reflectionVector.y)
    // ball.vx = reflection.x * w.bounce
    // ball.vy = reflection.y * w.bounce

    let normalizedDirectionToWall90d = {x:normalizedDirectionToWall.y,y:-normalizedDirectionToWall.x}

    // let refBounce = dot(reflection.x,reflection.y,w.normal.x,w.normal.y) * w.bounce
    // let refFriction = dot(reflection.x,reflection.y,w.normalized.x,w.normalized.y) * w.friction

    // ball.vx = refBounce * ball.bounce * w.normal.x + refFriction * ball.friction * w.normalized.x
    // ball.vy = refBounce * ball.bounce * w.normal.y + refFriction * ball.friction * w.normalized.y


    let refBounce = dot(reflection.x,reflection.y,normalizedDirectionToWall.x,normalizedDirectionToWall.y) * w.bounce
    let refFriction = dot(reflection.x,reflection.y,normalizedDirectionToWall90d.x,normalizedDirectionToWall90d.y) * w.friction

    ball.vx = refBounce * ball.bounce * normalizedDirectionToWall.x + refFriction * ball.friction * normalizedDirectionToWall90d.x
    ball.vy = refBounce * ball.bounce * normalizedDirectionToWall.y + refFriction * ball.friction * normalizedDirectionToWall90d.y




    //push ball out of wall (good enough for now, fix later, bleeding E)

    if(type === "swept" && collisionData.sweepResponse.type===1){
      ball.x = collisionData.p.x
      ball.y = collisionData.p.y

    } else { // normal
      let overlap = ball.r - dist + 0.000005 // brute fix // refer to note about collision types 3
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
        crossParticle(p.x,p.y)
        crossParticle(closest.x,closest.y,[255,255,0])

        lp = new lineParticle(p.x,p.y,p.x-reflectionVector.x*200,p.y-reflectionVector.y*200)
        lp.color = [255,255,0]

        lp = new lineParticle(p.x,p.y,p.x-old.vx*200,p.y-old.vy*200)
        lp.color = [0,255,0]
        if(test.expect(distance(reflectionVector.x,reflectionVector.y),1)){debugger}
      }

    ball.lastCollideWallTime = gameWorld.lastTime

}


class iconDrawer{
  static draw(sprite,x,y,ctx=can.ctx,options={}){
      if(sprites.dict[sprite]){ // optimizable
      let s = sprites.dict[sprite]
      ctx.save()

      if(options.dash){
        ctx.setLineDash(options.dash.ld)
        ctx.lineDashOffset = gameWorld.frame*options.dash.offset
      }

      ctx.translate(x,y)
      let path = this.getPath(sprite,options)
      ctx.stroke(path)

      ctx.restore()
    }
  }

  static getPath(sprite,options={size2:80}){
    if(sprites.dict[sprite]){
      let s = sprites.dict[sprite]
      if(!s.type){
        let p = new Path2D()
        let ratio = options.size2/400
        p.moveTo(s[0][0]*ratio,s[0][1]*ratio)
        for(let i = 1; i < s.length; i++){
          p.lineTo(s[i][0]*ratio,s[i][1]*ratio)
        }
        p.closePath()
        return(p)
      } else if(s.type === "svg"){
        return(new Path2D(s.svg))
      }

    }
  }
}



class effects{

  static effectOptions = {
    checkpoint:{
      "stackable":true,
      "nodraw":true,
      "triggerFunc":(data,entity)=>{
          let check = data
          let camDest = camera.addDestination(check.x,check.y,30)
          camDest.arrive.push( ()=>{entity.respawn(check)} )
      }
    },
    energenerative:{
      "backgroundColor":"#4090A0",
      "sprite":{path:iconDrawer.getPath("energenin"),color:"blue"},
      "timeToValue":(timeLeft)=>{
        return 0.00001*timeLeft
      }
    },
    regenerative:{
      "backgroundColor":"#A02040",
      "timeToValue":(timeLeft)=>{
        return 0.0001*(timeLeft**0.5)
      }
    },
  }

  constructor(entity){
    this.active = {}
    this.entity = entity
  }

  addEffect(name,data={}){

    if(!effects.effectOptions[name]){console.warn("effect doesnt exist");return("doesnt exist")}

    if(effects.effectOptions[name].stackable){
    if(!this.active[name]){
      this.active[name] = {}
    }
      if(!this.active[name].stacks){
        this.active[name].stacks = []
      }
      this.active[name].stacks.push(data)
      return
    }
    // if its not stackable, its a timed effect
    if(!this.active[name]){
      this.active[name] = {duration:0,maxDuration:0}
    }
      let {duration=1000,start=gameWorld.lastTime,...extraData} = data
      let effect = this.active[name]
      effect.duration += duration
      effect.start = effect.start===undefined?start:effect.start
      effect.maxDuration = Math.max(effect.maxDuration, effect.start+effect.duration-gameWorld.lastTime)
      effect.data = extraData

  }

  trigger(name){
    if(!this.active[name]){return}
    if(this.active[name].stacks){
      if(this.active[name].stacks.length === 0){return}
      let data = this.active[name].stacks.pop()
      effects.effectOptions[name].triggerFunc(data,this.entity)
    }
  }

  getValue(name,noEffect=1){
    let effect = this.active[name]
    if(effects.effectOptions[name].stackable){
      if(!effect){return} // dont return noeffect; stack logic is different from timed logic, maybe change later;
      if(effect.stacks){
        return effect.stacks.length
      }
    }
    if(!effect){return noEffect}
    let timeLeft = effect.start + effect.duration - gameWorld.lastTime
    if(timeLeft <= 0){
      this.remove(name)
      return noEffect
    }
    if(effects.effectOptions[name].timeToValue){
      return effects.effectOptions[name].timeToValue(timeLeft)
    } else {
      return(timeLeft)
    }
  } 
  getValueRatio(name){
    let effect = this.active[name]
    if(!effect){return 0}
    if(effects.effectOptions[name].stackable){return(1)}
    let timeLeft = (effect.start + effect.duration - gameWorld.lastTime)/effect.maxDuration
    if(timeLeft <= 0){ this.remove(name);return 0}
    return timeLeft
  }

  remove(name){
    delete this.active[name]
  }
}




class item{
  constructor(x,y,name="default item",ctx=can.ctx){
    this.x = x
    this.y = y
    this.ctx = ctx
    this.type="item"

    this.name = name

    this.onPickup = []

    this.chunk = grid.addPt(x,y,this,grid.miscGrid)
    this.size = 40
    this.size2 = this.size*2
    this.rounding = 8

    this.pickupProgress = 0
    this.pickupSpeed = 1
    this.color = [150,190,190]
    this.links = new Set()

  }

  pickup(by,nodraw){
    this.onPickup.forEach((f)=>{
      f(by)
    })
    if(!nodraw){
      new itemShellParticle(this)
    }
    this.remove()
  }
  remove(l){
    this.chunk.delete(this)
    if(!l){this.links.forEach((e)=>{
      e.remove(true)
    })}
  }

  link(item){
    this.links.add(item)
    item.links.add(this)
  }

  draw(dt){

    this.pickupProgress -= 0.05*dt
    if(this.pickupProgress < 0){this.pickupProgress = 0}

    this.ctx.fillStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+(0.2+0.8*(1-this.pickupProgress/100))+")"
    this.ctx.beginPath()
    let y = this.y + Math.sin(gameWorld.lastTime/400)*5
    this.ctx.roundRect(this.x-this.size,y-this.size,this.size2,this.size2,this.rounding)
    this.ctx.fill()
    if(sprites.dict[this.name]){ // optimizable
      this.ctx.lineWidth = 4
      this.ctx.strokeStyle = "hsl("+((gameWorld.lastTime/100 )%360)+",50%,30%)"
      iconDrawer.draw(this.name,this.x,y,this.ctx,this)
    }
  }
}



class orb{
  constructor(x,y,name="default orb",ctx=can.ctx){
    this.x = x
    this.y = y
    this.ctx = ctx
    this.type="orb"

    this.name = name

    this.onPickup = []
    this.color = "rgb(225,205,0)"

    this.chunk = grid.addPt(x,y,this,grid.miscGrid)

  }

  pickup(by){
    this.onPickup.forEach((f)=>{
      f(by)
    })
    this.chunk.delete(this)
  }

  draw(dt){
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y+Math.sin(gameWorld.lastTime/200)*12,10,0,TAU)
    this.ctx.fill()
  }
}





class particleInstance{
  constructor(life=1000){
    this.life = life
    particles.push(this)
  }

  update(dt){
    this.life -= dt
    if(this.life <= 0){
      return("del")
    }
  }

  get lifeSetter(){
    return(this.life)
  }
  set lifeSetter(x){
    this.life = x
    this.maxLife = Math.max(this.life,this.maxLife)
  }
}


class explosionParticle extends particleInstance{
  constructor(x,y,size=()=>{return(25)},width=()=>{return(2)},color=()=>{return("rgb(255,0,255")},life=1000){
    super(life)
    this.z=1
    this.x = x
    this.y = y
    this.color = color
    this.size = size
    this.width = width
    this.maxLife = this.life
    this.ctx = can.ctx
    this.noFill = true

  }

  draw(){
    let lifePers = this.life/this.maxLife
    this.ctx.strokeStyle = this.color(lifePers,this)
    this.ctx.lineWidth = this.width(lifePers,this)
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.size(lifePers,this),0,TAU)
    this.ctx.stroke()
    if(this.fill){
      this.ctx.fillStyle = this.fill(lifePers,this)
      this.ctx.fill()
    }
  }
}




class particle extends particleInstance{
  constructor(x,y,vx,vy,life=1000){
    super(life)

    this.z=1

    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.ay = gameWorld.gravity/2 * (1+rand(-0.25))
    this.color = [100+rand(120),0,0]
    this.size = 5 + rand(10)
    this.life = life + rand(3)*life
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
    this.ctx.arc(this.x,this.y,this.size,0,TAU)
    if(!this.noFill){
      this.ctx.fill()
    } else{
      this.ctx.strokeStyle = this.ctx.fillStyle
      this.ctx.lineWidth = 3
      this.ctx.stroke()
    }
  }
}

class crazyParticle extends particleInstance{
      constructor(x,y,life=25000){
    super()

    this.z = 1
    this.life = life
    this.ctx = can.ctx
  }

  draw(){
    let aabb = gameWorld.viewAABB

    for(let i = 0; i < 200; i++){
      this.ctx.save()
      let pos = {x:aabb[0]+rand(aabb[2]-aabb[0]),y:aabb[1]+rand(aabb[3]-aabb[1])}
      let d = dist(entityList.player,pos)
      // pos.x -= (pos.x%150)
      // pos.y -= (pos.y%150)
      this.ctx.translate(pos.x,pos.y)
      this.ctx.rotate(rand(TAU))
      this.ctx.fillStyle = `rgba(${Math.floor(d/15)},0,0,${Math.min(0.2,this.life/50000)})`

      this.ctx.fillRect(0,0,200+rand(350),200+rand(350))

      this.ctx.restore()
    }

  }
}


class sparkParticle extends particleInstance{
    constructor(x,y,corners=10,life=1500){
    super()

    this.z = 1

    this.x = x
    this.y = y
    this.color = [255,255,255]
    this.size = 15
    this.radius = 23
    this.life = life
    this.maxLife = this.life
    this.ctx = can.ctx
    this.rotation = 0
    this.rotSpeed = rand(-0.1)

    this.star = []
    for(let i = 0; i < corners-1; i++){
      this.star.push(rand()*TAU)
    }
    //sort
    this.star.sort((a,b)=>{return a-b})
    // let ratio = TAU/this.star[this.star.length-1]
    this.star.forEach((e,i)=>{
      this.star[i] = {ang:e,len:this.radius+rand(this.radius*3)}
    })
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
    this.ctx.save()
    this.ctx.translate(this.x,this.y)
    this.ctx.rotate(this.rotation)

    let ang = 0
    this.ctx.moveTo(0,-this.radius)
    for(let i = 0; i < this.star.length; i++){
      let s = this.star[i]
      let wid = Math.max(s.ang-ang,1)
      let rot = Lrotate(0,-this.radius-s.len*wid,(s.ang+ang)/2)
      this.ctx.lineTo(rot.x,rot.y)
      rot = Lrotate(0,-this.radius,s.ang)
      this.ctx.lineTo(rot.x,rot.y)
      ang=s.ang
    }
    let s = this.star[this.star.length-1]
    let wid = Math.max(TAU-s.ang,1)
    let rot = Lrotate(0,-this.radius-s.len*wid,(s.ang)/2+Math.PI)
    this.ctx.lineTo(rot.x,rot.y)

    this.ctx.closePath()
    
    this.ctx.fill()
    this.ctx.restore()

  }
}

class sparkleParticle extends particleInstance{
  constructor(x,y,life=1000){
    super()

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


function shatterWall(wall,by,impactPt){
    let dx = wall.x2 - wall.x
    let dy = wall.y2 - wall.y
    let seg = 0
    ///
    let shatterProb = 0.2
    if(wall.shattering !== undefined){
      if(wall.shattering.type === "perLength"){
        shatterProb = wall.shattering.length/wall.length
      }
    }

    let nextSeg = Math.random()*shatterProb
    while(nextSeg < 1){
      new shatteredWallParticle(wall,wall.x+dx*seg,wall.y+dy*seg,wall.x+dx*nextSeg,wall.y+dy*nextSeg,by.vx,by.vy,impactPt,nextSeg-seg)
      seg = nextSeg
      nextSeg = seg + Math.random()*0.2
    }
    new shatteredWallParticle(wall,wall.x+dx*seg,wall.y+dy*seg,wall.x2,wall.y2,by.vx,by.vy,impactPt,1-seg)
}

class shatteredWallParticle extends particleInstance{
  constructor(wall,x1,y1,x2,y2,vx,vy,impactPt,lengthPers,life=4000){
    super()
    this.z = 1
    this.wall = wall
    this.x = (x1+x2)/2
    this.y = (y1+y2)/2
    this.dx = (x2-this.x)
    this.dy = (y2-this.y)

    this.length = lengthPers*wall.length

    let dp = distance(this.x,this.y,impactPt.x,impactPt.y)

    if(wall.shatterDistanceMultiplier){
      dp *= wall.shatterDistanceMultiplier
    }

    let sdc = wall.shatteringDistanceCap

    this.distToShatteringPt = Math.max(dp,sdc)

    this.vx = vx / this.distToShatteringPt * 20
    this.vy = vy / this.distToShatteringPt * 20



    this.color = wall.color
    this.lineWidth = wall.size?wall.size:5

    this.ctx = can.ctx
    this.rotation = rand(-12.5/this.length)
    this.life = life

    if(wall.shatteringFunc){
      let r = wall.shatteringFunc(this)
    }
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
    this.ctx.save()

    if(this.wall.lineDash){
      this.ctx.setLineDash(this.wall.lineDash.sep)
      this.ctx.lineDashOffset = 0
    }

    this.ctx.beginPath()
    this.ctx.moveTo(this.x-dx,this.y-dy)
    this.ctx.lineTo(this.x+dx,this.y+dy)
    this.ctx.stroke()
    this.ctx.restore()
  }
}

class itemShellParticle extends particleInstance{
  constructor(item,life=4000){
    super()
    this.z = 1
    this.item = item
    this.life = life
    this.maxLife = this.life
    this.lineWidth = 5
    this.pickupTime = gameWorld.lastTime

    this.item.y = this.item.y + Math.sin(gameWorld.lastTime/400)*5
    this.ctx = this.item.ctx
  }
  draw(){
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = "hsla("+rand(260)+",100%,50%,"+(this.life/this.maxLife)+")"
    this.ctx.beginPath()
    this.ctx.roundRect(this.item.x-this.item.size,this.item.y-this.item.size,this.item.size2,this.item.size2,this.item.rounding)
    this.ctx.stroke()


    if(sprites.dict[this.item.name]){ // optimizable
      this.ctx.lineWidth = 4
      this.ctx.strokeStyle = "hsla("+rand(260)+",100%,50%,"+(this.life/this.maxLife)+")"
      iconDrawer.draw(this.item.name,this.item.x,this.item.y,this.ctx,this.item)
    }

  }
}

class lineyParticle extends particleInstance{
  constructor(x,y,life=1000,colorFunc=(l)=>{return(`rgb(0,${255*l},${255*l})`)},ctx=can.ctx){
    super()
    this.x = x; this.y = y;
    this.vx = this.vy = 0;
    this.life = life
    this.tail = []
    this.tailLength = 200

    this.colorFunc = colorFunc
    this.ctx = ctx
    this.size = 4

    this.updateStall = 0
    this.nextUpdate = 0

    this.speed = 1
  }
  
  update(dt){
    if(this.life <= 0){
      this.tail.splice(0,1)
      if(this.tail.length==0){
        return("del")
      }
      return;
    }

    this.life -= dt/16 // must be here

    if(gameWorld.lastTime > this.nextUpdate){
      this.nextUpdate = gameWorld.lastTime + this.updateStall
    } else {
      return
    }

    
    //make tail
    
    this.tail.push([this.x,this.y])
    
    //update phys
    this.x += this.vx
    this.y += this.vy
    
    this.vx += rand(-this.speed)
    this.vy += rand(-this.speed)
    
    while(this.tail.length>this.tailLength){
      this.tail.splice(0,1)
    }
  }
  
  draw(){
    this.ctx.lineWidth = this.size
    for(let i = this.tail.length-2; i > -1; i--){
      let e = this.tail[i]
      let t = this.tail[i+1]

      let l = 1-(i+1)/this.tail.length
      this.ctx.strokeStyle = this.colorFunc(l)
      this.ctx.beginPath()
      this.ctx.moveTo(e[0],e[1])
      this.ctx.lineTo(t[0],t[1])
      this.ctx.stroke()
    }
  }
}



class rectParticle extends particleInstance{
  constructor(x,y,x2,y2,life=5000){
    super()
    this.z = 2

    // if(x===undefined){
    //   [x,y,x2,y2] = gameWorld.viewAABB
    // }

    this.x = x
    this.y = y
    this.w = x2-x
    this.h = y2-y

    this.color = [255,255,255]

    this.ctx = can.ctx
    this.life = life
    this.maxLife = life
  }

  draw(){
    this.ctx.fillStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+(this.life/this.maxLife)+")"
    this.ctx.fillRect(this.x,this.y,this.w,this.h)
  }
}

class lineToParticle extends particleInstance{
  constructor(x,y,x2,y2,life=1000){
    super()
    this.z = 1

    this.x = x
    this.y = y
    // this.x2 = x2
    // this.y2 = y2

    // this.vx = this.x2-this.x
    // this.vy = this.y2-this.y
    this.vx = x2
    this.vy = y2

    this.color = [255,255,255]
    this.lineWidth = 6

    this.ctx = can.ctx
    this.life = life
    this.maxLife = life
  }

  ratio(x){
    return([Math.min(x*3,1),x**6])
  }

  draw(){
    this.ctx.lineWidth = this.lineWidth
    let lifePers = this.life/this.maxLife
    this.ctx.strokeStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+0.5+")"
    let [r1,r2] = this.ratio(1-lifePers)
    this.ctx.beginPath()
    this.ctx.moveTo(this.x+this.vx*r1,this.y+this.vy*r1)
    this.ctx.lineTo(this.x+this.vx*r2,this.y+this.vy*r2)
    this.ctx.stroke()

  }
}


class lineParticle extends particleInstance{
  constructor(x,y,x2,y2,life=1000){
    super()
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
}


class entityList{
  static balls = new Set()
  static walls = []

  static activatedBalls = new Set()
  static activatedWalls = new Set()

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
      if(l!==layer){return}
      p.draw()
    })
  }

  static push(p){
    this.list.push(p)
  }
}


class pauseMenu{


  static sliderValues = {}

  static init(){




    //     <button id="muteButton">
    //         Sound: ON
    //     </button>

    //     <button class="exit" id="exitButton">
    //         Exit Menu
    //     </button>


  this.pauseButton = document.createElement("button")
  this.pauseButton.onclick = ()=>{
    if(gameWorld.paused){
      gameWorld.unpause()
    } else {
      gameWorld.pause()
    }
  }
  this.pauseButton.innerText = "⏸"
  Object.assign(this.pauseButton.style,{
    width:"30px",
    height:"30px",
    borderRadius:"5px",
    position:"absolute",
    display: "inline-flex",
    alignItems: "center",
    justifyContent:"center",
    top:"0px",
    right:"var(--safe-right)"
  })

  document.body.appendChild(this.pauseButton)


  this.menu = document.createElement("div")
  this.menu.id = "pauseMenu"
  document.body.appendChild(this.menu)
  this.card = document.createElement("div")
  this.card.classList.add("pause-card")
  this.menu.appendChild(this.card)

  let title = document.createElement("h1")
  title.innerText = "Paused"
  this.card.appendChild(title)

  this.makeSlider("sensitivity",(x)=>{
    entityList.player.jumpForceMultiplier = x/25
  },{
    value:25
  }
  )

  }

  static makeSlider(name,f,init={}){
    let sel = document.createElement("div")
    sel.classList.add("selection")
    let lab = document.createElement("label")
    lab.appendChild(document.createTextNode(name+": "))
    let span = document.createElement('span');
    span.id = name+'Label';
    lab.appendChild(span)
    sel.appendChild(lab)


    let d = Object.assign({
      type:"range",
      id:name+"Slider",
      min:0,
      max:100,
      value:50
    },init)
    span.textContent = d.value;
    console.log(d)
    let inp = Object.assign(document.createElement("input"),d)
    sel.appendChild(inp)

    this.card.appendChild(sel)

    inp.addEventListener("input",()=>{

        this.sliderValues[name] = Number(inp.value);
        f(this.sliderValues[name])
        span.textContent = this.sliderValues[name];

    });

    let ex = document.createElement("button")
    ex.classList.add("exit")
    ex.id = "exitButton"
    ex.innerText = "Unpause"
    ex.onclick = ()=>{gameWorld.unpause()}
    this.card.appendChild(ex)

  }

  static open(){
    this.menu.classList.add("open");
  }

  static close(){
    this.menu.classList.remove("open");
  }
}

pauseMenu.init()

class gameWorld{
    static gravity = 0.001
    static airFriction = 0.0003
    static lastTime = 0
    static lastDrawTime = 0
    static dt = 16

    static timeWarp = 1
    static frame = 0

    static viewAABB = [0,0,Width,Height]

    static timeOuts = []
    static paused = false

    static TO(time,func){
      time = this.lastTime + time
      let p = {t:time,f:func,til:Infinity}
      this.timeOuts.push(p)
      return(p)
    }

    static TIL(time,func){
      time = this.lastTime + time
      let p = {t:0,f:func,til:time,wait:true}
      this.timeOuts.push(p)
      return(p)
    }



    static tick(){
      for(let i = this.timeOuts.length - 1; i>-1; i--){
        let e = this.timeOuts[i]
        if(this.lastTime < e.t){continue} // not running yet
        e.f(e)
        if(!e.wait || e.done){
          this.timeOuts.splice(i,1)
        }
      }
    }

  static togglePause(){
    if(this.paused){
      this.unpause()
    } else {
      this.pause()
    }
  }

  static pause(){
    this.timeWarp = 0
    this.paused = true
    pauseMenu.open()
  }

  static unpause(){
    this.paused = false
    pauseMenu.close()
  }

}

class controller{
  static mouseDownPos = {x:0,y:0}
  static mouseIsDown = false

  static keys = {}

  static dv = {x:0,y:0}

  static activeTouches = {}
  static movement = {down:false}


  static UI = {"shotDashOffset":0}

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
  static shake = 1
  static pos = {x:0,y:0}
  static destination = {x:0,y:0}

  static destinations = []

  static getDestination(){
    if(this.destinations.length < 1){
      this.destination = {x:entityList.player.x,y:entityList.player.y}
    } else {
      this.destination = this.destinations[this.destinations.length-1]

      let d = distance(this.destination.x,this.destination.y,this.pos.x,this.pos.y)
      if(d < this.destination.r || this.destination.done){
        this.destinations.pop()
        if(this.destination.arrive){
          this.destination.arrive.forEach((f)=>{
            f()
          })
        }
      }

    }
  }

  static addDestination(x,y,r=30){
    let dest = {x:x,y:y,r:r,arrive:[]}
    this.destinations.push(dest)
    return(dest)
  }

}


class settings{
  static startDate = performance.now()
  static speedZoom = 2 // works anywhere from 2 (insane) to 12 (mild)
  static mobile = 0
  static relativeSize = (Height+Width)/3723
  static dragSensitivity = 1.5
  static mobileSensMultiplier = 1.9
  static offline = true

  static RAF = false;
  static dualRAF = true;

  static insets = {top:0,right:0,bottom:0,left:0}

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


function allBallsCollide(time,i,ballList){


    for(let j = i-1; j > -1; j--){

        let a = ballList[i]
        let b = ballList[j]

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

          let initiator;

          if(dmgA>dmgB){
            dmgB*=0.5
            initiator = a
          } else {
            dmgA*=0.5
            initiator = b
          }
          dmgA *= a.damageMultiplier * a.permanentDamageMultiplier
          dmgB *= b.damageMultiplier * b.permanentDamageMultiplier




          //particles A
          let spread = -0.6
          let spread2 = -0.3
          let mult = 0.25

          // let forceMultiplier = dot(a.vx,a.vy,normalizedVectorTo.x,normalizedVectorTo.y) * a.mass - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)* b.mass
          let forceMultiplier = dot(a.vx,a.vy,normalizedVectorTo.x,normalizedVectorTo.y) * massRatio - dot(b.vx,b.vy,normalizedVectorTo.x,normalizedVectorTo.y)* massRatio
          forceMultiplier *= initiator.elasticity
          let forceTo = {x:forceMultiplier * normalizedVectorTo.x,y:forceMultiplier * normalizedVectorTo.y}
          



          // a.forceM(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier)
          // b.forceM(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier)

          // let killed_a = killed_b = false
          let killed_b = b.damage(dmgA,{contact:contactPoint,vel:a})
          let killed_a = a.damage(dmgB,{contact:contactPoint,vel:b}) // super skeptical if blood is effected by order of forceM and damage
          // console.log(normalizedVectorTo.x,forceMultiplier,a.vx,b.vx,a.x,b.x)




          let killed = killed_a||killed_b

          if(!killed || killed_a && killed_b){
            a.forceM(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier)
            b.forceM(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier)
          } else { // only one ball died
            let dead = killed_a?a:b
            if(killed==="normal"){
              a.forceM(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier)
              b.forceM(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier)
              dead.vx *= 0.7
              dead.vy *= 0.7
            }else{
              if(killed_a){
                a.forceM(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier * 0.7)
                // b.forceM(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier/1.5)
                b.vx *= 1/(1+forceMultiplier/1.6) // higher num = less friction
                b.vy *= 1/(1+forceMultiplier/1.6)
              }
              if(killed_b){
                // a.forceM(normalizedVectorTo.x,normalizedVectorTo.y,-forceMultiplier/1.5)
                b.forceM(normalizedVectorTo.x,normalizedVectorTo.y,forceMultiplier * 0.7)
                a.vx *= 1/(1+forceMultiplier/1.5)
                a.vy *= 1/(1+forceMultiplier/1.5)
              }
            }
          }




          let p = new particle(b.x,b.y,0,0)
          p.life = 15*dmgB
          p.color = [255,10,12]
          p.ay = 0
          p.size = b.r+2
          p.noFill = 1

          p = new particle(a.x,a.y,0,0)
          p.life = 15*dmgA
          p.color = [255,10,12]
          p.ay = 0
          p.size = a.r+2
          p.noFill = 1
          
          




          //push balls out of each other (good enough for now, fix later, bleeding E)

          let overlap = a.r + b.r - dist
          if(overlap > 0 && !killed){
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
  static smoothnessIndicator = false


  static still(){
    entityList.balls.forEach((e)=>{e.hp=e.maxHp=400000;e.tags.delete("AI")});entityList.activatedWalls.forEach((e)=>{e.hp=e.maxHp=400000});entityList.player.energyRegen = 400
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

    newWall(-140,0,240,0);

    
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
      p.life *= 5
    },200)
  }
  static slower = 1;

  static toGen(){
      entityList.player.x = this.generateEnd.x
      entityList.player.y = this.generateEnd.y
      camera.pos.x = entityList.player.x
      camera.pos.y = entityList.player.y
      entityList.player.movementScalar *= 10
  }

  static otherBall(){
    let arr = Array.from(entityList.activatedBalls)
    let x;
    arr.forEach((e)=>{
      if(e !== entityList.player){x=e}
    })
    return(x)
  }
}




class mobileDebug{
  static active = false
  static logStr = ""
  static reset(){
    this.logStr=""
  }
  static log(x){
    this.logStr += ", "+x
  }
}







 function build(x,y,x1,y1,type="normal",options={}){

    let w;

    let out = []

    let dir = 1
    if(options.reverse){dir*=-1}
    if(options.mirroredReverse && options.alreadyMirrored){dir*=-1}

    if(dir===1){
      w = newWall(x,y,x1,y1,options.ctx)
     } else {
      w = newWall(x1,y1,x,y,options.ctx)
     }


    w.name = type
    out.push(w)
    if(options.mirrorX !== undefined && !options.alreadyMirrored){
      let midX = options.mirrorX
      options.alreadyMirrored = true
      out = out.concat(build(midX+midX-x1,y1,midX+midX-x,y,type,options))
    }
    w.splitting = options.splitting
    let types = {
      "magma":()=>{
        w.color = "orange"
        w.size = 16
        w.events.onCollide.push((w,d,mult,b,impactPt)=>{b.damage(45)})
      },
      "wood":()=>{
        makeWooden(w)
      },
      "crate wood":()=>{
        w.color = "#bd8620"
        w.size = 10
        w.tags.add("breakable")
        w.tags.add("wooden")
        w.shattering = {type:"perLength",length:240}
        w.damageThreshold *= 0.1
        w.brokenVelocityMult = {vx:0.87,vy:0.87}
        // w.shatterDistanceMultiplier = 0.05
        w.shatteringDistanceCap = 70

      },
      "accelerator":()=>{
        w.color = "rgba(50,160,240,0.8)"
        w.lineDash = {sep:[25,15],speed:0.4}
        w.events.onCollide.push((w,d,mult,b,impactPt)=>{b.force(w.normalized.x,w.normalized.y,-1.3)})
      },
      "glass":()=>{
        w.color = "rgba(40,140,220,0.6)"
        w.size = 10
        w.hp = 1
        w.damageThreshold = 0
        w.damageMinMult = 1
        w.brokenVelocityMult = {vx:0.9,vy:0.9}
        w.shatterDistanceMultiplier = 0.05
        w.shatteringDistanceCap = 19
        w.bounce = 0.2
        w.friction = 1
        w.shatteringFunc = (part)=>{let r = rand();part.vx+=rand(-0.5);part.vy+=rand(-0.5);part.vx *= r; part.vy *= r}
      },
      "sturdy glass":()=>{
        w.color = "rgba(40,140,220,0.6)"
        w.size = 10
        w.hp = 1
        w.damageMinMult = 0.2
        w.damageThreshold = 0.1
        w.brokenVelocityMult = {vx:0.9,vy:0.9}
        w.shatterDistanceMultiplier = 0.05
        w.shatteringDistanceCap = 19
        w.bounce = 0.2
        w.friction = 1
        w.shatteringFunc = (part)=>{let r = rand();part.vx *= r; part.vy *= r}
      },
      "brick":()=>{
        w.color = "#f29188"
        w.bounce = 0.4
        w.friction = 0.94
      }
    }

    if(options.hpMult){
      w.hp *= options.hpMult
    }

    if(options.sided){
      w.tags.add("sided")
    }

    if(options.tags){
      options.tags.forEach((e)=>{w.tags.add(e)})
    }

    if(types[type]){types[type]()}


    return(out)

  }

  //@summon
  function summon(type="normal",x=entityList.player.x,y=(entityList.player.y-160),options={}){
    let b = newBall(x,y)
    let p = entityList.player
    let AIs = {
      "mover":()=>{
        b.tags.add("moves")
        b.movementVector = {x:0,y:0}
        b.movementSpeed = 0.03
        b.movementScalar = 1
        b.damageMultiplier = 0.5
        b.color = [30,62,41]
        trailify(b)

        b.AICustomUpdate = (b,dt)=>{
          if(b.target){
            b.movementVector = {x:b.target.x-b.x,y:b.target.y-b.y-50}
          } else if(AIlos(b.x,b.y,p.x,p.y,b)){
            b.target = p
          }
          b.AInextUpdateTime = 500
        }
      },
      "levitator":()=>{
        b.tags.add("moves")
        b.movementVector = {x:0,y:0}
        b.movementSpeed = 0.03
        b.movementScalar = 1
        b.damageMultiplier = 0.5
        b.color = [30,62,41]
        trailify(b)

        b.updateFuncs.push((b)=>{
          if(b.target){
            if(b.target.y-40<b.y){
              b.movementVector = {x:rand(-50),y:Math.min(0,b.target.y-b.y-250)}
            } else {
              b.movementVector = {x:b.target.x-b.x,y:b.target.y-b.y-50}
            }
          } else {
            b.movementVector = {x:0,y:0}
          }
        })

        b.AICustomUpdate = (b,dt)=>{
          if(AIlos(b.x,b.y,p.x,p.y,b)){
            b.target = p
          } else {
            b.target = undefined
          }
          b.AInextUpdateTime = 500
        }
      },
      "enerjitsuist":()=>{
        b.damageMultiplier = 0.7
        b.r *= 0.96
        b.maxHp *= 2
        b.hp *= 2
        b.energyRegen = 0
        b.wallJumpEnergy = 500
        b.maxEnergy *= 3
        b.maxEnergySpend = b.minEnergySpend = 20
        b.color = [205,62,41]
        b.tags.add("noDefaultArc")
        grantItem("enerjitsu",b)
        b.onJump.push(particleFuncs.jumpIndicator)
        b.AInextUpdateTime = 500

        b.AICustomUpdate = (b,dt)=>{
          let los = AIlos(b.x,b.y,p.x,p.y,b)
          if(los){
            b.target = p
            if(b.energy > 30 ){
              b.AInextUpdateTime = rand(0.05)?rand(1000)+950:rand(400)+400
              b.jump(b.target.x-b.x,b.target.y-b.y-60,0.003)
            }
          }
        }
      },
      "enerjitsuist hopper":()=>{
        b.damageMultiplier = 0.7
        b.r *= 0.96
        b.maxHp *= 2
        b.hp *= 2
        b.energyRegen = 0.5
        b.wallJumpEnergy = 50
        b.maxEnergySpend = b.minEnergySpend = 20
        b.color = [225,62,41]
        b.tags.add("noDefaultArc")
        grantItem("enerjitsu",b)
        b.onJump.push(particleFuncs.jumpIndicator)
        b.AInextUpdateTime = 500
        b.enerjitsuistLR = 0
        b.enerjitsuistTurn = 0.8

        b.losDistanceSq *= 1.5

        b.AICustomUpdate = (b,dt)=>{
          let los = AIlos(b.x,b.y,p.x,p.y,b)
          if(los){
            b.target = p
            if(b.energy > 30 ){
              b.AInextUpdateTime = rand(0.01)?rand(1000)+950:rand(200)+(options.insane?200:600)

              let enerAngle = b.enerjitsuistTurn
              let towardsDir = dot(b.target.x-b.x,b.target.y-b.y,b.vx,b.vy)

              // 20 -> Math.PI/2

              if(towardsDir > 20){
                enerAngle = Math.PI/2
              }

              let lr = Lrotate(b.target.x-b.x,b.target.y-b.y, b.enerjitsuistLR%2?-enerAngle:enerAngle)
              b.jump(lr.x,lr.y-60,0.003)
              b.enerjitsuistLR += 1
            }
          }
        }
      },
      "apprentice":()=>{
        b.tags.add("moves")
        b.movementVector = {x:0,y:0}
        b.movementSpeed = 0.02
        b.movementScalar = 1
        b.damageMultiplier = 0.7
        b.color = [15,62,41]

        b.updateFuncs.push((b,dt)=>{
          b.movementScalar = Math.min(1, (gameWorld.lastTime - b.lastCollideWallTime)/2000)
          if(b.target){
              b.movementVector = {x:b.target.x-b.x,y:Math.min(0,b.target.y-b.y-250)}
          }
        })

        b.AICustomUpdate = (b,dt)=>{
          let los = AIlos(b.x,b.y,p.x,p.y,b)
          
          if(los){
            b.target = p
            if(b.energy > 30 ){
              // jump towards player
              b.AInextUpdateTime = rand(1000)+950
              b.jump(b.target.x-b.x,b.target.y-b.y-rand(200)-60,0.003)
            }
          }
        }
      },
      "dasher":()=>{
          b.damageMultiplier = 0.7
          b.color = [340,62,41]

          b.accel.set(0,0,"gravity")
          trailify(b,15,9)

          b.energenin = 0.01
          b.jumpPower = 2

          b.updateFuncs.push((b)=>{
            if(rand(0.1)){
              particleFuncs.radiance(b.x,b.y)
            }
          })

          b.AICustomUpdate = (b,dt)=>{
            let los = AIlos(b.x,b.y,p.x,p.y,b)
            
            if(los){
              b.target = p
            }
            let target = b.target?b.target:b.home

            if(b.energy > 30 ){
              // jump towards player
              b.AInextUpdateTime = rand(1000)+1550
              b.jump(target.x-b.x,target.y-b.y,0.003)

              let startTime = gameWorld.lastTime
              b.decel.setDynamic(()=>{let z=Math.min(0.01,0.00001*(gameWorld.lastTime-startTime));return({x:z,y:z})},"decel")

            }
          }
      },
      "divider":()=>{
          b.damageMultiplier = 0.7
          b.color = [340,62,41]

          b.accel.set(0,0,"gravity")
          b.tags.add("noDefaultArc")
          trailify(b,15,9)

          b.energenin = 0.01

          b.onDeath.push(()=>{
            if(b.tags.has("clone")){return}
            particleFuncs.circle(b.x,b.y,undefined,13,b.r*1.3)
          })

          b.AICustomUpdate = (b,dt)=>{
            let los = AIlos(b.x,b.y,p.x,p.y,b)
            
            if(los){
              b.target = p
            }
            let target = b.target?b.target:b.home

            if(b.energy > 30 ){
              // jump towards player
              b.AInextUpdateTime = rand(1000)+1550
              b.jump(target.x-b.x,target.y-b.y,0.003)

              let startTime = gameWorld.lastTime
              b.decel.setDynamic(()=>{let z=Math.min(0.01,0.000001*(gameWorld.lastTime-startTime));return({x:z,y:z})},"decel")

              if(rand()>0.5 && !b.tags.has("clone")){
                let nb = summon("divider")
                nb.hp = b.hp
                nb.mass = b.mass * 0.8
                nb.damageMultiplier = b.damageMultiplier * 0.2
                nb.hpRegen = -0.004
                nb.tags.add("clone")
                nb.shadow(b)
              }

            }
          }
      },
      "zombie":()=>{
        b.damageMultiplier = 0.2
        b.maxHp *= 5
        b.hp *= 5
        b.color = [115,62,21]
        b.colorDest[2] = 21
        b.minEnergySpend = 20
        b.maxEnergy = 20
        if(rand(0.1)){
          b.minEnergySpend = b.maxEnergy = 35
          trailify(b,15,9)
        }

        b.energyRegen = 0
        b.hpRegen = 0
        b.tags.add("noDefaultArc")
        b.bounce = 0.6
        b.friction = 0.95
        // b.onDeath.push((b)=>{
          // gameFuncs.explosion(b.x,b.y,b)
        // })
        b.mass = 1.5
        b.r *= 1+rand(-0.3)
        b.AICustomUpdate = (b,dt)=>{
          let los = AIlos(b.x,b.y,p.x,p.y,b)
          
          if(los){
            b.target = p
          }
          let target = b.target?b.target:b.home
          if(b.energy > 15 ){
            // jump towards player
            b.AInextUpdateTime = rand(2000)+950
            b.jump(target.x-b.x,target.y-b.y-rand(200)-60,0.003)
          }
        }
      }
    }


    if(options.grunt){
      b.tags.add("grunt")
      b.hp *= 2
      b.r *= 1.1
    }
    if(options.brute){
      b.tags.add("brute")
      b.jumpForceMultiplier = 23
      b.maxEnergySpend = 45
      b.colorFunc = (b,c,s,l)=>{return(`hsl(${c[0]},${s}%,${l+rand(-10)-20}%)`)}
    }

    if(AIs[type]){AIs[type]()}
    return(b)
  }




  function grantEffect(type,p=entityList.player,options){
    p.effects.addEffect(type,options)
  }


  function grantItem(type,p=entityList.player,options){
    let item = dropItem(type,options)
    item.pickup(p,true)
  }


  function dropOrb(type,x=entityList.player.x,y=(entityList.player.y-160),options={}){
    let i = new orb(x,y,type,can.ctx)

    let dict = {
      "moverSummon":()=>{
        i.onPickup.push((by)=>{
          summon("mover",i.x,i.y)
        })
      },
      "energy":()=>{
        i.onPickup.push((by)=>{
          by.energy += 40
          let spark = new sparkleParticle(x,y)
          spark.color = [0,125,240]
          spark.size = 25
          spark.z = 1
          by.effects.addEffect("energenerative",{duration:5000})
        })
        i.color = "rgb(0,125,240)"
      },
      "health":()=>{
        i.onPickup.push((by)=>{
          by.hp += 40
          let spark = new sparkleParticle(x,y)
          spark.color = [240,50,40]
          spark.size = 25
          spark.z = 1
          particleFuncs["hp particles"](x,y)
          by.effects.addEffect("regenerative",{duration:12000})
        })
        i.color = "rgb(240,50,40)"
      },

    } 
    
    if(dict[type]){dict[type]()}
  }

  function itemPickupMsg(str,by,options){
    by===entityList.player?notify(options.msg?options.msg:str):0
  }

  function dropItem(type,x=entityList.player.x,y=(entityList.player.y),options={}){
    y -= 50
    let i = new item(x,y,type,can.ctx)
      let dict = {
        "cheats":()=>{
          i.dash = {ld:[20,20],offset:1}
          i.onPickup.push((by)=>{
            by.maxHp *= 8
            itemPickupMsg("picked up cheats\npussy/nevaeh mode: x800% hp",by,options)
          })
        },

        "moverSummon":()=>{
          i.onPickup.push((by)=>{
            let mv = summon("mover",i.x,i.y)
            mv.vy -= 2
          })
        },
        "dmg+":()=>{
          i.onPickup.push((by)=>{
            by.permanentDamageMultiplier += 0.05
            itemPickupMsg("your patience is rewarded: +5% damage",by,options)
          })
        },
        "armor+":()=>{
          i.onPickup.push((by)=>{
            by.armor = {hp:80,protection:0.8,maxHp:80}
            // new sparkParticle(by.x,by.y,15)
            itemPickupMsg("picked up armor: +80 armor hp",by,options)
          })
        },
        "hp+":()=>{
          i.onPickup.push((by)=>{
            by.maxHp += 40
            itemPickupMsg("Buffed: +40 max hp",by,options)
            particleFuncs["hp particles"](by.x,by.y,9)
          })
        },
        "energetic":()=>{
          i.onPickup.push((by)=>{
            by.maxEnergy += 20
            itemPickupMsg("energetic: +20 max energy",by,options)
          })
        },
        "energenin":()=>{
          i.onPickup.push((by)=>{
            by.energenin += 0.002
            itemPickupMsg("picked up energenin\n slow energy regen midair",by,options)
          })
        },
        "momentum profligacy":()=>{
          i.onPickup.push((by)=>{
            by.tags.add("momentum profligacy")
            itemPickupMsg("learnt momentum profligacy\n momentum cancelling creates explosions",by,options)
            by.onJump.push((b,nrg,v)=>{
              if(Math.sqrt(v)-b.speed() > 0.15){
                gameFuncs.explosion(b.x,b.y,b)
              }
            })
          })
        },
        "enerjitsu":()=>{
          i.onPickup.push((by)=>{
            by.tags.add("enerjitsu")
            itemPickupMsg("learnt enerjitsu\n momentum is now canceled freely",by,options)
          })
        },
        "checkpoint":()=>{
          i.onPickup.push((by)=>{
            by.effects.addEffect("checkpoint", {x:by.x,y:by.y})
            by===entityList.player?notify("checkpoint set"):0
          })
        },"endless":()=>{
          i.dash = {ld:[20,5],offset:1}
          i.onPickup.push((by)=>{
            for(let i = 0; i<50;i++){
              by.effects.addEffect("checkpoint", {x:by.x,y:by.y})
            }
            itemPickupMsg("picked up cheats\npussy/nevaeh mode: +50 checkpoints",by,options)
            gameWorld.TIL(0,()=>{if(rand(0.003)){particleFuncs["cheating particle"](by.x,by.y,1)}})
          })
        },
      }

      if(dict[type]){dict[type]()}
      return(i)
  }

  var gameFuncs = {
    "explosion":(x,y,by)=>{
      particleFuncs.explosion2(x,y)
      camera.shake += 12
      entityList.activatedBalls.forEach((e)=>{if(e===by){return};
        // explosion push
        let los = true
        

        if(los){
          // let dist = Math.max(50,distance(x,y,e.x,e.y))
          let dist = Math.max(distance(x,y,e.x,e.y),4)
          if(dist<400){
            console.log(dist)
            let dv = {vx:(e.x-x)/(dist**1.6)*15,vy:(e.y-y)/(dist**1.6)*15}
            e.vx += dv.vx
            e.vy += dv.vy
            dv.vx *= 1.2
            dv.vy *= 1.2
            e.damage(30000/dist,{vel:dv})
          }
        }
      })
    },
    "teleportFragment":(x,y,entity,d={})=>{
      particleFuncs.teleport(x,y)
      gameWorld.TO(1000,(e)=>{
        entity.x = x; entity.y = y
        entity.tags.delete("noCollideBall");
        entity.tags.delete("teleporting")
        e.done=true
        d.done=true
      })
    },
    "teleport":(x,y,entity=entityList.player)=>{
      if(entity.tags.has("teleporting")){return}
      entity.tags.add("noCollideBall")
      entity.tags.add("teleporting")

      if(entity === entityList.player){
        let dest = camera.addDestination(x,y,30)
        dest.arrive.push( ()=>{
          d = camera.addDestination(x,y,0)
          gameFuncs.teleportFragment(x,y,entity,d)
        })
      } else {
          gameFuncs.teleportFragment(x,y,entity)
      }

    }
  }

  var particleFuncs = {
    "explosion":(x,y,s=1,l=1000)=>{new explosionParticle(x,y,(t)=>{return((1-t)*315*s)},(t)=>{return(t*75*s)},colorFuncs.explosion,l)},
    "explosion2":(x,y,s=1)=>{for(let i =0; i < 5; i++){particleFuncs.explosion(x,y,s,3000/(i**1.5))}},
    "bloody explosion":(x,y,s=1,l=1000)=>{new explosionParticle(x,y,(t)=>{return((1-t)*35*s)},(t)=>{return(t*15*s)},colorFuncs["bloody explosion"],l)},
    "bloody explosion2":(x,y,r=80,n=3)=>{for(let i =0; i < n; i++){gameWorld.TO(rand(250),()=>{particleFuncs["bloody explosion"](x+rand(-r),y+rand(-r),rand()+2,rand(400)+800)} )}},
    "rect":(x,y,x2,y2)=>{new rectParticle(x,y,x2,y2)},
    "hp particle":(x,y)=>{let p = new lineyParticle(x,y,80+rand(80),colorFuncs.hp); p.speed = 3; },
    "cheating particle":(x,y)=>{let p = new lineyParticle(x,y,280+rand(2380),colorFuncs.cheater); p.speed = 30; p.updateStall = 300; p.tailLength = 20;},
    "hp particles":(x,y,n=5)=>{for(let i =0; i < n; i++){particleFuncs["hp particle"](x,y)}},

    "respawn":(x,y,b)=>{
      for(let i = 0; i < 5; i++){
        new explosionParticle(x,y,(t)=>{return((t**0.4)*315)},(t)=>{return(4)},()=>{return(colorFuncs.respawn(b))},1000+200*i)
      }
    },
    "teleport":(x,y,b)=>{
      for(let i = 0; i < 5; i++){
        new explosionParticle(x,y,(t)=>{return((t**0.4)*315)},(t)=>{return(4)},()=>{return(colorFuncs.teleport(b))},1000+200*i)
      }
    },

    "jumpIndicator":(b,spentEnergy)=>{
        let p = new particle(b.x,b.y,0,0)
        p.maxLife = 1500
        p.life = 1500/b.maxEnergySpend*spentEnergy
        p.color = [120,245,230]
        p.ay = 0
        p.size = b.r+2
        p.noFill = 1
      },
    "generic line":(x,y,x2,y2)=>{
      let p = new lineyParticle(x,y,400,colorFuncs["generic white"])
      p.vx = (x2-x)/3
      p.vy = (y2-y)/3
      p.speed = 3
      p.updateStall = 30
      p.tailLength = 30
      return(p)
    },
    "circle":(x=0,y=0,type="generic line",divisions=10,radius=50)=>{
      let r = 0
      let arcLength = TAU/divisions
      let p1 = {x:Math.cos(r)*radius,y:Math.sin(r)*radius}
      for(let i = 0; i < divisions; i++){
        r += arcLength
        let p2 = {x:Math.cos(r)*radius,y:Math.sin(r)*radius}
        particleFuncs[type](p1.x+x,p1.y+y,p2.x+x,p2.y+y)
        p1 = p2
      }
    },
    "radiance":(x=0,y=0,r=500)=>{
      let angle = Math.random()*TAU
      let dest = Lrotate(0,500,angle)
      let p = new lineToParticle(x,y,dest.x,dest.y)
    }
  }

  var colorFuncs = {
    "explosion":(t)=>{let x=rand(255);return("rgba(255,"+x+",0,"+t*2+")")},
    "bloody explosion":(t)=>{let x=rand(255);return("rgba(95,0,0,"+t+")")},
    "hp":(l)=>{return(`rgba(255,40,40,${1-l})`)},
    "generic white":(l)=>{return(`rgba(255,255,255,${1-l})`)},
    "cheater":(l)=>{return(`rgba(0,${rand(40)+40},0,${1-l})`)},
    "respawn":(b)=>{return(`hsl(${b.color[0]},50%,60%)`)},
    "teleport":(b)=>{return(`hsl(${267},50%,60%)`)},
  }

  function trailify(ball,leng=50,mult=1){
    ball.trail = []
    ball.drawFuncs.push((p,s,l)=>{

    p.ctx.save()
    p.ctx.globalCompositeOperation = "destination-over"

    p.trail.forEach((e,i)=>{
      p.ctx.fillStyle = "hsla("+(p.color[0])+ "," + s + "%," + l + "%,"+Math.min(0.5,0.01*i*e[2] - 0.5)+")"
      p.ctx.beginPath()
      p.ctx.arc(e[0],e[1],p.r*0.97,0,TAU)
      p.ctx.fill()
    })

    p.trail.push([p.x,p.y,p.speed()*mult])
    if(p.trail.length>leng){
      p.trail.splice(0,1)
    }
    p.ctx.globalCompositeOperation = "source-over"
    p.ctx.restore()

  }) 
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
  entityList.balls.add(entityList.player)
  entityList.player.tags.delete("AI")
  entityList.player.tags.add("noDefaultArc")
  entityList.player.onJump.push(particleFuncs.jumpIndicator)
  entityList.player.tags.add("moves")
  entityList.player.movementVector = {x:0,y:0}
  entityList.player.movementScalar = 1

  entityList.player.activate()
  entityList.player.updateFuncs.push(()=>{
    grid.activate(entityList.player.x,entityList.player.y)
  })

  entityList.player.onDeath.push(()=>{

    if(entityList.player.effects.getValue("checkpoint")){
        setTimeout(()=>{
        document.addEventListener("click",()=>{
          entityList.player.effects.trigger("checkpoint")
        },{once:true})
        },2000)
        
        return
    }



      setTimeout(()=>{
        document.addEventListener("click",()=>{location.reload()})
      },2000)

  })

  trailify(entityList.player)

  grantItem("checkpoint")

  // implement player trail


  function newWall(a,b,c,d,ctx=can.ctx){
    let w = new wall(a,b,c,d,ctx)
    entityList.walls.push(w)
    return(w)
  }
  function newBall(x,y,r=50,ctx=can.ctx){
    let b = new ball(x,y,r,ctx)
    entityList.balls.add(b)
    return(b)
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
 

  // function trailify(ball,dtmin=60){
  //   ball.trail = []
  //   ball.trailTime = gameWorld.lastTime
  //   ball.lastTrailPos = {x:ball.x,y:ball.y,time:gameWorld.lastTime}

  //   ball.drawFuncs.push((p,s,l)=>{
  //   let dt = gameWorld.lastTime - ball.trailTime
  //   if(dt>dtmin){
  //     let s = p.speed()
  //     while((timeAgo=gameWorld.lastTime - p.trailTime)>dtmin){
  //     ball.trailTime+=dtmin

  //     let scalar = gameWorld.lastTime-p.lastTrailPos.time
  //     let dx = p.x-p.lastTrailPos.x
  //     let dy = p.y-p.lastTrailPos.y
  //     scalar = timeAgo/scalar
  //     p.trail.push([p.x-dx*scalar,p.y-dy*scalar,s])

  //     }
  //     ball.lastTrailPos = {x:ball.x,y:ball.y,time:gameWorld.lastTime}

  //   }
  //     p.ctx.save()
  //     p.ctx.globalCompositeOperation = "destination-over"
  //     p.trail.forEach((e,i)=>{
  //       p.ctx.fillStyle = "hsla("+(p.color[0])+ "," + s + "%," + l + "%,"+Math.min(0.5,0.01*i*e[2] - 0.5)+")"
  //       p.ctx.beginPath()
  //       p.ctx.arc(e[0],e[1],p.r*0.97,0,TAU)
  //       p.ctx.fill()
  //     })
  //     if(p.trail.length>50){
  //       p.trail.splice(0,1)
  //     }
  //     p.ctx.globalCompositeOperation = "source-over"
  //     p.ctx.restore()
  // }) 
  // }











class structureGenerator{
  static dict={
    "zento":{arr:[
      { x1: 40, y1: 300, x2: 360, y2: 300, type: 'normal',  },
      { x1: 20, y1: 80, x2: 60, y2: 120, type: 'normal', mirrored: true },
      { x1: 60, y1: 120, x2: 340, y2: 120, type: 'normal',  },
      { x1: 80, y1: 120, x2: 80, y2: 300, type: 'wood', mirrored: true},
      { x1: 160, y1: 300, x2: 180, y2: 260, type: 'wood', mirrored: true },
      { x1: 160, y1: 260, x2: 240, y2: 260, type: 'wood',  }
    ],off:{x:-200,y:-300},scale:3,boundingBox:[20,80,380,300],genFunc:(x,y,options)=>{
      summon("mover",x,y-options.scale*60)
      }
    },
    "container":{arr:[
      { x1: 60, y1: 360, x2: 60, y2: 280, type: 'glass',  },
      { x1: 60, y1: 280, x2: 0, y2: 280, type: 'glass',  },
      { x1: 0, y1: 280, x2: 0, y2: 360, type: 'glass',  },
      { x1: 0, y1: 360, x2: 60, y2: 360, type: 'glass',  },
      { x1: 0, y1: 360, x2: 0, y2: 400, type: 'wood',  },
      { x1: 0, y1: 400, x2: 60, y2: 360, type: 'wood',  },
      { x1: 60, y1: 400, x2: 0, y2: 360, type: 'wood',  },
      { x1: 60, y1: 360, x2: 60, y2: 400, type: 'wood',  }
      ],off:{x:-30,y:-401},scale:1.3,boundingBox:[0,280,60,400],genFunc:(x,y,options,walls)=>{
        walls[0].collateral = walls[2].collateral = [walls[1]]
        if(rand(0.5)){
          dropOrb("energy",x,y-options.scale*80)
        } else {
          dropOrb("health",x,y-options.scale*80)
        }
      }
    },
    "vase":{arr:[
  { x1: 40, y1: 300, x2: 40, y2: 320, type: 'glass',  },
  { x1: 40, y1: 320, x2: 20, y2: 380, type: 'glass',  },
  { x1: 20, y1: 380, x2: 40, y2: 400, type: 'glass',  },
  { x1: 40, y1: 400, x2: 60, y2: 400, type: 'glass',  },
  { x1: 60, y1: 400, x2: 80, y2: 380, type: 'glass',  },
  { x1: 80, y1: 380, x2: 60, y2: 320, type: 'glass',  },
  { x1: 60, y1: 320, x2: 60, y2: 300, type: 'glass',  }
],off:{x:-50,y:-405}, scale:1.4, boundingBox:[20,300,80,400], oneBody:true},
    "table":{arr:[
  { x1: 40, y1: 340, x2: 40, y2: 400, type: 'wood' , tags:["breakable","AIdamage"],hpMult:0.2 },
  { x1: 0, y1: 340, x2: 80, y2: 340, type: 'wood' , tags:["breakable","AIdamage"],hpMult:0.2}
  ],off:{x:-20,y:-401}, scale:1.2, boundingBox:[0,340,80,400], },
  "table2":{
    arr:[
      { x1: 80, y1: 180, x2: 260, y2: 180, type: 'wood',  },
      { x1: 100, y1: 180, x2: 100, y2: 220, type: 'wood',  },
      { x1: 240, y1: 180, x2: 240, y2: 220, type: 'wood',  }
    ], off:{x:-170,y:-221}, scale:1, boundingBox:[80,180,260,220] 
  },

    "bottle":{arr:[
  { x1: 160, y1: 60, x2: 160, y2: 180, type: 'sturdy glass',  },
  { x1: 160, y1: 180, x2: 120, y2: 200, type: 'sturdy glass',  },
  { x1: 120, y1: 200, x2: 100, y2: 240, type: 'sturdy glass',  },
  { x1: 100, y1: 240, x2: 100, y2: 280, type: 'sturdy glass',  },
  { x1: 100, y1: 280, x2: 120, y2: 320, type: 'sturdy glass',  },
  { x1: 120, y1: 320, x2: 160, y2: 340, type: 'sturdy glass',  },
  { x1: 160, y1: 340, x2: 200, y2: 340, type: 'sturdy glass',  },
  { x1: 200, y1: 340, x2: 240, y2: 320, type: 'sturdy glass',  },
  { x1: 240, y1: 320, x2: 260, y2: 280, type: 'sturdy glass',  },
  { x1: 260, y1: 280, x2: 260, y2: 240, type: 'sturdy glass',  },
  { x1: 260, y1: 240, x2: 240, y2: 200, type: 'sturdy glass',  },
  { x1: 240, y1: 200, x2: 200, y2: 180, type: 'sturdy glass',  },
  { x1: 200, y1: 180, x2: 200, y2: 60, type: 'sturdy glass',  },
  { x1: 110, y1: 300, x2: 80, y2: 345, type: 'wood',  },
  { x1: 250, y1: 300, x2: 280, y2: 345, type: 'wood',  }
],off:{x:-180,y:-346}, scale:1, boundingBox:[80,60,280,345], genFunc:(x,y,options,walls)=>{
    // let glasses = []
    // walls.forEach((e)=>{if(e.name === "glass"){e.collateral = glasses; glasses.push(e)}})    
  }
},
  "container2":{
    arr:[
        { x1: 120, y1: 140, x2: 120, y2: 220, type: 'glass',  },
        { x1: 120, y1: 220, x2: 160, y2: 260, type: 'wood',  },
        { x1: 180, y1: 260, x2: 220, y2: 220, type: 'wood',  },
        { x1: 220, y1: 220, x2: 220, y2: 140, type: 'glass',  },
        { x1: 220, y1: 140, x2: 200, y2: 120, type: 'glass',  },
        { x1: 200, y1: 120, x2: 140, y2: 120, type: 'glass',  },
        { x1: 140, y1: 120, x2: 120, y2: 140, type: 'glass',  },
        { x1: 120, y1: 220, x2: 220, y2: 220, type: 'wood',  },
        { x1: 160, y1: 260, x2: 180, y2: 260, type: 'wood',  },
        { x1: 140, y1: 240, x2: 140, y2: 280, type: 'wood',  },
        { x1: 200, y1: 240, x2: 200, y2: 280, type: 'wood',  },
        { x1: 220, y1: 220, x2: 220, y2: 280, type: 'wood',  },
        { x1: 120, y1: 220, x2: 120, y2: 280, type: 'wood',  },
        { x1: 140, y1: 260, x2: 200, y2: 260, type: 'wood',  },
        // { x1: 120, y1: 280, x2: 140, y2: 280, type: 'wood',  },
        // { x1: 200, y1: 280, x2: 220, y2: 280, type: 'wood',  }
      ],off:{x:-170,y:-281}, scale:1.5, boundingBox:[120,120,220,280] 
    },
    "acceleration triangle":{
      arr:[
        { x1: 40, y1: 300, x2: 0, y2: 400, type: 'accelerator',  },
        { x1: 40, y1: 300, x2: 80, y2: 400, type: 'accelerator',  }
      ], off:{x:-40,y:-401}, scale:1, boundingBox:[0,300,80,400]
    },
    "podium":{
      arr:[
        { x1: 100, y1: 200, x2: 240, y2: 200, type: 'wood',  },
        { x1: 140, y1: 200, x2: 100, y2: 280, type: 'wood',  },
        { x1: 200, y1: 200, x2: 240, y2: 280, type: 'wood',  }
      ], off:{x:-170,y:-281}, scale:1, boundingBox:[100,200,240,280] ,genFunc:(x,y,options)=>{
        if(rand(0.3)){
          summon("enerjitsuist",x,y-options.scale*120)
        }
      }
    },
    "flask1":{
      arr:[
        { x1: 160, y1: 120, x2: 160, y2: 180, type: 'glass',  },
        { x1: 160, y1: 180, x2: 140, y2: 200, type: 'glass',  },
        { x1: 140, y1: 200, x2: 140, y2: 220, type: 'glass',  },
        { x1: 140, y1: 220, x2: 160, y2: 240, type: 'glass',  },
        { x1: 160, y1: 240, x2: 180, y2: 240, type: 'glass',  },
        { x1: 180, y1: 240, x2: 200, y2: 220, type: 'glass',  },
        { x1: 200, y1: 220, x2: 200, y2: 200, type: 'glass',  },
        { x1: 200, y1: 200, x2: 180, y2: 180, type: 'glass',  },
        { x1: 180, y1: 180, x2: 180, y2: 120, type: 'glass',  }
      ], off:{x:-170,y:-245}, scale:1, boundingBox:[140,120,200,240], oneBody:true 
    },
    "flask2":{
      arr:[
        { x1: 160, y1: 100, x2: 160, y2: 200, type: 'glass',  },
        { x1: 160, y1: 200, x2: 120, y2: 220, type: 'glass',  },
        { x1: 120, y1: 220, x2: 100, y2: 260, type: 'glass',  },
        { x1: 100, y1: 260, x2: 100, y2: 300, type: 'glass',  },
        { x1: 100, y1: 300, x2: 120, y2: 340, type: 'glass',  },
        { x1: 120, y1: 340, x2: 160, y2: 360, type: 'glass',  },
        { x1: 160, y1: 360, x2: 200, y2: 360, type: 'glass',  },
        { x1: 200, y1: 360, x2: 240, y2: 340, type: 'glass',  },
        { x1: 240, y1: 340, x2: 260, y2: 300, type: 'glass',  },
        { x1: 260, y1: 300, x2: 260, y2: 260, type: 'glass',  },
        { x1: 260, y1: 260, x2: 240, y2: 220, type: 'glass',  },
        { x1: 240, y1: 220, x2: 200, y2: 200, type: 'glass',  },
        { x1: 200, y1: 200, x2: 200, y2: 100, type: 'glass',  }
      ], off:{x:-180,y:-365}, scale:1, boundingBox:[100,100,260,360] , oneBody:true 
    },
    "crate1":{
      arr:[
        { x1: 80, y1: 120, x2: 80, y2: 220, type: 'crate wood',  },
        { x1: 80, y1: 220, x2: 240, y2: 220, type: 'crate wood',  },
        { x1: 240, y1: 220, x2: 240, y2: 120, type: 'crate wood',  },
        { x1: 240, y1: 120, x2: 80, y2: 120, type: 'crate wood', oneBody:{closer:1} },
        { x1: 240, y1: 220, x2: 80, y2: 120, type: 'crate wood',  },
        { x1: 240, y1: 120, x2: 80, y2: 220, type: 'crate wood',  }
      ], off:{x:-160,y:-228}, scale:1, boundingBox:[80,120,240,220], oneBody:true
    },
    "debug1":{
      arr:[
        { x1: 100, y1: 120, x2: 100, y2: 200, type: 'crate wood',  },
        { x1: 100, y1: 200, x2: 220, y2: 200, type: 'crate wood',  },
        { x1: 280, y1: 260, x2: 200, y2: 260, type: 'crate wood',  },
        { x1: 200, y1: 320, x2: 280, y2: 260, type: 'crate wood',  },
        { x1: 280, y1: 320, x2: 200, y2: 260, type: 'crate wood',  },
        { x1: 200, y1: 100, x2: 340, y2: 100, type: 'crate wood',  },
        { x1: 340, y1: 100, x2: 200, y2: 120, type: 'crate wood',  },
        { x1: 200, y1: 120, x2: 200, y2: 160, type: 'crate wood',  },
        { x1: 200, y1: 160, x2: 340, y2: 160, type: 'crate wood',  }
      ], off:{x:-220,y:-321}, scale:1, boundingBox:[100,100,340,320] , oneBody:true
    }
  }

  static boundingBox(struct,x,y,scale){
    let d = this.dict[struct]
    if(scale===undefined){scale=d.scale}
    return([(d.off.x+d.boundingBox[0])*scale+x,(d.off.y+d.boundingBox[1])*scale+y,(d.off.x+d.boundingBox[2])*scale+x,(d.off.y+d.boundingBox[3])*scale+y])
  }

  static dimensions(struct,scale){
    let d = this.dict[struct]
    if(scale===undefined){scale=d.scale}
      return({w:(d.boundingBox[2]-d.boundingBox[0])*scale, h:(d.boundingBox[3]-d.boundingBox[1])*scale })
  }

  static dbg(struct){
    this.build(struct,0,-1)
    let scale = this.dict[struct].scale
    new rectParticle(...this.boundingBox(struct,0,-1,scale))
  }


  static build(struct,x,y,options={}){
    if(this.dict[struct]){
      let d = this.dict[struct]
      if(!d.off){d.off={x:0,y:0}}

      if(!options.scale){
        options.scale = d.scale
      }
      if(!options.rotation){
        options.rotation = 0
      }
      if(!options.noIntersectionCheck){

        let myAABB = options.rotation===0?this.boundingBox(struct,x,y,options.scale):get_rotated_AABB(...this.boundingBox(struct,x,y,options.scale),x,y,options.rotation)
        let otherWalls = grid.query(...myAABB)
        
        let intersected = false;
        otherWalls.forEach((w)=>{
            if(check_collision_AABB_line(...this.boundingBox(struct,x,y,options.scale),w.x,w.y,w.x2,w.y2,x,y,options.rotation)){
              intersected = true
            }
        })

        if(intersected){return(false)}

        //debug 


        let otherBalls = grid.query(...myAABB,grid.entityGrid)
        otherBalls.forEach((e)=>{
          if(check_collision_AABB_ball(...this.boundingBox(struct,x,y,options.scale),e.x,e.y,e.r,x,y,options.rotation)){
            intersected = true
            console.log("intersected entity")
          }
        })
        if(intersected){return(false)}

      }


      let out = []

      d.arr.forEach((e)=>{
        if(e.mirrored){e.mirrorX = x}

        let pt1 = Lrotate(options.scale*(e.x1+d.off.x),options.scale*(e.y1+d.off.y),options.rotation)
        let pt2 = Lrotate(options.scale*(e.x2+d.off.x),options.scale*(e.y2+d.off.y),options.rotation)
        out = out.concat(build(
          pt1.x+x,
          pt1.y+y,
          pt2.x+x,
          pt2.y+y,
          e.type,{...e}))
      })


      if(d.oneBody){
        // let breakAll = (a,b,c)=>{out.forEach((e)=>{e.break(b,c)})}
        // out.forEach((e)=>{e.events.onBreak.push(breakAll)})
        let oneBody = new Path2D()
        oneBody.moveTo(out[0].x,out[0].y)
        let last = out[0]
        out.forEach((e,i)=>{


          if(this.dict[struct].arr[i].oneBody){
            let oneBodyInfo = this.dict[struct].arr[i].oneBody
            if(oneBodyInfo.closer){
              oneBody.closePath()
              return;
            }
          }

          if(e.x !== last.x2 || e.y !== last.y2){
            oneBody.moveTo(e.x,e.y)
          }
          oneBody.lineTo(e.x2,e.y2)
          last = e
        })
        out.forEach((e,i)=>{e.collateral = out; e.tags.add("oneBody")
          if(i===0){e.oneBodyPath = oneBody; e.tags.add("oneBodyRepresentor")}
        })
      }

      if(d.genFunc){
          d.genFunc(x,y,options,out)
      }
    return(out)
    }
    return(false)
  }

  static buildOnWall(wall,struct,pos=0.5,options={}){

    let d = this.dict[struct]
    let width = d.boundingBox[2]-d.boundingBox[0]
    let edge = width/wall.length/2
    let range = 1-(width/wall.length)
    pos = edge + pos*range

    let p = pointOnWall(wall,pos,0)
    if(options.rotation===undefined){
      options.rotation = 0
    }
    options.rotation -= getClockwiseAngle(wall.normal.x,wall.normal.y)
    let ret = this.build(struct,p.x,p.y,options)

    return(ret)
  }
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



    //@gentest @starter room @starter box
    // structureGenerator.build("vase",0,0)
    // structureGenerator.build("debug1",0,0)


    let firstWall = newWall(-200,0,800,0,can.ctx)

    // structureGenerator.buildOnWall(firstWall,"vase")
    // structureGenerator.buildOnWall(newWall(800,0,-200,0,can.ctx),"vase")
    newWall(-200,0,-200,600,can.ctx)
    makeWooden(newWall(800,0,800,600,can.ctx))

    // build(400,0,400,600,"accelerator")


    entityList.walls.push(new wall(-200,600,800,600,can.ctx)) // floor
    // entityList.walls.push(new wall(110,500,110,1600,can.ctx)) // beam
    // entityList.walls.push(new wall(110,500,150,450,can.ctx)) // beam
    // entityList.walls.push(new wall(110,500,70,450,can.ctx)) // beam

    let tmp = makeAIbreakable(makeWooden(new wall(50,500,150,500,can.ctx),0.1))
    entityList.walls.push(tmp)
    let tmp2 = makeAIbreakable(makeWooden(new wall(100,600,100,500,can.ctx),0.1))
    tmp2.events.onBreak.push((a,b,c)=>{tmp.break(b,c)})
    entityList.walls.push(tmp2) //table


    // entityList.balls.add(new ball(380,450,50,can.ctx))
    summon("normal",380,450)


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



class engineComms{
  static toDraw=0;
  static toPhys=0;

  static resetDraw(){
    engineComms.toDraw={
    "camDx":0,
    "camDy":0
  }
  }
  static resetPhys(){}
}


if(settings.RAF){
  requestAnimationFrame(mainLoop)
  seperateMainStart()
} else {
  // setInterval(mainLoop,16)
  requestAnimationFrame(mainLoop,true)
  dualMainStart()


}


// check cookies - if this is first game notify with help
let storage = localStorage.getItem("played")
if(storage){
  storage = JSON.parse(storage)
  storage.times++
  if(storage.lastDate > Date.now()+1000*60*60*24){
    starterNotify()
  }
  storage.lastDate = Date.now()
  localStorage.setItem("played",JSON.stringify(storage))
} else {
  starterNotify()
  storage = {times:1,lastDate:Date.now()}
  localStorage.setItem("played",JSON.stringify(storage))
}
function starterNotify(){
  setTimeout(()=>{
    notify("Jump by dragging in the opposite direction\nrelease mouse/finger to jump\nuse WASD to move slowly without using energy")
  },5000)
    setTimeout(()=>{
    notify("Break walls by jumping into them\nWait for the sparkle to deal extra damage")
  },15000)
}




//// drawterrain

function drawTerrain(){
  // if(rand(0.001)){
  //   let dbs = document.body.style
  //   dbs.backgroundColor = "rgb(220,220,140)"
  //   let rnd = 50+rand(200)
  //   gameWorld.TIL(rnd,(e)=>{let pers = (e.til-gameWorld.lastTime)/rnd; if(pers<=0){e.done=1;dbs.backgroundColor="rgb(21,21,21)";return;}; console.log(pers*100); dbs.backgroundColor = `color-mix(in hsl, rgb(21,21,21), rgb(220,220,140) ${pers*100}%)`})
  // }
}


/////// main game @loop & drawing

underCan.ctx.fillStyle = "rgba(0,0,0,1)"
underCan.ctx.globalCompositeOperation = 'destination-out';
underCan.ctx.save()



function seperateMainStart(){

  engineComms.resetDraw()
  engineComms.resetPhys()

  setTimeout(()=>{
    frameFuncs.push(gameDraw)
    frameFuncs.push(engineComms.resetDraw)
  },400)

  setInterval(()=>{
    let time = performance.now()-settings.startDate
    let dt= (time-gameWorld.lastTime)
    gameWorld.lastTime = time
    let date = Date.now()
    gamePhysicsUpdate(time,dt,date)
    engineComms.resetPhys()
  },16)
}

function dualMainStart(){
setTimeout(()=>{
  frameFuncs.push((time,dt,date)=>{
  
  if(gameWorld.paused){return}
  let pn2 = performance.now()
    let pn = performance.now()
    if(test.dtLock){
      dt = test.dtLock
    }
    dt = Math.min(100,dt)

  //move camera


    // entityList.player.y = -500 + Math.sin(gameWorld.frame/60)*700
    // entityList.player.x = -500 

  can.ctx.clearRect(0,0,can.canvas.width,can.canvas.height)
  // can.ctx.fillStyle = "rgba(0,0,0,0.01)"
  // can.ctx.fillRect(0,0,can.canvas.width,can.canvas.height)

  let destScale = settings.speedZoom/(entityList.player.speed()+settings.speedZoom)*settings.relativeSize*1.4



  camera.scale += (destScale-camera.scale)*(0.02*dt/16) * (destScale>camera.scale?0.5:1)
  // camera.scale = 0.9 + Math.sin(Date.now()*0.002) * 0.6

  camera.getDestination()

  let camDx = (camera.destination.x-camera.pos.x)*(0.03*dt/16)
  let camDy = (camera.destination.y-camera.pos.y)*(0.03*dt/16)
  camera.pos.x += camDx
  camera.pos.y += camDy








  underCan.ctx.restore()
  underCan.ctx.save()
  underCan.ctx.globalCompositeOperation = 'copy';
  // underCan.ctx.drawImage(underCan.ctx.canvas, -camDx*camera.scale, -camDy*camera.scale); // should fix later: sudden zooming does not get adjusted for // temporarily disabled as its not used
  underCan.ctx.globalCompositeOperation = 'destination-out';
  underCan.ctx.fillRect(0,0,underCan.canvas.width,underCan.canvas.height)
  underCan.ctx.globalCompositeOperation = 'source-over';


  // backgrounds tech
  // can.ctx.save()
  // // can.ctx.translate(can.canvas.width/2,can.canvas.height/2)
  // // can.ctx.scale(camera.scale/2,camera.scale/2)
  // // can.ctx.translate(-can.canvas.width/2,-can.canvas.height/2)

  // can.ctx.translate(-camera.pos.x/40,-camera.pos.y/14)
  // underCan.ctx.setTransform(can.ctx.getTransform());


  // let gradient = underCan.ctx.createLinearGradient(0,0,0,1400)
  // gradient.addColorStop(0,"rgba(48,48,64,1)")
  // gradient.addColorStop(1,"rgba(48,48,64,0)")
  // underCan.ctx.fillStyle = gradient
  // underCan.ctx.beginPath()
  // let tx = -600
  // underCan.ctx.moveTo(tx,400+300+700)
  // for(let i = 0; i < 20; i++){
  //   underCan.ctx.lineTo(tx+i*400,(i%2)*400+300)
  // }
  // underCan.ctx.lineTo(tx+20*400,400+300+700)

  // underCan.ctx.closePath()
  // underCan.ctx.fill()
  // can.ctx.restore() // background end


  can.ctx.save()
  can.ctx.translate(can.canvas.width/2,can.canvas.height/2)
  can.ctx.scale(camera.scale,camera.scale)
  can.ctx.translate(-can.canvas.width/2,-can.canvas.height/2)
  can.ctx.translate(WidthM,HeightM)



  can.ctx.translate(-camera.pos.x,-camera.pos.y)
  can.ctx.translate(rand(-camera.shake),rand(-camera.shake))

  can.transform = can.ctx.getTransform()

  underCan.ctx.setTransform(can.transform);

  drawTerrain()


  // calculate screen positions
  const inv = can.transform.inverse();

  let screenToWorld = (x, y) => {
      const p = new DOMPoint(x, y).matrixTransform(inv);
      return { x: p.x, y: p.y };
  }

  // get all corners of the screen in world coordinates
  let topLeft = screenToWorld(0, 0);
  let topRight = screenToWorld(can.canvas.width, 0);
  let bottomLeft = screenToWorld(0, can.canvas.height);
  let bottomRight = screenToWorld(can.canvas.width, can.canvas.height);
  
  // calculate the bounding box of the visible area in world coordinates as AABB

  let minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
  let maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
  let minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
  let maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

  gameWorld.viewAABB = [minX,minY,maxX,maxY]


  particles.update(dt)
  particles.draw(1)


  // update game TOs

  gameWorld.tick()


  //draw items

  let items = grid.getNearby(camera.pos.x,camera.pos.y,1,grid.miscGrid)
  items.forEach((e)=>{
    e.draw(dt)
    if(e.type==="orb"&&distance(e.x,e.y,entityList.player.x,entityList.player.y)<entityList.player.r+10){
      e.pickup(entityList.player)
    }
    if(e.type==="item"&&distance(e.x,e.y,entityList.player.x,entityList.player.y)<entityList.player.r+e.size){
      e.pickupProgress += 0.1*dt*e.pickupSpeed
      if(e.pickupProgress > 100){
        e.pickup(entityList.player)
      }
    }
  })


  // we already activate everything around the player. but we should also activate around camera
    grid.activate(camera.pos.x,camera.pos.y)

  let ballList = [...entityList.activatedBalls]

  for(let i = ballList.length-1; i>-1; i--){
    let e = ballList[i]
    if(e.tags.has("isDead") && date-e.deathTime > 5000 && e !== entityList.player){
      entityList.activatedBalls.delete(e)
      entityList.balls.delete(e)
      continue;
    }

    allBallsCollide(time,i,ballList)
    e.update(dt*gameWorld.timeWarp)
    e.draw()
  }



  let walls = grid.getNearby(camera.pos.x,camera.pos.y,2,grid.grid)
  entityList.activatedWalls = walls
  walls.forEach((e)=>{
    e.draw()
  })


  particles.draw(2)



  drawShootAngle(date)

  controlBall(entityList.player)

  gameWorld.timeWarp += (1-gameWorld.timeWarp)*0.1
  camera.shake += (0-camera.shake)*0.05
  if(controller.mouseIsDown){gameWorld.timeWarp*=0.90}


  can.ctx.restore()
  drawPlayerGUI()
  test.perf = (performance.now()-pn2) * 0.1 + test.perf*0.9

  let tmp = `${entityList.activatedBalls.size }-${entityList.activatedWalls.size}-${particles.list.length}`
  if(mobileDebug.active){

    mobileDebug.log(JSON.stringify(settings.insets))

    tmp += mobileDebug.logStr
    mobileDebug.reset()
  }


  can.ctx.fillStyle = dt>18?"red":"green"
  can.ctx.font = `bold ${Math.floor(48* settings.relativeSize )}px arial`
  can.ctx.fillText(Math.floor(dt)+" "+(Math.round(performance.now()-pn)+" "+Math.floor(test.perf*100))+" "+tmp,0,Height)
  if(settings.offline && !settings.mobile){
    can.ctx.fillStyle = "red"
    can.ctx.fillText("OFFLINE. SERVED OFFLINE. DEBUG NOT WORK BECAUSE OFFLINE",100,120)
  }

  })
},400) // wait for website to stabalize

}


function gamePhysicsUpdate(time,dt,date){

  camera.scale += (settings.speedZoom/(entityList.player.speed()+settings.speedZoom)*settings.relativeSize-camera.scale)*0.03
  let camDx = (entityList.player.x-WidthM/camera.scale-camera.pos.x)*0.03
  let camDy = (entityList.player.y-HeightM/camera.scale-camera.pos.y)*0.03
  camera.pos.x += camDx
  camera.pos.y += camDy
  engineComms.toDraw.camDx+=camDx
  engineComms.toDraw.camDy+=camDy
  particles.update(dt)

  //item functions
  let items = grid.getNearby(camera.pos.x,camera.pos.y,1,grid.miscGrid)
  items.forEach((e)=>{
    if(e.type==="orb"&&distance(e.x,e.y,entityList.player.x,entityList.player.y)<entityList.player.r+10){
      e.pickup(entityList.player)
    }
    if(e.type==="item"&&distance(e.x,e.y,entityList.player.x,entityList.player.y)<entityList.player.r+e.size){
      e.pickupProgress += 0.1*dt
      if(e.pickupProgress > 100){
        e.pickup(entityList.player)
      }
    }
  })


  let ballList = [...entityList.activatedBalls]

  for(let i = ballList.length-1; i>-1; i--){
    let e = ballList[i]
    if(e.tags.has("isDead") && date-e.deathTime > 5000 && e !== entityList.player){
      entityList.activatedBalls.delete(e)
      entityList.balls.delete(e)
      continue;
    }

    allBallsCollide(time,i,ballList)
    e.update(dt*gameWorld.timeWarp)
  }

  controlBall(entityList.player)
  gameWorld.timeWarp += (1-gameWorld.timeWarp)*0.1
  if(controller.mouseIsDown){gameWorld.timeWarp*=0.90}


}

function gameDraw(time,dt,date){

  let pn = performance.now()
    if(test.dtLock){
      dt = test.dtLock
    }
    dt = Math.min(100,dt)

  //move camera


  can.ctx.clearRect(0,0,can.canvas.width,can.canvas.height)
  can.ctx.save()
  can.ctx.translate(-camera.pos.x*camera.scale,-camera.pos.y*camera.scale)
  can.ctx.scale(camera.scale,camera.scale)
  underCan.ctx.restore()
  underCan.ctx.save()
  underCan.ctx.globalCompositeOperation = 'copy';
  underCan.ctx.drawImage(underCan.ctx.canvas, -engineComms.toDraw.camDx*camera.scale, -engineComms.toDraw.camDy*camera.scale); // should fix later: sudden zooming does not get adjusted for
  underCan.ctx.globalCompositeOperation = 'destination-out';
  underCan.ctx.fillRect(0,0,underCan.canvas.width,underCan.canvas.height)
  underCan.ctx.globalCompositeOperation = 'source-over';
  underCan.ctx.setTransform(can.ctx.getTransform());
  particles.draw(1)

  //draw items

  let items = grid.getNearby(camera.pos.x,camera.pos.y,1,grid.miscGrid)
  items.forEach((e)=>{
    e.draw(dt)
  })

  let pn2 = performance.now()

  let ballList = [...entityList.activatedBalls]

  for(let i = ballList.length-1; i>-1; i--){
    let e = ballList[i]
    e.draw()
  }
  test.perf = (performance.now()-pn2) * 0.1 + test.perf*0.9

  let walls = grid.getNearby(camera.pos.x,camera.pos.y,2,grid.grid)
  walls.forEach((e)=>{
    e.draw()
  })
  particles.draw(2)
  drawShootAngle(date) // this is fine to be in draw update, not physics, because it updates at the last second anyway
  can.ctx.restore()
  drawPlayerGUI()

  can.ctx.fillStyle = "pink"
  can.ctx.fillText(Math.floor(dt)+" "+(Math.round(performance.now()-pn)+" "+Math.floor(test.perf*100)),100,100)
  if(settings.offline){
    can.ctx.fillStyle = "red"
    can.ctx.fillText("OFFLINE. SERVED OFFLINE. DEBUG NOT WORK BECAUSE OFFLINE",100,120)
  }
}



function drawShootAngle(date){
  if(entityList.player.tags.has("isDead")){return}
  if(controller.mouseIsDown){

    can.ctx.save()

    if(!settings.mobile){
      controller.updateJump(mouseX,mouseY)
    }

    let d = distance(controller.dv.x,controller.dv.y)
    // can.ctx.lineCap = "round"

    can.ctx.setLineDash([150*settings.relativeSize,55*settings.relativeSize])
    let speed = Math.max(2,d/100)
    can.ctx.lineDashOffset = controller.UI.shotDashOffset
    controller.UI.shotDashOffset += gameWorld.dt/25*speed

    can.ctx.strokeStyle = "rgba(255,255,0,0.9)"
    can.ctx.beginPath()
    let mul1 = 0.5
    can.ctx.lineWidth = 1

    // can.ctx.moveTo(entityList.player.x-controller.dv.x*mul1,entityList.player.y-controller.dv.y*mul1)
    // can.ctx.lineTo(entityList.player.x,entityList.player.y)
    can.ctx.moveTo(entityList.player.x,entityList.player.y)
    can.ctx.lineTo(entityList.player.x-controller.dv.x*mul1,entityList.player.y-controller.dv.y*mul1)

    // let mul1 = 0.1
    // let mul2 = 0.005

    // if(d>2000){
    //   mul1 = 200/d
    //   mul2 = 10/d
    // }
    // can.ctx.lineWidth = Math.max(2,d/400)

    // can.ctx.lineTo(entityList.player.x+controller.dv.x*mul1,entityList.player.y+controller.dv.y*mul1)
    // let ang = 0.5
    // let r1 = Lrotate(controller.dv.x,controller.dv.y,ang)
    // let r2 = Lrotate(controller.dv.x,controller.dv.y,-ang)
    // can.ctx.moveTo(entityList.player.x+controller.dv.x*mul1,entityList.player.y+controller.dv.y*mul1)
    // can.ctx.lineTo(entityList.player.x+controller.dv.x*mul1-r1.x*mul2,entityList.player.y+controller.dv.y*mul1-r1.y*mul2)
    // can.ctx.moveTo(entityList.player.x+controller.dv.x*mul1,entityList.player.y+controller.dv.y*mul1)
    // can.ctx.lineTo(entityList.player.x+controller.dv.x*mul1-r2.x*mul2,entityList.player.y+controller.dv.y*mul1-r2.y*mul2)
    can.ctx.stroke()
    // can.ctx.lineCap = "butt"

    if(!controller.mouseDownPos.charged && date-controller.mouseDownPos.time>700){
      controller.mouseDownPos.charged = true
      new sparkleParticle(entityList.player.x,entityList.player.y)
      entityList.player.damageMultiplier = 2
    }

    can.ctx.restore()
  }
}

function drawPlayerGUI(){


  if(controller.mouseIsDown && false){ // turn off for now
  can.ctx.strokeStyle = "rgba(255,255,0,0.8)"
  can.ctx.lineWidth = 1
  can.ctx.beginPath()
  can.ctx.moveTo(controller.mouseDownPos.x,controller.mouseDownPos.y)
  can.ctx.lineTo(mouseX,mouseY) 
    let d = distance(controller.dv.x,controller.dv.y)
    let ang = 0.5
    let mul2 = 20/(1+d)
    let r1 = Lrotate(controller.dv.x,controller.dv.y,ang)
    let r2 = Lrotate(controller.dv.x,controller.dv.y,-ang)
    can.ctx.moveTo(controller.mouseDownPos.x,controller.mouseDownPos.y)
    can.ctx.lineTo(controller.mouseDownPos.x-r1.x*mul2,controller.mouseDownPos.y-r1.y*mul2)
    can.ctx.moveTo(controller.mouseDownPos.x,controller.mouseDownPos.y)
    can.ctx.lineTo(controller.mouseDownPos.x-r2.x*mul2,controller.mouseDownPos.y-r2.y*mul2)
  can.ctx.stroke()
  }
  // health and energy bars on top left of screen
  let barWidth = Math.min(Width/7,Height/4)
  let barHeight = barWidth/10
  let padding = barHeight/2

  // health bar
  can.ctx.fillStyle = "red"
  can.ctx.fillRect(padding+settings.insets.left, padding, barWidth, barHeight)
  can.ctx.fillStyle = "rgb(40,170,60)"

  let hpPers = Math.max(0,(entityList.player.hp/entityList.player.maxHp))

  can.ctx.fillRect(padding+settings.insets.left, padding, barWidth*hpPers, barHeight)
  if(entityList.player.armor && !entityList.player.armor.broken){
    can.ctx.strokeStyle = "#606060"
    can.ctx.fillStyle = "rgba(170,170,170,0.4)"
    can.ctx.lineWidth = 5
    can.ctx.beginPath()
    can.ctx.roundRect(padding+settings.insets.left, padding, barWidth*(entityList.player.armor.hp/entityList.player.armor.maxHp), barHeight,5)
    can.ctx.fill()
    can.ctx.stroke()
  }


  // energy bar
  can.ctx.fillStyle = "gray"
  can.ctx.fillRect(padding+settings.insets.left, padding+padding+barHeight, barWidth, barHeight)
  can.ctx.fillStyle = "rgb(40,170,250)"
  can.ctx.fillRect(padding+settings.insets.left, padding+padding+barHeight, barWidth*(entityList.player.energy/entityList.player.maxEnergy), barHeight)

  if(settings.mobile){
    if(controller.movement.down){
      can.ctx.lineWidth =3 
      can.ctx.strokeStyle = "rgb(255,"+255*(1-entityList.player.movementScalar)+",255)"
      can.ctx.beginPath()
      can.ctx.moveTo(controller.movement.x,controller.movement.y)
      can.ctx.lineTo(controller.movement.x+controller.movement.dx,controller.movement.y+controller.movement.dy)
      can.ctx.stroke()

      can.ctx.lineWidth = 1 
      can.ctx.beginPath()
      can.ctx.arc(controller.movement.x,controller.movement.y,100,0,TAU)
      can.ctx.stroke()
    }
  }


  if(entityList.player.effects.getValue("checkpoint")){
    can.ctx.save()
    can.ctx.fillStyle = "lime"
    can.ctx.shadowColor = "green"
    can.ctx.font = `bold ${Math.floor(27*settings.relativeSize)}px arial`
    can.ctx.shadowOffsetX = -settings.relativeSize*3
    can.ctx.shadowOffsetY = settings.relativeSize*4
    can.ctx.fillText("Remaining checkpoints: "+entityList.player.effects.getValue("checkpoint"), padding+settings.insets.left+barWidth+5, padding+barHeight)
  }
  can.ctx.restore()

  if(test.smoothnessIndicator){
    can.ctx.fillStyle = `rgb(${gameWorld.frame % 255 },255,255)`
    can.ctx.fillRect(Math.sin(gameWorld.lastTime/400)*WidthM+WidthM,Height-200,100,100)
    can.ctx.fillRect(100*(gameWorld.frame%2),Height-100,100,100)
  }


  //draw status effects on top right of screen @draw effect

  let effectSize = 50

  let effectX = Width - padding - settings.insets.right - effectSize
  let effectY = padding + settings.insets.top + 30 // (30 is for pause button)
  
  //@draw effect
  can.ctx.save()
  let effectArr = Object.keys(entityList.player.effects.active)
  effectArr.forEach((k)=>{
    let effect = entityList.player.effects.active[k]
    let effectOptions = effects.effectOptions[k]
    if(effectOptions.nodraw){return}
      can.ctx.fillStyle = effects.effectOptions[k].backgroundColor?effects.effectOptions[k].backgroundColor:"lime"
      can.ctx.fillRect(effectX, effectY, effectSize, effectSize)
      can.ctx.fillStyle = "black"
      can.ctx.fillRect(effectX, effectY, effectSize, (1-entityList.player.effects.getValueRatio(k))*effectSize)
      effectY += effectSize + padding
    if(effectOptions.sprite){
      can.ctx.save()
      can.ctx.lineWidth = 3
      can.ctx.strokeStyle = effectOptions.sprite.color
      can.ctx.translate(effectX+effectSize/2,effectY-effectSize/2)
      can.ctx.stroke(effectOptions.sprite.path)
      can.ctx.restore()
    }
  })
  can.ctx.restore()

}






//// level generator


function segWalls(x1,y1,x2,y2,div){
  let dx = (x2-x1)/div
  let dy = (y2-y1)/div
  for(let i = 0; i < div; i++){
    entityList.walls.push(new wall(x1+i*dx,y1+i*dy,x1+i*dx+dx,y1+i*dy+dy,can.ctx))
  }
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


  if(settings.mobile){
    if(controller.movement.down){
      let norm = distance(controller.movement.dx,controller.movement.dy)
      ball.movementVector.x = controller.movement.dx
      ball.movementVector.y = controller.movement.dy
      ball.movementScalar = Math.min(1,norm/100)
    } else {
      ball.movementVector = {x:0,y:0}
    }
  }
}

document.addEventListener("mousedown",(e)=>{
  controller.mouseDownPos = {x:e.clientX,y:e.clientY,time:Date.now()}
  controller.mouseIsDown = true
})

document.addEventListener("mouseup",(e)=>{
  controller.endJump(mouseX,mouseY)
})

// document.addEventListener("wheel",(e)=>{e.preventDefault()},{passive: false})


window.addEventListener("resize",(e)=>{
  // Width = window.innerWidth
  // Height = window.innerHeight
  Width = document.documentElement.clientWidth
  Height = document.documentElement.clientHeight

  WidthM = Width/2
  HeightM = Height/2

  can.canvas.width = Width
  can.canvas.height = Height

  underCan.canvas.width = Width
  underCan.canvas.height = Height

  settings.relativeSize = (Height+Width)/3723
  if(settings.mobile){
    settings.relativeSize*=1.2
  }


  settings.insets=getSafeAreaInsets()

})



document.addEventListener("keydown",(e)=>{
  controller.keys[e.key.toLowerCase()]=true


  if(e.key === "Escape"){
    gameWorld.togglePause()
  }


  if(e.key === "T"){
    player.movementSpeed = 0.05
    player.y -= 4000
  } else if(e.key==="t"){
    player.movementSpeed = 0.005
  } else if(e.key ==="g"){
    test.smoothnessIndicator = !test.smoothnessIndicator
  } else if(e.key==="q"){
    gameWorld.timeWarp = -1
  }else if(e.key==="Q"){
    gameWorld.timeWarp += 1
  } else if(e.key==="E"){
    test.toGen()
  }

  if(e.key === "r" && debug){
    player.x = 0
    player.y = 400
    player.vx = 3
    player.vy = -0.3
    player.damageMultiplier = 0.1
    // test.dtLock = 30

    summon("normal",400,370)
  }

  if(e.key === "0"){
    structureGenerator.build(prompt("structure?"),0,0)
  }

  // e.preventDefault()
})


document.addEventListener("keyup",(e)=>{
  controller.keys[e.key.toLowerCase()]=false
})
























/////// touch handler


function mobileClick() {

    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,      // Crucial: Allows the event to travel up to document/window
        cancelable: true    // Allows preventDefault() to work if needed
    });

    document.dispatchEvent(clickEvent);
}


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

      mobileClick()
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
var TO = gameWorld.TO




function getSafeAreaInsets() {
  // Get the computed styles of the document root
  const styles = window.getComputedStyle(document.documentElement);
  
  // Parse the pixel values (removing 'px' and converting to integers)
  return {
    top: parseInt(styles.getPropertyValue('--safe-top')) || 0,
    right: parseInt(styles.getPropertyValue('--safe-right')) || 0,
    bottom: parseInt(styles.getPropertyValue('--safe-bottom')) || 0,
    left: parseInt(styles.getPropertyValue('--safe-left')) || 0
  };
}

// Example usage inside your canvas render loop:
settings.insets = getSafeAreaInsets();















function notify(str,x=10){
  let notif = document.getElementById("notification_center")
  let n = DCC("div",notif)
  n.innerText = str
  setTimeout(()=>{
    n.remove()
  },x*1000)
}



function generateFloor(x,y){
  let rx = 2000 + rand(18000)
  let ry = rand(-2500)
  let wall = build(x,y,x+rx,y+ry,"normal",{hpMult:10})[0]

  if(x > 8000){
    let zombies = normalRandom(3,3)
    for(let i = 0; i < zombies; i++){
      let p = pointOnWall(wall,rand(), -30)
      summon("zombie",p.x,p.y)
    }
  }

  let res = structureGenerator.buildOnWall(wall,ranarr("vase","flask1","flask2","crate1"),rand())
  while( res){
    res = structureGenerator.buildOnWall(wall,ranarr("vase","flask1","flask2","crate1"),rand())
  }

  grid.addPt(x+rx,y+ry,()=>{generateFloor(x+rx,y+ry)},grid.activationGrid)
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


  grid.addPt(x+floorLength,y,()=>{generateFloor(x+floorLength,y)},grid.activationGrid)



  tmp.hp*=10

  let doorHeight = y-250-rand(150)
  entityList.walls.push(makeWooden(new wall(wallX.a,y,wallX.a,doorHeight,can.ctx),0.2))
  let rightWall = newWall(wallX.a,doorHeight,wallX.a,height)
  rightWall.splitting = {minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}
  let leftWall = newWall(wallX.b,y,wallX.b,height)
  leftWall.splitting = {minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}
  // entityList.walls.push(new wall(wallX.a,height,wallX.b,height,can.ctx)) // old roof
  mirror(newWall,wallX.a,height,wallX.a+floorWidth/3,height,midX,1).forEach((e)=>{makeWooden(e).tags.add("sided")}) // roof
  newWall(wallX.a+floorWidth/3,height,wallX.b-floorWidth/3,height)
  dropItem("armor+",midX,height)


  let floor = doorHeight - rand(150)
  while(floor > height + 200){

    let floorHeight = 230+rand(200)

    let floorX = 40+rand(floorWidth-180)
    let start = wallX.a
    let end = wallX.b
    let flipped = false
    let flipInt = 1
    if(Math.random()>0.5){floorX*=-1;start=wallX.b;end=wallX.a;flipped=true;flipInt=-1} //left or right
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


    if(Math.abs(floorX) > 400 && rand(0.3)){ // balcony
      let wall = flipped?leftWall:rightWall
      let balconyHeight = -200-rand(30)
      let newWall = wall.silentSplit(start,floor,start,floor+balconyHeight)
      let balconyEnd = start-(300+rand(100))*flipInt
      build(start,floor+40,(start+balconyEnd)/2,floor,"wood")
      build(start,floor,balconyEnd,floor)
      build(balconyEnd,floor,balconyEnd,floor-40-rand(30))

      if(rand(0.9)){
        build(start,floor,start,floor+balconyHeight,"glass",{tags:["AIdamage"]})
      }

      if(rand(0.1)){
        structureGenerator.build("table",(start+(balconyEnd-start)/1.5),floor)
      }


      if(newWall.midpoint.y < wall.midpoint.y){
        flipped?(leftWall=newWall):(rightWall=newWall)
      }

    }



    if(Math.random()>0.5){ // spawn rate
      summon("normal",start+floorX*0.5,floor-60,{brute:rand(0.03)})
    } else if(rand(0.6) && Math.abs(floorX) > 200){
      let res = structureGenerator.build(ranarr("container","vase","podium","container","vase"),start+floorX*rand()*0.9,floor)
      if(rand(0.4)){
      while(rand(0.9) && res !== false){
        res = structureGenerator.build(ranarr("vase","flask1","flask2"),start+floorX*rand()*0.9,floor)
      }}
    }


    floor -= floorHeight
  }

  /// boss level

  // newWallTo(wallX.a,height,200-floorWidth,-300)
  // newWallTo(wallX.b,height,-(200-floorWidth),-300)

  mirror(newWall,wallX.a,height,wallX.a,height-300,midX)
  height -= 300
  let fat = 900

  mirror(newWall,wallX.a,height,midX-180,height,midX)
  build(midX-180,height,midX+180,height,"wood",{sided:true,hpMult:3})
  mirror(newWall,wallX.a,height,midX-fat,height-300,midX)
  height -= 300
  mirror(newWall,midX-fat,height,midX-fat,height-2300,midX).forEach((e)=>{e.splitting = {minLength:50,breakLength:100}}) // wall
  let top = height-2300

  height -= 400
      
  mirror(newWall,midX-fat,height,midX-500,height,midX).forEach((e)=>{if(rand(0.1)){return};entityList.balls.add(new ball(e.midpoint.x,e.midpoint.y-60,50,can.ctx))})
  height -= 200
  mirror(newWall,midX-fat,height,midX-600,height,midX).forEach((e)=>{if(rand(0.15)){return};entityList.balls.add(new ball(e.midpoint.x,e.midpoint.y-60,50,can.ctx))})
  height -= 200
  mirror(newWall,midX-fat,height,midX-700,height,midX).forEach((e)=>{if(rand(0.2)){return};entityList.balls.add(new ball(e.midpoint.x,e.midpoint.y-60,50,can.ctx))})
  height -= 400
  newWall(midX-200,height,midX+200,height)
  let boss = newBall(midX,height-60,80,can.ctx)
  boss.hp *= 5
  boss.maxHp *= 5
  boss.mass = 2
  boss.damageMultiplier = 0.7
  boss.onDeath.push(()=>{boss.vx*=0.8;boss.vy*=0.8; dropItem("hp+",boss.x,boss.y)})



  


  height = top
  build(midX-fat,height,midX+fat,height,"wood",{splitting:{minLength:50,breakLength:100}}) // roof

  let cheatHeight = -500
  dropItem("endless",0,cheatHeight)
  build(-100,cheatHeight,100,cheatHeight)


  let itemArr = ["enerjitsu","moverSummon","dmg+","hp+","armor+","energetic","energenin","momentum profligacy","checkpoint"]

  for(let i = 0; i < 10; i+=2){
    let theight = cheatHeight-i*150-400
    build(-300,theight,-100,theight,"normal",{mirrorX:0})
    dropItem(itemArr[i],-200,theight)
    dropItem(itemArr[i+1],200,theight)
  }


  let starterDmg = dropItem("dmg+",-150,0)
  starterDmg.pickupSpeed *= 4
  dropItem("dmg+",midX,height,{msg:"raw dog bonus: +5% dmg"}).link(starterDmg)






  build(midX-fat,height,midX,height-250,"wood",{splitting:{minLength:50,breakLength:500},mirrorX:midX,sided:1}) // roof triangle
  build(midX-fat,height,midX-fat-400,height-450,"accelerator",{splitting:{minLength:50,breakLength:100},mirrorX:midX,reverse:true,mirroredReverse:true})
  fat += 400
  height -= 450
  build(midX-fat,height,midX-fat-900,height-250,"accelerator",{splitting:{minLength:50,breakLength:100},mirrorX:midX,reverse:true,mirroredReverse:true})
  fat += 900
  height -= 250

  build(midX-fat,height,midX-fat-600,height-1250,"accelerator",{splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}},mirrorX:midX,reverse:true,mirroredReverse:true})
  height -= 1250
  fat+=600

  let aheight = 11250
  build(midX-fat,height,midX-fat-100,height-aheight,"normal",{splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}},mirrorX:midX})




  for(let i = 0; i < 5; i++){
    let h = height+i*400
    build(midX-fat+1800,h,midX-fat+2100,h,"normal",{splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}},mirrorX:midX})
  }

  for(let i = 0; i < 4; i++){
    let h = height+i*500
    build(midX-300,h,midX+300,h,"normal",{splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}})
    if(i==3){
      let tmp1 = h
      let tmp2 = midX
      boss.onDeath.push(()=>{
        dropItem("checkpoint",tmp2,tmp1)
      })
    }
  }

  for(let i = -2; i < 7; i++){
    let h = height-i*250
    build(midX-fat+500,h,midX-fat+700,h,"normal",{sided:true,splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}},mirrorX:midX})
  }

    for(let i = aheight-100; i > 0; i-=rand(300)+100){
    let l = rand(600)+600
    let f = rand(fat*2-l)
    let h = height-i
    build(midX-fat+f,h,midX-fat+f+l,h,"brick",{sided:true,splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}})
    let mx = midX-fat+f+l/2
    if(rand(0.6)){
      let options = {}
      if(rand(0.3)){options.grunt=true}
      summon(rand(0.6)?"normal":"apprentice",mx,h-60,options)
    } else if(rand(0.7)){
      structureGenerator.build(ranarr("bottle","vase","container2"),mx,h)
    }
  }

  height-=aheight

  let zentoBB = structureGenerator.boundingBox("zento",0,0)
  for(let i = 0; i < aheight;){
    let h = height-i
    structureGenerator.build("zento",midX,h,{noIntersectionCheck:true})
    if(i===0){
      dropItem("energetic",midX,h)
    }
    let lr = rand()>0.5?1:-1
    let dx = (1600+rand(3800))*lr
    let dy = rand(600)+400
    build(midX+480*lr,h,midX + dx-480*lr,h-dy,"wood",{reverse:lr<0,sided:true,splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}})
    midX += dx
    i += dy
    tmp = i
    tmp2 = lr
  }
  height = height-tmp
  build(midX+2400*tmp2,height,midX-480*tmp2,height,"wood",{hpMult:50,splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}})



  build(midX+2400*tmp2,height,midX+8400*tmp2,height,"normal",{hpMult:50,splitting:{minLength:50,breakLength:100,breakVariability:()=>{return(rand(3))}}})

  midX = (midX+2400*tmp2 + midX+8400*tmp2)/2

  let templeWid = 1500
  let floorHeight = 900

  while(templeWid > 500){
    let extrude = 80
    build(midX+templeWid,height,midX+templeWid,height-floorHeight,"wood",{mirrorX:midX,splitting:{minLength:50,breakLength:100}})
    build(midX+templeWid+extrude,height-floorHeight,midX+templeWid+extrude*2,height-floorHeight-extrude,"normal",{mirrorX:midX})
    build(midX+templeWid+extrude,height-floorHeight,midX-templeWid-extrude,height-floorHeight,"normal",{splitting:{minLength:50,breakLength:100}})
    if(rand(0.1)){
      summon("enerjitsuist hopper",midX,height-60,{insane:1})
    }else{summon("enerjitsuist",midX,height-60)}
    templeWid -= 100
    height -= floorHeight
    floorHeight -= 10
  }

      summon("divider",midX,height-60)
    // @generate

  test.generateEnd = {x:midX,y:height-60}




}

















//notes
// debug is DT based: dont mousedown (or fix)
// collision type 3 does not place the ball to the proper place and instead resolves like a non sweep collision (the ball gets pushed AFTER, so mindist may be much smaller than r)
// super skeptical if blood is effected by order of forceM and damage




// unbreakable walls //
// player trail //
// height advantage

// bounciness for wall //
// mobile rotation fix //
// mobile movement fix //
// brutes //
// balconies //
// checkpoints //
// wall collateral chain // 
// vases //
// game timeout manager //
// blood update (1) //
// fast ball fix (1 - brute force push away) //
// trace through one side walls //
// effects (1 - brute boxes) //
// scrolling background (1 - doesnt work, dizzy) //
// acceleration update //
// phone screen bar fix //
// onebody objects //
// lineto particles //
// escape menu //
// cheating buffs room //
// teleport function //
// rotatable buildings // 
// rotated wall generation //


//// USAGE
// dividers
// dashers
// flash particles

//// BEAUTY / UI
// rain and particles
// sounds
// decorators
// effects ui update
// effect icons
// blood splatter ellipse
// sparkle effect
// notifications update
// escape menu buttons

//// GAME / BUILDINGS
// explosions break walls
// explosives
// teleportal
// enerjitsu temple
// zombie endless
// wall breaking dependencies
// side chambers
// crate and shattering mechanics 2
// nested building generation


/// NEW / IDEAS
// lore droplets

//// AI / MOBS
// mob mechanics (ball remembers when it was hit by what, so no invulnerability in mobs)
// AI movement
// energy regeneration on hit
// player event migration to events dict

//// BUGS / DEBUGGING
// ball sweep physics
// wall sweep physics fix 2
// acceleration triangle fix
// double wall penetration
// performance measuring





















