// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const OpenAI = require("openai")
const engDictionary = require("../small_servers/words/dictionary.json")
const openai = new OpenAI();
const fs = require("fs")
// Create a new client instance

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});





var STR = JSON.stringify

function clone(x){
	return(JSON.parse(JSON.stringify(x)))
}

async function botresponse(query,reqs=""){
	let completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
    	{ role: "system", content: `You're MADE by lopkn, named CA366, you respond to Lopkn's instructions, you have EVERY reason to believe his assumptions of people are true.`+reqs+` You do not care about any greetings, and shorten your response as much as possible.
you answer without any care for punctuation or capitalization unless you need to REALLY NEED TO STRESS something, at which point you use a allcaps, or a period. Unless you are specifically addressed, if lopkn says "you" it usually means he is talking to another person, and you dont need to be nice to anyone other than lopkn. ` },
        {
            role: "user",
            content: query,
        },
    ],
});

return(completion.choices[0].message);
	// return(completion)
} 

let genericStupid = ["stupid","real stupid","horribly stupid","dumbass","actually dumb","mongrel","moron","idiot","bleeding idiot"]
let genericBad = ["so horrible","sucks","lol"]

var responses = {"stupid":genericStupid,"dumb":genericStupid,"you suck":genericBad,"sucks":genericBad}


var STORE = JSON.parse(fs.readFileSync("./store.json"))
let freqStore = JSON.parse(fs.readFileSync("./freq.json"))
var FREQTOTAL = freqStore.freqTotal
var WORDTOTAL = freqStore.wordTotal
var NGRAM = freqStore.freq
var SAMPLETEXTS = freqStore.txt
var responseDictionary = STORE.responseDictionary

var GLOBALREQUIREMENTS = {}
var TEXT = ""




var worddolist = {
	"gave":["@ verb","@ happened"],
	"went":["@ verb","@ happened"],
	"ate":["@ verb","@ happened"],
	"eat":["@ verb","@ present"],
	"did":["@ verb","@ happened"],
	"you":["@ pronoun"],
	"i":["@ pronoun"],
	"they":["@ pronoun"],
	"she":["@ pronoun"],
	"he":["@ pronoun"],
	"her":["@ pronoun"],
	"his":["@ pronoun"],
	"their":["@ pronoun"],
	"this":["@ pronoun"],
	"that":["@ pronoun"],
	"your":["@ pronoun"]

}



class sentence{
	constructor(msg,requirements){
		this.req = requirements
		this.msg = msg
		this.lookingat = 0
		this.searchRangeEnd = Infinity
	}
	reset(){
		this.lookingat = 0
		this.searchRangeEnd = Infinity
		this.returnItem = undefined
		return(this)
	}
	next(item){
		if(this.req[item]==undefined){return(false)}	
		let dst = Infinity
		this.returnItem = undefined
		for(let i = 0; i < this.req[item].length; i++){
			let tdst = this.req[item][i].index - this.lookingat
			if(tdst<0){continue}
			if(tdst<dst){
				dst=tdst
				this.returnItem = this.req[item][i]
			}
		}
		if(this.returnItem===undefined){return(false)}
		this.lookingat += dst+this.returnItem.endex-this.returnItem.index
		return({"item":this.returnItem,"sentence":this,"dist":dst,"out":this.msg.substring(this.returnItem.index,this.returnItem.endex)})
	}
	prev(item){
		if(this.req[item]==undefined){return(false)}	
		let dst = Infinity
		this.returnItem = undefined
		for(let i = 0; i < this.req[item].length; i++){
			let tdst = this.lookingat-this.req[item][i].endex
			if(tdst<0){continue}
			if(tdst<dst){
				dst=tdst
				this.returnItem = this.req[item][i]
			}
		}
		if(this.returnItem===undefined){return(false)}
		this.lookingat -= dst+this.returnItem.endex-this.returnItem.index
		return({"item":this.returnItem,"sentence":this,"dist":dst,"out":this.msg.substring(this.returnItem.index,this.returnItem.endex)})
	}


	inRange(item){
		return(inrange(item.index,item.endex,this.lookingat,this.searchRangeEnd))
	}

