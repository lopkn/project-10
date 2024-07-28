
// seed = 123456789


random = Math.random



let pwidth = 50
let pheight = 50
let pixelsPerSquare = 15

let vecs = []

for(let y = 0; y < pheight+1; y++){
    vecs[y] = []
    for(let x = 0; x < pwidth+1; x++){
        vecs[y][x] = [random(),random()]
    }
}

function map(val,pmin=0,pmax=1,min=0,max=1){
    return((val-pmin)/(pmax-pmin)*(max-min) + min)
}


scale = 1/pixelsPerSquare



// def value2col(value:float):
//     value = smoothstepbig((value)*scale)
//     return (-value*255 if value < 0 else 0, value*255 if value > 0 else 0, 0)

function smoothstepbig(value){
    if(value < -1)
        return -1
    if(value > 1)
        return 1
    return -value*(value**2-3)/2
}

function smoothstepsmall(value){
    if(value < 0)
        return 0
    if(value > 1)
        return 1
    return 3*value**2 - 2*value**3
}


let myMAP = {}



running = true
// while (running){
    t = Date.now()/1000
    for(let Y = 0; Y<pheight;Y++){
        for(let X = 0; X<pwidth;X++){
            let vecDiffs = [[vecs[Y][X], vecs[Y][X+1]], [vecs[Y+1][X], vecs[Y+1][X+1]]]
            for(let y = 0; y<pixelsPerSquare;y++){
                ypos = Y*pixelsPerSquare + y
                for(let x = 0; x<pixelsPerSquare;x++){
                    xpos = X*pixelsPerSquare + x
                    final = 0
                    for(let ydiff = 0; ydiff<2;ydiff++){
                        for(let xdiff = 0; xdiff<2;xdiff++){

value = (x-(xdiff?pixelsPerSquare:0 ))*vecDiffs[ydiff][xdiff][0] + (y-(ydiff?pixelsPerSquare:0 ))*vecDiffs[ydiff][xdiff][1]
final += value*smoothstepsmall(map(x, 0, pixelsPerSquare, !xdiff, xdiff))*smoothstepsmall(map(y, 0, pixelsPerSquare, !ydiff, ydiff))
myMAP[xpos+","+ypos] = final
                        }
                    }

                }
            }
        }
    }
// }
