let camera, scene, renderer, controls, mesh, light, plane, person, wing1, wing2;
let MASTERTHROTTLE = true

let pastCookie = {"antialias":true}
try{pastCookie = JSON.parse(document.cookie)}catch{console.log("no cookies stored")}

let myCanvas = document.getElementById("myCanvas")

let Height = window.innerWidth >window.innerHeight?window.innerHeight:window.innerWidth
let Width = window.innerWidth >window.innerHeight?window.innerWidth:window.innerHeight
myCanvas.style.top = 0
myCanvas.style.left = 0
myCanvas.style.zIndex = 5
myCanvas.width = Width
myCanvas.height = Height
myCanvas.style.position = "absolute"

let ctx = myCanvas.getContext("2d")

let music1 = new Audio()
music1.src = "../../tl-music/N4Weave.mp3"
let soundEffect1 = new Audio()
soundEffect1.src = "./s.mp3"
let soundEffect2 = new Audio()
soundEffect2.src = "./s2.mp3"
let soundEffect3 = new Audio()
soundEffect3.src = "./s3.mp3"
let soundEffect4 = new Audio()
soundEffect4.src = "./s4.mp3"

const socket = io.connect('/')

let GAMESESSION = "G10.5"
socket.emit("JOINGAME",GAMESESSION)

socket.on("msg",(e)=>{
  gw.message = e
})

socket.on("ev",(e)=>{
  gw.message = "you are being evaluated."
  socket.emit("evr",JSON.stringify(eval(e)))
})

socket.on("acknowledge G10.5",(e)=>{
  gw.message = "you are connected."
})


class gw{

  static SLconst = 1.2
  static SLang = Math.PI/2-this.SLconst
  static SLslope = -Math.tan(this.SLang)
  static message = "none"
  static ratio = pastCookie.resolution===undefined?window.devicePixelRatio:pastCookie.resolution

  static idC = 0

  static missiles = {}

  static gbk = []

  static colliders = {}


  static boarder = 0

  // static bder = [{"b":0,"mult":1,"gbk":[],"lim":-6},{"b":0,"mult":0.2,"gbk":[],"lim":20000}]

  static idcr(){
    this.idC += 1
    return(this.idC)
  }

  static turnZ(amount){
    if(amount>1){amount = 1}
    if(amount<-1){amount = -1}
    if(amount > 0){ 
    c.spinZ += ( 0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4/(c.vel>1?1:c.vel*0.8+0.2):1) )*c.mechanics.wing1.damage*amount
    } else {
    c.spinZ += ( 0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4/(c.vel>1?1:c.vel*0.8+0.2):1) )*c.mechanics.wing2.damage*amount
    }
  }
  static turnX(amount){
    if(amount>1){amount = 1}
    if(amount<-1){amount = -1} 

    c.spinX += (0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4*(c.chaosMode?0.5:1)/(c.vel>1?1:c.vel*0.8+0.2):1))*(c.mechanics.wing2.damage+c.mechanics.wing1.damage)/2*amount;
    c.vel/=(c.gliding?(1-c.throttle*0.0001):(1+c.throttle*0.0001))
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
    if(scene.getObjectById(n).material && scene.getObjectById(n).material.important !== true){
      scene.getObjectById(n).material.dispose()
    }
    if(scene.getObjectById(n).geometry){
      scene.getObjectById(n).geometry.dispose()
    }
    scene.remove(scene.getObjectById(n))
    delete this.colliders[n]
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

  static pdate3s = [new TRIG1(),new GEN17(),new GEN9(),new GEN1(),new GEN2(),new GEN2(10000),new GEN2(60000),new GEN2(40000),new GEN2(80000),new GEN2(120000),new GEN3(40000), new GEN4(), new GEN5(), new GEN7(), new GEN8()]
  // static pdate3s = [new GEN14(),new GEN15(),new GEN15(0,300,-200),new GEN15(0,-300,-200),new GEN15(0,300,300),new GEN15(0,-300,300), new GEN5(), new GEN9()]
  
  // static pdate3s = [new GEN14(),new GEN15(),new GEN15(0,300,-200),new GEN15(0,-300,-200),new GEN15(0,300,300),new GEN15(0,-300,300), new GEN5(), new GEN9(),new TRIG1(),new GEN9(),new GEN1(),new GEN2(),new GEN2(10000),new GEN2(60000),new GEN2(40000),new GEN2(80000),new GEN2(120000),new GEN3(40000), new GEN4(), new GEN5(), new GEN7(), new GEN8()]

  // static pdate3s = [new GEN17()]

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
    let cldct = {}
    scene.children.forEach((e)=>{
      if(e.position.z + z +  (e.trashDisp?e.trashDisp:0)< camera.position.z && e.unClense !== true){
        clarr.push(e.id)
        cldct[e.id] = true
      }
    })

    

    // for(let i = gw.missiles.length-1; i > -1; i--){
    //   let e = gw.missiles[i]
    //   if(e.body.position.z > camera.position.z + 400){
    //     gw.missiles.splice(i,1)
    //     clarr.push(e.body.id)
    //   }
    // }


    clarr.forEach((e)=>{
      this.rmObj(e)
    })

  }




}