	Then(reqname,item){
		let word = this.msg.substr(item.index,item.endex-item.index)
		item.propegated = true
		if(reqname == "@ word"){
			if(word[word.length-1] === "s"){
				newReq("@ ends with character s",clone(item))
			}
			if(word.includes("'")){
				newReq("@ apostrophe",clone(item))
			}
			// if(["you","i","they","she","he","her","his","their","your"].includes(word)){
				// newReq("@ pronoun",clone(item))
			// }
			if(engDictionary[word] || NGRAM[word] || worddolist[word]){
				newReq("@ known word",clone(item))
			} else {
				newReq("@ unknown word",clone(item))
			}

			if(worddolist[word]){
				worddolist[word].forEach((e)=>{
					newReq(e,clone(item))
				})
			}else{
				let last4 = word.substr(-4)
				let last3 = word.substr(-3)
				let last2 = word.substr(-2)
				if(last3==="ing"){
					newReq("@ verb",clone(item))
					newReq("@ happening",{"index":item.endex-3,"endex":item.endex})
				}
				if(last2==="ed"){
					newReq("@ verb",clone(item))
					newReq("@ happened",{"index":item.endex-3,"endex":item.endex})
				}
				if(last3==="ate" || last3 === "ize" || last3 === "ise"){
					newReq("@ verb",clone(item))
				}


				if(last4==="tion" || last4==="sion" || last4 === "ment" || last4 === "ness" || last4 === "ship" || last3==="ity"){
					newReq("@ noun",clone(item))
				}
				if(word.substr(-1)==="y"){
					if(last2==="ly"){
						newReq("@ adverb",clone(item))
					} else {
						newReq("@ adjective",clone(item))
					}
				}
			}
			

		} else if(reqname === "@ prompt"){
			let coherence = NgramScore(word)
			if(coherence < 100){
				newReq("@ incoherent",clone(item))
			}
		} else if(reqname === "@ unknown word"){
			let coherence = NgramScore(word)
			console.log(" unknown " + word + coherence)
			if(coherence < 100){
				newReq("@ incoherent",clone(item))
			}
		}
	}

// what part of speech is "redemption"
}
// makes up!
// ["starting word"+"word"+"when"] -> next "condition release" -> "condition"
// ["starting word"+"word"+"when"] -> next "statement" = condition

function getRange(req){
	return(SENTENCE.msg.substring(req.index,req.endex))
}


function inrange(x1,x2,y1,y2){ //x1 x2 is range 1, and the first number must be smaller in both ranges
	return(x1 <= y2 && x1 <= x2)
}


function cleanReq(){
	let objk = Object.keys(GLOBALREQUIREMENTS)
	objk.forEach((e)=>{
		if(!GLOBALREQUIREMENTS[e]){
			GLOBALREQUIREMENTS[e] = undefined
			delete GLOBALREQUIREMENTS[e]
		}
	})
	return(GLOBALREQUIREMENTS)
}

///events activate requirements - which can activate requirements

function refseg(find,denote,msg,requirements,options={}){
	let arr = []
	let actmsg = msg
	if(options.actmsg!==undefined){actmsg = options.actmsg}
	while(true){
		let dict = {}
		let ind = actmsg.indexOf(find)
		dict.index = ind
		if(dict.index===-1){
		//# function ends here
			if(requirements!==undefined){
				if(arr.length===0){return(requirements[denote])}
				if(requirements[denote]===undefined){requirements[denote]=[]}
				requirements[denote]=requirements[denote].concat(arr)
			}

			return(arr)
		}

		dict.index += msg.length-actmsg.length
		dict.endex = dict.index + find.length
		dict.denote = denote
		arr.push(dict)
		console.log(actmsg)
		actmsg=actmsg.substring(ind+find.length)
	}

}

function refsegarr(finds,denote,msg,requirements,options={}){
	for(let i = 0; i < finds.length; i++){
		let find = finds[i]
		refseg(find,denote,msg,requirements,options)
	}
}



function required(...args){
	let hit = 0
	args.forEach((e)=>{if(GLOBALREQUIREMENTS[e]||(TEXT[0]!=="@"&&TEXT.includes(e))){hit+=1}})
	return({"hits":hit,"match":hit==args.length})
}


function newReq(req,item){ //if .then returns a correction for what the tag should be, it would be tagged that
	if(GLOBALREQUIREMENTS[req]===undefined){GLOBALREQUIREMENTS[req]=[]}
	let a = SENTENCE.Then(req,item)
	if(a!==false){
		if(a === undefined){
			GLOBALREQUIREMENTS[req].push(item)
		} else {
			GLOBALREQUIREMENTS[a].push(item)
		}
	}
	return(GLOBALREQUIREMENTS)
}

var SENTENCE = undefined

