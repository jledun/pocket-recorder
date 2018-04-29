Pocket Recorder Project with alsa arecord and aplay

## Setup 

All the configuration is in server/config.json

This setup is made for a fresh raspbian install and a usb soundcard is connected to alsa.

## install and run

from you home folder on your Raspberry Pi 3:

```bash
> cd ~/Documents
> git clone https://github.com/jledun/pocket-recorder.git PocketRecorderProject
> cd PocketRecorderProject/server
> npm install
> sudo cp recordServer.service /lib/systemd/system/
> sudo systemctl daemon-reload
> sudo systemctl start recordServer
```

## What it does 

This small node application runs as a server and provides a basic responsive web application.

With this basic web application, you can :
* record, pause, resume the input of your selected soundcard (selected in config.json) (with alsa arecord)
* play, pause, resume the last recordings made
* manage your recordings : rename files, delete files, download to your web browser or simply play it to the soundcard of the RPI (with alsa aplay)
*  you can add music (wav format) in the destination_folder then play it
* reboot or shutdown the RPI

## Other options to help while on performing on stage

> These functions are not provided with this project but I think it's quite usefull to know we can do that

My RPI3 is set as a wifi Access Point so that :
* it's connected and records my sound mixer output
* provides a wifi network
* my smartphone is connected to this network and manage recordings
* my tablet is connected to this network and displays all my lyrics & chords (pdf files on samba share)

Every client connected to the RPI wifi AP have access to the shared folder.

