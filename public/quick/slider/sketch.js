
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

let defaultFunc = (x)=>{return(1.5*x)}


let transcript = []

let lastselect = ["main"]

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
    let offsets1 = m[this.from].div.getBoundingClientRect();
    let tp1t = offsets1.top
    let tp1l = (offsets1.left+offsets1.right)/2

    let offsets2 = m[this.to].div.getBoundingClientRect();
    let tp2t = offsets2.top
    let tp2l = (offsets2.left+offsets2.right)/2

    this.div.style.top = Math.floor((tp1t+tp2t)/2)+"px"
    this.div.style.left = Math.floor((tp1l+tp2l)/2)+"px"
    this.draw()
  }

  draw(){
    let offsets1 = m[this.from].div.getBoundingClientRect();
    let tp1t = offsets1.top
    let tp1l = (offsets1.left+offsets1.right)/2

    let offsets2 = m[this.to].div.getBoundingClientRect();
    let tp2t = offsets2.top
    let tp2l = (offsets2.left+offsets2.right)/2

    if(tp2l > tp1l){
    ctx.strokeStyle = "#FF0000"
    } else {
      ctx.strokeStyle = "#00FF00"
    }
    ctx.beginPath()
    ctx.moveTo(tp1l,tp1t)
    ctx.lineTo(tp2l,tp2t)
    ctx.stroke()
  }

  relationFunction(){

  }

  relationFrom(val){
    // let aval = val/2


    // if(aval > m[this.from].slider.max && !m[this.from].lockRange){
    //   m[this.from].slider.max = ""+aval
    //   m[this.from].slider.style.width = Math.floor(aval)+"px"
    // }

    // m[this.from].slider.value = aval



    // m[this.from].processInput("prop")
  }

  relationTo(val){
    let aval = defaultFunc(val)

    m[this.to].updateValue(aval)



    m[this.to].processInput("prop")
  }

  update(id,forwards){
    this.updateRenderPos()
    if(forwards){
      this.relationTo(m[id].slider.value)
    } else {
      this.relationFrom(m[id].slider.value)
    }
  }

  remove(){
    let a = m[this.to]
    let b = m[this.from]
    console.log(a,b)
    for(let i = a.connections.length-1; i > -1 ; i--){
      if(a.connections[i] == this){a.connections.splice(i,1)}
    }
    for(let i = b.connections.length-1; i > -1 ; i--){
      if(b.connections[i] == this){b.connections.splice(i,1)}
    }
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
    this.slider.style.width="100px" 
    this.slider.value="50" 
    this.div.id=id
    this.id=id
    this.div.appendChild(this.x)
    this.div.onclick = ()=>{lastselect.unshift(id)}
    this.div.appendChild(this.name)
    this.div.appendChild(this.slider)
    this.value = 50
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

  updateValue(x){
    if(x > this.slider.max && !this.lockRange && x < Infinity){
      this.slider.max = ""+Math.floor(x)
      this.slider.style.width = Math.floor(x)+"px"
    }
    this.value = x
    this.slider.value = ""+x
  }

  processInput(E){
    this.connections.forEach((e)=>{
      if(e.from == this.id){
        e.update(this.id,true)
      } else {
        e.update(this.id)
      }
    })
  }

  remove(){
    console.log("REMOVE")

    this.connections.forEach((e)=>{e.remove()})

    transcript.push("RM "+this.id)
    delete m[this.id]
    this.div.remove()
  }

}


m = {}

function create(name){
  m[name] = new slider(name)
}

document.body.addEventListener("keydown",(e)=>{
  let key = e.key
  if(document.activeElement !== document.body){
    return
  }
  // if(key == "c"){
  //   let cre = DO[0]?DO[0]:prompt("name?")
  //   if(m[cre] || cre === null|| cre == ""){console.log("already exists");return}
  //   create(cre)
  //   transcript.push("c "+cre)
  // } else if(key == "r"){
  //   let cre = DO[0]?DO[0]:prompt("rule?")
  //   if(m[cre]|| cre === null || cre == ""){console.log("already exists");return}
  //   create(cre)
  //   m[cre].slider.remove()
  //   transcript.push("r "+cre)
  // } else if(key == "s"){
  //   let cre = DO[0]?DO[0]:prompt("switch?")
  //   if(m[cre]|| cre === null || cre == ""){console.log("already exists");return}
  //   create(cre)
  //   m[cre].slider.remove()
  //   m[cre].button = document.createElement("button")
  //   m[cre].button.innerHTML = "True"
  //   m[cre].button.onclick = ()=>{if(m[cre].button.innerHTML=="True"){
  //     m[cre].button.style.backgroundColor = "#A00000"
  //     m[cre].button.innerHTML = "False"
  //   }else{
  //     m[cre].button.innerHTML = "True"
  //     m[cre].button.style.backgroundColor = "#00A000"
  //   }}
  //   m[cre].div.appendChild(m[cre].button)
  //   transcript.push("s "+cre)
  // } else if(key == "t"){
  //   let cre = DO[0]?DO[0]:prompt("teather?")
  //   if(m[cre] ==undefined){return}
  //   let cre2 = DO[1]?DO[1]:prompt("to?")
  //   if(m[cre2] ==undefined){return}
  //   let relation = DO[2]?DO[2]:prompt("relation?")
  //   let con = new connection(cre,cre2,relation)
  //   m[cre].connections.push(con)
  //   m[cre2].connections.push(con)

  //   transcript.push("t "+cre+","+cre2+","+relation)
  // } else if(key == "p"){
  //   console.log(JSON.stringify(transcript))
  // }
  pro(key,[])
})



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

function loadTranscript(str){
  let arr = JSON.parse(str)
  arr.forEach((e)=>{
    pro(e.split("@%")[0],e.split("@%").splice(1))
    if(e[0] == "R"&&e[1] == "M"){
      m[e.substring(3)].remove()
    }
  })
}


