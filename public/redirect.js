

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
} else {
  console.log(a)
}