"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface ReadSurah {
    id: number;
}

export default function AwardsPage() {
    const [readCount, setReadCount] = useState(0);
    const [readSurahIds, setReadSurahIds] = useState<number[]>([]);

    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor } = useThemeColors();
    const { t } = useLanguage();

    useEffect(() => {
        const readSurahs: number[] = JSON.parse(localStorage.getItem("read_surahs") || "[]");
        setReadSurahIds(readSurahs);
        setReadCount(readSurahs.length);
    }, []);

    const percentage = Math.round((readCount / 114) * 100);

    const achievements = [
        { title: t.achFirstStep, desc: t.achFirstStepDesc, icon: "📖", target: 1, color: "#008D63", bg: "#E6F3EF" },
        { title: t.achFaithful, desc: t.achFaithfulDesc, icon: "⭐", target: 5, color: "#E65100", bg: "#FFF3E0" },
        { title: t.achLover, desc: t.achLoverDesc, icon: "🌟", target: 10, color: "#7C3AED", bg: "#F3E8FF" },
        { title: t.achFirstJuz, desc: t.achFirstJuzDesc, icon: "📚", target: 20, color: "#1E40AF", bg: "#DBEAFE" },
        { title: t.achHalfway, desc: t.achHalfwayDesc, icon: "🏅", target: 57, color: "#B45309", bg: "#FEF3C7" },
        { title: t.achAlmostDone, desc: t.achAlmostDoneDesc, icon: "🔥", target: 100, color: "#DC2626", bg: "#FEE2E2" },
        { title: t.achKhatam, desc: t.achKhatamDesc, icon: "👑", target: 114, color: "#008D63", bg: "#E6F3EF" },
    ];

    const circleR = 70;
    const circleC = 2 * Math.PI * circleR;

    return (
        <div style={{ paddingTop: 16, paddingBottom: 100, minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 24 }}>
                <Link href="/" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#2D3748' : '#F0F2F5', textDecoration: 'none' }}>
                    <ArrowLeft size={22} color={textMain} />
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{t.khatamQuran}</h1>
                <div style={{ width: 40 }} />
            </div>

            {/* Main Progress Card */}
            <div style={{
                margin: '0 20px 28px', padding: '28px 24px', borderRadius: 24,
                background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                color: 'white', position: 'relative', overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="70" cy="70" r={circleR} fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                            <circle cx="70" cy="70" r={circleR} fill="transparent" stroke="#1ED760" strokeWidth="8"
                                strokeDasharray={circleC} strokeDashoffset={circleC - (circleC * (readCount / 114))}
                                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{readCount}</span>
                            <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>{t.outOf} 114</span>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.progressKhatam}</p>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{percentage}%</h2>
                        <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.5 }}>
                            {readCount === 0 ? t.startJourney : readCount >= 114 ? t.congratsKhatam : `${114 - readCount} ${t.surahRemaining}`}
                        </p>
                        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                            <div style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', fontSize: 10, fontWeight: 700 }}>✅ {readCount} {t.surahRead}</div>
                            <div style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', fontSize: 10, fontWeight: 700 }}>📖 {114 - readCount} {t.remaining}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Section */}
            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: textMain }}>{t.achievements}</h3>
                    <span style={{ fontSize: 12, fontWeight: 600, color: textMuted }}>
                        {achievements.filter(a => readCount >= a.target).length}/{achievements.length} {t.unlocked}
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {achievements.map((a) => {
                        const unlocked = readCount >= a.target;
                        const progress = Math.min(readCount / a.target, 1);
                        return (
                            <div key={a.title} style={{
                                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                                borderRadius: 18,
                                background: unlocked ? (isDark ? `${a.color}15` : a.bg) : bgCard,
                                border: unlocked ? `2px solid ${a.color}` : `1px solid ${borderColor}`,
                                boxShadow: unlocked ? `0 2px 12px ${a.color}15` : '0 1px 4px rgba(0,0,0,0.03)',
                                transition: 'all 0.3s',
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: unlocked ? `${a.color}15` : (isDark ? '#2D3748' : '#F0F2F5'),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 24, flexShrink: 0,
                                }}>
                                    {unlocked ? a.icon : <Lock size={18} color={textMuted} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: unlocked ? a.color : textMain }}>{a.title}</h4>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: unlocked ? a.color : textMuted }}>
                                            {readCount >= a.target ? '✓' : `${readCount}/${a.target}`}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: textMuted, marginBottom: 6 }}>{a.desc}</p>
                                    <div style={{ height: 4, background: unlocked ? `${a.color}20` : (isDark ? '#2D3748' : '#F0F2F5'), borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${progress * 100}%`, background: unlocked ? a.color : textMuted, borderRadius: 10, transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recently Read */}
            {readCount > 0 && (
                <div style={{ padding: '28px 20px 0' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: textMain, marginBottom: 14 }}>{t.surahAlreadyRead}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {readSurahIds.sort((a, b) => a - b).map((id) => (
                            <Link key={id} href={`/surah/${id}`} style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: isDark ? '#1A2F26' : '#E6F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 13, fontWeight: 700, color: '#008D63', textDecoration: 'none',
                                border: isDark ? '1px solid #2D5940' : '1px solid #B2DFCF',
                            }}>
                                {id}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
