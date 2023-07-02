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
  } else if(key === "t"){
    let newTag = tagify(prompt("random shuffle tag?"))

    if(manager.tagsAll[newTag] !== undefined && manager.tagsAll[newTag].length > 0){
      manager.currentTag = newTag
    } else {
      alert("no tags named that")
    }
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

  export(){
    
  }

}


class manager{


  static currentCard = 1;
  static currentlyFlipped = false
  static currentTag = "@all@"
  static idCount = 0;

  static editing = false;
  static editingStyle = "Text"

  static giveId(){
    this.idCount++;
    return(this.idCount)
  }


  static cardsAll = {

  }

  static newCard(q,ans,atags){
    let newCard = new card(q,ans)
    let tags = []
    if(atags !== undefined){
    atags.forEach((e)=>{
      tags.push(tagify(e))
    })} 
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
    this.editing = true
  }


  static createTextbox(x,y){
    let inp = document.createElement("text")
    inp.style.left = Math.floor(x)+"px"
    inp.style.top = Math.floor(y)+"px"
    inp.style.position = "absolute"
    inp.style.zIndex = 5;
    inp.style.backgroundColor = "rgba(0,255,0,0.2)";
    inp.style.color = "white";
    inp.style.fontSize = "20px";
    inp.style.borderColor = "rgb(0,0,255,0.2)"; 
    inp.id = "input"

    //inp. on pressed enter = ()=>{
    // this.createTextboxEnd(inp)
    //}

    document.body.appendChild(inp)
    //focus on inp



  }

  static createTextboxEnd(inp){

    new T(inp.value)


    inp.remove()
  }

  //option list stack. Get values, redbackground with an incorrect value.
  //link values to eval???

}


