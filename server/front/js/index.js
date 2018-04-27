
const socket = io();
socket.on('status', status => {
  if (status.recording > 0) {
    document.getElementById("recorder").style.display = "block";
    document.getElementById("player").style.display = "none";
    document.getElementById("soundManager").style.display = "none";
    switch (status.recording) {
      case 1:
      document.getElementById("resumeRecord").disabled = true;
      document.getElementById("pauseRecord").disabled = false;
      break;
      case 2:
      document.getElementById("resumeRecord").disabled = false;
      document.getElementById("pauseRecord").disabled = true;
      break;
    }
  }else if (status.playing > 0) {
    document.getElementById("recorder").style.display = "none";
    document.getElementById("player").style.display = "block";
    document.getElementById("soundManager").style.display = "none";
    switch (status.playing) {
      case 1:
      document.getElementById("resumePlay").disabled = true;
      document.getElementById("pausePlay").disabled = false;
      break;
      case 2:
      document.getElementById("resumePlay").disabled = false;
      document.getElementById("pausePlay").disabled = true;
      break;
    }
  }else{
    document.getElementById("recorder").style.display = "none";
    document.getElementById("player").style.display = "none";
    document.getElementById("soundManager").style.display = "block";
  }
  document.getElementById('srvStatus').innerHTML = status.msg;
});

function onClickNew() {
  socket.emit('new');
}
function onClickPlay() {
  socket.emit('play');
}
function onClickStopPlay() {
  socket.emit('stopPlay');
}
function onClickPausePlay() {
  socket.emit('pausePlay');
}
function onClickResumePlay() {
  socket.emit('resumePlay');
}
function onClickStopRecord() {
  socket.emit('stopRecord');
}
function onClickPauseRecord() {
  socket.emit('pauseRecord');
}
function onClickResumeRecord() {
  socket.emit('resumeRecord');
}

