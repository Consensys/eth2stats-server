import React from "react";
import { observer } from "mobx-react";
import { useStores } from "../store/Hook";
import { Loading } from "./Loading";
import { Home } from "../pages/Home";
import { Map } from "../pages/Map";
import { AddNode } from "../pages/AddNode";
import { NotFound } from "../pages/NotFound";
import { Notifications } from "./Notifications";
import { Navigation } from "./navigation/Navigation";
import { AppConfig } from "app/AppConfig";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { Tabs } from "app/components/navigation/Tabs";

interface IAppProps {
    appConfig: AppConfig;
}

export const App = observer((props: IAppProps) => {
    const {store} = useStores();
    store.setConfig(props.appConfig);

    let networks = store.getConfig();

    return (
        <div className="text-grey-600">
            <Router>
                <Loading store={store}/>
                <Notifications notifStore={store.notify}/>
                <Tabs/>

                <Switch>
                    {networks.map((net, index) =>
                        <Route path={`${net.path}`} key={net.path}>
                            <Navigation/>
                            <Switch>
                                <Route path={`${net.path}`} exact>
                                    <Home store={store} network={index}/>
                                </Route>
                                <Route path={`${net.path}/map`} exact>
                                    <Map store={store} network={index}/>
                                </Route>

                                <Route>
                                    <NotFound/>
                                </Route>
                            </Switch>
                        </Route>
                    )}
                    <Route path="/add-node" exact >
                        <AddNode/>
                    </Route>
                    <Route path="/" exact>
                        <Redirect to={`${networks[0].path}`}/>
                    </Route>
                    <Route>
                        <NotFound/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
});
