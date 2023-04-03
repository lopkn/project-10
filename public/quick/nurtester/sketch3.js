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







// let n6 = new nur()
// let n7 = new nur()

// let n8 = new nurJoiner(n6,n7)
// n8.optimizeAll(dataSet,ansSet)

class dataFlipper{
  constructor(dataPoint){
    this.dataPoint = dataPoint
    this.not = false
    this.blame = [0,0,0]
  }

  export(){
    return((this.not?"!":"+")+"{"+this.dataPoint+"}")
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
    if(this.blame[0] !== shiftID){
      this.blame = [shiftID,0,0]
    }
      if(myAns === "u"){
        this.blame[2] += 1
        return;
      }
      this.blame[1] += 1
  }

  blameDownComplete(set,id){
    if(this.blame[0] === null){
      this.blame = [id,0,0]
    }
    this.blame = {"0":null,"errors":this.blame[1],"originId":id,"errorRate":this.blame[1]/(set.length-this.blame[2]),
    "setSize":(set.length-this.blame[2]),"ignorables":this.blame[2]}
  }


  sendFunctionDown(func){
    func(this)
  }

  flipDown(id){
    if(this.blame.originId === id){
      if(this.blame.errorRate > 0.5){
        this.not = !this.not
        this.blame.errorRate = 1-this.blame.errorRate
        this.blame.errors = this.blame.setSize-this.blame.errors
        return(false)
      }
      return(true)
    }
  }

}


class andJunction{
  constructor(join1,join2){
    this.join1 = join1
    this.join2 = join2
    this.not = false
    this.blame = [0,0,0]
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
    if(this.blame[0] === null){
      this.blame = [id,0,0]
    }
    this.blame = {"0":null,"errors":this.blame[1],"originId":id,"errorRate":this.blame[1]/(set.length-this.blame[2]),
    "setSize":(set.length-this.blame[2]),"ignorables":this.blame[2]}
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
      if(!this.blameShift(e,ansSet[i],id)){console.log("wrong at data: "+i)}
    })
    this.blameDownComplete(set,id)
  }

  flipDown(id){ // flipping should be down up not up down. fix later
    if(this.join1.flipDown(id) && this.join2.flipDown(id) && this.blame.originId === id){
      if(this.blame.errorRate > 0.5){
        this.not = !this.not
        this.blame.errorRate = 1-this.blame.errorRate
        this.blame.errors = this.blame.setSize-this.blame.errors
        return(false)
      }
      return(true)
    }
    return(false)
  }


  blameShift(dict,myAns,shiftID){

    if(this.getResult(dict) === myAns){
      return(true);
    }
    if(this.blame[0] !== shiftID){
      this.blame = [shiftID,0,0]
    }
    if(myAns === "u"){
      this.blame[2] += 1
      this.join1.blameShift(dict,"u",shiftID)
      this.join2.blameShift(dict,"u",shiftID)
      return("u")
    }

      this.blame[1] += 1


    let myResult = this.getDetailedResult(dict)
    if(this.not){

      if(myAns === true){ // if the answer shouldve been true, but both of them answered true


        // this.join1.blameShift(dict,false,shiftID)
        // this.join2.blameShift(dict,false,shiftID)


        this.join1.blameShift(dict,"u",shiftID)
        this.join2.blameShift(dict,false,shiftID)

      } else { // if the answer shouldve been false, someone answered didnt answer true
        if(myResult[0] === false){
          this.join1.blameShift(dict,true,shiftID)
        }
        if(myResult[1] === false){
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


        // this.join1.blameShift(dict,false,shiftID)
        // this.join2.blameShift(dict,false,shiftID)


        this.join1.blameShift(dict,"u",shiftID)
        this.join2.blameShift(dict,false,shiftID)

      }
    }

  }


}


class andJunction2{

  constructor(j1,j2){
    this.join1 = j1;
    this.join2 = j2;
    this.not = false;
  }

  getResult(dict){
    if(this.not){
      return(!(this.join1.getResult(dict)&&this.join2.getResult(dict)))
    }
    return(this.join1.getResult(dict)&&this.join2.getResult(dict))
  }

  getDResult(dict){
    let jd1 = this.join1.getResult(dict)
    let jd2 = this.join2.getResult(dict)
    if(this.not){
      return([this.not,jd1,jd2,!(jd1&&jd2)])
    }
    return([this.not,jd1,jd2,jd1&&jd2])
  }

  GDRE(dict,exp){
    let a = this.getDResult(dict)
    if(this.not){ // TT results in F
      if(exp === a[3]){ // the answer is correct
        if(exp === false){ //the answer is false
          return("ca") //they answered TT, anything else would flip it
        } else {
          if(a[1] === a[2]){
            return("c")
          }
          return(a[2]?"cc1":"cc2")
        }
      } else { // the answer is not correct
        if(exp === false){ //answer shouldve been false
          if(a[1] === a[2]){ // they both answered false
            return("w")
          }
          return(a[2]?"wc1":"wc2") // WRONG DEPENDENT? FIX LATER
        } else { // the answer shouldve been true
          return("wa")
        }
      }
    } else {
      if(exp === a[3]){ // the answer is correct
        if(exp === true){ //the answer should be true
          return("ca") //it gave TT, Changing 1 would flip
        } else { // the answer is false
          if(a[1] === a[2]){
            return("c") // it gave FF, changing 2 would flip
          }
          return(a[2]?"cc1":"cc2") //FTTF dependent
        }
      } else { // the answer is wrong
        if(exp === true){ //the answer should be true
          if(a[1] === a[2]){
            return("w") // it gave FF changing 2 would flip
          }
          return(a[2]?"wc1":"wc2") //FTTF
        } else { //the answer should be false
          return("wa") //it gave TT changing any one would flip
        }
      }
    }
  }

