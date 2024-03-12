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


let ROOM = "ArgAccel-Lobby"

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
	messageBubble(e.msg,e.id == ID?"right":"left",e.msgid,e.id)
})
socket.on("smsg",(e)=>{
	messageBubble(e,"cent")
})
socket.on("joinroom",(e)=>{
	messageBubble("you have entered a new room","cent")
	ROOM = e
})






/// setup stuff

var MIP = document.getElementById("mainInput")

var wrapperFunctions = {}

const empt = "<span class='emptySpan' contentEditable='false'>         </span>"


function classQuery(c){
	return(document.getElementsByClassName(c))
}
function gay(){console.log("gay")}


let chatAttributes = {"deleting":(e)=>{console.log(e);if(e.parentElement==MIP){e.remove()}}}



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

	for(let i = 0; i < 15; i++){
		// let d = document.createElement("div")
		// let h2 = document.createElement("h2")
		// let p = document.createElement("div")
		// h2.innerHTML = garble(Math.random()*16)
		// p.innerHTML = garble(Math.random()*900+20)
		// d.appendChild(h2)
		// d.appendChild(p)
		// d.style.backgroundColor = "HSL("+Math.floor(Math.random()*255)+",100%,80%)"
		// d.onclick=()=>{insert(d.querySelector("div").innerHTML)}
		// element.appendChild(d)
		addSavedCard(garble(Math.random()*16),garble(Math.random()*900+20))

	}
	addSavedCard("testing!","<span style=\"color:red\" contentEditable=\"false\"> testing! </span>")
	addSavedCard("test2","&lt;div style=\"color:red\"&gt; test &lt;/div&gt;")

	addSavedCard("common",`not every ${empt} is ${empt}. An example would be ${empt}`)
	addSavedCard("common",`your statement is ${generateOptionSelect(["unsound","invalid","irrelevant"])} because ${empt}`)


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
	let p = document.createElement("div")
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
		//clickablesaved//saveclick
		d.onclick=()=>{GST(d.querySelector("div").innerHTML.replaceAll("&nbsp;"," "),true)}
		element.insertBefore(d,element.firstChild)
	return(d)
}


document.getElementById("addCard").addEventListener("click",(e)=>{
	toggleInputPanel(false)
	console.log(document.getElementById("addCard").targeting)
	if(document.getElementById("addCard").targeting == undefined){
		addSavedCard(document.getElementById("panelTitle").innerHTML,document.getElementById("panelInside").innerHTML)
	} else {

		let d = document.getElementById("addCard").targeting
		d.querySelector("h2").innerHTML = document.getElementById("panelTitle").innerHTML
		d.querySelector("div").innerHTML = document.getElementById("panelInside").innerHTML
	}
	document.getElementById("panelTitle").innerHTML = ""
	document.getElementById("panelInside").innerHTML = ""
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
		let p = document.createElement("div")
		h2.innerHTML = "suggested Card"
		p.innerHTML = val
		d.appendChild(h2)
		d.appendChild(p)
		d.style.backgroundColor = "HSL("+Math.floor(Math.random()*255)+",100%,80%)"
		// d.style.maxHeight = "25vh"
		// d.style.overflowX = "auto"
		d.onclick=()=>{
			d.remove()
			let c = addSavedCard("saved card",val)
			c.style.backgroundColor = d.style.backgroundColor
			// h2.innerHTML="saved card";saveSuggestion(d);console.log("saved");d.onclick=()=>{insert(d.querySelector("div").innerHTML)}
		}
		let suggestElement = classQuery("leftSuggest")[0]
		console.log(suggestElement)
		suggestElement.insertBefore(d,suggestElement.firstChild)
		classQuery("leftSuggest")[0].children[2]?.remove()

}
function saveSuggestion(d){
	d.remove()
	let saved = classQuery("leftSaved")[0]
	saved.insertBefore(d,saved.firstChild)
}


MIP.addEventListener("keydown",(e)=>{
	if(e.key == "Enter" || e.keyCode == 13){
		
		if(e.shiftKey){return}

		collapseAll()

		let sstr = MIP.innerHTML.replaceAll("&nbsp;"," ")
		let sstr2 = MIP.innerText.replaceAll(" "," ")
		console.log(sstr)
		console.log(sstr[0] == sstr[1])
		socket.emit("msg",{"ihtml":sstr,"txt":sstr2,"room":ROOM})

		suggestionCard(MIP.innerHTML)

		MIP.innerText = ""
		e.preventDefault()
	}
	if(e.key == "Tab"){
		e.preventDefault()
	}
})

document.getElementById("chat").addEventListener("keydown",(e)=>{
	if(e.key == "Tab"){
		GHT()
		console.log("gay?")
		e.preventDefault()
	}
})


function messageBubble(msg,lr="left",msgid=-1,eid=-1){
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
	}else if(lr == "cent"){
		m.classList.add("cent")
	}else {
		m.classList.add("left")
	}

	m.addEventListener("contextmenu",messageBubbleClick)

	// m.setAttribute("msgid",msgid)
	// jer.setAttribute("msgid",msgid)
	m.id = "msgM"+msgid
	jer.id = "msgJ"+msgid
	jer.classList.add("jer")
	let chat = document.getElementsByClassName("chat")[0]

	let scrolledTop = (chat.scrollTop+chat.offsetHeight+10>chat.scrollHeight);
	jer.appendChild(m)

	let classArr = m.getElementsByClassName("verified")
	for(let i = 0; i < classArr.length; i++){
		let e = classArr[i]
		if(e.getAttribute("refid") == eid){
			e.classList.add("selfReference")
		}
	}


	chat.appendChild(jer)
	wrapperCompleteAll()
	if(scrolledTop){
		chat.scrollTop = chat.scrollHeight;
	}
	
}


