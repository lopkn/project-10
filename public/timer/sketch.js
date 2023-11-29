let years = prompt("what do you think your lifespan is in years?","70")

if(years > 0){

if(years < 5){
	alert("how unfortunate.")
}

if(years < 50){
	alert("so unoptimistic. fine with me")
}

let btn = document.createElement("button")
btn.innerHTML = "---> start <---"
btn.style.fontSize = "40px"
btn.id = "startstop"
btn.style.top = "50%"
btn.style.left = "50%"
btn.onclick = ()=>{
	if(!started){
		starttime = Date.now()
		started = true
		btn.style.backgroundColor = "green"
		btn.innerHTML = "---> stop? <---"
	} else {
		btn.style.backgroundColor = "red"
		btn.innerHTML = "---> start <---"
		bstop()
		started = false
	}
}
document.body.appendChild(btn)
let btn2 = document.createElement("button")
btn2.innerHTML = "rules"
btn2.style.fontSize = "40px"
btn2.style.top = "50%"
btn2.style.left = "50%"
btn2.onclick = ()=>{
	alert("when you click start, a timer starts")
	alert("you want to click the button again exactly 10 seconds after you clicked start")
	alert("any inaccuracy will result in your lifespan decreasing")
	alert("your lifespan will readjust to the time you precieve...")
	alert("if you click too slow, your lifespan is reduced")
	alert("if you click too fast, its also reduced")
	alert("reduction would be the same as if every second is reduced by the ratio you got wrong")
	alert("if you clicked it in 5 seconds, your lifespan is halved")
	alert("if you clicked it in 15 seconds, your lifespan is also halved")
	alert("have fun hahaha >:)")
}
document.body.appendChild(btn2)

} else {
	alert("redo elementary school math.")
	alert("come back when you finished learning that.")
	alert("go away.")
	alert("reload the webpage when you are done.")
	alert("how can you manage to live a negative amount of years")
	alert("this is beyond comprehension")
	alert("bye")
}
let starttime = 0
let started = false


let Actime = 10


function bstop(){
	let d = Date.now()
	let diff = d-starttime
	let diffratio = diff/1000/Actime

	if(diffratio > 1.7 || diffratio < 0.3){
		alert("what a loser")
		alert("how did you manage to do that bad.")
	}

	if(document.getElementById("result") !== null){
		document.getElementById("result").remove()
	}

	let di = document.createElement("div")
	di.id = "result"
	di.innerHTML = "your time ratio is: "+(diffratio.toFixed(3))+"<br>you clicked too "+(diffratio>1?"late":"soon")+" muahaha<br>you will die about "+((years-years*(diffratio>1?2-diffratio:diffratio)).toFixed(3))+" years earlier.<br>"+(diffratio>2?"you literally died like now you idiot":"")
	di.style.color = "white"
	di.style.fontSize = "30px"
	console.log(diffratio)
	document.body.appendChild(di)

}
