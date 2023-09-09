"use client"
import { useEffect } from "react";

export default function useBeforeunload(callback: () => unknown) {
    useEffect(() => {
        window.addEventListener("beforeunload", callback);
        return () => {
            window.removeEventListener("beforeunload", callback)
        }
    }, []);
}