"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Fingerprint, Settings2, MoreVertical, MapPin, Bell, Volume2, BellOff, Moon, Compass } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";

const TARGETS = [33, 99, 100, 1000];
const DHIKR_LIST = [
    { arabic: "سُبْحَانَ اللّٰهِ", latin: "SubhanAllah", meaning: "Maha Suci Allah" },
    { arabic: "اَلْحَمْدُ لِلّٰهِ", latin: "Alhamdulillah", meaning: "Segala puji bagi Allah" },
    { arabic: "اَللّٰهُ اَكْبَرُ", latin: "AllahuAkbar", meaning: "Allah Maha Besar" },
    { arabic: "أَسْتَغْفِرُ اللّٰهَ", latin: "Astaghfirullah", meaning: "Aku memohon ampun kepada Allah" },
];

export default function TasbihPage() {
    const [count, setCount] = useState(0);
    const [targetIndex, setTargetIndex] = useState(0);
    const [dhikrIndex, setDhikrIndex] = useState(0);
    const [hasVibrated, setHasVibrated] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Prayer times state
    const [timings, setTimings] = useState<Record<string, string> | null>(null);
    const [location, setLocation] = useState("Jakarta, Indonesia");
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diff: string } | null>(null);
    const [alerts, setAlerts] = useState<Record<string, boolean>>({
        Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true,
    });

    // Load tasbih from localStorage
    useEffect(() => {
        const savedCount = localStorage.getItem("tasbih_count");
        if (savedCount) setCount(parseInt(savedCount));
        const savedTarget = localStorage.getItem("tasbih_target_index");
        if (savedTarget) setTargetIndex(parseInt(savedTarget));
        const savedDhikr = localStorage.getItem("tasbih_dhikr_index");
        if (savedDhikr) setDhikrIndex(parseInt(savedDhikr));
    }, []);

    // Save tasbih to localStorage
    useEffect(() => {
        localStorage.setItem("tasbih_count", count.toString());
        localStorage.setItem("tasbih_target_index", targetIndex.toString());
        localStorage.setItem("tasbih_dhikr_index", dhikrIndex.toString());
        if (count > 0 && count % TARGETS[targetIndex] === 0 && !hasVibrated) {
            if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
            setHasVibrated(true);
        } else if (count % TARGETS[targetIndex] !== 0) {
            setHasVibrated(false);
        }
    }, [count, targetIndex, hasVibrated, dhikrIndex]);

    // Fetch prayer times
    const fetchTimings = useCallback(async (lat: number, lon: number) => {
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${lat}&longitude=${lon}&method=20`);
            const data = await res.json();
            if (data.code === 200) {
                setTimings(data.data.timings);
                setLocation(data.data.meta.timezone?.replace("/", ", ") || "Jakarta, Indonesia");
            }
        } catch (err) { console.error(err); }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchTimings(pos.coords.latitude, pos.coords.longitude),
                () => fetchTimings(-6.2088, 106.8456),
            );
        } else { fetchTimings(-6.2088, 106.8456); }
    }, [fetchTimings]);

    // Next prayer countdown
    useEffect(() => {
        if (!timings) return;
        const interval = setInterval(() => {
            const now = new Date();
            const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            for (const p of prayers) {
                const [h, m] = timings[p].split(":").map(Number);
                const pDate = new Date(); pDate.setHours(h, m, 0);
                if (pDate > now) {
                    const diff = pDate.getTime() - now.getTime();
                    const hrs = Math.floor(diff / 3600000);
                    const mins = Math.floor((diff % 3600000) / 60000);
                    const secs = Math.floor((diff % 60000) / 1000);
                    setNextPrayer({ name: p, time: timings[p], diff: `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` });
                    return;
                }
            }
            setNextPrayer({ name: "Fajr", time: timings.Fajr, diff: "--:--:--" });
        }, 1000);
        return () => clearInterval(interval);
    }, [timings]);

    const increment = () => {
        setCount(prev => prev + 1);
        if (window.navigator.vibrate) window.navigator.vibrate(30);
    };

    const reset = () => { if (confirm("Reset counter ke 0?")) setCount(0); };
    const cycleTarget = () => setTargetIndex((prev) => (prev + 1) % TARGETS.length);

    const currentTarget = TARGETS[targetIndex];
    const progress = (count % currentTarget) / currentTarget;
    const circumference = 2 * Math.PI * 90;
    const currentDhikr = DHIKR_LIST[dhikrIndex];

    return (
        <div style={{ paddingTop: 16, paddingBottom: 100, minHeight: '100vh', background: '#F7F9FB' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 20 }}>
                <Link href="/" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F2F5', textDecoration: 'none' }}>
                    <ArrowLeft size={22} color="#1A1F25" />
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1A1F25' }}>Tasbih & Prayers</h1>
                <button onClick={() => setShowSettings(!showSettings)} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <MoreVertical size={22} color="#1A1F25" />
                </button>
            </div>

            {/* ========== TASBIH SECTION ========== */}
            <div style={{
                margin: '0 20px 20px', padding: '28px 20px', borderRadius: 28,
                background: 'linear-gradient(180deg, #E6F3EF 0%, #FFFFFF 100%)',
                border: '1px solid #E6F3EF',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
                {/* Counter Circle - Compass Style */}
                <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 16 }}>
                    {/* Outer decorative ring */}
                    <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
                        {/* Tick marks around the circle */}
                        {Array.from({ length: 60 }).map((_, i) => {
                            const angle = (i * 6) * (Math.PI / 180);
                            const isMajor = i % 5 === 0;
                            const innerR = isMajor ? 88 : 92;
                            const outerR = 96;
                            return (
                                <line
                                    key={i}
                                    x1={100 + innerR * Math.cos(angle)}
                                    y1={100 + innerR * Math.sin(angle)}
                                    x2={100 + outerR * Math.cos(angle)}
                                    y2={100 + outerR * Math.sin(angle)}
                                    stroke={isMajor ? "#008D63" : "#C8E6D8"}
                                    strokeWidth={isMajor ? 2 : 1}
                                />
                            );
                        })}
                    </svg>

                    {/* Progress ring */}
                    <svg width="200" height="200" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                        <circle cx="100" cy="100" r="90" fill="transparent" stroke="#E6F3EF" strokeWidth="6" />
                        <circle
                            cx="100" cy="100" r="90" fill="transparent" stroke="#008D63" strokeWidth="6"
                            strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progress)}
                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                        />
                    </svg>

                    {/* Inner white circle with content */}
                    <div style={{
                        position: 'absolute', top: 20, left: 20, width: 160, height: 160,
                        borderRadius: '50%', background: '#FFFFFF',
                        boxShadow: '0 2px 20px rgba(0,141,99,0.08)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <p style={{ fontSize: 12, color: '#6C7278', fontWeight: 500, marginBottom: 2 }}>{currentDhikr.latin}</p>
                        <span style={{ fontSize: 48, fontWeight: 800, color: '#1A1F25', lineHeight: 1 }}>{count % currentTarget}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                            <span style={{ fontSize: 11, color: '#6C7278', fontWeight: 600 }}>Target: {currentTarget}</span>
                            <button onClick={reset} style={{ width: 18, height: 18, borderRadius: '50%', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                                <RotateCcw size={9} color="#6C7278" />
                            </button>
                        </div>
                    </div>

                    {/* Compass needle decoration at top */}
                    <div style={{
                        position: 'absolute', top: 2, left: '50%', transform: 'translateX(-50%)',
                        width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{ width: 8, height: 8, background: '#008D63', borderRadius: 2, transform: 'rotate(45deg)' }} />
                    </div>
                </div>

                {/* Arabic text of current dhikr */}
                <p className="font-arabic" style={{ fontSize: 20, color: '#008D63', marginBottom: 4, fontWeight: 700 }}>{currentDhikr.arabic}</p>
                <p style={{ fontSize: 11, color: '#6C7278', marginBottom: 16 }}>{currentDhikr.meaning}</p>

                {/* Total count badge */}
                <div style={{ fontSize: 11, color: '#6C7278', background: '#F0F2F5', padding: '4px 12px', borderRadius: 20, fontWeight: 600, marginBottom: 4 }}>
                    Total: {count}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, padding: '0 20px', marginBottom: 24 }}>
                <button onClick={increment} style={{
                    flex: 1, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: '#1A1F25', color: '#FFFFFF', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}>
                    <Fingerprint size={20} /> Tap to Count
                </button>
                <button onClick={cycleTarget} style={{
                    width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#FFFFFF', border: '1px solid #E8ECEF', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                    <Settings2 size={20} color="#008D63" />
                </button>
            </div>

            {/* Dhikr Selector */}
            <div style={{ padding: '0 20px', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1F25', marginBottom: 10 }}>Pilih Dzikir</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {DHIKR_LIST.map((d, i) => (
                        <button
                            key={d.latin}
                            onClick={() => setDhikrIndex(i)}
                            style={{
                                padding: '12px', borderRadius: 14, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                                transition: 'all 0.2s', textAlign: 'left',
                                background: dhikrIndex === i ? '#E6F3EF' : '#FFFFFF',
                                color: dhikrIndex === i ? '#008D63' : '#6C7278',
                                boxShadow: dhikrIndex === i ? '0 0 0 2px #008D63' : '0 0 0 1px #F0F2F5',
                            }}
                        >
                            <span className="font-arabic" style={{ fontSize: 16, display: 'block', marginBottom: 2 }}>{d.arabic}</span>
                            <span style={{ fontSize: 11 }}>{d.latin}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== PRAYER SECTION ========== */}
            <div style={{ padding: '0 20px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1F25' }}>Next Prayer</h3>
                    <span style={{ fontSize: 12, color: '#6C7278', fontWeight: 500 }}>
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>

                {nextPrayer && (
                    <div style={{
                        padding: 20, borderRadius: 20,
                        background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                        color: 'white', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
                    }}>
                        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.12 }}>
                            <Moon size={100} />
                        </div>
                        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>{nextPrayer.name} in</p>
                        <h2 style={{ fontSize: 36, fontWeight: 800, fontVariantNumeric: 'tabular-nums', marginBottom: 8 }}>{nextPrayer.diff}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: 0.8 }}>
                            <MapPin size={14} /> <span>Location: {location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bell size={16} /> <span style={{ fontSize: 12, fontWeight: 600 }}>Alert On</span></div>
                            <div style={{ width: 44, height: 24, borderRadius: 12, background: '#1ED760', position: 'relative', cursor: 'pointer' }}>
                                <div style={{ position: 'absolute', top: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: 'white' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Schedule */}
            {timings && (
                <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A1F25' }}>Schedule</h3>
                        <button style={{ fontSize: 13, color: '#008D63', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>See All</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => {
                            const isNext = nextPrayer?.name === p;
                            return (
                                <div key={p} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 16px', borderRadius: 16,
                                    background: isNext ? '#FFF3E0' : '#FFFFFF',
                                    border: isNext ? '2px solid #FF9800' : '1px solid #F0F2F5',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: isNext ? '#FF9800' : '#E6F3EF',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isNext ? 'white' : '#008D63' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 15, fontWeight: 700, color: isNext ? '#E65100' : '#1A1F25' }}>{p}</h4>
                                            <p style={{ fontSize: 12, color: '#6C7278' }}>{timings[p]}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {isNext && <span style={{ fontSize: 10, fontWeight: 700, color: '#E65100', textTransform: 'uppercase', background: '#FFE0B2', padding: '2px 8px', borderRadius: 6 }}>NOW</span>}
                                        <button onClick={() => setAlerts(prev => ({ ...prev, [p]: !prev[p] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                            {alerts[p] ? <Volume2 size={18} color={isNext ? '#E65100' : '#008D63'} /> : <BellOff size={18} color="#6C7278" />}
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
