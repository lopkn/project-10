let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let image = document.querySelector("#image")

let ctx2 = document.getElementById("canvas22").getContext("2d")
let ctx = document.getElementById("canvas").getContext("2d", {"willReadFrequently":true})
// Access-Control-Allow-Origin "*"
image.crossOrigin = "Anonymous";



camera_button.addEventListener('click', async function() {
    // let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
  video.srcObject = stream;
});

click_button.addEventListener('click', function() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    CP.scan()
    let image_data_url = canvas.toDataURL('image/jpeg');

    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height)

    // data url of the image
    setTimeout(()=>{
    let a = canvas.getContext('2d').getImageData(mouseX,mouseY,1,1).data
    // PARR(a[0],a[1],a[2],mouseX,mouseY)
    CP.scan()
    console.log(a);
    
    },1000)

    
});
allzoom = 1
onmousemove = function(e){mouseX = (e.clientX *allzoom)/allzoom; mouseY = (e.clientY *allzoom)/allzoom}




let errorrange = [20,20,20]

class CP{
    static pix = {}
    static refarr = []
    static raw = []
    static init(){
        for(let i = 0; i < canvas.width; i++){
            for(let j = 0; j < canvas.height; j++){
                this.refarr[j*canvas.width+i] = {"pos":[i,j],"strPos":i+","+j,"rawPos":(i+j*canvas.width)*4}
            }
        }

    }
    static scan(){
        this.raw = ctx.getImageData(0,0,canvas.width,canvas.height).data
        let a = this.raw
        // for(let i = 0; i < canvas.width; i++){
        //     for(let j = 0; j < canvas.height; j++){
        //         let arstart = (j*canvas.width+i)*4
        //         this.pix[i+","+j] = {"x":i,"y":j,"r":a[arstart],"g":a[arstart+1],"b":a[arstart+2],"a":a[arstart+3]}
        //     }
        // }
    }
    static drawPix(x,y){
        ctx2.fillRect(x,y,1,1)
    }
    static pixForEach(f){
        this.refarr.forEach((e,i)=>{
            f({"r":this.raw[e.rawPos],"g":this.raw[e.rawPos+1],"b":this.raw[e.rawPos+2],"a":this.raw[e.rawPos+3],"x":e.pos[0],"y":e.pos[1]},i)
        })
    }
    static clear(){
        ctx2.clearRect(0,0,canvas.width,canvas.height)
    }
}
CP.init()


function retlocs(x,y){

    return([[x+1,y],[x-1,y],[x,y+1],[x,y-1]])

}


function getpix(x,y,org){
    let a = ctx.getImageData(x,y,1,1).data
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
function inRect(x,y,rx,ry,w,h){
    if(x >= rx && y >= ry && x <= rx+w && y <= ry + h){
        return(true)
    }
    return(false)
}




function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}









  function initGPU() {
    try {
        return new window.GPU.GPU();
    } catch (e) {
        return new GPU();
    }
}




  const gpu = initGPU();

  info = [canvas.width,canvas.height]

  myGPUFunc = gpu.createKernel(function(raw,info) {
    let pos = (this.thread.x + this.thread.y * info[0])* 4
    
    if(this.thread.x !== 0 && this.thread.y !== 0){
        let posup = (this.thread.x + this.thread.y * info[0] - info[0])* 4
        let posleft = (this.thread.x + this.thread.y * info[0] - 1)* 4

        let coldiffup = Math.abs(raw[pos] - raw[posup]) +Math.abs(raw[pos+1] - raw[posup+1]) +Math.abs(raw[pos+2] - raw[posup+2])
        let coldiffleft = Math.abs(raw[pos] - raw[posleft]) +Math.abs(raw[pos+1] - raw[posleft+1]) +Math.abs(raw[pos+2] - raw[posleft+2])
        return(coldiffup+coldiffleft)
    }

    return(0)

  }).setOutput([info[0],info[1]])




function gpuscan(){
    return(myGPUFunc(CP.raw,info))
}





// console.log(Date.now())
// CP.scan()
// console.log(Date.now())
// CP.pixForEach((p,i)=>{
//     if(i%3 !== 0){return}
//     ctx2.fillStyle = "red"
//     if(p.r>30){ctx2.fillRect(p.x,p.y,1,1)}
// })
// console.log(Date.now())
// setTimeout(()=>{CP.clear()},500)


setInterval(()=>{ctx.drawImage(video, 0, 0, canvas.width, canvas.height);})