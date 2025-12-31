"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeViewerProps {
    code: string;
    language: string;
}

export default function CodeViewer({ code, language }: CodeViewerProps) {
    const [html, setHtml] = useState("");

    useEffect(() => {
        const highlight = async () => {
            try {
                const out = await codeToHtml(code, {
                    lang: language,
                    theme: "github-dark",
                });
                setHtml(out);
            } catch (e) {
                console.error("Highlighting failed", e);
                // Fallback
                setHtml(`<pre><code>${code}</code></pre>`);
            }
        };
        highlight();
    }, [code, language]);

    if (!html) return <div className="p-4 bg-muted animate-pulse h-64 rounded-md"></div>;

    return (
        <div
            className="overflow-auto p-4 rounded-md bg-[#0d1117] text-sm font-mono"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
