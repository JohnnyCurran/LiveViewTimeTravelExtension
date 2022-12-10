// {time: time, assigns: assigns}
// TODO: Rename timeKeys. Terrible name. Not indicative of what it's doing
// It's more like socketStates
timeKeys = []

function do_something(msg) {
  //console.log('panel got msg', msg);
  for (time in msg) {
    if (!msg[time].newValue) {
      console.log('Failed to get msg[time].newValue on msg', msg);
      return;
    }
    // console.log('msg[time]', msg[time]);
    currentAssigns = msg[time].newValue.payload;
    eventName = msg[time].newValue.eventName;
    socketId = msg[time].newValue.socketId
    timeKeys.push({time: time, assigns: currentAssigns, eventName: eventName, socketId: socketId});
    // console.log('new time keys', timeKeys);
    updateAssignsDom(timeKeys[timeKeys.length - 1])
  }
  updateSlider(timeKeys.length - 1, timeKeys.length - 1)
}

function getTimeKey(index) {
  if (!timeKeys[index]) return {assigns: "", name: "", time: 0};
  return timeKeys[index];
}

const slider = document.getElementById('restore-range');
function updateSlider(max, value) {
  //console.log('updating slider value max', max);
  //console.log('updating slider value value', value);
  slider.setAttribute('max', max);
  slider.setAttribute('value', value);
}

function updateAssignsDom(timeKey) {
  assigns = timeKey.assigns;
  eventName = timeKey.eventName;
  prettyAssigns = JSON.stringify(JSON.parse(assigns), null, 2);
  document.getElementById('assigns').innerText = prettyAssigns;
  document.getElementById('event-name').innerText = eventName;
}

// Replace current assigns using slider
slider.oninput = function(e) {
  // console.log('change', e);
  timeKeyIndex = e.target.value;

  //console.log('target value', e.target.value);
  //console.log('dom value', slider.value);

  restoreState();
  updateAssignsDom(getTimeKey(timeKeyIndex));
  updateSlider(timeKeys.length - 1, e.target.value);
}

document.getElementById('clear').onclick = function() {
  chrome.storage.local.clear();
  timeKeys = [];
  updateSlider(0, 0);
  updateAssignsDom({eventName: "", assigns: "{}"});
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {msg: 'ClearAssigns'}, function(response) {
      console.log(response);
    });
  });
}

document.getElementById('restore').onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    timeKey = getTimeKey(slider.value)
    console.log('timekey from restore', timeKey);
    updateAssignsDom(timeKey);
    // jumperKey: socketId key in TimeTravel.Jumper that corresponds with the state
    // we want to retrieve
    chrome.tabs.sendMessage(tabs[0].id, {msg: 'RestoreAssigns', time: timeKey.time, jumperKey: timeKey.socketId}, function(response) {
      console.log(response);
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.storeAssigns) {
      console.log('storing assigns message received', request);
    }
  }
);
