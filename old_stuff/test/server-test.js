var calc = require('../cache.js');
var x=1

function test(){
  debugger
  calc.add(1, 1)
  // let p = 
  // processInstantItemUsage(p,item,x,y)
  console.log("ok")
}

test()




function sameFunctionOutputs(func,inputs){

  let b = []

  for(let i = 0; i < inputs.length; i++){
    if(foutputDict[func][0][i]!==inputs[i]){
      return(["false"])
    }
  }

  return(["true",foutputDict[func][1]])

}
