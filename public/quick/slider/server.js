const https = require('https');
const prompt = require('prompt-sync')();
const { exec } = require('child_process');


function getWebsiteText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk.toString();
      });

      res.on('end', () => {
        resolve(data);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });
  });
}
let web = 'https://en.wikipedia.org/wiki/Main_Page'
while(true){
  getWebsiteText(web)
  .then((data) => {
    process(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

}

function process(str){
  console.log(str)
}

// exec('ls -l', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });