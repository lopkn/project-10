


function s(str,t=0){
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




// window.s = s

console.log("lopkn CTRL100 loaded")



