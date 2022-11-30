var ports = [];
devtoolsPort = undefined;
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== 'devtools') return;
  ports.push(port);
  devtoolsPort = port;
  // Remove port when destroyed (eg when devtools instance is closed)
  port.onDisconnect.addListener(function() {
    var i = ports.indexOf(port);
    if (i !== -1) ports.splice(i, 1);
  });
  port.onMessage.addListener(function(msg) {
    // Received message from devtools. Do something:
    console.log('Received message from devtools port', msg);
    if (msg == 'RESTORE') {
      console.log('background received restore event');
    }
  });
});

// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
  ports.forEach(function(port) {
    port.postMessage(msg);
  });
}

messages = []

chrome.storage.onChanged.addListener(function(changes, areaName) {
  console.log('Got event', changes);
  console.log(changes);
  notifyDevtools(changes);
  // console.log('devtoolsPort', devtoolsPort)
  // if (!devtoolsPort) {
    // messages.push(changes);
    // return;
  // }
  // messages.push(changes);
  // messages.forEach(msg => devtoolsPort.postMessage(changes));
});
