function rotate(roll, pitch, yaw, point) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

        var px = point.x;
        var py = point.y;
        var pz = point.z;

        point.x = Axx*px + Axy*py + Axz*pz;
        point.y = Ayx*px + Ayy*py + Ayz*pz;
        point.z = Azx*px + Azy*py + Azz*pz;
    
    return(point)
}


function dist3(x,y,z,a,b,c){
  let i = a-x
  let o = b-y
  let p = c-z
  return(Math.sqrt(i*i+o*o+p*p))
}

function posSet(t,x,y,z){
  t.position.x = x
  t.position.y = y
  t.position.z = z
}

class collisionChecker{

  //["none",Z,X,x,{X,x,Y,y,Z,z}]

  static colCheck(box,point){

    if(box.X > point.x && box.x < point.x){
      if(box.Y > point.y && box.y < point.y){
        if(box.Z > point.z && box.z < point.z){
          return(box.id)
       }
      }
    }

    return(false)
  }

  static fastColcheck(Z,X,x,dict,point){

    if(point.z > Z){
      if(point.x < X && point.x > x){
        return(this.colCheck(dict,point))
      }
    }

    return(false)
  }

  static collideAll(){
    let ans = false
    let colarr = Object.keys(gw.colliders)
    colarr.forEach((E)=>{
      let e = gw.colliders[E]
      if(e[0] === "none"){
        // let tans = this.fastColcheck(e[1],e[2],e[3],e[4],camera.position)
        let tans = this.colCheck(e[4],camera.position)
      if(tans){
        ans = tans
      }
      } else if(e[0] === "special"){

        let r = e[1](e[2])
        if(r){
          ans = r
        }

      } else {
         let pt = {"x":camera.position.x-e[0].x,"y":camera.position.y-e[0].y,"z":camera.position.z-e[0].z}
         rotate(-e[0].rx,0,0,pt)
         rotate(0,-e[0].ry,0,pt)
         rotate(0,0,-e[0].rz,pt)


         // let r = this.fastColcheck(e[1],e[2],e[3],e[4],{"x":e[0].x+pt.x,"y":e[0].y+pt.y,"z":e[0].z+pt.z})
        let r = this.colCheck(e[4],{"x":e[0].x+pt.x,"y":e[0].y+pt.y,"z":e[0].z+pt.z})
         if(r){
          ans = r
         }

      }
    })
    return(ans)
  }

}



class missile{
  constructor(x,y,z){
    this.body = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,3),
      new THREE.MeshStandardMaterial({ color:  0xff0000}))
    this.body.position.x = x
    this.body.position.y = y
    this.body.position.z = z
    this.body.name = "missile"
    this.body.unClense = true

    this.cX = (Math.random()*25-1.25)*c.vel
    this.cY = (Math.random()*25-1.25)*c.vel
    this.cZ = (Math.random()*25-1.25)*c.vel

    this.cP = 30+Math.random()*45


    scene.add(this.body)

    this.myVel = {"vx":0,"vy":0,"vz":0}

    gw.missiles[this.body.id] = this

    this.counter = 0

  }

  lookA(){
    this.body.lookAt(this.body.position.x+this.myVel.vx,this.body.position.y+this.myVel.vy,this.body.position.z+this.myVel.vz)
  }

  updateVel(){

    let d = dist3(camera.position.x,camera.position.y,camera.position.z,this.body.position.x,this.body.position.y,this.body.position.z)

    // let vm = c.vel>1?c.vel:1
    let vm = 1

    if(d < 15){
      this.explode()
    }

    if(this.body.position.z > camera.position.z+c.frameVel.z*this.cP-10){

    this.myVel.vx += (camera.position.x+this.cX+c.frameVel.x*this.cP - this.body.position.x)*0.08/d
    this.myVel.vy += (camera.position.y+this.cZ+c.frameVel.y*this.cP - this.body.position.y)*0.08/d-0.002
    // if(this.myVel.vz < c.vel*3 || (c.vel < 0.5&&this.myVel.vz < 1.5)){
    this.myVel.vz += (camera.position.z+this.cZ+c.frameVel.z*this.cP - this.body.position.z)*0.08/d
    // }
    this.myVel.vx *= 0.90
    this.myVel.vy *= 0.90
    this.myVel.vz *= 0.90
  }


    


    this.body.position.x+=this.myVel.vx
    this.body.position.y+=this.myVel.vy
    this.body.position.z+=this.myVel.vz

    // if(this.body.position.z > camera.position.z + 400){
    //   this.del()
    // }
  }

  update(){
    this.counter ++
    if(this.counter%5 === 0 && this.body.position.z > camera.position.z-4){
      this.lookA()
    }
      this.updateVel()
  }

  explode(){
    // c.my3Vel.y += 0.5
    c.vel *= 0.9
    this.del()
  }

  del(){
    let id = this.body.id
    gw.rmObj(id)
    delete gw.missiles[id]
  }
}

