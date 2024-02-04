function d(){
document.querySelectorAll("div.CharmBracelet")[0].style.backgroundColor = "#014589"
document.querySelectorAll("div.PlayerModeContainer--header")[0].style.backgroundColor = "#014589"
document.querySelectorAll("div.PlayerModeContainer--header")[0].style.border = "0px"
document.querySelectorAll("div.PlayerModeContainer")[0].style.backgroundColor = "black"
document.querySelector("div.lrn-region.lrn-top-right-region").style.backgroundColor="#014589"
document.body.style.backgroundColor="black"
document.body.style.height="130vh"
document.querySelector("input#lrn_access-contrast-3-1").click()
document.querySelector("button.lrn_btn_blue").click()
}
d()

document.body.addEventListener("keydown",(e)=>{if(e.key=="\\"){d();console.log("HLM")}})