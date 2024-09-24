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
}