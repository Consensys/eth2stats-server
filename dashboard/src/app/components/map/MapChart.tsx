import * as React from "react";
import {values} from "mobx";
import {observer} from "mobx-react";
import {Scrollbars} from "react-custom-scrollbars";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import {geoCylindricalStereographic} from "d3-geo-projection";
import { getScrollHeight } from "../../utils/getScrollHeight";
import { MapTooltip } from "./MapTooltip";
import { MapMarker } from "./MapMarker";
import { Store } from "app/store/Store";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const width = 800;
const height = 550;
// const radius = 2;

const projection = geoCylindricalStereographic().parallel(45).scale(180);

interface IMapChartProps {
  store: Store;
}

export const MapChart: React.FC<IMapChartProps> = observer((props) => {
  const {store} = props; // useStores();

  const tabsVisible = store.getConfig().length > 1;
  const scrollHeight = getScrollHeight(tabsVisible);

  if (store.clientStore.clientsLoading) {
    return (<MapLoading/>);
  }

  const markers = store.clientStore.locations;

  if (markers.size === 0) {
    return (<MapNoData/>);
  }

  return (
      <Scrollbars autoHide autoHeight autoHeightMin={0}
                  autoHeightMax={scrollHeight}>
        <ComposableMap width={width} height={height} projection={projection} className="bg-darkblue-200">
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({geographies}) =>
                  geographies.map(geo => (
                      <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          clipPath="url(#rsm-sphere)"
                          fill="#172232"
                      />
                  ))
              }
            </Geographies>
            {values(markers).map((marker) => (
                <MapMarker marker={marker} key={marker.id}/>
            ))}
          </ZoomableGroup>
        </ComposableMap>
        <MapTooltip markers={markers} store={store}/>
      </Scrollbars>
  );
});

const MapNoData = () => (
    <MapMessage>There's no data to be shown.</MapMessage>
);

const MapLoading = () => (
    <MapMessage>Please wait, loading data ...</MapMessage>
);

const MapMessage = (props: {children: React.ReactChild}) => (
    <div
        className="absolute m-auto top-0 right-0 bottom-0 left-0 h-8 py-4 px-6 bg-transparent">
      <div className="flex justify-center">
        <p className="font-semibold text-sm text-white">{props.children}</p>
      </div>
    </div>
);
