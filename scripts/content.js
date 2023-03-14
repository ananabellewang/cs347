// import styles from "https://fonts.googleapis.com/icon?family=Material+Icons";
function addCss(fileName) {
  // var head = document.head;
  // var link = document.createElement("link");

  // link.type = "text/css";
  // link.rel = "stylesheet";
  // link.href = fileName;

  // head.appendChild(link);
  var link = document.createElement("link");
  link.href = fileName;
  // link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

addCss("https://fonts.googleapis.com/icon?family=Material+Icons");

// Notification body.
const notification = document.createElement("div");
notification.className = 'acho-notification';

// Notification text.
const notificationText = document.createElement('p');
notification.appendChild(notificationText);

// Add to current page.
document.body.appendChild(notification);

// Progress Bar !!!
const progress = document.createElement("div")
progress.className = "progress_bar";
// bell
const bell = document.createElement("div")
bell.className = "bell";
bell.textContent = "🔔"
progress.appendChild(bell);

// climber
const character = document.createElement("div")
character.className = "character";
character.textContent = "🧗"
// const character = document.createElement("img")
// character.src = chrome.runtime.getURL("assets/person-climbing.png");
character.addEventListener('click', function () {
  character.classList.toggle("move");
});
progress.appendChild(character);

document.body.appendChild(progress);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  const notification = document.getElementsByClassName('acho-notification')[0];
  const notificationText = notification.getElementsByTagName('p')[0];

  notificationText.innerHTML = "You are at: " + request.tabTitle;

  // notification.style.display = 'flex';

  // setTimeout(function () {

  //   notification.style.display = 'none';
  // }, 5000);

  const progress = document.getElementsByClassName('progress_bar')[0];
  progress.style.display = 'flex';


  return true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  const character = document.getElementsByClassName("character")[0];
  character.classList.toggle("move");

  return true;
});