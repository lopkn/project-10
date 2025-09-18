
var style = document.createElement('style');
document.head.appendChild(style);

// Define the new class
var className = 'gamified';
style.sheet.insertRule(`.${className} { background-color: rgba(255,0,0,0.1); user-select: text; cursor: text;}`, style.sheet.cssRules.length);


// Create a TreeWalker to traverse the document
const walker = document.createTreeWalker(
  document.body, // The root node to start from
  NodeFilter.SHOW_TEXT // Filter to only show text nodes
);

let node;
var stuffs = []
while ((node = walker.nextNode())) {
    stuffs.push(node)
}
stuffs.forEach((node)=>{
    const span = document.createElement('span'); // Create a span element
    span.className = 'gamified'; // Add the class
    span.textContent = node.nodeValue; // Set the text of the span
    span.draggable = false

    // Replace the text node with the new span
    node.parentNode.replaceChild(span, node);
})






function replaceWords(oldWord, newWord) {
    // Function to replace words in text nodes
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(new RegExp(oldWord, 'g'), newWord);
        } else {
            node.childNodes.forEach(replaceText);
        }
    }

    // Start replacing from the body
    replaceText(document.body);
}


class GAME{
    static start = true
    static bounty = new Map()
    static multipliers = new Map()
    static ALLTEXT = document.body.innerText
    static SPL = this.ALLTEXT.split("\n")
    static score = 0
    static gameLoop = setInterval(()=>{
        this.tick()
    },50)
    static tick(){
        if(Math.random()>0.995){
            this.newBounty()
        }
    }
    static newBounty(){
        let bounty = randomElement(this.SPL)
            this.bounty.set(bounty,50)
            displayDiv.innerText += "\n NEW BOUNTY: "+bounty
            console.log(bounty)
    }
}

function randomElement(arr){
    return(arr[Math.floor(Math.random()*arr.length)])
}

function removeWhiteSpace(str) {
    return str.replace(/^\s+|\s+$/g, '');
}


document.addEventListener("keydown",(e)=>{

    if(e.key == "Escape"){
        e.preventDefault()
        if(displayDiv.style.visibility == "hidden"){
            displayDiv.style.visibility = "visible"
        }else{
            displayDiv.style.visibility = "hidden"
        }
        return;
    }

    GAME.start=false
})

document.addEventListener('mouseup',(e)=>{
    txt = getSelectedText()
    let atxt = removeWhiteSpace(txt)
    if(atxt === txt){
        //multiply score
    }
    attackText(atxt)

})


function getSelectedText() {
  let selectedText = '';
  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  }
  return selectedText;
}



function attackText(txt){
    for(const [k,val] of GAME.bounty){
        if(k.includes(txt) && Math.abs(k.length-txt.length) < 5){

            GAME.bounty.delete(k)
            GAME.score += val

            displayDiv.innerText += "\nBOUNTY CLAIMED ("+val+"): "+k
            console.log("attacked!")
        }
    }
}



document.querySelectorAll('a').forEach(function(link) {

    const span = document.createElement('span'); // Create a span element
    span.className = 'gamified'; // Add the class
    span.textContent = link.innerText; // Set the text of the span
    span.draggable = false

    // // Replace the text node with the new span
    try{
        link.parentNode.replaceChild(span, link);
    } catch(err){
      debugger  
    }

});

// Remove all redirects by overriding the location change
window.onbeforeunload = function() {
    return "Are you sure you want to leave this page?";
};

var displayDiv = document.createElement("div")
displayDiv.style.backgroundColor = "rgba(0,125,0,0.99)"
displayDiv.style.position = "fixed"
displayDiv.style.top = "0px"
displayDiv.style.left = "0px"
// displayDiv.style.width = "20%"
// displayDiv.style.height = "30%"
displayDiv.style.zIndex = "9999"
document.body.appendChild(displayDiv)



















