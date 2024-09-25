let div = document.createElement("div")
div.innerText=`> a
> b
> c
| a | b | test
| a | b | stest2
@ a @@ nota
@ a @ linka
| nota | linka | notlink
`
div.style.backgroundColor = "black"
div.style.color = "lime"
div.contentEditable=true


let button = document.createElement("button")
button.innerText = "load"
button.onclick=()=>{load();console.log('loaded')}
document.body.appendChild(div)
  document.body.appendChild(button)
 button = document.createElement("button")
button.innerText = "tick"
button.onclick=()=>{tick()}
  document.body.appendChild(button)

 button = document.createElement("button")
button.innerText = "step"
button.onclick=()=>{step()}
  document.body.appendChild(button)

var canvas;
function setup() {
  createCanvas(800, 200);
  // noCanvas()
  // canvas = document.getElementById("defaultCanvas0")
  
}

let pressed = false

function draw() {
  background(220);
  let objk = Object.keys(BITMAP)
  objk.forEach((e,i)=>{
    i+=1
    fill(BITMAP[e].state?"green":"red")
    text(e,i*50,30)
    text( (BITMAP[e].activation+"").substring(6,Infinity),i*50,20)
    
    
    circle(i*50+5,40,10)
  })
  let item = Math.floor((mouseX+20)/50)
  rect(item*50,50,20,20)
  item -=1
  if(mouseIsPressed){
    if(pressed == false){
      if(mouseY < 200 && BITMAP[objk[item]]){
        // setState(objk[item],!BITMAP[objk[item]].state)
        manualStateChange(objk[item])
      }
    }
    pressed = true
  } else {pressed=false}
}

let BITMAP = {}

function setState(k,value){
  // if(BITMAP[k].prop){BITMAP[k].prop.forEach((e)=>{e.activate()})}
  if(BITMAP[k].state!==undefined){if(BITMAP[k].state==value){return};
    // if(BITMAP[k].owner){BITMAP[k].owner.backProp(true);return}                                                         
    BITMAP[k].state = value}else{
    BITMAP[k] = {"state":value}
  }
  
}

let uuid = 1
function registerBit(name,hard){
  if(name){
    if(hard){if(BITMAP[name]){return(false)}}
    let aname = name
    let i = 1
    while(BITMAP[aname]){
      aname = name+i
      i++
    }
    
    BITMAP[aname]={"state":false}
    return(aname)
  }
  while(BITMAP[uuid]){uuid++}
  BITMAP[uuid]={"state":false}
  return(uuid)
}

class logicNode{
  constructor(KEY){
    this.input = []
    this.outputKey = KEY?registerBit(KEY):registerBit(); //map key
    this.activity = Date.now()
    this.lastInput = []
    this.lastlastInput = []
    this.lastDifferentInput = []
    this.relay = {}
    
    //experimental:
    this.children = {}
    this.parents = {}
    
    BITMAP[this.outputKey].owner = this
  }
  
  setInput(arr){
    this.input=arr
    arr.forEach((e)=>{
      if(BITMAP[e] == undefined){registerBit(e)}
      if(BITMAP[e].prop===undefined){BITMAP[e].prop=[]}
      BITMAP[e].prop.push(this)
    })
  }
  
  connectToChild(e){
    this.children[e] = true
    if(BITMAP[e].owner){
      Object.assign(this.children,BITMAP[e].owner.children)
    }
  }
  
  getInputs(){
    let outarr = []
    let different=false
    this.input.forEach((e,i)=>{
      outarr[i] = BITMAP[e].state
      if(outarr[i] !== this.lastInput[i]){different=true}
    })
    if(different){
      this.lastlastInput = this.lastInput
      this.lastInput = outarr
    }

    return(outarr)
  }
  
  
  activate(activation=Date.now()){
    let activatedAlready = false
    if(this.activity == activation){console.log(this.outputKey+" was already activated");activatedAlready=true}
    this.activity = activation
    let arr = this.getInputs()
    let result = this.func(arr)
    if(result !== BITMAP[this.outputKey].state){
      if(activatedAlready){
        console.log("logic error in back/prop at "+this.outputKey)
        return;
      }
      this.lastDifferentInput = this.lastlastInput
      newStateChanges.push(this.outputKey)
    }
    BITMAP[this.outputKey].activation = activation
    console.log(this.outputKey + " is set to "+ result)
    return(result)
  }
  func(arr){
    
  }
  
