import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { onReactionError, when } from "mobx";
import { AppConfig } from "./AppConfig";
import { App as AppComponent } from "app/components/App";

export class App {
    async init(target: HTMLElement) {
        let appConfigData: any;
        try {
            appConfigData = (await axios.get("/config/config.json")).data;
        } catch (e) {
            // No logging support yet
            // tslint:disable-next-line:no-console
            console.error(`Couldn't load application config!`, e);
            return;
        }
        let appConfig = new AppConfig();
        appConfig.fromJson(appConfigData);

        onReactionError((e) => {
            // TODO proper logging
            // logger.error(e);
        });

        when(() => true, () => {
            ReactDOM.render(
                React.createElement(AppComponent, { appConfig }),
                target
            );
        });
    }
}
