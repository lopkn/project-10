
let Width = window.innerWidth
let Height = window.innerHeight

// let myCanvas = document.getElementById("myCanvas")

//   myCanvas.width = Math.floor(Width)
//   myCanvas.height = Math.floor(Height)
//   myCanvas.style.width = Math.floor(Width)+"px"
//   myCanvas.style.height = Math.floor(Height)+"px"
//   myCanvas.style.top = "0px"
//   myCanvas.style.left = "0px"

// let ctx = document.getElementById("myCanvas").getContext("2d")





let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


// const socket = io.connect('/')

class LCanvas{ //lopkns template canvas
  constructor(w=100,h=100,id=("LCanvas-"+Math.random())){
    this.canvas = document.createElement("canvas")
    this.canvas.id = id
    this.ctx = this.canvas.getContext("2d")
    this.canvas.style.position = "absolute"
    this.canvas.style.top = "0px"
    this.canvas.style.left = "0px"
    this.canvas.zIndex = "1500"
    this.canvas.width = w
    this.canvas.height = h
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    document.body.appendChild(this.canvas)
    return(this)
  }

  fitScreenSize(){
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  clear(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  }

  oneTimeDown(f){ // pass in a function for what to do with one click
    this.canvas.addEventListener("mousedown",f,{once:true})
  }

  getPixelRGB(x,y){
    let d = this.ctx.getImageData(x, y, 1, 1).data
    return(d)
  }


}


function distance(x1,y1,x2,y2) {
    let a = x2-x1
    let b = y2-y1
  return(Math.sqrt(a*a+b*b))
}


var frameFuncs = []

function mainLoop(time){
  frameFuncs.forEach((e)=>{
    e(time)
  })
  requestAnimationFrame(mainLoop)
}

function oneTimeTrustedButton(f){
  let button = document.createElement("button")
  button.style.position = "absolute"
  button.style.backgroundColor = "purple"
  button.innerText = "one time verifier"
  button.style.top = button.style.left = "0px"

  button.style.zIndex = 5000
  button.addEventListener("click",(e)=>{f(e);button.remove()},{once:true})
  document.body.appendChild(button)
}


function Lvideo(type="screen",append=false){
    let video = document.createElement('video')
    video.id = "Lvideo-"+Math.random()
    video.setAttribute("autoplay","autoplay")
    // document.body.append(video)
    if(type=="screen"){
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });video.srcObject = stream;})
    } else {
      oneTimeTrustedButton(async function() {let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });video.srcObject = stream;})
    }
    return(video)
  }

function copyToCanvas(img,Lcan){
  Lcan.ctx.drawImage(img, 0, 0, Lcan.canvas.width, Lcan.canvas.height);
}

function setDefaultAbsolute(elm){
  elm.style.position = "absolute"
  elm.style.top = elm.style.left = "0px"
}




class Lcolorf{ //lopkn's color functions
  static dictify(arr){ //turns arrays of numbers into arrays of dicts
    let outarr = []
    for(let i = 0; i < arr.length; i+=4){
      outarr.push({"r":arr[0],"g":arr[1],"b":arr[2],"a":arr[3]})
    }
    return(outarr)
  }
  static colorDistA(arr1,arr2){//only works on Arrays of numbers //arr2 should be same length or shorter
    let dst = 0
    for(let i = 0; i < arr2.length; i++){
      dst += Math.abs(arr1[i]-arr2[i])
    }
    return(dst)
  }
}

class LPerceptron{ //it should have input name, input value. each input should have a multiplier towards a result
  constructor(){
    this.outputInputpair = {"testOutput":{"testInput":2}}
    this.inputs = {}
  }
  input(dict){
    this.inputs = dict
  }
  generateOutput(item){
    let result = 0
    item = this.outputInputpair[item]
    let objk = Object.keys(item)
    for(let i = 0; i < objk.length; i++){
      let inputting = objk[i]
      result += this.input[inputting] * item[inputting]
    }
    return(result)
  }
  learn(item,expected){
    item = this.outputInputpair[item]
    let objk = Object.keys(item)
    for(let i = 0; i < objk.length; i++){
      let inputting = objk[i]
      this.input[inputting] += item[inputting] * (expected?1:-1)
    }
  }
}


/// ======== NOT TEMPLATE ANYMORE. BUILDING AREA ============




let mainDiv = document.getElementById("main")
function newElm(id=Math.random(),type="div",parent=mainDiv){
  let elm = document.createElement(type)
  parent.appendChild(elm)
  elm.id = id
  return(elm)
}

let pathDiv = newElm("path","div",mainDiv)
pathDiv.innerText="[0]"
pathDiv.style.backgroundColor = "#000050"
pathDiv.style.fontSize="10px"

let topTextDiv = newElm("top","div",mainDiv)
topTextDiv.style.backgroundColor = "#000050"
topTextDiv.style.width = "100%"
topTextDiv.style.display = "inline-block"
topTextDiv.style.height = "fit-content"
//topTextDiv.classList.add("hover1")
topTextDiv.style.fontSize="10px"
//topTextDiv.innerText = "[0]"


let mainText = newElm("mainText","div",topTextDiv)
mainText.style.backgroundColor = "#000050"
mainText.style.width = "100%"
mainText.style.display = "inline-block"
mainText.style.textAlign = "center"
mainText.style.height = "fit-content"
mainText.style.fontSize="40px"
mainText.innerText = "Welcome to my domain"
mainText.classList.add("hover1")






let mainButtonDiv = newElm("btn","div",mainDiv)
mainButtonDiv.style.backgroundColor = "#005050"
mainButtonDiv.style.width = "100%"
mainButtonDiv.style.display = "inline-block"
mainButtonDiv.style.height = "fit-content"
mainButtonDiv.classList.add("hover1")





let subText = newElm("subText","div",mainDiv)
subText.style.backgroundColor = "#000000"
subText.style.width = "100%"
subText.style.display = "inline-block"
//subText.style.textAlign = "center"
subText.style.height = "fit-content"
subText.style.fontSize="20px"
subText.innerText = "LopknA65"
//subText.classList.add("hover1")




let mainInput = newElm("in","div",mainDiv)
mainInput.style.height= "20%"
mainInput.style.position = "absolute"
mainInput.style.bottom = "0%"
mainInput.style.left = "0%"
mainInput.style.color = "#00F000"
mainInput.contentEditable = true
mainInput.style.display = "inline-block"
mainInput.classList.add("focus1")




let inputPrompt = newElm("prompt","div",mainDiv)
inputPrompt.style.height= "fit-content"
inputPrompt.style.position = "absolute"
inputPrompt.style.bottom = "28%"
inputPrompt.style.left = "5%"
inputPrompt.style.color = "#00F000"
inputPrompt.style.display = "inline-block"
inputPrompt.innerText = ""


function changeMainText(str="testText"){
    mainText.innerText = str
    return(mainText)
}


function addButton(content="test",id=Math.random()){
    let btn = document.createElement("button")
    mainButtonDiv.appendChild(btn)    
    btn.innerText = content
    btn.id = id
    btn.style.fontSize = "26px"
    btn.classList.add("hover2")
    return(btn)
}

function removeAllChildren(elm) {
    while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
    }
    return(elm)
}

addButton()
addButton()

var context = {}



