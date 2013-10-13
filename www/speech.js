if (!('webkitSpeechRecognition' in window)) {
    upgrade();
}

var speech = {};

speech.recording = false;

speech.recognition = new webkitSpeechRecognition();
speech.recognition.continuous = true;
speech.recognition.interimResults = true;

speech.listen = function (callback) {
    speech.recognition.onsoundstart = function () {
        console.log('sound start');
    };
    speech.recognition.onsoundend = function () {
        console.log('sound end');
    };
    speech.recognition.onspeechstart = function () {
        console.log('speech start');
        speech.speech_detected = true;
    };
    speech.recognition.onspeechend = function () {
        console.log('speech end');
    };
    speech.recognition.onstart = function() {
        speech.recording = true;
        if (speech.onstartrecording) {
            speech.onstartrecording();
        }
        console.log('start');
    };
    speech.recognition.onerror = function(event) {
        console.log('error');
    };
    speech.recognition.onend = function() {
        speech.speech_detected = false;
        speech.recording = false;
        if (speech.onstoprecording) {
            speech.onstoprecording();
        }
        console.log('end');
    };
    speech.recognition.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                speech.recognition.stop();
                var str = event.results[i][0].transcript.toLowerCase();
                str = str.replace(/^\s+|\s+$/,''); //trim
                callback(null, str);
            }
        }
    };
    speech.recognition.start();
};

speech.stop = function () {
    speech.recognition.stop();
};
