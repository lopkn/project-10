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

  // static bder = [{"b":0,"mult":1,"gbk":[],"lim":-6},{"b":0,"mult":0.2,"gbk":[],"lim":20000}]

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
    scene.remove(scene.getObjectById(n))
  } 


  static pdate(d){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      while(camera.position.z+c.vel*5 > this.boarder - 800){
      this.boarder += 1+c.vel*0.005+Math.sqrt(this.boarder/1000)
      if(c.vel < 0.007){
        this.boarder += 0.5
      }
      let h = 1+Math.random()*30+this.boarder*0.01
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*13*Math.random()+this.boarder*0.001, h, 1+Math.random()*4+c.vel*13*Math.random()+this.boarder*0.001),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += this.GPC(mesh3.position.z)+h/2
      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        while(this.gbk.length > 1000){
          this.rmObj(this.gbk[0])
          this.gbk.splice(0,1)
        }
      }
    }
    }
  }

  static pdate2(){

    this.bder.forEach((BDER)=>{

      let B = 0;

    if(camera.position.z+c.vel*5 > BDER.b - 800){
      while(camera.position.z+c.vel*5 > BDER.b - 800){

        if(camera.position.z > BDER.lim){
      BDER.b += 1+c.vel*0.005+Math.sqrt(BDER.b/1000)
      B = BDER.b-BDER.lim
    } else {
        BDER.b += (1+c.vel*0.005+Math.sqrt(BDER.b/1000))+5
        B = 1
        // console.log("HIH?")
      }
      if(c.vel < 0.007){
        BDER.b += 0.5
        B += 0.5
      }
      let h = 1+Math.random()*30+B*0.01
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*13*Math.random()+B*0.001, h, 1+Math.random()*4+c.vel*13*Math.random()+B*0.001),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x
      mesh3.position.z += 12 + BDER.b
      mesh3.position.y += this.GPC(mesh3.position.z)+h/2

      BDER.gbk.push(mesh3.id)
      if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        while(BDER.gbk.length > 1300){
          this.rmObj(BDER.gbk[0])
          BDER.gbk.splice(0,1)
        }
      }
    }
    }
  })



  }

  static pdate3s = [new GEN1(),new GEN2(),new GEN2(10000),new GEN2(60000),new GEN2(40000),new GEN2(80000),new GEN2(120000),new GEN3(40000), new GEN4(), new GEN5(), new GEN7()]

  static pdate3(){
    this.pdate3s.forEach((e)=>{e.update()})
  }

  // static pd3Clense(){
  //   this.pdate3s.forEach((e)=>{
  //     e.gbk.forEach((A)=>{
  //       if()
  //     })
  //   })
  // }

  static CLENSE(z){
    let clarr = []
    scene.children.forEach((e)=>{
      if(e.position.z +z < camera.position.z){
        clarr.push(e.id)
      }
    })

    clarr.forEach((e)=>{
      this.rmObj(e)
    })
  }


}

class c{
  static vel = 0.004

  static thirdPerson = true

  static thirdPersonBack = 0.5

  static throttle = 1

  static spinX = 0
  static spinZ = 0

  static boost = 100

  static rotX = 0
  static rotZ = 0

  // static lpos = {"x":-5,"y":15,"z":7}
  static clenseCounter = 0

