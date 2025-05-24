"use client";
import { useState } from 'react';
import AdminSidebar from "@/components/Admin/AdminSidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'
                }`}>
                {children}
            </div>
        </div>
    );
}