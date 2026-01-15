"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function AudioOnLoad() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname?.() ?? "/";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlayEvent = () => {
      audio.muted = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      setIsVisible(true);
    };

    const onPauseEvent = () => {
      audio.pause();
      setIsPlaying(false);
    };

    window.addEventListener("mailo:play-audio", onPlayEvent);
    window.addEventListener("mailo:pause-audio", onPauseEvent);

    return () => {
      window.removeEventListener("mailo:play-audio", onPlayEvent);
      window.removeEventListener("mailo:pause-audio", onPauseEvent);
    };
  }, []);

  // Autoplay immediately on app load; 
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let unmuteTimer;

    const attemptPlay = async () => {
      audio.muted = true;
      try {
        await audio.play();
        setIsPlaying(true);
        // Unmute shortly after playback begins to keep autoplay allowed
        unmuteTimer = window.setTimeout(() => {
          audio.muted = false;
        }, 150);
      } catch (err) {
        // If autoplay still fails, keep banner visible so user can manually start
        setIsVisible(true);
      }
    };

    attemptPlay();

    return () => {
      if (unmuteTimer) window.clearTimeout(unmuteTimer);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const restartAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.muted = false;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const closeBanner = () => setIsVisible(false);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/Green Day - Last Night on Earth.mp3"
        muted={false}
        autoPlay
        playsInline
        preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
      />
      {isVisible && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 rounded-full border border-[#1f324f]/30 bg-white/95 backdrop-blur px-4 py-2 shadow-md">
            <span className="text-sm" style={{ color: "#1f324f", fontFamily: "'Myfont'" }}>
              Music: {isPlaying ? "Playing" : "Paused"}
            </span>
            <button
              onClick={togglePlay}
              className="px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: "#1f324f", fontFamily: "'Myfont'" }}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={restartAudio}
              className="px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: "#1f324f", fontFamily: "'Myfont'" }}
              title="Play from the top"
            >
              Restart
            </button>
            <button
              onClick={closeBanner}
              className="ml-1 px-2 py-1 rounded-full text-[#1f324f] hover:bg-[#1f324f]/10"
              aria-label="Close"
              title="Hide"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
