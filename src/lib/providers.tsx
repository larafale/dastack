'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Default query options for better performance
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            retry: 1,
        },
    },
});

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
} 