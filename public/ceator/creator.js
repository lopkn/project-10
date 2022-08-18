// function setup() {
//   createCanvas(400, 400);
// }




// let size = 10

// let arr = []
// for(let i = 0; i < size*size; i++){
//   arr.push("")
// }


// var TileCols = {"B:5":"rgb(00FFFF)"}

// function draw() {
  
//   background(220);
//   if(mouseIsPressed){
//     mouseCoords = [Math.floor(mouseX/(20*(20/size))),Math.floor(mouseY/(20*(20/size)))]
//     if(keyIsDown(83)){
//       arr[mouseCoords[0] + mouseCoords[1]*size] = "Sl:1"
//     }else if(keyIsDown(67)){
//       arr[mouseCoords[0] + mouseCoords[1]*size] = ""
//     }else if(keyIsDown(68)){
//       arr[mouseCoords[0] + mouseCoords[1]*size] = "B:5"
//     } else{
//       arr[mouseCoords[0] + mouseCoords[1]*size] = document.getElementById("myText").value
//     }
//   }
//   for(let i = 0; i < size; i++){
//     for(let j = 0; j < size; j++){
//       let aa = arr[j+i*size]
//     if(aa == ""){
//       fill(200,200,200)
//     }else if(aa == 'Sl:1'){
//       fill(50,50,50)
//     } else{
//     let getcol = getCol(aa)
//     if(getcol !== false){
//         fill(getcol)
//     } else {
//         fill(0,0,0)
//       }
//     }
//     rect(20*(20/size)*j,20*(20/size)*i,20*(20/size),20*(20/size))
//   }
//   }
// }

// function getCol(block){
//   let a = Object.keys(TileCols)
//   for(let i = 0; i < a.length; i++){
//     if(a[i] == block){
//       return(TileCols[a[i]])
//     }
//   }
//   return(false)
// }



// function ou(){
//   console.log(JSON.stringify(arr))
// }

// function output(){
//   out1 = []
//   out2 = []
//   for(let i = 0; i < arr.length; i++){
//     if(arr[i] != ""){out1.push(i%size)
//                      out2.push(Math.floor(i/size))}
//   }
  
//   let a = JSON.stringify({locx:out1,locy:out2})
//   let b = a.split('"')
//   let c = ''
//   for(let i = 0; i < b.length; i++){
//     c += b[i]
//   }
// console.log(c)
// return([out1,out2])
  
// }

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

let mainCanvas = document.getElementById("myCanvas")
let mainCTX = mainCanvas.getContext("2d")

let blocksRow = window.prompt("blockwidth")
let blocksCollum = window.prompt("blocksheight")

let blocksize = mainCanvas.width/blocksRow
if(mainCanvas.height/blocksCollum < blocksize){
  blocksize = mainCanvas.height/blocksCollum
}

let structureDict = {}

for(let i = 0; i < blocksRow;i++){
  for(let j = 0; j < blocksCollum;j++){
    structureDict[i+","+j] = ""
  }
}

  // for(let i = 0;)


onmousemove = (e)=>{mouseX = (e.clientX - 5); mouseY = (e.clientY - 2)}


mainCTX.fillStyle = "#FFFFFF"
mainCTX.fillRect(0,0,840,840)

var currentlySelectedBlock = "G:0"

document.addEventListener("mousedown",(e)=>{

  mainCTX.fillStyle = "#00FF00"
  // mainCTX.fillRect(mouseX-5,mouseY-5,10,10)

  let cx = Math.floor(mouseX/blocksize)
  let cy = Math.floor(mouseY/blocksize)

  structureDict[cx+","+cy] = currentlySelectedBlock

  let s = Object.keys(structureDict)

  s.forEach((e)=>{
    let split = e.split(",")
    let tcx = parseInt(split[0])
    let tcy = parseInt(split[1])
    mainCTX.fillStyle = colorFunction(structureDict[e])
    mainCTX.fillRect(tcx*blocksize,tcy*blocksize,blocksize,blocksize)
  })

  // mainCTX.fillRect(cx*blocksize,cy*blocksize,blocksize,blocksize)


})




function colorFunction(e){
  if(e == ""){
    return("#303030")
  } else if(e == "G:1"){
    return("#B96A04")
  } else{
    return("#00FF00")
  }


  // "BLOCKSALL":{
  //   "1":{"0":["#B96A04"],"1":"Oak Wood","2":100},
  //   "2":{"0":["#8C8C8C"],"1":"Stone","2":400},
  //   "3":{"0":["#A95A00"],"1":"Oak Tree Wood","2":400},
  //   "4":{"0":["Gold Ore"],"1":"Gold Ore","2":400},
  //   "5":{"0":["#00FFFF"],"1":"Diamond Block","2":800},
  //   "6":{"0":["Diamond Ore"],"1":"Diamond Ore","2":200},
  //   "7":{"0":["Glass Block"],"1":"Glass Block","2":50},
  //   "8":{"0":["#703000"],"1":"Explosive","2":20,"datt":{"att":"Tk:[XPL:2]","tk":true}},
  //   "9":{"0":["#FF00FF"],"1":"Wooden Chest","2":100,"datt":{"att":"Ch:[=]"}},
  //   "10":{"0":["#703000"],"1":"Fast Explosive","2":20,"datt":{"att":"Tk:[XPL:1]","tk":true}}
  // }
}



