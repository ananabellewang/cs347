const soundEffect = new Audio(chrome.runtime.getURL("/assets/monkey!.m4a"));
let remainingSeconds = 0;
let totalSeconds = 0;

// container!
const progress_container = document.createElement("div")
progress_container.className = "progress_container";

// banana
const goal = document.createElement("img")
goal.src = chrome.runtime.getURL("assets/banana.png");
goal.className = "goal";
goal.classList.add("border");
progress_container.appendChild(goal);

// tree
const bar = document.createElement("img")
bar.src = chrome.runtime.getURL("assets/longwood.png");
bar.className = "bar";
progress_container.appendChild(bar);

// monkey
const character = document.createElement("img")
character.className = "character";
character.classList.add("border");
character.src = chrome.runtime.getURL("assets/monkey.png");
progress_container.appendChild(character);

// heart
const heart = document.createElement("img")
heart.src = chrome.runtime.getURL("assets/heart.png");
heart.className = "heart";
heart.classList.add("border");
progress_container.appendChild(heart);


document.body.appendChild(progress_container);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("request.cmd: " + request.cmd);
    const progress_container = document.getElementsByClassName('progress_container')[0];
    const character = document.getElementsByClassName('character')[0];
    const heart = document.getElementsByClassName('heart')[0];

    if (request.cmd === "SHOW_HIDE") {
        progress_container.classList.toggle("show");
    } else if (request.cmd === "SHOW") {
        progress_container.classList.add("show");
    } else if (request.cmd == "MOVE_CHARACTER") {
        remainingSeconds = request.remainingSeconds;
        totalSeconds = request.totalSeconds;
        const portionDone = (remainingSeconds == 0) ? 1 : (totalSeconds - remainingSeconds) / totalSeconds;
        // console.log("MOVE_CHARACTER - remaining: " + remainingSeconds + ", total: " + totalSeconds, ", portion done: " + portionDone);
        character.style.bottom = "calc((100% - 35px) * " + portionDone + ")";
    } else if (request.cmd == "MAKE_SOUND") {
        // only play if popup isn't open
        if (document.title != "BananaNab") {
            soundEffect.play();
        }
    } else if (request.cmd == "RESET_CHARACTER") {
        character.style.bottom = "3px";
        character.classList.remove("rotate_character");
        heart.classList.remove("show_heart");
    } else if (request.cmd == "TIMER_DONE") {
        character.style.bottom = "calc(100% - 35px)";
        character.classList.add("rotate_character");
        heart.classList.add("show_heart");
    }
    // return true;
});