function setup() {
  createCanvas(700, 400);
}

 button = document.createElement("button")
button.innerText = "step"
button.onclick=()=>{step()}
  document.body.appendChild(button)


var log = console.log
p5.disableFriendlyErrors = true;
let pressed = false
let itemarray = []
function draw() {
  background(220);
  let objk = Object.keys(switches)
  let j = 1
  objk.forEach((e,i)=>{
    j = Math.floor(i/10)+1
    fill(switches[e].state?"green":"red")
    text(switches[e].name?switches[e].name:e,(i%10+1)*50,j*50-(i%3)*10)
    circle( (i%10+1)*50+5,j*50+10,10)
  })
  let item = Math.floor((mouseX)/50)+ 10*(Math.floor(mouseY/40)-1)
  rect((item%10)*50+5,Math.floor(mouseY/40)*50+10,20,20)
  item -=1
  if(mouseIsPressed){
    if(pressed == false){
      if(switches[objk[item]]){
        // setState(objk[item],!BITMAP[objk[item]].state)
        itemarray.splice(0,0,item)
        // flip(switches[objk[item]])
      } else {
        new SWITCH()
      }
    }
    pressed = true
  } else {pressed=false}
}


document.addEventListener("keydown",(e)=>{
  // console.log(e.key)
  let k = e.key
if(k == "i"){
    // flip(itemarray[0])
    switches[itemarray[0]].connectInput(itemarray[1])
  } else if(k == "a"){
    switches[itemarray[0]].connectInput(itemarray[1])
    switches[itemarray[0]].connectInput(itemarray[2])
    algorithm(itemarray[0],"and")
  } else if(k == "o"){
    switches[itemarray[0]].connectInput(itemarray[1])
    switches[itemarray[0]].connectInput(itemarray[2])
    algorithm(itemarray[0],"or")
  } else if(k == "l"){
    switches[itemarray[0]].connectInput(itemarray[1])
    algorithm(itemarray[0],"link")
  } else if(k == "n"){
    switches[itemarray[0]].connectInput(itemarray[1])
    algorithm(itemarray[0],"not")
  } else if(k == "N"){
    switches[itemarray[0]].name = prompt("name?")
  } else if(k == "f"){
    flip(switches[itemarray[0]])
  }
})

let switches = {}
let switchTrain = []
let uuid = 0;
function genUUID(){
  return(uuid++)
}

class SWITCH{
    constructor(name){
      this.id = genUUID()
      switches[this.id] = this
      this.trainId = 0
      this.state = false
      this.name = name
      this.inputs = []
      this.neededInputs = 0
      this.oldInputs = {}
      this.newInputs = {} // list of uuids
      this.outputs = [] //maybe it should be a dict?
      pushTrain(this.id)
      return(this)
    }
    
    connectInput(inp){
      switches[inp].outputs.push(this.id)
      this.inputs.push(inp)
      pushTrain(this.id)
      this.neededInputs += 1
    }
    getResult(){ //changable
      return(this.inputs[0]==undefined?this.state:this.newInputs[this.inputs[0]])
    }
    
    getAndStoreResult(){
      // this.state = this.getResult()
      this.state = this.getResult(this)
      return(this.state)
    }
    
    outputResult(overwriter){
      
      if(overwriter){
        this.newInputs = overwriter
      }

      this.oldInputs = this.newInputs
      this.neededInputs = this.inputs.length
      this.newInputs = {}
      
      this.outputs.forEach((e)=>{
        switches[e].getInput(this.id,this.state)
      })
    }
    
    getInput(id,state){
      this.newInputs[id] = state
      this.neededInputs -= 1
      if(this.neededInputs === 0){
        updatables.push(this.id)
      } else {
        updates.push(this.id)
      }
    }

    pullRemainingInputs(){
      this.inputs.forEach((e)=>{
        if(this.newInputs[e] === undefined){
          this.getInput(e,switches[e].state)
        }
      })
    }
}

