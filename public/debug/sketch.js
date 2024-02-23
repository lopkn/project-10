const socket = io.connect('/')
let GAMESESSION = "debug"
socket.emit("JOINGAME",GAMESESSION)
var ID = 0
socket.on("debugReturn",(e)=>{ID = e.sid; console.log("joined as "+ID);console.log(e);window.dbg=e})
socket.on("msg",(e)=>{console.log("recieved message: "+e)
	messageBubble(e.msg,e.id == ID?"right":"left")
})
socket.on("smsg",(e)=>{
	messageBubble(e,"cent")
})
