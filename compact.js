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

	static temporalStorage = {"submit":`
			<!DOCTYPE html>
		<html>
		<head>
		  <meta charset="utf-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable = no, maximum-scale=1, minimum-scale=1">
		  <title>LTMP</title>

		</head>
		<body style="padding:0;margin:0;background-color: #050010;">

		<script>
			
		</script>

		 <div style="color: #70FF80">
		  <label for="name">Name:</label><br>
		  <input type="text" id="name" name="name"><br>
			<label for="content">content:</label><br>
		  <textarea type="text" id="content" name="content"></textarea>
		<button onclick="(async function submit(){let title = document.getElementById('name').value;let content = document.getElementById('content').value;await fetch('https://game.lopkn.dev/temporal',{method: 'POST',headers: { 'Content-Type': 'application/json'},body: JSON.stringify({action:'store','name':title,'data':content})});})()">submit</button>
		</div>



		</body>
		</html>
	`}

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

	static process2(d,r){
		if(d.action == "store"){
			this.temporalStorage[d.name] = d.data
			r.sendStatus(200)
		}
	}
}

///// responder END////

module.exports = {flightSim,responder}