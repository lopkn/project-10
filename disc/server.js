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
		setTimeout(()=>{this.counter--},10000)
	}
}


function handler2(msg){

	if(msg.author.id == client.user.id){return}

		if(hasEmoji(msg.content)){
			msg.delete()
			if(emojisdeleter.counter <= 2){
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
	} else if(msg.content[0] == "\\" && msg.content[1] == "p"){
		pokerHand(msg)
	} else if(msg.content[0] == "\\" && msg.content[1] == "m"){
		msgHand(msg)
	}else {
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
			msg.channel.send("wrote at ["+rid+"]")

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


// function hasEmoji(str) {
//     var ranges = [
//         '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])' // U+1F680 to U+1F6FF
//     ];
//     if (str.match(ranges.join('|'))) {
//         return true;
//     } else {
//         return false;
//     }
// }
function hasEmoji(str){
  return(/\p{Extended_Pictographic}/u.test(str))
}
function cns(msg,str){
	if(str != undefined){
		msg.channel.send(str).catch(()=>{})
	}	
}

function strReplacer(str,a,b){

	if(str == undefined){
		return(undefined)
	}

	let split = str.split(a)
	let outStr = ""
	split.forEach((e)=>{
		outStr += b + e
	})
	return(outStr.substring(b.length))
}

function strEnterReplacer(str){
	return(strReplacer(strReplacer(str,"{i}","="),"{e}","\n"))
}


class PDEK{

	static deck = [{"id":0,"name":"ace of diamonds","house":[0,"diamonds"],"number":[0,"ace"],"folded":false},{"id":1,"name":"ace of clubs","house":[1,"clubs"],"number":[0,"ace"],"folded":false},{"id":2,"name":"ace of hearts","house":[2,"hearts"],"number":[0,"ace"],"folded":false},{"id":3,"name":"ace of spades","house":[3,"spades"],"number":[0,"ace"],"folded":false},{"id":4,"name":"2 of diamonds","house":[0,"diamonds"],"number":[1,2],"folded":false},{"id":5,"name":"2 of clubs","house":[1,"clubs"],"number":[1,2],"folded":false},{"id":6,"name":"2 of hearts","house":[2,"hearts"],"number":[1,2],"folded":false},{"id":7,"name":"2 of spades","house":[3,"spades"],"number":[1,2],"folded":false},{"id":8,"name":"3 of diamonds","house":[0,"diamonds"],"number":[2,3],"folded":false},{"id":9,"name":"3 of clubs","house":[1,"clubs"],"number":[2,3],"folded":false},{"id":10,"name":"3 of hearts","house":[2,"hearts"],"number":[2,3],"folded":false},{"id":11,"name":"3 of spades","house":[3,"spades"],"number":[2,3],"folded":false},{"id":12,"name":"4 of diamonds","house":[0,"diamonds"],"number":[3,4],"folded":false},{"id":13,"name":"4 of clubs","house":[1,"clubs"],"number":[3,4],"folded":false},{"id":14,"name":"4 of hearts","house":[2,"hearts"],"number":[3,4],"folded":false},{"id":15,"name":"4 of spades","house":[3,"spades"],"number":[3,4],"folded":false},{"id":16,"name":"5 of diamonds","house":[0,"diamonds"],"number":[4,5],"folded":false},{"id":17,"name":"5 of clubs","house":[1,"clubs"],"number":[4,5],"folded":false},{"id":18,"name":"5 of hearts","house":[2,"hearts"],"number":[4,5],"folded":false},{"id":19,"name":"5 of spades","house":[3,"spades"],"number":[4,5],"folded":false},{"id":20,"name":"6 of diamonds","house":[0,"diamonds"],"number":[5,6],"folded":false},{"id":21,"name":"6 of clubs","house":[1,"clubs"],"number":[5,6],"folded":false},{"id":22,"name":"6 of hearts","house":[2,"hearts"],"number":[5,6],"folded":false},{"id":23,"name":"6 of spades","house":[3,"spades"],"number":[5,6],"folded":false},{"id":24,"name":"7 of diamonds","house":[0,"diamonds"],"number":[6,7],"folded":false},{"id":25,"name":"7 of clubs","house":[1,"clubs"],"number":[6,7],"folded":false},{"id":26,"name":"7 of hearts","house":[2,"hearts"],"number":[6,7],"folded":false},{"id":27,"name":"7 of spades","house":[3,"spades"],"number":[6,7],"folded":false},{"id":28,"name":"8 of diamonds","house":[0,"diamonds"],"number":[7,8],"folded":false},{"id":29,"name":"8 of clubs","house":[1,"clubs"],"number":[7,8],"folded":false},{"id":30,"name":"8 of hearts","house":[2,"hearts"],"number":[7,8],"folded":false},{"id":31,"name":"8 of spades","house":[3,"spades"],"number":[7,8],"folded":false},{"id":32,"name":"9 of diamonds","house":[0,"diamonds"],"number":[8,9],"folded":false},{"id":33,"name":"9 of clubs","house":[1,"clubs"],"number":[8,9],"folded":false},{"id":34,"name":"9 of hearts","house":[2,"hearts"],"number":[8,9],"folded":false},{"id":35,"name":"9 of spades","house":[3,"spades"],"number":[8,9],"folded":false},{"id":36,"name":"10 of diamonds","house":[0,"diamonds"],"number":[9,10],"folded":false},{"id":37,"name":"10 of clubs","house":[1,"clubs"],"number":[9,10],"folded":false},{"id":38,"name":"10 of hearts","house":[2,"hearts"],"number":[9,10],"folded":false},{"id":39,"name":"10 of spades","house":[3,"spades"],"number":[9,10],"folded":false},{"id":40,"name":"jack of diamonds","house":[0,"diamonds"],"number":[10,"jack"],"folded":false},{"id":41,"name":"jack of clubs","house":[1,"clubs"],"number":[10,"jack"],"folded":false},{"id":42,"name":"jack of hearts","house":[2,"hearts"],"number":[10,"jack"],"folded":false},{"id":43,"name":"jack of spades","house":[3,"spades"],"number":[10,"jack"],"folded":false},{"id":44,"name":"queen of diamonds","house":[0,"diamonds"],"number":[11,"queen"],"folded":false},{"id":45,"name":"queen of clubs","house":[1,"clubs"],"number":[11,"queen"],"folded":false},{"id":46,"name":"queen of hearts","house":[2,"hearts"],"number":[11,"queen"],"folded":false},{"id":47,"name":"queen of spades","house":[3,"spades"],"number":[11,"queen"],"folded":false},{"id":48,"name":"king of diamonds","house":[0,"diamonds"],"number":[12,"king"],"folded":false},{"id":49,"name":"king of clubs","house":[1,"clubs"],"number":[12,"king"],"folded":false},{"id":50,"name":"king of hearts","house":[2,"hearts"],"number":[12,"king"],"folded":false},{"id":51,"name":"king of spades","house":[3,"spades"],"number":[12,"king"],"folded":false}] 
	static players = {}

	static table = []

	static channel = 0

	static shuffle(time){

		let endTime = time*1000+Date.now()

		while(Date.now() < endTime){
			let r1 = Math.floor(Math.random()*this.deck.length)
			let r2 = Math.floor(Math.random()*this.deck.length)

			let c1 = JSON.parse(JSON.stringify(this.deck[r1]))
			let c2 = JSON.parse(JSON.stringify(this.deck[r2]))

			this.deck[r1] = c2
			this.deck[r2] = c1

		}

	}

	static hasCard(arrCard,id){

		if(id[0] == "f" || id[0] == "F"){
			let aid = parseInt(id.substring(1))
			if(isNaN(aid) || aid < 0){return(false)}

			let r = false
			let foldCount = 0
			arrCard.forEach((e,i)=>{
				if(e.folded){
					foldCount++
					if(foldCount==aid){
						r = [true,e,i]
					}
				}
			})
			return(r)
		}

		let r = false
		arrCard.forEach((e,i)=>{
			if(e.id == id){
				r = [true,e,i]
			}
		})
		return(r)
	}

	static newObject(o){
		return(JSON.parse(JSON.stringify(o)))
	}
	static unfold(o){
		o.folded = false
		return(o)
	}

}


function pokerHand(msg){

	let content = msg.content.substring(3)
	let split = content.split(" ")

	if(PDEK.channel === 0){
		PDEK.channel = msg.channel
		msg.channel.send("set as main channel")
	}

	if(split[0] == "join" && split[1] != undefined && split[1] != ""){
		if(PDEK.players[msg.author.id] != undefined){
			cns(msg,"you already joined, changing your name.")
			PDEK.players[msg.author.id].name = split[1]
		} else {
			cns(msg,"joining as player "+split[1])
			PDEK.players[msg.author.id] = {"name":split[1],"id":msg.author.id,"cards":[]}
		}
	}

	if(split[0] == "shuffle"){
		msg.channel.send("shuffled for 3 seconds")
		PDEK.shuffle(3)
	}else if(split[0] == "channel"){
		if(PDEK.channel !== 0){
			PDEK.channel.send("switching main channel!")
		}
		PDEK.channel = msg.channel
		msg.channel.send("main channel switched here!")
	}

	//player join needed
	if(PDEK.players[msg.author.id] == undefined){
		return;
	}
	let P = PDEK.players[msg.author.id]
	let D = PDEK.deck
	if(split[0] == "draw"){

		let no = 1
		if(!isNaN(parseInt(split[1]))){
			no = parseInt(split[1])
		}


		let CAN = 0
		if(no > 1){
			let aout = ""
			for(let i = 0; i < no; i++){
					let cardno = D.length-1
					if(cardno == 0){
						aout += "No more cards in deck \n"
						CAN++
						continue;
					}
					P.cards.push(D[cardno])
					aout += "Drew card: "+PDEK.deck[cardno].name +" <= "+PDEK.deck[cardno].id+ "\n"
					PDEK.deck.splice(cardno,1)
				}
				msg.author.send(aout)
			} else {
				let cardno = D.length-1
				if(cardno == 0){
					msg.author.send("No more cards in deck")
					CAN++
						
				} else {
					P.cards.push(D[cardno])
					msg.author.send("Drew card: "+PDEK.deck[cardno].name +" <= "+PDEK.deck[cardno].id)
					PDEK.deck.splice(cardno,1)
				}
			}
			PDEK.channel.send(PDEK.players[msg.author.id].name + " drew "+no+" cards from the deck")
			if(CAN > 0){
				PDEK.channel.send(PDEK.players[msg.author.id].name + " had "+CAN+" cards cancelled from empty deck draw")
			}
		}

		////DRAWF-==========================================
		 else if(split[0] == "drawf"){

		let no = 1
		if(!isNaN(parseInt(split[1]))){
			no = parseInt(split[1])
		}


		let CAN = 0
		if(no > 1){
			let aout = ""
			for(let i = 0; i < no; i++){
					let cardno = D.length-1
					if(cardno == 0){
						aout += "No more cards in deck \n"
						CAN++
						continue;
					}
					P.cards.push(D[cardno])
					let fno = 1
					P.cards.forEach((e)=>{
						if(e.folded){
							fno += 1
						}
					})
					aout += "Drew card: folded <= f"+fno+ "\n"
					P.cards[P.cards.length-1].folded = true
					PDEK.deck.splice(cardno,1)
				}
				msg.author.send(aout)
			} else {
				let cardno = D.length-1
				if(cardno == 0){
					msg.author.send("No more cards in deck")
					CAN++
						
				} else {
					let fno = 1
					P.cards.forEach((e)=>{
						if(e.folded){
							fno += 1
						}
					})
					P.cards.push(D[cardno])
					P.cards[P.cards.length-1].folded =true
					msg.author.send("Drew card: folded <= f"+fno)
					PDEK.deck.splice(cardno,1)
				}
			}
			PDEK.channel.send(PDEK.players[msg.author.id].name + " drew "+no+" folded cards from the deck")
			if(CAN > 0){
				PDEK.channel.send(PDEK.players[msg.author.id].name + " had "+CAN+" cards cancelled from empty deck draw")
			}
		}
	if(split[0] == "show"){
		let out = ''
		let foldedno = 1
		P.cards.forEach((e)=>{
			if(!e.folded){
				out += e.id + " => " + e.name+"\n"
			} else {
				out += "f"+foldedno+" => folded\n"
				foldedno++
			}
		})
		msg.author.send("===CARDS===\n"+out)
	} else if(split[0] == "put"){
		let c = PDEK.hasCard(P.cards,split[1])
		if(c === false){
			msg.author.send("you dont have that card")
			// try{msg.delete()}catch{}
		} else {
			PDEK.table.unshift(PDEK.newObject(c[1]))
			P.cards.splice(c[2],1)
			if(!c[1].folded){
				PDEK.channel.send("new card on table: "+c[1].name+" by "+P.name)
			} else {
				PDEK.channel.send("new folded card on table by: " + P.name)
			}
		}


	} else if(split[0] == "current" || split[0] == "table"){
		let aout = ""
		let mx = 5
		let t = PDEK.table
		for(let i = 0; i < mx; i++){
			if(t[i] != undefined){
				if(!t[i].folded){
				aout += i+" => "+t[i].name+"\n"} else {
					aout += i+" => folded"
				}
			}
		}
		msg.channel.send("===TABLE===\n"+aout)
	} else if(split[0] == "deck"){
		let c = PDEK.hasCard(P.cards,split[1])
		if(c === false){
			msg.author.send("you dont have that card")
		} else {
			PDEK.deck.unshift(PDEK.unfold(PDEK.newObject(c[1])))
			P.cards.splice(c[2],1)
			PDEK.channel.send("a card was put in deck by: "+PDEK.players[msg.author.id].name)
			if(c[1].folded){
				msg.author.send("you put a folded card to the deck")
			} else {
			msg.author.send("you put your ["+c[1].name+"] to the deck")}
		}

	} else if(split[0] == "fold"){
		let c = PDEK.hasCard(P.cards,split[1])
		if(c === false){
			msg.author.send("you dont have that card")
		} else {
			P.cards[c[2]].folded = !P.cards[c[2]].folded
			if(P.cards[c[2]].folded){
			msg.author.send("you folded ["+split[1]+"]")
			PDEK.channel.send(P.name+" folded a card")
			} else {
				msg.author.send("you unfolded ["+P.cards[c[2]].name+" <= "+P.cards[c[2]].id+"]")
				PDEK.channel.send(P.name+" unfolded a card")
			}
		}
	} else if(split[0] == "take" || split[0] == "grab"){
		let c = []
		if(PDEK.table.length < 1){
			cns(msg,"theres no cards on the table!")
		} else {if(PDEK.table[split[1]] != undefined){
			c = [true,PDEK.table[split[1]],split[1]]
		} else {
			c = [true,PDEK.table[0],0]
		}

		P.cards.push(PDEK.newObject(c[1]))
		if(!c[1].folded){
			msg.author.send("you got "+c[1].name+" from the table")
		} else {
			msg.author.send("you got a folded card from the table")
		}
		PDEK.table.splice(c[2],1)
		PDEK.channel.send(P.name + " took the card ["+c[2]+"] from the table")
	}
	} else if(split[0] == "reorg"){
		let n = []
		while(P.cards.length > 0){
			let nc = PDEK.newObject(P.cards[0])
			P.cards.splice(0,1)

			if(nc.folded){
				n.unshift(nc)
			} else {
				let done = true
				let counter = 0
				while(done){
					if(counter == n.length){
						n.push(nc)
						done = false
					} else if(n[counter].id < nc.id && !n[counter].folded){
						n.splice(counter,0,nc)
						done = false
					}
					counter++
				}

			}

		}
		P.cards = n
		msg.channel.send("reorganized your cards!")
	}


}

function msgHand(msg){
	
}

// debugger
// var BotToken = process.env.tx
var token = require('./token.json')
client.login(token["token"])


