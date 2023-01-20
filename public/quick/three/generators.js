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

class GEN1{

  constructor(){
    this.boarder = 0
    this.gbk = []
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){

      if(c.vel > 2){
        let tv = c.vel-2
        this.boarder-=tv
      }

      let breaker = 0

      while(camera.position.z+c.vel*5 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 1")
          break;
        }
      this.boarder += 1+c.vel*0.005+this.boarder/3000
      if(c.vel < 0.007){
        this.boarder += 0.5
      }
      let h = 1+Math.random()*30+this.boarder*0.01
      let w = 1+Math.random()*4+c.vel*13*Math.random()+this.boarder*0.001
      let l = 1+Math.random()*4+c.vel*13*Math.random()+this.boarder*0.001
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(w, h,l),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x
      if(mesh3.position.x > 1000+camera.position.x && mesh3.position.x < -1000+camera.position.x){
        return;
      }
      mesh3.position.z += 12 + this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+h/2.2


      if(c.vel > 2 || c.chaosMode){
        let tv = c.vel-2+c.chaosMode*2
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

  constructor(dx){
    this.boarder = 0
    this.gbk = []
    this.dx = dx?dx:20000
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*5 > this.boarder - 800){
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

      if(c.vel > 2 || c.chaosMode){
        let tv = c.vel-2+c.chaosMode*2
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
    this.dx = dx?dx:20000
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*5 > this.boarder - 800){
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

      if(c.vel > 2){
        let tv = c.vel-2
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
    this.gbk = []
    this.dx = dx?dx:30000
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*5 > this.boarder - 800){
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


      if(c.chaosMode && c.vel > 2){
        let tv = c.vel-2
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
    this.gbk = []
    this.dx = dx?dx:500
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*5 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 5")
          break;
        }
      this.boarder += 10

      let tx = Math.floor(camera.position.x/this.dx)*500

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,4),
      new THREE.MeshStandardMaterial({ color:  0xff0000}))
      mesh3.position.x += tx
      mesh3.position.z += this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+0.5
      mesh3.rotateX(0.37)
        mesh3.name = "GEN5"


      if(c.vel > 2){
        let tv = c.vel-2
        mesh3.rotateY(Math.random()*tv-tv/2)
      }

      this.gbk.push(mesh3.id)
      scene.add(mesh3)

      tx += 500

      let mesh4 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,4),
      new THREE.MeshStandardMaterial({ color:  0xff0000}))
      mesh4.position.x += tx
      mesh4.position.z += this.boarder
      mesh4.position.y += gw.GPC(mesh4.position.z)+0.5
      mesh4.rotateX(0.37)
        mesh4.name = "GEN5.2"


      if(c.vel > 2){
        let tv = c.vel-2
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
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      while(camera.position.z+c.vel*5 > this.boarder - 800){
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
    this.gbk = []
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){

      let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*5 > this.boarder - 800){
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

      if(c.chaosMode && c.vel > 2){
        let tv = c.vel/2-1
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
    this.gbk = []
    this.counter = 0
    this.displacement = 0
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){

      let vel = c.vel>1?c.vel:1
      let breaker = 0;
      while(camera.position.z+c.vel*5 > this.boarder - 800){
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

      if(c.chaosMode && c.vel > 2){
        let tv = c.vel/2-1
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
  constructor(dx){
    this.boarder = 0
    this.dx = dx?dx:500
    this.counter = 0
  }

  update(){
    if(camera.position.z+c.vel*5 > this.boarder - 800){
      let breaker = 0
      while(camera.position.z+c.vel*5 > this.boarder - 800){
        breaker++
        if(breaker>20){
          console.log("break 5")
          break;
        }
      this.boarder += 30

      let tx = Math.floor(camera.position.x/this.dx)*500

      this.counter++

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,12),
      new THREE.MeshStandardMaterial({ color:  0x007000}))
      mesh3.position.x += tx
      mesh3.position.z += this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+ Math.ceil(c.pH/500)*500
      if(this.counter%2 === 0){
        mesh3.position.y-=500
      }
      mesh3.rotateX(0.37)
        mesh3.name = "GEN9"


      if(c.vel > 2){
        let tv = c.vel-2
        mesh3.rotateY(Math.random()*tv-tv/2)
      }

      scene.add(mesh3)

      tx += 500

      let mesh4 = new THREE.Mesh(
      new THREE.BoxGeometry(3,3,12),
      new THREE.MeshStandardMaterial({ color:  0x007000}))
      mesh4.position.x += tx
      mesh4.position.z += this.boarder
      mesh4.position.y += gw.GPC(mesh4.position.z)+ Math.ceil(c.pH/500)*500
      if(this.counter%2 === 0){
        mesh4.position.y-=500
      }
      mesh4.rotateX(0.37)
        mesh4.name = "GEN9.2"


      if(c.vel > 2){
        let tv = c.vel-2
        tv*=0.5
        mesh4.rotateY(Math.random()*tv-tv/2)
      }
      scene.add(mesh4)
    
    }
    }
  }

}

