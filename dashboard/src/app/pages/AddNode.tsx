import React from "react";
import { useStores } from "app/store/Hook";
import { LogoWithTitle } from "app/components/navigation/LogoWithTitle";

interface INode {
    type: string;
    beaconAddr: string;
    beaconAddrDetails: string;
    metricsAddr: string;
    metricsEnabled: boolean;
}

interface INodeTypeDetails {
    url: string;
    title: string;
}

const NodeList: INode[] = [
    {
        type: "lighthouse",
        beaconAddr: "http://localhost:5052",
        beaconAddrDetails: "HTTP endpoint for the beacon chain node's RESTful JSON API",
        metricsAddr: "http://localhost:5052/metrics",
        metricsEnabled: true
    },
    {
        type: "nimbus",
        beaconAddr: "http://localhost:9190",
        beaconAddrDetails: "HTTP endpoint for the beacon chain node's RESTful JSON API",
        metricsAddr: "http://localhost:8008/metrics",
        metricsEnabled: true
    },
    {
        type: "prysm",
        beaconAddr: "localhost:4000",
        beaconAddrDetails: "GRPC host:port that the beacon node client accepts connection on",
        metricsAddr: "http://localhost:8080/metrics",
        metricsEnabled: true
    },
    {
        type: "teku",
        beaconAddr: "http://localhost:5051",
        beaconAddrDetails: "HTTP endpoint for the beacon chain node's RESTful JSON API",
        metricsAddr: "http://localhost:8008/metrics",
        metricsEnabled: true
    }
];

