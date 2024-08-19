
var io;
class quantum{
	static rooms = {}
	static handle(date,name,packet,socket){
		if(name == "room"){
			this.joinroom(packet.name,socket)
		} else if(name == "measure"){
			this.collapseMeasure(packet.room,socket,packet.input)
		}
	}

	static joinroom(roomName,socket){
		if(!this.rooms[roomName]){
			this.rooms[roomName] = []
		} 
		this.rooms[roomName].push({"input":[],"id":socket.id,"room":roomName,"measured":[]})
		socket.join("G10.8-"+roomName)
	}

	static collapseMeasure(room,socket,input){
		let measurer;
		let other;
		if(this.rooms[room][0].id == socket.id){
			measurer = this.rooms[room][0]
			other = this.rooms[room][1]
		} else {
			measurer = this.rooms[room][1]
			other = this.rooms[room][0]
		}

		if(other == undefined){
			other = {"input":[],"id":socket.id,"room":measurer.room,"measured":[],"messages":[]}
		}

		measurer.input.push(input)

		if(measurer.measured.length <= other.measured.length && measurer.measured.length != 0){

			if(other.input[measurer.measured.length] == 1 && input == 1){
				measurer.measured.push(!other.measured[other.measured.length-1] -0)
			} else {
				measurer.measured.push(other.measured[other.measured.length-1] -0)
			}
		} else {
			measurer.measured.push(Math.random()>0.5?1:0)
		}
		io.to(socket.id).emit("return",measurer.measured[measurer.measured.length-1])
		return(measurer.measured[measurer.measured.length-1])
	}

	static sendChallenge(room){
		room = this.rooms[room]
		let val1 = Math.random()>0.5?1:0
		let val2 = Math.random()>0.5?1:0
		io.to(room[0].id).emit("message",val1)
		io.to(room[1].id).emit("message",val2)
		room[0].messages.push(val1)
		room[1].messages.push(val2)
	}

	static setio(i){
		io = i
	}


}

module.exports = {quantum}
