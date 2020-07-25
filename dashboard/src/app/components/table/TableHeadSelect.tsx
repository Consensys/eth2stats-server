import React from "react";
import { observer } from "mobx-react";
import { useStores } from "app/store/Hook";

export const TableHeadSelect: React.FC = observer(() => {
    const {store} = useStores();

    const handleChange = (e: React.SyntheticEvent) => {
        const sortValue = (e.target as HTMLSelectElement).value;
        let sortOrder = 1;
        if (sortValue.includes(" ascending")) {
            sortOrder = -1;
        }
        let key = sortValue.replace(" ascending", "");
        key = key.replace(" descending", "");
        store.clientStore.setSortWithOrder(key, sortOrder);
    };

    const value = `${store.clientStore.sortBy} ${store.clientStore.sortOrder === 1 ? "descending" : "ascending"}`;
    return (
        <div
            className="inline-block relative w-full bg-darkblue-100 text-grey-600 font-semibold sm:hidden">
            <select
                className="block appearance-none w-full bg-darkblue-100 border-0 px-4 py-4 pr-8 leading-tight focus:outline-none focus:shadow-outline capitalize"
                value={value} onChange={handleChange}>
                {store.columns.filter(column => column.sortable).map((column) => (
                    <React.Fragment key={column.name}>
                        <option value={`${column.name} ascending`}>{column.label} ascending</option>
                        <option value={`${column.name} descending`}>{column.label} descending</option>
                    </React.Fragment>
                ))}
            </select>
            <div
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 bg-darkblue-100">
                <svg className="fill-current h-4 w-4"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                >
                    <path
                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                </svg>
            </div>
        </div>
    );
});
