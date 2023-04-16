let D = (window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth)-100

width = window.innerWidth
height = window.innerHeight
Width = window.innerWidth
Height = window.innerHeight

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(D+50)
  myCanvas.height = Math.floor(D+50)
  myCanvas.style.width = Math.floor(D+50)+"px"
  myCanvas.style.height = Math.floor(D+50)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
document.addEventListener("keydown",(e)=>{
  let key = e.key
  if(key == "n"){
    manager.enterEditingNew()
  }
})
let mouseIsPressed = false
document.addEventListener("mousedown",()=>{mouseIsPressed = true
  draw()

  if(mouseX < D){
  manager.clicked()
    } else {
      manager.clickedOut()
  }

  setTimeout(draw,10)
})
document.addEventListener("mouseup",()=>{mouseIsPressed = false
  draw()
  setTimeout(draw,10)
})




function rect(x,y,w,h){ctx.fillRect(x,y,w,h)}


function draw() {
  ctx.fillStyle = "#101010"
  rect(0,0,width,height)


  manager.cardsAll[manager.currentCard].render(manager.currentlyFlipped)

}

setInterval(()=>{
  draw()
},100)



function touchHandler(event)
{

  console.log(event.type)
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;        
        case "touchend":   type = "mouseup";   break;
        case "touchcancel":   type = "mouseup";   break;
        default:           return;
    }


    if(type !== "mouseup"){
    mouseX = event.touches[0].clientX
    mouseY = event.touches[0].clientY}


    var simulatedEvent = document.createEvent("MouseEvent");

    if(event.type == "touchend"){
        console.log("t4")
       }

    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    if(event.type == "touchend"){
        console.log("t5")
       }

    // if(type=="mouseup"){
    // console.log("hi")} else {
    //  console.log(event.type)
    // }
    document.body.dispatchEvent(simulatedEvent);
    
    event.preventDefault();
}


function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", (e)=>{touchHandler(e)}, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
    // document.addEventListener('touchmove', function() { e.preventDefault();GI.debuggingInfo = "cancled" }, { passive:false });
}
init()



class card{
  constructor(question,answer){
    this.question = question
    this.drawSteps = [answer]
    this.tags = [];
    this.id = -5;
  }


  render(flipped){

    if(flipped === false){
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.font = "bold 20px Courier New"
      ctx.fillText(this.question,D/2,D/2)
      ctx.fillText(this.id,25,20)
      return;
    }

    this.drawSteps.forEach((e)=>{
      this.renderSteps(e)
    })
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.font = "bold 20px Courier New"
      ctx.fillText(this.id,25,20)

  }


  renderSteps(x){
    if(typeof(x) == "string"){
      ctx.fillStyle = "#FFFFFF"
      ctx.textAlign = "center"
      ctx.font = "bold 20px Courier New"
      ctx.fillText(x,D/2,D/2)
    } else {
      x.draw()
    }
  }

}


class manager{


  static currentCard = 1;
  static currentlyFlipped = false
  static currentTag = "@all@"
  static idCount = 0;
  static giveId(){
    this.idCount++;
    return(this.idCount)
  }


  static cardsAll = {

  }

  static newCard(q,ans,tags){
    let newCard = new card(q,ans)
    newCard.tags = tags
    newCard.id = this.giveId()


    tags.forEach((e)=>{
      if(this.tagsAll[e] === undefined){
        this.tagsAll[e] = []
      }
      this.tagsAll[e].push(newCard.id)
    })
    this.tagsAll["@all@"].push(newCard.id)

    this.cardsAll[newCard.id] = newCard
    return(newCard.id)
  }






  static tagsAll = {
    "@all@":[]
  }

  static getCardAmount(tag,dict,arr){
    dict[tag] = true
    let amount = 0
    this.tagsAll[tag].forEach((e)=>{
      if(typeof(e) === "string" && e[0] === "@"){
        if(dict[e] === true){
          return;
        }
        amount += this.getCardAmount(e,dict,arr).amount
        return;
      }
      arr.push(e)
      amount += 1
    })
    return({"amount":amount,"arr":arr})
  }

  static getRandomCard(tag){
    let arr = this.getCardAmount(tag,{},[]).arr
    return(arr[Math.floor(Math.random()*arr.length)])
  }

  static clicked(){
    this.currentlyFlipped = !this.currentlyFlipped
  }

  static clickedOut(){
    this.currentlyFlipped = false;
    this.currentCard = this.getRandomCard(this.currentTag)
  }




  static enterEditingNew(){
    let question = prompt("question")
    let answer = prompt("answer")
    this.newCard(question,answer,[])
  }


}


class T{//t for text
  constructor(text){
    this.text = text
    this.color = "white"
    this.font = "bold 20px Courier New"
    this.x = D/2
    this.y = D/2
  }
  draw(){
      ctx.fillStyle = this.color
      ctx.textAlign = "center"
      ctx.font = this.font
      ctx.fillText(this.text,this.x,this.y)
  }
}

class S{//s for scribble
  constructor(arr){
    this.arr = arr
    this.color = "white"
    this.size = 20
  }
  draw(){
    ctx.strokeStyle = this.color
    let from = this.arr[0]
    ctx.beginPath()
    for(let i = 1; i < this.arr.length; i++){
      ctx.moveTo(from[0],from[1])
      from = this.arr[i]
      ctx.moveTo(from[0],from[1])
    }
    ctx.stroke()
  }
}

manager.newCard("does this work?","yes",["TEST"])
manager.newCard("does this work too?","yes",["TEST"])





