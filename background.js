let pluginActive = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'togglePlugin') {
    pluginActive = request.active;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'togglePlugin', active: pluginActive});
    });
  }
});