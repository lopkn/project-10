class responder{
  static responsesNeeded = {}
  static responseID = 0
  static process1(a,b){console.log(a)
  this.responseID++
  this.responsesNeeded[responseID] = {"a":a,"b":b,"id":responseID}
  child.stdin.write(responseID+"-"+JSON.stringify(a))
}
    static RESPOND(id,d){
        let resN = responsesNeeded[id]
        resN.b.send(d)
    }

  }
  var express = require('express');
  var bodyParser = require('body-parser');
  var app = express();
  var cors = require('cors')//jan7-2024
  
  var server = app.listen(3000);
  
  app.use(cors()) //jan7-2024
  
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json())
  app.post('/responder', (req, res) => {
      console.log('Got body:', req.body);
      responder.process1(req.body,res)
      res.sendStatus(200);
  })
  console.log("server is opened")
  // console.log(perSeed.noise2D(0.2,0,0))
  // console.log("seeds: " + JSON.stringify(perSeeds))


  var socket = require('socket.io');
  var io = socket(server);

var spawn = require('child_process').spawn,
    child = spawn('python3',["-u","./gay.py"]);

child.stdin.setEncoding = 'utf-8';
child.stdout.pipe(process.stdout);

child.stdout.on('data', (data) => {
    d = data.toString()
  console.log("PYTHON SENT:", d);
  let acData = data.split("-")
  let dataID = acData[1]
  acData.splice(0,1)
  acData = acData.join("-")
  responder.RESPOND(dataID,acData)
});

child.stdin.cork()
child.stdin.write("gay");
child.stdin.uncork()

