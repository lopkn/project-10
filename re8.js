let io;
class re8{
	static players = {}
	static rooms = {}
	static referencer = {"color":{"r":"#A00000","b":"#0000A0","y":"#A0A000","o":"#A04000","p":"#6000C0","c":"#0060C0"}}
	static setio(i){
		io = i
	}

	static logger = []

	static enIDCnt = 0

	static initiatePlayer(e,socket){
		if(this.players[e[1]]== undefined ){
			let split = e[0].split("-")
			this.players[e[1]] = {
				"id":e[1],
				"name":e[1],
				"color":DFNorm(this.referencer.color,split[2]),
				"team":split[1],
				"room":split[0].split(":")[0],
				"camera":[0,0],
				"factoryUnplaced":true,
				"temporalMap":[{},[]],
				"entities":{},
				"resources":{"money":1500},
				"selector":[0,0],
				"specialState":{"name":"none"}
			}
			let n = split[0].split(":")[0]
			if(this.rooms[n]==undefined){
				this.rooms[n] = {"name":n,"vision":15,
				"type":split[0].split(":")[1],"started":false,"players":{},"map":{},
				"teamVision":false,"teams":{},
				"enRef":{
					"architect":{"m":400,"r":1},
					"soldier":{"m":100,"r":2},
					"mine":{"m":200,"r":1},
					"tank":{"m":340,"r":1},
					"sniper":{"m":320,"r":2},
					"road":{"m":200,"r":1},
					"armory":{"m":1500,"r":1},
					"medic":{"m":600,"r":2},
					"combat jeep":{"m":550,"r":1}
				}, "loop":"", "currentIntervals":{}
			}
			}
			
			if(this.rooms[n].started===false){
				socket.join(n)
				this.rooms[n].players[e[1]] = this.players[e[1]]
				if(this.rooms[n].teams[split[1]] == undefined){
					this.rooms[n].teams[split[1]] = {"entities":{},"players":{},"temporalMap":[],"type":"normal"}
				}
				this.rooms[n].teams[split[1]].players[e[1]] = this.players[e[1]]
				io.to(n).emit("joinedRoom",this.rooms[n])


				this.joinMenuReload(n)

			}
		}
	}


	static joinMenuReload(rm){
		let room = this.rooms[rm]
		if(room == undefined){
			return;
		}
		let objk = Object.keys(room.players)
		let outarr = []
		objk.forEach((e)=>{
			let pl = this.players[e]
			outarr.push({"id":e,"team":pl.team,"color":pl.color})
		})
		io.to(rm).emit("joinMenu",outarr)
	}

	static loadLobby(id){
		let pl = this.players[id]
		let rmph = []
		let rmobjk = Object.keys(this.rooms)
		rmobjk.forEach((e)=>{
			let rm = this.rooms[e]
			if(rm.started){
				return
			}
			let rmd = {"name":rm.name,"type":rm.type,"players":[]}
			let objP = Object.keys(rm.players)

			objP.forEach((E)=>{
				let tpl = this.players[E]
				rmd.players.push({"id":E,"team":tpl.team,"color":tpl.color})
			})
			rmph.push(rmd)

		})
		console.log(id)
		io.to(id).emit("lobby",rmph)
	}


	static startRoom(e){
		if(this.rooms[this.players[e.id].room].started === false){
			let tr = this.rooms[this.players[e.id].room]
			tr.started = true
			let map = {"width":35,"height":35,"tiles":{}}
			for(let i = 0; i < map.width; i++){
				for(let j = 0; j < map.height; j++){
					map.tiles[i+","+j] = this.generateTile()
				}
			}
			tr.map = map
			tr.enmap = {}
			tr.enDict = {}
			let ar = this.players[e.id].room
			tr.loop = setInterval(()=>{
				this.roomLoop(ar)
			},1000/20)
			// io.to(this.players[e.id].room).emit("startGame",{"map":map,"vision":15})
			this.sendRoomMapUpdate(this.players[e.id].room)
			Object.keys(this.rooms[this.players[e.id].room].players).forEach((e)=>{
				this.resourcesUpdate(e,tr)
				io.to(e).emit("enRef",[tr.enRef,CURRENTCONFIGS.re8])
			})
		}
	}

	static disconnect(socket){
		let id = socket.id
		let p = this.players[id]

		if(p == undefined){
			return;
		}
		let rm = p.room

		if(rm.started === false){

			if(rm.players && rm.players[id]){
			delete rm.players[id]}

			this.joinMenuReload(rm.name)
			return;
		}

		delete this.rooms[p.room].players[id]
		delete this.players[id]
		if(Object.keys(this.rooms[rm].players).length == 0){
			clearInterval(this.rooms[rm].loop)
			delete this.rooms[rm].enDict
			delete this.rooms[rm].enmap
			delete this.rooms[rm]
		}
		
	}


	static roomLoop(rm){
		let room = this.rooms[rm]
		let ci = room.currentIntervals
		let objk = Object.keys(ci)
		let d = Date.now()

		objk.forEach((e)=>{
			let aci = ci[e]

			if(aci.type == "income"){
				let en = room.enDict[aci.enid]
				let incomeAmt = en.income
				let p = this.players[en.ownerID]
				if(p == undefined){
					return;
				}

				let cd = this.OffCooldown(room.name,aci.enid)
				if(cd){
					if(en.income[1] != "cooldown"){
						if(d-incomeAmt[1] > incomeAmt[2]){
							let amt = Math.floor((d-incomeAmt[1])/incomeAmt[2])
							room.enDict[aci.enid].income[1] += incomeAmt[2] * amt
							p.resources.money += incomeAmt[0] * amt
							this.resourcesUpdate(en.ownerID,room)
						}
						
					} else {
						en.income[1] = d
						this.emitEntityUpdate(aci.enid,room)
					}
				}

				

			}

		})
	}

	static uplayerVision2(id,rm){
		let finalVision = {}
		let visionDict = {}
		let p = this.players[id]
		let room = this.rooms[rm]

		if(!room.teamVision){
			let penArr = Object.keys(p.entities)
			penArr.forEach((e,i)=>{
				let vis = room.enDict[e].Asight
				visionDict[e] = vis
				let objvis = Object.keys(vis)

				objvis.forEach((E,I)=>{
					if(finalVision[E] == undefined||finalVision[E].dist < vis[E].dist){

						if(finalVision[E]!=undefined&&finalVision[E]["enseen"]){
							finalVision[E] = vis[E]
							finalVision[E].enseen = true
						}else{
						finalVision[E] = vis[E]}
						finalVision[E]["by"] = e
					}
					if(vis[E].enseen){
						finalVision[E].enseen = true
					}
				})

			})
		}

		return([finalVision,visionDict])

	}


	static resourcesUpdate(id,room){
		let p = this.players[id]
		io.to(id).emit("resourcesUpdate",p.resources)
	}

	static uenVisionC(id,rm){
		let room = this.rooms[rm]

			let finalVision = {}
			
				let en = this.rooms[rm].enDict[id]

				let sightLim = [[0,en.x,en.y,0,0]]

				while(sightLim.length > 0){
					let tempVision = {}
					sightLim.forEach((E,I)=>{
						
							for(let j = 0; j < 4; j++){
								let W = this.walkerD(j,E[1],E[2])
								let d = distance(0,0,W[2]+E[3],W[3]+E[4])
								
								if(d > en.sight){
									continue;
								}
								let w = this.reApos(W[0],W[1],room.map.width,room.map.height) 
								let wl = w[0]+","+w[1]
								if(tempVision[wl] == undefined && finalVision[wl] == undefined){
									tempVision[wl] = [Math.floor(d),w[0],w[1],W[2]+E[3],W[3]+E[4],d]
								}
							}
						
					})

					sightLim = []


					let objk = Object.keys(tempVision)
					objk.forEach((E,I)=>{
						sightLim.push(tempVision[E])

						if(finalVision[E] == undefined){
							finalVision[E] = {"dist":tempVision[E][0],"x":tempVision[E][1],"y":tempVision[E][2]}
							if(en.ensight>=tempVision[E][0]){
								finalVision[E]["enseen"] = true

							}
						}

					})
				}
		return(finalVision)
	}
	
	static uenVision(id,rm){
		let room = this.rooms[rm]

			let finalVision = {}
			
				let en = this.rooms[rm].enDict[id]

				let sightLim = [[en.sight,en.x,en.y,0,0]]

				while(sightLim.length > 0){
					let tempVision = {}
					sightLim.forEach((E,I)=>{
						let number = E[0]-1
						if(number > 0){
							for(let j = 0; j < 4; j++){
								let W = this.walkerD(j,E[1],E[2])
								let w = this.reApos(W[0],W[1],room.map.width,room.map.height) 
								let wl = w[0]+","+w[1]
								if(tempVision[wl] == undefined || tempVision[wl][0] < number){
									tempVision[wl] = [number,w[0],w[1],walkerD[0]+e[3],walkerD[1]+e[4]]
								}
							}
						}
					})

					sightLim = []


					let objk = Object.keys(tempVision)
					objk.forEach((E,I)=>{
						sightLim.push(tempVision[E])

						if(finalVision[E] == undefined || finalVision[E].dist < tempVision[E][0]){
							finalVision[E] = {"dist":en.sight-tempVision[E][0],"x":tempVision[E][1],"y":tempVision[E][2]}
							if(en.ensight<tempVision[E][0]){
								finalVision[E]["enseen"] = true

							}
						}

					})
				}
		return(finalVision)
	}

	static walkerD(num,x,y){
		if(num == 0){
			return([x+1,y,1,0])
		} else if(num == 1){
			return([x-1,y,-1,0])
		} else if(num == 2){
			return([x,y+1,0,1])
		} else if(num == 3){
			return([x,y-1,0,-1])
		}
	}

	static reApos(x,y,w,h){
		return([x%w>=0?x%w:(w+x%w),y%h>=0?y%h:h+y%h])
	}

	static rmHandler(e,type){
		if(this.players[e.id]&&this.rooms[this.players[e.id].room].started){
			let rm = this.rooms[this.players[e.id].room]
			switch(type){
				case "click":
					this.click(e,rm)
					break;
				case "drag":
					this.drag(e,rm)
					break;
				case "key":
					this.key(e,rm)
					break;
				case "button":
					this.button(e,rm)
					break;
			}
		}
	}


	static hasMoney(id,amt){
		return(this.players[id].resources.money >= amt)
	}