function pressedButton(btn){
    log(btn.name + " §")
    //if(btn.text){
    //   changeMainText(btn.text) 
    //}

    if(btn.req){
        for(let i = 0; i < btn.req.length; i++){
            if(!context[btn.req[i]]){ // does not have this requirement
                load(btn.req[i])
                return;
            }
        }
    }

        load(btn.to)
}

function plog(str){
    log(str)
    inputPrompt.innerText = str
}

function seg(str){
    segregate.push({back:str,context:path})
}


let patharr = []

function load(p=path,dict=V1){

    if(p==="back"){
        if(segregate.length){
            segment = segregate.pop()
            p = segment.back
            context[segment.context] = true
        } else {
            log("error: there is no backtracking")
            return
        }
    }
    patharr.push(p)
    path = p
    removeAllChildren(mainButtonDiv)
    let d = dict[p]

    pathDiv.innerText += "-" + p
    if(d===undefined){
        changeMainText("Turn back")
        return;
    }

    if(d.text){
        changeMainText(d.text)
    } else {changeMainText("untitled")}
    if(d.subtext){
        subText.innerText = d.subtext
    }  else {subText.innerText = ""}

    if(d.seg){
        seg(patharr[patharr.length-2])
        log("context segregate")
    }


    if(d.type=="v1"||d.type===undefined){
        d.buttons.forEach((btn)=>{
            let button = addButton(btn.name)
            button.onclick = ()=>{pressedButton(btn)}
        })
    }

}


var V1 = {
    "0":{
        type:"v1",
        buttons:[
        ],
        text:"welcome to my domain.",
        subtext:''
    }
}









//V1 = {"0":{"type":"v1","buttons":[{"name":"introduction","to":"intro"},{"name":"arguments","to":1}],"text":"welcome to my domain.","subtext":""},"1":{"buttons":[{"name":"religion","to":"2"}],"text":"Topic?","subtext":"choose whichever argument topic you want to choose.\n\nDown this path, I will try to argue with you by letting you answer questions contradicting yourself."},"2":{"buttons":[{"name":"yes","to":"religion"}],"text":"will that belief change your judgement on things?\n","subtext":"i.e. does it affect your decision making at all, even a bit?"},"intro":{"buttons":[{"name":"back","to":"0"}],"text":"Click buttons to get places.","subtext":"This is subtext. You don't need to read this unless you are stuck somewhere. The point is to increase the speed of finding your own mistakes. Be as impulsive as you can - it helps the process. It lets you learn to answer things rigorously without slowing down.\n\nto get back to the root page, you can type \"back\" on the input area. "},"religion":{"buttons":[{"name":"yes","to":2}],"text":"Do you believe in god?","subtext":"in this context, it means \"do you think a god exists\""}}





