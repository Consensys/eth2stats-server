import * as React from "react";
import { observer } from "mobx-react";
import { Notifications as NotifStore, INotification } from "app/store/Notifications";

interface INotificationsProps {
    notifStore: NotifStore;
}

export const Notifications = observer((props: INotificationsProps) => {
    const notifStore = props.notifStore;

    let items: React.ReactNode[] = [];
    notifStore.list.forEach((n: INotification, key: number) => {
        let bg = "bg-blue-500";
        let text = "text-white";

        if (n.type === "error") {
            bg = "bg-red-500";
        }

        if (n.type === "success") {
            bg = "bg-green-500";
        }

        if (n.type === "warn") {
            bg = "bg-orange-500";
        }

        items.push(
            <div
                className={`w-full py-2 px-4 h-auto flex animated faster ${n.dismissed ===
                    true ? "zoomOut" : "zoomIn"} cursor-pointer`} key={key}
                onClick={() => !n.dismissable || notifStore.close(key)}>
                <div className={`${bg} rounded flex-1 shadow-md`}>
                    <p className={`${text} p-4`}>{n.message}</p>
                </div>
            </div>
        );
    });

    return (
        <div className="fixed z-50 w-full max-w-md h-auto top-0 right-0 pt-2">
            {items}
        </div>
    );
});