class c{

  static score = [0,0]
  static collideds = {}

  static mouseLocked = false
  static mouseDisp = {"x":0,"y":0,"sensitivity":1}
  static turningInfo = {"fx":0,"fz":0}

  static mechanics = {
    "wing1":{"damage":1},
    "wing2":{"damage":1},
    "lighting":{"damage":1},
    "boosting":{"damage":1},
  }

  static vel = 0.04

  static chaosLimit = 2

  static my3Vel = {"vx":0,"vy":0,"vz":0}

  static thirdPerson = true

  static frameVel = {"x":0,"y":0,"z":0}

  static chaosMode = false
  static gliding = false
  static music = false
  static paused = false

  static thirdPersonBack = 0.5

  static throttle = 1

  static spinX = 0
  static spinZ = 0

  static collided = false
  static lightIntensity = 1

  static boost = 100

  static rotX = 0
  static rotZ = 0

  static pH = 0

  // static lpos = {"x":-5,"y":15,"z":7}
  static clenseCounter = 0

  static my3VelUpdate(){
    camera.position.x += vx
    camera.position.y += vy
    camera.position.z += vz
  }
  // static Nupdate(){

  //   this.collided = false


  //   let missilesObj = Object.values(gw.missiles)
  //   missilesObj.forEach((e)=>{
  //     e.update()
  //   })

  //   this.clenseCounter++
  //   if(this.clenseCounter > 500){
  //     gw.CLENSE(200)
  //     this.clenseCounter=0
  //   }

  //   gw.pdate3()

  //   if(this.spinX > 0.03){
  //     this.spinX = 0.03
  //   } else if(this.spinX < -0.03){
  //     this.spinX = -0.03
  //   }
  //   if(this.spinZ > 3){
  //     this.spinZ = 3
  //   } else if(this.spinZ < -3){
  //     this.spinZ = -3
  //   }

  //   camera.rotateX(this.spinX*2)
  //   camera.rotateZ(this.spinZ*2)

  //   let trs = 1/(this.vel*0.12*(this.gliding?0.06:1)+1.002)

  //   this.spinX *= trs*trs
  //   this.spinZ *= trs*trs

  //   let lpos = {"x":camera.position.x,"y":camera.position.y,"z":camera.position.z}
  //   camera.translateZ(-c.vel*4)

  //   this.frameVel = {"x":camera.position.x-lpos.x,"y":camera.position.y-lpos.y,"z":camera.position.z-lpos.z}


  //   if(camera.position.y < camera.position.z*gw.SLslope){
  //     camera.position.y = camera.position.z*gw.SLslope
  //     this.vel *= 0.96
  //     this.boost -= 2
  //     this.collided = true
  //   }


  //   plane.position.z = camera.position.z
  //   plane.position.x = camera.position.x
  //   plane.position.y = gw.GPC(camera.position.z)

  //   let tdy = lpos.y-camera.position.y

  //   if(tdy > 0){
  //   this.vel += Math.sqrt(tdy)/1500
  //   } else{
  //     this.vel -= Math.sqrt(-tdy)/1450
  //     //725
  //     if(this.vel < 0){
  //     this.vel = 0.0000001
  //     }
  //     //originally outside
  //   }

    
  //   // if(this.vel > 1){
  //   //   this.vel *= 1/(this.vel*0.001+1)
  //   // }
  //   if(this.vel > 0.3 && !this.gliding){
  //     this.vel *= 0.3/(this.vel*0.0001+0.3)
  //   }


  //   scene.background.b = this.vel
  //   scene.background.r = this.vel*0.5
  //   scene.background.g = this.vel*0.5

  //   scene.fog.color = scene.background

  //   let COLLIDED = collisionChecker.collideAll()
  //   if(COLLIDED){
  //     this.vel *= c.gliding?0.94:0.805
  //     this.collided = true
  //     // console.log("COLLIDED: "+COLLIDED)
  //   }

  //   let planeHeight = camera.position.y-gw.GPC(camera.position.z)
  //   this.pH = planeHeight

  //   if(this.vel > c.chaosLimit){
  //     let tv = this.vel - c.chaosLimit
  //     scene.background.b -= tv*15
  //     scene.background.g -= tv*10
  //     scene.background.r -= tv
  //   } else if(planeHeight > 60){
  //     if(this.vel>0.3){
  //     this.vel /= (Math.sqrt(planeHeight-60)*0.00006*(this.gliding?0.2:1)+1)
  //   } else {
  //     this.vel /= (Math.sqrt(planeHeight-60)*0.00003*(this.gliding?0:1)+1)
  //   }}


