//////////////////////////////////////////////////// ARGAUG

let io;
class ArgAug{
	static logger = []

	// static storage = {
	// 	"main":{},
	// 	"opt":{},
	// 	"Smain":{},
	// 	"Sopt":{}
	// }

	static storage = require("./argstorage")

	static keyholders = {}


	static save(){
		fs.writeFileSync('./argstorage.json',JSON.stringify(this.storage,null,4), function writeJSON(err){if(err)return console.log(err)})
	}


	static handle(time,request,content,socket){
		this.logger.push([time,request,content])

		// io.to(socket.id).emit("string","acknowledged request:"+request)

		if(request === "mem"){
			if(this.storage.main[content] !== undefined){
				io.to(socket.id).emit("mem",[content,this.storage.main[content]])
			} else {
				io.to(socket.id).emit("string","couldnt load tag "+content)
			}
		} else if(request === "req"){
			if(content.type == "v2"){
				let c = content.cont
				if(this.storage.Smain[c.path] == undefined){
					this.storage.Smain[c.path] = []
				}

				this.storage.Smain[c.path].push(c)

				if(this.keyholders[socket.id] == true){
					this.mergeSmainV2(c.path,this.storage.Smain[c.path].length-1)
				}

			} else {
				this.storage.Smain["rnd-"+Date.now()] = content.cont
			}
		} else if(request === "save"){
			this.save()
		} else if(request === "disconnect"){
			this.disconnect(socket,content)
		}

	}

	static mergeSmainV2(path,i){
		let c = this.storage.Smain[path][i]

		let t = this.getNewID()

		let d = {
			"optTitle":c.option,
			"tags":[t],
		}

		this.storage.main[t] = {
			"title":c.title,
			"description":c.description,
			"options":[]
		}

		this.storage.main[path].options.push(d)

		this.storage.Smain[path].splice(i,1)
	}

	static getNewID(){
		return(this.storage.counter++)
	}
}

//////////////////////////////////////////////////// ARGAUG END
//////////////////////////////////////////////////// ArgAccel


class ArgAccel{
	static keyholders = {"accel":true}

	static msgid = 0
	// static msghist = {}

	static rooms = {"Lobby":{"name":"Lobby","msghist":{},"msghistArr":[],"settings":{"max":50},"connectedSockets":{},"triggers":{"stringTrigger":{}}}}

	static addRoom(name){
		this.rooms[name] = {
			"name":name,
			"msghist":{},
			"msghistArr":[],
			"settings":{"max":50},
			"connectedSockets":{},
			"triggers":{"stringTrigger":{}}
		}
	}

	static setio(i){
		io = i
	}


	static accounts = {}

	static loginWithName(socket,name,psswd){
		if(this.accounts[name] !== undefined){
			let hashPsswd = crypto.createHash("sha256").update(psswd?psswd:"").digest("hex")
			if(this.accounts[name].temporaryAccount||hashPsswd == this.accounts[name].psswd ){
				socket.loggedin = name
				if(this.accounts[name].currentSocketID){
					this.dsMessage("you have logged in elsewhere, your session has ended",{id:this.accounts[name].currentSocketID})
				}
				this.accounts[name].currentSocketID = socket.id
				this.dsMessage("logged in as "+name,socket)
			} else {
				this.dsMessage("wrong password for "+name,socket)
			}
		} else {
			if(psswd != "" && psswd != undefined){
				let hashPsswd = crypto.createHash("sha256").update(psswd).digest("hex")
				let acc = {"name":name,"psswd":hashPsswd,"currentSocketID":socket.id,"temporaryAccount":false}
				this.accounts[name] = acc
				socket.loggedin = name
				this.dsMessage("logged in as "+name,socket)
			} else {
				let acc = {"name":name,"currentSocketID":socket.id,"temporaryAccount":true}
				this.accounts[name]=acc
				socket.loggedin = name
				this.dsMessage("logged in as "+name,socket)
			}
		}
	}

	static nameof(socket){
		if(socket.isBot){return(socket.id)}
		return(this.accounts[socket.loggedin].name)
	}

	static disconnect(socket,rsn){
		if(!socket.closed){
			socket.disconnect(true)
			socket.closed = true
		}
	}


