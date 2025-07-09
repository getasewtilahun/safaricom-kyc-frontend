import { useRouter } from "next/navigation";
import React from "react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    active?: string;
}

const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { label: "Onboarding", icon: "📋", path: "/dashboard" },
    { label: "View", icon: "👁️", path: "/dashboard" },
    { label: "Transactions", icon: "💳", path: "/transactions" },
];

export default function DashboardLayout({ children, active }: DashboardLayoutProps) {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#f5f6fa] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a2239] text-white flex flex-col min-h-screen">
                <div className="h-16 flex items-center justify-center font-bold text-base border-b border-white/10 tracking-wide overflow-hidden whitespace-nowrap text-ellipsis">
                    OP-PARTNER MANAGEMENT
                </div>
                <nav className="flex-1 py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <div
                            key={item.label}
                            className={`flex items-center gap-2 py-2 px-3 rounded hover:bg-[#183153] cursor-pointer ${active === item.label ? "bg-[#183153]" : ""}`}
                            onClick={() => router.push(item.path)}
                        >
                            <span>{item.icon}</span> {item.label}
                        </div>
                    ))}
                </nav>
            </aside>
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-white flex items-center justify-between px-8 shadow-sm">
                    <div></div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#43b02a] flex items-center justify-center text-white font-bold">
                            <span>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" strokeWidth="2" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex flex-col items-center justify-start py-8 px-4">
                    {children}
                </main>
            </div>
        </div>
    );
} 