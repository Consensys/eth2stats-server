import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "../base/Label";
import { IColumn } from "../../store/Store";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface ITableCellProps {
    className?: string;
    column: IColumn;
    onClick?(e: React.SyntheticEvent): void;
}

export const TableCell: React.FC<ITableCellProps> = props => {
    const { className, column, ...otherProps } = { ...props };
    let classesArr = [column.classes, className, "sm:block"];
    if (typeof column.mobileIcon !== "undefined") {
        classesArr.push("flex p-2 sm:p-0");
    } else {
        classesArr.push("hidden");
    }
    const classes = classesArr.join(" ");
    const id = column.name;

    return (
        <Label id={id} className={classes}  {...otherProps}>
            {column.mobileIcon &&
                <FontAwesomeIcon icon={column.mobileIcon as IconName} size="sm" className="m-1 sm:hidden" />
            }
            {props.children}
        </Label>
    );
};
