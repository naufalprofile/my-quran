"use client";

import Link from "next/link";

interface SurahProps {
    id: number;
    name: string;
    transliteration: string;
    translation: string;
    numberOfVerses: number;
}

export default function SurahCard({ id, name, transliteration, translation, numberOfVerses }: SurahProps) {
    return (
        <Link href={`/surah/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                marginBottom: 2,
                background: '#FFFFFF',
                borderBottom: '1px solid #F0F2F5',
                transition: 'background 0.2s',
                cursor: 'pointer',
            }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F7F9FB')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
                {/* Number Badge */}
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#E6F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: '#008D63', flexShrink: 0,
                }}>
                    {id}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1F25', marginBottom: 2 }}>{transliteration}</h3>
                    <p style={{ fontSize: 12, color: '#6C7278', fontWeight: 500 }}>
                        {translation} • {numberOfVerses} Verses
                    </p>
                </div>

                {/* Arabic Name */}
                <span className="font-arabic" style={{ fontSize: 20, fontWeight: 700, color: '#008D63' }}>
                    {name}
                </span>
            </div>
        </Link>
    );
}
