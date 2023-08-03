
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
	static topTile = 0;
	static emptyNew(){
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 12; j++){
				this.tiles[i+","+j] = {};
			}
		}
		for(let i = 0; i < 8; i++){
			this.tiles[i+","+10].piece = new piece("pawn",i,10,"p1",{"direction":"y-"})
			this.tiles[i+","+5].piece = new piece("knight",i,5,"p1",{"direction":"y-"})
			this.tiles[i+","+4].piece = new piece("knight",i,4,"p1",{"direction":"y-"})
		}
			this.tiles[0+","+11].piece = new piece("rook",0,11,"p1",)
			this.tiles[1+","+11].piece = new piece("knight",1,11,"p1")
			this.tiles[2+","+11].piece = new piece("bishop",2,11,"p1",)
			this.tiles[3+","+11].piece = new piece("queen",3,11,"p1")
			this.tiles[4+","+11].piece = new piece("king",4,11,"p1")
			this.tiles[5+","+11].piece = new piece("bishop",5,11,"p1")
			this.tiles[6+","+11].piece = new piece("knight",6,11,"p1")
			this.tiles[7+","+11].piece = new piece("rook",7,11,"p1")
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
		this.team = team
		

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
			this.renderLetter = "K"
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
			this.renderLetter = "G"
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
		}


		this.cooldown = 2
		this.coolUntil = Date.now() + 2000

		if(this.team == "zombies"){
			this.maxCD += 1
		}

	}


	move(x,y){
		let pos = spos(x,y)
		let moves = this.legals().arr
		let movable = false
		for(let i = 0; i < moves.length; i++)
			{if(moves[i]==pos){movable=true;break;}}
		if(movable === false){return(false)}

		board.tiles[spos(this.x,this.y)].piece = undefined

		this.x = x
		this.y = y

		if(board.tiles[pos].piece != undefined){
			kill(this.x,this.y)
			console.log(board.tiles[pos].piece.team+" "+board.tiles[pos].piece.id+" has been killed!")
		}

		board.tiles[pos].piece = this;
		this.cooldown = this.maxCD
		this.coolUntil = Date.now() + 1000*this.maxCD
		return(true)
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
			},Math.random()*4000)
		} else {
			camera.particles.push(new explosionR(this.x+0.5,this.y+0.5,"rgba(255,255,0,0.5)",10,18,0.2))
		}
	}


}
function AImoveRandom(piece){
	let legals = piece.legals()
	let legal = legals.arr
	if(legal.length == 0){
		setTimeout(()=>{
				AImoveRandom(piece)
			},Math.random()*4000+3000)
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
		attemptMove(piece.x,piece.y,ip.x,ip.y,piece.team)
	}
	//capture piece

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

class explosionR{
	constructor(x,y,color,speed,s2,size){
		this.x = x
		this.speed = speed?speed:1
		this.s2 = (s2?s2:1)/5
		this.y = y
		this.color = color
		this.size = 3
		this.lineWidth = size?size:1
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
		ctx.strokeStyle = this.color
		ctx.lineWidth = (1 + this.actLife/10)*this.lineWidth
		ctx.beginPath()
		let bts = board_to_screen(this.x,this.y)
		ctx.arc(bts[0],bts[1], this.size, 0, 2 * Math.PI);
		ctx.stroke()
		
	}
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


class bloodParticle{
	constructor(x,y,vx,vy,rv,size,duplicator){
		this.x = x
		this.y = y
		this.vx = vx/100
		this.vy = vy/100
		this.rv = rv/300
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
		this.vx *= (this.life>700?0.9:this.life/700)
		this.vy *= (this.life>700?0.9:this.life/700)
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
		ctx.arc(bts[0],bts[1], this.actualSize, 0, 2 * Math.PI);
		ctx.fill()
		// ctx.stroke()
	}
}








