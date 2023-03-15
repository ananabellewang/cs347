let remainingSeconds;
let totalSeconds;
let timerInterval;
let running = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIME') {
        // timerID = setTimeout(() => {
        //     // the time is app, alert the user.
        //     // sendResponse({ msg: "TIMES_UP" });
        //     remainingSeconds = 0;
        //     chrome.tabs.create({ url: "hello.html" });
        //     // audio not workin g...barkTitle.
        //     const soundEffect = new Audio("assets/bell.wav");
        //     soundEffect.play();
        // }, remainingSeconds * 1000);
        if (remainingSeconds == 0) {
            stop();
        }
        running = true;
        timerInterval = setInterval(() => {
            remainingSeconds--;
            chrome.runtime.sendMessage({ cmd: "UPDATE_TIME", remaining: remainingSeconds });
            // console.log(response);
            // (async () => {
            //     const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            //     const response = await chrome.tabs.sendMessage(tab.id, { remaining: remainingSeconds });
            //     // do something with response here, not outside the function
            //     console.log(response);
            // })();

            // when timer stops!
            if (remainingSeconds == 0) {
                // alert("Time's up!");
                console.log("Time's Up!")
                clearInterval(timerInterval);
                timerInterval = null;

                // send a message letting them know to reset
                // (async () => {
                //     const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                //     chrome.tabs.sendMessage(tab.id, { cmd: "END_TIME" });
                // })();
                return;
            }
        }, 1000);
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({ remaining: remainingSeconds });
    } else if (request.cmd === 'UPDATE_TIME') {
        if (request.remaining) remainingSeconds = request.remaining;
        if (request.total) totalSeconds = request.total;
        running = false;
    } else if (request.cmd === 'PAUSE_TIME') {
        if (request.total) totalSeconds = request.total;
        running = false;
        clearInterval(timerInterval);
        timerInterval = null;
    } else if (request.cmd === 'STOP_TIME') {
        if (request.total) totalSeconds = request.total;
        running = false;
        clearInterval(timerInterval);
        timerInterval = null;
    }
});

function stop() {
    running = false;
    clearInterval(timerInterval);
    timerInterval = null;
}

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case 'bark':
            barkTitle();
            break;
        case "move":
            handleMove();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

function barkTitle() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            tabTitle: tabs[0].title
        });
    });
}

function handleMove() {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            tabTitle: tabs[0].title
        });
    });
}