export const AddNode: React.FC = () => {
    const {store} = useStores();

    const [network, setNetwork] = React.useState(store.networks[0]);
    const [node, setNode] = React.useState(NodeList[0]);
    const [runClient, setRunClient] = React.useState("docker");
    const [nodeName, setNodeName] = React.useState("");
    const [dataFolder, setDataFolder] = React.useState("~/.eth2stats/data");

    let nodeTypeDetails!: INodeTypeDetails;
    switch (node.type) {
        case "prysm":
            nodeTypeDetails = {
                url: "https://docs.prylabs.network/docs/getting-started.html",
                title: "Prysmatic Documentation Portal"
            };
            break;
        case "lighthouse":
            nodeTypeDetails = {
                url: "https://lighthouse-book.sigmaprime.io/",
                title: "Lighthouse Book"
            };
            break;
        case "nimbus":
            nodeTypeDetails = {
                url: "https://nimbus.team/docs/",
                title: "Nimbus Docs"
            };
            break;
        case "teku":
            nodeTypeDetails = {
                url: "https://docs.teku.pegasys.tech/en/latest/",
                title: "Teku Docs"
            };
            break;

    }

    let runCode = "\n\n# Please type in your Node Name\n\n\n";
    if (nodeName !== "") {
        if (runClient === "docker") {
            runCode = `docker run -d --restart always --network="host" \\` + "\n" +
                `--name eth2stats-client \\` + "\n" +
                `-v ${dataFolder}:/data \\` + "\n" +
                `alethio/eth2stats-client:latest run \\` + "\n" +
                `--eth2stats.node-name="${nodeName}" \\` + "\n" +
                `--data.folder="/data" \\` + "\n" +
                `--eth2stats.addr="${network.SERVER_ADDR}" --eth2stats.tls=true \\` + "\n" +
                `--beacon.type="${node.type}" \\` + "\n" +
                `--beacon.addr="${node.beaconAddr}"`;
            if (node.metricsEnabled && node.metricsAddr !== "") {
                runCode += " \\\n" + `--beacon.metrics-addr="${node.metricsAddr}"`;
            }
        } else {
            runCode = `# Please execute the following commands individually` + "\n" +
                `# This needs a working Go installation to succeed` + "\n\n" +
                `git clone https://github.com/Alethio/eth2stats-client.git` + "\n\n" +
                `cd eth2stats-client` + "\n\n" +
                `make build` + "\n\n" +
                `./eth2stats-client run \\` + "\n" +
                `--eth2stats.node-name="${nodeName}" \\` + "\n" +
                `--data.folder ${dataFolder} \\` + "\n" +
                `--eth2stats.addr="${network.SERVER_ADDR}" --eth2stats.tls=true \\` + "\n" +
                `--beacon.type="${node.type}" \\` + "\n" +
                `--beacon.addr="${node.beaconAddr}"`;
            if (node.metricsEnabled && node.metricsAddr !== "") {
                runCode += " \\\n" + `--beacon.metrics-addr="${node.metricsAddr}"`;
            }
        }
        runCode += "\n";
    }

    return (
        <div
            className="w-full h-full flex flex-wrap bg-darkblue-100 p-0 text-white max-w-screen-xl mx-auto"
            style={{marginTop: store.getConfig().length > 1 && 48 || 0}}
        >
            <div className="w-full flex flex-col sm:justify-center h-24">
                <div className="flex justify-between w-full py-4 sm:py-0">
                    <LogoWithTitle title="Add your node to Eth2Stats"/>
                </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
                <div className="flex flex-col items-start">
                    <form className="flex flex-col">
                        <div>
                            <p>
                                Eth2Stats needs to run a data collector app that connects
                                to your beacon chain client
                            </p>
                        </div>

                        <div className="flex flex-wrap my-6">
                            <div className="w-full ">
                                <label
                                    className="block tracking-wide font-bold mb-2"
                                    htmlFor="node-name">
                                    Node Name
                                </label>
                                <input
                                    className="inputs"
                                    id="node-name" type="text" placeholder=""
                                    value={nodeName}
                                    onChange={e => setNodeName(e.target.value)}
                                />
                                <p className="text-gray-600 text-md italic">
                                    This is the name that your node will display on
                                    &nbsp;
                                    <a href="https://eth2stats.io/">
                                        Eth2Stats
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap mb-6">
                            <div className="w-full ">
                                <label
                                    className="block tracking-wide font-bold mb-2"
                                    htmlFor="eth2-network">
                                    Ethereum 2.0 Network
                                </label>
                                <div className="inline-block relative w-full">
                                    <select id="eth2-network" name="network" value={network.path}
                                            className="inputs pr-8"
                                            onChange={
                                                e => setNetwork(store.networks.find(n => n.path === e.target.value)!)
                                            }
                                    >
                                        {store.networks.map(net =>
                                            <option className="" key={net.path} value={`${net.path}`}>
                                                {net.name}
                                            </option>
                                        )}
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 -mt-3 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-md italic">
                                    Which network is your node connected to
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap mb-6">
                            <div className="w-full ">
                                <label
                                    className="block tracking-wide font-bold mb-2"
                                    htmlFor="client-type">
                                    Beacon Node Client Type
                                </label>
                                <div className="inline-block relative w-full">
                                    <select id="client-type" name="node" value={node.type}
                                            className="inputs pr-8"
                                            onChange={e => {
                                                setNode(NodeList.find(n => n.type === e.target.value)!);
                                            }}>
                                        >
                                        {NodeList.map(n =>
                                            <option className="" key={n.type} value={n.type}>
                                                {n.type}
                                            </option>
                                        )}
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 -mt-3 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-md italic">
                                    What beacon node client you are using
                                </p>
                                <p className="text-gray-600 text-md italic -mt-1">
                                    For more information
                                    on {node.type.charAt(0).toUpperCase() + node.type.slice(1)} &nbsp;
                                    check out the  &nbsp;
                                    <a href={nodeTypeDetails.url} target="_blank">
                                        {nodeTypeDetails.title}
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap mb-6">
                            <div className="w-full ">
                                <label
                                    className="block tracking-wide font-bold mb-2"
                                    htmlFor="data-folder">
                                    Data Folder Path
                                </label>
                                <input
                                    className="inputs"
                                    id="data-folder" type="text"
                                    value={dataFolder}
                                    onChange={e => setDataFolder(e.target.value)}
                                />
                                <p className="text-gray-600 text-md italic">
                                    eth2stats-client will persist a few kilobytes of data here
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap mb-6">
                            <div className="w-full ">
                                <label
                                    className="block tracking-wide font-bold mb-2"
                                    htmlFor="beacon-addr">
                                    Beacon Node Client Address
                                </label>
                                <input
                                    className="inputs"
                                    id="beacon-addr" type="text"
                                    value={node.beaconAddr}
                                    onChange={e => setNode({...node, beaconAddr: e.target.value})}
                                />
                                <p className="text-gray-600 text-md italic">
                                      {node.beaconAddrDetails}
                                </p>
                            </div>
                        </div>

                        {node.metricsEnabled &&
                        <React.Fragment>
                            <div className="flex flex-wrap mb-6">
                                <div className="w-full ">
                                    <label
                                        className="block tracking-wide font-bold mb-2"
                                        htmlFor="metrics-addr">
                                        Beacon Node Client Metrics Endpoint
                                    </label>
                                    <input
                                        className="inputs"
                                        id="metrics-addr" type="text"
                                        value={node.metricsAddr}
                                        onChange={e => setNode({...node, metricsAddr: e.target.value})}
                                    />
                                    <p className="text-gray-600 text-md italic">
                                        Prometheus metrics endpoint used to enhance the collected data
                                    </p>
                                </div>
                            </div>
                        </React.Fragment>
                        }
                    </form>
                </div>
            </div>
            <div className="w-full md:w-1/2 px-4">
                <div className="mt-1">
                    <div className="relative overflow-hidden mb-8 text-base">
                        <div
                            className="bg-white overflow-hidden border-t border-l border-r border-gray-400 p-4">
                            <ul className="flex">
                                <li className="mr-3">
                                    <a
                                        className={runClient === "docker" ? `pill-active` : `pill`}
                                        href="#"
                                        onClick={e => {
                                            setRunClient("docker");
                                            setDataFolder("~/.eth2stats/data");
                                            e.preventDefault();
                                        }}
                                    >
                                        Run in Docker
                                    </a>
                                </li>
                                <li className="mr-3">
                                    <a
                                        className={runClient === "source" ? `pill-active` : `pill`}
                                        href="#"
                                        onClick={e => {
                                            setRunClient("source");
                                            setDataFolder("~/.eth2stats/data");
                                            e.preventDefault();
                                        }}
                                    >
                                        Compile from source
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-darkblue-200">
                            <pre className="scrollbar-none m-0 px-2 py-4">
                                <code className="whitespace-pre text-sm text-alethio-green">{runCode}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
