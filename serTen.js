class ten{
	static logger = []

	static rooms = {}
	static players = {}

	static joinRm(e,socket){
		console.log(e)
		let id = e[0]
		let rm = e[1]
		if(this.rooms[rm] == undefined){
			this.rooms[rm] = {"players":{},"started":false,"map":{},"turn":1,"limiting":"all"}
			for(let i = 0; i < 3; i++){
				for(let j = 0; j < 3; j++){
					this.rooms[rm].map[i+","+j] = {"checked":0,"minmap":{}}
					for(let a = 0; a < 3; a++){
						for(let b = 0; b < 3; b++){
							this.rooms[rm].map[i+","+j].minmap[a+","+b] = {"checked":0}
						}
					}
				}
			}
		} else if(this.rooms[rm].started){
			return;
		}

		if(this.players[id] == undefined && Object.keys(this.rooms[rm].players).length < 2){
			this.players[id] = {"room":rm,"id":id,"no":Object.keys(this.rooms[rm].players).length+1}

			console.log(this.players, "EEE")

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
			io.to(e).emit("startRm",[room.map,room.turn,this.players[e].no])
		})
	}

	static processClick(e){
		let pl = this.players[e.id]
		let rm = pl.room
		let room = this.rooms[rm]

		if(room.turn != pl.no){
			return;
		}

		if(room.map[e.c] == undefined){
			return;
		}

		if(room.map[e.c].checked !== 0){
			return;
		}
		if((room.limiting !== e.c&&room.limiting != "all")){
			// console.log(room.limiting)
			return;
		}
		let bx = room.map[e.c].minmap

		if(bx[e.c2].checked !== 0){
			return;
		}

		bx[e.c2].checked = room.turn

		let c = this.checkLine((a)=>{return(room.map[e.c].minmap[a].checked == room.turn)})
		console.log(c)
		if(c){
			room.map[e.c].checked = room.turn
		}

		room.limiting = this.getLimiting(room.map,e.c2)

		room.turn = room.turn == 1? 2 : 1

		room.plArr.forEach((e)=>{
			io.to(e).emit("updateMap",[room.map,room.turn,room.limiting])
		})

	}

	static getLimiting(d,x){
		let m = d[x].minmap
		if(d[x].checked !== 0 || (m["0,0"].checked !== 0 &&m["2,0"].checked !== 0 &&m["2,0"].checked !== 0 &&m["0,1"].checked !== 0 &&m["1,1"].checked !== 0 &&m["2,1"].checked !== 0 &&m["0,2"].checked !== 0 &&m["1,2"].checked !== 0 &&m["2,2"].checked !== 0)){
			return("all")
		}
		return(x)
	}


	static checkLine(d){
		if(d("0,0")&&d("0,1")&&d("0,2")){
			return(true)
		}
		if(d("1,0")&&d("1,1")&&d("1,2")){
			return(true)
		}
		if(d("2,0")&&d("2,1")&&d("2,2")){
			return(true)
		}

		if(d("0,0")&&d("1,0")&&d("2,0")){
			return(true)
		}
		if(d("0,1")&&d("1,1")&&d("2,1")){
			return(true)
		}
		if(d("0,2")&&d("1,2")&&d("2,2")){
			return(true)
		}

		if(d("0,0") && d("1,1") && d("2,2")){
			return(true)
		}
		if(d("0,2") && d("1,1") && d("2,0")){
			return(true)
		}
		return(false)
	}

}


module.exports = {ten}