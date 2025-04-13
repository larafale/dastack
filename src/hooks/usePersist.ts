import { useState, useEffect } from 'react';

/**
 * Simple hook for persistent storage in IndexedDB
 * This hook is designed for storing multiple key-value records in a single store
 */
export function usePersist<T>(
  storeName: string,
  defaultRecords: Record<string, T>
) {
  const [records, setRecords] = useState<Record<string, T>>(defaultRecords);
  const [loading, setLoading] = useState(true);

  // Load data on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Open database
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open('app', 1);

          request.onupgradeneeded = () => {
            const db = request.result;
            // Create store if it doesn't exist
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          };

          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Load all records from the store
        const loadedRecords = await new Promise<Record<string, T>>(
          (resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            const keys = store.getAllKeys();

            const result: Record<string, T> = {};

            request.onsuccess = () => {
              // If we have data, zip the keys and values together
              if (request.result.length > 0) {
                keys.onsuccess = () => {
                  for (let i = 0; i < keys.result.length; i++) {
                    result[keys.result[i] as string] = request.result[i];
                  }
                  resolve(result);
                };
                keys.onerror = () => reject(keys.error);
              } else {
                // No data found, initialize with defaults
                initializeDefaults();
                resolve(defaultRecords);
              }
            };
            request.onerror = () => reject(request.error);
          }
        );

        // If we found data, use it
        if (Object.keys(loadedRecords).length > 0) {
          setRecords(loadedRecords);
        }
      } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
        // Use default records on error
        await initializeDefaults();
      } finally {
        setLoading(false);
      }
    };

    // Helper to initialize defaults
    const initializeDefaults = async () => {
      try {
        // Save each default record
        for (const [key, value] of Object.entries(defaultRecords)) {
          await saveRecord(key, value);
        }
      } catch (error) {
        console.error('Error initializing defaults:', error);
      }
    };

    loadData();
  }, [storeName]); // Only run on mount or if store name changes

  // Function to save a single record
  const saveRecord = async (key: string, value: T) => {
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('app', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Update state
      setRecords((prev) => ({
        ...prev,
        [key]: value,
      }));

      return true;
    } catch (error) {
      console.error(`Error saving record ${key} to IndexedDB:`, error);
      return false;
    }
  };

  // Function to delete a single record
  const deleteRecord = async (key: string) => {
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('app', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Update state by removing the key
      setRecords((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      return true;
    } catch (error) {
      console.error(`Error deleting record ${key} from IndexedDB:`, error);
      return false;
    }
  };

  // Function to get all records
  const getAllRecords = () => {
    return records;
  };

  // Function to get a single record
  const getRecord = (key: string) => {
    return records[key] || null;
  };

  return {
    records,
    saveRecord,
    deleteRecord,
    getRecord,
    getAllRecords,
    loading,
  };
}
