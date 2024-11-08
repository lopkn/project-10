function syl(str){
	
	let syllable = ""
	let amount = 0
	let ending = 0
	for(let i = 0; i < str.length; i++){
		let l = str[i]
		syllable += str[i]
		let isVowel = false
		if(l == "a" || l == "e" || l == "i" || l == "o" || l == "u"){
			if(syllable.length === 1 && i-1 > -1){
				syllable = str[i-1]+syllable
			}
			if(ending == 0){ending += 1}
			ending += 1
			isVowel = true
		}
		if((i==str.length-1 && l=="e")){ending += 2}

		if(ending > 0){
			ending -= 1 
			if(ending == 0){
				console.log(syllable)
				amount += 1
				syllable=""
			}
		}

	}
	console.log(syllable)
	amount += 1
	return(amount)
}