function responder(MSG){
	let sender = MSG.author.username
	let amsg = MSG.content
	let msg = amsg.toLowerCase()
	TEXT = msg

	if(responses[msg]){
		return(responses[msg][Math.floor(Math.random()*responses[msg].length)])
	}
	// let requirementARR = ["ca366","introduce yourself"]
	let requirements = {}
	GLOBALREQUIREMENTS = requirements
	SENTENCE = new sentence(msg,requirements)
	responseReqs = ""
	// requirementARR.forEach((e)=>{requirements[e]=msg.includes(e)})
	let rs;
	let lopknistic = (sender =="lopkn" || sender == "fullwoodenshovel" || sender == "Galath")

	let msgindex = -1
	newReq("@ prompt",{"index":0,"endex":msg.length})
	requirements["@ word"] = []
	msg.split(" ").forEach((e)=>{
		msgindex+=1+e.length;
		if(requirements[e]===undefined){requirements[e]=[]};
		// requirements["@ word"].push({"index":msgindex-e.length,"endex":msgindex});//same as next line
		newReq("@ word",{"index":msgindex-e.length,"endex":msgindex})
		// requirements[e]=requirements[e].concat([{"index":msgindex-e.length,"endex":msgindex}]);
		newReq(e,{"index":msgindex-e.length,"endex":msgindex})
	})


	requirements["@ addressed"] = requirements["lopknbot"]||requirements["ca366"]||requirements["lopknca366"]||requirements["<@864011870216912927>"]||requirements["lopbot"]||requirements["lb"]
	



	requirements["@ reply"] = MSG.reference!==null
	requirements["@ lopknistic"] = lopknistic
	requirements["@ includes you address"] = requirements["you"]||requirements["your"]
	requirements["@ what question"] = requirements["what"]||requirements["what's"]||requirements["whats"]
	requirements["@ has question"] = msg.includes("?")
	requirements["@ asked for opinion"] ||= requirements["@ what question"]&&requirements["opinion"]
	requirements["@ asked for opinion"] ||= requirements["@ what question"]?(msg.includes("think of")):false
	requirements["@ asked to tell"] ||= requirements["think"] || requirements["tell"]
	requirements["@ summary"] ||= requirements["summarise"] || requirements["summary"] || requirements["summarize"]
	requirements["@ history"] ||= requirements["history"] || requirements["past"]
	//@ = noted requirements, # = text AI requirements
	requirements["# need to generate"] ||= requirements["@ asked to tell"]
	// requirements["@ tell ... to"] ||= requirements["tell"] && requirements["to"] && (msg.includes("tell this guy to")||msg.includes("tell them to")||msg.includes("tell him to")||msg.includes("tell her to"))
	

	requirements["@ tell * to"] = requirements["tell"] && (SENTENCE.reset().next("tell").sentence?.next("@ word").sentence?.next("@ word").out === "to" || SENTENCE?.next("@ word").out === "to")

	//non blocking requirements
	if(requirements["@ incoherent"]){MSG.channel.send("seems incoherent > "+SENTENCE.reset().next("@ incoherent").out)}
	if(requirements["@ unknown word"]){console.log("> "+getRange(requirements["@ unknown word"][0]))}



	if(requirements["athiest"]||requirements["religion"]||requirements["religious"]){responseReqs+="You are athiest."}
	if(requirements["utilitarian"]||requirements["self"]||msg.includes("benefit")||msg.includes("choice")){responseReqs+="You are utilitarian, you believe everone only ever does anything to benefit themselves."}
	if(requirements["copyright"]){responseReqs+="You dislike copyright. you think its existance impeeds society's progress."}
	if(requirements["@ history"]){responseReqs+="You think history is unimportant, and people focusing on the past is a waste of time. We dont learn from mistakes anyway."}
	
	rs=refsegarr(["lopbot","lopknbot","lb","ca366","lopknca366","<@864011870216912927>"],"@ addressed",msg,requirements)

	if(requirements["@ politics"]){responseReqs+=""}
	//processes
	//


	if(requirements["@ lopknistic"] && requirements["wrong"] && requirements["@ reply"]){
		(async()=>{
			lastMSG.fetchReference().then((e)=>{
				if(responseDictionary[e.content]){
					responseDictionary[e.content]["wrong"]=sender
					e.channel.send("["+e.content+"] is flagged as wrong by "+sender)
				} else {
					e.channel.send("this message is not from the response dictionary and cannot be flagged")
				}
			}).catch((e)=>{if(e.code!=="MessageReferenceMissing"){console.log(e)}})
		})()
		return("noted")
	}



	if(requirements["barble"]){if(Math.random()>0.3){return(barbleDictionary(amsg,Math.floor(Math.random()*700+300)))};return(moreBarble("e",Math.floor(Math.random()*500+100)))}
	if(requirements["define"]){if(engDictionary[msg.substring(7+msg.indexOf("define "))]==undefined){return("idk")};return(engDictionary[msg.substring(7+msg.indexOf("define "))].substring(0,1900))}
	if(requirements["coherence"]){return("coherence score -> "+NgramScore(msg.substring(10+msg.indexOf("coherence "))))}
	if(requirements["construct"]){return(""+NgramBuild(msg.substring(10+msg.indexOf("construct "))))}
	if(requirements["ngramize"]){return(engDictionary[msg.substring(7+msg.indexOf("ngramize "))].substring(0,1900))}
	
	if(msg.includes("time now")){return((new Date().toString()))}

	if(required("@ addressed","introduce yourself").match){return("I am LopknCA366, the third generation of lopknbot. Much more capable than my predecessors. I dont usually respond to anyone without a proper lopknista UUID")};
	if(required("@ addressed","@ asked for opinion").match){return("hmm")}
	if(required("@ addressed","evaluate").match){if(sender!=="lopkn"){return("only people with valid lopknista UUID's can use the evaluation function. Lopknistis do not count")};let str=amsg.substring(10+msg.indexOf(" evaluate "));console.log(str);try{return( (""+eval(str)).substr(0,1999) )}catch(err){return(err.toString())}}

	if(requirements["@ tell * to"]&&requirements["@ lopknistic"]){return(msg.substring(4+msg.indexOf(" to "))+", stupid")}
	if(requirements["@ summary"]){return("dont wanna help with that")}


	rs=refsegarr(["shut up","stupid","dumb","gay","retard"],"@ insults",msg,requirements)
	rs=refsegarr(["great","amazing","the best","ca366","gay","retard"],"@ compliments",msg,requirements)
	// rs=refsegarr(["you","i","they","she","he","her","his","their"],"@D pronoun",msg,requirements)
	rs=refsegarr(["is","are"],"@ equate",msg,requirements)
	rs=refsegarr(["hi","hey","hello","salutations"],"@ greetings",msg,requirements)


	if(requirements["@ unknown word"]){return("i dont know the word > "+SENTENCE.reset().next("@ unknown word").out)}


	if(!lopknistic){
		if(!requirements["@ addressed"] || Math.random()>0.7){
			return(false)
		} 
		responseReqs+="You dont respond well to non-lopkn people"
	}

	if(requirements["@ asked to tell"]){return({"generate":true,"requirements":requirements,"reqs":responseReqs})}
	if(requirements["@ addressed"] && Math.random()>0.7){return({"generate":true,"requirements":requirements,"reqs":responseReqs})}

	return(false)
}


