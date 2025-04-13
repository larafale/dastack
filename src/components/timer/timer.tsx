'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TimerProps {
    className?: string;
    controls?: boolean;
}

export interface TimerApi {
    start: () => void;
    stop: () => void;
    reset: () => void;
    getTime: () => number;
}

const Timer = React.memo(React.forwardRef<TimerApi, TimerProps>(({
    className,
    controls = false,
}, ref) => {
    const [time, setTime] = React.useState(0);
    const [isRecording, setIsRecording] = React.useState(false);
    const startTimeRef = React.useRef<number | null>(null);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const start = React.useCallback(() => {
        if (!isRecording) {
            startTimeRef.current = Date.now() - (time * 1000);
            setIsRecording(true);
        }
    }, [isRecording, time]);

    const stop = React.useCallback(() => {
        if (isRecording) {
            setIsRecording(false);
        }
    }, [isRecording]);

    const reset = React.useCallback(() => {
        setTime(0);
        setIsRecording(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const getTime = React.useCallback(() => time, [time]);

    React.useImperativeHandle(ref, () => ({
        start,
        stop,
        reset,
        getTime
    }), [start, stop, reset, getTime]);

    React.useEffect(() => {
        if (isRecording) {
            startTimeRef.current = Date.now() - (time * 1000);
            intervalRef.current = setInterval(() => {
                const elapsed = (Date.now() - startTimeRef.current!) / 1000;
                setTime(elapsed);
            }, 500);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRecording]);

    return (
        <div className="flex items-center gap-4">
            <span className={cn("select-none", className)}>
                {formatDuration(time)}
            </span>
            {controls && (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={start}
                        disabled={isRecording}
                    >
                        start
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={stop}
                        disabled={!isRecording}
                    >
                        stop
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={reset}
                        disabled={isRecording}
                    >
                        reset
                    </Button>
                </div>
            )}
        </div>
    );
}));

Timer.displayName = 'Timer';

export { Timer }; 