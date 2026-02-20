"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import SurahCard from "@/components/home/SurahCard";
import SearchBar from "@/components/home/SearchBar";

interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
}

export default function QuranPage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSurahs() {
            try {
                const res = await fetch("https://equran.id/api/v2/surat");
                const data = await res.json();
                if (data.code === 200) setSurahs(data.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchSurahs();
    }, []);

    const filtered = surahs.filter(
        (s) => s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) || s.nomor.toString().includes(searchQuery)
    );

    return (
        <div style={{ paddingTop: 20, paddingBottom: 100, minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1F25', marginBottom: 4 }}>Al-Quran</h1>
                <p style={{ fontSize: 14, color: '#6C7278' }}>Read and study the holy book</p>
            </div>

            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <div style={{ background: '#FFFFFF', borderRadius: 20, margin: '0 20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
                        <div style={{ width: 36, height: 36, border: '4px solid #E6F3EF', borderTopColor: '#008D63', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <p style={{ fontSize: 14, color: '#6C7278' }}>Loading Surahs...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    filtered.map((surah) => (
                        <SurahCard key={surah.nomor} id={surah.nomor} name={surah.nama} transliteration={surah.namaLatin} translation={surah.arti} numberOfVerses={surah.jumlahAyat} />
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
}
