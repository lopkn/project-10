const socket = io.connect('/')
let GAMESESSION = "G10.2"
socket.emit("JOINGAME",GAMESESSION)


socket.on("drawers",(e)=>{drawDrawers(e[0]);tick();})
// socket.on("walls",(e)=>{drawWalls(e)})
socket.on("acknowledge G10.2",acknowledge)
socket.on("CROBJECT",(e)=>{crobject(e)})
socket.on("spec",(e)=>{spec(e)})
socket.on("upwalls",upwalls)
socket.on("cameraUp",(e)=>{cameraX = e[0]-410;cameraY = e[1]-410})

function StCcord(x,y){
	return([ (x-cameraX)  ])
}


function spec(s){
	if(s[0] == "mat"){
		player.materials = s[1]
	}
}


function ALTF3(){
	altf3 = (n,e)=>{player.dataNodes.push([n,JSON.stringify(e).length,Date.now()])}
	socket.onAny((n,e)=>{altf3(n,e)})
}
function altf3(n,e){
	player.dataNodes.push([n,JSON.stringify(e).length,Date.now()])
}
function unALTF3(){
	altf3 = ()=>{}
	player.dataNodes = []
}

var ID = ""
var cameraX = 0
var cameraY = 0
class player{
	static debugging = false
	static dataNodes = []
	static weapon = "norm"
	static materials = 100
	static wall = "norm"
	static snapping = false
	static gridSize = 80
	static weaponCounter = 1
	static weaponDict = {"1":"norm","2":"scat","3":"lazr","4":"cnon","5":"heal","6":"grnd"}
	static wallCounter = 1
	static wallDict = {"1":"norm","2":"bhol","3":"ghol","4":"body","5":"metl","6":"rflc","7":"mbdy","8":"whol"}

	static zoom = 1
	static zoomR = 410*(1-this.zoom)

	static rezoom(x){
		this.zoom = x
		this.zoomR = 410*(1-this.zoom)
	}
}
class map{
	
	static walls = {}
	static players = []
	static bullets = []
}


function acknowledge(e){
	ID = e
	console.log(e)
}

function upwalls(e){
	let ob = Object.keys(e)
	// console.log(e)
	for(let i = 0; i < ob.length; i++){
		if(e[ob[i]] == "_DEL"){
			delete map.walls[ob[i]]
			continue
		}
		map.walls[ob[i]] = e[ob[i]]
	}
}

function crobject(e){
	// console.log(e[0])
	map.walls = e[0]
	map.players = e[1]
}


	let bulletAtt = {"norm":10,"scat":6,"lazr":20,"cnon":10,"heal":2,"grnd":4}


function tick(){
	socket.emit("keys",[ID,keyHolds])
	mainCTX.clearRect(0,0,840,840)


	
	let nodeDate = Date.now()
	for(let i = player.dataNodes.length-1; i > -1 ; i--){
		let n = player.dataNodes[i]
		if(nodeDate-n[2] > 2000){
			player.dataNodes.splice(i,1)
			continue
		}
		switch(n[0]){
			case "cameraUp":
				mainCTX.strokeStyle = "#FF0000"
				break;
			case "upwalls":
				mainCTX.strokeStyle = "#00FF00"
				break;
			case "drawers":
				mainCTX.strokeStyle = "#FF00FF"
				break;
			case "CROBJECT":
				mainCTX.strokeStyle = "#FFFF00"
				break;
			case "spec":
				mainCTX.strokeStyle = "#00FFFF"
				break;
		}
		
		mainCTX.lineWidth = 3
		mainCTX.beginPath()
		mainCTX.moveTo((nodeDate-n[2])/2,n[1]/10)
		mainCTX.lineTo((nodeDate-n[2])/2,0)
		mainCTX.stroke()
		// console.log(lastNode,nodeDate)
	}

	

	let CXR = player.gridSize-(cameraX%player.gridSize)
	let CYR = player.gridSize-(cameraY%player.gridSize)
	mainCTX.strokeStyle = "#404040"
	mainCTX.lineWidth = 2
	mainCTX.beginPath()
	for(let i = -player.gridSize; i < 840/player.zoom; i+= player.gridSize){
		mainCTX.moveTo( (i + CXR)*player.zoom,0)
		mainCTX.lineTo( (i + CXR)*player.zoom,840)
	}
	for(let i = -player.gridSize; i < 840/player.zoom; i+= player.gridSize){
		mainCTX.moveTo(0,(i + CYR)*player.zoom)
		mainCTX.lineTo(840,(i + CYR)*player.zoom)
	}
	mainCTX.stroke()


	for(let i = map.bullets.length-1; i > -1; i--){
		map.bullets[i][1]--
		if(map.bullets[i][1] < 0){
			map.bullets.splice(i,1)
			continue
		}
		let e = map.bullets[i]
		mainCTX.beginPath()
		if(e[6]==undefined){
			e[6] = {}
		}
		mainCTX.lineWidth = (e[1]+1) * (e[6].tailmult == undefined?1:e[6].tailmult) * player.zoom
		if(e[0] == "norm" || e[0] == "scat" || e[0] == "cnon"){
		mainCTX.strokeStyle = "#FFFF00"} else if(e[0] == "lazr"){
			mainCTX.strokeStyle = "#00FFFF"
		} else if(e[0] == "heal"){
			mainCTX.strokeStyle = "#FF0000"
		} else if(e[0] == "grnd"){
			mainCTX.strokeStyle = "#007000"
		}
		mainCTX.moveTo((e[2]-cameraX)*player.zoom + player.zoomR,(e[3]-cameraY)*player.zoom + player.zoomR)
		mainCTX.lineTo((e[4]-cameraX)*player.zoom + player.zoomR,(e[5]-cameraY)*player.zoom + player.zoomR)
		mainCTX.stroke()
	}


	let wallsArr = Object.keys(map.walls)
	let rwc = Math.random()
	for(let j = 0 ; j < wallsArr.length; j++){
		let i = map.walls[wallsArr[j]]
		if(i.type == "norm" || i.type == "player" || i.type == "body"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 3*player.zoom
		mainCTX.strokeStyle = "rgba(255,255,255,"+(i.hp/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX)*player.zoom+player.zoomR,(i.y1-cameraY)*player.zoom+player.zoomR)
		mainCTX.lineTo((i.x2-cameraX)*player.zoom+player.zoomR,(i.y2-cameraY)*player.zoom+player.zoomR)
		mainCTX.stroke()
		}else if(i.type == "metl" || i.type == "mbdy"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 9*player.zoom
		mainCTX.strokeStyle = "rgba(205,205,225,"+(i.hp/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX)*player.zoom+player.zoomR,(i.y1-cameraY)*player.zoom+player.zoomR)
		mainCTX.lineTo((i.x2-cameraX)*player.zoom+player.zoomR,(i.y2-cameraY)*player.zoom+player.zoomR)
		mainCTX.stroke()
		}else if(i.type == "rflc"){
		mainCTX.beginPath()
		mainCTX.lineWidth = 9*player.zoom
		mainCTX.strokeStyle = "rgba(155,205,"+(205+rwc*50)+","+(i.hp/2000+0.5)+")"
		mainCTX.moveTo((i.x1-cameraX)*player.zoom+player.zoomR,(i.y1-cameraY)*player.zoom+player.zoomR)
		mainCTX.lineTo((i.x2-cameraX)*player.zoom+player.zoomR,(i.y2-cameraY)*player.zoom+player.zoomR)
		mainCTX.stroke()
		} else if(i.type == "bhol" || i.type == "ghol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3*player.zoom
			mainCTX.strokeStyle = i.type == "bhol"?"#FF0000":"#0000FF"
			mainCTX.moveTo( (i.x-i.radius-cameraX)*player.zoom+player.zoomR,(i.y-cameraY)*player.zoom+player.zoomR)
			mainCTX.lineTo( (i.x+i.radius-cameraX)*player.zoom+player.zoomR,(i.y-cameraY)*player.zoom+player.zoomR)
			mainCTX.moveTo( (i.x-cameraX)*player.zoom+player.zoomR,(i.y-i.radius-cameraY)*player.zoom+player.zoomR)
			mainCTX.lineTo( (i.x-cameraX)*player.zoom+player.zoomR,(i.y+i.radius-cameraY)*player.zoom+player.zoomR)
			mainCTX.stroke()
		}else if(i.type == "whol"){
			mainCTX.beginPath()
			mainCTX.lineWidth = 3*player.zoom
			mainCTX.strokeStyle = "#707000"
			mainCTX.moveTo(i.x-i.radius-cameraX,i.y-cameraY)
			mainCTX.lineTo(i.x+i.radius-cameraX,i.y-cameraY)
			mainCTX.moveTo(i.x-cameraX,i.y-i.radius-cameraY)
			mainCTX.lineTo(i.x-cameraX,i.y+i.radius-cameraY)
			mainCTX.stroke()
		}
	}
	// mainCTX.fillStyle = "#00FF00"
	// mainCTX.fillRect(mouseX+player.gridSize/2-5,mouseY+player.gridSize/2-5,10,10)
	// mainCTX.fillRect(mouseX+cameraX+player.gridSize/2-(Math.abs((mouseX+cameraX+player.gridSize/2)%player.gridSize))-5-cameraX,
		// mouseY+cameraY+player.gridSize/2-(Math.abs((mouseY+cameraY+player.gridSize/2)%player.gridSize))-5-cameraY,10,10)
		let ala = Math.random()
		let alb = Math.random()
	mainCTX.fillStyle = "rgba("+(200+ala*55)+",0,0,"+(alb*0.2+0.8)+")"
	mainCTX.font = "bold 23px Courier New"
	mainCTX.fillText("weapon: "+player.weaponCounter+" - "+player.weapon,20,800)
	mainCTX.fillText("building: "+player.wallCounter+" - "+player.wall,280,800)
	mainCTX.fillText("snapping: "+(player.snapping?"on":"off"),560,800)
	mainCTX.fillStyle = "rgba(0,"+(150+ala*55)+",0,"+(alb*0.2+0.8)+")"
	mainCTX.fillText("position: "+Math.floor(cameraX/20)+" "+Math.floor(cameraY/20),20,770)
	mainCTX.fillText("materials: "+player.materials,320,770)
}


