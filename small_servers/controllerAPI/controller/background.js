var TAB = "not open";
chrome.action.onClicked.addListener(() => {

chrome.storage.local.get(["ctrl_window"]).then((e)=>{
    TAB = parseInt(e.ctrl_window)
    Z({type:"newWindow"})
}).catch((e)=>{
    TAB = "not open";
    Z({type:"newWindow"})
})
})

function Z(request) {

    console.log("HELLO?")

    if (request.type === 'newWindow') {
        if(TAB !== "not open"){
            let r = 0;
            // try{
            //     console.log("ERROR1")
            //     let t = chrome.windows.get(TAB)
            //     console.log("ERROR2")
            //     chrome.windows.update(TAB, {focused: true})
            //     r = 1;
            // } catch(err){
            //     r = 0
            // }
            chrome.windows.get(TAB).then(()=>{
                chrome.windows.update(TAB, {focused: true})
            }).catch((err)=>{
                newTab()
            })
            
        } else{
            newTab()
        } 
           
    }
}

function newTab(){
     console.log("TAB OPENING: "+TAB)
        chrome.tabs.create({
            url: chrome.runtime.getURL('popup.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            let win = chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width:500,
                height:400,
                // alwaysOnTop:true
                // incognito, top, left, ...
            }).then((w)=>{
                TAB = w.id
                chrome.storage.local.set({"ctrl_window": w.id }).then(() => {
                  console.log("Value is set");
                })
                console.log("HEYYY:"+TAB)
            });
            // win.onRemoved.addListener(
            //       ()=>{
            //         tab = "not open"
            //       }
            //     )
        });
}
