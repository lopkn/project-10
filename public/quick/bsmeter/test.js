var out = 0
class WorkletProcessor extends AudioWorkletProcessor {
  static out = 0
  process(inputs, outputs, parameters) {
    // Do something with the data, e.g. convert it to WAV
    out ++
    if(out%40==0){
      // console.log(inputs[0][0][0])
      // console.log(inputs[0][0][0])
      this.port.postMessage(inputs)
    }
    return true;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);



// let workProcessor;
// let audioContext;
// let AOUT;
// navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//   audioContext = new AudioContext();
//   let mic = audioContext.createMediaStreamSource(stream);
//   audioContext.audioWorklet
//     .addModule("./test.js")
//     .then(() => {
//       workProcessor = new AudioWorkletNode(audioContext, "worklet-processor",{
//   numberOfInputs: 1
// });
//       mic.connect(workProcessor).connect(audioContext.destination);
//       console.log("Audio context successfully initialized.");
//         workProcessor.port.onmessage = (e)=>{AOUT = e.data}
//     })
//     .catch((error) => {
//       console.error("Error adding audio worklet module:", error);
//     });
// });