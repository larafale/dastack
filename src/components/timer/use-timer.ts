import * as React from "react";
import { Timer } from "./timer";

export function useTimer() {
    const timerRef = React.useRef<React.ElementRef<typeof Timer>>(null);

    const start = React.useCallback(() => {
        timerRef.current?.start();
    }, []);

    const stop = React.useCallback(() => {
        timerRef.current?.stop();
    }, []);

    const reset = React.useCallback(() => {
        timerRef.current?.reset();
    }, []);

    return {
        ref: timerRef,
        start,
        stop,
        reset,
    };
} 