console.log('hook injected');
console.log('injecting websocket');

//console.log('before', window.WebSocket);

//console.log('before should be T', window.WebSocket == window.WebSocket);
//window.RealSocket = window.WebSocket;

//console.log('before should be T', window.RealSocket == window.WebSocket);
//window.WebSocket = function() {
  //console.log('!!!!! New WebSocket !!!!');
  //var socket = new window.RealSocket(...arguments);
  //socket.onmessage = function(event) {
    //console.log('the phoenix is Mortal', event);
  //};
//
  //return socket;
//}

//console.log('after', window.RealSocket == window.WebSocket);
//while(document == null || document.head == null);

var s = document.createElement("script");

function hookWebSocket() {
  window.RealWebSocket = window.WebSocket;

  window.WebSocket = function() {
    var socket = new window.RealWebSocket(...arguments);

    socket.addEventListener('message', (e) => {
      console.log('The Phoenix is Mortal', e);
    });

    return socket;
  }
}

s.innerHTML = `${hookWebSocket.toString()}
  hookWebSocket();`;

var timer = undefined;
timer = setTimeout(function() {
  if (document.head) {
    document.head.prepend(s);
    clearTimeout(timer);
  }
}, 10);
