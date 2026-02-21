"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface LastReadData {
    id: number;
    name: string;
    ayah: number;
    location: string;
    progress: number;
}

export default function LastReadCard() {
    const [data, setData] = useState<LastReadData | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const saved = localStorage.getItem("last_read");
        if (saved) {
            setData(JSON.parse(saved));
        }
    }, []);

    const surahName = data?.name || "Surah Al-Kahf";
    const ayahNumber = data?.ayah || 10;
    const location = data?.location || "Meccan";
    const surahId = data?.id || 18;

    return (
        <Link href={`/surah/${surahId}`} style={{ textDecoration: 'none' }}>
            <div style={{
                margin: '0 20px 28px',
                padding: '24px',
                borderRadius: 20,
                background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute', top: -40, right: -20, width: 160, height: 160,
                    background: 'rgba(255,255,255,0.08)', borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', bottom: -30, right: '30%', width: 100, height: 100,
                    background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
                }} />

                {/* Play Button */}
                <div style={{
                    position: 'absolute', right: 24, top: 24, width: 40, height: 40,
                    borderRadius: '50%', background: '#1ED760',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(30,215,96,0.4)',
                }}>
                    <Play size={18} fill="white" color="white" />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                        background: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700,
                        letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16,
                    }}>
                        {t.lastRead}
                    </div>

                    <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>{surahName}</h2>
                    <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 24 }}>{t.ayat} {ayahNumber} • {location}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>{t.continueReading}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
