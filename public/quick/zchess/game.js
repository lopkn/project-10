
function spos(x,y){
	return(x+","+y);
}
function ipos(str){
	let a = str.split(",")
	return({"x":a[0],"y":a[1]})
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
			this.range = 5
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
		} else if(id == "pawn"){
			if(this.tags.direction == "y+"){
				this.legals = ()=>{
					let legals = []
					if(getTileTeam(spos(this.x,this.y+1)) == "empty"){legals.push(spos(this.x,this.y+1))}
					if(getTileTeam(spos(this.x+1,this.y+1)) == "capture"){legals.push(spos(this.x+1,this.y+1))}
					if(getTileTeam(spos(this.x-1,this.y+1)) == "capture"){legals.push(spos(this.x-1,this.y+1))}
					return(legals)
				}
			}
			if(this.tags.direction == "y-"){
				this.legals = ()=>{
					let legals = []
					if(getTileTeam(spos(this.x,this.y-1)) == "empty"){legals.push(spos(this.x,this.y-1))}
					if(getTileTeam(spos(this.x+1,this.y-1)) == "capture"){legals.push(spos(this.x+1,this.y-1))}
					if(getTileTeam(spos(this.x-1,this.y-1)) == "capture"){legals.push(spos(this.x-1,this.y-1))}
					return(legals)
				}
			}
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

	}




}