class missile2{
  constructor(x,y,z,post){
    this.body = new THREE.Mesh(
      new THREE.BoxGeometry(2,2,6),
      new THREE.MeshStandardMaterial({ color:  0xff0000}))
    this.body.position.x = x
    this.body.position.y = y
    this.body.position.z = z
    this.body.name = "missile"
    this.body.unClense = true
    let rr = Math.random()*12+5
    if(post === undefined){
    GENV2_1.gen(x,y,z,rr)
    GENV2_2.gen(x,y,z,rr/2)}
    this.lastpos = [x,y,z]


    scene.add(this.body)

    let aimx = camera.position.x + 400*c.frameVel.x + Math.random()*420*c.frameVel.x
    let aimy = camera.position.y + 60*c.frameVel.y + Math.random()*120*c.frameVel.y
    let aimz = camera.position.z + 60*c.frameVel.z + Math.random()*120*c.frameVel.z


    let d = dist3(aimx,aimy,aimz,this.body.position.x,this.body.position.y,this.body.position.z)
    let dx = this.body.position.x-aimx
    let dz = this.body.position.z-aimz
    let dy = this.body.position.y-aimy
    this.myVel = {"vx":-dx/d,"vy":-dy/d,"vz":-dz/d}

    gw.missiles[this.body.id] = this

    this.counter = 0

  }

  lookA(){
    this.body.lookAt(this.body.position.x+this.myVel.vx,this.body.position.y+this.myVel.vy,this.body.position.z+this.myVel.vz)
  }

  updateVel(){

    let d = dist3(camera.position.x,camera.position.y,camera.position.z,this.body.position.x,this.body.position.y,this.body.position.z)

    let vm = 1

    if(d < 15){
      this.explode()
    }

    // this.myVel.vx += (this.myVel.vx-c.frameVel.x)*0.7
    // this.myVel.vy += (this.myVel.vy-c.frameVel.y)*0.7
    // this.myVel.vz += (this.myVel.vz-c.frameVel.z)*0.7
    this.myVel.vx *= 1.01
    this.myVel.vy *= 1.01
    this.myVel.vz *= 1.01

    


    this.body.position.x+=this.myVel.vx
    this.body.position.y+=this.myVel.vy
    this.body.position.z+=this.myVel.vz

    if(this.body.position.z < camera.position.z - 100 || this.body.position.z > camera.position.z + 1200){
      this.del()
    }
  }

  update(){
    this.counter ++
    if(this.counter%5 === 0 && this.body.position.z > camera.position.z-4){
      this.lookA()
      // if(this.counter%10 === 0){
        let mat = new THREE.LineBasicMaterial({ color:  "rgb(0,"+(this.counter)+",0)", linewidth: 4, opacity:(this.counter/150), transparent:true})
        c.makeLine(this.lastpos[0],this.lastpos[1],this.lastpos[2],this.body.position.x,this.body.position.y,this.body.position.z,mat)
        this.lastpos = [this.body.position.x,this.body.position.y,this.body.position.z]
      // }
    }
      this.updateVel()
  }

  explode(){
    // c.my3Vel.y += 0.5
    c.vel *= 0.9
    this.del()
  }

  del(){
    let id = this.body.id
    gw.rmObj(id)
    delete gw.missiles[id]
  }
}


class GEN1{

  constructor(b){
    this.boarder = b?b:0
    this.bk = b?b:0
    this.name = "GEN1"
    this.gbk = []
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      if(c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        this.boarder-=tv
      }

      let breaker = 0

      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 1")
          break;
        }
      let abk = this.boarder - this.bk
      this.boarder += 1+c.vel*0.005+abk/3000
      if(c.vel < 0.007){
        this.boarder += 0.5
      }


      let h = 1+Math.random()*30+abk*0.01
      let w = 1+Math.random()*4+c.vel*13*Math.random()+abk*0.001
      let l = 1+Math.random()*4+c.vel*13*Math.random()+abk*0.001
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h,l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x
      if(mesh3.position.x > 1000+camera.position.x && mesh3.position.x < -1000+camera.position.x){
        return;
      }
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2


