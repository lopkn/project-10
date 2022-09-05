var discord = require('discord.js');
const fs = require('fs');
var client = new discord.Client();

var prefix = "/lb"
var MODE = "normal"






client.once('ready', () => {
	console.log('online')
	// console.log(joiner.join1(["egage","eat"]))

})
client.on('message', (e)=>{handler2(e)});



class handler2s{
	static verif = 0
	static memr = require('./memh2')
	static newVerif(){
		this.verif = Math.floor(Math.random()*100)
		console.log("h2verif: "+this.verif)
	}
}
process.on('uncaughtException',(err)=>{
	fs.writeFileSync('./memh2.json',JSON.stringify(handler2s.memr,null,4), function writeJSON(err){if(err)return console.log(err)})
	console.log("\x1b[31m%s\x1b[1m" ,"ERROR")
	throw err
})

function handler2(msg){
	if(msg.author.id == client.user.id){return}
	if(msg.content[0] == "\\" && msg.content[1] == "l" && msg.content[2] == "b"){
		let cont = msg.content.substring(3)
		let content = cont.substring(1)
		if(cont == "write"){
			fs.writeFileSync('./memh2.json',JSON.stringify(handler2s.memr,null,4), function writeJSON(err){if(err)return console.log(err)})
			msg.channel.send("saved!")
			return;
		}

		let split = content.split("=")
		if(split[1] == handler2s.verif){
		handler2s.memr[split[0]] = split[2]
		handler2s.newVerif()
		msg.channel.send(split[0] + " => " + split[2])
		} else{
			msg.channel.send("fk off")
		}
	} else {
		if(handler2s.memr[msg.content] != undefined){
			msg.channel.send(handler2s.memr[msg.content])
		} else {
			let ocont = msg.content.toLowerCase()
			if(handler2s.memr[ocont] != undefined){
				msg.channel.send(handler2s.memr[ocont])
			}
		}
	}
}



// debugger
// var BotToken = process.env.tx
var token = require('./token.json')
client.login(token["token"])


