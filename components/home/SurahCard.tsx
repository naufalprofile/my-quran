"use client";

import Link from "next/link";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface SurahProps {
    id: number;
    name: string;
    transliteration: string;
    translation: string;
    numberOfVerses: number;
}

export default function SurahCard({ id, name, transliteration, translation, numberOfVerses }: SurahProps) {
    const { isDark, bgCard, textMain, textMuted } = useThemeColors();
    const { t } = useLanguage();
    const bgHover = isDark ? '#252D38' : '#F7F9FB';
    const borderClr = isDark ? '#2D3748' : '#F0F2F5';
    const badgeBg = isDark ? '#1A2F26' : '#E6F3EF';

    return (
        <Link href={`/surah/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                marginBottom: 2,
                background: bgCard,
                borderBottom: `1px solid ${borderClr}`,
                transition: 'background 0.2s',
                cursor: 'pointer',
            }}
                onMouseEnter={(e) => (e.currentTarget.style.background = bgHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = bgCard)}
            >
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#008D63', flexShrink: 0,
                }}>
                    {id}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: textMain, marginBottom: 2 }}>{transliteration}</h3>
                    <p style={{ fontSize: 12, color: textMuted, fontWeight: 500 }}>
                        {translation} • {numberOfVerses} {t.ayat}
                    </p>
                </div>

                <span className="font-arabic" style={{ fontSize: 20, fontWeight: 700, color: '#008D63' }}>
                    {name}
                </span>
            </div>
        </Link>
    );
}
