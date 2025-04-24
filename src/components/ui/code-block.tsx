'use client'
import { cn } from '@/lib/utils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { CopyButton } from "@/components/ui/copy-button";

export default function CodeBlock({ codeString, className, copy = true, ...props }: { codeString: string, className?: string, copy?: boolean, props?: any }) {
    return (
        <div className={cn("text-sm rounded-md overflow-x-auto relative border", className)} >
            {copy && (
                <div className="absolute top-4 right-4">
                    <CopyButton text={codeString} />
                </div>
            )}
            <SyntaxHighlighter
                style={coderStyle}
                customStyle={{ padding: '10px', backgroundColor: 'transparent' }}
                {...props}
            >
                {codeString}
            </SyntaxHighlighter >
        </div>
    );
};


const coderStyle = {
    "hljs": {
        "display": "block",
        "overflowX": "auto",
        "padding": "0.5em",
        "color": "var(--foreground)",
        "background": "transparent"
    },
    "hljs-comment": {
        "color": "var(--muted-foreground)",
        "fontStyle": "italic"
    },
    "hljs-quote": {
        "color": "var(--muted-foreground)",
        "fontStyle": "italic"
    },
    "hljs-keyword": {
        "color": "var(--primary)",
        "fontWeight": "bold"
    },
    "hljs-selector-tag": {
        "color": "var(--primary)",
        "fontWeight": "bold"
    },
    "hljs-subst": {
        "color": "var(--foreground)",
        "fontWeight": "normal"
    },
    "hljs-number": {
        "color": "var(--amber-500, #f59e0b)"
    },
    "hljs-literal": {
        "color": "var(--amber-500, #f59e0b)"
    },
    "hljs-variable": {
        "color": "var(--blue-500, #3b82f6)"
    },
    "hljs-template-variable": {
        "color": "var(--blue-500, #3b82f6)"
    },
    "hljs-tag .hljs-attr": {
        "color": "var(--blue-500, #3b82f6)"
    },
    "hljs-string": {
        "color": "var(--green-500, #22c55e)"
    },
    "hljs-doctag": {
        "color": "var(--green-500, #22c55e)"
    },
    "hljs-title": {
        "color": "var(--orange-500, #f97316)",
        "fontWeight": "bold"
    },
    "hljs-section": {
        "color": "var(--orange-500, #f97316)",
        "fontWeight": "bold"
    },
    "hljs-selector-id": {
        "color": "var(--orange-500, #f97316)",
        "fontWeight": "bold"
    },
    "hljs-type": {
        "color": "var(--purple-500, #a855f7)",
        "fontWeight": "bold"
    },
    "hljs-class .hljs-title": {
        "color": "var(--purple-500, #a855f7)",
        "fontWeight": "bold"
    },
    "hljs-tag": {
        "color": "var(--red-500, #ef4444)",
        "fontWeight": "normal"
    },
    "hljs-name": {
        "color": "var(--red-500, #ef4444)",
        "fontWeight": "normal"
    },
    "hljs-attribute": {
        "color": "var(--blue-500, #3b82f6)",
        "fontWeight": "normal"
    },
    "hljs-regexp": {
        "color": "var(--green-600, #16a34a)"
    },
    "hljs-link": {
        "color": "var(--green-600, #16a34a)"
    },
    "hljs-symbol": {
        "color": "var(--purple-600, #9333ea)"
    },
    "hljs-bullet": {
        "color": "var(--purple-600, #9333ea)"
    },
    "hljs-built_in": {
        "color": "var(--cyan-500, #06b6d4)"
    },
    "hljs-builtin-name": {
        "color": "var(--cyan-500, #06b6d4)"
    },
    "hljs-meta": {
        "color": "var(--muted-foreground)",
        "fontWeight": "bold"
    },
    "hljs-deletion": {
        "background": "var(--red-100, rgba(239, 68, 68, 0.1))"
    },
    "hljs-addition": {
        "background": "var(--green-100, rgba(34, 197, 94, 0.1))"
    },
    "hljs-emphasis": {
        "fontStyle": "italic"
    },
    "hljs-strong": {
        "fontWeight": "bold"
    }
};