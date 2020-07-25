import React from "react";
import { Store } from "app/store/Store";
import { Notifications } from "app/store/Notifications";

export const storesContext = React.createContext({
    store: new Store(new Notifications())
});
