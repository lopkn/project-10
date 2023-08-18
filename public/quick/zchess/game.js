
function spos(x,y){
	return(x+","+y);
}
function ipos(str){
	let a = str.split(",")
	return({"x":parseInt(a[0]),"y":parseInt(a[1])})
}

class board {
	// undefined: empty,{} empty movable, {"piece"}
	static tiles = {}
	static arrFuncs = {
		"pieceModifiers":[]
	}
	static spawnRange = [0,8]
	static iterations = 0;
	static topTile = 0;
	static bottomTile = 0;
	static AIwait(){
		return(10)
	}
	static AIblockWait(){
		return(300)
	}
	static emptyNew(){
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 12; j++){
				this.tiles[i+","+j] = {};
			}
		}
	}
}

function getTileTeam(pos,team){
	let tile = board.tiles[pos]
	if(tile == undefined){return(false)}
	if(tile.piece == undefined){return("empty")}
		if(tile.piece.identifyTo !== undefined){
			return(tile.piece.identifyTo(team))
		}
		if(tile.piece.team == team){return("block")} else {return("capture")}
}

function movePiece(x,y,tx,ty,team){
	let pos = spos(x,y)
	if(board.tiles[pos].piece == undefined){return(false)}
		if(board.tiles[pos].piece.team != team){return(false)}
		return(board.tiles[pos].piece.move(tx,ty))
}

