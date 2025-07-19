


// function s(str,t=0){
//     if(t!==0){setTimeout(()=>{s(str)},t);return;}
//     fetch('http://localhost:3000/send', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'text/plain',
//         },
//         body: str,
//     })
//     .then(response => response.text())
//     .then(data => {
//         console.log(data);
//     })
// }

var exposed = []

{
//lopkns query briefs

class lquery{
    constructor(str){

        this.qstring = str
        this.ans = document.querySelectorAll(str)

        // this.store = []

    }

    qfem(f){ // query for each match
        let newans = []
        this.ans.forEach((e)=>{
            if(f(e)){newans.push(e)}
        })
        if(newans.length === 0){console.log("none found");return(this)}

        console.log("shortened from "+this.ans.length+" to "+newans.length)

        this.ans = newans
        return(this)
    }

    qclass(str){
        this.qfem((e)=>{return(e.classList.includes(str))})
        return(this)
    }

    qtext(str=this.text){
        // if(str === undefined){str = this.text}
        this.qfem((e)=>{return(e.innerText&&e.innerText.includes(str))})
        return(this)
    }




}

function q(...stuff){
    return(new lquery(...stuff))
}



//lopkns query briefs










var lastElement;

document.addEventListener("click",(e)=>{

    if(e.shiftKey){
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

    }


    lastElement = e.target;

    let sqwery = pqueryify(lastElement)
    console.log(sqwery)

    let qwer = q(sqwery)

    if(qwer.ans.length != 1){
        console.log("COULDNT QUERY:" + qwer.ans.length)
        console.log("ATTEMPTING TO QUERY TEXT")

        qwer.text = lastElement.innerText
        console.log(qwer.text)
        qwer.qtext()
        if(qwer.ans.length != 1){
            console.log("COULDNT QUERY:" + qwer.ans.length)
            exposed.push(qwer)
        }


    }
},true)



// find the "type" of the element


// let classlist = element.classList

// function(l){get string query of classlist}



function queryify(elm){
    let qstring = elm.tagName.toLowerCase()

    elm.classList.forEach((e)=>{
        qstring += "."+e
    })
    return(qstring)
}


function pqueryify(elm,n=3){ //parent queryify

    let oelm = elm
    let ostring = queryify(oelm)

    while(elm.parentElement && n>0){
        n--
        let telm = elm.parentElement
        ostring = queryify(telm)+" "+ostring
        elm = telm
    }
    console.log(elm)
    return(ostring)
}




document.addEventListener("keydown",(e)=>{
    if(e.key=="x" && e.shiftKey){
        chrome.runtime.sendMessage({type:'newWindow',msg:str})
    }
})



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request)
    if (request.type === 'msg') {
        console.log(request.msg); // Handle the message here
    }
    if(request.type === "evil"){
        console.log(eval(request.msg))
    }
});





}



// window.s = s

console.log("lopkn SK110 loaded")



