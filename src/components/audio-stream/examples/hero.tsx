'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { AudioStreamWidget, useAudioStream } from "..";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function Example() {
    const [showControls, setShowControls] = React.useState(false);

    const audio = useAudioStream({
        endpoint: '/api/stream/test',
        onRecordingComplete: (data) => {
            console.log("recording complete", data);
        },
    });

    const component = (
        <AudioStreamWidget audio={audio} controls={showControls} />
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
            </div>


        </>
    );

    return (
        <div className="space-y-4">
            {component}
            <div className={"flex items-center gap-2"}>
                {controls}
            </div>
        </div>
    );
}

export default React.memo(Example);
