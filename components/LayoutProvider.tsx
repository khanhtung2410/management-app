"use client"

import { createContext, useContext, useState, type ReactNode } from "react";

type LayoutContextType = {
    sidebarOpen: boolean;
    mobileOpen: boolean;
    toggleSidebar: () => void;
    openMobile: () => void;
    closeMobile: () => void;
    toggleMobile: () => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);
type LayoutProviderProps = { children: ReactNode }
export function LayoutProvider({ children }: LayoutProviderProps) {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const openMobile = () => setMobileOpen(true);
    const closeMobile = () => setMobileOpen(false);
    const toggleMobile = () => setMobileOpen(prev => !prev);

    return (
        <LayoutContext.Provider
            value={{
                sidebarOpen, mobileOpen, toggleSidebar, openMobile, closeMobile, toggleMobile
            }}>
            {children}
        </LayoutContext.Provider>
    );
}
export function useLayout():LayoutContextType {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}