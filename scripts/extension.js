document.addEventListener('DOMContentLoaded', function() {

  // TEST
  var btn_test = $("#btn-test");
  btn_test.click(function() {
    // 1. send message to content.js
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("[extension.js] tabs");
      console.log(tabs);
      chrome.tabs.sendMessage(tabs[0].id, { Action: "test" }, function(response) {
        console.log("[extension.js] response from content.js:");
        console.log(response);
        if (!response) {
          alert("Data not received.");
        }
        else {
          console.log("[extension.js] sending message from button btn-test to background.js");
          // 4. then send message to background.js
          chrome.runtime.sendMessage(response);
        }
      });
    });
  });
  btn_test.css("display","none");

  // Access RC Control Panel DB with admin account
  var btn_access_rc_cp = $("#btn-access-rc-cp");
  btn_access_rc_cp.click(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // send message to content.js
      chrome.tabs.sendMessage(tabs[0].id, { Action: "access-rc-cp" }, function(response) {
        console.log("response from content.js:");
        console.log(response);
        if (!response) {
          alert("Data not received.");
        }
        else {
          console.log("sending message from button btn-access-rc-cp to background.js");
          // then send message to background.js
          chrome.runtime.sendMessage(response);
        }
      });
    });
  });

  // Access Sandpit Control Panel DB with admin account
  var btn_access_sandpit_cp = $("#btn-access-sandpit-cp");
  btn_access_sandpit_cp.click(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // send message to content.js
      chrome.tabs.sendMessage(tabs[0].id, { Action: "access-sandpit-cp" }, function(response) {
        console.log("[extension.js] response from content.js:");
        console.log(response);
        if (!response) {
          alert("Data not received.");
        }
        else {
          console.log("sending message from button btn-access-sandpit-cp to background.js");
          // then send message to background.js
          chrome.runtime.sendMessage(response);
        }
      });
    });
  });

});

// 9. receive message from background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("[extension.js] Message from background.js")
  console.log(request);

  // if it's retrieve-ledger-admin action, then show the modal with username and password received from native app
  // if (request.Action == "retrieve-ledger-admin") {
  //   $("#txt-ledger-admin-username").value = request.Username;
  //   $("#txt-ledger-admin-password").value = request.Password;
  //   $("#modal-ledger-admin-login-info").modal("show");
  // }
});
