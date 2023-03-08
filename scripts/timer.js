// Thank you to dcode for the video tutorial that provided the starter code
// video: https://www.youtube.com/watch?v=PIiMSMz7KzM
class Timer {
    constructor(root) {
        root.innerHTML = Timer.getHTML();

        this.el = {
            minutes: root.querySelector(".timer_text_minutes"),
            seconds: root.querySelector(".timer_text_seconds"),
            control: root.querySelector(".timer_btn_control"),
            reset: root.querySelector(".timer_btn_set")
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

        this.el.reset.addEventListener("click", () => {
            // TODO: Allow hours
            // TODO: better input
            const inputMinutes = prompt("Enter number of minutes:");

            if (inputMinutes < 60) {
                this.stop();
                this.remainingSeconds = inputMinutes * 60;
                this.updateInterfaceTime();
            }
        });
    }

    updateInterfaceTime() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;

        this.el.minutes.textContent = minutes.toString().padStart(2, "0");
        this.el.seconds.textContent = seconds.toString().padStart(2, "0");
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
        if (this.remainingSeconds === 0) return;

        this.interval = setInterval(() => {
            this.remainingSeconds--;
            this.updateInterfaceTime();

            if (this.remainingSeconds === 0) {
                this.stop();
            }
        }, 1000);

        this.updateInterfaceControls();
    }

    stop() {
        clearInterval(this.interval);

        this.interval = null;

        this.updateInterfaceControls();
    }

    static getHTML() {
        return `
            <div class="timer_text_container">
                <span class="timer_text timer_text_minutes">00</span>
                <span class="timer_text">:</span>
                <span class="timer_text timer_text_seconds">00</span>
            </div>
            <div class="timer_btn_container">
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