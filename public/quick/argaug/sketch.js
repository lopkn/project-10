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

ctx.fillRect(0,0,Width,Height)

setTimeout(()=>{ctx.clearRect(0,0,Width,Height)},200)


var drag = {"sx":0,"sy":0,"x":0,"y":0,"on":false}

setInterval(()=>{mainInterval()},30)

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
	static main = {"0":{
		"title":"Welcome to lopknA65's domain",
		"description":"Feel free to explore",
		"options":[{"optTitle":"hi","tags":[0]},{"optTitle":"hello","tags":[0]}]
	}}
}


class Arg {
	static path = []
	static currentTag = 0
	static currentTitle = ""

	static loadTag(tag){

		
		this.path.push(tag)
		let pathStr = " <  "
		this.path.forEach((e,i)=>{
			if(i%2==0){
				pathStr += "["+e+"]"
			} else {
				pathStr += "{"+e+"}"				
			}
		})
		document.getElementById("path").innerHTML = pathStr
		
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


		content.options.forEach((option,i)=>{
			let el = document.createElement("div")
			el.innerHTML = option.optTitle
			el.classList.add("statementBx")
			setDefaultStatementBx(el)
			document.getElementById("container1").insertBefore(el,document.getElementById("container1").firstChild)
		})

		

	}
}

Arg.loadTag(0)


/// Tag ID, tag title, tag description, tag options (link)

let example = {
	"title":"1+1",
	"description":"this means one apple and another apple is two apples combined",
	"options":[{"optTitle":"yes this is true","tags":[16,17]},{"optTitle":"no","tags":[73,52]}]
}


/// [41]{5} -> [58]{3} -> [29]<17>

///guideline: ychain, understand -> sound -> valid