import React from "react";
import { observer } from "mobx-react";
import { Scrollbars } from "react-custom-scrollbars";
import ReactTooltip from "react-tooltip";
import { TableHead } from "./TableHead";
import { TableMessage } from "./TableMessage";
import { TableHeadSelect } from "./TableHeadSelect";
import { TableRow } from "./TableRow";
import { useStores } from "app/store/Hook";
import { getScrollHeight } from "app/utils/getScrollHeight";

export const Table: React.FC = observer(() => {
    const {store} = useStores();

    const optionsTooltipContent = (dataTip: string) => {
        if (!dataTip) {
            return "";
        }

        const client = store.clientStore.clientByID(dataTip);
        if (typeof client === "undefined") {
            return "";
        }

        return (
            <div className="flex flex-col items-center">
                <span className="text-white">{client.clientVersion}</span>
                {
                    client.clientVersionStatus === "outdated" ?
                        <span className="text-alethio-red">There's a new version available, please upgrade.</span>
                        :
                        client.clientVersionStatus === "ok"
                            ?
                            <span className="text-alethio-green">Your eth2stats-client is up-to-date. High five!</span>
                            :
                            <span className="text-grey-500">The client version is unknown.</span>
                }
            </div>

        );
    };

    const loading = store.clientStore.clientsLoading;

    const scrollHeight = getScrollHeight(store.getConfig().length > 1) - 50; // 50 = table head height

    return (
        <React.Fragment>
            <TableHeadSelect/>
            <div>
                <ReactTooltip id="tooltip-text" className="tooltip"/>
                <ReactTooltip id="tooltip-options" className="tooltip" place="left"
                              getContent={optionsTooltipContent}/>
                <TableHead/>
                {!store.clientStore.counts.total &&
                <TableNoData/>
                }
                <Scrollbars autoHide autoHeight autoHeightMin={0}
                            autoHeightMax={scrollHeight}>
                    {loading &&
                    <TableLoading/>
                    }
                    <div className="w-full relative block overflow-anchor-none bg-darkblue-200">
                        {store.clientStore.sortedClients.map((client) => (
                            <TableRow client={client} key={client.id} store={store}/>
                        ))}
                    </div>

                </Scrollbars>
            </div>
        </React.Fragment>
    );
});

const TableNoData = () => (
    <TableMessage>There's no data to be shown.</TableMessage>
);

const TableLoading = () => (
    <TableMessage>Please wait, loading data ...</TableMessage>
);
