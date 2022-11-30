console.log('Injecting Websocket');

// Channel can be found by getting element with data-phx-root-id
// when we want full assigns
// whenever the assigns of a LiveView change
// Listen to Telemetry events on a separate socket ??

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
      channelReply = JSON.parse(e.data);

      if (channelReply.at(TOPIC) != 'lvdbg') {
        return;
      }

      console.log('channel reply', channelReply);

      const msg = channelReply.at(MSG);
      console.log('Lv Dbg msg', msg);

      const replyData = channelReply.at(REPLY);
      console.log('Lv Dbg data', replyData);

      window.dispatchEvent(new CustomEvent('SaveAssigns', {detail: replyData}));
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

window.addEventListener('SaveAssigns', function(e) {
  console.log('My Event Detail!', e.detail);
  chrome.storage.local.set({[e.detail.time]: e.detail.payload});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    window.dispatchEvent(new CustomEvent('RestoreAssigns', {detail: 'hello there'}));
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    // if (request.greeting === "hello")
      // sendResponse({farewell: "goodbye"});
  }
);
