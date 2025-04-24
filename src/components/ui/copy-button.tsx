'use client';

import { Copy, Check } from "lucide-react";
import { useCopy } from "@/hooks/use-copy-clipboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
    text: string;
    className?: string;
}

export function CopyButton({ text, className, ...props }: CopyButtonProps) {
    const { isCopied, copy } = useCopy();

    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => copy(text)}
            className={cn("text-muted-foreground hover:text-foreground transition-colors cursor-pointer", className)}
            {...props}
        >
            {isCopied ? <Check /> : <Copy />}
        </Button>
    );
} 