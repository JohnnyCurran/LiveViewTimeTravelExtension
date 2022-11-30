timeKeys = []

function do_something(msg) {
  console.log('panel got msg', msg);
  for (time in msg) {
    timeKeys.push(time);
    // console.log(msg[time]);
    currentAssigns = msg[time].newValue;
    document.getElementById('assigns').innerText = currentAssigns;
  }
  console.log('time keys', timeKeys);
  updateSlider()
}

const slider = document.getElementById('restore-range');
function updateSlider() {
  slider.setAttribute('max', timeKeys.length);
}

document.getElementById('clear').onclick = function() {
  chrome.storage.local.clear();
}

document.getElementById('restore').onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    timeKey = timeKeys[slider.value];
    chrome.tabs.sendMessage(tabs[0].id, {time: timeKey}, function(response) {
      console.log(response);
    });
  });
}
