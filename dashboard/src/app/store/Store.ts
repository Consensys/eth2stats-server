import axios from "axios";
import { observable } from "mobx";
import { Stats } from "./Stats";
import { Websockets } from "./Websockets";
import { ClientsStore } from "./ClientsStore";
import { Notifications } from "app/store/Notifications";
import { AppConfig, INetworkConfig } from "../AppConfig";

export interface IColumn {
    name: string;
    label: string;
    classes: string;
    mobileIcon?: string;
    sortable: boolean;
}

export class Store {
    @observable loading = {
        open: false
    };
    @observable network: string;
    @observable networkName: string;
    @observable networkGenesisTime: string; // TODO it should be date ????
    @observable path = "/";
    @observable columns: IColumn[] = [ //TODO extract from here
        {
            name: "pin",
            label: "",
            classes: "w-10 flex-shrink-0",
            mobileIcon: "",
            sortable: false
        },
        {
            name: "name",
            label: "Name",
            mobileIcon: "network-wired",
            classes: "flex-grow flex-basis",
            sortable: true
        },
        {
            name: "type",
            label: "Type",
            mobileIcon: "laptop-code",
            classes: "sm:w-24 xl:w-32 flex-shrink-0",
            sortable: false
        },
        {
            name: "peers",
            label: "Peers",
            mobileIcon: "users",
            classes: "sm:w-16 xl:w-32 flex-shrink-0",
            sortable: true
        },
        {
            name: "attestations",
            label: "Attestations",
            mobileIcon: "check-double",
            classes: "sm:w-16 xl:w-32 flex-shrink-0",
            sortable: true
        },
        {
            name: "headSlot",
            label: "Head Slot",
            mobileIcon: "cube",
            classes: "sm:w-24 xl:w-32 flex-shrink-0",
            sortable: true
        },
        {
            name: "justifiedSlot",
            label: "Justified Slot",
            classes: "sm:w-24 xl:w-32 flex-shrink-0",
            sortable: false
        },
        {
            name: "finalizedSlot",
            label: "Finalized Slot",
            classes: "sm:w-24 xl:w-32 flex-shrink-0",
            sortable: false
        },
        {
            name: "memory",
            label: "Mem Usage",
            mobileIcon: "microchip",
            classes: "sm:w-24 xl:w-32 flex-shrink-0",
            sortable: false
        },
        {
            name: "options",
            label: "",
            classes: "w-10 flex-shrink-0",
            // mobileIcon: '',
            sortable: false
        }
    ];

    networks: INetworkConfig[];

    websocketsService: Websockets;

    // sub-stores
    notify: Notifications;
    stats: Stats;
    clientStore: ClientsStore;

    constructor(notify: Notifications) {
        this.notify = notify;
        this.stats = new Stats();

        this.clientStore = new ClientsStore(this);
        this.websocketsService = new Websockets(this);
    }

    setConfig(config: AppConfig) {
        this.networks = config.getNetworksConfig();
    }

    getConfig() {
        return this.networks;
    }

    getNetworkConfig() {
        return this.networks.find((net) => net.path === this.network);
    }

    changeNetwork(net: string) {
        if (this.network === net) {
            return;
        }

        this.openLoading();

        this.notify.clearAll();
        this.clientStore.reset();
        this.stats.stop();
        this.websocketsService.stop();
        this.network = net;
        this.networkName = "";
        this.networkGenesisTime = "";

        this.fetchNetworkDetails().then(() => {
            this.stats.start(this.networkGenesisTime);
            this.websocketsService.start();
        }).catch((err) => {
            this.notify.error("Got error while fetching network details.");
            this.clientStore.loading(false);
            this.closeLoading();
        });
    }

    openLoading() {
        this.loading.open = true;
    }

    closeLoading() {
        this.loading.open = false;
    }

    fetchNetworkDetails() {
        return new Promise((resolve, reject) => {
            axios.get(this.getNetworkConfig()!.HTTP_API + "/network").then((response) => {
                this.networkName = response.data.data.name;
                this.networkGenesisTime = response.data.data.genesisTime;
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
