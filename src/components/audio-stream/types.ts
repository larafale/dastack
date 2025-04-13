export interface AudioStreamProps {
  className?: string;
  disabled?: boolean;
  controls?: boolean;
  isLoading?: boolean;
  endpoint?: string;
  audio: {
    mediaRecorder?: MediaRecorder | null;
    isRecording: boolean;
    isPlaying: boolean;
    isLoading: boolean;
    duration?: number;
    displayTime?: string;
    file?: AudioFile | null;
    status?: string;
    logs?: string[];
    start: () => Promise<void>;
    stop: () => Promise<void>;
    play: () => void;
    pause: () => void;
    reset: () => Promise<void>;
  };
}

export type AudioFile = {
  blob: Blob,
  duration: number,
  url?: string,
}