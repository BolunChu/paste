"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Lock, Globe } from "lucide-react";

interface Paste {
    id: string;
    title: string | null;
    created_at: string;
    language: string;
    is_public: boolean;
    author: string;
}

export default function Home() {
    const { user, loading: authLoading, credentials } = useAuth();
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPastes = async () => {
            setLoading(true);
            try {
                if (user && credentials) {
                    // Logged in: Fetch my pastes (private + public) via RPC
                    const { data, error } = await supabase.rpc('api_get_my_pastes', {
                        p_username: credentials.username,
                        p_hash: credentials.hash
                    });
                    if (error) throw error;
                    if (data) setPastes(data); // Typo in interface vs RPC return? RPC returns columns matching interface.
                } else {
                    // Guest: Fetch only public pastes via standard query (RLS public policy assumed)
                    // Note: Standard query 'pastes' works if RLS policy "Public pastes are viewable by everyone" is active.
                    const { data, error } = await supabase
                        .from("pastes")
                        .select("id, title, created_at, language, is_public, author")
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

    // We need to implement the fetch properly with creds.
    // I will refactor this Effect after I update the SQL in the next turn.
    // For now, let's just scaffold the view.

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {user ? `Welcome back, ${user.username}` : "Recent Public Pastes"}
                </h1>
                {user && (
                    <Link href="/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90">
                        Create New
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pastes.length === 0 ? (
                        <p className="text-muted-foreground">No pastes found.</p>
                    ) : (
                        pastes.map((paste) => (
                            <Link
                                key={paste.id}
                                href={`/gist?id=${paste.id}`}
                                className="block p-6 rounded-lg border bg-card hover:border-primary transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="font-semibold truncate pr-4">
                                        {paste.title || "Untitled Paste"}
                                    </h2>
                                    {paste.is_public ? <Globe className="w-4 h-4 text-muted-foreground" /> : <Lock className="w-4 h-4 text-warning" />}
                                </div>
                                <div className="text-sm text-muted-foreground mb-4">
                                    {formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })} • {paste.language}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    by {paste.author}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