class piece {
	constructor(id,x,y,team,tags){
		this.arrFuncs = {
		"onMove":[]
		}
		this.id = id
		this.tags = tags || {}
		this.x = x
		this.y = y
		this.premoves = []
		this.team = team
		this.kills = 0;
		this.alive = true
		

		if(id == "rook"){
			this.range = 5
			this.maxCD = 15
			this.renderLetter = "R"
			this.legals = ()=>{
				let loop = true
				let legals = []
				let legalDict = {}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(gtt === "empty"){legals.push(pos);legalDict[pos]=gtt;continue}
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt === "empty"){legals.push(pos);legalDict[pos]=gtt;continue}
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(gtt === "empty"){legals.push(pos);legalDict[pos]=gtt;continue}
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt === "empty"){legals.push(pos);legalDict[pos]=gtt;continue}
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				return({"arr":legals,"dict":legalDict})
			}
		} else if(id == "cannon"){
			this.range = 9
			this.maxCD = 15
			this.renderLetter = "C"
			this.legals = ()=>{
				let loop = true
				let legals = []
				let legalDict = {}
				let jumped = false
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(jumped){
						if(gtt == false || gtt == "block"){break};
						if(gtt == "phase"){continue;}
						if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					} else {
						if(gtt == false || gtt == "block" || gtt == "capture"){jumped = true; continue};
						if(gtt == "phase"){continue;}
						legals.push(pos)
						legalDict[pos]=gtt
					}
				}
				jumped = false
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(jumped){
						if(gtt == false || gtt == "block"){break};
						if(gtt == "phase"){continue;}
						if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					} else {
						if(gtt == false || gtt == "block" || gtt == "capture"){jumped = true; continue};
						if(gtt == "phase"){continue;}
						legals.push(pos)
						legalDict[pos]=gtt
					}

				}
				jumped = false
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(jumped){
						if(gtt == false || gtt == "block"){break};
						if(gtt == "phase"){continue;}
						if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					} else {
						if(gtt == false || gtt == "block" || gtt == "capture"){jumped = true; continue};
						if(gtt == "phase"){continue;}
						legals.push(pos)
						legalDict[pos]=gtt
					}
				}
				jumped = false
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(jumped){
						if(gtt == false || gtt == "block"){break};
						if(gtt == "phase"){continue;}
						if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					} else {
						if(gtt == false || gtt == "block" || gtt == "capture"){jumped = true; continue};
						if(gtt == "phase"){continue;}
						legals.push(pos)
						legalDict[pos]=gtt
					}
				}
				return({"arr":legals,"dict":legalDict})
			}
		}else if(id == "queen"){
			this.maxCD = 16
			this.range = 5
			this.renderLetter = "Q"
			this.legals = ()=>{
				let loop = true
				let legals = []
				let legalDict = {}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;

				}
				return({"arr":legals,"dict":legalDict})
			}
		} else if(id == "bishop"){
			this.maxCD = 12
			this.range = 5
			this.renderLetter = "B"
			this.legals = ()=>{
				let loop = true
				let legals = []
				let legalDict = {}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;
				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);legalDict[pos]=gtt;break}
					legals.push(pos)
					legalDict[pos]=gtt;

				}
				return({"arr":legals,"dict":legalDict})
			}
		} else if(id == "knight"){
			this.maxCD = 10
			this.renderLetter = "N"
			this.jumps = [[2,1],[1,2],[-1,2],[-2,1],[1,-2],[-1,-2],[-2,-1],[2,-1]]
			this.legals = ()=>{
				let legals = []
				let legalDict = {}
				this.jumps.forEach((s)=>{
					let e = spos(s[0]+this.x,s[1]+this.y)
					let gtt = getTileTeam(e,this.team)
					if(gtt == "capture" || gtt == "empty"){legals.push(e);legalDict[e]=gtt;}
				})
				return({"arr":legals,"dict":legalDict})
			}
		} else if(id == "king"){
			this.maxCD = 20
			if(this.team=="zombies"){this.maxCD = 20}
			this.renderLetter = "K"
			this.jumps = [[0,1],[0,-1],[-1,1],[1,-1],[1,0],[-1,0],[-1,-1],[1,1]]
			this.legals = ()=>{
				let legals = []
				let legalDict = {}
				this.jumps.forEach((s)=>{
					let e = spos(s[0]+this.x,s[1]+this.y)
					let gtt = getTileTeam(e,this.team)
					if(gtt == "capture" || gtt == "empty"){legals.push(e);legalDict[e]=gtt;}
				})
				return({"arr":legals,"dict":legalDict})
			}
		} else if(id == "pawn"){
			this.maxCD = 7
			this.renderLetter = "P"
			if(this.tags.direction == "y+"){
				this.legals = ()=>{
					let legals = []
					let legalDict = {}
					if(getTileTeam(spos(this.x,this.y+1),this.team) == "empty"){legals.push(spos(this.x,this.y+1))
						legalDict[spos(this.x,this.y+1)]="empty"
					}
					if(getTileTeam(spos(this.x+1,this.y+1),this.team) == "capture"){legals.push(spos(this.x+1,this.y+1))
						legalDict[spos(this.x+1,this.y+1)]="capture"
					}
					if(getTileTeam(spos(this.x-1,this.y+1),this.team) == "capture"){legals.push(spos(this.x-1,this.y+1))
						legalDict[spos(this.x-1,this.y+1)]="capture"
					}
					return({"arr":legals,"dict":legalDict})
				}
				this.arrFuncs.onMove.push(()=>{if(this.y == 11){
					board.tiles[spos(this.x,this.y)].piece = new piece("queen",this.x,this.y,this.team)
				}})
			}
			if(this.tags.direction == "y-"){
				this.legals = ()=>{
					let legals = []
					let legalDict = {}
					if(this.y == 10){
						if(getTileTeam(spos(this.x,this.y-2),this.team) == "empty"){legals.push(spos(this.x,this.y-2))
							legalDict[spos(this.x,this.y-2)]="empty"
						}
					}
					if(getTileTeam(spos(this.x,this.y-1),this.team) == "empty"){legals.push(spos(this.x,this.y-1))
						legalDict[spos(this.x,this.y-1)]="empty"
					}
					if(getTileTeam(spos(this.x+1,this.y-1),this.team) == "capture"){legals.push(spos(this.x+1,this.y-1))
						legalDict[spos(this.x+1,this.y-1)]="capture"
					}
					if(getTileTeam(spos(this.x-1,this.y-1),this.team) == "capture"){legals.push(spos(this.x-1,this.y-1))
						legalDict[spos(this.x-1,this.y-1)]="capture"
					}
					return({"arr":legals,"dict":legalDict})
				}

				this.arrFuncs.onMove.push(()=>{if(board.tiles[spos(this.x,this.y-1)] == undefined){
					board.tiles[spos(this.x,this.y)].piece = new piece("queen",this.x,this.y,this.team)
				}})

			}
		} else if(id == "wizard"){
			this.maxCD = 20
			this.upLim = Infinity;
			this.held = false;
			if(this.team=="zombies"){this.maxCD = 20}
			this.renderLetter = "W"
			this.jumps = [[0,1],[0,-1],[-1,1],[1,-1],[1,0],[-1,0],[-1,-1],[1,1]]
			this.legals = ()=>{
				let legals = []
				let legalDict = {}
				this.jumps.forEach((s)=>{
					let e = spos(s[0]+this.x,s[1]+this.y)
					let gtt = getTileTeam(e,this.team)
					if(gtt == "capture" || gtt == "empty"){legals.push(e);legalDict[e]=gtt;}
				})
				return({"arr":legals,"dict":legalDict})
			}

			this.downed = ()=>{
				this.upLim = Date.now()+2000;
			}
			this.hold = (t)=>{
				if(t > this.upLim){
					if(this.held !== true){
						camera.particles.push(new explosionR(mouseX/tileSize-camera.x,mouseY/tileSize-camera.y,"rgba(0,255,255,0.8)",10,18,0.2))
						this.held = true
					}
				}
				let progress =1-(this.upLim-t)/2000
				ctx.lineWidth = tileSize/8
				if(this.held){
					let mr = Math.random()*255
					ctx.strokeStyle = "rgb(0,"+mr+","+mr+")"
				} else {
					ctx.strokeStyle = "rgb(0,255,255)"
				}
				// console.log("yo?"+progress)
				chargeArc(mouseX,mouseY,23,progress)

				return(progress)
			}
			this.unhold = (x,y)=>{
				if(this.held){
					let tile = board.tiles[spos(x,y)]
					if(killBoardPiece(x,y,this)){
						for(let i = 0; i < 26; i++){
						let dx = Math.random()-0.5
						let dy = Math.random()-0.5
						camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*44,44*dy,Math.random()*0.03,Math.random()*3+3,false))
						}
						camera.particles.push(new explosionR(x+0.5+(Math.random()-0.5)*0.7,y+0.5+(Math.random()-0.5)*0.7,
								"rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.3+0.3)+")",4,6+Math.random()*2,0.2))
						for(let i = 0; i < 3;i++){
							setTimeout(()=>{camera.particles.push(new explosionR(x+0.5+(Math.random()-0.5)*0.7,y+0.5+(Math.random()-0.5)*0.7,
								"rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.3+0.3)+")",4,6+Math.random()*2,0.2))},Math.random()*400)
						}
					}
					camera.playSound("shot")
					camera.particles.push(new lineParticle(this.x+0.5,this.y+0.5,x+0.5,y+0.5,10,
						(x)=>{let mr = Math.random()*255
							return("rgb(0,"+mr+","+mr+")")},0.6))
				}
				this.cooldown = this.maxCD + 5
				this.coolUntil = Date.now() + 1000*this.cooldown
				this.uplim = undefined
				this.held = false
			}
		}


		this.cooldown = 2
		this.coolUntil = Date.now() + 2000

		if(this.team == "zombies"){
			this.maxCD += 1
		}

	}


	move(x,y){
		let pos = spos(x,y)
		let legals = this.legals()
		let moves = legals.arr
		if(legals.dict[pos] == undefined){return(false)}

		board.tiles[spos(this.x,this.y)].piece = undefined
		let originalX = this.x
		let originalY = this.y
			this.x = x
			this.y = y

		if(board.tiles[pos].piece != undefined){
			if(board.tiles[pos].piece.onDeath != undefined){
				board.tiles[pos].piece.onDeath()
			}
			
			board.tiles[pos].piece.alive = false
			kill(this.x,this.y)
			this.kills += 1;
			if(this.team!="zombies"){

				displayKills(this.kills,this.x,this.y)
			}
			console.log(board.tiles[pos].piece.team+" "+board.tiles[pos].piece.id+" has been killed!")
		}

		board.tiles[pos].piece = this;
		this.cooldown = this.maxCD
		this.coolUntil = Date.now() + 1000*this.maxCD

		this.arrFuncs.onMove.forEach((e)=>{
			e(originalX,originalY,this,legals.dict[pos])
		})

		return(legals.dict[pos])
	}	

	CDcheck(){
		if(this.cooldown == 0){return(0)}
		let tn = Date.now()
		this.cooldown = (this.coolUntil - tn)/1000
		if(this.cooldown <= 0){
			this.cooldown = 0
			this.cooldownFinish()
			return(0)
		}
		return(this.cooldown)
	}
	cooldownFinish(){
		if(this.team == "zombies"){
			setTimeout(()=>{
				AImoveRandom(this)
			// },Math.random()*4000)
			},this.AIwait == undefined?board.AIwait():this.AIwait())
		} else {
			camera.particles.push(new explosionR(this.x+0.5,this.y+0.5,"rgba(255,255,0,0.5)",10,18,0.2))
			let premoved = false
			while(!premoved && this.premoves.length > 0){
				premoved = attemptMove(this.x,this.y,this.premoves[0][0],this.premoves[0][1],this.team)
				friendlyMoved(premoved)
				this.premoves.splice(0,1)
			}
		}
	}



}

