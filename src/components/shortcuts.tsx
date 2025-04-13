'use client';

import { Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import Modal from './modal';
import { useState, useEffect, useCallback } from 'react';
import { useShortcuts } from '../hooks/useShortcuts';
import { useRecordHotkeys, useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function Shortcuts({ button = false, trigger = "shortcut" }) {
  const [open, setOpen] = useState(false);
  const { shortcuts, setShortcut, getShortcut, loading } = useShortcuts();
  const t = useTranslations('Shortcuts');

  // Track which shortcut is currently being edited
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Use the recording hook
  const [keys, { start, stop, isRecording }] = useRecordHotkeys({
    useKey: true,
  });

  // Add global hotkey '?' to toggle shortcuts modal
  useHotkeys(
    getShortcut('hotkeys', true) as string,
    () => {
      setOpen((prevOpen) => !prevOpen);
    },
    {
      enabled: !isRecording, // Disable when recording other shortcuts
      preventDefault: true,
    }
  );

  // Start recording for a specific shortcut
  const startRecording = (key: string) => {
    setEditingKey(key);
    start();
  };

  // Save the recorded shortcut and stop recording
  const saveRecordedShortcut = useCallback(async () => {
    if (editingKey && keys.size > 0) {
      // Filter out 'Enter' key from recorded keys
      const keysArray = Array.from(keys).filter((key) => key !== 'Enter');

      // Only save if we have keys remaining after filtering
      if (keysArray.length > 0) {
        await setShortcut(editingKey, keysArray);
      }
    }
    setEditingKey(null);
    stop();
  }, [editingKey, keys, setShortcut, stop]);

  // Cancel recording without saving
  const cancelRecording = useCallback(() => {
    setEditingKey(null);
    stop();
  }, [stop]);

  // Handle clicking on a shortcut during recording
  const handleShortcutClick = useCallback(
    (key: string) => {
      if (!isRecording) {
        // Not recording yet, start recording for this shortcut
        startRecording(key);
      } else if (key === editingKey) {
        // Clicking the same shortcut that's being edited
        const displayKeys = Array.from(keys).filter((k) => k !== 'Enter');

        if (displayKeys.length > 0) {
          // If keys have been recorded, save them (like pressing Enter)
          saveRecordedShortcut();
        } else {
          // If no keys recorded yet, just cancel (like pressing Escape)
          cancelRecording();
        }
      } else {
        // Clicking a different shortcut while recording
        // First save any existing recorded keys for the current shortcut
        const displayKeys = Array.from(keys).filter((k) => k !== 'Enter');

        if (displayKeys.length > 0) {
          saveRecordedShortcut().then(() => {
            // Then start recording for the new shortcut
            startRecording(key);
          });
        } else {
          // If no keys recorded for the current shortcut, just switch to the new one
          cancelRecording();
          startRecording(key);
        }
      }
    },
    [isRecording, editingKey, keys, saveRecordedShortcut, cancelRecording]
  );

  // Add key listeners to handle Enter/Escape during recording
  useEffect(() => {
    if (!isRecording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        saveRecordedShortcut();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancelRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isRecording, saveRecordedShortcut, cancelRecording]);

  // Create a display version of keys without Enter
  const displayKeys = Array.from(keys).filter((key) => key !== 'Enter');

  const list = shortcuts.map(({ key, strokes = [] }) => (
    <div key={key} className="flex justify-between items-center select-none">
      <span className="text-sm font-medium">{t(key)}</span>
      <Button
        variant="ghost"
        className={cn(
          `kbd select-none cursor-pointer transition-colors`,
          {
            'bg-brand hover:bg-brand text-white hover:text-white': isRecording && editingKey === key,
            // 'hover:bg-accent': !isRecording || editingKey !== key,
          }
        )}
        onClick={() => trigger === "edit" ? handleShortcutClick(key) : "???"}
      >
        {isRecording && editingKey === key
          ? displayKeys.join(' + ') || '...'
          : strokes.map((stroke, i) => (
            <span key={i}>
              {stroke}
              {i + 1 < strokes.length && (
                <span className="text-muted-foreground"> + </span>
              )}
            </span>
          ))}
      </Button>
    </div>
  ))

  if (!button) return (
    <div className="flex flex-col gap-4">
      {list}
    </div>
  )

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <Keyboard className="size-4" />
      </Button>
      <Modal
        mode="dialog"
        open={open}
        onClose={() => {
          if (isRecording) cancelRecording();
          setOpen(false);
        }}
        className="max-w-[300px] p-4 h-full md:h-auto"
      >
        <h2 className="text-lg font-bold">{t('title')}</h2>
        <div className='flex flex-col gap-4 my-6'>
          {list}
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          {t('infos')}
        </div>
      </Modal>
    </>
  );
}