      if(c.vel > c.chaosLimit || c.chaosMode){
        let tv = c.vel-c.chaosLimit+c.chaosMode*2
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.position.y -= tv+h/9
        mesh3.name = "GEN1"

        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l/2,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
      }
      // mesh3.name = gw.idcr() + ""
      // this.gbk.push(mesh3.id)
      scene.add(mesh3)
    }
    }
  }

}


class GEN2{

  constructor(dx,boarder){
    this.boarder = boarder?boarder:0
    this.name = "GEN2"
    this.gbk = []
    this.dx = dx?dx:20000
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 2")
          break;
        }
        let B = 1
      if(this.boarder > this.dx){
        B = this.boarder-this.dx+1
        this.boarder += 1+c.vel*0.005+(this.boarder-this.dx)/4000
      } else {
        this.boarder += 5
      }

      
      if(c.vel < 0.007){
        this.boarder += 0.5
      }

      



      let h = 1+Math.random()*30+B*0.01

      let tx = Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x



      if(tx > 1000+camera.position.x || tx < -1000+camera.position.x){
        continue;
      }
      let w = 1+Math.random()*4+c.vel*13*Math.random()+B*0.001
      let l = 1+Math.random()*4+c.vel*13*Math.random()+B*0.001
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2

      if(c.vel > c.chaosLimit || c.chaosMode){
        let tv = c.vel-c.chaosLimit+c.chaosMode*2
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.name = "GEN2"

        mesh3.position.y -= tv+h/9
        
        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l-h,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
      }

      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        // while(this.gbk.length > 1000){
        //   gw.rmObj(this.gbk[0])
        //   this.gbk.splice(0,1)
        // }
      // }
    }

    }
  }

}

class GEN3{

  constructor(dx){
    this.boarder = 0
    this.gbk = []
    this.name = "GEN3"
    this.dx = dx?dx:20000
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 3")
          break;
        }
        let B = 1
      if(this.boarder > this.dx){
        B = this.boarder-this.dx+1
        this.boarder += 1+c.vel*0.005+this.boarder/1000
      } else {
        this.boarder += 5
      }

      
      if(c.vel < 0.007){
        this.boarder += 0.5
      }

      



      let h = 1+Math.random()*30+B*0.01

      let tx = Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x



      if(tx > 1000+camera.position.x || tx < -1000+camera.position.x){
        continue;
      }

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*13*Math.random()+B*0.001, h, 1+Math.random()*4+c.vel*13*Math.random()+B*0.001),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2
        mesh3.name = "GEN3"

      if(c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        mesh3.rotateX(Math.random()*tv-tv/2)
        mesh3.rotateY(Math.random()*tv-tv/2)
        mesh3.rotateZ(Math.random()*tv-tv/2)
        mesh3.position.y -= tv+h/9
      }

      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        // while(this.gbk.length > 1000){
        //   gw.rmObj(this.gbk[0])
        //   this.gbk.splice(0,1)
        // }
      // }
    }
    }
  }

}

class GEN4{
//stick
  constructor(dx){
    this.boarder = 0
    this.name = "GEN4"
    this.gbk = []
    this.dx = dx?dx:30000
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 4")
          break;
        }
        let B = 1
      if(this.boarder > this.dx){
        B = this.boarder-this.dx+1
        this.boarder += 1+c.vel*0.005+this.boarder/1000
      } else {
        this.boarder += 5
      }

      
      if(c.vel < 0.007){
        this.boarder += 0.5
      }

      



      let h = 1+Math.random()*30+B*0.015

      let tx = Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x



      if(tx > 1000+camera.position.x || tx < -1000+camera.position.x){
        continue;
      }

      let w = 1+Math.random()*4+c.vel*13*Math.random()+B*0.0001
      let l = 1+Math.random()*4+c.vel*13*Math.random()+B*0.0001
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2
        mesh3.name = "GEN4"


      if(c.chaosMode && c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.position.y -= tv+h/9
        // gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
    }

      // mesh3.name = gw.idcr() + ""
      // this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        // while(this.gbk.length > 1000){
        //   gw.rmObj(this.gbk[0])
        //   this.gbk.splice(0,1)
        // }
      // }
    }
    }
  }

}


class GEN5{
  //runway
  constructor(dx){
    this.boarder = 0
    this.name = "GEN5"

    this.gbk = []
    this.dx = dx?dx:500

    this.material = new THREE.MeshStandardMaterial({ color:  0xff0000})
    this.material.important = true
    this.material.emissive.r = 2
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 5")
          break;
        }
      this.boarder += 10

