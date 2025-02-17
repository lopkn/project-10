var apiKey;
const endpoint = "https://api.openai.com/v1/chat/completions";


var browser = (window.browser)? window.browser : window.chrome;

function storeCredentials(ak) {
    apiKey = ak
    const cred = new PasswordCredential({
        id: 'lopkn summarizer api key',
        password: ak
    });
    return navigator.credentials.store(cred).then(() => {
        console.log('API key stored securely');
    }).catch((error) => {
        console.error('Error storing API key:', error);
    });
}

// To retrieve credentials
async function retrieveCredentials() {
    let x = await navigator.credentials.get({ password: true }).then((credential) => {
        if (credential) {
            apiKey = credential.password
            console.log('key: '+apiKey.substr(0,4) + "...");
        } else {
            console.log('No key found');
            storeCredentials(prompt("api key? (save as password)"))
        }
    }).catch((error) => {
        console.error('Error retrieving API key:', error);
    });

    return x
}

async function retrieveCredentials2(){
    // apiKey = localStorage.getItem("lopkn_summarizer_api_key")
    // if(apiKey === null || apiKey === undefined){
    //     apiKey = prompt("api key?")
    //     localStorage.setItem("lopkn_summarizer_api_key",apiKey)
    // }

    browser.storage.sync.get("lopkn_summarizer_api_key", (data) => {
        apiKey = data.lopkn_summarizer_api_key
        console.log("Retrieved data:", data.lopkn_summarizer_api_key.substr(0,4) + "...");

            if(apiKey === null || apiKey === undefined){
                alert("The key will be stored client side without encryption.")
                apiKey = prompt("api key?")
                browser.storage.sync.set({ lopkn_summarizer_api_key: apiKey }, () => {
                    console.log("new API key stored");
                });
            }
            doThing()
    });


}

const fetchCompletion = async messages => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages,
      model: "gpt-4o-mini",
      temperature: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    retrieveCredentials2(prompt("api key?"))
    throw Error(data.error.message);
  }

  return data.choices[0].message.content;
};

const messages = [{role: "user", content: "Ping!"}];

// console.log(document.body)

let div = document.createElement("div")
div.id = "AI-menu"
div.style.zIndex = 9999
div.style.position = "fixed"
div.style.top = "0px"
div.style.left = "0px"
div.style.backgroundColor = "rgba(0,0,0,0.5)"
div.style.color = "#0FF"
div.style.width = "40%"
div.style.height = "100%"
div.innerHTML = "Lopkn summarizer S102!"


let divTopic = document.createElement("div")
divTopic.id = "topic"
divTopic.style.backgroundColor = "purple"
divTopic.style.color = "#F0F"
divTopic.style.width = "100%"
divTopic.style.height = "20%"
divTopic.innerHTML = "Hey"
divTopic.style.fontSize = "30px"

let divResponse = document.createElement("div")
divResponse.id = "response"
divResponse.style.backgroundColor = "rgba(0,0,0,0.5)"
divResponse.style.color = "#0F0"
divResponse.style.width = "100%"
divResponse.style.height = "80%"
divResponse.innerHTML = "Loading"

let input = document.createElement("input")
// input.type = "text"
// input.addEventListener("keydown",(e)=>{if(e.key==="Enter"){processInput(input.value);input.value = ""}})
// div.appendChild(input)
div.appendChild(divTopic)
div.appendChild(divResponse)

function processInput(txt,prmpt="summarize everything in 1 sentence"){

divTopic.innerText = "PROMPT: "+prmpt
divResponse.innerHTML = "Loading"
    fetchCompletion([{role:"system",content:prmpt},{role:"user",content:txt}]).then((e)=>{
        //Show all definitions of the text in bullet point, dont use markdown. i.e. - ATP: (definition)
        console.log("response: "+e)
        divResponse.innerText = e
        divResponse.style.color = "#0F0"
    })
}

div.style.display = "none"

function readText(){

    txt = window.getSelection().toString()
    if(txt.length < 10){return}
    navigator.clipboard.writeText(txt).then(() => {
        console.log("Text copied to clipboard");
    });
    processInput(txt)
}

document.body.addEventListener("keydown",async (e)=>{
    if(e.key=="C"){

        if(apiKey===undefined || apiKey===null){
            // await retrieveCredentials()
            retrieveCredentials2()
            return;
        }

        doThing()
    }
    if(e.key == "X" ){
        if(div.style.display !== "none"){
            div.style.display = "none"
        } else {
            div.style.display = "block"
        }
    }
})

function doThing(){
    div.style.display = "block"
    readText()
}





document.body.appendChild(div)









