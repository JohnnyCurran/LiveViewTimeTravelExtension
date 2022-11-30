function do_something(msg) {
  console.log('panel got msg');
  msg = msg.payload.newValue;
  console.log(msg);
  // document.body.textContent += '\n' + msg; // Stupid example, PoC
  document.getElementById('assigns').innerText = msg;
}

document.getElementById('restore').onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
  });
}

document.documentElement.onclick = function() {
  // No need to check for the existence of `respond`, because
  // the panel can only be clicked when it's visible...
  respond('Another stupid example!');
};
