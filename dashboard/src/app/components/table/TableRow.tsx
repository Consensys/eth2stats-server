import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableCell } from "./TableCell";
import { useHover } from "../../utils/useHover";
import {
    ByteSize,
    PeersStatus,
    ShortNodeType,
    SlotDelayStatus
} from "../../formatter/Formatters";
import { Store } from "app/store/Store";
import { IClient } from "app/store/ClientsStore";

interface ITableRowProps {
    store: Store;
    client: IClient;
}

export const TableRow: React.FC<ITableRowProps> = observer((props) => {
    const { store, client } = props; // useStores();

    const handleClick = (e: React.SyntheticEvent) => {
        store.clientStore.pin(client.id);
    };
    const { hovered, handleHover } = useHover();

    const slotStatus = SlotDelayStatus(
        client.latestHead.headSlot,
        store.stats.currentSlot
    );
    const peersStatus = PeersStatus(client.peers);
    const columns = store.columns;
    const pinned = store.clientStore.pinned.includes(client.id);

    let ix: any = {};

    columns.forEach((column, index) => ix[column.name] = index);

    return (
        <div
            {...handleHover}
            className={"py-4 w-full border-b border-darkblue-100 font-semibold text-sm hover:text-white transition " +
                `${client.online ? "online" : "offline"}`
            }>
            <div className="flex sm:flex-row flex-wrap">
                <TableCell
                    column={columns[ix.pin]}
                    className="pl-3 sm:pl-4 pt-3 sm:pt-0 cursor-pointer"
                    onClick={handleClick}
                >
                    <FontAwesomeIcon icon={["far", pinned ? "dot-circle" : "circle"]}
                        size="sm" />
                </TableCell>
                <TableCell
                    column={columns[ix.name]}
                    className="truncate"
                >
                    {client.name}
                </TableCell>
                <div className="flex-break sm:hidden" />
                <TableCell
                    column={columns[ix.type]}
                    data-for="tooltip-text"
                    data-tip={client.beaconClientVersion}
                >
                    {ShortNodeType(client.beaconClientVersion)}
                </TableCell>
                <TableCell
                    column={columns[ix.peers]}
                    className={`${peersStatus}`}
                >
                    {client.peers}
                </TableCell>
                <TableCell
                    column={columns[ix.attestations]}
                >
                    {client.attestations}
                </TableCell>
                <TableCell
                    column={columns[ix.headSlot]}
                    className={`${slotStatus}`}
                    data-for="tooltip-text"
                    data-tip={`Root:${client.latestHead.headBlockRoot}`}
                >
                    {client.latestHead.headSlot}
                </TableCell>
                <TableCell
                    column={columns[ix.justifiedSlot]}
                    className={`${slotStatus}`}
                    data-for="tooltip-text"
                    data-tip={`Justified slot:${client.latestHead.justifiedSlot} Root:${client.latestHead.justifiedBlockRoot}`}
                >
                    {!client.syncing ?
                        client.latestHead.justifiedSlot
                        :
                        <FontAwesomeIcon icon="sync" className="pt-1 sm:pt-0 ml-4" />
                    }
                </TableCell>
                <TableCell
                    column={columns[ix.finalizedSlot]}
                    className={`${slotStatus}`}
                    data-for="tooltip-text"
                    data-tip={`Finalized slot:${client.latestHead.finalizedSlot} Root:${client.latestHead.finalizedBlockRoot}`}
                >
                    {!client.syncing ?
                        client.latestHead.finalizedSlot
                        :
                        !client.syncingRate ?
                        ""
                        :
                        `${client.syncingRate.toFixed(2)} blk/s`
                    }
                </TableCell>
                <TableCell
                    column={columns[ix.memory]}
                >
                    {ByteSize(client.memoryUsage!)}
                </TableCell>
                <TableCell
                    column={columns[ix.options]}
                    className="text-center pr-1 pt-3 sm:pt-0"
                    data-for="tooltip-options"
                    data-tip={client.id}
                >
                    {client.clientVersionStatus === "outdated" ?
                        <FontAwesomeIcon icon="exclamation-circle" size="sm" className="red" />
                        :
                        <FontAwesomeIcon icon="ellipsis-v" size="sm" className={`${hovered ? "" : "hidden"}`} />
                    }
                </TableCell>
            </div>
        </div>
    );
});
