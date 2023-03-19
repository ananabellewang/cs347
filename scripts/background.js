let remainingSeconds = 0;
let totalSeconds = 0;
let timerInterval;
let running = false;
let paused = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIME') {
        notifyResetCharacter();
        handleStart();
    } else if (request.cmd === "GET_TIME") {
        handleGet(sendResponse);
    } else if (request.cmd === 'UPDATE_TIME') {
        handleUpdate(request);
        notifyMoveCharacter();
    } else if (request.cmd === 'PAUSE_TIME') {
        handlePause();
        // pressed stop -> stop interval for both sides, reset
        // timer ended -> stop interval for both sides, don't reset, play sound
    } else if (request.cmd === 'TIMES_UP') {
        // handleStop();
        notifyPlaySound();
        notifyProgressDone();
    } else if (request.cmd === 'PRESSED_STOP') {
        // handleStop();
        notifyResetCharacter();
    } else if (request.cmd === 'STOP_INTERVAL') {
        handleStop();
    }
    // return true;
});

function handleStart() {
    paused = false;
    running = true;
    timerInterval = setInterval(() => {
        remainingSeconds--;
        notifyMoveCharacter();
        if (remainingSeconds == 0) {
            handleStop();
            notifyPlaySound();
            notifyProgressDone();
            return;
        }
    }, 1000);
}
function handleGet(sendResponse) {
    sendResponse({ running: running, remaining: remainingSeconds, total: totalSeconds });
    // console.log("GET_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
}
function handleUpdate(request) {
    if (request.remaining !== undefined) remainingSeconds = request.remaining;
    if (request.total !== undefined) totalSeconds = request.total;
    // console.log("UPDATE_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds);
}
function handlePause() {
    running = false;
    paused = true;
    clearInterval(timerInterval);
    timerInterval = null;
    // console.log("PAUSE_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
}
function handleStop() {
    handlePause();
    paused = false;
    remainingSeconds = 0;
    totalSeconds = 0;
    // console.log("STOP_TIME - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", running: " + running);
}

function notifyResetCharacter() {
    const query = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "RESET"
        });
    });
}

function notifyMoveCharacter() {
    const query = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "MOVE",
            remainingSeconds,
            totalSeconds
        });
    });
}

function notifyPlaySound() {
    const query = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "MAKE_SOUND"
        });
    });
}

function notifyProgressDone() {
    const query = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "PROGRESS_DONE"
        });
    });
}

function showHide() {
    const query = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "SHOW_HIDE"
        });
    });
}

function move() {
    const query = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: "MOVE"
        });
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    // if (info.url && urlRegex.test(info.url)) {
    if (info.url && running === true) {
        /* The tab with ID `tabId` has been updated to a URL
         * in the `google.com` domain. Let's do something... */
        const tab = getCurrentTab();
        chrome.tabs.sendMessage(tab.id,
            { cmd: "SHOW" },
        );
    }
});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// chrome.commands.onCommand.addListener(function (command) {
//     switch (command) {
//         case 'show':
//             // showHide();
//             move();
//             break;
//         case "move":
//             move();
//             break;
//         default:
//             console.log(`Command ${command} not found`);
//     }
// });