// V1 = {"0":{"type":"v1","buttons":[{"name":"introduction","to":"intro"},{"name":"arguments","to":1},{"name":"make a decision","to":"decision"},{"name":"academics","to":"academics"}],"text":"welcome to my domain.","subtext":""},"1":{"buttons":[{"name":"religion","to":"religion","req":["care"]},{"name":"lopkn is being mean","to":12},{"name":"decision making","to":25},{"name":"pronouns","to":"pronouns"}],"text":"Topic?","subtext":"choose whichever argument topic you want to choose.\n\nDown this path, I will try to argue with you by letting you answer questions contradicting yourself."},"2":{"buttons":[{"name":"yes","to":15},{"name":"no","to":17}],"text":"you can prove things without needing independent experiments?","subtext":"thought experiments count as experiments.\nYou can give me the premise and logic (the experimental setup)\nand I can reach the conclusion by myself independently"},"3":{"buttons":[{"name":"yes","to":5}],"text":"Everyone with this belief can have any other belief, and still produce exactly the same results?","subtext":"if everyone believed in some extreme, contrary to your belief, society will still be exactly the same?"},"4":{"buttons":[],"text":"Because there is no point in arguing if your belief does not effect anything at all.","subtext":"even a miniscule amount counts. Are different beliefs equally as efficient at reaching a result?"},"5":{"buttons":[{"name":"yes","to":11}],"text":"it takes even the same amount of time for people to think, regardless of that belief system?","subtext":"remember, you said \"exactly the same\"\n\nI can't think of a singular belief that produces any \"exactly same\" results."},"6":{"buttons":[{"name":"yes","to":8},{"name":"no","to":2}],"text":"Does this proof include you telling me how to do an experiment, and me doing it to find out god exists?","subtext":""},"7":{"buttons":[{"name":"yes","to":6},{"name":"no","to":"non experimental"}],"text":"is there any way for you to prove to me its existance?","subtext":""},"8":{"buttons":[],"text":"indulge me.","subtext":"you can always come back here."},"9":{"buttons":[{"name":"yes","to":10},{"name":"no","to":"agree"}],"text":"Do you know for sure it doesn't exist?","subtext":""},"10":{"buttons":[],"text":"how are you so sure?","subtext":""},"11":{"buttons":[],"text":"True or false:\nmaking a decision USING a belief takes a bit longer than just bullshitting a random result\n","subtext":"in this case, ANY amount of time. even a very small amount of time. nanoseconds? it counts."},"12":{"buttons":[{"name":"yes","to":13}],"text":"Is he not making any argument/point outside of being just mean in this instance?","subtext":""},"13":{"buttons":[{"name":"yes","to":14}],"text":"Were you going to engage with the point if he made one?","subtext":"there is no reason for me to argue with you if you are not going to listen"},"14":{"buttons":[],"text":"tell him to be serious and make a point","subtext":""},"15":{"buttons":[{"name":"personal experience","to":16}],"text":"what type of proof is this?","subtext":"Logical proof/thought experiments counts as experiments.\ni.e, you can tell me the premises and the logic, and i can reach the same conclusion by myself (independent experiment)"},"16":{"buttons":[],"text":"Personal experience does not count as proof.\n","subtext":"If i personally experience the colors green and red being the same color, it doesnt mean red and green are the same color."},"17":{"buttons":[{"name":"yes","to":"7"}],"text":"Things cant be proven if we cannot independently verify it","subtext":""},"18":{"buttons":[],"text":"","subtext":""},"19":{"buttons":[],"text":"Is this experience a irrefutable proof to you or is it probabilistic?","subtext":"if you see or experience something, its irrefutable to you.\n\nIf a person punched you & you didnt see who punched you\n- its irrefutable that you got punched\n- its probabilistic that the person who punched you hates you"},"20":{"buttons":[{"name":"ok","to":"0"}],"text":"Everything should be covered. If not, tell me directly","subtext":"Most claims I let you make are truth claims. meaning it can only either be yes or no or you dont know.\n\nconsider the question\nShould people go to jail?\nyou might think \"it depends\"\nBut it is still just a yes or no question. If you disagree in any reasonable way, then answer no. If you agree in any reasonable way, then answer yes."},"21":{"buttons":[{"name":"Pros > Cons","to":23},{"name":"Cons > Pros","to":24}],"text":"Weigh the pros and cons","subtext":"remember to take these into account\nTime cost (opportunity cost)\nSocial cost \nUsefulness of doing it\nOther options"},"22":{"buttons":[],"text":"2","subtext":"If you didnt like this result, you didnt want it to be random anyway."},"23":{"buttons":[],"text":"Ok, then do it","subtext":"theres no reason not to"},"24":{"buttons":[],"text":"Then dont do it","subtext":"There exists a better option then choose that. Not doing something also counts as a choice"},"25":{"buttons":[{"name":"agree","to":26},{"name":"disagree","to":29}],"text":"Premise/definition: If you don’t care about something, you have no reason to act upon it.","subtext":"Be reminded that if you give a reason, it’s likely that you do care about it in ways"},"26":{"buttons":[{"name":"yes","to":27},{"name":"no","to":30}],"text":"The premise logically concludes that, If something will never affect you, you shouldn’t do anything about it","subtext":"Be reminded that \"Things happening far away\" e.g. war; still has the potential to affect you, which does not fulfill the hypothesis \"will NEVER affect\""},"27":{"buttons":[{"name":"agree","to":28},{"name":"disagree","to":31}],"text":"That conclusion implies: Any action you take must have 1 or more reasons for \"how it affects you\"","subtext":""},"28":{"buttons":[{"name":"agree","to":32}],"text":"Second premise: You will never actively choose to do things that you believe will make your situation worse","subtext":"> Be reminded that \"massive cons + little pros\" still equal \"worse\"\n> Following this premise, people can still do things that are bad. I.e. believing that self harm is positive in any way\n>> Think of every time as a kid you were enraged and escalated the situation much more than it needed to be. You were acting in your self interest.\n>> Remember that, following the previous conclusions, there must be a personal reason for you to do anything.\n>>> imagine dying to save the world. Some would die to save the world because that's better for me than if they stayed alive and felt the guilt"},"29":{"buttons":[],"text":"Give an example","subtext":"Why would you ever do something if you dont care about it?\n\njust because \"you dont want to care\" doesnt mean you dont actually care BTW"},"30":{"buttons":[],"text":"If something will never effect you, you can still care about it?","subtext":"You answered\nYes: i shouldnt act on what i care about\nNo: if things dont affect me i shouldnt act on it"},"31":{"buttons":[],"text":"?","subtext":""},"32":{"buttons":[{"name":"ok","to":52}],"text":"So, you only ever do anything that affects you\nand you only ever do anything that is positive to you","subtext":""},"33":{"buttons":[{"name":"your definition doesnt matter","to":34},{"name":"the person who identifies as a male","to":35},{"name":"the person who is a male","to":36}],"text":"What do you think is MY definition of the pronoun \"he\"","subtext":""},"34":{"buttons":[{"name":"what matters is what the listener believes","to":38},{"name":"you hurt the listener regardless of your intent","to":42},{"name":"no. The only thing that matters is what the definition SHOULD be","to":48},{"name":"no. The only thing that matters is what the definition IS","to":49},{"name":"you should always respect the other party's pronouns","to":50}],"text":"you mean to tell me the intent behind the speaker does not matter?","subtext":"i.e. you get just as hurt if a robot programmatically referred to you with a wrong pronoun, as you get if a person intentionally calls you a wront pronoun?"},"35":{"buttons":[],"text":"well no that isnt what I define the word \"he\" as","subtext":""},"36":{"buttons":[{"name":"your presumption is wrong","to":37},{"name":"but that is not the proper definition","to":39}],"text":"Yes. So I just call people whatever I presume they are","subtext":""},"37":{"buttons":[],"text":"That doesnt matter. when I use a pronoun, the presumption is there. Just because a presumption is wrong doesnt mean a sentence is wrong","subtext":"i.e.\n\"The animal I presumed was a bird chirped\"\n\nWas the animal a bird? it couldve been something else\nDid that animal actually chirp? yes\nWas the point of the message conveyed completely? yes"},"38":{"buttons":[],"text":"Sure. The listener can be informed of my definition of pronouns","subtext":"what matters is not what the speaker means, but what the listener thinks the speaker means right?\nNow that I tell you my definition of the pronoun, you should now know what to think I mean when I say something."},"39":{"buttons":[{"name":"I would protest that stupid definition","to":40},{"name":"I would start using the word \"murder\" that way","to":41}],"text":"if a lot of people suddenly changed the definition of the word \"murder\" to be what's now known as \"play\" because it sounded funny, what would happen?","subtext":""},"40":{"buttons":[],"text":"Ok. So it is reasonable for you to protest sudden stupid changes in definitions?","subtext":""},"41":{"buttons":[],"text":"and it is now unreasonable for people to use the word \"murder\" in the old way?","subtext":""},"42":{"buttons":[{"name":"yes","to":43}],"text":"does being called another pronoun mean something negative?\nIs it really that hurtful?","subtext":""},"43":{"buttons":[{"name":"how hard is it for you to just use a proper pronoun","to":44}],"text":"Lets not be friends","subtext":"If I called you by the wrong pronoun and you elicit such a strong reaction, I can't imagine what will happen when I call you stupid for the 10th time"},"44":{"buttons":[{"name":"not hard","to":45},{"name":"me using the letter does not hurt you","to":46}],"text":"how hard is it for you to stop using the letter C?","subtext":"its just one letter. seems quite simple\nnot so simple when you realise you have impulse/insticts that helps you with doing things - like giving pronouns to people, or using letters when speaking."},"45":{"buttons":[],"text":"Ok, just to because it is fun, I will force myself to use the correct pronoun as long as you actually dont use the letter C","subtext":"funny."},"46":{"buttons":[{"name":"theres no way me using the letter C hurts you","to":47}],"text":"well who are you to assume that it doesn't hurt me?","subtext":""},"47":{"buttons":[],"text":"And theres no way me using the wrong pronouns hurt you enough to warrent me changing my way of speech","subtext":""},"48":{"buttons":[],"text":"why SHOULD it be that definition?","subtext":""},"49":{"buttons":[],"text":"what IS the definition of the pronoun \"he\"?","subtext":""},"50":{"buttons":[{"name":"thats ridiculous","to":51}],"text":"My pronouns are \"flying/helicopter\". Let's respect each other's pronouns","subtext":""},"51":{"buttons":[],"text":"how do you have the right to call my pronouns ridiculous. What is so ridiculous about it?","subtext":""},"52":{"buttons":[],"text":"All choices you make are what YOU believe maximizes your happiness","subtext":"\"avoiding pain\" is the same as \"reducing negative happiness\" which still counts as maximizing happiness"},"care":{"seg":1,"buttons":[{"name":"yes","to":"back"},{"name":"no","to":3},{"name":"why?","to":4}],"text":"will that belief change your judgement on things?\n","subtext":"i.e. does it affect your decision making at all, even a bit?"},"intro":{"buttons":[{"name":"back","to":"0"},{"name":"my answers are more nuanced than the options you provided","to":20}],"text":"Click buttons to get places.","subtext":"This is subtext. You don't need to read this unless you are stuck somewhere. The point is to increase the speed of finding your own mistakes. Be as impulsive as you can - it helps the process. It lets you learn to answer things rigorously without slowing down.\n\nto get back to the root page, you can type \"back\" on the input area."},"religion":{"buttons":[{"name":"yes","to":"7"},{"name":"no","to":9},{"name":"cant say","to":"agree"}],"text":"Do you believe in god?","subtext":"in this context, it means \"do you think a god exists\""},"agree":{"buttons":[],"text":"we agree on all your answers so far.","subtext":"That is great. it does not mean your thought process is totally the same as mine though - there can be more rigorous details that we are missing"},"back":1,"non experimental":{"buttons":[{"name":"personal experience","to":19}],"text":"How is it that you can believe in something you cant prove to other people?","subtext":""},"decision":{"buttons":[{"name":"should I do X?","to":21},{"name":"random number","to":22}],"text":"What type of decision?","subtext":""},"pronouns":{"buttons":[{"name":"yes","to":33}],"text":"You think I should \"respect\" others by using their preferred pronouns?","subtext":""},"academics":{"buttons":[{"name":"math","to":"math"}],"text":"Note bank / subjects","subtext":""},"math":{"buttons":[{"name":"trigonometry","to":"trig"},{"name":"calculus","to":"calc"}],"text":"Math / area","subtext":""},"trig":{"buttons":[],"text":"Trig / bank","subtext":""},"calc":{"buttons":[],"text":"Calc / bank","subtext":""}}


