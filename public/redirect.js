

function loadScript(src){
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}

let a = window.prompt("Which game are you going to?","press enter when done!")

if(a == 0){
  loadScript("sentenceProcess.js")
  loadScript("sketch.js")
} else if(a == 1){
  loadScript("OG1.js")
} else if(a == 2){
  loadScript("ceator/creator.js")
} else {
  alert("not found!")
  window.location.href = "/home"
  console.log(a)
}