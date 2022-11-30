// {time: time, assigns: assigns}
timeKeys = []

function do_something(msg) {
  console.log('panel got msg', msg);
  for (time in msg) {
    // console.log(msg[time]);
    currentAssigns = msg[time].newValue.payload;
    eventName = msg[time].newValue.name;
    timeKeys.push({time: time, assigns: currentAssigns, eventName: eventName});
    console.log('new time keys', timeKeys);
    // Switch to current assigns as they come in
    document.getElementById('assigns').innerText = currentAssigns;
    document.getElementById('event-name').innerText = eventName;
  }
  console.log('time keys', timeKeys);
  updateSlider()
}

const slider = document.getElementById('restore-range');
function updateSlider() {
  slider.setAttribute('max', timeKeys.length);
}

function updateAssignsDom(timeKeyIndex) {
  assigns = timeKeys[timeKeyIndex].assigns;
  eventName = timeKeys[timeKeyIndex].eventName;
  document.getElementById('assigns').innerText = currentAssigns;
  document.getElementById('event-name').innerText = eventName;
}

// Replace current assigns using slider
slider.onchange = function(e) {
  console.log('change', e);
  timeKeyIndex = e.target.value;
  updateAssignsDom(timeKeyIndex);
}

document.getElementById('clear').onclick = function() {
  chrome.storage.local.clear();
}

document.getElementById('restore').onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    timeKey = timeKeys[slider.value].time;
    console.log('timekey', timeKey);
    chrome.tabs.sendMessage(tabs[0].id, {time: timeKey}, function(response) {
      console.log(response);
    });
  });
}
