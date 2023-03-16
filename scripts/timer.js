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
        this.running = false;
        this.paused = false;

        this.count = 0;

        this.el.control.addEventListener("click", () => {
            chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
                if (response) {
                    if (response.running == false) {
                        this.play();
                    } else {
                        this.pause();
                    }
                }
            });
        });

        this.el.add.addEventListener("click", (e) => {
            this.remainingSeconds += 60;
            (async () => {
                await chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', remaining: this.remainingSeconds });
                this.updateInterfaceTime();
            })();

            // this.el.minutes.value = (parseInt(this.el.minutes.value) + 1).toString().padStart(2, "0");
            // if (this.el.minutes.value >= 60) {
            //     this.el.minutes.value = "0".padStart(2, "0");;
            //     this.el.hours.value = (parseInt(this.el.hours.value) + 1).toString().padStart(2, "0");
            // }
            // this.remainingSeconds += 60;
        });

        this.el.reset.addEventListener("click", () => {
            this.end();
        });

        // Call this when the pop - up is shown
        chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
            this.updateFromResponse(response);
            if (response.running !== false) this.start();
        });
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
        (async () => {
            const response = await chrome.runtime.sendMessage({ cmd: 'GET_TIME' });
            if (response.running == false) {
                this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
                this.el.control.classList.add("timer_btn_play");
                this.el.control.classList.remove("timer_btn_pause");
            } else {
                this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
                this.el.control.classList.add("timer_btn_pause");
                this.el.control.classList.remove("timer_btn_play");
            }
        })();
        // }
        // if (this.running === false) {
        //     this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
        //     this.el.control.classList.add("timer_btn_play");
        //     this.el.control.classList.remove("timer_btn_pause");
        // } else {
        //     this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
        //     this.el.control.classList.add("timer_btn_pause");
        //     this.el.control.classList.remove("timer_btn_play");
        // }
    }

    // TODO: check if paused is true or not
    play() {
        this.setRemainingSeconds();
        this.totalSeconds = this.remainingSeconds;
        this.updateHelperText();
        if (this.remainingSeconds == 0) return;
        (async () => {
            await chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', remaining: this.remainingSeconds, total: this.totalSeconds });
            await chrome.runtime.sendMessage({ cmd: 'PLAY_TIME' });
            this.start();
        })();
    }

    // TODO: doesn't work on popup close
    // TODO: resets the total count on play()
    // TODO: don't allow them to change the time here - not until it stops.
    pause() {
        chrome.runtime.sendMessage({ cmd: 'PAUSE_TIME' });
        this.stop();
        this.running = false;
        this.paused = true;
        this.updateInterfaceTime();
        this.el.title.textContent = this.remainingSeconds;
        this.el.subtitle.textContent = this.totalSeconds;
    }

    updateHelperText() {
        this.el.title.textContent = this.remainingSeconds;
        this.el.subtitle.textContent = this.totalSeconds;
    }
    // generic start
    start() {
        chrome.runtime.sendMessage({ cmd: 'START_TIME' });
        this.el.timer_display.disabled = true;
        this.running = true;
        this.updateInterfaceTime();
        this.updateInterfaceControls();
        this.updateHelperText();

        // instead of setting interval, maybe get the remaining seconds from the background???
        this.interval = setInterval(() => {
            // this.remainingSeconds--;
            // get remaining seconds
            (async () => {
                chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
                    this.count += 1
                    if (response.remaining !== undefined) {
                        this.remainingSeconds = response.remaining;
                        this.updateInterfaceTime();
                        // when timer stops!
                        if (this.remainingSeconds == 0) {
                            this.end();
                            const soundEffect = new Audio("assets/monkey!.m4a");
                            soundEffect.play();
                            return;
                        }
                    }
                    this.el.title.textContent = this.remainingSeconds;
                    this.el.subtitle.textContent = this.totalSeconds;
                });
            })();
        }, 1);
        // this.updateInterfaceControls();
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
        this.running = false;
        this.updateInterfaceControls();
    }

    end() {
        (async () => {
            this.stop();
            await chrome.runtime.sendMessage({ cmd: 'STOP_TIME' });
            this.remainingSeconds = 0;
            this.totalSeconds = 0;
            this.running = false;
            this.el.timer_display.disabled = false;
            this.updateInterfaceTime();
            this.updateInterfaceControls();
            this.updateHelperText();
        })();
    }

    updateFromResponse(response) {
        if (response.remaining !== undefined) this.remainingSeconds = response.remaining;
        if (response.total !== undefined) this.totalSeconds = response.total;
        if (response.running !== undefined) this.running = response.running;
        if (response.paused !== undefined) this.paused = response.paused;
    }

    setRemainingSeconds() {
        const hours = ((this.el.hours.value == "") ? 0 : parseInt(this.el.hours.value));
        const minutes = ((this.el.minutes.value == "") ? 0 : parseInt(this.el.minutes.value));
        const seconds = ((this.el.seconds.value == "") ? 0 : parseInt(this.el.seconds.value));
        console.log('hrs: %s, min: %s, sec: %s', hours, minutes, seconds);

        this.remainingSeconds = (hours * 3600) + (minutes * 60) + seconds;
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