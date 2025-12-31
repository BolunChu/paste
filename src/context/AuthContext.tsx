"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, passwordHash: string) => Promise<boolean>;
    logout: () => void;
    credentials: { username: string; hash: string } | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => false,
    logout: () => { },
    credentials: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [credentials, setCredentials] = useState<{ username: string; hash: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem("pastebin_user");
            const storedHash = localStorage.getItem("pastebin_hash");

            if (storedUser && storedHash) {
                // Verify credentials with server
                const { data, error } = await supabase.rpc('api_login', {
                    p_username: storedUser,
                    p_hash: storedHash
                });

                if (data === true) {
                    setUser({ username: storedUser });
                    setCredentials({ username: storedUser, hash: storedHash });
                } else {
                    // Invalid credentials, clear them
                    localStorage.removeItem("pastebin_user");
                    localStorage.removeItem("pastebin_hash");
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username: string, hash: string) => {
        const { data, error } = await supabase.rpc('api_login', {
            p_username: username,
            p_hash: hash
        });

        if (error) {
            console.error("Login RPC Error:", error);
        }

        if (data === true) {
            setUser({ username });
            setCredentials({ username, hash });
            localStorage.setItem("pastebin_user", username);
            localStorage.setItem("pastebin_hash", hash);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setCredentials(null);
        localStorage.removeItem("pastebin_user");
        localStorage.removeItem("pastebin_hash");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, credentials }}>
            {children}
        </AuthContext.Provider>
    );
}
