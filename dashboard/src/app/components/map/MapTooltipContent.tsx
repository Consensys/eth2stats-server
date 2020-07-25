import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PeersStatus, SlotDelayStatus } from "../../formatter/Formatters";
import { Store } from "app/store/Store";
import { IClient } from "app/store/ClientsStore";

const shownClients = 3;

interface IMapTooltipContentProps {
    store: Store;
    marker: any;
}

export const MapTooltipContent = (props: IMapTooltipContentProps) => {

    const { store, marker } = props; // useStores();

    let count = 0;
    return (
        <React.Fragment>
            <p className="text-white mb-2">
                <strong>{marker.city}</strong>
            </p>
            {marker.clients.map((client: IClient) => {
                count++;
                if (count > shownClients) {
                    if (count === 4 && marker.clients.length - shownClients > 0) {
                        return (
                            <p key="end" className={`text-grey-500 mt-1`}>
                                plus {marker.clients.length - shownClients} more clients...
                            </p>
                        );
                    }
                    return null;
                }
                return (
                    <div key={client.id}>
                        <div className="flex flex-initial items-center">
                            <div className="mr-2 w-4 text-center">
                                <FontAwesomeIcon icon="network-wired" className="mr-2" />
                            </div>
                            <p className={`text-alethio-green`}>{client.name}</p>
                        </div>
                        <div className="flex flex-initial items-center mb-1">
                            <div className="mr-2 w-4 text-center">
                                <FontAwesomeIcon icon="cube" />
                            </div>
                            <p className={`w-16 marker ${SlotDelayStatus(
                                client.latestHead.headSlot,
                                store.stats.currentSlot
                            )}`}>
                                {client.latestHead.headSlot}
                            </p>
                            <FontAwesomeIcon icon="users" className="mr-2" />
                            <p className={`marker ${PeersStatus(client.peers)}`}>
                                {client.peers}
                            </p>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
