

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

let progress = 0

let MAIND = "2025-02-26"


split.forEach((e,i)=>{

	let tempProgress = Math.floor(i/split.length*100)
	if(tempProgress>progress){
		console.log("progress: "+tempProgress+"%")
		progress = tempProgress
	}


	main = {"abs":e.split("\nC1 ")[0],"ref":e.split("\nNR ")[1].split("\nTC ")[0]}
	let d = e.split("\nPY ")[1].split("\n")[0]

	main.date = d
	main.ago = (new Date(MAIND)-new Date(d))/1000/60/60/24
	testData = main.abs
	// main.tref = parseInt(main.ref)/main.ago
	// main.smogIndex = readability.smogIndex(main.abs)
	// main.fleschReadingEase = readability.fleschReadingEase(testData)
	// main.fleschKincaidGrade = readability.fleschKincaidGrade(testData)
	// main.colemanLiauIndex = readability.colemanLiauIndex(testData)
	// main.automatedReadabilityIndex = readability.automatedReadabilityIndex(testData)
	// main.daleChallReadabilityScore = readability.daleChallReadabilityScore(testData)
	// main.difficultWords = readability.difficultWords(testData)
	// main.linsearWriteFormula = readability.linsearWriteFormula(testData)
	// main.gunningFog = readability.gunningFog(testData)
	// main.textStandard = readability.textStandard(testData)
	MAINARR.push(main)
})
console.log("done")
}


function saveAll(){
	fs.appendFileSync("./data/ALL_"+(new Date().toLocaleString())+".txt",JSON.stringify(MAINARR,null,t))
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
	file = file.replaceAll("/","_")
	let jsn = JSON.stringify(z,null)
	jsn = jsn.slice(1,-1)
	fs.writeFileSync("./data/"+file+".txt",jsn)

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









// i have 2 new ideas for a project for the rest of the WebSocket

// 1. a game

// have you ever played bonk.io?

// its pretty fun right

// but now think of a multiplayer game like that, except i want to add gear shifting

// so think of your row of numbers as your gearbox
// you can accelerate at that rate, and spend that amount of fuel

// AND, i want there to be a bigger arena, and ball abilities
// one fun ability i just thought of is temporarily turning off collision
// so you can fake being at the edge, press ability, and people run through you

// and the balls can be different mass

// can also make gravity




// 2. a temporal ad-less voice call app






























/*



g = Array.from(document.querySelectorAll('span')).find(span => span.innerText === 'Export expand_more').click()

b = Array.from(document.querySelectorAll('button')).find(span => span.innerText === 'Plain text file').click()
document.querySelectorAll("span.mat-radio-outer-circle")[1].click()

let i = 1

let X = (i-1)*1000 + 1
let Y = i*1000

function updateInputValue(inputElement,newValue) {
            inputElement.value = newValue;

            // Create and dispatch an input event
            const inputEvent = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(inputEvent);

            // Optionally, create and dispatch a change event
            const changeEvent = new Event('change', { bubbles: true });
            inputElement.dispatchEvent(changeEvent);
        }
updateInputValue(document.querySelector('input[name="markFrom"]'),X)
updateInputValue(document.querySelector('input[name="markTo"]'),Y)
document.querySelector("button.mat-tooltip-trigger.dropdown").click()
ful = Array.from(document.querySelectorAll('span')).find(span => span.innerText === 'Full Record').click()

exp = Array.from(document.querySelectorAll('span')).find(span => span.innerText === 'Export').click()



*/






/*


charges = []
/// shit starts here
// to place down a new charge: (charge in units nC)
/// newCharge(charge,x,y)
// to ask for the electric field at a coordinate:
/// prope(x,y)

// newCharge(1,-6,-3)

newCharge(1,0,0)
// probe(0.2,0)
// probe(0.05,0)
// probe(0.15,0)


console.log(probeP(0.01,0)-probeP(0.03))

/// shit ends here


function newCharge(q,x,y=0,uq="nC",ud="m"){
  charges.push({"q":q,"x":x,"y":y,"uq":"nC",ud:"m"})
}

function dot(x1, y1, x2, y2) {
    return (x1 * x2) + (y1 * y2);
}
function distance(x1,y1,x2,y2){
  let a = x2-x1
  let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

function probe(x,y=0,ud="m"){
  let Ex = 0
  let Ey = 0
  let k = 8.99e9
  charges.forEach((e)=>{
    let d = distance(e.x,e.y,x,y)
    let m = k*e.q/(d**2)
    if(e.uq == "nC"){
      m*=1e-9
    }
    
    Ex += dot(e.x-x,e.y-y,1,0)/d*m;
    Ey += dot(e.x-x,e.y-y,0,1)/d*m;
    
  })
  let res = {x_component:Ex,y_componet:Ey,magnitude:distance(Ex,Ey,0,0)}
  console.log(res)
  return(res)
}


function probeP(x,y=0,ud="m"){
  let Ex = 0
  let Ey = 0
  let k = 8.99e9
  let summ = 0
  charges.forEach((e)=>{
    let d = distance(e.x,e.y,x,y)
    let m = k*e.q/(d)
    if(e.uq == "nC"){
      m*=1e-9
    }
    summ += m
    
  })
  console.log("volts:"+summ)
  return(summ)
}


function solvepq(a,b,c) {
    let sum = a+b+c

    p = (a*2 + b)/sum/2
    q = (c*2 + b)/sum/2
    console.log(p,q) // p and q
    console.log(p**2 * sum) // expected a
    console.log(2*p*q * sum) // expected b
    console.log(q**2 * sum) // expected c
    console.log(p**2+2*p*q+q**2) // check (should be = 1 always)
}



*/





