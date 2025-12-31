"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import CodeViewer from "@/components/CodeViewer";
import { Loader2, Trash2, Calendar, User, Globe, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Paste {
    id: string;
    title: string | null;
    content: string;
    created_at: string;
    language: string;
    is_public: boolean;
    author: string;
}

function ViewPasteContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { user, credentials } = useAuth();
    const router = useRouter();

    const [paste, setPaste] = useState<Paste | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("No paste ID provided.");
            setLoading(false);
            return;
        }

        const fetchPaste = async () => {
            try {
                let data: Paste | null = null;

                if (user && credentials) {
                    const { data: rpcData, error: rpcError } = await supabase.rpc('api_get_paste', {
                        p_username: credentials.username,
                        p_hash: credentials.hash,
                        p_paste_id: id
                    }).single();

                    if (rpcData) data = rpcData as Paste;

                } else {
                    const { data: pubData, error: pubError } = await supabase
                        .from("pastes")
                        .select("*")
                        .eq("id", id)
                        .single();
                    if (pubData) data = pubData as Paste;
                }

                if (data) {
                    setPaste(data);
                } else {
                    setError("Paste not found or you don't have access.");
                }

            } catch (e: any) {
                console.error(e);
                setError("Failed to load paste.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaste();
    }, [id, user, credentials]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this paste?")) return;
        if (!credentials || !id) return;

        setDeleting(true);
        try {
            const { data, error } = await supabase.rpc("api_delete_paste", {
                p_username: credentials.username,
                p_hash: credentials.hash,
                p_paste_id: id
            });

            if (error) throw error;

            router.push("/");
        } catch (e) {
            console.error(e);
            alert("Error deleting paste.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    if (error || !paste) return <div className="text-center py-20 text-destructive">{error || "404 Not Found"}</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{paste.title || "Untitled Paste"}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" /> {paste.author}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {formatDistanceToNow(new Date(paste.created_at), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1">
                            {paste.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4 text-warning" />}
                            {paste.is_public ? "Public" : "Private"}
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs uppercase font-bold tracking-wider">
                            {paste.language}
                        </div>
                    </div>
                </div>

                {user && user.username === paste.author && (
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-3 py-2 rounded-md transition-colors"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete
                    </button>
                )}
            </div>

            <div className="rounded-lg overflow-hidden border">
                <CodeViewer code={paste.content} language={paste.language} />
            </div>
        </div>
    );
}

export default function ViewPastePage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
            <ViewPasteContent />
        </Suspense>
    )
}
