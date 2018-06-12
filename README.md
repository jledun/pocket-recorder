Pocket Recorder Project with alsa arecord and aplay

## Setup 

All the configuration is in server/config.json

This setup is made for a fresh raspbian install and a usb soundcard is connected to alsa.

## install and run

from your home folder on your Raspberry Pi 3:

```bash
> cd ~/Documents
> git clone https://github.com/jledun/pocket-recorder.git PocketRecorderProject
> cd PocketRecorderProject/server
> npm install
> sudo cp recordServer.service /lib/systemd/system/
> sudo systemctl daemon-reload
> sudo systemctl start recordServer    # TO TEST
> sudo systemctl enable recordServer   # TO AUTOMATICLY START AT BOOT
```

## What it does 

This small node application runs as a server and provides a basic responsive web application.

With this basic web application, you can :
* record, pause, resume the input of your selected soundcard (selected in config.json) (with alsa arecord)
* play, pause, resume the last recordings made
* manage your recordings : rename files, delete files, download to your web browser or simply play it to the soundcard of the RPI (with alsa aplay)
* you can add music (wav format) in the destination_folder then play it
* reboot or shutdown the RPI
* manage arecord options from web application, options are saved into server/config.json file.

## Other options to help while on performing on stage

> These functions are not provided with this project but I think it's quite usefull to know we can do that

My RPI3 is set as a wifi Access Point so that :
* it's connected and records my sound mixer output
* provides a wifi network
* my smartphone is connected to this network and manage recordings
* my tablet is connected to this network and displays all my lyrics & chords (pdf files on samba share)

Every client connected to the RPI wifi AP have access to the shared folder.

## TODO

* autogenerate systemd service so that it's not dependant of the installation folder and to remove my personnal PocketRecorderProject folder
* better design
* validate options before save to file
* add the capability to navigate into the wav file while playing
* add the capability to display and choose sound cards for arecord and aplay
* add the capability to manage sound levels (input and output) (an amixer web front end ?)
* documentation : add RPI3 setup as a wifi access point
* documentation : screenshots and user manual
* documentation : how to share a folder on your RPI3 (to copy all files to windows easilly)

## Licence 

Copyright 2018 Julien Ledun <j.ledun@iosystems.fr>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