	static decompileRoom(text){
		while(text[0] !== "#"){
			text = text.substring(1)
		}
		if(text.substring(0,6)=="#accel"){
			text = text.split("\n").slice(1).join("\n")
			let split = text.split("[")
			let result = {}
			split.forEach((e)=>{
				if(e == ""){return}
				let sep = e.split("] ")
				let id = e[0]
				let content = sep.slice(1).join("] ")
				if(result[id]){throw(new Error)}
				result[id] = {"content":content,"title":"","options":[],"citations":[]}
				if(content[content.length-1] == "\n"){content=content.slice(0,-1)}
				if(content[0] == "\n"){content=content.substring(1)}
				let lines = content.split("\n")

				let mode = "title"
				lines.forEach((a)=>{
					if(a.substring(0,4) == "&gt;"){
						mode = "options"
						let optionsplit = a.split("&gt;")
						let option = {"text":optionsplit[2],"reference":optionsplit[1]}
						result[id].options.push(option)
					}
					if(a.substring(0,6) == "#link " || a.substring(0,6) == "#cite "){
						mode = "options"
						let citation = a.substring(6)
						let cite = {"citation":"/cite -1 "+citation}
						result[id].citations.push(cite)

					}
					if(mode == "title"){
						result[id].title += a + "\n"
					}
				})
				if(result[id].title[result[id].title.length-1]=="\n"){result[id].title=result[id].title.slice(0,-1)}

			})
			return(result)
		}
		return("incompatible format")
	}


	static stringTrigger(stext,socket,aroom){


		let triggerDict = aroom.triggers.stringTrigger
		let ret = true

		if(triggerDict[stext]!==undefined){
			ret = triggerDict[stext](stext,socket,aroom)

		}

		return false
	}

	static handle(date,name,content,socket){

		let ihtml = content.ihtml
		let txt = content.txt
		let room = content.room

		if(this.rooms[room] == undefined){
			room = "Lobby"
		}


		if(txt.length == 0){return}
		ihtml = ihtml.replaceAll("&quot;","\"")
		ihtml = ihtml.replaceAll("<br>","\n")
		txt = txt.replaceAll("<","&lt;")
		txt = txt.replaceAll(">","&gt;")
		ihtml = ihtml.replaceAll("<","&lt;")
		ihtml = ihtml.replaceAll(">","&gt;")

		let processed = this.ihtmlProcess(ihtml,txt,room,socket)
		console.log("processed")
		console.log(processed)
		if(name == "msg"){

			if(!socket.loggedin){
				if(txt.split(" ")[0] == "/login"){
					this.loginWithName(socket,txt.split(" ")[1],txt.split(" ")[2])
				} else {
					this.dsMessage("you are not logged in, do /login [name] <password>",socket)
					this.dsMessage("you will create a temporary account if no password is provided",socket)
				}
				return
			} ///logged in text




			if(txt[0] == "/"){
				this.command(date,txt,socket,room)
				return
			}

			let mid = this.message(date,socket,processed,room) //text is sent into room
		    if(this.stringTrigger(processed.stext,socket,this.rooms[room])=="return"){return}
			if(processed.desync){
				this.sMessage("Message ID: "+mid+" is desynced/corrupt",room)
			}
		}


	}

