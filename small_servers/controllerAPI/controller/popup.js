function s(str,t=0){
	if(str === "" || str ===undefined){t=1000;str="[FLUSH]"}
    if(t!==0){setTimeout(()=>{s(str)},t);return;}
    fetch('http://localhost:3000/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: str,
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
}


var hist = [""]
var histIndex = -1

document.getElementById('send').addEventListener("click",()=>{
	document.getElementById('send').style.backgroundColor='#AFFFAF'

    if(document.getElementById("input").value == ""){
        document.getElementById('send').style.backgroundColor='#FFAFAF'
        setTimeout(()=>{document.getElementById('send').style.backgroundColor='#AFFFAF'},1000)
    }

    document.getElementById("input").addEventListener("keydown",(e)=>{
        if(e.key == "ArrowUp"){
            histIndex += 1
            document.getElementById("input").value = hist[histIndex]
        }
        if(e.key == "ArrowDown"){
            histIndex -= 1
            if(histIndex < -1){histIndex=-1}
            document.getElementById("input").value = hist[histIndex]
            if(histIndex == -1){document.getElementById("input").value = "E\nfr(20)"}
        }
    })


    hist.splice(0,0,document.getElementById("input").value)
    let str = preprocess(document.getElementById("input").value)
    s(str)
    histIndex = -1

	document.getElementById("input").value = ""


	// if (confirm('confirm?')){}

})
function preprocess(str) {
    if(str[0] == "e"&&str[1]=="\n"){
        return(str);
    }
    return(str)
}
// document.getElementById("wind").addEventListener("click",()=>{
//     chrome.runtime.sendMessage({type:'newWindow'});
// })
    

    // chrome.runtime.sendMessage({type:'newWindow'});


console.log("hey")


