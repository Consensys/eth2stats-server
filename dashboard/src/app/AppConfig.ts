
export interface INetworkConfig {
    "name": string;
    "path": string;
    "joinURL": string;
    "HTTP_API": string;
    "WS_API": string;
    "SERVER_ADDR": string;
}

interface IAppConfigData {
    networks: INetworkConfig[];
}

export class AppConfig {
    private data: IAppConfigData;

    fromJson(data: IAppConfigData) {
        this.data = data;
    }

    getNetworksConfig() {
        return this.data.networks;
    }
}
