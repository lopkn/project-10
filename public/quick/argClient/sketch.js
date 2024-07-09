
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = Math.floor(Width)+"px"
  myCanvas.style.height = Math.floor(Height)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"










let myrec = document.getElementById("final")

  myrec.width = "50%"
  myrec.height = Math.floor(Height)
  myrec.style.width = "50%"
  myrec.style.height = Math.floor(Height)+"px"
  myrec.style.top = "0px"
  myrec.style.left = "0px"

let myterm = document.getElementById("term")

  myterm.width = "50%"
  myterm.height = Math.floor(Height)
  myterm.style.width = "50%"
  myterm.style.height = Math.floor(Height)+"px"
  myterm.style.top = "0px"
  myterm.style.left = "50%"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
let moveEnd = false
let autoEnter = false
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


document.addEventListener("keydown",(e)=>{

if(e.key == "Enter"){
  let processed = wprocess(myrec.innerText)
  myterm.innerText = processed
}

})

function wprocess(str){
  let fstr=str

  let split = str.split("\n")

  split.forEach((e,i)=>{
    if(e.includes(" is a ")){
      
    } else {

      split[i] = "# "+e
    }

  })

  fstr = split.join("\n")

  console.log(fstr)
  return(fstr)

}




