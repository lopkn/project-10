let camera, scene, renderer, controls, mesh, light, plane, person, wing1, wing2;

let myCanvas = document.getElementById("myCanvas")

let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"



class gw{

  static SLconst = 1.2
  static SLang = Math.PI/2-this.SLconst
  static SLslope = -Math.tan(this.SLang)

  static idC = 0

  static gbk = []

  static boarder = 0

  static idcr(){
    this.idC += 1
    return(this.idC)
  }

  static GPC(z){
    return(z*this.SLslope)
  }

  static adbx(w,h,l,px,py,pz){
    let mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(w,h,l),
    new THREE.MeshStandardMaterial({ color: 0xffff00 }))
    mesh3.position.x += px
    mesh3.position.y += py
    mesh3.position.z += pz
    mesh3.name = this.idcr()
    scene.add(mesh3)
  }

  static rmObj(n){
    scene.remove(scene.getObjectByName(n))
  } 


  static pdate(d){
    if(camera.position.z > this.boarder - 400){
      this.boarder += 2+c.vel*0.25
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*3*Math.random(), 1+Math.random()*30+this.boarder*0.01, 1+Math.random()*4+c.vel*3*Math.random()),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += 11 + Math.random()*c.vel*2000+Math.random()*20
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y -= mesh3.position.z * 0.385 - 1
      mesh3.name = gw.idcr() + ""
      this.gbk.push(this.idC)
      if(mesh3.position.x < 100){
      scene.add(mesh3)

        if(this.gbk.length > 300){
          this.rmObj(this.gbk[0])
          this.gbk.splice(0,1)
        }
      }
    }
  }


}

class c{
  static vel = 0.004

  static thirdPerson = true

  static thirdPersonBack = 0.5

  static spinX = 0
  static spinZ = 0

  static rotX = 0
  static rotZ = 0

  // static lpos = {"x":-5,"y":15,"z":7}

   static update(){

    gw.pdate()

    if(this.spinX > 0.03){
      this.spinX = 0.03
    }
    if(this.spinZ > 3){
      this.spinZ = 3
    }
    if(this.spinX < -0.03){
      this.spinX = -0.03
    }
    if(this.spinZ < -3){
      this.spinZ = -3
    }

    camera.rotateX(this.spinX)
    camera.rotateZ(this.spinZ)

    this.spinX *= 1/(this.vel*0.2+1.002)
    this.spinZ *= 1/(this.vel*0.2+1.002)

    let lpos = {"x":camera.position.x,"y":camera.position.y,"z":camera.position.z}
    camera.translateZ(-c.vel)
    if(camera.position.y < camera.position.z*gw.SLslope){
      camera.position.y += 0.01
      this.vel *= 0.95
    }


    plane.position.z = camera.position.z-200
    plane.position.y = gw.GPC(camera.position.z-200)

    this.vel += Math.sqrt(Math.abs((lpos.y-camera.position.y)))/1500
    if(lpos.y-camera.position.y < 0){
      this.vel -= Math.sqrt(Math.abs((lpos.y-camera.position.y)))/725
    }

    if(this.vel < 0){
      this.vel = 0.0000001
    }
    // if(this.vel > 1){
    //   this.vel *= 1/(this.vel*0.001+1)
    // }
    if(this.vel > 0.3){
      this.vel *= 0.3/(this.vel*0.0001+0.3)
    }


    scene.background.b = this.vel
    scene.background.r = this.vel*0.5
    scene.background.g = this.vel*0.5


    light.position.x = camera.position.x
    light.position.y = camera.position.y+0.4
    light.position.z = camera.position.z-0.2
    if(this.thirdPerson){
      person.position.x = camera.position.x
      person.position.y = camera.position.y
      person.position.z = camera.position.z

      person.rotation.x = camera.rotation.x
      person.rotation.y = camera.rotation.y
      person.rotation.z = camera.rotation.z

      wing1.position.x = camera.position.x
      wing1.position.y = camera.position.y
      wing1.position.z = camera.position.z

      wing1.rotation.x = camera.rotation.x
      wing1.rotation.y = camera.rotation.y
      wing1.rotation.z = camera.rotation.z

      wing1.translateX(0.18)
      wing1.rotateY(-0.2)

      wing2.position.x = camera.position.x
      wing2.position.y = camera.position.y
      wing2.position.z = camera.position.z

      wing2.rotation.x = camera.rotation.x
      wing2.rotation.y = camera.rotation.y
      wing2.rotation.z = camera.rotation.z

      wing2.translateX(-0.18)
      wing2.rotateY(0.2)
    }

    document.getElementById("info").innerHTML = "velocity: " + Math.floor(this.vel*1000)
    // console.log(this.lpos.y,camera.position.y)
  }

}
let mouseX = 0
let mouseY = 0

onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}

const createWorld = () => {
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff9999 })
  );

  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000),new THREE.MeshStandardMaterial({ color: 0x12401e }))
  plane.rotateX(-1.2)
  scene.add(plane)

  
  scene.add(mesh);
  scene.add(new THREE.Mesh(
    new THREE.BoxGeometry(2, 5, 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff })))


  let mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(4, 5, 4),
    new THREE.MeshStandardMaterial({ color: 0xffffff }))

  mesh2.position.x += 7

  // for(let i = 0; i < 20; i++){
  // let mesh3 = new THREE.Mesh(
  //   new THREE.BoxGeometry(1+Math.random()*2, 1+Math.random()*5, 1+Math.random()*2),
  //   new THREE.MeshStandardMaterial({ color: 0xffff00 }))
  // mesh3.position.x += i*1.5 + 8
  // mesh3.position.y += Math.random()*9
  // mesh3.name = gw.idcr()
  // scene.add(mesh3)
  // }

  // for(let i = 0; i < 20; i++){
  // let mesh3 = new THREE.Mesh(
  //   new THREE.BoxGeometry(1+Math.random()*4, 1+Math.random()*10, 1+Math.random()*4),
  //   new THREE.MeshStandardMaterial({ color: 0xffff00 }))
  // mesh3.position.x += 11
  // mesh3.position.y -= Math.random()*9
  // mesh3.position.z += 12 + i*4.5
  // mesh3.name = gw.idcr()
  // scene.add(mesh3)
  // }

  // for(let i = 0; i < 200; i++){
  // let mesh3 = new THREE.Mesh(
  //   new THREE.BoxGeometry(1+Math.random()*4, 1+Math.random()*30, 1+Math.random()*4),
  //   new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
  // mesh3.position.x += 11 + Math.random()*100
  // mesh3.position.y -= Math.random()*19
  // mesh3.position.z += 12 + Math.random()*100
  // mesh3.name = gw.idcr()
  // scene.add(mesh3)
  // }
  let mat1 = new THREE.MeshStandardMaterial({ color:  "rgb(255,255,0)"})
  mat1.opacity = 0.6
  mat1.depthWrite = false
  mat1.transparent = true
  person = new THREE.Mesh(
      new THREE.BoxGeometry(0.1,0.1,0.2),
      mat1
      )
  scene.add(person)

  wing1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3,0.05,0.15),
      mat1
      )
  scene.add(wing1)

  wing2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3,0.05,0.15),
      mat1
      )
  scene.add(wing2)

  for(let i = 0; i < 400; i++){
    let r = Math.sqrt(100000)-Math.sqrt(Math.random()*100000)
  let mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(1+Math.random()*r*0.13, 1+Math.random()*30+r, 1+Math.random()*r*0.13),
    new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
  mesh3.position.x += 11 + Math.random()*10*r
  mesh3.position.z += 12 + 4*r
  mesh3.position.y -= mesh3.position.z * 0.22 - 1
  mesh3.name = gw.idcr()
  if(mesh3.position.x < 100){
  scene.add(mesh3)}
  }

  for(let i = 0; i < 200; i++){
    let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,4),
      new THREE.MeshStandardMaterial({ color:  0xff0000})
      )
    mesh3.rotateX(0.37)
    mesh3.translateZ(i*8)
    mesh3.position.y += 0.5
  scene.add(mesh3)
  }


  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2,23,2));
const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
scene.add( line );

  mesh2.position.x += 7

  scene.add(mesh2)
  
  camera.lookAt(mesh.position);
  camera.fov = 120;
  camera.updateProjectionMatrix();

};

class vectorFuncs{
  static vectorizor(px,py,vx,vy){
    //this.walls[p.boidy[k]].x1 = ((p.boidyVect[k][0] * p.rotation[1] + p.boidyVect[k][1] * p.rotation[0]) + p.x)
    //xb+ya,yb-xa
    return([px*vy+py*vx,py*vy-px*vx])
  }
  static INvectorizor(px,py,vx,vy){
    //xb-ya,yb+xa
    return([px*vy-py*vx,py*vy+px*vx])
  }
  static ShatterComponents(vx,vy,dx,dy){
    let normalized = this.originVectorNormalize(dx,dy)
    let invectorized = this.INvectorizor(vx,vy,normalized[0],normalized[1])

    let tyaxis = this.vectorizor(normalized[0],normalized[1],1,0)

    let resultx = [invectorized[1]*normalized[0],invectorized[1]*normalized[1]]
    let resulty = [invectorized[0]*tyaxis[0],invectorized[0]*tyaxis[1]]
    return([resultx,resulty,[invectorized[1],invectorized[0]]])

  }

