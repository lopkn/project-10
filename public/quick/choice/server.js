const prompt = require('prompt-sync')();
const fs = require("fs");

const temp_AAAA = prompt('prompt start: ');
console.log(`starting confirm: ${temp_AAAA}`);

// function updatePlayerFile(){
// fs.writeFile('./playerList.json',JSON.stringify(playerList,null,4), function writeJSON(err){if(err)return console.log(err)})
// }

let storage1 = require("./storage1.json");


//{"n":[data,Yn,Nn,DYN]}


class LM{


  static convert1(str){
    str = str.replaceAll("is","[=]").replaceAll("are","[=]").replaceAll("n't","[!]").replaceAll("not","[!]")
    str = str.replaceAll("so","[->]").replaceAll(".","[END]")
    return(str)
  }

  static questionTree = {}
  static numCounter = 1
  static memorize = false;
  static questionLoop(){
    while(true){

      let str = prompt("/2/prompt loop: ")
      let split = str.split(" ")
      if(str == "help"){
        console.log(
`
[help] - this menu
[exit] - exit
[new] [y pointer] [n pointer] [question] - create a new question
[edit] [index] [valueIndex] [value] - edit index value (edit 5 1 6 == make the 5th questions yes pointer the 6th question)

`
          )
      } else if(str == "exit"){
        return("exit");
      } else if(split[0] == "new"){
        this.questionTree[this.numCounter] = [str.substring(6+split[1].length+split[2].length),split[1],split[2]]
        console.log(str.substring(6+split[1].length+split[2].length) + " << question "+this.numCounter)
        this.numCounter ++;
      } else if(split[0] == "enter"){
        let num = split[1]
        console.log("entering question loop by index: "+split[1])
        while(true){
          let ans = promptYN("/3/prompt loop - "+this.questionTree[num][0]+":")
          if(ans === "EXIT"){
            console.log("exited question loop")
            break;
          }
          if(ans){
            num = this.questionTree[num][1]
          } else {
            num = this.questionTree[num][2]
          }

          if(num == 0 || this.questionTree[num] === undefined){
            console.log("no answer, question loop aborted")
            break;
          }

        }


      } else if(split[0] == "edit"){
        let index = split[1]
        this.questionTree[index][split[2]] = str.substring(7+split[1].length+split[2].length)
        console.log("edited question "+index)
      }



    }
  }

}



function promptYN(str){
  if(str == undefined){
    str = "(y/N)?: "
  }
  let rslt = prompt(str);
  if(rslt == "true" || rslt == "t" || rslt == "y" ||rslt == "Y" || rslt == "yes"){
    return(true)
  }
  if(rslt == "q" || rslt == "exit" || rslt == "quit"){
    return("EXIT")
  }
  return(false)
}



while(true){

let inputstr = prompt('/1/prompt loop: ');
console.log("> "+ inputstr);
let split = inputstr.split(" ")

if(inputstr == "exit" || inputstr == "stop" || inputstr == "q"){
  console.log("process stopping");
  process.exit(17850625);
}


if(split[0] == "TDL" || split[0] == "tdl"){

  if(storage1.tdl == undefined){
    storage1.tdl = [];
  }

  storage1.tdl.forEach((e,i)=>{
    console.log(i+": "+e);
  })

  if(split[1] == "add"){
    storage1.tdl.push(inputstr.substring(8))
  } else if(split[1] == "remove" && split[2] !== undefined){
    storage1.tdl.splice(split[2],1)
  }


}else if(inputstr == "question"){
  LM.questionLoop()
} else if(split[0] == "write" || split[0] == "save"){
    // console.log(JSON.stringify(storage1))
    fs.writeFileSync('./storage1.json',JSON.stringify(storage1,null,4), function writeJSON(err){if(err)return console.log(err)})
    console.log("saved")
} else if(split[0] == "help"){
  console.log(
`
Help menu, commands:
[help] - this menu
[write/save] - saves storage1
[TDL/tdl] <add/remove> <remove:number> - Prints TDL, adds to the list, removes index from list
[exit/stop/q] - stops program
[question] - enters question loop
`)
}

console.log(LM.convert1(inputstr))

}