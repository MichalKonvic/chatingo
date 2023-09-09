import { MutableRefObject, useEffect } from "react";

export default function useClickOutside(refs: MutableRefObject<null | HTMLElement>[], callback: () => void) {
    const handleClick = (e: MouseEvent) => {
        let callCallback = true
        for (const ref of refs) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            if (ref.current && ref.current.contains(e.target)) {
                // ref obj has target so it should not be called
                callCallback = false;
            }
        }
        if (callCallback)
            callback();
    };
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
}