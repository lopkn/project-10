const fs = require("fs")

let data = fs.readFileSync("./testOut.json",'utf8')

let pd = JSON.parse(data)

pd = pd["messages"]


var i = 0, len = pd.length;
while(i<len){
pd[i].score = 0
//	pd[i] = {"score":0,"id":pd[i].id,"content":pd[i].content}
i++
}

console.log("done preprocessing")


var pointlist = [

	[" argu",20],
	["science",25],
	["biology",25],
	["technology",10],
	["gaming",3],
	["reading",3],
	["nerd",15],
	[" geek",15],
	["minecraft",5],
	[" debat",20],
	[" program",10],
	[" coding",10],
	[" code ",5],
	["software",8],
	["yap",10],
	["university",20],
	["philosophy",5],
	["linux",30],
	["engineer",10],
        ["project",5]
]

var negativityMultiplier = 1
var positivityMultiplier = 1

var userSet = {}
var repeatPreventer = new Set()
var upeat = {}

for(let i = pd.length-1; i>-1; i--){


        if(pd[i].author.name=="Deleted User"){pd.splice(i,1);continue;}

        pd[i].matches = []

        let aids = pd[i].author.id
        if(upeat[aids]===undefined){upeat[aids]=0};
        upeat[aids]+=1;
        let str = pd[i].content
        let lower = str.toLowerCase()
        //if(repeatPreventer.has(str)){continue}
        //repeatPreventer.add(str)
        pointlist.forEach((e)=>{
                spl = lower.split(e[0]).length-1
                if(once&&spl>1){spl=1}
                let m;
                if(e[1]>0){m=positivityMultiplier}else{m=negativityMultiplier}
                pd[i].score+=e[1]*spl*m
                for(let j = 0; j<spl; j++){
                        pd[i].matches.push(e[0])
                }
        })
        if(userSet[aids]===undefined){userSet[aids]=[pd[i].score,pd[i]];continue;}
        if(userSet[aids][0]>pd[i].score){pd.splice(i,1);continue}
        pd.splice(pd.indexOf(userSet[aids][1]),1);
        userSet[aids] = [pd[i].score,pd[i]];
}
pd.sort((a,b)=>{return(b.score-a.score)})


console.log("done filtering")



var analysis = {}
var a = pd.length

function analyze(f,name=Math.random()){
b=0;pd.forEach((e)=>{s=e.content.toLowerCase();if(f(s,e.content)){b++}});console.log(b/a)
analysis[name] = b/a
}




function top(x){
        for(let i = 0; i < x; i++){console.log(pd[i].author.name, "\n-- score: "+pd[i].score,"\n-- tags: "+JSON.stringify(pd[i].matches)+"\n")}
}



var analysis = {}
var a = pd.length

function analyze(f,name=Math.random()){
b=0;pd.forEach((e)=>{s=e.content.toLowerCase();if(f(s,e.content)){b++}});console.log(b/a)
analysis[name] = b/a
}










