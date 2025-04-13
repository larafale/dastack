'use client';

import { Doc } from '@prisma/client';
import * as React from 'react';
import { useQueryState } from 'nuqs';
import { getDoc } from '@/actions/docs';
import { toast } from 'sonner';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';

// Default doc with all required fields
export const NEW_DOC: Partial<Doc> = {
  created_at: new Date(),
};

export interface UseAppOptions {
  minDelay?: number;
  defaultDocID?: string;
  defaultDoc?: Partial<Doc>;
  onClose?: () => void;
  onDelete?: (data: Partial<Doc>) => void;
}

interface DocsContextType {
  doc: Partial<Doc> | null;
  setDoc: (doc: Partial<Doc> | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  close: () => void;
  remove: () => void;
  refreshDocsCount: number;
  triggerDocsRefresh: () => void;
}

const DocsContext = createContext<DocsContextType>({
  doc: null,
  setDoc: () => { },
  isLoading: false,
  setIsLoading: () => { },
  close: () => { },
  remove: () => { },
  refreshDocsCount: 0,
  triggerDocsRefresh: () => { },
});

export function useApp({
  minDelay = 1000,
  defaultDocID = '',
  defaultDoc,
  skipLoading = false,
  onClose,
  onDelete,
}: UseAppOptions & { skipLoading?: boolean } = {}) {
  // Use nuqs to get the docID search parameter
  const [urlDocID, setUrlDocID] = useQueryState('docID', {
    defaultValue: '',
    throttleMs: 100,
  });

  // State for the doc and loading status
  const [doc, setDocState] = React.useState<Partial<Doc> | null>(
    defaultDoc || null
  );

  // Never show loading if skipLoading is true or defaultDoc is provided
  const [isLoading, setIsLoading] = React.useState<boolean>(
    !skipLoading && !defaultDoc && Boolean(urlDocID || defaultDocID)
  );

  // Track direct updates
  const isDirectUpdate = React.useRef(false);

  // Set initial load completed if skipLoading or defaultDoc
  const initialLoadCompleted = React.useRef(skipLoading || Boolean(defaultDoc));

  // Handle timeouts for minimum loading time
  const loadingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // For tracking document list refreshes
  const refreshDocsCount = React.useRef(0);
  const [refreshCounter, setRefreshCounter] = React.useState(0);

  // Clear any existing timeout
  const clearLoadingTimeout = React.useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  // Simplified setDoc function
  const setDoc = React.useCallback(
    (newDoc: Partial<Doc> | null = NEW_DOC) => {
      // Always skip loading for direct updates
      isDirectUpdate.current = true;
      setIsLoading(false);
      initialLoadCompleted.current = true;

      // Cancel any pending loading operations
      clearLoadingTimeout();

      // Update state and URL
      setDocState(newDoc);

      // Silently update URL without triggering effects
      const newID = newDoc?.id || null;
      if (newID !== urlDocID) {
        setUrlDocID(newID);
      }

      // Reset direct update flag after all effects
      setTimeout(() => {
        isDirectUpdate.current = false;
      }, 100); // Longer timeout to ensure all effects complete
    },
    [urlDocID, setUrlDocID, clearLoadingTimeout]
  );

  const triggerDocsRefresh = React.useCallback(() => {
    refreshDocsCount.current += 1;
    // Trigger a re-render by updating the state
    setRefreshCounter(prev => prev + 1);
    console.log('useApp triggered docs refresh:', refreshDocsCount.current);
  }, []);

  const remove = React.useCallback(() => {
    const newDoc = { ...doc, deleted_at: new Date() };
    onDelete?.(newDoc);
    // Refresh the document list when a document is removed
    triggerDocsRefresh();
  }, [onDelete, doc, triggerDocsRefresh]);

  // Handle closing of the doc
  const close = React.useCallback(() => {
    setDoc();
    onClose?.();
  }, [onClose, setDoc]);

  // Handle defaultDocID vs urlDocID precedence
  React.useEffect(() => {
    // If defaultDocID is explicitly provided, it should take precedence over URL
    if (defaultDocID && defaultDocID !== urlDocID) {
      setUrlDocID(defaultDocID);
    }
  }, [defaultDocID, urlDocID, setUrlDocID]);

  // Initial data loading
  React.useEffect(() => {
    // Skip if we already completed initial load or have a defaultDoc
    if (initialLoadCompleted.current) return;

    const loadDoc = async () => {
      // Get the ID to load - defaultDocID has already been synchronized to URL if needed
      const idToLoad = urlDocID || defaultDocID;

      // If no ID, use new doc and exit early
      if (!idToLoad) {
        setDoc(NEW_DOC);
        setIsLoading(false);
        initialLoadCompleted.current = true;
        return;
      }

      try {
        const startTime = Date.now();

        const call = await getDoc(idToLoad);
        if (call.err) throw call.err;
        setDocState(call.data as Doc);

        // Handle minimum delay for UI
        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsedTime);

        clearLoadingTimeout();

        if (remainingDelay > 0) {
          loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            initialLoadCompleted.current = true;
          }, remainingDelay);
        } else {
          setIsLoading(false);
          initialLoadCompleted.current = true;
        }
      } catch (err) {
        console.error('Error loading doc:', err);
        toast.error('Doc not found.');
        setUrlDocID(null); // Clear the URL parameter
        setDocState(NEW_DOC);
        setIsLoading(false);
        initialLoadCompleted.current = true;
      }
    };

