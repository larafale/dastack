'use client';

import { useHotkeys } from 'react-hotkeys-hook';
import { RefObject, useEffect, useRef } from 'react';
import { Dataset } from '@/hooks/use-dataset';

interface CrudHotkeysProps<T extends Record<string, any>> {
    crudRef: RefObject<HTMLDivElement | null>;
    dataset: Dataset<T>;
    isCreating: boolean;
    setActiveRowIndex: (index: number | null) => void;
}

export const CrudHotkeys = <T extends Record<string, any>>({
    crudRef,
    dataset,
    isCreating,
    setActiveRowIndex
}: CrudHotkeysProps<T>) => {
    // Store the last focused element before modal opens
    const lastFocusedElement = useRef<HTMLElement | null>(null);

    // Make rows focusable
    useEffect(() => {
        if (!crudRef.current) return;

        const rows = crudRef.current.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            (row as HTMLElement).tabIndex = 0;

            // Add focus event to track active row
            row.addEventListener('focus', () => {
                setActiveRowIndex(index);
            });

            // Add click handler to select the item
            row.addEventListener('click', () => {
                dataset.selectItem(dataset.items[index]);
            });
        });
    }, [dataset.items, crudRef, setActiveRowIndex, dataset]);

    // Save currently focused element when modal opens and restore when it closes
    useEffect(() => {
        if (dataset.selectedItem || isCreating) {
            // Modal is opening, store the current active element
            lastFocusedElement.current = document.activeElement as HTMLElement;
        } else if (lastFocusedElement.current) {
            // Modal is closing, restore focus after a small delay to allow modal transition
            setTimeout(() => {
                lastFocusedElement.current?.focus();
            }, 100);
        }
    }, [dataset.selectedItem, isCreating]);

    // Get all elements for cycling (search input first, then table rows)
    const getCycleElements = () => {
        const elements: HTMLElement[] = [];

        if (!crudRef.current) return elements;

        // Try multiple selectors to find the search input
        const searchInput = crudRef.current.querySelector('#table-search') as HTMLInputElement ||
            crudRef.current.querySelector('input[type="text"]') as HTMLInputElement ||
            crudRef.current.querySelector('input[placeholder*="search" i]') as HTMLInputElement;

        if (searchInput) {
            elements.push(searchInput);
        }

        // Add all table rows
        const rows = crudRef.current.querySelectorAll('tbody tr');
        rows.forEach(row => {
            elements.push(row as HTMLElement);
        });

        return elements;
    };

    // Simple cycle function that handles up/down navigation
    const cycle = (direction: 'up' | 'down') => {
        const elements = getCycleElements();
        if (elements.length === 0) return;

        // Find current active element
        const activeElement = document.activeElement as HTMLElement;
        const currentIndex = elements.indexOf(activeElement);

        let nextIndex: number;

        if (currentIndex === -1) {
            // Nothing focused, focus the first element (search input)
            nextIndex = 0;
        } else if (direction === 'down') {
            // Next element, or cycle back to first (search input)
            nextIndex = (currentIndex + 1) % elements.length;
        } else { // up
            // Previous element, or cycle to last row
            nextIndex = (currentIndex - 1 + elements.length) % elements.length;
        }

        // Focus the element
        elements[nextIndex].focus();

        // Set active row index based on what was focused
        if (nextIndex === 0 && elements[0]?.tagName.toLowerCase() === 'input') {
            // If focusing search input, clear active row
            setActiveRowIndex(null);
        } else {
            // If focusing a table row, set its index (adjusting for search input)
            const rowIndex = nextIndex - (elements[0]?.tagName.toLowerCase() === 'input' ? 1 : 0);
            setActiveRowIndex(rowIndex);

            // When cycling to a row, also select that row for visual indication
            if (rowIndex >= 0 && rowIndex < dataset.items.length) {
                // Don't select the item in dataset, just update the visual active state
                const row = elements[nextIndex] as HTMLElement;
                if (row && row.tagName.toLowerCase() === 'tr') {
                    row.focus();
                }
            }
        }
    };

    const selectCurrentRow = () => {
        // Find the active element
        const activeElement = document.activeElement as HTMLElement;

        // Skip if in search input
        if (activeElement && activeElement.tagName.toLowerCase() === 'input') return;

        // Get the current row index
        const rows = crudRef.current?.querySelectorAll('tbody tr') || [];
        const currentIndex = Array.from(rows).indexOf(activeElement as Element);

        if (currentIndex !== -1 && currentIndex < dataset.items.length) {
            dataset.selectItem(dataset.items[currentIndex]);
        }
    };

    // Register hotkeys
    useHotkeys('up', (e) => {
        e.preventDefault();
        cycle('up');
    }, {
        enableOnFormTags: true,
        enabled: !isCreating && !dataset.selectedItem
    });

    useHotkeys('down', (e) => {
        e.preventDefault();
        cycle('down');
    }, {
        enableOnFormTags: true,
        enabled: !isCreating && !dataset.selectedItem
    });

    useHotkeys('tab', (e) => {
        if (isCreating || dataset.selectedItem) return;

        e.preventDefault();
        cycle('down');
    }, {
        enableOnFormTags: true,
        enabled: !isCreating && !dataset.selectedItem
    });

    useHotkeys('shift+tab', (e) => {
        if (isCreating || dataset.selectedItem) return;

        e.preventDefault();
        cycle('up');
    }, {
        enableOnFormTags: true,
        enabled: !isCreating && !dataset.selectedItem
    });

    useHotkeys('enter', (e) => {
        if (isCreating || dataset.selectedItem) return;

        // Only prevent default if in a table row
        if (document.activeElement?.closest('tbody tr')) {
            e.preventDefault();
            selectCurrentRow();
        }
    }, {
        enableOnFormTags: false,
        enabled: !isCreating && !dataset.selectedItem
    });

    // Component doesn't render anything
    return null;
};

export default CrudHotkeys; 