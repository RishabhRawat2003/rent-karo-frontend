"use client";
import { LoadingSpinnerWithOverlay } from '@/components/Loading';
import CommonModal from '@/components/popup/CommonModal';
import { userDetails } from '@/store/userSlice';
import { decodeToken } from '@/utils/decodeToken';
import { TOKEN } from '@/utils/enum';
import { convertUTCtoIST2 } from '@/utils/timeConvertor';
import {
    ShoppingCart, Heart, FileText, HelpCircle, LogOut, AlertCircle, Wallet, Package, Building, LayoutGrid,
    Edit, BarChart, ShoppingBag, PackageX, Sofa, FileBarChart, Bell, Settings, User, ChevronRight,
    TrendingUp, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    stats: {
        totalOrders: number;
        totalWishlist: number;
        activeRentals: number;
    }
}

export default function DashboardPage() {
    const [logoutModal, setLogoutModal] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter()
    const dispatch = useDispatch()

    function handleLogout() {
        toast.success("Logged out successfully")
        localStorage.removeItem(TOKEN)
        router.push("/")
    }

    async function getUserDetails() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await dispatch(userDetails() as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            setUser(response.payload.user)
            setIsLoading(false)
        }
    }

    function handleRoute(route: string) {
        router.push(route)
    }

    const renterItems = [
        {
            id: 1,
            name: "My Listings",
            icon: <LayoutGrid size={24} />,
            onClick: () => handleRoute("/pages/account/my-listing"),
            description: "Manage your property listings",
            category: "Business"
        },
        {
            id: 2,
            name: "Create Organization",
            icon: <Building size={24} />,
            onClick: () => handleRoute("/pages/account/organisation"),
            description: "Set up your business profile",
            category: "Business"
        },
        {
            id: 4,
            name: "Analytics",
            icon: <BarChart size={24} />,
            onClick: () => alert("Statistics"),
            description: "View performance metrics",
            category: "Business"
        },
        {
            id: 5,
            name: "KYC Verification",
            icon: <AlertCircle size={24} />,
            onClick: () => handleRoute("/pages/account/kyc"),
            description: "Complete identity verification",
            category: "Account"
        },
        {
            id: 7,
            name: "Orders",
            icon: <ShoppingBag size={24} />,
            onClick: () => alert("Orders"),
            description: "Track your sales",
            category: "Business"
        },
        {
            id: 8,
            name: "Invoices",
            icon: <FileText size={24} />,
            onClick: () => alert("Invoices"),
            description: "Manage billing documents",
            category: "Finance"
        },
        {
            id: 9,
            name: "Inventory",
            icon: <PackageX size={24} />,
            onClick: () => alert("Sold Out Items"),
            description: "Monitor stock levels",
            category: "Business"
        },
        {
            id: 10,
            name: "Rental Items",
            icon: <Sofa size={24} />,
            onClick: () => alert("Rental Items"),
            description: "Manage rental properties",
            category: "Business"
        },
        {
            id: 11,
            name: "Reports",
            icon: <FileBarChart size={24} />,
            onClick: () => alert("Reports"),
            description: "Generate business reports",
            category: "Finance"
        },
        {
            id: 6,
            name: "Support",
            icon: <HelpCircle size={24} />,
            onClick: () => alert("Help & Support"),
            description: "Get help and assistance",
            category: "Account"
        },
    ];

    const buyerItems = [
        {
            id: 3,
            name: "My Orders",
            icon: <ShoppingCart size={24} />,
            onClick: () => handleRoute("/pages/account/orders"),
            description: "Track your purchases",
            category: "Shopping"
        },
        {
            id: 4,
            name: "Wishlist",
            icon: <Heart size={24} />,
            onClick: () => alert("Wishlist"),
            description: "Your saved items",
            category: "Shopping"
        },
        {
            id: 5,
            name: "Invoices",
            icon: <FileText size={24} />,
            onClick: () => alert("Invoices"),
            description: "View billing documents",
            category: "Finance"
        },
        {
            id: 8,
            name: "KYC Verification",
            icon: <AlertCircle size={24} />,
            onClick: () => handleRoute("/pages/account/kyc"),
            description: "Complete verification",
            category: "Account"
        },
        {
            id: 6,
            name: "Payments",
            icon: <Wallet size={24} />,
            onClick: () => alert("Payments"),
            description: "Manage payment methods",
            category: "Finance"
        },
        {
            id: 7,
            name: "Support",
            icon: <HelpCircle size={24} />,
            onClick: () => alert("Help & Support"),
            description: "Get help and assistance",
            category: "Account"
        },
    ];

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem(TOKEN) || '{}');
        if (!token) {
            toast.error("Please login first")
            router.push("/")
        } else {
            const decodedToken = decodeToken(token);
            if (decodedToken?.role !== "renter" && decodedToken?.role !== "buyer") {
                toast.error("Please login first")
                router.push("/")
            } else {
                getUserDetails()
            }
        }
    }, [])

    if (isLoading) {
        return (
            <div className='w-full h-screen'>
                <LoadingSpinnerWithOverlay />
            </div>
        )
    }

    const groupedItems = (user?.role === 'renter' ? renterItems : buyerItems).reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof renterItems>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user?.fullName?.split(' ')[0]}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell size={20} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-32 translate-x-32"></div>

                    <div className="relative">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            {/* Avatar Section */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold text-white">
                                        {user?.fullName?.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border-2 border-white">
                                    <div className={`w-6 h-6 ${user?.role === 'renter' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-green-400 to-green-600'} rounded-full flex items-center justify-center`}>
                                        {user?.role === 'renter' ? (
                                            <Building size={12} className="text-white" />
                                        ) : (
                                            <User size={12} className="text-white" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.fullName}</h2>
                                        <p className="text-gray-600 font-medium mb-1">{user?.email}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user?.role === 'renter'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user?.role === 'renter' ? 'Business Owner' : 'Customer'}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={14} />
                                                Joined {convertUTCtoIST2(user?.createdAt as string)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => alert("Edit Profile")}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                        >
                                            <Edit size={16} />
                                            <span>Edit Profile</span>
                                        </button>
                                        <button
                                            onClick={() => alert("Raise Complaint")}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            <AlertCircle size={16} />
                                            <span>Support</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        {user?.role === 'buyer' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <StatCard
                                    icon={<ShoppingCart className="text-blue-600" size={24} />}
                                    label="Total Orders"
                                    value={user?.stats?.totalOrders || 0}
                                    color="blue"
                                    trend="+12%"
                                />
                                <StatCard
                                    icon={<Heart className="text-red-600" size={24} />}
                                    label="Wishlist Items"
                                    value={user?.stats?.totalWishlist || 0}
                                    color="red"
                                    trend="+5%"
                                />
                                <StatCard
                                    icon={<Package className="text-green-600" size={24} />}
                                    label="Active Rentals"
                                    value={user?.stats?.activeRentals || 0}
                                    color="green"
                                    trend="+8%"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Actions */}
                <div className="space-y-8">
                    {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category}>
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={item.onClick}
                                        className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 
                                                 flex flex-col items-start gap-4 border border-gray-100
                                                 hover:border-blue-200 hover:-translate-y-1"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="p-3 bg-gray-50 group-hover:bg-blue-50 rounded-xl transition-colors">
                                                <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
                                                    {item.icon}
                                                </span>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </div>

                                        <div className="text-left">
                                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors mb-1">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logout Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Need to step away?</p>
                            <p className="text-gray-700">Your data will be saved securely.</p>
                        </div>
                        <button
                            onClick={() => setLogoutModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white 
                                     rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {logoutModal && (
                <CommonModal
                    isOpen={logoutModal}
                    closeModal={() => setLogoutModal(false)}
                    title="Sign Out"
                    description="Are you sure you want to sign out of your account?"
                    onAccept={() => handleLogout()}
                    onCancel={() => setLogoutModal(false)}
                    type="warning"
                    acceptButtonText="Sign Out"
                    cancelButtonText="Cancel"
                />
            )}
        </div>
    );
}

const StatCard = ({ icon, label, value, color, trend }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    trend?: string;
}) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${color}-50`}>
                {icon}
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);