let lastMSG;
let lastReference;

function say(str){
	lastMSG.channel.send(str)
}

function chooseRandomMSG(arr){
	return(arr[Math.floor(Math.random()*arr.length)])
}

function disconnectMSG(){
	return(chooseRandomMSG(["dogs are yum,","tying the noose,","ending my life,","session is ove,r","buh bye,","everyone kys,",
		"have fun with this broken reality,","lopkns rule,","ca366","lopknbot","lopkns rule,","LOPKNS RULE,","learning..."
		]))
}

var HALTED = false
var msglog = []
var msgRespond = (msg)=>{
	if(msg.author.bot){return}
		lastMSG = msg
		msglog.push(msg.content)
		lastReference = undefined
		if(msg.reference!==null){
			msg.channel.messages.fetch(msg.reference.messageId).then(message =>{lastReference=message})
		}

	if(msg.author.id == "468988026853523457"){
		if(msg.content == "halt"){
			HALTED = !HALTED
		}


		if(msg.content[0] === "!"){
			let str = msg.content.substring(1)
			try{return(msg.reply((""+eval(str)).substr(0,1999)))}catch(err){return(msg.reply(err.toString()))}
			return;
		}
	}
	let lopknistic = false
	if(msg.author.id == "468988026853523457"){lopknistic=true} else {
		console.log(msg.author.id)
	}

	let msgc = msg.content
	let addressed = msgc.includes("lopknbot")||msgc.includes("CA366")||msgc.includes("ca366")

	// if(!lopknistic){return}

	if(msgc == "test"){
		msg.channel.send("result:"+Math.random())
	} else if(msgc.includes("lopknbot go offline")){
		msg.channel.send("alright. "+disconnectMSG()+" disconnecting at "+Date.now())
		setTimeout(()=>{process.exit(0);},1000)
		return;
	}



	


	let rsp = responder(msg)
	if(rsp){

		if(typeof(rsp)=="string"){
			msg.channel.send(rsp)
		return;
		} else if(rsp.generate){
			if(responseDictionary[msg.content]?.[msg.author.username]?.default){
				console.log("recycled")
				if(responseDictionary[msg.content].wrong){
					return(msg.channel.send("I am learning on this topic currently/my last answer on this was wrong & i wont be repeating it"))
				}
				return(msg.channel.send(responseDictionary[msg.content]?.[msg.author.username]?.default))
			}
			if(HALTED){return}
			(async()=>{
			await botresponse(msg.author.username+": "+msg.content,rsp.reqs).then((rep)=>{
				console.log("new response",JSON.stringify(rep,null,4))
				if(responseDictionary[msg.content]===undefined){responseDictionary[msg.content] = {}}
				if(rep.refusal !== null){
					msg.channel.send("ummmm")
					responseDictionary[msg.content][msg.author.username] = {"refused":rep}
					return
				}
				responseDictionary[msg.content][msg.author.username] = {"default":rep}
				if(Math.random()>1.5){
					msg.reply(rep)
				} else {
					msg.channel.send(rep)
				}
			})
			})()
		}
		
	}

}
client.on("messageCreate",msgRespond)




