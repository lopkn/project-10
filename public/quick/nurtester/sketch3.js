let dataSet = [[{"1":0,"2":0},false],[{"1":1,"2":0},true],[{"1":0,"2":1},true],[{"1":1,"2":1},true]]
let opr = [
  [false,false,false,true],
  [false,false,true,false],
  [false,false,true,true],
  [false,true,true,true],
  [false,true,false,true],
  [false,true,true,false],
  [false,true,false,false],
  
  [true,true,true,false],
  [true,true,false,true],
  [true,true,false,false],
  [true,false,false,true],
  [true,false,false,false],
  [true,false,true,false],
  [true,false,true,true]
]
data = [{},true]

function dataUpdate(){
  let a = Date.now().toString(2).slice(-14,-8)
  let i = a.split("")
  let b = 0
  i.forEach((e,i)=>{
    data[0][i+1] = parseFloat(e)
    if(e == 1){b += 1}
  })
  data[1] = b > 3
}


var STACKLIM = 0;
function inc() {
  STACKLIM++;
  inc();
}
    
try {
  inc();
}
catch(e) {
  // The StackOverflow sandbox adds one frame that is not being counted by this code
  // Incrementing once manually
  STACKLIM-= 100;
  console.log('Maximum stack size is', STACKLIM, 'in your current browser');
  STACKLIM = 1/STACKLIM
}

function fourTurner(a,b){
  if(a === true && b === true){
    return(0)
  }
  if(a === false && b === true){
    return(1)
  }
  if(a === true && b === false){
    return(2)
  }
  if(a === false && b === false){
    return(3)
  }
}

class nodeOutter{
  constructor(input){
    this.intake = input
    this.threshold = 0.5
    this.inverse = false
    this.err = STACKLIM
  }
  
  getResult(d){
    if(this.inverse){
      return(d[this.intake] < this.threshold)
    }
      return(d[this.intake] > this.threshold)
    
  }
  
  testError(set){
    let corr = 0
    set.forEach((e)=>{
      let a = this.getResult(e[0])
      if(a === e[1]){
        corr += 1
      }
    })
    return(corr/set.length)
  }
  
  correctDown(set){
    this.correct(set)
  }
  
  correct(set,interval){
    interval = interval?interval:5
    let up = 1/interval
    let i = 0;
    let err = 0
    let act = [0,true]
      this.inverse = false
    while( i <= 1){
      this.threshold = i
      let e = this.testError(set)
      
      if(e > err){
        act = [this.threshold,this.inverse]
        err = e
      }
      
      i += up
    }
      this.inverse = true
    i = 0
    while( i <= 1){
      this.threshold = i
      let e = this.testError(set)
      
      if(e > err){
        act = [this.threshold,this.inverse]
        err = e
      }
      
      i += up
    }
    
    this.threshold = act[0]
    this.inverse = act[1]
    
    console.log(err)
    
  }
}

class nodeJoiner{
  constructor(join,intake){
    this.join = join
    this.intake = intake
    this.threshold = 0.5
    this.oper = 0
    this.err = this.join.err + STACKLIM
  }
  
  getResult(d){
    try{return(opr[this.oper][fourTurner(this.join.getResult(d),(d[this.intake]>this.threshold))])}catch{
      console.log(this.oper,fourTurner(this.join.getResult(d),(d[this.intake]>this.threshold)))
    }
  }
  
  testError(set){
    let corr = 0
    set.forEach((e)=>{
      let a = this.getResult(e[0])
      if(a === e[1]){
        corr += 1
      }
    })
    return(corr/set.length)
  }
  
  correct(set,interval){
    interval = interval?interval:5
    let up = 1/interval
    let err = this.join.testError(set)
    let act = [0,0]
    for(let i = 0; i < 14; i++){
      this.oper = i
      let j = 0
      while(j <= 1){
        
        this.threshold = j
        
        let e = this.testError(set)
        if(e > err){
          act = [this.threshold,this.oper]
          err = e
        }
        
        j += up
      }
      
    }
    this.threshold = act[0]
    this.oper = act[1]
    console.log(err)
  }
}

