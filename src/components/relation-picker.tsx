import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { SearchInput } from "@/components/search-input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Pager } from "@/components/pager"
import type { Dataset } from "@/hooks/use-dataset"
import { cn } from "@/lib/utils"

interface RelationPickerProps {
    value?: string | null
    defaultItem?: Record<string, any> | null
    dataset: Dataset<any>
    maxHeight?: string
    disabled?: boolean
    onChange?: (value: string) => void
    itemRender?: (item: Record<string, any>) => React.ReactNode,
    triggerRender?: (item: Record<string, any> | null) => React.ReactNode,
}

const defaultRender = (item: any) => (
    item?.name || item?.title || item?.label || item?.text ||
    item?.value || item?.ref || item?.id || 'Select...'
)

const RelationPicker = ({
    value,
    dataset,
    defaultItem = null,
    maxHeight = '281px',
    disabled = false,
    onChange,
    itemRender = defaultRender,
    triggerRender = defaultRender
}: RelationPickerProps) => {
    const [open, setOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [hasInitialized, setHasInitialized] = useState(false)

    // Track if we've done an initial search to prevent duplicates
    const didInitialSearchRef = useRef(false)

    // Single ref for the root container
    const rootRef = useRef<HTMLDivElement>(null)

    // Find and set the selected item when the component loads or value changes
    useEffect(() => {
        if (disabled || hasInitialized) return;

        if (value) {
            const matchingItem = dataset.findItemById(value)
            if (matchingItem) {
                dataset.selectItem(matchingItem)
            }
        } else if (defaultItem) {
            dataset.selectItem(defaultItem)
        }

        setHasInitialized(true);
    }, [value, defaultItem, dataset, disabled, hasInitialized])


    // Reset selectedIndex when items change (after search)
    useEffect(() => {
        if (!open) return;

        // Reset the selected index whenever items change (like after a search)
        setSelectedIndex(-1)
        rootRef.current?.querySelector('input')?.focus()
    }, [dataset.items, open])

    // Monitor document events for focus detection
    useEffect(() => {
        if (!open) return;

        const handleFocusChange = (e: FocusEvent) => {
            // Check if the focused element is our search input
            const isInputFocused = rootRef.current?.contains(e.target as Node) &&
                (e.target as HTMLElement).tagName === 'INPUT';

            // Make sure we set a boolean value
            setIsSearchFocused(!!isInputFocused);
        };

        document.addEventListener('focusin', handleFocusChange);
        document.addEventListener('focusout', handleFocusChange);

        return () => {
            document.removeEventListener('focusin', handleFocusChange);
            document.removeEventListener('focusout', handleFocusChange);
        };
    }, [open]);

    const handleSelect = (item: Record<string, any>) => {
        if (disabled) return; // Skip if component is disabled

        dataset.selectItem(item)
        // Ensure onChange is called with the item ID
        if (onChange && item?.id) {
            onChange(item.id)
        }
        setOpen(false)
    }

    // Function to select the currently highlighted item or the first item if none is selected
    const selectCurrentOrFirstItem = () => {
        if (dataset.items.length === 0) return false

        if (selectedIndex >= 0 && selectedIndex < dataset.items.length) {
            // If an item is selected, select it
            handleSelect(dataset.items[selectedIndex])
            return true
        } else if (dataset.items.length > 0) {
            // If no item is selected, select the first item
            handleSelect(dataset.items[0])
            return true
        }

        return false
    }

    // Only load data when opening the popover
    const handleOpenChange = (newOpenState: boolean) => {
        setOpen(newOpenState);

        // When opening and we haven't done the initial search yet
        if (newOpenState && !didInitialSearchRef.current) {
            didInitialSearchRef.current = true;
            dataset.refresh();
        }
    };

    // Helper to cycle through items
    const cycleSelection = (direction: 'next' | 'prev') => {
        if (!open || dataset.items.length === 0) return

        setSelectedIndex(prevIndex => {
            let newIndex = prevIndex;

            if (direction === 'next') {
                newIndex = prevIndex >= dataset.items.length - 1 ? 0 : prevIndex + 1
            } else {
                newIndex = prevIndex <= 0 ? dataset.items.length - 1 : prevIndex - 1
            }

            // Find and scroll the item into view
            const itemElements = rootRef.current?.querySelectorAll('.item-option');
            if (itemElements && itemElements[newIndex]) {
                itemElements[newIndex].scrollIntoView({ block: 'nearest' });
            }

            return newIndex
        })
    }

    // Arrow key navigation
    useHotkeys('down', (e) => {
        e.preventDefault()
        cycleSelection('next')
    }, {
        enabled: open,
        enableOnFormTags: true,
        enableOnContentEditable: true
    })

    useHotkeys('up', (e) => {
        e.preventDefault()
        cycleSelection('prev')
    }, {
        enabled: open,
        enableOnFormTags: true,
        enableOnContentEditable: true
    })

    // Tab key navigation
    useHotkeys('tab', (e) => {
        if (!open || dataset.items.length === 0) return

        // Prevent default tab behavior
        e.preventDefault()

        // If shift is pressed, go backwards
        if (e.shiftKey) {
            cycleSelection('prev')
        } else {
            cycleSelection('next')
        }
    }, {
        enabled: open,
        enableOnFormTags: true,
        enableOnContentEditable: true
    })

    // Handle enter key for item selection - works regardless of where focus is
    useHotkeys('enter', (e) => {
        if (!open) return

        // Try to select the current item if there's a selected index
        if (selectedIndex >= 0 || dataset.items.length > 0) {
            e.preventDefault()
            e.stopPropagation()
            selectCurrentOrFirstItem()
        }

        // When no selection and search is focused, let the search form handle it
    }, {
        enabled: open,
        enableOnFormTags: true,
        enableOnContentEditable: true
    })

    const trigger = (<Button
        variant='outline'
        className={cn(
            "w-full justify-start text-left font-normal field-shadow",
            disabled && "cursor-not-allowed text-muted-foreground opacity-70"
        )}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
    >
        {dataset.selectedItem
            ? triggerRender(dataset.selectedItem)
            : 'Select...'}
    </Button>)



    if (disabled) return trigger

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <div
                    ref={rootRef}
                    onKeyDown={(e) => {
                        // When Enter is pressed and we have an active selection
                        if (e.key === 'Enter' && selectedIndex >= 0) {
                            e.preventDefault()
                            e.stopPropagation()
                            selectCurrentOrFirstItem()
                            return
                        }

                        // Let search function handle Enter when nothing is selected
                        if (isSearchFocused && e.key === 'Enter' && selectedIndex < 0) {
                            // Just let it submit naturally and don't close the popup
                            e.stopPropagation();
                            return;
                        }

                        // For Tab key navigation
                        if (e.key === 'Tab') {
                            e.preventDefault()
                            e.stopPropagation()

                            // Handle tab navigation
                            if (dataset.items.length > 0) {
                                if (e.shiftKey) {
                                    cycleSelection('prev')
                                } else {
                                    cycleSelection('next')
                                }
                            }
                        }
                    }}
                >
                    <div className="p-2">
                        <SearchInput
                            isPending={dataset.isLoading}
                            onSearch={dataset.handleSearch}
                            className="w-full"
                        />
                    </div>
                    <div className={cn("flex flex-col min-h-[100px] border-t", `max-h-[${maxHeight}]`)}>
                        {dataset.isLoading ? (
                            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading...</div>
                        ) : dataset.items.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">No items found</div>
                        ) : <div
                            className="overflow-auto no-scrollbar"
                            onWheel={(e) => {
                                // Prevent the default wheel behavior
                                e.preventDefault();
                                // Get the current scroll container
                                const container = e.currentTarget;
                                // Scroll by the wheel delta
                                container.scrollTop += e.deltaY;
                            }}
                        >
                            {dataset.items.map((item: any, index) => (
                                <div
                                    key={item.id}
                                    className={`p-2 cursor-pointer hover:bg-muted item-option ${selectedIndex === index ? 'bg-muted' : ''}`}
                                    onClick={() => handleSelect(item)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    {itemRender(item)}
                                </div>
                            ))}
                        </div>}
                    </div>
                    {dataset.pager.pages > 1 && !dataset.isLoading && (<div className=" p-2 flex justify-center items-center border-t">
                        <Pager
                            className="scale-80"
                            currentPage={dataset.pager.page}
                            totalPages={dataset.pager.pages}
                            onPageChange={dataset.setPage}
                        />
                    </div>)}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default RelationPicker