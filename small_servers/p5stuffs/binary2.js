
class pred{
  constructor(){
    this.dict = {"":{eq:0,pers:0.5,sum:0}}
    this.datas = []
    this.noProp = new Set()
    
    this.candidates = {}
    
    this.aProp = new Set()
    
  }
  addData(x){
    this.datas.push(x)
    this.aProp.add(x)
    this.aProp.add("+"+x)
    this.aProp.add("-"+x)
    Object.keys(this.candidates).forEach((e)=>{
      let c = this.candidates[e]
      if(c.tag.substring(1) == x){
        this.dict[e] = c
      }
    })
  }
  
  addCandidate(x){ // add a candidate
    this.candidates["-"+x] = {
        "sum":0,
        "eq":0,
        "pers":0.5,
        "tag":"-"+x
      }
    this.candidates["+"+x] = {
        "sum":0,
        "eq":0,
        "pers":0.5,
        "tag":"+"+x
      }
  }
  
  
  
  
  doAdding(dnum){
    let b = getBiggest2()
    if(dnum==undefined){ dnum = this.candidates[b[0]].tag.substring(1) }
    this.addData(dnum)
    console.log("DOADD: "+dnum)
    
    let newCandidates = {}
    Object.keys(this.candidates).forEach((e)=>{
      let etag = this.candidates[e].tag
      if(!this.noProp.has("-"+dnum) && !this.aProp.has(e)){
        newCandidates[e+"-"+dnum] = {
          "sum":0,
          "eq":0,
          "last":0,
          "pers":0.5,
          "tag":etag
        }
      }
      
      if(!this.noProp.has("+"+dnum)&& !this.aProp.has(e)){
        newCandidates[e+"+"+dnum] = {
          "sum":0,
          "eq":0,
          "last":0,
          "pers":0.5,
          "tag":etag
        }
      }
    })
    
    this.candidates = newCandidates
    
  }
  
  
  
  noPropAll(num=0.005){
    Object.keys(this.candidates).forEach((e)=>{
      let x = Math.abs(parseFloat(this.candidates[e].pers)-0.5)
      if(x>0.5-num){
        this.noProp.add(e)
        console.log("NOPROP: "+e)
      }
    })
  }
  
  learn(arr,ans=0){
    
    let appendStr = ""
      this.datas.forEach((e)=>{
        appendStr += arr[e] 
      })
      
      // if(this.debug){console.log(arr[13])}
      if(this.noProp.has(appendStr)){return}
    
    arr.forEach((e)=>{
      
      
      
      e = e+appendStr
      if(this.candidates[e] == undefined){
        return
      }
      
      this.candidates[e].sum += 1
      this.candidates[e].eq += ((e[0]=="+")==ans)
      this.candidates[e].pers = ((this.candidates[e].eq+1)/(this.candidates[e].sum+2)).toPrecision(3)
    })
   return(appendStr)                                 
  }
  
  add(arr,ans=0){
    let vars = ""
    for(let i = 0; i < this.datas.length; i++){
      let e = this.datas[i]
      vars += arr[e]
      if(this.noProp.has(vars)){
        break;
      }
      
    }

    if(this.dict[vars]===undefined){
      this.dict[vars] = {sum:0,eq:0}
    }
    this.dict[vars].sum += 1
    this.dict[vars].sum += ans
    this.dict[vars].pers = (this.dict[vars].eq/this.dict[vars].sum).toPrecision(3)
    
  }
  
  pred(arr){
    let vars = ""
    for(let i = 0; i < this.datas.length; i++){
      let e = this.datas[i]
      vars += arr[e]
      
      if(this.noProp.has(vars)){
        break;
      }
    }
    try{
    return(parseFloat(this.dict[vars].pers)>0.5)}
    catch{
    }
  }
                                     
  learnItem(item,ans){
    if(item==undefined){return}
    item.sum += 1
    item.eq += ans
    item.pers = ((item.eq+1)/(item.sum+2)).toPrecision(3)
  }                      
                                     
                                     
                                     
                                     
  predict(arr,op={}){ // op: options
    // the arr is in the form [+a,-b,+c,+d,...]
    // datas: the stuff already KNOWN to be related
    // candidates: finding relations
    
    let answer = {}
    
    let vars = ""
    let vars2 = ""
    let noPropEnded = false
    for(let i = 0; i < this.datas.length; i++){
      
      let e = this.datas[i]
      vars += arr[e] 
      vars2 = arr[e] + vars2
      
      if(this.noProp.has(vars)){
        noPropEnded = true
        break;
      }
      
    }
    
    // vars is the endpoint predictor node
    // noPropEnded: if propegation terminated on a noprop
    
    if(noPropEnded){ 
      let aitem = this.dict[vars] //aitem is the only outing item
      answer.name = vars
      answer.bool = aitem.pers > 0.5 // if 1.00, it should answer true
      answer.item = aitem
      if(op.learn!==undefined){//acts as the original p.add
        this.learnItem(aitem,op.learn) //ERROR PRONE. FIX LATER
      }
    } else {
      let maxscore = 0
      let aitem;
      let itemarr = []
      arr.forEach((e)=>{
        if(this.aProp.has(e)){return}
        let item = this.candidates[e+vars]
        
        itemarr.push({item,name:e+vars})
      })
      
      if(undefined == this.dict[vars2]){
            console.log("error:" + vars2,this.dict)
          }
      itemarr.splice(0,0,{item:this.dict[vars2],name:vars}) //spliced to give the upper hand 
      
      itemarr.forEach((e)=>{
        let item = e.item
        let name = e.name
        
        if(item == undefined){
          maxscore = Infinity
          aitem = {"pers":2}
          answer.name = name
          return
        }
        
        if(op.learn!==undefined){ //this can be optimized to be in another loop

            this.learnItem(item,op.learn) //acts as the original p.learn
          }
      
        
          let score = Math.abs(item.pers-0.5)
          if(score > maxscore){
            maxscore = score
            aitem = item
            answer.name = name
        }
      })
      
      
      answer.bool = aitem.pers > 0.5 // if 1.00, it should answer true
      answer.item = aitem

    }

    return(answer)
  }          
                    