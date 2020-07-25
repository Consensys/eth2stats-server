export const ShortNodeType = (type: string) => (typeof type !== "undefined")
    ? type.split("/")[0]
    : "- -";

export const ByteSize = (size: string) => {
    if (typeof size !== "number") {
        return "- -";
    }

    let unit = "MB";
    let mem = parseInt(size, 10) / 1024 / 1024;
    if (mem > 1024) {
        mem = mem / 1024;
        unit = "GB";
    }
    mem = Math.round(mem * 100) / 100;
    return mem + unit;
};

export const SlotDelayStatus = (clientSlot: number, networkSlot: number) => {
    let diff = networkSlot - clientSlot;

    if (diff > 64) {
        return "red";
    }

    if (diff > 2) {
        return "orange";
    }

    return "";
};

export const PeersStatus = (peers: number) => {
    if (peers >= 10) {
        return "";
    }

    if (peers >= 3) {
        return "orange";
    }

    return "red";
};
