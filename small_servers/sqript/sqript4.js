function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

let switches = {}
let switchTrain = []
let uuid = 0;
function genUUID(){
  return(uuid++)
}

class switch{
    constructor(){
      this.id = genUUID()
      pushTrain(this.id)
      this.trainId = 0
      this.state = false
      this.inputs = []
      this.neededInputs = 0
      this.oldInputs = {}
      this.newInputs = {} // list of uuids
      this.outputs = [] //maybe it should be a dict?
    }
    
    this.connectInput(inp){
      this.inputs.push(inp)
    }
    getResult(){ //changable
      return(this.newInputs[this.inputs[0]])
    }
    
    getAndStoreResult(){
      this.state = this.getResult()
      return(this.state)
    }
    
    outputResult(){
      
      this.oldInputs = this.newInputs
      this.neededInputs = this.inputs.length
      this.newInputs = {}
      
      this.outputs.forEach((e)=>{
        switches[e].getInput(this.id,this.state)
      })
    }
    
    getInput(id,state){a
      this.newInputs[id] = state
      this.neededInputs -= 1
      if(this.neededInputs === 0){
        updatables.push(this)
      }
    }

    pullRemainingInputs(){
      this.inputs.forEach((e)=>{})
    }
}


function pushTrain(starter){
  let inputTrainMin = 0
  switches[starter].inputs.forEach((e)=>{
    if(e.trainId > inputTrainMax){inputTrainMin = e.trainId + 1}
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
  } else {

    if(mode == "updatables"){
      updates.sort((a,b)=>{
        if(switches[a].trainId < switches[b].trainId){
          return(-1)
        } else {return(1)}})
      mode = "updates"
    }
    
    updates.forEach((e)=>{
      switches[e].pullRemainingInputs()
    })
  }
  
}







