"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LANGUAGES = [
    "plaintext",
    "javascript",
    "typescript",
    "python",
    "html",
    "css",
    "json",
    "markdown",
    "sql",
    "bash",
    "go",
    "java",
    "cpp",
];

export default function NewPastePage() {
    const { user, credentials } = useAuth();
    const router = useRouter();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [language, setLanguage] = useState("plaintext");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!content.trim()) {
            setError("Content cannot be empty");
            return;
        }
        if (!user || !credentials) {
            setError("You must be logged in");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { data, error: rpcError } = await supabase.rpc("api_create_paste", {
                p_username: credentials.username,
                p_hash: credentials.hash,
                p_content: content,
                p_language: language,
                p_title: title || null,
                p_description: null,
                p_is_public: isPublic,
            });

            if (rpcError) throw rpcError;

            if (data) {
                router.push(`/gist?id=${data}`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create paste");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Paste</h1>

            <div className="grid gap-6 max-w-4xl mx-auto">
                {/* Metadata Controls */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (Optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My Snippet"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Privacy</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                                className="text-primary focus:ring-primary"
                            />
                            <span>Public</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                                className="text-primary focus:ring-primary"
                            />
                            <span>Private (User Only)</span>
                        </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isPublic ? "Visible to everyone." : "Only visible to you."}
                    </p>
                </div>

                {/* Editor */}
                <div className="h-[500px]">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="// Enter your code here..."
                        className="w-full h-full p-4 font-mono text-sm border rounded-md bg-card focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        spellCheck={false}
                    />
                </div>

                {error && <p className="text-destructive font-medium">{error}</p>}

                <div className="flex justify-end">
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        Create Paste
                    </button>
                </div>
            </div>
        </div>
    );
}