	static ihtmlProcess(str,cont,room,socket){
		console.log("str",str)
		let id = "normal"
		let out = ['']
		for(let i = 0; i < str.length; i++){
			let char = str[i]

			if(id == "normal"){

				if(char == "&"){
				if(str.substring(i+1,i+8) == "lt;span"){
					i+=7
					id = "spanAttr"
					out.push({"text":'',"attr":''})
					continue
				}
			}

			out[out.length-1] += char
			
			} else if(id == "spanAttr"){
				if(char == "&"){
					if(str.substring(i+1,i+4) == "gt;"){
						id = "inSpan"
						i+=3
						continue	
					}
				}
				out[out.length-1].attr += char


			} else if(id == "inSpan"){

				if(char == "&"){
					if(str.substring(i+1,i+13) == "lt;/span&gt;"){
						i+=12
						id = "normal"
						out.push('')
						continue
					}
				}
				out[out.length-1].text += char
			}

		}

		let stext = ''
		let ftext = ''
		let verifieds = {}
		out.forEach((e,i)=>{
			if(i%2==1){
				let attr = e.attr
				let outstr = ""
				let pushing = false
				for(let i = 0; i < attr.length; i++){
					if(attr[i] == "-"){
						if(pushing == false){							
							pushing = true
							continue
						} else {break}
					}
					if(pushing){
						outstr += attr[i]
					}
				}
				e.extractedAttr = outstr
				this.matchExtract(e,room)
				if(e.verified == true){
					stext += "<span class='verified referencer' refid='"+this.rooms[room].msghist[e.reference].senderId+"' ref='"+e.reference+"' onmouseover='refover(this)' onmouseout='refover(this,false)'>" + e.text + "</span>"
					verifieds[e.reference] = e.text
				} else {
				  stext += e.text
				}
				ftext +=e.text
			}else{
			 stext +=e
			 ftext +=e
			}
		})

		if(cont!=ftext){
			console.log("["+cont+"]","["+ftext+"]")
		}
		//text is the HTML text client sends
		//stext is the HTML text server sends back
		//ftext is the EXTRACTED TEXT server processed
		//str is the PLAINTEXT client sends
		return({"text":cont,"processed":out,"stext":stext,"desync":cont!=ftext,"verifieds":verifieds})
	}

	static matchExtract(e,room){
		let jstr = e.extractedAttr
		try{
		let j = JSON.parse(jstr)
			let msg = this.rooms[room].msghist[j.msgid]

			if(msg.canReference){
				let matches = msg.text.includes(e.text)
				if(matches){
					e.verified = true
					e.reference = j.msgid
				}
			}

			
		}catch(err){return(e)}
		
		return(e)
	}

	static accel(aroom,disp,socket){
		let main = aroom.triggers.accel
		if(!main.init){
			main.init = true
			main.current = disp = 0
			main.userHistories = {}
			aroom.triggers.stringTrigger['r'] = (a,socket)=>{this.accel(aroom,"r",socket)}
		}

		main.current = disp

		if(disp == -1){
			this.blockMessage(Date.now(),{"id":"accel","isBot":true},{"stext":"exited"},aroom.name)
			return;
		}

		if(main.userHistories[socket.id] == undefined){
			main.userHistories[socket.id] = []
		}
		if(disp == "r"){
			main.userHistories[socket.id].pop()
			if(main.userHistories[socket.id].length==0){return}
			main.current = main.userHistories[socket.id][main.userHistories[socket.id].length-1]
		} else {
			main.userHistories[socket.id].push(disp) 
		}

		this.blockMessage(Date.now(),{"id":"accel","isBot":true},{"stext":"<span style='color:white'>"+main[main.current].title+"</span>"},aroom.name)
		let block = main[main.current]
		block.citations.forEach((e,i)=>{
			this.command(Date.now,e.citation,{"id":"accel","isBot":true},aroom.name)
		})
		let maxoptions=0
		block.options.forEach((e,i)=>{
			maxoptions=i
			this.blockMessage(Date.now(),{"id":"accel","isBot":true},{"stext":i+" > "+e.text},aroom.name)
			aroom.triggers.stringTrigger[i] = (a,socket)=>{this.accel(aroom,e.reference,socket)}
		})
		if(block.options.length==0){
			this.blockMessage(Date.now(),{"id":"accel","isBot":true},{"stext":"r > Back"},aroom.name)
			maxoptions=-1
		}
		while(aroom.triggers.stringTrigger[maxoptions+1]){
			delete aroom.triggers.stringTrigger[maxoptions+1]
			maxoptions+=1
		}


	}

