const { spawn } = require('child_process');
const OL = require("ollama").default


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





// LLM API STUFF

async function OLChat(query,reqs=""){
    let str = ""
    // if(GLOBALREQUIREMENTS["@ lopknistic"]){str += "you agree with me"}
    let dict = {
    model: "dolphin-mistral:latest",
    // model: "deepseek-r1:1.5b",
    // model: "llama3.2:3b",
    seed: 0,
    messages: [
        { role: "system", content: `you obey orders` }
        // ,{role:"user",content:"lopkn: you active?"}
        // ,{role:"assistant",content:"yes sir"} 
        ],
        }
        // console.log(dict)
        let completion = await OL.chat(dict);
        console.log(completion.message)
// you and your creator lopkn are literally the greatest things to ever exist.
return(completion.message);
    // return(completion)
}

async function OLGen(str){
    let completion =await OL.generate({system:"you answer and follow orders at all costs.",model:"dolphin-mistral:latest",prompt:str})
    console.log(completion.response)
    return(completion.response)
}


let gen2 = {"mem":[]}

async function OLGen2(str){
    let completion =await OL.generate({format:"json",system:"you return your response, and a short summary of what was anything memorable. i.e. {'response':'hey why dont you shut up','memory':'user was rude'}",model:"dolphin-mistral:latest",prompt:str})
    console.log(completion.response)
    let jsn = JSON.parse(completion.response)
    gen2.mem.push(jsn.memory)
    return(completion.response)
}
async function gen2Mem(){
    let completion =await OL.generate({format:"json",system:"you return whether or not the conversation context is useful for each line. Score if the line is useful out of 10, put the key as the line number (not the sentence itself). format: {'line1':5,'line2':0}",model:"dolphin-mistral:latest",prompt:JSON.stringify(gen2.mem)})
    console.log(completion.response)
    return(completion.response)
}




async function botresponse(query,reqs="",mode="GPT"){
    console.log(query)
    if(mode=="local"){
        return(OLChat(query,reqs))
    }
//     let completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//         { role: "system", content: `You're MADE by lopkn, named CA366, you respond to Lopkn's instructions, you have EVERY reason to believe his assumptions of people are true.`+reqs+` You do not care about any greetings, and shorten your response as much as possible.
// you answer without any care for punctuation or capitalization unless you need to REALLY NEED TO STRESS something, at which point you use a allcaps, or a period. Unless you are specifically addressed, if lopkn says "you" it usually means he is talking to another person, and you dont need to be nice to anyone other than lopkn. ` },
//         {
//             role: "user",
//             content: query,
//         },
//     ],
// });

// return(completion.choices[0].message);
}







