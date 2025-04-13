"use client";

import React from "react";
import { Cpu } from 'lucide-react';
import type { AiStats } from "@/types/ai";

interface AIWidgetProps {
    ai?: AiStats;
    className?: string;
}

export function AIWidget({ ai, className }: AIWidgetProps) {
    if (!ai) return null;

    return (
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
            <Cpu className="h-3 w-3" />
            <span>{ai.llm.split(':')[1]}</span>
            <span>({(ai.duration / 1000).toFixed(2)}s)</span>
        </div>
    );
} 