"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { uploadFile } from "@/lib/upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// Inner component to access Auth Context
function MainLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, credentials } = useAuth();
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (!user || !credentials || !e.dataTransfer.files.length) return;

        const file = e.dataTransfer.files[0]; // Handle first file for simplistic main UI
        setUploading(true);

        try {
            const newId = await uploadFile(file, user, credentials);
            router.refresh();
            router.push(`/gist?id=${newId}`);
        } catch (err) {
            console.error(err);
            alert("Drag and drop upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="min-h-screen relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Navbar />
            {children}

            {/* Drag Overlay */}
            {isDragging && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[9999] flex items-center justify-center border-4 border-primary border-dashed m-4 rounded-xl pointer-events-none">
                    <div className="text-2xl font-bold text-white bg-black/50 px-6 py-4 rounded-xl">
                        Drop file to Upload
                    </div>
                </div>
            )}

            {/* Uploading Overlay */}
            {uploading && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 bg-card p-8 rounded-xl border border-white/10">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <span className="text-lg font-medium">Uploading...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/20`}>
                <Providers>
                    <MainLayoutContent>
                        {children}
                    </MainLayoutContent>
                </Providers>
            </body>
        </html>
    );
}
