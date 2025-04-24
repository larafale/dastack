import { useState } from 'react';

export function useCopy(copyTimeout = 2000) {
    const [isCopied, setIsCopied] = useState(false);

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), copyTimeout);
            return true;
        } catch (error) {
            console.error('Failed to copy text:', error);
            return false;
        }
    };

    return { isCopied, copy };
}