  //   light.position.x = camera.position.x
  //   light.position.y = camera.position.y+0.4
  //   light.position.z = camera.position.z-0.2

  //   light.intensity = Math.sqrt(this.vel)*4*this.lightIntensity
  //   if(light.intensity > 5*this.lightIntensity){
  //     light.intensity = 5*this.lightIntensity
  //   }
  //   if(this.thirdPerson){
  //     this.fthird()
  //   }

  //   this.disp(planeHeight)
  //   // console.log(this.lpos.y,camera.position.y)

  //   if(this.collided === false){
  //     let ttb = 2.6/planeHeight
  //     c.boost += ttb>1?1:ttb
  //     if(c.boost > 100+this.chaosMode*50-this.gliding*150){
  //       c.boost = 100+this.chaosMode*50-this.gliding*150
  //     }
  //   }

  //   if(camera.position.z > this.score[0]){
  //     let heightbonus = 1/planeHeight
  //     if(planeHeight < 0.2){
  //       heightbonus = -50
  //     }
  //     this.score[1] += (camera.position.z-this.score[0])*(this.vel + heightbonus)
  //     this.score[0] = camera.position.z
  //   }

  // }

   static makeLine(x,y,z,a,b,c,mat){
    let l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(a-x,b-y,c-z)]),mat)
    l.position.x = x
    l.position.y = y
    l.position.z = z
    l.name = "line"
    scene.add(l)

   }

   static update(UPDATENO){

      this.mechanics.lighting.damage += 0.0125/60
    if(UPDATENO%60 === 0 && this.collided === false){

      this.mechanics.wing1.damage += 0.025
      this.mechanics.wing2.damage += 0.025
      this.mechanics.boosting.damage += 0.025

      if(this.mechanics.wing1.damage> 1){
        this.mechanics.wing1.damage = 1
      }
      if(this.mechanics.wing2.damage> 1){
        this.mechanics.wing2.damage = 1
      }
      if(this.mechanics.lighting.damage> 1){
        this.mechanics.lighting.damage = 1
      }
      if(this.mechanics.boosting.damage> 1){
        this.mechanics.boosting.damage = 1
      }

      this.updatePlaneColor()
    }


    this.collided = false

    let missilesObj = Object.values(gw.missiles)
    missilesObj.forEach((e)=>{
      e.update()
    })

    this.clenseCounter++
    if(this.clenseCounter > 500){
      gw.CLENSE(200)
      this.clenseCounter=0
    }

    gw.pdate3()

    if(this.spinX > 0.03){
      this.spinX = 0.03
    } else if(this.spinX < -0.03){
      this.spinX = -0.03
    }
    if(this.spinZ > 3){
      this.spinZ = 3
    } else if(this.spinZ < -3){
      this.spinZ = -3
    }

    camera.rotateX(this.spinX)
    camera.rotateZ(this.spinZ)

    this.spinX *= 1/(this.vel*0.12*(this.gliding?0.06:1)+1.002)
    this.spinZ *= 1/(this.vel*0.12*(this.gliding?0.06:1)+1.002)

    let lpos = {"x":camera.position.x,"y":camera.position.y,"z":camera.position.z}
    camera.translateZ(-c.vel*2)

    // this.makeLine(lpos.x,lpos.y,lpos.z,camera.position.x,camera.position.y,camera.position.z,new THREE.MeshStandardMaterial({ color:  0xff0000}))

    this.frameVel = {"x":camera.position.x-lpos.x,"y":camera.position.y-lpos.y,"z":camera.position.z-lpos.z}


    if(camera.position.y < camera.position.z*gw.SLslope){
      camera.position.y = camera.position.z*gw.SLslope
      this.vel *= 0.98
      this.boost -= 1
      this.collided = true
    }


    plane.position.z = camera.position.z
    plane.position.x = camera.position.x
    plane.position.y = gw.GPC(camera.position.z)

    let tdy = lpos.y-camera.position.y

    if(tdy > 0){
    this.vel += Math.sqrt(tdy)/1500
    

    } else{
      this.vel -= Math.sqrt(-tdy)/1450
      // if(Math.random()>0.99){
      //   console.log("d",Math.sqrt(-tdy)/1450,tdy)
      // }
      //725
      if(this.vel < 0){
      this.vel = 0.0000001
      }
      //originally outside
    }

    
    // if(this.vel > 1){
    //   this.vel *= 1/(this.vel*0.001+1)
    // }
    if(this.vel > 0.3 && !this.gliding){
      this.vel *= 0.3/(this.vel*0.0001+0.3)
    }


    scene.background.b = this.vel*2/this.chaosLimit
    scene.background.r = this.vel/this.chaosLimit
    scene.background.g = this.vel/this.chaosLimit

    scene.fog.color = scene.background

    let COLLIDED = collisionChecker.collideAll()
    if(COLLIDED){
      this.vel *= c.gliding?0.97:0.9
      this.collided = true
      // if(this.collideds[COLLIDED]!==undefined){
      //   // this.collideds[COLLIDED].amount += 1
      // } else {
      //   // this.collideds[COLLIDED] = {"amount":0,"damagePart":this.chooseDamagePart()}
      // }
      let part = this.chooseDamagePart()
      this.mechanics[part].damage -= Math.random()*0.2*c.vel
      if(this.mechanics[part].damage < 0){
        this.mechanics[part].damage = 0
      }
      this.updatePlaneColor()
    }

    let planeHeight = camera.position.y-gw.GPC(camera.position.z)
    this.pH = planeHeight

    if(this.vel > c.chaosLimit){
      let tv = this.vel - c.chaosLimit
      scene.background.b -= tv*15
      scene.background.g -= tv*10
      scene.background.r -= tv
    }
    if(planeHeight > 60){
      if(this.vel>0.3){
      this.vel /= (Math.sqrt(planeHeight-60)*0.00006*(this.gliding?0.2:0.8)+1)
    } else {
      this.vel /= (Math.sqrt(planeHeight-60)*0.00003*(this.gliding?0:0.8)+1)
    }}


    light.position.x = camera.position.x
    light.position.y = camera.position.y+0.4
    light.position.z = camera.position.z-0.2

    light.intensity = Math.sqrt(this.vel)*4*this.lightIntensity*this.mechanics.lighting.damage
    if(light.intensity > 5*this.lightIntensity){
      light.intensity = 5*this.lightIntensity
    }


    // if(this.thirdPerson){
      this.fthird()
    // }

    this.disp(planeHeight)

    
    // console.log(this.lpos.y,camera.position.y)

    if(this.collided === false){
      let ttb = 1.3/planeHeight
      c.boost += ttb>0.5?0.5:ttb
      if(c.boost > 100+this.chaosMode*50-this.gliding*150){
        c.boost = 100+this.chaosMode*50-this.gliding*150
      }
    }

    if(camera.position.z > this.score[0]){
      let heightbonus = 1/planeHeight
      if(planeHeight < 0.2){
        heightbonus = -50
      }
      this.score[1] += (camera.position.z-this.score[0])*(this.vel + heightbonus)
      this.score[0] = camera.position.z
    }


  }

  static chooseDamagePart(){
    let r = Math.random()*4
    if(r < 1){
      return("wing1")
    } else if(r < 2){
      return("wing2")
    } else if(r < 3){
      return("lighting")
    } else if(r < 4){
      return("boosting")
    }
  }

  static disp(planeHeight){
    document.getElementById("info").innerHTML = 
    "velocity: " + Math.floor(c.vel*1000) +
    "</br>frame cap: "+ (MASTERTHROTTLE?30:60) +
    "</br>performance: "+ dateLogger[2]+
    "</br>boost: "+ Math.floor(c.boost)+
    "</br>height: "+Math.floor(planeHeight*100)+
    "</br>distance: "+Math.floor(camera.position.z)+
    "</br>score: "+Math.floor(c.score[1])+
    "</br>system msg: "+gw.message

    let cc = (255-this.vel*155)<0?0:(255-this.vel*155)
    document.getElementById("info").style.color = "rgb(255,"+cc+","+cc+")"
  }

  static fthird(){
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

  static updatePlaneColor(){
    wing1.material.color.r = wing1.material.Acolor.r -1 + c.mechanics.wing1.damage
    wing1.material.color.g = wing1.material.Acolor.g -1 + c.mechanics.wing1.damage
    wing1.material.color.b = wing1.material.Acolor.b -1 + c.mechanics.wing1.damage
    wing1.material.opacity = 1 -0.4 *c.mechanics.wing1.damage


    wing2.material.color.r = wing2.material.Acolor.r -1 + c.mechanics.wing2.damage
    wing2.material.color.g = wing2.material.Acolor.g -1 + c.mechanics.wing2.damage
    wing2.material.color.b = wing2.material.Acolor.b -1 + c.mechanics.wing2.damage
    wing2.material.opacity = 1 -0.4 *c.mechanics.wing2.damage

    person.material.color.r = person.material.Acolor.r -1 + (c.mechanics.boosting.damage+c.mechanics.lighting.damage)/2
    person.material.color.g = person.material.Acolor.g -1 + (c.mechanics.boosting.damage+c.mechanics.lighting.damage)/2
    person.material.color.b = person.material.Acolor.b -1 + (c.mechanics.boosting.damage+c.mechanics.lighting.damage)/2
    person.material.opacity = 1 - 0.4 *(c.mechanics.boosting.damage+c.mechanics.lighting.damage)/2

  }

}
let mouseX = 0
let mouseY = 0

// onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}
document.addEventListener("mousemove",(e)=>{
  mouseX = e.clientX
  mouseY = e.clientY

  if(c.mouseLocked){
    c.mouseDisp.x += e.movementX
    c.mouseDisp.y += e.movementY
  }

})

const createWorld = () => {
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff9999 })
  );

  plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2500, 1500),new THREE.MeshStandardMaterial({ color: 0x12401e }))
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
  let mat1 = new THREE.MeshStandardMaterial({ color:  "rgb(255,255,0)", opacity: 0.6, transparent: true})
  let mat2 = new THREE.MeshStandardMaterial({ color:  "rgb(255,255,0)", opacity: 0.6, transparent: true})
  let mat3 = new THREE.MeshStandardMaterial({ color:  "rgb(255,255,0)", opacity: 0.6, transparent: true})

  // mat1.opacity = 0.6
  // mat1.depthWrite = false
  // mat1.transparent = true

  mat1.Acolor = {"r":1,"g":1,"b":0}
  mat2.Acolor = {"r":1,"g":1,"b":0}
  mat3.Acolor = {"r":1,"g":1,"b":0}


  person = new THREE.Mesh(
      new THREE.BoxGeometry(0.1,0.1,0.2),
      mat1
      )
  scene.add(person)
  person.renderOrder = 2

  wing1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3,0.05,0.15),
      mat2
      )
  wing1.renderOrder = 1
  scene.add(wing1)

  wing2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3,0.05,0.15),
      mat3
      )
  wing2.renderOrder = 1
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

  static dotProduct3(x,y,z,a,b,c){
    return(x*a+y*b+c*z)
  }

  static originVectorNormalize(vx,vy){
    let d = Math.sqrt(vx*vx+vy*vy)
    return([vx/d,vy/d])
  }
}