// V1 = {"0":{"type":"v1","buttons":[{"name":"introduction","to":"intro"},{"name":"arguments","to":1},{"name":"make a decision","to":"decision"},{"name":"academics","to":"academics"},{"name":"about lopkn","to":59}],"text":"welcome to my domain.","subtext":""},"1":{"buttons":[{"name":"religion","to":"religion","req":["care"]},{"name":"lopkn is being mean","to":12},{"name":"decision making","to":25},{"name":"pronouns","to":"pronouns"},{"name":"history","to":"history"}],"text":"Topic?","subtext":"choose whichever argument topic you want to choose.\n\nDown this path, I will try to argue with you by letting you answer questions contradicting yourself."},"2":{"buttons":[{"name":"yes","to":15},{"name":"no","to":17}],"text":"you can prove things without needing independent experiments?","subtext":"thought experiments count as experiments.\nYou can give me the premise and logic (the experimental setup)\nand I can reach the conclusion by myself independently"},"3":{"buttons":[{"name":"yes","to":5}],"text":"Everyone with this belief can have any other belief, and still produce exactly the same results?","subtext":"if everyone believed in some extreme, contrary to your belief, society will still be exactly the same?"},"4":{"buttons":[],"text":"Because there is no point in arguing if your belief does not effect anything at all.","subtext":"even a miniscule amount counts. Are different beliefs equally as efficient at reaching a result?"},"5":{"buttons":[{"name":"yes","to":11}],"text":"it takes even the same amount of time for people to think, regardless of that belief system?","subtext":"remember, you said \"exactly the same\"\n\nI can't think of a singular belief that produces any \"exactly same\" results."},"6":{"buttons":[{"name":"yes","to":8},{"name":"no","to":2}],"text":"Does this proof include you telling me how to do an experiment, and me doing it to find out god exists?","subtext":""},"7":{"buttons":[{"name":"yes","to":6},{"name":"no","to":"non experimental"}],"text":"is there any way for you to prove to me its existance?","subtext":""},"8":{"buttons":[],"text":"indulge me.","subtext":"you can always come back here."},"9":{"buttons":[{"name":"yes","to":10},{"name":"no","to":"agree"}],"text":"Do you know for sure it doesn't exist?","subtext":""},"10":{"buttons":[],"text":"how are you so sure?","subtext":""},"11":{"buttons":[],"text":"True or false:\nmaking a decision USING a belief takes a bit longer than just bullshitting a random result\n","subtext":"in this case, ANY amount of time. even a very small amount of time. nanoseconds? it counts."},"12":{"buttons":[{"name":"yes","to":13},{"name":"no but does him making a point justify that language?","to":53}],"text":"Is he not making any argument/point outside of being just mean in this instance?","subtext":""},"13":{"buttons":[{"name":"yes","to":14}],"text":"Were you going to engage with the point if he made one?","subtext":"there is no reason for me to argue with you if you are not going to listen"},"14":{"buttons":[],"text":"tell him to be serious and make a point","subtext":""},"15":{"buttons":[{"name":"personal experience","to":16}],"text":"what type of proof is this?","subtext":"Logical proof/thought experiments counts as experiments.\ni.e, you can tell me the premises and the logic, and i can reach the same conclusion by myself (independent experiment)"},"16":{"buttons":[],"text":"Personal experience does not count as proof.\n","subtext":"If i personally experience the colors green and red being the same color, it doesnt mean red and green are the same color."},"17":{"buttons":[{"name":"yes","to":"7"}],"text":"Things cant be proven if we cannot independently verify it","subtext":""},"18":{"buttons":[],"text":"","subtext":""},"19":{"buttons":[{"name":"irrefutable","to":55}],"text":"Is this experience a irrefutable proof to you or is it probabilistic?","subtext":"if you see or experience something, its irrefutable to you.\n\nIf a person punched you & you didnt see who punched you\n- its irrefutable that you got punched\n- its probabilistic that the person who punched you hates you"},"20":{"buttons":[{"name":"ok","to":"0"}],"text":"Everything should be covered. If not, tell me directly","subtext":"Most claims I let you make are truth claims. meaning it can only either be yes or no or you dont know.\n\nconsider the question\nShould people go to jail?\nyou might think \"it depends\"\nBut it is still just a yes or no question. If you disagree in any reasonable way, then answer no. If you agree in any reasonable way, then answer yes."},"21":{"buttons":[{"name":"Pros > Cons","to":23},{"name":"Cons > Pros","to":24}],"text":"Weigh the pros and cons","subtext":"remember to take these into account\nTime cost (opportunity cost)\nSocial cost \nUsefulness of doing it\nOther options"},"22":{"buttons":[],"text":"2","subtext":"If you didnt like this result, you didnt want it to be random anyway."},"23":{"buttons":[],"text":"Ok, then do it","subtext":"theres no reason not to"},"24":{"buttons":[],"text":"Then dont do it","subtext":"There exists a better option then choose that. Not doing something also counts as a choice"},"25":{"buttons":[{"name":"agree","to":26},{"name":"disagree","to":29}],"text":"Premise/definition: If you don’t care about something, you have no reason to act upon it.","subtext":"Be reminded that if you give a reason, it’s likely that you do care about it in ways"},"26":{"buttons":[{"name":"yes","to":27},{"name":"no","to":30}],"text":"The premise logically concludes that, If something will never affect you, you shouldn’t do anything about it","subtext":"Be reminded that \"Things happening far away\" e.g. war; still has the potential to affect you, which does not fulfill the hypothesis \"will NEVER affect\""},"27":{"buttons":[{"name":"agree","to":28},{"name":"disagree","to":31}],"text":"That conclusion implies: Any action you take must have 1 or more reasons for \"how it affects you\"","subtext":""},"28":{"buttons":[{"name":"agree","to":32}],"text":"Second premise: You will never actively choose to do things that you believe will make your situation worse","subtext":"> Be reminded that \"massive cons + little pros\" still equal \"worse\"\n> Following this premise, people can still do things that are bad. I.e. believing that self harm is positive in any way\n>> Think of every time as a kid you were enraged and escalated the situation much more than it needed to be. You were acting in your self interest.\n>> Remember that, following the previous conclusions, there must be a personal reason for you to do anything.\n>>> imagine dying to save the world. Some would die to save the world because that's better for me than if they stayed alive and felt the guilt"},"29":{"buttons":[],"text":"Give an example","subtext":"Why would you ever do something if you dont care about it?\n\njust because \"you dont want to care\" doesnt mean you dont actually care BTW"},"30":{"buttons":[],"text":"If something will never effect you, you can still care about it?","subtext":"You answered\nYes: i shouldnt act on what i care about\nNo: if things dont affect me i shouldnt act on it"},"31":{"buttons":[],"text":"?","subtext":""},"32":{"buttons":[{"name":"ok","to":52}],"text":"So, you only ever do anything that affects you\nand you only ever do anything that is positive to you","subtext":""},"33":{"buttons":[{"name":"your definition doesnt matter","to":34},{"name":"the person who identifies as a male","to":35},{"name":"the person who is a male","to":36}],"text":"What do you think is MY definition of the pronoun \"he\"","subtext":""},"34":{"buttons":[{"name":"what matters is what the listener believes","to":38},{"name":"you hurt the listener regardless of your intent","to":42},{"name":"no. The only thing that matters is what the definition SHOULD be","to":48},{"name":"no. The only thing that matters is what the definition IS","to":49},{"name":"you should always respect the other party's pronouns","to":50}],"text":"you mean to tell me the intent behind the speaker does not matter?","subtext":"i.e. you get just as hurt if a robot programmatically referred to you with a wrong pronoun, as you get if a person intentionally calls you a wront pronoun?"},"35":{"buttons":[],"text":"well no that isnt what I define the word \"he\" as","subtext":""},"36":{"buttons":[{"name":"your presumption is wrong","to":37},{"name":"but that is not the proper definition","to":39}],"text":"Yes. So I just call people whatever I presume they are","subtext":""},"37":{"buttons":[],"text":"That doesnt matter. when I use a pronoun, the presumption is there. Just because a presumption is wrong doesnt mean a sentence is wrong","subtext":"i.e.\n\"The animal I presumed was a bird chirped\"\n\nWas the animal a bird? it couldve been something else\nDid that animal actually chirp? yes\nWas the point of the message conveyed completely? yes"},"38":{"buttons":[],"text":"Sure. The listener can be informed of my definition of pronouns","subtext":"what matters is not what the speaker means, but what the listener thinks the speaker means right?\nNow that I tell you my definition of the pronoun, you should now know what to think I mean when I say something."},"39":{"buttons":[{"name":"I would protest that stupid definition","to":40},{"name":"I would start using the word \"murder\" that way","to":41}],"text":"if a lot of people suddenly changed the definition of the word \"murder\" to be what's now known as \"play\" because it sounded funny, what would happen?","subtext":""},"40":{"buttons":[],"text":"Ok. So it is reasonable for you to protest sudden stupid changes in definitions?","subtext":""},"41":{"buttons":[],"text":"and it is now unreasonable for people to use the word \"murder\" in the old way?","subtext":""},"42":{"buttons":[{"name":"yes","to":43}],"text":"does being called another pronoun mean something negative?\nIs it really that hurtful?","subtext":""},"43":{"buttons":[{"name":"how hard is it for you to just use a proper pronoun","to":44}],"text":"Lets not be friends","subtext":"If I called you by the wrong pronoun and you elicit such a strong reaction, I can't imagine what will happen when I call you stupid for the 10th time"},"44":{"buttons":[{"name":"not hard","to":45},{"name":"me using the letter does not hurt you","to":46}],"text":"how hard is it for you to stop using the letter C?","subtext":"its just one letter. seems quite simple\nnot so simple when you realise you have impulse/insticts that helps you with doing things - like giving pronouns to people, or using letters when speaking."},"45":{"buttons":[],"text":"Ok, just to because it is fun, I will force myself to use the correct pronoun as long as you actually dont use the letter C","subtext":"funny."},"46":{"buttons":[{"name":"theres no way me using the letter C hurts you","to":47}],"text":"well who are you to assume that it doesn't hurt me?","subtext":""},"47":{"buttons":[],"text":"And theres no way me using the wrong pronouns hurt you enough to warrent me changing my way of speech","subtext":""},"48":{"buttons":[],"text":"why SHOULD it be that definition?","subtext":""},"49":{"buttons":[],"text":"what IS the definition of the pronoun \"he\"?","subtext":""},"50":{"buttons":[{"name":"thats ridiculous","to":51}],"text":"My pronouns are \"flying/helicopter\". Let's respect each other's pronouns","subtext":""},"51":{"buttons":[],"text":"how do you have the right to call my pronouns ridiculous. What is so ridiculous about it?","subtext":""},"52":{"buttons":[],"text":"All choices you make are what YOU believe maximizes your happiness","subtext":"\"avoiding pain\" is the same as \"reducing negative happiness\" which still counts as maximizing happiness"},"53":{"buttons":[{"name":"yes","to":54}],"text":"Yes. Are you saying there should never be strong language in arguments, even if they are proper?","subtext":""},"54":{"buttons":[],"text":"Everyone should always be nice?","subtext":""},"55":{"buttons":[],"text":"Describe the irrefutable experience","subtext":""},"56":{"buttons":[{"name":"yes","to":58}],"text":"is history really required to realize something is a mistake?","subtext":"can't you realize things are mistakes, even without history?"},"57":{"buttons":[],"text":"I think i agree with this","subtext":""},"58":{"buttons":[],"text":"Can people know something is wrong, without having to do it?","subtext":""},"59":{"buttons":[{"name":"websites","to":60},{"name":"lopknA65","to":61},{"name":"why did you make this","to":64}],"text":"What are you trying to explore?","subtext":""},"60":{"buttons":[{"name":"games and random stuff","to":62}],"text":"LopknA65 has many websites seperated into some categories","subtext":""},"61":{"buttons":[{"name":"personal life","to":63},{"name":"beliefs","to":"beliefs"}],"text":"What exactly are you trying to find?","subtext":""},"62":{"buttons":[],"text":"games are hosted on game.lopkn.dev","subtext":"game.lopkn.dev/quick/three (3d flight simulator)\ngame.lopkn.dev/quick/zchess (real time chess game)\ngame.lopkn.dev/timer (internal clock test)\ngame.lopkn.dev/shooter2 (2d shooter with recoil physics and bots)"},"63":{"buttons":[],"text":"sure","subtext":""},"64":{"buttons":[],"text":"Having to tell everyone my argument again and again is hard","subtext":"its easier for you to click a few buttons to try and get through how I think! and things can be noted here\n\nif you dont like the fact that this is kind of just sending you off to another website, think again!\n\nThis is interactive, not so different from actually chatting with me. And again, if you get to a dead end, you can always talk to me"},"care":{"seg":1,"buttons":[{"name":"yes","to":"back"},{"name":"no","to":3},{"name":"why?","to":4}],"text":"will that belief change your judgement on things?\n","subtext":"i.e. does it affect your decision making at all, even a bit?"},"intro":{"buttons":[{"name":"back","to":"0"},{"name":"my answers are more nuanced than the options you provided","to":20}],"text":"Read the page from top to bottom\nClick buttons to get places.","subtext":"This is subtext. You don't need to read this unless you are stuck somewhere. The point is to increase the speed of finding your own mistakes. Be as impulsive as you can - it helps the process. It lets you learn to answer things rigorously without slowing down.\n\nto get back to the root page, you can type \"back\" on the input area."},"religion":{"buttons":[{"name":"yes","to":"7"},{"name":"no","to":9},{"name":"cant say","to":"agree"}],"text":"Do you believe in god?","subtext":"in this context, it means \"do you think a god exists\""},"agree":{"buttons":[],"text":"we agree on all your answers so far.","subtext":"That is great. it does not mean your thought process is totally the same as mine though - there can be more rigorous details that we are missing"},"back":1,"non experimental":{"buttons":[{"name":"personal experience","to":19}],"text":"How is it that you can believe in something you cant prove to other people?","subtext":""},"decision":{"buttons":[{"name":"should I do X?","to":21},{"name":"random number","to":22}],"text":"What type of decision?","subtext":""},"pronouns":{"buttons":[{"name":"yes","to":33}],"text":"You think I should \"respect\" others by using their preferred pronouns?","subtext":""},"academics":{"buttons":[{"name":"math","to":"math"}],"text":"Note bank / subjects","subtext":""},"math":{"buttons":[{"name":"trigonometry","to":"trig"},{"name":"calculus","to":"calc"}],"text":"Math / area","subtext":""},"trig":{"buttons":[],"text":"Trig / bank","subtext":""},"calc":{"buttons":[],"text":"Calc / bank","subtext":""},"history":{"buttons":[{"name":"to learn from past mistakes","to":56},{"name":"to understand the context of modern situations","to":57}],"text":"To what degree is history important?","subtext":"if there are multiple answers, choose the one you think is the strongest reason (or the ones you havent chosen before)"},"beliefs":{"buttons":[],"text":"LopknA65's beliefs","subtext":""}}
V1 = {"0":{"type":"v1","buttons":[{"name":"introduction","to":"intro"},{"name":"arguments","to":1},{"name":"make a decision","to":"decision"},{"name":"academics","to":"academics"},{"name":"about lopkn","to":59}],"text":"welcome to my domain.","subtext":""},"1":{"buttons":[{"name":"religion","to":"religion","req":["care"]},{"name":"lopkn is being mean","to":12},{"name":"decision making","to":25},{"name":"pronouns","to":"pronouns"},{"name":"history","to":"history"}],"text":"Topic?","subtext":"choose whichever argument topic you want to choose.\n\nDown this path, I will try to argue with you by letting you answer questions contradicting yourself."},"2":{"buttons":[{"name":"yes","to":15},{"name":"no","to":17}],"text":"you can prove things without needing independent experiments?","subtext":"thought experiments count as experiments.\nYou can give me the premise and logic (the experimental setup)\nand I can reach the conclusion by myself independently"},"3":{"buttons":[{"name":"yes","to":5}],"text":"Everyone with this belief can have any other belief, and still produce exactly the same results?","subtext":"if everyone believed in some extreme, contrary to your belief, society will still be exactly the same?"},"4":{"buttons":[],"text":"Because there is no point in arguing if your belief does not effect anything at all.","subtext":"even a miniscule amount counts. Are different beliefs equally as efficient at reaching a result?"},"5":{"buttons":[{"name":"yes","to":11}],"text":"it takes even the same amount of time for people to think, regardless of that belief system?","subtext":"remember, you said \"exactly the same\"\n\nI can't think of a singular belief that produces any \"exactly same\" results."},"6":{"buttons":[{"name":"yes","to":8},{"name":"no","to":2}],"text":"Does this proof include you telling me how to do an experiment, and me doing it to find out god exists?","subtext":""},"7":{"buttons":[{"name":"yes","to":6},{"name":"no","to":"non experimental"}],"text":"is there any way for you to prove to me its existance?","subtext":""},"8":{"buttons":[],"text":"indulge me.","subtext":"you can always come back here."},"9":{"buttons":[{"name":"yes","to":10},{"name":"no","to":"agree"}],"text":"Do you know for sure it doesn't exist?","subtext":""},"10":{"buttons":[],"text":"how are you so sure?","subtext":""},"11":{"buttons":[],"text":"True or false:\nmaking a decision USING a belief takes a bit longer than just bullshitting a random result\n","subtext":"in this case, ANY amount of time. even a very small amount of time. nanoseconds? it counts."},"12":{"buttons":[{"name":"yes","to":13},{"name":"no but does him making a point justify that language?","to":53}],"text":"Is he not making any argument/point outside of being just mean in this instance?","subtext":""},"13":{"buttons":[{"name":"yes","to":14}],"text":"Were you going to engage with the point if he made one?","subtext":"there is no reason for me to argue with you if you are not going to listen"},"14":{"buttons":[],"text":"tell him to be serious and make a point","subtext":""},"15":{"buttons":[{"name":"personal experience","to":16}],"text":"what type of proof is this?","subtext":"Logical proof/thought experiments counts as experiments.\ni.e, you can tell me the premises and the logic, and i can reach the same conclusion by myself (independent experiment)"},"16":{"buttons":[],"text":"Personal experience does not count as proof.\n","subtext":"If i personally experience the colors green and red being the same color, it doesnt mean red and green are the same color."},"17":{"buttons":[{"name":"yes","to":"7"}],"text":"Things cant be proven if we cannot independently verify it","subtext":""},"18":{"buttons":[],"text":"","subtext":""},"19":{"buttons":[{"name":"irrefutable","to":55}],"text":"Is this experience a irrefutable proof to you or is it probabilistic?","subtext":"if you see or experience something, its irrefutable to you.\n\nIf a person punched you & you didnt see who punched you\n- its irrefutable that you got punched\n- its probabilistic that the person who punched you hates you"},"20":{"buttons":[{"name":"ok","to":"0"}],"text":"Everything should be covered. If not, tell me directly","subtext":"Most claims I let you make are truth claims. meaning it can only either be yes or no or you dont know.\n\nconsider the question\nShould people go to jail?\nyou might think \"it depends\"\nBut it is still just a yes or no question. If you disagree in any reasonable way, then answer no. If you agree in any reasonable way, then answer yes."},"21":{"buttons":[{"name":"Pros > Cons","to":23},{"name":"Cons > Pros","to":24}],"text":"Weigh the pros and cons","subtext":"remember to take these into account\nTime cost (opportunity cost)\nSocial cost \nUsefulness of doing it\nOther options"},"22":{"buttons":[],"text":"2","subtext":"If you didnt like this result, you didnt want it to be random anyway."},"23":{"buttons":[],"text":"Ok, then do it","subtext":"theres no reason not to"},"24":{"buttons":[],"text":"Then dont do it","subtext":"There exists a better option then choose that. Not doing something also counts as a choice"},"25":{"buttons":[{"name":"agree","to":26},{"name":"disagree","to":29}],"text":"Premise/definition: If you don’t care about something, you have no reason to act upon it.","subtext":"Be reminded that if you give a reason, it’s likely that you do care about it in ways"},"26":{"buttons":[{"name":"yes","to":27},{"name":"no","to":30}],"text":"The premise logically concludes that, If something will never affect you, you shouldn’t do anything about it","subtext":"Be reminded that \"Things happening far away\" e.g. war; still has the potential to affect you, which does not fulfill the hypothesis \"will NEVER affect\""},"27":{"buttons":[{"name":"agree","to":28},{"name":"disagree","to":31}],"text":"That conclusion implies: Any action you take must have 1 or more reasons for \"how it affects you\"","subtext":""},"28":{"buttons":[{"name":"agree","to":32}],"text":"Second premise: You will never actively choose to do things that you believe will make your situation worse","subtext":"> Be reminded that \"massive cons + little pros\" still equal \"worse\"\n> Following this premise, people can still do things that are bad. I.e. believing that self harm is positive in any way\n>> Think of every time as a kid you were enraged and escalated the situation much more than it needed to be. You were acting in your self interest.\n>> Remember that, following the previous conclusions, there must be a personal reason for you to do anything.\n>>> imagine dying to save the world. Some would die to save the world because that's better for me than if they stayed alive and felt the guilt"},"29":{"buttons":[],"text":"Give an example","subtext":"Why would you ever do something if you dont care about it?\n\njust because \"you dont want to care\" doesnt mean you dont actually care BTW"},"30":{"buttons":[],"text":"If something will never effect you, you can still care about it?","subtext":"You answered\nYes: i shouldnt act on what i care about\nNo: if things dont affect me i shouldnt act on it"},"31":{"buttons":[],"text":"?","subtext":""},"32":{"buttons":[{"name":"ok","to":52}],"text":"So, you only ever do anything that affects you\nand you only ever do anything that is positive to you","subtext":""},"33":{"buttons":[{"name":"your definition doesnt matter","to":34},{"name":"the person who identifies as a male","to":35},{"name":"the person who is a male","to":36}],"text":"What do you think is MY definition of the pronoun \"he\"","subtext":""},"34":{"buttons":[{"name":"what matters is what the listener believes","to":38},{"name":"you hurt the listener regardless of your intent","to":42},{"name":"no. The only thing that matters is what the definition SHOULD be","to":48},{"name":"no. The only thing that matters is what the definition IS","to":49},{"name":"you should always respect the other party's pronouns","to":50}],"text":"you mean to tell me the intent behind the speaker does not matter?","subtext":"i.e. you get just as hurt if a robot programmatically referred to you with a wrong pronoun, as you get if a person intentionally calls you a wront pronoun?"},"35":{"buttons":[],"text":"well no that isnt what I define the word \"he\" as","subtext":""},"36":{"buttons":[{"name":"your presumption is wrong","to":37},{"name":"but that is not the proper definition","to":39}],"text":"Yes. So I just call people whatever I presume they are","subtext":""},"37":{"buttons":[],"text":"That doesnt matter. when I use a pronoun, the presumption is there. Just because a presumption is wrong doesnt mean a sentence is wrong","subtext":"i.e.\n\"The animal I presumed was a bird chirped\"\n\nWas the animal a bird? it couldve been something else\nDid that animal actually chirp? yes\nWas the point of the message conveyed completely? yes"},"38":{"buttons":[],"text":"Sure. The listener can be informed of my definition of pronouns","subtext":"what matters is not what the speaker means, but what the listener thinks the speaker means right?\nNow that I tell you my definition of the pronoun, you should now know what to think I mean when I say something."},"39":{"buttons":[{"name":"I would protest that stupid definition","to":40},{"name":"I would start using the word \"murder\" that way","to":41}],"text":"if a lot of people suddenly changed the definition of the word \"murder\" to be what's now known as \"play\" because it sounded funny, what would happen?","subtext":""},"40":{"buttons":[],"text":"Ok. So it is reasonable for you to protest sudden stupid changes in definitions?","subtext":""},"41":{"buttons":[],"text":"and it is now unreasonable for people to use the word \"murder\" in the old way?","subtext":""},"42":{"buttons":[{"name":"yes","to":43}],"text":"does being called another pronoun mean something negative?\nIs it really that hurtful?","subtext":""},"43":{"buttons":[{"name":"how hard is it for you to just use a proper pronoun","to":44}],"text":"Lets not be friends","subtext":"If I called you by the wrong pronoun and you elicit such a strong reaction, I can't imagine what will happen when I call you stupid for the 10th time"},"44":{"buttons":[{"name":"not hard","to":45},{"name":"me using the letter does not hurt you","to":46}],"text":"how hard is it for you to stop using the letter C?","subtext":"its just one letter. seems quite simple\nnot so simple when you realise you have impulse/insticts that helps you with doing things - like giving pronouns to people, or using letters when speaking."},"45":{"buttons":[],"text":"Ok, just to because it is fun, I will force myself to use the correct pronoun as long as you actually dont use the letter C","subtext":"funny."},"46":{"buttons":[{"name":"theres no way me using the letter C hurts you","to":47}],"text":"well who are you to assume that it doesn't hurt me?","subtext":""},"47":{"buttons":[],"text":"And theres no way me using the wrong pronouns hurt you enough to warrent me changing my way of speech","subtext":""},"48":{"buttons":[],"text":"why SHOULD it be that definition?","subtext":""},"49":{"buttons":[],"text":"what IS the definition of the pronoun \"he\"?","subtext":""},"50":{"buttons":[{"name":"thats ridiculous","to":51}],"text":"My pronouns are \"flying/helicopter\". Let's respect each other's pronouns","subtext":""},"51":{"buttons":[],"text":"how do you have the right to call my pronouns ridiculous. What is so ridiculous about it?","subtext":""},"52":{"buttons":[],"text":"All choices you make are what YOU believe maximizes your happiness","subtext":"\"avoiding pain\" is the same as \"reducing negative happiness\" which still counts as maximizing happiness"},"53":{"buttons":[{"name":"yes","to":54}],"text":"Yes. Are you saying there should never be strong language in arguments, even if they are proper?","subtext":""},"54":{"buttons":[{"name":"yes","to":65}],"text":"Everyone should always be nice?","subtext":""},"55":{"buttons":[],"text":"Describe the irrefutable experience","subtext":""},"56":{"buttons":[{"name":"yes","to":58}],"text":"is history really required to realize something is a mistake?","subtext":"can't you realize things are mistakes, even without history?"},"57":{"buttons":[],"text":"I think i agree with this","subtext":""},"58":{"buttons":[],"text":"Can people know something is wrong, without having to do it?","subtext":""},"59":{"buttons":[{"name":"websites","to":60},{"name":"lopknA65","to":61},{"name":"why did you make this","to":64}],"text":"What are you trying to explore?","subtext":""},"60":{"buttons":[{"name":"games and random stuff","to":62}],"text":"LopknA65 has many websites seperated into some categories","subtext":""},"61":{"buttons":[{"name":"personal life","to":63},{"name":"beliefs","to":"beliefs"}],"text":"What exactly are you trying to find?","subtext":""},"62":{"buttons":[],"text":"games are hosted on game.lopkn.dev","subtext":"game.lopkn.dev/quick/three (3d flight simulator)\ngame.lopkn.dev/quick/zchess (real time chess game)\ngame.lopkn.dev/timer (internal clock test)\ngame.lopkn.dev/shooter2 (2d shooter with recoil physics and bots)"},"63":{"buttons":[],"text":"sure","subtext":""},"64":{"buttons":[],"text":"Having to tell everyone my argument again and again is hard","subtext":"its easier for you to click a few buttons to try and get through how I think! and things can be noted here\n\nif you dont like the fact that this is kind of just sending you off to another website, think again!\n\nThis is interactive, not so different from actually chatting with me. And again, if you get to a dead end, you can always talk to me"},"65":{"buttons":[{"name":"yes","to":66}],"text":"Everyone should ALWAYS avoid hurting the other person?","subtext":""},"66":{"buttons":[],"text":"By using the letter C, you are hurting me. stop doing that. thanks","subtext":""},"care":{"seg":1,"buttons":[{"name":"yes","to":"back"},{"name":"no","to":3},{"name":"why?","to":4}],"text":"will that belief change your judgement on things?\n","subtext":"i.e. does it affect your decision making at all, even a bit?"},"intro":{"buttons":[{"name":"back","to":"0"},{"name":"my answers are more nuanced than the options you provided","to":20}],"text":"Read the page from top to bottom\nClick buttons to get places.","subtext":"This is subtext. You don't need to read this unless you are stuck somewhere. The point is to increase the speed of finding your own mistakes. Be as impulsive as you can - it helps the process. It lets you learn to answer things rigorously without slowing down.\n\nto get back to the root page, you can type \"back\" on the input area."},"religion":{"buttons":[{"name":"yes","to":"7"},{"name":"no","to":9},{"name":"cant say","to":"agree"}],"text":"Do you believe in god?","subtext":"in this context, it means \"do you think a god exists\""},"agree":{"buttons":[],"text":"we agree on all your answers so far.","subtext":"That is great. it does not mean your thought process is totally the same as mine though - there can be more rigorous details that we are missing"},"back":1,"non experimental":{"buttons":[{"name":"personal experience","to":19}],"text":"How is it that you can believe in something you cant prove to other people?","subtext":""},"decision":{"buttons":[{"name":"should I do X?","to":21},{"name":"random number","to":22}],"text":"What type of decision?","subtext":""},"pronouns":{"buttons":[{"name":"yes","to":33}],"text":"You think I should \"respect\" others by using their preferred pronouns?","subtext":""},"academics":{"buttons":[{"name":"math","to":"math"}],"text":"Note bank / subjects","subtext":""},"math":{"buttons":[{"name":"trigonometry","to":"trig"},{"name":"calculus","to":"calc"}],"text":"Math / area","subtext":""},"trig":{"buttons":[],"text":"Trig / bank","subtext":""},"calc":{"buttons":[],"text":"Calc / bank","subtext":""},"history":{"buttons":[{"name":"to learn from past mistakes","to":56},{"name":"to understand the context of modern situations","to":57}],"text":"To what degree is history important?","subtext":"if there are multiple answers, choose the one you think is the strongest reason (or the ones you havent chosen before)"},"beliefs":{"buttons":[],"text":"LopknA65's beliefs","subtext":""}}










