
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = "100%"
  myCanvas.style.height = "100%"
  myCanvas.style.position = "fixed"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let smallerDim = Width<Height?Width:Height

let ctx = document.getElementById("myCanvas").getContext("2d")

var drawingCanvas;

function ranarr(arr){
  return(arr[Math.floor(Math.random()*arr.length)])
}


addEventListener("resize", (event) => { 

Width = window.innerWidth
Height = window.innerHeight
})



let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


// const socket = io.connect('/')

class LCanvas{ //lopkns template canvas
  constructor(w=100,h=100,id=("LCanvas-"+Math.random())){
    this.canvas = document.createElement("canvas")
    this.canvas.id = id
    this.ctx = this.canvas.getContext("2d")
    this.canvas.style.position = "fixed"
    this.canvas.style.top = "0px"
    this.canvas.style.left = "0px"
    this.canvas.zIndex = "1500"
    this.canvas.width = w
    this.canvas.height = h
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
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

class LPerceptron{ //it should have input name, input value. each input should have a multiplier towards a result
  constructor(){
    this.outputInputpair = {"testOutput":{"testInput":2}}
    this.inputs = {}
  }
  input(dict){
    this.inputs = dict
  }
  generateOutput(item){
    let result = 0
    item = this.outputInputpair[item]
    let objk = Object.keys(item)
    for(let i = 0; i < objk.length; i++){
      let inputting = objk[i]
      result += this.input[inputting] * item[inputting]
    }
    return(result)
  }
  learn(item,expected){
    item = this.outputInputpair[item]
    let objk = Object.keys(item)
    for(let i = 0; i < objk.length; i++){
      let inputting = objk[i]
      this.input[inputting] += item[inputting] * (expected?1:-1)
    }
  }
}


/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============







class liner{

  constructor(ctx,x,y,type,colType,following){
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.size = 3

    this.nvx = 0
    this.nvy = 0

    this.oldPath = []
    this.lineLife = 100
    this.actLife = 0
    this.maxActLife = 10000000
    this.counter = 0
    this.type = type
    this.colType = colType
    this.bounded = false
    this.following = false
    this.basename = "liner"
    this.mass = this.size
    this.ctx = ctx

    if(type == 5){
      this.nonPlayerControllable = true
    } else if(type == 6){
      this.radius = Math.random()*8+0.2
      if(Math.random()>0.5){this.radius*=-1}
    } 



    return(this)
  }


  update(){
    this.counter += 1
    let updated = false

    if(this.following && !this.nonPlayerControllable){
    let d = distance(this.x,this.y,mouseX,mouseY)
      this.nvy -= (this.y - mouseY)/d*0.4
      this.nvx -= (this.x - mouseX)/d*0.4
    }

    if(this.circulate){
      this.nvy += -(this.y-(Height/2))/1200
      this.nvx += -(this.x-(Width/2))/1200
    }

    if(this.type == 0){ //small line
      this.x += this.vx
      this.y += this.vy
      this.vx += Math.random()-0.5
      this.vy += Math.random()-0.5
      this.vx += this.nvx
      this.vy += this.nvy
      this.nvx = 0
      this.nvy = 0
      updated = true

    } else if(this.type == 1){ //more spontaneous small line
      if(this.counter%5 == 0){
        this.x += this.vx
        this.y += this.vy
        this.vx += this.nvx
        this.vy += this.nvy
        this.nvx = 0
        this.nvy = 0
        this.vx += (Math.random()-0.5)*5
        this.vy += (Math.random()-0.5)*5
        updated = true
        
      }
    } else if(this.type == 2){ // slower electric small line
      if(this.counter%15 == 0){
        this.x += this.vx
        this.y += this.vy
        this.vx += this.nvx
        this.vy += this.nvy
        this.nvx = 0
        this.nvy = 0  
        this.vx += (Math.random()-0.5)*15
        this.vy += (Math.random()-0.5)*15
        updated = true
        
      }
    } else if(this.type == 3){  //grower
      if(this.counter%15 == 0){
        this.x += this.vx
        this.y += this.vy
        this.vx += this.nvx
        this.vy += this.nvy
        this.nvx = 0
        this.nvy = 0
        this.size += 0.2
        this.vx += (Math.random()-0.5)*15
        this.vy += (Math.random()-0.5)*15
        updated = true
      }
    } else if(this.type == 4){ //lightning
      if(this.counter%5 == 0){
        this.x += this.vx
        this.y += this.vy
        this.vx += this.nvx
        this.vy += this.nvy
        this.nvx = 0
        this.nvy = 0
        this.size += 0.6
        this.vx += (Math.random()-0.5)*55
        this.vy += (Math.random()-0.5)*55
        updated = true
      }
    } else if(this.type == 5){ //tree
      if(this.counter%this.updateSpeed == 0){
        this.mass = Infinity
        this.x += this.vx
        this.y += this.vy
        this.vx += this.nvx
        this.vy += this.nvy
        this.nvx = 0
        this.nvy = 0
        this.vx += (Math.random()-0.5)*55
        this.vy += (Math.random()-0.5)*55

        this.lineUp += 1
        if(this.lineUp%this.myDat == 0 && this.bounded === false && parr.length < 1500){
          let c = new liner(this.x,this.y,5,this.colType,0)
          c.maxActLife = 10000000
          c.vx = this.vx + Math.random()*100-50
          c.vy = this.vy + Math.random()*100-50
          c.lineLife = this.lineLife
          c.size = this.size - 1
          c.lineUp = 1
          c.counter = 18
          c.myDat = 1+this.myDat
          c.updateSpeed = this.updateSpeed
          parr.push(c)
        }
        updated = true
      } 
    } else if(this.type == 6){ // rotary
        if(this.counter%5 == 0){
          this.x += this.vx 
          this.y += this.vy 
          this.vx += this.nvx + Math.cos(COUNTER/10) * this.radius
          this.vy += this.nvy + Math.sin(COUNTER/10) * Math.abs(this.radius)
          this.nvx = 0
          this.nvy = 0
          this.vx += (Math.random()-0.5)*2
          this.vy += (Math.random()-0.5)*2
          updated = true
        }
      } else if(this.type == 7){ // line
        if(this.counter%3 == 2){
          this.x += this.vx 
          this.y += this.vy 
          this.vx += this.nvx 
          this.vy += this.nvy
          this.nvx = 0
          this.nvy = 0
          updated = true
        }
      } else if(this.type == 8){ //same as type 1 but straight
      if(this.counter%5 == 0){
        this.x += this.vx
        this.y += this.vy
        this.vx += this.nvx
        this.vy += this.nvy
        this.nvx = 0
        this.nvy = 0
        updated = true
        
      }
    }



    if(this.actLife < this.maxActLife && this.bounded === false && (updated||this.counter < 20)){
      this.actLife += 1
      this.oldPath.push([this.x,this.y,this.x+this.vx,this.y+this.vy,this.lineLife])
    }


    if(this.x < 0 || this.y < 0 || this.x > Width || this.y > Height){
      if(this.invincible>0){
        this.invincible -= 1
      } else {
        this.bounded = true
      }
    }
    
  }

  draw(){
    
    for(let i = this.oldPath.length-1; i > -1; i--){
      let e = this.oldPath[i]
      getCol(this.colType,e[4]/this.lineLife,e,this.ctx)
        this.ctx.lineWidth = this.size
        if(this.sizef){
          this.ctx.lineWidth = this.sizef(this,(i+1)/this.oldPath.length)
        }
      this.ctx.beginPath()
      this.ctx.moveTo(e[0],e[1])
      this.ctx.lineTo(e[2],e[3])
      this.ctx.stroke()
      e[4] -= 2
      if(e[4] <= 0){
        this.oldPath.splice(i,1)
      }
    }

    if(this.specialDraw){
      this.specialDraw(this)
    }
  

    if(this.oldPath.length == 0){
      this.DEL = true
      return("del")
    }
  }
}


class textile{
  constructor(text,x,y){

    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.trailer = false
    this.size = 3 + Math.random()*3
    this.actLife = 400
    this.counter = 0
    this.following = false

    return(this)
  }
}



function getCol(type,l,e,ctx){
  let a = Math.random()
  switch(type){
    case 0:
        ctx.strokeStyle = ("rgba(0,"+e[4]*3.5*(1-a)+",255,"+(0.7+0.3*l)+")") // dark blue
      break;
    case 1:
      ctx.strokeStyle = ("rgba("+(1-a)*255+","+(a)*255+",255,"+(0.7+0.3*l)+")") // lightning
      break;
    case 2:
      ctx.strokeStyle = ("rgba(255,"+(1-a)*255+",255,"+(0.7+0.3*l)+")") //cherry blossom
      break;
    case 3: 
      if(Math.random()<0.70){
      ctx.strokeStyle = ("rgba(255,"+(a*255)+",0,"+(0.7+0.3*l)+")")} else { //keyfire
        ctx.strokeStyle = ("rgba(235,0,0,"+l+")")
      }
      break;
    case 4:
      ctx.strokeStyle = ("rgba(0,"+(1-a)*255+",0,"+(0.7+0.3*l)+")") //conjure darkgreen
      break;
    case 5:
      ctx.strokeStyle = ("rgba("+(1-a)*255+",255,"+(1-a)*255+","+l+")") // conjure lightgreen
      break;
    case 6:
      ctx.strokeStyle = ("rgba(0,"+((1-a)*55+200)+",0,"+(l)+")") // tree green
      break;
    case 7:
      ctx.strokeStyle = ("rgba("+((1-a)*55+200)+",0,0,"+(l)+")") // tree red
      break;
    case 8:
      a = 1-a/2
      ctx.strokeStyle = ("rgba(0,"+e[4]*3.5*(1-a)+",255,"+(0.3+0.7*l)+")") // quelled darkblue
      break;
    // case 8:
    //  a = 1-a/2 // ??? broken?
    //  ctx.strokeStyle = (""+e+(0.7+0.3*l)+")") // quelled darkblue
    //  break;
    case 9:
        ctx.strokeStyle = ("rgba("+e[4]*3.5*(1-a)*5+","+e[4]*3.5*(1-a)*5+","+(e[4]*3.5*(1-a)*2.5*Math.random())+","+(0.7+0.3*l)+")") // shooting star
      break;
    case 10:
      ctx.strokeStyle = ("rgba(255,255,"+(e[4]*3.5*2.5*Math.random())+","+(0.7+0.3*l)+")") // shooting star
      break;
    case 11: //sinusoidal blue
      ctx.strokeStyle = "rgba(0,0,"+(100*Math.sin(e[4]/30)+100)+","+(0.3*a+0.7)+")"
      break;
    case 12: //red green phase shifter
      ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/300))+",100%,"+(50*Math.sin(COUNTER/30+e[4]/30)+25)+"%,"+(0.3*a+0.7)+")"
      break;
    case 13: //rainbow hsla
      ctx.strokeStyle = "hsla("+((COUNTER)%360)+",100%,50%,"+(0.3*a+0.7)+")"
      break;
    case 14: //stripped hsla
      ctx.strokeStyle = "hsla("+((COUNTER+Math.sin(e[4]*50)*40)%360)+",100%,50%,"+(0.3*a+0.7)+")"
      break;
    case 15: //forward phase shifter
      ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/115+COUNTER/150))+",100%,50%,"+(3.7*l)+")"
      break;
    case 16: //osmotic forward phase shifter
      ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/115+COUNTER/150))+",100%,"+(25*Math.sin(e[4]/10+COUNTER/15)+70)+"%,"+(3.7*l)+")"
      break;
    case 17: //reverse osmotic reverse phase shifter
      ctx.strokeStyle = "hsla("+(360*Math.sin(e[4]/150+COUNTER/115))+",100%,"+(25*Math.sin(e[4]/15+COUNTER/10)+70)+"%,"+(3.7*l)+")"
      break;
  }
}









