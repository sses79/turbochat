import consumer from "channels/consumer"

let resetFun;
let timer = 0;

consumer.subscriptions.create("AppearanceChannel", {
    initialize() {
    },
    connected() {
        // Called when the subscription is ready for use on the server
        resetFun = () => this.resetTimer(this.uninstall);
        this.install();
        window.addEventListener("turbo:load", () => this.resetTimer());
    },

    disconnected() {
        // Called when the subscription has been terminated by the server
        this.uninstall();
    },

    rejected() {
        this.uninstall();
    },

    received(data) {
        // Called when there's incoming data on the websocket for this channel
    },

    online() {
        console.log("online");
        this.perform("online");
    },

    away() {
        console.log("away");
        this.perform("away");
    },

    offline() {
        console.log("offline");
        this.perform("offline");
    },

    resetTimer() {
        this.uninstall();
        const shouldRun = document.getElementById("appearance_channel");

        if (!!shouldRun) {
            this.online();
            clearTimeout(timer);
            const timeInSeconds = 20;
            const milliseconds = 1000;
            const timeInMilliseconds = timeInSeconds * milliseconds;

            timer = setTimeout(this.away.bind(this), timeInMilliseconds);
        }
    },

    install() {
        console.log("Install");
        window.removeEventListener("load", resetFun);
        window.removeEventListener("DOMContentLoaded", resetFun);
        window.removeEventListener("click", resetFun);
        window.removeEventListener("keydown", resetFun);

        window.addEventListener("load", resetFun);
        window.addEventListener("DOMContentLoaded", resetFun);
        window.addEventListener("click", resetFun);
        window.addEventListener("keydown", resetFun);
        this.resetTimer();
    },

    uninstall() {
        const shouldRun = document.getElementById("appearance_channel");
        if (!shouldRun) {
            clearTimeout(timer);
            this.perform("offline");
        }
    },
});