  static ShComp(vx,vy,dx,dy){
    let normalized = this.originVectorNormalize(dx,dy)

    let dp = this.dotProduct(vx,vy,normalized[0],normalized[1])

    let n2 = [normalized[1],-normalized[0]]

    let dp2 = this.dotProduct(vx,vy,n2[0],n2[1])
    let resultx = [normalized[0]*dp,normalized[1]*dp]
    let resulty = [n2[0]*dp2,n2[1]*dp2]

    return([resultx,resulty,[dp,dp2]])

  }

  static dotProduct(x1,y1,x2,y2){
    return(x1*x2+y1*y2)
  }

  static originVectorNormalize(vx,vy){
    let d = Math.sqrt(vx*vx+vy*vy)
    return([vx/d,vy/d])
  }
}

document.addEventListener("mousedown",(e)=>{
  mesh.rotateY(0.4);
  keysHeld["mdl"] = ()=>{
    let ovn = vectorFuncs.originVectorNormalize(mouseX-Width/2,mouseY-Height/2)
    c.spinX += -0.0005*c.vel*3*ovn[1];c.vel*=0.9999
    c.spinZ -= 0.0005*c.vel*3*ovn[0]
  }
})

document.addEventListener("mouseup",(e)=>{
  keysHeld["mdl"] = ()=>{}
})

var keysHeld = {}

setInterval(()=>{
  let objk = Object.keys(keysHeld)
  objk.forEach((e)=>{
    keysHeld[e]()
  },100)
})




document.addEventListener("keydown",(e)=>{
  let k = e.key
  let cont = c.vel*5
  console.log(k)
  switch(k){
    case "w":
      keysHeld[k] = ()=>{c.spinX += 0.0005*c.vel*3;c.vel*=0.9999}
      break;
    case "d":
      keysHeld[k] = ()=>{c.spinZ -= 0.0005*c.vel*3}
      break;
    case "a":
      keysHeld[k] = ()=>{c.spinZ += 0.0005*c.vel*3}
      break;
    case "s":
      keysHeld[k] = ()=>{c.spinX -= 0.0005*c.vel*3;c.vel*=0.9999}
      break;
    case "i":
      keysHeld[k] = ()=>{c.rotX += 0.005}
      break;
    case "l":
    case "ArrowRight":
      keysHeld[k] = ()=>{
        if(c.thirdPerson){c.rotZ += 0.005}else{c.rotZ -= 0.005}}
      break;
    case "j":
    case "ArrowLeft":
      keysHeld[k] = ()=>{
        if(c.thirdPerson){c.rotZ -= 0.005}else{c.rotZ += 0.005}}
      break;
    case "k":
      keysHeld[k] = ()=>{c.rotX -= 0.005}
      break;
    case "o":
      c.rotX = 0
      c.rotZ = 0
      break;
    case "ArrowUp":
      keysHeld[k] = ()=>{c.vel+=0.001}
      break;
    case "ArrowDown":
      keysHeld[k] = ()=>{c.vel*=0.999}
      break;

    case "t":
      c.thirdPerson = !c.thirdPerson


  }
})

document.addEventListener("wheel",(e)=>{
  // console.log(e.deltaY)
  e.preventDefault()
  if(c.thirdPerson){
    c.thirdPersonBack += e.deltaY*0.005
  }
})

document.addEventListener("keyup",(e)=>{
  let k = e.key
  keysHeld[k] = ()=>{}
})


const init = () => {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000.0);
  camera.position.set(0, 21, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(51,51,51)");

  light = new THREE.PointLight(0xffffcc, 2.5, 1000, 1.5)
  // light.castShadow = true

  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true , canvas: myCanvas});
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.domElement.disabled = "true"
  renderer.domElement.style.userSelect = "none"
  renderer.domElement.style.touchAction = "none"
  //disabled="true" style = "z-index: 1;touch-action: none; user-select: none;-webkit-user-select: none;-moz-user-select: none;

  document.body.appendChild(renderer.domElement);
  
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  createWorld();
}

const animate = () => {
  requestAnimationFrame(animate);
  
  // controls.update();

  camera.rotateX(c.rotX)
  camera.rotateY(c.rotZ)

  if(c.thirdPerson){
    camera.translateZ(c.thirdPersonBack)
  }

  renderer.render(scene, camera); 
  
  if(c.thirdPerson){
    camera.translateZ(-c.thirdPersonBack)
  }

  camera.rotateY(-c.rotZ)

  camera.rotateX(-c.rotX)

  c.update()
}
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


    // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //                screenX, screenY, clientX, clientY, ctrlKey, 
    //                altKey, shiftKey, metaKey, button, relatedTarget);




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
function init2() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", (e)=>{myh(e);touchHandler(e)}, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
    // document.addEventListener('touchmove', function() { e.preventDefault();GI.debuggingInfo = "cancled" }, { passive:false });
}
init2()


init();
animate();