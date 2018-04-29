
const socket = io();
let fsdata = {};

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
  let tmp = '<ul class="filelist-container">';
  filedatas.files.forEach((file, i) => {
    tmp = tmp.concat(`
      <li class="filelist-item${(filedatas.currentRecording && filedatas.currentRecording.filename && file.filename === filedatas.currentRecording.filename) ? ' selected' : ''}">
      <span>${file.filename}</span>
      <span class="spring"></span>
      <span><button onclick="test(${i})">Test</button></span>
      <span><button onclick="onClickDelete(${i})">Supprimer</button></span>
      <span><button onclick="onClickRename(${i})">Renommer</button></span>
      <span><button><a href="${window.location.href}download?file=${file.path.concat('/', file.filename)}" target="_blank">Télécharger</a></button></span>
      <span><button onclick="onClickPlayItem(${i})">Lire</button></span>
      </li>
      `);
  });
  tmp = tmp.concat("</ul>");
  document.getElementById('filelist').innerHTML = tmp;
});
function test() {
  alert(window.location.host);
}
function onClickShutdown() {
  if (confirm("Sûr(e) que tu veux arrêter ce superbe ordi ?")) socket.emit('shutdown');
}
function onClickReboot() {
  if (confirm("Sûr(e) que tu veux me redémarrer ?")) socket.emit('reboot');
}
function onClickDelete(item) {
  let response = confirm("Sûr(e) ?");
  if (response) socket.emit('delete', item);
}
function onClickRename(item, defaultFilename = "*.wav") {
  let response = prompt("Nouveau nom", defaultFilename);
  if (response) {
    socket.emit('rename', {item: item, newName: response.replace(' ', '-')});
  }
}
function onClickPlayItem(item) {
  socket.emit('playItem', item);
}
function onClickDownload(item) {
  alert('not implemented yet :-( ' + item);
}

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

