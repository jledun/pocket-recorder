Pocket Recorder Project with alsa arecord and aplay

## Setup 

All the configuration is in server/config.json

This setup is made for a fresh raspbian install and a usb soundcard is connected to alsa.

## install and run

from you home folder on your Raspberry Pi 3:

```bash
$> cd ~/Documents
$> git clone https://github.com/jledun/pocket-recorder.git PocketRecorderProject
$> cd PocketRecorderProject/server
$> npm install
$> sudo cp recordServer.service /lib/systemd/system/
$> sudo systemctl daemon-reload
$> sudo systemctl start recordServer
```

## Other options

My RPI3 is set as a wifi Access Point so that :
* it's connected right next to my sound mixer
* provides a wifi network
* my smartphone is connected to this network and manage recordings

My RPI3 shares a public folder where I share my lyrics and chords with my friends.

