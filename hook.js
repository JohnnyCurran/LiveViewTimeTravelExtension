// Listen to event from app.js
window.addEventListener('SaveAssigns', function(e) {
  console.log('My Event Detail!', e.detail);
  if (!e.detail.time) { return; }
  // TODO: Don't use time as the key, socket ID should be the key
  // object should be:
  // { socketId: {time: {payload: payload, name: name}}}
  //
  // Retrieve time key for from storage with:
  // chrome.storage.local.get(socketId)[time]
  chrome.storage.local.set({[e.detail.time]: {payload: e.detail.payload, name: e.detail.name}});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Event request', request);
    window.dispatchEvent(new CustomEvent('RestoreAssigns', {detail: request}));

    sendResponse('ok');
  }
);
