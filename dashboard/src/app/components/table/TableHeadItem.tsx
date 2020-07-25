import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import { Label } from "../base/Label";
import { Store, IColumn } from "app/store/Store";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface ITableHeadItemProps {
    store: Store;
    item: IColumn;
}

export const TableHeadItem: React.FC<ITableHeadItemProps> = observer((props) => {

    const { store, item } = props; // useStores();

    function handleClick(clickedItem: IColumn) {
        if (clickedItem.sortable) {
            store.clientStore.setSort(clickedItem.name);
        }
    }

    return (
        <Label id={item.name}
            className={`text-xs ${item.classes} ${item.sortable
                ? "cursor-pointer"
                : ""}`}
            onClick={() => handleClick(item)}
        >
            {item.label}
            {item.name === store.clientStore.sortBy &&
                <FontAwesomeIcon
                    icon={`sort-${store.clientStore.sortOrder === 1
                        ? "down"
                        : "up"}` as IconName}
                    className="ml-1" />
            }
        </Label>
    );
});
