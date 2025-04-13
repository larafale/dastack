"use client";

import React from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Clock } from 'lucide-react';

interface CreatedAtWidgetProps {
    date: Date;
    className?: string;
    fromNow?: boolean;
    label?: string;
}

export function DateWidget({ date, className, fromNow = false, label }: CreatedAtWidgetProps) {
    if (!date) return null;
    const formattedDate = fromNow
        ? formatDistanceToNow(new Date(date), { addSuffix: true })
        : format(new Date(date), 'dd/MM/yyyy - HH:mm');

    return (
        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
            <Clock className="h-3 w-3" />
            {label && <span>{label}:</span>}
            <span>{formattedDate}</span>
        </div>
    );
} 