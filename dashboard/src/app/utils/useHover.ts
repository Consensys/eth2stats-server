import { useState } from "react";

export const useHover = () => {
    const [hovered, set] = useState(false);
    return {
        hovered,
        handleHover: {
            onMouseEnter: () => set(true),
            onMouseLeave: () => set(false)
        }
    };
};
