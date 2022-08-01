
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