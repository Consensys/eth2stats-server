import React from "react";
import { observer } from "mobx-react";
import { TableHeadItem } from "./TableHeadItem";
import { useStores } from "app/store/Hook";

export const TableHead: React.FC = observer(() => {
    const { store } = useStores();

    // TODO not used ?
    // function handleClick(id: string) {
    //   console.log(id);
    //   store.clientStore.setSort(id);
    // }

    return (
        <div className="py-4 w-full bg-darkblue-100 hidden sm:block">
            <div className="flex">
                {store.columns.map((item) => (
                    <TableHeadItem key={item.name} item={item} store={store} />
                ))}
            </div>
        </div>
    );
});
