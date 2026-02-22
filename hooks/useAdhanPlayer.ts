"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// Adhan Audio Player Hook
// Handles auto-trigger at prayer time + manual play/stop
// ============================================================

const ADHAN_AUDIO_URL =
    "https://archive.org/download/adhan.notifications/Mishary_Rashid_al_Afasy_Fajr_Adhan.ogg";

interface UseAdhanPlayerOptions {
    /** Prayer timings object: { Fajr: "04:39", Dhuhr: "12:06", ... } */
    timings: Record<string, string> | null;
    /** Per-prayer alert toggles: { Fajr: true, Dhuhr: false, ... } */
    alerts: Record<string, boolean>;
}

interface UseAdhanPlayerReturn {
    /** Whether adhan is currently playing */
    isPlaying: boolean;
    /** Which prayer triggered the current playback (null if not playing) */
    playingPrayer: string | null;
    /** Toggle play/stop for a specific prayer */
    toggleAdhan: (prayerName: string) => void;
    /** Stop any currently playing adhan */
    stopAdhan: () => void;
}

export function useAdhanPlayer({
    timings,
    alerts,
}: UseAdhanPlayerOptions): UseAdhanPlayerReturn {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingPrayer, setPlayingPrayer] = useState<string | null>(null);

    // Track which prayers already auto-triggered today (prevents repeat on refresh)
    const [triggeredToday, setTriggeredToday] = useState<Record<string, string>>({}); // { "2026-02-22": "Fajr,Maghrib" }

    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem("adhan_triggered");
        if (saved) {
            try { setTriggeredToday(JSON.parse(saved)); } catch { /* ignore */ }
        }
    }, []);

    const markAsTriggered = (dateStr: string, prayer: string) => {
        setTriggeredToday(prev => {
            const current = prev[dateStr] ? prev[dateStr].split(",") : [];
            if (current.includes(prayer)) return prev;
            const updated = { ...prev, [dateStr]: [...current, prayer].join(",") };
            localStorage.setItem("adhan_triggered", JSON.stringify(updated));
            return updated;
        });
    };

    // ── Initialize Audio element (singleton) ──────────────────
    useEffect(() => {
        if (typeof window === "undefined") return;

        const audio = new Audio(ADHAN_AUDIO_URL);
        audio.preload = "none"; // Don't preload until needed
        audio.volume = 1.0;

        // When audio ends, reset state
        audio.addEventListener("ended", () => {
            setIsPlaying(false);
            setPlayingPrayer(null);
        });

        // Handle errors gracefully
        audio.addEventListener("error", () => {
            console.error("[useAdhanPlayer] Audio failed to load");
            setIsPlaying(false);
            setPlayingPrayer(null);
        });

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
            audioRef.current = null;
        };
    }, []);

    // ── Play adhan ────────────────────────────────────────────
    const playAdhan = useCallback((prayerName: string) => {
        const audio = audioRef.current;
        if (!audio) return;

        // Reset if already playing something else
        audio.pause();
        audio.currentTime = 0;

        // Set source fresh (in case previous playback errored)
        if (!audio.src || audio.src === "") {
            audio.src = ADHAN_AUDIO_URL;
        }

        setPlayingPrayer(prayerName);
        setIsPlaying(true);

        audio.play().catch((err) => {
            // Browser may block autoplay without user interaction
            console.warn("[useAdhanPlayer] Autoplay blocked:", err.message);
            setIsPlaying(false);
            setPlayingPrayer(null);
        });
    }, []);

    // ── Stop adhan ────────────────────────────────────────────
    const stopAdhan = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setPlayingPrayer(null);
    }, []);

    // ── Toggle play/stop for a specific prayer ────────────────
    const toggleAdhan = useCallback(
        (prayerName: string) => {
            if (isPlaying && playingPrayer === prayerName) {
                stopAdhan();
            } else {
                playAdhan(prayerName);
            }
        },
        [isPlaying, playingPrayer, playAdhan, stopAdhan],
    );

    // ── Auto-trigger: check every second ──────────────────────
    useEffect(() => {
        if (!timings) return;

        const interval = setInterval(() => {
            const now = new Date();
            const nowDateKey = now.toDateString();
            const nowTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

            const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const alreadyTriggered = triggeredToday[nowDateKey]?.split(",") || [];

            for (const p of prayers) {
                const prayerTime = timings[p];
                if (!prayerTime) continue;

                // Robust parsing for "HH:MM" or "HH:MM (WIB)"
                const prayerHHMM = prayerTime.match(/\d{2}:\d{2}/)?.[0];
                if (!prayerHHMM) continue;

                if (
                    prayerHHMM === nowTime &&
                    alerts[p] &&
                    !alreadyTriggered.includes(p) &&
                    !isPlaying
                ) {
                    markAsTriggered(nowDateKey, p);
                    playAdhan(p);
                    break;
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timings, alerts, isPlaying, playAdhan, triggeredToday]);

    return { isPlaying, playingPrayer, toggleAdhan, stopAdhan };
}