let mainCTX = document.getElementById("myCanvas").getContext("2d")

	// mainCTX.clearRect(0,0,840,840)

function drawDrawers(e){
	// mainCTX.clearRect(0,0,840,840)

	// console.log(JSON.stringify(e))


	// if(e[0]){
	// 	console.log(e[0][1])
	// }

	e.forEach((i)=>{
		let a = i[5]?(i[5].tailLength?i[5].tailLength:bulletAtt[i[0]]):bulletAtt[i[0]]
		// let a = 1
		// if(i[4] && i[5])
		i.splice(1,0,a)
		map.bullets.push(i)
	})
}
function drawWalls(e){
	// console.log(e)
	e.forEach((i)=>{
		// let i = a[j]
		mainCTX.beginPath()
		mainCTX.lineWidth = 3
		mainCTX.strokeStyle = "#FFFFFF"
		mainCTX.moveTo(i.x1,i.y1)
		mainCTX.lineTo(i.x2,i.y2)
		mainCTX.stroke()
	})
}

var mouseX = 0
var mouseY = 0

onmousemove = (e)=>{mouseX = (e.clientX - 5); mouseY = (e.clientY - 2)}

document.addEventListener("mousedown",(e)=>{
	socket.emit("click",[ID,mouseX,mouseY,player.weapon])
})

var placing = [false]
var keyHolds = {}
document.addEventListener("keydown",(e)=>{
  e.preventDefault()
  let key = e.key

  if(keyHolds[key] == "a"){
  	return
  }
  keyHolds[key] = "a"

  switch(key){
  	case "r":
  		placing = [true,mouseX+cameraX,mouseY+cameraY]
  		break;
    case "q":
  		player.weaponCounter -= 1
  		player.weapon = player.weaponDict[player.weaponCounter]
  		break;
  	case "e":
  		player.weaponCounter += 1
  		player.weapon = player.weaponDict[player.weaponCounter]
  		break;
  	case "z":
  		player.wallCounter -= 1
  		player.wall = player.wallDict[player.wallCounter]
  		break;
  	case "c":
  		player.wallCounter += 1
  		player.wall = player.wallDict[player.wallCounter]
  		break;
  	case "p":
  		player.snapping = !player.snapping
  		break;
  	case "F3":
  		if(!player.debugging){
  			ALTF3()
  			player.debugging = true
  		} else {
  			player.debugging = false
  			unALTF3()
  		}
  		break;
  }  
  console.log(key)

})


document.addEventListener("keyup",(e)=>{
  e.preventDefault()
  let key = e.key
  delete keyHolds[key]
  if(key == "r"){
  	if(player.snapping){
  		placing[1] += player.gridSize/2
  		placing[2] += player.gridSize/2
  		let mx = mouseX+cameraX+player.gridSize/2
  		let my = mouseY+cameraY+player.gridSize/2
  		if(placing[1] < 0){
  			placing[1] -= player.gridSize
  		}
  		if(placing[2] < 0){
  			placing[2] -= player.gridSize
  		}
  		if(mx < 0){
  			mx -= player.gridSize
  		}
  		if(my < 0){
  			my -= player.gridSize
  		}
  		socket.emit("placeWall",[placing[1]-(placing[1]%player.gridSize),placing[2]-(placing[2]%player.gridSize),mx-(mx%player.gridSize),my-(my%player.gridSize),player.wall,ID])
  	} else {
  	socket.emit("placeWall",[placing[1],placing[2],mouseX+cameraX,mouseY+cameraY,player.wall,ID])}
  	placing = [false]
  }


})