function setPieceCooldown(piece,t){
		piece.cooldown = t
		piece.coolUntil = Date.now() + t*1000
	}

function killBoardPiece(x,y,killerPiece){
	let pos = spos(x,y)
	if(board.tiles[pos] != undefined){
	if(board.tiles[pos].piece != undefined){
			if(board.tiles[pos].piece.onDeath != undefined){
				board.tiles[pos].piece.onDeath()
			}
			board.tiles[pos].piece.alive = false

			killerPiece.kills += 1;

			if(killerPiece.team!="zombies"){

				displayKills(killerPiece.kills,killerPiece.x,killerPiece.y)
			}
			console.log(board.tiles[pos].piece.team+" "+board.tiles[pos].piece.id+" has been killed!")
			board.tiles[pos].piece = undefined
			return(true)
		}
	}
}

function AImoveRandom(piece){

	if(piece.AImoveRandom !== undefined){
		piece.AImoveRandom(piece)
	}
	let legals = piece.legals()
	let legal = legals.arr
	if(legal.length == 0){
		setTimeout(()=>{
				AImoveRandom(piece)
			// },Math.random()*4000+3000)
			},piece.AIblockWait == undefined?board.AIblockWait():piece.AIblockWait())
		return
	}

	//capture piece
	let capturables = []
	legal.forEach((e)=>{
		if(legals.dict[e] == "capture"){
			capturables.push(e)
		}
	})
	if(capturables.length > 0){
		let moveString = capturables[Math.floor(Math.random()*capturables.length)]
		let ip = ipos(moveString)
		let opx = piece.x
		let opy = piece.y
		let result = attemptMove(piece.x,piece.y,ip.x,ip.y,piece.team)
		if(result == "capture"){
			// camera.playSound("./sounds/captureF.wav")
			camera.playSoundF("0")
			camera.particles.push(new lineParticle(opx+0.5,opy+0.5,piece.x+0.5,piece.y+0.5,10,
						(x)=>{let mr = Math.random()*255
							return("rgb("+(mr<20?255-mr:0)+","+(mr/2)+",0)")},0.1))
		}
	}
	//capture piece
	if(board.tiles[spos(piece.x,piece.y)] == undefined || board.tiles[spos(piece.x,piece.y)].piece == undefined){return}
	let result;
	while(piece.cooldown == 0 && piece == board.tiles[spos(piece.x,piece.y)].piece){

		let moveString = legal[Math.floor(Math.random()*legal.length)]
		let ip = ipos(moveString)

		
		//move front
		if(ipos.y < piece.y && Math.random()>0.6){
			continue;
		}
		//move front


		result = attemptMove(piece.x,piece.y,ip.x,ip.y,piece.team)
	}
	return(result)
}

