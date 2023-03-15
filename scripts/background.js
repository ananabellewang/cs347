let remainingSeconds = 0;
let totalSeconds = 0;
let timerInterval;
let running = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'PLAY_TIME') {
        running = true;
        timerInterval = setInterval(() => {
            remainingSeconds--;
            // when timer stops!
            if (remainingSeconds == 0) {
                end();
            }
        }, 1000);
    } else if (request.cmd === "GET_TIME") {
        sendResponse({ running: running, remaining: remainingSeconds, total: totalSeconds });
        console.log("GET_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
    } else if (request.cmd === 'UPDATE_TIME') {
        if (request.remaining) remainingSeconds = request.remaining;
        if (request.total) totalSeconds = request.total;
        console.log("UPDATE_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds);
    } else if (request.cmd === 'PAUSE_TIME') {
        pause();
        console.log("PAUSE_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
    } else if (request.cmd === 'STOP_TIME') {
        end();
        console.log("STOP_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
    }
});

function pause() {
    running = false;
    clearInterval(timerInterval);
    timerInterval = null;
}

function end() {
    pause();
    running = false;
    remainingSeconds = 0;
    totalSeconds = 0;
    // chrome.runtime.sendMessage({ cmd: "END_TIME" });
    console.log("time's up! (from end.js)");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "END_TIMER",
        });
    });
    return true;
}

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'show':
            showHide();
            break;
        case "move":
            move();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

function showHide() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "SHOW_HIDE"
        });
    });
}

function move() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "MOVE"
        });
    });
}