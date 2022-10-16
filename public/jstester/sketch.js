let div = document.createElement("div")
div.style.border = "3px solid rgb("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+")"
div.innerHTML = "testing <br> testing"
console.log(div)
document.body.appendChild(div)
div = document.createElement("div")
div.id = "hi"
div.style.display = "inline-block"
div.style.border = "3px solid rgb("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+")"
div.innerHTML = "testing <br> testing"
div.onclick = ()=>{console.log("hi")}
div.style.zIndex = "40"
console.log(div)
document.body.appendChild(div)