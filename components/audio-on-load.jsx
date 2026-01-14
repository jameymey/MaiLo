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

  // Try to autoplay on the home page with graceful fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (pathname !== "/") return;

    let cleanup = () => {};

    const attemptPlay = async () => {
      try {
        audio.muted = false;
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay likely blocked; resume on first user interaction
        const resume = () => {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {});
        };
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
        cleanup = () => {
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
        };
      }
    };

    attemptPlay();
    return () => cleanup();
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
