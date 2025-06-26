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
        responded(data)
    })
}


var hist = [""]
var histIndex = -1
var delaytime = 1000

document.getElementById('send').addEventListener("click",()=>{
	document.getElementById('send').style.backgroundColor='#AFFFAF'

    if(document.getElementById("input").value == ""){
        document.getElementById('send').style.backgroundColor='#FFAFAF'
        setTimeout(()=>{document.getElementById('send').style.backgroundColor='#AFFFAF'},delaytime)
    }


    hist.splice(0,0,document.getElementById("input").value)
    let str = preprocess(document.getElementById("input").value)
    s(str)
    let d = document.createElement("div")
    d.innerText = str
    d.style.color = "white"
    let logs = document.getElementById("logs")
    logs.insertBefore(d,logs.firstChild)
    histIndex = -1

	document.getElementById("input").value = ""


	// if (confirm('confirm?')){}

})

document.getElementById("input").addEventListener("keydown",(e)=>{
        if(e.key == "ArrowUp"){
            histIndex += 1
            console.log(histIndex)
            document.getElementById("input").value = hist[histIndex]
        }
        if(e.key == "ArrowDown"){
            histIndex -= 1
            console.log(histIndex)
            if(histIndex < -1){histIndex=-1}
            document.getElementById("input").value = hist[histIndex]
            if(histIndex == -1){document.getElementById("input").value = "E\nfr(20)"}
        }
    })

document.getElementById("input2").addEventListener("change",(e)=>{
    let val = parseInt(document.getElementById("input2").value)
    if(!isNaN(val)){
        delaytime = val
        document.getElementById("input2").style.backgroundColor = "#40A040"
    }else{
        document.getElementById("input2").style.backgroundColor = "#A04040"
    }
})


function responded(str){
    let d = document.createElement("div")
    d.innerText = str
    d.style.color = "#00A000"
    let logs = document.getElementById("logs")
    logs.insertBefore(d,logs.firstChild)
}

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


