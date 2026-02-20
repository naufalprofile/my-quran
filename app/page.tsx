"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import SearchBar from "@/components/home/SearchBar";
import LastReadCard from "@/components/home/LastReadCard";
import SurahCard from "@/components/home/SurahCard";

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

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch("https://equran.id/api/v2/surat");
        const data = await res.json();
        if (data.code === 200) {
          setSurahs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch surahs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nomor.toString().includes(searchQuery)
  );

  return (
    <div style={{ paddingTop: 20, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
            border: '2px solid #E6F3EF', background: '#E6F3EF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>
            👤
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#6C7278', fontWeight: 500 }}>Assalamu Alaikum</p>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#1A1F25' }}>Hafiz Ahmed</h1>
          </div>
        </div>
        <button style={{
          width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF',
          border: '1px solid #E8ECEF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <Bell size={20} color="#1A1F25" />
          <div style={{
            position: 'absolute', top: 10, right: 10, width: 8, height: 8,
            borderRadius: '50%', background: '#EF4444', border: '2px solid white',
          }} />
        </button>
      </div>

      {/* Hero Card */}
      <LastReadCard />

      {/* Quick Access */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { icon: "📿", label: "Dzikir", href: "/dzikir", color: "#008D63", bg: "#E6F3EF" },
            { icon: "🤲", label: "Tasbih", href: "/tasbih", color: "#7C3AED", bg: "#F3E8FF" },
            { icon: "🕌", label: "Sholat", href: "/jadwal-sholat", color: "#FF9800", bg: "#FFF3E0" },
            { icon: "⭐", label: "Awards", href: "/awards", color: "#1E40AF", bg: "#DBEAFE" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              minWidth: 72, padding: '14px 8px', borderRadius: 16, background: item.bg,
              textDecoration: 'none', transition: 'transform 0.2s', flexShrink: 0,
            }}>
              <span style={{ fontSize: 26 }}>{item.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Surah List Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1F25' }}>Surah List</h2>
        <button style={{ fontSize: 14, fontWeight: 700, color: '#008D63', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 20, margin: '0 20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
            <div style={{
              width: 36, height: 36, border: '4px solid #E6F3EF', borderTopColor: '#008D63',
              borderRadius: '50%', animation: 'spin 1s linear infinite',
            }} />
            <p style={{ fontSize: 14, color: '#6C7278' }}>Fetching Holy Quran...</p>
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
            <p style={{ color: '#6C7278', fontSize: 14 }}>No Surah found with &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}