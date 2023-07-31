class links{

	static linkTo = {}	
	static linkFrom = {}

	static counter = 0



}

class linker{
	constructor(l1,l2){
			this.id = links.counter
			links.counter++
			this.l1 = l1
			this.l2 = l2
	}
}