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