   static update(){

    this.clenseCounter++
    if(this.clenseCounter > 500){
      gw.CLENSE(200)
      this.clenseCounter=0
    }

    gw.pdate3()

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

    this.spinX *= 1/(this.vel*0.12+1.002)
    this.spinZ *= 1/(this.vel*0.12+1.002)

    let lpos = {"x":camera.position.x,"y":camera.position.y,"z":camera.position.z}
    camera.translateZ(-c.vel)
    if(camera.position.y < camera.position.z*gw.SLslope){
      camera.position.y += 0.01
      this.vel *= 0.95
    }


    plane.position.z = camera.position.z
    plane.position.x = camera.position.x
    plane.position.y = gw.GPC(camera.position.z)

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

    scene.fog.color = scene.background

    if(this.vel > 2){
      let tv = this.vel -2
      scene.background.b -= tv*15
      scene.background.g -= tv*10
      scene.background.r -= tv
    } else if(camera.position.y-gw.GPC(camera.position.z)>60){if(this.vel>0.3){
      this.vel /= (Math.sqrt(camera.position.y-gw.GPC(camera.position.z)-60)*0.00006+1)
    } else {
      this.vel /= (Math.sqrt(camera.position.y-gw.GPC(camera.position.z)-60)*0.00003+1)
    }}


    light.position.x = camera.position.x
    light.position.y = camera.position.y+0.4
    light.position.z = camera.position.z-0.2

    light.intensity = Math.sqrt(this.vel)*4
    if(light.intensity > 5){
      light.intensity = 5
    }
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

    document.getElementById("info").innerHTML = "velocity: " + Math.floor(this.vel*1000) + "</br>preformance: "+ dateLogger[2]+"</br>boost: "+ Math.floor(c.boost)+"</br>height: "+Math.floor((camera.position.y-gw.GPC(camera.position.z))*100)
    let cc = (255-this.vel*155)<0?0:(255-this.vel*155)
    document.getElementById("info").style.color = "rgb(255,"+cc+","+cc+")"
    // console.log(this.lpos.y,camera.position.y)

    c.boost += 0.4/(camera.position.y-gw.GPC(camera.position.z))
    if(c.boost > 100){
      c.boost = 100
    }


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

  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1500, 1500),new THREE.MeshStandardMaterial({ color: 0x12401e }))
  plane.rotateX(-1.2)
  plane.name = "plane"
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
    c.spinX += -0.0005*c.vel*3*ovn[1]*c.throttle;c.vel/=(1+c.throttle*0.0001)
    c.spinZ -= 0.0005*c.vel*3*ovn[0]*c.throttle
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
      keysHeld[k] = ()=>{c.spinX += 0.0005*c.vel*3*c.throttle;c.vel/=(1+c.throttle*0.0001)}
      break;
    case "d":
      keysHeld[k] = ()=>{c.spinZ -= 0.0005*c.vel*3*c.throttle}
      break;
    case "a":
      keysHeld[k] = ()=>{c.spinZ += 0.0005*c.vel*3*c.throttle}
      break;
    case "s":
      keysHeld[k] = ()=>{c.spinX -= 0.0005*c.vel*3*c.throttle;c.vel/=(1+c.throttle*0.0001)}
      break;
    case "i":
      keysHeld[k] = ()=>{if(c.thirdPerson){c.rotX -= 0.005}else{c.rotX += 0.005}}
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
      keysHeld[k] = ()=>{if(c.thirdPerson){c.rotX += 0.005}else{c.rotX -= 0.005}}
      break;
    case "p":
      c.rotX = 0
      c.rotZ = 0
      break;

    case "1":
      c.throttle = 1
      break;
    case "2":
      c.throttle = 0.75
      break;
    case "3":
      c.throttle = 0.5
      break;
    case "4":
      c.throttle = 0.25
      break;
    case "ArrowUp":
      if(e.shiftKey){
        
        keysHeld[k] = ()=>{if(c.boost > 0.1){c.boost-=0.1;c.vel+=0.005}}
      }else{
      keysHeld[k] = ()=>{if(c.boost > 0.02){c.boost-=0.02;c.vel+=0.001}}}
      break;
    case "ArrowDown":
      keysHeld[k] = ()=>{c.vel*=0.999}
      break;

    case "t":
      c.thirdPerson = !c.thirdPerson
      break;

    case "o":
      keysHeld[k] = ()=>{c.thirdPersonBack += 0.001}
      break;
    case "u":
      keysHeld[k] = ()=>{c.thirdPersonBack -= 0.001}
      break;


  }
})

document.addEventListener("wheel",(e)=>{
  // console.log(e.deltaY)
  // e.preventDefault()
  if(c.thirdPerson){
    c.thirdPersonBack += e.deltaY*0.005
  }
})

document.addEventListener("keyup",(e)=>{
  let k = e.key
  keysHeld[k] = ()=>{}
})


const init = () => {
  camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000.0);
  camera.position.set(0, 21, -5);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog("rgb(0,0,0)",300,500)
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

let LDATE = Date.now()
let dateLogger = [0,0,0]


let animate = () => {
  requestAnimationFrame(animate);
  
  let r = LDATE
  LDATE = Date.now()

  if(LDATE-r > 300){
    animate = ()=>{console.log("too slow")}
  }

  dateLogger[0] += 1
  dateLogger[1] += (LDATE-r)
  if(dateLogger[0] > 100){
    // dateLogger[2] = dateLogger[1]-1
    dateLogger = [0,0,dateLogger[1]]
  }

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