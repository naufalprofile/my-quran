"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div style={{
            margin: '0 20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px',
            height: 52,
            background: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid #E8ECEF',
        }}>
            <Search size={20} color="#6C7278" />
            <input
                type="text"
                placeholder="Search Surah, Ayah, or Topic..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 14, fontWeight: 500, color: '#1A1F25',
                    fontFamily: 'Inter, sans-serif',
                }}
            />
            <button style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                <SlidersHorizontal size={20} color="#008D63" />
            </button>
        </div>
    );
}
