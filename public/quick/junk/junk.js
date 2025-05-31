class LMarkov{
  constructor(){
    this.history = []
    this.histogram = {}
    this.actions = {}
  }

  learn(action,ans){

    if(this.actions[action]===undefined){
      this.actions[action] = {action:action,scores:{}}
    }

    this.history.splice(0,0,{action:action,ans:ans})

    if(ans!==undefined){
      let addscore;
      if(ans){
        addscore = 1;
      } else {
        addscore = -1;
      }

      this.addScore(addscore)

    }

  }


  matcher(){
    let arr = []
    let matchingNum = -1
    for(let i = 1; i < this.history.length; i++){
      arr.push(i)
    }

    let masterArr = []
    masterArr.push(arr)

    let cont = true

    while(cont){

    let lastArr = masterArr[masterArr.length-1]

    let tempArr = []
    matchingNum += 1    
    lastArr.forEach((e)=>{
      if(this.history[e+matchingNum]?.action === this.history[matchingNum].action){
        tempArr.push(e)
      }
    })

    if(tempArr.length==0){cont=false}else{masterArr.push(tempArr)}

    }

  return(masterArr)

  }

  matcherPredict(){
    let matcher = this.matcher()
    let predict = {}
    matcher.forEach((e,i)=>{

      e.forEach((E)=>{
        let item = this.history(E+i)
      })

    })
  }


  addScore(num){

  }

  addIndividualScore(num,ago){
    let action = this.history[ago]

    let scoring = this.actions[action.action].scores
    if(scoring[ago] === undefined){
      scoring[ago] = {score:0,counts:0}
    }

    scoring[ago].counts += 1
    scoring[ago].score += num

  }

}