      let tx = Math.floor(camera.position.x/this.dx)*500

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,4),
      // new THREE.MeshStandardMaterial({ color:  0xff0000})
      this.material
      )
      mesh3.position.x += tx
      mesh3.position.z += this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+0.5
      mesh3.rotateX(0.37)
        mesh3.name = "GEN5"


      if(c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        mesh3.rotateY(Math.random()*tv-tv/2)
      }

      this.gbk.push(mesh3.id)
      scene.add(mesh3)

      tx += 500

      let mesh4 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,4),
      this.material
     )
      mesh4.position.x += tx
      mesh4.position.z += this.boarder
      mesh4.position.y += gw.GPC(mesh4.position.z)+0.5
      mesh4.rotateX(0.37)
        mesh4.name = "GEN5.2"


      if(c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        mesh4.rotateY(Math.random()*tv-tv/2)
      }

      this.gbk.push(mesh4.id)
      scene.add(mesh4)
    
    }
    }
  }

}

class GEN6{
//dense
  constructor(dx){
    this.boarder = 1000
    this.gbk = []
    this.name = "GEN6"
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){
      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 6")
          break;
        }
        let B = 1
      if(this.counter > 0){
        this.boarder += 4
        this.counter -= 1

        if(c.vel > 1.5){
          this.counter = 0
        }


      } else {
        this.boarder += Math.random()*1700+100
        this.counter += Math.floor(Math.random()*300+100)
        this.displacement = Math.random()*350-175
      }
      



      let h = 6+Math.random()*60

      let tx = Math.random()*180-90+camera.position.x+this.displacement


      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(3+Math.random()*8, h, 3+Math.random()*8),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/1.9
        mesh3.name = "GEN6"

      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

      // }
    }
    }
  }

}



class GEN7{
//scaled dense
  constructor(dx){
    this.boarder = 1000
    this.name = "GEN7"
    this.gbk = []
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*50 > this.boarder - 800){
      breaker++
        if(breaker>20){
          console.log("break 7")
          break;
        }
        let B = 1
      if(this.counter > 0){
        this.boarder += 4*vel
        this.counter -= 1

  


      } else {
        this.boarder += Math.random()*1700*vel+100*vel
        this.counter += Math.floor(Math.random()*300+100)
        this.displacement = Math.random()*350-175
      }
      



      let h = 6+Math.random()*60*vel

      let tx = Math.random()*180*vel-90*vel+camera.position.x+this.displacement

      let w = 3+Math.random()*8*vel
      let l = 3+Math.random()*8*vel
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/1.9

      if(c.chaosMode && c.vel > c.chaosLimit){
        let tv = c.vel/c.chaosLimit-c.chaosLimit/2
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.name = "GEN7"
        mesh3.position.y -= tv+h/9
        // gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
    }

      // mesh3.name = gw.idcr() + ""
      // this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

      // }
    }
    }
  }

}


class GEN8{
//scaled sky
  constructor(dx){
    this.boarder = 1000
    this.name = "GEN8"
    this.gbk = []
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*50 > this.boarder - 800){
      breaker++
        if(breaker>20){
          console.log("break 8")
          break;
        }
        let B = 1
      if(this.counter > 0){
        this.boarder += 4*vel
        this.counter -= 1

        if(camera.position.y-gw.GPC(camera.position.z)<50){
          this.counter = 0
        }


      } else {
        this.boarder += Math.random()*1700*vel+100*vel
        this.counter += Math.floor(Math.random()*300+100)
        this.displacement = Math.random()*150-75
      }
      



      let h = 3+Math.random()*68*vel

      let tx = Math.random()*380*vel-190*vel+camera.position.x+this.displacement

      let w = 3+Math.random()*68*vel
      let l = 3+Math.random()*68*vel
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*65535)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y = camera.position.y + Math.random()*380*vel-190*vel - 251

      if(c.chaosMode && c.vel > c.chaosLimit){
        let tv = c.vel/c.chaosLimit-c.chaosLimit/2
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.position.y -= tv+h/9
        mesh3.name = "GEN8"

        // gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
    }

      // mesh3.name = gw.idcr() + ""
      // this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

      // }
    }
    }
  }

}


class GEN9{
  //skyway
  constructor(dx,b){
    this.name = "GEN9"
    this.boarder = b?b:0
    this.dx = dx?dx:500
    this.counter = 0

    this.material = new THREE.MeshStandardMaterial({ color:  0x007000})
    this.material.important = true
    this.material.emissive.g = 2
    this.material.emissive.b = 2

  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*50 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 9")
          break;
        }
      this.boarder += 30

      let tx = Math.floor(camera.position.x/this.dx)*500

