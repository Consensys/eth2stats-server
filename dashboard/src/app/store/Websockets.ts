import { Store } from "app/store/Store";

export class Websockets {
    socket: WebSocket;
    first = true;

    main: Store;

    constructor(main: Store) {
        this.main = main;

        this.onclose = this.onclose.bind(this);
        this.onopen = this.onopen.bind(this);
        this.onmessage = this.onmessage.bind(this);
        this.onerror = this.onerror.bind(this);
    }

    start() {
        this.socket = new WebSocket(this.main.getNetworkConfig()!.WS_API);

        this.socket.onerror = this.onerror;
        this.socket.onmessage = this.onmessage;
        this.socket.onopen = this.onopen;
        this.socket.onclose = this.onclose;
    }

    stop() {
        if (!this.socket) {
            return;
        }
        // tslint:disable-next-line: no-empty
        this.socket.onclose = () => {
        };
        this.socket.close();
    }

    onopen() {
        if (this.first) {
            this.first = false;
        } else {
            this.main.notify.success("Connected to websockets", true, 3000);
        }

        this.main.clientStore.fetch().then(() => {
            this.main.closeLoading();
        }).catch((error) => {
            this.main.notify.error("API error: " + error.message, false);
        });
    }

    onmessage(msg: any) {
        let obj = null;
        try {
            obj = JSON.parse(msg.data);
        } catch (e) {
            return e;
        }

        if (obj !== null) {
            switch (obj.topic) {
                case "clients":
                    // tslint:disable-next-line:no-floating-promises
                    this.main.clientStore.fetchDebounced();
                    break;
            }
        }
    }

    onerror(error: any) {
        this.socket.close();
        this.main.closeLoading();
    }

    onclose(event: any) {
        if (event.wasClean) {
            this.main.notify.error(
                `Websocket connection closed cleanly, code=${event.code} reason=${event.reason}`,
                true, 3000);
        } else {
            this.main.notify.error("Websocket connection died. Attempting reconnect",
                true, 3000);
        }

        setTimeout(() => {
            this.start();
        }, 5000);
    }
}
