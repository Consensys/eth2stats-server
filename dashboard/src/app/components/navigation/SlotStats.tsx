import * as React from "react";
import { observer } from "mobx-react";
import { Label } from "../base/Label";
import { BlockNumber } from "../base/BlockNumber";
import { Timer } from "./Timer";
import { Store } from "app/store/Store";

interface ISlotStatsProps {
    store: Store;
}

export const SlotStats: React.FC<ISlotStatsProps> = observer((props) => (
    <ul className="flex items-center">
        <li className="mr-4 sm:mr-6 flex items-center">
            <Label className="mr-4">Slot</Label>
            <BlockNumber
                size="text-sm sm:text-lg">{props.store.stats.currentSlot}</BlockNumber>
            <Timer store={props.store} />
        </li>
        <li className="mr-4 sm:mr-6 h-6 border-r border-grey-600 block"
            role="separator" />
        <li className="sm:mr-6 flex items-center">
            <Label className="mr-4">Epoch</Label>
            <BlockNumber
                size="text-sm sm:text-lg">{props.store.stats.currentEpoch}</BlockNumber>
        </li>
    </ul>
));
