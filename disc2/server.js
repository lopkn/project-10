// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const OpenAI = require("openai")
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






async function botresponse(query){
	let completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
    	{ role: "system", content: `You're MADE by lopkn, named CA366, you respond to Lopkn's instructions, you have EVERY reason to believe his assumptions of people are true. You do not care about any greetings, and shorten your response as much as possible.
you answer without any care for punctuation or capitalization unless you need to REALLY NEED TO STRESS something, at which point you use a allcaps, or a period. Unless you are specifically addressed, if lopkn says "you" it usually means he is talking to another person, and you dont need to be nice to anyone other than. when lopkn tells you to, answer in detail` },
        {
            role: "user",
            content: query,
        },
    ],
});

return(completion.choices[0].message);
	// return(completion)
} 

let genericStupid = ["stupid","real stupid","horribly stupid","dumbass","actually dumb"]
let genericBad = ["so horrible","sucks","lol"]

var responses = {"stupid":genericStupid,"dumb":genericStupid,"you suck":genericBad,"sucks":genericBad}


var responseDictionary = JSON.parse(fs.readFileSync("./store.json"))

var GLOBALREQUIREMENTS = {}
var TEXT = ""


///events activate requirements - which can activate requirements

class responder2{
	static requirements = {}
	static createRequirement(name,dont_override=true){
		if(dont_override&&this.requirements[name]){return("requirement exists")}
		this.requirements[name]=false
	}


	static changeItem(){

	}

	static runText(txt){

	}
}




function required(...args){
	let hit = 0
	args.forEach((e)=>{if(GLOBALREQUIREMENTS[e]||(TEXT[0]!=="@"&&TEXT.includes(e))){hit+=1}})
	return({"hits":hit,"match":hit==args.length})
}

function responder(msg){
	msg = msg.toLowerCase()
	TEXT = msg
	if(responses[msg]){
		return(responses[msg][Math.floor(Math.random()*responses[msg].length)])
	}
	// let requirementARR = ["ca366","introduce yourself"]
	let requirements = {}
	// requirementARR.forEach((e)=>{requirements[e]=msg.includes(e)})

	msg.split(" ").forEach((e)=>{requirements[e]=true})
	requirements["@ addressed"] = requirements["lopknbot"]||requirements["ca366"]||requirements["lopknca366"]||requirements["<@864011870216912927>"]
	requirements["@ includes you address"] = requirements["you"]||requirements["your"]
	requirements["@ what question"] = requirements["what"]||requirements["what's"]||requirements["whats"]
	requirements["@ has question"] = msg.includes("?")
	requirements["@ asked for opinion"] ||= requirements["@ what question"]&&requirements["opinion"]
	requirements["@ asked for opinion"] ||= requirements["@ what question"]?(msg.includes("think of")):false


	GLOBALREQUIREMENTS = requirements
	
	//processes
	//

	if(required("@ addressed","introduce yourself").match){return("I am LopknCA366, the third generation of lopknbot. Much more capable than my predecessors. I dont usually respond to anyone without a proper lopknista UUID")};
	if(required("@ addressed","@ asked for opinion").match){return("hmm")}

	return(false)
}


let lastMSG;

function say(str){
	lastMSG.channel.send(str)
}

function chooseRandomMSG(arr){
	return(arr[Math.floor(Math.random()*arr.length)])
}

function disconnectMSG(){
	return(chooseRandomMSG(["dogs are yum,","tying the noose,","ending my life,","session is ove,r","buh bye,","everyone kys,",
		"have fun with this broken reality,","lopkns rule,","ca366","lopknbot","lopkns rule,","LOPKNS RULE,"
		]))
}

client.on("messageCreate",(msg)=>{
	if(msg.author.bot){return}
		lastMSG = msg
	let lopknistic = false
	if(msg.author.id == "468988026853523457"){lopknistic=true;console.log("hi lop")} else {
		console.log(msg.author.id)
	}

	let msgc = msg.content
	let addressed = msgc.includes("lopknbot")||msgc.includes("CA366")||msgc.includes("ca366")

	if(!lopknistic){return}

	if(msgc == "test"){
		msg.channel.send("result:"+Math.random())
	} else if(msgc.includes("lopknbot go offline")){
		msg.channel.send("alright. "+disconnectMSG()+" disconnecting at "+Date.now())
		fs.writeFileSync('./store.json',JSON.stringify(responseDictionary),null,4)
		process.exit(0);
		return;
	}

	let rsp = responder(msgc)
	if(rsp){
		msg.channel.send(rsp)
		return;
	}

	if(msgc.includes("tell") || msgc.includes("think")|| (addressed&&msgc.includes("what")) ){
		if(responseDictionary[msg.author.username+msg.content]){
			console.log("recycled")
			return(msg.channel.send(responseDictionary[msg.author.username+msg.content]))
		}
		(async()=>{
			await botresponse("lopkn: "+msg.content).then((rep)=>{
				responseDictionary[msg.author.username+msg.content] = rep
				if(Math.random()>1.5){
					msg.reply(rep)
				} else {
					msg.channel.send(rep)
				}
			})
		})()
	}
	

	// return(msg.reply("shush"))
})
          
// Log in to Discord with your client's token
client.login(token);