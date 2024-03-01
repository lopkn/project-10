class flightSim{

	static plarr = []

	static join(id){
		this.plarr.push(id)
	}

	static systemMsg(msg){
		io.to("G10.5").emit("msg",msg)
	}

	static getVal(pln,val){
		if(pln == 0){return("starts with 1")}
		if(val === "info"){val = "document.getElementById('info').innerHTML"}
		io.to(this.plarr[this.plarr.length-pln]).emit("ev",val)
	}
	static forceFunc(pln,val){
		if(pln == 0){return("starts with 1")}
		io.to(this.plarr[this.plarr.length-pln]).emit("ev","function b"+val+";b()")
	}

	static disconnect(socket){
		let id = socket.id
		this.plarr.forEach((e,i)=>{
			if(e == id){
				this.plarr.splice(i,1)
			}
		})
	}
}

///// responder ////

class responder{
	static info1 = {}
	static pusher = []
	static process1(d,r){
		if(d.action == "debug"){
			// let str = fs.readFileSync("./errorlog.json")
			// r.send({"response":str})
		}
		if(d.action == "up"){
			this.info1 = d
		} else if(d.action == "push"){
			this.pusher.push(d)
		} else if(d.action == "reset"){
			this.pusher = []
			this.info1 = {}
		}
		this.info1.pusher = this.pusher
		r.send(this.info1)
	}
}

///// responder END////

module.exports = {flightSim,responder}