function messageBubbleClick(e){
	console.log(e,e.target)
	e.preventDefault()
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


function GHT(refocus=false,ref={}){
	let ght = getHighlightedText()
	// if(ght.element.classList.contains("textBubble")||ght.element.classList.contains("jer")){
	// 	ref.msgid = ght.element.getAttribute("id").substring(4)
	// 	let reference = JSON.stringify(ref)
	// 	console.log(reference)
	// 	let str = "<span style='color:cyan' contentEditable='false' doughnut='-"+reference+"-'>"+ght.text+"</span>"
	// 	console.log(str)
	// 	let ir = insert(str)

	// 	if(refocus){
	// 		MIP.focus()
	// 		moveCaretAfterNode(ir)
	// 	}
	// 	return;
	// } 


	let phc = parentHasClass(ght.element,"jer") 
	if(phc !== false){
		ref.msgid = phc.getAttribute("id").substring(4)
		let reference = JSON.stringify(ref)
		console.log(reference)
		let gtxt = ght.text.replaceAll("<","&lt;").replaceAll(">","&gt;")
		let str = "<span style='color:cyan' contentEditable='false' doughnut='-"+reference+"-'>"+gtxt+"</span>"
		console.log(str)
		let ir = insert(str)

		if(refocus){
			MIP.focus()
			moveCaretAfterNode(ir)
		}
	}
}

function GST(text,refocus=false){
	let ir = insert(text)
	if(refocus){
		MIP.focus()
		moveCaretAfterNode(ir)
	}
}

function insert(text){
	// MIP.innerHTML=insString(MIP.innerHTML,MIP.selectionStart,text)
	if(typeof(text) !== "object"){
		s = document.createElement("span")
		s.style.userSelect = "none"
		s.classList.add("temporary")
		s.innerHTML = text
		text = s
	}


	selectionPosition.insertNode(text)
	initiateTextFuncs(text)
	
	let b = document.getElementsByClassName("temporary");
	let x = 0
	let lc;
	while(b.length && x < 500) {
			x++
	    let parent = b[0].parentNode;
	    while(b[0].firstChild ) {
	        lc = b[0].firstChild
	        parent.insertBefore(b[0].firstChild,b[0]);
	    }
	     parent.removeChild(b[0]);
	}
	return(lc)
}

function initiateTextFuncs(elm){
	console.log(elm.outerHTML)
	let b = elm.getElementsByClassName("emptySpan")
	for(let i = 0; i < b.length; i++){
		let e = b[i]
		if(!e.onclick){
			e.onclick = ()=>{chatAttributes.deleting(e)}
		}
	}
}

function collapseAll(){
	collapseSelect()
	collapseEmpty()
}

function collapseEmpty(){
	let b = MIP.getElementsByClassName("emptySpan");
	let x = 0
		let lc;
		while(b.length && x < 500) {
				x++
		    let parent = b[0].parentNode;

		    let SPAN = document.createElement("span")
		    SPAN.classList.add("collapsed")
		    SPAN.innerHTML = ((e)=>{return(e[Math.floor(Math.random()*e.length)])})(["doughnut","gay","a torus","topological","stupid"])
		     parent.insertBefore(SPAN,b[0]);
		     parent.removeChild(b[0]);
		}
		return(lc)
}

function collapseSelect(){
	let b = MIP.getElementsByClassName("collapseSelector");
	let x = 0
	let lc;
	while(b.length && x < 500) {
			x++
	    let parent = b[0].parentNode;

	    let SPAN = document.createElement("span")
	    SPAN.classList.add("collapsed")
	    SPAN.innerHTML = b[0].value
	     parent.insertBefore(SPAN,b[0]);
	     parent.removeChild(b[0]);
	}
	return(lc)
}



function parentHasClass(el,clas){
	if(el.classList.contains(clas)){return(el)}
	while(el.parentElement){
		el = el.parentElement
		if(el.classList.contains(clas)){return(el)}
	}
	return(false)
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
	document.getElementById("panelTitle").innerHTML = d.querySelector("h2").innerHTML
	document.getElementById("panelInside").innerHTML = d.querySelector("div").innerHTML
	document.getElementById('addCard').targeting = d

})