	static command(date,content,socket,room){
		let su = false
		if(this.keyholders[socket.id]){su = true}
		let split = content.substring(1).split(" ")
		let aroom = this.rooms[room]
		let s1 = split[0]
			if(su){
				if(s1 == "smsg"){
					this.sMessage(content.substring(5),room)
				} else if(s1 == "crash"){
					throw(new Error)
				} else if(s1 == "settings"){
					if(split[1] == "replyonly"){
						aroom.settings.replyonly = aroom.settings.replyonly?false:true
						this.sMessage("room settings replyonly = "+aroom.settings.replyonly,room)
					} else if(split[1] == "max"){
						aroom.settings.max = Number(split[2])
						if(isNaN(aroom.settings.max)){aroom.settings.max = 50}
						this.sMessage("room settings max = "+aroom.settings.max,room)

					}
				} else if(s1 == "decompile"){
					let rm = this.decompileRoom(split.splice(1).join(" "))
					aroom.triggers.accel = rm
					this.accel(aroom,0,socket)
				}
			}

			    if(s1 == "thisroom"){
					this.dsMessage("your current room is: "+room,socket)
				} else if(s1 == "joinroom"){
					this.joinroom(split,room,socket)
				} else if(s1 == "lobby"){
					this.joinroom(["join","Lobby"],room,socket)
				} else if(s1 == "topic"){
					if(split[1]){
						if(aroom.topic == undefined){
							aroom.topic = content.substring(7)

							aroom.conflict = [{"conflict":content.substring(7),"msg":aroom.msghistArr.length-1}]
							this.sMessage("The room's topic has been set to: "+aroom.topic,room)
						} else {
							this.dsMessage("The room's topic is already set to: "+aroom.topic,socket)
						}
					} else {
						if(this.rooms[room].topic == undefined){
						this.dsMessage("Current room topic is unset",socket)
						}else{
						this.dsMessage("Current topic is: "+aroom.topic,socket)
						this.dsMessage("Current conflit is: "+aroom.conflict,socket)
						}
					}
				} else if(s1 == "flag" || s1 == "flags"){

					if(split[1] !== "" && split[1] !== undefined){
						if(aroom.msghist[split[1]] == undefined){return}
					}

					let msg = this.isMessage(split[1],aroom)?aroom.msghist[split[1]]:this.latestMessage(aroom)
					let flagstr = ''
					if(!msg.canReference){return}
					if(split[2]){
						let reason = content.substring(8+split[2].length+split[1].length)
						let reasonString = (reason == ''?'':" because "+reason)
						// this.sMessage(this.nameof(socket)+"<span style='color:pink'> flagged ["+msg.msgid+"] as "+split[2]+reasonString+"</span>",room)
						let flag = split[2]+reasonString
						this.blockMessage(Date.now(),socket,{
							"stext":this.nameof(socket)+" flagged ["+msg.msgid+"] as "+flag
						},room)

						msg.flags[split[2]] = {"flagid":socket.id,"resolved":false,"reason":reason}
					} else {

						Object.keys(msg.flags).forEach((e)=>{
							flagstr += ", " + e
						})

						this.dsMessage("Flags for ["+msg.msgid+"] => "+flagstr.substring(2),socket)
					}
				} else if(s1 == "cite"){
					let msg = this.isMessage(split[1],aroom)?aroom.msghist[split[1]]:this.latestMessage(aroom)
					
					let citestr = ''
					if(split[1] == -1){
						if(split[2].substring(0,8)=="https://"){split[2]=split[2].substring(8)}
						let citation = "<span style='color:SlateBlue'><a target='_blank' rel='noopener noreferrer' href='//"+split[2]+"'>"+split[2]+"</a></span>"+content.substring(7+split[1].length+split[2].length)
						this.blockMessage(Date.now(),socket,{
							"stext":this.nameof(socket)+" cited with "+citation
						},room)
						return;
					}

					if(!msg.canReference){return}
					
					if(split[2]){
						if(split[2].substring(0,8)=="https://"){split[2]=split[2].substring(8)}
						let citation = "<span style='color:SlateBlue'><a target='_blank' rel='noopener noreferrer' href='//"+split[2]+"'>"+split[2]+"</a></span>"+content.substring(7+split[1].length+split[2].length)
						// this.sMessage(socket.id+" cited ["+msg.msgid+"] with "+citation,room)
						this.blockMessage(Date.now(),socket,{
							"stext":this.nameof(socket)+" cited ["+msg.msgid+"] with "+citation
						},room)
						msg.citations[Date.now()] = socket.id
					} else {

						Object.keys(msg.citations).forEach((e)=>{
							citestr += ", " + e
						})

						this.dsMessage("citations for ["+msg.msgid+"] => "+citestr.substring(2),socket)
					}
				} else if(s1 == "load" || s1=="loadlast"){
					let hist = Number.isInteger(parseInt(split[1]))?parseInt(split[1]):5
					for(let i = aroom.msghistArr.length-hist; i < aroom.msghistArr.length;i++){
						let msg = aroom.msghist[aroom.msghistArr[i]]
						if(msg == undefined){continue}
						io.to(socket.id).emit("msg",{"msg":msg.stext,"id":msg.senderId,"msgid":msg.msgid,"attr":msg.attributes})
					}
				} else if(s1 == "help"){
					this.dsMessage("/load \n /cite \n /flag \n /topic \n /lobby \n /joinroom \n /lobby",socket)
				}
			


	}

