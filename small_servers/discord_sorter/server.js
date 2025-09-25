const fs = require("fs")

let data = fs.readFileSync("./testOut.json",'utf8')

let pd = JSON.parse(data)

pd = pd["messages"]

let pd1 = []

var i = 0, len = pd.length;
while(i<len){

	pd1[i] = {"id":pd[i].id,"content":pd[i].content}
i++
}

console.log("done preprocessing")
