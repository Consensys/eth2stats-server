import React from "react";
import ReactTooltip from "react-tooltip";
import { MapTooltipContent } from "./MapTooltipContent";

interface IMapTooltipProps {
    store: any;
    markers: any;
}

export const MapTooltip: React.FC<IMapTooltipProps> = (props) => {
    const { store, markers } = props; // useStores();

    const handleTooltipContent = (dataTip: any) => {
        if (!dataTip) {
            return "";
        }

        const marker = markers.get(dataTip);
        if (typeof marker === "undefined") {
            return "";
        }

        return (
            <MapTooltipContent marker={marker} store={store} />
        );
    };

    return (
        <ReactTooltip className="tooltip" getContent={handleTooltipContent}
            place={"top"} />
    );
};
