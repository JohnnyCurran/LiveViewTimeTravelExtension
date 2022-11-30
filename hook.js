// Listen to event from app.js
window.addEventListener('SaveAssigns', function(e) {
  console.log('My Event Detail!', e.detail);
  if (!e.detail.time) { return; }
  chrome.storage.local.set({[e.detail.time]: e.detail.payload});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Event request', request);
    window.dispatchEvent(new CustomEvent('RestoreAssigns', {detail: request}));
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");

    sendResponse('ok');
  }
);
