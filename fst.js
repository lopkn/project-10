var spawn = require('child_process').spawn,
    child = spawn('python3',["-u","./gay.py"]);

child.stdin.setEncoding = 'utf-8';
child.stdout.pipe(process.stdout);

child.stdout.on('data', (data) => {
  console.log("PYTHON SENT:", data.toString());
});

child.stdin.cork()
child.stdin.write("gay");
child.stdin.uncork()
