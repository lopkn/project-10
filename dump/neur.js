class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.weightsInputToHidden = Array.from({ length: hiddenSize }, () =>
            Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
        );
        this.biasHidden = Array(hiddenSize).fill(0);
        this.weightsHiddenToOutput = Array.from({ length: outputSize }, () =>
            Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1)
        );
        this.biasOutput = Array(outputSize).fill(0);
        this.learningRate = document.querySelector('#learningRate').value; // Adjusted learning rate
        this.hiddenLayer = new Array(this.hiddenSize);
    }

    feedForward(inputs) {
        for (let i = 0; i < this.hiddenSize; i++) {
            this.hiddenLayer[i] = 0;
            for (let j = 0; j < this.inputSize; j++) {
                this.hiddenLayer[i] += this.weightsInputToHidden[i][j] * inputs[j];
            }
            this.hiddenLayer[i] += this.biasHidden[i];
            this.hiddenLayer[i] = sigmoid(this.hiddenLayer[i]);
        }

        const output = new Array(this.outputSize);
        for (let i = 0; i < this.outputSize; i++) {
            output[i] = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                output[i] += this.weightsHiddenToOutput[i][j] * this.hiddenLayer[j];
            }
            output[i] += this.biasOutput[i];
            output[i] = sigmoid(output[i]);
        }
        return output;
    }

    train(inputs, target) {
        for (let i = 0; i < this.hiddenSize; i++) {
            this.hiddenLayer[i] = 0;
            for (let j = 0; j < this.inputSize; j++) {
                this.hiddenLayer[i] +=
                    this.weightsInputToHidden[i][j] * inputs[j];
            }
            this.hiddenLayer[i] += this.biasHidden[i];
            this.hiddenLayer[i] = sigmoid(this.hiddenLayer[i]);
        }

        const output = new Array(this.outputSize);
        for (let i = 0; i < this.outputSize; i++) {
            output[i] = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                output[i] +=
                    this.weightsHiddenToOutput[i][j] * this.hiddenLayer[j];
            }
            output[i] += this.biasOutput[i];
            output[i] = sigmoid(output[i]);
        }

        const errorsOutput = new Array(this.outputSize);
        const errorsHidden = new Array(this.hiddenSize);

        for (let i = 0; i < this.outputSize; i++) {
            errorsOutput[i] = target[i] - output[i];
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weightsHiddenToOutput[i][j] += this.learningRate * errorsOutput[i] * output[i] * (1 - output[i]) * this.hiddenLayer[j];
            }
            this.biasOutput[i] += this.learningRate * errorsOutput[i];
        }

        for (let i = 0; i < this.hiddenSize; i++) {
            errorsHidden[i] = 0;
            for (let j = 0; j < this.outputSize; j++) {
                errorsHidden[i] += this.weightsHiddenToOutput[j][i] * errorsOutput[j];
            }
            this.biasHidden[i] += this.learningRate * errorsHidden[i];
            for (let j = 0; j < this.inputSize; j++) {
                this.weightsInputToHidden[i][j] +=
                    this.learningRate *
                    errorsHidden[i] *
                    this.hiddenLayer[i] *
                    (1 - this.hiddenLayer[i]) *
                    inputs[j];
            }
        }
    }
}

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const pointRadius = 5; // Radius of the points

const trainingData = [];
const numDataPoints = document.querySelector('#trainingDataSize').value; // Adjust the number of data points as needed

for (let i = 0; i < numDataPoints; i++) {
    const x = Math.random() * 2 - 1; // Random x value between -1 and 1
    const y = Math.random() * 2 - 1; // Random y value between -1 and 1

    let label;
    if (x <= 0 && y < 0) {
        label = "blue";
    } else if (x <= 0 && y > 0) {
        label = "green";
    } else if (x > 0 && y <= 0) {
        label = "red";
    } else {
        label = "purple";
    }

    trainingData.push({ x, y, label });
}

var hiddenNodes = parseInt(document.querySelector('#hiddenNodes').value);


var neuralNetwork = "";

function initialise(){
    console.log("HN", hiddenNodes);
    clearCanvas();
    neuralNetwork = new NeuralNetwork(2, hiddenNodes, 4);
}


function train() {
    for (let i = 0; i < parseInt(document.querySelector('#trainingIterations').value); i++) {
        const data = trainingData[Math.floor(Math.random() * trainingData.length)]; // choose random data POINT
        neuralNetwork.train([data.x, data.y], oneHotEncode(data.label));
    }
}

function classifyPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    this.points = [];
    for (let i = 0; i < parseInt(document.querySelector('#numPoints').value); i++) {
        const x = Math.random() * 2 - 1; // Random x-coordinate between -1 and 1
        const y = Math.random() * 2 - 1; // Random y-coordinate between -1 and 1
        const output = neuralNetwork.feedForward([x, y]);
        const predictedLabel = oneHotDecode(output);
        drawPoint(x, y, predictedLabel);
        points.push({ x, y, predictedLabel });
    }
    console.log(points);
    console.log(neuralNetwork.hiddenLayer);
}

// function oneHotEncode(label) {
//     const encoding = {
//         blue: [1, 0, 0, 0],
//         red: [0, 1, 0, 0],
//         green: [0, 0, 1, 0],
//         purple: [0, 0, 0, 1]
//     };
//     return encoding[label];
// }

// function oneHotDecode(output) {
//     const labels = ["blue", "red", "green", "purple"];
//     const maxIndex = output.indexOf(Math.max(...output));
//     return labels[maxIndex];
// }

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}







var yOffset = 0;

