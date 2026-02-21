"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Bookmark, Share2 } from "lucide-react";
import { useThemeColors } from "@/components/ThemeProvider";

interface AyatProps {
    number: number;
    arabic: string;
    latin: string;
    translation: string;
    audioUrl?: string;
    showTranslation?: boolean;
    showLatin?: boolean;
    arabicFontSize?: number;
}

export default function AyatCard({ number, arabic, latin, translation, audioUrl, showTranslation = true, showLatin = false, arabicFontSize = 28 }: AyatProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { isDark } = useThemeColors();

    useEffect(() => {
        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.addEventListener("ended", () => { setIsPlaying(false); setProgress(0); });
            audioRef.current.addEventListener("timeupdate", () => {
                if (audioRef.current && audioRef.current.duration) {
                    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                }
            });
        }
        return () => {
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else {
            document.querySelectorAll("audio").forEach((a) => { a.pause(); a.currentTime = 0; });
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    const textMain = isDark ? '#E8ECEF' : '#1A1F25';
    const textMuted = isDark ? '#9CA3AF' : '#6C7278';
    const badgeBg = isDark ? '#1A2F26' : '#E6F3EF';
    const borderColor = isDark ? '#2D3748' : '#F0F2F5';
    const playingBg = isDark ? 'rgba(0,141,99,0.1)' : '#F0FFF4';
    const progressBg = isDark ? '#2D3748' : '#E6F3EF';

    return (
        <div id={`ayat-${number}`} style={{
            padding: '24px 20px',
            borderBottom: `1px solid ${borderColor}`,
            background: isPlaying ? playingBg : 'transparent',
            transition: 'background 0.3s',
        }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: badgeBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#008D63',
                }}>
                    {number}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button onClick={() => { navigator.share?.({ text: `${arabic}\n\n${translation}` }).catch(() => { }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <Share2 size={18} color={textMuted} />
                    </button>

                    {audioUrl && (
                        <button onClick={togglePlay} style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: isPlaying ? '#008D63' : badgeBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            {isPlaying ? <Pause size={16} color="white" fill="white" /> : <Play size={16} color="#008D63" fill="#008D63" />}
                        </button>
                    )}

                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <Bookmark size={18} color={textMuted} />
                    </button>
                </div>
            </div>

            {/* Audio progress bar */}
            {isPlaying && (
                <div style={{ height: 3, background: progressBg, borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#008D63', borderRadius: 10, transition: 'width 0.1s linear' }} />
                </div>
            )}

            {/* Arabic */}
            <p className="font-arabic" style={{
                textAlign: 'right', direction: 'rtl', fontSize: arabicFontSize, lineHeight: `${arabicFontSize * 2}px`,
                color: textMain, marginBottom: (showLatin || showTranslation) ? 16 : 0,
                transition: 'font-size 0.2s ease',
            }}>
                {arabic}
            </p>

            {/* Latin transliteration */}
            {showLatin && (
                <p style={{ fontSize: 13, color: '#008D63', fontStyle: 'italic', marginBottom: showTranslation ? 8 : 0, lineHeight: 1.6 }}>
                    {latin}
                </p>
            )}

            {/* Translation */}
            {showTranslation && (
                <p style={{ fontSize: 14, color: textMuted, lineHeight: 1.7 }}>{translation}</p>
            )}
        </div>
    );
}
