"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Trophy, Play, Pause } from "lucide-react";
import AyatCard from "./AyatCard";

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

export default function SurahDetailClient({ surah }: { surah: SurahData }) {
    const [isRead, setIsRead] = useState(false);
    const [showAward, setShowAward] = useState(false);
    const [isPlayingFull, setIsPlayingFull] = useState(false);
    const fullAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const readSurahs = JSON.parse(localStorage.getItem("read_surahs") || "[]");
        if (readSurahs.includes(surah.nomor)) setIsRead(true);

        localStorage.setItem("last_read", JSON.stringify({
            id: surah.nomor, name: surah.namaLatin, ayah: 1,
            location: surah.tempatTurun,
            progress: Math.round((surah.nomor / 114) * 100),
        }));

        // Setup full audio
        if (surah.audioFull?.["05"]) {
            fullAudioRef.current = new Audio(surah.audioFull["05"]);
            fullAudioRef.current.addEventListener("ended", () => setIsPlayingFull(false));
        }

        return () => {
            if (fullAudioRef.current) {
                fullAudioRef.current.pause();
                fullAudioRef.current = null;
            }
        };
    }, [surah]);

    const toggleFullAudio = () => {
        if (!fullAudioRef.current) return;
        if (isPlayingFull) {
            fullAudioRef.current.pause();
            setIsPlayingFull(false);
        } else {
            fullAudioRef.current.play().catch(console.error);
            setIsPlayingFull(true);
        }
    };

    const toggleMarkAsRead = () => {
        const readSurahs = JSON.parse(localStorage.getItem("read_surahs") || "[]");
        let newReadSurahs;
        if (isRead) {
            newReadSurahs = readSurahs.filter((id: number) => id !== surah.nomor);
            setIsRead(false);
        } else {
            newReadSurahs = [...readSurahs, surah.nomor];
            setIsRead(true);
            if (newReadSurahs.length === 114) setShowAward(true);
        }
        localStorage.setItem("read_surahs", JSON.stringify(newReadSurahs));
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F7F9FB' }}>
            {/* Sticky Header */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)', borderBottom: '1px solid #E8ECEF',
                padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link href="/" style={{
                        width: 40, height: 40, borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', background: '#F7F9FB', textDecoration: 'none',
                    }}>
                        <ArrowLeft size={22} color="#1A1F25" />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1A1F25' }}>{surah.namaLatin}</h1>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#008D63', textTransform: 'uppercase', letterSpacing: 1 }}>{surah.arti}</p>
                    </div>
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
                    <p className="font-arabic" style={{ fontSize: 28, color: '#1A1F25' }}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                </div>
            )}

            {/* Ayats */}
            <div style={{ background: '#FFFFFF', borderRadius: '32px 32px 0 0', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {surah.ayat.map((a) => (
                    <AyatCard
                        key={a.nomorAyat}
                        number={a.nomorAyat}
                        arabic={a.teksArab}
                        latin={a.teksLatin}
                        translation={a.teksIndonesia}
                        audioUrl={a.audio?.["05"]}
                    />
                ))}
            </div>

            {/* Bottom Action Bar */}
            <div style={{
                position: 'sticky', bottom: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                padding: '12px 20px', borderTop: '1px solid #E8ECEF',
                display: 'flex', alignItems: 'center', gap: 12, zIndex: 30,
            }}>
                {/* Mark as Read */}
                <button
                    onClick={toggleMarkAsRead}
                    style={{
                        width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer',
                        background: isRead ? '#E6F3EF' : '#F7F9FB',
                        color: isRead ? '#008D63' : '#6C7278',
                    }}
                >
                    <CheckCircle2 size={22} />
                </button>

                {/* Font size placeholders */}
                <button style={{ height: 44, padding: '0 16px', borderRadius: 12, background: '#F7F9FB', border: 'none', fontSize: 16, fontWeight: 700, color: '#1A1F25', cursor: 'pointer' }}>Tt</button>
                <button style={{ height: 44, padding: '0 16px', borderRadius: 12, background: '#F7F9FB', border: 'none', fontSize: 16, fontWeight: 700, color: '#1A1F25', cursor: 'pointer' }} className="font-arabic">عربي</button>

                <div style={{ flex: 1 }} />

                {/* Full Surah Audio Play */}
                <button onClick={toggleFullAudio} style={{
                    width: 48, height: 48, borderRadius: '50%', background: '#008D63',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,141,99,0.4)',
                }}>
                    {isPlayingFull ? <Pause size={22} color="white" fill="white" /> : <Play size={22} color="white" fill="white" />}
                </button>
            </div>

            {/* Award Modal */}
            {showAward && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
                }}>
                    <div style={{
                        background: '#FFFFFF', borderRadius: 28, padding: 32, width: '100%', maxWidth: 340,
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%', background: '#E6F3EF', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                        }}>
                            <Trophy size={40} color="#008D63" />
                        </div>
                        <h3 style={{ fontSize: 24, fontWeight: 800, color: '#1A1F25', marginBottom: 8 }}>Award Khatam! 🎉</h3>
                        <p style={{ fontSize: 14, color: '#6C7278', marginBottom: 24, lineHeight: 1.6 }}>
                            Alhamdulillah! Selamat Anda telah menyelesaikan bacaan seluruh 114 Surah di Al-Qur&apos;an.
                        </p>
                        <button onClick={() => setShowAward(false)} style={{
                            width: '100%', height: 48, background: '#008D63', color: 'white', borderRadius: 14,
                            fontWeight: 700, border: 'none', cursor: 'pointer',
                        }}>
                            Terima Kasih
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
