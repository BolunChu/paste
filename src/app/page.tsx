"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Lock, Globe, FileCode } from "lucide-react";

import { FileText } from "lucide-react";

interface Paste {
    id: string;
    title: string | null;
    created_at: string;
    language: string;
    is_public: boolean;
    author: string;
    mime_type?: string;
    storage_path?: string;
}

import { useUIStore } from "@/store/uiStore";
import { EndfieldCard, EndfieldButton } from "@/components/EndfieldUI";

export default function Home() {
    const { user, loading: authLoading, credentials } = useAuth();
    const { isTestMode } = useUIStore(); // Hook
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [loading, setLoading] = useState(true);

    const getFileIcon = (paste: Paste) => {
        if (paste.mime_type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        if (paste.mime_type?.includes('word')) return <FileText className="w-5 h-5 text-blue-500" />;
        if (paste.mime_type?.includes('sheet')) return <FileText className="w-5 h-5 text-green-500" />;
        if (paste.language === 'html') return <Globe className="w-5 h-5 text-blue-400" />;
        return <FileCode className="w-5 h-5 text-primary" />;
    }

    useEffect(() => {
        const fetchPastes = async () => {
            setLoading(true);
            try {
                if (user && credentials) {
                    const { data, error } = await supabase.rpc('api_get_my_pastes', {
                        p_username: credentials.username,
                        p_hash: credentials.hash
                    });
                    if (error) throw error;
                    if (data) setPastes(data);
                } else {
                    const { data, error } = await supabase
                        .from("pastes")
                        .select("*")
                        .eq("is_public", true)
                        .order("created_at", { ascending: false });

                    if (error) throw error;
                    if (data) setPastes(data);
                }
            } catch (err) {
                console.error("Failed to fetch pastes:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchPastes();
        }
    }, [user, credentials, authLoading]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 ${isTestMode ? 'text-[#FFE600] uppercase font-mono' : ''}`}>
                        {user ? `Dashboard` : "Recent Pastes"}
                    </h1>
                    <p className={`text-lg ${isTestMode ? 'text-gray-400 font-mono text-sm' : 'text-muted-foreground'}`}>
                        {user ? "Manage and view your collected snippets." : "Explore the latest public code snippets."}
                    </p>
                </div>
                {user && (
                    isTestMode ? (
                        <div className="bg-[#FFE600]/10 p-1 border border-[#FFE600]/30">
                            <Link href="/new" className="block">
                                <EndfieldButton className="w-full h-full">INIT_NEW_PASTE</EndfieldButton>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/new" className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                            Create New
                        </Link>
                    )
                )}
            </div>

            {loading ? (
                isTestMode ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 border border-[#FFE600]/20 bg-[#FFE600]/5 animate-pulse" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }} />)}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                )
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pastes.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            {/* Empty State */}
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <FileCode className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No pastes found</h3>
                        </div>
                    ) : (
                        pastes.map((paste) => (
                            isTestMode ? (
                                // Endfield Component
                                <Link key={paste.id} href={`/gist?id=${paste.id}`} className="block">
                                    <EndfieldCard className="h-full group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[#FFE600]">
                                                {getFileIcon(paste)}
                                            </div>
                                            <div className="text-xs font-mono text-[#FFE600]/50 border border-[#FFE600]/30 px-1">
                                                {paste.is_public ? 'PUB' : 'PVT'}
                                            </div>
                                        </div>
                                        <h2 className="font-mono text-lg font-bold text-white mb-2 group-hover:text-[#FFE600] truncate uppercase">
                                            {paste.title || "UNTITLED_DATA"}
                                        </h2>
                                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase mt-4">
                                            <span>T: {new Date(paste.created_at).toLocaleDateString()}</span>
                                            <span className="border-l border-gray-600 pl-2">{paste.language.toUpperCase()}</span>
                                        </div>
                                    </EndfieldCard>
                                </Link>
                            ) : (
                                // Standard Component
                                <Link
                                    key={paste.id}
                                    href={`/gist?id=${paste.id}`}
                                    className="group block p-6 rounded-xl border border-white/5 bg-card/50 hover:bg-card hover:border-white/20 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 rounded-md bg-secondary text-secondary-foreground group-hover:scale-110 transition-transform">
                                            {getFileIcon(paste)}
                                        </div>
                                        {paste.is_public ? <Globe className="w-4 h-4 text-muted-foreground" /> : <Lock className="w-4 h-4 text-emerald-400" />}
                                    </div>

                                    <h2 className="font-semibold text-lg truncate mb-2 group-hover:text-primary transition-colors">
                                        {paste.title || "Untitled Paste"}
                                    </h2>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}</span>
                                        <span className="bg-white/5 px-2 py-1 rounded text-foreground/70">{paste.language}</span>
                                    </div>
                                </Link>
                            )
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