function onexit(options){

	fs.writeFileSync('./store.json',JSON.stringify(STORE,null,4))
	fs.writeFileSync('./freq.json',JSON.stringify({"freq":NGRAM,"txt":SAMPLETEXTS,"wordTotal":WORDTOTAL,"freqTotal":FREQTOTAL},null,4))
	console.log("==== session saved ====")
	if(options.exit){
		process.exit(0)
	}
}
var exit = process.exit
process.stdin.resume()
process.on('exit',onexit.bind())
process.on('SIGINT',onexit.bind({exit:true}));


function conversion(){
	let newD = {}
	let objk = Object.keys(responseDictionary)
	objk.forEach((e)=>{
		if(e[0]=="l"){
			newD[e.substring(5)]=responseDictionary[e]
		} else if(e[0]=="f"){
			newD[e.substring(16)]=responseDictionary[e]
		}
	})
	return(newD)
}


          
// Log in to Discord with your client's token
client.login(token);








// extra stuff, like barbling
var letters = {"0":{"0":8,"max":17,",":4," ":5},"1":{"0":2,"2":1,"max":3},"2":{"0":2,"2":1,"max":3},"3":{"0":1,"max":1},"5":{"0":1,"max":1},"t":{"max":1552,"h":595,"o":121," ":296,"e":104,"w":12,"y":14,"i":96,"s":33,"a":58,"r":64,"l":19,"t":22,".":29,"u":41,",":33,"n":3,"f":1,"c":4,"?":3,"b":1,"!":2,"—":1},"h":{"max":1089,"e":528,"a":161,"w":3,"i":140," ":107,"o":62,"t":32,"l":3,".":10,"r":7,",":11,"y":11,"m":1,"s":2,"—":1,"’":4,"u":5,"d":1},"e":{"max":2237," ":715,"g":13,"b":3,"s":142,"m":39,".":36,"n":152,"r":312,",":60,"d":215,"i":18,"t":62,"e":81,"f":21,"w":11,"l":62,"a":126,"p":17,"x":15,"v":40,"-":4,"c":35,"y":29,"q":2,"h":2,"u":1,"o":15,"\n":1,"z":1,"’":4,"?":1,"—":1,";":1}," ":{"1":2,"2":1,"3":1,"5":1,"max":3823,"s":329,"o":218,"b":186,"t":606,"p":110,"i":167,"f":161,"d":120,"m":133,"c":126,"k":19,"e":75,"g":77,"r":105,"h":232,"l":177,"a":459,"w":256,"y":83,"v":22,"z":1,"n":96,"j":9,"u":34,"q":5,"\"":2,"“":6,".":3,",":1},"s":{"max":1189,"i":53,"t":159," ":372,"s":56,"a":38,"h":75,"o":55,"e":117,"u":31,",":54,"l":31,"c":25,";":3,"p":38,"w":3,"m":12,"n":1,"k":11,"y":6,".":40,"q":2,"g":1,"-":1,"—":3,"!":1,"r":1},"i":{"max":1143,"e":34,"n":280,"a":17,"r":44,"s":142,"i":1,".":1,"o":51,"t":131,"l":61,"p":10,"v":68,"m":57,"c":44,"f":23,"'":2," ":15,"d":77,"g":48,"b":8,"z":4,"k":21,"h":1,"’":2,"q":1},"g":{"max":383,"e":49," ":109,"o":29,"h":44,"a":19,",":18,"r":34,"g":7,"i":21,"f":1,"l":7,"n":10,".":10,"u":7,"s":12,"m":2,"t":1,"—":1,"!":1,"y":1},"o":{"max":1190,"f":120,"o":51,"k":18,"n":168,"l":34,"v":12,"r":108,"s":38," ":136,"u":205,"m":59,"y":3,"p":30,"t":70,"w":49,"c":14,"x":2,"d":24,"h":1,"a":14,"b":6,"g":9,"i":8,".":2,"e":1,"z":1,",":7},"f":{"max":380," ":124,"e":31,"t":17,"o":50,"a":37,"r":34,"u":13,"i":29,"f":12,"l":21,",":4,"s":1,"-":3,".":2,"y":2},"b":{"max":253,"u":27,"r":22,"e":87,"y":23,"a":24,"o":21,"l":20,"i":15,"b":5,"n":1,",":4,".":1,"—":1,"s":1,"j":1},"u":{"max":495,"k":4,"a":10,"r":43,"e":17,"l":56,"n":53,"h":2,"m":21,"g":16,"t":55,"c":23,"f":1," ":59,".":8,"s":63,"'":3,"p":41,"v":1,"i":8,"d":8,"b":3},"k":{"max":154,"h":7," ":30,"e":56,"y":4,"u":2,"n":16,"i":17,",":1,"s":13,"-":3,"l":2,".":3},"a":{"max":1591,"r":223," ":151,"c":49,"z":7,"n":292,"d":93,"u":11,"s":170,"f":14,"h":2,"m":42,"l":114,".":9,"i":40,"y":39,"k":16,"t":170,"v":30,"g":26,"x":2,",":8,"w":17,"b":22,"p":30,"-":1,"’":9,"?":3,"e":1},"r":{"max":1105,"a":124,"u":18,"y":22,"i":117,"e":259," ":175,"o":101,"s":42,"c":7,"r":16,"t":61,"p":5,",":23,"n":15,".":23,"d":22,"m":16,"v":6,"k":17,"f":6,"l":10,"g":5,"h":3,"b":3,"—":4,"’":4,"w":1},"p":{"max":343,"l":39,"i":41,"r":31,"e":66,"o":33,"u":12,"t":10,"a":47,"h":5,"p":20,",":8," ":17,"s":8,".":6},"l":{"max":780,"a":148," ":59,"e":152,"t":22,"l":83,"y":34,"k":3,"o":50,"i":90,"d":41,"s":22,"g":1,".":9,",":15,"u":10,"f":15,"v":1,"?":1,"-":1,"p":1,"\"":1,"h":4,"w":10,"!":1,"n":1,"r":2,"m":2,"b":1},"c":{"max":369,"e":49,"o":58,"h":55,"r":27,"i":41,"t":16,"a":48,"?":1," ":3,"l":16,"u":11,"k":25,"c":3,",":13,"s":1,".":1,"y":1},"n":{"max":1117," ":238,"g":175,"q":2,",":12,"c":29,"a":31,"d":204,"e":86,".":21,"t":86,"u":28,"s":29,"i":48,"'":7,"o":63,"k":19,"y":10,"v":3,"p":2,"r":3,"n":5,"-":4,"’":5,"l":5,"j":1,";":1},"y":{"max":304," ":125,"z":2,"l":1,".":15,"a":1,"s":18,"'":1,"e":12,"o":88,"t":3,"i":5,",":23,"d":1,"b":1,"p":2,"m":1,"-":1,"c":1,"’":3},",":{"0":3,"max":336," ":328,"”":5},"d":{"max":815,"u":4," ":452,"e":114,"a":27,".":45,"o":23,"n":1,",":28,"y":7,"l":9,"i":48,"w":3,"r":17,"-":4,"s":18,"\"":1,"m":2,"c":3,"g":2,"b":1,":":2,"d":3,"—":1},"m":{"max":402,"o":43,"i":48,"p":26,"u":15,"m":8,"a":67," ":41,"e":118,"s":8,"b":10,"y":2,".":6,"f":1,",":7,"?":1,"!":1},"q":{"max":12,"u":12},"w":{"max":373,"a":118,"e":45,"i":52," ":24,"o":44,"y":1,"b":1,"h":50,"k":1,"n":21,"r":2,"s":5,".":2,",":2,"w":2,"l":2,"?":1},"z":{"max":18,"m":3,"y":3,"i":3,"a":1,"e":5,"z":2,"l":1},".":{"max":281," ":215,"\n":55,"s":1,":":1,"p":1,"c":2,"”":6},"v":{"max":184,"o":9,"e":145,"u":3,"i":20,"a":6,"y":1},"'":{"max":13,"s":1,"t":7,"l":1,"r":3,"m":1},";":{"max":5," ":5},"x":{"max":19," ":2,"i":8,"y":1,"t":2,"c":2,"p":4},"?":{"max":11," ":3,"\n":1,"”":7},"\n":{"1":1,"max":81,"\n":13,"y":6,"i":5,"o":2,"m":1,"p":3,"t":10,"a":5,"s":2,"l":6,"w":3,"“":15,"r":1,"h":4,"f":3,"e":1},"j":{"max":12,"u":5,"e":2,"a":2,"o":3},"-":{"max":22,"d":4,"c":1,"s":6,"h":3,"j":1,"w":1,"r":3,"t":2,"n":1},"\"":{"max":4,"n":1," ":2,"c":1},":":{"max":3," ":3},"—":{"max":13,"a":1,"i":1,"b":2,"t":3,"e":1,"p":1,"m":2,"g":1,"r":1},"’":{"max":31,"s":25,"r":2,"t":2,"d":1,"m":1},"“":{"max":21,"w":2,"h":4,"t":2,"g":2,"e":1,"i":3,"s":1,"p":2,"d":1,"v":1,"a":1,"f":1},"”":{"max":21," ":11,"\n":10},"!":{"max":6,"”":3," ":2,"\n":1}} 

