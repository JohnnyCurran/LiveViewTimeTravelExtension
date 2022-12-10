// Listen to event from app.js
window.addEventListener('SaveAssigns', function(e) {
  console.log('My Event Detail!', e.detail);
  if (!e.detail.time) { return; }
  // TODO: socket ID should be in the payload
  // object should be:
  // { socketId: {time: {payload: payload, name: name}}}
  // { time: {payload: payload, eventName: eventName, socketId: socketId} }
  //
  //
  // Retrieve time key for from storage with:
  // chrome.storage.local.get(socketId)[time]
  chrome.storage.local.set({[e.detail.time]: {payload: e.detail.payload, eventName: e.detail.event_name, socketId: e.detail.socket_id}});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg != 'RestoreAssigns') {
      return;
    }
    console.log('Restore event request', request);
    window.dispatchEvent(new CustomEvent('RestoreAssigns', {detail: request}));

    sendResponse('ok');
  }
);
