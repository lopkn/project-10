const axios = require('axios');
const Jimp = require('jimp');
// const sound = require('sound-play')




var express = require('express');
var app = express();
var cors = require('cors')//jan7-2024

var server = app.listen(3010);

app.use(cors()) //jan7-2024
app.use(express.static('public'));
// app.use(express.json())

app.post('/res', (req, res) => {
    console.log('Got body:', req.body);
    // responder.process1(req.body,res)
    everything().then((e)=>{
        res.send(e)
    })
    // res.sendStatus(200);
})

async function getPixelColor(x=10,y=10,url='https://www.th.gov.bc.ca/ATIS/lgcws/images/lions_gate/queue_map.gif') {
    try {
        // Fetch the image from the URL
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        // Load the image using Jimp
        const image = await Jimp.Jimp.read(imageBuffer);

        const color = image.getPixelColor(x, y);
        const hexColor = Jimp.intToRGBA(color);

        // console.log(`Pixel color at `+x+", "+y+`: rgba(${hexColor.r}, ${hexColor.g}, ${hexColor.b}, ${hexColor.a})`);
        return([hexColor.r,hexColor.g,hexColor.b])
    } catch (error) {
        console.error('Error fetching or processing the image:', error);
    }
}

/*{right
  '135,271': [ 252, 252, 251 ],
  '135,272': [ 237, 240, 233 ],
  '135,273': [ 31, 32, 29 ],
  '135,274': [ 1, 1, 1 ],
  '136,271': [ 252, 252, 251 ],
  '136,272': [ 134, 135, 132 ],
  '136,273': [ 1, 1, 1 ],
  '136,274': [ 1, 1, 1 ],
  '137,271': [ 237, 240, 233 ],
  '137,272': [ 16, 16, 15 ],
  '137,273': [ 1, 1, 1 ],
  '137,274': [ 1, 1, 1 ],
  '138,271': [ 98, 98, 88 ],
  '138,272': [ 1, 1, 1 ],
  '138,274': [ 1, 1, 1 ],
  '138,273': [ 1, 1, 1 ],
}

[ 194, 197, 189 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 252, 252, 251 ]
[ 98, 98, 88 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 210, 214, 203 ]
[ 53, 62, 64 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]
[ 1, 1, 1 ]

{
  '135,271': [ 194, 197, 189 ],
  '135,272': [ 0, 0, 0 ],
  '135,273': [ 0, 0, 0 ],
  '135,274': [ 0, 0, 0 ],
  '136,271': [ 252, 252, 251 ],
  '136,272': [ 98, 98, 88 ],
  '136,273': [ 0, 0, 0 ],
  '136,274': [ 0, 0, 0 ],
  '137,271': [ 210, 214, 203 ],
  '137,272': [ 53, 62, 64 ],
  '137,273': [ 0, 0, 0 ],
  '137,274': [ 0, 0, 0 ],
  '138,274': [ 0, 0, 0 ],
  '138,273': [ 0, 0, 0 ],
  '138,272': [ 0, 0, 0 ],
  '138,271': [ 0, 0, 0 ],

  [ 211, 64, 64 ]
[ 211, 64, 64 ]
[ 222, 112, 112 ]
[ 226, 128, 128 ]
[ 196, 0, 0 ]
[ 196, 0, 0 ]
[ 196, 0, 0 ]
[ 196, 0, 0 ]
[ 226, 128, 128 ]
[ 226, 128, 128 ]
[ 218, 96, 96 ]
[ 200, 58, 52 ]
[ 252, 252, 251 ]
[ 252, 252, 251 ]
[ 252, 252, 251 ]
[ 229, 144, 144 ]
}
*/
var data = {}
for(let i = 135; i < 139; i++){
    for(let j = 271; j < 275; j++){
       getPixelColor(i,j).then((e)=>{data[i+","+j]=e})
    }
}

// setTimeout(()=>{

// for(let i = 135; i < 139; i++){
//     for(let j = 271; j < 275; j++){
//        console.log(data[i+","+j])
//     }
// }
// },1000)


var pathCleans={
    "taylor way":[120,90],
    "marine drive":[143,155],
    "bridge":[141,183],
    "after bridge":[79,287],
    "after! bridge":[91,405],
    "after! bridge back":[112,410],
    "after bridge back":[67,332],
    "bridge back":[115,238],
}
var pathCleansArr = [
    ["taylor way", 120, 90],
    ["marine drive", 143, 155],
    ["bridge", 141, 183],
    ["after bridge", 77, 287],
    ["after! bridge", 60, 347],
    ["after! bridge right", 65, 345],
    ["after bridge right", 82, 287],
    ["bridge right", 123, 223]
]


function getDir(x=135,y=272){
    getPixelColor(x,y).then((e)=>{
        if(e[0] > 50){
            if(e[1] < 200){
                return("switching")
                // sound.play("../../public/soundEffects/sinC4.mp3")
            } else {return("right")}
        } else {
            return("left")
        }
    })
}
async function getDir2(x = 135, y = 272) {
    const e = await getPixelColor(x, y);
    if (e[0] > 50) {
        if (e[1] < 200) {
            // sound.play("../../public/soundEffects/sinC4.mp3");
            return "switching";
        } else {
            return "right";
        }
    } else {
        return "left";
    }
}
async function getPaths(){

    let arr = [];

        for(let i = 0; i < pathCleansArr.length; i++){
            e = pathCleansArr[i]
        // pathCleansArr.forEach((e,i)=>{
            // getPixelColor(e[1],e[2]).then((E)=>{
                // (e[0]+": "+(E[0]>E[1]?"backed up":"fine"))
            // })
            let E = await getPixelColor(e[1],e[2])
            arr[i] = (e[0]+": "+(E[0]>E[1]?"backed up":"fine"))
        }
    
    return(arr)
}

async function everything(){
    let x = await getDir2()
    let z = await getPaths()
    return({"direction":x,"paths":z})
}

// sound.play("../../public/soundEffects/sinC4.mp3")
// setInterval((e)=>{
//     getDir()

// },3000)


// getPixelColor(10,10);