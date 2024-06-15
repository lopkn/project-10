let io;
let myMath
function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

class shooter2C{
	static walls = {}
	static bullets = []
	//{x,y,vx,vy,tailLength,tail[l,x,y,tx,ty],life}
	static players = {}
	static keyholders = {}
	static drawers = []
	static wallPushers = {}

	static nuuIDGEN = 0
	static setio(i,m){
		io = i
		myMath = m
	}

	static pushBullet(x,y,vx,vy,id,type){
		switch(type){


			case "norm":
				this.bullets.push({"shooter":id,"type":"norm","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"lingerance":10,"tailLength":10,"tail":[],"life":2000,"slowd":0.95})
				break;
			case "scat":
				this.bullets.push({"shooter":id,"type":"scat","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"tailLength":6,"dmgmult":3,"lingerance":6,"tail":[],"life":2000,"slowd":0.95})
				break;
			case "lazr":
				this.bullets.push({"shooter":id,"type":"lazr","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,"deathVel":1002500,
					"tailLength":20,"dmgmult":0.1,"lingerance":20,"tail":[],"life":200,"slowd":1})
				break;
			case "lzr2":
				this.bullets.push({"shooter":id,"type":"lzr2","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,"unBouncer":0,
					"tailLength":2,"dmgmult":0.01,"lingerance":2,"tail":[],"life":1,"slowd":1,"extra":{"tailmult":2}})
				break;
			case "cnon":
				this.bullets.push({"shooter":id,"type":"cnon","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,"deathVel":6000,
					"tailLength":10,"lingerance":10,"tail":[],"life":200,"penMult":0.45,"ignoreWallMult":-0.7,
					"slowd":1,"dmgmult":17,"ignoreAngleDamageMult":1,"extra":{"tailmult":3}})
				break;

			case "heal":
				this.bullets.push({"shooter":id,"type":"heal","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"lingerance":2,"dmgmult":-1,"tailLength":2,"tail":[],"life":20,"slowd":0.98})
				break;
			case "dril":
				this.bullets.push({"shooter":id,"type":"dril","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":0.2,
					"lingerance":2,"dmgmult":3,"tailLength":2,"tail":[],"life":2,"slowd":0.9,"extra":{"tailmult":3}})
				break;
			case "grnd":
				this.bullets.push({"shooter":id,"type":"grnd","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,"deathVel":10,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":2000,"slowd":0.82,"extra":{"tailmult":8},
					"onDeath":(b)=>{
						for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*150-75,Math.random()*150-75,b.shooter,"norm")
							a.slowd = 0.95
							a.dmgmult = 12
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
					}}
				})
				break;
			case "msl":
				this.bullets.push({"shooter":id,"type":"msl","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":0,"deathVel":619.8,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":50,"slowd":1,"extra":{"tailmult":8},"unBouncer":1,
					"onDeath":(b)=>{
						for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*150-75+vx,Math.random()*150-75+vy,b.shooter,"norm")
							a.slowd = 0.95
							a.dmgmult = 12
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
					}}
				})
				break;
			case "msl2":
				this.bullets.push({"shooter":id,"type":"msl2","x":x,"y":y,"vx":vx/6,"vy":vy/6,"wallMult":0,"deathVel":10,"unBouncer":1,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":50,"slowd":1.08,"extra":{"tailmult":8},"date":Date.now(),
					"onDeath":(b)=>{
						let dd = Date.now()
						for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*170-95+vx*1.5,Math.random()*170-95+vy*1.5,b.shooter,"norm")
							a.slowd = 0.95
							a.dmgmult = ((dd-b.date)*(dd-b.date)/250000)
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
					}}
				})
				break;
			case "zapr":
				this.bullets.push({"shooter":id,"type":"zapr","x":x,"y":y,"vx":vx/4,"vy":vy/4,"wallMult":0,"deathVel":10,"unBouncer":Math.floor(Math.random()*2),
					"tailLength":4,"dmgmult":0.1,"lingerance":2,"tail":[],"life":4,"slowd":1,"extra":{"tailmult":2},"instant":true,
					"tick":(b)=>{
						b.vx += Math.random()*120-60
						b.vy += Math.random()*120-60
					}
				})
				break;

			case "dbgd":
				this.bullets.push({"shooter":id,"type":"dbgd","x":x,"y":y,"vx":vx/4,"vy":vy/4,"wallMult":0,"deathVel":10,"ignoreWallMult":1,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":100,"slowd":1,"extra":{"tailmult":1},
					"onDeath":(b)=>{
						let tdmg = 120 * Math.random()
						for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*150-75,Math.random()*150-75,b.shooter,"norm")
							a.slowd = 0.95
							a.dmgmult = tdmg
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
					}},
					"tick":(b)=>{
						b.vx += Math.random()*12-6
						b.vy += Math.random()*12-6
					}
				})
				break;
			case "dbml":
				this.bullets.push({"shooter":id,"type":"msl2","x":x,"y":y,"vx":vx/6,"vy":vy/6,"wallMult":0,"deathVel":10,"unBouncer":1,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":50,"slowd":1.18,"extra":{"tailmult":8},"date":Date.now(),
					"onDeath":(b)=>{
						let dd = Date.now()
							for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*300-150+vx*0.1,Math.random()*300-150+vy*0.1,b.shooter,"norm")
							a.slowd = 0.5
							a.life = 50
							a.dmgmult = ((dd-b.date)*(dd-b.date)/2500)
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
							}
						
					}
				})
				break;
			case "vipr":
				this.bullets.push({"shooter":id,"type":"vipr","x":x,"y":y,"vx":vx/4,"vy":vy/4,"wallMult":0,"deathVel":10,"ignoreWallMult":-1,
					"lingerance":4,"dmgmult":100,"tailLength":4,"tail":[],"life":100,"slowd":1,"extra":{"tailmult":1},
					"tick":(b)=>{
						b.vx += Math.random()*12-6
						b.vy += Math.random()*12-6
					}
				})
				break;

		}
		return(this.bullets[this.bullets.length-1])
	}

	static playerLook(p,x,y){
		let n = vectorFuncs.originVectorNormalize(x-p.x,y-p.y)
		p.rotation = [n[0],n[1]]
	}

	static playerClick(id,x,y,w){
		let p = this.players[id]
		if(p.reloading > 0 || p.reloading == undefined || p.dead){
			return;
		}
		if(w === undefined){
			w = p.lastWeapon
		} else {
			p.lastWeapon = w
		}

		let n = vectorNormalize([p.x,p.y,x+p.x,y+p.y])
		// let n = vectorNormalize([p.x,p.y,x+p.x-410,y+p.y-410])
		p.rotation = [n[2]-p.x,n[3]-p.y]
		p.unmovePos[2] = true
		let reload = 0
		let theBullet;
		switch(w){
			case "norm":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"norm")
				reload += 4
				break;
			case "mchg":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160+Math.random()*30-15,(n[3]-p.y)*160+Math.random()*30-15,id,"scat")
				reload += 2
				break;
			case "snpr":
				theBullet = this.pushBullet(p.x,p.y,(n[2]-p.x)*190+p.vx,(n[3]-p.y)*190+p.vy,id,"norm")
				theBullet.dmgmult = 7
				theBullet.wallMult = 0.1
				theBullet.deathVel = 200
		reload += 30
				break;
			case "scat":
			for(let i = 0; i < 5; i++){
				
				this.pushBullet(p.x,p.y,(n[2]-p.x)*110+Math.random()*40-20,(n[3]-p.y)*110+Math.random()*40-20,id,"scat")
			}
		reload += 10
				break;
			case "lazr":
				
				this.pushBullet(p.x,p.y,(n[2]-p.x)*1100,(n[3]-p.y)*1100,id,"lazr")
		reload += 30
		p.materials -= 5
				break;
			case "lzr2":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*1100,(n[3]-p.y)*1100,id,"lzr2")
				break;
			case "cnon":
				p.vx -= (n[2]-p.x)*10
				p.vy -= (n[3]-p.y)*10
				this.pushBullet(p.x,p.y,(n[2]-p.x)*100,(n[3]-p.y)*100,id,"cnon")
		reload += 10
				break;
			case "heal":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"heal")
				break;
			case "dril":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"dril")
				break;
			case "grnd":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"grnd")
		reload += 20
		p.materials -= 5
				break;
			case "msl":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*25,(n[3]-p.y)*25,id,"msl")
		reload += 30
		p.materials -= 5
				break;
			case "msl2":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*25,(n[3]-p.y)*25,id,"msl2")
				reload += 40
				p.materials -= 5
				break;
			case "zapr":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*1100,(n[3]-p.y)*1100,id,"zapr")
				reload += 1
				break;
			case "dbgd":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"dbgd")
				reload += 2
				p.materials -= 1
				break;
			case "dbml":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"dbml")
				reload += 2
				p.materials -= 1
				break;
			case "vipr":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"vipr")
				reload += 2
				p.materials -= 1
				break;
		}
		p.reloading += reload;
	}

	static getNewNUUID(){
		this.nuuIDGEN++
		return(this.nuuIDGEN.toString(36))
	}

	static wallCost(l,t,p){
		l/=10
		let player = this.players[p]
		if(t == "turr2"){
			l = 100
		}if(t == "turr3"){
			l = 120
		} else if(t == "turr" || t=== "Bmr"){
			l = 50
		} else if(t == "ghol" ||t == "bhol"||t == "whol"){
			l = 50
		} else if(t == "metl" || t == "mbdy"){
			l *= 3
		} else if(t == "rflc"){
			l *= 4
		}
		if(player.materials > l){
			player.materials -= l
			io.to(p).emit("spec",["mat",Math.floor(player.materials)])
			return(false)
		}
		return(true)
	}

	static playerWall(p,ar,a){
		p.boidyVect.push([
					(ar[0] * p.rotation[1] - ar[1] * p.rotation[0]),
					(ar[1] * p.rotation[1] + ar[0] * p.rotation[0]),
					(ar[2] * p.rotation[1] - ar[3] * p.rotation[0]),
					(ar[3] * p.rotation[1] + ar[2] * p.rotation[0])])
				p.unmovePos[2] = true
				p.boidy.push(a)
				this.walls[a].plid = p.id
	}

	static placeWall(player,x1,y1,x2,y2,type,options,special){
		
		if(type == undefined){
			type = "norm"
		}
		if(options == undefined){
			options = {}
		}
		let p = this.players[player]
		let wLength = distance(x1,y1,x2,y2)
		if(type != "player" && !options.force && this.wallCost(wLength,type,player)){return}

		if(type == "body"){
			type="norm"
			options.attach = true
		}
		if(type == "mbdy"){
			type = "metl"
			options.attach = true
		} 
		if (type == "brfc"){
			type = "rflc"
			options.attach = true
		}

		if(wLength < 40 && (type=="norm" || type == "metl" || type == "rflc") && !options.force){
			return
		}

		let ar = [x1-p.x,y1-p.y,x2-p.x,y2-p.y]
		let a = this.getNewNUUID()

		let tarr;
		switch(type){
			case "norm":
				this.walls[a] = {
					"type":"norm","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":1,
					"frad":wLength/2
				}//walls can be optimized to have slopes calculated
				//walls can be optimized to have update specific queues
				if(options.attach){
					this.playerWall(p,ar,a)
				}
				break;
			case "metl":
				this.walls[a] = {
					"type":"metl","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":5,
					"frad":wLength/2
				}
				if(options.attach){
					this.playerWall(p,ar,a)
				}
				break;
			case "rflc":
				this.walls[a] = {
					"type":"rflc","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":5,"wallMult":1.04,
					"frad":wLength/2,
					"onDamage":(w,b)=>{if(b.dmgmult === undefined){b.dmgmult = 1.2};if(b.dmgmult>0){b.dmgmult*=1.2};return(b)}
				}
				if(options.attach){
					this.playerWall(p,ar,a)
				}
				break;
			case "player":
				this.walls[a] = {"frad":distance(x1,y1,x2,y2)/2,"plid":options.id,"type":"player","x1":x1,"y1":y1,"x2":x2,"y2":y2,"hp":1000,
					"defense":0.5,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"frad":wLength/2,
					"compression":["type","x1","y1","x2","y2","hp"]
				}
				break;
			// case "body":
			// this.walls[a] = {"frad":distance(x1,y1,x2,y2)/2,"plid":options.id,"type":"body","x1":0,"y1":0,"x2":0,"y2":0,"hp":1000,
			// 		"defense":0.2,"midpt":myMath.midPointOfLine(x1,y1,x2,y2)
			// 	}
			// 	let pp = this.players[options.id]
			// 	// let ar = [x1-pp.x,y1-pp.y,x2-pp.x,y2-pp.y]
			// 	let xx1 = (ar[0] * pp.rotation[1] - ar[1] * pp.rotation[0]) 
			// 	let yy1 = (ar[1] * pp.rotation[1] + ar[0] * pp.rotation[0]) 
			// 	let xx2 = (ar[2] * pp.rotation[1] - ar[3] * pp.rotation[0]) 
			// 	let yy2 = (ar[3] * pp.rotation[1] + ar[2] * pp.rotation[0])

			// 	// this.players[options.id].boidyVect.push([x1-pp.x,y1-pp.y,x2-pp.x,y2-pp.y])
			// 	this.players[options.id].boidyVect.push([xx1,yy1,xx2,yy2])
			// 	pp.unmovePos[2] = true
			// 	this.players[options.id].boidy.push(a)
			// 	break;
			// case "mbdy":
			// this.walls[a] = {"frad":wLength/2,"plid":options.id,"type":"mbdy","x1":x1,"y1":y1,"x2":x2,"y2":y2,"hp":1000, // chanaged
			// 		"defense":4,"midpt":myMath.midPointOfLine(x1,y1,x2,y2)
			// 	}
			// 	let ppr = this.players[options.id]
			// 	let aar = [x1-ppr.x,y1-ppr.y,x2-ppr.x,y2-ppr.y]

			// 	this.players[options.id].boidyVect.push([
			// 		(aar[0] * ppr.rotation[1] - aar[1] * ppr.rotation[0]),
			// 		(aar[1] * ppr.rotation[1] + aar[0] * ppr.rotation[0]),
			// 		(aar[2] * ppr.rotation[1] - aar[3] * ppr.rotation[0]),
			// 		(aar[3] * ppr.rotation[1] + aar[2] * ppr.rotation[0])])
			// 	ppr.unmovePos[2] = true
			// 	this.players[options.id].boidy.push(a)
			// 	break;
			case "bhol":
				this.walls[a] = {
					"type":"bhol","x":x1,"y":y1,"radius":160,"velmult":0.95,
					"midpt":[x1,y1],"handle":"bhol","hp":4000,
					"defense":1,
					"frad":x2
				}
				break;
			case "ghol":
				this.walls[a] = {
					"type":"ghol","x":x1,"y":y1,"radius":460,"velmult":0.98,
					"midpt":[x1,y1],"handle":"ghol","hp":4000,
					"defense":1,
					"frad":x2
				}
				break;
			case "whol":
				this.walls[a] = {
					"type":"whol","x":x1,"y":y1,"radius":360,"velmult":0.98,
					"midpt":[x1,y1],"handle":"whol","hp":1000,
					"defense":0.2,
					"frad":x2
				}
				break;
			case "box":
				tarr = [[40,30,40,-30],[40,-30,-40,-30],[-40,-30,-40,30],[-40,30,40,30]]
				this.playerLook(p,x1,y1)
				for(let i = 0; i < tarr.length; i++){
					let ar = tarr[i]
					let xx1 = (ar[0] * p.rotation[1] + ar[1] * p.rotation[0])+ x1
					let yy1 = (ar[1] * p.rotation[1] - ar[0] * p.rotation[0]) + y1
					let xx2 = (ar[2] * p.rotation[1] + ar[3] * p.rotation[0]) + x1
					let yy2 = (ar[3] * p.rotation[1] - ar[2] * p.rotation[0]) + y1
					this.placeWall(player,xx1,yy1,xx2,yy2,"norm",Object.assign({},options,{"force":true}),special)
				}
				// this.placeWall(player,40,40,40,-40,"norm",{"force":true})
				return;
				break;
			case "Bmr":
				tarr = [[40,30,40,-30],[40,-30,-40,-30],[-40,-30,-40,30],[-40,30,40,30],[40,30,-40,-30],[-40,30,40,-30]]
				this.playerLook(p,x1,y1)
				for(let i = 0; i < tarr.length; i++){
					let ar = tarr[i]
					let xx1 = (ar[0] * p.rotation[1] + ar[1] * p.rotation[0])+ x1
					let yy1 = (ar[1] * p.rotation[1] - ar[0] * p.rotation[0]) + y1
					let xx2 = (ar[2] * p.rotation[1] + ar[3] * p.rotation[0]) + x1
					let yy2 = (ar[3] * p.rotation[1] - ar[2] * p.rotation[0]) + y1
					this.placeWall(player,xx1,yy1,xx2,yy2,"metl",Object.assign({},options,{"force":true}),special)
				}
				return;
				break;
			case "turr":
				tarr = [[40,30,40,-30],[40,-30,-40,-30],[-40,-30,-40,30],[-40,30,40,30]]
				this.playerLook(p,x1,y1)
				this.walls[a] = {"type":"turr","x":x1,"y":y1,"radius":460,"velmult":0.98,
					"midpt":[x1,y1],"handle":"none","hp":1000,
					"defense":0.2,
					"time":Math.floor(Math.random()*20),
					"frad":x2,"plid":player};
				this.walldo[a] = (TIMES)=>{if(TIMES%20===this.walls[a].time){

					let obpr = Object.keys(this.players)
					for(let i = 0; i < obpr.length; i++){
						let TTP = obpr[i]
						let TPP = this.players[TTP]
						if(distance(TPP.x,TPP.y,x1,y1) < this.walls[a].radius && TTP != player&& !TPP.dead){
							let nrm = vectorFuncs.originVectorNormalize(TPP.x-x1,TPP.y-y1)
							let abb = this.pushBullet(x1,y1,nrm[0]*45,nrm[1]*45,player,"norm")
							abb.dmgmult =  6
							break;
						}
					}

				}}
				for(let i = 0; i < tarr.length; i++){
					let ar = tarr[i]
					let xx1 = (ar[0] * p.rotation[1] + ar[1] * p.rotation[0])+ x1
					let yy1 = (ar[1] * p.rotation[1] - ar[0] * p.rotation[0]) + y1
					let xx2 = (ar[2] * p.rotation[1] + ar[3] * p.rotation[0]) + x1
					let yy2 = (ar[3] * p.rotation[1] - ar[2] * p.rotation[0]) + y1
					let pw = this.placeWall(player,xx1,yy1,xx2,yy2,"norm",{"force":true},{"plid":player})
					this.walls[pw].onDeath = (w,b)=>{this.delWall(a);}
				}
				break;
			case "turr3":
				tarr = [[40,30,40,-30],[40,-30,-40,-30],[-40,-30,-40,30],[-40,30,40,30]]
				this.playerLook(p,x1,y1)
				this.walls[a] = {"type":"turr3","x":x1,"y":y1,"radius":960,"velmult":0.98,
					"midpt":[x1,y1],"handle":"none","hp":1000,
					"defense":0.2,
					"time":Math.floor(Math.random()*20),
					"frad":x2,"plid":player};
				this.walldo[a] = (TIMES)=>{if(TIMES%40===this.walls[a].time){

					let obpr = Object.keys(this.players)
					for(let i = 0; i < obpr.length; i++){
						let TTP = obpr[i]
						let TPP = this.players[TTP]
						if(distance(TPP.x,TPP.y,x1,y1) < this.walls[a].radius && TTP != player&& !TPP.dead){
							let nrm = vectorFuncs.originVectorNormalize(TPP.x-x1,TPP.y-y1)
							let abb = this.pushBullet(x1,y1,nrm[0]*195,nrm[1]*195,player,"norm")
							abb.dmgmult = 4
							abb.wallMult = 0.1
							abb.deathVel = 200
							break;
						}
					}

				}}
				for(let i = 0; i < tarr.length; i++){
					let ar = tarr[i]
					let xx1 = (ar[0] * p.rotation[1] + ar[1] * p.rotation[0])+ x1
					let yy1 = (ar[1] * p.rotation[1] - ar[0] * p.rotation[0]) + y1
					let xx2 = (ar[2] * p.rotation[1] + ar[3] * p.rotation[0]) + x1
					let yy2 = (ar[3] * p.rotation[1] - ar[2] * p.rotation[0]) + y1
					let pw = this.placeWall(player,xx1,yy1,xx2,yy2,"norm",{"force":true},{"plid":player})
					this.walls[pw].onDeath = (w,b)=>{this.delWall(a)}
				}
				break;
			case "turr2":
				tarr = [[40,30,40,-30],[40,-30,-40,-30],[-40,-30,-40,30],[-40,30,40,30]]
				this.playerLook(p,x1,y1)
				this.walls[a] = {"type":"turr2","x":x1,"y":y1,"radius":860,"velmult":0.98,
					"midpt":[x1,y1],"handle":"none","hp":1000,
					"defense":0.2,
					"time":Math.floor(Math.random()*4),
					"frad":x2,"plid":player};
				this.walldo[a] = (TIMES)=>{if(TIMES%4===this.walls[a].time){

					let obpr = Object.keys(this.players)
					for(let i = 0; i < obpr.length; i++){
						let TTP = obpr[i]
						let TPP = this.players[TTP]
						if(distance(TPP.x,TPP.y,x1,y1) < this.walls[a].radius && TTP != player && !TPP.dead){
							let nrm = vectorFuncs.originVectorNormalize(TPP.x-x1,TPP.y-y1)
							let shx = nrm[0]*65+TPP.vx*1.7+Math.random()*45-22.5 // bullet supposed to go here
							let shy = nrm[1]*65+TPP.vy*1.7+Math.random()*45-22.5
							let obwl = Object.values(this.walls)
							let willCollide = false
							for(let j = 0; j < obwl.length; j++){
								let W = obwl[j]
								if(player === W.plid || TPP.id === W.plid){
									continue;
								}
								let col = this.pointLineCollision(x1,y1,x1+shx*20,y1+shy*20,W.x1,W.y1,W.x2,W.y2)
								if(col[4]){
									willCollide = true
									break;
								}
							}
							if(willCollide){continue}
							let abb = this.pushBullet(x1,y1,shx,shy,player,"norm")
							abb.dmgmult =  6
							break;
						}
					}

				}}
				for(let i = 0; i < tarr.length; i++){
					let ar = tarr[i]
					let xx1 = (ar[0] * p.rotation[1] + ar[1] * p.rotation[0])+ x1
					let yy1 = (ar[1] * p.rotation[1] - ar[0] * p.rotation[0]) + y1
					let xx2 = (ar[2] * p.rotation[1] + ar[3] * p.rotation[0]) + x1
					let yy2 = (ar[3] * p.rotation[1] - ar[2] * p.rotation[0]) + y1
					let pw = this.placeWall(player,xx1,yy1,xx2,yy2,"norm",{"force":true},{"plid":player})
					this.walls[pw].onDeath = (w,b)=>{this.delWall(a)}
				}
				break;
		}

		if(options.regen){
			this.walls[a].undying = 4
			this.walls[a].onDeath = (w,b)=>{if(w.undying<1){return};setTimeout(()=>{w.hp = 1000; w.dead = undefined; this.updateWall_MightBeDead(w.id)},options.regen*1000)}
		}

		if(special != undefined){
			let targs = Object.keys(special)
			targs.forEach((e)=>{
				this.walls[a][e] = special[e]
			})
		}
		this.walls[a].id = a
		this.updateWall(a)
		return(a)
	}
	static initiatePlayer(id,type){

		if(type == undefined || type == "ntri"){

		this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
		"boidyVect":[[0,-40,30,30],[30,30,-30,30],[-30,30,0,-40]],
		"boidy":[],"x":410,"y":410,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
		"materials":100,"speed":1.5,"boidyAll":3
	}
		io.to(id).emit("spec",["zoom",1])

		let a = this.placeWall(id,410,390,395,425,"player",{"id":id,"force":true})
		this.players[id].boidy.push(a)
		 a = this.placeWall(id,425,425,395,425,"player",{"id":id,"force":true})
		 this.players[id].boidy.push(a)

		 a = this.placeWall(id,410,390,425,425,"player",{"id":id,"force":true})
		 this.players[id].boidy.push(a)
		} else if(type == "shld") {
			
			this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
		"boidyVect":[[10,40,30,-30],[30,-30,-30,-30],[-30,-30,-10,40],[-10,40,10,40],[-70,45,-10,57],[10,57,70,45]],
		"boidy":[],"x":410,"y":410,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
		"materials":100,"speed":0.5,"tracking":true,"boidyAll":4
		}
		io.to(id).emit("spec",["zoom",0.8])
		let a = this.placeWall(id,0,0,0,0,"player",{"id":id,"force":true},{"defense":3})
		this.players[id].boidy.push(a)
		 a = this.placeWall(id,0,0,0,0,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)

		 a = this.placeWall(id,0,0,0,0,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)
		 a = this.placeWall(id,0,0,0,0,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)
		 a = this.placeWall(id,0,0,0,0,"rflc",{"id":id,"force":true},{"playerIntegral":false,"plid":id,"undying":Infinity})
		 this.players[id].boidy.push(a)
		 this.walls[a].onDeath = (w,b)=>{setTimeout(()=>{w.hp = 1000; w.dead = undefined; this.updateWall_MightBeDead(w.id)},13000)}
		 a = this.placeWall(id,0,0,0,0,"rflc",{"id":id,"force":true},{"playerIntegral":false,"plid":id,"undying":Infinity})
		 this.players[id].boidy.push(a)
		 this.walls[a].onDeath = (w,b)=>{setTimeout(()=>{w.hp = 1000; w.dead = undefined; this.updateWall_MightBeDead(w.id)},13000)}

		

		} else if(type == "tank") {
			this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
		"boidyVect":[[10,-40,30,30],[30,30,-30,30],[-30,30,-10,-40],[-10,-40,10,-40]],
		"boidy":[],"x":410,"y":410,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
		"materials":100,"speed":0.5,"tracking":true,"boidyAll":4
		}
		io.to(id).emit("spec",["zoom",0.8])
		let a = this.placeWall(id,410,390,395,425,"player",{"id":id,"force":true},{"defense":3})
		this.players[id].boidy.push(a)
		 a = this.placeWall(id,425,425,395,425,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)

		 a = this.placeWall(id,410,390,425,425,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)
		 a = this.placeWall(id,410,390,425,425,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)


		} else if(type == "snpr") {
			this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
		"boidyVect":[[0,-50,0,70],[0,-15,-23,-35],[0,20,40,-20],[40,-20,0,-50]],
		"boidy":[],"x":410,"y":410,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
		"materials":100,"speed":0.35,"tracking":true,"boidyAll":4
		}
		io.to(id).emit("spec",["zoom",0.5])
		let a = this.placeWall(id,410,390,395,425,"player",{"id":id,"force":true},{"defense":3})
		this.players[id].boidy.push(a)
		 a = this.placeWall(id,425,425,395,425,"player",{"id":id,"force":true},{"defense":3})
		 this.players[id].boidy.push(a)

		 a = this.placeWall(id,410,390,425,425,"player",{"id":id,"force":true},{"defense":0.3})
		 this.players[id].boidy.push(a)
		 a = this.placeWall(id,410,390,425,425,"player",{"id":id,"force":true},{"defense":0.3})
		 this.players[id].boidy.push(a)


		}


		this.players[id].minRadius = this.getPlayerRadius(this.players[id])

		this.sendAllWombjects(id)
	}

	static pvuCounter = 0

	static playerVelUpdate(){

		this.pvuCounter += 1
		let objt = Object.keys(this.players)
		for(let i = 0; i < objt.length; i++){
			let p = this.players[objt[i]]
			if(p.dead){
				continue
			}

			if(p.reloading > 0){
				p.reloading -= 1
			}

			if(this.pvuCounter % 60 == 0){
				p.materials += 25
				io.to(p.id).emit("spec",["mat",Math.floor(p.materials)])
			}

			let cont = false
			p.boidy.forEach((BOI,i)=>{
				if(this.walls[BOI] == undefined){
					p.boidy.splice(i,1)
					p.boidyVect.splice(i,1)
					cont = true
				}
			})
			if(cont){
				continue
			}

			let dd = 0
				p.boidy.forEach((e)=>{
					if(this.walls[e].type == "player" || this.walls[e].playerIntegral){
						dd += 1
					}
				})

				if(dd < p.boidyAll){
					p.dead = true
					p.boidy.forEach((e)=>{
						this.walls[e].undying = false
					})
				continue
				}

			let tv = [0,0]
			if(p.keys.w == "a"){
				tv[1] -= 1
			}
			if(p.keys.a == "a"){
				tv[0] -= 1
			}
			if(p.keys.s == "a"){
				tv[1] += 1
			}
			if(p.keys.d == "a"){
				tv[0] += 1
			}

			let ttv = vectorNormalize([0,0,tv[0],tv[1]])
		
			p.vx += ttv[2]*p.speed
			p.vy += ttv[3]*p.speed
			p.vx *= 0.97
			p.vy *= 0.97

			p.x += p.vx
			p.y += p.vy


			for(let k = 0; k < p.boidyVect.length; k++){
				if(p.boidyVect[k][2] == "next"){
				this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y1 = ((p.boidyVect[k][1] * p.rotation[1] - p.boidyVect[k][0] * p.rotation[0]) + p.y)
				let K = k+1
				if(K == p.boidyVect.length){
					K = 0
				}
				
				this.walls[p.boidy[k]].x2 = ((p.boidyVect[K][0] * p.rotation[1] + p.boidyVect[K][1] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y2 = ((p.boidyVect[K][1] * p.rotation[1] - p.boidyVect[K][0] * p.rotation[0]) + p.y)
				} else {
				this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y1 = ((p.boidyVect[k][1] * p.rotation[1] - p.boidyVect[k][0] * p.rotation[0]) + p.y)
				this.walls[p.boidy[k]].x2 = ((p.boidyVect[k][2] * p.rotation[1] + p.boidyVect[k][3] * p.rotation[0]) + p.x)
				this.walls[p.boidy[k]].y2 = ((p.boidyVect[k][3] * p.rotation[1] - p.boidyVect[k][2] * p.rotation[0]) + p.y)
				}
			}

			if(distance(p.unmovePos[0],p.unmovePos[1],p.x,p.y) > 1 || p.unmovePos[2]){
			p.boidy.forEach((B)=>{
				this.updateWall(B)
			})
			p.unmovePos = [p.x,p.y,false]
			}

			io.to(objt[i]).emit("cameraUp",[p.x,p.y])
		}
	}


	static sendAllWombjects(plid){
		io.to(plid).emit("CROBJECT",[this.walls,this.players])
	}

	static wallSameTeamBullet(bullet,wall){
		if(bullet.shooter == wall.plid){
			return(true)
		}
		return(false)
	}


	static fdistClose(pl,en){
		let plr = pl.frad
		let plvr = Math.sqrt(pl.vx*pl.vx + pl.vy*pl.vy)
		let enr = en.frad
		let enli = en.lingerance ? en.lingerance : 1

		

		let FBDIST = plr+plvr*enli+enr
		if(distance(pl.x,pl.y,en.midpt[0],en.midpt[1]) <= FBDIST){
			return(false)
		}
		return(true)
	}

	static speedCurveCalc(f){
		// (o+a)*r

	}

	static RSTotal = 0
	static rpuCounter = 0
	static walldo = {}
	static repeat(){
		this.rpuCounter += 1
		let RSTIME = Date.now()

		let objkWD = Object.values(this.walldo)
		objkWD.forEach((e)=>{
			e(this.rpuCounter)
		})

		this.drawers = []
		if(Object.keys(this.wallPushers).length > 0){
			io.to("G10.2").emit("upwalls",this.wallPushers)
		}
		this.wallPushers = {}

		this.playerVelUpdate()

		// let wallsArr = Object.keys(this.walls)
		for(let k = this.bullets.length-1; k > -1; k--){
			let B = this.bullets[k]
			B.life--
			if(B.life < 0){

				if(this.bullets[k].onDeath !== undefined){
					this.bullets[k].onDeath(this.bullets[k])
				}

				this.bullets.splice(k,1)
				continue;
			}
			if(B.instant){
				k++
			}
			B.tick?B.tick(B):0
			let coled = "dn"

			
			let counter = 201

			let lastCol = {}
			let i = JSON.parse(JSON.stringify(B))
			let wallsArr = Object.keys(this.walls)
			let bspeed = distance(0,0,B.vx,B.vy)
			// let unhandledWalls = []
			while(coled != "stop" && counter > 0){

				counter --
				coled = "stop"
				let colsave = []
				
				for(let j = 0; j < wallsArr.length; j++){
					let w = this.walls[wallsArr[j]]

					if(w?.dead){
						continue
					}

					if(lastCol[wallsArr[j]] != undefined){
								let LC = lastCol[wallsArr[j]]
								if(LC == "single"){
										delete lastCol[wallsArr[j]]
										continue;

									}
									else if(LC == "infinite"){
										continue;
			
								}
							}

					if(w?.handle == undefined){
							
							if( w == undefined || this.wallSameTeamBullet(B,w)){
								continue;
							}
							let e = this.walls[wallsArr[j]]
							// let col = this.p5re(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							let col = this.pointLineCollision(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							if(col[4]){
								colsave.push([col,wallsArr[j],[i.x+i.vx,i.y+i.vy]])
								coled = "c1"
							}

					}else{
							switch(w.handle){
								case "bhol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										i.vx += (w.x-B.x)
										i.vy += (w.y-B.y)
										this.damageWall(wallsArr[j],B)
										bspeed *= w.velmult
										coled = "dn"
										lastCol[wallsArr[j]] = "infinite"
									}
									break;
								case "ghol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										let td = distance(w.x,w.y,B.x,B.y)
										let ad = 1000000/(td*td)
										let nor = vectorNormalize([0,0,w.x-B.x,w.y-B.y])
										ad = ad>50?50:ad
										i.vx += nor[2]*ad
										i.vy += nor[3]*ad
										// bspeed += distance(B.x,B.y,B.vx+nor[2]*ad,B.vy+nor[2]*ad)-bspeed
										this.damageWall(wallsArr[j],B)
										// if(td > 50){
										// bspeed *= w.velmult}
										coled = "dn"
										lastCol[wallsArr[j]] = "infinite"
									}
									break;
								case "whol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										let td = distance(w.x,w.y,B.x,B.y)
										let ad = 1000000/(td*td)
										let nor = vectorNormalize([0,0,w.x-B.x,w.y-B.y])
										ad = ad>80?80:ad
										i.vx -= nor[2]*ad
										i.vy -= nor[3]*ad
										// bspeed += distance(B.x,B.y,B.vx+nor[2]*ad,B.vy+nor[2]*ad)-bspeed
										this.damageWall(wallsArr[j],B)
										// if(td > 50){
										// bspeed *= w.velmult}
										coled = "dn"
										lastCol[wallsArr[j]] = "infinite"
									}
									break;
							}
					}
				}


			

				if(coled == "c1"){

					 	B.shooter = ""


						let f = 0
					if(colsave.length != 1){
						let fd = Infinity
						for(let I = 0; I < colsave.length; I++){
							let tempdist = distance(colsave[I][0][0],colsave[I][0][1],i.x,i.y)
							if(tempdist<fd){
								fd = tempdist
								f = I
							}
						}
					}
						let tj = colsave[f][1]
						let tcol = colsave[f][0]
					lastCol[tj] = "single"

					let WALL = this.walls[tj]
					let angleDamageMult = 1
					let DAM;
					if(B.unBouncer === undefined){
						let m1 = i.vy/i.vx //slope of bullet
						let m2 = (WALL.y1-WALL.y2)/(WALL.x1-WALL.x2) //slope of wall
						let angle;
						if(m2 == Infinity || m2 == -Infinity){
							angle = Math.PI/2-Math.abs(Math.atan(m1))
						} else if(m1 == Infinity || m1 == -Infinity){
							angle = Math.PI/2-Math.abs(Math.atan(m2))
						} else {
							angle = Math.abs(Math.atan((m1-m2)/(1+m1*m2)))
						}
						if(angle > Math.PI/2){angle = Math.PI-angle}
					  angleDamageMult = angle*2/Math.PI
						DAM = this.damageWall(tj,B,{"vx":i.vx,"vy":i.vy,"x":i.x,"y":i.y,"adp":angleDamageMult},tcol)
					} else {
						angleDamageMult = B.unBouncer
						DAM = this.damageWall(tj,B,{"vx":i.vx,"vy":i.vy,"x":i.x,"y":i.y,"adp":1},tcol)
					}


					if(DAM){
						let tw = this.walls[tj]
						tcol = this.p5rre(tcol,colsave[f][2][0],colsave[f][2][1],tw.x1,tw.y1,tw.x2,tw.y2)
						this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1],i.extra])
						i.x = tcol[0]
						i.y = tcol[1]
						let reverseADmgMult = 1-angleDamageMult
						// let actualMult = 1-(1-B.wallMult)*angleDamageMult
						let actualMult = (1 - (1 - B.wallMult)*angleDamageMult)*(1-(tw.wallMult?1-tw.wallMult:0.4)*angleDamageMult)
						if(actualMult < 0){actualMult = 0}
						if(B.ignoreWallMult !== undefined){actualMult = -B.ignoreWallMult * angleDamageMult
							i.vx *= actualMult
							i.vy *= actualMult
						} else{
							i.vx = actualMult*(tcol[2]-tcol[0])
							i.vy = actualMult*(tcol[3]-tcol[1])
						}
						// let actualMult = (tw.wallMult?1-(1-tw.wallMult)*angleDamageMult:1-0.4*angleDamageMult)
						// let actualMult = (tw.wallMult?tw.wallMult:1-0.4*reverseADmgMult)
						// i.vx = B.wallMult*(tcol[2]-tcol[0])*(tw.wallMult?tw.wallMult:0.6)*reverseADmgMult
						// i.vx = B.wallMult*(tcol[2]-tcol[0])*(tw.wallMult?tw.wallMult:0.6)
						// i.vy = B.wallMult*(tcol[3]-tcol[1])*(tw.wallMult?tw.wallMult:0.6)
						// bspeed *= B.wallMult*(tw.wallMult?tw.wallMult:0.6)

						
						bspeed *= actualMult

						if(tw.onDamage !== undefined){
							tw.onDamage(tw,B)
						}

					} else {
						this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1],i.extra])
						let avmult = B.penMult?B.penMult:0.3
						i.vx = (i.vx - (tcol[0] - i.x)) * avmult
						i.vy = (i.vy - (tcol[1] - i.y)) * avmult
						bspeed *= avmult
						i.x = tcol[0]
						i.y = tcol[1]
					}
				}

			}

			if(counter == 0){
				console.log("crashed here")
			}




			// B.tail.push([i.tailLength,i.x,i.y,i.x+i.vx,i.y+i.vy])
			// this.drawers.push([i.type,i.tailLength,i.x,i.y,i.x+i.vx,i.y+i.vy,i.extra])
	this.drawers.push([i.type,i.tailLength,
				parseFloat(i.x.toFixed(2)),
				parseFloat(i.y.toFixed(2)),
				parseFloat((i.x+i.vx).toFixed(2)),
				parseFloat((i.y+i.vy).toFixed(2)),i.extra])
			

			let vnorm = vectorNormalize([0,0,i.vx,i.vy])
			B.x = i.x + i.vx
			B.y = i.y + i.vy
			B.vx = vnorm[2] * bspeed
			B.vy = vnorm[3] * bspeed
			
				B.vx *= B.slowd
				B.vy *= B.slowd
	

				
			let sp = B.vx*B.vx + B.vy*B.vy 
				if(B.life > 6 &&  sp < 5+(B.deathVel?B.deathVel:0)){
					B.life = 5
				}
		}



		this.send()


		this.RSTotal += Date.now()-RSTIME
		if(this.rpuCounter % 40 === 0){
			this.RSTotal = 0
		}

	}
	static wallTypes = {
		"norm":true,"metl":true,"rflc":true,"player":true,"body":true,"mbdy":true
	}

	static delWall(wid){
		delete this.walldo[wid]
		delete this.walls[wid]
		this.wallPushers[wid] = "_DEL"
	}

	static damageWall(wid,b,o,tcol){
		let WALL = this.walls[wid]
		if(this.wallTypes[WALL.type]){
			let vy
			let vx
			let dp = 1
			if(o){
		 		vy = o.vy
		 		dp = o.adp
		 		if(b.ignoreAngleDamageMult){
		 			dp = b.ignoreAngleDamageMult
		 		}
		 		vx = o.vx
			} else {
				vy = b.vy
		 		vx = b.vx
			}

		WALL.hp -= 0.0065*(vx*vx+vy*vy)*(b.dmgmult?b.dmgmult:1)/this.walls[wid].defense*dp
		if(this.walls[wid].hp < 0 && !this.walls[wid].dead){
			this.walls[wid].dead = true
			if(this.walls[wid].onDeath !== undefined){
				this.walls[wid].onDeath(this.walls[wid],b)
			}
			if(!this.walls[wid].undying){
				delete this.walls[wid]
				this.wallPushers[wid] = "_DEL"
			return(false)
			} else {
				this.walls[wid].undying -= 1
			}
			this.updateWall(wid)
			return(true)
		}
		this.updateWall(wid)
		return(true)
		
		} else if(this.walls[wid].type == "bhol"){
			b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			delete this.walls[wid]
			this.wallPushers[wid] = "_DEL"
			return(false)
		}
		this.updateWall(wid)
		return(true)
		} else if(this.walls[wid].type == "whol"){
			b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			delete this.walls[wid]
			this.wallPushers[wid] = "_DEL"
			return(false)
		}
		this.updateWall(wid)
		return(true)
		} else if(this.walls[wid].type == "ghol"){
			// b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			delete this.walls[wid]
			this.wallPushers[wid] = "_DEL"
			return(false)
		}
	}
}
	static send(){

		this.drawers.forEach((e)=>{
			e.splice(1,1)
		})

		// io.to("G10.2").emit("drawers",[this.drawers])

		let pobjk = Object.keys(this.players)
		pobjk.forEach((e)=>{
			let p = this.players[e]
			if( p.tracking && pobjk.length > 1){
				let op;
				let traks = []
				for(let J = 0; J < pobjk.length; J++){
					if(e !== pobjk[J] && !this.players[pobjk[J]].dead){
						op = this.players[pobjk[J]]
						traks.push(["trak",p.x,p.y,op.x,op.y])
					}
				}
				// if(op === undefined){op = p}

				io.to(e).emit("drawers",[this.drawers,traks])
			// this.drawers.push([i.type,i.tailLength,i.x,i.y,i.x+i.vx,i.y+i.vy,i.extra])
			} else {
				io.to(e).emit("drawers",[this.drawers])
			}
		})

	}


	static updateWall(nuuid){

		// this.wallPushers[nuuid] = this.walls[nuuid]
		this.wallPushers[nuuid] = this.wallCompressor(nuuid)
	}
	static updateWall_MightBeDead(nuuid){
		if(this.walls[nuuid] === undefined){
			console.log("trying to update wrong wall! -> " + nuuid)
			return
		}
		this.wallPushers[nuuid] = this.wallCompressor(nuuid)
	}

	static wallCompressor(nuuid){
		let w = this.walls[nuuid]
		if(w == undefined){console.log(nuuid)}
		if(w.compression === undefined){
			return(w)
		}
		// return(w.compression(w))
		let r = {}
		w.compression.forEach((e)=>{
			r[e] = w[e]
		})
		return(r)
	}

	static pointLineCollision(x1,y1,x2,y2,x3,y3,x4,y4){
  let slopeL1 = (y2-y1)/(x2-x1)
  let slopeL2 = (y4-y3)/(x4-x3)
  if(slopeL1 != slopeL2){
    

    let yc = 0
    let xc = 0
    
    xc = (-slopeL2*x3 + y3 + slopeL1*x1 - y1)/(slopeL1-slopeL2)
    if(isNaN(xc)){if(slopeL1 == Infinity || slopeL1 == -Infinity){
      xc = x1
    } else {
      xc = x3
    }}
    yc = (xc-x1)*slopeL1+y1
    if(isNaN(yc)){yc = (xc-x3)*slopeL2+y3}
    let cola = myMath.pointInLine(xc,yc,x1,y1,x2,y2)
    let colb = myMath.pointInLine(xc,yc,x3,y3,x4,y4)
    let colc = (cola&&colb)
    return([xc,yc,cola,colb,colc])
  } else {
    return("none")
  }
}

	static playerKeyUpdate(e){
		this.players[e[0]].keys = e[1]
	}

	static disconnect(s){
		this.players[s.id].boidy.forEach((e)=>{
			if(this.walls[e]){
				this.walls[e].undying = false
			}
		})
		delete this.players[s.id]
	}

	static p5rre(a,px2,py2,MA,MB,MC,MD){
		if(a[4]){
    let nn = vectorNormal(MA,MB,MC,MD)    
    let nv = [px2-a[0],py2-a[1]]

    
    // let nv1 = [nv[0] * nn[2], nv[1] * nn[3]] // commented 23Feb12:55
    let mult = 2 * (nv[0] * nn[0] + nv[1] * nn[1])
    let nn2 = [nv[0]-nn[0]*mult,nv[1]-nn[1]*mult]
    
    // line(a[0],a[1],a[0]+nn2[0],a[1]+nn2[1])
    
    	return([a[0],a[1],a[0]+nn2[0],a[1]+nn2[1]])
    
  	} else {
  		return("noCol")
  	}
	}

	static getPlayerRadius(p){
		let mostDist = 0
		p.boidyVect.forEach((e)=>{
			let d = distance(0,0,e[0],e[1])
			let d2 = distance(0,0,e[2],e[2])
			d = d>d2?d:d2
			if(mostDist<d){mostDist=d}
		})
		return(mostDist)
	}

}


module.exports={shooter2C}