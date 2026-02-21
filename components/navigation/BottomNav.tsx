"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeColors } from "@/components/ThemeProvider";
import { useLanguage } from "@/components/LanguageProvider";

/* ── Detailed Illustrative SVG Icons ── */

function HomeIcon({ active }: { active: boolean }) {
    const main = active ? "#008D63" : "#8B95A2";
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* Roof */}
            <path d="M3 12.5L14 3L25 12.5" stroke={main} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* House body */}
            <path d="M5.5 11V22.5C5.5 23.05 5.95 23.5 6.5 23.5H21.5C22.05 23.5 22.5 23.05 22.5 22.5V11" fill={active ? "#E6F3EF" : "#F0F2F5"} stroke={main} strokeWidth="1.8" strokeLinejoin="round" />
            {/* Door */}
            <rect x="11" y="16" width="6" height="7.5" rx="1" fill={active ? "#008D63" : "#C8CDD3"} />
            {/* Door knob */}
            <circle cx="15.5" cy="20" r="0.7" fill="white" />
            {/* Window left */}
            <rect x="7.5" y="13.5" width="3" height="3" rx="0.5" fill={active ? "#B2DFCF" : "#DDE1E6"} stroke={main} strokeWidth="0.8" />
            {/* Window right */}
            <rect x="17.5" y="13.5" width="3" height="3" rx="0.5" fill={active ? "#B2DFCF" : "#DDE1E6"} stroke={main} strokeWidth="0.8" />
            {/* Chimney */}
            <rect x="19" y="5" width="3" height="6" rx="0.5" fill={active ? "#E6F3EF" : "#F0F2F5"} stroke={main} strokeWidth="1" />
        </svg>
    );
}

function QuranIcon({ active }: { active: boolean }) {
    const main = active ? "#008D63" : "#8B95A2";
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* Left page */}
            <path d="M4 5.5C4 4.67 4.67 4 5.5 4H13V24H5.5C4.67 24 4 23.33 4 22.5V5.5Z" fill={active ? "#E6F3EF" : "#F0F2F5"} stroke={main} strokeWidth="1.5" />
            {/* Right page */}
            <path d="M13 4H22.5C23.33 4 24 4.67 24 5.5V22.5C24 23.33 23.33 24 22.5 24H13V4Z" fill={active ? "#B2DFCF" : "#E4E7EB"} stroke={main} strokeWidth="1.5" />
            {/* Spine */}
            <line x1="13" y1="4" x2="13" y2="24" stroke={main} strokeWidth="1.8" />
            {/* Text lines left */}
            <line x1="6.5" y1="9" x2="11" y2="9" stroke={main} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            <line x1="6.5" y1="12" x2="10" y2="12" stroke={main} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            <line x1="6.5" y1="15" x2="11" y2="15" stroke={main} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            {/* Text lines right */}
            <line x1="15" y1="9" x2="21.5" y2="9" stroke={main} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            <line x1="15" y1="12" x2="20.5" y2="12" stroke={main} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            <line x1="15" y1="15" x2="21.5" y2="15" stroke={main} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
            {/* Bookmark ribbon */}
            <path d="M17 4V10L18.5 8.5L20 10V4" fill={active ? "#008D63" : "#C8CDD3"} />
        </svg>
    );
}

function MosqueIcon() {
    return (
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            {/* Main dome */}
            <path d="M8 17Q12 7 16 5Q20 7 24 17" fill="white" fillOpacity="0.9" stroke="white" strokeWidth="1" />
            {/* Left minaret */}
            <rect x="5" y="12" width="3.5" height="14" rx="0.8" fill="white" fillOpacity="0.85" />
            <rect x="5.5" y="11" width="2.5" height="2" rx="0.5" fill="white" fillOpacity="0.7" />
            {/* Left crescent */}
            <circle cx="6.75" cy="10" r="1.2" fill="#FFD700" />
            {/* Right minaret */}
            <rect x="23.5" y="12" width="3.5" height="14" rx="0.8" fill="white" fillOpacity="0.85" />
            <rect x="24" y="11" width="2.5" height="2" rx="0.5" fill="white" fillOpacity="0.7" />
            {/* Right crescent */}
            <circle cx="25.25" cy="10" r="1.2" fill="#FFD700" />
            {/* Building body */}
            <rect x="9" y="17" width="14" height="9" rx="0.5" fill="white" fillOpacity="0.95" />
            {/* Arched door */}
            <path d="M13.5 26V21.5Q16 17.5 18.5 21.5V26Z" fill="rgba(0,141,99,0.3)" />
            {/* Windows */}
            <rect x="10.5" y="19" width="2" height="2.5" rx="1" fill="rgba(0,141,99,0.2)" />
            <rect x="19.5" y="19" width="2" height="2.5" rx="1" fill="rgba(0,141,99,0.2)" />
            {/* Top crescent and pole */}
            <line x1="16" y1="2" x2="16" y2="5.5" stroke="#FFD700" strokeWidth="1" />
            <path d="M15 3.8A1.5 1.5 0 1117 3.8A1.2 1.2 0 1015.3 3.8" fill="#FFD700" />
        </svg>
    );
}

