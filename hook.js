// Listen to event from app.js
window.addEventListener('SaveAssigns', function(e) {
  console.log('My Event Detail!', e.detail);
  if (!e.detail.time) { return; }
  // Retrieve time key for from storage with:
  // chrome.storage.local.get(socketId)[time]
  chrome.storage.local.set({[e.detail.time]: {
    payload: e.detail.payload,
    eventName: e.detail.event_name,
    socketId: e.detail.socket_id,
    eventArgs: e.detail.event_args,
    component: e.detail.component,
    componentId: e.detail.component_id
  }});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.msg) {
      case 'RestoreAssigns':
        return restoreAssigns(request, sendResponse);
      case 'ClearAssigns':
        return clearAssigns(request, sendResponse);
      default:
        return;
    }
  }
);

function restoreAssigns(request, sendResponse) {
  window.dispatchEvent(new CustomEvent('RestoreAssigns', {detail: request}));
  sendResponse('ok');
}

function clearAssigns(request, sendResponse) {
  window.dispatchEvent(new CustomEvent('ClearAssigns'));
  sendResponse('ok');
}
