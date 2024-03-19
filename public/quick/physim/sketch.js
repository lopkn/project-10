var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
var boxA = Bodies.circle(400, 200, 40, 80);
var boxB = Bodies.rectangle(480, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var paddle = Bodies.rectangle(400, 610, 80, 20, { isStatic: true });
let paddlepos = {x:0,y:-10}
boxA.restitution = 1
boxB.friction = 2
Matter.Events.on(engine, 'collisionEnd', function(event) {
  var pairs = event.pairs;

  // Iterate through the collision pairs
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var bodyA = pair.bodyA;
    var bodyB = pair.bodyB;

    // Check the identities or properties of the bodies
    if (bodyB === paddle) {
      // Run a specific function for bodyA
      myColF(bodyB,bodyA)
    }
  }
});
function myColF(a,b){

  // Matter.Body.setVelocity(b,{x:b.velocity.x+paddle.lposvel.x*0.1,y:b.velocity.y})
  console.log({x:b.velocity.x+paddle.lposvel.x,y:b.velocity.y})

}


// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground,paddle]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
/* Runner.run(runner, engine); */
let mouseX = 0
let mouseY = 0
onmousemove = (e)=>{mouseX = (e.clientX); mouseY = (e.clientY)}


boxA.frictionAir = 0
boxA.friction = 0
boxA.frictionStatic = 0
boxA.slop = 0.05
paddle.frictionAir = 0
paddle.friction = 0
paddle.frictionStatic = 0
paddle.slop = 0.05
paddle.restitution = 1



setInterval(()=>{
    Matter.Engine.update(engine, 1000 / 30);
    paddle.lposvel = {x:mouseX-paddlepos.x,y:mouseY-paddlepos.y}
    paddlepos = {x:mouseX,y:550}
    Matter.Body.setPosition(paddle, paddlepos)
},30)
















