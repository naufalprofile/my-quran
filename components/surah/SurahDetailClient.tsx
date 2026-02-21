"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Trophy, Play, Pause, Type, Languages } from "lucide-react";
import AyatCard from "./AyatCard";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio?: Record<string, string>;
}

interface SurahData {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    ayat: Ayat[];
    audioFull?: Record<string, string>;
}

const ARABIC_SIZES = [
    { label: "Kecil", size: 22 },
    { label: "Sedang", size: 28 },
    { label: "Besar", size: 36 },
];

const TRANSLATION_MODES = [
    { label: "Arab + Terjemah", showTranslation: true, showLatin: false },
    { label: "Arab + Latin + Terjemah", showTranslation: true, showLatin: true },
    { label: "Arab + Latin", showTranslation: false, showLatin: true },
    { label: "Arab Saja", showTranslation: false, showLatin: false },
];

export default function SurahDetailClient({ surah }: { surah: SurahData }) {
    const [isRead, setIsRead] = useState(false);
    const [showAward, setShowAward] = useState(false);
    const [isPlayingFull, setIsPlayingFull] = useState(false);
    const fullAudioRef = useRef<HTMLAudioElement | null>(null);
    const [arabicSizeIndex, setArabicSizeIndex] = useState(1);
    const [translationModeIndex, setTranslationModeIndex] = useState(0);
    const [showTextPopup, setShowTextPopup] = useState<"tt" | "arabic" | null>(null);

    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor } = useThemeColors();
    const { t } = useLanguage();

    useEffect(() => {
        const readSurahs = JSON.parse(localStorage.getItem("read_surahs") || "[]");
        if (readSurahs.includes(surah.nomor)) setIsRead(true);
        localStorage.setItem("last_read", JSON.stringify({
            id: surah.nomor, name: surah.namaLatin, ayah: 1,
            location: surah.tempatTurun,
            progress: Math.round((surah.nomor / 114) * 100),
        }));
        const savedArabicSize = localStorage.getItem("arabic_size_index");
        if (savedArabicSize) setArabicSizeIndex(parseInt(savedArabicSize));
        const savedTransMode = localStorage.getItem("translation_mode_index");
        if (savedTransMode) setTranslationModeIndex(parseInt(savedTransMode));
        if (surah.audioFull?.["05"]) {
            fullAudioRef.current = new Audio(surah.audioFull["05"]);
            fullAudioRef.current.addEventListener("ended", () => setIsPlayingFull(false));
        }
        return () => { if (fullAudioRef.current) { fullAudioRef.current.pause(); fullAudioRef.current = null; } };
    }, [surah]);

    const toggleFullAudio = () => {
        if (!fullAudioRef.current) return;
        if (isPlayingFull) { fullAudioRef.current.pause(); setIsPlayingFull(false); }
        else { fullAudioRef.current.play().catch(console.error); setIsPlayingFull(true); }
    };

    const toggleMarkAsRead = () => {
        const readSurahs = JSON.parse(localStorage.getItem("read_surahs") || "[]");
        let newReadSurahs;
        if (isRead) { newReadSurahs = readSurahs.filter((id: number) => id !== surah.nomor); setIsRead(false); }
        else { newReadSurahs = [...readSurahs, surah.nomor]; setIsRead(true); if (newReadSurahs.length === 114) setShowAward(true); }
        localStorage.setItem("read_surahs", JSON.stringify(newReadSurahs));
    };

    const cycleTranslationMode = () => {
        const next = (translationModeIndex + 1) % TRANSLATION_MODES.length;
        setTranslationModeIndex(next);
        localStorage.setItem("translation_mode_index", next.toString());
        setShowTextPopup("tt");
        setTimeout(() => setShowTextPopup(null), 1500);
    };

    const cycleArabicSize = () => {
        const next = (arabicSizeIndex + 1) % ARABIC_SIZES.length;
        setArabicSizeIndex(next);
        localStorage.setItem("arabic_size_index", next.toString());
        setShowTextPopup("arabic");
        setTimeout(() => setShowTextPopup(null), 1500);
    };

    const currentMode = TRANSLATION_MODES[translationModeIndex];
    const currentArabicSize = ARABIC_SIZES[arabicSizeIndex];

    return (
        <div style={{ minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Sticky Header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 40,
                background: isDark ? 'rgba(15,20,25,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`,
                padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.3s',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/" style={{
                        width: 40, height: 40, borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', background: isDark ? '#2D3748' : '#F7F9FB', textDecoration: 'none',
                    }}>
                        <ArrowLeft size={22} color={textMain} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 700, color: textMain }}>{surah.namaLatin}</h1>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#008D63', textTransform: 'uppercase', letterSpacing: 1 }}>{surah.arti}</p>
                    </div>
                </div>
                {/* Prev / Next Surah */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {surah.nomor > 1 ? (
                        <Link href={`/surah/${surah.nomor - 1}`} style={{
                            width: 36, height: 36, borderRadius: '50%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: isDark ? '#2D3748' : '#F0F2F5', textDecoration: 'none',
                            transition: 'all 0.2s',
                        }}>
                            <ChevronLeft size={20} color={textMain} />
                        </Link>
                    ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#1A1F25' : '#F7F9FB', opacity: 0.4 }}>
                            <ChevronLeft size={20} color={textMuted} />
                        </div>
                    )}
                    {surah.nomor < 114 ? (
                        <Link href={`/surah/${surah.nomor + 1}`} style={{
                            width: 36, height: 36, borderRadius: '50%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: isDark ? '#2D3748' : '#F0F2F5', textDecoration: 'none',
                            transition: 'all 0.2s',
                        }}>
                            <ChevronRight size={20} color={textMain} />
                        </Link>
                    ) : (
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#1A1F25' : '#F7F9FB', opacity: 0.4 }}>
                            <ChevronRight size={20} color={textMuted} />
                        </div>
                    )}
                </div>
            </div>

            {/* Surah Info Card */}
            <div style={{
                margin: '20px', padding: '28px 24px', borderRadius: 24,
                background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
            }}>
                <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.08, fontSize: 100 }} className="font-arabic">{surah.nama}</div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, position: 'relative' }}>{surah.namaLatin}</h2>
                <p style={{ opacity: 0.8, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 12, display: 'inline-block', paddingLeft: 32, paddingRight: 32 }}>{surah.arti}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                    <span>{surah.tempatTurun}</span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span>{surah.jumlahAyat} Ayat</span>
                </div>
            </div>

            {/* Bismillah */}
            {surah.nomor !== 9 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p className="font-arabic" style={{ fontSize: currentArabicSize.size, color: textMain, transition: 'font-size 0.2s' }}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                </div>
            )}

            {/* Ayats */}
            <div style={{
                background: bgCard, borderRadius: '32px 32px 0 0',
                boxShadow: isDark ? '0 -4px 20px rgba(0,0,0,0.2)' : '0 -4px 20px rgba(0,0,0,0.05)',
                overflow: 'hidden', transition: 'all 0.3s',
            }}>
                {surah.ayat.map((a) => (
                    <AyatCard
                        key={a.nomorAyat}
                        number={a.nomorAyat}
                        arabic={a.teksArab}
                        latin={a.teksLatin}
                        translation={a.teksIndonesia}
                        audioUrl={a.audio?.["05"]}
                        showTranslation={currentMode.showTranslation}
                        showLatin={currentMode.showLatin}
                        arabicFontSize={currentArabicSize.size}
                    />
                ))}
            </div>

            {/* Toast popup */}
            {showTextPopup && (
                <div style={{
                    position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
                    padding: '10px 20px', borderRadius: 20, background: isDark ? '#2D3748' : '#1A1F25', color: 'white',
                    fontSize: 13, fontWeight: 600, zIndex: 60, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
                }}>
                    {showTextPopup === "tt" ? (
                        <><Type size={14} /> {currentMode.label}</>
                    ) : (
                        <><span className="font-arabic" style={{ fontSize: 14 }}>عربي</span> {currentArabicSize.label} ({currentArabicSize.size}px)</>
                    )}
                </div>
            )}

            {/* Bottom Action Bar */}
            <div style={{
                position: 'sticky', bottom: 0,
                background: isDark ? 'rgba(15,20,25,0.95)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                padding: '10px 16px', borderTop: `1px solid ${borderColor}`,
                display: 'flex', alignItems: 'center', gap: 8, zIndex: 30,
                transition: 'all 0.3s',
            }}>
                <button onClick={toggleMarkAsRead} title={isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"} style={{
                    width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer',
                    background: isRead ? (isDark ? '#1A2F26' : '#E6F3EF') : (isDark ? '#2D3748' : '#F7F9FB'),
                    color: isRead ? '#008D63' : textMuted,
                    transition: 'all 0.2s',
                }}>
                    <CheckCircle2 size={20} />
                </button>

                <button onClick={cycleTranslationMode} title={`Mode: ${currentMode.label}`} style={{
                    height: 42, padding: '0 14px', borderRadius: 12,
                    background: (currentMode.showTranslation || currentMode.showLatin) ? (isDark ? '#1A2F26' : '#E6F3EF') : (isDark ? '#2D3748' : '#F7F9FB'),
                    border: (currentMode.showTranslation || currentMode.showLatin) ? '2px solid #008D63' : '2px solid transparent',
                    fontSize: 15, fontWeight: 700,
                    color: (currentMode.showTranslation || currentMode.showLatin) ? '#008D63' : textMuted,
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <Type size={15} /> Tt
                </button>

                <button onClick={cycleArabicSize} title={`Ukuran Arab: ${currentArabicSize.label}`} style={{
                    height: 42, padding: '0 14px', borderRadius: 12,
                    background: arabicSizeIndex !== 1 ? (isDark ? '#3D2700' : '#FFF3E0') : (isDark ? '#2D3748' : '#F7F9FB'),
                    border: arabicSizeIndex !== 1 ? '2px solid #E65100' : '2px solid transparent',
                    fontSize: 15, fontWeight: 700,
                    color: arabicSizeIndex !== 1 ? '#E65100' : textMuted,
                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4,
                }} className="font-arabic">
                    عربي
                </button>

                <div style={{ flex: 1 }} />

                <button onClick={toggleFullAudio} style={{
                    width: 46, height: 46, borderRadius: '50%', background: '#008D63',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,141,99,0.4)',
                }}>
                    {isPlayingFull ? <Pause size={20} color="white" fill="white" /> : <Play size={20} color="white" fill="white" />}
                </button>
            </div>

            {/* Award Modal */}
            {showAward && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
                }}>
                    <div style={{
                        background: bgCard, borderRadius: 28, padding: 32, width: '100%', maxWidth: 340, textAlign: 'center',
                    }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%', background: isDark ? '#1A2F26' : '#E6F3EF', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                        }}>
                            <Trophy size={40} color="#008D63" />
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: textMain, marginBottom: 8 }}>{t.awardKhatam}</h3>
                        <p style={{ fontSize: 14, color: textMuted, marginBottom: 24, lineHeight: 1.6 }}>
                            {t.awardKhatamDesc}
                        </p>
                        <button onClick={() => setShowAward(false)} style={{
                            width: '100%', height: 48, background: '#008D63', color: 'white', borderRadius: 14,
                            fontWeight: 700, border: 'none', cursor: 'pointer',
                        }}>
                            {t.thankYou}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
