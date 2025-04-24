'use client';

import { RefObject, useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';


interface SearchInputProps {
    defaultValue?: string;
    isPending: boolean;
    onSearch: (value: string) => void;
    className?: string;
    ref?: RefObject<HTMLInputElement>;
    debounce?: number;
}

export function SearchInput({
    ref,
    defaultValue = '',
    isPending,
    onSearch,
    className,
    debounce = 800,
}: SearchInputProps) {
    const [value, setValue] = useState(defaultValue);
    const debouncedValue = useDebounce(value, debounce);
    const t = useTranslations('Crud.main');
    const lastSearchedValue = useRef<string | undefined>(defaultValue);
    const isInitialMount = useRef(true);

    // Skip the initial search on mount
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Use the debounced value for search when debounce is enabled
        if (debounce && debouncedValue !== undefined && debouncedValue !== lastSearchedValue.current) {
            lastSearchedValue.current = debouncedValue;
            onSearch(debouncedValue || '');
        }
    }, [debouncedValue, debounce, onSearch]);

    const handleSearch = () => {
        const searchValue = value || '';
        if (searchValue !== lastSearchedValue.current) {
            lastSearchedValue.current = searchValue;
            onSearch(searchValue);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    const handleClear = () => {
        setValue('');
        // trigger onSearch only if no debounce mode and if the last search wasn't already empty
        if (!debounce && lastSearchedValue.current !== '') {
            lastSearchedValue.current = '';
            onSearch('');
        }
    };

    return (
        <div className={cn("group relative ", className)}>
            <Input
                ref={ref}
                id="table-search"
                name="search"
                type="text"
                placeholder={t('search')}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-15"
                autoFocus
                autoComplete="off"
            />
            <div className="absolute top-0 right-0">
                {value && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="opacity-0 group-hover:opacity-100"
                    >
                        <X />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSearch}
                    disabled={!!debounce || isPending}
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <Search />}
                </Button>
            </div>
        </div>
    );
}
