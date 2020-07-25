import React from "react";
import { observer } from "mobx-react";
import { Store } from "app/store/Store";

interface INodesCountProps {
    store: Store;
}

export const NodesCount: React.FC<INodesCountProps> = observer(props =>
    <div className="flex items-center text-grey-600">
        <p className="font-semibold text-sm mr-4">Nodes</p>
        <p className="mr-4 sm:mr-6">{props.store.clientStore.counts.online} / {props.store.clientStore.counts.total}</p>
        <span
            className="mr-2 sm:mr-6 h-6 border-r border-grey-600 hidden sm:block"
            role="separator" />
    </div>
);
