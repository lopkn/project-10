

let bigdict = {}

for(let i = 0; i < 20000; i++){
	bigdict[Math.random()] = Math.random()
}


class workers{

	static workIdistributor = 0

	static worker1 = new Worker("worker1.js")


	static distribute(){
		this.workIdistributor += 1
		return(this.workIdistributor)
	}

	static initiateWorker1(){
		this.worker1.postMessage({"id":this.workIdistributor})
		console.log("worker 1 has started")
		this.worker1.onmessage = (a)=>{
			let e = a.data
			console.log(e)
		}
	}

}

workers.initiateWorker1()

// let rslts = 0

// class worlator{

// static counter = 0

// static start(){

// 	if(this.counter > 50){
// 		return;
// 	}
// 	this.counter ++

// 	let MD = Date.now()
// console.log("started at: "+MD)
// worker1.postMessage({"time":MD,"acData":bigdict})
// }

// }

// worlator.start()
// worker1.onmessage = (e)=>{console.log("got response: "+Date.now()+" - complete cycle: "+(Date.now()-e.data.time));rslts+=Date.now()-e.data.time;worlator.start()}
