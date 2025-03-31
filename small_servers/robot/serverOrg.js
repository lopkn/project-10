const robot = require('robotjs');
// Move the mouse
robot.moveMouse(500, 500);

// let i = 0
// setInterval(()=>{
// 	i+=5
// 	robot.moveMouse(i,500)
// },50)

// Click the mouse
robot.keyTap("enter")
robot.keyTap("enter")
robot.keyTap("enter")
robot.keyTap("enter")
robot.keyTap("enter")
robot.keyTap("enter")
robot.keyTap("enter")
robot.mouseClick();

// Type a string
// robot.typeString('Hello, world!');

// Capture the screen
// const screenshot = robot.screen.capture(0, 0, 800, 600);
// console.log(screenshot);