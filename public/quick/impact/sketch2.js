// const observer = new PerformanceObserver((list) => {
//   for (const entry of list.getEntries()) {
//     console.warn('Long animation frame detected (Frame drop risk):', entry);
//   }
// });

// // Observe long frames (supported in Chrome/Edge/Opera)
// observer.observe({ type: "long-animation-frame", buffered: true });

const temporaray = {};
const debug = temporaray.debug = 0;
const Width = temporaray.Width = document.documentElement.clientWidth;
const Height = temporaray.Height = document.documentElement.clientHeight;
const WidthM = temporaray.WidthM = Width / 2;
const HeightM = temporaray.HeightM = Height / 2;

const TAU = Math.PI * 2;

// let myCanvas = document.getElementById("myCanvas")
//
//   myCanvas.width = Math.floor(Width)
//   myCanvas.height = Math.floor(Height)
//   myCanvas.style.width = Math.floor(Width)+"px"
//   myCanvas.style.height = Math.floor(Height)+"px"
//   myCanvas.style.top = "0px"
//   myCanvas.style.left = "0px"

// let ctx = document.getElementById("myCanvas").getContext("2d")

function DCC(el, par) {
  el = document.createElement(el);
  if (par) { par.appendChild(el); }
  return (el);
}
const rand = (x) => {
  if (x == undefined) { return (Math.random()); }
  if (x < 1) {
    if (x < 0) { return (Math.random() * x - x / 2); }
    return (Math.random() < x);
  }
  return (Math.random() * x);
};

function ranarr(...args) {
  const arr = (args.length === 1 && Array.isArray(args[0])) ? args[0] : args;
  return (arr[Math.floor(Math.random() * arr.length)]);
}

function ranRadius(r) {
  const rr = r * 2;
  let out = { x: Math.random() * rr - r, y: Math.random() * rr - r };
  const r2 = r * r;
  while (distanceSq(out.x, out.y) > r2) {
    out = { x: Math.random() * rr - r, y: Math.random() * rr - r };
  }
  return (out);
}

let mouseX = temporaray.mouseX = 0;
let mouseY = temporaray.mouseY = 0;
onmousemove = (e) => { mouseX = (e.clientX); mouseY = (e.clientY); };

function minMax(low, x, high) {
  return (Math.min(high, Math.max(low, x)));
}

// const socket = io.connect('/')
function readCSV(str, del = ",") {
  const arr = str.split("\n");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].split(del);
  }
  return (arr);
}


class LCanvas { //lopkns template canvas
  constructor(w = 100, h = 100, id = ("LCanvas-" + Math.random())) {
    this.canvas = document.createElement("canvas");
    this.canvas.id = id;

    this.canvas.classList.add("mobile");
    // this.canvas.classList.add("screen")

    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.zIndex = "1";
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    document.body.appendChild(this.canvas);
    return (this);
  }

  fitScreenSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  oneTimeDown(f) { // pass in a function for what to do with one click
    this.canvas.addEventListener("mousedown", f, { once: true });
  }

  getPixelRGB(x, y) {
    const d = this.ctx.getImageData(x, y, 1, 1).data;
    return (d);
  }

}

function distance(x1, y1, x2 = 0, y2 = 0) {
  const a = x2 - x1;
  const b = y2 - y1;
  return (Math.sqrt(a * a + b * b));
}

function dist(a, b = { x: 0, y: 0 }) {
  return (distance(a.x, a.y, b.x, b.y));
}

function distanceSq(x1, y1, x2 = 0, y2 = 0) {
  const a = x2 - x1;
  const b = y2 - y1;
  return (a * a + b * b);
}

const frameFuncs = temporaray.frameFuncs = [];

function mainLoop() {
  if (settings.RAF || settings.dualRAF) {
    requestAnimationFrame(mainLoop);
  } else {
    console.log("hey");
  }
  const time = performance.now() - settings.startDate;
  let dt = (time - gameWorld.lastTime);

  if (settings.RAF) {
    dt = (time - gameWorld.lastDrawTime);
    gameWorld.lastDrawTime = time;
  } else {
    gameWorld.lastTime = time;
  }

  // if(settings.RAF && dt < 14*test.slower){requestAnimationFrame(mainLoop);return}
  gameWorld.frame += 1;
  gameWorld.dt = dt;
  const date = Date.now();
  frameFuncs.forEach((e) => {
    e(time, dt, date);
  });

}

function oneTimeTrustedButton(f) {
  const button = document.createElement("button");
  button.style.position = "absolute";
  button.style.backgroundColor = "purple";
  button.innerText = "one time verifier";
  button.style.top = button.style.left = "0px";

  button.style.zIndex = 5000;
  button.addEventListener("click", (e) => { f(e); button.remove(); }, { once: true });
  document.body.appendChild(button);
}


function Lvideo(type = "screen", append = false) {
  const video = document.createElement('video');
  video.id = "Lvideo-" + Math.random();
  video.setAttribute("autoplay", "autoplay");
  if (append) {
    document.body.append(video);
  }
  if (type == "screen") {
    oneTimeTrustedButton(async function () { let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }); video.srcObject = stream; });
  } else {
    oneTimeTrustedButton(async function () { let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); video.srcObject = stream; });
  }
  return (video);
}


//oneTimeTrustedButton(Lvideo)


function copyToCanvas(img, Lcan) {
  Lcan.ctx.drawImage(img, 0, 0, Lcan.canvas.width, Lcan.canvas.height);
}

function setDefaultAbsolute(elm) {
  elm.style.position = "absolute";
  elm.style.top = elm.style.left = "0px";
}


class LrandVel {
  constructor(mult = 1, friction = 0.999) {
    this.val = 0;
  }
  update() {
    this.val += (Math.random() - 0.5) * mult;
    this.val *= friction;
    return (this.val);
  }
}


class Lcolorf { //lopkn's color functions
  static dictify(arr) { //turns arrays of numbers into arrays of dicts
    const outarr = [];
    for (let i = 0; i < arr.length; i += 4) {
      outarr.push({ "r": arr[0], "g": arr[1], "b": arr[2], "a": arr[3] });
    }
    return (outarr);
  }
  static colorDistA(arr1, arr2) {//only works on Arrays of numbers //arr2 should be same length or shorter
    let dst = 0;
    for (let i = 0; i < arr2.length; i++) {
      dst += Math.abs(arr1[i] - arr2[i]);
    }
    return (dst);
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

const wglCan = temporaray.wglCan = { canvas: document.createElement("canvas") };
const gl = temporaray.gl = wglCan.canvas.getContext('webgl2', { preserveDrawingBuffer: true }) || wglCan.canvas.getContext('webgl', { preserveDrawingBuffer: true });
wglCan.ctx = gl;
wglCan.gl = gl;
if (!gl) {
  alert('WebGL is not supported in your browser.');
}
wglCan.canvas.style.pointerEvents = "none";
wglCan.canvas.style.position = "absolute";
wglCan.canvas.style.width = "100vw";
wglCan.canvas.style.height = "100vh";
// wglCan.canvas.style.zIndex = "100"
document.body.append(wglCan.canvas);
