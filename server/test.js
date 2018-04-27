var Sound = require('node-arecord');

var sound = new Sound({
	 debug: true,    // Show stdout
	 destination_folder: '/tmp',
	 filename: 'test.wav',
	 alsa_format: 'cd',
	 alsa_device: 'plughw:1,0'
});

sound.record();

setTimeout(function () {
	console.log("stop");
	sound.stop(); // stop after ten seconds
}, 5000);

sound.on('complete', function () {
	console.log('Done with recording!');
});
