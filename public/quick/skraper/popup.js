console.log("hey")


document.getElementById('test').addEventListener("click",()=>{
	document.getElementById('test').style.backgroundColor='red'

	if (confirm('Open dialog for testing?'))
    chrome.runtime.sendMessage({type:'request_password'});
})


console.log("hey")