    loadDoc();

    return () => {
      clearLoadingTimeout();
    };
  }, [
    defaultDoc,
    defaultDocID,
    urlDocID,
    clearLoadingTimeout,
    minDelay,
    setDoc,
    setUrlDocID,
  ]);

  // Modify the URL effect to be more aggressive about skipping loading
  React.useEffect(() => {
    // Skip loading in many cases:
    if (
      skipLoading || // Skip if explicitly told to
      isDirectUpdate.current || // Skip if direct update
      !initialLoadCompleted.current || // Skip if initial load not done
      !doc || // Skip if no doc
      doc.id === urlDocID || // Skip if URL matches doc
      !urlDocID // Skip if no URL ID
    ) {
      return;
    }

    // If URL changed to a new doc ID, load that doc
    if (urlDocID && urlDocID !== doc.id) {
      const loadNewDoc = async () => {
        setIsLoading(true);

        try {
          const call = await getDoc(urlDocID);
          if (call.err) throw call.err;
          setDocState(call.data as Doc);
        } catch (err) {
          console.error('Error loading doc from URL change:', err);
          toast.error('Doc not found.');
          setUrlDocID(null); // Clear the URL parameter
          setDocState(NEW_DOC);
        } finally {
          setIsLoading(false);
        }
      };

      loadNewDoc();
    }

    // If URL was cleared but we have a doc ID, update the URL
    if (!urlDocID && doc.id) {
      setUrlDocID(doc.id);
    }
  }, [urlDocID, doc, skipLoading, setUrlDocID]);

  return {
    doc,
    setDoc,
    docID: urlDocID,
    setDocID: setUrlDocID,
    isLoading,
    close,
    remove,
    refreshDocsCount: refreshCounter,
    triggerDocsRefresh,
  };
}

// Type for the app context values
export type AppContextType = ReturnType<typeof useApp>;

// Create context with undefined default (will be set in provider)
const AppContext = React.createContext<AppContextType | undefined>(undefined);

// Provider props - extending UseAppOptions
export interface AppProviderProps extends UseAppOptions {
  children: React.ReactNode;
  defaultDoc?: Partial<Doc>;
}

export const DocsAppProvider: React.FC<AppProviderProps> = ({
  children,
  defaultDoc,
  defaultDocID,
  ...options
}) => {
  // Always skip loading when defaultDoc is provided
  const skipLoading = Boolean(defaultDoc);

  // Pass defaultDoc and skipLoading to useApp
  const app = useApp({
    ...options,
    defaultDoc,
    defaultDocID,
    skipLoading,
  });

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

// ----- MERGE THE TWO HOOKS INTO ONE -----

export function DocsProvider({ children }: { children: React.ReactNode }) {
  const [doc, setDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshDocsCount, setRefreshDocsCount] = useState(0);
  const refreshCounterRef = useRef(0);

  // Only trigger refresh on document adding or removal, not selection/closing
  const triggerDocsRefresh = useCallback(() => {
    refreshCounterRef.current += 1;
    // Directly update the state to ensure component re-renders
    setRefreshDocsCount(prev => prev + 1);
    console.log('Triggered docs refresh:', refreshCounterRef.current);
  }, []);

  // Update remove function to always trigger a refresh
  const remove = useCallback(() => {
    setDoc(null);
    triggerDocsRefresh();
  }, [triggerDocsRefresh]);

  // Close function doesn't trigger a list refresh
  const close = useCallback(() => {
    setDoc(null);
  }, []);

  return (
    <DocsContext.Provider
      value={{
        doc,
        setDoc,
        isLoading,
        setIsLoading,
        close,
        remove,
        refreshDocsCount,
        triggerDocsRefresh,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
}

// Use this unified hook for all components
export const useDocs = () => {
  // Try to use the new DocsContext first
  const docsContext = useContext(DocsContext);

  // If that's not available, fall back to the older AppContext
  const appContext = React.useContext(AppContext);

  if (!docsContext.doc && !appContext) {
    throw new Error(
      'useDocs must be used within a DocsProvider or AppProvider'
    );
  }

  // Return the context that has valid data
  return docsContext.doc ? docsContext : (appContext as any);
};
