var ports = [];
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== 'devtools') return;
  ports.push(port);
  // Remove port when destroyed (eg when devtools instance is closed)
  port.onDisconnect.addListener(function() {
    console.log('Port disconnected!');
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });

  port.onMessage.addListener(function(msg) {
    // console.log('Received message from devtools port', msg);
  });
});

// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
  ports.forEach(function(port) {
    port.postMessage(msg);
  });
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
  notifyDevtools(changes);
});
