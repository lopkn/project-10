
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

	static emptyNew(){
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 12; j++){
				this.tiles[i+","+j] = {};
			}
		}
		for(let i = 2; i < 6; i++){
			this.tiles[i+","+10].piece = new piece("pawn",i,10,"p1",{"direction":"y-"})
		}
			this.tiles[2+","+11].piece = new piece("rook",2,11,"p1",)
			this.tiles[3+","+11].piece = new piece("bishop",3,11,"p1")
			this.tiles[4+","+11].piece = new piece("king",4,11,"p1")
			this.tiles[5+","+11].piece = new piece("knight",5,11,"p1")
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
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				return(legals)
			}
		}else if(id == "bishop"){
			this.maxCD = 12
			this.range = 5
			this.renderLetter = "B"
			this.legals = ()=>{
				let loop = true
				let legals = []
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y+i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x-i,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				for(let i = 1;i<this.range+1;i++){
					let pos = spos(this.x+i,this.y-i)
					let gtt = getTileTeam(pos,this.team)
					if(gtt == false || gtt == "block"){break};
					if(gtt == "phase"){continue;}
					if(gtt == "capture"){legals.push(pos);break}
					legals.push(pos)

				}
				return(legals)
			}
		} else if(id == "knight"){
			this.maxCD = 10
			this.renderLetter = "K"
			this.jumps = [[2,1],[1,2],[-1,2],[-2,1],[1,-2],[-1,-2],[-2,-1],[2,-1]]
			this.legals = ()=>{
				let legals = []
				this.jumps.forEach((s)=>{
					let e = spos(s[0]+this.x,s[1]+this.y)
					let gtt = getTileTeam(e,this.team)
					if(gtt == "capture" || gtt == "empty"){legals.push(e)}
				})
				return(legals)
			}
		} else if(id == "king"){
			this.maxCD = 20
			this.renderLetter = "G"
			this.jumps = [[0,1],[0,-1],[-1,1],[1,-1],[1,0],[-1,0],[-1,-1],[1,1]]
			this.legals = ()=>{
				let legals = []
				this.jumps.forEach((s)=>{
					let e = spos(s[0]+this.x,s[1]+this.y)
					let gtt = getTileTeam(e,this.team)
					if(gtt == "capture" || gtt == "empty"){legals.push(e)}
				})
				return(legals)
			}
		} else if(id == "pawn"){
			this.maxCD = 7
			this.renderLetter = "P"
			if(this.tags.direction == "y+"){
				this.legals = ()=>{
					let legals = []
					if(getTileTeam(spos(this.x,this.y+1),this.team) == "empty"){legals.push(spos(this.x,this.y+1))}
					if(getTileTeam(spos(this.x+1,this.y+1),this.team) == "capture"){legals.push(spos(this.x+1,this.y+1))}
					if(getTileTeam(spos(this.x-1,this.y+1),this.team) == "capture"){legals.push(spos(this.x-1,this.y+1))}
					return(legals)
				}
			}
			if(this.tags.direction == "y-"){
				this.legals = ()=>{
					let legals = []
					if(getTileTeam(spos(this.x,this.y-1),this.team) == "empty"){legals.push(spos(this.x,this.y-1))}
					if(getTileTeam(spos(this.x+1,this.y-1),this.team) == "capture"){legals.push(spos(this.x+1,this.y-1))}
					if(getTileTeam(spos(this.x-1,this.y-1),this.team) == "capture"){legals.push(spos(this.x-1,this.y-1))}
					return(legals)
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
		let moves = this.legals()
		let movable = false
		for(let i = 0; i < moves.length; i++)
			{if(moves[i]==pos){movable=true;break;}}
		if(movable === false){return(false)}

		board.tiles[spos(this.x,this.y)].piece = undefined

		this.x = x
		this.y = y

		if(board.tiles[pos].piece != undefined){
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
		if(this.cooldown < 0){
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
		}
	}


}
function AImoveRandom(piece){
	let legal = piece.legals()
	if(legal.length == 0){
		setTimeout(()=>{
				AImoveRandom(piece)
			},Math.random()*4000+3000)
		return
	}
	while(piece.cooldown == 0 && piece == board.tiles[spos(piece.x,piece.y)].piece){
		let moveString = legal[Math.floor(Math.random()*legal.length)]
		let ip = ipos(moveString)
		if(ipos.y < piece.y && Math.random()>0.6){
			continue;
		}
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