chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error injecting content script:", chrome.runtime.lastError);
        }
    });
});
