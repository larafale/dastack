import { useQueryState } from 'nuqs';
import { useState, useCallback, useEffect, useRef, startTransition, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { PagerShape } from '@/components/pager';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Dataset<T = any> {
    items: T[];
    isLoading: boolean;
    error?: string | null;
    refresh: (options?: any) => Promise<void>;
    setItems: (items: T[]) => void;
    selectedItem: T | null;
    selectItem: (item: T | null) => void;
    clearItem: () => void;
    findItemById: (id: string | null) => T | null;
    pager: PagerShape;
    setPage: (page: number) => void;
    search: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    handleSearch: (query: string) => void;
    handleSort: (field: keyof T) => void;
    handleDateRange: (range: DateRange | undefined) => void;
    fetchFn: (options?: any) => Promise<any>;
    createFn?: (data: Partial<T>) => any;
    updateFn?: (id: string, data: Partial<T>) => any;
    removeFn?: (id: string) => any;
}

// Make the type more flexible to accommodate different API responses
export interface UseDatasetOptions<T = any> {
    key?: string;
    skipInitialFetch?: boolean;
    fetchFn: (options?: any) => Promise<any>;
    createFn?: (data: Partial<T>) => any;
    updateFn?: (id: string, data: Partial<T>) => any;
    removeFn?: (id: string) => any;
    defaultItems?: T[];
    defaultItem?: T | null;
    defaultFilters?: Partial<Filters>;
}

// Properly define the filter state and actions
interface Filters {
    search: string;
    page: number;
    sort: string;
    order: string;
    dateFrom: string | null;
    dateTo: string | null;
}

// Define actions separately to fix TypeScript errors
interface FilterActions {
    setFilters: (state: Partial<Filters>) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setSort: (sort: string) => void;
    setOrder: (order: string) => void;
    setDateFrom: (dateFrom: string | null) => void;
    setDateTo: (dateTo: string | null) => void;
}

// Combine state and actions for the store type
type FilterStore = Filters & FilterActions;



function useDataset<T = any>(options: UseDatasetOptions<T>): Dataset<T> {
    const {
        key = '',
        fetchFn,
        createFn,
        updateFn,
        removeFn,
        defaultItems = [],
        defaultItem = null,
        defaultFilters = {},
        skipInitialFetch = false
    } = options;

    const [items, setItems] = useState<T[]>(defaultItems);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(defaultItem);
    const firstRefreshRef = useRef<boolean>(false);
    const refreshFnRef = useRef(fetchFn);

    // Keep the ref updated with the latest fetchFn
    useEffect(() => {
        refreshFnRef.current = fetchFn;
    }, [fetchFn]);

    const [pager, setPager] = useState<PagerShape>({
        page: 1,
        pages: 1,
        total: 0,
        sortField: 'id',
        sortOrder: 'desc'
    });

    const [search, setSearch] = useState(defaultFilters.search || '');
    const [page, setPage] = useState(defaultFilters.page || 1);
    const [sort, setSort] = useState(defaultFilters.sort || 'id');
    const [order, setOrder] = useState(defaultFilters.order || 'desc');
    const [dateFrom, setDateFrom] = useState<string | null>(defaultFilters.dateFrom || null);
    const [dateTo, setDateTo] = useState<string | null>(defaultFilters.dateTo || null);

    const refresh = useCallback(async (fetchOptions?: any) => {
        console.log('refresh', key, { page, search });
        setIsLoading(true);
        setError(null);
        firstRefreshRef.current = true;

        try {
            const startTime = Date.now();
            const response = await refreshFnRef.current({
                page,
                search,
                sortField: sort,
                sortOrder: order,
                dateFrom: dateFrom ? new Date(dateFrom) : undefined,
                dateTo: dateTo ? new Date(dateTo) : undefined,
                ...fetchOptions
            });

            // Ensure loading state lasts at least 1000ms to prevent flickering
            // const elapsedTime = Date.now() - startTime;
            // const remainingTime = Math.max(0, 1000 - elapsedTime)
            // if (remainingTime > 0) await new Promise(resolve => setTimeout(resolve, remainingTime));


            // Handle different response formats
            if (response) {
                if (Array.isArray(response.data)) {
                    // Format: { data: T[] }
                    setItems(response.data);
                    setPager(response.pager);
                } else if (Array.isArray(response)) {
                    // Format: T[]
                    setItems(response);
                } else {
                    console.warn('useDataset: response format not recognized', response);
                    setItems([]);
                }
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
            setError(errorMessage);
            console.error('useDataset error:', err);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, sort, order, dateFrom, dateTo]);



    const selectItem = useCallback((item: T | null) => {
        setSelectedItem(item);
    }, []);

    const clearItem = useCallback(() => {
        setSelectedItem(null);
    }, []);

    const findItemById = useCallback((id: string | null) => {
        if (!id) return null;
        return items.find((item: any) => item?.id === id) || null;
    }, [items]);


    const handleSearch = useCallback((value: string) => {
        // If the search value hasn't changed, don't trigger a search
        if (value === search) return;

        setPage(1);
        setSearch(value);
    }, [search]);

    const handleSort = useCallback((field: keyof T) => {
        const newOrder = field === sort && order === 'asc' ? 'desc' : 'asc';
        setOrder(newOrder);
        setSort(field as string);
    }, [sort, order]);

    const handleDateRange = useCallback((range: DateRange | undefined) => {
        if (!range) {
            setDateFrom(null);
            setDateTo(null);
            return;
        }
        setDateFrom(range.from?.toISOString() || null);
        setDateTo(range.to?.toISOString() || null);
    }, []);


    // Refresh when search parameters change, but not before the first refresh
    useEffect(() => {
        if (!firstRefreshRef.current) return;
        refresh();
    }, [page, search, dateFrom, dateTo, sort, order]);


    return {
        items,
        isLoading,
        error,
        refresh,
        setItems,
        selectedItem,
        selectItem,
        clearItem,
        findItemById,
        search,
        pager,
        setPage,
        dateFrom: dateFrom ? new Date(dateFrom) : null,
        dateTo: dateTo ? new Date(dateTo) : null,
        handleSearch,
        handleSort,
        handleDateRange,
        fetchFn,
        updateFn,
        createFn,
        removeFn,
    };
}

export default useDataset; 