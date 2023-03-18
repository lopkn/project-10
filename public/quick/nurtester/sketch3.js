// class nur{
//   constructor(){
//     this.readPoint = 1
//     this.anti = false
//   }

//   getResult(dict){
//     if(this.anti){
//       return(!dict[this.readPoint])
//     }
//     return(dict[this.readPoint])
//   }

//   testError(set,answers){
//     let a = 0
//     set.forEach((e,i)=>{
//       if(this.getResult(e) !== answers[i]){
//         a += 1
//       }
//     })
//     return(a/set.length) // its wrong this many percentage of the time
//   }

//   optimize(set,answers){
//     let err = 2

//     let objk = Object.keys(set[0])

//     let act = [0,false]
//     this.anti = false
//     objk.forEach((e)=>{
//       this.readPoint = e
//       let terr = this.testError(set,answers)
//       if(terr < err){
//         err = terr
//         act = [e,false]
//       }
//       terr = 1-terr
//       if(terr < err){
//         err = terr
//         act = [e,true]
//       }

//     })

//     this.anti = act[1]
//     this.readPoint = act[0]
//     let outans = []
//     set.forEach((e)=>{
//       outans.push(this.getResult(e))
//     })
//     this.err = err
//     this.outans = outans
//     return([outans,err])
//   }


// }

// class nurJoiner{
//   constructor(join1,join2){
//     this.j1 = join1//order matters
//     this.j2 = join2
//   }

//   optimize(set,ans){

//   }
//   optimizeAll(set,ans){
//     let a = this.j1.optimize(set,ans)
//     this.j2.optimize(set,a)
//   }
// }

// class netWorker{
//   constructor(leng){
//     this.nurLeng = leng
//     this.nurs = [new nur()]
//   }

//   getResult(dict){

//   }

//   optimize(set,ans){
//     while(this.nurs.length < this.nurLeng){

//     }
//   }

// }

let canvas=document.getElementById("myCanvas")
Width = window.innerWidth
Height = window.innerHeight
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.top = "0px"
canvas.style.position = "absolute"
canvas.style.left = "0px"
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

ctx = canvas.getContext("2d")





let dataSet = [{"1":false,"2":false},{"1":true,"2":false},{"1":false,"2":true},{"1":true,"2":true}]
let ansSet = [false,true,true,true]

// let n6 = new nur()
// let n7 = new nur()

// let n8 = new nurJoiner(n6,n7)
// n8.optimizeAll(dataSet,ansSet)

class dataFlipper{
  constructor(dataPoint){
    this.dataPoint = dataPoint
    this.not = false
    this.blame = [0,0]
  }

  getResult(dict){
    if(this.not){
      return(!dict[this.dataPoint])
    }
    return(dict[this.dataPoint])
  }

  evaluate(set,ansSet){
    let error = 0
    let errSet1 = []
    let errSet2 = []
    set.forEach((e,i)=>{
      let a = this.getResult(e)
      if(a === ansSet[i]){
        errSet2.push(i)
        error ++
      } else {
        errSet1.push(i)
      }
    })

    return({
      "error":error/set.length,
      "errSet1":errSet1,
      "errSet2":errSet2
    })
  }

  blameShift(dict,myAns,shiftID){
    if(this.blame[0] === shiftID){
      this.blame[1] += 1
    } else {
      this.blame = [shiftID,1]
    }
  }

  blameDownComplete(set,id){
    this.blame = {"0":null,"errors":this.blame[1],"originId":id,"errorRate":this.blame[1]/set.length,"setSize":set.length}
  }


  sendFunctionDown(func){
    func(this)
  }

}


class andJunction{
  constructor(join1,join2){
    this.join1 = join1
    this.join2 = join2
    this.not = false
    this.blame = [0,0]
  }

  getResult(dict){
    if(this.not){
      return(!(this.join1.getResult(dict)&&this.join2.getResult(dict)))
    }
    return(this.join1.getResult(dict)&&this.join2.getResult(dict))
  }

  getDetailedResult(dict){
    return([this.join1.getResult(dict),this.join2.getResult(dict)])
  }

  evaluate(set,ansSet){
    let error = 0
    let errSet1 = []
    let errSet2 = []
    set.forEach((e,i)=>{
      let a = this.getResult(e)
      if(a === ansSet[i]){
        errSet2.push(i)
        error ++
      } else {
        errSet1.push(i)
      }
    })

    return({
      "error":error/set.length,
      "errSet1":errSet1,
      "errSet2":errSet2
    })

  }


  blameDownComplete(set,id){
    this.blame = {"0":null,"errors":this.blame[1],"originId":id,"errorRate":this.blame[1]/set.length,"setSize":set.length}
    this.join1.blameDownComplete(set,id)
    this.join2.blameDownComplete(set,id)
  }


  sendFunctionDown(func){
    func(this)
    this.join1.sendFunctionDown(func)
    this.join2.sendFunctionDown(func)
  }


  blameShiftSet(set,ansSet,id){
    set.forEach((e,i)=>{
      this.blameShift(e,ansSet[i],id)
    })
    this.blameDownComplete(set,id)
  }


  blameShift(dict,myAns,shiftID){

    if(this.getResult(dict) === myAns){
      return;
    }

    if(this.blame[0] === shiftID){
      this.blame[1] += 1
    } else {
      this.blame = [shiftID,1]
    }


    let myResult = this.getDetailedResult(dict)
    if(this.not){

      if(myAns === true){ // if the answer shouldve been true, but both of them answered true
        this.join1.blameShift(dict,false,shiftID)
        this.join2.blameShift(dict,false,shiftID)
      } else { // if the answer shouldve been false, someone answered didnt answer true
        if(myResult[0] === false){
          this.join1.blameShift(dict,true,shiftID)
        }
        if(myResult[1] === true){
          this.join2.blameShift(dict,true,shiftID)
        }
      }

    } else {

      if(myAns === true){ // if the answer shouldve been true
        if(myResult[0] === false){
          this.join1.blameShift(dict,true,shiftID)
        }
        if(myResult[1] === false){
          this.join2.blameShift(dict,true,shiftID)
        }
      } else { // if the answer shouldve been false: both answered true, so both were wrong
        this.join1.blameShift(dict,false,shiftID)
        this.join2.blameShift(dict,false,shiftID)
      }
    }

  }


}


class shell{
  constructor(c){
    this.x = 50
    this.y = 50
    this.children = c
    this.r = 20
    this.col  = "#FFFFFF"
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.col
    ctx.fill()
    ctx.stroke();
  }
}

let n1 = new dataFlipper(1)
let n2 = new dataFlipper(2)
let n3 = new andJunction(n1,n2)



let nur = [new shell(n1),new shell(n2),new shell(n3)]
nur[0].x = 100
nur[1].x = 200
nur[2].x = 300

function draw(){
  ctx.fillStyle = "#000000"
  ctx.fillRect(0,0,Width,Height)
  nur.forEach((e)=>{e.draw()})
}

setInterval(()=>{draw()},100)






