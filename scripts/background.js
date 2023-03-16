let remainingSeconds = 0;
let totalSeconds = 0;
let timerInterval;
let running = false;
let paused = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIME') {
        const query = { active: true, lastFocusedWindow: true };
        chrome.tabs.query(query, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                cmd: "RESET_CHARACTER"
            });
        });
        // const tab = getCurrentTab();
        // chrome.tabs.sendMessage(tab.id, {
        //     cmd: "RESET_CHARACTER"
        // });
        handleStart();
    } else if (request.cmd === "GET_TIME") {
        handleGet(sendResponse);
    } else if (request.cmd === 'UPDATE_TIME') {
        handleUpdate(request);
        const query = { active: true, lastFocusedWindow: true };
        chrome.tabs.query(query, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                cmd: "MOVE_CHARACTER",
                remainingSeconds,
                totalSeconds
            });
        });
    } else if (request.cmd === 'PAUSE_TIME') {
        handlePause();
    } else if (request.cmd === 'STOP_TIME') {
        handleStop();
    } else if (request.cmd === 'PRESSED_STOP') {
        const query = { active: true, lastFocusedWindow: true };
        chrome.tabs.query(query, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                cmd: "RESET_CHARACTER"
            });
        });
    }
    // return true;
});

function handleStart() {
    paused = false;
    running = true;
    timerInterval = setInterval(() => {
        remainingSeconds--;
        const query = { active: true, lastFocusedWindow: true };
        chrome.tabs.query(query, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                cmd: "MOVE_CHARACTER",
                remainingSeconds,
                totalSeconds
            });
        });
        if (remainingSeconds == 0) {
            handleStop();
            // notify open tab (popup should be closed)
            const query = { active: true, lastFocusedWindow: true };
            chrome.tabs.query(query, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    cmd: "MAKE_SOUND"
                });
                chrome.tabs.sendMessage(tabs[0].id, {
                    cmd: "TIMER_DONE"
                });
            });
            return;

            //RESET_CHARACTER
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

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'show':
            // showHide();
            move();
            break;
        case "move":
            move();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

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

// chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
//     // if (info.url && urlRegex.test(info.url)) {
//     if (info.url) {
//         /* The tab with ID `tabId` has been updated to a URL
//          * in the `google.com` domain. Let's do something... */
//         // const tab = getCurrentTab();
//         // chrome.tabs.sendMessage(tab.id,
//         //     { cmd: "SHOW" },
//         // );
//     }
// });

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}