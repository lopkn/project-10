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
      if(this.fastColcheck(e[1],e[2],e[3],e[4],camera.position)){
        ans = this.fastColcheck(e[1],e[2],e[3],e[4],camera.position)
      }
      } else {
         let pt = {"x":camera.position.x-e[0].x,"y":camera.position.y-e[0].y,"z":camera.position.z-e[0].z}
         rotate(-e[0].rx,0,0,pt)
         rotate(0,-e[0].ry,0,pt)
         rotate(0,0,-e[0].rz,pt)


         let r = this.fastColcheck(e[1],e[2],e[3],e[4],{"x":e[0].x+pt.x,"y":e[0].y+pt.y,"z":e[0].z+pt.z})
         if(r){
          ans = r
         }

      }
    })
    return(ans)
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

      while(camera.position.z+c.vel*5 > this.boarder - 800){
      this.boarder += 1+c.vel*0.005+this.boarder/4000
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
        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l-10,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
      }
      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        while(this.gbk.length > 1000){
          gw.rmObj(this.gbk[0])
          this.gbk.splice(0,1)
        }
      }
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
      while(camera.position.z+c.vel*5 > this.boarder - 800){

        let B = 1
      if(this.boarder > this.dx){
        B = this.boarder-this.dx+1
        this.boarder += 1+c.vel*0.005+this.boarder/4000
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

      

      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        while(this.gbk.length > 1000){
          gw.rmObj(this.gbk[0])
          this.gbk.splice(0,1)
        }
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
      while(camera.position.z+c.vel*5 > this.boarder - 800){

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

        while(this.gbk.length > 1000){
          gw.rmObj(this.gbk[0])
          this.gbk.splice(0,1)
        }
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
      while(camera.position.z+c.vel*5 > this.boarder - 800){

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

      if(c.chaosMode && c.vel > 2){
        let tv = c.vel-2
        let rx = Math.random()*tv-tv/2
        let ry = Math.random()*tv-tv/2
        let rz = Math.random()*tv-tv/2
        mesh3.rotateX(rx)
        mesh3.rotateY(ry)
        mesh3.rotateZ(rz)
        mesh3.position.y -= tv+h/9
        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
    }

      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

        while(this.gbk.length > 1000){
          gw.rmObj(this.gbk[0])
          this.gbk.splice(0,1)
        }
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
      while(camera.position.z+c.vel*5 > this.boarder - 800){

      this.boarder += 10

      let tx = Math.floor(camera.position.x/this.dx)*500

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,4),
      new THREE.MeshStandardMaterial({ color:  0xff0000}))
      mesh3.position.x += tx
      mesh3.position.z += this.boarder
      mesh3.position.y += gw.GPC(mesh3.position.z)+0.5
      mesh3.rotateX(0.37)

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

      while(camera.position.z+c.vel*5 > this.boarder - 800){

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
        mesh3.position.y -= tv+h/9
        gw.colliders[mesh3.id] = [{"x":mesh3.position.x,"y":mesh3.position.y,"z":mesh3.position.z,"rx":rx,"ry":ry,"rz":rz},mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]

      } else {
      gw.colliders[mesh3.id] = ["none",mesh3.position.z-l,mesh3.position.x+w,mesh3.position.x-w,{"id":mesh3.id,"X":mesh3.position.x+w/2,"x":mesh3.position.x-w/2,"Y":mesh3.position.y+h/2,"y":mesh3.position.y-h/2,"Z":mesh3.position.z+l/2,"z":mesh3.position.z-l/2,}]
    }

      // mesh3.name = gw.idcr() + ""
      this.gbk.push(mesh3.id)
      // if(mesh3.position.x < 1000+camera.position.x && mesh3.position.x > -1000+camera.position.x){
      scene.add(mesh3)

      // }
    }
    }
  }

}



