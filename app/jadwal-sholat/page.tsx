"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Bell, BellOff, Volume2, VolumeX, MapPin, CheckCircle } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { useAdhanPlayer } from "@/hooks/useAdhanPlayer";

// ── Prayer name map (API key → translation key) ──────────────
const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function getPrayerDisplayName(apiKey: string, t: ReturnType<typeof import("@/components/LanguageProvider").useLanguage>["t"]): string {
    const map: Record<string, string> = {
        Fajr: t.fajr, Dhuhr: t.dhuhr, Asr: t.asr, Maghrib: t.maghrib, Isha: t.isha,
    };
    return map[apiKey] || apiKey;
}

// ── Persist alert preferences ─────────────────────────────────
function loadAlertPrefs(): Record<string, boolean> {
    if (typeof window === "undefined") return { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
    try {
        const saved = localStorage.getItem("prayer_alerts");
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
}

function saveAlertPrefs(alerts: Record<string, boolean>) {
    try { localStorage.setItem("prayer_alerts", JSON.stringify(alerts)); } catch { /* ignore */ }
}

export default function PrayerTimesPage() {
    const [timings, setTimings] = useState<Record<string, string> | null>(null);
    const [location, setLocation] = useState("Jakarta, Indonesia");
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diff: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<Record<string, boolean>>(loadAlertPrefs);
    const [globalAlert, setGlobalAlert] = useState(true);

    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor, subtleBg } = useThemeColors();
    const { t } = useLanguage();

    // ── Adhan player hook ─────────────────────────────────────
    const { isPlaying, playingPrayer, toggleAdhan, stopAdhan } = useAdhanPlayer({
        timings,
        alerts: globalAlert ? alerts : { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false },
    });

    // ── Fetch prayer timings ──────────────────────────────────
    const fetchTimings = useCallback(async (lat: number, lon: number) => {
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${lat}&longitude=${lon}&method=20`);
            const data = await res.json();
            if (data.code === 200) { setTimings(data.data.timings); setLocation(data.data.meta.timezone?.replace("/", ", ") || "Jakarta, Indonesia"); }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchTimings(pos.coords.latitude, pos.coords.longitude),
                () => { fetchTimings(-6.2088, 106.8456); setLocation("Jakarta (Fallback)"); },
            );
        } else { fetchTimings(-6.2088, 106.8456); }
    }, [fetchTimings]);

    // ── Next prayer countdown ─────────────────────────────────
    useEffect(() => {
        if (!timings) return;
        const interval = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let found = false;
            for (const p of PRAYER_KEYS) {
                const timeStr = timings[p]?.match(/\d{2}:\d{2}/)?.[0];
                if (!timeStr) continue;

                const [h, m] = timeStr.split(":").map(Number);
                const pDate = new Date(now);
                pDate.setHours(h, m, 0, 0);

                if (pDate > now) {
                    const diff = pDate.getTime() - now.getTime();
                    const hrs = Math.floor(diff / 3600000);
                    const mins = Math.floor((diff % 3600000) / 60000);
                    const secs = Math.floor((diff % 60000) / 1000);
                    setNextPrayer({
                        name: p,
                        time: timings[p],
                        diff: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                    });
                    found = true;
                    break;
                }
            }

            // If no prayer found today, countdown to tomorrow's Fajr
            if (!found) {
                const timeStr = timings.Fajr?.match(/\d{2}:\d{2}/)?.[0];
                if (timeStr) {
                    const [h, m] = timeStr.split(":").map(Number);
                    const pDate = new Date(tomorrow);
                    pDate.setHours(h, m, 0, 0);

                    const diff = pDate.getTime() - now.getTime();
                    const hrs = Math.floor(diff / 3600000);
                    const mins = Math.floor((diff % 3600000) / 60000);
                    const secs = Math.floor((diff % 60000) / 1000);
                    setNextPrayer({
                        name: "Fajr",
                        time: timings.Fajr,
                        diff: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
                    });
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timings]);

    // ── Toggle individual alert ───────────────────────────────
    const toggleAlert = (prayerName: string) => {
        setAlerts(prev => {
            const next = { ...prev, [prayerName]: !prev[prayerName] };
            saveAlertPrefs(next);
            // Stop adhan if we're disabling an actively playing prayer
            if (isPlaying && playingPrayer === prayerName && prev[prayerName]) {
                stopAdhan();
            }
            return next;
        });
    };

    // ── Toggle global alert ───────────────────────────────────
    const toggleGlobalAlert = () => {
        const next = !globalAlert;
        setGlobalAlert(next);
        if (!next && isPlaying) stopAdhan();
    };

    // ── Check if prayer is currently happening (within ±1 min)
    const isPrayerNow = (prayerKey: string): boolean => {
        if (!timings) return false;
        const now = new Date();
        const timeStr = timings[prayerKey]?.match(/\d{2}:\d{2}/)?.[0];
        if (!timeStr) return false;
        const [h, m] = timeStr.split(":").map(Number);
        const pDate = new Date(now);
        pDate.setHours(h, m, 0, 0);
        const diff = Math.abs(now.getTime() - pDate.getTime());
        return diff < 60000; // within 1 minute
    };

    return (
        <div style={{ paddingTop: 16, paddingBottom: 100, minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Pulsing animation for playing state */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes adhanPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                @keyframes adhanGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0,141,99,0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(0,141,99,0); }
                }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 24 }}>
                <Link href="/" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: subtleBg, textDecoration: 'none' }}>
                    <ArrowLeft size={22} color={textMain} />
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{t.prayerSchedule}</h1>
                <div style={{ width: 40 }} />
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderWidth: 4, borderStyle: 'solid', borderColor: isDark ? '#2D3748' : '#E6F3EF', borderTopColor: '#008D63', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: 14, color: textMuted }}>{t.calculatingPrayer}</p>
                </div>
            ) : (
                <div style={{ padding: '0 20px' }}>
                    {/* Next Prayer Card */}
                    {nextPrayer && (
                        <div style={{
                            padding: 24, borderRadius: 24,
                            background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                            color: 'white', position: 'relative', overflow: 'hidden', marginBottom: 28,
                            boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
                        }}>
                            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.15 }}><Moon size={120} /></div>
                            <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>
                                {getPrayerDisplayName(nextPrayer.name, t)} {t.nextPrayerIn}
                            </p>
                            <h2 style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginBottom: 8, letterSpacing: -1 }}>{nextPrayer.diff}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, opacity: 0.8 }}><MapPin size={14} /> <span>{location}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {globalAlert ? <Bell size={16} /> : <BellOff size={16} />}
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{globalAlert ? t.alertOn : t.alertOff}</span>
                                </div>
                                <button
                                    onClick={toggleGlobalAlert}
                                    style={{
                                        width: 44, height: 24, borderRadius: 12,
                                        background: globalAlert ? '#1ED760' : 'rgba(255,255,255,0.2)',
                                        position: 'relative', cursor: 'pointer', border: 'none',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute', top: 3,
                                        left: globalAlert ? undefined : 3,
                                        right: globalAlert ? 3 : undefined,
                                        width: 18, height: 18, borderRadius: '50%', background: 'white',
                                        transition: 'all 0.2s',
                                    }} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Schedule List */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: textMain }}>{t.schedule}</h3>
                        <span style={{ fontSize: 13, color: textMuted }}>
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {timings && PRAYER_KEYS.map((p) => {
                            const isNext = nextPrayer?.name === p;
                            const isNow = isPrayerNow(p);
                            const isThisPlaying = isPlaying && playingPrayer === p;
                            const alertEnabled = globalAlert && alerts[p];

                            return (
                                <div key={p} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 16px', borderRadius: 16,
                                    background: isThisPlaying
                                        ? (isDark ? '#0D2E1F' : '#E6F3EF')
                                        : isNext
                                            ? (isDark ? '#3D2700' : '#FFF3E0')
                                            : bgCard,
                                    border: isThisPlaying
                                        ? '2px solid #008D63'
                                        : isNext
                                            ? '2px solid #FF9800'
                                            : `1px solid ${borderColor}`,
                                    transition: 'all 0.3s',
                                    animation: isThisPlaying ? 'adhanGlow 2s ease-in-out infinite' : 'none',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: isThisPlaying
                                                ? '#008D63'
                                                : isNext
                                                    ? '#FF9800'
                                                    : (isDark ? '#1A2F26' : '#E6F3EF'),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            animation: isThisPlaying ? 'adhanPulse 1.5s ease-in-out infinite' : 'none',
                                        }}>
                                            {isThisPlaying
                                                ? <Volume2 size={18} color="white" />
                                                : isNext
                                                    ? <CheckCircle size={18} color="white" />
                                                    : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#008D63' }} />
                                            }
                                        </div>
                                        <div>
                                            <h4 style={{
                                                fontSize: 15, fontWeight: 700,
                                                color: isThisPlaying ? '#008D63' : isNext ? '#E65100' : textMain,
                                            }}>
                                                {getPrayerDisplayName(p, t)}
                                            </h4>
                                            <p style={{ fontSize: 12, color: textMuted }}>{timings[p]}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {/* Status badge */}
                                        {isThisPlaying && (
                                            <span style={{
                                                fontSize: 10, fontWeight: 700, color: 'white',
                                                textTransform: 'uppercase',
                                                background: '#008D63',
                                                padding: '2px 8px', borderRadius: 6,
                                                animation: 'adhanPulse 1.5s ease-in-out infinite',
                                            }}>
                                                {t.playing}
                                            </span>
                                        )}
                                        {!isThisPlaying && (isNext || isNow) && (
                                            <span style={{
                                                fontSize: 10, fontWeight: 700, color: '#E65100',
                                                textTransform: 'uppercase',
                                                background: isDark ? '#5C3B00' : '#FFE0B2',
                                                padding: '2px 8px', borderRadius: 6,
                                            }}>
                                                {t.prayerNow}
                                            </span>
                                        )}

                                        {/* Play/Stop button */}
                                        <button
                                            onClick={() => toggleAdhan(p)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                            title={isThisPlaying ? "Stop Adhan" : "Play Adhan"}
                                        >
                                            {isThisPlaying
                                                ? <VolumeX size={18} color="#008D63" />
                                                : alertEnabled
                                                    ? <Volume2 size={18} color={isNext ? '#E65100' : '#008D63'} />
                                                    : <BellOff size={18} color={textMuted} />
                                            }
                                        </button>

                                        {/* Alert toggle */}
                                        <button
                                            onClick={() => toggleAlert(p)}
                                            style={{
                                                width: 32, height: 18, borderRadius: 9,
                                                background: alertEnabled ? '#008D63' : (isDark ? '#374151' : '#D1D5DB'),
                                                position: 'relative', cursor: 'pointer', border: 'none',
                                                transition: 'background 0.2s', flexShrink: 0,
                                            }}
                                            title={alertEnabled ? t.alertOn : t.alertOff}
                                        >
                                            <div style={{
                                                position: 'absolute', top: 2,
                                                left: alertEnabled ? undefined : 2,
                                                right: alertEnabled ? 2 : undefined,
                                                width: 14, height: 14, borderRadius: '50%', background: 'white',
                                                transition: 'all 0.2s',
                                            }} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