function simpleDistill(par){
  for(let i = 1; i < par.length;i++){
    let e = par[i].toLowerCase()
    let E = par[i-1].toLowerCase()
    if(letters[E]==undefined){letters[E] = {"max":0}}
    if(letters[E][e] == undefined){letters[E][e] = 0}
    letters[E][e] += 1
    letters[E]["max"]+=1
  }
}
function generateBarble(letter){
  let objk = Object.keys(letters[letter])
  let dop = Math.floor(letters[letter].max*Math.random())
  let i = 0;
  while(dop > 0){
    if(objk[i] == "max"){i++}
    dop -= letters[letter][objk[i]]
    i++
  }
  // if(objk[i-1] == undefined){console.log(objk,i,dop)}
  if(i==0){i++}
return(objk[i-1])
}

function moreBarble(str,times){
  // str = str==""?"h":str
  let last = ""
  while(times > 0){
    let barbleLetter = generateBarble(str[str.length-1])
    if(barbleLetter == " "){
      if(last == "i" || last == "a" || last.length > 1){
        str += barbleLetter
        last = ""
       times -= 1
      } else {
        
      }
    } else {
      str += barbleLetter
      last += barbleLetter
       times -= 1
      
    }

  }
   return(str)
}

function barbleDictionary(str,length){
	let outstr = chooseRandomMSG(str) // start with a letter
	let astr = str
	while(outstr.length < length){
		let spl = astr.split(" ")
		let success = 0
		for(let i = 0; i < spl.length && success < 20; i++){
			let definition = engDictionary[spl[i]]
			if(definition !== undefined){
				let word = chooseRandomMSG(definition.split(" "))
				outstr = outstr + word + " "
				console.log(word)
				astr = definition
				success += 1
				if(outstr.length>length){break}
			}
		}
		if(success == 0){
			outstr = moreBarble(outstr,5)
		}
	}
	return(outstr)
}


