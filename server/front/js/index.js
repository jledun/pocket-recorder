
const socket = io();
let fsdata = {};
let config = {};
let busy = true;

function setBusy(value) {
  switch (value) {
    case true:
    document.getElementById('loader').style.display = 'block';
    break;
    default:
    document.getElementById('loader').style.display = 'none';
    break;
  }
  busy = false;
}
socket.on('status', status => {
  document.getElementById('srvStatus').innerHTML = status.msg || "Prêt :-)";
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
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
});
socket.on('files', filedatas => {
  if (location.pathname !== "/" && location.pathname !== "/index.html") return;
  let tmp = '<ul class="filelist-container">';
  if (filedatas.files.length > 0) {
    filedatas.files.forEach((file, i) => {
      tmp = tmp.concat(`
        <li class="filelist-item${(filedatas.currentRecording && filedatas.currentRecording.filename && file.filename === filedatas.currentRecording.filename) ? ' selected' : ''}">
          <span>${file.filename}</span>
          <span>(${file.stat.size})</span>
          <span class="spring"></span>
          <span>
            <span><button onclick="onClickDelete(${i})">Supprimer</button></span>
            <span><button onclick="onClickRename(${i})">Renommer</button></span>
          </span>
          <span>
            <span><button><a href="${window.location.origin}/download?file=${file.path.concat('/', file.filename)}" target="_blank">Télécharger</a></button></span>
            <span><button onclick="onClickPlayItem(${i})">Lire</button></span>
          </span>
        </li>
        `);
    });
  }else{
    tmp = tmp.concat('<li class="filelist-item" style="font-style: italic;">Dossier vide</li>');
  }
  tmp = tmp.concat("</ul>");
  document.getElementById('filelist').innerHTML = tmp;
  setBusy(false);
});
socket.on('config', config => {
  config = Object.assign({}, config);
  document.getElementById('field-destination-folder').value = config.destination_folder || "";
  document.getElementById('field-alsa-format').value = config.alsa_format || "";
  document.getElementById('field-alsa-device').value = config.alsa_device || "";
  document.getElementById('field-debug').checked = config.debug || false;
});
function onClickShutdown() {
  if (confirm("Sûr(e) que tu veux arrêter ce superbe ordi ?")) {
    setBusy(true);
    socket.emit('shutdown');
  }
}
function onClickReboot() {
  if (confirm("Sûr(e) que tu veux me redémarrer ?")) {
    setBusy(true);
    socket.emit('reboot');
  }
}
function onClickDelete(item) {
  let response = confirm("Sûr(e) ?");
  if (response) {
    setBusy(true);
    socket.emit('delete', item);
  }
}
function onClickRename(item, defaultFilename = "*.wav") {
  let response = prompt("Nouveau nom", defaultFilename);
  if (response) {
    setBusy(true);
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
function configReload() {
  config = {};
  socket.emit('getConfig');
}
function onClickSaveOptions() {
  const newConfig = {
    destination_folder: document.getElementById('field-destination-folder').value,
    alsa_device: document.getElementById('field-alsa-device').value,
    alsa_format: document.getElementById('field-alsa-format').value,
    debug: document.getElementById('field-debug').checked,
    filename: ""
  };
  socket.emit('updateConfig', newConfig);
}

window.onload = () => {
  setBusy(true);
  switch (location.pathname) {
    case "/options.html":
    setTimeout(configReload, 500);
    break;
  }
}
