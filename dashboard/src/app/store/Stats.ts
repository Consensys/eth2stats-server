import { observable } from "mobx";

export class Stats {
    @observable currentSlot: number;
    @observable currentEpoch: number;
    @observable timeSinceSlotStart = this.formatTime(0);

    networkGenesisTime: number;
    interval: number;

    start(networkGenesisTime: string) {
        this.networkGenesisTime = Math.floor(
            new Date(networkGenesisTime).getTime() / 100) / 10;
        this.interval = setInterval(() => { this.calculateCurrentState(); }, 100);
    }

    stop() {
        clearInterval(this.interval);
        this.networkGenesisTime = 0;
        this.currentSlot = 0;
        this.currentEpoch = 0;
        this.timeSinceSlotStart = this.formatTime(0);
    }

    calculateCurrentState() {
        let now = Math.floor((new Date()).getTime() / 100) / 10;

        this.currentSlot = Math.floor((now - this.networkGenesisTime) / 12);
        this.currentEpoch = Math.floor(this.currentSlot / 32);
        this.timeSinceSlotStart = this.formatTime(Math.round(
            ((now - this.networkGenesisTime) - this.currentSlot * 12) * 10) / 10);
    }

    formatTime(t: any) {
        if (t < 0) { t = 0; }
        if (t > 12) { t = 12; }

        t += "";

        if (t.indexOf(".") === -1) {
            t += ".0";
        }

        t += "s";

        return t;
    }
}