function attemptMove(x,y,tx,ty,team){
	let pos = spos(x,y)
	let tpos = spos(tx,ty)
	let tile = board.tiles[pos]
	if(tile == undefined || board.tiles[tpos] == undefined || tile.piece == undefined || tile.piece.team != team || tile.piece.cooldown != 0){
		return(false)
	}
	return(movePiece(x,y,tx,ty,team))
}






function board_to_screen(x,y){
	return([(x+camera.x)*tileSize,(y+camera.y)*tileSize])
}
function screen_to_board(x,y){
	return([x/tileSize-camera.x,y/tileSize-camera.y])
}

class expandingText{
		constructor(text,x,y,colorf,speed,s2){
		this.x = x
		this.text = text
		this.speed = speed?speed:1
		this.s2 = (s2?s2:1)/5
		this.y = y
		this.colorf = colorf
		this.size = 3
		this.actLife = 600
		this.lastTime = Date.now()		
	}

	update(t){
		this.size += this.speed*(t-this.lastTime)/50
		this.actLife -= this.s2*(t-this.lastTime)
		this.lastTime = t
	}
	draw(){
		if(this.actLife < 0){
			return('del')
		}
		ctx.textAlign = "center"
		ctx.fillStyle = this.colorf(this.actLife/600)
		ctx.beginPath()
		ctx.font = "bold "+(this.size)+"px Courier New"
		// ctx.font = "bold "+(Math.floor(this.size))+"px Courier New"
		let bts = board_to_screen(this.x+0.5,this.y+0.5)
		ctx.fillText(this.text,bts[0],bts[1])
	}
}//camera.particles.push(new expandingText("5",2,2,(x)=>{return("rgba(180,150,150,"+x+")")},5,5))