      this.counter++

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,12),
      // new THREE.MeshStandardMaterial({ color:  0x007000})
      this.material
      )
      mesh3.position.x += tx
      mesh3.position.z += this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+ Math.ceil(c.pH/500)*500

      if(this.counter%2 === 0){
        mesh3.position.y-=500
      }
      mesh3.rotateX(0.37)
        mesh3.name = "GEN9"


      if(c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        mesh3.rotateY(Math.random()*tv-tv/2)
      }

      scene.add(mesh3)

      tx += 500

      let mesh4 = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,12),this.material)
      mesh4.position.x += tx
      mesh4.position.z += this.boarder
      mesh4.position.y += gw.GPC(mesh4.position.z)+ Math.ceil(c.pH/500)*500
      if(this.counter%2 === 0){
        mesh4.position.y-=500
      }
      mesh4.rotateX(0.37)
        mesh4.name = "GEN9.2"


      if(c.vel > c.chaosLimit){
        let tv = c.vel-c.chaosLimit
        tv*=0.5
        mesh4.rotateY(Math.random()*tv-tv/2)
      }
      scene.add(mesh4)
    
    }
    }
  }

}

class TRIG1{

  constructor(){
    // this.boarder = 100000
    this.boarder = 100
    // this.transitor = true
  }
  update(){
    if(camera.position.z < this.boarder){
      return;}
    for(let i = gw.pdate3s.length-1; i > -1; i--){
      if(gw.pdate3s[i].name !== "GEN5"){
        gw.pdate3s.splice(i,1)
      }
    }
    gw.pdate3s.push(new TRAN1())
  }

}

class TRAN1{
  constructor(){
    this.name = "TRAN1"
  }

  update(){
    plane.material.color.r += 0.001
    // plane.material.color.r += 0.0001
    if(plane.material.color.r > 0.28){
      this.transit()
      gw.pdate3s.forEach((e,i)=>{
        if(e.name === "TRAN1"){
          gw.pdate3s.splice(i,1)
        }
      })
    }
  }

  transit(){
    gw.pdate3s.push(new GEN1(camera.position.z+900)) 
    gw.pdate3s.push(new GEN9(500,camera.position.z+900))
    gw.pdate3s.push(new GEN11(camera.position.z))
    gw.pdate3s.push(new GEN13(camera.position.z+900))
    gw.pdate3s.push(new GEN12(camera.position.z))
    gw.pdate3s.push(new GEN2(camera.position.z+900,camera.position.z+900))
    gw.pdate3s.push(new GEN2(camera.position.z+20900,camera.position.z+900))
    gw.pdate3s.push(new GEN2(camera.position.z+60900,camera.position.z+900))
    gw.pdate3s.push(new GEN2(camera.position.z+80900,camera.position.z+900))



  }
}



class GEN11{
//scaled rt structure
  constructor(dx){
    this.boarder = 1000+dx
    this.bk = dx
    this.gbk = []
    this.counter = 0
    this.countMax = 0
    this.displacement = 0
    this.reverse = -1
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      // let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*50 > this.boarder - 800){
      breaker++
        if(breaker>20){
          console.log("break 11")
          break;
        }
        let B = 1
        let vel = c.vel
      let abk = this.boarder - this.bk
      if(this.counter > 0){
        this.boarder += 10*vel+18*abk/100000
        this.counter -= 1
      } else {
        this.boarder += Math.random()*500*vel+25*vel
        this.counter += 5 + Math.floor(Math.random()*5)
        this.countMax = this.counter
        this.displacement = Math.random()*450-225
        this.reverse = Math.random()>0.5?-1:1
        return;
      }

      let h = 36+60*vel+180*abk/100000
      let tx = camera.position.x+this.displacement

      let w = 5+8*vel
      let l = 5+8*vel
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2

        let rz = (this.counter-this.countMax/2)/this.countMax*this.reverse*2
        mesh3.rotateZ(rz)
      mesh3.position.x -= Math.tan(rz)*h/2.2
      mesh3.position.y -= h/2-Math.cos(rz)*h/2
        mesh3.name = "GEN11"
        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":0,"ry":0,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]



      // mesh3.name = gw.idcr() + ""
      // this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

      // }
    }
    }
  }

}

