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
	fs.writeFileSync('./hellMem.json',JSON.stringify(hl.hellMem,null,4), function writeJSON(err){if(err)return console.log(err)})
	console.log("\x1b[31m%s\x1b[1m" ,"ERROR")
	throw err
})
class emojisdeleter{
	static counter = 0
	static newEmojiDelete(){
		this.counter++
		setTimeout(()=>{this.counter--},30000)
	}
}


function handler2(msg){

	if(msg.author.id == client.user.id){return}

		if(hasEmoji(msg.content)){
			msg.delete()
			if(emojisdeleter.counter <= 3){
				emojisdeleter.newEmojiDelete()
				try{cns(msg,"No. Emojis.")}catch{}
			}
			return;
		}

	if(msg.content[0] == "\\" && msg.content[1] == "l" && msg.content[2] == "b"){
		let cont = msg.content.substring(3)
		let content = cont.substring(1)
		if(cont == "w"){
			fs.writeFileSync('./memh2.json',JSON.stringify(handler2s.memr,null,4), function writeJSON(err){if(err)return console.log(err)})
			fs.writeFileSync('./hellMem.json',JSON.stringify(hl.hellMem,null,4), function writeJSON(err){if(err)return console.log(err)})
			cns(msg,"saved!")
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

		cns(msg,split[0] + " => " + split[2])
		} else{
			cns(msg,"fk off")
		}
	} else if(msg.content[0] == "\\" && msg.content[1] == "l"){
		hellHand(msg)
	} else {
		if(handler2s.memr[msg.content] != undefined){
			cns(msg,handler2s.memr[msg.content].r)
		} else {
			let ocont = msg.content.toLowerCase()
			if(handler2s.memr[ocont] != undefined){
				cns(msg,handler2s.memr[ocont].r)
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
	cns(msg,handout.r)}

}
class hl{
	static verif = 0
	static hellMem = require('./hellMem')
	static idCountUp(){
		this.hellMem.counter++
		return(this.hellMem.counter-1)
	}
	static newVerif(){
		this.verif = Math.floor(Math.random()*100000)
		console.log("hl2verif: "+this.verif)
	}
}
hl.newVerif()

function hellHand(msg){

	let content = msg.content.substring(3)
	cns(msg,content)
	let split = content.split("=")
	//[Operation,id,type,question,answer]
	let operation = split[0]
	let rid = split[1]
	let qtype = split[2]
	let question = strEnterReplacer(split[3])
	let answer = strEnterReplacer(split[4])

	if(operation == "w"){
		if(split[5] != hl.verif && msg.author.id != "468988026853523457"){
			cns(msg,"No.")
			return
		}
		if(split[5] == hl.verif){
			hl.newVerif()
		}
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

	} else if(operation == "log"){
		cns(msg.content)
		console.log(msg.content,msg.content==":ninja:")
	}else if(operation == "h"){
		cns(msg,"Operation=id=type=question=answer")
	} else if(operation == "q"){
		if(rid != undefined && rid != ""){
			if(hl.hellMem.r[rid] == undefined){
				cns(msg,"unexistant ID")
				return;
			}
			cns(msg,rid+"-"+hl.hellMem.r[rid].type+": "+hl.hellMem.r[rid].q + "\n ||"+hl.hellMem.r[rid].a+"||")
			return;
		}
		if(qtype == undefined || qtype == ""){
			qtype = "r"
		}
		if(qtype == "random" || qtype == "r"){
			let aid = Math.floor(Math.random()*hl.hellMem.counter)
			cns(msg,aid+"-"+hl.hellMem.r[aid].type+": "+hl.hellMem.r[aid].q + "\n ||"+hl.hellMem.r[aid].a+"||")
			return;
		} else {
			let aaid = Math.floor(Math.random()*(Object.keys(hl.hellMem.idref[qtype]).length))
			let aid = Object.keys(hl.hellMem.idref[qtype])[aaid]
			cns(msg,aid+"-"+hl.hellMem.r[aid].type+": "+hl.hellMem.r[aid].q + "\n ||"+hl.hellMem.r[aid].a+"||")
			return;
		}
	} else if(operation == "s"){
		hl.hellMem.suggestions.push([msg.author.id,msg.author.username,rid])
		cns(msg,msg.author.username + " S=> " + rid)
	} else if(operation == "rs"){
		if(rid == undefined || rid == ""){
			if(hl.hellMem.suggestions[hl.hellMem.suggestions.length-1] == undefined){return}
			cns(msg,hl.hellMem.suggestions[hl.hellMem.suggestions.length-1])
		} else if(rid == "r"){
			if(split[2] != hl.verif && msg.author.id != "468988026853523457"){
				return;
			}
			hl.hellMem.suggestions.splice(hl.hellMem.suggestions.length-1,1)
		} else {
			if(!isNaN(parseInt(rid))){
				cns(msg,hl.hellMem.suggestions[hl.hellMem.suggestions.length-1-parseInt(rid)])
			}
		}
	}

}


function hasEmoji(str) {
    var ranges = [
        '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
    ];
    if (str.match(ranges.join('|'))) {
        return true;
    } else {
        return false;
    }
}

function cns(msg,str){
	if(str != undefined){
		msg.channel.send(str).catch(()=>{})
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


