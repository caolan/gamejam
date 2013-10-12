// TODO: call recognition.stop() when key pressed to signal you've stopped talking


if (!('webkitSpeechRecognition' in window)) {
    upgrade();
}
else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onsoundstart = function () {
        console.log('sound start');
    };
    recognition.onsoundend = function () {
        console.log('sound end');
    };
    recognition.onspeechstart = function () {
        console.log('speech start');
    };
    recognition.onspeechend = function () {
        console.log('speech end');
    };
    recognition.onstart = function() {
        console.log('start');
    };
    recognition.onerror = function(event) {
        console.log('error');
    };
    recognition.onend = function() {
        console.log('end');
        console.log('restarting');
        recognition.start();
    };

    recognition.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                // ignore final results
                var command = event.results[i][0].transcript.toLowerCase();
                command = command.replace(/^\s+|\s+$/,''); //trim
                var words = command.split(/\s+/g);
                game.handleSpeech(words);
            }
            else {
                var interim = event.results[i][0].transcript;
                console.log('interim: ' + interim);
                // restart listening
                //recognition.stop();
                //recognition.start();
                // user is speaking
                //document.getElementById('counter').style.color = 'red';
            }
        }
    };
    recognition.start();
    window.recognition = recognition;
}
