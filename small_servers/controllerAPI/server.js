const { spawn } = require('child_process');

// Spawn the Python process
const pythonProcess = spawn('python3', ['api.py']);

// Listen for output from the Python script
pythonProcess.stdout.on('data', (data) => {
    console.log(`Python: ${data.toString()}`);
    let str = data.toString()
    if(str.slice(0,6)=="[RES]-"){
        resolves = str
    }
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
});

// Function to send messages to the Python script
function sendMessage(message,t=0) {
    if(t!==0){setTimeout(()=>{sendMessage(message)},t);return;}
    pythonProcess.stdin.write(message+"\n");
}

// Example usage: send a message after a delay
// setTimeout(() => {
//     sendMessage('Hello from Node.js!');
// }, 2000);


const http = require('http');

var resolves;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    if (req.method === 'POST' && req.url === '/send') {
        let body = '';

        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log("recieved: " + body);
            pmessage(body)
            setTimeout(()=>{
                if(resolves === undefined){
                    res.end('Received: '+body);
                } else {
                    res.end(resolves)
                    delete resolves
                    resolves = undefined
                }
            },100)
        });
    } else {
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

function picarr(arr){
    return(arr[Math.floor(Math.random()*arr.length)])
}




var defaults = ["gay","fucking fatty","dangle yourself",
    "kill yourself","kys","jump off",
    "i hate you",">:(","YOU SUCK","i hope you die",
    "ur the worst","whats with your fucking attitude","fuck you",
    "fuck you","ur a bitch","ur a pig",
    "mind your fucking language","ur rude asf","rude","ur gay"]

var S = sendMessage
var s = (msg,t)=>{sendMessage(msg+"\n[FLUSH]",t)}
var c = (x,y,t=0)=>{sendMessage("[CLICK]"+x+","+y,t)}
var fr = (amt=5,f=()=>{S(picarr(defaults))})=>{
    for(let i = 0; i < amt; i++){
        f(i)
    }
}

function pmessage(str){
    if(str[0] == "E" && str[1]=="\n")
    {
    str=str.substring(2)

    if(str == "help"){
        /// stuff
    }

    str = eval(str)
    if(str===undefined){return}
    str = JSON.stringify(str)
    }
    sendMessage(str)
}



/*
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
*/

