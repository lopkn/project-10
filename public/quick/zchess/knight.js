function spos(x,y){
	return(x+","+y);
}

class ks{
	static moveArr = [[-2,-1],[-1,-2],[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1]]
	static looked = {}
	constructor(x,y){
		this.x = x
		this.y = y

		this.look = [[this.x,this.y,""]]
		this.nextLook = []
		ks.looked[spos(this.x,this.y)] = ""
	}

	search(x,y){
		let D = 0
		while(D < 50){
			D++
		this.look.forEach((e,i)=>{
			ks.moveArr.forEach((E,I)=>{
				let pos = [e[0]+E[0],e[1]+E[1],e[2]+I]
				if(ks.looked[spos(pos[0],pos[1])] !== undefined){
					return;
				}
				this.nextLook.push(pos)
				ks.looked[spos(pos[0],pos[1])] = pos[2]

			})
		})

		if(ks.looked[spos(x,y)] != undefined){
			return(ks.looked[spos(x,y)])
		}
		this.look = this.nextLook
		this.nextLook = []

		}
		console.log(ks.looked)
	}


}

let kn = new ks(0,0)


//knight is at 0 0
//give the function any coordinates
//find the fastest route