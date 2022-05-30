

let aefhkjaef = "if(something.is[stupid])"



var masterWordDict = {}



class word{

  constructor(word){

    this.name = word
    this.is = []

    this.processes = []

  }



}
masterWordDict["hello"] = new word("hello")
masterWordDict.hello.is = {"a greeting":1}
masterWordDict["when"] = new word("when")
masterWordDict.when.is = {"an operator":1}
masterWordDict.when.operator = {"when":1}


class sentence{

  constructor(input){

    this.whole = input
    this.wholeLock = input.toLowerCase()
    this.wholeSplit = input.split(" ")

    this.wholeMeanings = {}

    this.unknownMeanings = []
    this.is = {}
    this.findWordMeanings()

    this.returnThoughts()

  }


  findWordMeanings(){
    for(let i = 0; i < this.wholeSplit.length; i++){
      let meaning = this.dictfind(this.wholeSplit[i])
      
      if(meaning == "unknown"){
        this.unknownMeanings.push(this.wholeSplit[i])
      }

      this.wholeMeanings[this.wholeSplit[i]] = meaning
      this.is[meaning.is] = 1

    }

  }

  dictfind(e){

    let outwr = masterWordDict[e]

    if(outwr != undefined){
      return(outwr)
    }

    this.unknownMeanings.push(e)
    return("unknown")

  }

  askMeanings(){
    if(this.unknownMeanings.length > 0){
      selfLog("I dont know what > " + JSON.stringify(this.unknownMeanings) + " < Means.")
    }
  }

  returnThoughts(){
    this.askMeanings()
    selfLog("the sentence is > " + JSON.stringify(this.is) +" < ")


  }


}


function operator(oper,sent){

  if(oper == "when"){

  }



}


function WHEN(wrd,iswhat){

  if(wrd.is.iswhat == 1){
    return(true)
  }
  if(wrd.is.iswhat == 0){
    return(false)
  }
  return("uncertain")

}



function SentenceProcess(e){
  selfLog("processing: [ " + e + " ]")
  let tempsentence = new sentence(e)

}