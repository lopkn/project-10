arr = ["a","b"]
ranarr = (a)=>{return(a[Math.floor(Math.random()*a.length)])}
clickOn = (x)=>{x=document.getElementById(x);if(x){x.click}}
setInterval(()=>{
    a = ranarr(arr)
    clickOn("multiple-choice-"+a)
    clickOn("multiple-answer-"+a)
    document.querySelector("button.primary.rounded-button").click()
},5000)
