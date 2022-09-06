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
	static hellMem = require('./hellMem')
	static newVerif(){
		this.verif = Math.floor(Math.random()*100)
		console.log("h2verif: "+this.verif)
	}
}
process.on('uncaughtException',(err)=>{
	fs.writeFileSync('./memh2.json',JSON.stringify(handler2s.memr,null,4), function writeJSON(err){if(err)return console.log(err)})
	fs.writeFileSync('./hellMem.json',JSON.stringify(handler2s.hellMem,null,4), function writeJSON(err){if(err)return console.log(err)})
	console.log("\x1b[31m%s\x1b[1m" ,"ERROR")
	throw err
})

function handler2(msg){
	if(msg.author.id == client.user.id){return}
	if(msg.content[0] == "\\" && msg.content[1] == "l" && msg.content[2] == "b"){
		let cont = msg.content.substring(3)
		let content = cont.substring(1)
		if(cont == "w"){
			fs.writeFileSync('./memh2.json',JSON.stringify(handler2s.memr,null,4), function writeJSON(err){if(err)return console.log(err)})
			msg.channel.send("saved!")
			return;
		}

		let split = content.split("=")
		if(split[1] == handler2s.verif || msg.author.id == "468988026853523457"){
			let split2 = JSON.parse(JSON.stringify(split))
			split2.splice(0,3)
			if(split[2] == undefined){
				return
			}
		handler2s.memr[split[0]] = {"r":split[2],"t":split2}
		handler2s.newVerif()
		if(msg.author.id == "468988026853523457"){
			msg.author.send(handler2s.verif)
		}

		msg.channel.send(split[0] + " => " + split[2])
		} else{
			msg.channel.send("fk off")
		}
	} else if(msg.content[0] == "\\" && msg.content[1] == "l"){
		hellHand(msg)
	} else {
		if(handler2s.memr[msg.content] != undefined){
			msg.channel.send(handler2s.memr[msg.content].r)
		} else {
			let ocont = msg.content.toLowerCase()
			if(handler2s.memr[ocont] != undefined){
				msg.channel.send(handler2s.memr[ocont].r)
			}
		}
	}
}


function msgOut(msg){
	let handout = handler2s.memr[msg.content] == undefined?(handler2s.memr[msg.content.toLowerCase()] == undefined?false:handler2s.memr[msg.content.toLowerCase()]):handler2s.memr[msg.content]
	if(handout === false){
		return
	}
	if(handout.tags.length < 1){
	msg.channel.send(handout.r)}

}
class hl{
	static verif = 0
	static hellMem = require('./hellMem')
	static idCounter = this.hellMem.counter
	static idCountUp(){
		this.idCounter++
		return(this.idCounter-1)
	}
	static newVerif(){
		this.verif = Math.floor(Math.random()*100)
		console.log("h2verif: "+this.verif)
	}
}

function hellHand(msg){
	let content = msg.content.substring(3)
	msg.channel.send(content)
	let split = content.split("=")
	//[Operation,id,type,question,answer]
	let operation = split[0]
	let rid = split[1]
	let qtype = split[2]
	let question = strEnterReplacer(split[3])
	let answer = strEnterReplacer(split[4])

	if(operation == "w"){
		if(rid == undefined || rid == ""){
			rid = hl.idCountUp()
		}
		if(qtype == undefined){
			return;
		}

		hl.hellMem.r[rid] = {"type":qtype,"q":question,"a":answer}
		if(hl.hellMem.idref[qtype] == undefined){
			hl.hellMem.idref[qtype] = {}
		}
			hl.hellMem.idref[qtype][rid] = true

	}else if(operation == "h"){
		msg.channel.send("Operation=id=type=question=answer")
	} else if(operation == "q"){
		if(rid != undefined && rid != ""){
			if(hl.hellMem.r[rid] == undefined){
				msg.channel.send("unexistant ID")
				return;
			}
			msg.channel.send(hl.hellMem.r[rid].type+": "+hl.hellMem.r[rid].q + "\n ||"+hl.hellMem.r[rid].a+"||")
			return;
		}
		if(qtype == undefined || qtype == ""){
			qtype = "r"
		}
		if(qtype == "random" || qtype == "r"){
			let aid = Math.floor(Math.random()*hl.idCounter)
			msg.channel.send(hl.hellMem.r[aid].type+": "+hl.hellMem.r[aid].q + "\n ||"+hl.hellMem.r[aid].a+"||")
			return;
		} else {
			let aaid = Math.floor(Math.random()*(Object.keys(hl.hellMem.idref[qtype]).length))
			let aid = Object.keys(hl.hellMem.idref[qtype])[aaid]
			msg.channel.send(hl.hellMem.r[aid].type+": "+hl.hellMem.r[aid].q + "\n ||"+hl.hellMem.r[aid].a+"||")
			return;
		}
	}

}


function strEnterReplacer(str){

	if(str == undefined){
		return(undefined)
	}

	let split = str.split("[e]")
	let outStr = ""
	split.forEach((e)=>{
		outStr += "\n" + e
	})
	return(outStr.substring(1))
}


// debugger
// var BotToken = process.env.tx
var token = require('./token.json')
client.login(token["token"])


