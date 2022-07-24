let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");

camera_button.addEventListener('click', async function() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;
});

click_button.addEventListener('click', function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    // data url of the image
    setTimeout(()=>{
    let a = canvas.getContext('2d').getImageData(mouseX,mouseY,1,1).data
    console.log(a);
    PARR(a[0],a[1],a[2],mouseX,mouseY)
    },1000)
    
});
allzoom = 1
onmousemove = function(e){mouseX = (e.clientX *allzoom)/allzoom; mouseY = (e.clientY *allzoom)/allzoom}

let errorrange = [50,50,50]

function PARR(r,g,b,x,y){
    let finalDict = {}
    finalDict[SC(x,y)] = [r,g,b,0]
    let checksurround = [[x,y]]
    let nextchecksurround = []

    for(let checks = 0; checks < 2; checks++){

        for(let i = 0; i < checksurround.length; i++){

            let c = retlocs(checksurround[i][0],checksurround[i][1])
            for(let j = 0; j < 4; j++){
                let ced = getpix(c[j][0],c[j][1],[r,g,b])
                finalDict[SC(c[j][0],c[j][1])] = ced
                if(ced[3] != "stop"){
                    nextchecksurround.push([c[j][0],c[j][1]])
                    console.log(c[j][0],c[j][1])
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