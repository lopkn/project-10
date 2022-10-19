class ten{
	static logger = []

	static rooms = {}
	static players = {}

	static joinRm(e,socket){
		let id = e[0]
		let rm = e[1]
		if(this.rooms[rm] == undefined){
			this.rooms[rm] = {"players":{},"started":false,"map":{},"turn":1}
			for(let i = 0; i < 3; i++){
				for(let j = 0; j < 3; j++){
					map[i+","+j] = {"checked":0,"minmap":{}}
					for(let a = 0; a < 3; a++){
						for(let b = 0; b < 3; b++){
							map[i+","+j].minmap[a+","+b] = {"checked":0}
						}
					}
				}
			}
		} else if(this.rooms[rm].started){
			return;
		}
		if(this.players[id] = undefined && Object.keys(this.rooms[rm].players).length < 2){
			this.players[id] = {"room":rm,"id":id,"no":Object.keys(this.rooms[rm].players).length+1}
			this.rooms[rm].players[id] = this.players[id]

			if(this.players[id].no == 2){
				this.startRm(rm)
			}

		} else {
			return;
		}
	}

	static startRm(e){
		let room = this.rooms[e]
		room.started = true
		room.plArr = Object.keys(room.players)

		room.plArr.forEach((e)=>{
			io.to(e).emit("startRm",[room.map,this.players[e].no])
		})
	}

	static processClick(e){
		let rm = this.payers[e.id].room
		let room = this.rooms[rm]

	}


	static checkLine(d){
		if(d["0,0"]&&d["0,1"]&&d["0,2"]){
			return(true)
		}
		if(d["1,0"]&&d["1,1"]&&d["1,2"]){
			return(true)
		}
		if(d["2,0"]&&d["2,1"]&&d["2,2"]){
			return(true)
		}

		if(d["0,0"]&&d["1,0"]&&d["2,0"]){
			return(true)
		}
		if(d["0,1"]&&d["1,1"]&&d["2,1"]){
			return(true)
		}
		if(d["0,2"]&&d["1,2"]&&d["2,2"]){
			return(true)
		}

		if(d["0,0"] && d["1,1"] && d["2,2"]){
			return(true)
		}
		if(d["0,2"] && d["1,1"] && d["2,0"]){
			return(true)
		}
		return(false)
	}

}


module.exports = {ten}