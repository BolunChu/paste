"use client";

import { useEffect, useState } from "react";

interface Paste {
    id: string;
    title: string | null;
    created_at: string;
    description: string | null;
    language: string;
    author: string;
}

export default function LiteModePage() {
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Use native fetch to avoid heavy Supabase client library on old devices
        const fetchPublicPastes = async () => {
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                if (!supabaseUrl || !supabaseKey) {
                    throw new Error("Missing Supabase Config");
                }

                // Construct REST URL
                const url = `${supabaseUrl}/rest/v1/pastes?select=id,title,created_at,description,language,author&is_public=eq.true&order=created_at.desc&limit=50`;

                const response = await fetch(url, {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();
                setPastes(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load");
            } finally {
                setLoading(false);
            }
        };
        fetchPublicPastes();
    }, []);

    const safeDate = (dateStr: string) => {
        try {
            // Very defensive date parsing for old browsers
            if (!dateStr) return "-";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        } catch (e) {
            return dateStr;
        }
    }

    return (
        <div style={{ padding: '20px', fontFamily: '"Courier New", Courier, monospace', maxWidth: '800px', margin: '0 auto', fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Pastebin Lite</h1>
            <p style={{ fontSize: '12px', color: '#666' }}>Legacy Mode (Native Fetch)</p>
            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ccc' }} />

            <a href="/" style={{ marginBottom: '20px', display: 'inline-block', textDecoration: 'none', color: '#0366d6' }}>&larr; Main Site</a>

            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Title</th>
                                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Lang</th>
                                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastes.map(paste => (
                                <tr key={paste.id}>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                                        <a href={`/gist?id=${paste.id}`} style={{ color: '#0366d6', textDecoration: 'none' }}>
                                            {paste.title || "Untitled"}
                                        </a>
                                        <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>By {paste.author}</div>
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{paste.language}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{safeDate(paste.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
