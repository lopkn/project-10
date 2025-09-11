
vars = {}

function test1(){
  let s = `node uno
a:: testballs fattest
b:: causes nathan
a -> b
`
}

function processStr(s){
  let spl = s.split("\n")
  spl.forEach((e)=>{
    processLine(e)
  })
}

function processLine(e){
    if(e.match(/^\s*$/)===null){return}
    
    let causality = e.split("->")
    if(causality.length>1){
      
    }
}

