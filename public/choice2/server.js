const prompt = require('prompt-sync')();
const fs = require("fs");

const temp_AAAA = prompt('prompt start: ');
console.log(`starting confirm: ${temp_AAAA}`);




class main{
	static blocks = {};
	static cid = 0;

	static pushBlock(b){
		this.cid++;
		this.blocks[this.cid] = b;
	}


	static currentID = 1;
}

class qBlock{
	constructor(question,dt,df){
		this.question = question;
		this.defaultTrue = dt?dt:0;
		this.defaultFalse = df?df:0;
	}
	executable(a){}
}

function mnew(q,dt,df){
	main.pushBlock(new qBlock(q,dt,df))
}




mnew("does this work?",1,0)





while(main.currentID != 0){
	let q = main.blocks[main.currentID]
	console.log("===question "+main.currentID+" ===")
	console.log(q.question)

	if(q.defaultFalse === 0){
		if(q.defaultTrue === 0){
			console.log("this question has no default answer paths")
		} else {
			console.log("this question has no default false path")
		}
	} else if(q.defaultTrue === 0){
		console.log("this question has no default true path")
	}

	let ans = prompt("True or false?  >")
	if(ans[0] == "t" || ans[0] == "T" || ans[0] == "y" || ans[0] == "Y"){
		q.executable(1);
		main.currentID = q.defaultTrue;
		continue;
	}
	q.executable(0);
	main.currentID = q.defaultFalse;

}



console.log("program exited")




//inquirer
//req #something
//b you are dumb
//ret 120




