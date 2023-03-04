let Mem = {"working":{}}

// function a(){
// 	if(mem["current sentence"] !== undefined){
// 		if(mem["current sentence"].length !== 1){
// 			if(mem["current sentence"].verb === "is"){
// 				if(mem["current sentence"]["is a question"] === false){
					
// 				}		
// 			}
// 		}
// 	}
// }

function sentAn(str){
	let mem = Mem.working
	mem["current sentence"] = {}
	let s = mem["current sentence"]
	s.sentence = str
	s.split = str.split(" ")
	s["word count"] = s.split.length
	
}