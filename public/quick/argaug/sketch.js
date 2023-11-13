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

})


const socket = io.connect('/')
let GAMESESSION = "G10.6"
socket.emit("JOINGAME",GAMESESSION)
var ID = 0
socket.on("acknowledge G10.6",(e)=>{ID = e; console.log("joined as "+ID)})
socket.on("string",(e)=>{console.log(e)})
socket.on("mem",(e)=>{storage.main[e[0]]=e[1];Arg.loadTag(e[0]);console.log(e[1])})





/// setup stuff


function classQuery(c){
	return(document.getElementsByClassName(c))
}

function getHighlightedText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}



var drag = {"sx":0,"sy":0,"x":0,"y":0,"on":false}

let main=setInterval(()=>{mainInterval()},30)

function mainInterval(){
	ctx.clearRect(0,0,Width,Height)

	if(drag.on){
		console.log("hi")
		ctx.strokeStyle="#FFFFFF";
		ctx.lineWidth = 3;

		ctx.beginPath()
		ctx.moveTo(drag.sx,drag.sy)
		ctx.lineTo(drag.x,drag.y)
		ctx.stroke()

	}

}

function setDefaultStatementBx(el){
	el.addEventListener('contextmenu',(e)=>{
			e.preventDefault();
			console.log("Elm rc: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
			// el.contentEditable = false;
			// el.style.userSelect = "none"
			// el.draggable = true
			el.blur()
		})
		el.addEventListener('click',(e)=>{
			// el.contentEditable = true;

			optionClicked(parseInt(el.id.substring(7)))
		})
		el.addEventListener('blur',(e)=>{
			el.contentEditable = false;
			el.style.userSelect = "none"
			el.draggable = true
		})
		el.addEventListener('dragstart',(e)=>{
			console.log("Elm drg: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
			e.dataTransfer.setDragImage(new Image(), 0, 0);
			drag = {"sx":e.clientX,"sy":e.clientY,"x":e.clientX,"y":e.clientY,"on":true}
		})
		el.addEventListener('drag',(e)=>{
			drag.x = e.clientX
			drag.y = e.clientY
		})
		el.addEventListener('dragend',(e)=>{
			console.log("Elm drgend: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
			drag.on = false;
		})

		el.contentEditable = false;
		el.style.userSelect = "none"
		el.draggable = true
}
function setDefaultTextBx(el){
	el.addEventListener('contextmenu',(e)=>{
			e.preventDefault();
			console.log("Elm rc: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
			// el.contentEditable = false;
			// el.style.userSelect = "none"
			// el.draggable = true
			el.blur()
		})
		el.addEventListener('click',(e)=>{
			el.contentEditable = true;
		})
		el.addEventListener('blur',(e)=>{
			el.contentEditable = false;
			el.style.userSelect = "none"
			el.draggable = true
		})
		el.addEventListener('dragstart',(e)=>{
			console.log("Elm drg: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
			e.dataTransfer.setDragImage(new Image(), 0, 0);
			drag = {"sx":e.clientX,"sy":e.clientY,"x":e.clientX,"y":e.clientY,"on":true}
		})
		el.addEventListener('drag',(e)=>{
			drag.x = e.clientX
			drag.y = e.clientY
		})
		el.addEventListener('dragend',(e)=>{
			console.log("Elm drgend: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
			drag.on = false;
		})

		el.contentEditable = false;
		el.style.userSelect = "none"
		el.draggable = true
}
{ 

	let elms = classQuery("statementBx")
	for( let i = 0 ; i < elms.length; i++){

		let el = elms[i]
		setDefaultStatementBx(el)
	}

}


class storage{
	static main = {
		// "0":{
		// 	"title":"Welcome to lopknA65's domain",
		// 	"description":"Feel free to explore",
		// 	"options":[{"optTitle":"hi","tags":[0]},{"optTitle":"info","tags":[1]}]
		// },
		// "1":{
		// 	"title":"Information here",
		// 	"description":"Not looking for an argument?",
		// 	"options":[{"optTitle":"science","tags":[-1]}]
		// },
	}
}


class Arg {
	static path = []
	static currentTag = 0
	static currentTitle = ""

	static reloadPath(){
		let pathStr = " <  "
		this.path.forEach((e,i)=>{
			if(i%2==0){
				pathStr += "["+e+"]"
			} else {
				pathStr += "{"+e+"}"				
			}
		})
		document.getElementById("path").innerHTML = pathStr
	}

	static loadTag(tag,forced){

		if(storage.main[tag] === undefined||forced){
			socket.emit("mem",tag);
			return
		}

		this.currentTag = tag
		this.path.push(tag)
		this.reloadPath()

		

		let content = storage.main[tag]

		document.getElementById("title").innerHTML = content.title
		//description

		let elm = document.getElementById("container1")
		let children = elm.children
		for(let i = children.length-1; i > -1; i--){
			if(children[i].id !== "action"){
				elm.removeChild(children[i])
			}
		}


		// content.options.forEach((option,i)=>{
		for(let i = content.options.length -1; i>-1;i--){
			addOption(content.options[i],i,"container1")
		}

	}
}

Arg.loadTag(0)

function addOption(option,optionNo,container){
	let el = document.createElement("div")
	el.innerHTML = option.optTitle
	el.id = "option-"+optionNo
	el.classList.add("optionBx")
	setDefaultStatementBx(el)
	document.getElementById(container).insertBefore(el,document.getElementById(container).firstChild)
}


function optionClicked(number){
	let block = storage.main[Arg.currentTag]
	console.log("option clicked:"+number)
	Arg.path.push(number);Arg.reloadPath()

	Arg.loadTag(block.options[number].tags[0])
	console.log("loading tag:"+block.options[number].tags[0])
}





function sendReq(req,type){
	socket.emit("req",{"type":type,"cont":req})
}




function reqV2(req){

	let dict = {
		"path":Arg.currentTag,
		"option":document.getElementById("cbx option").innerHTML,
		"title":document.getElementById("cbx title").innerHTML,
		"description":document.getElementById("cbx description").innerHTML,
	}
	sendReq(dict,"v2")
	ArgAug.loadTag(currentTag,true)
}

function reqV2_1(req){

	let dict = {
		"path":Arg.currentTag,
		"option":req.option,
		"title":req.title,
		"description":req.description,
	}
	sendReq(dict,"v2")
}










/// Tag ID, tag title, tag description, tag options (link)

let example = {
	"title":"1+1",
	"description":"this means one apple and another apple is two apples combined",
	"options":[{"optTitle":"yes this is true","tags":[16,17]},{"optTitle":"no","tags":[73,52]}]
}


/// [41]{5} -> [58]{3} -> [29]<17>

///guideline: ychain, understand -> sound -> valid

///arginput guideline:
/// general topic [base]=option
///
/// wrong option
/// Correct title
/// correct description
/// 
/// 
/// 


// Each title has multiple options
// Each option has one tag
// One tag links to a block
// 


//so there needs to be a specific starting path
//then add an option to the path
/// recognizing same options/ choice for same option
// then title, description



// - option
// -> title
// ->> description
// -< title ender
// -! tag link
// -/ highlight


function decrV2(str){
	let split = str.split("-")
	let DCT = {}

	for(let i = 0; i < split.length;i++){
		let s = split[i]

		if(s[s.length-1] == "\n"){s = s.slice(0,-1)}

		if(s[0] == ">"){
			if(s[1] == ">"){
				DCT.description=s.substring(2)
			} else {	
				DCT.title=s.substring(1)
			}
		} else if(s[0] == "!"){
				DCT.link=s.substring(1)
		} else if(s[0] == "/"){
				DCT.highlight = s.substring(1)
		} else {
				DCT.option=s
				}
	}
	Object.keys(DCT).forEach((e,i)=>{if(DCT[e][0]==" "){DCT[e]=DCT[e].substring(1)}})
	return(DCT)
}

function decr(str){
	let split = str.split("-")
	let outArr = []

	for(let i = 0; i < split.length;i++){
		let s = split[i]
		if(s[0] == ">"){
			if(s[1] == ">"){
				outArr.push({"type":"description","cont":s.substring(2)})
			} else {	
				outArr.push({"type":"title","cont":s.substring(1)})
			}
		} else if(s[0] == "!"){
				outArr.push({"type":"link","cont":s.substring(1)})
		} else if(s[0] == "/"){
				outArr.push({"type":"highlight","cont":s.substring(1)})
		} else {
				outArr.push({"type":"option","cont":s})
		}
	}
	return(outArr)
}

//tdl
// uni drvlic glass this pres 




