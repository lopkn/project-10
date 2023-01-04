let camera, scene, renderer, controls, mesh, light, plane;



class gw{


  static idC = 0

  static gbk = []

  static boarder = 0

  static idcr(){
    this.idC += 1
    return(this.idC)
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
      this.boarder += 2
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4, 1+Math.random()*30+this.boarder*0.01, 1+Math.random()*4),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += 11 + Math.random()*50
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

  static spinX = 0
  static spinZ = 0
  // static lpos = {"x":-5,"y":15,"z":7}

   static update(){

    gw.pdate()

    if(this.spinX > 0.03){
      this.spinX = 0.03
    }
    if(this.spinZ > 0.03){
      this.spinZ = 0.03
    }
    if(this.spinX < -0.03){
      this.spinX = -0.03
    }
    if(this.spinZ < -0.03){
      this.spinZ = -0.03
    }

    camera.rotateX(this.spinX)
    camera.rotateZ(this.spinZ)

    this.spinX *= 1/(this.vel*0.5+1)
    this.spinZ *= 1/(this.vel*0.5+1)

    let lpos = {"x":camera.position.x,"y":camera.position.y,"z":camera.position.z}
    camera.translateZ(-c.vel)


    while(plane.position.z - camera.position.z < 200){
      plane.translateY(-0.01)
      if(Math.random()>0.9999){
        break;
      }
    }

    this.vel += Math.sqrt(Math.abs((lpos.y-camera.position.y)))/1500
    if(lpos.y-camera.position.y < 0){
      this.vel -= Math.sqrt(Math.abs((lpos.y-camera.position.y)))/750
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


    light.position.x = camera.position.x
    light.position.y = camera.position.y
    light.position.z = camera.position.z

    document.getElementById("info").innerHTML = "velocity: " + Math.floor(this.vel*1000)
    // console.log(this.lpos.y,camera.position.y)
  }

}


const createWorld = () => {
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff9999 })
  );

  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000),new THREE.MeshStandardMaterial({ color: 0x222222 }))
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

document.addEventListener("mousedown",(e)=>{
  mesh.rotateY(0.4);
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
      keysHeld[k] = ()=>{c.spinX += 0.0005*cont}
      break;
    case "d":
      keysHeld[k] = ()=>{c.spinZ -= 0.0005*cont}
      break;
    case "a":
      keysHeld[k] = ()=>{c.spinZ += 0.0005*cont}
      break;
    case "s":
      keysHeld[k] = ()=>{c.spinX -= 0.0005*cont}
      break;
    case "ArrowUp":
      keysHeld[k] = ()=>{c.vel+=0.001}
      break;
    case "ArrowDown":
      keysHeld[k] = ()=>{c.vel*=0.999}
      break;
    // case "t":
    //   keysHeld[k] = ()=>{plane.translateY(-0.5)}
    //   break;

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
  scene.background = new THREE.Color(0x333333);

  light = new THREE.PointLight(0xffffcc, 2.5, 1000, 1.5)
  // light.castShadow = true

  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  
  createWorld();
}

const animate = () => {
  requestAnimationFrame(animate);
  
  // controls.update();

  renderer.render(scene, camera); 

  c.update()
}

init();
animate();