import * as React from "react";

interface ILabelProps {
    children: React.ReactNode;
    className: string;
    id?: string;
    onClick?(e: React.SyntheticEvent): void;
}

export const Label: React.FC<ILabelProps> = (props) => (
    <p {...props}>
        {props.children}
    </p>
);
