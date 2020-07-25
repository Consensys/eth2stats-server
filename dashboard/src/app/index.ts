import { App } from "./App";
import "../styles/index.pcss";
import "./fa-library";

//tslint:disable-next-line:no-floating-promises
(new App()).init(document.getElementById("root") as HTMLElement);
