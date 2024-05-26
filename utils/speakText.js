export function readText(selectedText) {
    if (selectedText == "" || selectedText == undefined || selectedText.lenght == 0) selectedText = "Please select text";

    speechSynthesis.cancel();
    const voiceName = 'Microsoft David - English (United States) (en-US) -- DEFAULT';
    var readSpeed = 0.94;

    var voices = speechSynthesis.getVoices();

    var voiceObj = voices.filter(function (voice) { return voice.name == voiceName; })[0];


    selectedText = selectedText.replace(/: /g, ". ");
    selectedText = selectedText.replace(/- /g, ". ");
    selectedText = selectedText.replace(/\?/g, ". ");
    selectedText = selectedText.replace(/!/g, ". ");
    selectedText = selectedText.replace(/  /g, ". ");
    selectedText = selectedText.replace(/\n/g, ". ");
    selectedText = selectedText.replace(/\r/g, ". ");
    selectedText = selectedText.replace(/\f/g, ". ");
    var textParts = selectedText.split('. ');


    var i,j;
    const MAX_LENGTH = 200;
    for (i = 0; i < textParts.length; i++) {
        var subParts = [];
        var remText = textParts[i];
        while (remText.length > MAX_LENGTH) {
            remSlice = remText.substr(0, MAX_LENGTH);
            if (remSlice.lastIndexOf(',') > 0) {
                lastIndex = remSlice.lastIndexOf(',');
            } else if (remSlice.lastIndexOf(' or ') > 0) {
                lastIndex = remSlice.lastIndexOf(' or ');
            } else if (remSlice.lastIndexOf(' but ') > 0) {
                lastIndex = remSlice.lastIndexOf(' but ');
            } else if (remSlice.lastIndexOf(' because ') > 0) {
                lastIndex = remSlice.lastIndexOf(' because ');
            } else if (remSlice.lastIndexOf(' nor ') > 0) {
                lastIndex = remSlice.lastIndexOf(' nor ');
            } else if (remSlice.lastIndexOf(' yet ') > 0) {
                lastIndex = remSlice.lastIndexOf(' yet ');
            } else if (remSlice.lastIndexOf(' so ') > 0) {
                lastIndex = remSlice.lastIndexOf(' so ');
            } else if (remSlice.lastIndexOf(' ') > 0) {
                lastIndex = remSlice.lastIndexOf(' ');
            } else {
                lastIndex = MAX_LENGTH;
            }

            subParts.push(remText.substr(0, lastIndex));
            remText = remText.substr(lastIndex, remText.length);
        }
        subParts.push(remText);

        for (j = 0; j < subParts.length; j++) {
            //	console.log("SPEAK: " + subParts[j] + " [" + textLanguage + "- " + readSpeed + "]");
            var utterance = new SpeechSynthesisUtterance(subParts[j]);
            utterance.voice = voiceObj;
            utterance.rate = readSpeed;
            speechSynthesis.speak(utterance);
            if (i == (textParts.length - 1) && j == (subParts.length - 1)) {
                utterance.onend = function () {
                    speechSynthesis.cancel();
                };
            }
        }
    }


}