	static click(e,rm){
		let p = this.players[e.id]
		if(this.players[e.id].factoryUnplaced&&rm.enmap[e.x+","+e.y] == undefined){
			delete this.players[e.id].factoryUnplaced
			let p = this.players[e.id]
			let enid = this.newEntity(e.id,e.x,e.y,"factory",rm,p.team)
			rm.currentIntervals[enid] = {"type":"income","enid":enid}
			this.players[e.id].selector = [e.x,e.y]

			this.sendPlayerMapUpdate(e.id,rm)
		} else {

			let loc = e.x+","+e.y
			let end = rm.enDict

			let pss = this.players.specialState

			if(e.sel != "none" &&e.sel != "1" &&e.sel != "2"&&e.sel != "3"){
				let rref;
				let enid;
				if(end[pss.enid] == undefined){
					io.to(e.id).emit("SEL",{"name":"none"})
					console.log("re8err",pss)
					return;
				}
				switch(e.sel){
					case "Factory1":
						rref = rm.enRef["architect"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m) && end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							enid = this.newEntity(e.id,e.x,e.y,"architect",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Factory2":
						rref = rm.enRef["soldier"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"soldier",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Factory3":
						rref = rm.enRef["tank"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"tank",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Factory4":
						rref = rm.enRef["sniper"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"sniper",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Architect1":
						rref = rm.enRef["mine"]
						if(rm.map.tiles[loc].ground == "mountain"&&!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"mine",rm,p.team)
							rm.currentIntervals[enid] = {"type":"income","enid":enid}
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Architect2":
						rref = rm.enRef["road"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"road",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Architect3":
						rref = rm.enRef["armory"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"armory",rm,p.team)
							rm.currentIntervals[enid] = {"type":"income","enid":enid}
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;
					case "Armory1":
						rref = rm.enRef["medic"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"medic",rm,p.team)
							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;

					case "Armory2":
						rref = rm.enRef["combat jeep"]
						if(!this.entityAtPos(loc,rm,1)[0] && this.hasMoney(e.id,rref.m)&& end[pss.enid].Asight[loc] != undefined&& end[pss.enid].Asight[loc].dist <= rref.r){
							p.resources.money -= rref.m
							this.resourcesUpdate(e.id,rm.name)
							enid = this.newEntity(e.id,e.x,e.y,"combat jeep",rm,p.team)



							this.sendPlayerMapUpdate(e.id,rm)
						}
						io.to(e.id).emit("SEL",{"name":"none"})
						break;


				}
				io.to(e.id).emit("SEL",{"name":"none"})
				this.players.specialState = {}
			}
			

			p.specialState = {"name":"none"}

		}
		this.players[e.id].selector = [e.x,e.y]
	}


	static button(e,room){
		let p = this.players[e.id]
		let loc = p.selector[0]+","+p.selector[1]
		let end = room.enDict

		// if(this.players[e.id].temporalMap[loc] == undefined){

			
			let SB = this.TNEWSELB(e.id,loc,room)
			
			if(SB[3] && this.OffCooldown(room.name,SB[1])){
				if(e.sel == 0){

					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory1","color":"#009000"})
						this.players.specialState = {"name":"Factory1","enid":SB[1]}
					} else if(end[SB[1]].type == "architect"){
						io.to(e.id).emit("SEL",{"name":"Architect1","color":"#009000"})
						this.players.specialState = {"name":"Architect1","enid":SB[1]}
					} else if(end[SB[1]].type == "armory"){
						io.to(e.id).emit("SEL",{"name":"Armory1","color":"#009000"})
						this.players.specialState = {"name":"Armory1","enid":SB[1]}
					}

				}else if(e.sel == 1){
					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory2","color":"#000090"})
						this.players.specialState = {"name":"Factory2","enid":SB[1]}
					} else if(end[SB[1]].type == "architect"){
						io.to(e.id).emit("SEL",{"name":"Architect2","color":"#000090"})
						this.players.specialState = {"name":"Architect2","enid":SB[1]}
					} else if(end[SB[1]].type == "armory"){
						io.to(e.id).emit("SEL",{"name":"Armory2","color":"#000090"})
						this.players.specialState = {"name":"Armory2","enid":SB[1]}
					}
				}else if(e.sel == 2){
					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory3","color":"#009090"})
						this.players.specialState = {"name":"Factory3","enid":SB[1]}
					} else if(end[SB[1]].type == "architect"){
						io.to(e.id).emit("SEL",{"name":"Architect3","color":"#009090"})
						this.players.specialState = {"name":"Architect3","enid":SB[1]}
					}
				}else if(e.sel == 3){
					if(end[SB[1]].type == "factory"){
						io.to(e.id).emit("SEL",{"name":"Factory4","color":"#900000"})
						this.players.specialState = {"name":"Factory4","enid":SB[1]}
					}
				}

			}
		// }
	}

	static OffCooldown(rm,id){
		let en = this.rooms[rm].enDict[id]

		if(en.cooldown[0] == "none"){
			return true
		}
		if(Date.now()-en.cooldown[1] > en.cooldown[2]){
			en.cooldown = ["none",0,0]
			return true
		}
		return false

	}

	static entityAtPos(loc,room,layer){
		let ens = room.enmap[loc]
		if(ens == undefined || ens.length < 1){
			return([false,0])
		}
		for(let i = 0; i < ens.length; i++){
			let e = ens[i]
			let en = room.enDict[e]
			if(en.layer == layer){
				return([true,e])
			}
		}
		return([false,0])
	}

	static SELB(id,loc,room,num){
		//has entity, entity id, entity same team, entity same owner,entity off cooldown
		if(num==undefined){
			num = 0
		}
		let out = [false,0,false,false,true]
		let end = room.enmap
		let selen;

		if(end[loc] == undefined || end[loc].length == 0){
			return(out)
		} else {
			selen = room.enDict[end[loc][num]]
			out[0] = true
			out[1] = end[loc]
		}

		if(selen.cooldown[0] == "none"|| Date.now-selen.cooldown[1] > selen.cooldown[2]){
			selen.cooldown = ["none",0,0]
			out[4] = true
		}

		if(selen.team == this.players[id].team){
			out[2] = true
		}
		if(selen.ownerID == id){
			out[3] = true
		}
		return(out)
	}

	static TNEWSELB(id,loc,room,num){
		if(num==undefined){
			num = 1
		}
		let out = [false,0,false,false,true]
		let end = room.enmap
		let selen;

		if(end[loc] == undefined || end[loc].length == 0){
			return(out)
		} else {

			let selno = "none"
			end[loc].forEach((e)=>{
				if(room.enDict[e].layer == num){
					selno = e
				}
			})
			if(selno == "none"){
				return(out)
			}
			selen = room.enDict[selno]
			out[0] = true
			out[1] = selno
		}

		if(selen.cooldown[0] == "none"|| Date.now-selen.cooldown[1] > selen.cooldown[2]){
			selen.cooldown = ["none",0,0]
			out[4] = true
		}

		if(selen.team == this.players[id].team){
			out[2] = true
		}
		if(selen.ownerID == id){
			out[3] = true
		}
		return(out)
	}


static sendRoomMapUpdate(rm){
		let room = this.rooms[rm]
		let rmplarr = Object.keys(room.players)
		rmplarr.forEach((e,i)=>{
			if(room.players[e].factoryUnplaced){
				io.to(e).emit("startGame",{"map":room.map,"vision":room.vision})
			} else {

				let tmp = this.uplayerVision(e,rm)

				io.to(e).emit("updateMap",{})
			}
		})
	}

	static sendPlayerMapUpdate(id,room){
		let p = this.players[id]
		let prvWhole = this.uplayerVision2(id,room.name)
		let prv = prvWhole[0]

		this.players[id].temporalMap = prvWhole

		let map = {}
		
		let objk = Object.keys(prv)
		objk.forEach((e,i)=>{
			map[e] = mergeDict(prv[e],room.map.tiles[e])
		})

		io.to(id).emit("personalMapUpdate",{"map":map})

	}

	static drag(e,room){

		let p = this.players[e.id]
		let loc = e.x + "," + e.y
		let tloc = e.tx + "," + e.ty

		let SB = this.SELB(e.id,loc,room)
		let end = room.enDict

		if(room.enDict[SB[1]] == undefined){
			console.log("re8err Here")
			return;
		}
			
			if(SB[3] && this.OffCooldown(room.name,SB[1])){
				if(e.sel == "none"){
					if(end[SB[1]].canshoot && end[SB[1]].shootInfo.range >= e.dist){
						io.to(e.id).emit("sline",{"name":end[SB[1]].type,"color":"#F00000","x":e.x,"y":e.y,"vx":e.vx,"vy":e.vy})
						end[SB[1]].cooldown = ["reloading",Date.now(),end[SB[1]].shootInfo.cd]
						let eap = this.entityAtPos(tloc,room,e.layer)
						if(eap[0]){
							let dmg = this.damageEntity(SB[1],eap[1],e.dist,room)
							this.damageNumRel(dmg,tloc,room)
						}
						this.emitEntityUpdate(SB[1],room)
					}
				}

			}
		p.selector = [e.tx,e.ty]

	}

	static damageEntity(sid,rid,dist,room){
		let end = room.enDict
		let sifo = end[sid].shootInfo
		let dmg = sifo.dmg + Math.floor(Math.random()*sifo.dmgv)
		end[rid].hp -= dmg
		let fatal = false
		if(end[rid].hp <= 0){
			this.killEntity(rid,room.name)
			fatal = true
			io.to(room.name).emit("entityUpdate",[rid,"-DEL-"])
		}
		return([dmg,fatal])
	}

	static damageNumRel(dmg,loc,room){
		let objk = Object.keys(room.players)
		objk.forEach((e)=>{
			if(room.players[e].temporalMap[0][loc] != undefined){
				io.to(e).emit("dmgnum",[loc,dmg])
			}
		})
	}

	static key(e,room){

		let key = e.key
		let p = this.players[e.id]



	    switch(key){
	    	case "w":
	    		this.handleWalk(e.id,p.selector[0],p.selector[1]-1,e.layer,room)
	    		break;
	    	case "s":
	    		this.handleWalk(e.id,p.selector[0],p.selector[1]+1,e.layer,room)
	    		break;
	    	case "a":
	    		this.handleWalk(e.id,p.selector[0]-1,p.selector[1],e.layer,room)
	    		break;
	    	case "d":
	    		this.handleWalk(e.id,p.selector[0]+1,p.selector[1],e.layer,room)
	    		break;
	    }

	    if(key == "w"){
     		p.selector = this.selectorMove(e.id,room,0,-1)
	    } else if(key == "s"){
	        p.selector = this.selectorMove(e.id,room,0,1)
	    } else if(key == "a"){
	      	p.selector = this.selectorMove(e.id,room,-1,0)
	    } else if(key == "d"){
	      	p.selector = this.selectorMove(e.id,room,1,0)
	    }

	}

	static selectorMove(id,room,x,y){
		let ps = this.players[id].selector
		return(this.reApos(ps[0]+x,ps[1]+y,room.map.width,room.map.height))
	}

	static handleWalk(id,x,y,layer,room){
		let p = this.players[id]
		let s = this.TNEWSELB(id,p.selector[0]+","+p.selector[1],room,layer)
		if(s[3]){
			let h = this.entityAtPos(x+","+y,room,layer)

			if(!h[0]){

				let en = room.enDict[s[1]]

				if(this.OffCooldown(room.name,s[1]) && en.movable){
					let reap = this.reApos(x,y,room.map.width,room.map.height)
					this.rmREmapper(room.name,s[1],en.x+","+en.y,reap[0]+","+reap[1])
					
					room.enDict[s[1]].x = reap[0]
					room.enDict[s[1]].y = reap[1]
					let tcd = room.enDict[s[1]].movingInfo.cd
					let trd = this.TNEWSELB(id,reap[0]+","+reap[1],room,0)
					if(room.map.tiles[room.enDict[s[1]].x+","+room.enDict[s[1]].y].ground == "mountain"){
						tcd += tcd
					}
					if(trd[0] && room.enDict[trd[1]].type == "road" && this.OffCooldown(room.name,trd[1])){
						tcd = Math.floor(tcd*0.3)
					}
					room.enDict[s[1]].cooldown = ["moving",Date.now(),tcd]
					let oldsight = JSON.parse(JSON.stringify(room.enDict[s[1]].Asight))
					room.enDict[s[1]].Asight = this.uenVisionC(s[1],room.name)
					this.sendPlayerMapUpdate(id,room)
					this.entitySightUpdate(id,oldsight,room.enDict[s[1]].Asight,room)
					this.emitEntityUpdate(s[1],room)
					
					return(true)
				}
				
			}
		}
		return(false)
	}

	static generateTile(){
		let n = ""
		let c = ""
		let colran = Math.random()
		if(Math.random()>0.3){
			n = "grass"
			c = "rgb(0,"+(Math.random()*200+55)+",0)"
		} else {
			n = "mountain"
			c = "rgb("+(colran*40+80)+","+(colran*40+80)+","+(colran*40+80)+")"
		}

		return({"ground":n,"color":c})
	}

	static entitySightUpdate(id,os,ns,room){
		let cDict = {}
		// no -> yes = true
		let objkOS = Object.keys(os)
		let objkNS = Object.keys(ns)

		objkOS.forEach((e)=>{
			if(ns[e] == undefined){
				if(os[e].enseen){
				cDict[e] = false}
				return
			}
			if(os[e].enseen != ns[e].enseen){
				if(os[e].enseen){
					cDict[e] = false
					return
				}
				if(ns[e].enseen){
					cDict[e] = true
					return
				}
			}
		})

		objkNS.forEach((e)=>{
			if(os[e] == undefined){
				if(ns[e].enseen){
				cDict[e] = true
				}
				return
			}
			if(os[e].enseen != ns[e].enseen){
				if(os[e].enseen){
					cDict[e] = false
					return
				}
				if(ns[e].enseen){
					cDict[e] = true
					return
				}
			}
		})

		let objc = Object.keys(cDict)
		let delposes = []
		objc.forEach((e)=>{
			if(cDict[e]){
				if(room.enmap[e] == undefined){
					return;
				}
				room.enmap[e].forEach((E)=>{
					io.to(id).emit("entityUpdate",[E,room.enDict[E]])
				})
			} else {
				if(this.players[id].temporalMap[0][e] == undefined || this.players[id].temporalMap[0][e].enseen !== true){
					delposes.push(e)
				}
			}
		})
		io.to(id).emit("entityPDel",delposes)

	}

		


	static newEmEntity(id,x,y,entity,team){
		this.enIDCnt += 1
		let eid = this.enIDCnt

		let E = this.entityDictor(entity)
		E.id = eid
		E.ownerID = id
		E.x = x
		E.y = y
		E.color = this.players[id].color
		E.type = entity
		E.team = team
		E.cooldown[1] = Date.now()


		return(E)
	}

	static deployEntity(parent,room,x,y,number){
		let pid = parent.ownerID
		let un = parent.units[number]
		if(un == undefined){
			return;
		}
		let eid = un.id
		room.enDict[eid] = un
		room.enDict[eid].Asight = this.uenVisionC(eid,room.name)
///
		let OBJK = Object.keys(room.enDict[eid].Asight)


		this.players[id].entities[eid] = true
		room.teams[team].entities[eid] = true

		this.players[id].temporalMap = this.uplayerVision2(id,room.name)

		OBJK.forEach((e)=>{
			if(room.enDict[eid].Asight[e].enseen && room.enmap[e] != undefined && room.enmap[e].length > 0){
				room.enmap[e].forEach((E)=>{
				this.emitEntityUpdate(E,room)					
				})
			}
		})

		this.rmEnmaper(room,eid,x+","+y,"add")

		this.emitEntityUpdate(eid,room)

	}

	static newEntity(id,x,y,entity,room,team){
		this.enIDCnt += 1
		let eid = this.enIDCnt

		room.enDict[eid] = this.entityDictor(entity)
		room.enDict[eid].id = eid
		room.enDict[eid].ownerID = id
		room.enDict[eid].x = x
		room.enDict[eid].y = y
		room.enDict[eid].color = this.players[id].color
		room.enDict[eid].type = entity
		room.enDict[eid].team = team
		room.enDict[eid].cooldown[1] = Date.now()
		room.enDict[eid].Asight = this.uenVisionC(eid,room.name)

		switch(entity){
			case "combat jeep":
				for(let i = 0; i < 4; i++){
					room.enDict[eid].units.push(this.newEmEntity(id,x,y,"soldier",team))
				}
				break;
		}

		let OBJK = Object.keys(room.enDict[eid].Asight)


		this.players[id].entities[eid] = true
		room.teams[team].entities[eid] = true

		this.players[id].temporalMap = this.uplayerVision2(id,room.name)

		OBJK.forEach((e)=>{
			if(room.enDict[eid].Asight[e].enseen && room.enmap[e] != undefined && room.enmap[e].length > 0){
				room.enmap[e].forEach((E)=>{
				this.emitEntityUpdate(E,room)					
				})
			}
		})

		this.rmEnmaper(room,eid,x+","+y,"add")

		this.emitEntityUpdate(eid,room)
		return(eid)

	}

	static emitEntityUpdate(id,room){
		let plr = Object.keys(room.players)

		let en = room.enDict[id]

		if(en == undefined){
			console.log(id,room.name)
			return;
		}

		plr.forEach((e,i)=>{
			let tm = this.players[e].temporalMap[0]
			if(tm[en.x+","+en.y] != undefined && tm[en.x+","+en.y].enseen){
				io.to(e).emit("entityUpdate",[id,room.enDict[id]])
			} else {
				io.to(e).emit("entityUpdate",[id,"-DEL-"])
			}
		})

	}

	static killEntity(id,rm){
		let entity = this.rooms[rm].enDict[id]

		let entityOwner = entity.ownerID

		if(this.rooms[rm].currentIntervals[id] !== undefined){
			delete this.rooms[rm].currentIntervals[id]
		}

		delete this.players[entityOwner].entities[id]
		delete this.rooms[rm].teams[entity.team].entities[id]
		this.rmEnmaper(this.rooms[rm],id,entity.x+","+entity.y,"remove")
		delete this.rooms[rm].enDict[id]
	}

	static rmEnmaper(room,enid,loc,op){
		let place = room.enmap[loc]
		if(op == "add"){
			if(place == undefined){
				room.enmap[loc] = []
			}
				room.enmap[loc].push(enid)
		} else if(op == "remove"){
			room.enmap[loc] = place.filter(e => e !== enid)
			if(place.length == 0){
				delete room.enmap[loc]
			}
		}
	}

	static rmREmapper(rm,enid,prloc,loc){
		let room = this.rooms[rm]
		let enm = room.enmap[prloc]

		this.rmEnmaper(room,enid,prloc,"remove")
		this.rmEnmaper(room,enid,loc,"add")
	}


	static entityDictor(en){
		return(JSON.parse(JSON.stringify(CURRENTCONFIGS.re8[en])))
	}

}



function DFNorm(dict,val){
	if(dict[val] == undefined){
		return(dict.default)
	}
	return(dict[val])
}


//EXP44
function mergeDict(d,d2){
	let obj = Object.keys(d2)
	obj.forEach((e)=>{
		d[e] = d2[e]
	})
	return(d)
}

function distance(x,y,a,b){
	let c = a-x
	let d = b-y
	return(Math.sqrt(a*a+b*b))
}


module.exports = {re8}