class nodesJoiner{
  constructor(join,join2){
    this.join = join
    this.join2 = join2
    this.oper = 0
    this.err = this.join.err + this.join2.err
  }
  
  getResult(d){
    try{return(opr[this.oper][fourTurner(this.join.getResult(d),this.join2.getResult(d))])}catch{
      console.log(this.oper,fourTurner(this.join.getResult(d),this.join2.getResult(d)))
    }
  }
  
  testError(set){
    let corr = 0
    set.forEach((e)=>{
      let a = this.getResult(e[0])
      if(a === e[1]){
        corr += 1
      }
    })
    return(corr/set.length)
  }
  
  correctDown(set){
    this.join.correctDown(set)
    this.join2.correctDown(set)
    this.correct(set)
  }
  
  correct(set){
    let err1 = this.join.testError(set)
    let err2 = this.join2.testError(set)
    
    let err = err1>err2?err1:err2
    let oerr = err
    
    let act = 0
    for(let i = 0; i < 14; i++){
      this.oper = i        
        let e = this.testError(set)
        if(e > err){
          act = this.oper
          err = e
        }
        
      
    }
    this.oper = act
    if(err > 0.95){
    console.log("pretty ok")
    }
    return(err-STACKLIM > oerr)
  }
}

let n = new nodeOutter(1)
n.correct(dataSet,100)
let n2 = new nodeOutter(2)
n2.correct(dataSet,100)
// let n3 = new nodeJoiner(n,2)
// n3.correct(dataSet,100)
let n4 = new nodesJoiner(n,n2)
n4.correct(dataSet)

class netWorker{
  //{"1"1,"2":0},{bool:true}
  constructor(highlighted,dat){
    this.dataSet = dat
    this.highlighted = highlighted
    this.tempOuts = []
    highlighted.forEach((e)=>{
      let a = new nodeOutter(e)
      a.correct(dat,10)
      this.tempOuts.push(a)
    })
    this.join(50)
  }
  
  
  join(){
    this.Fin = new nodesJoiner(this.tempOuts[0],this.tempOuts[1])
    for(let i = 2; i < this.tempOuts.length; i++){
      this.Fin = new nodesJoiner(this.Fin,this.tempOuts[i])
    }
    this.Fin.correctDown(this.dataSet)
  }
  
  join2(d){
    
    while(this.tempOuts.length > 1 && d > 0){
      d-=1
      let changed = false
    for(let i = 1; i < this.tempOuts.length; i++){
      this.Fin = new nodesJoiner(this.tempOuts[0],this.tempOuts[i])
      let a = this.Fin.correct(this.dataSet)
      if(a){
        this.tempOuts.push(this.tempOuts[0])
        this.tempOuts.splice(0,1)
        this.tempOuts.push(this.tempOuts[0])
        this.tempOuts.splice(0,1)
        this.tempOuts.splice(0,0,this.Fin)
        changed = true
        break
      }
    }
    // if(changed === false){
    //   this.tempOuts.push(this.tempOuts[0])
    //   this.tempOuts.splice(0,1)
    // }
    
    }
      this.Fin = this.tempOuts[0]
  }
  
}


function setup() {
  createCanvas(400, 400);
}
let n5;
let n6;
let mainData = []
setTimeout(()=>{n5 = new netWorker([1,2,3,4,5,6],mainData)},20000)
setTimeout(()=>{n6 = new netWorker([1,2,3,4,5,6,7],mainData)},30000)
function draw() {
  background(220);
  textSize(25)
  text(Date.now().toString(2).slice(-14,-8),100,100)
  dataUpdate()
  if(n5){
    let rst = n5.Fin.getResult(data[0])
    data[0]["7"] = rst
    text(rst,100,200)
  }
  if(n6){
    text(n6.Fin.getResult(data[0]),100,280)
  }
    text(data[1],100,250)
  mainData.push(JSON.parse(JSON.stringify(data)))
  
}