function tagify(str){
  if(str[0] !== "@"){
    str = "@" + str
  }
  if(str[str.length-1] !== "@"){
    str = str + "@"
  }
  return(str)
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



// manager.newCard("how to test for carboxylic acid (COOH)?","Add Na2CO3. Organic salt is formed and gas bubbles appear",["@chem@"])
// manager.newCard("how to test for alcohol?"," 1. add NA metal (gas bubbles)\n 2. add PCl5 (fumes)\n 3. add acid (fruity smell)",["@chem@"])
// manager.newCard("how to test for ketones?","2,4-DNP. Orange percipitate is formed",["@chem@"])
// manager.newCard("how to test for aldehydes?","tollens reagent. Silver mirror is formed on surface",["@chem@"])



// manager.newCard("trend of solubility of HYDROXIDE and SULFATE down group 2","Hydroxides: more soluable down\nSulfates: less soluable down (small big rule)",["@chem@"])
// manager.newCard("Flame colors: Li, Na, K, Rb, Cs, Cu, Pb\nCa, Sr, Ba","red, yellow, lilac, red, blue, blueGreen!, lame grey\nbrickRead, crimson red, green",["@chem@"])//seperate please
// manager.newCard("Halogens reactivity down the group Increases or decreases?","increases",["@chem@"])



// manager.newCard("PLUS C WHEN INTEGRATING","REMEMBER TO PLUS C",["@math@"])
// manager.newCard("what is log a (x) in terms of log b ()?","log b (x) / log b (a)",["@math@"])
// manager.newCard("definition of segment of circle? whats the area of a segment?","segment = the semicircle\narea = 0.5 * r^2 * sin(angle)")





// manager.newCard("pV = nRT; unit of v?","m^3, (remember that T is in kelvin",["@chem@"])
// manager.newCard("steps to write ionic equations?","1. keep all elements that are not aqueous\n2. get charge of each atom\n3. cancel out useless elements",["@chem@"])
// manager.newCard("Mass spectrometer uses ___ field to accelerate\nand ____ field to deflect ions","electric field, magnetic field",["@chem@"])
// manager.newCard("explain first and second abnormally low IE","new orbital, opposite spin in P orbital",["@chem@"])
// manager.newCard("name all chemical bonding structures","Giant metallic, Giant covalent, Giant ionic, Simple molecular",["@chem@"])
// manager.newCard("Trend of IE across Period and Group","Period: Increase of effective nuclear charge\nGroup: Decrease because radius increase",["@chem@"])
// manager.newCard("Cation is + or -?","-; Cats die.",["@chem@"])
// manager.newCard("polarising power means","FOR CATION. increases with higher charge or smaller size.\nMore easily distort the bond",["@chem@"])
// manager.newCard("covalent bonding definition","electrostatic attraction between two nuclei and shared pairs of electrons",["@chem@"])
// manager.newCard("electronegativity definition","ability of an atom to attract bonding electrons",["@chem@"])
// manager.newCard("whats inbetween 'ionic bond' and 'covalent bond'","polar covalent bond",["@chem@"])
// manager.newCard("true or false dipole is from + to -","true",["@chem@"])
// manager.newCard("Molecule shapes from 2 bonds to 6 bonds","linear, trigonal planar, tetrahedral 109.5, bipyramidal 120-90\noctahedral 90",["@chem@"])
// manager.newCard("each pair of lone electrons decreases bond angle by","2-2.5",["@chem@"])
// manager.newCard("Boiling point for metal increase or decrease down a group","decrease",["@chem@"])
// manager.newCard("Hazard vs risk","Hazards have different risks. Same hazard: is acidic, different risks: can die or can burn",["@chem@"])
// manager.newCard("formula for acid rain","2NO + O2 - > 2NO2; H2O + NO2 -> HNO3 + HNO2",["@chem@"])
// manager.newCard("SO2 pollutant is formed in atmosphere by","impurities of burning coal; power station",["@chem@"])
// manager.newCard("CH4 + Cl2 (free radical sub) -> ","CH3Cl + HCl",["@chem@"])
// manager.newCard("Structural isomerism means","same molecular formula \n(chain, position, functional group[ketone <-> aldehydes])",["@chem@"])
// manager.newCard("Geometrical isomerism means","Cis trans. Cis == E, trans == Z",["@chem@"])
// manager.newCard("Alkene + bromine test. Qualitative or quantitative?","qualitative",["@chem@","@bio@"])
// manager.newCard("Major or minor product is determined by","Major: Hydrogen is connected to the carbon with lowest carbocation",["@chem@"])
// manager.newCard("State standard condition","100kPa, 298K, 1 mol",["@chem@"])//?
// manager.newCard("Enthalpy diagram Up or down is exothermic?","down",["@chem@"])//may delete for easy
// manager.newCard("Standard enthalpy change of FORMATION and ATOMIZATION","",["@chem@"])// NO ANSWER YET
// manager.newCard("Note: bond enthalpy is only in gasses form","Note: water has a lower density because the LATTICE is inefficient at packing",["@chem@"])//note
// manager.newCard("Name all intermolecular forces","London forces (includes instantaneous & induced dipoles)\npermanent dipole\nhydrogen bonds",["@chem@"])
// manager.newCard("Cr2O72- oxidation number equation","2x + 7(-2) = -2",["@chem@"])
// manager.newCard("Oxidation number and Electron number trend During OXIDATION","increase, decrease (opposite for reduction)",["@chem@"])
// manager.newCard("Cl2 + NaOH -> (balance and complete)","Cl2 + 2NaOH -> NaCl + NaOCl + H2O",["@chem@"])
// manager.newCard("Metals and Halogens are generally reducing or oxidizing agents?","metal: reducing agent\nhalogen: oxidizing agent",["@chem@"])
// manager.newCard("IONIC HALF EQUATIONS steps","1. Get reactants and product; 2. add Water to balance oxygen\n3. balance H+ from water; 4: balance charge with electrons",["@chem@"])// memorise products
// manager.newCard("Trend of reactivity of group 1","increase down the group, larger size: easier to lose electron",["@chem@"])
// manager.newCard("Metal oxide + water ->","metal hydroxide",["@chem@"])
// manager.newCard("Metal + water ->","metal oxide + H2",["@chem@"])



// manager.newCard("Group 1(cept lithium) and 2 thermal stability trend of NO3","",["@chem@"])//





manager.newCard("what is standard enthalpy change of lattice","energy forming 1 mol of solid ionic compound",["@chem@"])
manager.newCard("what is first electron affinity energy","the energy of gaseous ion formed by adding 1 mol electrons",["@chem@"])
manager.newCard("whats the outter layer of virus","capsid",["@bio@"])
manager.newCard("","",["@bio@"])
manager.newCard("","",["@chem@"])
manager.newCard("","",["@chem@"])
manager.newCard("","",["@chem@"])



/// ====== new questions area


// plant and respiration electron cycles
// why use lambdavirus/how is it special
// whats the difference between retrovirus & rnavirus?


/// end of new questions area




//cannot form hydrogen bond: insoluble



// add soluability table
// thermal decomposition 
// Add questions for cycles 1 and 2


//electrode test. KMno4 to which side?

//research chlorine 9:6:1

//whats quantum shell
//hazard warning 
//revise the 3 way hesses law crossing out equational thingy


//nucleophile vs electrophile
//nucleophilic must have lone pair

//that fuel table


//CH4 + Cl -> HCl only? or H2

//positive inductive effect?



//when to use Cis or E
//cis trans: only 1 different
//E-Z: all 4 different 



//test for equations Carbonates, sulfates, ammoniuk








// Backpack >>>


// [
// Laptop
// Ipad
// Airpods
// ]
// CHARGING CABLES



// GIP >>>

// Mom memorial photo album

// clothes
// DOCUMENTS (TO DO)
//passport
//cup
//android pad
//calculator
//calculator cable

// Grades
// awards


// To Do >>>
// Sticks

// Copy for reference letter
// socks shoes


// SPEND the money

// Google takeout
// Minecraft download worlds
// Onenote export





















// 3/7

// Every aud

// Rank 1-n ()






