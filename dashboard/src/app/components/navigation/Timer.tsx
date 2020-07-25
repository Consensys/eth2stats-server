import React from "react";
import { observer } from "mobx-react";
import { Store } from "app/store/Store";

interface ITimerProps {
    store: Store;
}

export const Timer: React.FC<ITimerProps> = observer(props => (
    <div className="text-grey-600 ml-4 flex items-center">
        <p className="w-10 sm:w-12 text-sm sm:text-base mr-2 font-bold timer flex justify-end">
            {props.store.stats.timeSinceSlotStart}</p>
        <p className="font-normal text-sm">ago</p>
    </div>
));
