{
var enabled = true

function checkAns(){
document.querySelector('[title="檢查答??果。"]').click()
}

function h(x){
    if(!enabled){return}
    if(!document.querySelector('[title="檢查答??果。"]')){return}
    checkAns()
}

document.querySelectorAll("input[type='text']").forEach((e)=>{
    e.addEventListener("input",h)
})


document.addEventListener("keydown",(e)=>{
    if(e.key=="Enter" && enabled){
        f(e)
    } else {
        // checkAns()
    }
})

var lastIn;
var f=(e)=>{
    if(e.target.matches("input[type='text']")){
        e.target.parentElement.parentElement.querySelector("a[title='預覽']").click()
        lastIn = e.target
    } else {
        document.querySelector("button.btn.btn-primary.btn-default[data-dismiss='modal']").click()
        lastIn.focus()
    }
}



console.log("LopknMOBext100 loaded")
}




