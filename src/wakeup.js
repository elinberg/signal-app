var lastTime = (new Date()).getTime();
var checkInterval = 10000;

setInterval(function () {
    var currentTime = (new Date()).getTime();

    if (currentTime > (lastTime + checkInterval * 2)) {  // ignore small delays
        postMessage("wakeup");
    }

    lastTime = currentTime;
}, checkInterval);