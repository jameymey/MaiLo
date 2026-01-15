"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function AudioOnLoad() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname?.() ?? "/";
  const hasInitialized = useRef(false);
  const savedTimeRef = useRef(0);

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

  // Save current time whenever it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInitialized.current) return;

    const handleTimeUpdate = () => {
      savedTimeRef.current = audio.currentTime;
      console.log("Saved audio time on timeupdate:", savedTimeRef.current);
    };

    const handlePlay = () => {
      savedTimeRef.current = audio.currentTime;
      console.log("Saved audio time on play:", savedTimeRef.current);
    };

    const handlePause = () => {
      savedTimeRef.current = audio.currentTime;
      console.log("Saved audio time on pause:", savedTimeRef.current);
    };

    // Save time before page unload/navigation
    const handleBeforeUnload = () => {
      savedTimeRef.current = audio.currentTime;
      console.log("Saved audio time before unload:", savedTimeRef.current);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Autoplay immediately on app load only once
  useEffect(() => {
    if (hasInitialized.current) return;

    const audio = audioRef.current;
    if (!audio) return;

    hasInitialized.current = true;
    let unmuteTimer;

    const attemptPlay = async () => {
      audio.muted = false;
      try {
        await audio.play();
        setIsPlaying(true);
        setIsVisible(true);
      } catch (err) {
        audio.muted = true;
        try {
          await audio.play();
          setIsPlaying(true);
          unmuteTimer = window.setTimeout(() => {
            audio.muted = false;
          }, 100);
          setIsVisible(true);
        } catch (err2) {
          setIsVisible(true);
        }
      }
    };

    // Small delay to ensure audio element is ready
    setTimeout(attemptPlay, 100);

    return () => {
      if (unmuteTimer) window.clearTimeout(unmuteTimer);
    };
  }, []);

  // Ensure audio keeps playing when navigating pages
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInitialized.current) return;

    // Save time immediately before checking pathname change
    savedTimeRef.current = audio.currentTime;

    console.log("Page changed to:", pathname, "Audio paused?", audio.paused, "Saved time:", savedTimeRef.current);

    // Delay to let page transition complete
    const timeout = setTimeout(() => {
      if (audio.paused) {
        console.log("Attempting to resume audio, currentTime:", audio.currentTime, "savedTime:", savedTimeRef.current);
        
        // Restore the saved time if audio was reset to 0
        if (audio.currentTime === 0 && savedTimeRef.current > 0) {
          audio.currentTime = savedTimeRef.current;
          console.log("Restored audio time to:", savedTimeRef.current);
        }
        
        audio.muted = false;
        audio.play().then(() => {
          console.log("Audio resumed successfully, playing:", !audio.paused, "at time:", audio.currentTime);
          setIsPlaying(true);
        }).catch((err) => {
          console.log("Failed to resume audio:", err);
        });
      } else {
        console.log("Audio is already playing");
      }
    }, 50);

    // Also handle visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && audio.paused) {
        console.log("Page became visible, resuming audio");
        audio.muted = false;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

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
        loop
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