function pro(key,DO){
  if(key == "c"){
    let cre = DO[0]?DO[0]:prompt("name?")
    if(m[cre] || cre === null|| cre == ""){console.log("already exists");return}
    create(cre)
    transcript.push("c@%"+cre)
  } else if(key == "r"){
    let cre = DO[0]?DO[0]:prompt("rule?")
    if(m[cre]|| cre === null || cre == ""){console.log("already exists");return}
    create(cre)
    m[cre].slider.remove()
    transcript.push("r@%"+cre)
  } else if(key == "s"){
    let cre = DO[0]?DO[0]:prompt("switch?")
    if(m[cre]|| cre === null || cre == ""){console.log("already exists");return}
    create(cre)
    m[cre].slider.remove()
    m[cre].button = document.createElement("button")
    m[cre].button.innerHTML = "True"
    m[cre].value = true
    m[cre].button.onclick = ()=>{if(m[cre].value==true){
      m[cre].button.style.backgroundColor = "#A00000"
      m[cre].button.innerHTML = "False"
      m[cre].value = false
    }else{
      m[cre].button.innerHTML = "True"
      m[cre].button.style.backgroundColor = "#00A000"
      m[cre].value = true
    }}
    m[cre].div.appendChild(m[cre].button)
    transcript.push("s@%"+cre)
  } else if(key == "t"){
    let cre = DO[0]?DO[0]:prompt("teather?")
    if(m[cre] ==undefined){return}
    let cre2 = DO[1]?DO[1]:prompt("to?")
    if(m[cre2] ==undefined || cre2==cre){return}
    let relation = DO[2]?DO[2]:prompt("relation?")
    let con = new connection(cre,cre2,relation)
    m[cre].connections.push(con)
    m[cre2].connections.push(con)
    transcript.push("t@%"+cre+"@%"+cre2+"@%"+relation)
  } else if(key == "T"){
    let cre = lastselect[1]
    if(m[cre] ==undefined){return}
    let cre2 = lastselect[0]
    if(m[cre2] ==undefined || cre2==cre){return}
    let relation = DO[2]?DO[2]:prompt("relation?")
    let con = new connection(cre,cre2,relation)
    m[cre].connections.push(con)
    m[cre2].connections.push(con)
    transcript.push("t@%"+cre+"@%"+cre2+"@%"+relation)
  } else if(key == "N"){
    let i = 1;
    while(m["Notepad"+i]){
      i++
    }
    let cre = "Notepad"+i
    create(cre)
    m[cre].slider.remove()
    m[cre].notepad = document.createElement("div")
    m[cre].notepad.contentEditable = true
    m[cre].notepad.style.color = "yellow"
    m[cre].notepad.style.minWidth = "10px"
    m[cre].div.appendChild(m[cre].notepad)
    m[cre].notepad.style.backgroundColor = "#202020"
    transcript.push("N")
  } else if(key == "POS"){
    let cre = m[DO[0]].div
    cre.style.left = parseInt(DO[1])+"px"
    cre.style.top = parseInt(DO[2])+"px"
  } else if(key=="F"){
    let p = DO[0]?DO[0]:prompt("func","(x)=>{return()}")
    defaultFunc = eval(p)
    transcript.push("F@%"+p)
  } else if(key == ""){

  } else if(key == "p"){
    Object.values(m).forEach((e)=>{
      transcript.push("POS@%"+e.id+"@%"+e.div.offsetLeft+"@%"+e.div.offsetTop)
    })
    console.log(JSON.stringify(transcript))
  }
}


function multivarEq(str){

}

loadTranscript('["c@%main"]')

setInterval(()=>{
  ctx.fillStyle = "rgba(0,0,0,0.1)"
  ctx.fillRect(0,0,20000,20000)
},1000)






////
let word = ""

// document.addEventListener("keydown",(e)=>{
//   let key = e.key
//   if(key == " "){
//     p(word)
//     word = ""
//   } else if(/[a-zA-Z0-9]/.test(key)){
//     word += key
//   }
// })


function p(str){

  if(str[str.length-1] !== " "){str = str+" "}

  let word = ""
  let phrase = ""
  let result = ""
  while(str.length>0){
    jump = 0
    let char = str[0]
    if(/[a-zA-Z0-9]/.test(char)){
      word += char
      phrase += char
    } else if(char == " "){

      result = pr(result,pword(word))

      phrase = phrase.substring(word.length)
      word = ""
    } else if(char == ","){
      result = pr(result,pphrase(phrase))
      word = ""
      phrase = ""
    }

    str = str.substring(1)
  }

  return(result.replace("^",""))
}

let jump = false
function pr(result,input){
  if(result.indexOf("^") !== -1 ){
    if(jump){
      return(result.replace("^",input))
    } else {
      return(result.replace("^",input+"^"))
    }
  } else {return(result+input)}
}

function pword(word){
  if(word == "if"){
    jump = 1
    return("if(^){^}")
  }if(word == "while"){
    jump = 1
    return("while(^){^}")
  }if(word == "for"){
    jump = 1
    return("for(^){^}")
  } else if(word == "then"){
    jump = 1
    return("")
  } else if(word == "not"){
    return("!")
  }else {return(word)}
}

function pphrase(phrase){
  {return(phrase)}
}

function placeCaretAtCharacter() {
  var input = document.getElementById('myrec'); // Replace 'myInput' with the actual ID of your input field or textarea
  var text = input.innerText;
  var caretPosition = text.indexOf('^');

  if (caretPosition > -1) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(caretPosition-1, caretPosition);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', caretPosition);
      range.moveStart('character', caretPosition);
      range.select();
    }
  }
}















