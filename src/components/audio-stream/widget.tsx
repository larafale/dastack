'use client';

import * as React from 'react';
import { Mic, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { AudioStreamProps } from './types';
import './styles.css';

const AudioStreamWidget = ({
  audio,
  className,
  disabled,
}: AudioStreamProps) => {
  const {
    isRecording,
    isPlaying,
    isLoading,
    file,
    start,
    stop,
    pause,
    displayTime,
  } = audio;

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isAudioBtnActive, setIsAudioBtnActive] = React.useState(false);
  const [animateBlast, setAnimateBlast] = React.useState(false);

  // Update isAudioBtnActive based on recording state
  React.useEffect(() => {
    setIsAudioBtnActive(isRecording);
  }, [isRecording]);

  React.useEffect(() => {
    if (!file && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }, [file]);

  React.useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        pause();
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, pause]);

  React.useEffect(() => {
    if (file) {
      const audio = new Audio(file.url);
      audio.addEventListener('ended', () => pause());
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.removeEventListener('ended', () => pause());
      };
    }
  }, [file, pause]);

  // Handle the card click to trigger recording
  const toggleRecording = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Return early if the component is disabled or loading
    if (disabled || isLoading) return;

    try {
      if (isRecording) {
        await stop();
      } else {
        // Trigger blast animation
        setAnimateBlast(true);

        // Reset animation after it completes
        setTimeout(() => setAnimateBlast(false), 1000);

        await start();
      }
    } catch (error) {
      console.error('Error handling toggleRecording click:', error);
    }
  };

  return (
    <Card
      className={cn(
        'w-full overflow-hidden field-shadow rounded-sm',
        !disabled && !isLoading
          ? 'cursor-pointer card-hover-effect'
          : 'cursor-default',
        isRecording && 'is-recording',
        className
      )}
      onClick={toggleRecording}
      role="button"
      tabIndex={disabled || isLoading ? -1 : 0}
      aria-pressed={isRecording}
      aria-disabled={disabled || isLoading}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center flex flex-col items-center gap-8">
            <div className="flex gap-12 items-center justify-center">
              {/* Pulse Button - now just for visual effect, doesn't need click handler */}
              <div className="space-y-4 flex flex-col items-center">
                <div className="audio-btn-container">
                  <div
                    className={cn(
                      'audio-btn',
                      isAudioBtnActive && 'is-clicked',
                      animateBlast && 'blast-animation'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center h-full w-full',
                        !disabled && !isLoading
                          ? 'cursor-pointer'
                          : 'cursor-default'
                      )}
                    >
                      {isLoading ? (
                        <LoaderCircle className="size-8 text-background animate-spin" />
                      ) : (
                        <Mic className="size-8 text-background" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recording indicator and timer */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 w-full mt-4 select-none"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      color: 'rgb(239, 68, 68)',
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </motion.div>
                  <span className="text-sm font-medium text-red-500">
                    Recording
                  </span>
                  <span className="text-xl font-mono ml-2">{displayTime}</span>
                </div>
              </motion.div>
            )}

            {/* Status indicator */}
            {/* {!isRecording && status !== "idle" && (
              <div className="text-sm text-muted-foreground">
                Status: {status}
              </div>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioStreamWidget;
