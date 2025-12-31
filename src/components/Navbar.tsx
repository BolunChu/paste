"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Plus, Code2, Upload, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/upload";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { TestModeToggle } from "./TestModeToggle";

export default function Navbar() {
    const { user, credentials, logout } = useAuth();
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !credentials) return;

        setUploading(true);
        try {
            const newId = await uploadFile(file, user, credentials);
            router.refresh();
            router.push(`/gist?id=${newId}`); // Redirect to view the file
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="p-1.5 bg-primary text-primary-foreground rounded-lg">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <span>Pastebin</span>
                </Link>
                <div className="flex items-center gap-4">
                    <TestModeToggle />
                    <ThemeToggle />
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link href="/desktop" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                        <span className="hidden sm:inline">Desktop Mode</span>
                    </Link>
                    {user ? (
                        <>
                            <Link
                                href="/new"
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Paste</span>
                            </Link>

                            <label className={`flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity cursor-pointer border border-white/10 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                <span className="hidden sm:inline">Upload File</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                />
                            </label>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground ml-2">
                                <span className="hidden md:inline">{user.username}</span>
                                <button
                                    onClick={logout}
                                    className="hover:text-foreground transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