class explosionR{
	constructor(x,y,color,speed,s2,size){
		this.x = x
		this.speed = speed?speed:1
		this.s2 = (s2?s2:1)/5
		this.y = y
		this.color = color
		if(typeof(color) !== "string"){this.colorf = color; this.color = "#FF00FF"}
		this.size = 3
		this.lineWidth = size?size:1
		this.actLife = 600
		this.lastTime = Date.now()		
	}

	update(t){
		this.size += this.speed*(t-this.lastTime)/50
		this.actLife -= this.s2*(t-this.lastTime)
		this.lastTime = t
		if(this.colorf !== undefined){
			this.color = this.colorf(this.actLife/600)
		}
	}
	draw(){
		if(this.actLife < 0){
			return('del')
		}
		ctx.strokeStyle = this.color
		ctx.lineWidth = (1 + this.actLife/10)*this.lineWidth*camera.tileRsize
		ctx.beginPath()
		let bts = board_to_screen(this.x,this.y)
		ctx.arc(bts[0],bts[1], this.size*camera.tileRsize, 0, 2 * Math.PI);
		ctx.stroke()
		
	}
}

function chargeArc(x,y,size,percentage){
	ctx.beginPath()
	ctx.arc(x,y,size,-0.5*Math.PI,2*Math.PI*percentage-0.5*Math.PI)
	ctx.stroke()
}


