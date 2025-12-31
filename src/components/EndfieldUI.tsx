"use client";

import { useUIStore } from "@/store/uiStore";
import { motion } from "framer-motion";

// Defines the visual wrapper for Endfield Mode
export function EndfieldWrapper({ children }: { children: React.ReactNode }) {
    const { isTestMode } = useUIStore();

    if (!isTestMode) return <>{children}</>;

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0a] text-[#ededed] font-mono selection:bg-[#FFE600] selection:text-black overflow-x-hidden">
            {/* Background Layer: Topographic Lines */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="contour" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="#555" strokeWidth="0.5" />
                            <path d="M0 20 Q 25 60, 50 20 T 100 20" fill="none" stroke="#555" strokeWidth="0.5" />
                            <path d="M0 80 Q 25 40, 50 80 T 100 80" fill="none" stroke="#555" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#contour)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80" />
            </div>

            {/* Decorative Technical Elements */}
            <div className="fixed top-20 left-10 w-[1px] h-40 bg-[#FFE600]/30 z-0 hidden lg:block" />
            <div className="fixed top-20 left-10 w-20 h-[1px] bg-[#FFE600]/30 z-0 hidden lg:block" />
            <div className="fixed bottom-20 right-10 w-[1px] h-40 bg-[#FFE600]/30 z-0 hidden lg:block" />
            <div className="fixed bottom-20 right-10 w-20 h-[1px] bg-[#FFE600]/30 z-0 hidden lg:block" />

            {/* Main Content Layer */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Floating Holographic Overlay Effect */}
            <div className="fixed inset-0 z-50 pointer-events-none bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>
    );
}

// Custom UI Components for Endfield Mode
export const EndfieldCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative group bg-[#111] border border-[#333] hover:border-[#FFE600] transition-colors duration-300 p-6 ${className}`}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)" }}
        >
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FFE600] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFE600] opacity-0 group-hover:opacity-100 transition-opacity" />

            {children}
        </motion.div>
    )
}

export const EndfieldButton = ({ children, onClick, className = '' }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
    return (
        <button
            onClick={onClick}
            className={`relative px-6 py-2 bg-[#FFE600] text-black font-bold uppercase tracking-wider hover:bg-white transition-colors skewed-button ${className}`}
            style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
        >
            {children}
            {/* Tech Decor */}
            <div className="absolute bottom-1 right-2 text-[8px] opacity-50">ENDFIELD</div>
        </button>
    )
}