  backProp(revert,activation=Date.now()){
    
    if(this.back){
      let arr = this.back(revert)
      console.log(arr)
      arr.forEach((e)=>{
        BITMAP[e].activation = activation
          newStateChanges.push(e)
          propPending.push(e)
      })
    }
    let thisInput = this.lastDifferentInput
    this.lastlastInput = this.lastInput
    this.lastDifferentInput = this.lastInput
    console.log(JSON.stringify(this.lastInput),JSON.stringify(thisInput))
    this.lastInput = thisInput
  }
}

//logic nodes should have multiple inputs


//there is a master BIT map
//base OR node will activate, retrieve inputs, create an output



//the premise is: Computers work, but somewhere they work redundantly.


//backprop of "or"
//Turned from False to True:
//11 -> revert both
//10 -> (inverse/not inverse)
//01 -> (inverse/not inverse)
//Turned from true to false: (inverse/not inverse)


  
function trimSpace(str){
  while(str[0] == " "){
    str = str.substring(1)
  }
  while(str[str.length-1]==" "){
    str = str.substring(0, str.length - 1);
  }
  return(str)
}

  
function newANDnode(ins,KEY){
  let ANDnode = new logicNode(KEY)
ANDnode.func = (arr)=>{if(arr[0] && arr[1]){return(true)}return(false)}
ANDnode.back = (revert)=>{
  let back = []
  if(revert){
    // if(BITMAP[ORnode.outputKey].state){
      if(ANDnode.lastInput[0] != ANDnode.lastDifferentInput[0]){
        back.push(ANDnode.input[0])
      }
      if(ANDnode.lastInput[1] != ANDnode.lastDifferentInput[1]){
        back.push(ANDnode.input[1])
      }

  }
  return(back)
  }
  if(ins){
    ANDnode.setInput(ins)
  }
  ANDnode.lastInput = [false,false]
  ANDnode.lastlastInput = [false,false]
  ANDnode.lastDifferentInput = [true,true]
return(ANDnode)
}

function newLINKnode(ins,KEY){
  let LINKnode = new logicNode(KEY)
LINKnode.func = (arr)=>{if(arr[0]){return(true)}return(false)}
LINKnode.back = (revert)=>{
  let back = []
  if(revert){
    // if(BITMAP[ORnode.outputKey].state){
      if(LINKnode.lastInput[0] != LINKnode.lastDifferentInput[0]){
        back.push(LINKnode.input[0])
      }

  }
  return(back)
  }
  if(ins){
    LINKnode.setInput(ins)
  }
  LINKnode.lastInput = [false]
  LINKnode.lastlastInput = [false]
  LINKnode.lastDifferentInput = [true]
return(LINKnode)
}
  
  
  function newNOTnode(ins,KEY){
  let NOTnode = new logicNode(KEY)
NOTnode.func = (arr)=>{if(arr[0]){return(false)}return(true)}
NOTnode.back = (revert)=>{
  let back = []
  if(revert){
    // if(BITMAP[ORnode.outputKey].state){
      if(NOTnode.lastInput[0] != NOTnode.lastDifferentInput[0]){
        back.push(NOTnode.input[0])
      }

  }
  return(back)
  }
  if(ins){
    NOTnode.setInput(ins)
  }
  NOTnode.lastInput = [false]
  NOTnode.lastlastInput = [false]
  NOTnode.lastDifferentInput = [true]
return(NOTnode)
}

function newORnode(ins,KEY){
  let ORnode = new logicNode(KEY)
ORnode.func = (arr)=>{if(arr[0] || arr[1]){return(true)}return(false)}
ORnode.back = (revert)=>{
  let back = []
  if(revert){
    // if(BITMAP[ORnode.outputKey].state){
      if(ORnode.lastInput[0] != ORnode.lastDifferentInput[0]){
        back.push(ORnode.input[0])
      }
      if(ORnode.lastInput[1] != ORnode.lastDifferentInput[1]){
        back.push(ORnode.input[1])
      }

  }
  return(back)
  }
  if(ins){
    ORnode.setInput(ins)
  }
  ORnode.lastInput = [false,false]
  ORnode.lastlastInput = [false,false]
  ORnode.lastDifferentInput = [true,true]
return(ORnode)
}