class GEN12{
//scaled st structure
  constructor(dx){
    this.boarder = 1000+dx
    this.bk = dx
    this.gbk = []
    this.counter = 0
    this.countMax = 5
    this.displacement = 0
    this.reverse = -1
    this.xdisp = 20
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      // let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*50 > this.boarder - 800){
      breaker++
        if(breaker>20){
          console.log("break 12")
          break;
        }
        let B = 1
        let vel = c.vel
      if(this.counter > 0){
        this.boarder += this.xdisp*vel
        this.counter -= 1
      } else {
        this.boarder += Math.random()*650*vel+40*vel
        this.counter += 5 + Math.floor(Math.random()*15)
        this.countMax = this.counter
        this.displacement = Math.random()*450-225
        this.reverse = Math.random()>0.5?-1:1
        this.xdisp = 20 + Math.random()*20
        return;
      }
      let abk = this.boarder - this.bk

      let h = (16+60*vel+180*abk/100000) * (1+this.countMax/(this.counter+3))
      let tx = camera.position.x+this.displacement

      let w = 3+8*vel*(1+abk/100000)
      let l = 3+8*vel*(1+abk/100000)
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.1}))
      mesh3.position.x += tx 
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2

        mesh3.name = "GEN12"
        let d = dist3(h,w,l,0,0,0)/2

      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
      scene.add(mesh3)

    }
    }
  }

}

class GEN13{
//scaled sky mines
  constructor(boarder){
    this.boarder = boarder?boarder:1000
    this.name = "GEN13"
    this.gbk = []
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*50 > this.boarder - 800){
      breaker++
        if(breaker>20){
          console.log("break 13")
          break;
        }
        let B = 1
      if(this.counter > 0){
        this.boarder += 12*vel
        this.counter -= 1

        if(camera.position.y-gw.GPC(camera.position.z)<90){
          this.counter = 0
        }


      } else {
        this.boarder += Math.random()*1700*vel+100*vel
        this.counter += Math.floor(Math.random()*100+33)
        this.displacement = (Math.random()*150-75)*vel
        return;
      }
      

      let overHeight = c.pH>300?1+(c.pH-300)/300:1

      let h = 180+Math.random()*168*vel

      let tx = Math.random()*380*vel-190*vel+camera.position.x+this.displacement

      let w = h * (0.07+Math.random()*0.03)

      if(overHeight > 1){
        w *= overHeight * 0.8
      }

      let l = w

      h *= overHeight


      let ty = camera.position.y + Math.random()*380*vel-190*vel - 251
      for(let i = 0; i < 4; i++){
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*65535), roughness:0.2}))
      mesh3.position.x += tx
      mesh3.position.z += 12 + this.boarder
      if(overHeight !== 1){
        mesh3.position.z += h/2
      }
      mesh3.position.y = ty

        let tv = 6.5
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.position.y -= tv+h/9
        mesh3.name = "GEN13"
        mesh3.trashDisp = h/2
        let d = dist3(h,w,l,0,0,0)/2

        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

        scene.add(mesh3)
      }

      // }
    }
    }
  }

}

class GEN14{
//scaled paral structure
  constructor(dx){
    this.boarder = 1000+(dx?dx:0)
    this.bk = dx?dx:0
    this.gbk = []
    this.countMax = 5
    this.displacement = 0
    this.xdisp = 20
    this.counter = 0
  }

  update(){
    if(camera.position.z+c.vel*50 > this.boarder - 800){

      // let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*50 > this.boarder - 800){
      breaker++
        if(breaker>20){
          console.log("break 14")
          break;
        }
        let B = 1
        let vel = c.vel
      
        this.boarder += Math.random()*1000*vel+50*vel
        this.counter += 5 + Math.floor(Math.random()*15)
        this.countMax = this.counter
        this.displacement = Math.random()*450-225
        this.xdisp = 20 + Math.random()*20

      let abk = this.boarder - this.bk

      let tx = camera.position.x+this.displacement+c.frameVel.x*350

      let w = 3+8*vel*(1+abk/100000)
      let l = 3+8*vel*(1+abk/100000)

      let rdisp = (1+Math.random())

      for(let i = -5; i < 5; i++){
      let h = (16+60*vel+180*abk/100000) * (1+this.countMax/(this.counter+3)) *(1+Math.random())
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l),
      new THREE.MeshStandardMaterial({ color: "rgb(0,"+(Math.floor(Math.random()*32))+",0)"}))
      mesh3.position.x += tx + i*w*2*rdisp
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2

        mesh3.name = "GEN14"
        let d = dist3(h,w,l,0,0,0)/2

      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
      scene.add(mesh3)
      }

    }
    }
  }

}

// class GEN15{

//   constructor(boarder,tx,ty){
//     this.boarder = boarder?boarder:0
//     this.targX = tx?tx:0
//     this.targY = ty?ty:100

//     this.atargX = this.targX
//     this.atargY = this.targY
//     this.counter = 0

