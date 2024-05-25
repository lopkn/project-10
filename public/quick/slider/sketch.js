
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = Math.floor(Width)+"px"
  myCanvas.style.height = Math.floor(Height)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


// const socket = io.connect('/')


class connection{
  constructor(f,t,r){
    this.relations = ["a causes of","correlated to","the only cause of"]
    this.relation = r
    this.from = f
    this.to = t
    this.div = document.createElement("div")
    this.div.style.position = "absolute"
    this.div.style.color = "cyan"
    this.div.innerHTML = this.relation
    document.body.appendChild(this.div)
    this.updateRenderPos()
  }

  updateRenderPos(){
    let offsets1 = m[this.from].name.getBoundingClientRect();
    let tp1t = offsets1.top
    let tp1l = offsets1.left

    let offsets2 = m[this.to].name.getBoundingClientRect();
    let tp2t = offsets2.top
    let tp2l = offsets2.left

    this.div.style.top = Math.floor((tp1t+tp2t)/2)+"px"
    this.div.style.left = Math.floor((tp1l+tp2l)/2)+"px"
  }

  relationFunction(){

  }

  update(e){

  }

  remove(){
    this.div.remove()
  }
}

class slider{
  constructor(id){


    this.x = document.createElement("span")
    this.x.onclick = ()=>{this.remove()}
    this.x.style.color = "red"
    this.x.innerHTML = "X"
    this.div = document.createElement("div")
    this.name = document.createElement("span")
    this.name.style.color = "white"
    this.name.innerHTML = " "+id+" "
    this.div.style.position = "absolute"
    this.slider = document.createElement("input")
    this.slider.type = "range"
    this.slider.min="0" 
    this.slider.max="100" 
    this.slider.value="50" 
    this.div.id=id
    this.id=id
    this.div.appendChild(this.x)
    this.div.appendChild(this.name)
    this.div.appendChild(this.slider)

    this.connections = []


    this.slider.addEventListener('input',(e)=>{
      this.processInput(e)
    })

    document.body.appendChild(this.div)
    this.move(10+Math.random()*300,10+Math.random()*300)
    dragElement(this.name)
    return(this)
  }

  move(x,y){
    this.div.style.left = Math.floor(x)+"px"
    this.div.style.top = Math.floor(y)+"px"
  }

  processInput(E){
    this.connections.forEach((e)=>{
      if(e.to == this.id){
        e.update(E)
      }
    })
  }

  remove(){
    console.log("REMOVE")
    delete m[this.id]
    this.div.remove()
  }

}


m = {}

function create(name){
  m[name] = new slider(name)
}

document.addEventListener("keydown",(e)=>{
  let key = e.key
  if(key == "c"){
    let cre = prompt("name?")
    create(cre)
  } else if(key == "r"){
    let cre = prompt("rule?")
    create(cre)
    m[cre].slider.remove()
  } else if(key == "t"){
    let cre = prompt("teather?")
    let cre2 = prompt("to?")
    let relation = prompt("relation?")
    let con = new connection(cre,cre2,relation)
    m[cre].connections.push(con)
    m[cre2].connections.push(con)

  }
})

create("main")


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.parentElement.style.top = (elmnt.parentElement.offsetTop - pos2) + "px";
    elmnt.parentElement.style.left = (elmnt.parentElement.offsetLeft - pos1) + "px";
    m[elmnt.parentElement.id].connections.forEach((e)=>{
      e.updateRenderPos()
    })
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}





