function manualStateChange(k){
  // BITMAP[k].state = !BITMAP[k].state
  newStateChanges.push(k)
  propPending.push(k)
  BITMAP[k].activation = Date.now()
}                                  
var stateChanges = []                                
var newStateChanges = [] 
var propPending = [] 
var mode = "back"
function tick(){
  // console.log("ticking: "+JSON.stringify(newStateChanges))
  stateChanges=newStateChanges
  newStateChanges=[]
  stateChanges.forEach((e)=>{
    BITMAP[e].state = !BITMAP[e].state
  })
  
  //mode == back prop
  if(mode == "back"){
  stateChanges.forEach((e)=>{
    if(BITMAP[e].owner){
      BITMAP[e].owner.backProp(true,BITMAP[e].activation)
    }
  })}
  //mode == propegation
  if(mode == "prop"){
    stateChanges.forEach((e)=>{
    if(BITMAP[e].prop){
      BITMAP[e].prop.forEach((E)=>{E.activate(BITMAP[e].activation)})
    }
  })
  }
  
  if(newStateChanges.length == 0){
    if(mode == "back"){
      mode = "prop" 
      console.log("propegating: "+JSON.stringify(propPending))
      newStateChanges = propPending
      newStateChanges.forEach((e)=>{
        BITMAP[e].state = !BITMAP[e].state
      })
    } else {
      mode = "back"
      propPending = []
      console.log("step complete")
      return(true)
    }
  }
  
}                
function step(){
  let res = false
  while(!res){
        res = tick()
        }
}
                       
  
  function load(){
  BITMAP = []
  let str = div.innerText
  let lines = str.split("\n")
  lines.forEach((e)=>{
    if(e[0] == ">"){
      let item = e.substring(1)
      while(item[0]==" "){item=item.substring(1)}
      console.log("bit > "+item)
      let register = registerBit(item.split(" ")[0],true)
      if(register ===false){console.log("failed to register already existing: "+item)}
    } else if(e[0] == "!"){
      // let item = e.substring(1)
      // while(item[0]==" "){item=item.substring(1)}
      // console.log("relay > "+item)
    } else if(e[0] == "|"){
      let items = e.substring(1).split("|")
      if(items.length==3){
        let name = trimSpace(items[2])
        if(BITMAP[name]){
          console.log("already registerd failure")
        } else {
          let n = newORnode([trimSpace(items[0]),trimSpace(items[1])],name)
        }
      
      } else if(items.length == 1){
      let n = newORnode(undefined,trimSpace(items[0]))
      }
    } else if(e[0] == "&"){
      let items = e.substring(1).split("&")
      if(items.length==3){
        let name = trimSpace(items[2])
        if(BITMAP[name]){
          console.log("already registerd failure")
        } else {
          let n = newANDnode([trimSpace(items[0]),trimSpace(items[1])],name)
        }
      
      } else if(items.length == 1){
      let n = newANDnode(undefined,trimSpace(items[0]))
      }
    } else if(e[0] == "/"){ //set input of undefined node
      let items = e.substring(1).split("/")
      if(items.length==3){
        let name = trimSpace(items[2])
        if(BITMAP[name]){
          if(BITMAP[name].owner){
            BITMAP[name].owner.setInput([trimSpace(items[0]),trimSpace(items[1])])
          } else {
            console.log("no owner")
          }
        } else {
          console.log("not registered")
        }
      
      } else if(items.length == 1){
      let n = newANDnode(undefined,trimSpace(items[0]))
      }
    } else if(e[0] == "@"){
      let items = e.substring(1).split("@")
      if(items.length == 2){ //link
          let n = newLINKnode([trimSpace(items[0])],trimSpace(items[1]))
        
      } else if(items.length == 3){ // not
          let n = newNOTnode([trimSpace(items[0])],trimSpace(items[2]))
        
      }
    }
  })
}
  
  
var ORnode = newORnode(["a","b"])

// registerBit("test")
// registerBit("test2")
// ORnode.setInput(["test","test2"])
  
newANDnode([1,"c"])
// setState("test",true)
// ORnode.activate()
// setState("test",false)
// ORnode.activate()
// setState("test",true)
// setState("test2",true)
// ORnode.activate()
// ORnode.activate()
