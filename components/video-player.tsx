"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface VideoPlayerProps {
  onVideoComplete: () => void
  showInSidebar?: boolean
}

export function VideoPlayer({ onVideoComplete, showInSidebar = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCompleted, setHasCompleted] = useState(false)

  const shouldShowControls = showInSidebar || hasCompleted

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      if (!hasCompleted) {
        setHasCompleted(true)
        onVideoComplete()
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      if (!shouldShowControls) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shouldShowControls && ["Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        e.preventDefault()
      }
    }

    video.addEventListener("ended", handleEnded)
    video.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [shouldShowControls, hasCompleted, onVideoComplete])

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  return (
    <Card className={`${showInSidebar ? "" : "w-full max-w-full"}`}>
      <div className={`relative ${showInSidebar ? "aspect-video" : "aspect-video w-full max-w-full"} bg-black`}>
        <video
          ref={videoRef}
          className="h-full w-full max-h-full max-w-full object-contain"
          autoPlay={!showInSidebar}
          controls={shouldShowControls}
          onContextMenu={(e) => !shouldShowControls && e.preventDefault()}
          controlsList="nodownload"
          disablePictureInPicture={!shouldShowControls}
        >
          <source
            src="https://samplefile.com/static/samples/video/mp4/mp4_15s_sample_file_868KB.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {!shouldShowControls && (
          <div className="absolute inset-0 cursor-not-allowed" onClick={(e) => e.preventDefault()} />
        )}
      </div>
      <div className="bg-muted p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {shouldShowControls
            ? "Video available with full controls for reference."
            : "Please watch the entire video. Controls are disabled to ensure complete viewing."}
        </p>
        {shouldShowControls && !showInSidebar && (
          <Button variant="outline" size="sm" onClick={handleReplay} className="flex-shrink-0 bg-transparent">
            <RotateCcw className="mr-2 h-4 w-4" />
            Replay
          </Button>
        )}
      </div>
    </Card>
  )
}
