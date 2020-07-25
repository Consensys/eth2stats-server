import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface IBottomNavProps {
    joinURL: string;
}

export const BottomNav: React.FC<IBottomNavProps> = (props) => (
    <div>
        <nav
            className="fixed bottom-0 w-full hidden sm:flex items-center justify-between bg-darkblue-100 h-16 z-30">
            <div className="px-4 flex items-center">
                <Link to="add-node"
                    className="flex items-center text-white hover:text-blue-500 transition mr-8">
                    <FontAwesomeIcon icon="plus-circle" className="mr-2" />
                    <span className="font-semibold text-sm">Add your node</span>
                </Link>
                <a href={props.joinURL}
                    className="flex items-center text-white hover:text-blue-500 transition mr-8"
                    target="_blank">
                    <FontAwesomeIcon icon="code-branch" className="mr-2" />
                    <span className="font-semibold text-sm">Join testnet</span>
                </a>
            </div>
            <div
                className="px-4 flex items-center font-semibold text-sm text-grey-600">
                <a href="https://github.com/Alethio/eth2stats-client/issues"
                    className="mr-8 flex items-center text-grey-600 hover:text-blue-500 transition"
                    target="_blank">
                    <FontAwesomeIcon icon="exclamation-circle" className="mr-2" />
                    <span className="font-semibold text-sm">Report issues</span>
                </a>
                <div className="flex items-center">
                    <span className="mr-2">powered by </span>
                    <a href="https://aleth.io"
                        className="text-grey-600 hover:text-blue-500 transition"
                        target="_blank">Aleth.io</a>
                </div>
            </div>
        </nav>
    </div>
);
