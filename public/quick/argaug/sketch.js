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




{ 

	let elms = classQuery("test")
	for( let i = 0 ; i < elms.length; i++){
		let el = elms[i]
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
		})
		el.addEventListener('dragend',(e)=>{
			console.log("Elm drgend: "+el+" at X: "+e.clientX+" Y: "+e.clientY)
		})
	}

}