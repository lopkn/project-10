let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let image = document.querySelector("#image")
// Access-Control-Allow-Origin "*"
image.crossOrigin = "Anonymous";

camera_button.addEventListener('click', async function() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;
});

click_button.addEventListener('click', function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height)

    // data url of the image
    setTimeout(()=>{
    let a = canvas.getContext('2d').getImageData(mouseX,mouseY,1,1).data
    PARR(a[0],a[1],a[2],mouseX,mouseY)
    console.log(a);
    
    },1000)
    
});
allzoom = 1
onmousemove = function(e){mouseX = (e.clientX *allzoom)/allzoom; mouseY = (e.clientY *allzoom)/allzoom}

let errorrange = [20,20,20]

function RARR(NO){

    let discArr = {}

    for(let i = 0; i < NO; i++){
        let tx = 9
        let ty = 0
        let chec = 0
        while(chec < 124000){
         tx = Math.floor(Math.random()*canvas.width)
         ty = Math.floor(Math.random()*canvas.height)
        chec ++
            if(discArr[SC(tx,ty)] == undefined){
                break;
            }

        } 
        console.log(tx,ty)
        let a = canvas.getContext('2d').getImageData(tx,ty,1,1).data
        let aa = PARR(a[0],a[1],a[2],tx,ty)
        let aaa = Object.keys(aa)
        aaa.forEach((e)=>{discArr[e] = true})
    }


}

function PARR(r,g,b,x,y){
    let finalDict = {}
    finalDict[SC(x,y)] = [r,g,b,0]
    let checksurround = [[x,y]]
    let nextchecksurround = []

    for(let checks = 0; checks < 600; checks++){

        for(let i = 0; i < checksurround.length; i++){

            // console.log("HII")

            let c = retlocs(checksurround[i][0],checksurround[i][1])
            for(let j = 0; j < 4; j++){
                    
                if(finalDict[SC(c[j][0],c[j][1])] != undefined){
                    continue;
                }

                let ced = getpix(c[j][0],c[j][1],[r,g,b])
                finalDict[SC(c[j][0],c[j][1])] = ced
                if(ced[3] != "stop"){
                    nextchecksurround.push([c[j][0],c[j][1]])
                    // console.log(c[j][0],c[j][1])
                }

            }


        }

        if(nextchecksurround.length < 1){
            break
        }
        checksurround = nextchecksurround
        nextchecksurround = []

    }


    let obj = Object.keys(finalDict)
    for(let i = 0; i < obj.length; i++){
        let sxy = obj[i].split(",")
        let xy = [parseInt(sxy[0]),parseInt(sxy[1])]
        canvas.getContext('2d').fillStyle = "rgb("+r+","+g+","+b+")"
        canvas.getContext('2d').fillRect(xy[0],xy[1],1,1)

    }


    console.log(finalDict)
    return(finalDict)

}


function retlocs(x,y){

    return([[x+1,y],[x-1,y],[x,y+1],[x,y-1]])

}


function getpix(x,y,org){
    let a = canvas.getContext('2d').getImageData(x,y,1,1).data
    let b = CalERR(a[0],a[1],a[2],org[0],org[1],org[2])
    return([a[0],a[1],a[2],b])
}

function CalERR(r,g,b,or,og,ob){
    let dr = Math.abs(r-or)
    let dg = Math.abs(g-og)
    let db = Math.abs(b-ob)

    if(dr < errorrange[0] && dg < errorrange[1] && db < errorrange[2]){
        return(dr+dg+db)
    }
    return("stop")
}


function SC(x,y){
    return(x+","+y)
}