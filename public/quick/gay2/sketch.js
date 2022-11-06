let arr = []
let dict = {}
let n = 0

function playSound(){
	n += 1
	let a = document.createElement("Audio")
	a.src = "./music/11.mp3"
	a.id = n
	document.body.appendChild(a)
	document.getElementById(n).load()
	document.getElementById(n).addEventListener('canplaythrough',()=>{console.log("WHAT")})
	document.getElementById(n).play()
	console.log("3")
}
function INIT(){
	for(let i = 0; i < 3; i++){
		playSound()
	}
}