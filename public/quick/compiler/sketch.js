
let Width = window.innerWidth
let Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(Width)
  myCanvas.height = Math.floor(Height)
  myCanvas.style.width = Math.floor(Width)+"px"
  myCanvas.style.height = Math.floor(Height)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let myrec = document.getElementById("final")

  myrec.width = "80%"
  myrec.height = Math.floor(Height)
  myrec.style.width = "80%"
  myrec.style.height = Math.floor(Height)+"px"
  myrec.style.top = "0px"
  myrec.style.left = "0px"

let myterm = document.getElementById("term")

  myterm.width = "20%"
  myterm.height = Math.floor(Height)
  myterm.style.width = "20%"
  myterm.style.height = Math.floor(Height)+"px"
  myterm.style.top = "0px"
  myterm.style.left = "80%"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
let moveEnd = false
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

const socket = io.connect('/')

function moveCaretToEnd(element) {
  var range = document.createRange();
  var selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);

  element.focus();
}

let word = ""

// document.addEventListener("keydown",(e)=>{
//   let key = e.key
//   if(key == " "){
//     p(word)
//     word = ""
//   } else if(/[a-zA-Z0-9]/.test(key)){
//     word += key
//   }
// })


function p(str){

  if(str[str.length-1] !== " "){str = str+" "}

  let word = ""
  let phrase = ""
  let result = ""
  while(str.length>0){
    jump = 0
    let char = str[0]
    if(/[a-zA-Z0-9]/.test(char)){
      word += char
      phrase += char
    } else if(char == " "){

      result = pr(result,pword(word))

      phrase = phrase.substring(word.length)
      word = ""
    } else if(char == ","){
      result = pr(result,pphrase(phrase))
      word = ""
      phrase = ""
    }

    str = str.substring(1)
  }

  return(result.replace("^",""))
}

let jump = false
function pr(result,input){
  if(result.indexOf("^") !== -1 ){
    if(jump){
      return(result.replace("^",input))
    } else {
      return(result.replace("^",input+"^"))
    }
  } else {return(result+input)}
}

function pword(word){
  if(word == "if"){
    jump = 1
    return("if(^){^}")
  }if(word == "while"){
    jump = 1
    return("while(^){^}")
  }if(word == "for"){
    jump = 1
    return("for(^){^}")
  } else if(word == "then"){
    jump = 1
    return("")
  } else if(word == "not"){
    return("!")
  }else {return(word)}
}

function pphrase(phrase){
  {return(phrase)}
}

function placeCaretAtCharacter() {
  var input = document.getElementById('myrec'); // Replace 'myInput' with the actual ID of your input field or textarea
  var text = input.innerText;
  var caretPosition = text.indexOf('^');

  if (caretPosition > -1) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(caretPosition-1, caretPosition);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', caretPosition);
      range.moveStart('character', caretPosition);
      range.select();
    }
  }
}

