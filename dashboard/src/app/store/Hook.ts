import React from "react";
import { storesContext } from "app/store/Context";

export const useStores = () => React.useContext(storesContext);