var RES = {
  "link":(e)=>{return(e.newInputs[e.inputs[0]])},
  "static":(e)=>{return(e.state)},
  "not":(e)=>{return(!e.newInputs[e.inputs[0]])},
  "or":(e)=>{return(e.newInputs[e.inputs[0]]||e.newInputs[e.inputs[1]])},
  "and":(e)=>{return(e.newInputs[e.inputs[0]]&&e.newInputs[e.inputs[1]])},
}

function algorithm(id,type){
  switches[id].getResult = RES[type]
  switches[id].algorithm = type
}


function pushTrain(starter){
  let inputTrainMin = 0
  switches[starter].inputs.forEach((e)=>{
    if(e.trainId > inputTrainMin){inputTrainMin = e.trainId + 1}
  })


  switchTrain.splice(inputTrainMin,0,starter)
  switches[starter].trainId = inputTrainMin
  for(let i = inputTrainMin+1; i < switchTrain.length ; i++){
    switches[switchTrain[i]].trainId += 1
  }

}

let updates = []
let updatables = []
let mode = "updatables"

function tick(){

  let newUpdatables;
  if(updatables.length > 0){
    mode = "updatables"
    newUpdatables = updatables
    updatables = []
    newUpdatables.forEach((e)=>{
      switches[e].getAndStoreResult()
      switches[e].outputResult()
    })
    log("updatables tick")
  } else {
    
    if(updates.length == 0 && updatables.length == 0){
      console.log("tick complete: nothing to do")
      return("done");
    }
    
    if(mode == "updatables"){
      updates.sort((a,b)=>{
        if(switches[a].trainId < switches[b].trainId){
          return(-1)
        } else {return(1)}})
      mode = "updates"
    }
    switches[updates[0]].pullRemainingInputs()
    log("forcefully updating switch "+updates[0])
    updates.splice(0,1)
  }
  
}

function step(){
  let result = tick()
  let ticks = 1
  while(result !== "done" && ticks < 5000){
    result = tick()
    ticks ++
  }
  console.log("step finished in " + ticks + " ticks")
}


function flip(node){
  node.state = !node.state
  node.outputResult()
  step() //Process should not take 2 flips at a time
}


// let a = new SWITCH("a")
// let b = new SWITCH("b")
// let c = new SWITCH("c")
// let d = new SWITCH("d")
// let e = new SWITCH("e")
// let f = new SWITCH("f")
// for(let i = 0; i < 20; i++){
//   new SWITCH("test")
// }
// c.connectInput(b.id)
// c.connectInput(a.id)
// e.connectInput(d.id)
// e.connectInput(c.id)
// f.connectInput(e.id)
// f.connectInput(d.id)

// algorithm(c.id,"or")
// algorithm(e.id,"and")
// algorithm(f.id,"and")

// b.state = true
// updatables.push(b.id)
// step()



// switch wrapper // wrap around the children 

class wrap{
  constructor(out,body,name){
    
      this.id = genUUID()
      switches[this.id] = this
      this.trainId = 0
      this.state = false
      this.name = name
      this.inputs = []
      this.neededInputs = 0
      this.oldInputs = {}
      this.newInputs = {} 
      this.outputs = []
      pushTrain(this.id)
    // let bluePrint = ""
    // wrapper speecific
    this.wrappedSwitches = []
    for(let i = 0; i < body.length; i++){
      let item = body[i]
      }
    
  }
  
}


function wrapInit(body,out){
  
  let bodyDict = {}
  body.forEach((e)=>{bodyDict[e] = true})
  
  let inputs = []
  body.forEach((e)=>{
    e.inputs.forEach((E)=>{
      if(!bodyDict[E]){
        inputs.push(E)
      }
    })
  }) // finding all children nodes that are not wrapped
  
}

function generateInputArray(i,A=[],str=""){ //use as g(num)
  i--
  if(i > 0){
    generateInputArray(i,A,str+"1")
    generateInputArray(i,A,str+"0")
    return(A)
  }
  A.push(str)
  return(A)
} // this returns a list of all possible combinations for i switches




// amounts of node to build
// links all nodes
// relative push train




//cant hear u type whatd u get
//3.smthe23


