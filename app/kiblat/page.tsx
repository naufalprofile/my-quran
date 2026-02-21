"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Navigation, RefreshCw } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRad(deg: number) { return deg * (Math.PI / 180); }
function toDeg(rad: number) { return rad * (180 / Math.PI); }

function calculateQibla(lat: number, lng: number): number {
    const phiK = toRad(KAABA_LAT);
    const lambdaK = toRad(KAABA_LNG);
    const phi = toRad(lat);
    const lambda = toRad(lng);
    const qibla = toDeg(
        Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
        )
    );
    return (qibla + 360) % 360;
}

export default function KiblatPage() {
    const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState(0);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationName, setLocationName] = useState("Mencari lokasi...");
    const [error, setError] = useState<string | null>(null);
    const [hasCompass, setHasCompass] = useState(false);

    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor, subtleBg } = useThemeColors();
    const { t } = useLanguage();

    const getLocation = useCallback(() => {
        setError(null);
        setLocationName("Mencari lokasi...");
        if (!navigator.geolocation) { setError("Geolocation tidak didukung di browser ini."); return; }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                const angle = calculateQibla(latitude, longitude);
                setQiblaAngle(angle);
                try {
                    const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=20`);
                    const data = await res.json();
                    if (data.code === 200) { setLocationName(data.data.meta.timezone?.replace("/", ", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`); }
                } catch { setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`); }
            },
            () => {
                setError("Izin lokasi ditolak. Aktifkan GPS untuk menentukan arah kiblat.");
                const lat = -6.2088, lng = 106.8456;
                setLocation({ lat, lng }); setQiblaAngle(calculateQibla(lat, lng)); setLocationName("Jakarta (Fallback)");
            },
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => { getLocation(); }, [getLocation]);

    useEffect(() => {
        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.alpha !== null) {
                setHasCompass(true);
                if ('webkitCompassHeading' in e) { setCompassHeading((e as any).webkitCompassHeading); }
                else { setCompassHeading(360 - e.alpha); }
            }
        };
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((state: string) => { if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation, true); })
                .catch(() => { });
        } else { window.addEventListener('deviceorientation', handleOrientation, true); }
        return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }, []);

    const needleRotation = qiblaAngle !== null ? qiblaAngle - compassHeading : 0;

    return (
        <div style={{ paddingTop: 16, paddingBottom: 100, minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 24 }}>
                <Link href="/" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: subtleBg, textDecoration: 'none' }}>
                    <ArrowLeft size={22} color={textMain} />
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{t.qiblaDirection}</h1>
                <button onClick={getLocation} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: subtleBg, border: 'none', cursor: 'pointer' }}>
                    <RefreshCw size={18} color={textMuted} />
                </button>
            </div>

            {/* Location Info */}
            <div style={{
                margin: '0 20px 24px', padding: '14px 18px', borderRadius: 16,
                background: bgCard, border: `1px solid ${borderColor}`,
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.3s',
            }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: isDark ? '#1A2F26' : '#E6F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={20} color="#008D63" />
                </div>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.yourLocation}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: textMain }}>{locationName}</p>
                </div>
                {qiblaAngle !== null && (
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: textMuted }}>{t.bearing}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#008D63' }}>{qiblaAngle.toFixed(1)}°</p>
                    </div>
                )}
            </div>

            {error && (
                <div style={{
                    margin: '0 20px 20px', padding: '14px 18px', borderRadius: 14,
                    background: isDark ? '#3B1111' : '#FEF2F2', border: `1px solid ${isDark ? '#7F1D1D' : '#FECACA'}`, color: '#DC2626',
                    fontSize: 13, fontWeight: 500, lineHeight: 1.5,
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Compass */}
            <div style={{
                margin: '0 20px', padding: '32px 20px', borderRadius: 28,
                background: isDark ? 'linear-gradient(180deg, #1A2F26 0%, #1A1F25 100%)' : 'linear-gradient(180deg, #E6F3EF 0%, #FFFFFF 100%)',
                border: `1px solid ${isDark ? '#2D5940' : '#E6F3EF'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s',
            }}>
                <div style={{ position: 'relative', width: 260, height: 260, marginBottom: 20 }}>
                    <svg width="260" height="260" style={{
                        transform: hasCompass ? `rotate(${-compassHeading}deg)` : 'none',
                        transition: 'transform 0.3s ease',
                    }}>
                        <circle cx="130" cy="130" r="125" fill="none" stroke={isDark ? '#2D5940' : '#B2DFCF'} strokeWidth="1" />
                        <circle cx="130" cy="130" r="115" fill="none" stroke={isDark ? '#2D3748' : '#E6F3EF'} strokeWidth="1" />
                        {Array.from({ length: 72 }).map((_, i) => {
                            const angle = (i * 5) * (Math.PI / 180);
                            const isMajor = i % 9 === 0;
                            const isCardinal = i % 18 === 0;
                            const innerR = isCardinal ? 100 : isMajor ? 105 : 110;
                            const outerR = 120;
                            return (
                                <line key={i}
                                    x1={130 + innerR * Math.cos(angle - Math.PI / 2)} y1={130 + innerR * Math.sin(angle - Math.PI / 2)}
                                    x2={130 + outerR * Math.cos(angle - Math.PI / 2)} y2={130 + outerR * Math.sin(angle - Math.PI / 2)}
                                    stroke={isCardinal ? "#008D63" : isMajor ? (isDark ? '#9CA3AF' : '#6C7278') : (isDark ? '#4A5568' : '#C8CDD3')}
                                    strokeWidth={isCardinal ? 2.5 : isMajor ? 1.5 : 0.8}
                                />
                            );
                        })}
                        <text x="130" y="38" textAnchor="middle" fill="#DC2626" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">N</text>
                        <text x="225" y="135" textAnchor="middle" fill={textMain} fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">E</text>
                        <text x="130" y="230" textAnchor="middle" fill={textMain} fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">S</text>
                        <text x="35" y="135" textAnchor="middle" fill={textMain} fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">W</text>
                    </svg>

                    {qiblaAngle !== null && (
                        <div style={{ position: 'absolute', inset: 0, transform: `rotate(${needleRotation}deg)`, transition: 'transform 0.3s ease' }}>
                            <svg width="260" height="260" viewBox="0 0 260 260">
                                <polygon points="130,25 122,90 130,80 138,90" fill="#008D63" />
                                <polygon points="130,235 122,170 130,180 138,170" fill={isDark ? '#4A5568' : '#C8CDD3'} opacity="0.4" />
                                <rect x="122" y="15" width="16" height="16" rx="3" fill={isDark ? '#E8ECEF' : '#1A1F25'} stroke="#FFD700" strokeWidth="1.5" />
                                <text x="130" y="27" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">🕋</text>
                            </svg>
                        </div>
                    )}

                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 60, height: 60, borderRadius: '50%', background: bgCard,
                        boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,141,99,0.12)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Navigation size={18} color="#008D63" style={{ transform: 'rotate(45deg)' }} />
                        <span style={{ fontSize: 8, fontWeight: 700, color: '#008D63', marginTop: 2 }}>KIBLAT</span>
                    </div>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 20, background: isDark ? '#E8ECEF' : '#1A1F25',
                    color: isDark ? '#1A1F25' : 'white', fontSize: 13, fontWeight: 700,
                }}>
                    🕋 Arah Ka&apos;bah - Makkah
                </div>

                <p style={{ fontSize: 12, color: textMuted, textAlign: 'center', marginTop: 16, lineHeight: 1.6, maxWidth: 260 }}>
                    {hasCompass
                        ? t.compassInstruction
                        : t.noCompass + " " + (qiblaAngle?.toFixed(1) || "–") + "° "
                    }
                </p>
            </div>

            {/* Qibla Info */}
            <div style={{ margin: '20px', padding: '20px', borderRadius: 20, background: bgCard, border: `1px solid ${borderColor}`, transition: 'all 0.3s' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: textMain, marginBottom: 12 }}>{t.qiblaInfo}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: textMuted }}>{t.fromNorth}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{qiblaAngle?.toFixed(2) || "–"}°</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: textMuted }}>Latitude Anda</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{location?.lat.toFixed(6) || "–"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: textMuted }}>Longitude Anda</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: textMain }}>{location?.lng.toFixed(6) || "–"}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: textMuted }}>{t.destination}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#008D63' }}>Ka&apos;bah, Makkah</span>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
