// Cung cấp state đóng/mở sidebar và menu mobile cho shell admin; không dùng làm state provider chung cho toàn ứng dụng.
"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type LayoutContextType = {
    sidebarOpen: boolean;
    mobileOpen: boolean;
    toggleSidebar: () => void;
    openMobile: () => void;
    closeMobile: () => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);
type LayoutProviderProps = { children: ReactNode }
export function LayoutProvider({ children }: LayoutProviderProps) {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

       const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    const openMobile = useCallback(() => {
        setMobileOpen(true);
    }, []);

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
    }, []);

    const value = useMemo<LayoutContextType>(() => ({
        sidebarOpen,
        mobileOpen,
        toggleSidebar,
        openMobile,
        closeMobile,
    }), [sidebarOpen, mobileOpen, toggleSidebar, openMobile, closeMobile],
    );
    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}
export function useLayout(): LayoutContextType {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}