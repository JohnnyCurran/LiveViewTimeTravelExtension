function do_something(msg) {
  console.log('panel got msg');
  msg = msg.payload.newValue;
  console.log(msg);
  // document.body.textContent += '\n' + msg; // Stupid example, PoC
  document.getElementById('assigns').innerText = msg;
}

document.documentElement.onclick = function() {
  // No need to check for the existence of `respond`, because
  // the panel can only be clicked when it's visible...
  respond('Another stupid example!');
};
