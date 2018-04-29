'use strict';

const aRecord = require('node-arecord');
const aPlay = require('node-aplay');
const utils = require('./utils.js');
const fs = require('fs');
const { exec } = require('child_process');
const Rx = require('rxjs/Rx');

const refreshFilename = (options) => {
  return Object.assign(options, {filename: 'record-'.concat(utils.getTimeStamp(), '.wav')});
};

const noop = () => {};

const o = {
  status: {
    playing: 0,
    recording: 0,
    msg: 'init',
    set: (mode, value, msg) => {
      if (!mode || (mode !== 'playing' && mode !== 'recording')) throw new Error('mode de fonctionnement mal défini : ' + mode);
      o.status[mode] = value;
      o.status.msg = msg;
      if (o.socket) o.socket.emit('status', Object.assign({}, o.status));
    }, sendFileData: (data) => {
      o.fsdata = Object.assign({}, data);
      if (o.socket) o.socket.emit('files', o.fsdata);
    }
  },
  options: {
    debug: true,
    destination_folder: require('./config.json').path,
    filename: 'record-'.concat(utils.getTimeStamp(), '.wav'),
    alsa_format: 'cd',
    alsa_device: require('./config.json').alsa_device
  },
  player: {},
  recorder: {},
  interval: 0,
  setSocket: socket => {
    o.socket = socket;
    if (o.interval) clearInterval(o.interval);
    if (o.socket) {
      o.socket.on('new', () => {
        let stopPlayDone = false;
        let stopRecordDone = false;
        while (o.status.playing > 0) {
          if (!stopPlayDone) {
            o.stopPlay();
            stopPlayDone = true;
          }
        }
        while(o.status.recording > 0) {
          if (!stopRecordDone) {
            o.stopRecord();
            stopRecordDone = true;
          }
        }
        o.record();
      });
      o.socket.on('play', o.play);
      o.socket.on('stop', () => {
        if (o.status.playing > 0) return o.stopPlay();
        if (o.status.recording > 0) return o.stopRecord();
      });
      o.socket.on('pause', () => {
        if (o.status.playing > 0) return o.pausePlay();
        if (o.status.recording > 0) return o.pauseRecord();
      });
      o.socket.on('resume', () => {
        if (o.status.playing > 0) return o.resumePlay();
        if (o.status.recording > 0) return o.resumeRecord();
      });
      o.socket.on('stopPlay', o.stopPlay);
      o.socket.on('pausePlay', o.pausePlay);
      o.socket.on('resumePlay', o.resumePlay);
      o.socket.on('stopRecord', o.stopRecord);
      o.socket.on('pauseRecord', o.pauseRecord);
      o.socket.on('resumeRecord', o.resumeRecord);
      o.socket.on('playItem', o.playItem);
      o.socket.on('rename', o.rename);
      o.socket.on('delete', o.delete);
      o.socket.on('shutdown', o.shutdown);
      o.socket.on('reboot', o.reboot);
      o.interval = setInterval(() => o.getFiles.call(this, o), 1000);
    }
  },
  cmdExec: cmd => {
    exec(cmd, (err, stout, sterr) => {
      if (err) return console.log(err);
      console.log(stout);
      console.log(sterr);
    });
  },
  shutdown: () => {
    o.cmdExec('sudo systemctl poweroff');
  },
  reboot: () => {
    o.cmdExec('sudo systemctl reboot');
  },
  rename: (data) => {
    if (!o.fsdata) return;
    if (!o.fsdata.files || o.fsdata.files.length <= 0) return;
    if (!o.fsdata.files[data.item]) return;
    o.options.filename = o.fsdata.files[data.item].filename;
    o.cmdExec("mv ".concat("\"", o.options.destination_folder, '/', o.options.filename, '\" \"', o.options.destination_folder, '/', data.newName, "\""));
  },
  delete: item => {
    if (!o.fsdata) return;
    if (!o.fsdata.files || o.fsdata.files.length <= 0) return;
    if (!o.fsdata.files[item]) return;
    o.cmdExec("rm ".concat("\"", o.options.destination_folder, '/', o.fsdata.files[item].filename, "\""));
  },
  playItem: item => {
    if (!o.fsdata) return;
    if (!o.fsdata.files || o.fsdata.files.length <= 0) return;
    if (!o.fsdata.files[item]) return;
    o.options.filename = o.fsdata.files[item].filename;
    o.play();
  },
  record: () => {
    o.options = refreshFilename(o.options);
    o.recorder = new aRecord(o.options);
    o.recorder.on('complete', () => o.status.set('recording', 0, `Enregistrement ${o.options.filename} terminé.`));
    o.recorder.on('stop', () => o.status.set('recording', 0, `Enregistrement ${o.options.filename} arrêté.`));
    o.recorder.on('pause', () => o.status.set('recording', 2, `Enregistrement ${o.options.filename} en pause...`));
    o.recorder.on('resume', () => o.status.set('recording', 1, `Enregistrement ${o.options.filename} en cours...`));
    o.recorder.record();
    o.status.set('recording', 1, `Enregistrement ${o.options.filename} en cours...`);
  },
  stopRecord: () => o.recorder.stop(),
  pauseRecord: () => o.recorder.pause(),
  resumeRecord: () => o.recorder.resume(),
  play: () => {
    o.player = new aPlay(o.options.destination_folder.concat('/', o.options.filename));
    o.player.on('complete', () => o.status.set('playing', 0, `Lecture ${o.options.filename} terminée.`));
    o.player.on('stop', () => o.status.set('playing', 0, `Lecture ${o.options.filename} arrêtée.`));
    o.player.on('pause', () => o.status.set('playing', 2, `Lecture ${o.options.filename} en pause...`));
    o.player.on('resume', () => o.status.set('playing', 1, `Lecture ${o.options.filename} en cours...`));
    o.player.play();
    o.status.set('playing', 1, `Lecture ${o.options.filename} en cours...`);
  },
  pausePlay: () => o.player.pause(),
  resumePlay: () => o.player.resume(),
  stopPlay: () => o.player.stop(),
  files: [],
  getFiles: (p) => {
    let result = {};
    Rx.Observable.of('df').concatMap(cmd => {
      return Rx.Observable.create(o => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) return o.error(err);
          let tmp = {};
          let out = stdout.split("\n")
          .filter(line => line.indexOf("/dev/root") >= 0)[0]
          .split(" ")
          .filter(line => line !== "")
          .forEach((line, i) => {
            switch(i) {
              case 1:
              tmp.total = line;
              break;
              case 2:
              tmp.used = line;
              break;
              case 3:
              tmp.free = line;
              break;
              case 4:
              tmp.rate = line.substring(0, 2);
              break;
            }
          });
          o.next(Object.assign({}, {stdout: tmp, stderr: stderr}));
          o.complete();
        });
      });
    }).concatMap(dfResult => {
      result.filesystem = dfResult;
      return Rx.Observable.of(p.options.destination_folder);
    }).concatMap(path => {
      return Rx.Observable.create(o => {
        fs.readdir(path, {encoding: 'utf-8'}, (err, files) => {
          if (err) return o.error(err);
          o.next(files.filter(file => file.indexOf(".wav") >= 0));
          o.complete();
        })
      });
    }).concatMap(files => {
      return Rx.Observable.forkJoin(files.map(filename => {
        return Rx.Observable.of({
          path: "".concat(p.options.destination_folder),
          filename: "".concat(filename),
          type: "wav"
        });
      }));
    }).defaultIfEmpty('NO_EFFECT').concatMap(files => {
      return Rx.Observable.forkJoin(files.map(file => {
        return Rx.Observable.create(o => {
          fs.stat(file.path.concat('/', file.filename), (err, stats) => {
            if (err) return o.error(err);
            o.next(Object.assign({}, file, {stat: stats}));
            o.complete();
          })
        })
      }));
    }).defaultIfEmpty('NO_EFFECT').concatMap(files => {
      result = Object.assign({}, result, {files: files});
      return Rx.Observable.of(result.files.find(file => file.filename === p.options.filename));
    }).subscribe(
      data => {
        result.currentRecording = data;
        p.status.sendFileData(result);
      },
      err => console.log(err),
      noop
    );
  }
};

module.exports = o;
