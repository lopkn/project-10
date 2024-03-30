fa = ()=>{return(1)}
let pla = -1
Object.keys(B).forEach((e)=>{
  if(B[e].name=="lopknA65"){
    pla = e
  }
})

 Pangserialise =(ang)=>{
  if(ang<0){ang=2*Math.PI+(ang%(2*Math.PI))}
    else {ang = ang%(2*Math.PI)}
  return(ang)
}

 UangToPSerialised=(ang)=>{
  return(2*Math.PI-(Math.abs(ang)+Math.PI)%(2*Math.PI))
}
let last = [0,0]
setInterval(()=>{if(B[pla].origX != last[0]||B[pla].origY != last[1]){
  last = [B[pla].origX ,B[pla].origY]
  FRAME()
}})

window.SI = A.sendInput
window.SD = A.sendDirection

A.sendDirection = ()=>{}
A.sendInput = ()=>{}
window.U = U


window.anglePair2 = []
window.anglePair1 = []
let COUNTER2 = 0
FRAME =()=>{
  COUNTER2++
  U.angle = Math.floor(COUNTER2%16/4)-1
  anglePair2.push(window.U.angle)
  anglePair1.push(B[pla].dstAngle)
  if(anglePair1.length>1000){
    anglePair1.splice(0,1)
    anglePair2.splice(0,1)
  }

  window.SI()

}

window.dog = ()=>{
  console.log(JSON.stringify(anglePair1),JSON.stringify(anglePair2))
}