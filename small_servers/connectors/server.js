class connector{
	constructor(content,id){
		this.id = id
		this.content = content
		this.parents = {}
		this.children = {}
	}

	linkChild(child){
		child.parents[this.id] = true
		this.children[child.id] = true
	}
	linkParent(parent){
		this.parents[parent.id] = true
		parent.children[this.id] = true
	}

	severParent(parent){
		this.parents[parent.id] = false
	    parent.children[this.id] = false

	}

	severChild(child){
		
	}

}



// im not fucking gonna even 



//Dont be so PC 



//Lets try to finish our chem shit before physics so we can have fun with arduino
//i have a fucking great idea

//use the range finder to control the pitch of the buzzer from last time