var path = 0
var segregate = []


var log = (e)=>{console.log(e);let elm=document.getElementById("console");elm.innerText += "\n> " + e;elm.scrollTop=elm.scrollHeight}
load()


var inputQueue = []



function processInput(txt){
    inputPrompt.innerText = ""
    if(inputQueue.length){
        let f = inputQueue.pop()
        f(txt)
    } else {
        defaultInputQueue(txt)  
    }
}


function defaultInputQueue(txt){
    log("defaulted")
    if(txt==="choice"){
        plog("name?")
        inputQueueAdd(choiceINQ)
    }
    else if(txt === "eval"){
        plog("eval?")
        inputQueue.push((x)=>{eval(x)})
    }
    else if(txt === "home"){
        load(0)
    }
    else if(txt === "back"){
        patharr.pop()
        load(patharr.pop())
    }
    else if(txt === "edit"){
        plog("edit item?")
        setInput("text")
        inputQueueAdd(editINQ)
    }
    else if(txt === "copy"){
        navigator.clipboard.writeText(JSON.stringify(V1))
    }
    else if(txt === "redirect"){
        plog("redirect button?")
        inputQueueAdd(redirectINQ)
    }
    else if(txt === "goto"){
        plog("goto?")
        inputQueue.push((x)=>{load(x)})
    }
    else if(txt === "context"){
        
    }
}

