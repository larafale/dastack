'use client';
import { CopyButton } from "@/components/ui/copy-button";

export default function CodeLine({ content }: { content: string }) {
    return (
        <div className="border rounded-md p-3 px-4 font-mono text-sm flex items-center justify-between gap-2 ">
            <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-muted-foreground">$</span>
                <div className="block truncate">{content}</div>
            </div>
            <CopyButton text={content} />
        </div>
    )
}