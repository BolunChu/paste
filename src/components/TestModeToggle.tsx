"use client";

import { useUIStore } from "@/store/uiStore";
import { FlaskConical } from "lucide-react";

export function TestModeToggle() {
    const { isTestMode, toggleTestMode } = useUIStore();

    return (
        <button
            onClick={toggleTestMode}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                ${isTestMode
                    ? "bg-[#FFE600] text-black shadow-[0_0_15px_rgba(255,230,0,0.5)] border border-transparent"
                    : "bg-transparent text-muted-foreground border border-white/10 hover:border-white/30 hover:text-foreground"
                }
            `}
        >
            <FlaskConical className={`w-3 h-3 ${isTestMode ? "animate-pulse" : ""}`} />
            {isTestMode ? "TEST MODE: ON" : "TEST MODE"}
        </button>
    )
}
