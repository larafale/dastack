import React, { forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, LetterText, Loader2, Mic } from 'lucide-react';
import { AudioStreamWidget, useAudioStream, AudioStreamButton } from './index';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useShortcuts } from '@/hooks/useShortcuts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define what properties/methods the parent can access
export type AudioBoxRef = ReturnType<typeof useAudioStream>;

interface AudioBoxProps {
  mode?: string;
  disabled?: boolean;
  className?: string;
  endpoint: string;
  params?: any;
  placeholder?: string;
  disableModeSwitch?: boolean;
  variant?: 'button' | 'widget';
  onComplete?: (mode: string, res?: any, text?: string) => Promise<any> | any;
}

// Convert to forwardRef
const AudioBox = forwardRef<AudioBoxRef, AudioBoxProps>(
  (
    {
      mode: defaultMode = 'audio',
      disabled = false,
      className,
      endpoint,
      params,
      onComplete,
      placeholder,
      disableModeSwitch = false,
      variant = 'widget',
    },
    ref
  ) => {
    const debug = false;
    const [text, setText] = React.useState('');
    const [mode, setMode] = React.useState(defaultMode);
    const [isLoading, setIsLoading] = React.useState(false);
    const isAudioMode = mode === 'audio';
    const isTextMode = mode === 'text';
    const { getShortcut } = useShortcuts();

    const audio = useAudioStream({
      disabled,
      endpoint,
      hotkey: getShortcut('voice', true) as string,
      finalParams: () => ({ mode, ...params }),
      onRecordingComplete: (res, audioData) => {
        if (res.success) {
          if (isTextMode) setText(res.data.text);
          else handleComplete('', res);
        } else toast.error(res.err?.message || res.err);
      },
    });

    // Expose the audio object to the parent component via ref
    useImperativeHandle(ref, () => audio, [audio]);

    const handleComplete = async (text: string, res?: any) => {
      try {
        setIsLoading(true);
        const call = await onComplete?.(mode, res, text);
        if (call && 'err' in call) throw call.err;
        setText('');
      } catch (err) {
        toast.error(err?.message || err);
        console.error('Failed to complete:', err);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className={cn('space-y-2', className)}>
        {!disableModeSwitch && (
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v)}
            className="w-full"
          >
            <TabsList className="flex justify-around mb-2">
              <TabsTrigger value="audio" className="flex-1">
                <Mic className="size-4" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1">
                <LetterText className="size-4" />
                Text
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {variant === 'button' && <AudioStreamButton audio={audio} />}
        {variant === 'widget' && <AudioStreamWidget audio={audio} />}

        {/* Debug Logs Section */}
        {debug && (
          <div className="bg-muted p-3 rounded-md max-h-[150px] overflow-y-auto text-xs font-mono">
            {audio.logs && audio.logs.length > 0 ? (
              audio.logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No logs yet</div>
            )}
          </div>
        )}

        {isTextMode && (
          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className=""
            />
            {text && (
              <div className="absolute bottom-2 right-2">
                {/* <LLMPicker defaultLLM="anthropic:claude-3-5-sonnet" /> */}
                <Button
                  onClick={() => handleComplete(text)}
                  disabled={!text || isLoading}
                  variant="outline"
                  tabIndex={0}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default AudioBox;
