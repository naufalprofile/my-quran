"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Bookmark, Share2 } from "lucide-react";

interface AyatProps {
    number: number;
    arabic: string;
    latin: string;
    translation: string;
    audioUrl?: string;
}

export default function AyatCard({ number, arabic, translation, audioUrl }: AyatProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element
        if (audioUrl) {
            audioRef.current = new Audio(audioUrl);

            audioRef.current.addEventListener("ended", () => {
                setIsPlaying(false);
                setProgress(0);
            });

            audioRef.current.addEventListener("timeupdate", () => {
                if (audioRef.current && audioRef.current.duration) {
                    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
                }
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener("ended", () => { });
                audioRef.current.removeEventListener("timeupdate", () => { });
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // Stop any other playing audio first
            document.querySelectorAll("audio").forEach((a) => { a.pause(); a.currentTime = 0; });
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    return (
        <div style={{
            padding: '24px 20px',
            borderBottom: '1px solid #F0F2F5',
            background: isPlaying ? '#F0FFF4' : 'transparent',
            transition: 'background 0.3s',
        }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#E6F3EF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#008D63',
                }}>
                    {number}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button onClick={() => { navigator.share?.({ text: `${arabic}\n\n${translation}` }).catch(() => { }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <Share2 size={18} color="#6C7278" />
                    </button>

                    {/* Play/Pause Button */}
                    {audioUrl && (
                        <button onClick={togglePlay} style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: isPlaying ? '#008D63' : '#E6F3EF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            {isPlaying ? <Pause size={16} color="white" fill="white" /> : <Play size={16} color="#008D63" fill="#008D63" />}
                        </button>
                    )}

                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                        <Bookmark size={18} color="#6C7278" />
                    </button>
                </div>
            </div>

            {/* Audio progress bar */}
            {isPlaying && (
                <div style={{ height: 3, background: '#E6F3EF', borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: '#008D63', borderRadius: 10, transition: 'width 0.1s linear' }} />
                </div>
            )}

            {/* Arabic */}
            <p className="font-arabic" style={{
                textAlign: 'right', direction: 'rtl', fontSize: 28, lineHeight: '56px',
                color: '#1A1F25', marginBottom: 16,
            }}>
                {arabic}
            </p>

            {/* Translation */}
            <p style={{ fontSize: 14, color: '#6C7278', lineHeight: 1.7 }}>{translation}</p>
        </div>
    );
}
