

const fs = require("fs")
const readability = require('readability-score');
prompt = require('prompt-sync')()



let loaded = ""

let MAINARR = []

function start(z){


// z = prompt("what file idiot\n")
console.log("loading file: ./T2/"+z+".txt")


loaded = z

let txt = fs.readFileSync("./T2/"+z+".txt","utf8")


//import JSON file


// cut up JSON
let split = txt.split("\nAB ")
split.splice(0,1)

MAINARR = []

split.forEach((e,i)=>{
	main = {"abs":e.split("\nC1 ")[0],"ref":e.split("\nNR ")[1].split("\nTC ")[0]}
	let d = e.split("\nDA ")[1].split("\n")[0]

	main.date = d
	main.ago = (new Date()-new Date(d))/1000/60/60/24
	testData = main.abs
	main.tref = parseInt(main.ref)/main.ago
	main.smogIndex = readability.smogIndex(main.abs)
	main.fleschReadingEase = readability.fleschReadingEase(testData)
	main.fleschKincaidGrade = readability.fleschKincaidGrade(testData)
	main.colemanLiauIndex = readability.colemanLiauIndex(testData)
	main.automatedReadabilityIndex = readability.automatedReadabilityIndex(testData)
	main.daleChallReadabilityScore = readability.daleChallReadabilityScore(testData)
	main.difficultWords = readability.difficultWords(testData)
	main.linsearWriteFormula = readability.linsearWriteFormula(testData)
	main.gunningFog = readability.gunningFog(testData)
	main.textStandard = readability.textStandard(testData)
	MAINARR.push(main)
})
console.log("done")

}


function wft(x,t){
	fs.writeFileSync("./data/out.txt",JSON.stringify(x,null,t))

}

function outing(item,file=(loaded)){
	let z = []
	MAINARR.forEach((e)=>{
		z.push(e[item])
	})

	file += item
	file.replaceAll("/","_")
	fs.writeFileSync("./data/"+file+".txt",JSON.stringify(z,null))

	return(z)
}

//use API to get scores

// this is the scientific method
// you see something happen and then come up with a hypothesis

// here is how i utilized it just now

// Event: you asked a bot something its not supposed to answer
// Result: it answered THEN get censored

// Details: it only censored after the words "tianeman square" appeared

// hypothesis: it only censors IF the place name is mentioned
// experiment: try to get it to say something WITHOUT mentioning the place