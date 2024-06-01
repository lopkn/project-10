const https = require('https');
const prompt = require('prompt-sync')();
const { execSync } = require('child_process');
const fs = require('fs')
const cheerio = require("cheerio")


function getWebsiteText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk.toString();
      });

      res.on('end', () => {
        // const $ = cheerio.load(data);
        // const plainText = $('body').text().trim()
        // resolve(plainText);
        resolve(data)
      });

      res.on('error', (err) => {
        reject(err);
      });
    });
  });
}
let web = 'https://en.wikipedia.org/wiki/Main_Page'
let lastweb = web
  let next = true
 // while(next){

function tryagain(){
  getWebsiteText(web)
  .then((data) => {
    pro(data);
    web = prompt("\n\n\nWEBsite?")
    next=true
    if(web == ""){
      web = lastweb
    } else {
      lastweb = web
    }

    if(web.substring(0,7)!="https://"){
      web = "https://"+web
    }

    if(web == "q"){
      next = false
    } else {tryagain()} 

  })
  .catch((error) => {
    console.log('Error:', error);
  });
}
  
// }
tryagain()
function pro(str){
  // console.log(str)
  //{'flag':'a'}
  let grep = prompt("grep?")
  fs.writeFileSync("log.txt",str) 
  let out = ""
  try{ out = execSync("cat ./log.txt | grep "+grep)} catch{}
  console.log(out.toString())
  console.log("done "+"cat ./log.txt | grep "+grep)
}

// exec('ls -l', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });