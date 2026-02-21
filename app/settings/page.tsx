"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, Type, Bell, Globe, Info, ChevronRight, Search, X } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import { useTheme, useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";

const FONT_SIZES_KEYS = ["small", "normal", "large"] as const;

export default function SettingsPage() {
    const { mode, setMode, theme } = useTheme();
    const { lang, setLang, t } = useLanguage();
    const [fontSize, setFontSize] = useState("normal");
    const [notifications, setNotifications] = useState(true);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [langSearch, setLangSearch] = useState("");

    const cycleFontSize = () => {
        const next = FONT_SIZES_KEYS[(FONT_SIZES_KEYS.indexOf(fontSize as any) + 1) % FONT_SIZES_KEYS.length];
        setFontSize(next);
        localStorage.setItem("app_font_size", next);
    };

    const toggleNotifications = () => {
        setNotifications(!notifications);
        localStorage.setItem("app_notifications", (!notifications).toString());
    };

    const fontLabel = fontSize === "small" ? t.fontSmall : fontSize === "large" ? t.fontLarge : t.fontNormal;
    const { isDark, bgPage, bgCard, textMain, textMuted, borderColor } = useThemeColors();

    const filteredLanguages = LANGUAGES.filter(l =>
        l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.code.toLowerCase().includes(langSearch.toLowerCase())
    );

    const currentLangObj = LANGUAGES.find(l => l.code === lang);

    return (
        <div style={{ paddingTop: 16, paddingBottom: 100, minHeight: '100vh', background: bgPage, transition: 'background 0.3s' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: 24 }}>
                <Link href="/" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#2D3748' : '#F0F2F5', textDecoration: 'none' }}>
                    <ArrowLeft size={22} color={textMain} />
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{t.settings}</h1>
                <div style={{ width: 40 }} />
            </div>

            {/* Mode Toggle */}
            <div style={{ padding: '0 20px', marginBottom: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{t.mode}</h3>
                <div style={{
                    display: 'flex', borderRadius: 16, overflow: 'hidden',
                    border: `1px solid ${borderColor}`, background: bgCard,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.3s',
                }}>
                    <button onClick={() => setMode("light")} style={{
                        flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                        background: mode === "light" ? theme.primary : 'transparent',
                        color: mode === "light" ? 'white' : textMuted,
                    }}>
                        <Sun size={18} /> {t.light}
                    </button>
                    <button onClick={() => setMode("dark")} style={{
                        flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                        background: mode === "dark" ? '#1A1F25' : 'transparent',
                        color: mode === "dark" ? 'white' : textMuted,
                        borderLeft: `1px solid ${borderColor}`,
                    }}>
                        <Moon size={18} /> {t.dark}
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <div style={{ padding: '0 20px', marginBottom: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{t.generalSettings}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 18, overflow: 'hidden', background: bgCard, border: `1px solid ${borderColor}`, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                    {/* Font Size */}
                    <button onClick={cycleFontSize} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px',
                        border: 'none', cursor: 'pointer', background: 'transparent', width: '100%',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? '#2D3748' : '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Type size={18} color="#E65100" />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: textMain }}>{t.fontSize}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: textMuted }}>{fontLabel}</span>
                            <ChevronRight size={16} color={textMuted} />
                        </div>
                    </button>

                    <div style={{ height: 1, background: borderColor, margin: '0 16px' }} />

                    {/* Notifications */}
                    <button onClick={toggleNotifications} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px',
                        border: 'none', cursor: 'pointer', background: 'transparent', width: '100%',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? '#2D3748' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={18} color="#1E40AF" />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: textMain }}>{t.notification}</span>
                        </div>
                        <div style={{
                            width: 48, height: 28, borderRadius: 14, padding: 3, transition: 'all 0.2s',
                            background: notifications ? theme.primary : (isDark ? '#4B5563' : '#D1D5DB'),
                        }}>
                            <div style={{
                                width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'all 0.2s',
                                transform: notifications ? 'translateX(20px)' : 'translateX(0)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                            }} />
                        </div>
                    </button>

                    <div style={{ height: 1, background: borderColor, margin: '0 16px' }} />

                    {/* Language */}
                    <button onClick={() => setShowLangPicker(true)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px',
                        border: 'none', cursor: 'pointer', background: 'transparent', width: '100%',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? '#2D3748' : '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Globe size={18} color="#7C3AED" />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: textMain }}>{t.language}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 16 }}>{currentLangObj?.flag}</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: textMuted }}>{currentLangObj?.nativeName || lang}</span>
                            <ChevronRight size={16} color={textMuted} />
                        </div>
                    </button>
                </div>
            </div>

            {/* About */}
            <div style={{ padding: '0 20px', marginBottom: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{t.about}</h3>
                <div style={{ borderRadius: 18, overflow: 'hidden', background: bgCard, border: `1px solid ${borderColor}`, boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? '#2D3748' : '#E6F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Info size={18} color={theme.primary} />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: textMain }}>{t.appVersion}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: textMuted }}>v1.0.0</span>
                    </div>

                    <div style={{ height: 1, background: borderColor, margin: '0 16px' }} />

                    <div style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: isDark ? '#2D3748' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                                ❤️
                            </div>
                            <div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: textMain }}>My Quran</span>
                                <p style={{ fontSize: 11, color: textMuted, marginTop: 1 }}>Read, learn & practice Al-Quran</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Picker Modal */}
            {showLangPicker && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                }}>
                    <div style={{
                        width: '100%', maxWidth: 448, maxHeight: '85vh', background: bgCard,
                        borderRadius: '24px 24px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '20px 20px 0',
                        }}>
                            <h2 style={{ fontSize: 20, fontWeight: 800, color: textMain }}>{t.selectLanguage}</h2>
                            <button onClick={() => { setShowLangPicker(false); setLangSearch(""); }} style={{
                                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: isDark ? '#2D3748' : '#F0F2F5', border: 'none', cursor: 'pointer',
                            }}>
                                <X size={18} color={textMain} />
                            </button>
                        </div>

                        {/* Search */}
                        <div style={{ padding: '16px 20px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                                borderRadius: 14, background: isDark ? '#2D3748' : '#F0F2F5',
                                border: `1px solid ${borderColor}`,
                            }}>
                                <Search size={18} color={textMuted} />
                                <input
                                    value={langSearch}
                                    onChange={(e) => setLangSearch(e.target.value)}
                                    placeholder={t.search + "..."}
                                    style={{
                                        flex: 1, border: 'none', outline: 'none', fontSize: 14,
                                        color: textMain, background: 'transparent',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Language List */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
                            {filteredLanguages.map((l) => {
                                const isActive = l.code === lang;
                                return (
                                    <button key={l.code} onClick={() => { setLang(l.code); setShowLangPicker(false); setLangSearch(""); }} style={{
                                        display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '12px 14px',
                                        borderRadius: 14, border: isActive ? '2px solid #008D63' : `1px solid transparent`,
                                        background: isActive ? (isDark ? '#1A2F26' : '#E6F3EF') : 'transparent',
                                        cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s', textAlign: 'left',
                                    }}>
                                        <span style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{l.flag}</span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? '#008D63' : textMain }}>{l.nativeName}</p>
                                            <p style={{ fontSize: 11, color: textMuted }}>{l.name}</p>
                                        </div>
                                        {isActive && (
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#008D63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                            {filteredLanguages.length === 0 && (
                                <p style={{ textAlign: 'center', color: textMuted, padding: '40px 0', fontSize: 14 }}>{t.noResults}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
