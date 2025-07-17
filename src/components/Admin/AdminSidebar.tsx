"use client";
import { useEffect, useState } from 'react';
import {
    BarChart,
    Folder,
    ShoppingCart,
    Tag,
    Mail,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { ADMINTOKEN } from '@/utils/enum';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MyTokenPayload } from '@/utils/decodeToken';

interface AdminSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar = ({ isCollapsed, setIsCollapsed }: AdminSidebarProps) => {
    const [activeTab, setActiveTab] = useState('statistics');
    const router = useRouter();

    const menuItems = [
        { id: 'statistics', icon: BarChart, label: 'Statistics', link: '/admin-dashboard/statistics' },
        { id: 'all-products', icon: Folder, label: 'All Products', link: '/admin-dashboard/all-products' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders', link: '/admin-dashboard/all-orders' },
        { id: 'discount-coupon', icon: Tag, label: 'Discount Coupon', link: '/admin-dashboard/discount-coupon' },
        { id: 'mail-management', icon: Mail, label: 'Mail Management', link: '/admin-dashboard/mail-management' },
    ];

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem(ADMINTOKEN) || '{}');
        if (token) {
            const decodedToken: MyTokenPayload = jwtDecode(token);
            if (decodedToken.role !== 'admin') {
                router.push('/');
            }
        }
        else {
            router.push('/');
        }
    }, [])

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 z-50
        ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            <div className="flex flex-col h-full">
                {/* Collapse Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-4 hover:bg-gray-100 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-6 h-6" />
                    ) : (
                        <ChevronLeft className="w-6 h-6" />
                    )}
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-4">
                    <nav className="flex flex-col gap-1 px-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    href={item.link}
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
                    ${activeTab === item.id
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                                >
                                    <Icon className="w-6 h-6 flex-shrink-0" />
                                    {!isCollapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;