  GDREAF(set,ansSet){
    let out = this.GDREA(set,ansSet,true)

    // let ddct = {"w":0,"c":0,"wc1":0,"wc2":0,"cc1":0,"cc2":0,"wa":0,"ca":0}
    // w, wc1, wc2, wa, c, cc1, cc2, ca
    let supposed1 = []
    let supposed2 = []
    set.forEach((e,i)=>{
      let da = ansSet[i]
      let a = this.GDRE(e,da)

      supposed1[i] = this.join1.getResult(e)
      supposed2[i] = this.join2.getResult(e)

      if(a[0] !== "c"){
        // console.log(a,i)
      }


      if(a == "w" || a === "wc1" || a === "wa"){
        supposed1[i] = !supposed1[i]
      }
      if(a == "w" || a === "wc2"){
        supposed2[i] = !supposed2[i]
      }


    })
    // console.log("===")

    if(this.join1.GDREAF){
      this.join1.GDREAF(set,supposed1)
    }
    if(this.join2.GDREAF){
      this.join2.GDREAF(set,supposed2)
      console.log(supposed1,supposed2)
    }


  }

  GDREA(set,ansSet,flip){
    let ddct = {"w":0,"c":0,"wc1":0,"wc2":0,"cc1":0,"cc2":0,"wa":0,"ca":0}
    set.forEach((e,i)=>{
      let da = ansSet[i]

      let a = this.GDRE(e,da)
      ddct[a]++

    })

    let arb = [
              ddct.c + ddct.cc2 + ddct.cc1 + ddct.ca,
              ddct.c + ddct.wa + ddct.cc2 + ddct.wc1,
              ddct.c + ddct.wa + ddct.wc2 + ddct.cc1,
              ddct.w + ddct.cc2 + ddct.cc1 + ddct.wa
              ]


    arb.forEach((e,i)=>{
      arb[i] /= set.length
    })

    if(flip !== true){
      return([arb,ddct])
    } else {

      let org = 0.5
      let choice = 0

      arb.forEach((e,i)=>{
        let dd = e
        if(dd < 0.5){dd = 1-dd}
        if(dd > org){choice = i;org = dd}
      })
      if(choice == 1){
        this.join1.not = !this.join1.not
      }
      if(choice == 2){
        this.join2.not = !this.join2.not
      }
      if(choice == 3){
        this.join2.not = !this.join2.not
        this.join1.not = !this.join1.not
      }

      return([arb,ddct])
    }
  }


  export(){
    return((this.not?"!":"+") + "["+this.join1.export()+"&"+this.join2.export()+"]")
  }


}


function branch(stick,x,y){
  if(y === 1){
    x.join1 = new andJunction2(x,stick)
    return
  }
  x.join2 = new andJunction2(x,stick)
}

function branchC(num,x,y){
  branch(new dataFlipper(num),x,y)
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
  // nur.forEach((e)=>{e.draw()})
}
  ctx.font = "bold 20px Courier New"

function drawNode(arr){
    ctx.beginPath();
    ctx.fillStyle = "#ffffff"
    ctx.arc(arr[1], arr[2], 20, 0, 2 * Math.PI);
    ctx.fillStyle = this.col
    ctx.fill()
    ctx.stroke();
    ctx.fillStyle = "#000000"
    ctx.fillText(arr[0],arr[1]-10,arr[2]+3,50)
    ctx.fillStyle = "#ffffff"
}

function drawExport(str){
  let parseLvl = 0
  let currentLevel = [100,100]
  let nodeStack = []
  let reading = true
  let readValue = ""

  for(let i = 0; i < str.length; i++){
    let letter = str[i]

    if(letter === "+"){
      nodeStack.push(["+",currentLevel[0],currentLevel[1]])
      currentLevel[1] += 50
    } else if(letter === "!"){
      nodeStack.push(["!",currentLevel[0],currentLevel[1]])
      currentLevel[1] += 50
    } else if(letter === "&"){
      currentLevel[0] += 50
    } else if(letter === "]"){
      currentLevel[1] -= 50
    } else if(letter === "["){
      drawNode(nodeStack[nodeStack.length-1])
      nodeStack.pop()
    } else if(letter === "{"){
      reading = true
      readValue = ""
    } else if(letter === "}"){
      reading = false
      nodeStack[nodeStack.length-1][0] += readValue
      drawNode(nodeStack[nodeStack.length-1])
      currentLevel[1] -= 50
      nodeStack.pop()
    } else if(reading){
      readValue += letter
    }

  }

}

let dataSet = [{"1":false,"2":false},{"1":true,"2":false},{"1":false,"2":true},{"1":true,"2":true}]
let ansSet = [false,true,true,false]
let ansSet2 = [true,true,true,false]


let n4 = new andJunction2(n1,n2)
let n5 = new andJunction2(new andJunction2(new dataFlipper(1),new dataFlipper(2)),new andJunction2(new dataFlipper(1),new dataFlipper(2)))

// setInterval(()=>{draw()},100)






