import React from "react";
import { Marker } from "react-simple-maps";

interface IMapMarkerProps {
    marker: {
        long: number;
        lat: number;
        id: number;
        location: string;
    };
    key: number;
}

const radius = 2;

export const MapMarker: React.FC<IMapMarkerProps> = (props) => {
    if (props.marker.location === null) {
        return null;
    }

    return (
        <Marker
            coordinates={[props.marker.long, props.marker.lat]}
            data-tip={props.marker.id}
        >
            <circle r={radius} fill="#347CFC" />
        </Marker>
    );
};
