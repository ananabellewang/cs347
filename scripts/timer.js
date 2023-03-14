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

        this.el.control.addEventListener("click", () => {
            if (this.interval === null) {
                this.start();
            } else {
                this.stop();
            }
        });

        this.el.add.addEventListener("click", (e) => {
            this.remainingSeconds += 60;
        });

        elementsArray.forEach(function (input) {
            input.addEventListener("input", (e) => {
                this.el.subtitle.textContent = e.target.value;

                if (e.target.value.length > 2) {
                    return false;
                }
            });
        });

        // this.el.reset.addEventListener("click", () => {
        //     // TODO: Allow hours
        //     // TODO: better input
        //     const inputMinutes = prompt("Enter number of minutes:");

        //     if (inputMinutes < 60) {
        //         this.stop();
        //         this.remainingSeconds = inputMinutes * 60;
        //         this.updateInterfaceTime();
        //     }
        // });
    }


    updateInterfaceTime() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;

        this.el.hours.value = hours.toString().padStart(2, "0");
        this.el.minutes.value = minutes.toString().padStart(2, "0");
        this.el.seconds.value = seconds.toString().padStart(2, "0");
    }

    updateInterfaceControls() {
        if (this.interval === null) {
            this.el.control.innerHTML = `<span class="material-icons">play_arrow</span>`;
            this.el.control.classList.add("timer_btn_play");
            this.el.control.classList.remove("timer_btn_pause");
        } else {
            this.el.control.innerHTML = `<span class="material-icons">pause</span>`;
            this.el.control.classList.add("timer_btn_pause");
            this.el.control.classList.remove("timer_btn_play");
        }
    }

    start() {
        // check if inputted duration is nonzero
        this.setRemainingSeconds();
        if (this.remainingSeconds == 0) return;

        this.el.title.textContent = this.remainingSeconds;
        this.el.subtitle.textContent = this.el.hours.value + ":" + this.el.minutes.value + ":" + this.el.seconds.value;
        this.el.timer_display.disabled = true;
        this.updateInterfaceTime();

        this.interval = setInterval(() => {
            this.remainingSeconds--;
            this.updateInterfaceTime();
            this.el.title.textContent = this.remainingSeconds;
            this.el.subtitle.textContent = this.el.hours.value + ":" + this.el.minutes.value + ":" + this.el.seconds.value;

            // when timer stops!
            if (this.remainingSeconds === 0) {
                this.handleTimerEnd();
            }
        }, 1000);

        this.updateInterfaceControls();
    }

    stop() {
        // display is the single source of truth
        this.remainingSeconds = 0;

        this.el.timer_display.disabled = false;
        clearInterval(this.interval);
        this.interval = null;
        this.updateInterfaceControls();

        this.el.title.textContent = this.remainingSeconds;
        this.el.subtitle.textContent = this.el.hours.value + ":" + this.el.minutes.value + ":" + this.el.seconds.value;
    }

    setRemainingSeconds() {
        const hours = ((this.el.hours.value == "") ? 0 : parseInt(this.el.hours.value));
        const minutes = ((this.el.minutes.value == "") ? 0 : parseInt(this.el.minutes.value));
        const seconds = ((this.el.seconds.value == "") ? 0 : parseInt(this.el.seconds.value));
        console.log('hrs: %s, min: %s, sec: %s', hours, minutes, seconds);

        this.remainingSeconds = (hours * 3600) + (minutes * 60) + seconds;
    }

    handleTimerEnd() {
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
                <span class="timer_text_container_title">Title</span>
                <span class="timer_text_container_subtitle">Title</span>
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
                <button type="button" class="timer_btn timer_btn_control timer_btn_play">
                    <span class="material-icons">play_arrow</span>
                </button>
                <button type="button" class="timer_btn timer_btn_set">
                    <span class="material-icons">settings</span>
                </button>
            </div>
        `;
    }
}

new Timer(
    document.querySelector(".timer")
);