function kill(x,y){
	for(let i = 0; i < 16; i++){
		let dx = Math.random()-0.5
		let dy = Math.random()-0.5
		camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*14,14*dy,Math.random()*0.03,Math.random()*3+3,false))
	}
	camera.particles.push(new explosionR(x+0.5+(Math.random()-0.5)*0.7,y+0.5+(Math.random()-0.5)*0.7,
			"rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.3+0.3)+")",2,6+Math.random()*2,0.2))
	for(let i = 0; i < 3;i++){
		setTimeout(()=>{camera.particles.push(new explosionR(x+0.5+(Math.random()-0.5)*0.7,y+0.5+(Math.random()-0.5)*0.7,
			"rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.3+0.3)+")",2,6+Math.random()*2,0.2))},Math.random()*400)
	}
}

class lineParticle{
	constructor(x,y,tx,ty,size,colorf,s2){
		this.x = x
		this.y = y
		this.tx = tx
		this.ty = ty
		this.size = size
		this.colorf = colorf
		this.actLife = 1000
		this.s2 = (s2?s2:1)
		this.lastTime = Date.now()
	}
	update(t){
		this.actLife -= this.s2 * (t-this.lastTime)
		this.lastTime = t
	}
	draw(){
		if(this.actLife < 1){
			return('del')
		}
		ctx.strokeStyle = this.colorf(this.actLife/1000)
		let bts1 = board_to_screen(this.x,this.y)
		let bts2 = board_to_screen(this.tx,this.ty)
		ctx.lineWidth = this.size*(this.actLife/1000)*camera.tileRsize
		ctx.beginPath()
		ctx.moveTo(bts1[0],bts1[1])
		ctx.lineTo(bts2[0],bts2[1])
		ctx.stroke()
	}
}
class bloodParticle{
	constructor(x,y,vx,vy,rv,size,duplicator){
		this.x = x
		this.y = y
		this.vx = vx/100
		this.vy = vy/100
		this.rv = rv/300
		this.friction = 0.9
		this.size = size
		this.actualSize = size
		this.duplicator = duplicator?duplicator:false
		this.color = "rgba("+(Math.random()*235+20)+","+(Math.random()*15)+","+(Math.random()*15)+","+(Math.random()*0.3+0.3)+")"
		this.lastTime = Date.now()
		this.life = 1000+Math.random()*3000
	}
	update(t){

		let dt = (t-this.lastTime)
		if(this.life < 1000){
		this.actualSize = this.size * Math.sqrt(this.life) / 31.62}
		this.life -= (t-this.lastTime)/2
		this.lastTime = t
		this.vx += (Math.random()-0.5)*this.rv*dt
		this.vy += (Math.random()-0.5)*this.rv*dt
		this.vx *= (this.life>700?this.friction:this.life/700)
		this.vy *= (this.life>700?this.friction:this.life/700)
		this.x += this.vx
		this.y += this.vy
	}
	draw(){
		if(this.life < 0){
			return('del')
		}
		ctx.strokeStyle = this.color
		ctx.fillStyle = this.color
		ctx.lineWidth = (1 + this.actLife/10)*this.lineWidth
		ctx.beginPath()
		let bts = board_to_screen(this.x,this.y)
		ctx.arc(bts[0],bts[1], this.actualSize*camera.tileRsize, 0, 2 * Math.PI);
		ctx.fill()
		ctx.closePath()
		// ctx.stroke()
	}
}


function displayKills(kills,x,y,size,speed){
	speed = speed?speed:7
	size = size?size:4
	let f;
	if(kills < 11){
		f = (X)=>{return("rgba(250,"+(250-kills*25)+","+(250-kills*25)+","+(2.5*X)+")")}
	} else if(kills%10 === 0){
		f = (X)=>{return("rgba(0,0,"+(Math.random()*150)+","+(2.5*X)+")")}
		if(size == 4){
			size = 2.5;
		}
	} else {

		f = (X)=>{return("rgba("+(250-kills*3+Math.random()*kills*3)+",0,0,"+(2.5*X)+")")}
	}

	camera.particles.splice(0,0,new expandingText(kills,x,y,
	f,
	speed+kills/20,size))
}


//pawn 2 moves
//images
//different color cooldown


var gameEvents = {
	"elite knight":()=>{
		camera.particles.push(new expandingText("An Elite Knight Spawned",Width/2/tileSize-camera.x,Height/2/tileSize-camera.y,
		(x)=>{return("rgba(255,255,0,"+x+")")},
		0.5,0.9))
		camera.particles[camera.particles.length-1].size = tileSize/2

		board.tiles["4,0"].piece = new piece("knight",4,0,"zombies")
		let pc = board.tiles["4,0"].piece
		pc.maxCD = 3
		pc.color = "rgb(50,150,0)"
		pc.draw = (l,x,y)=>{
			if(Math.random() > 0.95){
				let dx = Math.random()-0.5
				let dy = Math.random()-0.5
				camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*14,14*dy,Math.random()*0.03,Math.random()*3+3,false))
			}
			return(true)
		}
		pc.AIwait = ()=>{return(10)}
		pc.AIblockWait = ()=>{return(300)}
	},
	"elite rook":()=>{
		board.tiles["4,0"].piece = new piece("rook",4,0,"zombies")
		let pc = board.tiles["4,0"].piece
		pc.maxCD = 4
		pc.color = "rgb(50,150,0)"
		pc.draw = (l,x,y)=>{
			if(Math.random() > 0.95){
				let dx = Math.random()-0.5
				let dy = Math.random()-0.5
				camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*14,14*dy,Math.random()*0.03,Math.random()*3+3,false))
			}
			return(true)
		}
		pc.AIwait = ()=>{return(10)}
		pc.AIblockWait = ()=>{return(300)}
	},"elite bishop":()=>{
		board.tiles["4,0"].piece = new piece("bishop",4,0,"zombies")
		let pc = board.tiles["4,0"].piece
		pc.maxCD = 4
		pc.color = "rgb(50,150,0)"
		pc.draw = (l,x,y)=>{
			if(Math.random() > 0.95){
				let dx = Math.random()-0.5
				let dy = Math.random()-0.5
				camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*14,14*dy,Math.random()*0.03,Math.random()*3+3,false))
			}
			return(true)
		}
		pc.AIwait = ()=>{return(10)}
		pc.AIblockWait = ()=>{return(300)}
	},"elite queen":()=>{
		board.tiles["4,0"].piece = new piece("queen",4,0,"zombies")
		let pc = board.tiles["4,0"].piece
		pc.maxCD = 5
		pc.color = "rgb(50,150,0)"
		pc.draw = (l,x,y)=>{
			if(Math.random() > 0.95){
				let dx = Math.random()-0.5
				let dy = Math.random()-0.5
				camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*14,14*dy,Math.random()*0.03,Math.random()*3+3,false))
			}
			return(true)
		}
		pc.AIwait = ()=>{return(10)}
		pc.AIblockWait = ()=>{return(300)}
	},"elite cannon":()=>{
		let pc = spawnZombie(new piece("cannon",4,0,"zombies"))
		if(pc === false){return}
		pc.maxCD = 5
		pc.color = "rgb(50,150,0)"
		pc.draw = (l,x,y)=>{
			if(Math.random() > 0.95){
				let dx = Math.random()-0.5
				let dy = Math.random()-0.5
				camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*14,14*dy,Math.random()*0.03,Math.random()*3+3,false))
			}
			return(true)
		}
		pc.AIwait = ()=>{return(10)}
		pc.AIblockWait = ()=>{return(300)}
	},"board expansion":(e,l)=>{
		e = e?e:20
		for(let i = 0; i < e; i++){
			setTimeout(()=>{
				let y = l?l*-1:-5
				// console.log(y)
				let x = Math.floor(Math.random()*8)
				while(Math.random()>0.4||board.tiles[x+","+y] != undefined){
					y -= 1
				}
				if(board.tiles[x+","+y] == undefined){board.tiles[x+","+y] = {}; if(y < board.topTile){board.topTile=y}} else {
				}
			},i*200)
			
		}
	}, "piece storm":(t,f)=>{
		t = t?t:12
		f = f?f:100
		// startGameInterval(f)
		// setTimeout(()=>{startGameInterval(camera.pieceFrequency)},t)
		for(let i = 0; i < t; i++){
			setTimeout(()=>{
			let name = board.spawnRates[0]
			let rng = Math.random()
			for(let i = 0; i < board.spawnRates.length/2;i++){
				if(rng < board.spawnRates[i*2+1]){name = board.spawnRates[i*2];break;}
			}
			spawnZombie(new piece(name,0,0,"zombies",{"direction":"y+"}))
		},f*i)
		}
	},"pawn swarm":(n,c)=>{
	camera.particles.push(new expandingText("pawn swarm",Width/2/tileSize-camera.x,Height/2/tileSize-camera.y,
		(x)=>{return("rgba(0,0,250,"+x+")")},
		0.5,0.9))
		n = n?n:5
		c = c?c:5
		for(let i = 0; i < n; i++){
			setTimeout(()=>{
				let pc = spawnZombie(new piece("pawn",4,0,"zombies",{"direction":"y+"}))
				pc.maxCD = c
				setPieceCooldown(pc,5)
				pc.color = "rgb(0,130,0)"
			},i*200)
		}

	},"bomber pawn":()=>{
		

		let pc = spawnZombie(new piece("pawn",4,0,"zombies",{"direction":"y+"}))
		if(pc === false){return}

		camera.particles.push(new expandingText("An bomber has Spawned",Width/2/tileSize-camera.x,Height/2/tileSize-camera.y,
		(x)=>{return("rgba(255,255,0,"+x+")")},
		0.5,0.9))
		camera.particles[camera.particles.length-1].size = tileSize/2

		// pc.maxCD = 3
		pc.color = "rgb(50,150,0)"
		pc.draw = (l,x,y)=>{
			if(Math.random() > 0.9){
				let dx = Math.random()-0.5
				let dy = Math.random()-0.5
				camera.particles.push(new bloodParticle(x+0.5+0.6*dx,y+0.5+0.6*dy,dx*7,7*dy,Math.random()*0.03,Math.random()*3+3,false))
				let rr = Math.random()*235+20
				camera.particles[camera.particles.length-1].color = "rgba("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+","+(Math.random()*0.3+0.3)+")"
			}
			return(true)
		}
		pc.arrFuncs.onMove.push(()=>{
			if(Math.random() > 0.9 || pc.y == 11){
				pc.onDeath()
			}
		})
		pc.onDeath = ()=>{
			pc.onDeath = undefined
			camera.playSound("bomb")
			for(let i = 0; i < 16; i++){
							let dx = Math.random()-0.5
							let dy = Math.random()-0.5
							camera.particles.push(new bloodParticle(pc.x+0.5+0.6*dx,pc.y+0.5+0.6*dy,dx*34,34*dy,Math.random()*0.2,Math.random()*3+3,false))
							camera.particles[camera.particles.length-1].friction = 0.98
						}

			camera.particles.push(new explosionR(pc.x+0.5,pc.y+0.5,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
					16,8,2))
			camera.particles.push(new explosionR(pc.x+0.5,pc.y+0.5,
					(x)=>{
						let rr = 250*Math.random()
						return("rgb("+(rr)+","+(Math.random()*rr)+","+(Math.random()*15)+")")},
					6,2,1))

			setTimeout(()=>{


			for(let i = -1; i < 2; i++){
				for(let j = -1 ;j < 2; j++){
					if(board.tiles[spos(pc.x+i,pc.y+j)]?.piece != undefined){
						let pct = board.tiles[spos(pc.x+i,pc.y+j)].piece
						if(pct.onDeath != undefined && pct != pc){
							pct.onDeath()
						}
						pct.alive = false
						board.tiles[spos(pc.x+i,pc.y+j)].piece = undefined
						for(let i = 0; i < 16; i++){
							let dx = Math.random()-0.5
							let dy = Math.random()-0.5
							dx += (pct.x - pc.x)*0.3
							dy += (pct.y - pc.y)*0.3
							camera.particles.push(new bloodParticle(pct.x+0.5+0.6*dx,pct.y+0.5+0.6*dy,dx*24,24*dy,Math.random()*0.03,Math.random()*3+3,false))
							camera.particles[camera.particles.length-1].friction = 0.94
						}
					}
				}
			}
			},200)
		}
		pc.AIwait = ()=>{return(10)}
		pc.AIblockWait = ()=>{return(300)}
		return(pc)
	},"reinforcements":(y)=>{
		for(let i = 0; i < 8; i++){
			board.tiles[i+","+(y-1)]= {"piece":new piece("pawn",i,y-1,"p1",{"direction":"y-"})}
		}
		board.tiles[0+","+y]= {"piece":new piece("rook",0,y,"p1",)}
		board.tiles[1+","+y]= {"piece": new piece("knight",1,y,"p1")}
		board.tiles[2+","+y]= {"piece": new piece("bishop",2,y,"p1",)}
		board.tiles[3+","+y]= {"piece": new piece("queen",3,y,"p1")}
		board.tiles[4+","+y]= {"piece": new piece("king",4,y,"p1")}
		board.tiles[5+","+y]= {"piece": new piece("bishop",5,y,"p1")}
		board.tiles[6+","+y]= {"piece": new piece("knight",6,y,"p1")}
		board.tiles[7+","+y]= {"piece": new piece("rook",7,y,"p1")}
	},"flight chamber":(ap)=>{
		camera.pieceFrequency -= 200
		camera.particles.push(new expandingText("Flight chamber mode!",Width/2/tileSize-camera.x,Height/2/tileSize-camera.y,
		(x)=>{return("rgba(255,255,0,"+x+")")},
		0.2,0.2))
		camera.particles[camera.particles.length-1].size = tileSize/2

		// gameEvents["board expansion"](20,1)
		
			ap.bottom = 11
			ap.arrFuncs.onMove.push((x,y)=>{
				if(ap.y<y){
					for(let i = 0; i < 8; i++){
						for(let j = ap.bottom; j > ap.y; j--){
							if(board.tiles[i+","+j]?.piece != undefined){
								return;
							}
						}
					}
					let blocksdisplaced = 0;
					for(let i = 0; i < 8; i++){
						for(let j = ap.bottom+15; j > ap.y; j--){
							if(board.tiles[i+","+j] != undefined){
								board.tiles[i+","+j] = undefined
								blocksdisplaced += 1
							}
						}
					}
					ap.bottom = ap.y
					gameEvents["board expansion"](blocksdisplaced,-ap.y+8)

				}
			})
		// board.spawnRates = ["pawn",0.6,"king",0.77,"knight",0.94,"bishop",0.98,"rook",1]
			board.spawnRates = ["pawn",0.65,"king",0.80,"knight",0.95,"bishop",0.98,"rook",1]
		gameEvents["piece storm"](8)
	}
}


function spawnZombie(pc){
	let X = Math.floor(Math.random()*8)
	for(let i = 0; i < 8; i++){
		let x = (X+i)%8
		let y = board.topTile;
		while(board.tiles[x+","+y] == undefined || board.tiles[x+","+y].piece != undefined){
			y+=1
			if(y > 1){break;}
		}
		if(y > 1){continue;}
		board.tiles[x+","+y].piece = pc
		pc.x = x
		pc.y = y
		return(pc)
	}
	return(false)
}



//bottom lose
//pawn promotion <-
//normal difficulty curve <-
//special tiles
//event triggerer
//help menu


