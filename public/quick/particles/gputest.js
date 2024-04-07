
  function initGPU() {
	try {
		return new window.GPU.GPU();
	} catch (e) {
		return new GPU();
	}
}


  const generateMatrices = () => {
    const matrices = [[], []]
    for (let y = 0; y < 512; y++){
      matrices[0].push([])
      matrices[1].push([])
      for (let x = 0; x < 512; x++){
        matrices[0][y].push(Math.random())
        matrices[1][y].push(Math.random())
      }
    }
    return matrices
  }

  let MAT1 = []
  let MAT2 = []


  const gpu = initGPU();
  const multiplyMatrix = gpu.createKernel(function(a, b) {
    let sum = 0;
    for (let i = 0; i < 512; i++) {
      sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
  }).setOutput([512, 512])

  myGPUFunc = gpu.createKernel(function(a,b) {
  	return (this.thread.x)
  }).setOutput([512,512])

  function synchronize(p){
  	let a;
	(async()=>{await p.then((result) => { a = result; });})()
	return(a)
  }


  const matrices = generateMatrices()
  const out multiplyMatrix(matrices[0], matrices[1])
  var out2 = myGPUFunc(matrices[0], matrices[1])

