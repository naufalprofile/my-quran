import React from "react";
import SurahDetailClient from "@/components/surah/SurahDetailClient";

export async function generateStaticParams() {
    const res = await fetch("https://equran.id/api/v2/surat");
    const data = await res.json();

    if (data.code !== 200) return [];

    return data.data.map((surah: { nomor: number }) => ({
        id: surah.nomor.toString(),
    }));
}

async function getSurahData(id: string) {
    const res = await fetch(`https://equran.id/api/v2/surat/${id}`);
    const data = await res.json();

    if (data.code !== 200) {
        throw new Error("Failed to fetch surah data");
    }

    return data.data;
}

export default async function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const surah = await getSurahData(id);

    return <SurahDetailClient surah={surah} />;
}