function getSelectionPosition() {
  const selection = window.getSelection(); // Get the Selection object

  if (selection.rangeCount === 0) {
    return null; // No selection exists
  }

  const range = selection.getRangeAt(0); // Get the first Range object

  // Create a new Range object to use as a reference
  const referenceRange = document.createRange();
  referenceRange.selectNodeContents(document.getElementById('mainInput'));

  // Use the compareBoundaryPoints() method to determine the position of the selection within the content editable div
  const position = range.compareBoundaryPoints(Range.START_TO_START, referenceRange);

  // return position;
  // return window.getSelection().anchorOffset
  return getSelectionRangeRelativeToElement(MIP).startOffset
}

MIP.focus()
let selectionPosition=SSoffset2();

MIP.addEventListener('blur', function() {
  selectionPosition = SSoffset2();
  // MIP.selectionStart = selectionPosition
  // console.log('Selection position:', selectionPosition);
});



function getSelectionRangeRelativeToElement(element) {
  const selection = window.getSelection();
  
  if (selection.rangeCount === 0) {
    return null; // No selection
  }
  
  const range = selection.getRangeAt(0);
  
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;
  
  // Calculate the start and end offsets relative to the element
  const startOffset = getOffsetRelativeToElement(element, startContainer, range.startOffset);
  const endOffset = getOffsetRelativeToElement(element, endContainer, range.endOffset);
  
  return { startOffset, endOffset };
}

function getOffsetRelativeToElement(element, container, offset) {
  let currentElement = container;
  let relativeOffset = offset;
  
  while (currentElement !== element && currentElement.parentNode) {
    const childNodes = Array.from(currentElement.parentNode.childNodes);
    const index = childNodes.indexOf(currentElement);
    
    for (let i = 0; i < index; i++) {
      if (childNodes[i].nodeType === Node.TEXT_NODE) {
        relativeOffset += childNodes[i].textContent.length;
      }
    }
    
    currentElement = currentElement.parentNode;
  }
  
  return relativeOffset;
}

