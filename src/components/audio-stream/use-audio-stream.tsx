import * as React from 'react';
import { toast } from 'sonner';
import { formatTimeDisplay } from '@/lib/date';
import { AudioFile } from './types';
import { useHotkeys } from 'react-hotkeys-hook';

interface AudioStreamOptions {
  onRecordingComplete?: (serverResponse: any, audioFile: AudioFile) => void;
  endpoint?: string;
  hotkey?: string;
  maxRecordTime?: number;
  finalParams?: () => Record<string, any>;
  disabled?: boolean;
}

const useAudioStream = (options: AudioStreamOptions = {}) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState<number>(0);
  const [file, setFile] = React.useState<AudioFile | null>(null);
  const [status, setStatus] = React.useState<string>('idle');
  const [logs, setLogs] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Add timer state
  const [displayTime, setDisplayTime] = React.useState('0:00');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Get max recording time from options or use default of 60 seconds
  const maxRecordTime = options.maxRecordTime ?? 60;

  // Track recording time in seconds for comparing against max time
  const recordingTimeRef = React.useRef(0);

  const endpoint = options.endpoint || '/api/stream/test';
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Add client-side logging function
  const addLog = (message: string, reset = false) => {
    const log = `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`;
    if (reset) setLogs([log]);
    else setLogs((prevLogs) => [...prevLogs, log].slice(-3));
  };

  const calculateDuration = async (blob: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          resolve(audioBuffer.duration);
        } catch (error) {
          reject(error);
        } finally {
          audioContext.close();
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(blob);
    });
  };

  const handleRecordingComplete = React.useCallback(
    async (audioFile: AudioFile, serverResponse?: any) => {
      try {
        // Pass serverResponse as first parameter, audioFile as second
        options.onRecordingComplete?.(serverResponse, audioFile);

        // Setup audio for playback
        const audio = new Audio();

        const canPlayHandler = () => {
          audioRef.current = audio;
        };

        const errorHandler = (e: ErrorEvent) => {
          console.error('Audio loading error:', e);
          toast.error('Could not load audio for playback');
          audio.removeEventListener('canplaythrough', canPlayHandler);
        };

        audio.addEventListener('canplaythrough', canPlayHandler);
        audio.addEventListener('error', errorHandler);
        audio.addEventListener('ended', () => setIsPlaying(false));

        audio.src = audioFile.url || '';
        audio.load();
      } catch (error) {
        console.error('Error handling recording completion:', error);
        toast.error('Could not process recording');
      }
    },
    [options.onRecordingComplete]
  );

  const setupMediaRecorder = (
    mediaRecorder: MediaRecorder,
    mimeType: string
  ) => {
    mediaRecorder.onstart = () => {
      addLog('MediaRecorder started');
    };

    mediaRecorder.onstop = () => {
      addLog('MediaRecorder stopped');
    };

    mediaRecorder.onerror = (event) => {
      addLog(`MediaRecorder error: ${event.error}`);
    };

    mediaRecorder.ondataavailable = async (event) => {
      addLog(`Data available: ${event.data.size} bytes`);

      if (event.data.size > 0) {
        chunksRef.current.push(event.data);

        // Check if we're in Safari - only send chunks if not final
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        if (isSafari) {
          // For Safari, we'll only send the complete audio at the end
          // to avoid corrupted interim chunks
          addLog('Safari detected - will send complete audio at the end');
          return;
        }

        addLog(`Sending audio chunk to ${endpoint}...`);

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            body: event.data,
            headers: {
              'Content-Type': mimeType,
            },
          });

          const responseData = await response.json();
          addLog(`API response: ${JSON.stringify(responseData)}`);

          if (response.ok) {
            setStatus('audio chunk sent successfully');
          } else {
            setStatus(`error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          const errorMsg = `Error sending audio: ${error}`;
          addLog(errorMsg);
          setStatus(errorMsg);
        }
      }
    };
  };

  const start = async () => {
    try {
      if (options.disabled) return;

      // First clean up any existing recording state
      if (isRecording) {
        await stop();
      }

      // Clean up any existing audio resources
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }

      // Reset all state before starting new recording
      setFile(null);
      setDuration(0);
      chunksRef.current = [];

      addLog('Starting recording process', true);
      setStatus('requesting microphone access...');

      // Check if mediaDevices is available
      if (!navigator.mediaDevices) {
        const errorMsg = 'MediaDevices API not available in this browser';
        addLog(errorMsg);
        setStatus(errorMsg);
        return;
      }

      addLog('Requesting microphone access');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      addLog('Microphone access granted');

      // Detect Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      let preferredType = isSafari ? 'audio/mp4' : 'audio/webm;codecs=opus';

      // Check if the preferred type is supported, if not fall back to the list
      if (MediaRecorder.isTypeSupported(preferredType)) {
        addLog(`Using preferred MIME type for this browser: ${preferredType}`);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: preferredType,
        });
        mediaRecorderRef.current = mediaRecorder;
        setupMediaRecorder(mediaRecorder, preferredType);
      } else {
        // Fallback to checking other MIME types
        const mimeTypes = [
          'audio/webm',
          'audio/webm;codecs=opus',
          'audio/ogg;codecs=opus',
          'audio/mp4',
          'audio/mp4;codecs=mp4a',
          'audio/aac',
          'audio/mpeg',
          'audio/x-m4a',
        ];

        let supportedType = '';

        for (const type of mimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            supportedType = type;
            addLog(`Using MIME type: ${type}`);
            break;
          }
        }

        if (!supportedType) {
          addLog('No supported audio MIME types found - using default');
          // Safari fallback - use default audio format
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          setupMediaRecorder(mediaRecorder, 'audio/mp4'); // Best guess default
        } else {
          // Use the supported type
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: supportedType,
          });
          mediaRecorderRef.current = mediaRecorder;
          setupMediaRecorder(mediaRecorder, supportedType);
        }
      }

      // Start recording with 1 second intervals (important for Safari MP4 to not get corrupted)
      mediaRecorderRef.current.start(1000);
      addLog(
        'Recording started with 1s intervals (needed for Safari compatibility)'
      );
      setIsRecording(true);
      setStatus('recording...');
    } catch (error) {
      const errorMsg = `Error starting recording: ${error}`;
      addLog(errorMsg);
      setStatus(errorMsg);
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const stop = React.useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const cleanup = async () => {
        // Set loading state to true when stopping recording
        setIsLoading(true);
        addLog('Processing audio...');

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setIsRecording(false);
        mediaRecorderRef.current = null;
        addLog('Recording stopped');
        setStatus('processing');

        try {
          // Create blob from chunks before sending final notification
          // Detect Safari and use appropriate mime type
          const isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          const blobType = isSafari ? 'audio/mp4' : 'audio/webm';

          const blob = new Blob(chunksRef.current, {
            type: blobType,
          });

          const audioDuration = await calculateDuration(blob);
          const url = URL.createObjectURL(blob);
          const audioFile: AudioFile = { blob, duration: audioDuration, url };

          setFile(audioFile);
          setDuration(audioDuration);

          // Send final notification and get response
          addLog('Sending to server, waiting for response...');
          const serverResponse = await sendFinalNotification(audioFile);

          // Pass both blob and server response to the completion handler
          handleRecordingComplete(audioFile, serverResponse);
        } catch (error) {
          console.error('Error processing audio:', error);
          addLog(`Error processing: ${error}`);
        } finally {
          // Set loading state to false when processing is complete
          setIsLoading(false);
          setStatus('idle');
          resolve();
        }
      };

      try {
        mediaRecorderRef.current!.addEventListener('stop', cleanup, {
          once: true,
        });
        mediaRecorderRef.current!.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
        cleanup();
      }
    });
  }, [isRecording, handleRecordingComplete]);

  const sendFinalNotification = async (audioFile: AudioFile): Promise<any> => {
    try {
      addLog(`Sending final notification to ${endpoint}...`);

      // Create a new blob with the proper MIME type for Safari if needed
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const finalBlob = isSafari
        ? new Blob(chunksRef.current, { type: 'audio/mp4' })
        : audioFile.blob;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: finalBlob,
        headers: {
          'Content-Type': finalBlob.type || 'audio/webm',
          'X-Final-Chunk': 'true',
          'X-Final-Params': JSON.stringify(options.finalParams?.() || {}),
          'X-Audio-Duration': audioFile.duration.toString(),
        },
      });

      const finalResponse = await response.json();
      addLog(`Final API response: ${JSON.stringify(finalResponse)}`);
      addLog(`Recording complete`);
      setStatus(`Recording complete`);
      return finalResponse;
    } catch (error) {
      const errorMsg = `Error sending final notification: ${error}`;
      addLog(errorMsg);
      setStatus(errorMsg);
      return { error: errorMsg };
    }
  };

  const toggle = React.useCallback(async () => {
    if (isRecording) {
      await stop();
    } else {
      await start();
    }
  }, [isRecording, start, stop]);

  const play = React.useCallback(() => {
    if (!file) return;

    try {
      // Create a new audio element if one doesn't exist
      if (!audioRef.current) {
        const audio = new Audio(file.url);

        audio.addEventListener('ended', () => setIsPlaying(false));
        audio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
          toast.error(
            'Failed to play audio. Safari may not support this audio format.'
          );
        });

        audioRef.current = audio;
      }

      const audio = audioRef.current;

      // Reset the audio to start if it was ended
      if (audio.ended) {
        audio.currentTime = 0;
      }

      // Set playing state before starting playback
      setIsPlaying(true);

      // Use a promise with timeout for better error handling
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            toast.error(
              'Failed to play audio. This may be a browser compatibility issue.'
            );
          });
      }
    } catch (error) {
      console.error('Error in play function:', error);
      setIsPlaying(false);
      toast.error('Failed to play audio');
    }
  }, [file]);

  const pause = React.useCallback(() => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      setIsPlaying(false); // Set state immediately
    } catch (error) {
      console.error('Error pausing audio:', error);
      toast.error('Failed to pause audio');
    }
  }, []);

  const reset = React.useCallback(async () => {
    try {
      // First stop any ongoing recording
      if (isRecording) {
        await stop();
      }

      // Stop playback and cleanup audio element
      if (audioRef.current) {
        // Remove event listeners before changing src to prevent error callbacks
        const audio = audioRef.current;
        const cloneAudio = audio.cloneNode(false);
        audio.parentNode?.replaceChild(cloneAudio, audio);

        // Or simply pause and set src to empty without triggering events
        audio.pause();
        audio.src = '';
        audio.removeAttribute('src');
        audio.load();
        audioRef.current = null;
      }

      // Clean up the recorded audio URL
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }

      setIsPlaying(false);
      setFile(null);
      setDuration(0);
      setStatus('idle');
      setLogs([]);

      // Clear any remaining chunks
      chunksRef.current = [];

      // Make sure media recorder is cleared
      mediaRecorderRef.current = null;

      // Stop and cleanup any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    } catch (error) {
      console.error('Error resetting recorder:', error);
      toast.error('Failed to reset recorder');
    }
  }, [isRecording, file, stop]);

  // At beginning of the component lifecycle, test the endpoint
  // React.useEffect(() => {
  //   const testEndpoint = async () => {
  //     try {
  //       addLog(`Testing API endpoint: ${endpoint}...`);
  //       const response = await fetch(endpoint, {
  //         method: 'GET',
  //       });
  //       const text = await response.text();
  //       addLog(`API test response: ${text}`);
  //     } catch (error) {
  //       addLog(`API test error: ${error}`);
  //     }
  //   };

  //   testEndpoint();
  // }, [endpoint]);

  // Timer functions
  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset recording time counter
    recordingTimeRef.current = 0;
    let seconds = 0;
    setDisplayTime('0:00');

    intervalRef.current = setInterval(() => {
      seconds++;
      recordingTimeRef.current = seconds;
      setDisplayTime(formatTimeDisplay(seconds));

      // Check if we've reached the maximum recording time
      if (seconds >= maxRecordTime) {
        // Stop recording when max time is reached
        stop().catch((error) => {
          console.error('Error stopping recording at max time:', error);
        });

        // Log that we stopped due to max time
        addLog(`Maximum recording time of ${maxRecordTime}s reached`);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Reset recording time counter when stopping
    recordingTimeRef.current = 0;
  };

  // Update existing useEffect or add a new one
  React.useEffect(() => {
    if (isRecording) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [isRecording]);

  useHotkeys(
    options.hotkey || 'space',
    (event) => {
      console.log('hotkey', options.disabled ? 'true' : 'false');
      event.preventDefault();
      toggle();
    },
    {
      enabled: !options.disabled && !!options.hotkey,
      keydown: true,
    },
    [toggle, options.hotkey]
  );

  return {
    isRecording,
    isPlaying,
    isLoading,
    duration,
    displayTime,
    file,
    mediaRecorder: mediaRecorderRef.current,
    status,
    logs,
    start,
    stop,
    toggle,
    play,
    pause,
    reset,
    maxRecordTime,
  };
};

export default useAudioStream;
