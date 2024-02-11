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
	let element = classQuery("leftSaved")[0]
		while (element.firstChild) {
	    element.removeChild(element.firstChild);
	}

	for(let i = 0; i < 25; i++){
		// let d = document.createElement("div")
		// let h2 = document.createElement("h2")
		// let p = document.createElement("p")
		// h2.innerHTML = garble(Math.random()*16)
		// p.innerHTML = garble(Math.random()*900+20)
		// d.appendChild(h2)
		// d.appendChild(p)
		// d.style.backgroundColor = "HSL("+Math.floor(Math.random()*255)+",100%,80%)"
		// d.onclick=()=>{insert(d.querySelector("p").innerHTML)}
		// element.appendChild(d)
		addSavedCard(garble(Math.random()*16),garble(Math.random()*900+20))

	}


  element = classQuery("leftContainer")[0]
	let ad = document.createElement("div")
	ad.innerHTML="&#43;"
	ad.classList.add("addItem")
	// ad.classList.add("leftCard")
	element.appendChild(ad)
	ad.onclick=()=>{
		toggleInputPanel()
	}

}
clearLeftContainer()


function addSavedCard(title,value){
	
	let element = classQuery("leftCard")[0]
	
	console.log(title)
	let d = document.createElement("div")
	let h2 = document.createElement("h2")
	let p = document.createElement("p")
	let cit = document.createElement("div")
	let crosser = document.createElement("div")
	cit.style.top = "0px"
	cit.style.right = "0px"
	crosser.innerHTML = "X"
	d.style.position = "relative"
	cit.style.position = "absolute"
	crosser.onclick = (e)=>{
		if(e.altKey){
			d.remove()
			e.preventDefault()
		}else{
			savedCardOptions(e,d)
		}
		// d.remove();
	}
	cit.onclick = (e)=>{e.stopPropagation()}
	cit.classList.add("clickableIconsTab")
	cit.appendChild(crosser)

	h2.innerHTML = title
	p.innerHTML = value

		d.appendChild(h2)
		d.appendChild(p)
		d.appendChild(cit)
		d.style.backgroundColor = "HSL("+Math.floor(Math.random()*255)+",100%,80%)"
		d.onclick=()=>{insert(d.querySelector("p").innerHTML)}
		element.insertBefore(d,element.firstChild)
}


document.getElementById("addCard").addEventListener("click",(e)=>{
	toggleInputPanel(false)
	console.log(document.getElementById("addCard").targeting)
	if(document.getElementById("addCard").targeting == undefined){
		addSavedCard(document.getElementById("panelTitle").value,document.getElementById("panelInside").value)
	} else {

		let d = document.getElementById("addCard").targeting
		d.querySelector("h2").innerHTML = document.getElementById("panelTitle").value
		d.querySelector("p").innerHTML = document.getElementById("panelInside").value
	}
	document.getElementById("panelTitle").value = ""
	document.getElementById("panelInside").value = ""
	document.getElementById("addCard").targeting = undefined
})

let ipanel = document.getElementById("inputPanel")
function toggleInputPanel(on=true,editing){

 	if(editing){
 		document.getElementById("addCard").innerHTML="EDIT"
	} else {
		document.getElementById("addCard").innerHTML="ADD"
	}

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


function suggestionCard(val){
		if(val.length < 10 || val.split(" ").length < 3){
			return
		}
	let d = document.createElement("div")
		let h2 = document.createElement("h2")
		let p = document.createElement("p")
		h2.innerHTML = "suggested Card"
		p.innerHTML = val
		d.appendChild(h2)
		d.appendChild(p)
		d.style.backgroundColor = "HSL("+Math.floor(Math.random()*255)+",100%,80%)"
		d.onclick=()=>{
			d.remove()
			addSavedCard("saved card",val)
			// h2.innerHTML="saved card";saveSuggestion(d);console.log("saved");d.onclick=()=>{insert(d.querySelector("p").innerHTML)}
		}
		let suggestElement = classQuery("leftSuggest")[0]
		suggestElement.insertBefore(d,suggestElement.firstChild)
		classQuery("leftSuggest")[0].children[2]?.remove()

}
function saveSuggestion(d){
	d.remove()
	let saved = classQuery("leftSaved")[0]
	saved.insertBefore(d,saved.firstChild)
}


let inp = document.getElementById("mainInput")
inp.addEventListener("keydown",(e)=>{
	if(e.key == "Enter" || e.keyCode == 13){
		
		if(e.shiftKey){return}

		socket.emit("msg",inp.value)

		suggestionCard(inp.value)

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



function handlePaste(e) {
  var clipboardData, pastedData;

  // Stop data actually being pasted into div
  e.stopPropagation();
  e.preventDefault();

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData('Text');

  // Do whatever with pasteddata
  alert(pastedData);
}

// document.querySelector('textarea').addEventListener('paste', handlePaste);

let opanel = document.getElementById("optionPanel")
function savedCardOptions(e,d){
	let on = (opanel === document.activeElement)
	if(!on){
		opanel.style.visibility="visible"
		opanel.style.opacity="1"
		opanel.style.top = Math.floor(e.clientY)+"px"
		opanel.style.left = Math.floor(e.clientX)+"px"
		opanel.MyReference = d
		opanel.focus()
	}
}
opanel.addEventListener("focusout",(e)=>{
	opanel.style.visibility="hidden"
	opanel.style.opacity="0"
	console.log("hi?")
})
document.getElementById("opRemove").addEventListener("click",(e)=>{
	let d = opanel.MyReference
	d.remove()
	opanel.blur()
})
document.getElementById("opEdit").addEventListener("click",(e)=>{
	let d = opanel.MyReference
	opanel.blur()

	toggleInputPanel(true,d)
	document.getElementById("panelTitle").value = d.querySelector("h2").innerHTML
	document.getElementById("panelInside").value = d.querySelector("p").innerHTML
	document.getElementById('addCard').targeting = d

})


class textHandler{
	static tb = document.querySelector("textarea")

	static mainArr = []
}







