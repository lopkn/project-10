//////////////////////////////////////////////////// ARGAUG


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
	static keyholders = {}

	static msgid = 0
	// static msghist = {}

	static rooms = {"Lobby":{"msghist":{}}}

	static addRoom(name){
		this.rooms[name] = {
			"msghist":{},
		}
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
		txt = txt.replaceAll("<","&lt;")
		let processed = this.ihtmlProcess(ihtml,txt,room)
		if(name == "msg"){
			if(txt[0] == "/"){
				this.command(date,txt,socket,room)
				return
			}



			this.message(date,processed.stext,socket,processed,room)
		}


	}

	static ihtmlProcess(str,cont,room){
		let id = "normal"
		let out = ['']
		for(let i = 0; i < str.length; i++){
			let char = str[i]

			if(id == "normal"){

				if(char == "<"){
				if(str.substring(i+1,i+5) == "span"){
					i+=4
					id = "spanAttr"
					out.push({"text":'',"attr":''})
					continue
				}
			}

				out[out.length-1] += char
			} else if(id == "spanAttr"){
				if(char == ">"){
					id = "inSpan"
					continue
				}
				out[out.length-1].attr += char


			} else if(id == "inSpan"){

				if(char == "<"){
				if(str.substring(i+1,i+7) == "/span>"){
					i+=6
					id = "normal"
					out.push('')
					continue
				}
			}
				out[out.length-1].text += char
			}

		}

		let stext = ''
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
					stext += "<span class='verified' ref='"+e.reference+"' onmouseover='refover(this)' onmouseout='refover(this,false)'>" + e.text + "</span>"
				} else {
				  stext += e.text
				}
			}else{
			 stext +=e
			}
		})



		return({"text":cont,"processed":out,"stext":stext})
	}

	static matchExtract(e,room){
		let jstr = e.extractedAttr
		try{
		let j = JSON.parse(jstr)
			let matches = this.rooms[room].msghist[j.msgid].text.includes(e.text)
			if(matches){
				e.verified = true
				e.reference = j.msgid
			}
		}catch(err){return(e)}
		
		return(e)
	}

	static command(date,content,socket,room){
		let su = false
		if(this.keyholders[socket.id]){su = true}
		let split = content.substring(1).split(" ")
		let s1 = split[0]
			if(su){
				if(s1 == "smsg"){
					this.sMessage(content.substring(5),room)
				} else if(s1 == "crash"){
					throw(new Error)
				}
			}


			    if(s1 == "thisroom"){
					this.dsMessage("your current room is: "+room,socket)
				} else if(s1 == "joinroom"){
					if(this.rooms[split[1]]){

					} else {
						this.addRoom(split[1])			
					}
					io.to(socket.id).emit("joinroom",split[1])
					let sid = socket.id
					socket.leaveAll()
					socket.join("G10.7")
					socket.join("ArgAccel-"+split[1])
					socket.join(sid)
				} else if(s1 == "topic"){
					if(split[1]){
						if(this.rooms[room].topic == undefined){
							this.rooms[room].topic = content.substring(7)
							this.sMessage("The room's topic has been set to: "+this.rooms[room].topic,room)
						} else {
							this.dsMessage("The room's topic is already set to: "+this.rooms[room].topic,socket)
						}
					} else {
						if(this.rooms[room].topic == undefined){
						this.dsMessage("Current room topic is unset",socket)
						}else{
						this.dsMessage("Current topic is: "+this.rooms[room].topic,socket)
						}
					}
				}
			


	}
	static message(date,content,socket, contentBlock, room){
		let mid = this.msgid++
		this.rooms[room].msghist[mid] = contentBlock
		io.to("G10.7").emit("msg",{"msg":content,"id":socket.id,"msgid":mid})
	}
	static sMessageWelcome(socket){
		io.to(socket.id).emit("smsg","Welcome to Lopkn's Argument Accelerator! ArgAccel is one of the top leading technologies in the world. Please feel free to bug fetch while you are here.")
	}
	static sMessage(content,room){
		io.to("ArgAccel-"+room).emit("smsg",content)
		}
	static dsMessage(content,socket){
		io.to(socket.id).emit("smsg",content)
	}
}

//////////////////////////////////////////////////// ArgAccel END

module.exports = {ArgAug,ArgAccel}