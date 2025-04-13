'use client';
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CodeLine({ content }: { content: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="border rounded-md p-3 px-4 font-mono text-sm flex items-center justify-between gap-2 ">
            <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-muted-foreground">$</span>
                <div className="block truncate">{content}</div>
            </div>
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
        </div>
    )
}