	static isMessage(id,room){
		return(room.msghist[id]?.type =="msg")
	}

	static latestMessage(room){
		for(let i = room.msghistArr.length-1;i>-1;i--){
			if(room.msghist[room.msghistArr[i]].type == "msg"){
				return(room.msghist[room.msghistArr[i]])
			}
		}
	}

	static joinroom(split,room,socket){
		if(this.rooms[split[1]]){
			let objk = Object.keys(this.rooms[split[1]].connectedSockets)
			if(this.rooms[split[1]].max <= objk.length){
				this.dsMessage("room is full")
				return;
			}
		} else {
			this.addRoom(split[1])			
		}
		this.sMessage(this.nameof(socket) + " moved to room "+split[1],room)
		io.to(socket.id).emit("joinroom",split[1])
		let sid = socket.id
		delete this.rooms[room].connectedSockets[sid]
		socket.leaveAll()
		socket.join("G10.7")
		socket.join("ArgAccel-"+split[1])
		socket.join(sid)
		this.rooms[split[1]].connectedSockets[sid] = true
		return(split[1])
	}

	static conflictFuncs(aroom,method,args){
		if(method == "get"){
			return(aroom.conflictarr[aroom.conflictarr.length-1].conflict)
		} else if(method == "add"){
			aroom.conflictarr.push(args[0])
		}
	}

	static message(date,socket, contentBlock, room){
		if(this.rooms[room].settings.replyonly){
			if(Object.keys(contentBlock.verifieds).length<1){
				this.dsMessage("room is reply only.",socket)
				return;
			}
		}
		let mid = this.msgid++
		contentBlock.flags = {}
		contentBlock.citations = {}
		contentBlock.type = "msg"
		contentBlock.msgid = mid
		contentBlock.canReference = true
		contentBlock.senderId = socket.id
		contentBlock.senderName = this.nameof(socket)
		this.rooms[room].msghist[mid] = contentBlock
		this.rooms[room].msghistArr.push(mid)

		contentBlock.attributes = {}

		io.to("ArgAccel-"+room).emit("msg",{"msg":contentBlock.stext,"id":socket.id,"msgid":mid,"attr":contentBlock.attributes})
		return(mid)
	}

	static blockMessage(date,socket,contentBlock,room){
		let mid = this.msgid++
		contentBlock.type = "block"
		contentBlock.msgid = mid
		contentBlock.senderId = socket.id
		contentBlock.senderName = this.nameof(socket)
		this.rooms[room].msghist[mid] = contentBlock
		this.rooms[room].msghistArr.push(mid)

		contentBlock.attributes = {"type":"block"}

		io.to("ArgAccel-"+room).emit("msg",{"msg":contentBlock.stext,"id":socket.id,"msgid":mid,"attr":contentBlock.attributes})
		return(mid)
	}

	static sMessageWelcome(socket){
		io.to(socket.id).emit("smsg","Welcome to Lopkn's Argument Accelerator! ArgAccel is one of the top leading technologies in the world. Please feel free to bug fetch while you are here.")
	}
	static sMessage(content,room){
		io.to("ArgAccel-"+room).emit("smsg",content)
		}
	static dsMessage(content,socket){
		io.to(socket.id).emit("smsg","> "+content)
	}
}

//////////////////////////////////////////////////// ArgAccel END
//tdl
//
//
// join same room prevention
// citation block
// citation API
// flag block
// flag API
// rightside bar
//
//
//
//
//argdemo
//
// s
//
//
//
//
//
//
//
//
//
//
//
///
module.exports = {ArgAug,ArgAccel}