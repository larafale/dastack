'use client'
import { cn } from '@/lib/utils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function CodeBlock({ codeString, className, copy = true, ...props }: { codeString: string, className?: string, copy?: boolean, props?: any }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={cn("text-sm rounded-md overflow-x-auto relative border", className)} >
            {copy && (
                <button
                    onClick={handleCopy}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
            )}
            <SyntaxHighlighter
                customStyle={{ paddingInline: '20px', backgroundColor: 'transparent' }}
                {...props}
            // style={docco}
            >
                {codeString}
            </SyntaxHighlighter >
        </div>
    );
};