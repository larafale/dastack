import { Input } from '../ui/input';
import { Loader2, Hash, X } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Button } from '../ui/button';

interface Data {
  [key: string]: Record<string, any>[];
}

type CONFIG = {
  [key: string]: {
    fetcher: (search: string, namespace: string) => Promise<any>;
    mapper: (data: any) => any;
    icon?: React.ReactNode;
    itemRenderer?: (item: any) => React.ReactNode;
  };
};

interface BasePickerProps {
  defaultData?: Data;
  namespaces: string[];
  config: CONFIG;
  noResult?: string;
  debounceMs?: number;
  placeholder?: string;
  onSelect?: (item: any, namespace: string) => void;
  onChoose?: (item: any, namespace: string) => void;
  onClose?: () => void;
}

export default function BasePicker({
  config,
  defaultData,
  namespaces,
  onSelect = () => { },
  onChoose = () => { },
  onClose = () => { },
  noResult = 'No results found',
  debounceMs = 800,
  placeholder = 'Search',
}: BasePickerProps) {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasData = useMemo(() => {
    return namespaces.some((ns) => (data?.[ns]?.length ?? 0) > 0);
  }, [data, namespaces]);

  // Get all available items in a flat structure with their namespace
  const allItems = useMemo(() => {
    const items: Array<{ item: any; namespace: string }> = [];
    if (data) {
      namespaces.forEach((ns) => {
        if (data[ns]?.length) {
          data[ns].forEach((item) => {
            items.push({ item, namespace: ns });
          });
        }
      });
    }
    return items;
  }, [data, namespaces]);

  // Function to find the current selected item index
  const findSelectedIndex = () => {
    return allItems.findIndex(({ item }) => item.id === selected);
  };

  // Navigate to next item
  const next = () => {
    if (!hasData || allItems.length === 0) return;

    const currentIndex = findSelectedIndex();

    if (currentIndex === -1) {
      // No item selected, select first item
      const firstItem = allItems[0];
      setSelected(firstItem.item.id);
      onSelect(firstItem.item, firstItem.namespace);
    } else if (currentIndex < allItems.length - 1) {
      // Select next item
      const nextItem = allItems[currentIndex + 1];
      setSelected(nextItem.item.id);
      onSelect(nextItem.item, nextItem.namespace);
    } else {
      // Last item, cycle back to first item
      const firstItem = allItems[0];
      setSelected(firstItem.item.id);
      onSelect(firstItem.item, firstItem.namespace);
    }
  };

  // Navigate to previous item
  const prev = () => {
    if (!hasData || allItems.length === 0) return;

    const currentIndex = findSelectedIndex();

    if (currentIndex === -1) {
      // No item selected, select last item
      const lastItem = allItems[allItems.length - 1];
      setSelected(lastItem.item.id);
      onSelect(lastItem.item, lastItem.namespace);
    } else if (currentIndex > 0) {
      // Select previous item
      const prevItem = allItems[currentIndex - 1];
      setSelected(prevItem.item.id);
      onSelect(prevItem.item, prevItem.namespace);
    } else {
      // First item, cycle to last item
      const lastItem = allItems[allItems.length - 1];
      setSelected(lastItem.item.id);
      onSelect(lastItem.item, lastItem.namespace);
    }
  };

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setSelected(null);
    setIsLoading(true);
    setHasSearched(true);
    const results: Data = {};

    try {
      await Promise.all(
        namespaces.map(async (namespace) => {
          const ns = config[namespace];
          const result = await ns.fetcher(searchTerm, namespace);
          results[namespace] = ns.mapper(result);
        })
      );
      setData(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    // console.log('search', searchTerm, results);
  };

  // Create a debounced version of the search function
  const debouncedSearch = useDebouncedCallback(performSearch, debounceMs);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Skip if the target is a button
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const record = allItems[findSelectedIndex()];
      if (record) onChoose(record.item, record.namespace);
    }
  };

  return (
    <div className="flex flex-col" onKeyDown={handleKeyDown}>
      <div className="relative p-2">
        <Input
          ref={searchInputRef}
          autoComplete="off"
          autoFocus
          placeholder={placeholder}
          value={search}
          onChange={handleSearchChange}
          className="pr-10"
          uiSize={"lg"}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button variant="ghost" size="icon" onClick={onClose} tabIndex={0}>
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        )}

        {hasData &&
          namespaces.map((ns) =>
            (data?.[ns]?.length ?? 0) > 0 ? (
              <div key={ns} className="select-none">
                <div className="flex items-center gap-2 bg-muted p-2">
                  <div className="text-muted-foreground">
                    {config[ns].icon || <Hash />}
                  </div>
                  <span className="font-bold uppercase text-sm">{ns}</span>
                </div>
                {data?.[ns]?.map((item) => (
                  <div
                    key={item.id}
                    className={cn('flex hover:bg-muted cursor-pointer m-2', {
                      'bg-muted': selected === item.id,
                    })}
                    onClick={() => {
                      setSelected(item.id);
                      onSelect(item, ns);
                      onChoose(item, ns);
                    }}
                  >
                    {config[ns].itemRenderer ? (
                      config[ns].itemRenderer({ item })
                    ) : (
                      <div>{item.ref}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : null
          )}

        {hasSearched && !hasData && (
          <div className="text-center p-4 text-muted-foreground">
            {noResult}
          </div>
        )}
      </div>
    </div>
  );
}
