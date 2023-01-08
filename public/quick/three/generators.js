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
      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*13*Math.random()+this.boarder*0.001, h, 1+Math.random()*4+c.vel*13*Math.random()+this.boarder*0.001),
      new THREE.MeshStandardMaterial({ color:  Math.floor(Math.random()*16777215)}))
      mesh3.position.x += Math.random()*c.vel*8000+Math.random()*80-40-c.vel*4000+camera.position.x
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

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*13*Math.random()+B*0.001, h, 1+Math.random()*4+c.vel*13*Math.random()+B*0.001),
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

      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(1+Math.random()*4+c.vel*13*Math.random()+B*0.0001, h, 1+Math.random()*4+c.vel*13*Math.random()+B*0.0001),
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


class GEN5{

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


      let mesh3 = new THREE.Mesh(
      new THREE.BoxGeometry(3+Math.random()*8*vel, h, 3+Math.random()*8*vel),
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



