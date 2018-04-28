
const socket = io();
socket.on('status', status => {
  if (status.recording > 0) {
    document.getElementById("recorder").style.display = "block";
    document.getElementById("player").style.display = "none";
    document.getElementById("soundManager").style.display = "none";
    switch (status.recording) {
      case 1:
      document.getElementById("resumeRecord").style.visibility = 'hidden';
      document.getElementById("pauseRecord").style.visibility = 'visible';
      break;
      case 2:
      document.getElementById("resumeRecord").style.visibility = 'visible';
      document.getElementById("pauseRecord").style.visibility = 'hidden';
      break;
    }
  }else if (status.playing > 0) {
    document.getElementById("recorder").style.display = "none";
    document.getElementById("player").style.display = "block";
    document.getElementById("soundManager").style.display = "none";
    switch (status.playing) {
      case 1:
      document.getElementById("resumePlay").style.visibility = 'hidden';
      document.getElementById("pausePlay").style.visibility = 'visible';
      break;
      case 2:
      document.getElementById("resumePlay").style.visibility = 'visible';
      document.getElementById("pausePlay").style.visibility = 'hidden';
      break;
    }
  }else{
    document.getElementById("recorder").style.display = "none";
    document.getElementById("player").style.display = "none";
    document.getElementById("soundManager").style.display = "block";
  }
  document.getElementById('srvStatus').innerHTML = status.msg || "Prêt :-)";
});
socket.on('files', filedatas => {
  let tmp = "<ul>";
  filedatas.files.forEach(file => {
    tmp = tmp.concat(`<li>${file.filename}</li>`);
  });
  tmp = tmp.concat("</ul>");
  document.getElementById('filelist').innerHTML = tmp;
})

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

