"use client"
import { useState, useEffect } from 'react';

const getWidth = () => window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

const getHeight = () => window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

export function useWindowSize() {
    // save current window width in the state object
    const [size, setSize] = useState({ width: getWidth(), height: getHeight() });
    // in this case useEffect will execute only once because
    // it does not have any dependencies.
    useEffect(() => {
        // timeoutId for debounce mechanism
        let timeoutId = null;
        const resizeListener = () => {
            // prevent execution of previous setTimeout
            clearTimeout(timeoutId);
            // change width from the state object after 150 milliseconds
            timeoutId = setTimeout(() => {
                setSize({ width: getWidth(), height: getHeight() });
            }, 300);
        };
        // set resize listener
        window.addEventListener('resize', resizeListener);

        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        }
    }, [])

    return size;
}

// 
//'use client'
// import { useDebounce } from '@/hooks/use-debounce'
// import useEvent from '@/hooks/use-event'

// const emptyObj = {}

// export interface DebouncedWindowSizeOptions {
//     initialWidth?: number
//     initialHeight?: number
//     wait?: number
//     leading?: boolean
// }

// const win = typeof window === 'undefined' ? null : window
// const wv =
//     win && typeof win.visualViewport !== 'undefined' ? win.visualViewport : null
// const getSize = () =>
//     [
//         document.documentElement.clientWidth,
//         document.documentElement.clientHeight,
//     ] as const

// export const useWindowSize = (
//     options: DebouncedWindowSizeOptions = emptyObj
// ): readonly [number, number] => {
//     const { wait, leading, initialWidth = 0, initialHeight = 0 } = options
//     const [size, setDebouncedSize] = useDebounce<readonly [number, number]>(
//         /* istanbul ignore next */
//         typeof document === 'undefined' ? [initialWidth, initialHeight] : getSize,
//         wait,
//         leading
//     )
//     const setSize = (): void => setDebouncedSize(getSize)

//     useEvent(win, 'resize', setSize)
//     // @ts-expect-error
//     useEvent(wv, 'resize', setSize)
//     useEvent(win, 'orientationchange', setSize)

//     return size
// }

// export const useWindowHeight = (
//     options?: Omit<DebouncedWindowSizeOptions, 'initialWidth'>
// ): number => useWindowSize(options)[1]

// export const useWindowWidth = (
//     options?: Omit<DebouncedWindowSizeOptions, 'initialHeight'>
// ): number => useWindowSize(options)[0]