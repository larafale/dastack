import { usePersist } from '@/hooks/use-persist';
import { useCallback, useEffect, useMemo, useRef } from 'react';

// Default shortcuts
const DEFAULT_SHORTCUTS: Record<string, string[]> = {
  search: ['s'],
  hotkeys: ['k'],
  voice: ['space'],
};

/**
 * Hook for managing keyboard shortcuts
 */
export function useShortcuts() {
  const { records, saveRecord, deleteRecord, getAllRecords, loading } =
    usePersist<string[]>('shortcuts', DEFAULT_SHORTCUTS);
  const defaultKeysRef = useRef(Object.keys(DEFAULT_SHORTCUTS));

  // Synchronize stored shortcuts with default shortcuts
  useEffect(() => {
    if (loading) return; // Skip during initial loading

    let needsUpdate = false;
    const defaultKeys = Object.keys(DEFAULT_SHORTCUTS);

    // Check for new default shortcuts that aren't in stored shortcuts
    for (const key of defaultKeys) {
      if (!records[key]) {
        console.log(`Adding new default shortcut: ${key}`);
        saveRecord(key, DEFAULT_SHORTCUTS[key]);
        needsUpdate = true;
      }
    }

    // Check for stored shortcuts that are no longer in defaults (to remove)
    for (const key of Object.keys(records)) {
      if (!defaultKeys.includes(key)) {
        console.log(`Removing obsolete shortcut: ${key}`);
        deleteRecord(key); // Actually delete the record from IndexedDB
        needsUpdate = true;
      }
    }
  }, [loading, records, saveRecord, deleteRecord]);

  // Explicitly check if default shortcuts changed
  useEffect(() => {
    const currentDefaultKeys = Object.keys(DEFAULT_SHORTCUTS);
    const previousDefaultKeys = defaultKeysRef.current;

    // If the default shortcuts have changed, force a sync
    if (
      JSON.stringify(currentDefaultKeys.sort()) !==
      JSON.stringify(previousDefaultKeys.sort())
    ) {
      console.log('Default shortcuts changed, synchronizing...');

      // Remove keys that are no longer in defaults
      previousDefaultKeys.forEach((key) => {
        if (!currentDefaultKeys.includes(key) && records[key]) {
          console.log(`Explicitly removing obsolete shortcut: ${key}`);
          deleteRecord(key); // Actually delete it from the store
        }
      });

      // Update reference for next check
      defaultKeysRef.current = currentDefaultKeys;
    }
  }, [records, saveRecord, deleteRecord]);

  // Get a specific shortcut
  const getShortcut = useCallback(
    (key: string, toString = false) => {
      const strokes = records[key] || DEFAULT_SHORTCUTS[key] || [];
      return toString ? strokes.join('+') : strokes;
    },
    [records]
  );

  // Update a shortcut
  const setShortcut = useCallback(
    async (key: string, strokes: string[]) => {
      // Only allow updating shortcuts that exist in DEFAULT_SHORTCUTS
      if (key in DEFAULT_SHORTCUTS) {
        return await saveRecord(key, strokes);
      }
      return false;
    },
    [saveRecord]
  );

  // Reset to defaults
  const resetShortcuts = useCallback(async () => {
    let success = true;

    // First remove any obsolete shortcuts
    for (const key of Object.keys(records)) {
      if (!(key in DEFAULT_SHORTCUTS)) {
        const result = await deleteRecord(key); // Actually delete it
        if (!result) success = false;
      }
    }

    // Then set all defaults
    for (const [key, strokes] of Object.entries(DEFAULT_SHORTCUTS)) {
      const result = await saveRecord(key, strokes);
      if (!result) success = false;
    }

    return success;
  }, [records, saveRecord, deleteRecord]);

  // Convert records to shortcut objects for display - only include valid shortcuts
  const shortcuts = useMemo(() => {
    // Get the list of valid shortcut keys from DEFAULT_SHORTCUTS
    const validKeys = Object.keys(DEFAULT_SHORTCUTS);

    return (
      Object.entries(records)
        // Only include shortcuts that exist in DEFAULT_SHORTCUTS
        .filter(([key]) => validKeys.includes(key))
        .map(([key, strokes]) => ({
          key,
          strokes: strokes || [],
        }))
    );
  }, [records]);

  return {
    shortcuts,
    getShortcut,
    setShortcut,
    resetShortcuts,
  };
}
