const soundEffect = new Audio(chrome.runtime.getURL("/assets/monkey!.m4a"));
let remainingSeconds = 0;
let totalSeconds = 0;

// container!
const progress_container = document.createElement("div")
progress_container.className = "progress_container";

// banana
const banana = document.createElement("img")
banana.src = chrome.runtime.getURL("assets/banana.png");
banana.className = "banana";
banana.classList.add("contrast_border");
progress_container.appendChild(banana);

// tree
const bar = document.createElement("img")
bar.src = chrome.runtime.getURL("assets/longwood.png");
bar.className = "bar";
progress_container.appendChild(bar);

// monkey
const monkey = document.createElement("img")
monkey.className = "monkey";
monkey.classList.add("contrast_border");
monkey.src = chrome.runtime.getURL("assets/monkey.png");
progress_container.appendChild(monkey);

// heart
const heart = document.createElement("img")
heart.src = chrome.runtime.getURL("assets/heart.png");
heart.className = "heart";
heart.classList.add("contrast_border");
progress_container.appendChild(heart);
document.body.appendChild(progress_container);

function handleTimerDone() {
    monkey.style.bottom = "calc(3px + (100% - 38px))";
    monkey.classList.add("rotated");
    heart.classList.add("show_heart");
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("request.cmd: " + request.cmd);
    const progress_container = document.getElementsByClassName('progress_container')[0];
    const monkey = document.getElementsByClassName('monkey')[0];
    const heart = document.getElementsByClassName('heart')[0];

    if (request.cmd === "SHOW") {
        progress_container.classList.add("show");
    } else if (request.cmd == "MOVE") {
        remainingSeconds = request.remainingSeconds;
        totalSeconds = request.totalSeconds;
        // if (remainingSeconds == 0) handleTimerDone(monkey, heart);
        if (totalSeconds != 0) {
            const portionDone = (totalSeconds - remainingSeconds) / totalSeconds;
            monkey.style.bottom = "calc(3px + (100% - 38px) * " + portionDone + ")";
            console.log("MOVE - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", portion done: " + portionDone + ", bottom: " + monkey.style.bottom);
        }
    } else if (request.cmd == "MAKE_SOUND") {
        // only play if popup isn't open
        if (document.title != "BananaNab") {
            soundEffect.play();
        }
    } else if (request.cmd == "RESET") {
        monkey.style.bottom = "3px";
        monkey.classList.remove("rotated");
        heart.classList.remove("show_heart");
    } else if (request.cmd == "PROGRESS_DONE") {
        handleTimerDone(monkey, heart);
    }
    // return true;
});