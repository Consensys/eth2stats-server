import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStores } from "app/store/Hook";

export const NotFound: React.FC = () => {
    const {store} = useStores();

    return (
        <div className="flex flex-col items-center mt-40 text-center">
            <div className="text-6xl font-bold">
                <FontAwesomeIcon icon="exclamation-circle" />
            </div>
            <div className="mt-10 text-5xl">
                <p>Page does not exist !</p>
            </div>
            <div className="flex flex-col items-center text-xl font-bold">
                <div className="mt-20">
                    <p>Please select one of the active networks</p>
                </div>
                <div className="flex flex-wrap mt-4 justify-center">
                    {store.networks.map(net =>
                        <Link to={`${net.path}`} key={net.path}>
                            <div className={`m-4 p-4 flex items-center justify-center border text-grey-600 border-grey-600 hover:border-white hover:text-white transition`}>
                                {net.name}
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
