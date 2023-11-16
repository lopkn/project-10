var out = 0
class WorkletProcessor extends AudioWorkletProcessor {
  static out = 0
  process(inputs, outputs, parameters) {
    // Do something with the data, e.g. convert it to WAV
    out ++
    if(out%20==0){
      // console.log(inputs[0][0][0])
      console.log(inputs)
    }
    return true;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);



// let workProcessor;
// let audioContext;
// navigator.mediaDevices.getUserMedia({ audio: true }).then((stream)=>{
//     audioContext = new AudioContext();
//     audioContext.createMediaStreamSource(stream)
//     workProcessor = audioContext.audioWorklet.addModule("./test.js");
//     console.log("Audio context successfully initialized.");
    
// })




/// wait then manually do  audioWorkletNode = new AudioWorkletNode(audioContext, 'worklet-processor')
