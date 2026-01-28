
let rs = require("readline-sync")



var unsure = "unsure"
function createContext(name){
  
  if(!name){
    console.log("warning: unnamed context created")
    name = "unnamed - "+Date.now()
  }
  let dict = {}
  
  dict.name = name
  dict.attributeArr = []
  dict.attributes = {
      //"":
  }
  
  dict.memory = {}
  dict.outputs = []
  return(dict)
    
}

function addMemory(context,name,pos){
  //check that all pos dimensions exist
  context.attributeArr.forEach((e)=>{
    if(pos[e] === undefined || pos[e] === "unsure"){
      pos[e] = ask(context,e,name)
    }
  })
  
  // do i already know this
  let pre = predict(context,pos)
  if(pre.dist == 0){
    console.log("I already know this as "+pre.name)
    return
  }


  //
  context.outputs.push(name)
  context.memory[name] = pos
  console.log('\x1b[34m%s\x1b[0m',"memory added to "+context.name+": "+name)
}

function addContextAttribute(context,attribute,value="unsure"){
  context.attributes[attribute] = value
  context.attributeArr.push(attribute)
}

function userInput(){
  let ui = rs.question("provide?<<")

  if(ui==""){return(false)}
  return(ui)
}

function ask(c,e,name,d=1){
  if(d){
    console.log("asking for: "+e+" of "+name+" under the context")
  } else {
    console.log("asking for: "+e+" under the context "+name)
  }
  if(name==undefined){console.log("hey???")}
  
  // respond? then return response
  
  if(c.attributes[e] !== "unsure"){
    console.log("warning: defaulting to "+c.attributes[e]+" for "+e)
    let r = userInput()
    return(r===false?c.attributes[e]:r)
  }
  console.log("warning: defaulting to 0 for "+ e)
  let r = userInput()
  return(r===false?0:r)
}

function distance(context,name,pos2){
  let pos1 = context.memory[name]
  let arr = context.attributeArr

  arr.forEach((e)=>{
    if(pos1[e] === "unsure" || pos1[e] === undefined){
      pos1[e] = ask(context,e,name)
    }
  })
  
  let n = 0;
  arr.forEach((e)=>{
    n+=(pos1[e]-pos2[e])**2
  })
  return(n)
  
}

function unknown(context,attr){
  console.log("warning: current value of attribute "+attr+" is unknown")
}

function predict(context,pos={}){
  console.log("trying to predict: "+context.name)
  //check for all context attributes
  context.attributeArr.forEach((e)=>{
    if(pos[e]===undefined){pos[e]=ask(context,e,context.name,0)}
  })
  
  let n = undefined
  let minDist = Infinity


  context.outputs.forEach((e)=>{
    let d = distance(context,e,pos)
    if(d < minDist){
      minDist = d
      n = e
    }
  })
  
  console.log("\x1b[33m%s\x1b[0m","predictors: ",pos)
  console.log('\x1b[35m%s\x1b[0m',"predicted: "+n+" w/ d = "+minDist)
  return({"name":n,"dist":minDist})
  
}
    












//
console.log('\x1b[36m%s\x1b[0m',"START:")

//Order
let c1 = createContext("colorstuff")
addContextAttribute(c1,"redness",50) // defaults to 50 if not sure
addMemory(c1,"red",{"redness":255})
addMemory(c1,"flash",{"redness":Infinity})
addMemory(c1,"dumb",{"redness":0})

console.log(c1.memory,null,4)

predict(c1,{"redness":270})


addContextAttribute(c1,"greeness",50)
predict(c1,{"redness":270,"greeness":70})

addMemory(c1,"crazy",{})
addMemory(c1,"stuffed",{})
predict(c1)