//     this.vx = 0
//     this.vy = 0

//     this.px = this.targX
//     this.py = this.targY
//   }

//   update(){
//     let breaker = 0
//     while(camera.position.z+c.vel*50 > this.boarder - 800){
//       this.counter ++
//       breaker++
//         if(breaker>20){
//           console.log("break 15")
//           break;
//         }

    
//         let w = 20
//         let l = 200
//         let h = 20

//         this.atargX = camera.position.x + this.targX
//         this.atargY = camera.position.y + gw.GPC(c.vel*50+800) + this.targY

//         // this.vy += 55*(Math.random()-0.5)
//         // this.vy *= 0.9
//         // this.vx += 65*(Math.random()-0.5)
//         // this.vx *= 0.9

//         // let dy = this.py-this.atargY
//         // let dx = this.px-this.atargX

//         // this.vy -= dy * 0.5
//         // this.vx -= dx * 0.7

//         // if(this.vx<-160){this.vx = -160} else if(this.vx > 160){this.vx = 160} 
//         // if(this.vy<-160){this.vy = -160} else if(this.vy > 160){this.vy = 160} 
//         //   if(Math.random()>0.8){
//         // console.log(dx, this.vx, dy,this.vy)}
//         this.vy = 1
//         // if(this.counter %2 ==0){
//         //   this.vy = 55
//         // }
//         this.vx = -1
//         // if(this.counter %2 ==0){
//         //   this.vx = 55
//         // }


//       let mesh3 = new THREE.Mesh(
//       new THREE.BoxGeometry(w, h, l),
//       new THREE.MeshStandardMaterial({ color: 0x401010, roughness: 0.1}))


//       let rotpoint = rotate(this.vx,this.vy,0,{"x":0,"y":0,"z":l/2})

//       // let dp = vectorFuncs.dotProduct3(rotpoint.x,rotpoint.y,rotpoint.z,0,0,1)


//       mesh3.position.z = rotpoint.z + this.boarder
//       // let dispedY = (l*Math.sin(rotx)/2)
//       // let dispedX = (l*Math.sin(roty)/2)

//       let dispedY = -rotpoint.y
//       let dispedX = rotpoint.x


//       // console.log(dispedY * dispedY * Math.cos(roty),Math.cos(roty))
//       // dispedY = dispedY * dispedY * Math.cos(roty)
//       // dispedX = dispedX * dispedX * Math.cos(rotx)


//       mesh3.position.y = this.py + dispedY
//       this.py += dispedY*2
//       mesh3.position.x = this.px + dispedX
//       this.px += dispedX*2

//       mesh3.rotateX(-this.vx)
//       mesh3.rotateY(this.vy)
//       // mesh3.lookAt(this.vx,this.vy,l/2)
//       mesh3.rotation.z = 0

//       this.boarder += rotpoint.z*2


//         mesh3.name = "GEN15"
//         let d = dist3(h,w,l,0,0,0)/2

//       // gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
//       scene.add(mesh3)

//     }
//   }
  
// }

class GEN15{

  constructor(boarder,tx,ty,px,py,branchable){
    this.boarder = boarder?boarder:0
    this.targX = tx?tx:0
    this.targY = ty?ty:0

    this.atargX = this.targX
    this.atargY = this.targY
    this.counter = 0

    this.branchable = branchable

    this.branchees = []

    this.vx = 0
    this.vy = 0

    this.px = px?px:this.targX
    this.py = py?py:this.targY

    this.yAxis = new THREE.Vector3(0,1,0)
    this.xAxis = new THREE.Vector3(1,0,0)

    this.dxChaser = [true,0]
  }

