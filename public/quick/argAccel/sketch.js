console.log("hello")


let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = Math.floor(Width)+"px"
  myCanvas.style.height = Math.floor(Height)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
document.addEventListener("keydown",(e)=>{
	if(e.key == "Tab"){
		GHT(true)
		e.preventDefault()
	}
})


const socket = io.connect('/')
let GAMESESSION = "G10.7"
socket.emit("JOINGAME",GAMESESSION)
var ID = 0
socket.on("acknowledge G10.7",(e)=>{ID = e; console.log("joined as "+ID)})
socket.on("msg",(e)=>{console.log("recieved message: "+e)
	messageBubble(e.msg,e.id == ID?"right":"left")
})
socket.on("smsg",(e)=>{
	messageBubble(e,"cent")
})






/// setup stuff

var MIP = document.getElementById("mainInput")

var wrapperFunctions = {}


function classQuery(c){
	return(document.getElementsByClassName(c))
}
function gay(){console.log("gay")}






function sendReq(req,type){
	socket.emit("req",{"type":type,"cont":req})
}


function garble(leng){
	let str =""
	while(leng>0){
		leng--
		str+="abcdefghijklmnopqrstuvwxyz "[Math.floor(Math.random()*27)]
	}
	return(str)
}


function clearLeftContainer(){
	let element = classQuery("leftContainer")[0]
		while (element.firstChild) {
	    element.removeChild(element.firstChild);
	}

	for(let i = 0; i < 25; i++){
		let d = document.createElement("div")
		let h2 = document.createElement("h2")
		let p = document.createElement("p")
		h2.innerHTML = garble(Math.random()*16)
		p.innerHTML = garble(Math.random()*900+20)
		d.appendChild(h2)
		d.appendChild(p)
		d.style.backgroundColor = "HSL("+Math.floor(Math.random()*255)+",100%,80%)"
		d.onclick=()=>{insert(d.querySelector("p").innerHTML)}
		element.appendChild(d)

	}

	let ad = document.createElement("div")
	ad.innerHTML="&#43;"
	ad.classList.add("addItem")
	element.appendChild(ad)
	ad.onclick=()=>{
		toggleInputPanel()
	}

}
clearLeftContainer()


function toggleInputPanel(on=true){
		let ipanel = document.getElementById("inputPanel")
	if(on){
		ipanel.style.visibility="visible"
		ipanel.style.opacity="1"
	} else {
		ipanel.style.visibility="hidden"
		ipanel.style.opacity="0"
	}
}


// function reqV2(req){

// 	let dict = {
// 		"path":Arg.currentTag,
// 		"option":document.getElementById("cbx option").innerHTML,
// 		"title":document.getElementById("cbx title").innerHTML,
// 		"description":document.getElementById("cbx description").innerHTML,
// 	}
// 	sendReq(dict,"v2")
// 	ArgAug.loadTag(currentTag,true)
// }

// function reqV2_1(req){

// 	let dict = {
// 		"path":Arg.currentTag,
// 		"option":req.option,
// 		"title":req.title,
// 		"description":req.description,
// 	}
// 	sendReq(dict,"v2")
// }


let inp = document.getElementById("mainInput")
inp.addEventListener("keydown",(e)=>{
	if(e.key == "Enter" || e.keyCode == 13){
		
		if(e.shiftKey){return}

		socket.emit("msg",inp.value)
		inp.value = ""
		e.preventDefault()
	}
	if(e.key == "Tab"){
		e.preventDefault()
	}
})

document.getElementById("chat").addEventListener("keydown",(e)=>{
	console.log('dog')
	if(e.key == "Tab"){
		GHT()
		console.log("gay?")
		e.preventDefault()
	}
})


function messageBubble(msg,lr="left"){
	let m = document.createElement("div")
	let jer = document.createElement("div")

	let marr = msg.split(" ")
	for(let i = 0; i < marr.length; i++){
		if(marr[i] == "unsound" || marr[i] == "invalid" || marr[i] == "irrelevant"){
			marr[i] = clickableWrapper(marr[i],Math.random()).outerHTML
		}
	}

	m.innerHTML = marr.join(" ")
	m.classList.add("textBubble")
	if(lr == "right"){
		m.classList.add("right")
	} if(lr == "cent"){
		m.classList.add("cent")
	}else {
		m.classList.add("left")
	}
	jer.classList.add("jer")
	let chat = document.getElementsByClassName("chat")[0]

	let scrolledTop = (chat.scrollTop+chat.offsetHeight+10>chat.scrollHeight);
	jer.appendChild(m)

	chat.appendChild(jer)
	wrapperCompleteAll()
	if(scrolledTop){
		chat.scrollTop = chat.scrollHeight;
	}
	
}




function clickableWrapper(item,id){
	let s = document.createElement("span")
	s.id = "cw"+id
	s.classList.add("clickSpan")
	s.innerHTML = item

	wrapperFunctions[s.id] = spanClicked
	console.log(s.onclick)
	return(s)
}
function wrapperComplete(id){
	document.getElementById(id).onclick = wrapperFunctions[id]
	console.log("hi")
	delete wrapperFunctions[id]
}
function wrapperCompleteAll(){
	Object.keys(wrapperFunctions).forEach((e)=>{
		wrapperComplete(e)
	})
}

function spanClicked(evt){
	console.log("span id clicked: ",evt.target.id)
}


function insString(str,index,nstr){
	return(str.substring(0, index) + nstr + str.substring(index))
}


function getHighlightedText() {
    let highlightedText = "";
    let highlightedElement = null;
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            highlightedText = selection.toString();
            highlightedElement = range.commonAncestorContainer.parentNode;
        }
    } else if (document.selection && document.selection.type != "Control") {
        const range = document.selection.createRange();
        highlightedText = range.text;
        highlightedElement = range.parentElement();
    }
    return {
        text: highlightedText,
        element: highlightedElement
    };
}


function GHT(refocus=false){
	let ght = getHighlightedText()
	if(ght.element.classList.contains("textBubble")||ght.element.classList.contains("jer")){
		insert(ght.text)

		if(refocus){
			MIP.focus()
		}

	}
}

function insert(text){
	MIP.value=insString(MIP.value,MIP.selectionStart,text)
}


// we point out flaws because
// -More people are heard -> 49% cant do anything -> anarchism?
// 51% Utilitarian







