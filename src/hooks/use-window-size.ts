'use client'
import { useState, useEffect } from 'react';

export function useWindowSize() {
    // Initialize with undefined to prevent hydration mismatch
    const [size, setSize] = useState<{ width: number | undefined; height: number | undefined }>({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        // Handler to call on window resize
        const getWidth = () => window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        const getHeight = () => window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        // Set initial size
        setSize({
            width: getWidth(),
            height: getHeight()
        });

        // timeoutId for debounce mechanism
        let timeoutId: NodeJS.Timeout | null = null;
        const resizeListener = () => {
            // prevent execution of previous setTimeout
            if (timeoutId) clearTimeout(timeoutId);
            // change width from the state object after 300 milliseconds
            timeoutId = setTimeout(() => {
                setSize({ width: getWidth(), height: getHeight() });
            }, 300);
        };
        // set resize listener
        window.addEventListener('resize', resizeListener);
        window.addEventListener('orientationchange', resizeListener);

        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
            window.removeEventListener('orientationchange', resizeListener);
        }
    }, []);  // Empty array ensures this runs only on mount and unmount

    return size;
}