function inputQueueAdd(x){
    for(let i = x.length-1; i > -1; i--){
        inputQueue.push(x[i])
    }
}

var intermediate = {}

var choiceUUID = 1;
function getCUUID(){
    while(V1[choiceUUID]){
        choiceUUID++
    }
    return(choiceUUID)
}

var choiceINQ = [
    (txt)=>{intermediate={};intermediate["name"] = txt;plog("to?")},
    //(txt)=>{intermediate["text"] = txt;log("subtext?")},
    //(txt)=>{intermediate["subtext"] = txt;log("to?")},
    (txt)=>{intermediate["to"] = ( (txt===''||txt==="\n")?getCUUID():txt);log(V1[intermediate.to]?"exists":"empty"); setInput("done? y")},
    (txt)=>{/*done?*/ if(txt==="done? y"){
        log("V1["+path+"].buttons.push("+JSON.stringify(intermediate)+")")
        V1[path].buttons.push(JSON.parse(JSON.stringify(intermediate)))
        load(path)

        if(V1[intermediate.to]===undefined){
            intermediate = {to:intermediate.to}
            log("the stated path is empty.")
            plog("text?")
            inputQueueAdd(pathINQ)
        }

    }}
]

var pathINQ = [
    (txt)=>{intermediate.text=txt; plog("subtext?")},
    (txt)=>{intermediate.subtext=txt; log("V1["+intermediate.to+"]={buttons:[],text:`"+intermediate.text+"`,subtext:`"+intermediate.subtext+"`}");
        V1[intermediate.to]={buttons:[],text:intermediate.text,subtext:intermediate.subtext}
    },
]

