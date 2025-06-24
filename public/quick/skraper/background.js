var tab;

chrome.runtime.onMessage.addListener(function(request) {

    console.log("HELLO?")

    if (request.type === 'newWindow') {
        tab = chrome.tabs.create({
            url: chrome.runtime.getURL('popup.html'),
            active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
                // incognito, top, left, ...
            });
        });
    }
});
