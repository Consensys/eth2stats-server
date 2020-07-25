import { observable } from "mobx";

export interface INotification {
    type: string;
    message: string;
    dismissable: boolean;
    dismissed: boolean;
    timeout: number;
    index: number;
}

export class Notifications {
    @observable list = new Map();
    index = 0;

    add(notif: INotification) {
        this.list.set(notif.index, notif);

        if (notif.dismissable && notif.timeout > 0) {
            setTimeout(() => this.close(notif.index), notif.timeout);
        }
    }

    new(msg: string, dismissable: boolean, timeout: number) {
        return {
            message: msg,
            dismissable,
            dismissed: false,
            timeout,
            index: this.index++
        };
    }

    error(msg: string, dismissable = true, timeout = -1) {
        this.add({
            ...this.new(msg, dismissable, timeout),
            type: "error"
        });
    }

    warn(msg: string, dismissable = true, timeout = -1) {
        this.add({
            ...this.new(msg, dismissable, timeout),
            type: "warn"
        });
    }

    info(msg: string, dismissable = true, timeout = -1) {
        this.add({
            ...this.new(msg, dismissable, timeout),
            type: "info"
        });
    }

    success(msg: string, dismissable = true, timeout = -1) {
        this.add({
            ...this.new(msg, dismissable, timeout),
            type: "success"
        });
    }

    close(index: number) {
        if (!this.list.has(index)) {
            return;
        }
        this.list.get(index).dismissed = true;

        setTimeout(() => {
            this.list.delete(index);
        }, 500);
    }

    clearAll() {
        this.list = new Map();
    }
}
