
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
	static pieceModifiers = []
	static iterations = 0;
	static topTile = 0;
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
		// let movable = false
		// for(let i = 0; i < moves.length; i++)
		// 	{if(moves[i]==pos){movable=true;break;}}
		// if(movable === false){return(false)}

		board.tiles[spos(this.x,this.y)].piece = undefined

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
			},board.AIwait())
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
	let legals = piece.legals()
	let legal = legals.arr
	if(legal.length == 0){
		setTimeout(()=>{
				AImoveRandom(piece)
			// },Math.random()*4000+3000)
			},board.AIblockWait())
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
	while(piece.cooldown == 0 && piece == board.tiles[spos(piece.x,piece.y)].piece){

		let moveString = legal[Math.floor(Math.random()*legal.length)]
		let ip = ipos(moveString)

		
		//move front
		if(ipos.y < piece.y && Math.random()>0.6){
			continue;
		}
		//move front


		attemptMove(piece.x,piece.y,ip.x,ip.y,piece.team)
	}
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
		ctx.font = "bold "+(Math.floor(this.size))+"px Courier New"
		let bts = board_to_screen(this.x+0.5,this.y+0.5)
		ctx.fillText(this.text,bts[0],bts[1]+this.size/4)
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

	camera.particles.push(new expandingText(kills,x,y,
	f,
	speed+kills/20,size))
}


//pawn 2 moves
//images
//different color cooldown




