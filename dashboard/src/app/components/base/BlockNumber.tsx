import * as React from "react";
import { observer } from "mobx-react";

interface IBlockNumberProps {
    size?: string;
    text?: string;
    bg?: string;
}

export const BlockNumber: React.FC<IBlockNumberProps> = observer(props =>
    <p className={`font-bold text-${props.text ||
        "white"} bg-${props.bg ||
        "blue-500"} px-2 py-1 ${props.size || "text-xl"} inline`}>
        #{props.children}
    </p>);
