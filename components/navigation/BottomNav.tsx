"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Quran", href: "/quran", icon: "📖" },
    { name: "Prayer", href: "/jadwal-sholat", icon: "🕌", isCenter: true },
    { name: "Awards", href: "/awards", icon: "⭐" },
    { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 448,
            height: 80,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #E8ECEF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 50,
            paddingBottom: 8,
        }}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.isCenter) {
                    return (
                        <Link key={item.name} href={item.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', top: -20 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%', background: '#008D63',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(0,141,99,0.4)',
                                border: '4px solid #F7F9FB',
                                fontSize: 22,
                            }}>
                                {item.icon}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, marginTop: 4, color: isActive ? '#008D63' : '#6C7278' }}>{item.name}</span>
                        </Link>
                    );
                }

                return (
                    <Link key={item.name} href={item.href} style={{
                        textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        color: isActive ? '#008D63' : '#6C7278',
                        transition: 'color 0.2s',
                    }}>
                        <span style={{ fontSize: 22 }}>{item.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 600 }}>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
