let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas");
let image = document.querySelector("#image")

let ctx = document.getElementById("canvas2").getContext("2d")
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
    // setTimeout(()=>{
    // let a = canvas.getContext('2d').getImageData(mouseX,mouseY,1,1).data
    // PARR(a[0],a[1],a[2],mouseX,mouseY)
    // console.log(a);
    
    // },1000)

    console.log("initializing image")
    photop.initializeImg()
    console.log("initialized")
    console.log(photop.img["277,22"])
    
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
function inRect(x,y,rx,ry,w,h){
    if(x >= rx && y >= ry && x <= rx+w && y <= ry + h){
        return(true)
    }
    return(false)
}


function SC(x,y){
    return(x+","+y)
}









class photop{

    static img = {}
    static conimg = {}
    static conimg2 = {}

    static conimg3 = {}

    static drcon(){
        let objk = Object.keys(this.conimg)
        ctx.fillStyle = "#00FF00"
        objk.forEach((e)=>{
            let sp = e.split(",")
            ctx.fillRect(sp[0],sp[1],1,1)
        })
    }
    static drcon2(){
        let objk = Object.keys(this.conimg2)
        
        objk.forEach((e)=>{
            ctx.fillStyle = "rgba(0,255,0,"+(0.05*this.conimg2[e].length)+")"
            let sp = e.split(",")
            ctx.fillRect(sp[0],sp[1],1,1)
        })
    }

    static drcon3(){
        let objk = Object.keys(this.conimg3)
        objk.forEach((e)=>{
            ctx.fillStyle = "rgba("+(0.05*this.conimg3[e].n)+",255,"+(0.5*this.conimg3[e].n)+","+(0.05*this.conimg3[e].n)+")"
            ctx.fillRect(this.conimg3[e].x,this.conimg3[e].y,1,1)
            this.conimg3[e].n -= 1
            if(this.conimg3[e].n < 0){delete this.conimg3[e]}
        })
    }


    static initializeImg(){
        for(let i = -2;i<643; i++){
           for(let j = -2; j<482; j++){



                this.img[i+","+j] = this.getPix(i,j)

                if(i+","+j == "277,22"){
                    console.log(this.img[i+","+j])
                }


            } 
        }
    }

    static flow42(x,y,D,org){
        let d = 0
        let out = []
        for(let i = 0; i < 4; i++){
            d = this.walkerD(i,x,y)

            let dstr = d[0] + "," + d[1]

            // if(this.img[dstr] == undefined){
            //     this.img[dstr] = this.getPix(d[0],d[1])
            // }
            if(this.img[dstr] === false|| D[dstr]){
                continue;
            }

            let timg = this.img[dstr]

            let c = this.compCol(timg.col,org.col,10)
            D[dstr] = true
            if(c === false){
                if(this.conimg3[dstr] == undefined){
                    this.conimg3[dstr] = {"n":40,"x":d[0],"y":d[1]}
                }
                this.conimg3[dstr].n *= 1.4
            } else {
                out.push([d[0],d[1]])
            }

        
        }
        return(out)
    }

    static flow4(x,y,D){
        let d = 0
        let out = []
        for(let i = 0; i < 4; i++){
            d = this.walkerD(i,x,y)
            if(this.img[d[0]+","+d[1]] == undefined){
                this.img[d[0]+","+d[1]] = this.getPix(d[0],d[1])
            }
            if(this.img[d[0]+","+d[1]] === false|| D[d[0]+","+d[1]]){
                continue;
            }

            let timg = this.img[d[0]+","+d[1]]

            let c = this.compCol(timg.col,this.img[x+","+y].col)
            D[d[0]+","+d[1]] = true
            if(c === false){
                if(this.conimg[d[0]+","+d[1]] == undefined){
                    this.conimg[d[0]+","+d[1]] = []
                }
                this.conimg[d[0]+","+d[1]].push([d[0],d[1],x,y])
            } else {
                out.push([d[0],d[1]])
            }

        
        }
        return(out)
    }

    static flhowl(x,y){
        let arr = [[x,y]]
        if(this.img[x+","+y] == undefined){
            this.img[x+","+y] = this.getPix(x,y)
        }
        let asd = {}
        while(arr.length > 0){
        let nextArr = []
        
        arr.forEach((e)=>{
            let r = this.flow4(e[0],e[1],asd)
            r.forEach((E)=>{nextArr.push(E)})
        })
        arr = nextArr
        }
        return(asd)
    }

    static flhowl2(x,y){
        let arr = [[x,y]]
        let xystr = x+","+y
        if(this.img[xystr] == undefined){
            this.img[xystr] = this.getPix(x,y)
        }

        let org = this.img[xystr]

        let asd = {}
        while(arr.length > 0){
        let nextArr = []
        arr.forEach((e)=>{
            this.flow42(e[0],e[1],asd,org).forEach((E)=>{nextArr.push(E)})
        })
        arr = nextArr
        }
        return(asd)
    }

    static getPix(x,y){
        if(inRect(x,y,0,0,640,480)){

            let a = canvas.getContext('2d').getImageData(x,y,1,1).data
            return({"col":{"r":a[0],"g":a[1],"b":a[2]}})

        }
        return(false)
    }

    static walkerD(num,x,y){
        if(num == 0){
            return([x+1,y,1,0])
        } else if(num == 1){
            return([x-1,y,-1,0])
        } else if(num == 2){
            return([x,y+1,0,1])
        } else if(num == 3){
            return([x,y-1,0,-1])
        }
    }

    static compCol(d1,d2,D){

        if(D == undefined){
            D = 5
        }

        if(Math.abs(d1.r-d2.r) > D){
            return(false)
        }
        if(Math.abs(d1.g-d2.g) > D){
            return(false)
        }
        if(Math.abs(d1.b-d2.b) > D){
            return(false)
        }
        return(true)
    }

    static reset(){
        this.conimg = {}
        this.conimg2 = {}
        this.img = {}
    }

}


function conimg3Loop(){
    setInterval(()=>{
        ctx.fillStyle = "#000000"
        ctx.fillRect(0,0,1000,1000)
        photop.flhowl2(mouseX,mouseY)
        photop.drcon3()
    },200)
}


document.addEventListener('mousedown', (event) => {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,2000,2000)
    photop.flhowl2(mouseX,mouseY)
    photop.flhowl2(mouseX,mouseY)
    photop.flhowl2(mouseX,mouseY)
    photop.flhowl2(mouseX,mouseY)
    photop.flhowl2(mouseX,mouseY)
    photop.flhowl2(mouseX,mouseY)
    photop.drcon2()
})

let debugarr = []


function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}

function floGen(e){
    let d = Date.now()
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,2000,2000)
    for(let i = 0; i < e; i++){
        let th = Math.floor(Math.random()*480)
        let tw = Math.floor(Math.random()*640)
        debugarr.push([tw,th])
        if(distance(tw,th,477,253)<20){
            console.log("hola")
        }
        photop.flhowl2(tw,th);
    }
     photop.drcon2()
     console.log("generated in: " + (Date.now()-d) )
}









