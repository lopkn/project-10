const robot = require('robotjs');
// Move the mouse
robot.moveMouse(500, 500);

// let i = 0
// setInterval(()=>{
// 	i+=5
// 	robot.moveMouse(i,500)
// },50)

// Click the mouse
robot.keyTap("right")






var express = require('express');
var app = express();
var cors = require('cors')//jan7-2024

var server = app.listen(3010);

app.use(cors()) //jan7-2024
// app.use(express.static('./'));
// app.use(express.json())

app.post('/', (req, res) => {
    console.log('Got body:', req.body);
    // responder.process1(req.body,res)
    

    doThing()

    res.sendStatus(200);
})

app.get('/', (req, res) => {
    console.log('Got body:', req.body);
    // responder.process1(req.body,res)
    
    doThing()

    res.sendStatus(200);
})


function doThing(){
	robot.keyTap("right")
}


// robot.mouseClick();

// Type a string
// robot.typeString('Hello, world!');

// Capture the screen
// const screenshot = robot.screen.capture(0, 0, 800, 600);
// console.log(screenshot);