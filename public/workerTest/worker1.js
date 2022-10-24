onmessage = (a)=>{

	let e = a.data

	// let MD = Date.now()

	// console.log("workspond: "+MD+" - took: "+(MD-e.time) + " - recieved: "+(JSON.stringify(e).length))
	// postMessage(e)

	let counter = 20000000

	while(counter > 0){
	counter -= Math.random()
	}
	postMessage(e)
}