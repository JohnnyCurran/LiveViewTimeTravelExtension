function do_something(msg) {
  console.log('panel got msg', msg);
  currentAssigns = msg.payload.newValue;
  console.log(msg);
  document.getElementById('assigns').innerText = currentAssigns;
}

document.getElementById('restore').onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
  });
}
