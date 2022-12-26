// {time: time, assigns: assigns}
// TODO: Rename timeKeys. Terrible name. Not indicative of what it's doing
// It's more like socketStates
timeKeys = []

function do_something(msg) {
  // console.log('panel got msg', msg);
  for (time in msg) {
    if (!msg[time].newValue) {
      console.error('Failed to get msg[time].newValue on msg', msg);
      return;
    }
    // console.log('msg[time].newValue', msg[time].newValue);
    currentAssigns = msg[time].newValue.payload;
    eventName = msg[time].newValue.eventName;
    socketId = msg[time].newValue.socketId;
    eventArgs = msg[time].newValue.eventArgs;
    timeKeys.push({time: time, assigns: currentAssigns, ...msg[time].newValue}); // eventName: eventName, socketId: socketId, eventArgs: eventArgs});
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
  slider.setAttribute('max', max);
  slider.setAttribute('value', value);
}

function updateAssignsDom(timeKey) {
  const {assigns, eventName, eventArgs} = timeKey;
  if (!eventArgs || !assigns) {
    return;
  }
  let prettyArgs = JSON.stringify(JSON.parse(eventArgs), null, 2);
  let prettyAssigns = JSON.stringify(JSON.parse(assigns), null, 2);
  document.getElementById('assigns').innerText = prettyAssigns;
  document.getElementById('event-name').innerText = eventName;
  document.getElementById('event-args').innerText = prettyArgs;
}

// Replace current assigns using slider
slider.oninput = function(e) {
  timeKeyIndex = e.target.value;

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
      // console.log(response);
    });
  });
}

function restoreState() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    timeKey = getTimeKey(slider.value)
    // console.log('timekey from restore', timeKey);
    updateAssignsDom(timeKey);
    // jumperKey: socketId key in TimeTravel.Jumper that corresponds with the state
    // we want to retrieve
    chrome.tabs.sendMessage(tabs[0].id, {msg: 'RestoreAssigns', time: timeKey.time, jumperKey: timeKey.socketId, component: timeKey.component, componentPid: timeKey.componentPid}, function(response) {
      console.log(response);
    });
  });
}
