'use client';

import * as React from 'react';
import {
  Mic,
  LoaderCircle,
  CircleX,
  Play,
  Pause,
  Timer,
  PauseIcon,
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AudioLiveViz } from './live-viz';
import { AudioStreamProps } from './types';

const AudioStreamButton = ({
  audio,
  className,
  disabled,
  controls = false,
}: AudioStreamProps) => {
  const {
    isRecording,
    isPlaying,
    isLoading,
    file,
    start,
    stop,
    play,
    pause,
    reset,
    displayTime,
  } = audio;

  const [error, setError] = React.useState<{ message: string } | null>(null);
  const [transcript, setTranscript] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Handle toggle recording
  const handleToggleRecording = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isLoading) return;

    try {
      if (isRecording) {
        await stop();
      } else {
        await start();
      }
    } catch (err) {
      console.error('Error toggling recording:', err);
      setError({ message: 'Failed to toggle recording' });
    }
  };

  // Handle play/pause click
  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Handle reset click
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    reset();
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={cn(
          'inline-flex items-center gap-1 border rounded-full overflow-hidden field-shadow',
          isRecording && 'cursor-pointer hover:bg-accent',
          className
        )}
        onClick={() => isRecording && stop()}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          onClick={handleToggleRecording}
          className={cn(
            'transition-colors rounded-full',
            isRecording && 'border-primary animate-pulse'
          )}
        >
          <motion.div
            initial={false}
            animate={{
              scale: isRecording ? 1.1 : 1,
              color: isRecording ? 'rgb(239, 68, 68)' : 'currentColor',
            }}
            transition={{ duration: 0.2 }}
          >
            {' '}
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : isRecording ? (
              <PauseIcon className="size-4" />
            ) : (
              <Mic className="size-4" />
            )}
          </motion.div>
        </Button>
        <AnimatePresence mode="sync">
          {isRecording && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2">
                {audio.mediaRecorder && (
                  <AudioLiveViz
                    mediaRecorder={audio.mediaRecorder as MediaRecorder}
                  />
                )}
                <div className="text-xs font-mono pe-3 select-none">
                  {displayTime}
                </div>
              </div>
            </motion.div>
          )}
          {controls && file && !isRecording && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPauseClick}
                className="rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="flex flex-col text-xs text-muted-foreground select-none">
                <span>
                  {audio.duration ? formatDuration(audio.duration) : '00:00'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="rounded-full"
              >
                <CircleX className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <div className="mt-2 text-red-500 text-sm">{error.message}</div>
      )}

      {transcript && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md w-full max-w-md">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default AudioStreamButton;
