
// container!
const progress_container = document.createElement("div")
progress_container.className = "progress_container";

// banana
const goal = document.createElement("img")
goal.src = chrome.runtime.getURL("assets/banana.png");
goal.className = "goal";
progress_container.appendChild(goal);

// tree
const bar = document.createElement("img")
bar.src = chrome.runtime.getURL("assets/longwood.png");
bar.className = "bar";
progress_container.appendChild(bar);

// monkey
const character = document.createElement("img")
character.className = "character";
character.src = chrome.runtime.getURL("assets/monkey.png");
character.addEventListener('click', function () {
    // character.classList.toggle("move");
    const soundEffect = new Audio(chrome.runtime.getURL("/assets/monkey!.m4a"));
    soundEffect.play();
});
progress_container.appendChild(character);

document.body.appendChild(progress_container);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request.cmd);

    if (request.cmd === "SHOW_HIDE") {
        const progress = document.getElementsByClassName('progress_bar')[0];
        progress_container.classList.toggle("show");
    }

    if (request.cmd === "END_TIMER") {
        const soundEffect = new Audio("assets/monkey!.m4a");
        soundEffect.play();
    } else if (request.cmd === "MOVE") {
        const character = document.getElementsByClassName("character")[0];
        character.classList.toggle("move");
    }

    return true;
});