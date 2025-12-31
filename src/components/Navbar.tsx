"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Plus, Code2 } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-card">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Code2 className="w-6 h-6" />
                    <span>Pastebin</span>
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/new"
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Paste</span>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{user.username}</span>
                                <button
                                    onClick={logout}
                                    className="hover:text-foreground transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        // If not logged in, we might not show anything or a login link (though our home allows login)
                        <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
