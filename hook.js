console.log('hook injected');
console.log('injecting websocket');

// Channel can be found by getting element with data-phx-root-id
// the /live socket sends diffs back
// when we want full assigns
// whenever the assigns of a LiveView change
// Listen to Telemetry events on a separate socket ??
//console.log('creating socket for time travel debugging');
//var timeTravelSocket = new window.WebSocket("ws://localhost:4000/socket")
//timeTravelSocket.addEventListener('connect', function() {
  //console.log('connected!', ...arguments);
//});

var s = document.createElement("script");


function hookWebSocket() {
  const IM_NOT_SURE = 0;
  const IM_NOT_SURE_EITHER = 1;
  const TOPIC = 2;
  const MSG = 3;
  const REPLY = 4;

  window.RealWebSocket = window.WebSocket;

  window.WebSocket = function() {
    var socket = new window.RealWebSocket(...arguments);

    socket.addEventListener('message', (e) => {
      // console.log(e);
      channelReply = JSON.parse(e.data);

      if (channelReply.at(TOPIC) != 'lvdbg') {
        return;
      }

      console.log('channel reply', channelReply);

      const msg = channelReply.at(MSG);
      console.log('Lv Dbg msg', msg);

      const replyData = channelReply.at(REPLY);
      console.log('Lv Dbg data', replyData);
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