class startclock{

  static time = 0

  static tick(dt){
      dt/=1000
      let t1 = 0.7
      let t2 = 1
      let skip = true;
      if(this.time<t1 && !skip){

      ctx.clearRect(0,0,Width,Height)
      ctx.lineCap = "round"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 25
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/5,-Math.PI/2,-Math.PI/2+Math.PI*2*(this.time/t1))
      ctx.stroke()

      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 15
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(6),0,Math.PI*0.75*(this.time/t1))
      ctx.stroke()
      } else if(this.time<1 && !skip){
        // ctx.clearRect(0,0,Width,Height)
      ctx.lineCap = "round"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 25
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/5,-Math.PI/2,-Math.PI/2+Math.PI*2)
      ctx.stroke()

      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 15
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(6),0,Math.PI*0.75)
      ctx.stroke()
      } else if(this.time<2 && !skip){

        let d = 0.2
        ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,'+d+')'; // smaller = slower fade; larger = faster fade
      ctx.fillRect(0, 0, Width, Height);
      ctx.restore();
            ctx.globalCompositeOperation = 'source-over';

      // ctx.fillStyle = "rgba(0,0,0,"+d+")"
      // ctx.fillRect(0,0,Width,Height)

      ctx.lineCap = "round"
      ctx.strokeStyle = "#00FF00"
      ctx.lineWidth = 25*(this.time+(1-t2))*(this.time+(1-t2))
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(5-(this.time-t2)*5),-Math.PI/2,-Math.PI/2+Math.PI*2)
      ctx.stroke()

      ctx.strokeStyle = "#FFFF00"
      ctx.lineWidth = 15*(this.time+(1-t2))*(this.time+(1-t2))
      ctx.beginPath()
      ctx.arc(Width/2,Height/2,smallerDim/(6-(this.time-t2)*6),0,Math.PI*0.75)
      ctx.stroke()
      } else if(time<2.6 && !skip){
        let d = 0.02
        ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,'+d+')'; // smaller = slower fade; larger = faster fade
      ctx.fillRect(0, 0, Width, Height);
      ctx.restore();
            ctx.globalCompositeOperation = 'source-over';
      } else {
        // ctx.clearRect(0,0,Width,Height)
        myCanvas.style.zIndex = -15

        let centerer = document.createElement("div")
        centerer.classList.add("centerer")

        let div2 = document.createElement("div")
        let div = document.createElement("div")
        let txt = document.createElement("h1")
        // txt.style.zIndex = 1
        txt.innerText = "Hello"
        div.classList.add("text1")

        div2.classList.add("appear")
        div.style.position = "relative"
        div2.onclick = ()=>{
          spawnStars()
        }

        centerer.appendChild(div2)
        document.getElementById("card1").appendChild(centerer)
        // document.body.appendChild(div2)
        div.appendChild(txt)
        div2.appendChild(div)

        // div2.classList.add("appeared")
        // requestAnimationFrame(()=>{div2.classList.add("appeared")})
        setTimeout(()=>{div2.classList.add("appeared");
             const computedStyle = window.getComputedStyle(div2);
            const currentTop = computedStyle.top;
            div2.style.top = currentTop;
        },460)
        setTimeout(()=>{
          div.classList.add("appeared")
          div2.style.top = "10%"
          // div2.style.left = "50%"
        },1000)
        setTimeout(()=>{


          let div5 = document.createElement("div")
              div5.id = "abouts"
              div5.style.left = "10%"
              // div5.style.top = "30%"
              div5.style.minHeight = "50%"
              div5.style.minWidth = "70%"
              div5.style.marginTop = "30vh"
              div5.style.position = "relative"

          let arr = ["about me","motivation","projects","skills","FAQ & other"]
          let arr2= [
            "Hi, I'm Leo! I code a lot as a hobby, creating extensions, prototypes, and automation projects. As a microbiology student, I love blending my scientific knowledge with technology. I'm particularly interested in big data, statistics, and data visualizations.",
            "",
            "",
            "- Large data analysis and visualization (d3js, SQL, python, R) \n\n- Micropipette handling, gel electrophoresis, PCR, cell cultures, aseptic techniques \n\n- 3D printing, rendering, splicing and model design \n\n- Physics engine and simulation programming\t \n\n- Breadboarding, Microcontroller handling and soldering for electronic projects \n\n- Competent in Microsoft Office® software \n\n- Fluent in English, Cantonese, Mandarin",
          ]
          for(let i = 0; i < arr.length; i++){
            setTimeout(()=>{
              let div3 = document.createElement("div")
              let div4 = document.createElement("div")
              div4.innerText = arr[i]
              div3.classList.add("typing-container")
              div4.classList.add("typing")
              div4.classList.add("line-1")

              div4.classList.add("collapsible")

              let extendDiv = document.createElement("div")
              let str = ""
              while(Math.random()<0.97){
                str += ranarr(["this","temporary","is"])
              }
              extendDiv.innerText = arr2[i]?arr2[i]:str
              extendDiv.classList.add("collapsible_content")
              // div4.appendChild(extendDiv)

                div4.addEventListener("click", function() {
                  div4.classList.toggle("active");
                  var content = extendDiv
                  if (content.style.maxHeight){
                    content.style.maxHeight = null;
                  } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                  } 
                });

              div3.style.left = "0%"
              div3.style.top = "10%"
              div3.style.position = "relative"
              div3.appendChild(div4)
              div5.appendChild(div3)
              div4.insertAdjacentElement('afterend', extendDiv)
            },i*700)
          }
              document.getElementById("card1").appendChild(div5)
          

        },2300)
        setTimeout(()=>{div.style.zIndex=30
          document.getElementById("cont").classList.add("appeared")

          drawingCanvas = new LCanvas(0,0,"drawing")
          document.getElementById("cont").appendChild(drawingCanvas.canvas)
          drawingCanvas.fitScreenSize()
          drawingCanvas.balls = []

          // for(let i = 0; i < 15; i++){
          //   setTimeout(()=>{
          //     // drawingCanvas.balls.push({"x":Math.random()*Width,"y":Math.random()*Height,"r":Math.random()*smallerDim/40+2,"vx":0,"vy":0})
          //     let l = new liner(drawingCanvas.ctx,Math.random()*Width,Math.random()*Height,Math.floor(Math.random()*2),8)
          //     // l.circulate = true
          //     parrocesser.parr.push(l)
          //   },Math.random()*10000)
          // }

          events.push({"tick":(dt)=>{

            if(Math.random()**(dt/20)<0.01){
              let l = new liner(drawingCanvas.ctx,Math.random()*Width,Math.random()*Height,Math.floor(Math.random()*2),8)
              parrocesser.parr.push(l)

            }

            let d = 0.2
            // d = 1
            let ctx = drawingCanvas.ctx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0,0,0,'+d+')'; // smaller = slower fade; larger = faster fade
            ctx.fillRect(0, 0, Width, Height);
            ctx.restore();
            ctx.globalCompositeOperation = 'source-over';
            drawingCanvas.balls.forEach((e)=>{

              e.x += e.vx
              e.y += e.vy

              e.vx += (Math.random()-0.5)/5
              e.vy += (Math.random()-0.5)/5

              e.vx *= 0.9995
              e.vy *= 0.9995

              drawingCanvas.ctx.fillStyle = "rgba(255,255,0,0.1)"
              drawingCanvas.ctx.beginPath()
              drawingCanvas.ctx.arc(e.x,e.y,e.r,0,Math.PI*2)
              drawingCanvas.ctx.closePath()
              drawingCanvas.ctx.fill()
            })
          }})
        },4000)


        return("delete")
      }

      this.time+=dt
  }
}

