const axios = require('axios');
const Jimp = require('jimp');

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
}
*/
var data = {}
for(let i = 135; i < 139; i++){
    for(let j = 271; j < 275; j++){
       getPixelColor(i,j).then((e)=>{data[i+","+j]=e})
    }
}

setTimeout(()=>{

for(let i = 135; i < 139; i++){
    for(let j = 271; j < 275; j++){
       console.log(data[i+","+j])
    }
}
},1000)

function getDir(x=135,y=272){
    getPixelColor(x,y).then((e)=>{
        if(e[0] > 50){
            if(e[1] < 200){
                console.log("switching")
            } else {console.log("right")}
        } else {
            console.log("left")
        }
    })
}


// getPixelColor(10,10);