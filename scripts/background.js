let remainingSeconds = 0;
let totalSeconds = 0;
let timerInterval;
let running = false;
let paused = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIME') {
        handleStart();
    } else if (request.cmd === "GET_TIME") {
        handleGet(sendResponse);
    } else if (request.cmd === 'UPDATE_TIME') {
        handleUpdate(request);
    } else if (request.cmd === 'PAUSE_TIME') {
        handlePause();
    } else if (request.cmd === 'STOP_TIME') {
        handleStop();
    }
    // return true;
});

function handleStart() {
    paused = false;
    running = true;
    timerInterval = setInterval(() => {
        remainingSeconds--;
        // when timer stops!
        if (remainingSeconds == 0) {
            handleStop();
        }
    }, 1000);
}
function handleGet(sendResponse) {
    sendResponse({ running: running, remaining: remainingSeconds, total: totalSeconds });
    console.log("GET_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
    // console.log(chrome.runtime.lastError);
}
function handleUpdate(request) {
    if (request.remaining !== undefined) remainingSeconds = request.remaining;
    if (request.total !== undefined) totalSeconds = request.total;
    console.log("UPDATE_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds);
}
function handlePause() {
    running = false;
    paused = true;
    clearInterval(timerInterval);
    timerInterval = null;
    console.log("PAUSE_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
}
function handleStop() {
    handlePause();
    paused = false;
    remainingSeconds = 0;
    totalSeconds = 0;
    console.log("time's up! (from end.js)");
    console.log("STOP_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);



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