function AwardsIcon({ active }: { active: boolean }) {
    const main = active ? "#008D63" : "#8B95A2";
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* Star */}
            <path
                d="M14 3L17.1 10.2L25 11.1L19.2 16.4L20.7 24.2L14 20.3L7.3 24.2L8.8 16.4L3 11.1L10.9 10.2L14 3Z"
                fill={active ? "#FFD700" : "#E4E7EB"}
                stroke={active ? "#E5A800" : "#B0B7C0"}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* Shine lines */}
            {active && (
                <>
                    <line x1="14" y1="1" x2="14" y2="2.5" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="25.5" y1="8" x2="24" y2="9" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="2.5" y1="8" x2="4" y2="9" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
                </>
            )}
        </svg>
    );
}

function SettingsIcon({ active }: { active: boolean }) {
    const main = active ? "#008D63" : "#8B95A2";
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* Outer gear teeth */}
            <path
                d="M14 3.5L15.5 2L17 3.5V5.5L19.5 6.8L21.5 5.8L23 7.3L22 9.3L23.3 11.5H25.5L26 13.5L24 14.5L24.2 17L26 18.5L25 20.5H23L21.8 22.3L22.5 24.5L20.8 25.5L19 24L17 24.8V27L15 27.5L14 25.5L12.5 27L11 27V24.8L9 24L7.2 25.5L5.5 24.5L6.2 22.3L5 20.5H3L2 18.5L3.8 17L3.5 14.5L2 13.5L2.5 11.5H4.7L6 9.3L5 7.3L6.5 5.8L8.5 6.8L11 5.5V3.5L12.5 2L14 3.5Z"
                fill={active ? "#E6F3EF" : "#F0F2F5"}
                stroke={main}
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            {/* Inner circle */}
            <circle cx="14" cy="14.5" r="5" fill="white" stroke={main} strokeWidth="1.5" />
            {/* Center dot */}
            <circle cx="14" cy="14.5" r="2" fill={active ? "#008D63" : "#C8CDD3"} />
        </svg>
    );
}

export default function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { name: t.navHome, href: "/", type: "home" },
        { name: t.navQuran, href: "/quran", type: "quran" },
        { name: t.navPrayer, href: "/jadwal-sholat", type: "mosque", isCenter: true },
        { name: t.navAwards, href: "/awards", type: "awards" },
        { name: t.navSettings, href: "/settings", type: "settings" },
    ];

    const { isDark } = useThemeColors();

    const navBg = isDark ? 'rgba(26,31,37,0.97)' : 'rgba(255,255,255,0.97)';
    const navBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const centerBorder = isDark ? '#1A1F25' : '#F7F9FB';
    const labelInactive = isDark ? '#6B7280' : '#8B95A2';
    const labelMuted = isDark ? '#9CA3AF' : '#6C7278';

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 448,
            height: 82,
            background: navBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: `1px solid ${navBorder}`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            zIndex: 50,
            paddingBottom: 8,
            boxShadow: isDark ? '0 -4px 30px rgba(0,0,0,0.2)' : '0 -4px 30px rgba(0,0,0,0.04)',
            transition: 'background 0.3s, border-color 0.3s',
        }}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.isCenter) {
                    return (
                        <Link key={item.name} href={item.href} style={{
                            textDecoration: 'none',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            position: 'relative', top: -24,
                        }}>
                            <div style={{
                                width: 62, height: 62, borderRadius: '50%',
                                background: 'linear-gradient(145deg, #00A876 0%, #007A55 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 6px 24px rgba(0,141,99,0.45), inset 0 1px 1px rgba(255,255,255,0.2)',
                                border: `4px solid ${centerBorder}`,
                            }}>
                                <MosqueIcon />
                            </div>
                            <span style={{
                                fontSize: 10, fontWeight: 700, marginTop: 4,
                                color: isActive ? '#008D63' : labelMuted,
                                letterSpacing: 0.5,
                            }}>{item.name}</span>
                        </Link>
                    );
                }

                const renderIcon = () => {
                    switch (item.type) {
                        case "home": return <HomeIcon active={isActive} />;
                        case "quran": return <QuranIcon active={isActive} />;
                        case "awards": return <AwardsIcon active={isActive} />;
                        case "settings": return <SettingsIcon active={isActive} />;
                        default: return null;
                    }
                };

                return (
                    <Link key={item.name} href={item.href} style={{
                        textDecoration: 'none',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 3, padding: '6px 0', minWidth: 52,
                        transition: 'all 0.2s',
                    }}>
                        {renderIcon()}
                        <span style={{
                            fontSize: 10, fontWeight: 700,
                            color: isActive ? '#008D63' : labelInactive,
                            letterSpacing: 0.5,
                        }}>{item.name}</span>
                        {isActive && (
                            <div style={{
                                width: 4, height: 4, borderRadius: '50%',
                                background: '#008D63',
                                marginTop: -1,
                            }} />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

