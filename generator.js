// console.log(JSON.stringify(`You pitiful stupid autistic retarded fucking smelly crippled circus-running ugly castrated slutty rotten unintellegent low-class obese disturbingly impaired fraudulant homophilic repulsive drooling inbred syphilitic bald malformed turbid degenrate clown ass mumbling delusional delinquent hypocritical malignant nihilistic pathetic depraved protohominid woke liberal Facist`.split(" ")))

let chancers = ["cGl0aWZ1bA==","c3R1cGlk","YXV0aXN0aWM=","cmV0YXJkZWQ=","ZnVja2luZw==","c21lbGx5","Y3JpcHBsZWQ=","Y2lyY3VzLXJ1bm5pbmc=","dWdseQ==","Y2FzdHJhdGVk","c2x1dHR5","cm90dGVu","dW5pbnRlbGxlZ2VudA==","bG93LWNsYXNz","b2Jlc2U=","ZGlzdHVyYmluZ2x5","aW1wYWlyZWQ=","ZnJhdWR1bGFudA==","aG9tb3BoaWxpYw==","cmVwdWxzaXZl","ZHJvb2xpbmc=","aW5icmVk","c3lwaGlsaXRpYw==","YmFsZA==","bWFsZm9ybWVk","dHVyYmlk","ZGVnZW5yYXRl","bXVtYmxpbmc=","ZGVsdXNpb25hbA==","ZGVsaW5xdWVudA==","aHlwb2NyaXRpY2Fs","bWFsaWduYW50","bmloaWxpc3RpYw==","cGF0aGV0aWM=","ZGVwcmF2ZWQ=","cHJvdG9ob21pbmlk","d29rZQ==","bGliZXJhbA==","Q0hBTkNFUg=="]
function sensitive(arr){
    for(let i = 0; i < arr.length; i++){
        arr[i] = atob(arr[i])
    }
    return(arr)
}
sensitive(chancers)
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