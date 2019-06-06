console.log('BACKGROUND SCRIPT IS RUNNING');

// 5. receive message from extension.js 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (chrome.runtime.lastError) {
    console.log("ERROR: (chrome.runtime.onMessage.addListener)");
    console.log(chrome.runtime.lastError);
  } else {
    console.log("blah");
  }
  // 6. then perform sending message to native app
  chrome.runtime.sendNativeMessage('boa_ssms', request, function (nativeapp_response) {
    // 7. receive message from native app
    if (chrome.runtime.lastError) {
      console.log("ERROR: (chrome.runtime.sendNativeMessage)");
      console.log(chrome.runtime.lastError);
    } else {
      console.log("Congrats! No error! Now writing response from native app...")
      console.log(nativeapp_response);
      // 8. send message to content.js
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, nativeapp_response); // do not specify callback function since the native app is closed already
      });

      // 8. then send message to extension.js, note: do not specify callback function 
      //chrome.runtime.sendMessage(response);
    }
  });
});
