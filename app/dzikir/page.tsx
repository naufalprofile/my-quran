"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Sun, Moon, BookOpen, Heart, Volume2, Pause } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

function getCategories(t: ReturnType<typeof import("@/components/LanguageProvider").useLanguage>["t"]) {
    return [
        {
            id: "pagi",
            title: t.dzikirMorning,
            icon: "🌅",
            color: "#FF9800",
            bgColor: "#FFF3E0",
            desc: t.dzikirMorningDesc,
            items: [
                { arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلّٰهِ وَالْحَمْدُ لِلّٰهِ، لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ", latin: "Ashbahnaa wa ashbahal mulku lillaahi wal hamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lah", meaning: "Kami memasuki waktu pagi dan kerajaan hanya milik Allah. Segala puji bagi Allah. Tidak ada ilah yang berhak disembah kecuali Allah semata, tidak ada sekutu bagi-Nya.", count: 1 },
                { arabic: "اَللّٰهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", latin: "Allaahumma bika ashbahnaa, wa bika amsainaa, wa bika nahyaa, wa bika namuutu wa ilaikan nusyuur", meaning: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan.", count: 1 },
                { arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", latin: "Subhaanallaahi wa bihamdih", meaning: "Maha Suci Allah dan dengan memuji-Nya.", count: 100 },
                { arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلىٰ كُلِّ شَيْءٍ قَدِيرٌ", latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai'in qadiir", meaning: "Tidak ada ilah yang berhak disembah kecuali Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala pujian. Dan Dia Maha Kuasa atas segala sesuatu.", count: 10 },
                { arabic: "أَسْتَغْفِرُ اللّٰهَ وَأَتُوبُ إِلَيْهِ", latin: "Astaghfirullaaha wa atuubu ilaih", meaning: "Aku memohon ampun kepada Allah dan bertobat kepada-Nya.", count: 100 },
            ],
        },
        {
            id: "petang",
            title: t.dzikirEvening,
            icon: "🌇",
            color: "#7C3AED",
            bgColor: "#F3E8FF",
            desc: t.dzikirEveningDesc,
            items: [
                { arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّٰهِ وَالْحَمْدُ لِلّٰهِ، لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ", latin: "Amsainaa wa amsal mulku lillaahi wal hamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lah", meaning: "Kami memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah. Tidak ada ilah yang berhak disembah kecuali Allah semata, tidak ada sekutu bagi-Nya.", count: 1 },
                { arabic: "اَللّٰهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", latin: "Allaahumma bika amsainaa, wa bika ashbahnaa, wa bika nahyaa, wa bika namuutu wa ilaikal mashiir", meaning: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu petang, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali.", count: 1 },
                { arabic: "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ", latin: "Subhaanallaahi wa bihamdih", meaning: "Maha Suci Allah dan dengan memuji-Nya.", count: 100 },
                { arabic: "أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", latin: "A'uudzu bikalimaatillaahit taammaati min syarri maa khalaq", meaning: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk-Nya.", count: 3 },
            ],
        },
        {
            id: "sholat",
            title: t.dzikirAfterPrayer,
            icon: "🤲",
            color: "#008D63",
            bgColor: "#E6F3EF",
            desc: t.dzikirAfterPrayerDesc,
            items: [
                { arabic: "أَسْتَغْفِرُ اللّٰهَ", latin: "Astaghfirullaah", meaning: "Aku memohon ampun kepada Allah.", count: 3 },
                { arabic: "اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", latin: "Allaahumma antas salaamu wa minkas salaamu tabaarakta yaa dzal jalaali wal ikraam", meaning: "Ya Allah, Engkau pemberi keselamatan, dan dari-Mu keselamatan. Mahasuci Engkau, wahai Tuhan pemilik keagungan dan kemuliaan.", count: 1 },
                { arabic: "سُبْحَانَ اللّٰهِ", latin: "Subhaanallaah", meaning: "Maha Suci Allah.", count: 33 },
                { arabic: "اَلْحَمْدُ لِلّٰهِ", latin: "Alhamdulillaah", meaning: "Segala puji bagi Allah.", count: 33 },
                { arabic: "اَللّٰهُ أَكْبَرُ", latin: "Allaahu Akbar", meaning: "Allah Maha Besar.", count: 33 },
                { arabic: "لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلىٰ كُلِّ شَيْءٍ قَدِيرٌ", latin: "Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai'in qadiir", meaning: "Tidak ada ilah yang berhak disembah kecuali Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya pujian. Dan Dia Maha Kuasa atas segala sesuatu.", count: 1 },
            ],
        },
        {
            id: "tidur",
            title: t.dzikirBeforeSleep,
            icon: "🌙",
            color: "#1E40AF",
            bgColor: "#DBEAFE",
            desc: t.dzikirBeforeSleepDesc,
            items: [
                { arabic: "بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا", latin: "Bismikallaahumma amuutu wa ahyaa", meaning: "Dengan menyebut nama-Mu, ya Allah, aku mati dan aku hidup.", count: 1 },
                { arabic: "اَللّٰهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", latin: "Allaahumma qinii 'adzaabaka yauma tab'atsu 'ibaadak", meaning: "Ya Allah, lindungilah aku dari azab-Mu pada hari Engkau membangkitkan hamba-hamba-Mu.", count: 3 },
            ],
        },
    ];
}

function DzikrItemCard({ item, index, t }: { item: ReturnType<typeof getCategories>[0]["items"][0]; index: number; t: ReturnType<typeof import("@/components/LanguageProvider").useLanguage>["t"] }) {
    const [currentCount, setCurrentCount] = useState(0);
    const completed = currentCount >= item.count;
    const { isDark, textMain, textMuted, bgCard, borderColor, subtleBg } = useThemeColors();

    const increment = () => {
        if (currentCount < item.count) { setCurrentCount(prev => prev + 1); if (window.navigator.vibrate) window.navigator.vibrate(20); }
        if (currentCount + 1 === item.count && window.navigator.vibrate) { window.navigator.vibrate([100, 50, 100]); }
    };
    const reset = () => setCurrentCount(0);

    return (
        <div onClick={increment} style={{
            padding: '20px', marginBottom: 12, borderRadius: 20, cursor: 'pointer',
            background: completed ? (isDark ? '#1A2F26' : '#E6F3EF') : bgCard,
            border: completed ? '2px solid #008D63' : `1px solid ${borderColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.2s', userSelect: 'none',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: completed ? '#008D63' : subtleBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: completed ? 'white' : textMuted,
                    }}>
                        {completed ? '✓' : index + 1}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: textMuted }}>{t.repeat} {item.count}x</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: completed ? '#008D63' : textMain }}>{currentCount}</span>
                    <span style={{ fontSize: 12, color: textMuted }}>/ {item.count}</span>
                    {currentCount > 0 && (
                        <button onClick={(e) => { e.stopPropagation(); reset(); }} style={{
                            width: 22, height: 22, borderRadius: '50%', background: subtleBg,
                            border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: textMuted,
                        }}>↺</button>
                    )}
                </div>
            </div>
            <div style={{ height: 3, background: subtleBg, borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(currentCount / item.count) * 100}%`, background: '#008D63', borderRadius: 10, transition: 'width 0.2s ease' }} />
            </div>
            <p className="font-arabic" style={{ textAlign: 'right', direction: 'rtl', fontSize: 24, lineHeight: '48px', color: textMain, marginBottom: 12 }}>{item.arabic}</p>
            <p style={{ fontSize: 13, color: '#008D63', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 }}>{item.latin}</p>
            <p style={{ fontSize: 13, color: textMuted, lineHeight: 1.6 }}>{item.meaning}</p>
            {!completed && (
                <p style={{ fontSize: 11, color: isDark ? '#6B7280' : '#9CA3AF', textAlign: 'center', marginTop: 12, fontWeight: 500 }}>
                    👆 {t.tapToCount2}
                </p>
            )}
        </div>
    );
}

export default function DzikirPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor, subtleBg } = useThemeColors();
    const { t } = useLanguage();
    const categories = getCategories(t);
    const selectedCategory = categories.find(c => c.id === activeCategory);

    return (
        <div style={{ paddingTop: 16, paddingBottom: 100, minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 24 }}>
                <Link href="/" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: subtleBg, textDecoration: 'none' }}>
                    <ArrowLeft size={22} color={textMain} />
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>
                    {activeCategory ? selectedCategory?.title : t.dzikirTitle}
                </h1>
                <div style={{ width: 40 }} />
            </div>

            {!activeCategory ? (
                <>
                    {/* Hero */}
                    <div style={{
                        margin: '0 20px 28px', padding: '28px 24px', borderRadius: 24,
                        background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                        color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
                    }}>
                        <div style={{ position: 'absolute', top: -30, right: -20, fontSize: 100, opacity: 0.08 }}>🤲</div>
                        <p className="font-arabic" style={{ fontSize: 24, marginBottom: 8, lineHeight: 1.6 }}>
                            أَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ
                        </p>
                        <p style={{ fontSize: 13, opacity: 0.85 }}>
                            {t.dzikirHeroQuote}
                        </p>
                        <p style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>{t.dzikirHeroRef}</p>
                    </div>

                    {/* Category Cards */}
                    <div style={{ padding: '0 20px' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 12 }}>{t.selectCategory}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {categories.map((cat) => (
                                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
                                    borderRadius: 18, background: bgCard, border: `1px solid ${borderColor}`,
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = cat.color; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = borderColor; }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 16,
                                        background: isDark ? `${cat.color}15` : cat.bgColor,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
                                    }}>
                                        {cat.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 2 }}>{cat.title}</h4>
                                        <p style={{ fontSize: 12, color: textMuted }}>{cat.desc} • {cat.items.length} {t.dzikirCount}</p>
                                    </div>
                                    <ChevronRight size={20} color={textMuted} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Dzikir */}
                    <div style={{ padding: '28px 20px 0' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 12 }}>{t.dailyDzikir}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {[
                                { arabic: "سُبْحَانَ اللّٰهِ", latin: "SubhanAllah", target: 33 },
                                { arabic: "اَلْحَمْدُ لِلّٰهِ", latin: "Alhamdulillah", target: 33 },
                                { arabic: "اَللّٰهُ أَكْبَرُ", latin: "AllahuAkbar", target: 33 },
                                { arabic: "أَسْتَغْفِرُ اللّٰهَ", latin: "Astaghfirullah", target: 100 },
                            ].map((d) => (
                                <Link key={d.latin} href="/tasbih" style={{
                                    padding: '16px 14px', borderRadius: 16, background: bgCard,
                                    border: `1px solid ${borderColor}`, textDecoration: 'none', textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.3s',
                                }}>
                                    <p className="font-arabic" style={{ fontSize: 18, color: '#008D63', marginBottom: 4, fontWeight: 700 }}>{d.arabic}</p>
                                    <p style={{ fontSize: 12, color: textMuted, fontWeight: 500 }}>{d.latin}</p>
                                    <p style={{ fontSize: 10, color: isDark ? '#6B7280' : '#9CA3AF', marginTop: 2 }}>{d.target}x</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ padding: '0 20px' }}>
                    <button onClick={() => setActiveCategory(null)} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                        borderRadius: 12, background: isDark ? `${selectedCategory?.color}15` : (selectedCategory?.bgColor || subtleBg),
                        border: 'none', cursor: 'pointer', marginBottom: 20,
                        fontSize: 13, fontWeight: 600, color: selectedCategory?.color || textMain,
                    }}>
                        <ArrowLeft size={16} /> {t.backToCategory}
                    </button>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                        padding: '16px', borderRadius: 16,
                        background: isDark ? `${selectedCategory?.color}15` : selectedCategory?.bgColor,
                    }}>
                        <span style={{ fontSize: 36 }}>{selectedCategory?.icon}</span>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{selectedCategory?.title}</h2>
                            <p style={{ fontSize: 12, color: textMuted }}>{selectedCategory?.desc} • {selectedCategory?.items.length} {t.dzikirCount}</p>
                        </div>
                    </div>

                    {selectedCategory?.items.map((item, i) => (
                        <DzikrItemCard key={i} item={item} index={i} t={t} />
                    ))}
                </div>
            )}

            <BottomNav />
        </div>
    );
}
