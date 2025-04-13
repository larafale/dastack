"use client";

import React, { useState } from "react";
import { Bug, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface JsonWidgetProps {
    obj: Record<string, unknown> | unknown;
    className?: string;
}

export function JsonWidget({ obj, className }: JsonWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`${className}`}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 border-t border-dashed flex items-center justify-between text-muted-foreground hover:text-foreground rounded-none"
            >
                <div className="flex items-center gap-2">
                    <Bug className="h-3 w-3" />
                    <span>Debug</span>
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                ) : (
                    <ChevronRight className="h-3 w-3" />
                )}
            </Button>
            {isExpanded && (
                <pre className="text-[10px] bg-muted p-2 overflow-auto">
                    {JSON.stringify(obj, null, 2)}
                </pre>
            )}
        </div>
    );
} 