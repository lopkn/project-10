class nur{
  constructor(){
    this.readPoint = 1
    this.anti = false
  }

  getResult(dict){
    if(this.anti){
      return(!dict[this.readPoint])
    }
    return(dict[this.readPoint])
  }

  testError(set,answers){
    let a = 0
    set.forEach((e,i)=>{
      if(this.getResult(e) !== answers[i]){
        a += 1
      }
    })
    return(a/set.length) // its wrong this many percentage of the time
  }

  optimize(set,answers){
    let err = 2

    let objk = Object.keys(set[0])

    let act = [0,false]
    this.anti = false
    objk.forEach((e)=>{
      this.readPoint = e
      let terr = this.testError(set,answers)
      if(terr < err){
        err = terr
        act = [e,false]
      }
      terr = 1-terr
      if(terr < err){
        err = terr
        act = [e,true]
      }

    })

    this.anti = act[1]
    this.readPoint = act[0]
    let outans = []
    set.forEach((e)=>{
      outans.push(this.getResult(e))
    })
    this.err = err
    this.outans = outans
    return([outans,err])
  }


}

class nurJoiner{
  constructor(join1,join2){
    this.j1 = join1//order matters
    this.j2 = join2
  }

  optimize(set,ans){

  }
  optimizeAll(set,ans){
    let a = this.j1.optimize(set,ans)
    this.j2.optimize(set,a)
  }
}

class netWorker{
  constructor(leng){
    this.nurLeng = leng
    this.nurs = [new nur()]
  }

  getResult(dict){
    
  }

  optimize(set,ans){
    while(this.nurs.length < this.nurLeng){

    }
  }

}

let dataSet = [{"1":0,"2":0},{"1":1,"2":0},{"1":0,"2":1},{"1":1,"2":1}]
let ansSet = [false,true,true,true]

let n6 = new nur()
let n7 = new nur()

let n8 = new nurJoiner(n6,n7)
n8.optimizeAll(dataSet,ansSet)