function setPos(d){
   const computedStyle = window.getComputedStyle(d);
            const currentTop = computedStyle.top;
            const currentLeft = computedStyle.left;

            d.style.top = currentTop;
            d.style.left = currentLeft
}


let mainLoop = setInterval(main,20)
let start = time = Date.now()
// var COUNTER = 0;

var parrocesser={"parr":[],"tick":(dt,t)=>{
  for(let i = t.parr.length-1; i > -1; i--){
    let e = t.parr[i]
    e.update()
    if(e.draw() === "del"){
      let g = i
      if(t.parr[i] !== e){ //jank
        t.parr.forEach((E,j)=>{if(E===e){g=j}})
      }
      let x = t.parr.splice(g,1)
      if(x[0] !== e){console.log("CATCHED BUG")}
    }
  }
}}

let events = [startclock,parrocesser]

function main(t){
  let dt = Date.now()-time
  time = Date.now()
  // COUNTER ++ 



  for(let i = events.length-1; i > -1; i--){
    if(events[i].tick(dt,events[i])=="delete"){events.splice(i,1)}
  }
  // ctx.fillStyle = "red"
  // ctx.fillRect(0,0,Width/2,Height/2)



}



function spawnStars(){
  for(let i = 0; i < 10; i++){
    setTimeout(()=>{

      let startPoint = [-200,-200]
      let c = new liner(drawingCanvas.ctx,startPoint[0],startPoint[1],7,10)
      c.vx = -(startPoint[0] - Width*Math.random() - 20)/48
      c.vy = -(startPoint[1] - Height*Math.random() - 20)/48
      // c.vx *= Math.random()*2-1
      // c.vy *= Math.random()*2-1
      c.size = distance(c.vx,c.vy,0,0)/9
      c.sizef = (a,b)=>{return(c.size*b*b*4)}
      c.mass = c.size * 30
      c.starSignature = Math.random()*Math.PI*2
      c.asize = 3*(c.size+1)**1.7
      c.specialDraw = (a)=>{
          gradient = a.ctx.createRadialGradient(a.x+a.vx, a.y+a.vy, 0, a.x+a.vx, a.y+a.vy, a.asize)
          a.A = Math.abs(Math.sin(time/10/(a.asize+3)+a.starSignature))*0.6+0.4
          gradient.addColorStop(0.2, "rgba(255,255,"+a.A*Math.random()*255+","+a.A+")");
          gradient.addColorStop(1, "rgba(255,255,0,0)");

          a.ctx.fillStyle = gradient;
          a.ctx.fillRect(a.x-a.asize+a.vx, a.y-a.asize+a.vy, a.asize*2+a.vx, a.asize*2+a.vy);
          // console.log(a.A)
      }

      parrocesser.parr.push(c)
      c.invincible = 1550

    },Math.random()*10*1000)
  }
  
}





/*
 * plan:
 *
 * Tailwind
 *
 * top bar
 * -------
 *  About me
 *
 *  Showcase of stuff
 *
 * QnA (dynamic)
 *
 *
 *
 *
 *
 *
 *
 */


































