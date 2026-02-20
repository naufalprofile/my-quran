"use client";

import BottomNav from "@/components/navigation/BottomNav";
import { Settings, Shield, Bell, Moon, Info } from "lucide-react";

export default function SettingsPage() {
    const settingItems = [
        { icon: Bell, label: "Notifications", value: "On" },
        { icon: Moon, label: "Dark Mode", value: "System" },
        { icon: Shield, label: "Privacy & Security", value: "" },
        { icon: Settings, label: "General Settings", value: "" },
        { icon: Info, label: "About App", value: "v1.0.0" },
    ];

    return (
        <div style={{ paddingTop: 20, paddingBottom: 100, minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1F25', marginBottom: 4 }}>Settings</h1>
                <p style={{ fontSize: 14, color: '#6C7278' }}>Configure your app experience</p>
            </div>

            {/* Profile Card */}
            <div style={{
                margin: '0 20px 24px', padding: 20, borderRadius: 20, background: '#FFFFFF',
                border: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#E6F3EF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>
                    👤
                </div>
                <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1A1F25' }}>Hafiz Ahmed</h3>
                    <p style={{ fontSize: 13, color: '#6C7278' }}>hafiz@example.com</p>
                </div>
            </div>

            {/* Settings List */}
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {settingItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px', borderRadius: 16, background: '#FFFFFF', border: '1px solid #F0F2F5',
                            cursor: 'pointer',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12, background: '#E6F3EF',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={20} color="#008D63" />
                                </div>
                                <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1F25' }}>{item.label}</span>
                            </div>
                            {item.value && <span style={{ fontSize: 13, fontWeight: 600, color: '#6C7278' }}>{item.value}</span>}
                        </div>
                    );
                })}
            </div>

            <BottomNav />
        </div>
    );
}
