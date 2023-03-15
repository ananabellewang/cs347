// Thank you to dcode for the video tutorial that provided the starter code
// video: https://www.youtube.com/watch?v=PIiMSMz7KzM
class Timer {
    constructor(root) {
        root.innerHTML = Timer.getHTML();

        this.el = {
            hours: root.querySelector(".timer_text_hours"),
            minutes: root.querySelector(".timer_text_minutes"),
            seconds: root.querySelector(".timer_text_seconds"),
            control: root.querySelector(".timer_btn_control"),
            reset: root.querySelector(".timer_btn_set"),
            add: root.querySelector(".timer_btn_add"),
            timer_display: root.querySelector(".timer_input_container"),
            title: root.querySelector(".timer_text_container_title"),
            subtitle: root.querySelector(".timer_text_container_subtitle"),
            inputs: root.querySelectorAll("input")
        };

        this.interval = null;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.running = true;

        this.el.control.addEventListener("click", () => {
            if (!this.running) {
                this.play()
            } else {
                this.pause();
            }
        });

        this.el.add.addEventListener("click", (e) => {
            this.el.minutes.value = (parseInt(this.el.minutes.value) + 1).toString().padStart(2, "0");
            if (this.el.minutes.value >= 60) {
                this.el.minutes.value = "0".padStart(2, "0");;
                this.el.hours.value = (parseInt(this.el.hours.value) + 1).toString().padStart(2, "0");
            }
            this.remainingSeconds += 60;
            chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', remaining: this.remainingSeconds });
        });

        this.el.reset.addEventListener("click", () => {
            this.stop();
            this.el.hours.value = "";
            this.el.minutes.value = "";
            this.el.seconds.value = "";
            // this.el.title.textContent = this.remainingSeconds;
        });

        // Call this when the pop-up is shown
        chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
            if (response.remaining) {
                this.remainingSeconds = response.remaining;
                // not necessarily start ...
                this.start();
            }
        });

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
                if (request.cmd === "UPDATE_TIME" && request.remaining) {
                    this.remainingSeconds = request.remaining;
                    if (this.remainingSeconds == 0) {
                        this.handleTimerEnd();
                    }
                    return true;
                }
            }
        );
    }


    updateInterfaceTime() {
        if (this.remainingSeconds == 0) {
            this.el.hours.value = "";
            this.el.minutes.value = "";
            this.el.seconds.value = "";
        } else {
            const hours = Math.floor(this.remainingSeconds / 3600);
            const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
            const seconds = this.remainingSeconds % 60;

            this.el.hours.value = hours.toString().padStart(2, "0");
            this.el.minutes.value = minutes.toString().padStart(2, "0");
            this.el.seconds.value = seconds.toString().padStart(2, "0");
        }
    }

    updateInterfaceControls() {
        if (!this.running) {
            this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
            this.el.control.classList.add("timer_btn_play");
            this.el.control.classList.remove("timer_btn_pause");
        } else {
            this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
            this.el.control.classList.add("timer_btn_pause");
            this.el.control.classList.remove("timer_btn_play");
        }
    }

    play() {
        // update seconds based on input
        this.setRemainingSeconds();
        chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', remaining: this.remainingSeconds, total: this.remainingSeconds });

        if (this.remainingSeconds == 0) return;
        chrome.runtime.sendMessage({ cmd: 'START_TIME' });
        this.start();
    }

    pause() {
        chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', remaining: this.remainingSeconds });
        chrome.runtime.sendMessage({ cmd: 'STOP_TIME' });
        this.stop();
    }
    // generic start
    start() {
        this.el.timer_display.disabled = true;
        // this.el.title.textContent = this.remainingSeconds;
        this.updateInterfaceTime();
        this.updateInterfaceControls();

        // instead of setting interval, maybe get the remaining seconds from the background???

        // this.interval = setInterval(() => {
        //     // this.remainingSeconds--;
        //     // chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
        //     //     if (response.remaining) {
        //     //         this.remainingSeconds = response.remaining;
        //     //         this.el.subtitle.textContent = response.remaining;
        //     //     }
        //     // });
        //     this.updateInterfaceTime();
        //     this.el.title.textContent = this.remainingSeconds;
        //     // this.el.subtitle.textContent = this.el.hours.value + ":" + this.el.minutes.value + ":" + this.el.seconds.value;

        //     // when timer stops!
        //     // if (this.remainingSeconds == 0) {
        //     //     // chrome.runtime.sendMessage({ cmd: 'STOP_TIME' });
        //     //     this.handleTimerEnd();
        //     //     return;
        //     // }
        // }, 1);
        // this.updateInterfaceControls();
    }


    stop() {

        // display is the single source of truth
        this.remainingSeconds = 0;

        this.el.timer_display.disabled = false;
        clearInterval(this.interval);
        this.interval = null;
        this.updateInterfaceControls();

        // this.el.title.textContent = this.remainingSeconds;
    }

    setRemainingSeconds() {
        const hours = ((this.el.hours.value == "") ? 0 : parseInt(this.el.hours.value));
        const minutes = ((this.el.minutes.value == "") ? 0 : parseInt(this.el.minutes.value));
        const seconds = ((this.el.seconds.value == "") ? 0 : parseInt(this.el.seconds.value));
        console.log('hrs: %s, min: %s, sec: %s', hours, minutes, seconds);

        this.remainingSeconds = (hours * 3600) + (minutes * 60) + seconds;
    }

    handleTimerEnd() {
        this.remainingSeconds = 0;
        this.stop();
        const soundEffect = new Audio("assets/bell.wav");
        soundEffect.play();
    }

    //     <div class="timer_text_container">
    //     <span class="timer_text timer_text_minutes">00</span>
    //     <span class="timer_text">:</span>
    //     <span class="timer_text timer_text_seconds">00</span>
    //     <input class="without_ampm timer_input" type="time" id="duration" name="duration" step="1" value="00:00">
    // </div>
    static getHTML() {
        return `
            <div class="timer_text_container">
                <span class="timer_text_container_title">BananaNab</span>
                <span class="timer_text_container_subtitle">
                    Boomba the monkey is hungry! Help her climb the tall tree and reach the banana while you complete your to-dos.
                </span>
            </div>
            <div class="timer_input">
                <div class="timer_label">
                    <span>Hours</span>
                    <span>:</span>
                    <span>Minutes</span>
                    <span>:</span>
                    <span>Seconds</span>
                </div>
                <fieldset class="timer_input_container">
                    <input class="timer_text timer_text_hours" id="input_hrs" type="number" min="0" max="99" placeholder="00" value="" maxlength="2">
                    <span class="timer_text">:</span>
                    <input class="timer_text timer_text_minutes" id="input_min" type="number" min="0" max="59" placeholder="00" value="" maxlength="2">
                    <span class="timer_text">:</span>
                    <input class="timer_text timer_text_seconds" id="input_sec"type="number" min="0" max="59" placeholder="00" value="" maxlength="2">
                </fieldset>
            </div>
            <div class="timer_btn_container">
                <button type="button" class="timer_btn timer_btn_add">
                    +1 minute
                </button>
                <button type="button" class="timer_btn timer_btn_set">
                    <span class="material-icons">stop</span>
                </button>
                <button type="button" class="timer_btn timer_btn_control timer_btn_play">
                <span class="material-icons">play_arrow</span>
                </button>
            </div>
            <div class="sprite_container">
                <img src="assets/banana.png" alt="banana" class="sprite">
                ❤️
                <img src="assets/monkey.png" alt="monkey" class="sprite">
            </div>
        `;
    }
}

new Timer(
    document.querySelector(".timer")
);