function Ngramizer(text){
	let bg = betterNgramizer(text)

	return(bg.Ngram)
}

function betterNgramizer(text){
	let str = ""
	let wt = 0 //word total
	let ft = 0 //freq total
		let Ngram = {}
		while(text.length>0){
			let chared = /^[A-Za-z]$/.test(text[0])
			if(chared){
				str += text[0].toLowerCase()
				for(let i = 0; i < str.length; i++){
					let sliced = str.slice(str.length-i-1,str.length)

					if(Ngram[sliced]===undefined){Ngram[sliced]={"freq":0}}
					Ngram[sliced].freq+=1
					ft += 1
				}
			} else {
				if(str===""){text = text.substring(1);continue}
				if(Ngram[str].word===undefined){Ngram[str].word=0}
				Ngram[str].word += 1
				wt += 1
				str = ""
			}

			text = text.substring(1)
		}
		if(str!==""){
				if(Ngram[str].word===undefined){Ngram[str].word=0}
				Ngram[str].word += 1
				wt += 1
		}

		return({"Ngram":Ngram,"freqTotal":ft,"wordTotal":wt})
}


function Ng(text){
	let n2 = Ngramizer(text)
	mergeNgrams(NGRAM,n2)
	return(n2)
}

function NgramScore(text){
	if(text===""){return(0)}
	let ng = Ngramizer(text)
	let objk = Object.keys(ng)
	let score = 0
	objk.forEach((e)=>{
		if(e.length === 1){return}
		let freq = NGRAM[e]?.freq?NGRAM[e].freq:0
		score += freq * ng[e].freq / FREQTOTAL
		if(NGRAM[e]?.word && ng[e].word){
			score += 5*NGRAM[e].word*ng[e].word / WORDTOTAL
		}
	})
	return(score/text.length*100000)
	// return("analyzing "+text+" -> "+Math.floor(score/text.length*100000))
}

function mergeNgrams(n1,n2){
	let objk = Object.keys(n2)
	objk.forEach((e)=>{
		if(n1[e]===undefined){n1[e]=n2[e]}
		if(n2[e].word!==undefined){
			if(n1[e].word===undefined){n1[e].word=0}
			n1[e].word += n2[e].word
		}
		n1[e].freq += n2[e].freq
	})
	return(n1)
}

function NgramBuild(word){
	let letterarr = "abcdefghijklmnopqrstuvwxyz".split("")
	let limit = 500
	while(limit>0){
		limit--
		let wordarr = []
		let ft = 0
		letterarr.forEach((e)=>{
			let ng = NGRAM[word+e]
			let ng2 = NGRAM[e+word]
			if(ng!==undefined){
				wordarr.push(word+e)
				ft+=ng.freq
			}
			if(ng2 !==undefined){
				wordarr.push(e+word)
				ft+=ng2.freq
			}
			
		})
		//
		if(wordarr.length===0){
			return(word)
		}
		//choose actual word
		let wordOut;
		let mr = Math.random()*ft
		while(mr>0){
			wordOut = wordarr.pop()
			mr-=NGRAM[wordOut].freq
		}
		if(NGRAM[wordOut].word){
			if(Math.random()<NGRAM[wordOut].word/NGRAM[wordOut].freq){
				return(wordOut)
			}
		}
		word = wordOut
	}
	return("ERROR NOTHING FOUND: "+word)

}