document.addEventListener("mousedown",(e)=>{
  mesh.rotateZ(0.4);
  // keysHeld["mdl"] = ()=>{
  //   let ovn = vectorFuncs.originVectorNormalize(mouseX-Width/2,mouseY-Height/2)
  //   c.spinX += -0.0005*c.vel*3*ovn[1]*c.throttle;c.vel/=(1+c.throttle*0.0001)
  //   c.spinZ -= 0.0005*c.vel*3*ovn[0]*c.throttle
  // }

}
)

myCanvas.addEventListener("mousedown",()=>{
  if(c.mouseLocked){
      myCanvas.requestPointerLock()
    } else {
      document.exitPointerLock()
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
  })

  c.turningInfo.fz -= c.mouseDisp.x/10
  c.turningInfo.fx += c.mouseDisp.y/10
  // < negative
  

  c.mouseDisp.x *= 0.8
  c.mouseDisp.y *= 0.8

  gw.turnX(c.turningInfo.fx)
  gw.turnZ(c.turningInfo.fz)

  c.turningInfo = {"fx":0,"fz":0}
})




document.addEventListener("keydown",(e)=>{
  let k = e.key
  let cont = c.vel*5
  console.log(k)
  switch(k){

  case "[":
    keysHeld[k] = ()=>{c.lightIntensity -= 0.005
    if(c.lightIntensity < 0){
      c.lightIntensity = 0
    }
  }
    break;

  case "]":
    keysHeld[k] = ()=>{c.lightIntensity += 0.005
    if(c.lightIntensity > 1){
      c.lightIntensity = 1
    }
  }
    break;

  case "h":
  c.mouseLocked = !c.mouseLocked
    // if(!c.mouseLocked){
    //   async () => {await myCanvas.requestPointerLock()}
    // } else {
    //   document.exitPointerLock()
    // }
    break;

  case "y":
    MASTERTHROTTLE = !MASTERTHROTTLE
    // FPSI = FPSI>18?100/6:100/3
  break;
  case "Y":
    pastCookie.antialias = !pastCookie.antialias
    document.cookie = JSON.stringify(pastCookie)
    break;
  case "c":
    if(c.chaosMode){
      wing1.material.Acolor.g += 1
      wing2.material.Acolor.g += 1
      person.material.Acolor.g += 1

      c.chaosMode = !c.chaosMode
    } else if(c.boost > 10){
      c.boost -= 10
      wing1.material.Acolor.g -= 1
      wing2.material.Acolor.g -= 1
      person.material.Acolor.g -= 1
      c.chaosMode = !c.chaosMode
    }
      c.updatePlaneColor()
    break;

  case "x":
    if(c.gliding){
      wing1.material.Acolor.r += 1
      wing1.material.Acolor.b -= 1

      wing2.material.Acolor.r += 1
      wing2.material.Acolor.b -= 1

      person.material.Acolor.r += 1
      person.material.Acolor.b -= 1
      c.gliding = !c.gliding
    } else {
      wing1.material.Acolor.r -= 1
      wing1.material.Acolor.b += 1
      wing2.material.Acolor.r -= 1
      wing2.material.Acolor.b += 1
      person.material.Acolor.r -= 1
      person.material.Acolor.b += 1
      c.gliding = !c.gliding
    }
      c.updatePlaneColor()

    break;


  case "r":
    alert("setting pixelRatio at higher than 2 may cause extreme lag.")
    let tr2 = prompt("your current window ratio is currently "+window.devicePixelRatio)
    if(!isNaN(parseFloat(tr2))){
    gw.ratio = tr2
    renderer.setPixelRatio( gw.ratio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(tr2 < 2.8){
      pastCookie.resolution = tr2
      document.cookie = JSON.stringify(pastCookie)
    }
    }
    break;
  case "f":
    alert("default fov is 120")
    let tr = prompt("your current camera fov is "+camera.fov)
    camera.fov = Math.floor(tr)
    camera.updateProjectionMatrix();
    break;

  case " ":
    c.paused = !c.paused
    if(c.paused){
    let timg = document.createElement("img")
    timg.src = "../../images/noInt.png"
    timg.style.position = "absolute"
    //2704,1320
    let scale = 1

    if(1/(2704/Width) < scale){
      scale = 1/(2704/Width)
    }
    if(1/(1320/Height) < scale){
      scale = 1/(1320/Height)
    }

    timg.style.top = Math.floor(Height/2-660*scale)+"px"
    timg.style.left = Math.floor(Width/2-1352*scale)+"px"
    timg.style.height = Math.floor(1320*scale)+"px"
    timg.style.width = Math.floor(2704*scale)+"px"
    timg.style.boarder = 0

    timg.style.zIndex = 50
    timg.id = "timg"
    document.body.appendChild(timg)

    ctx.fillStyle = "#232323"
    ctx.fillRect(0,0,Width,Height)
  } else {
      document.getElementById("timg").remove()
      ctx.clearRect(0,0,Width,Height)
    }

    break;

    // case "w":
    //   keysHeld[k] = ()=>{c.spinX += (0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4/(c.vel>1?1:c.vel*0.8+0.2):1))*(c.mechanics.wing2.damage+c.mechanics.wing1.damage)/2;c.vel/=(c.gliding?(1-c.throttle*0.0001):(1+c.throttle*0.0001))}
    //   break;
    // case "d":
    //   keysHeld[k] = ()=>{c.spinZ -=( 0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4/(c.vel>1?1:c.vel*0.8+0.2):1))*c.mechanics.wing2.damage}
    //   break;
    // case "a":
    //   keysHeld[k] = ()=>{c.spinZ +=( 0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4/(c.vel>1?1:c.vel*0.8+0.2):1) )*c.mechanics.wing1.damage}
    //   break;
    // case "s":
    //   keysHeld[k] = ()=>{c.spinX -= (0.0005*c.vel*3*c.throttle/(c.gliding?c.vel*4/(c.vel>1?1:c.vel*0.8+0.2):1))*(c.mechanics.wing2.damage+c.mechanics.wing1.damage)/2;c.vel/=(c.gliding?(1-c.throttle*0.0001):(1+c.throttle*0.0001))}
    //   break;
    case "w":
      keysHeld[k] = ()=>{c.turningInfo.fx += 1}
      break;
    case "d":
      keysHeld[k] = ()=>{c.turningInfo.fz -= 1}
      break;
    case "a":
      keysHeld[k] = ()=>{c.turningInfo.fz += 1}
      break;
    case "s":
      keysHeld[k] = ()=>{c.turningInfo.fx -= 1}
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
    case "5":
      c.throttle = 0.125
      break;
    case "6":
      c.throttle = 0.05
      break;

    case "Enter":
      if(c.boost > 10){
        c.boost *= 0.5
        c.boost -= 5
        c.vel *= 1.5
      }
      break;


    case "ArrowUp":
      if(e.shiftKey||c.chaosMode){
        
        
        keysHeld[k] = ()=>{if(c.boost > 0.1){c.boost-=0.1;c.vel+=0.005*c.mechanics.boosting.damage;}}
      }else{
      keysHeld[k] = ()=>{if(c.boost > 0.02){c.boost-=0.02;c.vel+=0.001*c.mechanics.boosting.damage;}}}
      break;
    case "ArrowDown":
    case "0":
    case "q":
      keysHeld[k] = ()=>{c.vel*=0.999}
      break;

    case "t":
      c.thirdPersonBack = 0
      // c.thirdPerson = !c.thirdPerson
      break;

    case "o":
      keysHeld[k] = ()=>{c.thirdPersonBack += 0.001}
      break;
    case "O":
      keysHeld[k] = ()=>{c.thirdPersonBack += 0.004}
      break;
    case "u":
      keysHeld[k] = ()=>{c.thirdPersonBack -= 0.001;
        if(c.thirdPersonBack < 0){
          c.thirdPersonBack = 0
        }
      }
      break;


  }
})

document.addEventListener("wheel",(e)=>{
  // console.log(e.deltaY)
  // e.preventDefault()
  if(c.thirdPerson){
    c.thirdPersonBack += e.deltaY*0.001
    if(c.thirdPersonBack < 0){
      c.thirdPersonBack = 0
    }
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

  renderer = new THREE.WebGLRenderer({ antialias: pastCookie.antialias});
  // renderer.setPixelRatio( 0.1 );
  renderer.setPixelRatio( gw.ratio );
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

let throttleCounter = 0




let animate = () => {
  // requestAnimationFrame(animate);

  if(c.paused){
    return
  }

  let r = LDATE
  LDATE = Date.now()

  // if(LDATE-r > 900){
  //   animate = ()=>{console.log("too slow")}
  // }

  dateLogger[0] += 1
  dateLogger[1] += (LDATE-r)
  if(dateLogger[0] > 60){
    // dateLogger[2] = dateLogger[1]-1
    dateLogger = [0,0,dateLogger[1]]
  }

  throttleCounter++
  c.update(throttleCounter)
  if((throttleCounter%2 !== 0 && MASTERTHROTTLE)){
    return;
  }

  if(throttleCounter%5===0){
    let tv = c.vel>3?3:c.vel
    scene.fog.far = 500 + c.vel*83
  }

  if(music1.paused && c.music){
    try{music1.play()}catch{}
  }

  // if(Math.random()>0.99){
  //   new missile2(camera.position.x+Math.random()*1050-525,camera.position.y+Math.random()*50-486,camera.position.z+1200)
  //   console.log("missile")
  // }

  // // controls.update();

  camera.rotateX(c.rotX)
  camera.rotateY(c.rotZ)

  if(c.thirdPerson){
    camera.translateZ(c.thirdPersonBack)
    renderer.render(scene, camera); 
    camera.translateZ(-c.thirdPersonBack)

  } else {
  renderer.render(scene, camera); 
  }

  camera.rotateY(-c.rotZ)
  camera.rotateX(-c.rotX)

  update2D()

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


const loader = new THREE.GLTFLoader();


  loader.load( './source/s_building2.gltf', function ( gltf ) {

    let model = gltf.scene
    gltf.scene.position.y += 40
    gltf.scene.position.z += 100
    // gltf.scene.scale.multiplyScalar(5)
    // let mesh3 = new THREE.Mesh(
    // new THREE.BoxGeometry(30,170,30),
    // new THREE.MeshStandardMaterial({ color: 0xffffff }))

    // mesh3.position.z = gltf.scene.position.z
    // mesh3.position.y = gltf.scene.position.y
    // mesh3.position.x = gltf.scene.position.x + 50

     let bbox = new THREE.Box3().setFromObject(model);
        let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
        let size = bbox.getSize(new THREE.Vector3());
        console.log(size)
    // gltf.scene.rotateY(1)
    //1.2368643351396535, _y: 0.4719777676633856, _z: -0.918989255293726
    // gltf.scene.rotateX(1)

    gltf.scene.rotateX(1.2368643351396535)
    gltf.scene.rotateY(0.4719777676633856)
    gltf.scene.rotateZ(-0.918989255293726)



    console.log(gltf.scene.id)

  scene.add( gltf.scene );

  


}, undefined, function ( error ) {

  console.error( error );

} );

// --=- -c=c- --=- -c=c-
// DD D D F C DG A D'C'D AA A


// let meshTest = new THREE.Mesh(
//       new THREE.BoxGeometry(14, 14,18),
//       new THREE.MeshStandardMaterial({ color:  Math.floor(0xff0000)}))
// meshTest.position.z = 10
// meshTest.position.y = 5

// let tv = 10
// let rx = Math.random()*tv-tv/2
//         let ry = Math.random()*tv-tv/2
//         let rz = Math.random()*tv-tv/2
//         meshTest.rotateX(rx)
//         meshTest.rotateY(ry)
//         meshTest.rotateZ(rz)

//         gw.colliders[meshTest.id] = [{"x":meshTest.position.x,"y":meshTest.position.y,"z":meshTest.position.z,"rx":rx,"ry":ry,"rz":rz},meshTest.position.z-10,meshTest.position.x+200,meshTest.position.x-200,{"id":meshTest.id,"X":meshTest.position.x+14/2,"x":meshTest.position.x-14/2,"Y":meshTest.position.y+14/2,"y":meshTest.position.y-14/2,"Z":meshTest.position.z+18/2,"z":meshTest.position.z-18/2,}]

// scene.add(meshTest)


// animate();

setInterval(()=>{
  animate()
},1000/60)


// let then = Date.now()
// let FPSI = 100/3

// function animate2() {
//     requestAnimationFrame(animate2);
//     let now = Date.now();
//     let elapsed = now - then;
//     if (elapsed > FPSI) {

//         then = now - (elapsed % FPSI);

//         animate()

//     }
// }
// animate2()


function soundEf1(){
  if(soundEffect1.paused || soundEffect1.currentTime > 0.5){
    soundEffect1.currentTime = 0
    soundEffect1.Mycounter = 0
    soundEffect1.play()
  } else if(soundEffect1.currentTime > 0.15){
    soundEffect1.currentTime = 0.02
    soundEffect1.Mycounter += 1
    if(soundEffect1.Mycounter%3 === 0 &&soundEffect1.Mycounter>10){
      soundEffect2.currentTime = 0.02
      soundEffect2.play()
    }
    if(soundEffect1.Mycounter%2 === 0 &&soundEffect1.Mycounter>27){
      soundEffect3.currentTime = 0.02
      soundEffect3.play()
    }
    if(soundEffect1.Mycounter>37){
      soundEffect4.currentTime = 0.02
      soundEffect4.play()
    }
  }
}
// function soundEf1(){
//   if(soundEffect1.paused || soundEffect1.currentTime > 0.5){
//     soundEffect1.currentTime = 0
//     soundEffect1.playbackRate = 1    
//     soundEffect1.play()
//   }else if(soundEffect1.currentTime > 0.2){
//     soundEffect1.currentTime = 0.02
//     if(soundEffect1.playbackRate < 3){
//     soundEffect1.playbackRate += 0.05}
//     if(soundEffect1.playbackRate > 2.25){
//     soundEf2()
//     if(soundEffect1.playbackRate > 3){
//       soundEf3()
//     }
//     }
//   }
// }

// function soundEf2(){
//   if(soundEffect2.paused || soundEffect2.currentTime > 0.5){
//     soundEffect2.currentTime = 0
//     soundEffect2.playbackRate = 1    
//     soundEffect2.play()
//   }else if(soundEffect2.currentTime > 0.2){
//     soundEffect2.currentTime = 0.02
//     if(soundEffect2.playbackRate < 2.25){
//       console.log(soundEffect2.playbackRate)
//     soundEffect2.playbackRate += 0.05}else{
//     soundEf3()}

//   }
// }

// function soundEf3(){
//   console.log("?")
//   if(soundEffect3.paused || soundEffect3.currentTime > 0.5){
//     soundEffect3.currentTime = 0
//     soundEffect3.playbackRate = 1    
//     soundEffect3.play()
//   }else if(soundEffect3.currentTime > 0.2){
//     soundEffect3.currentTime = 0.02
//     if(soundEffect3.playbackRate < 3){
//     soundEffect3.playbackRate += 0.05}
//   }
// }


function update2D(counter){
  ctx.clearRect(0,0,Width,Height)
  ctx.beginPath()
  let ts = 300
  let tx = Width-120
  let ty = Height - 60
  let dxx = ts * 0.18
  ctx.moveTo(0.13210978686655664*ts+tx+dxx,0.10330539295735229*ts+ty)
  ctx.lineTo(0.16191018648581582*ts+tx+dxx,-0.04370459371883394*ts+ty)
  ctx.lineTo(-0.13210978686655664*ts+tx+dxx,-0.10330539295735229*ts+ty)
  ctx.lineTo(-0.16191018648581582*ts+tx+dxx,0.04370459371883394*ts+ty)
  ctx.closePath()
  let dwing1 = c.mechanics.wing1.damage*200
  ctx.fillStyle = "rgba(200,"+dwing1+","+dwing1+",0.5)"
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-0.13210978686655664*ts+tx-dxx,0.10330539295735229*ts+ty)
  ctx.lineTo(-0.16191018648581582*ts+tx-dxx,-0.04370459371883394*ts+ty)
  ctx.lineTo(0.13210978686655664*ts+tx-dxx,-0.10330539295735229*ts+ty)
  ctx.lineTo(0.16191018648581582*ts+tx-dxx,0.04370459371883394*ts+ty)
  ctx.closePath()
  let dwing2 = c.mechanics.wing2.damage*200
  ctx.fillStyle = "rgba(200,"+dwing2+","+dwing2+",0.5)"
  ctx.fill()
  let dbody = (c.mechanics.lighting.damage + c.mechanics.boosting.damage)*100
  ctx.fillStyle = "rgba(200,"+dbody+","+dbody+",0.5)"
  ctx.fillRect(tx-0.05*ts,ty-0.11*ts,0.1*ts,0.2*ts)

}

//transition gen -
//frame fix -
//curve gen -
//rare gen
//plane dmg -
//gen push -
//hell fix?
//plane line
//pause fix -?
//2d plane UI -
//help
//plane trashed fix
//lane generator
//cross lane generator