#!/usr/bin/env node
'use strict';

const aRecord = require('node-arecord');
const aPlay = require('node-aplay');
const utils = require('./utils.js');

const refreshFilename = (options) => {
  return Object.assign(options, {filename: 'record-'.concat(getTimeStamp(), '.wav')});
};

const o = {
  status: {},
  options: {
    debug: true,
    destination_folder: "/home/pi/Music",
    filename: 'record-'.concat(utils.getTimeStamp(), '.wav'),
    alsa_format: 'cd',
    alsa_device: 'plughw:1,0'
  }
};
o.player = {};
o.recorder = new aRecord(o.options);
o.recorder.on("error", (err) => {
  console.log(err);
});
o.recorder.on("complete", () => {
  console.log('enregistrement terminé.');
});

o.recorder.record();

module.exports = o;
