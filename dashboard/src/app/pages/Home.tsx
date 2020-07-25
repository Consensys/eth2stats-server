import React from "react";
import { Table } from "../components/table/Table";
import { Store } from "app/store/Store";

interface IHomeProps {
    store: Store;
    network: number;
}

export class Home extends React.Component<IHomeProps> {
    render() {
        const { store } = this.props;

        return (
            <div className={`${store.getConfig().length > 1 && "mt-44 sm:mt-36" ||
                "mt-32 sm:mt-24"} mx-auto`}>
                <Table {...this.props} />
            </div>
        );
    }
}
