'use strict';

const aRecord = require('node-arecord');
const aPlay = require('node-aplay');
const utils = require('./utils.js');

const refreshFilename = (options) => {
  return Object.assign(options, {filename: 'record-'.concat(utils.getTimeStamp(), '.wav')});
};

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
    }
  },
  options: {
    debug: true,
    destination_folder: "/home/pi/Music",
    filename: 'record-'.concat(utils.getTimeStamp(), '.wav'),
    alsa_format: 'cd',
    alsa_device: 'plughw:1,0'
  },
  player: {},
  recorder: {},
  setSocket: socket => {
    o.socket = socket;
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
    }
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
  stopPlay: () => o.player.stop()
};

module.exports = o;
