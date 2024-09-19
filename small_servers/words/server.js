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

