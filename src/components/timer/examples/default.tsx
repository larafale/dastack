'use client';

import React from "react";
import { Timer } from "../timer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTimer } from "../use-timer";
import ShowcaseComponent from "@/components/ui/showcase-component";

function WidgetComponent() {
    const [showControls, setShowControls] = React.useState(false);
    const timer = useTimer();

    const component = (
        <Timer
            ref={timer.ref}
            className=""
            controls={showControls}
        />)

    const controls = (<>
        <Button
            variant="outline"
            size="sm"
            onClick={timer.start}
        >
            start
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={timer.stop}
        >
            stop
        </Button>
        <Button
            size="sm"
            variant="outline"
            onClick={timer.reset}
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
    </>)



    return (<ShowcaseComponent
        title="Timer"
        component={component}
        controls={controls}
    />)

}

export default React.memo(WidgetComponent);
