
const socket = io.connect('/')
let GAMESESSION = "G10.1"
socket.emit("JOINGAME","G10.1")

document.getElementById('text').remove()
document.getElementById('GIF').remove()
document.getElementById('Interface').remove()
document.getElementById('TopDisplay').remove()
document.getElementById('mapCanvas').remove()
document.getElementById('Inventory').remove()
document.getElementById('Timer').remove()
document.getElementById('CombatMenu').remove()
document.getElementById('myText').remove()
document.getElementById('myButton').remove()
document.getElementById('buttonText').remove()
document.getElementById('discordLink').remove()


socket.on("acknowledge",acknowledge)
// socket.on('TIME',(e)=>{console.log(e)})
var mainLoopInterval;
var fps = 20
function acknowledge(e){
  console.log("HELLO "+e)
}

function startGame(){
  mainLoopInterval = setInterval(()=>{
    mainLoop()
  },1000/fps)
}

function mainLoop(){

}




function findAngleBetweenLinesN(s1,s2){

  // return((Math.atan2(v1[1],v1[0])+Math.PI-Math.atan2(v2[1],v2[0]))/2)
  return((Math.atan(s1)+Math.PI-Math.atan(s2))/2)


}

function pointInLine(px,py,x1,y1,x2,y2){
  if((px <= x1 && px >= x2 )||(px >= x1 && px <= x2)){
    if((py <= y1 && py >= y2 )||(py >= y1 && py <= y2)){
      return(true)
    }
  }
  return(false)
}

function pointsSameSide(p1x,p1y,p2x,p2y,x1,y1,x2,y2){
  let sl = (y1-y2)/(x1-x2)
  
  if(sl == Infinity){
    return((p1x-x1)*(p2x-x1)>0)
  }
  
  let c = y1-(x1*sl)
  //y = sl x + c
  
  let p1Side = p1y - (sl * p1x + c)
  let p2Side = p2y - (sl * p2x + c)
  return(p1Side*p2Side > 0)
}

function vectorNormal(x1,y1,x2,y2){
  let d = distance(x1,y1,x2,y2)
  let dx = (x2-x1)/d
  let dy = (y2-y1)/d
  return([-dy,dx,dy,-dx])
}

function pointLineCollision(x1,y1,x2,y2,x3,y3,x4,y4){
  let slopeL1 = (y2-y1)/(x2-x1)
  let slopeL2 = (y4-y3)/(x4-x3)
  if(slopeL1 != slopeL2){
    

    let yc = 0
    let xc = 0
    
    xc = (-slopeL2*x3 + y3 + slopeL1*x1 - y1)/(slopeL1-slopeL2)
    if(isNaN(xc)){xc = x1}
    yc = (xc-x1)*slopeL1+y1
    if(isNaN(yc)){yc = (xc-x3)*slopeL2+y3}
    return([xc,yc])
  } else {
    return("none")
  }
}

function findSlope(e){
  return((e[3]-e[1])/(e[2]-e[0]))
}
var p1 = [0,0,10,10]
var p2 = [5,0,0,5]

function vectSplit(x,y,sl){

  let dst = Math.sqrt(x*x+y*y)

  let ang = findAngleBetweenLinesN(y/x,sl)
  let a = Math.cos(ang)*dst
  let na = Math.sin(ang)*dst

  return([a,na])

}