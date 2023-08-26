var out = 0
class WorkletProcessor extends AudioWorkletProcessor {
  static out = 0
  process(inputs, outputs, parameters) {
    // Do something with the data, e.g. convert it to WAV
    out ++
    if(out%20==0){
      console.log(inputs[0][0][0])
    }
    return true;
  }
}

registerProcessor("worklet-processor", WorkletProcessor);