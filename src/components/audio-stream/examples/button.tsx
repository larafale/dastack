'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { AudioStreamButton, useAudioStream } from "..";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ShowcaseComponent from "@/components/ui/showcase-component";

function Example() {
  const [showControls, setShowControls] = React.useState(false);

  const audio = useAudioStream({
    endpoint: '/api/stream/test',
    onRecordingComplete: (data, audioData) => {
      console.log("recording complete", data);
    },
  });


  const component = (
    <AudioStreamButton audio={audio} controls={showControls} />
  );

  const controls = (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={audio.start}
          disabled={audio.isRecording}
        >
          start
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={audio.stop}
          disabled={!audio.isRecording}
        >
          stop
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (audio.isPlaying) {
              audio.pause();
            } else {
              audio.play();
            }
          }}
          disabled={!audio.file || audio.isRecording}
        >
          {audio.isPlaying ? (
            <>
              <Pause className="size-4 mr-2" />
              pause
            </>
          ) : (
            <>
              <Play className="size-4 mr-2" />
              play
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={audio.reset}
          disabled={!audio.file || audio.isRecording}
        >
          reset
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            checked={showControls}
            onCheckedChange={setShowControls}
          />
          <Label>Controls</Label>
        </div>
      </div>

      {/* Debug Logs Section */}
      <div className="bg-muted p-3 rounded-md max-h-[150px] overflow-y-auto text-xs font-mono">
        {audio.logs && audio.logs.length > 0 ? (
          audio.logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))
        ) : (
          <div className="text-gray-500">No logs yet</div>
        )}
      </div>
    </>
  );

  return (
    <ShowcaseComponent
      title="Audio Stream Button"
      component={component}
      controls={controls}
      controlsClassName="flex flex-col gap-2"
    />
  );
}

export default React.memo(Example);
