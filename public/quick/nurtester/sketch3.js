let Mem = {"working":{},"words":{}}

let funcs = {
	"when seeing a word":(str)=>{
		if(funcs["is this a yes?"](funcs["do i know what this word means?"](str))){
			
		}
	}
}
let opr = [
  [false,false,false,true],
  [false,false,true,false],
  [false,false,true,true],
  [false,true,true,true],
  [false,true,false,true],
  [false,true,true,false],
  [false,true,false,false],
  
  [true,true,true,false],
  [true,true,false,true],
  [true,true,false,false],
  [true,false,false,true],
  [true,false,false,false],
  [true,false,true,false],
  [true,false,true,true]
]
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

	s.split.forEach((e)=>{
		funcs["when seeing a word"](e)
	})

}