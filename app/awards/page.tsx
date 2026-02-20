"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import { Trophy } from "lucide-react";

export default function AwardsPage() {
    const [readCount, setReadCount] = useState(0);

    useEffect(() => {
        const readSurahs = JSON.parse(localStorage.getItem("read_surahs") || "[]");
        setReadCount(readSurahs.length);
    }, []);

    const achievements = [
        { title: "First Surah", desc: "Read your first Surah", icon: "📖", unlocked: readCount >= 1 },
        { title: "5 Surahs Completed", desc: "Read 5 Surahs", icon: "⭐", unlocked: readCount >= 5 },
        { title: "10 Surahs Completed", desc: "Read 10 Surahs", icon: "🌟", unlocked: readCount >= 10 },
        { title: "Half Way", desc: "Complete 57 Surahs", icon: "🏆", unlocked: readCount >= 57 },
        { title: "Khatam Al-Quran", desc: "Complete all 114 Surahs", icon: "👑", unlocked: readCount >= 114 },
    ];

    return (
        <div style={{ paddingTop: 20, paddingBottom: 100, minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1F25', marginBottom: 4 }}>Achievements</h1>
                <p style={{ fontSize: 14, color: '#6C7278' }}>Track your Quran reading progress</p>
            </div>

            {/* Progress Card */}
            <div style={{
                margin: '0 20px 28px', padding: 24, borderRadius: 20,
                background: 'linear-gradient(135deg, #008D63 0%, #06403D 100%)',
                color: 'white', textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,141,99,0.3)',
            }}>
                <Trophy size={36} color="white" style={{ marginBottom: 8 }} />
                <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{readCount}/114</h2>
                <p style={{ fontSize: 13, opacity: 0.8 }}>Surahs Completed</p>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 10, marginTop: 16, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(readCount / 114) * 100}%`, background: '#1ED760', borderRadius: 10, transition: 'width 0.5s' }} />
                </div>
            </div>

            {/* Achievement List */}
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {achievements.map((a) => (
                    <div key={a.title} style={{
                        display: 'flex', alignItems: 'center', gap: 16, padding: '16px',
                        borderRadius: 16, background: a.unlocked ? '#E6F3EF' : '#FFFFFF',
                        border: a.unlocked ? '2px solid #008D63' : '1px solid #F0F2F5',
                        opacity: a.unlocked ? 1 : 0.5,
                    }}>
                        <span style={{ fontSize: 32 }}>{a.icon}</span>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: a.unlocked ? '#008D63' : '#1A1F25' }}>{a.title}</h3>
                            <p style={{ fontSize: 12, color: '#6C7278' }}>{a.desc}</p>
                        </div>
                        {a.unlocked && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#008D63' }}>✓</span>}
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