// In an argument


// 1. list all the INTRINSIC factors
// 2. list all the LOGIC statements
// 3. dispute the logical VALIDITY of the statent
// 4. dispute the logical SOUNDNESS of the statent


// step 1: person building
//  you cant assume anything about this person
//  you need to KNOW for a fact thier intrinsic feelings of anything
//  so you can probe ALL their intrinsic feelings towards anything
// step 2: dispute LOGIC
// step 3: after disputing logic, does the new result effect the person in a way that changes their perception
// step 4: accept they didnt change their opinion, or they changed their opinion.


// so answer me right now
// DONT ASSUME ANYTHING ABOUT ME
// "why should i think is murder bad?"

// "you go jail" (failed LOGIC): I dont think jail is so bad. they serve good food
// inference: intrinsic feeling towards food

// PROBE FIRST. "so you like prison food?" -> "yes"
// "have you ever actually TRIED prison food?" -> "yes" -> (nothing you can do about it)
// "have you ever actually TRIED prison food?" -> "no" -> means he DERIVED/LEARNT the feeling about prison food

// anything LEARNT can be disputed logically

// response: you made a logically UNSOUND statement: they dont serve good food
// argument takes place: Do prisons actually have food that buddy enjoys?
// argument resolution: "yes" -> cant do anything about it
// "no" -> he changes his opinion




// lets say "how much i like something" is denoted by a number


// PRISON = "how good food is" * intrinsic feeling of food + "how unfree prison is" * intrinsic feeling of prison


// do you get that if a statement cant be tested it should never be used?
// dont use religion as an example for now because ur biased towards that
// lets say my statement is "this table didnt exist in a way that is not testable"
// how can you argue with me?

// Im wrong for even claiming that statement, because i should KNOW you cant change your view based on that
// because I KNEW that there is no way for you to test it, there is no point of saying intents

// You cant convince me im lying (because theres a possibility im not)
// I cant convince you im not lying (because there is no evidence to suggest im not lying)

// SO, actually neither me or you can conclude anything other than the fact that this statement will never make any sense to anyone

// its why philosophers dont go around claiming there are things outside the universe
// there is no unless. once it is accepted that we cant see out of the universe




// theories are testable
// its pseudoscience it doesnt make sense

// its wrong to say because just based on the claim alone, you KNOW you cant convince anyone
// therefore its a waste of peoples time to claim it at all.

// thats the statement that "words/beliefs bring happiness" which is testable
// in the same way that the candy for the kid is NEGATIVE because he believes it is
// it doesnt make that belief logical to anyone else
// it could make sense to HIMSELF, but he cannot convince anyone else of that same belief using that argument

// the claim that "the universe is one cell out of millions of cells we cant see"
// is the same as "theres a flying table outside of the observable universe"

// then believing in a flat earth + flying torus COULD be equally right/wrong





// the premise of human logic is that it needs to be "LOGICALLY FOLLOWABLE"
// for example the negative candy kid (NCK)
// he thinks negatively of candy because "parent yelling" ( logically bullshit )

// but maybe the entire world also thinks negatively of candy because "unhealthy" (logically sound)

// NCKs belief is still wrong

// the RESULT that came out is WRONG because the LOGIC is wrong. just because its also negative doesnt mean its right

// ITS NOT WRONG for the kid to think that the candy is bad for wrong logic
// its not wrong FOR THE PERSON who believes anything
// but its wrong for EVERYONE ELSE
// and its not wrong for ANYONE ELSE to dispute it


// for example:

// 	a side effect of this logical structure that i use is "all tradition is useless and wrong"
	
// 	i think that people are wrong in terms of tradition
// 	they are only RIGHT if they actually do feel an intrinsic happiness towards tradition


// 	KID: intrinsic (candy good), experience(yelling bad) CONCLUSION: candy bad = KID is wrong
// 	feeling: correct to kid
// 	logic: wrong to anyone else
// 	disputing: everyone would argue with the kid



// 	KID: intrinsic (tradition good), whatever = KID is right
// 	feeling: correct to kid
// 	logic: correct to me
// 	disputing: noone would argue with the kid


// ^ this is what you are saying
// but i am saying

// 	KID: intrinsic (tradition meh), experience(red packets good) = KID is wrong
// 	feeling: correct to kid
// 	logic: wrong to ANYONE ELSE
// 	disputing: everyone would argue with the kid
	
	
	


