  update(){
    this.branchees.forEach((e)=>{
      e.update()
    })
    let breaker = 0
    while(camera.position.z+c.vel*50 > this.boarder - 900){
      this.counter ++
      breaker++
        if(breaker>20){
          console.log("break 15")
          break;
        }

        this.atargX = camera.position.x + this.targX + c.frameVel.x * (200+this.dxChaser[1])
        this.atargY = camera.position.y + gw.GPC(c.vel*50+900) + this.targY

        let vel = c.vel > 1.5?(c.vel-1.5)*3:0
        let w = 20+vel*5
        let l = 200 + vel*5
        let h = 20+vel*5

        this.vy += 25*(Math.random()-0.5)*vel
        this.vx += 35*(Math.random()-0.5)*vel
        if(vel === 0){
        this.vy *= 0.6
        this.vx *= 0.6
        }
        let dy = this.py-this.atargY



        let dx = this.px-this.atargX
        let dcc = true
        if(dx > 0){
          dcc = true
        } else {
          dcc= false
        }

        if(dcc === this.dxChaser[0]){
          this.dxChaser[1] += 3
        } else {
          this.dxChaser = [!this.dxChaser[0],-this.dxChaser[1]/1.5]
        }

        if(vel === 0){
        this.vy -= dy * 0.5
        this.vx -= dx * 0.7
        } else if(vel < 0.7){
          this.vy -= dy * 0.7
          this.vx -= dx * 0.9
        } else {
          this.vy -= dy * 0.9
          this.vx -= dx * 0.95
        }

        if(c.vel > 2.3 || Math.random()>0.6){
        if(this.branchable !== false && Math.random()>0.96){
          this.branchees.push(new GEN15(this.boarder,Math.random()*200-100,Math.random()*200-100,this.px,this.py,false))
        }}
         // else {
          if(Math.random()>0.92 || this.branchees.length > 3){
            this.branchees.splice(0,1)
          }
        // }


        if(this.vx<-160+c.frameVel.x*150){this.vx = -160} else if(this.vx > 160+c.frameVel.x*150){this.vx = 160} 
        if(this.vy<-160){this.vy = -160} else if(this.vy > 160){this.vy = 160} 
        //   if(Math.random()>0.8){
        // console.log(dx, this.vx, dy,this.vy)}
        // this.vy -= 1
        // // if(this.counter %2 ==0){
        // //   this.vy = 55
        // // }
        // this.vx = -55
        // // if(this.counter %2 ==0){
        // //   this.vx = 55
        // // }


      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, l+4),
      new THREE.MeshStandardMaterial({ color: (vel===0?"rgb(26,26,26)":"rgb(0,0,0)"), roughness: (this.counter%2===0?1:0.1),
       emissive:"rgb("+Math.floor(vel*35*(this.counter%2))+","+(this.branchable===false?Math.floor(vel*35*((this.counter+1)%2)):0)+",0)"}))


      let rotx = Math.atan(this.vy/l*2)
      let roty = Math.atan(this.vx/l*2)

      let rotpoint = rotate(rotx,roty,0,{"x":0,"y":0,"z":l/2})

      // let dp = vectorFuncs.dotProduct3(rotpoint.x,rotpoint.y,rotpoint.z,0,0,1)


      mesh3.position.z = rotpoint.z + this.boarder
      // let dispedY = (l*Math.sin(rotx)/2)
      // let dispedX = (l*Math.sin(roty)/2)

      let dispedY = -rotpoint.y
      let dispedX = rotpoint.x


      // console.log(dispedY * dispedY * Math.cos(roty),Math.cos(roty))
      // dispedY = dispedY * dispedY * Math.cos(roty)
      // dispedX = dispedX * dispedX * Math.cos(rotx)


      mesh3.position.y = this.py + dispedY
      this.py += dispedY*2
      mesh3.position.x = this.px + dispedX
      this.px += dispedX*2

      mesh3.rotateOnWorldAxis(this.xAxis,-rotx)
      mesh3.rotateOnWorldAxis(this.yAxis,roty)
      mesh3.rotation.z = 0

      this.boarder += rotpoint.z*2


        mesh3.name = "GEN15"
        let d = dist3(h,w,l,0,0,0)/2
        let rx = mesh3.rotation.x
        let ry = mesh3.rotation.y
        let rz = mesh3.rotation.z
        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-d,mesh3.position.x+d,mesh3.position.x-d,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      scene.add(mesh3)

    }
  }
  
}

class GENV2_1{
  static gen(x,y,z,r){
    let mesh3 = new THREE.Mesh(
      new THREE.SphereGeometry(r,12,8),
      new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.1}))
      gw.colliders[mesh3.id] = ["special",GENV2_1.cC,[x,y,z,r,mesh3.id]]
      posSet(mesh3,x,y,z)
      mesh3.name = "GV2_1"
    scene.add(mesh3)
  }
  static cC(s){
    let d = dist3(camera.position.x,camera.position.y,camera.position.z,s[0],s[1],s[2])
    if(d < s[3]){
      return(s[4])
    }

    if(Math.random() > 0.999){
      new missile2(s[0],s[1],s[2],true)
    }

    return(false)
  }
}
class GENV2_2{
  static gen(x,y,z,w,l){
    l = l?l:w

    let GP = gw.GPC(z)
    let h = y-GP

    let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w,h,l),
      new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.1}))
      posSet(mesh3,x,y-h/2,z)
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l/2,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
      mesh3.name = "GV2_2"
    scene.add(mesh3)
  }
}