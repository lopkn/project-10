// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
import OpenAI from "openai"
const openai = new OpenAI();

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
you answer without any care for punctuation or capitalization unless you need to REALLY NEED TO STRESS something, at which point you use a allcaps, or a period. Unless you are specifically addressed, if lopkn says "you" it usually means he is talking to another person` },
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

var responses = {"stupid":genericStupid,"dumb":genericStupid,"you suck":genericBad,"sucks",genericBad}


function responder(msg){
	msg = msg.toLowerCase()
	if(responses[msg]){
		return(responses[msg][Math.floor(Math.random()*responses[msg].length)])
	}
	return(false)
}

client.on("messageCreate",(msg)=>{
	if(msg.author.bot){return}
	let lopknistic = false
	if(msg.author.id == "468988026853523457"){lopknistic=true;console.log("hi lop")} else {
		console.log(msg.author.id)
	}


	if(!lopknistic){return}
	let msgc = msg.content

	if(msgc == "test"){
		msg.channel.send("result:"+Math.random())
	}

	let rsp = responder(msgc)
	if(rsp){
		msg.channel.send(rsp)
		return;
	}

	if(msgc.includes("tell") || msgc.includes("think")|| ( (msgc.includes("lopknbot")||msgc.includes("CA366"))&&msgc.includes("what")) ){
		(async()=>{
			await botresponse(msg.content).then((rep)=>{
				if(Math.random()>0.5){
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