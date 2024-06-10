// console.log(JSON.stringify(`You pitiful stupid autistic retarded fucking smelly crippled circus-running ugly castrated slutty rotten unintellegent low-class obese disturbingly impaired fraudulant homophilic repulsive drooling inbred syphilitic bald malformed turbid degenrate clown ass mumbling delusional delinquent hypocritical malignant nihilistic pathetic depraved protohominid woke liberal Facist`.split(" ")))

let chancers = ["pitiful","stupid","autistic","retarded","fucking","smelly","crippled","circus-running","ugly","castrated","slutty","rotten","unintellegent","low-class","obese","disturbingly","impaired","fraudulant","homophilic","repulsive","drooling","inbred","syphilitic","bald","malformed","turbid","degenrate","mumbling","delusional","delinquent","hypocritical","malignant","nihilistic","pathetic","depraved","protohominid","woke","liberal","CHANCER"]

let requisites = ["facist","mule","clown","donkey"]

function log(arr=chancers){
  let total = 0
  arr.forEach((e,i)=>{
    total += 1 + i
  })
  let rand = Math.floor(Math.random()*total)
  let out = -1
  // console.log(total,rand)
  for(let i = 0; i < arr.length; i++){
    total -= (1 + i)
    if(total < rand){
      out = i
      break
    }
  }
    // console.log(out,total)
    let aout = arr[out]
    if(typeof(aout) !== "string"){
      console.log(out)
    }
    let x = arr.splice(out,1)[0]
    arr.unshift(x)
    if(aout == "CHANCER"){
      return((log(requisites)+" ass"))
    }
    else {return(aout)}
    
}
  console.log("you")
 let main= setInterval(()=>{console.log(log())},200)