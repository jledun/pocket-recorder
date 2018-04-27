#!/usr/bin/env node
'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/', express.static('./front'));

io.on('connection', (socket) => {
  console.log('client connected');
  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

http.listen(3000, () => {
  console.log('express en écoute sur le port 3000');
});