var editINQ = [
    (t)=>{intermediate.editItem=t;plog("content?");setInput(V1[path][t])},
    (t)=>{V1[path][intermediate.editItem]=t;log("edited");load(path)}
]

var redirectINQ = [
    (t)=>{intermediate={};let x = V1[path].buttons[t];if(x){intermediate.button=x;plog("to?");setInput(x.to)}else{log("button does not exist")}},
    (t)=>{if(intermediate.button){intermediate.button.to=(t===""?getCUUID():t);
        log(V1[t]?"exists":"empty")

        if(V1[intermediate.button.to]===undefined){
            intermediate = {to:intermediate.to}
            log("the stated path is empty.")
            plog("text?")
            inputQueueAdd(pathINQ)
        }
    }}
]



function setInput(str){
    mainInput.innerText = str
}

let inputlog = []

var ilid = 0

mainInput.addEventListener("keydown",(e)=>{
    if(e.key=="Enter" && !e.shiftKey){
        txt = mainInput.innerText
        mainInput.innerText = ""

        while(txt[txt.length-1]==="\n"){
            txt=txt.slice(0, -1)
        }

        inputlog.push(txt)
        log(txt)
        if(txt==="\n"){console.log("hey did you just press enter?")}
        processInput(txt)
        e.preventDefault()
        ilid = 0
    }
    if(e.shiftKey || mainInput.innerText === ""){
        if(e.key === "ArrowUp"){
            ilid += 1
            mainInput.innerText = inputlog[inputlog.length-ilid]
        } else if(e.key === "ArrowDown"){
            ilid -= 1
            if(ilid<1){ilid=1}
            mainInput.innerText = inputlog[inputlog.length-ilid]
        }
    }
})



function processAuto(arr){
    arr.forEach((e)=>{
        processInput(e)
    })
}

























