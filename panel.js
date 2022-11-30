// {time: time, assigns: assigns}
timeKeys = []

function do_something(msg) {
  console.log('panel got msg', msg);
  for (time in msg) {
    console.log('msg[time]', msg[time]);
    currentAssigns = msg[time].newValue.payload;
    eventName = msg[time].newValue.name;
    timeKeys.push({time: time, assigns: currentAssigns, eventName: eventName});
    console.log('new time keys', timeKeys);
    // Switch to current assigns as they come in
    updateAssignsDom(timeKeys[timeKeys.length - 1])
    //document.getElementById('assigns').innerText = currentAssigns;
    //document.getElementById('event-name').innerText = eventName;
  }
  console.log('time keys', timeKeys);
  updateSlider()
}

function getTimeKey(index) {
  if (!timeKeys[index]) return {assigns: "", name: "", time: 0};
  return timeKeys[index];
}

const slider = document.getElementById('restore-range');
function updateSlider() {
  slider.setAttribute('max', timeKeys.length - 1);
}

function updateAssignsDom(timeKey) {
  assigns = timeKey.assigns;
  eventName = timeKey.eventName;
  document.getElementById('assigns').innerText = currentAssigns;
  document.getElementById('event-name').innerText = eventName;
}

// Replace current assigns using slider
slider.onchange = function(e) {
  console.log('change', e);
  timeKeyIndex = e.target.value;

  updateAssignsDom(getTimeKey(timeKeyIndex));
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
