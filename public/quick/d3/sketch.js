
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




let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


// const socket = io.connect('/')

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


function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}


var frameFuncs = []

function mainLoop(time){
  frameFuncs.forEach((e)=>{
    e(time)
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
    // document.body.append(video)
    if(type=="screen"){
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });video.srcObject = stream;})
    } else {
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });video.srcObject = stream;})
    }
    return(video)
  }

function copyToCanvas(img,Lcan){
  Lcan.ctx.drawImage(img, 0, 0, Lcan.canvas.width, Lcan.canvas.height);
}

function setDefaultAbsolute(elm){
  elm.style.position = "absolute"
  elm.style.top = elm.style.left = "0px"
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


/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============





class ALG2{
  static history = {};
  static keys = [] //cannot be set because order matters

  static robustLearn(str,ans){
    let split = str.split("")
    let dict = {}
    split.forEach((e,i)=>{dict[i]=e})
    this.learn(dict,ans)
  }

  static learn(dict,ans){
    let str = ""
    this.keys.forEach((e)=>{
      str += dict[e]
    })
    this.history[str] = ans
  }

  static strRemove(str,posarr){
    let outstr1 = ""
    let outstr2 = ""
    let i = 0;
    while(str.length>0){
      if(!posarr.includes(i)){
        outstr1 += str[0]
      } else {
        outstr2 += str[0]
      }
      i++;
      str = str.substring(1)
    }
    return([outstr1,outstr2])
  }

  static prune(posarr){
    // let pkeys = []
    // this.keys.forEach((e,i)=>{if(keys.includes(e)){p.push(i)}})

    let result = {"corr":0,"wrong":0}
    let newHistory = {}
    let newCutHistory = {}
    Object.keys(this.history).forEach((e)=>{
      let cut = this.strRemove(e,posarr)
      let newStr = cut[0]
      let newStr2 = cut[1]
      
      // if(newHistory[newStr]===undefined){
      //   newHistory[newStr] = this.history[e]
      // } else {
      //   if(newHistory[newStr] == this.history[e]){
      //     results.corr += 1
      //   } else {
      //     results.wrong += 1
      //   }
      // }
      if(newHistory[newStr]===undefined){
        newHistory[newStr] = {"t":0,"f":0,"c":0}
      }
        newHistory[newStr].c += 1
      if(this.history[e]===true){
        newHistory[newStr].t += 1
      } else {
        newHistory[newStr].f += 1
      }

      if(newCutHistory[newStr2]===undefined){
        newCutHistory[newStr2] = {"t":0,"f":0,"c":0}
      }
        newCutHistory[newStr2].c += 1
      if(this.history[e]===true){
        newCutHistory[newStr2].t += 1
      } else {
        newCutHistory[newStr2].f += 1
      }



    })
    // let results = []
    let results = {"ratio":0,"c":0}
    Object.values(newHistory).forEach((e)=>{
        let small, big;
        if(e.t>e.f){small=e.f;big=e.t}else{small=e.t;big=e.f}
        results.ratio+=small/e.c
        results.c+=e.c
    })
    let results2 = {"ratio":0,"c":0}
    Object.values(newCutHistory).forEach((e)=>{
        let small, big;
        if(e.t>e.f){small=e.f;big=e.t}else{small=e.t;big=e.f}
        results2.ratio+=small/e.c
        results2.c+=e.c
    })

      return({"r1":results,"r2":results2})
  }

  static kill(pos){
    let newHistory = {}
    Object.keys(this.history).forEach((e)=>{
      let newStr = e.slice(0,pos) + e.slice(pos+1) 
      newHistory[newStr] = this.history[e]
    })
    this.keys.splice(pos,1)
    this.history = newHistory
  }

  static pruneAll(amt){
    let results = []
    let prunearr = []
    this.keys.forEach((e,i)=>{
      prunearr.push(i)
      if((1+i)%amt===0){
        results.push(this.prune(prunearr))
        prunearr = []
      }
    })
    if(prunearr.length>0){
      results.push(this.prune(prunearr))
    }
    return results
  }
}

for(let i = 0; i < 32; i++){ALG2.keys.push(i)}















