"use client";

import * as React from "react";
import { Maximize, Minimize } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function FullScreenToggle() {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  React.useEffect(() => {
    function onFullScreenChange() {
      setIsFullScreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  const handleToggle = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleToggle}>
            {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            <span className="sr-only">Toggle Fullscreen</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFullScreen ? "Quitter le plein écran" : "Passer en plein écran"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
