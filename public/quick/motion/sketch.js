let D = (window.innerWidth>window.innerHeight?window.innerHeight:window.innerWidth)-100

let myCanvas = document.getElementById("myCanvas")

  myCanvas.width = Math.floor(D)
  myCanvas.height = Math.floor(D)
  myCanvas.style.width = Math.floor(D+50)+"px"
  myCanvas.style.height = Math.floor(D+50)+"px"
  myCanvas.style.top = "0px"
  myCanvas.style.left = "0px"

let ctx = document.getElementById("myCanvas").getContext("2d")
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
document.addEventListener("keydown",(e)=>{
  if(e.key == "u"){
    unDo()
  }
})

// if (window.DeviceOrientationEvent) {
//     window.addEventListener("deviceorientation", function () {
//         tilt([event.beta, event.gamma]);
//     }, true);
// } else if (window.DeviceMotionEvent) {
//     window.addEventListener('devicemotion', function () {
//         tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
//     }, true);
// } else {
//     window.addEventListener("MozOrientation", function () {
//         tilt([orientation.x * 50, orientation.y * 50]);
//     }, true);
// }
// if(window.DeviceMotionEvent){
// DeviceMotionEvent.requestPermission().then(response => {
//         if (response == 'granted'){
//           window.addEventListener('devicemotion', (e)=>{
//             tilt(e)
//           })
//         }})
// }

// document.getElementById("accelPermsButton").onclick = (e)=>{
//   startaccel(e)
// }

// function startaccel(F){
//   // if(window.DeviceMotionEvent){
// DeviceMotionEvent.requestPermission().then(response => {
//         if (response == 'granted'){
//           window.addEventListener('devicemotion', (e)=>{
//             tilt(e)
//           })
//         }
//       })
// // }
// F.clientX = 2
// console.log(F.isTrusted)
// }

function getAccel(){
  try{DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
          window.addEventListener('deviceorientation',(e) => {})
        } else {
          console.log(response)
          console.log("hey")
        }

      })} catch{
    window.addEventListener('deviceorientation',(e) => {console.log(e)})
    window.addEventListener('devicemotion',(e) => {console.log(e)})
  }
}


function tilt(x){
  console.log(x)
  document.getElementById("text").innerHTML = JSON.stringify(x)
}

// const acl = new Accelerometer({ frequency: 60 });
// acl.addEventListener("reading", () => {
//   document.getElementById("text").innerHTML = (`Acceleration along the X-axis ${acl.x}`);
//   document.getElementById("text").innerHTML=(`Acceleration along the Y-axis ${acl.y}`);
//   document.getElementById("text").innerHTML=(`Acceleration along the Z-axis ${acl.z}`);
// });

// acl.start();