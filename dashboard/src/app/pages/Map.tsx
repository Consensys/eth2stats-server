import React from "react";
import { observer } from "mobx-react";
import { MapChart } from "../components/map/MapChart";
import { Store } from "app/store/Store";

interface IMapProps {
    store: Store;
    network: number;
}

@observer
export class Map extends React.Component<IMapProps> {
    render() {
        const { store } = this.props;

        return (
            <React.Fragment>
                <div className={`${store.getConfig().length > 1 && "mt-44 sm:mt-36" ||
                    "mt-32 sm:mt-24"} mx-auto`}>
                    <MapChart {...this.props} />
                </div>
            </React.Fragment>
        );
    }
}
