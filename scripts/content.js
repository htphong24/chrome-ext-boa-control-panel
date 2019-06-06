// This section is for main page (the page where you click the extension)
console.log("content.js is running!");

// Load buttons
$.ajax({
  url: chrome.extension.getURL("inject.html"),
  dataType: "html",
  success: function(data) {
    $(".form-group:last-child").before(data);
    
    //var url = window.location.href;
    var url = "https://rc-control-panel.insightbroking.com.au/Ledgers/Details/373"; // TESTING

    // div-access-ledger-support
    if (!url.includes("/Ledgers/CreateReadOnlyDbUser/")) {
      $("#div-access-ledger-support").css("display","none");
    }
    $("#btn-access-ledger-support").click(sendData);
    
    // div-access-ledger-admin
    $("#btn-access-ledger-admin").click(sendData);
    
    // div-access-ledger-auth
    $("#btn-access-ledger-auth").click(sendData);
    
    // div-retrieve-ledger-admin
    $("#btn-retrieve-ledger-admin").click(sendData);
    
    // div-retrieve-ledger-admin-result
    $("#btn-copy-extension-username").click(copyLogin);
    $("#btn-copy-extension-password").click(copyLogin);
    $("#div-retrieve-ledger-admin-result").css("display","none");
  }
});

// 2. + 11. Receive message from extension.js/background.js (native app)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("[content.js] something happening from the extension");
  //var data = request.data || {};

  console.log("[content.js] request from extension.js/background.js:");
  console.log(request);
  
  // if this is not a message (originally) from native app 
  if (!request.Status) {
    // 3. send data to extension.js
    sendData(request.Action)
  }
  // this is a message (originally) from native app
  else {
    console.log("[content.js] data sent (originally) from native app");
    // if it's retrieve-ledger-admin action, then show the modal with username and password received from native app
    if (request.Action == "retrieve-ledger-admin") {
      $("#extension-username").val(""); // reset username
      $("#extension-password").val(""); // reset password
      $("#extension-username").val(request.Username);
      $("#extension-password").val(request.Password);
      $("#div-retrieve-ledger-admin-result").css("display","block");
    }
  }
});

function sendData() {
  var regex; // regular expression pattern
  
  // get control panel (e.g. rc/sandpit/prodau...)
  //var url = window.location.href;
  // sample 1: https://rc-control-panel.insightbroking.com.au/Ledgers/Details/373
  // sample 2: https://rc-control-panel.insightbroking.com.au/Ledgers/CreateReadOnlyDbUser/373
  var url = "https://rc-control-panel.insightbroking.com.au/Ledgers/Details/373"; // TESTING
  regex = /(?<=https:\/\/).+(?=(-control-panel))/g; // get the string after "https://" and before "-control-panel"
  var controlPanel = url.match(regex); // should be "xxxx"
  
  // get ledger Id
  var ledgerIdLabel = document.querySelector("h3 label").textContent; // e.g. "Id: 1234"
  regex = /[0-9]+/g; // get the number
  var ledgerId = ledgerIdLabel.match(regex); // should be "1234"

  // get ledger name
  var ledgerNameInnerText =  document.querySelector("h3").innerText; // e.g. "AAA Insurance Brokers    Id: 1234 Back to Ledger Details"
  regex = /[\s\S]+(?=([\s]{4}Id:\s[\d]+))/g; // get the string before "    Id: 1234"
  var ledgerName = ledgerNameInnerText.match(regex); // should be "AAA Insurance Brokers"

  // get server name
  var serverName = url.includes("/Ledgers/CreateReadOnlyDbUser/") ? $("#DatabaseServer").val() : "";
  // get database name
  var dbName = url.includes("/Ledgers/CreateReadOnlyDbUser/") ? $("#DatabaseName").val() : "";
  // get username
  var username = url.includes("/Ledgers/CreateReadOnlyDbUser/") ? $("#Username").val() : "";
  // get password
  var password = url.includes("/Ledgers/CreateReadOnlyDbUser/") ? $("#Password").val() : "";

  // create data to send to extension.js
  var data = {
    Action: this.getAttribute("data-action"),
    Data: {
      ControlPanel: (!controlPanel) ? "" : controlPanel[0],
      LedgerDetails: {
        Id: (!ledgerId) ? "" : ledgerId[0],
        Name: (!ledgerName) ? "" : ledgerName[0],
        DBLogin: {
          ServerName: serverName,
          DatabaseName: dbName,
          Username: username,
          Password: password
        }
      }
    }
  };

  // 1. send message to background.js
  chrome.runtime.sendMessage(data);
}

function copyLogin(e) {
  var id = this.getAttribute("id");
  if (id == "btn-copy-extension-username") {
    copyData("extension-username");
  }
  else if (id == "btn-copy-extension-password") {
    copyData("extension-password");
  }
}

function copyData(id) {
  // Get the text field
  var copyText = document.getElementById(id);
  // Select the text field
  copyText.select();
  // Copy the text inside the text field
  document.execCommand("copy");
  // Alert the copied text
  // alert("Copied the text: " + copyText.value);
}