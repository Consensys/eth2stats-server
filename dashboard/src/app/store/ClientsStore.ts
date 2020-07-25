import { action, computed, observable, runInAction } from "mobx";
import axios from "axios";
import debounce from "lodash/debounce";
import ReactTooltip from "react-tooltip";
import { isString } from "../utils/strings";
import { Store } from "./Store";

export interface IClient {
    id: string; // "d5c4ca86b077c3f9557f08aac697a554b9ac1327"
    name: string; // "Infura"
    beaconClientVersion: string; // "Lighthouse/v0.1.0-unstable/x86_64-linux"
    genesisTime: string; //" 2020-02-14T09:00:00Z" //TODO should be date ???
    latestHead: {
        headSlot: number; // 174442
        headBlockRoot: string; //"0xf1810d471643752db6294bf7eba2c097d365f42c0892d68a1111472223ddef9b"
        finalizedSlot: number; // 174368
        finalizedBlockRoot: string; //"0x4f510b5febf058c1d50c203cc98dc5abec540849042b685981e0812170dafc98"
        justifiedSlot: number; // 174400
        justifiedBlockRoot: string; //"0xff968f96313de8946c2fcb032eeca29641b5b01fb2aac9725f650ab38db9a4ed"
    };
    online: boolean; // true
    peers: number; // 16
    attestations: null | string; // null
    syncing: null | string; // null
    syncingRate: null | number; // null
    location: {
        city: string; //"Ashburn"
        lat: number; // 39.0481
        long: number; // -77.4728
    };
    memoryUsage: null | string; // null
    clientVersion: string; //"eth2stats-client/v0.0.6+b3215a9"
    clientVersionStatus: string; //"ok"
}

export class ClientsStore {
    @observable sortBy: string;
    @observable sortOrder: number; // 1 desc -1 asc
    @observable pinned: string[];
    @observable clients: IClient[];
    @observable clientsLoading = true;
    @observable counts = {
        total: 0,
        online: 0
    };

    main: Store;
    fetchDebounced = debounce(() => {
        return this.fetch();
    }, 1000, {
        leading: false,
        trailing: true,
        maxWait: 1000
    });

    constructor(main: Store) {
        this.main = main;
        this.sortBy = JSON.parse(localStorage.getItem("sortBy")!) || "headSlot";
        this.sortOrder = JSON.parse(localStorage.getItem("sortOrder")!) || 1;
        this.pinned = JSON.parse(localStorage.getItem("pinned")!) || [];
    }

    @computed get sortedClients() {
        return this.clients ? this.clients.slice().sort(this.sortFunction.bind(this)) : [];
    }

    clientByID(id: string) {
        return this.clients.find((client) => client.id === id);
    }

    @computed get locations() {
        // const currentSlot = this.main.stats.currentSlot;
        let locations = observable.map({});
        this.sortedClients.forEach(client => {
            if (client.location !== null && client.online) {
                const id = `${client.location.city}:${client.location.long}:${client.location.lat}`;
                const newClient = observable.object(
                    {
                        id: client.id,
                        name: client.name,
                        online: client.online,
                        latestHead: client.latestHead,
                        peers: client.peers
                    }
                );

                if (locations.has(id)) {
                    // append client at this location
                    let location = locations.get(id);
                    location.clients.push(newClient);
                } else {
                    // new location
                    locations.set(id, {
                        id,
                        city: client.location.city,
                        long: client.location.long,
                        lat: client.location.lat,
                        clients: observable.array([newClient])
                    });
                }
            }
        });

        return locations;
    }

    @action.bound
    fetch() {
        return new Promise((resolve, reject) => {
            axios.get(this.main.getNetworkConfig()!.HTTP_API + "/clients").then((response) => {
                runInAction(() => {
                    this.updateList(response.data.data);
                    this.clientsLoading = false;
                    resolve();
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    updateList(data: IClient[]) {
        this.clients = data; // this.clients.replace(data); //TODO why replace ???
        this.counts.total = data.length;
        this.counts.online = data.filter(x => x.online).length;
        ReactTooltip.rebuild();
    }

    sortFunction(a: IClient, b: IClient) {
        const statusA = this.pinned.includes(a.id) ? 3 : a.online ? 2 : 1;
        const statusB = this.pinned.includes(b.id) ? 3 : b.online ? 2 : 1;
        if (statusA === statusB) {
            return this.compare(a, b);
        } else if (statusA > statusB) {
            return -1;
        }
        return 1;
    }

    compare(a: IClient, b: IClient) {
        if ((a.online && b.online) || (!a.online && !b.online)) {
            let aVal;
            let bVal;
            switch (this.sortBy) {
                case "name":
                    aVal = a.name;
                    bVal = b.name;
                    break;
                case "peers":
                    aVal = a.peers;
                    bVal = b.peers;
                    break;
                case "attestations":
                    aVal = a.attestations;
                    bVal = b.attestations;
                    break;
                case "headSlot":
                // also the default
                default:
                    // revert to default
                    aVal = a.latestHead.headSlot;
                    bVal = b.latestHead.headSlot;
            }

            let cmp = 1;
            if (isString(aVal) && isString(bVal)) {
                cmp = -1 * (aVal as string).toLowerCase().localeCompare((bVal as string).toLowerCase()); // inverted
            } else {
                if ((aVal as number) > (bVal as number)) {
                    cmp = -1;
                }
            }

            return this.sortOrder * cmp;
        } else if (a.online) {
            return -1;
        }
        return 1;
    }

    reset() {
        this.clientsLoading = true;
        this.clients = [];
        this.counts.total = 0;
        this.counts.online = 0;
    }

    loading(isLoading: boolean) {
        this.clientsLoading = isLoading;
    }

    @action
    setSort(field: string) {
        if (field === this.sortBy) {
            this.sortOrder *= -1;
            this.saveSort();
            return;
        }
        this.sortBy = field;
        this.saveSort();
    }

    @action
    setSortWithOrder(field: string, order: number) {
        this.sortBy = field;
        this.sortOrder = order;
        this.saveSort();
    }

    saveSort() {
        localStorage.setItem("sortBy", JSON.stringify(this.sortBy));
        localStorage.setItem("sortOrder", JSON.stringify(this.sortOrder));
    }

    @action
    pin(id: string) {
        const index = this.pinned.indexOf(id);
        if (index === -1) {
            // add
            this.pinned.push(id);
        } else {
            // remove
            this.pinned.splice(index, 1);
        }
        // save
        localStorage.setItem("pinned", JSON.stringify(this.pinned));
    }
}
