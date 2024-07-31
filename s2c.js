let io;
let myMath
let crypto = require("crypto")
let fs = require("fs")
function distance(x1,y1,x2,y2) {
	let a = x2-x1
	let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

let vectorNormalize;
let vectorFuncs;
function copyFuncs(v,v2){
	vectorNormalize = v
	vectorFuncs = v2
}

class shooter2C{
	static walls = {}

	static wallGroups = {"x":0,"y":0,"r":Infinity,"d":{}}
	//groupID:{x,y,radius,wallIds{}}

	static bullets = []
	//{x,y,vx,vy,tailLength,tail[l,x,y,tx,ty],life}
	static players = {}
	static keyholders = {}
	static drawers = []
	static wallPushers = {}
	static entityPushers = []
	static massPushers = {"specific":{},"general":{}}
	static mapFriction = 1

	static nuuIDGEN = 0
	static setio(i,m,v,v2){
		io = i
		myMath = m
		copyFuncs(v,v2)
	}

	static pushBullet(x,y,vx,vy,id,type){
		switch(type){


			case "norm":
				this.bullets.push({"shooter":id,"type":"norm","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"lingerance":10,"tailLength":10,"tail":[],"life":2000,"slowd":0.95})
				break;
			case "trav":
				this.bullets.push({"shooter":id,"type":"trav","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"lingerance":10,"tailLength":10,"tail":[],"life":2000,"slowd":1,"dmgmult":-0.00001})
				break;

			case "fire":
				this.bullets.push({"shooter":id,"type":"fire","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":0,"ignoreWallMult":1,
					"lingerance":10,"tailLength":10,"tail":[],"life":Math.floor(Math.random()*10)+10,"slowd":0.5,"dmgmult":4,
					"tick":(b)=>{
						b.vx += Math.random()*12-6
						b.vy += Math.random()*12-6
						b.vx *= 1.4-Math.random()*0.8
						b.vy *= 1.4-Math.random()*0.8
					},
					"onHit":(w,b,i)=>{
						i.vx *= 0.5
						i.vy *= 0.5
						i.vx += Math.random()*120-60
						i.vy += Math.random()*120-60
					}
				})
				break;
			case "scat":
				this.bullets.push({"shooter":id,"type":"scat","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"tailLength":6,"dmgmult":3,"lingerance":6,"tail":[],"life":2000,"slowd":0.95})
				break;
			case "scat2":
				this.bullets.push({"shooter":id,"type":"scat","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"tailLength":6,"dmgmult":1,"lingerance":6,"tail":[],"life":2000,"slowd":0.5})
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
						"slowd":1,"dmgmult":17,"ignoreAngleDamageMult":1,"extra":{"tailmult":3},
						"onHit":(w,b)=>{
							if(w.plid &&w.attached&& this.players[w.plid]){
								this.KB(this.players[w.plid],vx/10,vy/10)
							}
						}
					})
				break;

			case "heal":
				this.bullets.push({"shooter":id,"type":"heal","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,
					"lingerance":2,"dmgmult":-1,"tailLength":2,"tail":[],"life":20,"slowd":0.98})
				break;
			case "dril":
				this.bullets.push({"shooter":id,"type":"dril","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":0.2,
					"lingerance":2,"dmgmult":3,"tailLength":2,"tail":[],"life":2,"slowd":0.9,"extra":{"tailmult":3}})
				break;
			case "dbdril":
				this.bullets.push({"shooter":id,"type":"dril","x":x,"y":y,"vx":vx*150,"vy":vy*150,"wallMult":0.2,
					"lingerance":2,"dmgmult":1003,"tailLength":2,"tail":[],"life":7,"slowd":0.9,"extra":{"tailmult":3}})
				break;
			case "grnd":
				this.bullets.push({"shooter":id,"type":"grnd","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,"deathVel":10,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":2000,"slowd":0.82,"extra":{"tailmult":8},
					"onDeath":(b)=>{
						
							Object.values(this.bullets).forEach((e)=>{
								let dst = distance(e.x,e.y,b.x,b.y)
								if(dst<900){
									let inverse = 1/dst
									let min = 50
									e.vx += Math.max(-min, Math.min((e.x-b.x)*inverse*inverse*15000, min))
									e.vy += Math.max(-min, Math.min((e.y-b.y)*inverse*inverse*15000, min))
									e.deathVel?e.deathVel*=2:e.deathVel=200
								}
							})
						for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*150-75,Math.random()*150-75,b.shooter,"norm")
							a.slowd = 0.95
							a.dmgmult = 35
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;

					}
					io.to("G10.2").emit("particle",[{"type":"explosion","x":b.x,"y":b.y}])
					Object.values(this.players).forEach((e)=>{
								if(e.dead){return}
								let dst = distance(e.x,e.y,b.x,b.y)
								if(dst<500){
									let inverse = 1/dst
									let min = 50
									e.vx += Math.max(-min, Math.min((e.x-b.x)*inverse*inverse*5000/e.weight*e.speed, min))
									e.vy += Math.max(-min, Math.min((e.y-b.y)*inverse*inverse*5000/e.weight*e.speed, min))
								}
							})

				}
				})
				break;
			case "grnd2":
				this.bullets.push({"shooter":id,"type":"grnd","x":x,"y":y,"vx":vx,"vy":vy,"wallMult":1,"deathVel":10,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":2000,"slowd":0.82,"extra":{"tailmult":8},
					"onDeath":(b)=>{
						
						this.KBR(b.x,b.y)
							
						for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*400-200,Math.random()*400-200,b.shooter,"norm")
							a.slowd = 0.5
							a.dmgmult = 10
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;

					}
							

				}
				})
				break;
			case "encn2":
				this.bullets.push({"shooter":id,"type":"encn","x":x,"y":y,"vx":vx*200,"vy":vy*200,"wallMult":0,"deathVel":10,"penMult":0,"unBouncer":1,
					"lingerance":4,"dmgmult":2,"tailLength":4,"tail":[],"life":1001,"slowd":1.1,"extra":{"tailmult":3},"skipTick":20,"deathTimer":0,
					"onDeath":(b)=>{
						
						this.KBR(b.x,b.y,{"explosionType":"encn explosion"})
							
						for(let i = 0; i < 20; i++){
							let a = this.pushBullet(b.x,b.y,Math.random()*400-200,Math.random()*400-200,b.shooter,"norm")
							a.slowd = 0.5 + 0.1 * Math.random()
							a.dmgmult = 10
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;

							
							}
							for(let i = 0; i < 20; i++){
								this.pushBullet(b.x+Math.random()*6-3,b.y+Math.random()*6-3,Math.random()*400-200,Math.random()*400-200,b.shooter,"zapr")
								this.bullets[this.bullets.length-1].ignoreWallMult = -1
								this.bullets[this.bullets.length-1].penMult = 1
								this.bullets[this.bullets.length-1].unBouncer = 1
								this.bullets[this.bullets.length-1].life += Math.floor(Math.random()*14)
								this.bullets[this.bullets.length-1].extra.tailLength = 60
								this.bullets[this.bullets.length-1].extra.tailmult = 0.1
								this.bullets[this.bullets.length-1].instant = false
									this.bullets[this.bullets.length-1].dmgmult *= 60
							}
							

				}
				})
				break;
			case "encn3":
				this.bullets.push({"shooter":id,"type":"encn","x":x,"y":y,"vx":vx*2200,"vy":vy*2200,"wallMult":0,"deathVel":10,"penMult":0,"unBouncer":1,
					"lingerance":4,"dmgmult":200,"tailLength":4,"tail":[],"life":41,"slowd":1.1,"extra":{"tailmult":3},"skipTick":20,"deathTimer":0,
					"onDeath":(b)=>{
						
						this.KBR(b.x,b.y,{"explosionType":"encn explosion"})
							
						for(let i = 0; i < 20; i++){
							let a = this.pushBullet(b.x,b.y,Math.random()*400-200,Math.random()*400-200,b.shooter,"norm")
							a.slowd = 0.5 + 0.1 * Math.random()
							a.dmgmult = 5
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;

							
							}
							for(let i = 0; i < 20; i++){
								this.pushBullet(b.x+Math.random()*6-3,b.y+Math.random()*6-3,Math.random()*400-200,Math.random()*400-200,b.shooter,"zapr")
								this.bullets[this.bullets.length-1].ignoreWallMult = -1
								this.bullets[this.bullets.length-1].penMult = 1
								this.bullets[this.bullets.length-1].unBouncer = 1
								this.bullets[this.bullets.length-1].life += Math.floor(Math.random()*14)
								this.bullets[this.bullets.length-1].extra.tailLength = 60
								this.bullets[this.bullets.length-1].extra.tailmult = 0.1
								this.bullets[this.bullets.length-1].instant = false
									this.bullets[this.bullets.length-1].dmgmult *= 60
								if(Math.random()>0.9){
									this.bullets[this.bullets.length-1].dmgmult *= 3
								}
							}
							

				}
				})
				break;
			case "encn":
				this.bullets.push({"shooter":id,"type":"encn","x":x,"y":y,"vx":vx*200,"vy":vy*200,"wallMult":0,"deathVel":10,"penMult":0,"unBouncer":1,
					"lingerance":4,"dmgmult":200,"tailLength":4,"tail":[],"life":1001,"slowd":1,"extra":{"tailmult":3},"skipTick":40,"deathTimer":0,
					"onDeath":(b)=>{
						
						this.KBR(b.x,b.y,{"explosionType":"encn explosion"})
							
						for(let i = 0; i < 18; i++){
							let a = this.pushBullet(b.x,b.y,Math.random()*400-200,Math.random()*400-200,b.shooter,"norm")
							a.slowd = 0.5 + 0.1 * Math.random()
							a.dmgmult = 10
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;

							
							}
							let bolts = 8 + Math.floor(Math.random()*12)
							for(let i = 0; i < bolts; i++){
								this.pushBullet(b.x+Math.random()*6-3,b.y+Math.random()*6-3,Math.random()*400-200,Math.random()*400-200,b.shooter,"zapr")
								this.bullets[this.bullets.length-1].ignoreWallMult = -1
								this.bullets[this.bullets.length-1].penMult = 1
								this.bullets[this.bullets.length-1].unBouncer = 1
								this.bullets[this.bullets.length-1].life += Math.floor(Math.random()*4)
								this.bullets[this.bullets.length-1].extra.tailLength = 60
								this.bullets[this.bullets.length-1].extra.tailmult = 0.1
								this.bullets[this.bullets.length-1].instant = false
									this.bullets[this.bullets.length-1].dmgmult *= 80
							}
							

				}
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
			case "zapr2":
				this.bullets.push({"shooter":id,"type":"zapr2","x":x,"y":y,"vx":vx/3,"vy":vy/3,"wallMult":0,"deathVel":10,"unBouncer":1,
					"tailLength":4,"dmgmult":2,"lingerance":2,"tail":[],"life":8,"slowd":1,"extra":{"tailmult":2},"instant":true,
					"tick":(b)=>{
						b.vx += Math.random()*120-60
						b.vy += Math.random()*120-60
					},
					"onHit":(w,b)=>{
						this.pushBullet(b.x,b.y,b.vx,b.vy,b.shooter,"zapr")
						this.bullets[this.bullets.length-1].ignoreWallMult = -1
						this.bullets[this.bullets.length-1].penMult = 1
						this.bullets[this.bullets.length-1].unBouncer = 1
						this.bullets[this.bullets.length-1].dmgmult = b.life * b.dmgmult
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
					"lingerance":4,"deathTimer":5,"dmgmult":0,"tailLength":4,"tail":[],"life":50,"slowd":1.18,"extra":{"tailmult":8},"date":Date.now(),
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
			case "spawner":
			case "spawner2":
				if(!this.keyholders[id]){return}
				let rndlist = ["shld1","snpr1","ntri1","ntri2","ntri3","ntri4","ntri6"]
				let team = type
				if(type == "spawner2"){
					rndlist.push("ntri5")
					rndlist.push("ntri7")
					rndlist.push("ntri8")
					rndlist.push("tank1")
					rndlist.push("tank2")
					rndlist.push("tank3")
					rndlist.push("tank4")
					team = Math.random()+""
				}
				let rnd = rndlist[Math.floor(Math.random()*rndlist.length)]
				let en = this.entityTemplates(rnd,2,{"team":team,"x":x+Math.random()*3000-1500,"y":Math.random()*3000-1500+y})
				en.reloadMultiplier = 3
				en.noTeamfire=true
				en.speed = 0.6
				break;

			case "keyheal":
				if(!this.keyholders[id]){return}
				this.players[id].boidy.forEach((e)=>{
					this.walls[e].defense = 10
					this.walls[e].hp = 1000
				})
				break;

			case "kbml":
				this.bullets.push({"shooter":id,"type":"msl2","x":x,"y":y,"vx":vx/6,"vy":vy/6,"wallMult":0,"deathVel":10,"unBouncer":1,
					"deathTimer":1,"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":50,"slowd":1.18,"extra":{"tailmult":8},"date":Date.now(),
					"onDeath":(b)=>{
						let dd = Date.now()
						let dmg = b.dmg?b.dmg:((dd-b.date)*(dd-b.date)/250000)
							for(let i = 0; i < 20; i++){let a = this.pushBullet(b.x,b.y,Math.random()*300-150+vx*0.1,Math.random()*300-150+vy*0.1,b.shooter,"norm")
							a.slowd = 0.5
							a.life = 50
							a.dmgmult = dmg
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
							}
							// Object.values(this.players).forEach((e)=>{
							// 	if(e.dead){return}
							// 	let dst = distance(e.x,e.y,b.x,b.y)
							// 	if(dst<500){
							// 		let inverse = 1/dst
							// 		let min = 50
							// 		e.vx += Math.max(-min, Math.min((e.x-b.x)*inverse*inverse*7000/e.weight*e.speed, min))
							// 		e.vy += Math.max(-min, Math.min((e.y-b.y)*inverse*inverse*7000/e.weight*e.speed, min))
							// 	}
							// })
							// io.to("G10.2").emit("particle",[{"type":"explosion","x":b.x,"y":b.y}])
							this.KBR(b.x,b.y,{"pkb":0.7,"noBulletBounce":true,"playerBounceMax":30})
						
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
			case "tlpt":
				this.bullets.push({"shooter":id,"type":"tlpt","x":x,"y":y,"vx":vx*2,"vy":vy*2,"wallMult":0,"deathVel":10,"ignoreWallMult":-0.9,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":100,"slowd":0.6,"extra":{"tailmult":1},"deathVel":2000,
					"onDeath":(b)=>{
						if(!this.players[id]){return}
						this.players[id].x = b.x
						this.players[id].y = b.y
					}
				})
				break;
			case "dbtp":
				if(!this.keyholders[id]){return}
				this.bullets.push({"shooter":id,"type":"tlpt","x":x,"y":y,"vx":vx*2000,"vy":vy*2000,"wallMult":0,"deathVel":10,"ignoreWallMult":-0.9,
					"lingerance":4,"dmgmult":0,"tailLength":4,"tail":[],"life":100,"slowd":0.6,"extra":{"tailmult":1},"deathVel":2000,
					"onDeath":(b)=>{
						if(!this.players[id]){return}
						this.players[id].x = b.x
						this.players[id].y = b.y
					}
				})
				break;

		}
		return(this.bullets[this.bullets.length-1])
	}

	static playerLook(p,x,y){
		let n = vectorFuncs.originVectorNormalize(x-p.x,y-p.y)
		p.rotation = [n[0],n[1]]
		p.unmovePos[2] = true
	}

	static playerHoldDown(id,x,y,w){ //clickupper id, x, y, weapon
		let p = this.players[id]
		p.holdDownPos = [x,y,p.x+x,p.y+y,Date.now()]
		this.playerClick(id,p.holdDownPos[2]-p.x,p.holdDownPos[3]-p.y,w,{"holdDown":true})
	}

	static playerClickUp(id,x,y,w){ //clickupper id, x, y, weapon
		let p = this.players[id]
		this.playerClick(id,p.holdDownPos[2]-p.x,p.holdDownPos[3]-p.y,w,{"release":true})
	}

	static playerClick(id,x,y,w,extra={}){
		let p = this.players[id]
		if(p.reloading > 0 || p.reloading == undefined || (p.dead&&!this.keyholders[id])){
			return;
		}
		if(p.materials < 0 && !p.entity){return}
		if(w === undefined){
			w = p.lastWeapon
		} else {
			p.lastWeapon = w
		}

		let n = vectorNormalize([p.x,p.y,x+p.x,y+p.y])
		p.rotation = [n[2]-p.x,n[3]-p.y]
		p.unmovePos[2] = true
		let reload = 0
		let theBullet;
		switch(w){
			case "norm":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"norm")
				reload += 4
				break;
			case "trav":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"trav")
				reload += 4
				break;
			case "dbtrav":
				theBullet = this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"trav")
				theBullet.dmgmult = -200
				reload += 4
				break;
			case "mchg":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160+Math.random()*30-15,(n[3]-p.y)*160+Math.random()*30-15,id,"scat")
				reload += 2
				break;
			case "snpr":
				theBullet = this.pushBullet(p.x,p.y,(n[2]-p.x)*190+p.vx,(n[3]-p.y)*190+p.vy,id,"norm")
				theBullet.dmgmult = 4
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
			case "scat2":
			for(let i = 0; i < 7; i++){
				this.pushBullet(p.x,p.y,(n[2]-p.x)*310+Math.random()*140-70,(n[3]-p.y)*310+Math.random()*140-70,id,"scat2")
			}
			this.KB(p,-(n[2]-p.x)*5,-(n[3]-p.y)*5)
		reload += 30
				break;
			case "kb":
					if(extra.release){
						if(Date.now()-p.holdDownPos[4] < 1000){return}
						this.KBR(p.holdDownPos[2],p.holdDownPos[3])
							
						for(let i = 0; i < 20; i++){
							let a = this.pushBullet(p.holdDownPos[2],p.holdDownPos[3],Math.random()*400-200,Math.random()*400-200,id,"norm")
							a.slowd = 0.5
							a.dmgmult = 10
							a.extra = {"tailmult":3,"tailLength":6}
							a.tailLength = 6; a.lingerance = 6;
						}
					} else {
						io.to("G10.2").emit("particle",[{"type":"conc","x":p.holdDownPos[2],"y":p.holdDownPos[3]}])
					}
					
				break;
			case "dbheal":
					if(extra.release){
						let warr = this.getWallsInRadius(p.holdDownPos[2],p.holdDownPos[3],(Date.now()-p.holdDownPos[4])/3)
						warr.forEach((e)=>{if(this.walls[e].hp<1000){this.walls[e].hp = 1000;this.updateWallHP(e)}})
						io.to("G10.2").emit("particle",[{"type":"dbheal_bounded","x":p.holdDownPos[2],"y":p.holdDownPos[3],"r":(Date.now()-p.holdDownPos[4])/3}])
					} else {
						io.to("G10.2").emit("particle",[{"type":"dbheal_bounding","x":p.holdDownPos[2],"y":p.holdDownPos[3]}])
					}
					
				break;
			case "bounder":
					if(extra.release){
						this.groupStaticWalls2(p.holdDownPos[2],p.holdDownPos[3],(Date.now()-p.holdDownPos[4])/3)
						io.to("G10.2").emit("particle",[{"type":"bounded","x":p.holdDownPos[2],"y":p.holdDownPos[3],"r":(Date.now()-p.holdDownPos[4])/3}])
					} else {
						io.to("G10.2").emit("particle",[{"type":"bounding","x":p.holdDownPos[2],"y":p.holdDownPos[3]}])
					}
					
				break;
			case "bounder2":
					if(extra.release){
						this.groupStaticWalls2(p.holdDownPos[2],p.holdDownPos[3],(Date.now()-p.holdDownPos[4])*3)
						io.to("G10.2").emit("particle",[{"type":"bounded","x":p.holdDownPos[2],"y":p.holdDownPos[3],"r":(Date.now()-p.holdDownPos[4])*3}])
					} else {
						io.to("G10.2").emit("particle",[{"type":"bounding2","x":p.holdDownPos[2],"y":p.holdDownPos[3]}])
					}
					
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
				// p.vx -= (n[2]-p.x)*10
				// p.vy -= (n[3]-p.y)*10
				this.KB(p,(n[2]-p.x)*-10,(n[3]-p.y)*-10)
				this.pushBullet(p.x,p.y,(n[2]-p.x)*100,(n[3]-p.y)*100,id,"cnon")
		reload += 10
				break;
			case "fire":
				this.KB(p,-(n[2]-p.x),-(n[3]-p.y))
				this.pushBullet(p.x,p.y,(n[2]-p.x)*200+Math.random()*100-50,(n[3]-p.y)*200+Math.random()*100-50,id,"fire")
		reload += 2
				break;
			case "heal":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"heal")
				break;
			case "dril":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"dril")
				break;
			case "grnd":
				if(extra.holdDown){return}
				this.pushBullet(p.x,p.y,x/4+p.vx,y/4+p.vy,id,"grnd")
					reload += 20
					p.materials -= 5
				break;
			case "grnd2":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"grnd2")
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
			case "zapr2":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*1100,(n[3]-p.y)*1100,id,"zapr2")
				reload += 40
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
			case "unloader":
				if(!this.keyholders[p.id]){return}
				reload -= 2000000
				p.materials += 100
				break;
			case "kbml":
				let b = this.pushBullet(p.x,p.y,(n[2]-p.x)*380+p.vx,(n[3]-p.y)*380+p.vy,id,"kbml")
				b.slowd = 1
				b.dmg = 2.3
				reload += 40
				p.materials -= 30
				break;
			case "kbml2":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"kbml").deathTimer = 5
				reload += 2
				p.materials -= 1
				break;
			case "vipr":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*80+p.vx,(n[3]-p.y)*80+p.vy,id,"vipr")
				reload += 2
				p.materials -= 1
				break;
			case "tlpt":
				this.pushBullet(p.x,p.y,(n[2]-p.x)*160,(n[3]-p.y)*160,id,"tlpt")
				reload += 20
				break;
			default:
				this.pushBullet(p.x,p.y,(n[2]-p.x),(n[3]-p.y),id,w)
				reload += 1
		}
		p.reloading += reload*(p.reloadMultiplier?p.reloadMultiplier:1);
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
		} else if(t == "ghol" ||t == "bhol"||t == "whol" || t=="grv1" || t == "grv2"){
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
		let vect = [
					(ar[0] * p.rotation[1] - ar[1] * p.rotation[0]),
					(ar[1] * p.rotation[1] + ar[0] * p.rotation[0]),
					(ar[2] * p.rotation[1] - ar[3] * p.rotation[0]),
					(ar[3] * p.rotation[1] + ar[2] * p.rotation[0])]
		p.boidyVect.push(vect)
				p.unmovePos[2] = true
				p.boidy.push(a)
				this.entityPushers.push({"type":"create","v":vect,"id":p.id,"wid":a})
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

		if(wLength < 40 && (type=="norm" || type == "metl" || type == "rflc" || type=="wall") && !options.force){
			return
		}
		if(x1 === null){return}

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
				} else {
					this.walls[a].playerCollision = true
				}
				break;
			case "wall":
				this.walls[a] = {
					"type":"wall","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":50,
					"frad":wLength/2
				}
				if(options.attach){
					this.playerWall(p,ar,a)
				} else {
					this.walls[a].playerCollision = true
				}
				break;
			case "infwall":
				this.walls[a] = {
					"type":"wall","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":39999,
					"frad":wLength/2
				}
				if(options.attach){
					this.playerWall(p,ar,a)
				} else {
					this.walls[a].playerCollision = true
				}
				break;
			case "rbuildc":
				this.walls[a] = {
					"type":"metl","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":5,
					"frad":wLength/2
				}
				let wallInfo = {"lx":x2,"ly":y2,"vx":x2-x1,"vy":y2-y1,"chaos":1+Math.random()*2,"proliferate":2}
				for(let i = 0; i < 7; i++){
					let wle = distance(0,0,wallInfo.vx,wallInfo.vy)
					if(wle<50){
						wallInfo.vx*=2
						wallInfo.vy*=2
					} else if(wle > 500){
						wallInfo.vx*=0.5
						wallInfo.vy*=0.5
						i--
					}
					wallInfo.vx+= wallInfo.vx*(Math.random()*wallInfo.chaos-wallInfo.chaos/2)
					wallInfo.vy+= wallInfo.vy*(Math.random()*wallInfo.chaos-wallInfo.chaos/2)
					this.placeWall(player,wallInfo.lx,wallInfo.ly,wallInfo.lx+wallInfo.vx,wallInfo.ly+wallInfo.vy,"metl",{"force":true})
					wallInfo.lx+=wallInfo.vx
					wallInfo.ly+=wallInfo.vy
					if(Math.random()>0.9 && wallInfo.proliferate >0){
						wallInfo.proliferate -= 1
						this.placeWall(player,wallInfo.lx,wallInfo.ly,wallInfo.lx+wallInfo.vx+Math.random()*50-25,wallInfo.ly+wallInfo.vy+Math.random()*50-25,"rbuild",{"force":true})
					}
				}


				if(options.attach){
					this.playerWall(p,ar,a)
				} else {
					this.walls[a].playerCollision = true
				}
				break;
			case "dbuild":
				this.walls[a] = {
					"type":"metl","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":5,
					"frad":wLength/2
				}
				{
					let wallInfo = {"lx":x2,"ly":y2,"vx":x2-x1,"vy":y2-y1,"chaos":1+Math.random()*2}
				for(let i = 0; i < 700; i++){
					let wle = distance(0,0,wallInfo.vx,wallInfo.vy)
					wallInfo.vx+= wallInfo.vx*(Math.random()*wallInfo.chaos-wallInfo.chaos/2)
					wallInfo.vy+= wallInfo.vy*(Math.random()*wallInfo.chaos-wallInfo.chaos/2)
					this.placeWall(player,wallInfo.lx,wallInfo.ly,wallInfo.lx+wallInfo.vx,wallInfo.ly+wallInfo.vy,"metl",{"force":true})
					wallInfo.lx+=wallInfo.vx
					wallInfo.ly+=wallInfo.vy
				}


				if(options.attach){
					this.playerWall(p,ar,a)
				} else {
					this.walls[a].playerCollision = true
				}
				}
				
				break;
			case "rbuild":
				this.walls[a] = {
					"type":"metl","x1":x1,"y1":y1,"x2":x2,"y2":y2,
					"hp":1000,"midpt":myMath.midPointOfLine(x1,y1,x2,y2),
					"defense":5,
					"frad":wLength/2
				}
				{
				let wallInfo = {"lx":x2,"ly":y2,"vx":x2-x1,"vy":y2-y1,"chaos":(Math.random()*200+20),"proliferate":2}
				let stack = options.stack?options.stack+1:1
				for(let i = 0; i < 7; i++){
					let wle = distance(0,0,wallInfo.vx,wallInfo.vy)
					if(wle<50){
						wallInfo.vx*=1.2
						wallInfo.vy*=1.2
					} else if(wle > 500){
						wallInfo.vx*=0.8
						wallInfo.vy*=0.8
						i--
					}
					wallInfo.vx+= (Math.random()*wallInfo.chaos-wallInfo.chaos/2)
					wallInfo.vy+= (Math.random()*wallInfo.chaos-wallInfo.chaos/2)
					this.placeWall(player,wallInfo.lx,wallInfo.ly,wallInfo.lx+wallInfo.vx,wallInfo.ly+wallInfo.vy,"metl",{"force":true})
					wallInfo.lx+=wallInfo.vx
					wallInfo.ly+=wallInfo.vy
					if(Math.random()>0.8 && wallInfo.proliferate >0 && stack < 8){
						wallInfo.proliferate -= 1
						this.placeWall(player,wallInfo.lx,wallInfo.ly,wallInfo.lx+wallInfo.vx+Math.random()*50-25,wallInfo.ly+wallInfo.vy+Math.random()*50-25,"rbuild",{"force":true,"stack":stack+1})
					}
				}}


				if(options.attach){
					this.playerWall(p,ar,a)
				} else {
					this.walls[a].playerCollision = true
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
//17 07 2024 deleted body and a lot of commented stuff
			case "bhol":
				this.walls[a] = {
					"type":"bhol","x":x1,"y":y1,"radius":160,"velmult":0.95,
					"midpt":[x1,y1],"handle":"bhol","hp":4000,
					"defense":1,
					"frad":x2
				}
				break;
			case "grv1":
				this.walls[a] = {
					"type":"bhol","x":x1,"y":y1,"radius":1600,"velmult":1.05,
					"midpt":[x1,y1],"handle":"bhol","hp":400000,"strength":0.025,
					"defense":1,
					"frad":x2
				}
				break;
			case "spawnpad":
			case "spawnpad2":
				let team = type
				this.walls[a] = {
					"type":"whol","x":x1,"y":y1,"radius":160,"velmult":0.98,
					"midpt":[x1,y1],"handle":"whol","hp":1000,
					"defense":0.2,
					"frad":x2,"onDeath":(w,b)=>{this.delWall(a)},
					"spawns":["ntri6","ntri6","ntri6","ntri6","ntri6"]
					
				}
				if(type == "spawnpad2"){
					team = Math.random()+""
					this.walls[a].spawns = ["ntri1","ntri2","ntri3","ntri4","ntri6","tank1","ntri7","tank2","snpr1","shld1"]
				}
				this.walldo[a] = (t)=>{
						let w = this.walls[a]
						if(!w.entity || !this.players[w.entity]){
						let rnd = w.spawns[Math.floor(Math.random()*w.spawns.length)]
						w.entity = this.entityTemplates(rnd,2,{"team":team,"x":x1+Math.random()*150-75,"y":y1+Math.random()*150-75}).id
						this.players[w.entity].speed *= 1+Math.random()
						this.players[w.entity].noTeamfire=true
					}
				}
				break;

			case "spawnpoint":
				this.walls[a] = {
					"type":"whol","x":x1,"y":y1,"radius":60,"velmult":0.98,
					"midpt":[x1,y1],"handle":"whol","hp":100,
					"defense":0.2,
					"frad":x2,"onDeath":(w,b)=>{this.delWall(a)},
					"spawns":["ntri6","ntri6","ntri6","ntri6","ntri6"]
					
				}
				p.spawnPoint = this.walls[a]
				break;
			case "ghol":
				this.walls[a] = {
					"type":"ghol","x":x1,"y":y1,"radius":460,"velmult":0.98,
					"midpt":[x1,y1],"handle":"ghol","hp":4000,
					"defense":1,
					"frad":x2
				}
				break;
			case "grv2":
				this.walls[a] = {
					"type":"ghol","x":x1,"y":y1,"radius":11460,"velmult":0.98,
					"midpt":[x1,y1],"handle":"ghol","hp":400000,"strength":9,
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
						let distanceToPlayer = distance(TPP.x,TPP.y,x1,y1)
						if(distanceToPlayer < this.walls[a].radius && TTP != player && !TPP.dead){
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
								if(col !== "none" && col[4] && distanceToPlayer > distance(x1,y1,col[0],col[1])){
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

		if(options.regen && this.keyholders[p.id]){
			this.walls[a].undying = 4
			this.walls[a].onDeath = (w,b)=>{if(w.undying<1){return};setTimeout(()=>{w.hp = 1000; w.dead = undefined; this.updateWall_MightBeDead(w.id)},options.regen*1000)}
		}

		if(special != undefined){
			let targs = Object.keys(special)
			targs.forEach((e)=>{
				this.walls[a][e] = special[e]
			})
		}

		if(options.attach){
			p.currentRadius = this.getPlayerRadius(p)
			p.weight = p.currentRadius/p.minRadius
			this.walls[a].attached = true
		}

		this.walls[a].id = a
		this.wallGroups.d[a] = "wall"
		this.updateWall(a)
		return(a)
	}
	static initiatePlayer(id,type){

		if(type == undefined || type == "ntri"){

			this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
				"boidyVect":[[0,-40,30,30],[30,30,-30,30],[-30,30,0,-40]],
				"boidy":[],"x":0,"y":0,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
				"materials":100,"speed":1.5,"boidyAll":3,"tracking":false
			}
			io.to(id).emit("spec",["zoom",1])

			let a = this.placeWall(id,410,390,395,425,"player",{"id":id,"force":true})
			this.players[id].boidy.push(a)
			 a = this.placeWall(id,425,425,395,425,"player",{"id":id,"force":true},{"defense":3})
			 this.players[id].boidy.push(a)

			 a = this.placeWall(id,410,390,425,425,"player",{"id":id,"force":true})
			 this.players[id].boidy.push(a)
		} else if(type == "shld") {
			
			this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
			"boidyVect":[[10,40,30,-30],[30,-30,-30,-30],[-30,-30,-10,40],[-10,40,10,40],[-70,45,-10,57],[10,57,70,45]],
			"boidy":[],"x":0,"y":0,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
			"materials":100,"speed":0.5,"tracking":false,"boidyAll":4,"movement":"spontaneous"
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
		"boidy":[],"x":0,"y":0,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
		"materials":100,"speed":0.5,"tracking":false,"boidyAll":4
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
		"boidy":[],"x":0,"y":0,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
		"materials":100,"speed":0.35,"tracking":false,"boidyAll":4
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

		} else{ 
		// if(type == "spec"){

			this.players[id] = {"reloading":0,"unmovePos":[0,0],"rotation":[0,1],
				"boidyVect":[],
				"boidy":[],"x":0,"y":0,"vx":0,"vy":0,"hp":100,"id":id,"keys":{},
				"materials":100,"speed":2,"boidyAll":-1,"dead":true,"spectator":true,"minRadius":1,"currentRadius":1,"tracking":false
			}
			io.to(id).emit("spec",["zoom",0.6])
		}


		if(this.players[id].spectator){
			this.players[id].minRadius = this.players[id].currentRadius = 1
		} else {
		this.players[id].minRadius = this.players[id].currentRadius = this.getPlayerRadius(this.players[id])
		}
		this.players[id].boidy.forEach((e)=>{
			this.walls[e].attached = true
		})

		this.players[id].weight = 1
		this.players[id].horsePower = 1
		this.players[id].tv = [0,0]

		this.players[id].color = Math.floor(this.stringToRandomNumber(this.players[id].team?this.players[id].team:id)*360)


		this.sendAllWombjects(id)
		io.to("G10.2").emit("upEntities",[{"type":"createEntity","entity":this.players[id]}])

		this.entityPushers.push({"type":"pos","id":this.players[id].id,"x":this.players[id].x,"y":this.players[id].y,"r":this.players[id].rotation})
		this.massPushers.specific[id] = {"cameraUp":[this.players[id].x.toFixed(4),this.players[id].y.toFixed(4)]}
		return(this.players[id])
	}

	static pvuCounter = 0

	static stringToRandomNumber(str) {
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  const decimalPortion = parseInt(hash.slice(0, 8), 16) / parseInt('FFFFFFFF', 16);
  return decimalPortion;
}

	static playerVelUpdate(){


		this.pvuCounter += 1
		this.entityUpdate()

		let objt = Object.keys(this.players)
		for(let ii = 0; ii < objt.length; ii++){
			let p = this.players[objt[ii]]
			if(p.dead && !p.spectator){
				continue
			}

			if(p.reloading > 0){
				p.reloading -= 1
			}

			if(this.pvuCounter % 60 == 0){
				p.materials += 25
				io.to(p.id).emit("spec",["mat",Math.floor(p.materials)])
			}

			let cont = false //overhauled jun1524
			// p.boidy.forEach((BOI,i)=>{
			// 	if(this.walls[BOI] == undefined){
			// 		p.boidy.splice(i,1)
			// 		p.boidyVect.splice(i,1)
			// 		cont = true
			// 	}
			// })
			for(let j = p.boidy.length-1; j > -1; j--){
				if(this.walls[p.boidy[j]] == undefined){
					p.boidy.splice(j,1)
					p.boidyVect.splice(j,1)
					// this.entityPushers[]
					cont = true
				}
			}
			if(cont){
				p.currentRadius = this.getPlayerRadius(p)
				p.weight = p.currentRadius/p.minRadius
			// 	continue //commented jun 15 24, seemingly does nothing?
			}          

			let dd = 0
				p.boidy.forEach((e)=>{
					if(this.walls[e].type == "player" || this.walls[e].playerIntegral){
						dd += 1
					}
				})

				if(dd < p.boidyAll){
					if(p.onDeath){p.onDeath(p)}
					if(p.spawnPoint && p.spawnPoint.hp>0){
						setTimeout(()=>{
							let np = this.initiatePlayer(p.id,p.type)
							np.x = p.spawnPoint.x
							np.y = p.spawnPoint.y
							np.spawnPoint = p.spawnPoint
						},1500)
					}

					p.dead = true
					p.boidy.forEach((e)=>{
						this.walls[e].undying = false
						this.walls[e].attached = false
					})
					if(p.entity){
						this.disconnect({"id":p.id})
					}
					
				this.entityPushers.push({"type":"dead","id":p.id})
				continue
				}

			if(!p.entity && !p.tv[2] ){p.tv = [0,0]}
			let tv = p.tv
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
			let ttv = [0,0,tv[0],tv[1]]
			if(distance(tv[0],tv[1],0,0)>1){
				ttv = vectorNormalize([0,0,tv[0],tv[1]])
			}
			 


			if(p.movement == undefined){
				let movepower = p.weight/p.horsePower
				if(movepower<1){movepower = 1}

				p.vx += ttv[2]*p.speed/movepower
				p.vy += ttv[3]*p.speed/movepower
				p.vx *= 1 - (0.03 * this.mapFriction)
				p.vy *= 1 - (0.03 * this.mapFriction)
			} else if(p.movement == "spontaneous"){
				let movepower = p.weight/p.horsePower
				if(movepower<1){movepower = 1}

				p.vx += ttv[2]*p.speed/movepower*5
				p.vy += ttv[3]*p.speed/movepower*5
				p.vx *= 0.7
				p.vy *= 0.7
			}
			


			// NEW PLAYERCOL
			let counter = 20

			let lastCol = {}                             ///lastcol is the walls that i already collided with this frame
			// let i = JSON.parse(JSON.stringify(B))        ///make a new bullet!
			let i = {"x":p.x, "y":p.y, "vx":p.vx,"vy":p.vy}
			let coled = "dn"
			if(p.spectator || p.dead){coled = "stop"}
			let wallsArr = Object.keys(this.walls)
			let bspeed = distance(0,0,p.vx,p.vy)         ///bspeed is the ORIGINAL bullet's speed
			while(coled != "stop" && counter > 0){

				counter --
				coled = "stop"
				let colsave = []                       ///colsave is the walls i can potentially collide with this frame
				
				for(let j = 0; j < wallsArr.length; j++){ ////////// JUICY HERE< for each and every wall
					let w = this.walls[wallsArr[j]]

					if(!w.playerCollision || w?.dead || w == undefined){
						continue
					}

					if(lastCol[wallsArr[j]] != undefined){
								let LC = lastCol[wallsArr[j]]
								if(LC == "single"){                    /// IF the wall is collidable multiple times a frame
										delete lastCol[wallsArr[j]]    /// skip this wall!
										continue;

									}
									else if(LC == "infinite"){      /// IF the wall is collidable single time a frame
										continue;
			
								}
							} // if already collided with wall, don't collide same wall again

					if(w?.handle == undefined){                                  //// means this is a solid line wall!
							
							if( this.wallSameTeamPlayer(p,w)){ 
								continue; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CAN BE REVAMPED FOR PLAYERS !!!!!!!
							}
							let e = this.walls[wallsArr[j]]                                        //i have no idea why i used E instead of W?
							let col = this.pointLineCollision(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							if(col[4]){
								colsave.push([col,wallsArr[j],[i.x+i.vx,i.y+i.vy]])
								coled = "c1" //bullet collided with at least one thing, calculate next subframe
							} //for each wall that collided with the bullet, push it into colsave

					}else{

							let B = p
							switch(w.handle){
								case "bhol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										i.vx += (w.x-B.x)*(w.strength?w.strength:1)
										i.vy += (w.y-B.y)*(w.strength?w.strength:1)
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
										ad = ad*(w.strength?w.strength:1)>150?150:ad*(w.strength?w.strength:1)*0.1
										i.vx += nor[2]*ad
										i.vy += nor[3]*ad
										this.damageWall(wallsArr[j],B)
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
										this.damageWall(wallsArr[j],B)
										coled = "dn"
										lastCol[wallsArr[j]] = "infinite"
									}
									break;
							}
					} /// end of other handles
				} ///end of (for each wall)


			

				if(coled == "c1"){ //if there was one or more solid line collisions

						let f = 0
					if(colsave.length != 1){                     /// find the closest collision
						let fd = Infinity
						for(let I = 0; I < colsave.length; I++){
							let tempdist = distance(colsave[I][0][0],colsave[I][0][1],i.x,i.y)
							if(tempdist<fd && tempdist !== 0){
								fd = tempdist
								f = I
							}
						}
					}
						let tj = colsave[f][1] //the wall id that was collided with
						let tcol = colsave[f][0] //the collision information
					lastCol[tj] = "single" //make it so that in the next subframe, it will not collide in the same wall again

					let WALL = this.walls[tj]
					p.onWallHit?p.onWallHit(WALL,p):0
					let angleDamageMult = 1



					let DAM = 1
					if(DAM){                          ///means the wall aint dead
						let tw = this.walls[tj]
						tcol = this.p5rre(tcol,colsave[f][2][0],colsave[f][2][1],tw.x1,tw.y1,tw.x2,tw.y2) //pretty sure this is rebound logic
						i.x = tcol[0]
						i.y = tcol[1]

							let actualMult = 1

							i.vx = actualMult*(tcol[2]-tcol[0])
							i.vy = actualMult*(tcol[3]-tcol[1])
						
					}

				}
			}

			if(counter == 0){
				console.log("crashed here P")
			}



			

			let vnorm = vectorNormalize([0,0,i.vx,i.vy])
			p.x = i.x + i.vx
			p.y = i.y + i.vy
			p.vx = vnorm[2] * bspeed
			p.vy = vnorm[3] * bspeed

			
			// NEW PLAYERCOL

			// p.x += p.vx
			// p.y += p.vy


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

			let MINMOVDIST = distance(p.unmovePos[0],p.unmovePos[1],p.x,p.y)
			if(MINMOVDIST > 1 || p.unmovePos[2]){
			// p.boidy.forEach((B)=>{
			// 	// this.updateWall(B)
			// })
			p.unmovePos = [p.x,p.y,false]
			this.entityPushers.push({"type":"pos","id":p.id,"x":p.x,"y":p.y,"r":p.rotation})
			// io.to(objt[i]).emit("cameraUp",[p.x,p.y])
			this.massPushers.specific[objt[ii]] = {"cameraUp":[p.x.toFixed(4),p.y.toFixed(4)]}
			}

		}
	}


	static sendAllWombjects(plid){
		io.to(plid).emit("CROBJECT",[this.walls,this.players])
	}

	static wallSameTeamBullet(bullet,wall){
		let player = this.players[bullet.shooter]
		if(wall.plid !== undefined){
			if(bullet.shooter == wall.plid || (player?.team && player.noTeamfire && player.team == this.players[wall.plid]?.team)){
				return(true)
			}
		}
		
		return(false)
	}
	static wallSameTeamPlayer(player,wall){
			if(player.team !== undefined){
				if(wall.team == player.team){
					return(true)
				}
			}
		if(wall.plid !== undefined){
			if(player.team && player.noTeamfire && player.team == this.players[wall.plid]?.team){
				return(true)
			}
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

	static massPush(){
		this.drawers.forEach((e)=>{
			e.splice(1,1)
		}) //removes first element of array in each el

		

		let pobjk = Object.keys(this.players)
		let traks;
		let massDrive = {"drawers":[this.drawers],"upWalls":this.massPushers.general["upWalls"],
					"upEntities":this.massPushers.general["upEntities"]
				}
		pobjk.forEach((e)=>{
			let p = this.players[e]
			if( (p.tracking || p.lastWeapon == "trak") && pobjk.length > 1){
				let op;
				traks = []
				for(let J = 0; J < pobjk.length; J++){
					if(e !== pobjk[J] && !this.players[pobjk[J]].dead){
						op = this.players[pobjk[J]]
						if(distance(p.x,p.y,op.x,op.y)<1000){continue}
						traks.push(["trak",p.x,p.y,op.x,op.y])
					}
				}
				// if(op === undefined){op = p}
				massDrive["trak"] = traks

			} else {
				delete massDrive["trak"]
			}
				// io.to(e).emit("drawers",[this.drawers,traks])

				
				if(this.massPushers.specific[e]?.cameraUp){
					massDrive["cameraUp"] = this.massPushers.specific[e].cameraUp
 				} else {
 					delete massDrive["cameraUp"]
 				}
 				// console.log(massDrive)
				io.to(e).emit("mass",massDrive)
		})
	}

	static RSTotal = 0
	static rpuCounter = 0
	static walldo = {}
	static repeat(){

		// previous tick
		this.rpuCounter += 1
		let RSTIME = Date.now()

		let objkWD = Object.values(this.walldo)
		objkWD.forEach((e)=>{
			e(this.rpuCounter)
		})

		if(Object.keys(this.wallPushers).length > 0){
			// io.to("G10.2").emit("upWalls",this.wallPushers)
			this.massPushers.general["upWalls"] = this.wallPushers
		}
		if(this.entityPushers.length > 0){
			// console.log(this.wallPushers)
			// this.entityPushers.forEach((e,i)=>{
			// 	this.entityPushers[i] = 
			// })
			// io.to("G10.2").emit("upEntities",this.entityPushers)
			this.massPushers.general["upEntities"] = this.entityPushers
		}
		// this.send()
		this.massPush()

		this.wallPushers = {}
		this.massPushers = {"specific":{},"general":{}}
		this.drawers = []
		this.entityPushers = []


		this.playerVelUpdate()

		// let wallsArr = Object.keys(this.walls)


		/// 14 07 2024 OK LETS DOCUMENT THIS SHIT. BULLET PROCESSING

		this.CALCULATIONS = 0

		for(let k = this.bullets.length-1; k > -1; k--){  ///for every single bullet
			let B = this.bullets[k]
			B.life--                                      ///decrease bullet life
			if(B.life < 0){

				if(this.bullets[k].onDeath !== undefined){
					this.bullets[k].onDeath(this.bullets[k])
				}

				this.bullets.splice(k,1)
				continue;
			}
			if(B.instant){                                 ///instantaneous travel for bolts
				k++
			}

			if(B.skipTick && B.life%B.skipTick !== 0){
				continue;
			}

			B.tick?B.tick(B):0
			let coled = "dn"                          ///bullet did not collide yet (default)

			
			let counter = 201

			let lastCol = {}                             ///lastcol is the walls that i already collided with this frame
			let i = JSON.parse(JSON.stringify(B))        ///make a new bullet!
			let wallsArr = Object.keys(this.walls)
			let bspeed = distance(0,0,B.vx,B.vy)         ///bspeed is the ORIGINAL bullet's speed
			// let unhandledWalls = []
			while(coled != "stop" && counter > 0){

				counter --
				coled = "stop"
				let colsave = []                       ///colsave is the walls i can potentially collide with this frame
				
				// //grouping check
				// let noColWalls = {}
				// let bdist = distance(i.x,i.y,i.x+i.vx,i.y+i.vy)
				// Object.values(this.wallGroups).forEach((e)=>{
				// 	if(distance(i.x,i.y,e.x,e.y) > bdist + e.r){
				// 		Object.assign(noColWalls,e.d)
				// 	}
				// })

				// let skipped = Object.keys(noColWalls).length
				// if(skipped > 50){
				// 	console.log("skipped "+skipped)
				// }

				//group check2
				{
				let startTime = Date.now()
				let processing = [this.wallGroups]

						// wallgroups {"x","y","r":Infinity,"d":{"":GroupObject,"":wall}}

						let needCollideWalls = {}
						
						let bdist = distance(i.x,i.y,i.x+i.vx,i.y+i.vy)
						while(processing.length > 0){
							let newprocessing = []

							processing.forEach((e)=>{
								let a = Object.keys(e.d)
								a.forEach((E)=>{
							  		if(e.d[E]!=="wall"){
							  			if(distance(i.x,i.y,e.d[E].x,e.d[E].y) < bdist + e.d[E].r){
							  				newprocessing.push(e.d[E])
							  			}
							  		} else {
							  			needCollideWalls[E] = true
							  		}
								})
							  
							})
							processing = newprocessing
						}
					wallsArr = Object.keys(needCollideWalls)
					// console.log(wallsArr)
					let compressTime = Date.now() - startTime
					if(compressTime>5){console.log("took "+compressTime+ " to compress")}
				}
				 // wallsArr = Object.keys(this.walls)
				//group check


				for(let j = 0; j < wallsArr.length; j++){ ////////// JUICY HERE< for each and every wall
					let w = this.walls[wallsArr[j]]

					if( w == undefined || w.dead){
						continue
					}

					if(lastCol[wallsArr[j]] != undefined){
								let LC = lastCol[wallsArr[j]]
								if(LC == "single"){                    /// IF the wall is collidable multiple times a frame
										delete lastCol[wallsArr[j]]    /// skip this wall!
										continue;

									}
									else if(LC == "infinite"){      /// IF the wall is collidable single time a frame
										continue;
			
								}
							} // if already collided with wall, don't collide same wall again


							this.CALCULATIONS +=1;

							if(w?.handle == undefined){                  //// means this is a solid line wall!
							
							if( this.wallSameTeamBullet(B,w)){ //deleted "w == udefined ||" 14 07 2024
								continue;
							}
							let e = this.walls[wallsArr[j]]                                        //i have no idea why i used E instead of W?
							// let col = this.p5re(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							let col = this.pointLineCollision(i.x,i.y,i.x+i.vx,i.y+i.vy,e.x1,e.y1,e.x2,e.y2)
							// returns: if extending infinitely theres a point, (point X, point Y, whether line 2 extended would intersect line 1, vice versa, whether they collide)
							if(col[4]){
								colsave.push([col,wallsArr[j],[i.x+i.vx,i.y+i.vy]])
								coled = "c1" //bullet collided with at least one thing, calculate next subframe
							} //for each wall that collided with the bullet, push it into colsave

					}else{
							switch(w.handle){
								case "bhol":
									if(distance(B.x,B.y,w.x,w.y) < w.radius){
										i.vx += (w.x-B.x)*(w.strength?w.strength:1)
										i.vy += (w.y-B.y)*(w.strength?w.strength:1)
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
										ad = ad*(w.strength?w.strength:1)>50?50:ad*(w.strength?w.strength:1)
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
					} /// end of other handles
				} ///end of (for each wall)


			

				if(coled == "c1"){ //if there was one or more solid line collisions

					 	B.shooter = ""

						let f = 0
					if(colsave.length != 1){                     /// find the closest collision
						let fd = Infinity
						for(let I = 0; I < colsave.length; I++){
							let tempdist = distance(colsave[I][0][0],colsave[I][0][1],i.x,i.y)
							if(tempdist<fd){
								fd = tempdist
								f = I
							}
						}
					}
						let tj = colsave[f][1] //the wall id that was collided with
						let tcol = colsave[f][0] //the collision information
					lastCol[tj] = "single" //make it so that in the next subframe, it will not collide in the same wall again

					let WALL = this.walls[tj]
					B.onHit?B.onHit(WALL,B,i):0
					let angleDamageMult = 1
					let DAM;
					if(B.unBouncer === undefined){                            ///there is no set damage for the bullet (angle matters)
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
					} else {                                   ///there is set damage for bullet, angle doesnt matter
						angleDamageMult = B.unBouncer
						DAM = this.damageWall(tj,B,{"vx":i.vx,"vy":i.vy,"x":i.x,"y":i.y,"adp":1},tcol)
					}


					if(DAM){                          ///means the wall aint dead
						let tw = this.walls[tj]
						tcol = this.p5rre(tcol,colsave[f][2][0],colsave[f][2][1],tw.x1,tw.y1,tw.x2,tw.y2) //pretty sure this is rebound logic
						// if(i.extra){
						this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1],i.extra]) // it looks like i.x and i.y is uneccessary? This line means send the subframe
					// } else {
						// this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1]])
					// }
						i.x = tcol[0]
						i.y = tcol[1]
						let reverseADmgMult = 1-angleDamageMult
						// let actualMult = 1-(1-B.wallMult)*angleDamageMult
						let actualMult = (1 - (1 - B.wallMult)*angleDamageMult)*(1-(tw.wallMult?1-tw.wallMult:0.4)*angleDamageMult)
						if(actualMult < 0){actualMult = 0}
						if(B.ignoreWallMult !== undefined){
							actualMult = -B.ignoreWallMult * angleDamageMult
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
						// if(i.extra){
							this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1],i.extra])
						// } else {
							// this.drawers.push([i.type,i.tailLength,i.x,i.y,tcol[0],tcol[1]])
						// }
						let avmult = B.penMult==undefined?0.3:B.penMult
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


			if(i.x == null){
				console.log(i.x)
				console.log(JSON.stringify(i))
			}


			if(i.extra){
				this.drawers.push([i.type,i.tailLength,
				parseFloat(i.x.toFixed(2)),
				parseFloat(i.y.toFixed(2)),
				parseFloat((i.x+i.vx).toFixed(2)),
				parseFloat((i.y+i.vy).toFixed(2)),i.extra])
			} else {
				this.drawers.push([i.type,i.tailLength,
				parseFloat(i.x.toFixed(2)),
				parseFloat(i.y.toFixed(2)),
				parseFloat((i.x+i.vx).toFixed(2)),
				parseFloat((i.y+i.vy).toFixed(2))])
			} //send final length of bullet that didnt collide with anything
	
			

			let vnorm = vectorNormalize([0,0,i.vx,i.vy])
			B.x = i.x + i.vx
			B.y = i.y + i.vy
			B.vx = vnorm[2] * bspeed
			B.vy = vnorm[3] * bspeed //this means changing i.v will not change the speed, but only the direction? pretty jank
			
				B.vx *= B.slowd
				B.vy *= B.slowd
	

				
			let sp = B.vx*B.vx + B.vy*B.vy 
			let deathLife = B.deathTimer!==undefined?B.deathTimer:5
				if(B.life > deathLife &&  sp < (B.deathVel?B.deathVel:5)){
					B.life = deathLife
				}
		}



		// this.send()


		this.RSTotal += Date.now()-RSTIME
		if(this.rpuCounter % 40 === 0){
			this.RSTotal = 0
		}

		if(this.CALCULATIONS > 5000 && this.CALCULATIONS != this.lastCalculation){
			console.log("a lot of calculations! "+this.CALCULATIONS)
		}
		this.lastCalculation = this.CALCULATIONS

	}
	static wallTypes = {
		"norm":true,"metl":true,"rflc":true,"player":true,"body":true,"mbdy":true,"wall":true
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
		 		dp = o.adp
		 		if(b.ignoreAngleDamageMult){
		 			dp = b.ignoreAngleDamageMult
		 		}
		 		vx = o.vx
		 		vy = o.vy
			} else {
				vy = b.vy
		 		vx = b.vx
			}

		WALL.hp -= 0.0065*(vx*vx+vy*vy)*(b.dmgmult!==undefined?b.dmgmult:1)/this.walls[wid].defense*dp
		if(this.walls[wid].hp < 0 && !this.walls[wid].dead){
			this.walls[wid].dead = true
			if(this.walls[wid].onDeath !== undefined){
				this.walls[wid].onDeath(this.walls[wid],b)
			}
			if(!this.walls[wid].undying){

				// delete this.walls[wid]
				// this.wallPushers[wid] = "_DEL"
				this.delWall(wid)
			return(false)
			} else {
				this.walls[wid].undying -= 1
			}
			this.updateWallHP(wid)
			return(true)
		}
		this.updateWallHP(wid)
		return(true)
		
		} else if(this.walls[wid].type == "bhol"){
			b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			if(this.walls[wid].onDeath !== undefined){
				this.walls[wid].onDeath(this.walls[wid],b)
			}
			// delete this.walls[wid]
			// this.wallPushers[wid] = "_DEL"
				this.delWall(wid)

			return(false)
		}
		this.updateWallHP(wid)
		return(true)
		} else if(this.walls[wid].type == "whol"){
			// b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			if(this.walls[wid].onDeath !== undefined){
				this.walls[wid].onDeath(this.walls[wid],b)
			}
			// delete this.walls[wid]
			// this.wallPushers[wid] = "_DEL"
				this.delWall(wid)
			return(false)
		}
		this.updateWallHP(wid)
		return(true)
		} else if(this.walls[wid].type == "ghol"){
			// b.shooter = ""
		this.walls[wid].hp -= 1
		if(this.walls[wid].hp < 0){
			if(this.walls[wid].onDeath !== undefined){
				this.walls[wid].onDeath(this.walls[wid],b)
			}
			// delete this.walls[wid]
			// this.wallPushers[wid] = "_DEL"
				this.delWall(wid)
			return(false)
		}
	}
}
	static send(){

		this.drawers.forEach((e)=>{
			e.splice(1,1)
		}) //removes first element of array in each el

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
						if(distance(p.x,p.y,op.x,op.y)<1000){continue}
						traks.push(["trak",p.x,p.y,op.x,op.y])
					}
				}
				// if(op === undefined){op = p}

				io.to(e).emit("drawers",[this.drawers,traks])
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

	static updateWallHP(nuuid){
		this.wallPushers[nuuid] = {"hpUpdate":true,"hp":this.walls[nuuid].hp}
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
    return([xc,yc,cola,colb,colc]) // if extending infinitely theres a point, (point X, point Y, whether line 2 extended would intersect line 1, vice versa, whether they collide)
  } else {
    return("none")
  }
}

	static playerKeyUpdate(e,mobile,id){
		if(mobile){
			this.players[id].tv = e[0]
			this.players[id].tv[2] = true
		} else {
			this.players[e[0]].keys = e[1] // can fix id later
		}
	}

	static disconnect(s){
		this.players[s.id].boidy.forEach((e)=>{
			if(this.walls[e]){
				this.walls[e].undying = false
			}
		})
		delete this.entities[s.id]
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


	static entities = {}
	static initiateEntity(type){
		let eid = ""+Math.random()
		this.entities[eid] = this.initiatePlayer(eid,type?type:"ntri")
		this.entities[eid].entity = true
		this.entities[eid].ai = (e)=>{e.vx = 1;this.playerClick(eid,Math.random()-0.5,Math.random()-0.5,"norm")}
		return(this.entities[eid])
	}

	static changeTeam(p,team){
		p.color = Math.floor(this.stringToRandomNumber(p.team)*360)
		this.entityPushers.push({"type":"team","c":p.color,"id":p.id})
	}

	static entityTemplates(type,durability=1,options={}){
			let entity;

			if(type == "rand"){
				let list = ["ntri1","ntri2","snpr1","shld1"]
				type = list[Math.floor(Math.random()*list.length)]
			}

		if(type.substring(0,4) == "ntri"){
			 entity = this.initiateEntity()
			entity.x = Math.random()*1500-750
			entity.y = Math.random()*1500-750
			entity.range = 3500
			entity.onDeath = (e)=>{e.boidy.forEach((E)=>{if(this.walls[E]!==undefined){this.walls[E].playerCollision=true;this.walls[E].team=e.team}})}
			entity.fireRange = 1000
			entity.pullx = Math.random()*2-1
			entity.pully = Math.random()*2-1
			entity.reloadMultiplier = 1
			entity.retargeting = 0.05
			if(type == "ntri5"){entity.retargeting = 0.5}
			if(type == "ntri6"){entity.speed = 0.2;entity.fireRange = 200;entity.pullx*=1+Math.random();entity.pull5*=1+Math.random()}
			if(type == "ntri7"){
				let wallPlies = [[-80,-80,80,-80,"rflc"],[-40,-40,0,40],[0,40,40,-40],[-40,0,0,40],[0,40,40,0],[80,0,0,40],[0,40,-80,0],[-40,40,0,80],[0,80,40,40],[-40,80,0,120],[0,120,40,80]]

			wallPlies.forEach((e)=>{
				this.placeWall(entity.id,entity.x+e[0],entity.y+e[1],entity.x+e[2],entity.y+e[3],(e[4]?e[4]:"metl"),{"id":entity.id,"force":true,"attach":true})
			})
				
			}
			if(type == "ntri8"){
				entity.fireRange = 300
			}
			entity.findTarget = (e)=>{
				if(Math.random()>entity.retargeting&&e.target && this.players[e.target]&& !this.players[e.target].dead && distance(e.x,e.y,this.players[e.target].x,this.players[e.target].y < e.range)){
					return(e.target)
				}
				e.target = undefined
				let ldst = Infinity
				Object.values(this.players).forEach((E)=>{
					if(e == E || (e.team && e.team == E.team)){return}
						let dst = distance(e.x,e.y,E.x,E.y)
					if(!E.dead && dst < e.range && dst < ldst){
						e.target = E.id
						ldst = dst
					}
				})
				if(e.target!==undefined){this.playerLook(entity,this.players[e.target].x,this.players[e.target].y)}
				return(e.target)
			}
			entity.doWithTarget = (e)=>{
				if(e.target&&this.players[e.target]){
					let p = this.players[e.target]
					let dst = distance(e.x,e.y,p.x,p.y)
					if(dst > 300 || dst > entity.fireRange){
						e.tv = [(p.x-e.x)/dst*3+Math.random()-0.5-e.pullx, (p.y-e.y)/dst*3+Math.random()-0.5-e.pully]
					}
					if(dst < e.fireRange){
						if(Math.random()>0.99){
							this.playerClick(e.id,Math.random()-0.5,Math.random()-0.5,"tlpt")
						}
						if(type == "ntri2"){
							if(Math.random()>0.1){
								this.playerClick(e.id,p.x-e.x+p.vx*2,p.y-e.y+p.vy*2,"zapr")
								if(Math.random()>0.99){
									for(let i = 0; i < 5; i++){
										e.reloading = -1
										this.playerClick(e.id,p.x-e.x+p.vx*2,p.y-e.y+p.vy*2,"zapr")
									}
								}
							} else {
								this.playerClick(e.id,p.x-e.x+p.vx*7,p.y-e.y+p.vy*7,"cnon")
							}
						} else if(type == "ntri3"){
							this.playerClick(e.id,p.x-e.x+p.vx*2,p.y-e.y+p.vy*2,Math.random()>0.01?"lzr2":"lazr")
						} else if(type == "ntri4"){
							if(Math.random()>0.03){
								e.reloadMultiplier = 2 //inefficient
								this.playerClick(e.id,p.x-e.x+p.vx*3,p.y-e.y+p.vy*3,"mchg")
							} else {
								this.playerClick(e.id,p.x-e.x+p.vx*7-e.vx,p.y-e.y+p.vy*7-e.vy,"kbml")
							}

						} else if(type == "ntri5"){
							if(entity.reloading < 1 && Math.random()>0.3){
								this.playerClick(e.id,p.x-e.x+p.vx*7-e.vx,p.y-e.y+p.vy*7-e.vy,"tlpt")
								entity.reloading = 12
							} else {
								entity.reloading = 0
								this.playerClick(e.id,p.x-e.x+p.vx*7-e.vx,p.y-e.y+p.vy*7-e.vy,"dril")
							}
						} else if(type == "ntri6"){
							if(entity.reloading < 1 && Math.random()>0.3){
								this.playerClick(e.id,p.x-e.x+p.vx*7-e.vx,p.y-e.y+p.vy*7-e.vy,"dril")
								entity.reloading = 12
							}
						} else if(type == "ntri8"){
							let vvx = e.vx
							let vvy = e.vy
							for(let i = 0; i < 2; i++){
								this.playerClick(e.id,p.x-e.x+p.vx*3-e.vx,p.y-e.y+p.vy*3-e.vy,"fire")
								entity.reloading = 0
							}
							e.vx = vvx*0.5+e.vx*0.5
							e.vy = vvy*0.5+e.vy*0.5
								entity.reloading = 1
						} else{
							this.playerClick(e.id,p.x-e.x+p.vx*2,p.y-e.y+p.vy*2,Math.random()>0.2?"scat":"grnd")
						}
					}
				} else {
					e.tv = [0,0]
				}
			}
			entity.ai = (e)=>{
				e.findTarget(e)
				e.doWithTarget(e)
			
			}
		} else if(type == "shld1"){
			 entity = this.initiateEntity("shld")
			entity.x = Math.random()*1500-750
			entity.y = Math.random()*1500-750
			entity.lead = 2
			entity.range = 3500
			entity.fireRange = 1000
			entity.reloadMultiplier = 2.5
			entity.findTarget = (e)=>{
				if(Math.random()>0.05&&e.target && this.players[e.target]&& !this.players[e.target].dead && distance(e.x,e.y,this.players[e.target].x,this.players[e.target].y < e.range)){
					return(e.target)
				}
				e.target = undefined
				let ldst = Infinity
				Object.values(this.players).forEach((E)=>{
					if(e == E || (e.team && e.team == E.team)){return}
						let dst = distance(e.x,e.y,E.x,E.y)
					if(!E.dead && dst < e.range && dst < ldst){
						e.target = E.id
						ldst = dst
					}
				})
				if(e.target!==undefined){this.playerLook(entity,this.players[e.target].x,this.players[e.target].y)}
				return(e.target)
			}
			entity.doWithTarget = (e)=>{
				if(e.target&&this.players[e.target]){
					let p = this.players[e.target]
					let dst = distance(e.x,e.y,p.x,p.y)
					if(dst > 300){
						e.tv = [(p.x-e.x)/dst*3+Math.random()*14-7, (p.y-e.y)/dst*3+Math.random()*14-7]
					}
					if(dst < e.fireRange){
						this.playerClick(e.id,p.x-e.x+Math.random()*144-72+p.vx*e.lead,p.y-e.y+Math.random()*144-72+p.vy*e.lead,"norm")
					}
				} else {
					e.tv = [0,0]
				}
			}
			entity.ai = (e)=>{
				e.findTarget(e)
				e.doWithTarget(e)
			
			}
		}else if(type.substring(0,4)=="tank"){
			 entity = this.initiateEntity("tank")
			entity.x = Math.random()*1500-750
			entity.y = Math.random()*1500-750
			entity.lead = 2
			entity.range = 3500
			entity.fireRange = 1000
			entity.baseFireRange = 1000
			entity.antirecoil = (type == "tank1")
			entity.weapon = "cnon"
			entity.aimDeviation = 140
			entity.burstReload = 5
			entity.reloadMultiplier = 2.5
			entity.randomMovement = Math.random()*20
			entity.burst = entity.maxburst = 3
			if(type == "tank2"){entity.fireRange = 400;entity.weapon = "scat2"}
			if(type == "tank3"){
				let wallPlies = [[-80,-80,80,-80,"rflc"],[-40,-40,0,40],[0,40,40,-40],[-40,0,0,40],[0,40,40,0],[80,0,0,40],[0,40,-80,0],[-40,40,0,80],[0,80,40,40],[-40,80,0,120],[0,120,40,80]]

					wallPlies.forEach((e)=>{
						this.placeWall(entity.id,entity.x+e[0],entity.y+e[1],entity.x+e[2],entity.y+e[3],(e[4]?e[4]:"metl"),{"id":entity.id,"force":true,"attach":true})
					})
					entity.maxburst = 1
					entity.weight = 20
					entity.aimDeviation = 15
			}
			if(type == "tank4"){
				let wallPlies = [[-80,-80,80,-80,"rflc"],[-40,-40,0,40],[0,40,40,-40],[-40,0,0,40],[0,40,40,0],[80,0,0,40],[0,40,-80,0],[-40,40,0,80],[0,80,40,40],[-40,80,0,120],[0,120,40,80]]

					wallPlies.forEach((e)=>{
						this.placeWall(entity.id,entity.x+e[0],entity.y+e[1],entity.x+e[2],entity.y+e[3],(e[4]?e[4]:"metl"),{"id":entity.id,"force":true,"attach":true})
					})
					entity.maxburst = 3
					entity.horsePower = 20000
					entity.aimDeviation = 145
			} else if(type == "tank5"){
				let wallPlies = [[-40,24,0,40],[0,40,40,24],[40,24,0,-56],[0,-56,-40,24]]
				wallPlies.forEach((e)=>{
						this.placeWall(entity.id,entity.x+e[0],entity.y+e[1],entity.x+e[2],entity.y+e[3],(e[4]?e[4]:"metl"),{"id":entity.id,"force":true,"attach":true})
					})
			} else if(type == "tank6"){
				let wallPlies = [[0,42,-42,21,"rflc"],[0,42,42,21,"rflc"],[42,21,0,-73,"rflc"],[0,-73,-42,21,"rflc"],[0,62,-21,0],[0,62,21,0],[21,0,0,-135],[0,-135,-21,0],[0,62,62,0],[0,62,-62,0],[0,62,-52,-42],[0,62,52,-42],[0,0,-21,-156],[21,-156,0,0]] 
				wallPlies.forEach((e)=>{
						this.placeWall(entity.id,entity.x+e[0],entity.y+e[1],entity.x+e[2],entity.y+e[3],(e[4]?e[4]:"metl"),{"id":entity.id,"force":true,"attach":true})
					})
				entity.speed *= 3
				entity.horsePower = 30000
				entity.randomMovement = 0
			}
			
			entity.findTarget = (e)=>{
				if(Math.random()>0.05&&e.target && this.players[e.target]&& !this.players[e.target].dead && distance(e.x,e.y,this.players[e.target].x,this.players[e.target].y < e.range)){
					return(e.target)
				}
				e.target = undefined
				let ldst = Infinity
				Object.values(this.players).forEach((E)=>{
					if(e == E || (e.team && e.team == E.team)){return}
						let dst = distance(e.x,e.y,E.x,E.y)
					if(!E.dead && dst < e.range && dst < ldst){
						e.target = E.id
						ldst = dst
					}
				})
				if(e.target!==undefined){
					this.playerLook(entity,this.players[e.target].x,this.players[e.target].y)
				}
				return(e.target)
			}
			entity.doWithTarget = (e)=>{
				if(e.target&&this.players[e.target]){
					let p = this.players[e.target]
					let dst = distance(e.x,e.y,p.x,p.y)
					if(dst > 300){
						e.tv = [(p.x-e.x)/dst*3+Math.random()*entity.randomMovement-entity.randomMovement/2, (p.y-e.y)/dst*3+Math.random()*entity.randomMovement-entity.randomMovement/2]
					}
					if(dst < e.fireRange && entity.reloading < 1){
						let vvx = entity.vx
						let vvy = entity.vy
						this.playerClick(e.id,p.x-e.x+Math.random()*e.aimDeviation-e.aimDeviation/2+p.vx*e.lead,p.y-e.y+Math.random()*e.aimDeviation-e.aimDeviation/2+p.vy*e.lead,entity.weapon)
						if(entity.antirecoil){
							entity.vx = vvx
							entity.vy = vvy
						}
						
						if(entity.burst){
							entity.burst -= 1
							entity.reloading = entity.burstReload
							entity.fireRange = entity.baseFireRange * 3
						} else {
							entity.burst = entity.maxburst
							if(type=="tank4"){
								entity.burst+=Math.floor(Math.abs(gaussianRandom(0,2)))
								if(entity.burst > 8){
									if(Math.random()>0.5){
										entity.burst*=6;entity.aimDeviation=400;entity.antirecoil=true;entity.burstReload=2;entity.baseFireRange=3000
									} else {
									if(Math.random()>0.5){entity.weapon = "lazr"}
										entity.burst*=18;entity.aimDeviation=Math.random()*5400+400;entity.antirecoil=true;entity.burstReload=1;entity.baseFireRange=6000
									}
								}
								else{entity.aimDeviation=145;entity.burstReload=5;entity.antirecoil=false;entity.baseFireRange=1000;entity.weapon="cnon"}
							}
							entity.fireRange = entity.baseFireRange
							entity.reloading = 40
						}
					}
				} else {
					e.tv = [0,0]
				}
			}
			entity.ai = (e)=>{
				e.findTarget(e)
				e.doWithTarget(e)
			
			}
		}else if(type.substring(0,4)=="turr"){
			 entity = this.initiateEntity("tank")
			entity.x = Math.random()*1500-750
			entity.y = Math.random()*1500-750
			entity.speed = 0
			entity.lead = 2
			entity.range = 2000
			entity.fireRange = 2000
			entity.weapon = "cnon"
			entity.aimDeviation = 140
			entity.burster = false
			entity.burst = entity.maxburst = 3
			entity.findTarget = (e)=>{
				if(Math.random()>0.05&&e.target && this.players[e.target]&& !this.players[e.target].dead && distance(e.x,e.y,this.players[e.target].x,this.players[e.target].y < e.range)){
					return(e.target)
				}
				e.target = undefined
				let ldst = Infinity
				Object.values(this.players).forEach((E)=>{
					if(e == E || (e.team && e.team == E.team)){return}
						let dst = distance(e.x,e.y,E.x,E.y)
					if(!E.dead && dst < e.range && dst < ldst){
						e.target = E.id
						ldst = dst
					}
				})
				if(e.target!==undefined){
					this.playerLook(entity,this.players[e.target].x,this.players[e.target].y)
				}
				return(e.target)
			}
			entity.doWithTarget = (e)=>{
				if(e.target&&this.players[e.target]){
					let p = this.players[e.target]
					let dst = distance(e.x,e.y,p.x,p.y)
					if(dst < e.fireRange && entity.reloading < 1){
						let vvx = entity.vx
						let vvy = entity.vy
						this.playerClick(e.id,p.x-e.x+Math.random()*e.aimDeviation-e.aimDeviation/2+p.vx*e.lead,p.y-e.y+Math.random()*e.aimDeviation-e.aimDeviation/2+p.vy*e.lead,entity.weapon)
							entity.vx = vvx
							entity.vy = vvy
						if(entity.burster){
							if(entity.burst){
							entity.burst -= 1
							entity.reloading = 5
							} else {
								entity.burst = entity.maxburst
								entity.reloading = 40
							}
						}
						
					}
				}
			}
			entity.ai = (e)=>{
				e.findTarget(e)
				e.doWithTarget(e)
			
			}
		}else if(type == "snpr1"){
			 entity = this.initiateEntity("snpr")
			entity.x = Math.random()*1500-750
			entity.y = Math.random()*1500-750
			entity.lead = 2
			entity.range = 7500
			entity.fireRange = 2000
			entity.reloadMultiplier = 2.5
			entity.path = []
			entity.findTarget = (e)=>{
				if(Math.random()>0.05&&e.target && this.players[e.target]&& !this.players[e.target].dead && distance(e.x,e.y,this.players[e.target].x,this.players[e.target].y < e.range)){
					return(e.target)
				}
				let prevtarget = e.target
				e.target = undefined
				let ldst = Infinity
				Object.values(this.players).forEach((E)=>{
					if(e == E || (e.team && e.team == E.team)){return}
						let dst = distance(e.x,e.y,E.x,E.y)
					if(!E.dead && dst < e.range && dst < ldst){
						e.target = E.id
						ldst = dst
					}
				})
				if(e.target!==undefined){
					this.playerLook(entity,this.players[e.target].x,this.players[e.target].y)
				}
				return(e.target)
			}
			entity.doWithTarget = (e)=>{
				if(e.target&&this.players[e.target]){
					let p = this.players[e.target]
					let dst = distance(e.x,e.y,p.x,p.y)
					if(dst > 1400 || entity.obscured){
						e.tv = [(p.x-e.x)/dst*3+Math.random()*14-7, (p.y-e.y)/dst*3+Math.random()*14-7]
						if(entity.obscured){
							e.tv = [-e.tv[1],e.tv[0]]
						}
					} else {
						e.tv = [-(p.x-e.x)/dst*3+Math.random()*14-7, -(p.y-e.y)/dst*3+Math.random()*14-7]
					}
					if( entity.reloading < 1 && dst < e.fireRange) {
						if(!this.aimWallCheck(entity,this.players[e.target])){
							this.playerClick(e.id,p.x-e.x+Math.random()*70-35+p.vx*e.lead,p.y-e.y+Math.random()*70-35+p.vy*e.lead,"snpr")
							entity.obscured = false
						} else {
							entity.obscured = true
						}
					}
				} else {
					e.tv = [0,0]
				}
			}
			entity.ai = (e)=>{
				e.findTarget(e)
				e.doWithTarget(e)
			
			}
		} else {
			entity = this.initiateEntity("shld")
			entity.x = Math.random()*1500-750
			entity.y = Math.random()*1500-750
			entity.lead = 2
			entity.range = 3500
			entity.fireRange = 1000
			entity.reloadMultiplier = 2.5

			let wallPlies = []
			// let wallPlies = [[100,100,-100,100]]

			wallPlies.forEach((e)=>{
				this.placeWall(entity.id,entity.x+e[0],entity.y+e[1],entity.x+e[2],entity.y+e[3],"metl",{"id":entity.id,"force":true,"attach":true})
			})
			entity.findTarget = (e)=>{
				if(Math.random()>0.05&&e.target && this.players[e.target]&& !this.players[e.target].dead && distance(e.x,e.y,this.players[e.target].x,this.players[e.target].y < e.range)){
					return(e.target)
				}
				e.target = undefined
				let ldst = Infinity
				Object.values(this.players).forEach((E)=>{
					if(e == E || (e.team && e.team == E.team)){return}
						let dst = distance(e.x,e.y,E.x,E.y)
					if(!E.dead && dst < e.range && dst < ldst){
						e.target = E.id
						ldst = dst
					}
				})
				if(e.target!==undefined){
					this.playerLook(entity,this.players[e.target].x,this.players[e.target].y)
				}
				return(e.target)
			}
			entity.doWithTarget = (e)=>{
				if(e.target&&this.players[e.target]){
					let p = this.players[e.target]
					let dst = distance(e.x,e.y,p.x,p.y)
					if(dst > 300){
						e.tv = [(p.x-e.x)/dst*3+Math.random()*14-7, (p.y-e.y)/dst*3+Math.random()*14-7]
					}
					if(dst < e.fireRange){
						this.playerClick(e.id,p.x-e.x+Math.random()*144-72+p.vx*e.lead,p.y-e.y+Math.random()*144-72+p.vy*e.lead,"norm")
						if(this.pvuCounter%5==0){
						this.KBR(e.x+Math.random()*2000-1000,e.y+Math.random()*2000-1000)
						}


					}

					
				} else {
					e.tv = [0,0]
				}
			}
			entity.ai = (e)=>{
				e.findTarget(e)
				e.doWithTarget(e)
			
			}
			
		}
		Object.assign(entity,options)
		entity.boidy.forEach((e)=>{this.walls[e].defense*=durability})

		if(entity.team){this.changeTeam(entity,entity.team)}
		return(entity)
	}

	static entityUpdate(){
		let ENobj = Object.values(this.entities)
		ENobj.forEach((e)=>{
			e.ai?e.ai(e):0
		})
	}

	static KB(player,vx,vy){
		player.vx += vx / player.weight * player.speed
		player.vy += vy / player.weight * player.speed
	}

	static KBR(x,y,options={}){
		let b = {"x":x,"y":y}

		if(!options.noBulletBounce){
			Object.values(this.bullets).forEach((e)=>{
				let dst = distance(e.x,e.y,b.x,b.y)
				if(dst<900){
					let inverse = 1/dst
					let min = options.bulletBounceMax?options.bulletBounceMax:50
					e.vx += Math.max(-min, Math.min((e.x-b.x)*inverse*inverse*15000, min))
					e.vy += Math.max(-min, Math.min((e.y-b.y)*inverse*inverse*15000, min))
				}
			})
		}
		

		let playerKBpower = options.pkb?options.pkb*5000:5000
		Object.values(this.players).forEach((e)=>{
			if(e.dead){return}
			let dst = distance(e.x,e.y,b.x,b.y)
			if(dst<500){
				let inverse = 1/dst
				let min = options.playerBounceMax?options.playerBounceMax:50
				e.vx += Math.max(-min, Math.min((e.x-b.x)*inverse*inverse*playerKBpower/e.weight*e.speed, min))
				e.vy += Math.max(-min, Math.min((e.y-b.y)*inverse*inverse*playerKBpower/e.weight*e.speed, min))
			}
		})

		let explosionType = options.explosionType?options.explosionType:"explosion"
		io.to("G10.2").emit("particle",[{"type":explosionType,"x":b.x,"y":b.y}])
	}

	static aimWallCheck(TPP,op,shx,shy){


		if(shx === undefined && shy === undefined){
			shx = op.x
			shy = op.y
		}

			let plid = TPP.id //player id
			let distanceToPlayer = distance(TPP.x,TPP.y,shx,shy)

				let obwl = Object.values(this.walls)
				let willCollide = false
				for(let j = 0; j < obwl.length; j++){
					let W = obwl[j]
					if(op.id === W.plid || plid === W.plid){
						continue;
					}
					let col = this.pointLineCollision(TPP.x,TPP.y,shx,shy,W.x1,W.y1,W.x2,W.y2)
					if(col !== "none" && col[4] && distanceToPlayer > distance(TPP.x,TPP.y,col[0],col[1])){
						willCollide = true
						break;
					}
				}
				return(willCollide)
	}


	static exportMap(){
			fs.writeFileSync('./S2Cmap.json',JSON.stringify({"walls":this.walls,"nuuid":this.nuuIDGEN}), function writeJSON(err){if(err)return console.log(err)})
	}
	static loadMap(map){
		map = map?("./"+map+".json"):"./S2Cmap.json"
		let mapdata = JSON.parse(fs.readFileSync(map,"utf8"))
		this.walls = mapdata.walls
		let objk = Object.keys(this.walls)
		objk.forEach((e)=>{
			this.wallGroups.d[e] = "wall"
		})
		this.nuuIDGEN = mapdata.nuuid
		console.log("loaded "+objk.length+" walls")
		console.log("map loaded!")
	}



	static groupAllStaticWalls(){
		let boundingGroupID = this.getNewNUUID()

		let boundingDict = {}

	}
	static groupStaticWalls(x,y,r){
		console.log(x,y,r)
		let boundingGroupID = this.getNewNUUID()

		let boundingDict = {}
		let amount = 0
		let wallsArr = Object.values(this.walls)
		wallsArr.forEach((w)=>{
			if(!w.attached && w.handle===undefined){
				if(this.boundingCircleIncludesWall(w,x,y,r)){
					delete this.wallGroups.d[w.id]
					boundingDict[w.id]="wall" //maybe set it so that the wall knows its bounding parent
					amount++
				}
			}
		})
		if(amount > 0){
			this.wallGroups.d[boundingGroupID]={"x":x,"y":y,"r":r,"d":boundingDict,"a":amount}
			console.log("bounded "+amount+" walls")
		}
		return(amount)
	}

	static groupStaticWalls2(x,y,r){
		console.log(x,y,r)
		let boundingGroupID = this.getNewNUUID()

		let boundingDict = {}
		let amount = 0
		let gamount = 0
		let wallsArr = Object.keys(this.wallGroups.d)
		wallsArr.forEach((WB)=>{

			if(this.wallGroups.d[WB] == "wall"){
					let w = this.walls[WB]
					if(w !== undefined && !w.attached && w.handle===undefined){
					if(this.boundingCircleIncludesWall(w,x,y,r)){
						delete this.wallGroups.d[w.id]
						boundingDict[w.id]="wall" //maybe set it so that the wall knows its bounding parent
						amount++
					}
				}
			} else {
				let childGroup = this.wallGroups.d[WB]
				if(distance(childGroup.x,childGroup.y,x,y) + childGroup.r < r){
					boundingDict[WB] = childGroup
					delete this.wallGroups.d[WB]
					gamount++
				}
			}
			
		})
		if(amount > 0 || gamount > 0){
			this.wallGroups.d[boundingGroupID]={"x":x,"y":y,"r":r,"d":boundingDict,"a":amount}
			console.log("bounded "+amount+" walls and "+gamount+" groups")
		}
		return(amount)
	}
	static getWallsInRadius(x,y,r){
		console.log(x,y,r)
		let boundingGroupID = this.getNewNUUID()

		let walls = []
		let processing = [this.wallGroups]
		let amount = 0
		let gamount = 0

		while(processing.length>0){
			let p = processing[0]
			let wallsArr = Object.keys(p.d)
			processing.splice(0,1)
			wallsArr.forEach((WB)=>{

				if(p.d[WB] == "wall"){
						let w = this.walls[WB]
						if(w !== undefined && w.handle===undefined){ //ATTACHED WALLS ALSO
						if(this.boundingCircleIncludesWall(w,x,y,r)){
							walls.push(w.id)
							amount++
						}
					}
				} else {
					let childGroup = p.d[WB]
					if(distance(childGroup.x,childGroup.y,x,y)  < r + childGroup.r){
						processing.push(childGroup)
						gamount++
					}
				}
				
			})
		}
		if(amount > 0 || gamount > 0){
			console.log("found "+amount+" walls and "+gamount+" groups")
		}
		return(walls)
	}

	static boundingCircleIncludesWall(w,x,y,r){
		if( w.handle===undefined){
			if(distance(w.x1,w.y1,x,y)<r && distance(w.x2,w.y2,x,y)<r){return(true)}
		}
		return(false)
	}


	// static improvedWallCheck(){


	// 	//wallgroups HAS all walls, but might be in side!
	// 	let processing = [this.wallGroups]

	// 	// wallgroups {"x","y","r":Infinity,"d":{"":GroupObject,"":wall}}

	// 	let needCollideWalls = {}
		
	// 	while(processing.length > 0){
	// 		let newprocessing = []

	// 		processing.forEach((e)=>{
	// 			let a = Object.keys(e.d)
	// 			a.forEach((E)=>{
	// 		  		if(e.d[a]!=="wall"){
	// 		  			if(collide){
	// 		  				newprocessing.push(e.d[a])
	// 		  			}
	// 		  		} else {
	// 		  			needCollideWalls[a] = true
	// 		  		}
	// 			})
			  
	// 		})
	// 		processing = newprocessing
			 
	// 	}
		

	// }

	static getWallsInApproximate(x,y,bdist){
		let processing = [this.wallGroups]

			// wallgroups {"x","y","r":Infinity,"d":{"":GroupObject,"":wall}}

			let needCollideWalls = {}
			
			while(processing.length > 0){
				let newprocessing = []

				processing.forEach((e)=>{
					let a = Object.keys(e.d)
					a.forEach((E)=>{
				  		if(e.d[E]!=="wall"){
				  			if(distance(x,y,e.d[E].x,e.d[E].y) < bdist + e.d[E].r){
				  				newprocessing.push(e.d[E])
				  			}
				  		} else {
				  			needCollideWalls[E] = true
				  		}
					})
				  
				})
				processing = newprocessing
			}
		wallsArr = Object.keys(needCollideWalls)
		return({"arr":wallsArr,"dict":needCollideWalls})
	}

	static playerChat(id,chat){
		let p = this.players[id]
		io.to("G10.2").emit("chat",{"x":p.x,"y":p.y,"c":chat,"id":id})
	}

}





module.exports={shooter2C}