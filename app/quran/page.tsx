"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import SurahCard from "@/components/home/SurahCard";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
}

interface AyatResult {
    surahNomor: number;
    surahLatin: string;
    nomorAyat: number;
    teksArab: string;
    teksIndonesia: string;
}

// Normalize text for fuzzy matching: remove dashes, apostrophes, extra spaces, lowercase
function normalize(text: string): string {
    return text.replace(/[-'`]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

// Score how well a surah name matches a query (higher = better)
function matchScore(surahLatin: string, query: string): number {
    const s = normalize(surahLatin);
    const q = normalize(query);
    if (s === q) return 100; // exact match
    if (s.startsWith(q)) return 90; // starts with
    if (s.includes(q)) return 70; // contains
    // Try without "al " prefix
    const sNoAl = s.replace(/^al /, "");
    const qNoAl = q.replace(/^al /, "");
    if (sNoAl === qNoAl) return 85;
    if (sNoAl.startsWith(qNoAl)) return 75;
    if (sNoAl.includes(qNoAl)) return 60;
    return 0;
}

export default function QuranPage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [ayatResults, setAyatResults] = useState<AyatResult[]>([]);
    const [searchingAyat, setSearchingAyat] = useState(false);
    const [searchMode, setSearchMode] = useState<"surah" | "ayat">("surah");
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

    // Ayat search with debounce
    useEffect(() => {
        if (searchMode !== "ayat" || !searchQuery.trim()) {
            setAyatResults([]);
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            performAyatSearch(searchQuery.trim());
        }, 400);

        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, searchMode, surahs]);

    async function performAyatSearch(query: string) {
        if (surahs.length === 0) return;

        // Parse query: try to extract surah name and optional ayat number
        // Patterns: "Al Fatihah 3", "Al-Baqarah ayat 255", "Yasin 10", "alfatihah3"
        let surahQuery = query;
        let ayatNum: number | null = null;

        // Try to extract trailing number
        const matchWithAyat = query.match(/^(.+?)\s+(?:ayat\s+)?(\d+)\s*$/i);
        const matchNumOnly = query.match(/^(.+?)(\d+)\s*$/); // e.g. "alfatihah3"

        if (matchWithAyat) {
            surahQuery = matchWithAyat[1].trim();
            ayatNum = parseInt(matchWithAyat[2]);
        } else if (matchNumOnly && !query.match(/^\d+$/)) {
            // Only use this if the query isn't just a number
            surahQuery = matchNumOnly[1].trim();
            ayatNum = parseInt(matchNumOnly[2]);
        }

        // Find best matching surah
        let bestSurah: Surah | null = null;
        let bestScore = 0;

        for (const s of surahs) {
            const score = matchScore(s.namaLatin, surahQuery);
            if (score > bestScore) {
                bestScore = score;
                bestSurah = s;
            }
        }

        // Also try matching by surah number
        const numQuery = parseInt(surahQuery);
        if (!isNaN(numQuery) && numQuery >= 1 && numQuery <= 114) {
            const byNum = surahs.find(s => s.nomor === numQuery);
            if (byNum) { bestSurah = byNum; bestScore = 100; }
        }

        if (!bestSurah || bestScore < 50) {
            setAyatResults([]);
            return;
        }

        // Validate ayat number
        if (ayatNum !== null && (ayatNum < 1 || ayatNum > bestSurah.jumlahAyat)) {
            setAyatResults([{
                surahNomor: bestSurah.nomor,
                surahLatin: bestSurah.namaLatin,
                nomorAyat: 0,
                teksArab: "",
                teksIndonesia: `⚠️ Surah ${bestSurah.namaLatin} hanya memiliki ${bestSurah.jumlahAyat} ayat. Ayat ${ayatNum} tidak ditemukan.`,
            }]);
            return;
        }

        // Fetch the surah data
        setSearchingAyat(true);
        try {
            const res = await fetch(`https://equran.id/api/v2/surat/${bestSurah.nomor}`);
            const data = await res.json();

            if (data.code === 200) {
                const allAyat = data.data.ayat;

                if (ayatNum !== null) {
                    // Specific ayat requested
                    const ayat = allAyat.find((a: any) => a.nomorAyat === ayatNum);
                    if (ayat) {
                        setAyatResults([{
                            surahNomor: bestSurah.nomor,
                            surahLatin: bestSurah.namaLatin,
                            nomorAyat: ayat.nomorAyat,
                            teksArab: ayat.teksArab,
                            teksIndonesia: ayat.teksIndonesia,
                        }]);
                    }
                } else {
                    // Show first 7 ayat of the surah
                    const results: AyatResult[] = allAyat.slice(0, 7).map((a: any) => ({
                        surahNomor: bestSurah!.nomor,
                        surahLatin: bestSurah!.namaLatin,
                        nomorAyat: a.nomorAyat,
                        teksArab: a.teksArab,
                        teksIndonesia: a.teksIndonesia,
                    }));
                    setAyatResults(results);
                }
            }
        } catch (err) {
            console.error("Failed to fetch ayat:", err);
        } finally {
            setSearchingAyat(false);
        }
    }

    const filteredSurahs = surahs.filter(
        (s) => s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) || s.nomor.toString().includes(searchQuery)
    );

    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor } = useThemeColors();
    const { t } = useLanguage();

    return (
        <div style={{ paddingTop: 20, paddingBottom: 100, minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: textMain, marginBottom: 4 }}>{t.quranTitle}</h1>
                <p style={{ fontSize: 14, color: textMuted }}>{t.quranSubtitle}</p>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '0 20px', marginBottom: 12 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    borderRadius: 16, background: bgCard, border: `1px solid ${borderColor}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s',
                }}>
                    <Search size={20} color={textMuted} />
                    <input
                        type="text"
                        placeholder={searchMode === "surah" ? t.searchSurahPlaceholder : t.searchAyatPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: textMain, background: 'transparent' }}
                    />
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(""); setAyatResults([]); }} style={{
                            width: 24, height: 24, borderRadius: '50%', background: isDark ? '#2D3748' : '#F0F2F5',
                            border: 'none', cursor: 'pointer', fontSize: 12, color: textMuted,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>✕</button>
                    )}
                </div>
            </div>

            {/* Mode Toggle */}
            <div style={{ padding: '0 20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: `1px solid ${borderColor}`, background: bgCard, transition: 'all 0.3s' }}>
                    <button
                        onClick={() => { setSearchMode("surah"); setAyatResults([]); }}
                        style={{
                            flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                            background: searchMode === "surah" ? '#008D63' : bgCard,
                            color: searchMode === "surah" ? 'white' : textMuted,
                            transition: 'all 0.2s',
                        }}
                    >📖 {t.searchSurah}</button>
                    <button
                        onClick={() => setSearchMode("ayat")}
                        style={{
                            flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                            background: searchMode === "ayat" ? '#008D63' : bgCard,
                            color: searchMode === "ayat" ? 'white' : textMuted,
                            transition: 'all 0.2s',
                        }}
                    >🔍 {t.searchAyat}</button>
                </div>
            </div>

            {/* Ayat mode tips */}
            {searchMode === "ayat" && !searchQuery && (
                <div style={{ padding: '0 20px', marginBottom: 16 }}>
                    <div style={{ padding: '14px 16px', borderRadius: 14, background: '#E6F3EF', border: '1px solid #B2DFCF' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#008D63', marginBottom: 8 }}>💡 {t.searchTips}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                { q: "Al Baqarah 255", r: `→ ${t.ayat} Kursi` },
                                { q: "Al Fatihah 3", r: `→ Al-Fatihah ${t.ayat} 3` },
                                { q: "Yasin", r: `→ ${t.showAllAyat} Yasin` },
                                { q: "An Nisa 1", r: `→ An-Nisa' ${t.ayat} 1` },
                            ].map((tip) => (
                                <button key={tip.q} onClick={() => setSearchQuery(tip.q)} style={{
                                    display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
                                    borderRadius: 8, background: 'rgba(255,255,255,0.7)', border: 'none',
                                    cursor: 'pointer', fontSize: 12, textAlign: 'left',
                                }}>
                                    <span style={{ fontWeight: 700, color: '#1A1F25' }}>&quot;{tip.q}&quot;</span>
                                    <span style={{ color: '#008D63' }}>{tip.r}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Ayat Results */}
            {searchMode === "ayat" && searchQuery && (
                <div style={{ padding: '0 20px', marginBottom: 16 }}>
                    {searchingAyat ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 10 }}>
                            <div style={{ width: 24, height: 24, border: '3px solid #E6F3EF', borderTopColor: '#008D63', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            <p style={{ fontSize: 13, color: '#6C7278' }}>Mencari ayat...</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : ayatResults.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#6C7278' }}>
                                {ayatResults[0].nomorAyat === 0 ? '' : `${ayatResults.length} ayat ditemukan — ${ayatResults[0].surahLatin}`}
                            </p>
                            {ayatResults.map((ayat) => {
                                // Error message (ayat not in range)
                                if (ayat.nomorAyat === 0) {
                                    return (
                                        <div key="error" style={{
                                            padding: '16px', borderRadius: 18, background: '#FEF2F2',
                                            border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, lineHeight: 1.5,
                                        }}>
                                            {ayat.teksIndonesia}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={`${ayat.surahNomor}-${ayat.nomorAyat}`}
                                        href={`/surah/${ayat.surahNomor}#ayat-${ayat.nomorAyat}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div style={{
                                            padding: '16px', borderRadius: 18, background: '#FFFFFF',
                                            border: '1px solid #E8ECEF', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                            transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#008D63'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8ECEF'; }}
                                        >
                                            {/* Header */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: 8, background: '#E6F3EF',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 11, fontWeight: 700, color: '#008D63',
                                                    }}>{ayat.nomorAyat}</div>
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#008D63' }}>{ayat.surahLatin}</span>
                                                    <span style={{ fontSize: 11, color: '#6C7278' }}>Ayat {ayat.nomorAyat}</span>
                                                </div>
                                                <ChevronRight size={18} color="#9CA3AF" />
                                            </div>

                                            {/* Arabic */}
                                            <p className="font-arabic" style={{
                                                textAlign: 'right', direction: 'rtl', fontSize: 22, lineHeight: '44px',
                                                color: '#1A1F25', marginBottom: 8,
                                            }}>{ayat.teksArab}</p>

                                            {/* Translation */}
                                            <p style={{ fontSize: 12, color: '#6C7278', lineHeight: 1.6 }}>
                                                {ayat.teksIndonesia.length > 150 ? ayat.teksIndonesia.slice(0, 150) + '...' : ayat.teksIndonesia}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Show "Lihat Semua" button if showing partial results */}
                            {ayatResults.length > 1 && (
                                <Link href={`/surah/${ayatResults[0].surahNomor}`} style={{
                                    textDecoration: 'none', textAlign: 'center', padding: '12px',
                                    borderRadius: 14, background: '#E6F3EF', fontSize: 13, fontWeight: 700,
                                    color: '#008D63', display: 'block',
                                }}>
                                    Lihat Semua Ayat {ayatResults[0].surahLatin} →
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <BookOpen size={32} color="#9CA3AF" style={{ marginBottom: 8 }} />
                            <p style={{ color: '#6C7278', fontSize: 13 }}>Tidak ditemukan. Coba ketik nama surah</p>
                            <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Contoh: &quot;Al Baqarah 255&quot;</p>
                        </div>
                    )}
                </div>
            )}

            {/* Surah List */}
            {searchMode === "surah" && (
                <div style={{ background: '#FFFFFF', borderRadius: 20, margin: '0 20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
                            <div style={{ width: 36, height: 36, border: '4px solid #E6F3EF', borderTopColor: '#008D63', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            <p style={{ fontSize: 14, color: '#6C7278' }}>Loading Surahs...</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : filteredSurahs.length > 0 ? (
                        filteredSurahs.map((surah) => (
                            <SurahCard key={surah.nomor} id={surah.nomor} name={surah.nama} transliteration={surah.namaLatin} translation={surah.arti} numberOfVerses={surah.jumlahAyat} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p style={{ color: '#6C7278', fontSize: 14 }}>Surah &quot;{searchQuery}&quot; tidak ditemukan</p>
                        </div>
                    )}
                </div>
            )}

            <BottomNav />
        </div>
    );
}
