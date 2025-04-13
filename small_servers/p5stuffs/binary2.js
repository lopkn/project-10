function setup() {
  createCanvas(800, 1800);
}

var dataColumn = []


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
                                     
                                     
                                     
                                     
  
  report(){
  }
}



function getBiggest(){
  let x = 0
  let z = -1
  for(let i = 0; i < dataColumn.length; i++){
    let score = Math.abs(parseFloat(dataColumn[i].pers)-0.5)
    if(score > x){
      x = score
      z = i
    }
  }
  return(z)
}

function getBiggest2(){
  let arr = Object.keys(p.candidates)
  arr.forEach((e,i)=>{
    arr[i] = JSON.parse(JSON.stringify(p.candidates[e]))
    arr[i].tag = e
  })
  // arr.sort((a,b)=>{
  //   let z = Math.abs(parseFloat(b.pers)-0.5)-Math.abs(parseFloat(a.pers)-0.5)
  //   if(z == 0){
  //     return(b.sum-a.sum)
  //   }
  //   return(z)
  // })
    arr.sort((a,b)=>{
    let z = Math.abs(parseFloat(b.pers)-0.5)-Math.abs(parseFloat(a.pers)-0.5)
    return(z)
  })
  arr.forEach((e,i)=>{
    arr[i] = e.tag
  })
  return(arr)
}

var p = new pred()

// function rs(){ //reset
//   dataColumn.forEach((e)=>{
//     e.sum = 0
//     e.eq = 0
//   })
// }

// var predictionSet = new Set()

for(let i = 0; i < 32; i++){
  p.addCandidate(i)
}


    var DATA;
    
    
    var canv = []
    for(let i = 0; i < 100; i++){
      canv[i]= "-"+i
    }
    
    
    var aset = new Set()
    
function draw() {
  background(220);
  let data = getBitsInBinary(mouseX*2*Math.PI)
  DATA = data
  let s = ""
  
    let aans = (data[11] == "1" && data[12] != "1" || data[11] == "0" && data[12] != "0")
  aans = aans || data[13] == "1"
  // p.add(data.split(""),aans)
  
  // let ans = p.pred(data.split(""))
  
  let arr = data.split("")      
  arr.forEach((e,i)=>{
    arr[i] = (e==="1"?"+":"-")+i
  })
  
  let predicted = p.predict(arr,{learn:aans})
  // let ans = p.pred(arr)
  let ans = predicted.bool
  
  // p.learn(arr,aans)
  

  
  

  // p.add(s,aans)
  
  
  
    let cx = Math.floor(mouseX/10)
    let cy = Math.floor((mouseY-800)/10)
  
    let z = cx + cy*10
    if(mouseIsPressed && z >= 0 && z < 100){
      
      if(!aset.has(z)){
        
      aset.add(z)
      
      if(canv[z][0] == "-"){
        canv[z] = "+"+z
      } else {
        canv[z] = "-"+z
      }
      }
    } 

    if(p.debugging){
      console.log(aans)
    }
  
  
  if(ans==aans){
    background(200,225,200)
    

    
  } else {
    background(225,200,200)
  }
    canv.forEach((e,i)=>{
    let x = i%10
    let y = Math.floor(i/10)
    fill((e[0]=="+")*155+155)
    rect(x*10,800+y*10,10,10)
  })
  

  
  fill(0)
  text(data ,0,20)
  text(JSON.stringify(p.candidates,null).replaceAll('}',' '),20,40,800,500)
  text(JSON.stringify(p.dict).replaceAll('}',' '),20,600,600)
  text(JSON.stringify(predicted),0,660)
  text(getBiggest2(),0,700)
  text(Object.keys(p.candidates).length,0,720)
  
}
    
    
    function datasep(){
        let arr = DATA.split("")      
  arr.forEach((e,i)=>{
    arr[i] = (e==="1"?"+":"-")+i
  })
      return(arr)
    }

    

function getBitsInBinary(num) {
//     // For 64-bit (double precision)
//     const buffer64 = new ArrayBuffer(8);
//     const float64 = new Float64Array(buffer64);
//     float64[0] = num;
//     const uint8Array64 = new Uint8Array(buffer64);
    
//     const binary64 = Array.from(uint8Array64)
//         .map(byte => byte.toString(2).padStart(8, '0')) // Convert to binary and pad to 8 bits
//         .join(' '); // Join the bytes with a space
//     console.log('64-bit representation:', binary64);

    // For 32-bit (single precision)
    const buffer32 = new ArrayBuffer(4);
    const float32 = new Float32Array(buffer32);
    float32[0] = num;
    const uint8Array32 = new Uint8Array(buffer32);
    
    const binary32 = Array.from(uint8Array32).map(byte => byte.toString(2).padStart(8, '0')); // Join the bytes with a space
    binary32.reverse()
    // console.log('32-bit representation:', binary32.join(" "));
  return(binary32.join(""))
}






document.addEventListener("mouseup",(e)=>{
    aset = new Set()
})

    


document.addEventListener("keydown",(e)=>{
  if(e.key == "c"){
          canv = []
      for(let i = 0; i < 100; i++){
        canv[i]= "-"+i
      }
  } else if (e.key == 1){
    p.learn(canv,1)
    p.add(canv,1)
  } else if (e.key == 2){
    p.learn(canv,0)
    p.add(canv,0)
  }
})


//p.doAdding()