function SSoffset(){
	let target = document.createTextNode("\u0001");
	document.getSelection().getRangeAt(0).insertNode(target);
	let position = MIP.innerHTML.indexOf("\u0001");
	target.parentNode.removeChild(target);
	return(position)
}

function SSoffset2(){
	return(document.getSelection().getRangeAt(0))
}

function test2(){
	let target = document.createTextNode("\u0001");
	let x = document.getSelection().getRangeAt(0)
	x.insertNode(target)
}

function test1(){
	let target = document.createTextNode("\u0001");
	let newRange = document.createRange();
	let selection = document.getSelection()
  newRange.setStart(selection.focusNode, selection.startOffset);
  newRange.insertNode(target)
	let position = MIP.innerHTML.indexOf("\u0001");
	target.parentNode.removeChild(target)
	return(position)
}

///
const createRange = (node, targetPosition) => {
    let range = document.createRange();
    range.selectNode(node);
    range.setStart(node, 0);

    let pos = 0;
    const stack = [node];
    while (stack.length > 0) {
        const current = stack.pop();

        if (current.nodeType === Node.TEXT_NODE) {
            const len = current.textContent.length;
            if (pos + len >= targetPosition) {
                range.setEnd(current, targetPosition - pos);
                return range;
            }
            pos += len;
        } else if (current.childNodes && current.childNodes.length > 0) {
            for (let i = current.childNodes.length - 1; i >= 0; i--) {
                stack.push(current.childNodes[i]);
            }
        }
    }

    // The target position is greater than the
    // length of the contenteditable element.
    range.setEnd(node, node.childNodes.length);
    return range;
};
const setPosition = (targetPosition) => {
    const range = createRange(contentEle, targetPosition);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

function moveCaretAfterNode(node) {
  var range = document.createRange();
  var selection = window.getSelection();

  // Set the range to the end of the node
  range.setStartAfter(node);
  range.collapse(true);

  // Clear any existing selections
  selection.removeAllRanges();

  // Add the range to the selection
  selection.addRange(range);
}

function UP(data,action="up"){
  const url = 'https://game-10.lopkn.unsown.top/responder';
  data.action = action

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => {
    // Parse the response as JSON
    return response.json();
  })
  .then(responseData => {
    // Handle the response data
    console.log('Received response:', responseData);
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Request failed:', error);
  });
}


function refArrow(el1,el2){
	let bounding1 = el1.getBoundingClientRect()
	let bounding2 = el2.getBoundingClientRect()
	let arr =[bounding1.x+bounding1.width/2,bounding1.y+bounding1.height/2,
		bounding2.x+bounding2.width/2,bounding2.y+bounding2.height/2]
	
	ctx.lineWidth = 3
	ctx.strokeStyle = "#FF7000"
	ctx.beginPath()
	ctx.moveTo(arr[0],arr[1])
	// ctx.lineTo(arr[2],arr[3])
	arr[4] = (arr[0]+arr[2])/2
	arr[5] = (arr[1]+arr[3])/2
	let s = 180
	let s2 = s/2
	ctx.bezierCurveTo(arr[4]+Math.random()*s-s2,arr[5]+Math.random()*s-s2,arr[4]+Math.random()*s-s2,arr[5]+Math.random()*s-s2,arr[2],arr[3])
	ctx.stroke()

	return(arr)
}


function refover(el,open=true){
	refArrow(el,document.getElementById("msgM"+el.getAttribute('ref')))
	if(!open){
		ctx.clearRect(0,0,5000,5000)
	}
}

function generateOptionSelect(options){
	let sel = document.createElement("select")
	sel.classList.add("collapseSelector")
	options.forEach((e)=>{
		let opt = document.createElement("option")
		opt.value = e
		opt.innerHTML = e
		sel.appendChild(opt)
	})
	return(sel.outerHTML)
}


class textHandler{
	static tb = document.querySelector("textarea")

	static mainArr = []
}












