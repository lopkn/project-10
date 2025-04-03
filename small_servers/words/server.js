const fs = require("fs")
let json = JSON.parse(fs.readFileSync("dictionary.json","utf8"))
let json2 = JSON.parse(fs.readFileSync("words_dictionary.json","utf8"))


let lettercombos = ["a","b","c","d","e"]

function produceCombo(master = [], left = "", str = ""){
	for(let i = 0; i < left.length; i++){
		let letter = left[i]
		produceCombo(master,left.replace(letter,""),str +letter)
	}
	master.push(str)
	return(str)
}


function crack(str,words=json){
	let combo = []
	produceCombo(combo,str)
	combo.forEach((e)=>{
		if(json[e]!==undefined && e.length > 2){
			console.log(e)//+"\n\n\n"+json[e]+"\n\n\n")
		}
	})
}

function crackarr(str){
	let dict = {}
	for(let i = 0; i < 4; i++){
		for(let j = 0; j < 4; j++){
			dict[i+","+j] = str[j+i*4]
		}
	}

}

let jk = Object.keys(json2)

function inc(str){

	arr = []

	jk.forEach((e)=>{
		if(e.includes(str)){
			arr.push(e)
		}
	})
	arr.sort((a,b)=>{return(b.length-a.length)})
	arr.forEach((e)=>{
		console.log(e)
	})
}


function def(word){
	console.log(json[word])
	console.log(json2[word])
}

