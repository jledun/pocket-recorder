#!/usr/bin/env node
'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sound = require('./sound-manager.js');

app.use('/', express.static('./front'));

io.on('connection', (socket) => {
  sound.setSocket(socket);
  socket.on('disconnect', () => {
    sound.setSocket(null);
  });
  socket.emit('status', "Prêt :-)");
});

http.listen(3000, () => {
  console.log('express en écoute sur le port 3000');
});

