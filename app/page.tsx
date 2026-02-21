"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import BottomNav from "@/components/navigation/BottomNav";
import SearchBar from "@/components/home/SearchBar";
import LastReadCard from "@/components/home/LastReadCard";
import SurahCard from "@/components/home/SurahCard";

/* ── Quick Access Illustrative Icons ── */
function DzikirIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Tasbih beads string */}
      <path d="M20 6C13 6 9 12 9 18C9 24 13 30 17 33" stroke="#6B4226" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Beads */}
      <circle cx="20" cy="6" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      <circle cx="14" cy="8.5" r="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
      <circle cx="10.5" cy="13" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      <circle cx="9" cy="18" r="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
      <circle cx="10" cy="23" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      <circle cx="13" cy="27.5" r="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
      <circle cx="17" cy="31" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      {/* Tassel */}
      <line x1="20" y1="6" x2="20" y2="2" stroke="#6B4226" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="2" r="1.5" fill="#D4A574" stroke="#6B4226" strokeWidth="0.5" />
      {/* Right side beads */}
      <circle cx="26" cy="8.5" r="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
      <circle cx="29.5" cy="13" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      <circle cx="31" cy="18" r="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
      <circle cx="30" cy="23" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      <circle cx="27" cy="27.5" r="3" fill="#E74C3C" stroke="#C0392B" strokeWidth="0.8" />
      <circle cx="23" cy="31" r="3" fill="#C0392B" stroke="#A93226" strokeWidth="0.8" />
      <path d="M26 8.5C30 8.5 31 12 31 18C31 24 27 30 23 33" stroke="#6B4226" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function TasbihIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Hands praying */}
      <path d="M14 32L16 18C16 16 17 14 20 12C23 14 24 16 24 18L26 32" fill="#F5C77E" stroke="#D4A54A" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Left fingers */}
      <path d="M15 18L14 12C14 10 15 8 16 8C17 8 17.5 9 17.5 10L17 16" fill="#F5C77E" stroke="#D4A54A" strokeWidth="0.8" />
      <path d="M16.5 16L16 10C16 8.5 16.5 7 17.5 7C18.5 7 19 8 19 9.5L18.5 16" fill="#F5C77E" stroke="#D4A54A" strokeWidth="0.8" />
      <path d="M18.5 15L18.5 9C18.5 7.5 19 6 20 6C21 6 21.5 7.5 21.5 9L21.5 15" fill="#F5C77E" stroke="#D4A54A" strokeWidth="0.8" />
      {/* Right fingers */}
      <path d="M25 18L26 12C26 10 25 8 24 8C23 8 22.5 9 22.5 10L23 16" fill="#F5C77E" stroke="#D4A54A" strokeWidth="0.8" />
      <path d="M23.5 16L24 10C24 8.5 23.5 7 22.5 7C21.5 7 21 8 21 9.5L21.5 16" fill="#F5C77E" stroke="#D4A54A" strokeWidth="0.8" />
      {/* Sparkles */}
      <circle cx="8" cy="10" r="1.2" fill="#FFD700" />
      <circle cx="32" cy="10" r="1.2" fill="#FFD700" />
      <circle cx="10" cy="20" r="0.8" fill="#FFD700" opacity="0.6" />
      <circle cx="30" cy="20" r="0.8" fill="#FFD700" opacity="0.6" />
    </svg>
  );
}

function SholatIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Dome */}
      <path d="M10 22Q15 8 20 6Q25 8 30 22" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1" />
      {/* Left minaret */}
      <rect x="6" y="16" width="4" height="16" rx="1" fill="#4CAF50" stroke="#2E7D32" strokeWidth="0.8" />
      <rect x="6.5" y="14.5" width="3" height="2.5" rx="0.5" fill="#388E3C" />
      <circle cx="8" cy="13.5" r="1.5" fill="#FFD700" />
      {/* Right minaret */}
      <rect x="30" y="16" width="4" height="16" rx="1" fill="#4CAF50" stroke="#2E7D32" strokeWidth="0.8" />
      <rect x="30.5" y="14.5" width="3" height="2.5" rx="0.5" fill="#388E3C" />
      <circle cx="32" cy="13.5" r="1.5" fill="#FFD700" />
      {/* Building */}
      <rect x="11" y="22" width="18" height="10" rx="0.5" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="0.8" />
      {/* Arch door */}
      <path d="M17 32V27Q20 23 23 27V32" fill="#2E7D32" fillOpacity="0.3" stroke="#2E7D32" strokeWidth="0.8" />
      {/* Windows */}
      <rect x="12.5" y="24" width="3" height="3.5" rx="1.5" fill="#A5D6A7" stroke="#2E7D32" strokeWidth="0.5" />
      <rect x="24.5" y="24" width="3" height="3.5" rx="1.5" fill="#A5D6A7" stroke="#2E7D32" strokeWidth="0.5" />
      {/* Crescent on top */}
      <line x1="20" y1="2" x2="20" y2="6" stroke="#FFD700" strokeWidth="1.2" />
      <path d="M18.5 4A2 2 0 1022 4A1.5 1.5 0 1019 4" fill="#FFD700" />
    </svg>
  );
}

function AwardsStarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M20 4L24.5 14L35 15.5L27.5 22.5L29.5 33L20 28L10.5 33L12.5 22.5L5 15.5L15.5 14L20 4Z"
        fill="#FFD700"
        stroke="#E5A800"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Star face - cute */}
      <circle cx="17" cy="18" r="1" fill="#B8860B" />
      <circle cx="23" cy="18" r="1" fill="#B8860B" />
      <path d="M18 21Q20 23 22 21" stroke="#B8860B" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* Shine */}
      <circle cx="15" cy="11" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export default function HomePage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch("https://equran.id/api/v2/surat");
        const data = await res.json();
        if (data.code === 200) setSurahs(data.data);
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();

    const readSurahs = JSON.parse(localStorage.getItem("read_surahs") || "[]");
    setReadCount(readSurahs.length);
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nomor.toString().includes(searchQuery)
  );

  const { t } = useLanguage();

  const quickAccess = [
    { icon: <DzikirIcon />, label: t.qaDzikir, href: "/dzikir", color: "#008D63", bg: "#E6F3EF" },
    { icon: <TasbihIcon />, label: t.qaTasbih, href: "/tasbih", color: "#7C3AED", bg: "#F3E8FF" },
    { icon: <SholatIcon />, label: t.qaPrayer, href: "/jadwal-sholat", color: "#E65100", bg: "#FFF3E0" },
    { icon: <AwardsStarIcon />, label: t.qaAwards, href: "/awards", bg: "#DBEAFE", color: "#1E40AF" },
  ];

  const { isDark, bgPage, bgCard, textMain, textMuted, borderColor } = useThemeColors();

  return (
    <div style={{ paddingTop: 16, paddingBottom: 100, background: bgPage, minHeight: '100vh', transition: 'background 0.3s' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
            background: isDark ? 'linear-gradient(135deg, #1A2F26 0%, #0D1F1A 100%)' : 'linear-gradient(135deg, #E6F3EF 0%, #B2DFCF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, border: `2px solid ${isDark ? '#2D3748' : '#B2DFCF'}`,
          }}>
            👤
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 400, color: textMain }}>
              {t.assalamualaikum}
            </p>
            <p style={{ fontSize: 18, fontWeight: 800, color: textMain }}>{t.everyone}</p>
          </div>
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: 14, background: bgCard,
          border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <Bell size={20} color={textMain} />
          <div style={{
            position: 'absolute', top: 8, right: 8, width: 8, height: 8,
            borderRadius: '50%', background: '#EF4444', border: `2px solid ${bgCard}`,
          }} />
        </button>
      </div>

      {/* Progress Badge */}
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
          borderRadius: 14, background: bgCard, border: `1px solid ${borderColor}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)', transition: 'all 0.3s',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: isDark ? '#1A2F26' : '#E6F3EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>📖</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: textMain }}>{t.progressKhatam}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
              <div style={{ flex: 1, height: 4, background: isDark ? '#1A2F26' : '#E6F3EF', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(readCount / 114) * 100}%`, background: '#008D63', borderRadius: 10 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#008D63' }}>{readCount}/114</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <LastReadCard />

      {/* Quick Access */}
      <div style={{ padding: '0 20px', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          {quickAccess.map((item) => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '18px 6px 14px', borderRadius: 20,
              background: isDark ? '#1A1F25' : item.bg,
              textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              border: isDark ? '1px solid #2D3748' : 'none',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
            >
              {item.icon}
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Surah List Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{t.surahList}</h2>
        <button style={{ fontSize: 13, fontWeight: 700, color: '#008D63', background: 'none', border: 'none', cursor: 'pointer' }}>{t.seeAll}</button>
      </div>

      <div style={{ background: bgCard, borderRadius: 20, margin: '0 20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: isDark ? '1px solid #2D3748' : 'none', transition: 'all 0.3s' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
            <div style={{
              width: 36, height: 36, border: `4px solid ${isDark ? '#2D3748' : '#E6F3EF'}`, borderTopColor: '#008D63',
              borderRadius: '50%', animation: 'spin 1s linear infinite',
            }} />
            <p style={{ fontSize: 14, color: textMuted }}>{t.loading}</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.nomor}
              id={surah.nomor}
              name={surah.nama}
              transliteration={surah.namaLatin}
              translation={surah.arti}
              numberOfVerses={surah.jumlahAyat}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: textMuted, fontSize: 14 }}>{t.noResults} &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}